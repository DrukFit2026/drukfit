DrukFit: installable web app (PWA)
=====================================

This folder is the complete DrukFit app as a Progressive Web App:
index.html, manifest.webmanifest, sw.js (offline support), icons/ (Home Screen
icon and iPhone launch screens) and _headers (cache rules for Netlify or
Cloudflare Pages).

Two ways to use DrukFit
-----------------------
1. The Claude page (no hosting). Your data saves privately to your Claude
   account, and the AI Coach uses your Claude account. It opens inside Claude,
   so it can't work offline the way a true app does, and it can't print or use
   the iPhone share sheet. PDFs are saved to Files instead.
2. This PWA (needs any HTTPS static host). It works fully offline, opens
   standalone with its own icon and launch screen, and can print and share
   PDFs. Its data lives on your iPhone only, with no cloud sync. Back it up
   from Profile & Settings > Export. The AI Coach uses its built-in rules here,
   because Claude access only exists on the Claude page.

To move data between them: Profile & Settings > Export on one, then Import on
the other.

Deploy (pick one; all serve over HTTPS)
---------------------------------------
- Netlify Drop: open app.netlify.com/drop on a computer and drag this folder
  (or the zip) onto the page. You get a https://<name>.netlify.app address.
- Cloudflare Pages: create a project and upload this folder ("Direct upload").
- GitHub Pages: put these files in a repository and enable Pages for it.
Check each service's current sign-up requirements before you start.

Install on iPhone
-----------------
1. Open the HTTPS address in Safari on your iPhone.
2. Tap the Share button (square with an arrow; on newer iOS it can be inside
   the "..." menu next to the address bar).
3. Scroll down and tap "Add to Home Screen". If it's missing, tap
   "Edit Actions" at the bottom of the share sheet and add it.
4. Check the name says DrukFit. If you see an "Open as Web App" switch, leave
   it on. Tap Add.
5. Open DrukFit from the new Home Screen icon. It opens full screen, without
   Safari's address bar.
Chrome on iOS 16.4+ also offers Share > Add to Home Screen.

Updating to a new version
-------------------------
Upload the new files to the same address (same host, same project). Next time
you open DrukFit with signal, it downloads the update in the background and
shows "A new version of DrukFit is ready". Tap "Update now". Your data stays
on the phone. If the banner doesn't appear, fully close the app (swipe it away)
and open it again.

Good to know
------------
- Workouts save to the phone the moment you tick a set. That works offline,
  and the workout survives the app closing or the phone restarting.
- Deleting the Home Screen icon also deletes the data saved with it. Export a
  backup before removing it, and now and then anyway.
- Rest-timer sound needs the phone off silent mode. iPhones don't support web
  vibration.
- Pages pinned from Claude can't send push notifications; reminders show on
  the Today screen.
