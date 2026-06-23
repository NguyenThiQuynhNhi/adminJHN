# Agent Dashboard (`dashboard.html`)

**Purpose:** The agent's home/overview screen. A single content page (rendered in the iframe shell) showing greeting, KPIs, quick actions, recent activity, upcoming viewings, and top-performing properties. All data is hardcoded inline; nothing persists.

**Access:** Sidebar → Workspace → Dashboard (default content of the shell).

---

## Layout & structure (top to bottom)

1. **Greeting bar** — time-of-day greeting ("Good morning/afternoon/evening") for "Tanaka Kenji" of "Tokyo Realty Co." + today's date (localized). Right side: two static badges — "4.8 agent rating" and "Gold tier · 23 closings YTD".
2. **KPI cards grid** (4 tiles).
3. **Quick Actions bar.**
4. **Two-column grid:** Recent Activity (left) + Upcoming Viewings (right).
5. **Property Performance** table card ("Top 5 This Month").

---

## KPI cards (4)

- **Active Listings** — 18, trend "+12% vs last month" (up).
- **New Inquiries This Week** — 24, red pill "8 unread", trend "+4 vs last week" (up).
- **Scheduled Viewings** — 7, neutral "next 7 days".
- **Profile Views This Month** — 1,247, trend "+34% vs last month" (up).

---

## Quick Actions

Buttons: **Add Property**, **Add Project**, **View Inquiries**, **Manage Ads**. Each calls `qaAction(key)` which fires a native `alert()` (e.g. "Add Property — module coming soon", "View Inquiries — module coming soon"; fallback "Coming soon"). "View all →" links on the activity/viewings cards also alert ("Full activity log — coming soon", "Full viewings calendar — coming soon", "My Properties — coming soon").

---

## Recent Activity

List rendered from `ACTIVITY` (8 items: icon, kind, text, time). Kinds: inquiry, viewing, milestone, message, listing.

## Upcoming Viewings

List rendered from `VIEWINGS` (5 items: day, time, property, client, status). Status values: `confirmed` / `pending`.

## Property Performance table

"Top 5 This Month". Columns: **#**, **Property**, **Type**, **Views**, **Inquiries**, **Saved**, **Status**. Rendered from `TOP_PROPERTIES` (5 rows). Status badge: `published` / `draft`.

---

## Filters / modals / forms

None. No filters, no modals, no forms.

## Notifications

No toast system on this page — feedback is via native `alert()` only.

## Navigation & persistence

No links to other pages and no `parent.frame` navigation; all actions are alert stubs. No localStorage; state resets on reload.
