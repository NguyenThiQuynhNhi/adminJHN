## Property Approval & Moderation

**Purpose:** Lets an admin review property listings that are waiting for a decision and either Approve or Reject each one. Clicking a queued listing opens a full detail-style page (hero + Listing overview / Property details / Agent / Moderation sections) with Approve and Reject actions. Rejecting captures a structured reason (a single required reject category — no free-text notes) that is sent to the agent; approving is a simple confirm with no note field. The screen separates listings into a Pending queue and a Rejected archive. Approved listings disappear from this screen entirely.

**Access:** Admin sidebar → PROPERTY MANAGEMENT → "Property Approval". (Internal admin tool; no sub-role gating is built into the screen.)

---

### Design-system note

The screen uses the unified YUUSHI gold/white design system, driven entirely by CSS custom properties declared once in the main `<style>` `:root`. All colors, radii, shadows, and the font stack are tokens — there are no non-token color literals (the only bare values are `#fff` used for white text/icons sitting on a colored or photographic background).

- **Surfaces:** page background `--bg-page` (light grey); cards `--bg-card` (white) and `--bg-card-warm` (warm off-white); row hover / soft header `--bg-row-hover` / `--bg-header-soft`.
- **Text:** `--text-primary`, `--text-muted`, `--text-label`, link `--text-link`.
- **Borders:** `--border-default`, `--border-warm`, `--border-soft`.
- **Accent:** gold `--color-primary` with `--color-primary-hover` and `--color-primary-light` (used for primary buttons, active tabs, focus rings, accent bars).
- **Status variants:** each status uses a matched text/background token pair — `--status-success-*`, `--status-warning-*`, `--status-danger-*`, `--status-neutral-*`.
- **Shape & depth:** radii `--r-sm`/`--r-md`/`--r-lg`/`--r-full`; shadows `--shadow-card`/`--shadow-toast`/`--shadow-modal`; typography via `--font-stack`.

This is a re-skin only: no logic, event handlers, seed data, or the persistence key (`yuushi.moderationQueue`) were changed.

Badges and pills are described below by their status name and status-variant, not by color.

---

### Layout & Structure (Pending/Rejected tabs + full-width detail view)

The screen has two states that swap in place (you only ever see one at a time):

1. **List page** (default) — a single full-width column containing:
   - A "← Back to Property List" button (top-left, returns to the Property List screen).
   - Page title: "Property Approval & Moderation".
   - A tab bar with two tabs: **Pending** (selected by default) and **Rejected**.
   - The body of whichever tab is active:
     - **Pending tab:** a filter bar (search + reason dropdown + group dropdown + Remove Filters + sort), a result-count line, then a 4-column table, then an empty-state line if no rows, then pagination controls.
     - **Rejected tab:** a result-count line, then a 5-column read-only table (no filter bar), then an empty-state line if no rows, then pagination controls.

2. **Detail view** (full-width) — opens when any table row is clicked, hiding the list page. It contains:
   - A sticky toolbar at the top (Back button + a status pill on the left; action buttons on the right).
   - A hero header (property thumbnail icon + property name + a group badge next to the name + a meta line: property ID, address, type, price).
   - An alerts area (shown only when relevant — see Conditional Display).
   - A grid of four section cards: Listing overview, Property details, Agent, Moderation.
   - "Back" in the toolbar returns to whichever tab the user came from.

There is no two-column side-by-side panel; the list and detail are separate full-width views. The page scrolls to top when the detail view opens.

---

### Every Element

**Tabs (top of list page)**
- **Pending tab** — default selected. Shows the pending queue.
- **Rejected tab** — shows listings that were rejected.
- Switching a tab re-renders that tab's table. Only one tab's table is visible at a time.

**Pending filter bar** (Pending tab only)
- **Search box** — free text. Placeholder: "Search by property ID, title, agent". Filters the Pending rows as you type; matches against property ID, property title, or agent name (case-insensitive). Live (updates on every keystroke).
- **Reason dropdown** — filters Pending rows by moderation reason. Exactly five options (four real reasons + "All"), in order:
  - All reasons (default — shows everything)
  - Unverified agent
  - Keyword flag
  - Duplicate listing
  - System flag
  - (Note: there is no "User report" reason. It was removed; any seed listing previously flagged as "User report" is re-categorized to "System flag". Stored queues are auto-migrated on load.)
- **Group dropdown** — single-select; filters the Pending queue to one listing group. Every option, in order:
  - All groups (default — shows everything)
  - Group 1 — Single Unit
  - Group 2 — Whole Building
  - Group 3 — Land
  - Group 5 — New Dev Apartments
  - Group 6 — New Dev Houses
  - The seeded Pending queue contains a mix of all five groups (one or two listings each).
- **Remove Filters button** — labeled "Remove Filters". Clears the search box, resets the reason dropdown to "All reasons", resets the group dropdown to "All groups", and resets sort to "Newest first", then re-renders.
- **Sort dropdown** (right-aligned). Only one option: "Newest first" (default). (Severity sort options were removed — see Severity below.)

**Result-count line & pagination** — above each table sits a "Showing {start}–{end} of {total} listings" line, and below each table sit Previous / numbered / Next controls (see the Pagination section). Both tables are paginated independently at 50 listings per page.

**Pending table columns** (in order)
- **Property** — the listing title.
- **Agent** — the agent/agency name.
- **Reason** — the moderation reason (e.g., Unverified agent, Keyword flag, etc.).
- **Status** — a status pill. For pending rows this reads "Pending" (warning status-variant).
- Entire row is clickable (cursor is a pointer) and opens the detail view for that listing.

**Rejected table columns** (in order)
- **Property** — the listing title.
- **Agent** — the agent/agency name.
- **Reason** — the original moderation reason that put it in the queue.
- **Status** — a status pill reading "Rejected" (danger status-variant).
- **Reject category** — the structured reject category the admin chose at rejection time (read-only; shows "—" if none).
- (There is **no "Notes" column** — the free-text reject Notes field was removed.)
- Entire row is clickable and opens the detail view. The Rejected table has no filter/sort bar and no action buttons — it is purely a read-only archive.

**Status pills (status-variant mapping)**
- Pending → warning status-variant.
- Approved → success status-variant. (Approved listings never appear on this screen, so this pill is effectively only seen momentarily if at all.)
- Rejected → danger status-variant.

**Severity — removed.** Severity has been removed entirely from Property Approval (no severity badge in the Moderation card, no severity sort options, no high-severity alert), aligning with Property Reports which has no severity. (The underlying demo records may still carry a `severity` value in memory, but it is never shown or used.)

**Detail view toolbar**
- **Back button** — returns to the list (to the tab the user came from).
- **Status pill** — shows the listing's current status (Pending / Rejected).
- **Action buttons on the right — only when the listing is Pending:**
  - **Approve** (primary action)
  - **Reject** (danger action)
  - There are no Edit / Suspend / Delete buttons on this screen (those are handled in the main Property Management flow).
- **When the listing is not Pending (Rejected/Approved):** the right side shows no action buttons — the toolbar status pill already conveys the status.

**Detail hero header**
- Building icon thumbnail.
- Property name (the title), with a **group badge** beside it showing the listing's group (e.g., "Group 5 — New Dev Apartments"), rendered with the group-badge style (warning/gold status tokens; no new colors). The badge is hidden if the listing has no group.
- Meta line: property ID pill, address (prefecture · city), property type, price. Any missing value shows "—".

**Detail section cards (four, in order)**
- **Listing overview** — Property (title), Property ID, Status (as a pill), Type.
- **Property details** — Prefecture, City, Layout, Size, Build year, Price.
- **Agent** — Agent (name), Agent email, and License (shown only if the listing has a license value, e.g. "Pending verification").
- **Moderation** — Moderation reason, a reason-specific context field (see Conditional Display), and Note (a full-width free-text note explaining the flag). For Rejected listings only, this card additionally shows **Reject category** (the chosen category). (There is no rejection-Notes row — that field was removed.) Missing values show "—".

---

### Pagination (universal standard — applies to BOTH tables independently)

Both the Pending table and the Rejected table are paginated using the platform's universal pagination standard. Each tab has its own independent page state.

- **Page size:** fixed at **50 listings per page** (not user-adjustable).
- **Result-count line** (directly above each table): reads **"Showing {start}–{end} of {total} listings"** (e.g., "Showing 1–50 of 53 listings"). When the table is empty it reads exactly **"Showing 0 of 0 listings"**. The `{total}` reflects the full result set for that tab (the Pending count is after search/reason/group filtering; the Rejected count is all rejected listings).
- **Controls** (directly below each table): **Previous** | numbered page buttons | **Next**.
  - The current page button uses the gold accent (primary) styling.
  - **Previous** is disabled on page 1; **Next** is disabled on the last page.
  - Numbered buttons: if there are 7 pages or fewer, all are shown; otherwise the list is condensed with an ellipsis ("…") so first/last and a window around the current page are visible.
  - The entire control bar is **hidden when there is only one page** (i.e., 50 or fewer results for that tab).
- **Page resets to 1** on: applying or clearing a filter (search, reason, group, sort, Remove Filters), real-time search keystrokes, sort change, switching tabs, and page reload (page state is not persisted).
- **Page is preserved across opening and closing the detail view** — returning from a listing's detail via Back keeps the table on the same page the admin left.
- After an Approve or Reject decision, if removing/moving the listing empties the current page, the pager automatically clamps to the last valid page.

---

### Modals & Popups

There are two dialogs: a simple Approve confirm dialog and a structured Reject dialog. Both are triggered by their button in the detail toolbar.

- **Approve dialog** (simple confirm — no note field)
  - Title: "Approve this listing?"
  - Subtitle: "Listing ID: <the property ID>"
  - There is **no "Audit note" field** — the note block is hidden; the dialog is a plain confirm that approves & publishes and notifies the agent.
  - Buttons: Cancel and a primary **Approve** button.

- **Reject dialog** (structured form — reason only)
  - Title: "Reject this listing?"
  - Subtitle: "Listing ID: <the property ID>"
  - **Reject category** (dropdown, **required**) — the only field. First option is a placeholder "Select a category…" with no value. Real options, in order: Incomplete information, Inappropriate content, Duplicate listing, Invalid license, Poor image quality, Policy violation, Other.
  - (There is **no free-text "Notes" field** — it was removed.)
  - Buttons: Cancel and a danger-styled **Reject** button.
  - On confirm, the chosen category is stored on the listing (category → "Reject category" column / Moderation card); any stored reject-notes value is cleared.

- **Closing either dialog:** Cancel button, clicking the dark backdrop outside the box, or pressing Escape. Closing without confirming makes no change.

---

### Conditional Display

- **Approve / Reject buttons** — shown in the detail toolbar **only when the listing's status is Pending**. For non-Pending statuses no action buttons are shown (no read-only "Rejected" badge — the toolbar status pill conveys status).
- **Group badge** — shown in the hero next to the property name when the listing has a group; hidden otherwise.
- **Filter bar** — appears on the Pending tab only (search + reason + group + Remove Filters + sort). The Rejected tab has no filter/sort controls.
- **Reject category column** — appears only in the Rejected table (there is no Notes column).
- **Reject category row** in the Moderation card — appears only when the listing is Rejected (there is no Notes row).
- **Rejected alert** — in the detail view, if the listing is Rejected and has a reject category, a danger status-variant alert banner shows: "Rejected — <the reject category>".
- **Reason-specific context field** (in the detail Moderation card) — the extra field depends on the moderation reason:
  - **Unverified agent** → field "Agent verification" showing a danger status-variant pill "Agent not verified".
  - **Keyword flag** → field "Flagged keyword" showing the banned keyword that was detected (e.g., "違法") in danger-variant bold text.
  - **Duplicate listing** → field "Potential duplicate of" showing the duplicate listing's ID as a link (e.g., "P-0892"). The link is non-navigating in this mockup.
  - **System flag** → field "System note" showing the system's note text.
  - (Any other/unknown reason → no extra context field.)
- **License field** in the Agent card — shown only when the listing carries a license value.

---

### User Flows

**Browse tabs**
1. Land on the screen → Pending tab active, pending queue listed.
2. Click "Rejected" → rejected archive listed (read-only).
3. Click "Pending" → back to the pending queue.

**Open a detail**
1. Click any row in either table.
2. The full-width detail view opens (page scrolls to top), showing the toolbar, hero, alerts (if any), and the four section cards.

**Approve a listing**
1. From a Pending listing's detail view, click **Approve**.
2. The Approve confirm dialog opens (no note field).
3. Click **Approve** to confirm (or Cancel to abort).
4. The listing's status becomes Approved, the change is saved, a success toast appears, and the screen returns to the list. The listing no longer appears on either tab.

**Reject a listing (structured form)**
1. From a Pending listing's detail view, click **Reject**.
2. The structured Reject dialog opens; choose a **Reject category** (required) — this is the only field.
3. Click **Reject** to confirm. If no category is selected, the dialog stays open and shows an inline error (see Validation).
4. On confirm: the listing's status becomes Rejected, the chosen category is stored on the listing, the change is saved, an error-style toast appears, and the screen switches to the **Rejected** tab so the admin sees the listing in its new home.

**Back to list**
1. From the detail view, click **Back** in the toolbar.
2. Returns to whichever tab the admin came from, with that tab's table re-rendered.

---

### Validation

- **Reject — reject category is required.** If the admin clicks the dialog's Reject button without selecting a category, the dialog does not close, the category dropdown is highlighted as invalid, it is focused, and an inline error message appears:
  - Exact error text: **"Please select a reject category."**
  - The error clears as soon as the admin selects a category.
  - (There is no Notes field, so nothing else is validated in the Reject dialog.)
- **Approve — no fields, no validation.** The Approve dialog is a plain confirm with no note field.
- No other field-level validation exists on this screen (search/filter/sort accept any input).

---

### Empty States

- **Pending table empty:** "No pending listings."
- **Rejected table empty:** "No rejected listings."
- Each appears in place of its table rows when the relevant list (after filtering, in the Pending case) has no entries.

---

### Notifications & Feedback

All feedback is via toast messages (bottom-right) or the inline modal error. No native browser confirm/alert dialogs are used.

- **Approve success (success-variant toast):** "Listing approved and published. Agent <agent name> has been notified."
- **Reject result (danger-variant toast):** "Listing rejected. Agent <agent name> has been notified with your reason."
- **Reject validation (inline modal error):** "Please select a reject category."
- (There are no Edit / Suspend / Delete stub actions or toasts on this screen.)
- Note: the agent-notification email is described as a back-end action; the toast is only the UI acknowledgement. The actual email is not sent by this mockup.

---

### Navigation

- **"← Back to Property List"** button (top-left of the list page) → goes to the Property List screen (`property-list-oversight.html`).
- **Detail Back button** → returns to the list, staying on the tab the admin came from.
- **Sidebar entry:** PROPERTY MANAGEMENT → "Property Approval".
- **Persistence:** the moderation queue is saved in the browser under the key **`yuushi.moderationQueue`** (unchanged). It is seeded with demo listings on first load and updated (saved) after every Approve or Reject decision, so decisions survive a page refresh. The seed is padded to **66 entries** (the original hand-authored Pending examples spanning all five groups and four moderation reasons, two hand-authored Rejected examples, plus deterministic realistic filler) so both tables exceed one page and the pagination controls are exercised — the Pending tab seeds 53 listings (2 pages) and the Rejected tab seeds 13. On load, an existing stored queue is auto-migrated to the current shape: any "User report" reason becomes "System flag", and any legacy single `rejectionReason` value is converted to a "Reject category" of "Other" (its text is stored in the now-unused `rejectNotes` field, which is no longer surfaced in the UI). Approved listings remain saved with an "Approved" status but are not displayed on either tab. An in-memory decision log is also kept during the session (not persisted, not shown on screen).
