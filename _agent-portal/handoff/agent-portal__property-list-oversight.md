# Properties — Listings (`property-list-oversight.html`)

**Purpose:** The agent's property-listing management screen (list + grid views, filters, sale-status / mark-as-sold, navigation to detail/project pages).

> **The base interface mirrors the Admin Portal screen `property/property-list-oversight.html`** (same list/grid views, filters, columns, badges, detail view, mark-as-sold flow). **For the full field-level specification of that base (every filter, column, badge, modal, validation rule) refer to the root handoff doc `handoff/property__property-list-oversight.md`.** The agent copy drops the `property/` prefix from its one navigation-path string so it works at the portal root.
>
> **The base has since been substantially EXTENDED (~2,400 added lines) with two capability groups that do NOT exist in the admin copy:** an **Alerts subsystem** (Part 1) and a set of **Edit refinements** (Part 2). Those are documented in full below; everything else still matches the root doc.
>
> **Base sync note:** the **"Next Update Schedule" (`nextUpdate`) field has been removed entirely** from the base — it is no longer an editable field, no longer appears in the change-history field list, and was removed from seed data.

**Access:** Sidebar → Workspace → Properties.

---

## Key features (summary)

- **List view + grid/card view toggle** (`view-toggle`, "LIST VIEW" / card grid).
- **Sale Status** column/field and a **Mark as Sold** action.
- **Filter bar** for narrowing the listings.
- Loads the shared **`../property-card.js`** renderer.

---

## Part 1 — Alerts subsystem (added)

Per-listing **alert detectors** are pure functions `(listing) => alert | null`; each alert is `{ key, id, entityId, severity, title, desc, actionLabel, actionFn }`. `computeAlerts(p)` runs all detectors, drops nulls and muted non-critical alerts, and sorts by severity; `computeAllAlerts()` aggregates across every listing; `activeAlertIdSet()` returns the ids that have ≥1 active alert (used by the filter pill).

**8 detector types** (`ALERT_DETECTORS` array):

| Detector | Severity | Trigger |
|---|---|---|
| `detStale` — Stale listing | warning | Published, active > 90 days, and `inquiries30d === 0`. |
| `detMissingField` — Missing required field | warning | Published and missing any of: 3D view (`has3D===false`), floor plan (`floorPlan===false`), English translation (`englishTranslation===false`). |
| `detLicenseExpiry` — Agency license expiry approaching | critical | `licenseExpiry` within 0–60 days and the agent has active listings. |
| `detPendingTooLong` — Pending approval too long | critical | `publishStatus === "Pending Review"` for > 48 hours. |
| `detFlagged` — Flagged for rectification | critical | `flagged` truthy (shows `flagNote`). |
| `detPriceAnomaly` — Price anomaly | warning | `priceBuy` more than ±25% vs the same-`propType` average in the same prefecture (`areaAverageFor`). |
| `detSoldNotClosed` — Sold but not closed | warning | `saleStatus === "Sold Out"` but missing transaction date and/or `finalSalePrice`. |
| `detDuplicate` — Duplicate detected | warning | Another listing with the same `chome` + `houseNo` and area within ±2㎡. |

**Severity → existing badge classes** (`alertSeverityBadge`): critical → `badge-rejected`, warning → `badge-pending`, info → `badge-gray`.

**UI surfaces** (single refresh entry point `refreshAlertsUI()` → banner + bell + pill):
- **Banner stack** — `#alertBanner` at the top of the list shows the top 3 (sorted critical-first) plus a "Show all alerts (N)" / "Show fewer alerts" toggle (`renderAlertBanner` / `toggleBanner`). Clicking a row jumps to the listing detail.
- **Bell** — `#alertBellWrap` in the list header shows an unread count (`#bellCnt`, "99+" cap) and a red dot (`#bellDot`) when any alert is critical; opens a dropdown grouped **Critical / Warning / Info** (`renderBell` / `bellPanelHtml` / `toggleBell`).
- **Filter pill** — `#alertPill` ("Needs attention", count `#alertPillCnt`) in the toolbar toggles `alertFilterOn`, narrowing the list to entities in `activeAlertIdSet()` (`toggleAlertFilter`).
- **Detail view** — per-listing alerts render into `#dAlerts`.

**Dismiss = 7-day mute** (`muteAlert` / `isAlertMuted`), stored in localStorage **`yuushi.ploAlertMutes`** as `{ alertKey: expiryMs }`; expired mutes are pruned lazily. **Critical alerts cannot be dismissed** (no × button) — only resolved by their action. Each alert's **primary action** reuses an existing flow: edit mode (`showDetail` + `enterEditMode`) for stale/missing/price/flagged, the **Mark-as-Sold modal** (`openSoldModal`) for sold-not-closed, and `openConfirm(...)` confirmations for pending-escalation / duplicate compare; feedback via `toast()`.

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

**(D) Change-history drawer** (`openHistoryDrawer`/`renderHistory`). Shows the last **50** entries (`HIST_PAGE = 50`) with an **Actor filter** (All actors / **Admin** / **Agency**) and a **field filter** (`#histField`, including a "Reports" option when the listing has report events). Behaviour matching the admin base (see the root doc):
- The **actor** is shown only as **Admin** or **Agency** — individual agent names are not shown; every non-admin edit collapses to **Agency**. The Actor filter options are All actors / Admin / Agency (Agency = all non-admin roles).
- A listing's **report history** is merged into the same timeline as "**Reported — {reason}**" rows (flag icon, danger accent, "Report" actor label; reasons: Inappropriate content / Suspected duplicate / Misleading price / Wrong photos), and is selectable via the "Reports" field-filter option.
- **Long values** (Description, Sold Notes, or any value over ~60 chars) now render in an **expandable "View change" panel** revealing the full **Before → After** (replacing the old "(Text modified)" placeholder); short values show inline old→new.
- Simple scalar/numeric fields get a **"Revert to this value"** button (`askRevertHistory` → confirm → `doRevertHistory` sets the field back to the old value, appends a **new non-destructive** history entry, toast **"Reverted."**); long-text fields (now shown via the "View change" panel) and report rows are **not** revertible.

**(E) Auto-save drafts for long fields** (`DRAFT_FIELDS` = Description, 3D tour link / `media.tour3d`). Saved on **blur** and **every 30s** (`startAutosaveTimer`) to localStorage **`yuushi.ploDrafts`** keyed by listing id. A status line `#draftStatus` shows "Saving…" / "Draft saved · {relTime}" / "Unsaved changes" plus a **"Discard draft"** link. Reopening a listing with a stored draft shows a restore banner `#draftBanner` ("You have a draft from {time}. Restore / Discard."). The `beforeunload` guard fires when `editMode || draftDirty`. Saving (`commitSave`) clears the draft.

**(F) "Why is this required?"** A `?` icon with a CSS tooltip (`.req-help` / `.req-tip`) next to required-field labels, text from the `REQ_HELP` map (e.g. price, prefecture, area).

**(G) Clone from existing.** A **"New property (clone from existing)"** button (`openCloneModal`) opens a picker searchable by ID / name / address (`renderCloneResults`). `cloneFromListing(srcId)` pre-fills a **new** listing from the source **except** address, price, photos, and listing date (`CLONE_CLEAR_FIELDS`; media reset; status → Pending Review). A banner `#cloneBanner` reads "Cloned from {sourceID} — review and update fields…"; saving creates a fresh record (and drops the `_clonedFrom` marker).

---

## Navigation (agent-portal specific)

In-shell navigation is done by reaching into the parent window: it controls `window.parent.document.getElementById("contentFrame")`, sets `frame.src` to the target, updates the parent sidebar's `.active` menu item, and persists view/filter state via `window.parent.localStorage`. There is a standalone fallback `window.location.href`.

- "Projects" navigation target is `project-management.html` (admin copy used `property/project-management.html`).
- Opening a listing navigates to `property-detail-view.html`.

---

## Persistence

In-shell view/filter state is persisted through `window.parent.localStorage`. The underlying property data is hardcoded demo content; mutations (e.g. mark-as-sold, bulk/inline edits) are in-memory/demo.

**localStorage keys used by this screen:**
- **`yuushi.ploAlertMutes`** — 7-day alert mutes, `{ alertKey: expiryMs }` (Part 1).
- **`yuushi.ploDrafts`** — auto-saved long-field drafts, keyed by listing id (Part 2E).
- `yuushi.autoCreateGroup` — pre-existing; hand-off value read by `project-management.html` when navigating to create a Group 5/6 project.

See `handoff/property__property-list-oversight.md` for the authoritative details of the base interface.
