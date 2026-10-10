# Deploying PortfolioHub to Firebase Hosting

Everything is already configured and built for your Firebase project
(`portfoliohub-fbcda`) — the `dist/` folder in this zip is the finished,
production build with your real Firebase config baked in. You just need to
run the deploy from a computer with normal internet access (this can't be
done from Claude's sandbox — Google's auth servers are blocked there).

## One-time setup

1. Install [Node.js](https://nodejs.org) if you don't already have it (18+).
2. Unzip this folder somewhere on your computer and open a terminal / command
   prompt inside it.
3. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
4. Log in (opens your browser to sign in with the same Google account you
   used to create the `portfoliohub-fbcda` project):
   ```bash
   firebase login
   ```

## Deploy

From inside the unzipped folder:

```bash
firebase deploy --only firestore:rules,firestore:indexes,hosting --project portfoliohub-fbcda
```

That's it — it will print your live URL, which will be:

**https://portfoliohub-fbcda.web.app**

(also reachable at `https://portfoliohub-fbcda.firebaseapp.com`)

## Notes

- **Storage** (avatar / cover image uploads) is not deployed yet — Firebase
  now requires the Blaze (pay-as-you-go) billing plan to enable Storage. It
  has a generous free tier and $300 in credit, so normal use should stay at
  $0, but adding a billing account is your call. Once you've added it, open
  Firebase console → Build → Storage → Get started (production mode, same
  `asia-south1` region as Firestore), then re-run:
  ```bash
  firebase deploy --only storage --project portfoliohub-fbcda
  ```
- **Cloud Functions** (`functions/`) also require the Blaze plan and are
  optional (a contact-message notification + an analytics aggregator) — the
  app works fully without them. Deploy later with:
  ```bash
  cd functions && npm install && cd ..
  firebase deploy --only functions --project portfoliohub-fbcda
  ```
- To rebuild after making changes: `npm install`, then `npm run build`, then
  re-run the deploy command above.
- Whenever you edit source and want to redeploy, just repeat the `firebase
  deploy` command — no need to log in again.
