## Property Reports

**Purpose:** Lets an admin review, triage, and close reports that users or real-estate companies file against property listings (reasons such as incorrect information, unauthorized listing, unauthorized images, privacy/copyright, property sold, or other). Each report is either Pending (awaiting admin action), Suspended (admin confirmed the report and suspended the listing), or Dismissed (closed with no action on the listing). Permanent removal of a listing is NOT done here — that is Property Management's responsibility. All data is demo/mock data held in the browser only; nothing is saved to a server and a page reload restores the original sample set (about 60 reports — five hand-written examples plus deterministic filler rows so the 50-per-page pagination is exercised).

**Access:** Admin sidebar → PROPERTY MANAGEMENT → "Property Reports". The screen opens inside the admin shell content area. There is no separate URL, no login gate on the screen itself, and no role checks visible in the screen.

---

### Layout & Structure

The screen has two views that never show at the same time; the screen swaps between them in place (no page reload, no URL change):

1. **List view** (shown first, by default). Top to bottom:
   - Page header: title "Property Reports" on the left, an "Export CSV" button on the right.
   - A row of four KPI summary cards.
   - A "Filters" card.
   - A "Results" card containing a count line and the reports table.

2. **Detail view** (opens when a table row is clicked; hidden until then). Top to bottom:
   - A sticky toolbar that stays pinned at the top while scrolling: a "Back to reports" button and a status badge on the left; status-dependent action buttons on the right.
   - A "hero" banner: a flag icon tile, the property title, a line of identifiers (report ID, property ID, owner), and an "Open property" button.
   - A status-dependent alert message area.
   - A grid of cards: "Report Information", "Reporter", "Description from reporter" (full width), "Attachments & Evidence" (full width), and "Audit log" (full width).

Two pop-up dialogs (Suspend and Dismiss) and a toast/notification area sit on top of both views.

---

### Every Element

#### List view — Page header
- **Title "Property Reports"** — top-left heading. Not interactive.
- **"Export CSV" button** — top-right. Action: shows a toast reading "Export N filtered reports as CSV." where N is the number of reports currently passing the filters. It does not actually produce a file. Always enabled.

#### List view — KPI cards (four, left to right)
Each card is a label, a big number, and a hint line. Numbers are recalculated live as reports change status.
1. **Pending** — count of reports with status Pending. Number styled with the warning accent. Hint: "Awaiting admin action".
2. **Suspended** — count of reports with status Suspended. Number styled with the success accent. Hint: "Listing suspended".
3. **Dismissed** — count of reports with status Dismissed. Number styled with the danger accent. Hint: "Report closed, no action".
4. **Total Reports** — total number of reports. Hint: "All time".
KPI cards are not clickable.

#### List view — Filters card
Title "Filters". Six filter fields followed by two action buttons.

1. **Status** (multi-select list box, shows 3 rows at once). Label "STATUS". No option selected by default. Options: "Pending", "Suspended", "Dismissed". Effect: if one or more are selected, only reports whose status matches one of the selected values are shown; if none selected, status is not filtered. Multiple can be selected at once.
2. **Reason** (dropdown). Label "REASON". Default "All reasons". Options and effect:
   - "All reasons" — no reason filter (default).
   - "Property sold"
   - "Incorrect information"
   - "Privacy / copyright"
   - "Unauthorized listing"
   - "Unauthorized images"
   - "Other"
   Selecting any specific reason shows only reports with that reason.
3. **Reporter type** (dropdown). Label "REPORTER TYPE". Default "All". Options:
   - "All" — no reporter-type filter (default).
   - "Individual"
   - "Real-Estate Company"
   Effect: limits rows to the chosen reporter type.
4. **Submitted from** (date picker). Label "SUBMITTED FROM". Empty by default. Effect: excludes reports submitted before the chosen date.
5. **Submitted to** (date picker). Label "SUBMITTED TO". Empty by default. Effect: excludes reports submitted after the end of the chosen date (includes the whole chosen day).
6. **Search** (text box). Label "SEARCH". Placeholder "Property name, ID, reporter…". Empty by default. Effect: case-insensitive text match against the report ID, property ID, property title, reporter name, and property owner. Optional.

Filter action buttons (bottom-right of the card):
- **"Reset" button** — clears all six filters back to their defaults and shows all reports again.
- **"Apply" button** (primary/highlighted, magnifying-glass icon) — runs the filters and refreshes the table and the count.

Note: filters only take effect when "Apply" is pressed; typing or selecting alone does not refresh the table.

#### List view — Results card
- **Count line:** "Showing {start}–{end} of {total} reports" where {start}–{end} is the range of rows on the current page and {total} is the number of reports passing the filters. When nothing matches it reads "Showing 0 of 0 reports". (This replaced the older "Total: N reports" line.)
- **Reports table** (see Every Element → Table below).
- **Pagination controls** (below the table) — see Table → Pagination.

#### Reports table
Columns, in order:
1. **Report ID** — the report's identifier, shown in bold (e.g. "R-2024-0001").
2. **Property** — property title in bold with the property ID in smaller muted text below it.
3. **Reason** — a reason badge (gold/warm-tinted) with the reason text.
4. **Reporter** — a reporter-type badge (Individual or Real-Estate Company) with the reporter's name in smaller muted text below.
5. **Submitted** — the submission date, formatted like "10 Mar 2024".
6. **Last Update** — the last-update date, same format.
7. **Status** — a status badge styled by status meaning.
8. **Actions** — a single ghost icon button (external-link icon, tooltip "Open property detail"). Clicking it opens the related property in a NEW browser tab at "property/property-list-oversight.html?propertyId=<id>" (target="_blank"). The click is stopped from bubbling, so it does NOT also open the report detail view.

Table behaviour:
- **Sortable:** None. Column headers do not sort. Rows appear in the underlying data order (or filtered order).
- **Row click:** Clicking anywhere on a row (except the Actions button) opens that report's detail view. Rows show a pointer cursor and highlight on hover.
- **Per-row action buttons:** One — "Open property detail" in the Actions column (see column 8 above).
- **Pagination:** Fixed **50 reports per page** (universal standard). Controls appear centered below the table: **Previous** | numbered page buttons | **Next**.
  - Up to 7 numbered buttons are shown; for longer lists the first and last page always show with "…" gaps around the current page and its neighbours.
  - The current page button is highlighted with the gold accent and is not clickable.
  - **Previous** is disabled on page 1; **Next** is disabled on the last page.
  - The whole control bar is **hidden when there are 50 or fewer matching reports** (single page).
  - Changing page scrolls back to the top of the list.
  - The page resets to **page 1** whenever filters are applied or reset, on search/sort, and on reload. The page is **NOT remembered across a reload**, but it **IS preserved when opening and closing a report's detail view** (returning from a report leaves you on the same page). Suspending/dismissing a report re-applies the filters and therefore returns the list to page 1.
- **Filter/search:** Handled by the Filters card above; there are no per-column filters.

#### Detail view — Toolbar
- **"Back to reports" button** (left, back-arrow icon) — returns to the list view.
- **Status badge** (left, next to back button) — status badge styled by status meaning.
- **Action buttons** (right) — depend on the report's status:
  - If **Pending**: "Suspend listing" (success-styled, lock icon, tooltip "Suspend the listing — hide from public view"), "Dismiss report" (danger-styled, x-circle icon, tooltip "Close report without action on listing").
  - If **Suspended** or **Dismissed**: no buttons; instead just a **lock icon alone** (no text).

#### Detail view — Hero banner
- **Flag icon tile** — decorative.
- **Property title** — large heading.
- **Identifier line:** report ID pill, a separator dot, property ID, a separator dot, "Owner: " followed by the owner name.
- **"Open property" button** (top-right, external-link icon) — opens that property's detail page. Inside the admin shell it loads "property/property-detail-view.html?propertyId=..." in the main content area; otherwise it opens that page in a new browser tab.

#### Detail view — Alert area
Removed. There is no longer a status-driven banner in the detail view (the toolbar status pill and the Report Information card convey status/reason).

#### Detail view — Report Information card
Title "Report Information". Shows four read-only items: Reason (badge), Status (badge), Submitted (full date and time), Last update (full date and time).

#### Detail view — Reporter card
Title "Reporter". Shows four read-only items: Type (Individual / Real-Estate Company badge), Name (bold), Email (a clickable mailto link), Phone.

#### Detail view — Description from reporter card
Title "Description from reporter". Shows the reporter's free-text description, preserving line breaks. Shows "—" if empty.

#### Detail view — Attachments & Evidence card
Title "Attachments & Evidence". Lists each attachment the reporter provided. Each attachment row shows a type icon, the attachment label, a meta line (attachment type plus file size if known, plus an "Open in new tab ↗" link if the attachment is an external link/URL), and a **"Download" button** (down-arrow icon). The Download button shows a toast "Download <attachment label>" and does nothing else. If there are no attachments, see Empty States.

Attachment types and their icons/labels: Image (image icon, "Image"), Document (file icon, "Document"), External link (link icon, "External link"), Video (video icon, "Video"); anything else falls back to a paperclip icon and "Attachment".

#### Detail view — Audit log card
Title "Audit log". A vertical timeline of entries, newest at the top. Each entry shows a date-and-time line and a line reading "<actor> · <what happened>". Actors include "System" (for the original submission) and admin names (e.g. "Admin Sato", "Admin Tanaka"). Entry text patterns:
- **Submission:** "Submitted by <reporter name> — Report received."
- **Suspend:** "Suspended by <admin name> — Listing suspended. Reporter notified." (any optional note is appended).
- **Dismiss:** "Dismissed by <admin name> — Reason: <dismiss reason>. No action on listing. Reporter notified." (any optional note is appended).
If there are no entries, see Empty States.

#### Status badges (every status)
- **Pending** — warning-styled badge (`badge-pending`). Trigger: report awaiting admin action.
- **Suspended** — success-styled badge (`badge-suspended`). Trigger: admin confirmed the report and suspended the listing.
- **Dismissed** — danger-styled badge (`badge-dismissed`). Trigger: admin closed the report with no listing action.

#### Other badges
- **Reporter type — Individual** — neutral-styled badge with a person icon, text "Individual".
- **Reporter type — Real-Estate Company** — gold/warm-styled badge with a building icon, text "Real-Estate Company".
- **Reason badge** — gold/warm-tinted badge showing the reason text. One per report.

---

### Modals & Popups

#### Suspend modal
- **Trigger:** "Suspend listing" button (available only when status is Pending).
- **Title:** "Suspend listing — apply action" (success-styled lock icon).
- **No standing/explanatory message inside** (the earlier "Suspending will hide the listing from public view…" line is not present).
- **Fields:**
  - **"Note"** (text area). Placeholder "Additional context for the audit log…". Optional. (There is NO "Action on listing" dropdown — every resolution is a suspend; permanent removal is not available here.)
  - **"Notify reporter & listing owner via email"** (checkbox). Checked by default.
- **Buttons:** "Cancel" (closes without changes) and "Confirm & suspend" (success-styled, lock icon — suspends the listing). On confirm, report status becomes Suspended.
- **Close (4 ways, all close without confirming):** the header "X" button, the "Cancel" button, clicking the dark backdrop outside the dialog box, or pressing the Escape key.

#### Dismiss modal
- **Trigger:** "Dismiss report" button (available only when status is Pending).
- **Title:** "Dismiss report" (danger-styled x-circle icon).
- **No standing/explanatory message inside** (the earlier "Dismissing closes the report without any action on the listing…" line is not present).
- **Fields:**
  - **"Dismiss reason"** (required dropdown). Default "Select a reason…". Options: "Select a reason…" (no value), "Invalid report", "Not enough evidence", "No issue found", "Duplicate of another report", "Out of platform scope", "Other".
  - **"Note to reporter"** (text area). Placeholder "Explanation visible to the reporter…". Optional.
- **Buttons:** "Cancel" (closes without changes) and "Confirm dismiss" (danger-styled, x-circle icon — applies the dismissal). On confirm, report status becomes Dismissed.
- **Close (4 ways, all close without confirming):** the header "X" button, the "Cancel" button, clicking the dark backdrop outside the dialog box, or pressing the Escape key.

#### Attachment "Download"
- Shows a toast "Download <attachment label>". No real download and no native pop-up.

No other modals, drawers, or confirm dialogs exist on this screen.

---

### Conditional Display

- **Detail action buttons depend on status:**
  - Status **Pending** → shows "Suspend listing" and "Dismiss report".
  - Status **Suspended** or **Dismissed** → shows no action buttons, instead just a **lock icon alone** (no text). These statuses are final.
- **Detail alert banners removed:** the status-driven banners (Pending/Suspended/Dismissed) are no longer shown — the toolbar status pill and the Report Information card already convey status and reason. (See "Business rules (backend / out-of-UI)".)
- **Attachment "Open in new tab ↗" link** appears only on attachments that have an external URL.
- **Attachment file size** appears only when a size is recorded.
- **Empty attachment / empty audit messages** appear only when there are none (see Empty States).
- **Table empty message** appears only when no reports match the filters.

---

### User Flows

**View and filter reports**
1. Admin opens the screen → list view shows all reports, KPIs, and the count.
2. Admin sets one or more filters (status, reason, reporter type, date range, search) → clicks "Apply" → table and count refresh to matching reports.
3. Admin clicks "Reset" → all filters clear and all reports show again.

**Open a report**
1. Admin clicks a table row → detail view opens, scrolled to top, showing that report's full information.
2. Admin clicks "Back to reports" → returns to the list view.

**Suspend a report's listing**
1. In detail view of a Pending report, admin clicks "Suspend listing" → Suspend modal opens.
2. Admin optionally types a note, optionally unchecks notify.
3. Admin clicks "Confirm & suspend".
   - Status becomes Suspended; report stores the note; an audit entry "Suspended by <admin> — Listing suspended. Reporter notified." (plus any note) is added; the modal closes and its fields clear; KPIs and list refresh; a toast "<report ID> resolved — listing suspended." appears (with " Email sent." appended if notify was checked).

**Dismiss a report (no listing action)**
1. In detail view of a Pending report, admin clicks "Dismiss report" → Dismiss modal opens.
2. Admin chooses a dismiss reason, optionally types a note to the reporter.
3. Admin clicks "Confirm dismiss".
   - If no reason chosen → error toast "Please select a dismiss reason." and the modal stays open.
   - If valid → status becomes Dismissed; report stores the reason and note; an audit entry "Dismissed by <admin> — Reason: <reason>. No action on listing. Reporter notified." (plus any note) is added; modal closes and fields clear; KPIs and list refresh; a warning toast "<report ID> dismissed. Reporter notified." appears.

**Open the related property**
1. Admin clicks the per-row "Open property detail" icon in the list table → the property opens in a NEW browser tab at "property/property-list-oversight.html?propertyId=<id>".
2. Admin clicks "Open property" in the detail hero → the property's detail page opens (in the main content area inside the shell, or a new tab otherwise).

**Download an attachment**
1. Admin clicks "Download" on an attachment → a toast "Download <label>" appears (no real file, no native pop-up).

**Contact reporter**
1. Admin clicks the reporter's email → opens the default mail client to that address.

---

### Validation

- **Suspend modal — no required fields.** The note is optional; clicking "Confirm & suspend" always proceeds.
- **Dismiss modal — "Dismiss reason" is required.** If left at "Select a reason…", clicking "Confirm dismiss" shows an error toast "Please select a dismiss reason." (bottom-right) and does not proceed.
- All notes are optional. All list filters are optional. No format, length, or other validation exists on this screen. Dates are picked from native date pickers.

---

### Empty States

- **No reports match the filters:** the table shows a single centered, muted row "No reports match the filters.", the count line reads "Showing 0 of 0 reports", and the pagination controls are hidden.
- **No attachments on a report:** the Attachments & Evidence card shows italic muted text "No attachments provided by the reporter."
- **No audit entries:** the Audit log shows italic muted text "No audit entries yet." (In practice every report is created with at least one entry.)
- **Empty single values:** missing description shows "—"; default hero placeholders before a report loads are "—" and "R-—".

---

### Notifications & Feedback

**Toasts (appear bottom-right, auto-dismiss after a couple seconds):**
- Success/neutral "Export N filtered reports as CSV." — after clicking "Export CSV".
- Success/neutral "<report ID> resolved — listing suspended." — after a successful Suspend (with " Email sent." appended when notify is checked).
- Error "Please select a dismiss reason." — Dismiss confirmed with no reason chosen.
- Warning "<report ID> dismissed. Reporter notified." — after a successful Dismiss.
- Neutral "Download <attachment label>" — after clicking an attachment "Download" button.

**Inline alert banners in the detail view:** Removed. The status-driven Pending/Suspended/Dismissed banners and the Suspend/Dismiss modal standing messages are no longer shown (status pill + Report Information card carry that information).

**Native browser pop-ups:** None (all feedback is via toasts).

### Business rules (backend / out-of-UI)
These rules still apply but are no longer surfaced as banners/standing text in the UI:
- **Suspend** hides the listing from public view and notifies the reporter and the listing owner.
- **Dismiss** closes the report with no action on the listing and notifies the reporter.
- Permanent removal of a listing is NOT performed here — that is Property Management's responsibility (separate Delete action).
- Suspended/Dismissed are terminal report states; re-opening requires a new report.

**Confirm dialogs:** None.

---

### Navigation

- **Entry:** Admin sidebar → PROPERTY MANAGEMENT → "Property Reports" loads this screen in the admin content area.
- **List ↔ Detail:** clicking a table row opens the detail view; "Back to reports" returns to the list. This is an in-place swap — the browser URL never changes and there is no browser back/forward history for it.
- **List "Open property detail" (per-row):** opens "property/property-list-oversight.html?propertyId=<id>" in a new browser tab (target="_blank").
- **Detail hero "Open property":** navigates to the property detail page ("property/property-detail-view.html") for the report's property, passing the property ID; loads in the shell content area, or a new tab outside the shell.
- **Reporter email:** opens a mailto link to the reporter's email address.
- **Attachment external link:** "Open in new tab ↗" opens the attachment's URL in a new tab (only for link/URL attachments).
- **Persistence:** None. All changes (status changes, resolve/dismiss actions, notes, audit entries) live only in the browser session and are lost on reload, which restores the original sample set (~60 reports). Filter selections and the current pagination page are not remembered after a reload, though the page is preserved while moving between the list and a report's detail view within the same session.
