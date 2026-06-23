# Advertising / Monetisation (`ad-monetisation.html`)

**Purpose:** The full-featured agent advertising console — buy ad slots, manage campaigns, review performance, and manage the ad wallet. Four screens. Uses Chart.js (CDN). All data in-memory demo content.

**Access:** Sidebar → Workspace → Advertising. (Richer than `advertising.html`, which is the lighter sibling.)

---

## Layout & structure

Topbar (title changes per screen) → four panels switched via `switchScreen()` (only one un-hidden): **Buy** (Advertise Your Properties), **My Campaigns**, **Performance**, **Wallet**. (The page references `.sb-sub[data-screen]` sub-nav items that are not present in the body — switching is programmatic.)

---

## Buy screen

Hero + grid of slot cards (`renderSlots` from `SLOTS`, 6 slots): Homepage Carousel — New Development, Homepage Carousel — Featured Properties, Sponsored Search Results, In-Article Banner, Property Detail Banner, City / Area Detail Banner. Each card: emoji, name, description, location, est. reach, price, optional note, "Select This Slot".

**Purchase modal** (`#buyModal`) — a 5-step stepper: **Slot Details → Properties → Creative → Review → Confirm** (the Properties step auto-skips when the slot needs no property; Creative auto-skips when no creative needed).
- Step 1 varies by slot kind (carousel position + duration/dates + price preview; sponsored search: City/Station toggle + property type + position + budget + est. impressions + hometown discount; article category; detail-banner filter; city-page picker with occupancy/waitlist).
- Step 2: property picker (max 3, equal impression-split note).
- Step 3: creative dropzone (1200×400, ≤5MB).
- Step 4: summary + hometown-discount line + wallet sufficiency check + two required consent checkboxes (impressions not guaranteed; advertising T&Cs).
- Step 5: confirmation card with a generated `CAM-00xx` ID.

**Hometown discount:** `AGENT_CITIES = ["Minato-ku","Shibuya","Shinjuku"]` — sponsored search in those cities gets 15% off CPM (~1.15× est. impressions).

---

## My Campaigns screen

Filters: search ("🔍 Search by campaign ID or slot name"), Slot Type (All / Carousel / Sponsored Search / In-Article Banner / Property Detail Banner / City Banner), Status (All / Pending Review / Active / Paused / Terminated / Rejected / Expired), date From, date To.

Table (`#campTable`): **Campaign ID, Slot Type, Slot Details, Properties, Budget / Period, Status, Delivered%, Actions**.

Modals:
- **Action confirmation** (`#actModal`): Cancel Pending Campaign / Pause Campaign / Terminate Campaign / Resume Campaign / Resubmit Campaign / Renew Campaign (terminate shows an estimated prorated wallet credit).
- **View campaign** (`#viewCampModal`): summary; for rejected campaigns shows rejection category + reason and a "Resubmit with Changes" button.

---

## Performance screen

KPIs (`renderPerfKpi`): **Total Impressions** 91,200 (▲+18%), **Total Clicks** 2,265 (CTR 2.48%), **Conversions** 62, **Total Spend** ¥116,400 (of ¥320,000 budget), **Avg. Delivered%** 55%.

Controls: date-range tabs (This Week / This Month / Last 3 Months / Custom); chart toggles (IMP / Clicks / Conversions).

Tables: **Per-Campaign Breakdown** (`#perfTable`: Campaign, Status, IMP, CL, CTR, CV, CVR, Spend, Delivered%; multi-property rows expand to a per-property sub-table). **Conversion Funnel:** Impressions 91,200 → Clicks 2,265 → Landing Page View 1,985 → Engagement (>30s) 720 → Saved / Chat Started 62, with drop-off %.

---

## Wallet screen

Hero: Current Balance ¥24,500 (`WALLET_BALANCE`). Mini-cards: Total spent this month ¥15,500, Pending pre-auth ¥3,200, Available balance ¥21,300.

Transaction History (`#txTable`): **Date & Time, Description, Amount, Balance After, Type**. Type filter: All / Top-up / Ad Spend / Refund / Pre-auth.

**Top Up modal** (`#topUpModal`): presets ¥10,000 / ¥30,000 (default) / ¥50,000 / ¥100,000 + custom (min ¥1,000); Stripe info banner.

---

## Notifications (toasts, ~3s)

"Campaign submitted for review", "{id} terminated", "{id} paused", "{id} resumed", "Purchase flow opened — pre-filled", "Renewal flow opened", "Topped up {¥amount}", "Minimum ¥1,000" (error).

## Validation

Step 4 requires both consent checkboxes and sufficient wallet balance (an insufficient-balance link calls `switchScreen('wallet'); openTopUp()`). Top-up minimum ¥1,000.

## Persistence

None. In-memory `SLOTS`, `CAMPS`, `TX`, `MY_PROPS`, `WALLET_BALANCE`; top-up updates the displayed balance and prepends a TX row in-session only. New campaign IDs `CAM-00{…}`. No routing. Resets on reload.
