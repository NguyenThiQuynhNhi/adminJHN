# CRM (lighter) (`crm.html`)

**Purpose:** A simpler, tab-based CRM page — Tasks (kanban), Viewings (list + calendar), and Activity Log (timeline). The lighter sibling of `crm-activities.html`. All data in-memory demo content.

**Access:** Not linked in the shell sidebar (a fragment-style page); opened directly. CRM Activities (`crm-activities.html`) is the sidebar-linked CRM.

---

## Layout & structure

Page header ("CRM" + "Manage your tasks, schedule viewings, and review activity log") + a tab bar with three panels: **Tasks**, **Viewings**, **Activity Log**.

---

## Tasks tab (kanban)

A count line "**5** tasks across 3 columns · drag to move", then 3 droppable columns: **📋 To Do**, **🔧 In Progress**, **✅ Done** (HTML5 drag-and-drop between columns; per-column count badges). Each card: title, due date (with "(overdue)" flag), property, client, priority chip, delete button.

## Viewings tab

A List/Calendar toggle (📋 List / 📅 Calendar).
- **List table** columns: Date & Time, Property, Client, Phone, Status, Notes, Actions.
- **Calendar:** a static month grid hardcoded to **May 2026** (prev/next chevrons are non-functional); events placed from `VIEWINGS`, colored by status (confirmed/pending/completed).

## Activity Log tab

Vertical timeline (colored dots per kind: viewing/task/call/email); each entry shows timestamp + kind + description. Filters: type select (All / Viewings / Tasks / Calls / Emails), From date, To date. **Export CSV** builds a CSV (with BOM) of the filtered log and downloads `activity-log.csv`.

---

## Modals

- **New Task** (`#taskModal`): Title\*, Due Date\*, Priority (Medium/High/Low), Related Property (None + 5 fixed), Related Client.
- **Schedule Viewing** (`#viewModal`): Property\* (5 fixed), Client Name\*, Phone, Date\*, Time\*, Notes.

## Validation

Task requires title + due date; viewing requires client + date + time. (Note: the validation message "Title and due date required" is shown as a success-styled toast.)

## Notifications (toasts, ~2.4s)

"Moved to To Do/In Progress/Done" (on drag-drop), "Task deleted", "Title and due date required", "Task added", "Marked complete", "Cancelled", "Viewing scheduled", "CSV exported", "{edit} → {id} (demo)". Delete task / cancel viewing use native `confirm()`.

## Persistence

None. In-memory `TASKS`, `VIEWINGS`, `LOG` arrays; resets on reload. No routing.
