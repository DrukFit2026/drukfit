# DrukFit reminders and weekly emails

`.github/workflows/drukfit-notify.yml` runs `notify.js` every 15 minutes. It sends:

- phone reminders (workout, sleep, food, Daily Check, Monday weigh-in), only when something is still open, at most once per day each
- the Sunday email report and the emailed weekly backup, for members who turned them on

Each member sets their own reminders in DrukFit → Profile & Settings → Notifications.

**Secrets** (Settings → Secrets and variables → Actions):

| Name | Needed for |
|---|---|
| `DRUKFIT_JOB_SECRET` | Lets the job call DrukFit's reminder functions. Supabase keeps only its SHA-256 hash. |
| `VAPID_PRIVATE_KEY` | Signs phone notifications. The matching public key is in `config.json`. |
| `RESEND_API_KEY` | Optional. Without it, emails are skipped and phone reminders still work. |

Files:

- `engine.js` is the app's own planning engine, copied in at build time.
- `webpush.js` is standard Web Push encryption. It's tested against the RFC 8291 test vector and needs no packages.
- Logs contain only counts, never names, emails or health data.
