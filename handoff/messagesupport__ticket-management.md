## Ticket Management

**Purpose:** A support console where an admin handles customer support tickets. From a filterable, sortable, paginated list the admin opens any ticket into a detail view that shows the full customer⇄YUUSHI conversation, lets them reply with a rich-text editor, see the customer's contact info, and change the ticket's status. It is the place where incoming support requests are triaged and answered.

**Access:** Admin portal sidebar → SUPPORT & COMMUNICATION → "Ticket Management". The page loads inside the admin shell's content iframe. No login/role gate inside the page itself. Ticket data is stored in the browser (localStorage key `yuushi.tickets`) and seeded with 80 demo tickets on first load, so changes (replies, status) **persist across reloads** on the same browser.

---

### Layout & Structure

The screen has **two views that swap in place** (one visible at a time):

1. **List view** (shown on load):
   - **Page header** — the title "Ticket Management".
   - **A card** containing a filter bar, the tickets table, and a pagination row.
2. **Detail view** (opens when a ticket row is clicked; replaces the list):
   - **Detail header** — a back arrow + the ticket ID and its "Created: {date}" line.
   - A **two-column grid**: a wide **Conversation card** (≈75%) on the left and a narrow **Customer information sidebar** (≈25%) on the right.

Plus a bottom-right **toast** area for confirmations.

---

### Every Element

#### List view — filter bar
- **Search** (text input, placeholder "Search ticket ID, name, email") — filters live as you type; matches ticket ID, customer name, or email (case-insensitive).
- **Category** (dropdown): All Categories (default), Property Inquiry, Booking Issue, Payment Issue, Technical Issue, Other.
- **Status** (dropdown): All Status (default), Open, In Progress, Resolved, Closed.
- **Created date range** — two date pickers (From – To); keeps tickets whose created date is within the range (either bound optional).

All filters apply immediately and reset the table to page 1.

#### List view — tickets table
Columns (all **sortable** — click a header to cycle through three states: ascending (▲) → descending (▼) → unsorted; only one column is sorted at a time; the active column shows a ▲/▼ indicator):
1. **Ticket ID** (e.g. TK001).
2. **Customer Name**.
3. **Email**.
4. **Category**.
5. **Status**.
6. **Created Date**.

- Clicking anywhere on a row opens that ticket's **detail view**.
- **Default sort: Created Date descending** (newest tickets on top).
- Any sort change resets the table to page 1.

#### List view — result count & pagination
- **Result count line** (above the table): "Showing {start}–{end} of {total} tickets" (reads "Showing 0–0 of 0 tickets" when nothing matches).
- **Page size is fixed at 50 rows per page** (no rows-per-page selector).
- **Pagination controls** (below the table): **Previous** | numbered page buttons with an ellipsis (…) for skipped ranges (up to ~7 numbers shown) | **Next**. The current page is highlighted; **Previous** is disabled on page 1 and **Next** on the last page.
- The **whole pager is hidden when 50 or fewer rows match** (a single page).
- Page resets to 1 on any filter/search/sort change.

#### Detail view — header
- **Back arrow** — returns to the list view.
- **Ticket ID** and **"Created: {long date}"** (e.g. "27 May, 2025").

#### Detail view — Conversation card (left)
- **Conversation title** — the ticket's subject (e.g. "Inquiry about Shibuya apartment listing").
- **Message thread** — each message shows an avatar (pink for the customer, gold for YUUSHI), the sender name, a timestamp, and the message text. Customer and YUUSHI messages are visually distinguished. A **"↩ Reply"** link appears under the **most recent customer message** and jumps focus to the reply editor.
- **Reply editor** (rich text):
  - **Toolbar:** Bold, Italic, Underline; Align left/center/right; Bullet list, Numbered list; Highlight; and a Font-size select (Small / Normal / Large / Huge).
  - **Editable body** with placeholder "I am your rich text editor.".
  - **Footer:** a **trash (discard)** button and a **"Send reply"** button.

#### Detail view — Customer information sidebar (right)
- **Name** — a **clickable cross-link** that opens the End User Detail screen in a **new browser tab** (`../usermanagement/user-account-management.html?ref=<url-encoded customer name>`, `target="_blank" rel="noopener"`). There is no per-user deep link in the mockups, so the customer name is passed as the `ref` query parameter.
- **Email** (mailto link), **Phone** (tel link), **Category**, **Created Date** (read-only display rows).
- **Status** — a dropdown (Open / In Progress / Resolved / Closed); changing it updates the ticket immediately.

---

### Modals & Popups

- **Discard-reply modal** — clicking the trash button while the reply editor has text shows a **styled in-page modal** (matching the page's visual style): title "Discard reply?", message "You have unsent text. Are you sure you want to discard?", and two buttons — **Cancel** (closes the modal and keeps the text) and **Discard** (styled as a red/danger button; clears the editor and closes). If the editor is empty, it just clears with no modal. No toast is shown on discard.
- No other modals. Feedback otherwise uses toasts.

---

### Conditional Display

- **List vs. detail view:** the list shows on load; clicking a row swaps to the detail view; the back arrow returns. Only one is visible at a time.
- **Sort indicator (▲/▼):** shown only on the actively sorted column; clicking a third time returns the column to unsorted (no indicator).
- **"↩ Reply" link:** rendered only under the last customer message in the thread.
- **Pagination:** the pager is shown only when more than 50 rows match; Previous is disabled on the first page, Next on the last; page count derives from the filtered result at a fixed 50 rows per page; numbered buttons collapse to an ellipsis (…) for long ranges.
- **Empty table row:** shown when filters match nothing (see Empty States).

---

### User Flows

- **Filter / search / sort:** adjust any filter or click a column header → the table updates immediately (filters reset to page 1).
- **Open a ticket:** click a row → detail view opens with the conversation, customer info, and current status; scrolls to top.
- **Reply:** type in the rich-text editor (optionally format with the toolbar) → click **Send reply**. The reply is appended to the thread as a YUUSHI message (timestamped "now"), saved to localStorage, the editor clears, and a "Reply sent successfully." toast appears. Sending an empty reply shows "Please write a reply first." instead.
- **Discard a draft reply:** click the trash button → if the editor has text, the **Discard reply?** modal opens → **Discard** clears the editor, **Cancel** keeps it. If the editor is empty, it just clears with no modal. No toast is shown.
- **Open the customer record:** click the customer **Name** in the detail sidebar → the End User Detail screen opens in a new tab.
- **Change status:** pick a new value in the sidebar Status dropdown → the ticket's status is saved, the parent-shell open-count badge refreshes, and a "Status updated to {status}." toast appears. (Closed tickets can still be reopened — there is no finality lock.)
- **Back:** the back arrow returns to the list (which re-renders with current filters/sort).

---

### Validation

- **Reply:** must contain non-whitespace text to send (empty → "Please write a reply first." toast; nothing is appended).
- Filters/sort/status have no validation (free selection).

---

### Empty States

- **No matching tickets:** the table body shows a single centered row "No tickets match your filters." spanning all columns, and the result count line reads "Showing 0–0 of 0 tickets" (the pager is hidden). The empty message is not placed in the count line.

---

### Notifications & Feedback

Bottom-right toasts (auto-dismiss ~2.4s):
- "Reply sent successfully." — after a successful reply.
- "Please write a reply first." — attempting to send an empty reply.
- "Status updated to {status}." — after changing the ticket status.
- Discarding a reply shows **no toast** (the discard modal handles the interaction).

Plus the styled **Discard reply?** modal for discarding a non-empty reply. Other feedback: row hover, sort arrows, the reply link, the customer Name cross-link, and the customer email/phone links.

---

### Navigation

- **Entry:** sidebar → SUPPORT & COMMUNICATION → "Ticket Management" (loads in the content iframe; URL unchanged).
- **In-page:** clicking a row opens the detail view; the back arrow returns to the list. This list↔detail swap happens in place.
- **Parent-shell badge:** the screen keeps an **open-ticket count badge** (`#ticketOpenBadge`) in the parent shell in sync — it shows the number of tickets with status "Open" and hides when zero (updated on load and whenever a status changes).
- **Persistence:** ticket records, replies, and status changes are saved to `localStorage` under `yuushi.tickets` and persist across reloads; clearing storage restores the 80 seeded demo tickets (deterministically generated — varied categories, statuses Open / In Progress / Resolved / Closed, and created dates spread across the last ~90 days). Seeding only occurs when `yuushi.tickets` is empty, so a browser still holding the older 10-ticket data keeps it. (Email/phone use standard `mailto:`/`tel:` links; the customer **Name** links to the End User Detail screen in a new tab.)
