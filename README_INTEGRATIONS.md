# Master Move Chess 0.4 — Player accounts, profiles, Firebase + Supabase

## Included in this build

- Email/password registration and sign-in with Firebase Authentication.
- Password reset email flow.
- Player profile creation and editing: unique username, display name, optional HTTPS avatar URL and short bio.
- Profile statistics: provisional rating, games, wins, losses and draws.
- Recent saved game history.
- Firebase Realtime Database rooms remain available for online multiplayer.
- Supabase stores player profiles and completed PGN records. Profile and game writes are made by Edge Functions after Firebase ID-token verification.
- Local pass-and-play remains available without cloud configuration.

## 1. Firebase setup

1. Create a project at https://console.firebase.google.com/ and add a Web App.
2. Copy the Web App config into `firebase-config.js` (use `firebase-config.example.js` as the template).
3. In Authentication → Sign-in method, enable **Email/Password**. Enable **Anonymous** only if you want anonymous guest room play.
4. Create a Realtime Database and publish the included `database.rules.json` rules.
5. In Authentication → Settings → Authorized domains, add your GitHub Pages domain, e.g. `misebeyokusa-hue.github.io`.

## 2. Supabase setup

1. Create a project at https://supabase.com/.
2. Open SQL Editor and run the complete `supabase/schema.sql`.
3. Put the project URL, anon/public key, `save-game` function URL and `player-profile` function URL in `supabase-config.js`. The anon key is intended for browser use; **never put the service-role key in the app**.
4. Deploy both Edge Functions from a trusted computer with the Supabase CLI:

   ```sh
   supabase functions deploy save-game --no-verify-jwt
   supabase functions deploy player-profile --no-verify-jwt
   ```

5. Configure the function secrets (never commit these):

   ```sh
   supabase secrets set FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

   Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present in the Edge Function environment. Supabase normally provides them automatically.

## 3. Publish to GitHub Pages

Upload the contents of this folder to the repository root, including the configured `firebase-config.js` and `supabase-config.js`. The Firebase browser config and Supabase anon key are public client identifiers, but secure them with authorized domains, database rules and RLS. Never upload a Firebase service-account JSON or Supabase service-role key.

## 4. Test account registration

1. Open the HTTPS site and choose Player profile.
2. Register with an email address you control, a password of at least six characters, a display name and a unique username (3–20 letters, numbers or underscores).
3. Sign in, edit the profile and save it.
4. Sign out and sign back in to verify the profile loads from Supabase.
5. Complete a room game while signed in to test game archiving and the basic win/loss/draw counters.

## Prototype limitations and next production steps

- This is a functional integration prototype, not a production-rated competitive service. Confirm Firebase and Supabase setup before testing cloud features.
- The initial rating is a placeholder (1200); a properly calculated Elo/Glicko rating and anti-abuse controls are not yet implemented.
- Game history and statistics are recorded for the authenticated player who saves the completed game. Add a unique match ID and idempotent server-side finalisation before public launch to prevent duplicate records.
- Avatar images currently use an HTTPS image URL. A later release should add controlled Supabase Storage uploads and file validation.
- Email verification, account deletion, public profile lookup, friend lists, privacy controls, moderation and rate limiting should be completed before public launch.
- The online clock remains a prototype client-side clock. Competitive play needs authoritative server timestamps and server-side move validation.
