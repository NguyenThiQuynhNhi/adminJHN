## Static Page Management

**Purpose:** Let an administrator configure the public website's footer (three columns of links: Company links, User information links, Social media) and manage a library of static content pages (legal/info pages such as Privacy Policy, About Us, FAQ) each with a title, a status (Draft or Published), and rich-text body content.

**Access:** Admin sidebar → CONTENT MANAGEMENT → "Static Page Management". The screen opens inside the admin shell's content area. All data shown is demo data held in the browser's memory only; nothing is saved to a server, and refreshing the screen resets everything to the original demo values.

### Layout & Structure

The screen is a single scrolling page with a warm off-white/beige background. From top to bottom:

1. **Page header row** — On the left, the page title "Static Page Management". On the right, two tab buttons sitting side by side: "Footer management" and "Static pages library". Exactly one tab is shown as active at a time (the active tab is coloured orange-brown with an underline; the inactive tab is grey).

2. **Toolbar row** (directly under the header) — Contains the footer Edit/Save control. Only ONE button shows here at a time: either "Edit footer" (grey/outline style) when not editing, or "Save changes" (solid orange button) when editing. They swap places; they are never both visible at once.

3. **Footer management section** (the default view) — A heading "Footer management" followed by three side-by-side cards laid out in a 3-column grid:
   - Card 1: "Company links"
   - Card 2: "User information links"
   - Card 3: "Social media"
   The grid drops to 2 columns on medium-width screens and stacks to 1 column on narrow screens.

4. **Static pages library section** (hidden until its tab is clicked) — A single card titled "Static pages library" containing an "Add page" button and a table of pages inside a vertically scrolling area.

Only one of the two sections (Footer management OR Static pages library) is visible at a time, controlled by the two tabs. The toolbar Edit/Save control belongs to the footer area.

There are pop-up windows (modals) that overlay the screen when triggered: "Add page to company links", the footer link add/edit window, and a shared styled confirm modal used for destructive actions (remove/delete). Every modal supports four ways to close it: an "×" close icon in its header, the Cancel button, clicking the dark backdrop outside the modal box, and pressing the Escape key (Escape closes the topmost open modal — the confirm modal first if it is open). Feedback messages appear as styled toasts in the bottom-right corner. The page editor is NOT a modal — it opens as a full-page view that swaps in place of the list (see "Page editor — full-view").

### Every Element

**Tabs (top right of header)**
- "Footer management" tab — Default active tab on load. Clicking it shows the Footer management section and hides the Static pages library section; highlights this tab as active.
- "Static pages library" tab — Clicking it shows the Static pages library section and hides the Footer management section; highlights this tab as active.

**Footer Edit / Save toggle (toolbar) — these swap, only one shows at a time**
- "Edit footer" button (grey/outline) — Shown when NOT in edit mode. Clicking it enters footer edit mode: it hides itself and reveals the "Save changes" button, enables the three footer "Add" buttons, and makes the per-item Remove / Edit / Delete controls appear inside the footer cards.
- "Save changes" button (solid orange) — Hidden on load; shown only while in edit mode. Clicking it shows a success toast "Footer configuration saved.", then exits edit mode: it hides itself and brings back the "Edit footer" button, disables the three footer "Add" buttons, and hides the per-item Remove / Edit / Delete controls.

**Footer Card 1 — Company links**
- Card title: "Company links".
- "Add from library" button (solid orange, top right of the card) — Disabled (greyed out, not clickable) unless footer edit mode is on. When enabled, clicking it opens the "Add page to company links" modal.
- Link list — One row per company link. Each row shows the page title. In edit mode only, each row also shows a "Remove" button on the right.
- Seed rows (in order): "Specified Commercial Transactions Act Disclosure", "About Us", "Privacy Policy", "Terms of Use", "Cookie Policy", "Copyright Notice".
- Per-row "Remove" button (edit mode only) — Opens the styled "Remove from Company links?" confirm modal, then on confirm removes that page from the Company links column (it stays in the page library; only the footer reference is removed).

**Footer Card 2 — User information links**
- Card title: "User information links".
- Link list — One row per link, showing the link name. In edit mode only, each row also shows two small icon buttons on the right: a pencil (Edit) and a red trash can (Delete).
- Seed rows (in order): "Sitemap", "FAQ", "Contact Us", "Careers", "Advertising & Listings", "Media & Press", "Browser & System Requirements".
- Per-row Edit icon (edit mode only) — Opens the footer link modal pre-filled with that link's name and URL, titled "Edit link".
- Per-row Delete icon (red, edit mode only) — Opens the styled "Delete link?" confirm modal, then on confirm removes the link and shows a "Link deleted successfully." toast.
- "Add link" button (grey/outline, below the list) — Disabled unless footer edit mode is on. When enabled, opens the footer link modal in add mode, titled "Add link" (no icon upload field).

**Footer Card 3 — Social media**
- Card title: "Social media".
- Link list — One row per social link, showing a small platform icon (an uploaded image if one exists, otherwise a generic image placeholder icon) followed by the link name. In edit mode only, each row also shows pencil (Edit) and red trash (Delete) icon buttons.
- Seed rows (in order): "Instagram", "YouTube", "TikTok".
- Per-row Edit icon (edit mode only) — Opens the footer link modal pre-filled with name, URL, and the icon, titled "Edit link" (includes the platform-icon upload field).
- Per-row Delete icon (red, edit mode only) — Opens the styled "Delete link?" confirm modal, then on confirm removes the link and shows a "Link deleted successfully." toast.
- "Add link" button (grey/outline, below the list) — Disabled unless footer edit mode is on. When enabled, opens the footer link modal in add mode, titled "Add social link" (includes the platform-icon upload field).

**Static pages library section**
- Card title: "Static pages library".
- "Add page" button (solid orange, top right of the card) — Always enabled. Opens the full-view page editor in "new page" mode (blank name, empty content, Information shows "–"; buttons Cancel / Save Draft / Publish).
- **Search box** (below the card header) — a single text input with a magnifying-glass icon, placeholder "Search". Filters the table live (case-insensitive) by page title as the admin types.
- **Pages table** — three columns:
  1. **Page title** — sortable. The header shows up/down sort carets; clicking it sorts the list by title (ascending ▲ → descending ▼, toggling on each click). Title sort is the default on load (ascending).
  2. **Status** — sortable (same caret/toggle behaviour); shows a status badge (PUBLISHED = green, DRAFT = neutral/grey).
  3. **Actions** (right-aligned) — per-row icon buttons (see Actions column under Conditional Display).
  Only one column is sorted at a time; clicking a different header moves the active sort to it (ascending first).
- **Result count** (above the table) — text in the format "Showing {start}–{end} of {total} pages" (e.g. "Showing 1–50 of 60 pages"). {total} is the count after the current search filter; {start}–{end} is the slice shown on the current page. With no results it reads "Showing 0 of 0 pages".
- **Pagination** (below the table) — fixed page size of **50 rows per page**. The pager shows: a **Previous** button, then numbered page buttons (up to 7 numbered slots, with a "…" ellipsis when there are more pages), then a **Next** button. The current page button is highlighted in accent gold. **Previous** is disabled on page 1; **Next** is disabled on the last page. The pager is **hidden entirely when the total (after filtering) is ≤ 50** (i.e. only one page). The view resets to **page 1** whenever the user types in the search box, changes the sort, or reloads the screen.
- **Seed data** — the library is seeded with **60 deterministic demo pages** (a mix of Published and Draft) that **include the 6 protected pages**, so the pager is exercised on load.
- **Empty state** — when the search matches nothing, a single centered row "No pages found." spans the table.

**Status badges (used in the library table and the Add-from-library modal)**
- "PUBLISHED" badge — Green text/background. Shown when a page's status is Published. (In the Add-from-library modal it appears as lowercase "published".)
- "DRAFT" badge — Grey/neutral text/background. Shown when a page's status is Draft. (In the Add-from-library modal it appears as lowercase "draft".)
- (Note: the design also defines a grey "hidden" badge style and category/location/locale badge styles, but no page ever uses them — only Published and Draft appear in practice.)

### Modals & Popups

**Modal 1 — "Add page to company links"**
- Trigger: "Add from library" button in the Company links card (edit mode only).
- Title: "Add page to company links".
- Body: A scrolling list of every page from the library that is NOT already in the Company links column. Each list row shows the page title, a status badge (published/draft), and an "Add" button (solid orange).
- "Add" button on a row — Adds that page to the Company links column, then closes the modal and refreshes the footer.
- "Cancel" button (grey/outline, full width at the bottom) — Closes the modal without changes.
- "×" close icon (top-right of the header) — Closes the modal without changes.
- Close: the "×" icon, the Cancel button, clicking the dark backdrop, pressing Escape, or clicking Add.

**Modal 2 — Footer link add/edit window**
- Trigger: any footer "Add link" button (columns 2 and 3) or any per-row Edit icon (columns 2 and 3).
- Title: "Add link" when adding to User information links; "Add social link" when adding to Social media; "Edit link" when editing any existing link.
- Fields (required fields marked with a red asterisk "*"):
  - "Link name *" — Text input, placeholder "Link label".
  - "URL *" — Text input, placeholder "https://example.com/... or #". Pre-filled with "#" when adding.
  - "Platform icon" — Shown ONLY for Social media links (column 3); hidden for User information links. **Required only in ADD mode** — in Add mode the label shows a red asterisk ("Platform icon *") and saving is blocked if no icon is uploaded; in Edit mode there is NO asterisk and the icon is optional (the existing icon is kept if not re-uploaded, and the admin may clear it via "Remove"). Shows a thumbnail (uploaded image preview or a generic image icon), a label ("No icon uploaded" or "Custom icon uploaded"), an "Upload"/"Replace" file picker (accepts PNG, SVG, JPEG, WebP), and a red "Remove" button that appears only when an icon image is present.
- "×" close icon (top-right of the header) — Closes the modal without saving.
- "Cancel" button (grey/outline) — Closes the modal without saving.
- "Save link" button (solid orange) — Validates and saves the link (see Validation), then closes the modal and refreshes the footer.
- Close: the "×" icon, the Cancel button, clicking the dark backdrop, pressing Escape, or a successful save.

**Modal 3 — Confirm modal (shared, styled)**
- Trigger: any destructive action — removing a company link, deleting a footer link, or deleting a library page (from the table or the editor ⋯ menu).
- Layout: a header (the title plus an "×" close icon), a message line, and two buttons (a grey Cancel and a red/danger action button). Exact title/message/button wording per action is listed under Notifications & Feedback.
- Close: the "×" icon, Cancel, clicking the dark backdrop, or pressing Escape (all dismiss with no action), or the danger button (performs the action, then closes). Replaces the previous native browser confirm dialogs.

**Toasts (styled, bottom-right, auto-dismiss)**
- Success toasts (green accent) and error toasts (red accent) appear bottom-right and fade out automatically. They replace the previous native browser alerts. Exact wording per case is listed under Notifications & Feedback.

**Page editor — full-view (not a modal)**
The page editor is a **full-page view that swaps in place** (Pattern A): opening it hides the header/tabs and both management sections and shows the editor; the back arrow (‹) returns to the Static pages library list. Trigger: "Add page" (new) or a row's Edit (✎) icon (existing).
- **Editor header:** a back arrow (‹) + a title and subtitle on the left; the action buttons on the right (which buttons depend on mode — see below).
  - New page: title "New Page", subtitle "Add a new static page".
  - Existing page: title = the page title, subtitle = "Created: {created date}".
- **Body — two columns:**
  - **Left (main):** a "Page name *" text input (required, marked with a red asterisk), then a rich-text editor — a formatting toolbar (undo/redo, a text-style dropdown Normal/H1/H2/H3, bold/italic/underline/strikethrough, bulleted & numbered lists, quote, link, image, divider) above a `contenteditable` content area (placeholder "Your content page"). The Link and Image toolbar buttons use a native browser `prompt()` to ask for the URL ("Link URL:" / "Image URL:"). It loads the page's saved content when editing, empty when new.
  - **Right (Information sidebar):** read-only info rows — **Status** (a Published/Draft badge), **Created** (e.g. "23 Dec 2025, 19:55"), and **Last Update**. Shown as "–" when not yet set (new page).
- **Action buttons — New mode:** **Cancel**, **Save Draft** (saves with status Draft), **Publish** (saves with status Published).
- **Action buttons — Edit mode:** **Cancel**, **Save Change** (saves, keeping the current status, and updates Last Update), and a **More (⋯) menu** containing:
  - **Publish** — shown **only when the page is currently Draft** (sets status to Published and saves).
  - **Delete** — shown **only for non-protected pages** (protected pages never expose Delete here); opens the styled "Delete page?" confirm modal, then on confirm removes the page (and its footer Company-links reference), returns to the list, and shows a "Page deleted successfully." toast.
  (If neither More item applies — e.g. a protected, already-Published page — the ⋯ button is omitted.)
- Saving validates the Page name (required) and returns to the list, refreshing the table. Cancel / back arrow returns without saving.

### Conditional Display

- The toolbar shows "Edit footer" OR "Save changes", never both — controlled by whether footer edit mode is on.
- The three footer "Add" buttons ("Add from library", "Add link" in column 2, "Add link" in column 3) are disabled (greyed out) unless footer edit mode is on.
- Per-item footer controls (the "Remove" button in column 1; the Edit and Delete icon buttons in columns 2 and 3) are shown ONLY in footer edit mode; they are hidden otherwise.
- The "Platform icon" upload field in the footer link modal is shown ONLY when adding or editing a Social media link (column 3); it is hidden for User information links (column 2). Its red asterisk (required marker) is shown only in ADD mode and hidden in EDIT mode.
- In the footer link modal's icon area, the red "Remove" button is shown ONLY when an icon image is currently present; the upload button label reads "Upload" when no image exists and "Replace" when one does.
- In the library table's Actions column, every row shows an **Edit** icon button (pencil). For non-protected pages a **Delete** icon button (red trash) appears next to it. For **protected** pages there is **no Delete icon at all** — instead a non-interactive **lock** icon is shown (tooltip "Protected page — cannot be deleted"). Protected pages can never be deleted (also enforced in code: the delete handler ignores protected pages).
- The Footer management section is shown only when its tab is active; the Static pages library section is shown only when its tab is active.
- The "Add page to company links" modal lists only library pages that are not already in the Company links column.
- The library table's pagination control is hidden entirely when the filtered total is ≤ 50 rows (one page); otherwise Previous/Next and numbered page buttons (max 7, with "…" ellipsis) are shown, the current page highlighted in accent gold, Previous disabled on the first page and Next on the last.

### User Flows

**Edit and save the footer**
1. User clicks "Edit footer" → the button is replaced by "Save changes", the three footer "Add" buttons become enabled, and Remove/Edit/Delete controls appear on the footer items.
2. User makes changes (add/remove/edit links — see flows below).
3. User clicks "Save changes" → message "Footer configuration saved." appears; the button reverts to "Edit footer"; the add buttons disable again; the per-item controls disappear.

**Add a company link from the library**
1. In edit mode, user clicks "Add from library" → the "Add page to company links" modal opens listing library pages not already in the column.
2. User clicks "Add" on a page row → that page is added to the Company links column, the modal closes, and the footer refreshes.
3. (Alternatively) user clicks "Cancel" → modal closes, nothing added.

**Remove a company link**
1. In edit mode, user clicks "Remove" on a company link row → a styled confirm modal appears: title "Remove from Company links?", message `Remove "{page title}" from Company links? It stays in the page library.`, buttons Cancel | Remove (danger).
2. User clicks Remove → the link is removed from the column and the footer refreshes. (Cancelling leaves it in place.)

**Add a user information link**
1. In edit mode, user clicks "Add link" under User information links → footer link modal opens titled "Add link", with name blank and URL pre-filled "#", no icon field.
2. User fills name and URL, clicks "Save link" → if valid, the link is added, modal closes, footer refreshes, and a success toast "Link saved successfully." appears. (Cancel closes without saving.)

**Add a social media link**
1. In edit mode, user clicks "Add link" under Social media → footer link modal opens titled "Add social link", with name blank, URL "#", and the Platform icon field shown (its label carries a red asterisk because the icon is required when adding).
2. User fills name and URL, uploads an icon image (required), clicks "Save link" → if valid, the link (with icon) is added, modal closes, footer refreshes. If no icon was uploaded, saving is blocked with the "Platform icon is required." error toast.

**Edit an existing footer link (column 2 or 3)**
1. In edit mode, user clicks the pencil Edit icon on a link → footer link modal opens titled "Edit link", pre-filled with that link's name, URL (and icon, for social links). For social links the Platform icon shows NO asterisk here — it is optional in edit mode.
2. User changes values, clicks "Save link" → if valid, the link updates, modal closes, footer refreshes. (For social links the existing icon is kept if not re-uploaded, or may be cleared with "Remove".)

**Delete a footer link (column 2 or 3)**
1. In edit mode, user clicks the red trash Delete icon → a styled confirm modal appears: title "Delete link?", message `Delete the link "{link name}"? This cannot be undone.`, buttons Cancel | Delete (danger).
2. User clicks Delete → the link is removed, the footer refreshes, and a success toast "Link deleted successfully." appears. (Cancel leaves it.)

**Upload / replace / remove a social icon (inside the footer link modal)**
1. User clicks "Upload" (or "Replace") → file picker opens.
2. User selects an image → if within the size limit, a preview thumbnail appears, the label changes to "Custom icon uploaded", the upload button label becomes "Replace", and a red "Remove" button appears.
3. User clicks "Remove" → the icon is cleared, label reverts to "No icon uploaded", button label reverts to "Upload".

**Add a new static page**
1. User opens the Static pages library tab, clicks "Add page" → the full-view page editor opens blank (Information shows "–"). Buttons: Cancel · Save Draft · Publish.
2. User enters a page name, writes content, clicks **Save Draft** (saved as Draft) or **Publish** (saved as Published) → if the name is provided, the new page is added to the table (always non-protected, with Created/Last Update set to now), the editor closes, table refreshes, and a success toast "Page saved successfully." appears.

**Edit an existing static page**
1. In the library table, user clicks the Edit (✎) icon on a row → the full-view page editor opens pre-filled with that page's name, content, and Information (Status/Created/Last Update). Buttons: Cancel · Save Change · ⋯.
2. User edits and clicks **Save Change** → if the name is provided, the page updates (Last Update set to now), the editor closes, table refreshes, and a success toast "Page saved successfully." appears. From the ⋯ menu the user can **Publish** (Draft pages only) or **Delete** (non-protected pages only).

**Delete a static page**
1. In the library table (on a non-protected row's Delete icon) or from the editor's ⋯ → Delete, a styled confirm modal appears: title "Delete page?", message `Permanently delete the page "{page title}" from the library? This cannot be undone.`, buttons Cancel | Delete (danger).
2. User clicks Delete → the page is removed from the library AND removed from the Company links footer column if it was there; table and footer refresh, and a success toast "Page deleted successfully." appears. (Protected pages show a lock icon instead of a Delete icon and cannot be deleted this way — the handler also refuses any delete call targeting a protected page.)

**Browse pages with pagination**
1. The library table shows 50 pages per page. With 60 seeded pages, the pager shows page buttons 1 and 2 (Previous disabled on page 1).
2. User clicks a page number, or **Next**/**Previous** → the table shows that page's slice and the result-count line updates ("Showing {start}–{end} of {total} pages"). The active page button is highlighted in accent gold.
3. Typing in search or changing the sort resets the view to page 1. If the filtered total drops to ≤ 50, the pager disappears.

**Switch tabs**
- Clicking "Footer management" or "Static pages library" swaps which section is visible; no data is lost when switching (everything stays in memory).

### Validation

**Required-field marker convention:** Required fields are signalled only by a red asterisk "*" after the field label — there is no "(Optional)"/"(Required)" suffix text anywhere on this screen. Marked fields are: the page editor's "Page name"; the footer link modal's "Link name" and "URL"; and the footer link modal's "Platform icon" (shown for Social media links only, and **marked required only when adding** — in edit mode the asterisk is hidden and the icon is optional).

- **Footer link "Save link":** Both "Link name" and "URL" are required (leading/trailing spaces are ignored). If either is empty, saving is blocked and an error toast "Name and URL are required." appears.
- **Platform icon (Social media, ADD mode only):** When adding a new Social media link, an uploaded icon is required. If none is uploaded, saving is blocked and an error toast "Platform icon is required." appears. When editing an existing Social media link the icon is optional — the existing icon is kept if not changed, and may be cleared with "Remove".
- **Social icon upload:** The image file must be 500KB or smaller. If larger, the upload is rejected and an error toast "Icon image exceeds 500KB limit." appears; the file selection is cleared. Accepted file types are PNG, SVG, JPEG, and WebP (enforced by the file picker).
- **Page editor (Save Draft / Publish / Save Change):** "Page name" is required (spaces ignored). If empty, saving is blocked and an error toast "Page name is required." appears. Status and content have no validation (content may be empty).
- There is no URL format validation (any text, including "#", is accepted as a URL). There are no uniqueness checks (duplicate titles/links are allowed).

### Empty States

- **Static pages library table:** None. (If all pages were removed, the table body would simply be empty with no placeholder message.)
- **Footer columns / Add-from-library list:** None. (An empty column or an empty "available pages" list shows nothing — no placeholder text.)

### Notifications & Feedback

All feedback uses **styled in-page components**: a styled **confirm modal** for destructive confirmations and styled **toasts** (bottom-right, auto-dismiss) for success/error messages. There are **no** native browser `alert()`/`confirm()` dialogs anywhere on this screen. (The one exception is the page editor's Link and Image toolbar buttons, which use a native `prompt()` to capture a URL.)

**Confirm modals** (each has a title, a message, a Cancel button, and a danger-styled action button):
- Title "Remove from Company links?" — message `Remove "{page title}" from Company links? It stays in the page library.` — buttons Cancel | Remove (danger). (Removing a Company links item.)
- Title "Delete link?" — message `Delete the link "{link name}"? This cannot be undone.` — buttons Cancel | Delete (danger). (Deleting a User information or Social media footer link.)
- Title "Delete page?" — message `Permanently delete the page "{page title}" from the library? This cannot be undone.` — buttons Cancel | Delete (danger). (Deleting a library page, from either the table Delete icon or the editor ⋯ → Delete.)

**Error toasts:**
- "Name and URL are required." (footer link save with a missing name or URL).
- "Platform icon is required." (adding a new Social media link without uploading an icon).
- "Icon image exceeds 500KB limit." (social icon upload too large).
- "Page name is required." (page save with empty page name).

**Success toasts:**
- "Footer configuration saved." (clicking "Save changes" on the footer).
- "Page saved successfully." (after Save Draft / Publish / Save Change).
- "Link saved successfully." (after saving a footer link via "Save link").
- "Page deleted successfully." (after confirming a page delete).
- "Link deleted successfully." (after confirming a footer link delete).

(Removing a company link from the footer column refreshes the footer without a toast.)

### Navigation

- The two tabs ("Footer management" and "Static pages library") switch between the two in-page sections. This is an in-page view switch only — the page URL does not change and there is no browser-history/back behaviour.
- There are no internal links to other admin screens, no breadcrumbs, and no back button on this screen.
- **Persistence:** None. All changes (footer edits, added/edited/deleted links, added/edited/deleted pages, uploaded icons, page content) live only in the browser's memory for the current session. "Save changes" / Save Draft / Publish / Save Change / "Save link" do not write to any server or local storage; reloading the screen restores the original demo data.
