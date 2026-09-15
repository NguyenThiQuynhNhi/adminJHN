# Calendar

Source: [calendar.html](../calendar.html), current working-tree implementation.

Access: Workspace → CRM Activities → Calendar.

`setView()` provides Month, Week, Day and List. Today and previous/next navigate the seeded calendar date range. Assignee and multi-select Type filters cover Viewing, Task, Job, Call, Email, SMS and Comment. Clicking an event shows a summary toast; clicking a month day can open Day view.

`openQuickCreate()` opens Add Activity or a time-slot creation form: Title, Start Date, Start/End Time, All day, Recurring, Assignee and Notes. Recurrence supports day/week/month intervals, weekday selection and Until, with time suggestions. `saveQuickCreate()` requires title/start date, positive timed duration, weekdays for weekly recurrence, an Until date when recurring, and at least one occurrence. It adds at most 52 occurrences to the local `events` array and moves the calendar to the selected date.

This form does not request Lead or Property even for Viewing. Notes are displayed as an input but are not copied into the saved event object. Calendar events are in memory, separate from CRM `RECORDS`; quick-create labels such as Send SMS/Compose Email do not deliver messages. Comment creation is available here although CRM Comments has no create button.
