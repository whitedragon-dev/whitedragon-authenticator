# whitedragon-authenticator

A single-file Cloudflare Worker that serves a TOTP authenticator app —
codes are computed entirely in the browser, and account data is persisted
to Workers KV instead of localStorage. The whole thing sits behind one
shared password.

```
https://2fa.<your-subdomain>.workers.dev/
```

---

## Contents

- `_worker.js` — the Worker. Deploy this file as-is. It embeds the entire
  app (HTML/CSS/JS) as a template string and serves it directly — no
  build step, no static asset directory.
- `wrangler.jsonc` — config: Worker name (`2fa`), entry file, and the KV
  namespace binding.

---

## How it works

### Password gate

Every request — the page itself and the API — is checked against
`env.PASSWORD` using standard HTTP Basic Auth before anything else runs:

```
Authorization: Basic <base64 of ':' + PASSWORD>
```

No login page is rendered; the browser's native credential prompt handles
it (username can be left blank). A missing or wrong header gets a `401`
with a `WWW-Authenticate` challenge, which is what triggers that prompt.

### Data storage

Account data used to live in `localStorage`. It now lives in a single KV
key (`data`), read and written through two routes the Worker exposes:

- `GET /api/data` — returns the stored `{ accounts, settings, lock }`
  blob as JSON (or `{}` if nothing has been saved yet).
- `PUT /api/data` — overwrites that blob with whatever JSON body is sent.

The client fetches this blob once on load, keeps it in memory, and pushes
the whole thing back on every change (add/edit/delete an account, flip a
setting, set up the PIN lock). Everything else — rendering, drag-to-reorder,
search, categories — works purely against that in-memory copy.

### Code generation (client-side, unchanged)

TOTP codes are still generated entirely in the browser and never touch the
Worker:

- Base32-decodes the stored secret.
- Runs HMAC-SHA1 (own implementation, no external crypto libraries beyond
  the browser's SubtleCrypto for the backup/PIN pieces) against the current
  30-second counter.
- Truncates to a 6–8 digit code per RFC 6238, refreshed every second via a
  countdown ring.

### App-level lock (unchanged)

A separate, optional PIN/biometric lock screen still runs entirely
client-side (PBKDF2-derived PIN hash + optional WebAuthn platform
credential). It's a second layer *inside* the app, independent of the
Worker's Basic Auth gate — losing/forgetting one doesn't affect the other.

### QR / otpauth import (unchanged)

`otpauth://` URIs — typed in, scanned via camera (`BarcodeDetector`), or
scanned from an uploaded image — are parsed client-side and never sent to
the Worker until the resulting account is saved.

---

## Deploying (dashboard only, no CLI)

1. Push `_worker.js` and `wrangler.jsonc` to a repo.
2. Cloudflare dashboard → **Storage & Databases → KV → Create namespace**.
   Copy its ID into `wrangler.jsonc` (`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`),
   commit.
3. Dashboard → **Compute (Workers) → Create → Import a repository** → pick
   the repo. Cloudflare reads `wrangler.jsonc` and deploys the Worker as
   `2fa`.
4. On the `2fa` Worker → **Settings → Variables and Secrets** → add a
   **Secret** named `PASSWORD`. Save (redeploys automatically).

---

## Using it

Open the Worker's URL, enter the password at the browser's login prompt,
and you're in the same app you had before — add an account by pasting a
secret or `otpauth://` link, or scanning a QR code. Codes, categories,
sort order, and the optional PIN lock all persist across devices now,
since they live in KV rather than one browser's local storage.

---

## Known limitations

- **Single shared password.** There's no per-user login — anyone with the
  password sees the same set of accounts. Fine for personal/family use,
  not a multi-tenant setup.
- **No rate limiting on the password check.** Basic Auth here has no
  lockout or backoff; consider adding one (e.g. via a KV-backed counter)
  before exposing this beyond trusted use.
- **One KV key holds everything.** Accounts, settings, and lock state are
  a single JSON blob under the key `data` — simple, but every save
  overwrites the whole thing (no per-account writes, no revision history).
- **The app-level PIN lock is independent of the Worker password.**
  Forgetting the PIN doesn't lock you out of the Worker, and vice versa —
  by design, but worth knowing since they look like one login at a glance.
- **`BarcodeDetector` (camera QR scanning) isn't supported in every
  browser** (notably Firefox and Safari, as of recent versions) — pasting
  the secret or `otpauth://` link still works everywhere.

---

## File map

```
_worker.js
├─ default.fetch()       → password check, /api/data (GET/PUT via KV), else serves HTML
└─ HTML                  → the entire app, embedded as a template string
   ├─ storage             → loadAll()/pushState() — fetch('/api/data') instead of localStorage
   ├─ base32Decode / sha1 / hmacSha1 / totp   → RFC 6238 code generation
   ├─ parseOtpauth / QR scan (BarcodeDetector) → account import
   ├─ encryptBackup / decryptBackup / derivePinHash → PIN + backup crypto (SubtleCrypto)
   ├─ brandFor / tileHtml  → per-issuer icon lookup and rendering
   └─ render() / tick()    → account list, live countdown rings, search/filter
```
