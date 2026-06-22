## Visibility Control (CMS Homepage Management)

**Purpose:** A single admin control panel that decides which sections appear on the public-facing pages (Homepage, Area Guide page, Sell page, Property Detail page) and what content each section displays. From here an admin can: pick the "Attractive Properties" shown on the homepage, choose the 12 "Famous Prefectures" (and edit each prefecture's photo + description), add/edit/delete customer Testimonials, pick Video Articles and Articles from the Insight library, choose homepage and Sell-page FAQs, choose "Famous Cities" for the Area Guide, upload Excel files for "Popular Estates" and "Land Prices" tables, and turn every section on or off with a visibility switch. There is also a toggle for the "Average Property Price" block on property detail pages.

**Access:** Admin sidebar → CONTENT MANAGEMENT → "Visibility Control". The screen opens inside the admin shell's content area. There is no separate URL, login, or role gate inside the screen itself.

---

### Layout & Structure

The screen is one long scrolling page made of two grouped areas, each titled with a heading. Inside each area are "setting cards." Every card follows the same shape: a left side with the section's name and a short description, and a right side with a visibility ON/OFF switch plus one or more buttons. Some cards also show a live preview (grid, carousel, or table) and a "Save changes" button underneath.

**Area 1 — heading "Homepage section management"** contains these cards:

1. **Properties sections (Attractive Properties)**
   - Name: "Attractive Properties".
   - Right side: visibility switch (default ON) + button "Customize selection".
   - Below: a horizontal scrolling carousel preview of the selected properties.
   - Bottom: "Save changes" button.

2. **Famous Prefecture list**
   - Name: "Section visibility" (this card has no description line).
   - Right side: visibility switch (default ON) + button "Customize prefectures".
   - Sub-heading "Homepage preview", a counter line "X / 12 prefectures selected", then a 6-column image grid (12 slots; empty ones show "Empty slot").
   - Bottom: "Save changes" button.

3. **Testimonials**
   - Name: "Section visibility". Description: "Toggle testimonial section ON / OFF".
   - Right side: visibility switch (default ON) + button "Save".
   - Sub-heading "Testimonials list", then a table.
   - Below the table: button "Add testimonial".

4. **Video Article section**
   - Name: "Section visibility". Description: "Toggle the video carousel ON or OFF. Items are selected from Insight Management (video entries)."
   - Right side: visibility switch (default ON) + button "Save".
   - Sub-heading "Selected video articles", then a table.
   - Below: button "Add Video Article".

5. **Article section** — **4 fixed slots, change-only.**
   - Name: "Section visibility". Description: "Toggle article block ON / OFF. Items are selected from Insight Management."
   - Right side: visibility switch (default ON) + button "Save".
   - Sub-heading "Featured & secondary articles (4 fixed slots)", then a table with exactly 4 rows (Slot 1–4). There is **no** "Add article" button and **no** per-row Remove (trash) icons.
   - Each row: Slot (e.g. "Slot 1") | Title | Type | Category | a "Change" button. An empty slot shows the single-cell text "No article selected — click Change to pick one." spanning the Title/Type/Category columns.

6. **FAQ section** (homepage)
   - Name: "Section visibility". Description: "Toggle FAQ block ON / OFF. FAQs are selected from the central FAQ repository (Insight Management)."
   - Right side: visibility switch (default ON) + button "Save".
   - Sub-heading "FAQ management", then a table.
   - Below: button "Add FAQ".

**Area 2 — heading "Other section management"** contains these cards:

7. **Average Property Price in the area**
   - Name: "Average Property Price in the area". Description: "Show or hide this section on Property Detail pages."
   - Right side: visibility switch (default ON) + button "Save". (No preview, no list.)

8. **Famous Cities list** — **no selection limit.**
   - Name: "Section visibility". Description: " Controls which cities are highlighted on the Area Guide page."
   - Right side: visibility switch (default ON) + button "Customize cities".
   - Sub-heading "Area Guide preview", counter line "X featured cities" (no "/ 12"), then a 6-column image grid showing **all** selected cities (no 12-slot placeholders / no "Empty slot" tiles). When none are featured, an empty-state message "No featured cities yet — use 'Customize cities'." is shown instead.
   - Bottom: "Save changes" button.

9. **Popular Estates**
   - Name: "Popular Estates". Description: "Show/hide section on Area Guide page and upload source Excel file."
   - Right side: visibility switch (default ON) + button "Upload Excel" + button "Save".
   - Sub-heading "Live display preview", then a 3-column grid of city cards (each a small table).

10. **Land Prices**
    - Name: "Land Prices". Description: "Show/hide section on Area Guide page and upload source Excel file."
    - Right side: visibility switch (default ON) + button "Upload Excel" + button "Save".
    - Sub-heading "Live display preview", then a row of city tabs and a table for the selected tab.

11. **FAQ section on Sell Page**
    - Name: "Section visibility". Description: "Toggle FAQ block ON / OFF. FAQs are selected from the central FAQ repository."
    - Right side: visibility switch (default ON) + button "Save".
    - Sub-heading "FAQ management", then a table.
    - Below: button "Add FAQ".

Modals (pop-ups) used by the screen: Testimonial editor, Testimonial delete confirm, Property picker, Famous Prefecture picker, Famous Cities picker, Insight (Video/Article) picker, FAQ picker, Popular Estates Excel preview, Land Prices Excel preview. Brief success/error messages ("toasts") appear bottom-right and disappear after about 2.6 seconds.

---

### Every Element

**Visibility switches (one per card, 11 total):** On/off sliders. All start ON. Switch IDs map to: Attractive Properties, Famous Prefecture, Testimonials, Video Article, Article, Homepage FAQ, Average Property Price, Famous Cities, Popular Estates, Land Prices, Sell-Page FAQ. Flipping a switch saves its state immediately (the switch state is also saved by the card's "Save" button). The switch only records visibility; it does not clear the chosen content.

**Buttons present on the cards:**

- "Customize selection" (Attractive Properties) → opens Property picker.
- "Save changes" (Attractive Properties) → saves the current attractive list.
- "Customize prefectures" (Famous Prefecture) → opens Prefecture picker.
- "Save changes" (Famous Prefecture) → saves the chosen prefecture list.
- "Save" (Testimonials, Video, Article, Homepage FAQ, Average Price, Popular Estates, Land Prices, Sell FAQ) → saves that card's visibility switch and shows a confirmation toast.
- "Add testimonial" → opens Testimonial editor in "new" mode.
- "Add Video Article" → opens Insight picker (video mode).
- "Add FAQ" (homepage and Sell) → opens FAQ picker for that target.
- "Customize cities" (Famous Cities) → opens Famous Cities picker.
- "Save changes" (Famous Cities) → saves the featured-cities list.
- "Upload Excel" (Popular Estates and Land Prices) → opens the OS file chooser.

**Attractive Properties carousel preview (per property card):** thumbnail image, a delete "×" overlay (removes that property from the selection immediately and saves), property name, and a sub-line "City • Property type". Empty state placeholder text: `No properties selected yet — use "Customize selection".`

**Famous Prefecture preview grid:** up to 12 image tiles, each with the prefecture's English name overlaid; unfilled positions show "Empty slot". Counter above shows "X / 12 prefectures selected".

**Famous Cities preview grid:** one image tile per featured city (no limit, no placeholders), each with city name and prefecture sub-line. Counter shows "X featured cities". Empty state when none featured: "No featured cities yet — use 'Customize cities'.".

**Tables on the cards:**

- _Testimonials table_ — columns: Avatar, Name, Content, Status, Actions. Status shows a green "Published" or amber "Draft" badge. Actions: Edit (pencil) and Delete (trash). Long content is shortened with "…" and the full text shows on hover.
- _Video Article table_ — columns: Title, Type, Category, Actions. Actions: Remove (trash) only.
- _Article table_ — **exactly 4 fixed rows (Slot 1–4)**; columns: Slot, Title, Type, Category, Actions. Actions has only a "Change" button (opens the Insight picker in single-select / radio mode to replace that slot). There is no Add and no Remove. Empty slots show "No article selected — click Change to pick one." across the Title/Type/Category cells.
- _Homepage FAQ table_ and _Sell FAQ table_ — columns: Question, Order, Actions. Order column has an Up arrow (disabled on the first row) and a Down arrow (disabled on the last row) to reorder. Actions: Remove (trash).
- _Popular Estates live preview_ — one card per city; each card has a header with the city name and a table with columns Estate, Indices, Change. Indices show as "¥" plus a thousands-separated number. Change shows "↑ +N.NN%" in green or "↓ -N.NN%" in red. Max 5 rows per city.
- _Land Prices live preview_ — a row of city tabs (one per city; the active tab is highlighted) and a heading "{City} – Ward Station Land Price Ranking", then a table with columns Rank, Station, Average land price (yen/m²), Average price per tsubo (yen/tsubo), Fluctuation rate. Rank shows a large number plus an ordinal "{n}th place". Station appears as a blue underlined link (not clickable here). Fluctuation shows a green "↑ +N.NN%" or red "↓ -N.NN%" pill. Max 5 rows per city.

---

### Modals & Popups

**1. Testimonial editor**

- Opens as "Add testimonial" (title "New testimonial", subtitle "Add a testimonial for the homepage carousel.") or row Edit (title "Edit testimonial", subtitle "Update image, name, review and status.").
- Fields (in order, all required, each label carries a red asterisk "\*"):
  1. **Avatar \*** — image upload, accepts JPG/PNG/WEBP only, max 5MB; shows a square preview. Helper line: "JPG, JPEG, PNG or WEBP. Max 5MB."
  2. **Name \*** — text, max 255 chars, placeholder "Enter name or company".
  3. **Content \*** — multi-line text, max 1000 chars, placeholder "Write the testimonial content here".
  4. **Status \*** — dropdown, options verbatim "Published" / "Draft"; **defaults to "Draft"**.
- (The previous Role, Author, and Last Updated fields no longer exist.)
- Footer buttons: "Cancel" and "Save".
- Close behavior: "×" top-right, "Cancel", click on the dark backdrop, or Escape key.

**1b. Testimonial delete confirm**

- Opens from a testimonials-row trash icon. Title "Delete testimonial?", body message 'Delete the testimonial by "{Name}"? This cannot be undone.' ({Name} is the testimonial's name).
- Footer buttons: "Cancel" and "Delete" (danger style).
- On "Delete": removes the testimonial, re-renders the table, and shows toast "Testimonial deleted."
- Close behavior: "×" top-right, "Cancel", click on the dark backdrop, or Escape key (all dismiss without deleting).

**2. Property picker** (title "Select property" — rebuilt to mirror the Email Center "Insert property" picker)

- Source list: a single pool of properties drawn from Property Management. It contains both **regular listings** (IDs like `PROP-581xx`, groups 1/2/3) and **New Development projects** (IDs like `PRJ-xxxx`, groups 5/6, seeded from Project Management — e.g. Shinonome Condominium, Umeda Sky Towers, Minato Grand Terrace, Karuizawa Villa Development, Kohoku New Town Houses, Kawagoe Heritage Homes). New-dev projects are a special kind of property and appear here alongside regular ones, visibly tagged "New Dev". Searching and filtering include both kinds.
- Filter bar (consistent with the Email Center picker):
  - Status dropdown (verbatim): "Status: All", "Published", "Members Only".
  - Listing Type dropdown (verbatim): "Listing Type: All", "For Sale", "For Rent", "Sale + Rent".
  - Property Type dropdown: first option "Property Type: All"; remaining options are the distinct property types from the pool, sorted alphabetically.
  - Prefecture dropdown: first option "Prefecture: All"; remaining options are the distinct prefectures from the pool, sorted alphabetically.
  - Kind dropdown (verbatim): "Kind: All", "Regular listings", "New Development".
  - Search box, placeholder "Search by name or ID" (matches property name and ID only).
  - View toggle: "Table" (default) and "Grid".
- Result count: a line above the results reads "{N} properties found" (singular "property" when one).
- Body: results as a multi-select list (checkboxes, because the homepage Attractive section displays a carousel of several properties).
  - Table view columns: [checkbox], Property (name + a "New Dev" badge when applicable + ID), Type, Listing Type, Price, Address (Prefecture · City), Status (green Published / amber Members Only). Selected rows are highlighted.
  - Grid view: image card per property with a checkbox; title (with a "New Dev" badge prefix where applicable), ID • Type, Prefecture · City • Listing Type, and price.
- Pagination: 10 properties per page; a Prev / "Page X of Y" / Next pager appears under the results and is hidden when there are 10 or fewer matches.
- Footer: left text "X selected", "Cancel", "Confirm selection".
- Pre-selection: opens with the currently chosen attractive properties already ticked; page resets to 1 on open.
- Close: "×", "Cancel", backdrop, Escape.

**3. Famous Prefecture picker** (title "Select famous prefectures")

- Top section "Selected (homepage order)": an ordered table of the currently chosen prefectures with columns Order (Up/Down arrows; Up disabled on first, Down disabled on last), Image (thumbnail), Prefecture (name), and a "Remove" button. Empty state: "No prefectures selected yet — add up to 12 below."
- Below: a filter box "Filter prefectures by name" with a counter "X / 12 selected".
- "All prefectures" table: columns [checkbox], Image, Prefecture, Description, and an Edit (pencil) button (tooltip "Edit image & description"). Checkboxes for not-yet-selected prefectures become disabled once 12 are already selected. The source list contains all 47 Japanese prefectures (from the Locations master list).
- **Inline per-row edit (pencil):** expands an editor row directly under the prefecture, showing: a large image preview, an image upload (images only), a "Description (English) \* — {Prefecture name}" multi-line text box (placeholder "Short English description…", pre-filled with the current description), and buttons "Save" and "Cancel". Saving writes the new image and/or description back to the shared Locations master data (`yuushi.locations`) and refreshes the homepage preview thumbnails. This is now the only editor for the 47-prefecture master list.
- Footer: left text "X / 12 selected", "Cancel", "Confirm selection".
- Close: "×", "Cancel", backdrop, Escape.

**4. Famous Cities picker** (title "Customize famous cities")

- Filter box "Filter by city / prefecture".
- Table columns: Image, City, Prefecture, Status (green Published / amber Draft), Featured (a checkbox labeled "Featured"), Order (a number input, minimum 1, whole numbers).
- Display order behavior: auto-shift on conflict. Order must be a unique whole number ≥ 1. When the admin sets a city to order N while another city already holds N, the conflicting city is bumped by +1, cascading until every order is unique. This runs on the Order field's change/blur and the picker table re-renders immediately; on Confirm the normalized orders are written back to `yuushi.areaGuides` and the resulting featured list to `yuushi.famousCities`. No error toast — the conflict is silently resolved.
- Footer: left text "X featured", "Cancel", "Confirm".
- Empty states: if there are no city guides at all — "No city guides found. Create city guides in Insight Management first."; if the filter excludes everything — "No cities match the filter."
- Close: "×", "Cancel", backdrop, Escape.

**5. Insight picker** (Video / Article). Title and subtitle change by mode:

- Add Video mode: title "Select Video Articles", subtitle "Insight Management — video entries (multi-select)."; the Type filter is locked to "Video" and disabled; confirm button reads "Add selected".
- Change Article mode (from a slot's "Change" button — the **only** article flow now): title "Change article", subtitle "Pick one item to replace this slot."; selection uses radio buttons (single choice); confirm button reads "Replace". Picking one item replaces that fixed slot (Slot 1–4). (The old multi-select "Add Article" flow has been removed.)
- Filter bar:
  - Type dropdown (verbatim): "Type: All", "Article", "News", "Video".
  - Category tag dropdown: first option "Category tag: All"; remaining options are the distinct categories from the Insight list, sorted (currently Blog, Guides, Investment, Japan, Market analysis, Real estate).
  - Search box, placeholder "Search by title".
- Table columns: [select], ID, Title, Type, Category tag.
- Footer: left text "X selected", "Cancel", confirm button (text per mode above).
- Empty state: "No content matches the filters."
- Close: "×", "Cancel", backdrop, Escape.

**6. FAQ picker.** Title changes by target: "Add FAQs — Homepage" or "Add FAQs — Sell Page".

- Filter bar: Search box "Search FAQ question"; Status dropdown (verbatim): "All status", "Published", "Draft".
- Table columns: [checkbox], Question, Status (green Published / amber Draft), Author. FAQs already added to the current list have a disabled checkbox (tooltip "Already added") and show an "added" badge next to the question.
- Footer: left text "X selected", "Cancel", "Add selected".
- Empty state: "No FAQs match."
- Close: "×", "Cancel", backdrop, Escape.

**7. Popular Estates Excel preview** (title "Preview — Popular Estates")

- Body: a grid of city cards exactly like the live preview (one card per sheet/city; columns Estate, Indices, Change). Note line: "Review the parsed data, then Save to commit it to the live display."
- Footer: "Cancel", "Save".
- Close: "×", "Cancel", backdrop, Escape.

**8. Land Prices Excel preview** (title "Preview — Land Prices")

- Body: city tabs plus the land-price ranking table for the active tab (columns Rank, Station, Average land price (yen/m²), Average price per tsubo (yen/tsubo), Fluctuation rate). Same note line as above.
- Footer: "Cancel", "Save".
- Close: "×", "Cancel", backdrop, Escape.

---

### Conditional Display

- **Property picker results format** — shows Grid cards when "Grid" view is selected; otherwise a Table. Results are paginated (10 per page); the pager is hidden when there are 10 or fewer matches.
- **"New Dev" badge** — shown on a property only when it is a New Development project (groups 5/6, `PRJ-` IDs). Both the Table (next to the name) and Grid (as a title prefix) show the "New Dev" badge for those entries; regular listings show no badge.
- **Insight picker Type filter** — locked and disabled (forced to "Video") only in Add Video mode; editable in article modes.
- **Insight picker selection control** — radio buttons (pick one) in Change Article mode (article slots are change-only); checkboxes (pick many) in Add Video mode.
- **FAQ picker checkbox** — disabled (with "Already added" tooltip and an "added" badge) when that FAQ is already in the target list.
- **Famous Prefecture "all" list checkbox** — disabled for any unselected prefecture once 12 are already selected.
- **Reorder arrows** (FAQ tables and Prefecture selected list) — Up disabled on the first row, Down disabled on the last row.
- **Inline prefecture editor row** — visible only for the prefecture whose pencil was clicked; clicking the same pencil again hides it.
- **Status badges** — green "Published" badge when status is Published; amber badge ("Draft" or the raw status value) otherwise. Applies in Testimonials, Property picker, FAQ picker, Famous Cities picker.
- **Change / fluctuation arrows** — green up-arrow when the value is 0 or positive; red down-arrow when negative (Popular Estates and Land Prices).
- **Empty slots** — the Famous Prefecture preview grid still fills unused positions (up to 12) with "Empty slot" tiles. The Famous Cities preview grid does **not** use placeholders (no limit); it shows only the featured cities, or an empty-state line when none are featured.
- **Article slots** — always exactly 4 rows; a slot with no article shows "No article selected — click Change to pick one." Each row's only action is "Change".

---

### User Flows

**Edit Attractive Properties:** Click "Customize selection" → Property picker ("Select property") opens with current choices ticked → filter by Status / Listing Type / Property Type / Prefecture / Kind / Search and/or switch Table/Grid, paging through results 10 at a time → tick/untick properties (counter updates) → "Confirm selection" → carousel updates and a toast confirms. New Development projects (`PRJ-` IDs, tagged "New Dev") are selectable here alongside regular listings. Optionally remove a property directly from the carousel via its "×" (immediate). Click "Save changes" to persist the list.

**Add / edit / delete a Testimonial:** Click "Add testimonial" → editor opens blank (Status defaults to Draft) → upload an Avatar (JPG/PNG/WEBP, ≤5MB; preview updates), type Name (≤255), type Content (≤1000), choose Status → "Save" (Name, Content and Avatar are all required). To edit, click a row's pencil → editor pre-filled → change fields → "Save". To delete, click a row's trash → a styled confirmation modal "Delete testimonial?" (message 'Delete the testimonial by "{Name}"? This cannot be undone.') → click "Delete" to remove (toast "Testimonial deleted.") or Cancel/X/backdrop/Escape to dismiss.

**Add Video Articles:** Click "Add Video Article" → Insight picker opens locked to Video → filter/search → tick one or more → "Add selected" → rows added (duplicates skipped). Remove a video via its row trash (immediate).

**Change an Article (4 fixed slots):** The Article card always shows exactly 4 slots (Slot 1–4); there is no add or remove. To fill or replace a slot, click "Change" on that row → Insight picker opens in single-select (radio) mode (title "Change article") → pick one item → "Replace". The chosen item populates that slot; an unset slot shows "No article selected — click Change to pick one."

**Add / reorder / remove FAQs (Homepage or Sell):** Click "Add FAQ" → FAQ picker for that page → search/filter → tick FAQs not already added → "Add selected". Reorder with Up/Down arrows. Remove with row trash. Each list is independent (Homepage vs Sell).

**FAQ delete cascade (consumer side):** On every page load the screen validates the saved Homepage and Sell FAQ lists against the FAQ source and silently drops any FAQ whose id no longer exists (i.e. it was deleted in Insight Management), persisting the cleaned lists. The delete itself never happens here — this screen only removes stale references so the two FAQ tables stay consistent.

**Choose Famous Prefectures + inline edit:** Click "Customize prefectures" → picker opens with current selection shown in "Selected (homepage order)" → in the "all" list, tick up to 12 prefectures → reorder selected ones with Up/Down → optionally remove from the selected list → "Confirm selection" → homepage preview updates and a toast confirms. Inline edit: click a prefecture's pencil → editor row expands → upload a new image and/or edit the description → "Save" (writes to shared Locations data, refreshes preview, toast "{Prefecture} updated.") or "Cancel". Click "Save changes" on the card to persist the famous-prefectures list.

**Choose Famous Cities:** Click "Customize cities" → picker shows all city guides → tick "Featured" on the desired cities, set each "Order" number (unique whole numbers ≥ 1; conflicting orders auto-shift +1 on change/blur and the table re-renders) → "Confirm" → preview updates, normalized orders are written back to the city guides, and a toast confirms. Click "Save changes" on the card to persist the featured list.

**Excel upload → preview → save (Popular Estates):** Click "Upload Excel" → choose a .xlsx/.xls file → file is validated and parsed → preview modal opens showing the parsed city cards → review → "Save" commits the data to the live preview (toast "Popular Estates data saved.") or "Cancel" discards. (If parsing fails or the spreadsheet library is unavailable, sample demo data is shown in the preview instead.)

**Excel upload → preview → save (Land Prices):** Same as above but opens the Land Prices preview with city tabs; "Save" commits (toast "Land Prices data saved.").

**Toggle a section's visibility:** Flip the card's switch (saved immediately) and/or click that card's "Save" button to confirm with a toast.

---

### Validation

- **Testimonial — required fields:** On "Save" the checks run in order — if Name is empty (after trimming) show "Name is required."; else if Content is empty (after trimming) show "Content is required."; else if no Avatar has been provided show "Avatar is required." Saving is blocked until all three pass.
- **Testimonial avatar file:** the avatar accepts JPG/PNG/WEBP only — any other type shows "Invalid file type. JPG/PNG/WEBP only." and the file is cleared; files over 5MB show "Avatar must not exceed 5MB." and are cleared.
- **Excel file type:** Only files ending in ".xlsx" or ".xls" are accepted; otherwise error toast "Only .xlsx or .xls files are accepted." and the upload is cancelled.
- **Excel file size:** Maximum 10MB; otherwise error toast "File size must not exceed 10MB." and the upload is cancelled.
- **Insight picker — at least one item:** On confirm with nothing selected, error toast "Select at least one item." and the modal stays open (applies to both Add Video and Change Article).
- **FAQ picker — at least one FAQ:** On confirm with nothing selected, error toast "Select at least one FAQ." and the modal stays open.
- **Famous Prefecture limit:** Cannot select more than 12 prefectures; additional checkboxes are disabled once 12 are chosen. On confirm, only the first 12 are kept.
- **Famous Cities — no limit:** any number of cities may be featured (no 12-cap); the picker never disables checkboxes/toggles for a count.
- **Famous Cities Order:** Order accepts whole numbers ≥ 1 and must be unique; blank/invalid is treated as 1. Conflicts are auto-shifted (+1, cascading) on change/blur — silently resolved, no error toast.
- **Required-marker convention:** every required field across the screen and its modals carries a red asterisk "\*" after its label; there is no "(Optional)" text anywhere.
- No other field-level required checks exist.

---

### Empty States

- Attractive Properties carousel (none chosen): `No properties selected yet — use "Customize selection".`
- Testimonials table (none): "No testimonials yet."
- Video Article table (none): "No video articles selected."
- Article table — never globally empty (always 4 slots); a slot with no article shows "No article selected — click Change to pick one."
- Homepage FAQ / Sell FAQ table (none): "No FAQs selected."
- Popular Estates preview (no data): "No data."
- Land Prices table for a city (no rows): "No data for this city."
- Property picker (no matches): "No properties match the filters."
- Insight picker (no matches): "No content matches the filters."
- FAQ picker (no matches): "No FAQs match."
- Famous Prefecture picker — selected list (none): "No prefectures selected yet — add up to 12 below."
- Famous Cities picker — no city guides at all: "No city guides found. Create city guides in Insight Management first."
- Famous Cities picker — filter excludes all: "No cities match the filter."
- Famous Prefecture preview grid: unused positions show "Empty slot".
- Famous Cities preview grid (none featured): "No featured cities yet — use 'Customize cities'." (no "Empty slot" placeholders).

---

### Notifications & Feedback

**Success toasts (exact text):**

- "Attractive Properties saved." (Save changes on Attractive Properties)
- "{N} properties selected." (Property picker confirm)
- "Testimonial saved." (Testimonial editor save)
- "Testimonial deleted." (after confirming delete)
- "Content updated." (Insight picker confirm — applies to add video and replace article)
- "FAQs added." (FAQ picker confirm)
- "Famous Prefecture list saved." (Save changes on Famous Prefecture)
- "{Prefecture name} updated." (inline prefecture image/description save)
- "{N} prefectures selected." (Prefecture picker confirm)
- "Famous Cities list saved." (Save changes on Famous Cities)
- "Famous Cities updated." (Famous Cities picker confirm)
- "Popular Estates data saved." (Excel commit)
- "Land Prices data saved." (Excel commit)
- Card "Save" buttons show "{Section} saved." with these names: "Average Property Price saved.", "Popular Estates saved.", "Land Prices saved.", "Testimonials saved.", "Video Article saved.", "Article saved.", "Homepage FAQ saved.", "Sell-Page FAQ saved."

**Error toasts (exact text):**

- "Name is required."
- "Content is required."
- "Avatar is required."
- "Invalid file type. JPG/PNG/WEBP only."
- "Avatar must not exceed 5MB."
- "Only .xlsx or .xls files are accepted."
- "File size must not exceed 10MB."
- "Select at least one item."
- "Select at least one FAQ."

**Confirmation dialog (exact text):**

- Testimonial delete uses a styled modal (not a browser confirm): title "Delete testimonial?", message 'Delete the testimonial by "{Name}"? This cannot be undone.', buttons "Cancel" / "Delete" (danger). Only the "Delete" button proceeds; "×", "Cancel", backdrop, and Escape dismiss it.

No other alerts or confirmations exist.

---

### Navigation

- This screen has no in-screen navigation links of its own; it is reached from the sidebar and stays in the content area.
- **Persistence & cross-page data flow** (all saved locally and shared with other admin screens via these storage keys):
  - This screen's own content/visibility data: `yuushi.cmsHome.attractive`, `yuushi.cmsHome.testimonials`, `yuushi.cmsHome.video`, `yuushi.cmsHome.articles`, `yuushi.cmsHome.faqHome`, `yuushi.cmsHome.faqSell`, `yuushi.cmsHome.popularEstates`, `yuushi.cmsHome.landPrices`, and `yuushi.cmsHome.toggles` (the on/off state of all 11 visibility switches).
  - `yuushi.locations` — the shared Locations master list. This screen reads prefecture names, images, and descriptions from it, and the inline prefecture editor writes image/description changes back to it (the same record the Locations admin screen uses). If it does not yet exist, this screen seeds it with all 47 prefectures.
  - `yuushi.areaGuides` — the shared city-guide data (from Insight Management / Area Guide). The Famous Cities picker reads city guides from it and writes the "Featured" flag and display order back to it.
  - `yuushi.famousPrefectures` — the ordered list of chosen prefecture IDs (consumed by the public homepage).
  - `yuushi.famousCities` — the list of featured city IDs (consumed by the Area Guide page).
- **Downstream consumption (where each section appears publicly):** Famous Prefecture, Testimonials, Video Article, Article, and Homepage FAQ → public Homepage; Famous Cities, Popular Estates, Land Prices → Area Guide page; Sell-Page FAQ → Sell page; Average Property Price → Property Detail pages.
- Video Article and Article content is sourced from the Insight Management library; FAQs are sourced from the central FAQ repository.
