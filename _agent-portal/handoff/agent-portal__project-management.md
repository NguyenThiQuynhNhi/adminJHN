# Projects — New Developments (`project-management.html`)

**Purpose:** The agent's new-development project management screen (list + grid, filters, sale-status / mark-as-sold).

Source: [project-management.html](../project-management.html), the current Agent implementation. Admin documentation is not the source of truth for this screen; no file-equivalence claim is made.

**Access:** Sidebar → Workspace → Projects.

---

## Key features (summary)

- **List view + grid/card view toggle.**
- **Sale Status** + **Mark as Sold** action.
- **Filter bar.**
- Loads the shared **`../property-card.js`** renderer.

---

## Part 1 — Alerts subsystem (added)

Per-project **alert detectors** are pure functions `(project) => alert | null`; each alert is `{ key, id, entityId, severity, title, desc, actionLabel, actionFn }`. `computeAlerts(p)` runs all detectors, drops nulls and muted non-critical alerts; aggregation/active-id helpers mirror the Properties screen.

**12 detector types** (`ALERT_DETECTORS` array) — eight general detectors (including Sold but not closed) plus four project-specific:

| Detector | Severity | Trigger |
|---|---|---|
| `detStale` — Stale listing | warning | (base) active too long with no inquiries. |
| `detMissingField` — Missing required field | warning | (base) missing 3D / floor plan / English translation. |
| `detLicense` — License expiry approaching | critical | (base) agency license within 60 days. |
| `detPendingLong` — Pending approval too long | critical | (base) pending review > 48h. |
| `detFlagged` — Flagged by admin | critical | (base) flagged for rectification. |
| `detPriceAnomaly` — Price anomaly | warning | (base) price more than ±25% vs area average. |
| `detSoldNotClosed` — Sold but not closed | warning | (base) Sold Out but missing closing data. |
| `detDuplicate` — Duplicate detected | warning | (base) same address/floor/area as another. |
| `detPhaseOverdue` — Phase completion overdue | warning | **(project)** a phase is "In construction" past its `plannedCompletion`. |
| `detAllUnitsSold` — All units sold | info | **(project)** every unit `Sold Out` but the project is still publicly visible. |
| `detSalesSlowing` — Sales slowing | warning | **(project)** > 70% of units unsold ≥ 12 months after launch. |
| `detDocExpired` — Document expired | critical | **(project)** a permit/document expired or expires within ≤ 30 days. |

Alert keys are namespaced per project (e.g. `"{id}:phase"`). **Severity → existing badge classes**: critical → danger, warning → warning, info → neutral/info.

**UI surfaces** (single refresh entry point **`refreshAlerts()`**): a **banner stack** (top 3 critical + "Show all alerts (N)"), **shell bell** fed by `renderAlertBell()` through `yuushi.notif.project`, **Alerts filter pill** in the toolbar (filters the list to entities with an active alert), and per-project alerts in the detail view's `#dAlerts`.

**Dismiss = 7-day mute** stored in localStorage **`yuushi.prjAlertMutes`** as `{ alertKey: expiryMs }` (expired mutes pruned lazily on read). **Critical alerts cannot be dismissed** — only resolved by their action. Each alert's **primary action** reuses an existing flow: edit mode (`showDetail` + `enterEditMode`), the Mark-as-Sold modal for sold-not-closed, and **`showConfirm({ title, body, confirmLabel, danger, onConfirm })`** confirmations (archive-all-sold, review pricing, escalate pending, upload renewed document, compare duplicates); feedback via `toast()`.

---

## Part 2 — Edit refinements (added)

**(A) Bulk edit from list.** Checkbox column + sticky **bulk-action bar** `#bulkBar` ("{n} selected · Edit price · Edit status · Edit assigned agent · Archive · Cancel"). Selection persists across re-render/pagination as a **`Set` of ids**. Bulk **price** (absolute ¥ or ±% with before→after preview of the first 3), **status** (Public/Private/Archive; warns on Pending via `showConfirm`), **reassign agent** (staff dropdown), and **archive** (confirm lists the IDs). Each ends in **`finishBulk(count, label)`**: clears selection, re-renders, refreshes alerts, one toast **"{n} project(s) {updated|archived}."**, and appends a `changeHistory` entry per record.

**(B) Field-level validation tightening** (`validateEditForm`, called by `saveChanges()`; blocks save, inline errors, focuses first offender):
- **Price** integer ¥1–¥9,999,999,999 (`PRICE_MAX = 9999999999`); thousands-separator on blur.
- **Area** positive, ≤ 2 decimals, 1–99,999㎡.
- **Dates**: no future date for past events; **sold ≥ listing**; and the project-specific **phase end ≥ start** rule ("Completion (phase end) cannot be before sales start.", `salesStartDate` vs `completionDate`).
- **Address change** → inline re-approval warning (`ADDRESS_KEYS`: postCode/prefecture/city/chome/buildingName/unitNo).
- **Document / floor-plan upload** → JPG/PNG/PDF, ≤ 10MB.

**(C) Inline cell edit on the list** (`startInlineEdit`). Double-click **Price / Status / Assigned Agent** → inline editor; Enter saves, Esc/blur cancels; brief spinner then toast **"Updated."** (revert + error path on failure); appends a `changeHistory` entry. Other columns read-only.

**(D) Change-history drawer** (`openHistoryDrawer`/`renderHistory`). **50 entries per page** (`HIST_PAGE = 50`) with an **Actor filter** (All actors / **Admin** / **Agency**) and a field filter (including a "Reports" option when the project has report events). Current history behavior:
- The **actor** is shown only as **Admin** or **Agency** — individual agent names are not shown; every non-admin edit collapses to **Agency**. The Actor filter options are All actors / Admin / Agency (Agency = all non-admin roles).
- A project's **report history** is merged into the same timeline as "**Reported — {reason}**" rows (flag icon, danger accent, "Report" actor label; reasons: Inappropriate content / Suspected duplicate / Misleading price / Wrong photos), and is selectable via the "Reports" field-filter option.
- **Long values** (Description, Notes, or any value over ~60 chars) now render in an **expandable "View change" panel** revealing the full **Before → After** (replacing the old "(Text modified)" placeholder); short values show inline old→new.
- Revertible scalar fields get a **"Revert to this value"** button (confirm → sets the field back, appends a **new non-destructive** entry, toast **"Reverted."**); long-text fields (now shown via the "View change" panel) and report rows are not revertible.

**(E) Auto-save drafts for long fields** (`DRAFT_FIELDS` = Description, Amenities note `amenNote`, 3D tour link `media.tour3d`). Saved on **blur** and **every 30s** to localStorage **`yuushi.prjDrafts`** keyed by project id; status line ("Saving…" / "Draft saved · …" / "Unsaved changes") + "Discard draft" link; **restore banner** ("You have a draft from {time}. Restore / Discard.") on reopen; `beforeunload` guard extended to the draft state.

**(F) "Why is this required?"** A `?` icon with a CSS tooltip (`.req-help` / `.req-tip`) next to required-field labels explaining why each field matters.

**(G) Clone from existing.** A **"(clone from existing)"** button (`openCloneModal`) opens a picker searchable by ID / name / address. **`cloneFromProject(sourceId)`** pre-fills a **new** project (id `PRJ-####`, name "{src} (copy)", status Pending Review) from the source **except** address, prices (group-5 floor-plan types and group-6 lots cleared), photos, and listing date. A banner `#dCloneBanner` ("Cloned from {sourceID} …") stays until saved; saving creates a fresh record.

---

## Navigation (agent-portal specific)

`gotoPropertyManagement()` loads `property-list-oversight.html` into the parent `contentFrame` and highlights its menu item; standalone fallback sets `window.location.href` to that same Agent-relative path. Project rows open inline detail. `yuushi.autoCreateGroup` opens Group 5/6 creation after navigation from Properties.

---

## Persistence

Table/Grid choice uses sessionStorage `prj.view`; project data and bulk/inline edits are in-memory demo state. `yuushi.notif.project` supplies shell alert snapshots. There is no general persisted filter store.

**localStorage keys used by this screen:**
- **`yuushi.prjAlertMutes`** — 7-day alert mutes, `{ alertKey: expiryMs }` (Part 1).
- **`yuushi.prjDrafts`** — auto-saved long-field drafts, keyed by project id (Part 2E).
- `yuushi.autoCreateGroup` — pre-existing; read on load to auto-open the create flow for a Group 5/6 project when navigated in from the Properties screen.


## Project-specific structure

Group 5 contains floor-plan types and aggregate quantities; Group 6 contains individual lots. `renderFpTypes()`/`renderLots()` provide their own edit controls, and `processSoldQueue()` captures final price/date for newly sold entries. Create/clone, CSV export, filters and inline detail remain in this Agent page. A paid extra-floor-plan-type modal is present; its upgrade handler is a local mock action, not an integrated Cart or Stripe purchase.
