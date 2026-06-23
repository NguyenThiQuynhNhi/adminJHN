# Agent Sign-Up / Agency Registration (`agent_signup.html`)

**Purpose:** Standalone registration form to create the **parent account for an agency** (one account per agency; staff are invited later). On valid submit it swaps to a "Verify your email" success state. Full-page document, **not** loaded in the iframe shell.

**Access:** Reached from "Register a new agency" on `agent_signin.html`.

---

## Design system

Same gold/white tokens. Single centered card (max 540px). Brand mark "YUUSHI Agent Portal". Live password-rule checklist and bottom-right toasts.

---

## Layout & structure

Two cards, swapped on success:
- **Registration form** (`#form-card`).
- **Success state** (`#success-card`, hidden until submit succeeds).

A lead-note banner explains: "One account per agency… required to verify your real-estate license. Your full agency profile… can be completed after sign-in."

The form is grouped into three sections by `.section-title` bars: **Company**, **License**, **Account**.

---

## Fields (all marked \* are required)

**Company**
- **Company Name / Trade Name \*** (`#company`, max 255). Error "Company name is required."
- **Company Name (Katakana) \*** (`#company-kana`, max 255, hint "Katakana characters only — used for bank verification and sorting."). Error "Katakana name is required." (Note: katakana-only is not actually enforced.)
- **Representative Name \*** (`#rep-name`, max 255). Error "Representative name is required."

**License**
- **Real Estate License Number \*** (`#license-no`). Error "License number is required."
- **License Expiry Date \*** (`#license-expiry`, date, hint "Must be a future date."). Error "A valid future expiry date is required." / "License expiry date must be in the future."

**Account**
- **Operational Email \*** (`#email`, hint "Used by the platform admin… Must be unique."). Error "Please enter a valid email address."
- **Representative Phone \*** (`#phone`, tel, hint "Format +xx.xxx.xxx.xxx — must be unique."). Error "A valid phone number is required."
- **Password \*** (`#password`, with Show/Hide) — with a live rules grid (see below).
- **Confirm Password \*** (`#password2`, with Show/Hide).
- **Terms checkbox** (`#agree`): "I have read and agree to the Terms of Service and Privacy Policy. I confirm the license information above is accurate." Error "You must agree to continue."

**Submit:** "Create agency account" → `submitForm()`. Footer: "Already registered? Sign in" (→ `agent_signin.html`).

---

## Password rules (live)

Checklist (`#pw-rules`), each ticks gold when met (`checkPwRules()` on input of either password field):
- At least **12 characters**
- One uppercase letter
- One lowercase letter
- One number
- One symbol (`!@#$%^&*` etc.)
- **Confirm matches** (non-empty and equal to confirm field)

---

## Validation (`submitForm()`)

- Required text fields (company, kana, rep name, license no) must be non-empty.
- License expiry: required and strictly after today.
- Email: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- Phone: regex `^\+?[\d.\-\s()]{8,}$` (permissive).
- Password: all six rules above must pass.
- Terms checkbox must be checked.

If anything fails, the offending fields get `.invalid` + inline errors and a toast "Please correct the highlighted fields." (error). Uniqueness of email/phone is described in hints but not actually checked.

---

## Success state

On valid submit: the form card hides, the success card shows with a check icon, title **"Verify your email"**, body "We sent a verification link to **{email}**. Click the link to activate your agency account and complete your profile." Buttons: **Go to sign-in** (→ `agent_signin.html`) and **Resend verification** (toast "Verification email resent."). Page scrolls to top.

## Notifications

Toasts: "Please correct the highlighted fields." (error), "Verification email resent." (success).

## Persistence

None. No account is actually created; no localStorage. Reload returns to the empty form.
