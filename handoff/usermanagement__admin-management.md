## Admin User Management

**Purpose:** This screen lets a portal administrator manage the internal staff/administrator accounts that can log into the YUUSHI administration portal. From here an admin can browse and filter all admin accounts, create a new admin account, open one account to review a full profile (staff info, employment status, role assignment with history, security/2FA, operation & audit logs, internal notes), edit those details inline, suspend or reactivate an account, permanently delete an account (when eligible), force-reset a password, and export the filtered list to CSV. This is a demo mockup: all data is hardcoded; saves, deletes, status changes, and creates live only in memory for the current page load (a refresh restores the original seed data — 5 named admins plus 55 deterministic filler admins, ~60 total so the list spans more than one page), and export is a stub that only shows an alert. Nothing is persisted to a backend.

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Admin Management". The page loads inside the main portal shell (an iframe). It has no login gate of its own and no role checks in the demo — anyone who can reach the screen sees everything.

---

### Layout & Structure

The screen is one HTML page that contains three separate "views" that swap in and out (you never see more than one at once):

1. **List view** (shown first by default) has three stacked blocks top to bottom:
   - A page header: the title "Admin User Management" on the left, and two buttons on the right ("Export CSV" and "New admin").
   - A "Filters" card: a row of six filter controls, with "Reset" and "Apply" buttons at the bottom right.
   - A "Results" card: a count line ("Showing {start}–{end} of {total} admins") and the admin data table below it, with a pagination control beneath the table.

2. **Detail view** (hidden until you click a row) has, top to bottom:
   - A sticky toolbar that stays pinned at the top as you scroll. Left side: "Back to list". Right side: either the view-mode buttons ("Edit", "Suspend"/"Reactivate", and "Delete account" — the latter only shown for Suspended admins) or the edit-mode buttons ("Cancel", "Save changes") — only one set shows at a time.
   - A "hero" banner: a large square avatar with the person's initials, their name, and a meta line showing Role · Email · Status.
   - A grid of six cards (called Sections 1–6). On wide screens they sit two-per-row; Sections 5 and 6 always span the full width. Cards reflow to one column on narrow screens.

3. **Create view** (hidden until you click "New admin" from the list) has, top to bottom:
   - A sticky toolbar that stays pinned at the top. Left side: "Back to list". Right side: "Cancel" and "Save" buttons.
   - A "hero" banner: simply states "Create New Admin" with an icon.
   - A grid of five cards (Sections 1–5) containing form fields to input the new administrator's data.

**One modal** (the Password Reset popup) floats over everything when triggered from the Detail view. Success feedback appears as small green toast notifications in the top-right corner.

There are no tabs anywhere; the sections are just stacked cards. There is no sidebar inside this file (the sidebar belongs to the parent shell). Switching between list, detail, and create views does not change the browser URL.

---

### Every Element

#### List view — Page header

- **Title "Admin User Management"** — plain H1 text, top left. Not clickable.
- **Button "Export CSV"** — top right, plain style, file-export icon. Action: shows an alert "Export N filtered admin records as CSV (demo)" where N is the current number of filtered rows. Never disabled.
- **Button "New admin"** — top right, primary (gold) style, plus icon. Action: hides the List view and opens the Create view. Never disabled.

#### List view — Filters card

Title row: "Filters" with a filter icon. Six controls (left to right, wrapping as needed):

1. **Role** — label "ROLE". A multi-select list box showing 3 rows at a time, so several roles can be picked at once. No default selection (nothing selected = no role filter). Options verbatim: "Super Admin", "Admin", "Operator", "Viewer". Effect: when one or more are selected, only admins whose role is in the selected set are shown.
2. **Account Status** — label "ACCOUNT STATUS". Multi-select list box, 3 rows visible. No default selection. Options verbatim: "Active", "Suspended", "Withdrawn". Effect: only admins whose status is in the selected set are shown.
3. **Last Login — From** — label "LAST LOGIN — FROM". A date picker input. Optional, empty by default. Effect: only admins whose last-login date is on or after this date are shown (admins who never logged in are not removed by this rule).
4. **Last Login — To** — label "LAST LOGIN — TO". A date picker input. Optional, empty by default. Effect: only admins whose last-login date is on or before this date are shown (never-logged-in admins not removed by this rule).
5. **Department / Location** — label "DEPARTMENT / LOCATION". Dropdown. Multi-select list box to filter by specific branches or headquarters. No default selection. Options are dynamically loaded from the system. Effect: only admins in the selected department(s) are shown.
6. **2FA Status** — label "2FA STATUS". A single-select dropdown. Options verbatim: "All" (default), "Enabled", "Disabled". Effect: "Enabled" hides admins without two-factor auth; "Disabled" hides admins with two-factor auth; "All" applies no 2FA filter.

Filter action buttons (bottom right of the card):

- **Button "Reset"** — plain style. Action: clears every filter (deselects all multi-selects, sets 2FA back to "All", clears both dates), restores the full list, and re-renders the table. Never disabled.
- **Button "Apply"** — primary (gold) style, search icon. Action: reads all six filters, filters the admin list accordingly, and re-renders the table with the matching rows and updated count. Never disabled.

Note: filters do not auto-apply on change; you must click "Apply".

#### List view — Results card

- **Results count line** — "Showing {start}–{end} of {total} admins", reflecting the rows on the current page out of the total filtered count (e.g. "Showing 1–50 of 60 admins"). When there are no matches it reads "Showing 0 of 0 admins". The text is bold.
- **Admin data table** — full width, horizontally scrollable on small screens. Columns in order:
  1. **Full Name** — shows a small initials avatar, the bold name, and the admin ID (e.g. "ADM-001") in small grey text underneath.
  2. **Email** — the admin's email address.
  3. **Role** — text (Super Admin / Admin / Operator / Viewer).
  4. **Department** — text (displays the dynamically loaded branch/headquarters name).
  5. **Status** — a coloured status badge (see Status badges below).
  6. **2FA** — a 2FA badge: green "ON · Email OTP" or red "OFF".
  7. **Last Login** — the date/time, or an italic grey "Never" if the admin has never logged in.
  8. **Actions** — holds a per-row Delete button (see below).
  - **Sortable:** No columns are sortable.
  - **Row click:** The whole row is clickable (cursor turns to a hand). Clicking any row opens the detail view for that admin.
  - **Per-row action buttons:** A small red "Delete" button (trash icon) appears in the Actions column **only** when that admin's Status = Suspended. For Active and Withdrawn rows the Actions cell shows a plain grey dash ("—") instead. Clicking Delete does not open the row (it stops the row-click); it asks for confirmation and, on OK, removes the admin from the list and shows a success toast.
  - **Pagination:** Fixed page size of 50 admins per page (no page-size selector). A pager sits directly below the table with "‹ Prev", numbered page buttons (up to 7 shown at once, with "…" ellipses for larger ranges, e.g. with 20 pages on page 8 it shows 1 … 6 7 8 9 10 … 20), and "Next ›". The current page uses the primary/accent button style. "‹ Prev" is disabled on the first page and "Next ›" on the last; the whole pager is hidden when the total filtered count is 50 or fewer. The page resets to 1 on Apply, Reset filters, any change that alters the dataset, and on initial load; it is preserved when opening/closing the detail view and the Create view (returning to the list keeps you on the same page). After a delete empties the current last page, the view clamps back to the new last page. All filtered rows flow through pagination. The current page is not persisted across reloads.
  - **Search box:** None (filtering is only via the Filters card; there is no free-text search).

#### Status badges (list, detail, create)

All status pills use the shared YUUSHI design-system badge variants (no inline colors). There are three account-status values, used everywhere status is shown:

- **Active** — success-variant badge labeled "Active". Trigger: status field = Active.
- **Suspended** — danger-variant badge labeled "Suspended". Trigger: status field = Suspended.
- **Withdrawn** — neutral-variant badge labeled "Withdrawn". Trigger: status field = Withdrawn.
- **2FA ON** — success-variant badge "ON · Email OTP". Trigger: the admin has two-factor enabled.
- **2FA OFF** — danger-variant badge "OFF". Trigger: two-factor disabled.
- **Login History VPN "Yes"** — warning-variant pill (detail Section 5 Login History table). Trigger: a login row's VPN Detected = Yes. Otherwise the cell shows plain "No".
- **Login History "Concurrent Session" Yes** — danger-variant pill (detail Section 5 Login History table). Trigger: a login row's Concurrent Session = Yes. Otherwise the cell shows plain "No".

#### Detail view — Toolbar

- **Button "Back to list"** — left side, ghost (borderless) style, left-arrow icon. Action: returns to the list view. If you are in edit mode, it first asks to discard unsaved changes (see Notifications). Never disabled.
- **Button "Edit"** (view mode) — edit icon. Action: switches the detail into edit mode (fields become inputs, toolbar switches to Cancel/Save). Never disabled.
- **Button "Suspend" / "Reactivate"** (view mode) — warning (amber) style. Always present. When the admin is Active or Withdrawn it reads "Suspend" (ban icon) and suspends the account; when the admin is currently Suspended it reads "Reactivate" (rotate-left icon) and sets the account back to Active. Action runs after a confirm. Never disabled.
- **Button "Delete account"** (view mode) — danger (red) style, trash icon. **Shown only when the admin's Status = Suspended**; it is hidden for Active and Withdrawn admins. Action: permanently removes the account after a confirm. Never disabled (when shown).
- **Button "Cancel"** (edit mode) — times/X icon. Action: discards edits and returns to view mode after a confirm. Never disabled.
- **Button "Save changes"** (edit mode) — primary (gold) style, check icon. Action: runs the inline validation checks; if any field fails it highlights the field(s), shows inline error messages, and shows an error toast "Please fix the highlighted fields." without saving. If all pass, it writes all edited fields back to the record, returns to view mode, refreshes the list, and shows the success toast "Admin account updated successfully."

#### Detail view — Hero banner

- **Avatar tile** — large square showing the admin's initials (first letters of the first two name words). Before an admin is loaded it shows placeholder text "AD".
- **Name** — large bold text (the admin's full name).
- **Meta line** — three pieces separated by "·": Role, Email, and the Status badge.

#### Detail view — Section 1: Staff Profile (id-card icon)

A key/value grid. In view mode each shows the stored value (or "—" if empty); in edit mode most become inputs.

- **Full Name** — view: text; edit: free-text input.
- **Email Address** — view: text; edit: free-text input.
- **Phone Number** — view: text (or "—" if none); edit: free-text input.
- **Employee ID** — view: text; edit: free-text input.
- **Avatar Image** — view: shows the generated initials avatar plus the stored filename in grey (if any); edit: free-text input for the filename. (No file upload control; it is just a text field.)
- **Department / Location** — view: text; edit: dropdown menu. Options are dynamically loaded from the system, pre-set to the current value.
- **Account Created Date** — read-only in both modes (never editable). Shows the creation timestamp.

#### Detail view — Section 2: Employment Status (user-check icon)

- **Account Status** (labeled "Employment Status" for this section) — view: status badge; edit: dropdown with options "Active", "Suspended", "Withdrawn", pre-set to the current value.

#### Detail view — Section 3: Role Assignment (user-shield icon)

- **Role Assignment** — view: text; edit: dropdown with options "Super Admin", "Admin", "Operator", "Viewer", pre-set to the current value.
- **Permission Expiry Date** — view: text (or "—"); edit: free-text input (stores values like "2026-12-31" or blank; it is a plain text field, not a date picker).
- **Role Change History** — a sub-labeled read-only mini-table below the grid. Columns in order: "DateTime", "Editor ID", "New Role". One row per recorded role change. No sorting, no actions. Empty state: "No role changes." (italic).

#### Detail view — Section 4: Security & Password Management (lock icon)

- **2FA Status** — read-only badge ("ON · Email OTP" or "OFF").
- **Last Password Change Date** — read-only text (or "—").
- **Password Reset** — a full-width row with a **Button "Reset password"** (small, danger/red style, key icon). Action: opens the Password Reset modal. Never disabled.

#### Detail view — Section 5: Operation & Audit Logs (clipboard icon, full width)

Key/value grid first:

- **Last Login** — read-only text (or "Never").
- **IP Access Restriction** — read-only in both view and edit mode. The label carries a small grey note next to it: "(TBD)". The value is hardcoded to a plain dash "—" in the render (it does not read the admin record's stored `ipRestrict`). No input or enforcement.

Then four read-only mini-tables (no sorting, no pagination, no row actions):

- **Login History** — columns in order: "DateTime", "IP Address", "Country", "Device", "VPN Detected", "Concurrent Session". Seeded with five example rows.
- **Audit Logs** — columns in order: "DateTime", "Action", "Target Entity", "IP Address". Empty state: "No audit log entries."
- **Critical Action Logs** — columns in order: "DateTime", "Action Type", "Target", "Performed By", "IP". Empty state: "No critical actions."
- **Personal Data Access Logs** — columns in order: "DateTime", "Record Type", "Record ID", "Action". Empty state: "No PDA logs."

#### Detail view — Section 6: Internal Admin Notes (sticky-note icon, full width)

- **Internal Admin Memo** — view: the note text shown with line breaks preserved, or italic grey "No notes." if empty; edit: a multi-line text area pre-filled with the current note.

#### Create view — New Admin Screen

A dedicated view that replaces the List view when "New admin" is clicked. It functions identically to the Edit mode of the Detail view but is optimized for account creation.

- **Toolbar:** Left side: "Back to list". Right side: "Cancel" and "Save" buttons.
- **Hero banner:** A static header reading "Create New Admin" with a user-plus icon.
- **Section 1: Staff Profile**
  - **Avatar Image** — file upload control accepting JPG/PNG/JPEG/WEBP only, maximum 5MB.
  - **Full Name** — text input, required. Placeholder "e.g. Tanaka Ichiro".
  - **Email Address** — email input, required. Placeholder "name@yuushi.jp".
  - **Phone Number** — text input, required. Placeholder "+81.90.0000.0000".
  - **Address** — text input, optional.
  - **Department / Location** — dropdown. Options are dynamically loaded from the system. Default is the first available system option.
- **Section 2: Employment Status**
  - **Account Status** — dropdown: "Active", "Suspended" (default "Active").
- **Section 3: Role Assignment**
  - **Role Assignment** — dropdown, required. First option is the empty default "— Select role —", then "Super Admin", "Admin", "Operator", "Viewer".
  - **Permission Expiry Date** — date picker input.
- **Section 4: Security & Password**
  - **2FA Status** — dropdown: "Enabled", "Disabled" (default "Disabled").
  - **Password** — password input, required, placeholder "Min 12 characters", includes an eye icon to show/hide masked text, and a live five-condition complexity checklist beneath it (red when unmet, green when met).
  - **Confirm Password** — password input, required; includes an eye icon. Must exactly match the Password field.
- **Section 5: Internal Admin Notes**
  - **Internal Admin Memo** — multi-line text area for optional notes.

---

### Modals & Popups

**Password Reset modal**

- **Trigger:** "Reset password" button in Detail view Section 4.
- **On open:** the modal fills the "Subject account" line with the selected admin's ID, name, and email (e.g. "ADM-001 · Admin Tanaka (tanaka@yuushi.jp)"), clears both password fields, hides any prior error, **builds the complexity checklist dynamically from the role policy** (see below), and puts the cursor in the New password field.
- **Title:** "Reset password" with a red key icon.
- **Warning banner:** an amber callout reading "Force-reset password without email verification." followed by "The account owner must use the new password to log in next time. This action is recorded in Audit Logs."
- **Field "Subject account"** — read-only display of who is being reset.
- **Field "New password"** — password input, placeholder "Min {N} characters". Required (enforced in script). The complexity checklist is **generated from the role policy** (role = **admin**) on modal open: the whole policy is read defensively (try/catch) from `localStorage` key `yuushi.basicSecuritySettings` → `passwordPolicy.admin` with shape `{minChars, complexity:{uppercase,lowercase,numbers,symbols}}`; on any error/absence it falls back to **minChars 12** with all complexity flags `true`. The `#pwdChecklist` `<li>` items are then built dynamically: always "At least {N} characters"; "One uppercase letter (A–Z)" only if `complexity.uppercase`; "One lowercase letter (a–z)" only if `complexity.lowercase`; "One number (0–9)" only if `complexity.numbers`; "One special character (!@#$%^&\*)" only if `complexity.symbols`. **Disabled rules are omitted entirely from the DOM (not hidden).** Each rendered item shows red (filled-circle icon) while unmet and turns green (check icon) once met. The placeholder ("Min {N} characters") and the length validation use the same N, and `pwComplexity().all` is true when the length rule plus every **enabled** complexity rule passes. The Create-admin view drives its `#cvPwdChecklist` from the same admin policy.
- **Field "Confirm new password"** — password input, no placeholder. Required (enforced in script).
- **Error area** — hidden until validation fails; shows a red message box (see Validation).
- **Buttons:**
  - Header **× (close)** — discards and closes the modal.
  - Footer **"Cancel"** — discards and closes the modal.
  - Footer **"Reset password"** — danger (red) style, key icon. Validates the two fields; if valid, closes the modal and shows the success toast.
- **Close methods:** the × button, the Cancel button, or a successful submit. Clicking the dark backdrop does NOT close it, and the Esc key does NOT close it (no handlers wired).

No other modals or drawers exist on this screen.

---

### Conditional Display

- **View Swapping:** Only one of the three views (List, Detail, Create) is visible at any given time.
- **Detail View - View mode vs Edit mode:** When not editing, the "Edit / Suspend / Delete account" group shows and the "Cancel / Save changes" group is hidden. Editable fields render as plain text/badge in view mode and as an input/dropdown/textarea in edit mode. Tables and logs remain strictly read-only.
- **Delete Button Visibility:** Shown only when the admin's Status = Suspended; hidden for Active and Withdrawn. This applies to both the Detail view toolbar and the List view Actions column.
- **Detail Suspend/Reactivate button label:** Reads "Reactivate" when the admin is currently Suspended, otherwise "Suspend".
- **"Last Login" text:** Shows the timestamp if present, otherwise the italic word "Never".
- **Memo display:** Shows the note text if present, otherwise "No notes." (view mode only).
- **Avatar / filename in Detail Section 1:** In view mode, the initials avatar always shows; the filename text only appears beside it if a filename is stored.
- **Empty-table rows:** Each mini-table and the main table show their empty-state message only when there are zero rows to display.
- **Modal error box / inline field errors:** Hidden by default; shown only after a failed validation (the Password Reset modal's red error box, and the per-field inline error messages in the Create view and Detail Edit mode).

---

### User Flows

1. **Filter the list:** User adjusts any of the six filters → clicks "Apply" → table re-renders to matching admins and the count updates. Clicking "Reset" → all filters clear and the full list returns.
2. **Open an admin:** User clicks any table row → List view hides, Detail view opens for that admin in view mode, page scrolls to top.
3. **Edit an admin:** From Detail view, click "Edit" → fields turn into inputs, toolbar switches to Cancel/Save → user changes values → click "Save changes" → inline validation runs; if everything passes, values are written back, view mode returns, the list refreshes, and the toast "Admin account updated successfully." appears. If validation fails, the offending fields are highlighted with inline errors, an error toast "Please fix the highlighted fields." appears, and nothing is saved.
4. **Cancel an edit:** In edit mode, click "Cancel" → a confirm "You have unsaved changes. Are you sure you want to leave?" appears → on OK, edits are thrown away and view mode returns; on Cancel, you stay editing.
5. **Leave detail while editing:** In edit mode, click "Back to list" → a confirm "You have unsaved changes. Are you sure you want to leave?" appears → on OK, you go back to the list (edits dropped); on Cancel, you stay.
6. **Suspend / reactivate:** From Detail view, click "Suspend" (Active/Withdrawn admin) → confirm "Suspend admin {Full Name}?" → on OK, status becomes Suspended, the toast "Admin suspended successfully." appears, and both detail and list update. For a currently Suspended admin the button reads "Reactivate" → confirm "Reactivate admin {Full Name}?" → on OK, status becomes Active and the toast "Admin reactivated successfully." appears.
7. **Delete an admin (detail):** Only available for Suspended admins (the "Delete account" button is hidden otherwise). Click "Delete account" → confirm "Permanently delete admin {Full Name}? This action cannot be undone." → on OK, the record is removed from the list, you return to the list view, and the toast "Admin deleted successfully." appears.
8. **Delete an admin (list):** On a Suspended row, click the "Delete" button in the Actions column → confirm "Permanently delete admin {Full Name}? This action cannot be undone." → on OK, the row is removed and the toast "Admin deleted successfully." appears. (The row click is suppressed so the detail view does not open.)
9. **Reset a password:** From Detail Section 4, click "Reset password" → modal opens → user types a new password (the live checklist guides the 12-char/complexity rules) and confirms it → click "Reset password" → if valid, modal closes and the toast "Password reset successful for {Full Name}. The action has been recorded in Audit Logs." appears. If invalid, an inline error shows and the modal stays open.
10. **Export CSV:** Click "Export CSV" in the header → an alert "Export N filtered admin records as CSV (demo)" where N is the current filtered count. No file is produced.
11. **Create a new admin:** Click "New admin" from the List view → List view hides, **Create view** opens → user fills Full Name, Email, Phone Number, optional Address/Employee ID, picks a Department (dynamically loaded), picks a Role (must not leave it on "— Select role —"), optionally changes Account Status/2FA, sets a Password meeting the checklist and a matching Confirm Password, and optionally attaches an avatar image → click "Save" → if all validations pass, the admin is added to the list, the view switches back to the List view, and the toast "Admin account created successfully." appears. If anything fails, the relevant fields are flagged inline and you stay on the Create view.

---

### Validation

**List / filters:** No validation. No fields are required; date ranges simply narrow results. There is no guard against a "From" date later than a "To" date — it would just return no matches.

**Detail edit form & Create view form:** When you click "Save" or "Save changes", inline checks run on the editable fields. Each failing field is outlined in red with a small red message directly beneath it, and an error toast "Please fix the highlighted fields." appears; the record is not saved until all checks pass. The inline messages are:

- Empty required field (Full Name, Email, Password, Confirm Password, Phone): "This field is required."
- Invalid email format: "Invalid email address."
- Duplicate email (matches another admin): Create view uses "Email already exists. Please use another one."; the Detail Edit form uses the shorter "Email already exists."
- Invalid phone length: Create view uses "Invalid phone number. Must be 11 digits."; the Detail Edit form uses the shorter "Invalid phone number." (Note: the Detail Edit form only validates Phone when a value is present — a blank phone is allowed there; the Create view requires Phone.)
- Duplicate phone (matches another admin): Create view uses "Phone number already exists. Please use another one."; the Detail Edit form uses the shorter "Phone number already exists."
- No role selected (left on "— Select role —"): "Please select at least 1 role." (Create view only; the Detail Edit form does not validate Role.)
- Password fails complexity (Create view and Password Reset modal): the message text is "Password does not meet the complexity requirements below.", which points to the red/green checklist shown beneath the password field. The checklist is **generated from the role policy** (`yuushi.basicSecuritySettings.passwordPolicy.admin`, read defensively when the view/modal opens; **default minChars 12** with all complexity rules enabled): always "At least **N** characters", plus only the enabled rules among uppercase A–Z, lowercase a–z, number 0–9, special character such as !@#$%^&\*. The shared `pwComplexity()` length rule uses the same N, and `.all` requires the length rule plus only the **enabled** complexity rules. (Password fields exist only in the Create view and the modal, not in the Detail Edit form.)
- Password and Confirm Password differ: "Passwords do not match."
- Avatar wrong file type: "Only JPG, PNG, JPEG, WEBP files are allowed."
- Avatar over the size cap: "Maximum file size is 5MB."

**Password Reset modal.** Errors appear in the red error box inside the modal body, just above the footer; a live red/green checklist beneath the New password field shows the complexity conditions as you type. The checklist is generated dynamically from the admin role policy (length always; each complexity rule only when its flag is enabled — disabled rules are omitted from the DOM entirely):

- If either password field is empty → error text: "This field is required."
- If the new password does not satisfy all **enabled** complexity conditions (min N chars from the policy; plus only the enabled rules among uppercase, lowercase, number, special character) → error text: "Password does not meet the complexity requirements below." (directs the user to the checklist below).
- If the new password and confirmation do not match → error text: "Passwords do not match."
- The checks run in that order; the first failure shown stops submission. Only when all pass does the modal close and the success toast appear.

---

### Empty States

- **Main admin table, no matches:** Row spanning all columns, centered grey text: "No admins match the filters."
- **Role Change History (Section 3):** "No role changes." (italic).
- **Login History (Section 5):** No dedicated empty state — the table is always rendered from the shared five-row seed (`LOGIN_HISTORY_SEED`) for every admin, regardless of the admin record.
- **Audit Logs (Section 5):** "No audit log entries."
- **Critical Action Logs (Section 5):** "No critical actions."
- **Personal Data Access Logs (Section 5):** "No PDA logs."
- **Internal Admin Memo (Section 6), no note:** italic grey "No notes."
- **Phone / other empty profile fields (view mode):** display "—".
- **Last Login when never logged in:** italic "Never".
- No loading spinners or error states exist (all data is local and synchronous).

---

### Notifications & Feedback

**Success toasts (small green pop-ups, top-right corner — these replace the old OK-only alert popups):**

- "Admin account updated successfully." — after a successful Save changes.
- "Admin suspended successfully." — after suspending an admin.
- "Admin reactivated successfully." — after reactivating a suspended admin.
- "Admin deleted successfully." — after a confirmed delete (from either the detail view or the list Actions button).
- "Admin account created successfully." — after creating a new admin.
- "Password reset successful for {Full Name}. The action has been recorded in Audit Logs." — after a successful password reset.

**Error toast (red):**

- "Please fix the highlighted fields." — when Save changes is clicked with one or more invalid edit fields.

**Info alert (OK-only popup):**

- "Export N filtered admin records as CSV (demo)" — after Export CSV (N = current filtered count). This is the only remaining browser alert.

**Confirmation dialogs (OK/Cancel), exact wording:**

- "You have unsaved changes. Are you sure you want to leave?" — when leaving the Create view or Detail view (via "Back to list" or "Cancel") with unsaved inputs.
- "Suspend admin {Full Name}?" — when suspending an Active (or Withdrawn) account.
- "Reactivate admin {Full Name}?" — when reactivating a Suspended account.
- "Permanently delete admin {Full Name}? This action cannot be undone." — when deleting from either the detail "Delete account" button or the list Actions "Delete" button.

**Inline field error messages (Create view form and Detail Edit mode):** "This field is required." / "Invalid email address." / "Email already exists. Please use another one." (Create view) or "Email already exists." (Detail Edit) / "Invalid phone number. Must be 11 digits." (Create view) or "Invalid phone number." (Detail Edit) / "Phone number already exists. Please use another one." (Create view) or "Phone number already exists." (Detail Edit) / "Passwords do not match." / "Please select at least 1 role." (Create view) / "Password does not meet the complexity requirements below." (Create view password field) / "Only JPG, PNG, JPEG, WEBP files are allowed." / "Maximum file size is 5MB." plus the password complexity checklist (see Validation).

**Inline error messages (Password Reset modal):** "This field is required." / "Password does not meet the complexity requirements below." (points to the checklist) / "Passwords do not match." (see Validation).

**Static warning (Password Reset modal banner):** "Force-reset password without email verification. The account owner must use the new password to log in next time. This action is recorded in Audit Logs."

Feedback is delivered via top-right toast notifications, browser confirm dialogs, inline field errors, the in-modal error box, and a single Export CSV alert.

---

### Navigation

- **Entry:** Reached from the portal sidebar (USERS MANAGEMENT → "Admin Management"); the page loads inside the shell's iframe.
- **Within the screen:** List ↔ Detail ↔ Create navigation is handled by showing/hiding the respective views. "Back to list" returns from Detail/Create to the List view. There are no breadcrumbs and no tabs.
- **No URL change:** Opening an admin, editing, creating, or returning to the list does not change the browser address bar (no routing, no history entries). The browser Back button will not move between these views.
- **Persistence:** None for admin records. Nothing is saved to a server or to local storage. All edits, status changes, deletes, and newly created admins live only in memory for the current page load — a refresh restores the original seed data (~60 admins: 5 named + 55 deterministic fillers). The current pagination page is likewise not persisted across reloads. CSV export is the only remaining stub (it just shows an alert and produces no file).
- **Password policy minimum (read-only):** the Password Reset modal reads `yuushi.basicSecuritySettings.passwordPolicy.admin.minChars` from `localStorage` once when it opens (**default 12** if missing). This drives the length rule in the shared `pwComplexity()` (`p.length >= PWD_POLICY_MIN`) plus the `#pwdNew` placeholder ("Min {N} characters") and the `li[data-rule="len"]` checklist line ("At least {N} characters"). The page never writes this key. Other complexity rules (upper/lower/number/special) are unchanged.
- **External dependency:** Font Awesome 6.5 icons load from a CDN; no other outbound links.
