#!/usr/bin/env python3
"""DrukFit Daily content ingestion (Python standard library only).

Runs on a schedule (GitHub Actions, twice a day). For each enabled source in content/sources.json it:
  - fetches new articles from the source's official API or RSS feed (with retries, timeouts and a polite delay)
  - keeps only metadata, a short attributed quote and an ORIGINAL templated summary (never full text)
  - verifies the original link (DOI resolver or a successful page fetch) and the publication date
  - categorises it, flags study limitations found in the abstract, and de-duplicates
then merges with previously published items, applies the admin overrides (content/overrides.json),
adds hand-checked evergreen items (content/evergreen.json) and writes feed.json.

If a source fails, previously verified items are kept and the error is recorded in feed.json["log"].
No API keys are needed. Nothing personal is sent anywhere: requests contain only search terms.
"""
import json, os, re, sys, time, hashlib, html, datetime, urllib.request, urllib.parse, urllib.error
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'content')
UA = 'DrukFitDaily/1.0 (+https://drukfit.app; content refresh bot)'

def now_utc():
    return datetime.datetime.now(datetime.timezone.utc)

# --------------------------------------------------------------------------- HTTP
class Fetcher:
    """Real network access. Tests replace this with a fake."""
    def __init__(self, settings):
        self.timeout = settings.get('timeout_seconds', 25); self.retries = settings.get('retries', 3); self.delay = settings.get('request_delay_seconds', 1.0)
        self.calls = 0
    def get(self, url, accept='*/*'):
        last = None
        for attempt in range(self.retries):
            if self.calls: time.sleep(self.delay)
            self.calls += 1
            try:
                req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': accept})
                with urllib.request.urlopen(req, timeout=self.timeout) as r:
                    return r.status, r.read().decode('utf-8', 'replace')
            except urllib.error.HTTPError as e:
                if e.code in (404, 410, 400): return e.code, ''
                last = f'HTTP {e.code}'
            except Exception as e:
                last = f'{type(e).__name__}: {e}'
            time.sleep(min(30, 2 ** attempt * 2))
        raise IOError(last or 'request failed')

# --------------------------------------------------------------------------- text helpers
def strip_html(s):
    s = re.sub(r'<[^>]+>', ' ', s or ''); s = html.unescape(s); return re.sub(r'\s+', ' ', s).strip()
def words(s, n):
    w = s.split(); return ' '.join(w[:n]) + ('…' if len(w) > n else '')
def norm_title(t):
    return re.sub(r'[^a-z0-9]+', '', (t or '').lower())[:120]
def sid(prefix, value):
    return prefix + '-' + hashlib.sha1(value.encode()).hexdigest()[:12]
def parse_date(s):
    s = (s or '').strip()
    for fmt in ('%Y-%m-%d', '%a, %d %b %Y %H:%M:%S %z', '%a, %d %b %Y %H:%M:%S %Z', '%b %d, %Y', '%B %d, %Y', '%Y-%m-%dT%H:%M:%S%z', '%Y-%m-%dT%H:%M:%SZ'):
        try: return datetime.datetime.strptime(s, fmt).date().isoformat()
        except ValueError: pass
    return None
def date_ok(d):
    if not d: return False
    try: x = datetime.date.fromisoformat(d)
    except ValueError: return False
    return datetime.date(2000, 1, 1) <= x <= (now_utc().date() + datetime.timedelta(days=1))

# --------------------------------------------------------------------------- research helpers
STUDY_TYPES = [('Meta-Analysis', 'meta-analysis'), ('Systematic Review', 'systematic review'), ('Randomized Controlled Trial', 'randomised controlled trial'),
               ('Clinical Trial', 'clinical trial'), ('Review', 'review'), ('Observational Study', 'observational study')]
def study_type(pub_types, abstract):
    pts = [p.lower() for p in pub_types]
    for key, label in STUDY_TYPES:
        if key.lower() in pts: return label
    a = abstract.lower()
    if 'meta-analysis' in a: return 'meta-analysis'
    if 'randomized' in a or 'randomised' in a: return 'randomised trial'
    if 'cross-sectional' in a or 'cohort' in a: return 'observational study'
    return 'study'
def sample_size(abstract):
    m = re.findall(r'\b[nN]\s?=\s?(\d{1,5})\b', abstract)
    if m: return max(int(x) for x in m)
    m = re.search(r'\b(\d{1,4})\s+(?:healthy\s+|trained\s+|untrained\s+|older\s+|young\s+|recreationally[- ]active\s+|resistance[- ]trained\s+)?(?:participants|adults|men|women|subjects|volunteers|athletes|individuals|people)\b', abstract)
    return int(m.group(1)) if m else None
def limitations(abstract, stype, n):
    a = abstract.lower(); out = []
    if re.search(r'\b(mice|mouse|rats?|murine|rodents?|porcine|canine)\b', a): out.append('Animal study: results may not apply to people.')
    if re.search(r'\b(in vitro|cell culture|cultured cells)\b', a): out.append('Lab (cell) study: an early step, far from real-world training.')
    if n is not None and n < 30 and 'meta' not in stype and 'review' not in stype: out.append(f'Small study ({n} participants): results may not generalise.')
    if re.search(r'\b(pilot|feasibility|preliminary|exploratory)\b', a): out.append('Preliminary or pilot findings: needs confirming in larger studies.')
    if 'observational' in stype or re.search(r'\b(cross-sectional|cohort study|associated with|association between)\b', a): out.append('Shows an association, not proof of cause and effect.')
    if 'meta' in stype or 'review' in stype: out.append('Pools earlier studies: it is only as strong as the studies it includes.')
    if not out: out.append('A single study: one result is a data point, not a final answer.')
    return out
def conclusion_quote(abstract):
    a = strip_html(abstract)
    m = re.search(r'(?:conclusions?|in conclusion|practical applications)\s*[:.]?\s*(.+)$', a, re.I)
    text = m.group(1) if m else ''
    if not text:
        sents = re.split(r'(?<=[.!?])\s+', a); text = sents[-1] if sents else ''
    return words(text.strip(), 40)
WHY = {
    'strength': 'Research like this shapes how training plans balance load, sets and reps.',
    'technique': 'Technique details decide how much of each rep your target muscles actually do.',
    'research': 'New training research is how coaching advice gets refined over time.',
    'nutrition': 'What and how much you eat changes how well you adapt to training.',
    'recovery': 'Recovery is when the adaptations from training actually happen.',
    'tech': 'Tracking tools only help if what they measure is accurate and useful.',
    'motivation': 'Staying consistent for months matters more than any single workout.',
    'beginner': 'Clear basics make every later step easier and safer.',
}

# --------------------------------------------------------------------------- sources
def europepmc(src, fetch, settings, log):
    to = now_utc().date(); frm = to - datetime.timedelta(days=settings.get('research_window_days', 120))
    q = (f'({src["query"]}) AND (PUB_TYPE:"randomized controlled trial" OR PUB_TYPE:"meta-analysis" OR PUB_TYPE:"systematic review" OR PUB_TYPE:"review") '
         f'AND HAS_ABSTRACT:y AND LANG:eng AND SRC:MED AND FIRST_PDATE:[{frm.isoformat()} TO {to.isoformat()}]')
    url = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?' + urllib.parse.urlencode({'query': q, 'format': 'json', 'resultType': 'core', 'pageSize': settings.get('per_query', 6)})
    status, body = fetch.get(url, 'application/json')
    if status != 200: raise IOError(f'Europe PMC returned HTTP {status}')
    data = json.loads(body); out = []
    for r in (data.get('resultList') or {}).get('result', []):
        title = strip_html(r.get('title', '')).rstrip('.'); abstract = strip_html(r.get('abstractText', ''))
        pub = parse_date(r.get('firstPublicationDate', '')); doi = (r.get('doi') or '').strip(); pmid = (r.get('pmid') or '').strip()
        journal = ((r.get('journalInfo') or {}).get('journal') or {}).get('title') or r.get('journalTitle') or ''
        if not title or not abstract or not date_ok(pub) or not (doi or pmid): log.append(f'{src["id"]}: skipped a record with missing title/abstract/date/identifier'); continue
        types = ((r.get('pubTypeList') or {}).get('pubType')) or []
        stype = study_type(types, abstract); n = sample_size(abstract)
        summary = f'A {stype} published in {journal or "a peer-reviewed journal"}' + (f' involving {n} participants' if n and 'meta' not in stype and 'review' not in stype else '') + f' looked at: {title[0].lower() + title[1:] if title else ""}.'
        out.append({
            'id': 'doi-' + re.sub(r'[^a-z0-9]+', '-', doi.lower()).strip('-') if doi else 'pmid-' + pmid,
            'kind': 'research', 'category': src['category'], 'title': title,
            'source': journal or 'Peer-reviewed journal', 'source_title': title, 'via': 'Europe PMC',
            'authors': (r.get('authorString') or '')[:120], 'study_type': stype, 'participants': n,
            'url': f'https://doi.org/{doi}' if doi else f'https://europepmc.org/article/MED/{pmid}',
            'record_url': f'https://europepmc.org/article/MED/{pmid}' if pmid else None, 'doi': doi or None, 'pmid': pmid or None,
            'published': pub, 'summary': summary, 'quote': conclusion_quote(r.get('abstractText', '')), 'quote_from': 'the study\'s abstract',
            'limitations': limitations(abstract, stype, n), 'why': WHY.get(src['category'], ''), 'open_access': r.get('isOpenAccess') == 'Y',
            '_verify': ('doi', doi) if doi else ('url', f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:{pmid}%20AND%20SRC:MED&format=json'),
        })
    return out

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.meta = {}; self.title = ''; self._in_title = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'meta':
            k = a.get('property') or a.get('name')
            if k and a.get('content'): self.meta[k.lower()] = a['content']
        if tag == 'title': self._in_title = True
    def handle_endtag(self, tag):
        if tag == 'title': self._in_title = False
    def handle_data(self, data):
        if self._in_title: self.title += data

FITNESS_WORDS = re.compile(r'exercis|physical activit|fitness|muscle|strength|sleep|diet|nutrition|eating|\bfood|weight|heart|walk|active|bone|injur|stretch|protein|hydrat|posture|balance|aging well', re.I)
def nih_category(text):
    t = text.lower()
    if re.search(r'sleep|rest|recover', t): return 'recovery'
    if re.search(r'diet|food|eating|nutrition|protein|hydrat|meal', t): return 'nutrition'
    if re.search(r'motivat|habit|stick with|goal', t): return 'motivation'
    return 'beginner'
def nih_news_in_health(src, fetch, settings, log):
    status, body = fetch.get(src['url'], 'application/rss+xml, application/xml')
    if status != 200: raise IOError(f'RSS returned HTTP {status}')
    root = ET.fromstring(body.encode('utf-8')); out = []
    issues = root.findall('./channel/item')[:2]
    for it in issues:
        issue_url = (it.findtext('link') or '').strip(); issue_date = parse_date(it.findtext('pubDate') or '')
        if not issue_url.startswith('https://newsinhealth.nih.gov/'): continue
        st, page = fetch.get(issue_url, 'text/html')
        if st != 200: log.append(f'{src["id"]}: issue page unavailable ({st}) {issue_url}'); continue
        p = LinkParser(); p.feed(page)
        prefix = re.sub(r'^https://newsinhealth\.nih\.gov', '', issue_url).rstrip('/') + '/'
        arts = []
        for h in p.links:
            path = re.sub(r'^https://newsinhealth\.nih\.gov', '', h)
            if path.startswith(prefix) and len(path) > len(prefix) + 2 and path not in arts: arts.append(path)
        for path in arts[:8]:
            url = 'https://newsinhealth.nih.gov' + path
            st2, apage = fetch.get(url, 'text/html')
            if st2 != 200: log.append(f'{src["id"]}: article unavailable ({st2}) {url}'); continue
            ap = LinkParser(); ap.feed(apage)
            title = strip_html(ap.meta.get('og:title') or ap.title).split('|')[0].strip()
            desc = strip_html(ap.meta.get('og:description') or ap.meta.get('description') or '')
            if not title or not FITNESS_WORDS.search(title + ' ' + desc): continue
            month = datetime.date.fromisoformat(issue_date).strftime('%B %Y') if issue_date else 'a recent'
            out.append({ 'id': sid('nih', url), 'kind': 'news', 'category': nih_category(title + ' ' + desc), 'title': title,
                'source': 'NIH News in Health', 'source_title': title, 'url': url, 'published': issue_date,
                'summary': f'NIH News in Health, the National Institutes of Health\'s monthly newsletter, covers "{title}" in its {month} issue.',
                'quote': words(desc, 40) if desc else '', 'quote_from': 'NIH News in Health', 'why': WHY.get(nih_category(title + ' ' + desc), ''),
                '_verify': ('fetched', url) })
    return out

SOURCE_TYPES = { 'europepmc': europepmc, 'nih_news_in_health': nih_news_in_health }

def verify(item, fetch):
    kind, val = item.get('_verify', ('none', None))
    if kind == 'fetched': return True
    if kind == 'doi':
        st, body = fetch.get('https://doi.org/api/handles/' + urllib.parse.quote(val), 'application/json')
        try: return st == 200 and json.loads(body).get('responseCode') == 1
        except ValueError: return False
    if kind == 'url':
        st, _ = fetch.get(val); return st == 200
    return False

# --------------------------------------------------------------------------- main
def load_json(path, default):
    try:
        with open(path) as f: return json.load(f)
    except (OSError, ValueError): return default

def run(root=ROOT, fetch=None, now=None):
    content = os.path.join(root, 'content')
    cfg = load_json(os.path.join(content, 'sources.json'), {'sources': [], 'settings': {}}); settings = cfg.get('settings', {})
    overrides = load_json(os.path.join(content, 'overrides.json'), {}); evergreen = load_json(os.path.join(content, 'evergreen.json'), {'items': []})
    prev = load_json(os.path.join(root, 'feed.json'), {'items': [], 'log': [], 'sources': {}})
    fetch = fetch or Fetcher(settings); stamp = (now or now_utc()).strftime('%Y-%m-%dT%H:%M:%SZ')
    items = {i['id']: i for i in prev.get('items', []) if not i.get('evergreen') and not i.get('manual')}
    titles = {norm_title(i['title']): i['id'] for i in items.values()}
    run_log = {'at': stamp, 'sources': {}, 'added': 0, 'notes': []}
    source_state = prev.get('sources', {})
    for src in cfg.get('sources', []):
        st = {'name': src.get('name'), 'category': src.get('category'), 'enabled': src.get('enabled', True)}
        if not src.get('enabled', True): st.update(status='disabled'); run_log['sources'][src['id']] = 'disabled'; source_state[src['id']] = {**source_state.get(src['id'], {}), **st}; continue
        notes = []
        try:
            found = SOURCE_TYPES[src['type']](src, fetch, settings, notes)
            added = 0
            for it in found:
                nt = norm_title(it['title'])
                if it['id'] in items or nt in titles: continue          # duplicate (same id, or same headline from another source)
                try: ok = verify(it, fetch)
                except IOError as e: notes.append(f'{src["id"]}: could not verify {it["url"]} ({e}); will retry next run'); continue
                if not ok: notes.append(f'{src["id"]}: dropped broken or unverifiable link {it["url"]}'); continue
                it.pop('_verify', None); it['imported'] = stamp[:10]; it['link_checked'] = stamp[:10]; it['status'] = 'auto-checked'
                items[it['id']] = it; titles[nt] = it['id']; added += 1
            st.update(status='ok', last_success=stamp, last_found=len(found), last_added=added)
            run_log['sources'][src['id']] = f'ok: {len(found)} found, {added} new'; run_log['added'] += added
        except Exception as e:  # keep previously verified content; record the problem
            st.update(status='error', last_error=f'{type(e).__name__}: {e}'[:300], last_error_at=stamp)
            run_log['sources'][src['id']] = 'error: ' + st['last_error']
        run_log['notes'] += notes[:20]
        source_state[src['id']] = {**source_state.get(src['id'], {}), **st}
    # retention: drop very old research, cap size (newest first)
    max_age = settings.get('max_research_age_days', 400); today = (now or now_utc()).date()
    kept = [i for i in items.values() if not (i.get('kind') == 'research' and i.get('published') and (today - datetime.date.fromisoformat(i['published'])).days > max_age)]
    kept.sort(key=lambda i: i.get('published') or '', reverse=True); kept = kept[: settings.get('max_items', 150)]
    # evergreen (hand-checked) + manual (admin-published) items
    for e in evergreen.get('items', []):
        kept.append({**e, 'evergreen': True, 'status': 'reviewed', 'reviewed': True})
    for m in overrides.get('manual', []):
        req = ['id', 'title', 'url', 'source', 'category', 'kind', 'summary']
        if all(m.get(k) for k in req) and str(m['url']).startswith('https://'): kept.append({**m, 'manual': True, 'status': 'reviewed', 'reviewed': True})
        else: run_log['notes'].append(f'manual item {m.get("id")} skipped: needs {", ".join(k for k in req if not m.get(k))} and an https url')
    hidden = set(overrides.get('hide', [])); reviewed = set(overrides.get('reviewed', [])); notes_map = overrides.get('notes', {})
    final = []
    for i in kept:
        if i['id'] in hidden: continue
        if i['id'] in reviewed: i = {**i, 'reviewed': True, 'status': 'reviewed'}
        if i['id'] in notes_map: i = {**i, 'editor_note': notes_map[i['id']]}
        final.append(i)
    ok_any = any(v.startswith('ok') for v in run_log['sources'].values())
    feed = {
        'version': 1, 'generated': stamp if ok_any else prev.get('generated', stamp), 'checked': stamp,
        'last_run_ok': all(not v.startswith('error') for v in run_log['sources'].values()),
        'sources': source_state, 'items': final,
        'log': ([run_log] + prev.get('log', []))[:30],
        'disclaimer': 'General educational content, not individual medical advice. Summaries are written by DrukFit from each source\'s metadata; quotes are attributed. Always read the original source.',
    }
    with open(os.path.join(root, 'feed.json'), 'w') as f: json.dump(feed, f, indent=1, ensure_ascii=False)
    return feed

if __name__ == '__main__':
    f = run()
    print(json.dumps({'items': len(f['items']), 'run': f['log'][0]}, indent=1))
