# DrukFit Daily: content admin

Members never see these controls. Only people with write access to this GitHub repository can change them.
Every change takes effect at the next refresh, or straight away if you run the workflow by hand
(**Actions → DrukFit Daily content → Run workflow**).

| I want to… | Do this |
|---|---|
| Turn a source on or off | In `sources.json`, set `"enabled": false` (or `true`) on that source. |
| Review fetched articles and see errors | Open `feed.json` (in the repository root). `items` holds every published article; `sources` shows each source's status and last error; `log` has the last 30 runs with notes on skipped, duplicate or broken links. |
| Hide an incorrect or outdated article | Add its `id` to `"hide"` in `overrides.json`. |
| Mark an article as reviewed | Add its `id` to `"reviewed"`. It then shows a "Reviewed by DrukFit" label. |
| Add an editor's note | Add `"<id>": "Your note"` to `"notes"`. |
| Publish a verified article by hand | Add an entry to `"manual"` with `id`, `kind` (`guidance`, `news`, `research`, `editorial` or `motivation`), `category`, `title`, `source`, `url` (must be https), `summary`, and optionally `published`, `why` and `limitations`. |
| Add established guidance | Add an item to `evergreen.json`. Only add items you've opened and checked yourself, and set `checked_on` to that date. |
| Change the refresh times | Edit the two `cron` lines in `.github/workflows/drukfit-daily.yml`. They are in UTC: 20:00 UTC is about 7am in Melbourne and 08:00 UTC is about 7pm. |

Duplicates are removed automatically, matching both the article ID (DOI or PubMed ID) and the headline.
Links are checked before an article is published: DOIs through the doi.org resolver, and pages by loading them.
If a source fails, the articles it published before stay up and the error is recorded in `feed.json`.
Illustrations are drawn by the app itself, so no third-party images are downloaded or republished.
No API keys or secrets are needed.
