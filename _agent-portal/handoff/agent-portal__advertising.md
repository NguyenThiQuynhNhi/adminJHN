# Advertising (lighter) (`advertising.html`)

**Purpose:** A simpler, tab-based advertising page — Buy Ads, My Campaigns, Performance. The lighter sibling of `ad-monetisation.html` (no Wallet, no funnel, no expandable rows, no city slot). Uses Chart.js (CDN). All data in-memory demo content.

**Access:** Not linked in the shell sidebar (fragment-style); opened directly. `ad-monetisation.html` is the sidebar-linked advertising page.

---

## Layout & structure

Page header ("Advertising" + "Promote your listings with targeted ad campaigns") + a tab bar: **Buy Ads**, **My Campaigns**, **Performance**.

---

## Buy Ads tab

Intro hero + a horizontal scroll of 5 slot cards (`SLOTS`): Homepage Carousel ¥120,000/mo, Static Banner ¥45,000/mo, Sponsored Search ¥850 CPM, In-Article Banner ¥650 CPM, Property Detail Banner ¥720 CPM. Each has "Learn more" (native `alert()`) + "Buy this slot". Plus a "How it works" 5-step list.

**Purchase modal** (`#buyModal`) — 5-step stepper: **Slot details → Select properties → Budget & dates → Upload creative → Review**.
- Step 1 varies by slot key (search: city/type/rank + hometown badge if city includes "minato"; carousel: position + devices; static: page + placement; article: category; detail: filter config + match priority).
- Step 2: brand-banner notice for static/article/detail, else a max-3 property checkbox list.
- Step 3: start/end dates + budget.
- Step 4: creative dropzone for image slots, or a "no creative needed" notice for search.
- Step 5: review summary + a 24–48h admin-review warning.

---

## My Campaigns tab

Filters: Status (All / Active / Pending Review / Rejected / Paused / Expired), Ad type (All / Homepage Carousel / Static Banner / Sponsored Search / In-Article Banner / Property Detail Banner).

Table: **Campaign ID, Ad Type, Slot, Properties, Budget, Start–End, Status, Delivered (progress bar), Actions**. From `CAMPS` (4 demo campaigns AD-501…AD-504; AD-504 rejected with a reason).

## Performance tab

KPI cards (hardcoded): **Total Impressions** 142,580 (+18%), **Total Clicks** 3,124 (+22%), **Avg CTR** 2.19% (+0.3pt), **Total Conversions** 87, **Total Spend** ¥215,400 (of ¥320,000). Date-range select (This Week / This Month / Last 3 Months). Per-Campaign Performance table: **Campaign, IMP, CL, CTR, CV, CVR, Spend, Delivered** (only campaigns with impressions > 0). Chart data is randomized per render.

---

## Notifications (toasts, ~2.7s)

"Campaign submitted for admin review (demo)" (final submit), "{view/pause/terminate/renew} → {id} (demo)". Terminate uses native `confirm("Terminate {id}? Remaining budget refunded.")`; "Learn more" uses native `alert()`.

## Validation

No real validation; submit just toasts and closes (nothing is added to `CAMPS`).

## Persistence

None. In-memory `SLOTS`, `CAMPS`; resets on reload. No routing.
