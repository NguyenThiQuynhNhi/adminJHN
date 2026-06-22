## Basic & Security Settings

**Purpose:** A single admin screen for viewing and editing platform-wide configuration in two groups: (1) Basic settings — global defaults (currency, language, timezone) and saved-items limits for the client portal; and (2) Security settings — an **editable** password & session policy matrix (per account type: Admin / Agent / Customer). The page opens read-only; the admin presses one "Edit" button to make the editable fields editable, then "Save settings" to commit (or "Cancel" to discard). In this mockup, saving persists to `localStorage` and shows a success toast (no real backend yet).

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Basic & Security Settings". Intended for administrators who manage platform configuration. There is no separate per-field permission; whoever can open the screen can edit the editable fields.

### Layout & Structure

The page is a single scrolling form, top to bottom:

1. **Page heading:** "Basic & Security Settings" (no subtitle text directly under the H1).
2. **Section heading: "Basic settings"** — followed by two side-by-side cards (they stack vertically on narrow screens):
   - Card A: "Global defaults"
   - Card B: "Saved items limits (Client portal)"
3. **Section heading: "Security settings"** — one full-width card:
   - Card C: "Password & session policy" (editable matrix table; a Card D for 2FA no longer exists — 2FA is now a row inside the matrix)
4. **Action bar (bottom right, ONE area for the whole screen):**
   - View mode: a single "Edit" button.
   - Edit mode: two buttons — "Cancel" and "Save settings".

There are NO per-section save buttons anywhere. The whole screen is responsive: cards reflow to one column on smaller widths, the policy matrix scrolls horizontally on narrow screens (the matrix cells become inputs/selects/checkboxes in Edit mode), and the bottom buttons become full-width on tablet/phone.

### Every Element

**Card A — "Global defaults"** (three dropdowns)

- **Default currency** (dropdown). Exactly 16 options, in this order: USD, AUD, GBP, SGD, JPY, HKD, TWD, CNY, KRW, THB, EUR, AED, BRL, IDR, VND, INR. Default selected: **JPY**. No helper text (only a hidden "This field is required." inline error). Effect: platform-wide default display currency for new users. Editable in edit mode.
- **Default language** (dropdown). Exactly 15 options, in this order: English, Japanese, Traditional Chinese, Simplified Chinese, Korean, Thai, German, French, Spanish, Italian, Arabic, Portuguese, Indonesian, Vietnamese, Hindi. Default selected: **English**. Effect: platform-wide default language. Editable in edit mode.
- **Timezone** (dropdown). Options, in order: "Asia/Tokyo (UTC+9)", "UTC". Default: **Asia/Tokyo (UTC+9)** (unchanged). Editable in edit mode.

**Card B — "Saved items limits (Client portal)"** (two number inputs — unchanged)

- **Max saved properties per user** (number input). Default: **100**. Range: minimum 0, whole numbers only (step 1). Helper text: "0 = no hard limit". Editable in edit mode.
- **Max saved searches per user** (number input). Default: **50**. Range: minimum 0, whole numbers only (step 1). Helper text: "0 = no hard limit". Editable in edit mode.

**Card C — "Password & session policy"** (EDITABLE matrix table — read-only in View mode, fully editable per role in Edit mode)

No "Read-only" tag and no platform-fixed note. The card shows only its title "Password & session policy" and the matrix — there is no description paragraph under the title and no inline note below the matrix. (The 2FA "Email OTP" wording lives inside the 2FA badge text itself, not in a separate note.)

Table columns: **Item | Admin | Agent | Customer**. The matrix is **5 data rows**, all following ONE unified pattern: in **View mode** each role cell shows formatted text/badges; in **Edit mode** each role cell becomes its input control. **Every role holds an INDEPENDENT state** — there is no "Same as Admin" wording or inheritance anywhere; each of the 15 cells (5 rows × 3 roles) is edited independently.

| Item               | Control (Edit mode)                                                                                                 | View-mode format                                                                                                                                        | Defaults (Admin / Agent / Customer)                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Min. Characters    | `<input type="number" min="4" max="64" class="edit-input">`                                                         | plain number, e.g. "12"                                                                                                                                 | 12 / 8 / 8                                               |
| Complexity Req.    | 4 stacked checkboxes (flex column, gap 6px, 16×16, accent var(--accent)): Uppercase / Lowercase / Numbers / Symbols | inline dot-separated chip list of the checked items, e.g. "Uppercase · Lowercase · Numbers · Symbols"; if zero checked → muted italic "— None required" | all four checked / all four checked / all four checked   |
| Keep Login Session | `<input type="number" min="1" max="24" class="edit-input">` with a " months" label to its right                     | "{N} months"                                                                                                                                            | 6 / 6 / 6                                                |
| Security Q&A       | single checkbox labelled "Mandatory"                                                                                | badge — checked = green "Mandatory", unchecked = grey "Optional"                                                                                        | Mandatory / Mandatory / Mandatory (all checked)          |
| 2FA                | single checkbox labelled "Mandatory"                                                                                | badge — checked = green "Mandatory (Email OTP)", unchecked = grey "Optional (Email OTP)"                                                                | Admin **checked** / Agent unchecked / Customer unchecked |

**Complexity is now FOUR independent booleans** `{ uppercase, lowercase, numbers, symbols }` per role (no longer a free-text string). The old free-text "Complexity Req." input and the old Security Q&A Mandatory/Optional/Disabled dropdown have both been removed.

Every cell — across all three role columns (Admin, Agent, Customer) — is independently editable in Edit mode and drives that column's View-mode formatting live (number/chip-list/badge) as the controls change. With defaults, the 2FA row reads: Admin green "Mandatory (Email OTP)", Agent grey "Optional (Email OTP)", Customer grey "Optional (Email OTP)"; the Security Q&A row reads green "Mandatory" for all three.

There is no separate 2FA card and no "2FA target accounts" checkbox group. 2FA is just the 5th matrix row. Email OTP is the only supported 2FA method; this is conveyed inside the 2FA View-mode badge text itself ("Mandatory (Email OTP)" / "Optional (Email OTP)") — there is NO separate inline note below the matrix. (A `.twofa-method-note` CSS rule exists in the stylesheet but is unused; no such element is rendered.)

**Action buttons (bottom — single shared area for the whole screen)**

- **View mode (default):** one button, **"Edit"** (primary/highlighted style).
- **Edit mode:** two buttons — **"Cancel"** (plain) and **"Save settings"** (primary). No per-section buttons.

**Tables:** One — the editable Password & session policy matrix (Card C).
**Status badges:** None. (No "Read-only" tag pills anymore.)

### Modals & Popups

- **Discard-changes modal** (styled in-page, not native). Title: "Discard unsaved changes?". Message: "You have unsaved changes. Are you sure you want to discard them?". Header carries an **X** close button. Buttons: **Cancel** (plain — closes the modal, stays in edit mode) and **Discard** (danger style — reverts every field/cell to the last saved snapshot and returns to view mode). Clicking the dimmed backdrop, the X, or pressing Escape also closes the modal (same as Cancel — stays in edit mode). This modal only appears when Cancel is pressed AND there are unsaved changes; if there are no edits, Cancel just exits edit mode immediately.
- **Toasts** (styled, bottom-right, auto-dismiss ~3s). Success (green) on a successful save reading exactly **"Password & session policy saved."**; error (red) on a failed matrix validation (see Validation). There are no native `confirm()`/`alert()` popups anywhere.

**Modal close methods (4):** Cancel button, X button, backdrop click, and Escape key (Discard button also closes after reverting).

### Conditional Display

- **View mode vs. Edit mode (whole-page toggle):**
  - In **view mode** (default on every load): the editable fields (currency, language, timezone, the two saved-items number inputs) are disabled/greyed out, and the policy matrix shows formatted read-only text. The bottom shows only the "Edit" button.
  - In **edit mode** (after pressing "Edit"): those fields become editable AND every matrix role cell switches from formatted text to its input control (number / text / dropdown / checkbox); the bottom shows "Cancel" and "Save settings".
- The **2FA method is fixed** to Email OTP (the only supported method); only the per-role 2FA mandatory/optional checkbox is editable.
- No field appears/hides based on another field's value.

### User Flows

**Flow 1 — Viewing current settings (default state)**

1. Admin opens the screen. Cards display current values (from `localStorage` if previously saved, otherwise the built-in defaults).
2. Editable fields and the policy matrix are read-only (matrix shows formatted text). Bottom shows "Edit".

**Flow 2 — Editing and saving**

1. Admin presses **"Edit"**. A snapshot of the current values is taken.
2. The editable fields unlock; the bottom shows **"Cancel"** and **"Save settings"**.
3. Admin changes any editable field(s).
4. Admin presses **"Save settings"**.
5. All fields are validated (basic-settings required checks + the per-role policy matrix). If all pass, values persist to `localStorage`, the snapshot updates, the screen returns to view mode, and a success **toast** appears: "Password & session policy saved." Edit mode is atomic — a single Edit / Save / Cancel governs the whole matrix; pressing Edit flips all 15 cells (5×3) to controls at once.

**Flow 3 — Cancelling**

- Admin presses **"Cancel"**.
  - If there are **no unsaved changes**: the screen returns to view mode immediately.
  - If there **are unsaved changes**: the "Discard changes?" modal appears. "Cancel" keeps editing; "Discard" reverts to the snapshot and returns to view mode.

### Validation

- **Required fields:** Default currency, Default language, Timezone, Max saved properties, Max saved searches. On Save, any empty required field is flagged inline with the message **"This field is required."** (red border + message under the field). Save is blocked until all required fields are filled. The inline error clears as soon as the field gets a value.
- **Saved Items limits (Max saved properties, Max saved searches):** required, and must be a valid number that is 0 or greater. If empty → inline **"This field is required."**; if non-numeric or negative → inline **"Please enter a valid number (0 or greater)."** (The number inputs also carry min 0 / step 1 attributes, but the explicit on-Save check is what blocks bad values.)
- **Password & session policy matrix (validated on Save, per role):** validation runs role-by-role (Admin → Agent → Customer). The **first failure aborts the Save, keeps the page in edit mode**, marks the offending cell with a red border, and shows an **error toast**. Only Min. Characters and Keep Login Session have constraints:
  - **Min. Characters** — integer 4–64 → error toast **"Min. Characters must be between 4 and 64 for {Role}."**
  - **Keep Login Session** — integer 1–24 → error toast **"Keep Login Session must be between 1 and 24 months for {Role}."**
  - **Complexity Req.** — no constraint (zero complexity boxes checked is valid).
  - **Security Q&A** — no constraint (checkbox).
  - **2FA** — no constraint (checkbox).
  - ({Role} is "Admin", "Agent", or "Customer".) The cell red-border error clears when the Min. Characters / Keep Login Session input changes.
- No native browser alerts are used.
- Default values in use: currency JPY; language English; timezone Asia/Tokyo (UTC+9); saved-properties 100; saved-searches 50; policy matrix per role — Admin `{ minChars 12, complexity all true, sessionMonths 6, securityQaMandatory true, twoFaMandatory true }`; Agent `{ minChars 8, complexity all true, sessionMonths 6, securityQaMandatory true, twoFaMandatory false }`; Customer `{ minChars 8, complexity all true, sessionMonths 6, securityQaMandatory true, twoFaMandatory false }`.

### Empty States

None for lists/tables. The policy matrix always shows its full content (formatted text in View mode, inputs in Edit mode). Editable fields always show a value; an emptied required field surfaces its inline validation message rather than an empty state.

### Notifications & Feedback

- **Save success:** styled green toast (bottom-right, auto-dismiss) reading exactly **"Password & session policy saved."**
- **Cancel with unsaved changes:** styled modal — title "Discard unsaved changes?", message "You have unsaved changes. Are you sure you want to discard them?", X + buttons Cancel | Discard (danger).
- **Required field empty on save (basic settings):** inline message **"This field is required."** under each offending field.
- **Saved Items limit invalid (non-numeric or negative):** inline message **"Please enter a valid number (0 or greater)."** under the offending Saved Items field.
- **Matrix invalid on save:** the offending cell gets a red border AND a red **error toast** with the per-role message — **"Min. Characters must be between 4 and 64 for {Role}."** or **"Keep Login Session must be between 1 and 24 months for {Role}."** (first failure only). Complexity / Security Q&A / 2FA never error.
- No native `confirm()`/`alert()` dialogs, and no inline success/error banners beyond the above.

### Navigation

- No links, tabs, or back buttons on this screen. The bottom button area toggles between view (Edit) and edit (Cancel / Save settings).
- Navigation to/from this screen is handled by the admin sidebar shell (SYSTEM SETTINGS & INTEGRATIONS → "Basic & Security Settings").
- **Persistence:** Editable settings are saved to `localStorage` under the key **`yuushi.basicSecuritySettings`** (renamed from the previous `annaSecuritySettings`). Shape:

  ```json
  {
    "currency": "JPY",
    "language": "en",
    "timezone": "Asia/Tokyo",
    "maxSavedProperties": 100,
    "maxSavedSearches": 50,
    "passwordPolicy": {
      "admin": {
        "minChars": 12,
        "complexity": {
          "uppercase": true,
          "lowercase": true,
          "numbers": true,
          "symbols": true
        },
        "sessionMonths": 6,
        "securityQaMandatory": true,
        "twoFaMandatory": true
      },
      "agent": {
        "minChars": 8,
        "complexity": {
          "uppercase": true,
          "lowercase": true,
          "numbers": true,
          "symbols": true
        },
        "sessionMonths": 6,
        "securityQaMandatory": true,
        "twoFaMandatory": false
      },
      "customer": {
        "minChars": 8,
        "complexity": {
          "uppercase": true,
          "lowercase": true,
          "numbers": true,
          "symbols": true
        },
        "sessionMonths": 6,
        "securityQaMandatory": true,
        "twoFaMandatory": false
      }
    }
  }
  ```

  `complexity` is FOUR independent booleans `{ uppercase, lowercase, numbers, symbols }`. `securityQaMandatory` and `twoFaMandatory` are booleans. On load, stored values are merged over the built-in defaults (per-role too); a missing per-role policy is seeded with the role defaults above. Other existing fields are preserved.
  - **Migration:** On load, if the old `annaSecuritySettings` key exists and the new key does not, the old object is migrated and then the **old key is DELETED**:
    - currency / language / timezone / maxSavedProperties / maxSavedSearches ported as-is;
    - any prior-shape per-role policy is normalized: old `complexity` **string** → object with all four booleans `true`; old `securityQA` "Mandatory"/"Optional"/"Disabled" **string** → `securityQaMandatory` boolean = (value === "Mandatory"); old `twoFa` → `twoFaMandatory`;
    - the very old flat `twoFaTargetAdmin` / `twoFaTargetAgent` flags, if present, → `passwordPolicy.admin.twoFaMandatory` / `passwordPolicy.agent.twoFaMandatory`;
    - any missing per-role policy takes the role defaults above.
      The result is written under the new key. (This key rename is explicitly required despite the usual "don't change keys" rule.)
  - (In production, saving is intended to also call a backend API and be recorded in the Audit Logs.)

### SRS / Business Logic Note

- The Password & session policy matrix is **editable per role** (Admin / Agent / Customer), each role holding an **independent** state. On Save, all **new login sessions** enforce these rules.
- **Consumers read this policy and render their password-reset checklist dynamically.** The mapping is: **End User Management** (= customer) reads `passwordPolicy.customer`; **Agent Management & Support** (= agent) read `passwordPolicy.agent`; **Admin Management** (= admin) reads `passwordPolicy.admin`.
- Each consumer renders its password-reset / password-set checklist from the role's policy: it shows the "minimum {minChars} characters" rule, then one line per **checked** complexity boolean (Uppercase / Lowercase / Numbers / Symbols), **omitting any unchecked complexity rule** entirely. `sessionMonths` drives the "keep me signed in" duration; `securityQaMandatory` and `twoFaMandatory` decide whether Security Q&A and 2FA (Email OTP) are required for that role. If zero complexity booleans are checked, no character-class rules are shown.
