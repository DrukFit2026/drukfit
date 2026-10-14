#!/usr/bin/env node
// DrukFit scheduled job: phone reminders, the Sunday email report and the weekly emailed backup.
// Runs every 15 minutes on GitHub Actions (see .github/workflows/drukfit-notify.yml).
// Needs: DRUKFIT_JOB_SECRET and VAPID_PRIVATE_KEY (GitHub secrets). Optional: RESEND_API_KEY for emails.
// Privacy: logs only counts, never names, emails, user ids or health data (Actions logs can be public).
'use strict';
process.env.TZ = 'UTC';
const fs = require('fs'), path = require('path'), vm = require('vm');
const WP = require('./webpush');
const DIR = __dirname;
const CFG = JSON.parse(fs.readFileSync(process.env.DRUKFIT_NOTIFY_CONFIG || path.join(DIR, 'config.json'), 'utf8'));
const ENGINE_SRC = fs.readFileSync(path.join(DIR, 'engine.js'), 'utf8');

const DEFAULTS = { workout:'17:30', sleep:'08:30', food:'15:00', daily:'20:00', weighin:'07:30', weeklyEmail:false, backupEmail:false, emailTime:'18:00' };
const WINDOW_MIN = 180; // a reminder can still go out up to 3 hours late (GitHub's scheduler can run late), never earlier

/* ---------- time in the member's own time zone ---------- */
function localNow(tz, now){
  let parts;
  try { parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).formatToParts(now); }
  catch(e){ return localNow('Australia/Melbourne', now); }
  const g = t => +parts.find(p => p.type === t).value;
  const ms = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
  const d = new Date(ms);
  return { ms, date: d.toISOString().slice(0, 10), minutes: g('hour') * 60 + g('minute'), weekday: d.getUTCDay(), tz };
}
const hm = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
const inWindow = (time, minutes) => { const t = hm(time); return t != null && minutes >= t && minutes < t + WINDOW_MIN; };

/* ---------- the app's own engine, running "as if" on the member's phone ---------- */
function engineAt(localMs){
  const R = Date;
  class D extends R { constructor(...a){ if (a.length) super(...a); else super(localMs); } static now(){ return localMs; } }
  const ctx = { module:{ exports:{} }, console, Date: D, Math, JSON, Intl };
  vm.createContext(ctx); vm.runInContext(ENGINE_SRC, ctx); return ctx;
}
function buildState(docs){
  const S = { profile: docs.profile || null, settings: docs.settings || {}, plan: docs.plan || null, sched: docs.sched || {}, active: null,
    body: docs.body || { entries:[], photos:[] }, food:{}, habits:{}, daily:{}, dailycfg: docs.dailycfg || {}, reportsDoc: docs.reports || {}, sessions:[], custom:{}, bookmarks:{ items:{} } };
  Object.keys(docs).forEach(k => {
    const v = docs[k] || {};
    if (k.startsWith('sess-')) S.sessions.push(...(v.list || []));
    else if (k.startsWith('food-')) Object.assign(S.food, v.days || {});
    else if (k.startsWith('habit-')) Object.assign(S.habits, v.days || {});
    else if (k.startsWith('daily-')) Object.assign(S.daily, v.days || {});
  });
  S.sessions.sort((a, b) => a.start - b.start);
  return S;
}

/* ---------- what is due for one member right now ---------- */
function dueReminders(member, now){
  const S = buildState(member.docs || {}); if (!S.profile || !S.profile.onboarded || !S.plan) return { L: null, items: [] };
  const N = { ...DEFAULTS, ...((S.settings || {}).notify || {}) }; if (N.paused) return { L: null, items: [] };
  const tz = ((member.subs || [])[0] || {}).tz || N.tz || 'Australia/Melbourne';
  const L = localNow(tz, now); const E = engineAt(L.ms); const today = L.date; const out = [];
  const sent = new Set(member.sent || []); const fresh = kind => !sent.has(kind + ':' + today);
  if ((member.subs || []).length){
    if (fresh('workout') && inWindow(N.workout, L.minutes)){
      const tp = E.todayPlan(S); const done = tp && tp.done && tp.done.length;
      if (tp && tp.workoutId && !done){ const w = E.workoutById(S, tp.workoutId); if (w) out.push({ kind:'workout', title:`Today's workout: ${w.name}`, body:`${w.exercises.length} exercises, about ${E.estimateDuration(w)} min. Tap to start when you're ready.`, url:'#dashboard' }); }
    }
    if (fresh('sleep') && inWindow(N.sleep, L.minutes) && !((S.habits[today] || {}).sleep != null))
      out.push({ kind:'sleep', title:'How did you sleep?', body:'Log last night\'s sleep. It takes ten seconds and helps your recovery tracking.', url:'#dashboard' });
    if (fresh('food') && inWindow(N.food, L.minutes)){
      const T = E.nutritionTargets(S.profile); const fd = S.food[today] || {}; const n = (fd.entries || []).length; const p = (fd.entries || []).reduce((a, e) => a + (+e.p || 0), 0);
      if (T && n === 0) out.push({ kind:'food', title:'No meals logged yet today', body:`Log what you've eaten so far to keep your ${T.p} g protein target on track.`, url:'#nutrition' });
      else if (T && p < T.p * 0.5) out.push({ kind:'food', title:`${Math.round(p)} of ${T.p} g protein so far`, body:'A protein-rich snack this afternoon, like Greek yoghurt, a shake or eggs, would close part of the gap.', url:'#nutrition' });
    }
    if (fresh('daily') && inWindow(N.daily, L.minutes)){
      const dg = E.dailyGoals(S, today, member.user_id);
      if (dg.total && dg.done < dg.total){ const next = dg.goals.find(g => !g.done); out.push({ kind:'daily', title:`${dg.done} of ${dg.total} daily goals done`, body:`${next ? 'Still open: ' + next.label.toLowerCase() + '.' : ''}${dg.challenge && !dg.challenge.done ? ' Today\'s challenge: ' + dg.challenge.title + '.' : ''} Every bit counts.`.trim(), url:'#daily' }); }
    }
    if (fresh('weighin') && L.weekday === 1 && inWindow(N.weighin, L.minutes)){
      const last = E.bodySeries(S, 'weight').slice(-1)[0];
      if (!last || E.daysBetween(last.date, today) >= 6) out.push({ kind:'weighin', title:'Weekly weigh-in', body:'Weigh in before breakfast for the most consistent trend.', url:'#progress' });
    }
  }
  if ((N.weeklyEmail || N.backupEmail) && member.email && L.weekday === 0 && fresh('email-week') && L.minutes >= hm(N.emailTime) && L.minutes < 24 * 60)
    out.push({ kind:'email-week', email:true, report: !!N.weeklyEmail, backup: !!N.backupEmail });
  return { L, E, S, items: out };
}

/* ---------- weekly email ---------- */
const escH = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
function weeklyEmail(E, S, today, opts){
  const name = ((S.profile || {}).name || '').split(' ')[0];
  const wr = E.weeklyReport(S, today); const T = E.nutritionTargets(S.profile);
  const lines = []; const html = [];
  const p = (t, style) => `<p style="margin:0 0 12px;${style || ''}">${t}</p>`;
  html.push(`<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#141a21;line-height:1.5">`);
  html.push(`<div style="background:#12161c;color:#eef1f4;border-radius:16px;padding:22px 22px 18px;margin-bottom:18px"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#f5b83d;font-weight:700">DrukFit · week of ${escH(new Date(wr.ws + 'T00:00:00Z').toLocaleDateString('en-AU', { day:'numeric', month:'long', timeZone:'UTC' }))}</div><div style="font-size:24px;font-weight:700;margin-top:6px">${name ? escH(name) + ', here' : 'Here'}'s your week</div></div>`);
  if (opts.report){
    const stats = [['Workouts', `${wr.done} of ${wr.target}`], ['Volume', `${Math.round(wr.volume).toLocaleString('en-AU')} kg`], ['Avg sleep', wr.sleep != null ? `${Math.round(wr.sleep * 10) / 10} h` : 'not logged'], ['Avg protein', wr.nutr && wr.nutr.avgP != null ? `${wr.nutr.avgP} g${T ? ' of ' + T.p : ''}` : 'not logged']];
    html.push(`<table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:16px"><tr>${stats.map(([k, v]) => `<td style="padding:10px;border:1px solid #d9dee5;border-radius:10px;text-align:center"><div style="font-size:11px;color:#56616d;text-transform:uppercase;letter-spacing:.08em">${k}</div><div style="font-size:16px;font-weight:700">${escH(v)}</div></td>`).join('')}</tr></table>`);
    stats.forEach(([k, v]) => lines.push(`${k}: ${v}`));
    if (wr.recorded.length){ html.push(`<h3 style="font-size:15px;margin:16px 0 6px">What you recorded</h3><ul style="margin:0 0 12px;padding-left:18px">${wr.recorded.map(x => `<li>${escH(x)}</li>`).join('')}</ul>`); lines.push('', 'What you recorded:', ...wr.recorded.map(x => '- ' + x)); }
    if (wr.concerns.length){ html.push(`<h3 style="font-size:15px;margin:16px 0 6px">Worth a look</h3><ul style="margin:0 0 12px;padding-left:18px">${wr.concerns.map(x => `<li>${escH(x)}</li>`).join('')}</ul>`); lines.push('', 'Worth a look:', ...wr.concerns.map(x => '- ' + x)); }
    html.push(`<h3 style="font-size:15px;margin:16px 0 6px">Next week</h3><ol style="margin:0 0 12px;padding-left:18px">${wr.recs.map(x => `<li>${escH(x)}</li>`).join('')}</ol>`); lines.push('', 'Next week:', ...wr.recs.map((x, i) => `${i + 1}. ${x}`));
    html.push(p(`<a href="${CFG.appUrl}#reports" style="display:inline-block;background:#f5b83d;color:#1d1503;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:10px">Open your full report</a>`));
    lines.push('', 'Full report: ' + CFG.appUrl + '#reports');
  }
  if (opts.backup){
    html.push(p(`<b>Your backup is attached.</b> It holds your workouts, food, measurements and settings (photos aren't included). To restore it, open DrukFit → Profile & Settings → Import a backup.`, 'background:#eceff3;border-radius:10px;padding:12px'));
    lines.push('', 'Your backup is attached (photos not included). Restore it from Profile & Settings → Import a backup.');
  }
  html.push(p(`You're getting this because you turned it on in DrukFit → Profile & Settings → Notifications. Turn it off there at any time.`, 'font-size:12px;color:#56616d'));
  html.push(p('General fitness guidance, not medical advice.', 'font-size:12px;color:#56616d'));
  html.push('</div>');
  lines.push('', 'Turn these emails off in DrukFit → Profile & Settings → Notifications.');
  return { subject: opts.report ? `Your DrukFit week: ${wr.done} of ${wr.target} workouts` : 'Your weekly DrukFit backup', html: html.join(''), text: lines.join('\n') };
}

/* ---------- Supabase job functions (gated by the job secret) ---------- */
function api(env, fetchImpl){
  const f = fetchImpl || fetch;
  return async (fn, args) => {
    const res = await f(`${CFG.supabaseUrl}/rest/v1/rpc/${fn}`, { method:'POST', headers:{ apikey: CFG.supabaseKey, 'Content-Type':'application/json' }, body: JSON.stringify({ p_secret: env.DRUKFIT_JOB_SECRET, ...args }) });
    const txt = await res.text(); if (!res.ok) throw new Error(`${fn} failed (HTTP ${res.status})`);
    return txt ? JSON.parse(txt) : null;
  };
}

async function run(opts){
  opts = opts || {}; const env = opts.env || process.env; const now = opts.now || new Date(); const f = opts.fetch || fetch;
  const rpc = api(env, f); const stats = { members:0, pushSent:0, pushFailed:0, removed:0, emails:0, emailSkipped:0, errors:0 };
  if (!env.DRUKFIT_JOB_SECRET || !env.VAPID_PRIVATE_KEY){ console.log('Waiting for setup: add the DRUKFIT_JOB_SECRET and VAPID_PRIVATE_KEY secrets. Nothing sent.'); stats.notReady = true; return stats; }
  const vapid = { publicKey: CFG.vapidPublicKey, privateKey: env.VAPID_PRIVATE_KEY, subject: CFG.vapidSubject };
  let members;
  try { members = await rpc('notify_batch', {}); }
  catch(e){ if (/HTTP 404/.test(e.message)){ console.log('Reminder tables are not set up in Supabase yet (run migration 002). Nothing sent.'); stats.notReady = true; return stats; } throw e; }
  for (const m of members){
    stats.members++;
    try {
      const { L, E, S, items } = dueReminders(m, now);
      for (const it of items){
        if (it.email){
          if (!env.RESEND_API_KEY){ stats.emailSkipped++; continue; }
          if (!(await rpc('notify_claim', { p_user: m.user_id, p_kind: it.kind, p_day: L.date }))) continue;
          const mail = weeklyEmail(E, S, L.date, it);
          const attachments = [];
          if (it.backup){ const docs = await rpc('notify_backup', { p_user: m.user_id }); attachments.push({ filename:`drukfit-backup-${L.date}.json`, content: Buffer.from(JSON.stringify({ app:'drukfit', version:1, exportedAt: now.toISOString(), docs }, null, 1)).toString('base64') }); }
          const res = await f('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:'Bearer ' + env.RESEND_API_KEY, 'Content-Type':'application/json' },
            body: JSON.stringify({ from: CFG.emailFrom, to:[m.email], subject: mail.subject, html: mail.html, text: mail.text, attachments }) });
          if (res.ok) stats.emails++; else { stats.errors++; console.log(`email not sent (HTTP ${res.status})`); }
          continue;
        }
        if (!(await rpc('notify_claim', { p_user: m.user_id, p_kind: it.kind, p_day: L.date }))) continue;
        for (const sub of m.subs){
          try {
            const r = await WP.send(sub, { title: it.title, body: it.body, url: it.url, tag: 'drukfit-' + it.kind }, vapid, f);
            if (r.ok){ stats.pushSent++; await rpc('notify_result', { p_endpoint: sub.endpoint, p_gone: false }); }
            else if (r.gone){ stats.removed++; await rpc('notify_result', { p_endpoint: sub.endpoint, p_gone: true }); }
            else { stats.pushFailed++; console.log(`push not delivered (HTTP ${r.status})`); }
          } catch(e){ stats.pushFailed++; console.log('push error: ' + e.message); }
        }
      }
    } catch(e){ stats.errors++; console.log('member skipped: ' + e.message); }
  }
  return stats;
}
module.exports = { run, dueReminders, weeklyEmail, localNow, buildState, inWindow };
if (require.main === module) run().then(s => console.log(JSON.stringify(s))).catch(e => { console.error(e.message); process.exit(1); });
