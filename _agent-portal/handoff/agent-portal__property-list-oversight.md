# Properties — Listings (`property-list-oversight.html`)

**Purpose:** The agent's property-listing management screen (list + grid views, filters, sale-status / mark-as-sold, navigation to detail/project pages).

Source: [property-list-oversight.html](../property-list-oversight.html), the current Agent implementation. Admin documentation is not the source of truth for this screen; no file-equivalence claim is made.

**Access:** Sidebar → Workspace → Properties.

---

## Key features (summary)

- **List view + grid/card view toggle** (Table / Grid).
- **Sale Status** column/field and a **Mark as Sold** action.
- **Filter bar** for narrowing the listings.
- Loads the shared **`../property-card.js`** renderer.

---

## Part 1 — Alerts subsystem (added)

Per-listing **alert detectors** are pure functions `(listing) => alert | null`; each alert is `{ key, id, entityId, severity, title, desc, actionLabel, actionFn }`. `computeAlerts(p)` runs all detectors, drops nulls and muted non-critical alerts, and sorts by severity; `computeAllAlerts()` aggregates across every listing; `activeAlertIdSet()` returns the ids that have ≥1 active alert (used by the filter pill).

**7 detector types** (`ALERT_DETECTORS` array):

| Detector | Severity | Trigger |
|---|---|---|
| `detStale` — Stale listing | warning | Published, active > 90 days, and `inquiries30d === 0`. |
| `detMissingField` — Missing required field | warning | Published and missing any of: 3D view (`has3D===false`), floor plan (`floorPlan===false`), English translation (`englishTranslation===false`). |
| `detLicenseExpiry` — Agency license expiry approaching | critical | `licenseExpiry` within 0–60 days and the agent has active listings. |
| `detPendingTooLong` — Pending approval too long | critical | `publishStatus === "Pending Review"` for > 48 hours. |
| `detFlagged` — Flagged for rectification | critical | `flagged` truthy (shows `flagNote`). |
| `detPriceAnomaly` — Price anomaly | warning | `priceBuy` more than ±25% vs the same-`propType` average in the same prefecture (`areaAverageFor`). |
| `detDuplicate` — Duplicate detected | warning | Another listing with the same `chome` + `houseNo` and area within ±2㎡. |

**Severity → existing badge classes** (`alertSeverityBadge`): critical → `badge-rejected`, warning → `badge-pending`, info → `badge-gray`.

**UI surfaces** (single refresh entry point `refreshAlertsUI()` → banner + bell + pill):
- **Banner stack** — `#alertBanner` at the top of the list shows the top 3 (sorted critical-first) plus a "Show all alerts (N)" / "Show fewer alerts" toggle (`renderAlertBanner` / `toggleBanner`). Clicking a row jumps to the listing detail.
- **Shell bell** — `renderBell()` publishes `yuushi.notif.property`; the shell header displays Property/Project notifications. Legacy dropdown helper functions remain but are not the current list-header bell UI.
- **Filter pill** — `#alertPill` ("Needs attention", count `#alertPillCnt`) in the toolbar toggles `alertFilterOn`, narrowing the list to entities in `activeAlertIdSet()` (`toggleAlertFilter`).
- **Detail view** — per-listing alerts render into `#dAlerts`.

**Dismiss = 7-day mute** (`muteAlert` / `isAlertMuted`), stored in localStorage **`yuushi.ploAlertMutes`** as `{ alertKey: expiryMs }`; expired mutes are pruned lazily. **Critical alerts cannot be dismissed** (no × button) — only resolved by their action. Each alert's **primary action** reuses an existing flow: edit mode (`showDetail` + `enterEditMode`) for stale/missing/price/flagged, `openConfirm(...)` confirmations for pending-escalation / duplicate compare; feedback via `toast()`.

---

## Part 2 — Edit refinements (added)

**(A) Bulk edit from list.** A checkbox column (`#bulkSelectAll` header + per-row checkboxes) and a sticky **bulk-action bar** `#bulkBar` ("{n} selected · Edit price · Edit status · Edit assigned agent · Archive · Cancel"). Selection is a **`Set` of ids** (`bulkSelection`) that persists across re-render and pagination (`selectedListings()` resolves across all pages). Actions:
- **Bulk price** (`openBulkPrice`/`applyBulkPrice`) — absolute ¥ ("set") or ±% ("pct") with a before→after **preview of the first 3** selected.
- **Bulk status** (`openBulkStatus`/`applyBulkStatus`) — Public/Private/Archive (mapped to Published/Suspended); **warns** via `openConfirm` if any selected listing is Pending Review.
- **Bulk reassign agent** (`openBulkAgent`/`applyBulkAgent`) — staff dropdown (`staffSelectOptions`).
- **Bulk archive** (`openBulkArchive`) — confirm dialog **lists the affected IDs**, sets them Suspended.
- Each ends in `finishBulk(n)`: clears selection, re-renders, refreshes alerts, one toast **"{n} listings updated."**, and appends a `changeHistory` entry per changed record (`pushHistory`).

**(B) Field-level validation tightening** (`validateEditForm`, called by `saveChanges()` before save; blocks save, shows inline `.field-error`, focuses the first offender):
- **Price** integer **¥1–¥9,999,999,999** (`PRICE_MIN`/`PRICE_MAX`); thousands-separator applied on blur, stripped on focus (display only).
- **Area** positive, ≤ 2 decimals, **1–99,999㎡** (`AREA_FIELDS`).
- **Dates**: no future date for past events; **sold ≥ listing** date.
- **Address change** → inline `.field-warn` re-approval warning under the field ("Address change will require re-approval from admin.", `ADDRESS_FIELDS`).
- **Floor-plan upload** → JPG/PNG/PDF, ≤ 10MB (`#floorPlanInput`, inline error + toast on reject).

**(C) Inline cell edit on the list** (`startInlineEdit`). Double-click **Price / Status / Assigned Agent** → inline editor; **Enter saves, Esc/blur cancels**; brief spinner ("Saving…") then toast **"Updated."** (revert + "Update failed." error path retained though the demo always succeeds); appends a `changeHistory` entry. Other columns are read-only.

**(D) Change-history drawer** (`openHistoryDrawer`/`renderHistory`). Shows **50 entries per page** (`HIST_PAGE = 50`) with an **Actor filter** (All actors / **Admin** / **Agency**) and a **field filter** (including a Reports option when the listing has report events). Current history behavior:
- The **actor** is shown only as **Admin** or **Agency** — individual agent names are not shown; every non-admin edit collapses to **Agency**. The Actor filter options are All actors / Admin / Agency (Agency = all non-admin roles).
- A listing's **report history** is merged into the same timeline as "**Reported — {reason}**" rows (flag icon, danger accent, "Report" actor label; reasons: Inappropriate content / Suspected duplicate / Misleading price / Wrong photos), and is selectable via the "Reports" field-filter option.
- **Long values** (Description, Sold Notes, or any value over ~60 chars) now render in an **expandable "View change" panel** revealing the full **Before → After** (replacing the old "(Text modified)" placeholder); short values show inline old→new.
- Simple scalar/numeric fields get a **"Revert to this value"** button (`askRevertHistory` → confirm → `doRevertHistory` sets the field back to the old value, appends a **new non-destructive** history entry, toast **"Reverted."**); long-text fields (now shown via the "View change" panel) and report rows are **not** revertible.

**(E) Auto-save drafts for long fields** (`DRAFT_FIELDS` = Description, 3D tour link / `media.tour3d`). Saved on **blur** and **every 30s** (`startAutosaveTimer`) to localStorage **`yuushi.ploDrafts`** keyed by listing id. A status line `#draftStatus` shows "Saving…" / "Draft saved · {relTime}" / "Unsaved changes" plus a **"Discard draft"** link. Reopening a listing with a stored draft shows a restore banner `#draftBanner` ("You have a draft from {time}. Restore / Discard."). The `beforeunload` guard fires when `editMode || draftDirty`. Saving (`commitSave`) clears the draft.

**(F) "Why is this required?"** A `?` icon with a CSS tooltip (`.req-help` / `.req-tip`) next to required-field labels, text from the `REQ_HELP` map (e.g. price, prefecture, area).

## Address identity

Property address uses two administrative levels: Prefecture and one City/Ward municipality field. `city` is the full municipality display value and `municipalityCode` is the canonical 5-digit key used by filters, matching, area assignment, and MLIT integration. No separate `ward` field is used.

**(G) Clone from existing.** A **"New property (clone from existing)"** button (`openCloneModal`) opens a picker searchable by ID / name / address (`renderCloneResults`). `cloneFromListing(srcId)` pre-fills a **new** listing from the source **except** address, price, photos, and listing date (`CLONE_CLEAR_FIELDS`; media reset; status → Pending Review). A banner `#cloneBanner` reads "Cloned from {sourceID} — review and update fields…"; saving creates a fresh record (and drops the `_clonedFrom` marker).

---

## Navigation (agent-portal specific)

In-shell navigation is done by reaching into the parent window: it controls `window.parent.document.getElementById("contentFrame")`, sets `frame.src` to the target, updates the parent sidebar's `.active` menu item. There is a standalone fallback `window.location.href`.

- "Projects" navigation target is `project-management.html`.
- Opening a listing calls `showDetail(id)` within this page. The supplementary [property detail/editor](agent-portal__property-detail-view.md) is not the list row destination.

---

## Persistence

Table/Grid choice uses sessionStorage `plo.view`. Bulk/inline edits are local demo state. Sale records and drafts have separate persistence below; there is no general persisted filter store.

**localStorage keys used by this screen:**
- **`yuushi.ploAlertMutes`** — 7-day alert mutes, `{ alertKey: expiryMs }` (Part 1).
- **`yuushi.ploDrafts`** — auto-saved long-field drafts, keyed by listing id (Part 2E).
- `yuushi.autoCreateGroup` — pre-existing; hand-off value read by `project-management.html` when navigating to create a Group 5/6 project.


## Current sale and suspension integration

`markPropertySold()` requires exiting edit mode, then captures final price/date and price publication. It marks the listing Sold Out/Suspended and calls `persistSale()` to record Pending Client Confirmation via `../mock-workflows.js`. Local keys: `yuushi.agency.propertySaleState`, `yuushi.transactionVerificationRecords`. Suspension captures reason (Sold / Sold by Others / Seller Withdrew / Listing Expired / Legal Hold), date, price when Sold, public-price flag and notes into `yuushi.suspensionTx`.

`yuushi.ploPropertyPicker` stores a snapshot for property selection elsewhere; `yuushi.notif.property` supplies shell alerts. Performance detail respects `yuushi.ads.performanceSuppressed`. These are demo records, not server mutations.
