# SelectiCore v69 — Production Readiness

## Hardened in this build
- Cloudflare Pages Functions API
- Cloudflare D1 schema for users, sessions and progress
- Google ID-token verification against Google's JWKS
- HttpOnly + Secure + SameSite session cookies
- Session replacement on new sign-in
- Server-side progress storage with payload size guard
- Production security headers and CSP middleware
- Corrected cloud-restore precedence: cloud progress is authoritative when restoring
- Automatic cloud upload immediately after successful Google sign-in
- Guest/local mode retained
- Version metadata aligned to v69
- Local HTML asset/link audit passed
- JavaScript syntax audit passed
- Sampled all four 4,000-test subject banks at boundary/interior IDs
- Typing bank validated at boundary/interior IDs

## Required deployment configuration
Production cannot be activated without your own Cloudflare D1 database ID and Google OAuth Web Client ID. Those are deployment credentials/configuration, not hard-coded into the public package.

After configuration, deploy with Wrangler and run the D1 schema before accepting real users.
