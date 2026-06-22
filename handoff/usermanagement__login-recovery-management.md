## Login Recovery Management

**Purpose:** This is the admin workbench for handling account login-recovery requests. When a user (an end user, an agent, or a support partner) loses access to their account — typically because they lost their email inbox or forgot their password — they submit a recovery ticket with their name, phone, a recovery contact email, a reason, and an uploaded ID document. An admin uses this screen to review each ticket and decide what to do: either mark it Solved (entering the account login email plus a new password, which the system says it will send to the user) or Reject it after the verification fails. Every Solved/Rejected action is recorded to an internal recovery activity log (note: the log table is referenced in code but is not actually shown on the screen — see Conditional Display).

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Login Recovery Management". The page opens inside the portal's content iframe; the browser URL does not change. It can also be opened directly as a standalone HTML file. There is no role gating built into the page itself. All data is hardcoded demo data and resets on every page reload (nothing is saved to a server or to browser storage).

**Visual design:** The screen uses the unified YUUSHI gold/white design system, driven by shared CSS custom-property tokens (a `:root` token block: page background `#f5f5f5`, white/warm cards, gold accent `#8B7340` with hover `#6d5a32` and light `#c9a85c`, muted brown text, standard radii/shadows). All colours come from these tokens — there are no off-palette hardcoded colours. Status badges use the shared status-variant tokens: **Pending = warning (amber)**, **Solved = success (green)**, **Rejected = danger (red)**. Re-skinning did not change any behaviour, handlers, validation, or seed data.

### Layout & Structure

The screen has **two separate views** that swap in place (you never see both at once); clicking a ticket row navigates from the list to its detail screen.

1. **List view** (shown on load):
   - **Page header** — the title text "Login Recovery Management".
   - **"Recovery tickets" card** — a filter/search bar, then a table listing all recovery requests, a result-count line, an empty-state message, and a pagination bar.
2. **Detail view** (hidden until a row is clicked; replaces the list view):
   - **Detail header** — a back button (‹) on the left, the title "Ticket detail" with a "Created {date}" sub-line, and two action buttons on the right: "Reject request" and "Mark as solved".
   - **"Information" card** — a read-only 4-column field grid (Request ID, Full Name, Date of Birth, Phone Number, User Type, Recovery Contact Email, Created Time, Status pill, and a full-width Reason for Recovery), followed by an "Uploaded ID Document" preview.
3. **A hidden modal** ("Confirm solved") that pops up when the admin marks a ticket as Solved.
4. **A toast/notification area** (bottom-right corner) and a **generic confirmation dialog** used when rejecting a ticket.

When the page first loads the list view is shown and no ticket detail is open. Clicking a row opens that ticket's detail view; the back button returns to the list.

### Every Element

**Page header**
- Title text: "Login Recovery Management". Static, not clickable.

**Left card header**
- Card title: "Recovery tickets". Static.

**Filter / search bar** (left card, above the table). Left to right:

1. **Search box** (text input)
   - Placeholder: "Search request ID, name, phone"
   - Not required, starts empty.
   - As the admin types, the table filters live. It matches the typed text (case-insensitive) against the request ID, full name, phone, and recovery contact email of each ticket. (The earlier field-name mismatch is fixed — the email is now included in the search.)

2. **Status filter** (dropdown)
   - Default: "Any status"
   - Options: "Any status" (shows all), "Pending", "Solved", "Rejected".
   - Effect: shows only tickets whose status matches the chosen value.

3. **User type filter** (dropdown)
   - Default: "All user types"
   - Options: "All user types", "End User", "Agent", "Support".
   - Effect: shows only tickets of the chosen user type.

4. **Created-at filter** (dropdown, tooltip "Created at")
   - Default: "Created: Any time"
   - Options: "Created: Any time", "Today", "Last 7 days", "Last 30 days", "Older than 30 days".
   - Effect: filters by how long ago the ticket was created. (Note for BA: the "now" reference date is hardcoded to 2026-05-15, so these buckets are computed against that fixed date, not the real current date.)

5. **Age filter** (dropdown, tooltip "Ticket age (only Pending)")
   - Default: "Age: Any"
   - Options: "Age: Any", "Overdue (> 48h pending)", "Due (24–48h pending)", "Fresh (< 24h pending)".
   - Effect: when any value other than "Age: Any" is chosen, only Pending tickets are shown, further narrowed by how many hours they've been pending (overdue = more than 48h, due = 24–48h, fresh = under 24h). Again computed against the fixed 2026-05-15 reference date.

6. **Sort by** (dropdown, tooltip "Sort by")
   - Default: "Sort: Newest first"
   - Options: "Sort: Newest first", "Sort: Oldest first", "Sort: Status", "Sort: Name A→Z".
   - Effect: reorders the table by created date (newest/oldest), by status (alphabetical), or by full name (A→Z).

7. **Reset button** (labeled "Reset")
   - Clears the search box and the Status, User type, Created-at, and Age filters back to their defaults, and sets Sort by back to "Newest first", then re-renders the table.

> Note: the previous "Contact email (Has email / No email)" filter has been **removed** — the Recovery Contact Email is now a mandatory field on every request, so a has/no-email distinction no longer applies.

**Recovery tickets table** (left card). Columns, in order:
1. Request ID
2. Full name
3. Phone (optional — may be empty; shows "—" when the request has no phone)
4. Recovery Contact Email (required — always present on every request)
5. User type
6. Created at
7. Status (shown as a colored status pill — see status badges below)

Table behavior:
- **Row click:** clicking anywhere on a row opens that ticket's **detail view** (the list view is hidden and the Ticket detail screen is shown, scrolled to top). The row is also marked selected so it stays highlighted when you return via the back button.
- **Sortable:** not by clicking column headers; sorting is controlled only by the "Sort by" dropdown.
- **Per-row action buttons:** none inside the table; all actions happen in the detail panel after selecting a row.
- **Result count:** a line above the table reads `Showing {start}–{end} of {total} recovery requests` (or `Showing 0 of 0 recovery requests` when nothing matches), reflecting the current page slice of the filtered+sorted set.
- **Pagination:** platform-standard, fixed 50 rows per page (no page-size selector). A pager sits directly below the table: `‹ Prev`, numbered page buttons (up to 7, with `…` ellipsis for skipped ranges), and `Next ›`. The current page uses the primary button style; Prev is disabled on page 1 and Next on the last page; the whole pager is hidden when 50 or fewer requests match. The page resets to 1 on load and whenever a filter/search/sort changes or Reset is clicked, and is preserved when selecting a row / opening the solve modal. Not persisted across reloads. All filtered+sorted rows flow through pagination. (The seed data now exceeds 50 rows — deterministic filler requests were appended to the original hand-authored ones so the pager is exercised.)
- **Hover:** rows highlight on hover.

**Status badges** (the Status column pill, and the Status field in the detail panel). Three values are produced by the page:
- **Pending** — amber pill (warning token). Trigger: ticket awaiting an admin decision.
- **Solved** — green pill (success token). Trigger: admin marked the ticket Solved.
- **Rejected** — red pill (danger token). Trigger: admin rejected the ticket.
- (There is also an unused "In progress" pill style defined in the styling, now rendered with the neutral grey token, but no part of the screen ever assigns this status, so the BA can ignore it for now.)

**Detail view — header**
- **Back button** (‹, top-left) — returns to the list view.
- **Title** "Ticket detail" with a sub-line "Created {created date}".
- **Action buttons** (top-right): "Reject request" (red) and "Mark as solved" (gold/primary). Enabled only when the open ticket is Pending; disabled once it is Solved or Rejected.

**Detail view — "Information" card.** A read-only 4-column field grid (drops to 2 columns on narrow screens). Fields, in order:
- **Request ID**
- **Full Name**
- **Date of Birth**
- **Phone Number** — optional; shows "—" when empty.
- **User Type**
- **Recovery Contact Email** — required; always present on every request (never blank).
- **Created Time**
- **Status** — the status pill (Pending/Solved/Rejected colours).
- **Reason for Recovery** — full-width row showing the free-text reason the user provided.

Below the grid: **Uploaded ID Document** — a preview area. Shows either an image thumbnail (caption "Uploaded file: ID_document.jpg", helper "Zoom & compare details with profile data before deciding.") or, for PDFs, a "PDF" file icon (caption "Uploaded file: ID_document.pdf", helper "In real system, admin can open the PDF in a secure viewer."). The preview is not clickable/openable in this demo.

### Modals & Popups

**1. "Confirm solved" modal**
- **Trigger:** clicking "Mark as Solved" on a selected Pending ticket. (If no ticket is selected, an error toast appears instead; if the ticket is already Solved or Rejected, an info toast appears instead and the modal does not open.)
- **Title:** "Confirm solved"
- **Fields:**
  - **Ticket** — read-only line showing the ticket as "REQUEST-ID · Full name" (e.g. "REC-20260414-001 · Nguyen Anh").
  - **Register Email (account login)** — text input, type email, required (shows a red asterisk). Empty on open.
  - **New password** — text input, required (shows a red asterisk). Note: the password is shown as plain text (not masked). Empty on open.
- **Buttons:**
  - **Cancel** — closes the modal without doing anything.
  - **Confirm & send to recovery email** — validates the two fields, then marks the ticket Solved (see User Flows / Validation).
  - **X** (top-right of the modal header) — closes the modal.
- **Other ways to close:** pressing Esc, or clicking the dark area outside the modal.
- Note for BA: the entered email and password are validated but not actually stored or transmitted in this demo.

**2. "Reject this request?" confirmation dialog** (generic confirm popup)
- **Trigger:** clicking "Reject request" on a selected Pending ticket.
- **Title:** "Reject this request?"
- **Message:** "Reject request [Request ID]? User will not receive a new password from this ticket." (the actual request ID is inserted).
- **Buttons:** "Reject" (red/danger — performs the rejection) and "Cancel" (closes, does nothing).
- **Other ways to close:** Esc, clicking outside the dialog, or the Cancel button.

### Conditional Display

- **List vs. detail view:** the list view shows on load; clicking a row hides it and shows that ticket's detail view; the back button returns to the list. Only one view is visible at a time.
- **Action buttons enabled/disabled:** the detail header's "Mark as solved" and "Reject request" are enabled only when the open ticket's status is exactly Pending; otherwise disabled. Condition: status = Pending.
- **Document preview format:** shows an image thumbnail when the ticket's document is an image; shows a "PDF" icon block when the document is a PDF; shows "No document loaded." when nothing is selected. Condition: document type of the selected ticket.
- **Age filter only affects Pending tickets:** when any Age option other than "Any" is chosen, non-Pending tickets are always excluded. Condition: Age filter is set to overdue/due/fresh.
- **Table vs. empty state:** the table shows when at least one ticket matches the filters; the empty-state message replaces it when none match. Condition: number of matching tickets = 0.
- **Recovery activity log table:** the code is written to render a recovery activity log (time, request ID, admin ID, action, newest first) and to add a log entry whenever a ticket is solved or rejected, but **the log table is not present in the page markup**, so nothing is displayed and the log never appears on screen. Flag for BA: the SRS likely intends a visible "Recovery activity log" section that is currently missing from the UI.

### User Flows

**Flow A — Review a ticket**
1. Admin clicks a row in the Recovery tickets table → the list view is replaced by that ticket's **detail view**, filled with the ticket's data (Request ID, name, date of birth, phone, type, email, created time, status, reason, document preview).
2. The header action buttons enable only if the ticket is Pending.
3. Admin clicks the back button (‹) → returns to the list view (the previously opened row stays highlighted).

**Flow B — Filter / search / sort**
1. Admin types in the search box or changes any filter dropdown → the table re-filters immediately.
2. Admin changes "Sort by" → the table reorders immediately.
3. Admin clicks "Reset" → all filters/search clear, sort returns to "Newest first", table re-renders.

**Flow C — Mark a ticket Solved**
1. Admin selects a Pending ticket → clicks "Mark as Solved".
2. The "Confirm solved" modal opens, pre-filled with the ticket label; the Register Email field is focused.
3. Admin enters the register (login) email and a new password → clicks "Confirm & send to recovery email".
4. If valid: the modal closes, the ticket's status becomes Solved (green pill), the detail panel refreshes, a log entry is recorded internally, and a success toast appears: "Ticket [Request ID] solved. Recovery email queued to [account email]." (if the ticket has no account email, it says "...queued to user.").
5. The Solved ticket can no longer be modified; its action buttons are now disabled.

**Flow D — Reject a ticket**
1. Admin selects a Pending ticket → clicks "Reject request".
2. The "Reject this request?" confirmation dialog appears.
3. If admin clicks "Reject": the ticket's status becomes Rejected (red pill), a log entry is recorded internally, the detail panel refreshes, and a success toast appears: "Request [Request ID] rejected." If admin clicks "Cancel": nothing changes.

**Flow E — Guard rails (acting without a valid target)**
1. Clicking Mark as Solved / Reject with no ticket selected → error toast "Select a ticket first." (Note: in practice the buttons are disabled without a selection.)
2. Trying to solve/reject a ticket that is already Solved → error toast "Solved tickets cannot be modified."
3. Trying to open the solve modal on a ticket that is already Solved or Rejected → info toast "This ticket has already been closed."

### Validation

In the "Confirm solved" modal, on clicking "Confirm & send to recovery email":
- **Register Email (account login)** — required. If empty: the field is marked invalid (red border) and the form shows the toast "Register email and new password are required." If filled but not a valid email format: the field is marked invalid and the toast "Please enter a valid email address." appears, focus returns to the email field. Valid email format is standard (something@something.something, no spaces).
- **New password** — required. If empty: the field is marked invalid (red border); combined with the empty-email case it triggers the toast "Register email and new password are required." There are no other password rules (no minimum length, complexity, or masking).
- Error feedback location: red highlight directly on the offending input(s) plus a toast in the bottom-right corner. Focus jumps to the first invalid field.
- Filters and search have no validation (free input).

### Empty States

- **Recovery tickets table:** when no tickets match the current filters/search, the table area shows the message "No recovery requests match current filters."
- **Ticket detail view (none opened yet):** the detail view is hidden on load — there is no "empty" detail panel to see; the list view is shown until a row is clicked.
- **Recovery activity log:** intended to show "no log" empty state, but since the log table itself is missing from the page, no empty state is visible. (Flag as above.)

### Notifications & Feedback

Toasts (appear bottom-right, auto-dismiss after a few seconds, dismissible with ×):
- Success "Ticket [Request ID] solved. Recovery email queued to [account email or 'user']." — after a successful Solve.
- Success "Request [Request ID] rejected" — after a confirmed Reject.
- Success "Status updated to \"[status]\"" — for any non-Reject status change (not reachable through the current UI, but the code can emit it).
- Error "Select a ticket first." — acting with no ticket selected.
- Error "Solved tickets cannot be modified." — trying to change an already-Solved ticket.
- Error "Please enter a valid email address." — invalid email format in the solve modal.
- Error "Register email and new password are required." — missing email and/or password in the solve modal.
- Info "This ticket has already been closed." — trying to open the solve modal on a Solved or Rejected ticket.

Confirmation dialog:
- "Reject this request?" with message "Reject request [Request ID]? User will not receive a new password from this ticket." Buttons "Reject" (danger) / "Cancel".

Other visual feedback:
- Status pills colored by status using the shared status-variant tokens (Pending = amber/warning, Solved = green/success, Rejected = red/danger).
- Selected table row highlighted.
- Invalid form inputs show a red border/glow.
- Required fields in the modal show a red asterisk after the label.
- No native browser alert/confirm popups are used.

### Navigation

- **Entry point:** reached from the portal sidebar (USERS MANAGEMENT → "Login Recovery Management"); the page loads in the content iframe.
- **In-page navigation:** clicking a ticket row opens its detail view; the back button (‹) in the detail header returns to the list view. This list↔detail swap happens in place (no URL change). No other links, tabs, or breadcrumbs.
- **Document links:** the uploaded-document previews are display-only and do not open or download anything in this demo.
- **Persistence:** none. All tickets, statuses, and log entries live only in memory and reset to the original demo data on page reload. No data is saved to a backend or to browser storage. Filter/sort selections also reset on reload.
