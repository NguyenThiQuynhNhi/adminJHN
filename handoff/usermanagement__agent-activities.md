## Agency Activity Dashboard

**Purpose:** This screen lets an administrator monitor how every real-estate **agency** (company-level, not individual sales staff) is performing over a chosen time window. For each agency it shows activity counts (viewings, calls, emails, tasks, jobs closed) with period-over-period trends, the response rate, and how recently the agency was active; lists everyone in a sortable, paginated, filterable table; opens a per-agency drill-down panel; lets the admin assign a badge, message an agency, and export to CSV. It is an account-health / engagement cockpit. Note for the BA: all numbers come from hardcoded demo agencies (12 hand-authored plus generated filler, ~60 total to exercise pagination); "act on an agency" buttons (Send Message, Export) are stubs that show a toast or download a CSV — no real backend call happens — while Assign Badge is a real in-memory change. There is **no upsell/CRM tagging and no KPI summary row** (removed); the per-agency **Performance Score** and **period-over-period comparison table** live inside the drill-down panel (not as a top KPI row).

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Agency Activities". The page loads inside the portal's iframe shell. No login gate, role check, or permission logic on the page itself. The URL never changes and there is no deep-linking to a specific agency.

### Layout & Structure

Reading the page top to bottom:

1. **Page header** — breadcrumb "Users Management › Agency › Activity" (last word "Activity" highlighted in the accent color, not clickable) and the H1 title "Agency Activity Dashboard".
2. **Filter card** — a white rounded card holding, left to right: a "Period" segmented toggle (3 buttons), a "Status" multi-select, a "Plan" dropdown, an "Inactive only (14+ days)" checkbox, a flexible spacer, and on the far right a primary "Export CSV" button. On narrow screens (≤720px) these stack vertically full-width. There is **no Apply button** — every filter applies in real time.
3. **Agency Performance table card** — a white card titled "Agency Performance" with a small grey result-count on the right ("Showing 1–50 of 60 agencies"), the main data table, and pagination controls beneath it.
4. **Drill-down panel** — a right-side slide-in drawer (520px wide, full width on mobile) plus a dark backdrop. Hidden until an agency row is clicked.
5. **Assign-badge popover** — a small floating popup that opens near the clicked "Assign Badge" button.
6. **Toast area** — bottom-right corner for temporary confirmation messages.

The palette is the warm beige/terracotta theme: cream background, white cards, terracotta (#c4714a) accent.

### Every Element

**Filter card** (all filters real-time, combined with AND logic; no Apply button):

- **Period segmented toggle** (label "PERIOD"): exactly three buttons — "Last 7 days", "Last 30 days" (default active on load), "Last 90 days". Exactly one is always active. Clicking switches which period's numbers the whole page uses (table metric columns and trends) and re-renders; it also resets to page 1.
- **Status** (label "STATUS", multi-select list box, 3 rows): options "Active", "Suspended", "Withdrawn". Default nothing selected = all statuses. When any are selected, only agencies whose status is in the set are shown.
- **Plan** (label "PLAN", single dropdown): "All plans" (default), "Free", "Bronze", "Silver", "Gold".
- **Inactive only (14+ days)** (checkbox): when ticked, shows only agencies with 14 or more days since last activity.
- **Export CSV button** (primary, file-export icon): downloads a CSV of the currently filtered + sorted agencies. Never disabled.

> Removed filters (no longer present): Service Area, Language, Specialism, License Expiry From/To, License Preset, Unpaid/Overdue, Violation Count, Or Bucket, Active Listings range, Appraisal Participation, Remaining Budget, Response Rate range, Response Time range, and the score-threshold input.

**Agency Performance table**

Title bar: table icon + "Agency Performance" + a grey result-count reading "Showing {start}–{end} of {total} agencies" (or "Showing 0 of {total} agencies" when nothing matches).

Columns, in order (all sortable except Actions — see 3-state sort below):

1. **Agency** — a 2-letter initials avatar, the bold company name, and a sub-line: a plan badge then "· {N} listings · {agency ID}". Example: "Tokyo Realty Co. — [Gold] · 28 listings · AG-0001". Sorts by company name.
2. **Viewings** — current-period count plus a trend line (up/down/flat arrow + percent change vs the previous period; green up, red down, grey flat). Sorts by current-period viewings.
3. **Calls** — same format.
4. **Emails** — same format.
5. **Tasks** — same format.
6. **Jobs Closed** — same format (renamed from the old "Jobs").
7. **Resp Rate** — current-period response-rate percentage, shown raw (no color thresholds).
8. **Last Active** — days since any activity: a red alert badge with warning triangle reading "{N}d" when 14+ days; otherwise muted text "Today" (0 days) or "{N}d ago".
9. **Actions** (not sortable) — two icon buttons (clicks here do NOT open the drill-down):
   - Envelope icon, tooltip "Send Message".
   - Award icon, tooltip "Assign Badge" → opens the assign-badge popover (see below).

- **Row click:** clicking a row anywhere except the Actions cell opens the drill-down for that agency; the open row is highlighted.
- **Default sort on load:** Last Active ascending (most inactive agencies on top).
- **There is no Status column, no Score column, and no Upsell Tag column.**

**3-state sort** — each sortable header cycles on click:
- 1st click → ascending (▲ shown).
- 2nd click → descending (▼ shown).
- 3rd click → unsorted (no icon; the list returns to its natural/default order).
Only one column can be sorted at a time; clicking a different column starts it at ascending and clears the previous column's indicator. (Note: for "Last Active", ascending = most inactive first, matching the default.)

**Pagination**
- Fixed page size of 50 rows per page (no size selector).
- Controls below the table: "‹ Prev", numbered page buttons (current page highlighted), "Next ›". Prev is disabled on page 1, Next on the last page.
- Numbered pages show up to 7 at a time: first page, last page, and a window around the current page, with an ellipsis ("…") standing in for any skipped ranges (e.g. 20 pages on page 8 → 1 … 6 7 8 9 10 … 20). When there are 7 or fewer pages, every page number is shown with no ellipsis.
- When the filtered result has 50 or fewer rows, the pagination controls are hidden entirely.
- The result-count line above the table reads "Showing {start}–{end} of {total} agencies".
- Changing any filter, the period, or the column sort returns to page 1.

**Status / plan badge color rules**
- **Plan badges** (in the Agency cell and drill header): "Free" (grey on beige), "Bronze" (brown on tan), "Silver" (grey on light grey-blue), "Gold" (amber/gold on pale yellow).
- **Agency status** (used by the Status filter; statuses are Active / Suspended / Withdrawn). Status is not shown as a table column in this screen.
- **Trend arrows** — green up, red down, grey flat (both periods 0 = flat; previous 0 but current positive = +100% up; else rounded percent change).
- **Last Active alert** — red badge when 14+ days inactive.

### Modals & Popups

**Assign-badge popover** (replaces the old stub): a small floating popup that opens next to the clicked "Assign Badge" button (from either the table Actions cell or the drill-down footer). It contains a dropdown with two options — "Top Agent" and "Premium Agent" — an "Assign" primary button, and a "Cancel" button. On Assign: if the agency doesn't already have that badge it is added and a success toast "Badge assigned to {Company Name} successfully." appears; if the agency already has it, an error toast "{Badge} already assigned to {Company Name}." appears. Closes on Cancel, on clicking outside it, or on Escape.

**Drill-down side panel** (read-only except the footer buttons):
- **Trigger:** click an agency row (outside the Actions cell). Dark backdrop fades in; panel slides in from the right.
- **Header:** the agency's initials avatar, the company name, and a meta line: plan badge + "{N} listings · {Agency ID}". A "×" close button sits top-right.
- **Body, in order:**
  1. **Performance Score block** — a large colour-coded raw number (no 0–100 cap) = the agency's score for the selected period, computed as `(Calls×1) + (Emails×1) + (Viewings×2) + (Tasks×2) + (Jobs Closed×5)`. The colour reflects the agency's rank across ALL currently-filtered agencies for the selected period: **top 25% → green** (success), **middle 50% → amber** (warning), **bottom 25% → red** (danger). Beneath the number: a static label "Performance Score" and a sub-line "Response rate {X}% · {N} deal(s) closed · last active {today | Nd ago}".
  2. **Inactivity banner** — shown ONLY when the agency is 14+ days inactive: a red banner reading "No activity for {N} days."
  3. **Period-over-period comparison table** — heading "Period-over-period comparison ({Last 7 days | Last 30 days | Last 90 days})" (dynamic by selected period). A 4-column table: **Metric | {Previous period label} | {Current period label} | Change**, with 5 rows in order: Viewings, Calls, Emails, Tasks, Jobs Closed. Previous-period label is "Previous 7/30/90 days" matching the selection. The **Change** column shows arrow + percent, colour-coded: green **▲** for positive, red **▼** for negative, grey **—** when flat (both periods 0), and "+100% ▲" when the previous period was 0 but the current is positive.
  4. **Newest listings** — heading "Newest listings"; up to 3 rows, each showing the listing title and its posted date as a pill ("Posted today" / "Posted 1 day ago" / "Posted {N} days ago"), sorted newest first. Empty state: "No listings posted yet."
  5. **Footer action bar** — three buttons: "Send Message" (primary, envelope), "Assign Badge" (award, opens the popover above), "Export Agency Report" (file-export, downloads a single-agency CSV).
- **Close paths:** the "×" button, clicking the backdrop, or pressing Escape. Closing slides the panel out and clears the highlighted row.

> Still not present in the drill-down: the upsell-recommendation card and the old top-listings-by-views list (the latter replaced by Newest listings). The performance-score block and the period-over-period comparison table have been **restored** (see body order above).

### Conditional Display

- **Last Active cell** — red alert badge only when 14+ days; "Today" only at 0 days; "{N}d ago" otherwise.
- **Drill-down Performance Score colour** — green / amber / red depending on the agency's rank (top 25% / middle 50% / bottom 25%) among the currently-filtered agencies for the selected period; the score and its sub-line recompute when the Period changes.
- **Drill-down comparison "Change" cell** — green ▲ (positive), red ▼ (negative), grey — (both periods 0), or "+100% ▲" (previous 0, current positive); the heading and period-column labels follow the selected period.
- **Drill-down inactivity banner** — appears only when the agency is 14+ days inactive.
- **Drill-down newest listings** — shows up to 3 listings, or "No listings posted yet." when none.
- **Sort indicator** — a header shows ▲/▼ only while it is the actively sorted column; in the unsorted (3rd-click) state no header shows an icon.
- **Pagination controls** — hidden whenever the filtered total is ≤ 50 rows.
- **Trend display** — "—" (flat) when there is no change; "+100%" up when the previous period was zero but the current is positive.
- **Table empty row** — when filters match nothing, the table body shows a single centered "No agencies match the filters." row, and the count line reads "Showing 0 of {total} agencies".

### User Flows

- **Switch period:** click "Last 7 days" / "Last 30 days" / "Last 90 days" → that button highlights, all metric columns + trends recalculate to the selected window, and the table returns to page 1.
- **Filter:** change any of Status / Plan / Inactive-only → the table, result count, and pagination update immediately (AND logic), returning to page 1.
- **Sort:** click a column header → cycles ascending → descending → unsorted; only one column sorts at a time.
- **Paginate:** click Prev / a page number / Next → the table shows that page (page scrolls to top).
- **Open agency detail:** click a row → drill-down slides in with the header, optional inactivity banner, newest listings, and footer actions; row highlighted.
- **Close agency detail:** click ×, click the backdrop, or press Escape → panel closes, highlight clears.
- **Send Message (table icon or drill button):** click → toast "Open chat with {Company Name} ({Agency ID}) — would navigate to Messages module." (stub).
- **Assign Badge (table icon or drill button):** click → the assign-badge popover opens → pick "Top Agent" or "Premium Agent" → Assign → toast "Badge assigned to {Company Name} successfully." (or "{Badge} already assigned to {Company Name}." if it already has it). Cancel closes without change.
- **Export all (Export CSV):** click → a CSV of the currently filtered + sorted agencies downloads; toast "Exported {N} agencies to CSV." If the filtered result is empty, nothing downloads and an error toast "No data to export." appears.
- **Export one agency (Export Agency Report in drill):** click → a single-agency CSV downloads; toast "Exported {Company Name} report."

### Validation

- No form inputs requiring validation. Filters are optional and combine with AND.
- The only "guard" is the Export CSV empty check (error toast "No data to export." when the filtered set is empty).
- No server-side validation, no save operations, no destructive confirmations.

### Empty States

- **Table:** when no agencies match the active filters, the table body shows one centered, muted row "No agencies match the filters." and the count line reads "Showing 0 of {total} agencies".
- **Drill-down newest listings:** "No listings posted yet." when an agency has no listings.
- **Pagination:** hidden when ≤ 50 rows.

### Notifications & Feedback

All feedback is via bottom-right toasts that auto-dismiss (~2.4s fade, removed ~2.7s). No "(demo)" wording anywhere. Exact text:

- Success: "Open chat with {Company Name} ({Agency ID}) — would navigate to Messages module." — Send Message.
- Success: "Badge assigned to {Company Name} successfully." — Assign Badge (new badge).
- Error (red): "{Badge} already assigned to {Company Name}." — Assign Badge when the agency already has it.
- Success: "Exported {N} agencies to CSV." — Export CSV.
- Error (red): "No data to export." — Export CSV with an empty filtered result.
- Success: "Exported {Company Name} report." — Export Agency Report in the drill-down.

There are no `alert()` popups and no `confirm()` dialogs. Other visual feedback: row hover/selected highlight, sort arrows, pagination active-page highlight, and the slide/fade animations of the drill-down panel and badge popover.

### Navigation

- **Entry:** Admin portal sidebar → USERS MANAGEMENT → "Agency Activities" (loads in the iframe shell).
- **Internal links:** none. No hyperlinks, no back button, no navigating tabs. The breadcrumb is static text.
- **In-page view switching:** the Period toggle, filters, sort, and pagination change the displayed data but never navigate or change the URL.
- **Drill-down / badge popover:** overlays only; they don't change the page or URL and can't be linked to directly.
- **Persistence:** none. No localStorage/sessionStorage. All state (period, filters, sort, page, open panel) lives in memory and resets on reload to defaults (period = Last 30 days, no filters, sort = Last Active ascending, page 1, panel closed). CSV exports download with filenames "agency-activity-{period}-{YYYY-MM-DD}.csv" (all) or "agency-{id}-{period}-{YYYY-MM-DD}.csv" (single agency).
