## Agreement Management (Legal & Agreement Templates)

**Purpose:** Lets an admin manage the legal/agreement templates that agents must accept. The admin can browse and search all agreements, create a new one in a full-page rich-text editor, edit an existing one, save it as a draft or publish it ("Send to agents") so every agent must accept the latest version, and delete an agreement. Each agreement shows how many agents have agreed.

**Access:** Admin sidebar → USERS MANAGEMENT → "Legal & Agreement Templates". Opens inside the admin shell content area. No sub-permissions or role gating are enforced on the screen itself. All data is in-memory demo data (nothing persists across reloads).

### Layout & Structure

The screen has **two full-page views that swap in place** (never both at once), plus a thin top bar with notification/profile icons:

1. **List view** (shown on load):
   - A header with the title "Agreement Management" and a gold **"Add"** button on the right.
   - A filter row: a **search box** ("Search agreement by title") and a **status dropdown** ("All status / Published / Draft").
   - A bordered **table** of agreements, with a footer that holds the result count on the left and the pagination controls on the right.
2. **Editor view** (opens when Add or a row's Edit is clicked; replaces the list):
   - A header with a **back button (‹)**, a title + gold subtitle, and the action buttons (which differ between New and Edit — see below).
   - A two-pane body: on the left a **Page name** input and a **rich-text editor** (formatting toolbar + editable content area); on the right an **Information sidebar** (Status, Created, Last Update, Agent Agreed).
3. A **delete confirmation modal** and bottom-right **toasts** for feedback.

### Every Element

**List view — header & filters**
- **"Add" button** (gold) — opens the editor in **New mode**.
- **Search box** — filters the table live by agreement title (case-insensitive). Resets to page 1 on each change.
- **Status dropdown** — "All status" (default), "Published", "Draft". Filters the table live; resets to page 1.

**List view — table** (columns in order):
1. **Title** — the agreement title. (Header shows a sort-arrow affordance.)
2. **Status** — a badge: green **PUBLISHED** or grey **DRAFT**.
3. **Last update** — the last-updated date/time.
4. **Agent Agreed** — an "agreed/total" count (e.g. "1500/3000").
5. **Actions** (right-aligned) — two icon buttons: **Edit** (pencil → opens the editor in Edit mode) and **Delete** (trash → delete confirmation).
- **Footer:** left side shows the result count "Showing {start}–{end} of {total} agreements" (or "Showing 0 of 0 agreements"); right side holds the pager.
- **Pagination:** platform-standard, fixed 50 rows/page (no selector). Pager: `‹ Prev`, numbered buttons (up to 7 with `…` ellipsis for skipped ranges), `Next ›`; the current page is gold; Prev disabled on page 1, Next on the last page; the whole pager is hidden when 50 or fewer agreements match. Page resets to 1 on load and on any search/status change; not persisted across reloads. (Seed data exceeds 50 rows via deterministic filler so the pager is exercised.)
- Empty state: a single centered row "No agreements match the filters."

**Editor view — header**
- **Back button (‹)** — returns to the list view.
- **Title + subtitle:** "New Agreement" / "Add a new agreement" in New mode; the agreement's name / "Created: {date}" in Edit mode.
- **Action buttons:**
  - **New mode:** "Cancel" (grey → back), "Save Draft" (saves as a draft), "Send to agents" (gold → publishes).
  - **Edit mode:** "Cancel" (back), "Save Change" (gold → save edits), and a **more-dots (⋯) menu** containing "Send to agents" (only for drafts) and "Delete agreement".

**Editor view — left pane**
- **Page name** — single-line input for the agreement title (placeholder "Page name").
- **Rich-text editor** — a toolbar plus an editable content area (placeholder "Your content page"). Working toolbar controls: Undo, Redo, paragraph style (Normal / Heading 1–3), Bold, Italic, Underline, Strikethrough, inline code, bullet list, numbered list, link (prompts for URL), image (prompts for URL), blockquote, horizontal rule. (The list-style, text-color, highlight, and code-block buttons are visual affordances only.)

**Editor view — right pane (Information sidebar)**
- **Status** — the status badge (or "-" in New mode).
- **Created** — created date/time (or "-").
- **Last Update** — last-updated date/time (or "-").
- **Agent Agreed** — the "agreed/total" count (or "-").

### Modals & Popups

- **Delete confirmation modal** — triggered by a row's Delete icon or the editor's "Delete agreement" menu item. Title "Delete agreement?", message `Permanently delete "{title}"? This action cannot be undone.`, buttons "Cancel" and "Delete" (red). Closes on Cancel, backdrop click, or Escape; confirming removes the agreement and shows a success toast.
- **More-dots (⋯) menu** (Edit mode only) — a small dropdown with "Send to agents" (drafts only) and "Delete agreement"; closes on outside click.
- No other modals or drawers.

### Conditional Display

- **List vs. editor view:** the list shows on load; Add or a row's Edit opens the editor; the back button (or Esc) returns to the list. Only one view is visible at a time.
- **Editor action set:** New mode shows Cancel / Save Draft / Send to agents; Edit mode shows Cancel / Save Change / ⋯ menu.
- **⋯ menu "Send to agents":** present only when the agreement being edited is a draft.
- **Status badge / counts:** rendered per agreement (PUBLISHED green / DRAFT grey; agreed/total count).
- **Pager:** hidden when 50 or fewer rows match.

### User Flows

- **Browse / search / filter:** type in search or change the status dropdown → the table re-filters immediately and returns to page 1; use the pager to move between pages.
- **Add an agreement:** click **Add** → editor opens empty (Status/Created/etc. show "-") → enter a Page name and body. Click **Save Draft** to create it as a draft, or **Send to agents** to create + publish it. Either returns to the list with a success toast. (A title is required; otherwise an error toast appears.)
- **Edit an agreement:** click a row's **Edit** → editor opens pre-filled with the title, body, and sidebar info. Adjust and click **Save Change** (updates and stamps Last Update). For a draft, the ⋯ menu also offers **Send to agents** (publishes).
- **Delete an agreement:** click a row's Delete icon (or the editor ⋯ → Delete) → confirm in the modal → the agreement is removed and a success toast appears.
- **Cancel/back:** Cancel button, back arrow, or Escape returns to the list without saving.

### Validation

- **Title (Page name) required** for Save Draft, Save Change, and Send to agents. If empty, the action is blocked, focus jumps to the Page name field, and an error toast "Please enter a title." is shown.
- No other field rules. (This is a UI mockup; nothing persists to a backend.)

### Empty States

- **List (no matches):** a centered row "No agreements match the filters." with the count showing "Showing 0 of 0 agreements".
- **Editor in New mode:** the Information sidebar shows "-" for Status/Created/Last Update/Agent Agreed until the agreement is saved.

### Notifications & Feedback

Bottom-right toasts (auto-dismiss ~3s):
- Success: `Draft "{title}" saved.` — after Save Draft (New mode).
- Success: "Agreement updated successfully." — after Save Change (Edit mode).
- Success: `"{title}" sent to agents.` — after Send to agents.
- Success: "Agreement deleted successfully." — after confirming a delete.
- Error: "Please enter a title." — saving/sending without a title.

Plus the delete confirmation modal described above. There are no browser-native alert/confirm pop-ups.

### Status Badges

- **PUBLISHED** — green badge. The agreement has been sent/published to agents.
- **DRAFT** — grey badge. The agreement is not yet published.

(Agent agreement is shown only as an aggregate "agreed/total" count in the list and the editor sidebar; there is no per-agent breakdown on this screen.)

### Navigation

- Reached from the admin sidebar: USERS MANAGEMENT → "Legal & Agreement Templates".
- In-page only: Add / a row's Edit opens the editor view; the back arrow (or Esc) returns to the list. No breadcrumbs, tabs, or links to other screens; the URL does not change.
- **Persistence:** none — all create/edit/publish/delete changes are in-memory and reset on reload. Seed agreements on load: "Agent Code of Conduct" (Published, 1500/3000), "Data usage & privacy policy (Agents)" (Published, 2653/3000), "Beta feature participation terms" (Draft, 0/3), plus deterministic filler agreements so the list exceeds one page.
