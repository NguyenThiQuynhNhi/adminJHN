## Translation Glossary

**Purpose:** Lets an administrator manage the approved real-estate terminology glossary. Each entry is a Japanese (JP) source term paired with its translations in 14 target languages (15 language values in total, counting the JP Term). Approved translations override the system's default translation; the glossary is checked first, and if a term has a glossary entry, that translation is used. Every term is shown with all 14 translations side by side in one wide table.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Translation Glossary". Loads inside the admin shell content area. Leaf screen (no sub-screens).

### Layout & Structure

Top of page (outside the card):

- Page title: "Translation Glossary". (There is NO subtitle paragraph under the title — the `.page-subtitle` CSS rule exists but no such element is rendered.)

Below that, a single white card containing everything:

1. Card header row: card title "Glossary terms" on the left; "Add Term" button on the right.
2. Filter bar (directly under the header): a search box on the left and a result-count label beside it.
3. A single wide data table that scrolls horizontally. There are NO per-language tabs — all languages are columns in this one table. Each row is one JP term with all 14 translations side by side.

There is no Export or Import feature (Phase 1 has no bulk import/export).

There are two modals — "Add Term" and "Delete term?" — and a toast notification area in the bottom-right corner.

### Every Element

**Card header**

- Card title text: "Glossary terms".
- "Add Term" button (primary style, plus icon). Opens the Add Term modal.

**Filter bar**

- Search box: single text input with a magnifying-glass icon. Placeholder: "Search JP term or any translation…". Filters the table live as the user types (every keystroke). Case-insensitive. Matches against the JP term and against all 14 translation values for each row — if the typed text appears in any of those, the row stays visible.
- Result count label: text "Showing X of Y terms", where X = number of rows currently visible after the search filter and Y = total number of terms in the glossary. Updates on every render and every search keystroke.

**Wide glossary table — columns, in exact left-to-right order:**

1. # — row number (1, 2, 3 …). Sequential display number. This column is sticky (stays pinned to the left while scrolling horizontally).
2. JP Term — the Japanese source term, shown in bold. This column is sticky (stays pinned while scrolling horizontally).
3. EN — English translation.
4. ZH-TW — Chinese (Traditional).
5. ZH-CN — Chinese (Simplified).
6. KO — Korean.
7. TH — Thai.
8. DE — German.
9. FR — French.
10. ES — Spanish.
11. IT — Italian.
12. AR — Arabic.
13. PT — Portuguese.
14. ID — Indonesian.
15. VI — Vietnamese.
16. HI — Hindi.
17. Actions — right-aligned; holds the per-row buttons.

Table behavior:

- The table is wider than the screen, so it scrolls horizontally inside its container. Cell contents are never truncated/wrapped — the row stays on one line and the user scrolls sideways to see all languages.
- The # column and the JP Term column are "sticky": when the user scrolls right to view far-away languages, these two columns remain fixed at the left edge so the user always knows which term each row belongs to.
- In a normal (non-editing) row, any translation cell that is empty/blank shows an em-dash "—" placeholder instead of blank space.

**Per-row action buttons (Actions column), default state:**

- "Edit" button (pencil icon). Switches that single row into edit mode.
- "Delete" button (danger/red style, trash icon). Opens the styled "Delete term?" confirmation modal.

**Per-row action buttons, while a row is in edit mode:**

- "Save" button (primary, floppy-disk icon). Saves the row's edited translations.
- "Cancel" button (ghost style). Discards changes and returns the row to normal display.

**Edit mode (inline, in-place on the row):**

- All 14 translation cells (EN through HI) become text input boxes at once, pre-filled with their current values. The user can edit every language on that row simultaneously.
- The JP Term cell is NOT editable — it stays as bold read-only text. The # cell stays read-only.
- When edit mode opens, focus jumps to the EN input.
- Only one row can be in edit mode at a time.
- On Save, at least 2 of the 15 language values (the read-only JP Term plus the 14 translation cells) must remain non-empty after trimming.

**Add Term modal** (see Modals & Popups section).

**Toast area:** bottom-right corner; transient success/info messages appear here and auto-dismiss after about 2.6 seconds.

### Modals & Popups

**Add Term modal** — opened by the "Add Term" button.

- Header title: "Add Term".
- Body fields (top to bottom):
  - "JP Term" — text input (no required asterisk). Placeholder: "e.g. マンション". A duplicate-term inline error line sits directly under this field (hidden by default), text: "This JP term already exists."
  - Helper text above the language grid (exact): "Fill in at least 2 language values."
  - A 2-column grid of 14 language inputs, in this order, each a plain text input with no asterisk or "(optional)" suffix: "EN", "ZH-TW", "ZH-CN", "KO", "TH", "DE", "FR", "ES", "IT", "AR", "PT", "ID", "VI", "HI".
  - The duplicate-term error appears only when the user tries to save a (non-empty) JP term that already exists.
- Footer buttons:
  - "Cancel" (ghost) — closes the modal without saving.
  - "Save" (primary) — validates and saves the new term.
- Ways to close the modal: click "Cancel", click outside the modal on the dark backdrop, or press the Escape key.
- On open, all fields are cleared and focus jumps to the JP Term field.

**Delete term? modal** — opened by a row's "Delete" button (styled modal; replaces the old browser confirm).

- Header title: "Delete term?".
- Body message (exact): `Permanently delete the term "{JP Term}"? This action cannot be undone.` where {JP Term} is the row's JP term.
- Footer buttons:
  - "Cancel" (ghost) — closes the modal without deleting.
  - "Delete" (danger style) — permanently removes the row.
- Ways to close without deleting: click "Cancel", click the dark backdrop, or press Escape.

There are no other modals or drawers.

### Conditional Display

- Empty translation cell (view mode): shows "—" instead of being blank. Condition: that language has no value for the row.
- Duplicate-JP error line in the Add modal: hidden by default; shown only when the user clicks Save with a non-empty JP term that duplicates an existing one (case-insensitive). It is hidden again as soon as the user types in any field of the Add modal.
- Edit vs. view row: a row shows Edit + Delete buttons by default; when placed in edit mode it instead shows Save + Cancel, and its 14 translation cells become input boxes. Only the row currently being edited changes; all other rows stay in view mode.
- Table body vs. empty state: when there are rows to show, the table lists them; when there are none, a single full-width empty-state message replaces the rows (exact text in Empty States).
- Sticky columns: the # and JP Term columns visually pin to the left only when the table is scrolled horizontally; otherwise they look like normal columns.

### User Flows

**Search / filter terms**

1. User types in the search box.
2. On each keystroke the table re-filters live: only rows whose JP term or any of the 14 translations contain the typed text (case-insensitive) remain.
3. The result count updates to "Showing X of Y terms".
4. If nothing matches, the no-match empty state shows. Clearing the box restores all rows.

**Add a new term**

1. User clicks "Add Term". The modal opens with empty fields; focus on JP Term.
2. User enters any combination of the 15 language values (JP Term plus the 14 translations); none is individually required.
3. User clicks "Save".
4. If fewer than 2 of the 15 values are filled in (after trimming) → a toast "Please fill in at least 2 language values." appears and nothing is saved.
5. If the (non-empty) JP Term duplicates an existing one (case-insensitive) → the inline error "This JP term already exists." shows in the modal; nothing is saved.
6. On success → the modal closes, the new term is added to the table (appended as the last row), data is saved to local storage, and the success toast "Term saved successfully." appears.

**Edit a row**

1. User clicks "Edit" on a row. All 14 translation cells on that row turn into pre-filled input boxes; the JP Term stays read-only; Save/Cancel buttons replace Edit/Delete. Focus goes to the EN input.
2. User changes any translations.
3. User clicks "Save". If fewer than 2 of the 15 values (the read-only JP Term plus the 14 cells) remain non-empty after trimming → a toast "Please fill in at least 2 language values." appears and the row stays in edit mode. Otherwise all 14 values are saved (each trimmed of surrounding spaces), data is persisted, the row returns to view mode, and the success toast "Term updated successfully." appears.
4. Or the user clicks "Cancel" → edits are discarded and the row returns to view mode unchanged.

**Delete a row**

1. User clicks "Delete" on a row.
2. The styled "Delete term?" modal appears with the message `Permanently delete the term "{JP Term}"? This action cannot be undone.`
3. If the user clicks "Delete" → the row is removed, the data is persisted, the table re-renders (remaining rows renumber), and the success toast "Term deleted successfully." appears.
4. If the user clicks "Cancel" (or closes the modal) → nothing happens.

### Validation

**Add Term modal:**

- At least 2 of the 15 language values (JP Term + the 14 translations) must be provided. The count is taken over non-empty values after trimming. If fewer than 2 are filled → blocked, toast: "Please fill in at least 2 language values." No single field is individually required.
- JP Term, if non-empty, must be unique, compared case-insensitively against existing terms. If a duplicate → blocked, inline error shown in the modal with exact text: "This JP term already exists."
- All entered values are trimmed of leading/trailing whitespace when saved.

**Inline row edit:**

- At least 2 of the 15 language values (the read-only JP Term plus the 14 editable cells) must remain non-empty after trimming. If fewer than 2 → blocked, toast: "Please fill in at least 2 language values." The row stays in edit mode.
- The JP Term is not editable; any individual translation cell may be blank as long as the at-least-2 rule holds.
- All values are trimmed when saved.

No other field-level format/length validation exists.

### Empty States

- Glossary has no terms at all (table body empty): a single centered message spanning the full table width — exact text: "No terms added yet."
- Search returns no matches (but terms exist): a single centered message spanning the full table width — exact text: "No terms match your search."
- Result count when nothing matches: "Showing 0 of Y terms".

### Notifications & Feedback

Success/info toasts (green, bottom-right, auto-dismiss ~2.6s):

- "Term saved successfully." — after successfully adding a term in the Add modal.
- "Term updated successfully." — after successfully saving an inline edit.
- "Term deleted successfully." — after a confirmed delete.
- "Please fill in at least 2 language values." — when adding or inline-editing with fewer than 2 of the 15 language values filled in.

Inline error (red text inside the Add Term modal):

- "This JP term already exists." — duplicate JP term on Save.

Confirm modal (styled, not a browser dialog):

- "Delete term?" title with body `Permanently delete the term "{JP Term}"? This action cannot be undone.` and Cancel | Delete (danger) buttons — before deleting a row.

### Navigation

- Reached only from: Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Translation Glossary".
- This is a leaf screen: no tabs, no links to other screens, no breadcrumbs.
- Persistence: all glossary data is stored in the browser's local storage under the key "yuushi.translationGlossary" as a flat list of rows (one JP term plus its 14 translations per row). Data survives page reloads. On first load (or if the stored value is in an old/invalid format), the screen seeds itself with 5 sample real-estate terms (マンション, 一戸建て, 土地, アパート, 店舗) and saves them. Every add, inline-edit save, and delete writes back to this key immediately.
