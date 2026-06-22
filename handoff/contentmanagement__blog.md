## Insights Management

**Purpose:** This is the single admin screen for managing all the editorial / informational content shown in the public-facing "Insights" section of the platform. From one place an admin curates four kinds of content: **Area guides** (city and area destination pages), **Articles** (long-form guides/blog posts), **News** (announcements and market news), and **FAQs** (question/answer help entries). The screen lets an admin browse, filter, paginate, create, edit, feature, reorder, and delete these content items. Saving uses styled success toasts (no native dialogs). Area guides persist in the browser; Articles, News and FAQs are in-memory demo stores (changes survive within the session but not a reload).

**Access:** Reached from the Admin sidebar → CONTENT MANAGEMENT → "Insight Management". It opens inside the admin shell's content area. There is no separate URL — the address bar does not change when this screen opens. The author of each content item is entered manually in every editor (an editable, **optional** **Author** field, placeholder "Enter author name"); when left blank the item stores "" and the table shows "—".

---

### Layout & Structure (sub-tabs Area guides / Articles / News / FAQs loaded via fetch)

The screen is a single card with a heading **"Insights Management"** at the top.

Directly under the heading is a horizontal row of four sub-tab buttons (pill-shaped). The currently selected sub-tab is highlighted green. The four sub-tabs, left to right, are:

1. **Area guides**
2. **Articles**
3. **News**
4. **FAQs**

Below the sub-tabs is a single content region that shows only the panel for the selected sub-tab; the other three are hidden. Each of the four panels is loaded on demand from a separate file the first time its tab is opened (lazy loading). Until a panel finishes loading, its area briefly shows placeholder text:
- Area guides → "Loading area guide content..."
- Articles → "Loading articles content..."
- News → "Loading news content..."
- FAQs → "Loading FAQ content..."

Each panel is loaded only once per session; switching away and back does not reload it.

**Default tab:** On first load the screen selects and shows the **Area guides** tab (it is highlighted and its panel is visible by default).

**Pagination (all four lists):** Every list paginates at **50 rows per page**. Above each table is a result-count line "Showing {start}–{end} of {total} {entity}" (entity = area guides / articles / news / FAQs). Below each table are pagination controls: **Previous | numbered pages (up to 7, with "…" for large ranges) | Next**. The controls are hidden when the list has 50 or fewer rows. The current page resets to 1 on any filter change, search typing, sort/status change, tab switch, or reload. Each list is seeded with 60+ demo rows to demonstrate paging.

The four content panels each have a distinct layout. In every panel the "New …" button(s) sit **inline as the first element(s) of the filter bar** (not below the table):
- **Area guides panel:** a filter bar (with two inline "New" buttons), a result-count line, a table of guides, and pagination.
- **Articles panel:** a category-tag manager box, a filter bar (with an inline "New article" button), a result-count line, a table of articles, and pagination.
- **News panel:** a category-tag manager box, a filter bar (with an inline "New news" button), a result-count line, a table of news, and pagination.
- **FAQs panel:** a filter bar (with an inline "New FAQ" button), a result-count line, a table of FAQs (with an Up/Down reorder column), and pagination.

Several editor pop-ups (modals) belong to this screen and are shared by the panels: a Blog/Article editor, a City guide editor, an Area guide editor, and a FAQ editor.

---

### Every Element

#### Sub-tab navigation
- Four buttons: **Area guides**, **Articles**, **News**, **FAQs**. Clicking one highlights it green, shows its panel, hides the others, and loads that panel's content if not already loaded.

#### Area guides panel
**Filter bar (two inline "New" buttons + two dropdowns):**
- **New city guide** (primary) and **New area guide** (secondary) buttons sit inline as the first two elements of the filter bar.
- **Level filter** — options (exact): "All level", "City guides", "Area guides".
- **Status filter** — options (exact): "All status", "Published", "Draft".
- (There is no visible search box in this panel. The underlying code can support a search field, but none is shown here.)

**Area guides table** — columns, in order:
1. **Title** — the guide's title, with a second line underneath reading "Updated {date/time}".
2. **Level** — a badge reading either "City guide" or "Area guide".
3. **Location** — for a city guide: "Prefecture / City"; for an area guide: "Prefecture / City / Area".
4. **Status** — a badge reading "Published" (green) or "Draft" (amber).
5. **Featured** — *only meaningful for city guides.* City rows show a clickable toggle button: "★ Featured" when featured, or "☆ Off" when not. Tooltip: "Toggle featured on Area Guide landing". Clicking it flips the state immediately (without opening the row). Area-guide rows show a plain dash "—" (area guides cannot be featured).
6. **Author** — the author's name, or "—" if none.
7. **Actions** (no header label, right-aligned) — an "Edit" button and a "Delete" button. Edit opens the City guide editor (for city rows) or the Area guide editor (for area rows).

**Inline "New" buttons (in the filter bar):**
- **New city guide** (primary) — opens the City guide editor (blank).
- **New area guide** (secondary) — opens the Area guide editor (blank).

**Seed data shown in the Area guides table (initial demo content):**
| Title | Level | Location | Status | Featured | Display order | Updated |
|---|---|---|---|---|---|---|
| Shibuya | City guide | Tokyo / Shibuya | Published | ★ Featured | 1 | 2026-04-21 09:30 |
| Osaka | City guide | Osaka / Kita | Published | ★ Featured | 2 | 2026-04-19 11:05 |
| Fukuoka | City guide | Fukuoka / Hakata | Draft | ☆ Off | 3 | 2026-04-18 16:40 |
| Yoyogi | Area guide | Tokyo / Shibuya / Yoyogi | Draft | — (n/a) | n/a | 2026-04-20 14:15 |

#### Articles panel
**Article category-tag manager (box at top):**
- Heading: "Article category tags".
- An **Add** button — opens the styled "Add category tag" input modal.
- A list of category tags, each shown as a chip with two small action buttons: a pencil (✎) to rename (opens the "Rename category tag" modal pre-filled) and a trash (🗑) to delete (styled confirm).
- Default category tags (if none saved yet): "Guides", "Blog", "Market analysis".

**Article filter bar (inline "New article" button + controls):**
- **New article** (primary) button sits inline as the first element of the filter bar.
- **Search by title** text input (placeholder "Search by title").
- **Category filter** dropdown — first option "All category tags", then one option per existing category tag.
- **Transaction type filter** dropdown — options (exact): "All transaction types", "None", "SellerGuide", "BuyerGuide", "Renter Guide".

**Articles table** — columns, in order: **Title**, **Category tag** (shown as a chip), **Transaction type**, **Status** (badge: "Published" green via `badge-success` / "Draft" amber via `badge-warning`; the label is the raw status string), **Author**, and an unlabeled actions column with a pencil (✎ Edit, tooltip "Edit article") and trash (🗑 Delete, tooltip "Delete article").

**Seed article rows:**
| Title | Category tag | Transaction type | Status | Author |
|---|---|---|---|---|
| Guide: reading floor plans | Guides | BuyerGuide | Published | Hana |
| Platform tips for new agents | Blog | SellerGuide | Draft | Yuki |
| Market insights — Q1 rental trends | Market analysis | Renter Guide | Draft | Michael |

(The **New article** button lives inline in the filter bar — see above — and opens the Blog/Article editor in "Article" mode.)

#### News panel
Structurally identical to the Articles panel.
- **News category-tag manager**: heading "News category tags", an **Add** button (opens the "Add category tag" modal), and a chip list with rename (✎, opens the "Rename category tag" modal) and delete (🗑, styled confirm). Default tags: "Japan", "Real estate", "Investment".
- **News filter bar**: an inline **New news** (primary) button as the first element; then "Search by title" input; category dropdown (first option "All category tags" then each tag); transaction-type dropdown with the same options as Articles ("All transaction types", "None", "SellerGuide", "BuyerGuide", "Renter Guide").
- **News table** — same columns as Articles: Title, Category tag (chip), Transaction type, Status (green "Published" via `badge-success` / amber "Draft" via `badge-warning` reflecting the row's status), Author, actions (✎ "Edit news", 🗑 "Delete news").

**Seed news rows:**
| Title | Category tag | Transaction type | Status | Author |
|---|---|---|---|---|
| Platform maintenance announcement | Japan | None | Published | Anna |
| New lending rules impact investment | Real estate | SellerGuide | Published | Emily |
| Tax basics for investors | Investment | None | Published | Jason |

(The **New news** button lives inline in the filter bar — see above — and opens the Blog/Article editor in "News" mode. If the editor function is unavailable, clicking it shows an info toast "The news editor is only available inside Insight Management.")

#### FAQs panel
**Filter bar (inline "New FAQ" button + controls):**
- **New FAQ** (primary) button sits inline as the first element of the filter bar.
- **Search FAQ question** text input (placeholder "Search FAQ question").
- **Status dropdown** — options (exact): "All status", "Published", "Draft".

**FAQs table** — columns, in order: **Question**, **Status** (badge: "Published" green / "Draft" amber), **Author**, **Order** (two buttons "↑" / "↓" to move the FAQ up/down — Up disabled on the first row, Down disabled on the last; both disabled while any search or status filter is active), and an unlabeled actions column (pencil ✎ "Edit FAQ", trash 🗑 "Delete FAQ").

FAQs are rendered from an in-memory store (`faqRecords`) defined in the hub; each FAQ carries a stable `faqId` (e.g. "FAQ-001"). The store is seeded with 60+ rows; the first four match the original demo content:
| Question | Status | Author |
|---|---|---|
| How do I book a viewing? | Published | Anna |
| How are yields calculated? | Published | John Doe |
| What fees are associated with buying? | Draft | John Doe |
| How do I list my property? | Draft | Michael |

(The **New FAQ** button lives inline in the filter bar — see above — and opens the FAQ editor.)

---

### Modals & Popups

#### 1. Blog / Article editor (used for both Articles and News)
A wide pop-up. The header title changes based on context:
- "New Blog — Article" or "Edit Blog — Article" (from the Articles panel)
- "New Blog — News" or "Edit Blog — News" (from the News panel)

Layout: a prominent **Title** field across the top, a **Short Description** field under it, then a two-part body — a **wide content editor on the left** and a **narrow settings sidebar on the right**.

Required-field convention (all editors): required fields show a red asterisk "*" after the label; optional fields have no asterisk and no "(Optional)"/"(Required)" suffix. **Author is optional in every editor** (Article, News, City guide, Area guide, FAQ) — no asterisk, no save-block; saving blank stores "" and the table shows "—".

Fields:
- **Title*** (large, prominent) — placeholder "Headline shown in cards and listings". Required.
- **Short Description** (optional, no suffix) — placeholder "Brief summary shown in previews (homepage, featured section). Leave blank to auto-generate." Maximum 160 characters. A live counter under the field shows "{count}/160" and turns red when 160 is reached. If left blank on save, a summary is auto-generated from the start of the content body.
- **Content body** (large text area, left side) — placeholder "Headings, paragraphs, quotes, images, embedded video URLs...".
- **Video status flag** (a read-only badge under the content body) — shows "No video" (grey) by default, and automatically switches to "Video Blog" (blue) when the content body contains a video reference (see Conditional Display). Saved records store `videoFlag = "Video Blog"` when a video is detected; the Visibility Control Video picker filters articles + news where `videoFlag === "Video Blog"`.

Settings sidebar (right side), titled "Settings":
- **Blog ID** — read-only; shows "AUTO-GENERATED" for new items, or the existing ID when editing.
- **Status** — a two-option toggle "Draft" / "Published"; defaults to Draft. Clicking flips it.
- **Category tag** — a dropdown. The options depend on which panel opened the editor:
  - Article mode options: "Guides", "Blog", "Market analysis" (or the current Article category tags if they have been edited).
  - News mode options: "Japan", "Real estate", "Investment" (or the current News category tags if edited).
  - (For reference, the static fallback options written into the page are: "Guides", "Blog", "Market Analysis", "Japan", "Real Estate", "Investment".)
- **Transaction type** — dropdown, options (exact): "None", "SellerGuide", "BuyerGuide", "Renter Guide". Default "None".
- **Property prefecture** — dropdown, options (exact): "None", "All Prefectures", "Specific Prefecture". Default "None".
- **Property type** — dropdown, options (exact): "None", "All Types", "Specific Type". Default "None".
- **Thumbnail asset** — a file picker (cleared each time the editor opens; not actually stored).
- **Author** — an editable text input (optional, no asterisk), placeholder "Enter author name". Blank for new items; pre-filled with the existing author when editing. Saving blank is allowed (stores "", shown as "—" in the table).

Buttons: **Cancel** (closes without saving) and **Save blog**. Close "×" in the header also cancels.

#### 2. City guide editor
Title: "New city guide" (creating) or "Edit city guide" (editing). Subtitle: "Create city guides in English with prefecture, city, hero image, subtitle, and descriptions." Two-column layout.

Fields:
- **Prefecture *** — dropdown, first option "Select prefecture", then the available prefectures (Tokyo, Osaka, Fukuoka).
- **City *** — dropdown, first option "Select city", populated based on the chosen prefecture.
- **Hero background image *** — file picker.
- **Subtitle** — text, placeholder "e.g. the capital city of Japan".
- **Intro section description *** — multi-line text, placeholder "Describe the city...".
- **Map section description** — multi-line text, placeholder "Describe the city location and transport links...".
- **Status** — Draft / Published toggle (default Draft).
- **Author** — editable text input (optional), placeholder "Enter author name". Blank allowed.
- **Featured on Area Guide landing** — a checkbox labeled "Show this city in the Famous Cities list". Default unchecked. (This is the same Featured flag shown in the Area guides table.)
- **Display order** — a number field (minimum 0), default 0. Controls ordering within the featured cities list.

Buttons: **Cancel** and **Save guide**. Close "×" cancels.

#### 3. Area guide editor
Title: "New area guide" (creating) or "Edit area guide" (editing); the static default header text is "Area guide editor". Subtitle: "Create area guides in English with prefecture, city, area, images, description, map notes, author and status." Two-column layout. **No Featured or Display-order fields** (only city guides can be featured).

Fields:
- **Prefecture *** — dropdown ("Select prefecture" then prefectures).
- **City *** — dropdown ("Select city", based on prefecture).
- **Area *** — dropdown ("Select area", based on city).
- **Hero background image *** — file picker.
- **Image carousel** — file picker allowing multiple files; hint text "Choose one or more images for the hero carousel."
- **Description *** — multi-line text, placeholder "Describe this area...".
- **Map section description** — multi-line text, placeholder "Describe the map location, access points and surroundings...".
- **Status** — Draft / Published toggle (default Draft).
- **Author** — editable text input (optional), placeholder "Enter author name". Blank allowed.

Buttons: **Cancel** and **Save guide**. Close "×" cancels.

The Prefecture → City → Area dropdowns cascade. Available locations:
- **Tokyo** → Shibuya (Yoyogi, Ebisu, Hikarie), Shinjuku (Kabukicho, Nishi-Shinjuku, Takadanobaba), Chiyoda (Marunouchi, Kanda, Akasaka-mitsuke).
- **Osaka** → Kita (Umeda, Nakatsu, Higobashi), Namba (Dotonbori, Shinsaibashi, Nipponbashi).
- **Fukuoka** → Hakata (Nakasu, Gion, Tenyamachi), Chuo (Tenjin, Yakuin, Akasaka).

#### 4. FAQ editor
Title: "Add FAQ" (creating) or "Edit FAQ" (editing). Fields:
- **FAQ question*** — text input, placeholder "Question", required.
- **FAQ answer*** — multi-line text, placeholder "Answer", required.
- **Author** — editable text input (optional), placeholder "Enter author name". Blank allowed.
- **Status** — dropdown (Draft / Published), default Draft.

Buttons: **Cancel** and **Save FAQ**. Close "×" cancels. On save, required-field checks run (error toasts); a valid save adds/updates the in-memory FAQ store, re-renders the table, and shows a "FAQ saved." success toast.

#### 5. Category-tag input modal (shared by Articles + News tag managers)
A small styled modal used for adding and renaming category tags. Title is "Add category tag" or "Rename category tag". It has one field — **Category name*** (placeholder "Enter category name") — and Cancel / Save buttons. Enter saves, Escape cancels. Deleting a tag uses the shared styled confirm modal ("Delete category tag" → "Delete category \"{name}\"?").

#### 6. Shared styled confirm modal & toasts
- **Confirm modal:** a small modal with a title, a message, a **Cancel** button and a red **Delete** button. Used for all delete confirmations (guides, articles, news, FAQs, category tags). Replaces native `confirm()`.
- **Toasts:** brief notifications in the bottom-right (green success, red error, brown info). Auto-dismiss after ~3 seconds. Replace native `alert()`. Validation failures show error toasts; successful saves/deletes show success toasts (no "(mock)" suffix).

---

### Conditional Display

- **Default tab:** On open, the Area guides tab is selected and shown.
- **Pagination visibility:** the pagination controls under each table appear only when that list has more than 50 rows; otherwise they are hidden.
- **Reorder buttons (FAQs):** the Up/Down buttons are disabled at the list boundaries (Up on the first row, Down on the last) and are all disabled while any FAQ search or status filter is active.
- **Featured column behavior:** In the Area guides table, the Featured cell shows a clickable toggle only for **city** guides ("★ Featured" / "☆ Off"). **Area** guides instead show a non-interactive dash "—".
- **Featured / Display order fields:** appear only in the City guide editor, never in the Area guide editor.
- **Video status flag (auto-detection):** In the Blog/Article editor, the content body is scanned as you type. If it contains any of these signals — a YouTube link (youtube.com or youtu.be), a Vimeo link (vimeo.com), an embedded frame, a video element, or a file ending in .mp4 or .webm — the flag badge changes to "Video Blog" (blue) and the saved record's `videoFlag` becomes "Video Blog". Otherwise it shows "No video" (grey) and `videoFlag` is empty. There is no separate Video content type — this flag is what the Visibility Control Video picker uses to filter articles + news.
- **Short Description auto-generate:** If Short Description is left blank, on save a summary is auto-derived from the start of the content body (HTML tags and markdown markers stripped; trimmed to 160 characters with an ellipsis if longer).
- **Blog editor title noun:** "Article" vs "News" vs "Article / News" depending on which panel launched it.
- **Category dropdown contents:** The Blog editor's Category dropdown is rebuilt to match the panel (Article categories vs News categories), reflecting any custom tags the admin added.
- **Editor mode (New vs Edit):** Titles, the Blog ID field, and the Author field all switch between blank/auto values (new) and the existing item's values (edit).
- **Lazy panel loading:** Each panel's content only appears after its tab is first opened; loaded once and cached for the session.

---

### User Flows

**Switch sub-tab:** Click any of Area guides / Articles / News / FAQs. The clicked tab highlights green, its panel appears, others hide; first-time clicks load the panel content (briefly showing the relevant "Loading..." text).

**Create a new article (or news):**
1. Open the Articles (or News) tab → click "New article" (or "New news").
2. Blog/Article editor opens titled "New Blog — Article" (or "— News"), with a blank optional Author field and Status set to Draft.
3. Enter Title (required), optional Author, optional Short Description, content body; pick category/transaction/prefecture/type; optionally toggle Status to Published; optionally attach a thumbnail.
4. Click "Save blog". If Title is empty, an error toast appears and saving is blocked. Author may be left blank (stored "", shown "—"). Otherwise a "Blog saved." success toast appears and the editor closes.

**Edit an existing article/news:** Use the pencil (✎) in the table row — it opens the Blog editor pre-filled with that row's data (including its author).

**Save a blog:** Title required, else blocked; Author optional (blank → "—"); success shows "Blog saved."; blank Short Description is auto-filled from the body.

**Delete an article/news:** Click the trash (🗑) → styled confirm "Delete \"{title}\"?" → on confirm the row is removed and a success toast shows.

**Paginate a list:** Use the Previous / page-number / Next controls below any table to move between 50-row pages; the result-count line updates to match.

**Toggle Featured (city guides):** In the Area guides table, click the "★ Featured" / "☆ Off" button on a city row. The state flips immediately, persists, and the table re-renders. Area rows have no such button.

**Create a city guide:**
1. Area guides tab → "New city guide".
2. Editor opens titled "New city guide". Choose Prefecture (then City cascades), upload a hero image, enter the required Intro description, optionally add subtitle/map description, set status, optionally check "Featured" and set Display order.
3. "Save guide". Required-field checks run (see Validation). On success the guide is added to the top of the Area guides list, persisted, the table re-renders, and the editor closes.

**Create an area guide:**
1. Area guides tab → "New area guide".
2. Editor opens titled "New area guide". Choose Prefecture → City → Area (cascading), upload a hero image, optionally add carousel images, enter the required Description, optionally add map description, set status.
3. "Save guide". Required-field checks run. On success the guide is added to the top of the list, persisted, re-rendered, editor closes.

**Edit a city/area guide:** Click "Edit" on the row. The matching editor opens pre-filled with the guide's data (title becomes "Edit city guide" / "Edit area guide"). Saving updates the existing record in place.

**Delete a city/area guide:** Click "Delete" on the row → a confirmation appears ("Delete \"{title}\"?"). Confirm to remove it; the list persists and re-renders.

**Manage category tags (Articles/News):** In the category manager box, add a new tag (Add → "Add category tag" modal), rename a tag (pencil → "Rename category tag" modal), or delete a tag (trash → styled confirm). New/renamed tags immediately update the category filter dropdown and the Blog editor's category options; each action shows a success toast.

**Add / edit a FAQ:** FAQs tab → "New FAQ" (or pencil ✎ to edit) → fill question, answer, author and status → "Save FAQ". Required-field checks run; success shows "FAQ saved." and the table re-renders.

**Reorder FAQs:** Use the Up (↑) / Down (↓) buttons in the Order column to move a FAQ within the master order. The boundary buttons are disabled, and all reorder buttons are disabled while a search/status filter is active.

**Delete a FAQ:** Click the trash (🗑) → styled confirm "Delete \"{question}\"?". On confirm the FAQ is removed and the homepage/sell-page FAQ sections (`yuushi.cmsHome.faqHome` / `yuushi.cmsHome.faqSell`) are cleaned of any entry with the same `faqId`; the toast reports how many were removed.

---

### Validation

All validation messages are shown as **error toasts** (no native alerts).

Author is **not** validated in any editor — saving with a blank Author always succeeds (stores "", shown as "—").

**Blog/Article editor (Save blog):**
- Title empty/whitespace → blocks save, toast: **"Title is required."**

**City guide editor (Save guide):**
- Prefecture or City not chosen → toast: **"Prefecture and city are required."**
- Intro section description empty → toast: **"Intro section description is required."**
- No hero image (and none previously saved) → toast: **"Hero background image is required."**

**Area guide editor (Save guide):**
- Prefecture, City, or Area not chosen → toast: **"Prefecture, city and area are required."**
- Description empty → toast: **"Description is required."**
- No hero image (and none previously saved) → toast: **"Hero background image is required."**

**FAQ editor (Save FAQ):**
- Question empty → toast: **"FAQ question is required."**
- Answer empty → toast: **"FAQ answer is required."**

**Category-tag manager (Articles and News):**
- Empty name → toast: **"Please enter a category name."**
- Duplicate name (case-insensitive) → toast: **"This category already exists."**
- Deleting the last remaining category → blocked, toast: **"At least one category is required."**

---

### Empty States

- **Panel loading placeholders** (before content arrives): "Loading area guide content...", "Loading articles content...", "Loading news content...", "Loading FAQ content...".
- **Area guides table while loading:** "Loading area guides...".
- **Area guides table when no rows match filters:** **"No area guides match the current filters."** and the result-count line reads "Showing 0 area guides".
- **Articles / News / FAQs tables:** filtering down to zero rows shows an empty table body and a result-count line reading "Showing 0 articles" / "Showing 0 news" / "Showing 0 FAQs". Pagination controls are hidden.
- **If a panel file fails to load:** nothing user-facing appears (the failure is only logged to the developer console).

---

### Notifications & Feedback

All feedback uses styled toasts (success/error/info) and the styled confirm modal — no native `alert()`/`confirm()`.

Toasts:
| Exact text | Type | When |
|---|---|---|
| Title is required. | error | Saving blog/article with empty title |
| Blog saved. | success | Successful blog/article save |
| Prefecture and city are required. | error | Saving city guide without prefecture/city |
| Intro section description is required. | error | Saving city guide without intro description |
| Hero background image is required. | error | Saving city or area guide with no hero image |
| Prefecture, city and area are required. | error | Saving area guide missing prefecture/city/area |
| Description is required. | error | Saving area guide without description |
| City guide saved. | success | Successful city guide save |
| Area guide saved. | success | Successful area guide save |
| Guide deleted. | success | After confirming a city/area guide delete |
| FAQ question is required. | error | Saving FAQ with empty question |
| FAQ answer is required. | error | Saving FAQ with empty answer |
| FAQ saved. | success | Successful FAQ save |
| FAQ deleted. | success | After confirming a FAQ delete with no homepage/sell links removed |
| FAQ deleted. Removed from {N} homepage / sell page sections. | success | After confirming a FAQ delete that also removed N homepage/sell entries |
| Article deleted. | success | After confirming an article delete |
| News deleted. | success | After confirming a news delete |
| Please enter a category name. | error | Adding/renaming an empty category tag |
| This category already exists. | error | Adding/renaming to a duplicate category tag |
| At least one category is required. | error | Deleting the last category tag |
| Category tag added. / renamed. / deleted. | success | Category tag add/rename/delete |

Confirm modal (title → message):
| Title | Message | When |
|---|---|---|
| Delete guide | Delete "{title}"? | Deleting a city/area guide |
| Delete FAQ | Delete "{question}"? | Deleting a FAQ row |
| Delete article | Delete "{title}"? | Deleting an article row |
| Delete news | Delete "{title}"? | Deleting a news row |
| Delete category tag | Delete category "{name}"? | Deleting a category tag |

Other feedback: the result-count line above each table; the live Short Description counter "{count}/160" (turns red at 160); the auto video status badge ("No video" / "Video Blog"); the Draft/Published toggle visual state; the Featured "★ Featured"/"☆ Off" button state; status badges (green Published / amber Draft) throughout tables; pagination active-page highlight.

---

### Navigation

- **Within the screen:** Navigation is entirely via the four sub-tabs and via pop-up editors/buttons. There are no page links; the URL/address bar never changes.
- **Sub-tab → panel mapping (lazy-loaded files, located alongside this screen in the content management area):**
  - Area guides → `area-guide.html`
  - Articles → `articles.html`
  - News → `news.html`
  - FAQs → `faq.html`
  These are loaded as fragments into the panel the first time the tab is opened (load-once).
- **Persistence (what is remembered vs not):**
  - **Area guides** are saved in the browser's local storage under the key `yuushi.areaGuides`, so created/edited/deleted/featured changes survive page reloads. If nothing is stored yet, the seed guides (60+ rows) are used.
  - **Article category tags** persist in local storage under `cmsArticleCategories`; **News category tags** under `cmsNewsCategories`.
  - **Articles, News, and FAQ content items** live in in-memory stores (seeded with 60+ rows each). Adds/edits/deletes/reorders persist within the session but reset on reload.
  - **FAQ delete cascade:** when a FAQ is deleted, after the styled confirm the hub also reads `yuushi.cmsHome.faqHome` and `yuushi.cmsHome.faqSell` from local storage, removes any entries whose `faqId` matches the deleted FAQ, and writes the arrays back. The success toast reports how many homepage/sell-page entries were removed ("FAQ deleted. Removed from {N} homepage / sell page sections." or just "FAQ deleted." when none).
  - The Author for new content is entered manually in each editor; there is no auto-filled current-admin value.
