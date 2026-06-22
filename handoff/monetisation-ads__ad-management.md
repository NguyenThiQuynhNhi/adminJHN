## Ad Management

**Purpose:** The admin's control center for the platform's advertising business. From here the admin reviews and approves (or rejects) ad requests submitted by agents, manages ads that are already running (pause / resume / terminate), inspects the inventory of every ad slot (both fixed-price slots and dynamic auction-style pools), sees which slots are currently empty, and acts on system-generated pricing and underdelivery alerts.

**Access:** Admin sidebar → MONETISATION & ADVERTISING → "Ad Management". Opens inside the admin shell's content area. There is no separate login on this screen; whoever can see the sidebar item can use it.

---

### Layout & Structure

The screen is a single page with:

1. **Page header** at the top: a large title "Ad Management". (No subtitle or description text under it.)
2. **A row of 5 tabs** directly below the title. Only one tab's content shows at a time. Some tabs carry a small coloured count bubble (a number badge) on the right of the tab label.
3. **A content area** that swaps between the 5 tab views.
4. **Two pop-up windows (modals)** that appear over the page when triggered: a "Review Ad Request" window and a "Slot Pool" window.
5. **Toast messages** (small temporary confirmation notices) that appear bottom-right after actions.

The 5 tabs, in order:

- **Approval Queue** (clipboard icon) — carries a red count bubble showing the number of pending requests. This is the tab shown by default when the screen opens.
- **Active Ads** (megaphone icon) — no count bubble.
- **Slot Inventory** (grid icon) — no count bubble.
- **Vacant Slots** (half-circle icon) — carries a red count bubble showing the number of empty slots.
- **Pricing Intelligence** (line-chart icon) — carries an amber count bubble showing the number of active price alerts.

Clicking a tab highlights it (filled accent colour) and shows that tab's content. Switching tabs does not change the web address and does not reload the page; the previously shown tab simply hides.

---

### Every Element

#### Background concepts the BA should know (used throughout)

There are **5 ad product types**. Each has a fixed identity used across all tabs:

| Type | Name | Advertises | Pricing model | What the slot is |
|---|---|---|---|---|
| 1 | Homepage Carousel | Property | Fixed monthly price per rank | 5 ranked positions in the homepage carousel. Position 1 is most expensive. Exclusive — 1 agent per position per booking period. |
| 2 | Standalone Page Banner | Agent | Fixed monthly | One banner on each standalone page (e.g. Area Guide, Mortgage Calculator). Exclusive — 1 agent per page, first-come-first-served. |
| 3 | Search Results Top 3 | Property | Dynamic — weighted rotation | Top 3 spots of property search results. A slot = Location × Property Type × Rank. Each rank is its own competitive pool; multiple agents compete, rotation weighted by budget × time. |
| 4 | In-Article Banner | Agent | Dynamic — weighted rotation | Mid-article banner across News & Blog. A slot = an Article Category. One purchase shows the banner in ALL articles of that category. Multiple agents per category, weighted rotation. |
| 5 | Property Detail Banner | Agent | Dynamic — weighted rotation | Banner on property detail pages. A slot = Location × Property Type filter. One purchase shows the banner on ALL matching property detail pages. Multiple agents per filter, weighted rotation. |

The **6 demo agents** referenced everywhere: Yamada Hiroshi (Tokyo Realty Co., rating 4.7), Sato Mei (Osaka Property Group, 4.5), Tanaka Kenji (Yokohama Estates Ltd., 4.8), Lee Min-jun (Shibuya Living Co., 4.3), Watanabe Aiko (Kyoto Heritage Realty, 4.9), Suzuki Daichi (Fukuoka Bay Realty, 4.4).

---

#### TAB 1 — Approval Queue

**Card title:** "Pending Ad Requests" with a live count caption reading `{n} pending · {m} shown`.

**Filter bar** (changing any filter re-runs the list immediately; none are required):

- **Agent** dropdown. Default option: "All agents". Then one option per agent, labelled `{Company} — {Agent name}`. Effect: shows only that agent's requests.
- **Ad Type** dropdown. Options in order: "All ad types" (default), "Homepage Carousel", "Standalone Page Banner", "Search Results Top 3", "In-Article Banner", "Property Detail Banner". Effect: limits to that ad type.
- **Advertises** dropdown. Options: "All" (default), "Property", "Agent". Effect: limits to ad types that advertise the chosen thing.
- **Status** dropdown. Options: "Pending only" (this is the default selected on load), "All statuses". Effect: "Pending only" shows just pending requests; "All statuses" shows both Pending and Rejected requests (Active/Paused/Terminated never appear in this tab).
- **From** date picker and **To** date picker. Default empty. Effect: filters by the request's submitted date (inclusive range).
- **Total: {n}** — a live count of rows currently shown (right-aligned).

**Table** columns in order: Request ID · Submitted · Agent · Ad Type · Slot · Budget · Duration · Status · Actions.

- Sortable columns (click header to sort, click again to flip ascending/descending; an arrow shows the current sort): Request ID, Submitted, Agent, Ad Type, Budget, Duration, Status. The columns "Slot" and "Actions" are not sortable.
- Default sort: by Submitted, newest first.
- Budget shows as yen with thousands separators (e.g. ¥1,200,000). Duration shows as a number of days with a "d" suffix (e.g. "30d").
- Status cell is a coloured badge (see status badges below).
- Row click: no whole-row click behaviour; only the action button is interactive.
- **Per-row action:** if the request is Pending → a primary "Review" button (magnifier icon). If the request is any other status (i.e. Rejected) → a plain "View" button (eye icon). Both open the Review Ad Request modal for that request.
- **Pagination (fixed 50 per page):** directly above the table a result line reads `Showing {start}–{end} of {total} ads` (when nothing matches it reads `Showing 0 of 0 ads`). Below the table sit pagination controls: a **Prev** button, numbered page buttons (at most 7 visible at once; gaps are shown as "…"), and a **Next** button. The current page button is highlighted in gold. **Prev** is disabled on page 1 and **Next** on the last page. The whole control row is hidden when everything fits on a single page (≤ 50 rows). The page resets to 1 whenever a filter is changed, the search/sort is re-run, the tab is switched, or the screen is reloaded; the current page is *preserved* when a row action (approve/reject) re-renders the list, but it is **not** remembered across a full page reload.

#### TAB 2 — Active Ads

**Card title:** "Active Ads" with a caption `{n} ads`.

**Filter bar:**

- **Agent** dropdown — "All agents" (default) + one per agent (`{Company} — {Agent name}`).
- **Ad Type** dropdown — "All types" (default), then the 5 ad type names.
- **Advertises** dropdown — "All" (default), "Property", "Agent".
- **Status** dropdown — "All statuses" (default), "Active", "Paused". (Only Active and Paused ads appear in this tab regardless.)
- **Total: {n}** live count.

**Table** columns in order: Agent · Type · Slot · Creative · Start · End · IMP · Delivered% · Status · Actions.

- Sortable columns: Agent, Type, Start, End, IMP, Delivered%. Not sortable: Slot, Creative, Status, Actions.
- Default sort: by Agent, ascending.
- Agent cell shows the agent name on line 1 and the ad ID (small, dim) on line 2.
- IMP = impressions, shown as a formatted number.
- Creative cell shows a small badge: an orange "Banner" badge (rectangle-ad icon) for banner creatives, or a blue badge with a house icon plus the property name (first 22 characters) for property creatives.
- Delivered% is a bold percentage, colour-coded: red if below 70%, amber if 70–89%, green if 90% or above.
- Status cell: coloured badge.
- **Per-row actions:** if Active → "Pause" button (pause icon). If Paused → green "Resume" button (play icon). In both cases there is also a "Terminate" button (red outline, stop icon).
- **Pagination (fixed 50 per page):** identical behaviour to the Approval Queue table — a result line above the table reads `Showing {start}–{end} of {total} ads` (or `Showing 0 of 0 ads` when empty), and Prev / numbered (≤ 7, with "…") / Next controls sit below it with the current page in gold, Prev disabled on page 1 and Next on the last page, and the whole row hidden when ≤ 50 rows. The page resets to 1 on any filter/sort/tab change or reload, and is preserved when a row action (pause/resume/terminate) re-renders the list.

#### TAB 3 — Slot Inventory

Five stacked cards, one per ad product. Each card title carries a type badge (e.g. "Property · Fixed", "Agent · Dynamic") and a one-line description.

**Card 1 — Homepage Carousel** (badge "Property · Fixed"). Description: "5 ranked positions in homepage carousel · 1 agent per position · fixed monthly price per rank". Table columns: Position · Current Occupant · Start · End · Next Up · Waitlist · Price · Status · Actions.
- Position cell shows "Position N" plus the slot ID (small).
- Occupant empty shows a dash. Next Up of "—" shows a dash.
- Price shows yen plus "/month".
- Status badge: Occupied / Available / House Ad (see badges).
- Per-row actions: "Price" (pencil icon) and "History" (clock icon).
- No sorting, no filter, no pagination on this card.

**Card 2 — Standalone Page Banner** (badge "Agent · Fixed"). Description: "1 banner slot per standalone page (Area Guide, Mortgage Calculator) · 1 agent per page, first-come-first-served". Columns: Page · Current Occupant · Start · End · Next Up · Waitlist · Price · Status · Actions. Same cell behaviour and same "Price" / "History" actions as Card 1.

**Card 3 — Search Results Top 3** (badge "Property · Dynamic"). Description: "Slot = Location × Property Type × Rank · each rank is its own pool · multiple agents compete per rank, weighted by budget × time". Has its own filter bar:
- **Location** dropdown — "All locations" (default) + each unique location found in this product's slots.
- **Property Type** dropdown — "All types" (default) + each unique property type.
- **Rank** dropdown — "All ranks" (default), "Rank 1 only", "Rank 2 only", "Rank 3 only".
- **Alert** dropdown — "All alerts" (default), "🔔↑ Recommend ↑", "🔔↓ Recommend ↓", "Healthy".
- Table columns: Slot (Location × Type × Rank) · Active Agents · Contracted IMP · Available IMP · Occupancy · CPM · Avg Delivered% · Alert · Actions.
- Available IMP is computed (contracted impressions minus what occupancy has consumed). Occupancy and Avg Delivered% show as whole-number percentages. CPM shows as yen.
- Alert cell: coloured badge (see Alert badges).
- Per-row actions: "CPM" (pencil icon), "Pool" (people icon — opens the Slot Pool modal), "Block" (red outline, ban icon).

**Card 4 — In-Article Banner** (badge "Agent · Dynamic"). Description: "Slot = Article Category · 1 purchase shows banner in all articles of that category · multiple agents per category, weighted rotation". Filter bar: **Category** dropdown ("All categories" + each unique category) and **Alert** dropdown (same 4 options as above). Table columns: Article Category · Articles in Category · Active Agents · Contracted IMP · Available IMP · Occupancy · CPM · Avg Delivered% · Alert · Actions. Same three per-row actions (CPM / Pool / Block).

**Card 5 — Property Detail Banner** (badge "Agent · Dynamic"). Description: "Slot = Location × Property Type filter · 1 purchase shows banner on all property detail pages matching the filter · multiple agents per filter, weighted rotation". Filter bar: **Location**, **Property Type**, **Alert** dropdowns. Table columns: Filter (Location × Property Type) · Matching Properties · Active Agents · Contracted IMP · Available IMP · Occupancy · CPM · Avg Delivered% · Alert · Actions. Same three per-row actions.

No sorting or pagination on any Slot Inventory table.

#### TAB 4 — Vacant Slots

Top of tab: **3 summary KPI cards** (computed live):
- "Total Vacant Slots" — the total empty count, with a breakdown caption like `{a} HP · {b} Page · {c} Search · {d} Article · {e} Detail`.
- "Fixed Vacant" — count of empty Homepage + Standalone Page slots. Value turns amber if greater than 0, green if 0. Caption: "Homepage + Standalone Page".
- "Dynamic Pools Empty" — count of dynamic pools with no agents. Amber if >0, green if 0. Caption: "No agent bought this slot yet".

Below the KPIs, **5 cards**, one per product, each listing only the empty slots:
- "Homepage Carousel — Vacant Positions" (caption `{n} vacant of 5 positions`). Columns: Position · Price.
- "Standalone Page Banner — Vacant Pages" (caption `{n} vacant of {total} pages`). Columns: Page · Price.
- "Search Results Top 3 — Empty Slots" (caption `{n} empty slot(s)`). Columns: Slot (Location × Type × Rank) · CPM.
- "In-Article Banner — Empty Categories" (caption `{n} empty category` / `categories`). Columns: Category · Articles · CPM.
- "Property Detail Banner — Empty Filters" (caption `{n} empty filter(s)`). Columns: Filter (Location × Property Type) · Properties · CPM.

No actions, sorting, filters, or pagination in this tab — it is read-only.

#### TAB 5 — Pricing Intelligence

Top of tab: **4 summary KPI cards** (computed live):
- "Total Ad Revenue (MTD)" — sum of budgets of Active + Paused ads, shown in yen, with a green "▲ {x}% vs last month" caption.
- "Platform Occupancy" — average occupancy across all dynamic slots (a percentage), caption "Across {n} dynamic slots".
- "Active Price Alerts" — number of dynamic slots flagged for a price change, caption "Demand-driven adjustments".
- "Underdelivery Alerts" — number of active ads delivering below 90%. Caption is red "Refund / extension required" when >0, otherwise grey "All bookings on track".

**Price Alert Panel** card (tags icon, caption "Demand-driven CPM / monthly price recommendations"). Table columns: Slot · Current Price · Demand Score · 3M Occupancy · Recommended Change · Suggested New Price · Alert Type · Actions.
- Demand Score shows as `{x.x} / 4.0`.
- Recommended Change shows green "▲ +{x}%" for increases or red "▼ {x}%" for decreases.
- Alert Type cell: the same coloured Alert badge.
- Per-row actions: green "Approve" (check icon) and plain "Dismiss" (x icon).
- Only slots whose alert is not "healthy" appear here.

**Underdelivery Alert Panel** card (warning-triangle icon, caption "Bookings delivering < 90% of contracted impressions"). Table columns: Booking ID · Agent · Slot · Contracted IMP · Delivered IMP · Delivered% · Severity · Days Left · Recommended Action.
- Delivered% colour: red below 70%, amber 70–89%.
- Severity badge: "Critical" (red) if below 70%, otherwise "Warning" (amber).
- Days Left counts down to the ad's end date (calculated from a fixed reference "today" of 2026-05-19).
- Recommended Action cell: for Critical → green "Credit ¥{amount}" button (wallet icon); for Warning → "Extend +{n}d" button (calendar icon). Both rows also have a red-outline "Flag" button (flag icon).
- Only active ads delivering below 90% appear here.

#### Status badges (every status, colour, and trigger)

| Badge | Colour | Where / when |
|---|---|---|
| Pending | amber | Ad request awaiting review |
| Active | green | Approved / running ad |
| Rejected | red | Request rejected by admin |
| Paused | grey | Active ad paused by admin |
| Terminated | dark | Active/Paused ad ended early |
| Expired | dark | (Defined in code; same dark style as Terminated. Not produced by any on-screen action in this mockup.) |
| Occupied (inventory) | orange | Fixed slot currently sold |
| Available (inventory) | green | Fixed slot open / for sale |
| House Ad (inventory) | purple | Fixed slot filled with a house ad (no paying occupant) |

#### Alert badges (Slot Inventory + Pricing)

| Badge | Colour | Meaning |
|---|---|---|
| 🔔↑ Recommend ↑ | green | Demand high — system recommends raising the price |
| 🔔↓ Recommend ↓ | red | Demand low — system recommends lowering the price |
| Healthy | grey | No price change recommended |

---

### Modals & Popups

#### Modal A — Review Ad Request

- **Triggered by:** the "Review" or "View" button on any Approval Queue row.
- **Title:** "Review Ad Request" plus the request ID.
- **Close:** an "✕" button in the header. (There is no click-outside-to-close.)
- **Body** is read-only detail, organised into sections:
  - **Slot & Targeting:** Ad Type (badge + full name), Advertises, Slot, Start Date, End Date, Duration (shown as "{n} days").
  - **Agent:** Agent name, Company, Agent ID, Rating (shown as "★ {rating} / 5").
  - **Budget & Pricing:** Total Spend (yen); CPM (yen — shown only when the ad has a CPM); Est. Impressions (a number — shown when available), otherwise a line reading "Slot Model: Fixed monthly (no CPM)".
  - **Creative Preview:** for a banner creative, a styled banner showing the company name, the tagline, and an optional call-to-action label; for a property creative, a card showing a house icon, the property name, "{Property ID} · {Location}", and the price.
  - **Rejection record** (only shown if the request is already Rejected): Reason, optional Note, optional "Refunded at" timestamp.
  - **Reject form** (hidden until the admin clicks "Reject" — see below): a "Rejection reason" dropdown and a "Note to agent (optional)" text box.
- **Footer:** left side shows "Current status: {badge}". Right side has two buttons: a red-outline "Reject" button and a green "Approve" button.

The inline **Reject form** (revealed by the footer "Reject" button):
- **Rejection reason** dropdown. Default option "— Select reason —". Options: "Creative quality issue", "Inappropriate content", "Slot already occupied", "Incorrect targeting", "Misleading information", "Other". Required.
- **Note to agent (optional)** multi-line text box. Placeholder: "Specific feedback for the agent — image dimensions, content guideline, etc." Not required.
- Two buttons: "Cancel" (hides the form again) and red "Confirm reject & refund".

#### Modal B — Slot Pool

- **Triggered by:** the "Pool" button on any dynamic-slot row in Slot Inventory.
- **Title:** "Slot Pool —" plus the slot label.
- **Close:** an "✕" button in the header and a "Close" button in the footer.
- **Body:** if the slot has competing agents, it lists each agent as a row showing: agent name, their budget (yen), their share of rotation as a percentage labelled "share", a small progress bar for their delivered percentage, and a coloured badge showing their delivered percentage (green = good, amber = warning, red = poor). If the slot has no agents, it shows the message "No active agents in this slot pool."

---

### Conditional Display

- **Approval Queue Status filter = "Pending only"** → shows only Pending requests; **= "All statuses"** → shows Pending and Rejected only.
- **Approval Queue row action button** → "Review" (primary) when Pending; "View" (plain) for any other status.
- **Active Ads row action** → "Pause" when Active; "Resume" (green) when Paused. "Terminate" always present.
- **Active Ads Delivered% colour** → red <70%, amber 70–89%, green ≥90%.
- **Review modal — CPM field** → shown only when the request has a CPM value.
- **Review modal — Est. Impressions vs "Fixed monthly (no CPM)"** → the impressions line shows when an estimate exists; otherwise the fixed-monthly note shows instead.
- **Review modal — call-to-action label on banner preview** → shown only if the creative has a CTA.
- **Review modal — Rejection record section** → shown only when the request status is Rejected (and Note / Refunded-at lines show only when present).
- **Reject form** → hidden until "Reject" is clicked; can be hidden again with "Cancel".
- **Slot Pool modal body** → agent list vs "No active agents in this slot pool." depending on whether the slot has a pool.
- **Vacant KPI value colours** → "Fixed Vacant" and "Dynamic Pools Empty" turn amber when greater than 0, green when 0.
- **Pricing — Underdelivery KPI caption** → red "Refund / extension required" when >0, grey "All bookings on track" when 0.
- **Pricing — Recommended Change** → green up-arrow for increases, red down-arrow for decreases.
- **Underdelivery — Severity & action** → "Critical" badge + "Credit" button below 70%; "Warning" badge + "Extend" button at 70–89%.
- **Count bubbles on tabs** → the Pending, Vacant, and Price-Alert bubbles hide entirely when their count is 0.
- **Inventory occupant / Next Up** → show a dash when empty.

---

### User Flows

**Approve an ad request**
1. On Approval Queue, click "Review" on a Pending row → the Review Ad Request modal opens with full details.
2. Click "Approve" → the request becomes Active; an approval timestamp is recorded; a success toast appears; the modal closes; the Approval Queue and Active Ads lists refresh (the request now appears under Active Ads and the pending count drops).
3. If "Approve" is clicked on a request that is no longer Pending (e.g. already actioned), a warning toast "Already actioned." appears and nothing changes.

**Reject an ad request**
1. In the Review modal, click "Reject" → the inline reject form appears.
2. Choose a rejection reason (required) and optionally type a note.
3. Click "Confirm reject & refund". If no reason is selected → error toast "Please select a rejection reason." and nothing happens. If a reason is selected → the request becomes Rejected, the reason/note and a refund timestamp are saved, a warning toast confirms the refund, the modal closes, and the queue refreshes.
4. "Cancel" hides the reject form without rejecting.

**View an already-decided request**
1. Click "View" on a Rejected row → the modal opens read-only, including the Rejection record section.

**Pause / Resume an active ad**
1. On Active Ads, click "Pause" → a confirmation dialog appears. Confirm → status becomes Paused, warning toast appears, the action button becomes "Resume", list refreshes.
2. Click "Resume" on a paused ad → status becomes Active immediately (no confirm), success toast appears, list refreshes.

**Terminate an active ad**
1. Click "Terminate" → a confirmation dialog shows the prorated refund amount. Confirm → status becomes Terminated, a warning toast confirms the refund, list refreshes (the ad no longer appears in Active Ads).

**Inspect a dynamic slot pool**
1. On Slot Inventory, click "Pool" on a dynamic-slot row → the Slot Pool modal opens showing each competing agent's budget, rotation share, and delivery. Close with "✕" or "Close".

**Act on a price alert**
1. On Pricing Intelligence, in the Price Alert Panel, click "Approve" → the slot's CPM updates to the suggested new price, the alert clears (becomes Healthy), a success toast appears, and the panel, inventory, and KPIs refresh.
2. Click "Dismiss" → the alert clears (Healthy) without changing the price, a warning toast appears, and the panels refresh.

**Demo-only buttons (no real effect yet)**
- Inventory "Price" / "CPM" / "History" / "Block", and Underdelivery "Credit" / "Extend" / "Flag" — each shows a simple browser alert message describing the intended action. These are placeholders for future functionality.

**Filtering / sorting**
- Changing any filter dropdown or date immediately re-runs that tab's list.
- Clicking a sortable column header sorts by it; clicking the same header again reverses direction.

---

### Validation

- **Rejection reason** is required when confirming a rejection. If left blank: error toast "Please select a rejection reason." (the rejection does not proceed).
- **Approve / Reject guard:** if the request is no longer Pending when the admin clicks Approve or Confirm reject, the system shows warning toast "Already actioned." and makes no change.
- **Pause and Terminate** require confirming a browser dialog before proceeding; cancelling the dialog aborts the action with no change.
- No other input validation exists. Filters and the optional note accept any value. There are no length, format, or numeric-range checks on this screen.

---

### Empty States

- Approval Queue table (no matches): "No requests match the filter."
- Active Ads table (no matches): "No active ads match the filter."
- Slot Inventory — Search Results Top 3 (no matches): "No slots match."
- Slot Inventory — In-Article Banner (no matches): "No categories match."
- Slot Inventory — Property Detail Banner (no matches): "No filters match."
- Vacant — Homepage (none vacant): "All 5 positions are occupied." (green, with a check icon)
- Vacant — Standalone Page (none vacant): "All standalone page banners are occupied."
- Vacant — Search (none empty): "All search slots have active agents."
- Vacant — In-Article (none empty): "All article categories have active agents."
- Vacant — Property Detail (none empty): "All property detail filters have active agents."
- Pricing — Price Alert Panel (none): "No price alerts. All slots are healthy."
- Pricing — Underdelivery Panel (none): "All active bookings delivering ≥ 90%. No alerts."
- Slot Pool modal (no agents): "No active agents in this slot pool."

---

### Notifications & Feedback

**Toast messages (temporary, bottom-right, auto-dismiss):**
- Approve success: "Approved {request ID}. Ad will go live on {start date}."
- Approve/Reject when already decided: "Already actioned." (warning)
- Reject missing reason: "Please select a rejection reason." (error)
- Reject success: "Rejected {request ID}. {¥budget} refunded to {agent}." (warning)
- Pause: "{ad ID} paused. Delivery suspended; end date will adjust on resume." (warning)
- Resume: "{ad ID} resumed. Delivery restarted." (success)
- Terminate: "{ad ID} terminated. {¥refund} refunded to {agent}." (warning)
- Approve price change: "{slot} → new CPM {¥new price} applied." (success)
- Dismiss price alert: "{slot} alert dismissed." (warning)

**Confirmation dialogs (must be accepted to proceed):**
- Pause: "Pause {ad ID}? Agent will not be charged for paused days — end date will be extended accordingly."
- Terminate: "Terminate {ad ID}? This will refund {¥refund} (prorated for {n}% undelivered impressions)."

**Placeholder alerts (demo-only, informational pop-ups):**
- Homepage inventory "Price": "Edit price for Position {n}"
- Static inventory "Price": "Edit price"
- Homepage/Static "History": "Booking history"
- Dynamic inventory "CPM": "Edit CPM for {slot label}"
- Dynamic inventory "Block": "Block list added (demo)"
- Underdelivery "Credit": "Issue wallet credit: {¥amount}"
- Underdelivery "Extend": "Extend booking by {n} days"
- Underdelivery "Flag": "Flagged for investigation"

**Other live feedback:** the Pending / Vacant / Price-Alert count bubbles on the tabs, the per-card count captions, the "Total: {n}" / "{n} ads" counts, and the `Showing {start}–{end} of {total} ads` result lines on the Approval Queue and Active Ads tables all update automatically as data, filters, and the current page change.

---

### Navigation

- **Entry:** Admin sidebar → MONETISATION & ADVERTISING → "Ad Management".
- **Within the screen:** 5 tabs switch the visible content (no address change, no reload). The default tab on open is Approval Queue.
- **Modals:** open over the page and are dismissed by their "✕" / "Close" buttons. They do not navigate away.
- **No links to other screens, no back button, and no breadcrumb** on this screen.
- **Persistence:** None. All changes (approvals, rejections, pauses, terminations, price updates, dismissals) are held only in the current browser session and are lost on page reload — this is a mockup with no backend. Filter selections and sort order also reset on reload (the Status filter resets to "Pending only").
