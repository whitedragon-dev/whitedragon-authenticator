# whitedragon-authenticator

A single-file, local-only TOTP authenticator — generates 2FA codes in the
browser, with no server, no account, and no data ever leaving the device
it's opened on.

```
whitedragon-authenticator.html
```

Open it directly in a browser, or host it on any static file server —
there is nothing to build and nothing to install.

---

## Contents

- `whitedragon-authenticator.html` — the entire app. Deploy this file as-is.

---

## How it works

### Code generation

TOTP codes (RFC 6238) are generated entirely client-side: a Base32 decoder,
a from-scratch SHA-1/HMAC implementation (`window.crypto.subtle` when
available, with a pure-JS fallback for non-secure contexts), and a TOTP
step function that supports 6–8 digit codes on custom time periods. Codes
recompute every second against the device clock — nothing is fetched or
verified remotely.

### Storage

Everything lives in `localStorage`, under three keys:

| Key | Holds |
|---|---|
| `pure2fa.accounts.v1` | Your accounts — issuer, label, secret, digits, period, category |
| `pure2fa.settings.v1` | Theme, code size, sort order, and other UI preferences |
| `pure2fa.lock.v1` | The app-lock PIN hash (PBKDF2/SHA-256) and, if enabled, a WebAuthn credential ID |

Secrets are stored in plain text in `pure2fa.accounts.v1` — see
**Known limitations**.

### Adding accounts

Three ways in:

- **Manual entry** — paste a Base32 secret, or a full `otpauth://` URI to
  auto-fill issuer, label, digits, and period.
- **QR — camera** — uses the browser's native `BarcodeDetector` API to scan
  a live camera feed.
- **QR — image upload** — same `BarcodeDetector`, run against an uploaded
  image file instead of a camera stream.

Browsers without `BarcodeDetector` (Safari, Firefox, as of this writing)
fall back to manual/paste entry with a clear notice — nothing silently
fails.

### Editing, categories, and reordering

Accounts can be edited in place (same modal as adding, pre-filled) rather
than requiring delete-and-recreate. Each account can carry an optional free-
text category; a filter chip bar appears above the list once any category
is in use. Accounts can be manually reordered by dragging a grip handle —
implemented with Pointer Events (not native HTML5 drag-and-drop) so it
works identically with mouse and touch.

### Encrypted backup

Export/import supports an optional passphrase. When set, the backup is
encrypted with AES-GCM (256-bit), with the key derived via PBKDF2
(210,000 iterations, SHA-256) from the passphrase and a random salt. The
passphrase itself is never stored anywhere — losing it means losing the
backup. Plaintext export/import (the default) is unchanged and always
available.

### App lock

An optional PIN (4–8 digits, hashed with PBKDF2/SHA-256 — never stored in
the clear) gates the app on load. If the platform supports it, a WebAuthn
platform authenticator (Face ID / Touch ID / Windows Hello / fingerprint)
can be registered as a shortcut alongside the PIN. This is a **screen
lock**, not encryption — see **Known limitations**.

### Brand icons

Service icons are fetched live, per-domain, from `geticon.dev`
(`https://geticon.dev/?url=<domain>`) — no API key, no account, no
per-domain registration required. A small built-in set of common brands
(GitHub, Google, Microsoft, etc.) ships with inline SVG paths and never
makes a network request. If an icon fails to load for any reason, it falls
back to a colored initial — the UI never shows a broken image.

### Theming

Light/dark/system theme, chosen once and persisted. A small blocking
script in `<head>` — before any CSS paints — reads the saved theme
straight from `localStorage` and sets it synchronously, so reloading never
flashes the wrong theme first.

### Mobile

A single `@media (max-width: 640px)` block turns every modal into a
bottom sheet, adds safe-area-inset padding for notches and home
indicators, bumps form-input font size to 16px (prevents iOS Safari's
zoom-on-focus), and scales touch targets down proportionally. The
drag-to-reorder handle is the only element with `touch-action: none`, so
normal list scrolling is unaffected.

---

## Deploying

Requires nothing — no build step, no dependencies, no server.

```
# Just open it
open whitedragon-authenticator.html

# Or host it anywhere static files are served
python3 -m http.server
```

Browser requirements: app lock and encrypted backup need a secure context
(`https://` or `localhost`) because they depend on `window.crypto.subtle`
and WebAuthn. Everything else works from a plain `file://` open.

---

## Using it

Open the file. Add an account by pasting a setup key, an `otpauth://`
link, or scanning a QR code. Tap a code to copy it. Everything — accounts,
settings, the lock PIN — stays in that browser's `localStorage` on that
device; nothing syncs anywhere.

---

## Known limitations

- **Secrets are stored in plain text** in `localStorage`. App lock is a
  screen gate, not encryption — anyone with direct access to the browser's
  storage (devtools, disk access) can read the secrets regardless of
  whether the lock is on. Use the encrypted backup if you need the secrets
  themselves protected.
- **No PIN recovery.** Forgetting the app-lock PIN means there is no
  in-app way back in — by design, so a "forgot PIN" button can't become a
  bypass. The only recovery is clearing the site's local storage from the
  browser's own settings, which also deletes all saved accounts.
- **`BarcodeDetector` is not universal.** QR scanning (camera or image)
  needs a Chromium-based browser. Safari and Firefox fall back to manual
  entry.
- **Icon fetching is a live network call.** Looking up a service's logo
  sends that service's domain name to `geticon.dev`. No account data,
  secrets, or codes are ever sent anywhere.
- **Nothing syncs across devices.** This is intentional — there is no
  account system and no server component — but it also means there is no
  built-in multi-device backup beyond manually exporting and importing.

---

## Testing checklist

Work through these in order — each targets a specific feature, so a
failure narrows down exactly where to look.

| # | Action | What you're checking | Expected result |
|---|---|---|---|
| 1 | Open the file fresh (no saved data) | First load | Empty state, "Add account" button, no theme flash on a hard refresh afterward |
| 2 | Add an account by pasting a Base32 secret | Manual entry + code generation | Account appears, 6-digit code counts down and rotates every 30s |
| 3 | Add another via a full `otpauth://` URI | URI parsing | Issuer, label, digits, and period auto-fill correctly |
| 4 | Scan a QR code (camera, on a Chromium browser) | `BarcodeDetector` camera path | Camera opens, account is added automatically on a successful scan |
| 5 | Scan a QR code from an uploaded image | `BarcodeDetector` image path | Same result as #4, without needing a camera |
| 6 | Tap the pencil icon on an existing account, change its name, save | In-place editing | Name updates with no duplicate account created |
| 7 | Add a category to two accounts, then tap the filter chip | Category filter | List narrows to just that category; "All" chip restores the full list |
| 8 | Drag an account's grip handle to a new position | Reorder | New order persists after a reload; Sort setting switches to "Custom order" |
| 9 | Export with a passphrase set, then import that file with the same passphrase | Encrypted backup round-trip | Accounts restore correctly; a wrong passphrase shows an error instead of garbage data |
| 10 | Turn on App lock, set a PIN, reload the page | Lock gate | Locked screen appears before any account data is visible; correct PIN unlocks |
| 11 | (If available) enable biometric unlock during PIN setup, reload, tap "Use biometrics instead" | WebAuthn path | Platform biometric prompt appears and unlocks on success |
| 12 | Toggle theme to Light, reload the page | FOUC fix | No flash of the wrong theme before the page settles |
| 13 | Open on a phone (or resize DevTools below 640px), tap "Add account" | Mobile layout | Modal opens as a bottom sheet, no zoom-on-focus when tapping a field |

---

## File map

```
whitedragon-authenticator.html
├─ <head> blocking script  → reads saved theme from localStorage, sets it pre-paint
├─ storage                 → loadAll/saveAccounts/saveSettings/loadLock/saveLock
├─ base32                  → Base32 encode/decode for TOTP secrets
├─ SHA-1 / HMAC            → HMAC-SHA1, WebCrypto-backed with a pure-JS fallback
├─ TOTP                    → counter → HOTP → 6–8 digit code, with grouping
├─ backup encryption       → PBKDF2 + AES-GCM envelope for encrypted exports
├─ brand logos             → inline SVGs for common brands + geticon.dev fallback
├─ otpauth                 → otpauth:// URI parser
├─ QR scan                 → BarcodeDetector, camera and image-upload paths
├─ app lock                → PIN setup/verify, WebAuthn registration & assertion
├─ settings                → theme/size/sort/toggle handling
├─ modals                  → open/close for Add, Settings, Import/Export, Lock, Confirm
├─ add / delete            → create, edit-in-place, and remove accounts
├─ copy                    → clipboard copy with legacy fallback
├─ import / export         → plaintext + encrypted backup read/write
├─ drag to reorder         → Pointer Events-based manual ordering
├─ render                  → list/category-chip rendering, search/filter
├─ clock                   → per-second tick, code rotation, countdown rings
└─ boot                    → load state, apply settings, check lock, start the clock
```
