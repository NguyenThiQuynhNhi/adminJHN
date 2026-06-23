# Agent Sign-In (`agent_signin.html`)

**Purpose:** Standalone two-step sign-in for agency staff. Step 1 collects email + password; Step 2 verifies a 6-digit 2FA code; on success it redirects into the portal. Full-page document, **not** loaded in the iframe shell.

**Access:** Opened directly, or via "Log out" from the shell.

---

## Design system

Same gold/white tokens as the rest of the portal. Centered single-column card on a `#f5f5f5` background. Brand mark "YUUSHI Agent Portal" above the card. Toasts bottom-right.

---

## Layout & structure

Two mutually exclusive `.step` panels (only one has `.active`):

- **Step 1 — Credentials** (`#step-creds`, active on load).
- **Step 2 — 2FA** (`#step-2fa`).

---

## Step 1 — Credentials

Card titled **"Welcome back"**, subtitle "Sign in to manage your listings and inquiries."

Fields:
- **Email \*** (`#email`, type email, placeholder `agent@agency.co.jp`). Inline error "Please enter a valid email address."
- **Password \*** (`#password`, with a Show/Hide toggle). Inline error "Password is required."
- **Keep me signed in** checkbox (`#remember`, checked by default).
- **Forgot password?** link → fires toast "Recovery link sent — check your email." (no navigation).

Buttons / links:
- **Sign in** → `submitCreds()`.
- Divider "Or", then **Register a new agency** (link to `agent_signup.html`).
- Footer: "Need help? Contact support" (dead link).

**`submitCreds()`** validates email (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`) and a non-empty password. If valid: masks the email (`a***@agency.co.jp`), shows Step 2, focuses the first OTP box. Any password is accepted (no real auth).

---

## Step 2 — 2FA

Card titled **"Two-factor authentication"**, subtitle "We sent a 6-digit code to your sign-in email." Hint line shows the masked email (`#email-mask`).

- **OTP grid:** six single-character numeric inputs (`.otp`). Auto-advance on input (digits only), backspace moves to the previous box.
- Inline error (`#err-otp`) "Invalid code. Please try again." (centered).
- **Verify and continue** → `verifyOtp()`.
- **Resend code** (`#resend-btn`) → `resendOtp()`: toast "A new code has been sent." and a 30-second cooldown ("Resend in Ns").
- **← Back to sign in** → returns to Step 1.

**`verifyOtp()`** requires all 6 digits filled (no value check — any 6 digits pass). On success: toast "Signed in successfully." then after ~900ms `window.location.href = "dashboard.html"`. (Note: lands on the bare content page, not the `index.html` shell.)

---

## Validation summary

- Email must match the regex; password must be non-empty (Step 1).
- OTP must be 6 characters; the actual value is not checked.

## Notifications

Toasts (bottom-right, ~3s): "Recovery link sent — check your email.", "A new code has been sent.", "Signed in successfully." Error variant available but unused here for field errors (those are inline).

## Persistence

None. No localStorage; "Keep me signed in" is not wired to anything. All state resets on reload.
