# CRM Activities

Source: [crm-activities.html](../crm-activities.html), current working-tree implementation.

Access: Workspace → CRM Activities → Viewing / Task / Jobs / Calls / Emails / SMS / Comments. Hashes select modules through `syncTypeFromHash()`; Calendar has its own [handoff](agent-portal__calendar.md).

## Exact configuration

Derived from `ACTIVITY_CONFIG`; the columns below are the actual `listCols` (rows open detail).

| Module | Status values | Table columns | Relationships in form |
|---|---|---|---|
| Viewing | Scheduled, Confirmed, Completed, Cancelled, No Show | Title, Lead, Property, Assigned To, Start Date, Status | Lead and Property required |
| Task | Todo, In Progress, Waiting, Done, Cancelled | Title, Assigned To, Start Date, Due Date, Priority, Status | Lead and Property optional |
| Jobs | Pending, In Progress, Completed, Cancelled | Title, Assigned To, Property, Start Date, Status | Lead and Property optional |
| Calls | Completed, Missed, Cancelled | Title, Assigned To, Start Date, Direction, Status | Lead optional; no Property input |
| Emails | Draft, Scheduled, Sent, Failed | Subject, Assigned To, Lead, Sent Date, Status | Lead and Property optional |
| SMS | Draft, Sent, Failed | Title, Assigned To, Lead, Date, Status | Lead optional; no Property input |
| Comments | None | Title, Lead, Author, Date | Lead required by configuration; no standalone create flow |

## Forms and dates

`buildForm()` marks Title (Subject for email), Assigned To, and Start Date & Time required. End Date & Time and Description are optional; Status uses the module's exact values above.

- Viewing: rating 1–5; Customer Interest (Very Interested / Interested / Neutral / Not Interested); Property Condition (Excellent / Good / Fair / Poor); Customer Feedback; internal Agent Notes.
- Task: Priority Low / Medium / High and optional Due Date.
- Jobs: operational work with optional Lead/Property; no deal-value or sales-stage form.
- Calls: Incoming / Outgoing, optional Duration, Summary and Next Action; call logging only.
- Emails: From, To (marked required), CC, attachment placeholder and Email Content. Table uses `sentDate`, whereas the common editor uses `start`/`end`.
- SMS: Phone and Message; table uses `date`. This module is a log, not an SMS delivery implementation.
- Comments: date renders `date || createdAt`; records represent Lead Detail notes. No Add or Edit button; its detail is read-only and hides the generic comment composer. Other activity details have a local internal-comment thread.

## Actual behavior and limits

`renderList()` filters title/subject and status. It renders all matches without working table sort or pagination. Detail and edit are separate screens, not the old modal framework.

`saveActivity()` checks title and required relationships (Viewing Lead/Property), then toasts and returns to the list. It does not write form values into `RECORDS`. The required markers for Assigned To, Start, and email To are not additional save-handler checks. Do not treat the editor as persisted CRUD or the email copy as an implemented email service. Comment posting updates the displayed detail conversation; cross-page creation from Lead is not a shared activity store.
