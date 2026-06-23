# CRM Activities (`crm-activities.html`)

**Purpose:** The full agent CRM "Activities" workspace. One self-contained page that renders **7 swappable modules** (Viewings, Tasks, Jobs, Calls, Emails, SMS, Comments) into a shared table / filter / modal framework, with full add/edit/delete. All data is in-memory demo content.

**Access:** Sidebar → Workspace → CRM Activities. (Note: this is the richer of the two CRM pages; `crm.html` is the lighter sibling and is not in the sidebar.)

---

## Layout & structure

Topbar (page title + bell with red dot + gear + "TK" avatar) → a dynamically built `#content` area per module: page-header (icon + module name + "Manage your …" subtitle + Add button) → filter bar → card with a sortable data table → pagination bar.

Module switching is via `switchMod()`, driven by the URL hash (`#tasks`, `#jobs`, …; default `viewings`). The file has sidebar CSS but does **not** render `.sb-item[data-mod]` elements — switching is hash/JS only.

---

## Filters (per module)

- **Viewings:** search, Status (All / Scheduled / Completed / Cancelled / No-show), date From, date To, Property.
- **Tasks:** search, Priority (All / High / Medium / Low), Status (All / Pending / In Progress / Completed / Overdue), Relations (All / Lead / Property / General), Due-from date.
- **Jobs:** search, Stage (All / Open / In Progress / Won / Lost / On Hold), Property, From date.
- **Calls:** search, Direction (All / Outbound / Inbound), Outcome (All / Answered / No answer / Voicemail / Callback requested), date From, date To.
- **Emails / SMS:** search, Direction (All / Sent / Received), date From, date To.
- **Comments:** search, Relations (All / Lead / Property / Job / General), date From, date To.

Search placeholder "🔍 Search...". Sortable columns toggle asc/desc.

---

## Tables (columns by module)

- **Viewings:** ID, Client, Phone, Property, Date, Time, Duration, Status, Notes, Actions.
- **Tasks:** ID, Title, Priority, Related To, Due Date, Status, Created, Actions (overdue rows show an inline "Overdue" badge).
- **Jobs:** ID, Title, Client, Property, Value, Stage, Close Date, Created, Actions.
- **Calls:** ID, Client, Phone, Direction, Date & Time, Duration, Outcome, Property, Notes, Actions.
- **Emails:** ID, Direction, Client, Email, Subject, Date & Time, Property, Preview, Actions.
- **SMS:** ID, Direction, Client, Phone, Date & Time, Preview, Property, Actions.
- **Comments:** ID, Preview, Related To, Created, Last Updated, Actions.

Pagination: `PAGE_SIZE = 10`, "Showing X–Y of N {module}" with Prev / numbered / Next.

---

## Modals

- **Add/Edit form** (`#formModal`) — title "Add {Singular}" / "Edit {Singular}", body built per module by `buildForm()`, Cancel / Save.
- **View** (`#viewModal`, read-only) — for Emails (formatted), SMS (chat bubbles), Comments, Jobs.
- **Confirm Delete** (`#confirmModal`) — "Confirm Delete", "Delete {ID}? This action cannot be undone.", Cancel / Delete.
- **Mark Viewing Complete** (`#completeModal`) — Outcome select (Client interested / Not interested / Follow-up needed / Made offer) + Notes; appends outcome to the viewing's notes and marks it completed.

---

## Forms & fields (`*` = required)

- **Viewings:** Client Name\* (datalist), Client Phone, Property\*, Date\*, Time\* (30-min step), Duration (30/60/90), Status, Notes.
- **Tasks:** Task Title\* (≤200), Priority\* (High/Medium/Low), Status, Due Date\*, Due Time, Related Lead, Related Property, Description (≤500).
- **Jobs:** Job Title\* (≤200), Related Lead\*, Property\*, Deal Value (¥), Stage\* (Open/In Progress/Won/Lost/On Hold), Expected Close Date, Notes.
- **Calls:** Client Name (datalist), Phone\*, Direction\* (Outbound/Inbound), Date\*, Time\*, Duration, Outcome\* (Answered/No answer/Voicemail/Callback requested), Related Lead, Related Property, Notes (≤1000).
- **Emails:** Client Name, Email\* (regex-validated), Direction\* (Sent/Received), Date\*, Time\*, Subject\* (≤200), Body\* (≤5000), Related Property.
- **SMS:** Client Name, Phone\*, Direction\* (Sent/Received), Date\*, Time\*, Message\* (≤1000, live counter), Related Property.
- **Comments:** Comment\* (≤3000, live counter), Related Lead, Related Property, Related Job.

---

## Validation

Field errors surfaced as error toasts: "Required fields missing", "Title and due date required", "Phone required", "Email, subject, body required", "Invalid email format", "Phone and message required", "Comment required".

## Notifications (toasts, ~3s)

"{ID} deleted", "Viewing marked complete", "Task marked complete", "Viewing cancelled", "{ID} updated", "{Singular} added" (e.g. "Viewing added"). Cancel uses a native `confirm()`.

## Persistence

None. In-memory arrays (`VIEWINGS`, `TASKS`, `JOBS`, `CALLS`, `EMAILS`, `SMS`, `COMMENTS`, plus reference lists `LEADS`/`PROPS`); new IDs via `nextId(prefix)` (e.g. `VW-2026…`). Navigation is hash-based; URL bar otherwise unchanged. Resets on reload.
