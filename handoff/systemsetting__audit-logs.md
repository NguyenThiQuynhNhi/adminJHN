## Audit Logs

**Purpose:** Lets administrators review an immutable record of administrative actions across the platform. Each entry captures metadata — who did it (actor), what action code, on which resource, when, and the outcome (severity). Admins can filter by date range, actor, severity, and action category, search by resource, sort and paginate the list, click an entry to see full details + a plain-English privacy note, export the filtered list to CSV, and the table auto-refreshes with new entries in near real time. Only metadata is shown; detailed payloads (request bodies, personal data, message/call content) are never displayed here.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Audit Logs". Opens inside the main admin shell content area. All data is in-memory demo data (80+ seeded entries spanning the last ~90 days); nothing persists to a backend.

A small notice near the top reads **"Logs are retained for 5 years per platform policy."**

---

### Layout & Structure

- Page heading "Audit Logs" followed immediately by the retention-policy notice pill (there is no subtitle paragraph — a `.page-subtitle` CSS rule exists but no such element is rendered).
- **Two full-page views that swap in place** (not a split screen) — clicking a log row navigates from the list to its detail view:
  - **List view** — "Audit log table" card: header with the card title and an **Export CSV** button; a filter header row with a **Reset filters** button; the filter controls; a **result-count line**; the scrollable log table; and a **pagination bar** below it.
  - **Detail view** (hidden until a row is clicked; replaces the list) — a **"‹ Back to logs"** button on top, then a "Log details" card with the selected entry's full details.

### Every Element

**List view header**
- **Card title** "Audit log table".
- **Export CSV button** — exports the currently filtered + sorted list (see CSV export / Notifications).

**Filters** (a "Reset filters" button sits at the top-right of the filter area):
- **Date preset** (dropdown): Custom (default), Today, Yesterday, Last 7 days, Last 30 days. Choosing a preset (other than Custom) fills the From/To dates; editing a date manually switches the preset back to Custom.
- **From** / **To** (date pickers): bound the entries by date.
- **Actor** (multi-select with a search-within box): lists **all admin accounts** from the demo admin data set; pick any number (none = all actors).
- **Severity** (multi-select): Success, Danger, Info (none = all).
- **Action category** (multi-select): Critical Actions, Personal Data Access, Config Change, Security, Billing, Integration (none = all). An entry matches if its action code belongs to any selected category. **Critical Actions** auto-includes the codes RESET_PASSWORD, SUSPEND_ACCOUNT, DELETE_USER, FORCE_LOGOUT, GRANT_ADMIN_ROLE, REVOKE_ADMIN_ROLE, UPDATE_SECURITY_POLICY, EXPORT_AUDIT_LOGS, GRANT_BADGE, REMOVE_BADGE. **Personal Data Access** auto-includes VIEW_USER_CHAT_HISTORY, VIEW_PAYMENT_DETAILS, VIEW_KYC_DOCUMENTS, EXPORT_USER_DATA. (A code can belong to more than one category, e.g. UPDATE_SECURITY_POLICY is both Critical and Security.)
- **Search by resource** (text): live filter matching the action code, resource, and summary text (case-insensitive).
- **Reset filters button**: clears every filter + search, clears the date range/preset, and returns the sort to the default (Time descending), back to page 1.

All multi-select dropdowns show "N selected" on their button, open a checkbox panel, and close on outside click. Filters apply immediately and reset the table to page 1.

**Result count** — a line above the table: "Showing {start}–{end} of {total} entries" (or "Showing 0 of 0 entries").

**Log table** — columns: **Time, Actor, Action, Resource, Severity**.
- **Time** — formatted date/time.
- **Actor** — the admin username, rendered as a **link**: clicking it opens that admin's detail (Admin Management) in a **new tab** (does not select the row).
- **Action** — the action code, shown with a **dotted underline**; hovering shows a **tooltip** with its human-readable description (from a hardcoded dictionary, e.g. UPDATE_SECURITY_POLICY → "Updated platform security policy").
- **Resource** — plain text, except when it matches a recognised entity (USER-*, AGENT-*, ADM-*), in which case it is a **link** opening the relevant detail screen in a **new tab**.
- **Severity** — a coloured badge: Success (green), Danger (red), Info (grey).
- Clicking a row (outside the actor/resource links) **navigates to the detail view** for that entry (and marks the row selected for when you return).
- **Sorting:** every column header is clickable and cycles **ascending (▲) → descending (▼) → unsorted**; only one column sorts at a time; the active arrow shows in the header. **Default: Time descending** (newest first).
- **Empty state:** when filters match nothing, a single centered row "No log entries match the filters." spans all columns.

**Pagination** — fixed **50 rows per page**. Controls below the table: ‹ Prev, numbered buttons (up to 7 with `…` ellipsis), Next ›; current page highlighted; Prev/Next disabled at the ends; the whole bar is hidden when 50 or fewer rows match. Page resets to 1 on any filter/search/sort change.

**Detail view** (shown after clicking a row; the list is hidden)
- **"‹ Back to logs" button** — returns to the list view.
- "Log details" card with: General information (Time, Actor [link], Action [code + description], Resource [link if recognised]), Context & result (Severity badge, Summary), and a Privacy explanation note clarifying that only metadata is shown and payloads live in a separate restricted system.

### Conditional Display

- **Resource link:** only resources matching USER-/AGENT-/ADM- are links; others are plain text.
- **Pager:** hidden when ≤ 50 rows match.
- **Sort arrow:** shown only on the actively sorted column.
- **List vs. detail view:** the list shows on load; clicking a row swaps to the full detail view; "‹ Back to logs" returns. Only one view is visible at a time.

### Auto-refresh (real-time)

- Every **30 seconds** the screen simulates fetching new entries; 1–3 new rows are **prepended** to the top of the data.
- When new rows arrive, a toast "**{N} new log entries loaded.**" appears.
- Auto-refresh runs **continuously and never pauses** — it keeps ticking while the admin is sorting, scrolling, typing in search, or viewing the detail panel. New rows are added without disrupting the current table scroll position or the selected row.
- There is **no "Live"/"Paused" indicator** and no connection/reconnecting status messaging anywhere on the page.

### Meta-audit

- **Viewing** the audit logs adds a VIEW_AUDIT_LOGS entry, and **exporting** adds an EXPORT_AUDIT_LOGS entry, to the demo log data (so the act of accessing/exporting logs is itself audited).

### CSV Export

- Exports the **currently filtered + sorted** list. Values containing commas, quotes, or newlines are wrapped in double quotes, and internal quotes are escaped by doubling. Columns: time, actor, action, action_description, resource, severity, summary.
- On success: toast "**Exported {N} log entries to CSV.**" and a EXPORT_AUDIT_LOGS meta-audit entry is recorded.
- If the filtered list is empty: no file is produced; toast "**No data to export.**"

### Validation

None — all controls are filters/toggles; there are no required inputs.

### Empty States

- **Table (no matches):** centered "No log entries match the filters." spanning all columns; result count shows "Showing 0 of 0 entries".
- **Detail view:** only reached by clicking a row; there is no standalone empty/placeholder panel (the list is shown by default).

### Notifications & Feedback

Bottom-right toasts (auto-dismiss ~3s):
- "{N} new log entries loaded." — auto-refresh added rows.
- "Exported {N} log entries to CSV." — successful export.
- "No data to export." — export attempted with an empty filtered list.

Plus visual feedback: row hover/selection highlight, sort arrows, action-code tooltips on hover.

### Navigation

- Reached from the sidebar (SYSTEM SETTINGS & INTEGRATIONS → "Audit Logs"); loads in the content area, URL unchanged.
- **In-page:** clicking a log row opens its detail view; "‹ Back to logs" returns to the list. This list↔detail swap happens in place (no URL change).
- **New-tab links:** Actor → Admin Management (admin detail) in a new tab; recognised Resource (USER-/AGENT-/ADM-) → the matching detail screen in a new tab. These are the only navigations off this screen.
- **Persistence:** none — logs are in-memory demo data (80+ seeded entries across ~90 days, plus any auto-refresh/meta-audit entries added during the session); reloading resets to the seed.
