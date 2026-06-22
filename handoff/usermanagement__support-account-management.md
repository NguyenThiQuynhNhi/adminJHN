## Support Account Management

**Purpose:** This screen lets an administrator manage "support accounts" — external partner/service organizations that support the platform's agents, such as property managers, tax advisors, and legal professionals. From here the admin can search, filter, and sort a list of these partner accounts, open any account to see its full details, suspend or re-activate an account, and "pin" an account as a sales/relationship Lead into a shared lead-group store that other admin screens consume.

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Support Portal Management". The page opens inside the admin shell's content iframe. It can also be deep-linked from a Leads overview screen using the web address parameters `?from=leads&leadId={id}`, which auto-opens the matching account's detail view on load.

---

### Layout & Structure

The whole screen lives in one padded page container with a header at the top that shows a single large title: "Support Account Management". There is no subtitle.

Below the header are two mutually exclusive views — only one is visible at a time:

1. **List view (default, shown on open).** A single card titled "Support accounts" containing:
   - A filter/search bar (one text box and five dropdowns plus a Reset button).
   - A five-column table of support accounts.
   - A hidden empty-state message that appears only when no rows match the filters.

2. **Detail view (hidden until an account is opened).** Shown after the admin clicks a row or the "View" button. It contains:
   - A top toolbar with a "Back to support list" button on the left, and on the right a "Save as lead" / "Unsave lead" button pair.
   - A hero banner with a circular avatar (initials), the company name, a small badge, the email, and a Suspend/Re-activate action button.
   - A detail panel that fills with the selected account's information grid.

Color palette follows the unified YUUSHI gold/white design system, driven by shared CSS custom-property tokens declared in `:root` (page background a light neutral grey `--bg-page` #f5f5f5, white/cream card backgrounds `--bg-card` / `--bg-card-warm`, gold accent `--color-primary` #8B7340, muted brown text `--text-muted`, neutral borders, and status tokens for success/warning/danger/neutral). The list-card layout is forced to a single full-width column on all screen sizes. There is no top navigation tab strip. Font Awesome icons are NOT used on this page — the small symbols (arrow, star, cross) are plain text characters.

---

### Every Element

#### List view — filter bar (all filters are optional; changing any one immediately re-renders the table)

1. **Search box** — text input. No visible label; placeholder text: "Search company, contact, email". Default empty. Matches case-insensitively as a substring against the company name, contact name, and email together.

2. **Category filter** — dropdown. Default = first option, "All categories". Options (shown text → effect):
   - "All categories" (default) → no category restriction.
   - "Property manager" → keep only accounts whose category is exactly "Property manager".
   - "Tax advisor" → keep only "Tax advisor".
   - "Legal professional" → KNOWN DATA ISSUE: this option's stored value is "Legal" but the seed data uses "Legal professional", so selecting it currently matches zero rows and empties the table. Flag for the BA/dev: the option value and the data value must be aligned.

3. **Status filter** — dropdown. Default = "Any status". Options:
   - "Any status" (default) → no status restriction.
   - "Active" → keep only Active accounts.
   - "Suspended" → keep only Suspended accounts.
   - "Pending" → keep only Pending accounts.

4. **Assigned-agents volume filter** — dropdown (hover tooltip "Assigned agents"). Default = "Any agent volume". Options:
   - "Any agent volume" (default) → no restriction.
   - "No agents assigned" → accounts with exactly 0 assigned agents.
   - "1 – 5 agents" → assigned-agent count between 1 and 5 inclusive.
   - "6 – 10 agents" → count between 6 and 10 inclusive.
   - "10+ agents" → count greater than 10 (11 or more).

5. **Compliance filter** — dropdown (hover tooltip "Compliance status"). Default = "Any compliance". It works by scanning the account's free-text compliance notes for the words verified, signed, complete, cleared, or approved. Options:
   - "Any compliance" (default) → no restriction.
   - "Cleared (MSA / KYC / verified)" → keep accounts whose compliance notes contain one of those keywords.
   - "Documents pending" → keep accounts whose compliance notes do NOT contain any of those keywords.

6. **Sort by** — dropdown (hover tooltip "Sort by"). Default = first option, "Sort: Company A→Z". Options:
   - "Sort: Company A→Z" (default) → alphabetical by company name.
   - "Sort: Most agents ↓" → highest assigned-agent count first.
   - "Sort: Fewest agents ↑" → lowest assigned-agent count first.
   - "Sort: Status" → alphabetical by status text.
   - "Sort: Category" → alphabetical by category text.

7. **Reset button** — ghost/outline button labeled "Reset". Clears the search box and the Category, Status, Assigned-agents, and Compliance filters back to their "any/all" defaults, and resets Sort by to "Sort: Company A→Z", then re-renders the table.

#### List view — table

Five columns, in this exact order:

1. **Company** — shows the company name in bold, with a smaller grey sub-line beneath it reading "{contact name} · {email}".
2. **Category** — a small rounded chip with the category text.
3. **Status** — a colored status pill (see Status badges below).
4. **Assigned agents** — the raw number of assigned agents.
5. **Actions** — two small ghost buttons per row:
   - "View" → opens that account's detail view.
   - "Suspend" → opens the suspend/re-activate confirmation for that account. NOTE: this button's label is always literally "Suspend" even for an account that is already suspended or pending; the actual action it triggers still toggles correctly based on status.

Table behavior:
- **Row click:** clicking anywhere on a row except on one of the two buttons opens that account's detail view.
- **Header sorting:** none — columns are not clickable. Sorting is controlled only by the Sort by dropdown.
- **Result count:** a line above the table reads `Showing {start}–{end} of {total} support accounts` (or `Showing 0 of 0 support accounts` when nothing matches), reflecting the current page slice of the filtered+sorted set.
- **Pagination:** platform-standard, fixed 50 rows per page (no page-size selector). A pager sits directly below the table: `‹ Prev`, numbered page buttons (up to 7, with `…` ellipsis for skipped ranges), and `Next ›`. The current page uses the primary button style; Prev is disabled on page 1 and Next on the last page; the whole pager is hidden when 50 or fewer accounts match. The page resets to 1 on load and whenever a filter/search/sort changes or Reset is clicked, and is preserved when opening an account's detail view. Not persisted across reloads. All filtered+sorted rows flow through pagination. (The seed data now exceeds 50 rows — deterministic filler accounts were appended to the original hand-authored ones so the pager is exercised.)
- **Empty state:** when no rows match, the table body is emptied and a centered message appears (see Empty States).

Status badges (status pill colors, all rounded; driven by the shared status tokens):
- **Active** — green pill (success token: green text on light green) — used when the account status is "Active".
- **Suspended** — red pill (danger token: red text on light red) — used when status is "Suspended".
- **Pending** — amber/yellow pill (warning token) — used for "Pending" and for any other non-Active, non-Suspended value (fallback).

#### Detail view — toolbar

- **"← Back to support list"** button (left) — returns to the list view. If there are unsaved changes it first asks to discard (this page has no editable form, so in practice it returns directly).
- **"★ Save as lead"** button (right, ghost; hover tooltip "Pin this support account to the admin Lead overview") — opens the Lead Group Picker modal to pin the current account as a lead. Visible when the current account is not already saved as a lead.
- **"✕ Unsave lead"** button (right, ghost) — removes the current account from the saved-leads store. Hidden by default; shown instead of "Save as lead" when the current account is already a saved lead.

#### Detail view — hero banner

- **Avatar** — circular badge showing the company's initials (up to two letters, uppercase). Default placeholder "S" when nothing is selected.
- **Company name** — large heading. Default placeholder "Select an account".
- **Badge** — small soft badge showing "{account id} · {category}". Default placeholder "No account selected".
- **Email** — shown after a "·" separator. Default placeholder "—".
- **Suspend / Re-activate button** — the hero action button. For an Active account it reads "Suspend" (styled as a red/danger button); for a non-Active account it reads "Re-activate" (neutral ghost style). Clicking it opens the suspend/re-activate confirmation. Default label when nothing is selected: "Suspend".

#### Detail view — detail panel (information grid)

Before an account is chosen, this area shows a placeholder message (see Empty States). Once an account is opened it shows an "Account information" section (with the account id as a sub-label) containing these read-only fields, in order. Any blank value shows as "—":
- **Primary contact**
- **Email**
- **Category** (shown as a chip)
- **Account status** (shown as a colored status pill)
- **Assigned agents** (number)
- **Service regions**
- **Onboarding** (free text, e.g. "Completed" or "License verification in progress") — full-width row
- **Compliance notes** (free text) — full-width row

There are no editable inputs, no Save button, and no create/add-account button anywhere on this screen.

---

### Modals & Popups

#### A. Suspend / Re-activate confirmation (shared confirm modal)

- **Trigger:** the "Suspend" button in any table row, or the Suspend/Re-activate button in the hero banner.
- **Title & body when suspending an Active account:** title "Suspend account?"; message "Suspend support account {company}? Linked agents will see access limited."; confirm button "Suspend" (red/danger styling).
- **Title & body when re-activating a non-Active account:** title "Re-activate account?"; message "Re-activate support account {company}?"; confirm button "Re-activate" (normal styling).
- **Buttons:** Confirm (runs the action then closes) and "Cancel" (closes, no change).
- **Close:** Cancel button, clicking the dark backdrop outside the box, or pressing Escape. Focus returns to whatever was focused before opening.

#### B. Discard-changes confirmation (shared confirm modal)

- **Trigger:** the Back button, only if there are unsaved edits. This page has no editable form, so it normally does not appear; documented for completeness.
- **Title:** "Discard unsaved changes?"; message: "You have edits that have not been saved. Leave anyway?"; confirm button "Discard" (red/danger); other button "Cancel".
- **Close:** Cancel, backdrop click, or Escape.

#### C. Lead Group Picker modal ("Save to lead group")

- **Trigger:** the "★ Save as lead" button in the detail toolbar.
- **Title:** "Save to lead group".
- **Subject line:** a highlighted line showing the account, formatted as "{company} · {email}" (falls back to "{company} · {id}", or just "Lead" if neither exists).
- **New-group row:** a text input with placeholder "New group name…" and a "Create group" button beside it. Creating a group adds it to the list, auto-selects it, and shows a success toast.
- **Group list:** a scrollable list of existing groups that belong to the "support" type. Each group row is a radio-selectable item showing: the group name (plus a small "already in group" pill if this account is already a member), a meta line reading "{n} member(s) · created {date}", and a type badge reading "SUPPORT". Selecting a row highlights it and enables the Save button. If there are no groups yet, the list shows "No groups yet for this type. Use the box above to create one."
- **Footer buttons:** "Cancel" (closes without saving) and "Save to group" (disabled until a group is selected; on click it adds this account to the chosen group, records the lead, shows a success toast, refreshes the toolbar buttons, and closes).
- **Close:** Cancel button, clicking the backdrop, or pressing Escape. Closing clears the new-group input, clears the selection, and re-disables Save.

There are no slide-out drawers on this page.

---

### Conditional Display

- **List view vs. detail view:** list view is shown on load; detail view is hidden. Opening an account (row click or "View") hides the list and shows the detail view. The Back button reverses this.
- **Hero Suspend vs. Re-activate button:** shows "Suspend" (red) when the selected account is Active; shows "Re-activate" (neutral) when the account is not Active.
- **Row "Suspend" action behavior:** the row button text is always "Suspend", but the confirmation it opens is "Re-activate?" when the account is not Active.
- **Save as lead vs. Unsave lead:** "Save as lead" shows when the current account is not in the saved-leads store; "Unsave lead" shows when it is. When no account is selected, "Save as lead" shows and "Unsave lead" is hidden. KNOWN ISSUE for the BA: the Save/Unsave toggle reads from one storage key while the picker writes to a different one, so after saving via the picker the button may not flip to "Unsave" automatically. Flag for dev alignment.
- **Status pill color:** green for Active, red for Suspended, amber for Pending or any other value.
- **"already in group" pill (in the picker):** shown on a group row only if the account is already a member of that group.
- **Detail panel placeholder vs. data:** the placeholder message shows until an account is selected; then it is replaced by the information grid.
- **Empty-state message:** hidden unless the filtered table has zero rows.
- **Deep-link auto-open:** if the page is opened with `?from=leads&leadId={id}` and that id matches an account, the detail view opens automatically on load.

---

### User Flows

**Find and open an account**
1. Admin types in the search box and/or picks values in the Category, Status, Assigned-agents, Compliance, and Sort dropdowns → the table re-filters and re-sorts instantly with each change.
2. Admin clicks a table row (or its "View" button) → the list hides and the detail view opens, populated with that account's hero info and information grid.
3. Admin clicks "← Back to support list" → returns to the list view; the selection is cleared.

**Reset filters**
1. Admin clicks "Reset" → search box clears, all filter dropdowns return to their default "any/all" values, sort returns to "Company A→Z", and the full list re-renders.

**Suspend an account**
1. Admin clicks "Suspend" on a row, or the "Suspend" hero button on an Active account → confirmation appears: "Suspend account?".
2. Admin clicks "Suspend" in the dialog → the account status changes to "Suspended", the table and (if open) the detail view update, and a success toast appears: "{company} suspended".
3. Admin clicks "Cancel" → nothing changes.

**Re-activate an account**
1. Admin clicks the "Re-activate" hero button on a non-Active account (or "Suspend" on a row of such an account) → confirmation appears: "Re-activate account?".
2. Admin confirms → status becomes "Active", views update, toast: "{company} re-activated".

**Save an account as a lead**
1. With an account open, admin clicks "★ Save as lead" → the Lead Group Picker opens.
2. Admin either selects an existing "support" group, or types a new group name and clicks "Create group" (which creates and auto-selects it, toast "Group \"{name}\" created").
3. Admin clicks "Save to group" → the account is added to the group, toast "Added to \"{group name}\"" appears, and the modal closes.
4. To remove, admin clicks "✕ Unsave lead" → the account is removed from the saved-leads store, toast "Lead removed".

---

### Validation

There is no data-entry form on this screen, so there is almost no validation.

- **Filter controls:** none — all optional, free choice, no errors.
- **Lead Group Picker — new group name:** required only when creating a group. If the admin clicks "Create group" with an empty or whitespace-only name, the input gets a red error border and receives focus. There is no error text and no toast. Pressing Enter in the field is equivalent to clicking "Create group". No length or format limits.
- **Save-as-lead guard rails (shown as toasts, not field errors):**
  - If "Save as lead" or "Unsave lead" is clicked with no account selected → error toast "Select a support account first." (Note: in normal flow these buttons only appear inside the detail view, so an account is already selected.)
  - If the selected account cannot be found when saving → error toast "Support account not found."
  - If the browser blocks local storage when saving → error toast "Unable to save: localStorage blocked."

---

### Empty States

- **Table — no matches:** when no accounts match the current filters, the table body is emptied and a centered message appears: "No support accounts match current filters."
- **Detail panel — nothing selected:** before an account is opened, the detail panel shows: "Select a support account to see details."
- **Hero — nothing selected:** company name placeholder "Select an account"; badge "No account selected"; email "—"; avatar "S".
- **Lead Group Picker — no groups:** the group list shows "No groups yet for this type. Use the box above to create one."

---

### Notifications & Feedback

**Confirmation dialogs (exact text):**
- Suspend: title "Suspend account?", message "Suspend support account {company}? Linked agents will see access limited.", confirm "Suspend".
- Re-activate: title "Re-activate account?", message "Re-activate support account {company}?", confirm "Re-activate".
- Discard (Back when dirty; rare here): title "Discard unsaved changes?", message "You have edits that have not been saved. Leave anyway?", confirm "Discard".

**Toasts (exact text):**
- "{company} suspended" — after confirming a suspend.
- "{company} re-activated" — after confirming a re-activate.
- "Select a support account first." (error) — Save/Unsave clicked with no selection.
- "Support account not found." (error) — saving when the account id can't be found.
- "Lead removed" — after Unsave lead.
- "Unable to save: localStorage blocked." (error) — when the browser blocks storage.
- "Group \"{name}\" created" — after creating a new lead group in the picker.
- "Added to \"{group name}\"" — after saving the account into a group.

Toasts appear at the bottom-right, can be dismissed with their "×", and auto-disappear after a few seconds. There are no native browser pop-up alerts; all confirmations use the in-page modal.

**Inline visual feedback:** the new-group name input in the picker turns red (error border) when left blank on "Create group".

---

### Navigation

- **Into the screen:** from the sidebar (USERS MANAGEMENT → "Support Portal Management"), loaded into the shell iframe. Optionally deep-linked from a Leads overview via `?from=leads&leadId={id}`, which auto-opens the matching account's detail view.
- **List → detail:** click a row or its "View" button (no web address change).
- **Detail → list:** "← Back to support list" button.
- **No internal hyperlinks, no `data-content` links, and no tabs** on this page.
- **Cross-screen integration via shared browser storage:** "Save as lead" / the Lead Group Picker write the account into shared lead and lead-group stores that the admin Lead overview reads; "Unsave lead" removes it from the saved-leads store.
- **Persistence notes:** suspend/re-activate status changes are in-memory only for the demo (they reset on reload). Saved leads and lead groups persist in the browser's local storage across reloads. Filter and sort selections are not persisted — they reset to defaults on reload.

---

### Pending Implementation

- **No password-reset modal exists on this screen.** There is no "Reset password" action, no password fields, and no password-complexity logic (`pwComplexity` / `updatePwChecklist`) anywhere in the file. The dynamic password-policy checklist requested for the reset modal therefore does **not** apply here and **no code change was made**. When a reset modal is eventually added, Support accounts follow the **Agent** policy: on modal open read the whole policy defensively (try/catch) from `localStorage` key `yuushi.basicSecuritySettings` → `passwordPolicy.agent` with shape `{minChars, complexity:{uppercase,lowercase,numbers,symbols}}` (**default minChars 8**, all complexity flags `true`), then generate the checklist dynamically — always "At least {N} characters", plus "One uppercase letter (A–Z)"/"One lowercase letter (a–z)"/"One number (0–9)"/"One special character (!@#$%^&*)" only when their respective flags are enabled (disabled rules omitted entirely from the DOM). The placeholder is "Min {N} characters" and validation requires the length rule plus only the enabled complexity rules.

✓ Done: handoff/usermanagement__support-account-management.md
