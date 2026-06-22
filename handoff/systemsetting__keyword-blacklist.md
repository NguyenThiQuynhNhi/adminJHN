## Keyword Blacklist

**Purpose:** Lets an admin manage a list of prohibited keywords separately for each supported language. Listings that contain these terms as independent (standalone) words are flagged automatically (the matching/flagging itself happens downstream; this screen only maintains the lists). Matching is by independent word, not substring — e.g. 詐欺 inside 詐欺師 is NOT flagged. Duplicate checks within a language are case-insensitive. Each language keeps its own independent list.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Keyword Blacklist". Opens inside the admin shell content area. No role restriction is shown beyond being inside the admin portal.

### Layout & Structure

Top to bottom:

1. **Page title** "Keyword Blacklist".
2. **Language tab bar** — a single horizontal row of 15 pill-shaped tabs, one per language. The bar scrolls horizontally on narrow viewports (no wrapping; horizontal overflow with scroll). Tapping a tab switches which language's keyword list is shown below. Exactly one tab is active at a time. On first load the active tab is **JA** (Japanese).
3. **Keyword card** for the currently selected language, containing:
   - A card header with a title that reads "{LANG} keywords" (e.g. "JA keywords", "HI keywords") on the left and an **Add Keyword** button on the right.
   - A **keyword table** listing every prohibited keyword for the selected language.

There is one card/table visible at a time — it always reflects the active language tab. Switching tabs re-renders the same card with that language's data.

### Every Element

**Language tabs (15 total, in this exact left-to-right order):**

1. JA (Japanese) ← default active tab on load
2. EN (English)
3. ZH-TW (Traditional Chinese)
4. ZH-CN (Simplified Chinese)
5. KO (Korean)
6. TH (Thai)
7. DE (German)
8. FR (French)
9. ES (Spanish)
10. IT (Italian)
11. AR (Arabic)
12. PT (Portuguese)
13. ID (Indonesian)
14. VI (Vietnamese)
15. HI (Hindi)

The active tab is a solid primary-gold pill (#8B7340 background, #6F5C33 border, white text). Inactive tabs are white pills with a #e0e0e0 border and muted text (#7a6a5c). The tab bar does not wrap; it scrolls horizontally when the viewport is too narrow to fit all 15 tabs.

**Card header:**

- **Title** — dynamic text "{LANG} keywords" matching the active tab.
- **Add Keyword button** — primary (gold) button with a plus icon, labelled "Add Keyword". Opens the Add Keyword modal for the currently selected language.

**Keyword table — columns in this exact order:**

1. **#** — sequential row number, starting at 1, for the current language's list.
2. **Keyword** — the prohibited keyword text (shown in bold).
3. **Added date** — the timestamp the keyword was added, formatted `YYYY-MM-DD HH:MM`. If somehow missing it shows a dash "—".
4. **Actions** — right-aligned; contains a per-row **Delete** button (danger style, trash icon, label "Delete").

The table has no search, no filter, no sort, no pagination, and no column for editing — keywords are add-and-delete only.

**Seed data (first-time load only):** All 14 non-Japanese languages start empty. **JA** is pre-populated with 5 keywords — 詐欺, 偽物, 違法, 無許可, 架空 — each with Added date "2026-05-01 09:00".

### Modals & Popups

**Add Keyword modal** (opened by the Add Keyword button):

- **Title:** "Add Keyword — {LANG}" where {LANG} is the currently selected language tab (e.g. "Add Keyword — JA").
- **Field:** "Keyword" with a required marker (red asterisk). Single-line text input, placeholder "Prohibited keyword". Auto-focused when the modal opens.
- **Inline error area** (hidden by default) — shows the duplicate error text when triggered.
- **Footer buttons:** "Cancel" (closes the modal without saving) and "Save" (validates and adds the keyword).
- **Ways to close:** Cancel button, clicking the dark backdrop outside the modal, or pressing the Escape key. The input is cleared and any error is hidden each time the modal is opened.

**Delete keyword modal** (styled in-page modal — replaces the old browser confirm dialog):

- **Title:** "Delete keyword?"
- **Message:** `Delete the keyword "{Keyword}" from the {LANG} blacklist? This action cannot be undone.` where {Keyword} is the row's keyword text and {LANG} is the active language.
- **Footer buttons:** "Cancel" (closes without deleting) and "Delete" (danger style, trash icon — removes the keyword).
- **Ways to close:** Cancel button, clicking the dark backdrop, or pressing Escape (all cancel the pending deletion).

There are no other modals or drawers.

### Conditional Display

- **Table rows vs. empty state:** If the selected language has at least one keyword, the table shows the rows. If the selected language has zero keywords, the empty-state message is shown instead (see Empty States). Condition: the current language's keyword list is empty.
- **Duplicate inline error:** The "This keyword already exists in this language." error is hidden by default and only displayed when Save is pressed with a keyword that already exists in the current language (case-insensitive). It is hidden again as soon as the user types in the input, and whenever the modal is reopened.
- **Card title and modal titles text:** The card title, Add modal title, and Delete modal message all change dynamically to reflect the currently selected language (and, for delete, the targeted keyword).

### User Flows

**Switch language tab:**

1. User clicks a different language tab.
2. That tab becomes active; the card title updates to "{LANG} keywords"; the table re-renders to show only that language's keywords (or its empty state). No save/confirmation needed.

**Add a keyword:**

1. User selects the target language tab.
2. User clicks "Add Keyword". The modal opens titled "Add Keyword — {LANG}" with an empty, focused input.
3. User types the keyword and clicks Save.
4. If the trimmed input is empty → a "Keyword is required." toast appears and nothing is added.
5. If the trimmed input is longer than 100 characters → a "Keyword cannot exceed 100 characters." toast appears and nothing is added.
6. If the keyword already exists in this language (case-insensitive) → the inline error "This keyword already exists in this language." shows and nothing is added.
7. Otherwise the keyword is added with the current timestamp as Added date, the modal closes, the table refreshes (new row at the bottom), and a "Keyword added successfully." toast appears.

**Delete a keyword:**

1. User clicks "Delete" on a row.
2. The styled "Delete keyword?" modal appears with the message `Delete the keyword "{Keyword}" from the {LANG} blacklist? This action cannot be undone.`
3. If the user clicks Cancel (or backdrop / Escape) → nothing happens.
4. If the user clicks Delete → the row is removed, the table re-renders (row numbers re-sequence), and a "Keyword deleted successfully." toast appears.

### Validation

- **Keyword required:** The keyword is trimmed of surrounding whitespace. If the result is empty, saving is blocked and a toast shows: "Keyword is required."
- **Keyword length:** After trimming, the keyword must be 1–100 characters. If it exceeds 100 characters, saving is blocked and a toast shows: "Keyword cannot exceed 100 characters." (Note: the input itself carries `maxlength="200"`, so the browser allows up to 200 typed chars, but the on-Save check enforces the stricter 100-char limit.)
- **Duplicate keyword (case-insensitive, per language):** Before adding, the entered keyword is compared (lowercased) against existing keywords in the same language. If a match exists, saving is blocked and the inline modal error shows the exact text: "This keyword already exists in this language." Duplicates are allowed across different languages — the check is scoped to the active language only.
- No character-set or format restrictions are applied beyond the length cap.

### Empty States

- **Empty keyword list for a language:** When the selected language has no keywords, the table body shows a centered message: "No keywords added yet for this language." (spanning all columns).

### Notifications & Feedback

All toasts appear bottom-right, auto-dismissing after ~2.6 seconds. Success toasts use a green accent; validation toasts use a danger (#b23b3b) accent.

- **Keyword added (success toast):** "Keyword added successfully."
- **Keyword deleted (success toast):** "Keyword deleted successfully."
- **Required validation (toast):** "Keyword is required."
- **Length validation (toast):** "Keyword cannot exceed 100 characters."
- **Duplicate (inline modal error, not a toast):** "This keyword already exists in this language."
- **Delete confirmation (styled in-page modal):** title "Delete keyword?", message `Delete the keyword "{Keyword}" from the {LANG} blacklist? This action cannot be undone.`, buttons Cancel / Delete.

### Navigation

- This is a leaf screen — no links out to other screens, no back button, no breadcrumbs.
- The 15 language tabs switch the displayed list only; they are not URL routes and do not change the address.
- **Persistence:** The full per-language blacklist is stored in the browser under localStorage key `yuushi.keywordBlacklist`, structured as an object keyed by language code, each value an array of `{keyword, addedDate}` entries. Changes (add/delete) are saved immediately and survive page reloads. On first ever load the seed data (JA's 5 keywords; all other languages empty) is written. On subsequent loads, any of the 15 language keys that are missing are backfilled to an empty array without overwriting existing keywords for the other languages. (Legacy entries stored with an `addedAt` field still render correctly in the Added date column.)

### Design System / Visual Tokens

- Page background #f5f5f5; cards #fff with 1px #e0e0e0 border and 12px radius.
- Primary action color is gold #8B7340 (darker border #6F5C33) with #fff text; muted text #7a6a5c.
- Danger color #b23b3b with a soft danger background #fbe9e9 (used by Delete buttons and validation accents).
- Border radii: 6px (small), 8px (medium — inputs/toasts), 12px (cards/modals), 999px (pills — tabs and buttons).
