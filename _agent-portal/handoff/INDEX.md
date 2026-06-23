# YUUSHI Agent Portal — Handoff Documentation

This folder documents the **YUUSHI Agent Portal** (the `_agent-portal/` directory) — the agency-facing side of the YUUSHI real-estate platform, distinct from the back-office Admin Portal. It is a static HTML mockup: standalone `.html` files with inline `<style>` and inline vanilla `<script>`, no build system, no backend. The only external dependencies are Font Awesome 6.5 (CDN) and, on a couple of pages, Chart.js (CDN). All data is hardcoded demo content; destructive/save actions are stubbed with `confirm()` + toasts ending in "(demo)" or success toasts.

---

## Architecture — the iframe shell

The Agent Portal now uses an **iframe shell exactly like the Admin Portal**.

- **`index.html` is the ONLY page with navigation.** It hosts a left sidebar and a global top header, and an `<iframe id="contentFrame">` that fills the rest of the page. Default content = `dashboard.html`.
- **Every other `.html` file is CONTENT ONLY** — no sidebar, no header — designed to render inside the iframe. (This was just refactored: the per-page sidebars/headers were removed. A few content pages still carry dead sidebar CSS in their stylesheets, but no sidebar markup is emitted in their bodies.)
- **Sidebar navigation:** each `<a class="menu-item" data-content="<file>.html">`. A small inline script intercepts clicks, sets `iframe#contentFrame.src` to the `data-content` value, and toggles the `.active` class. There is no router, no history API, no hash routing — the URL bar never changes.
- **Top header (right-aligned):**
  - A round **chat button** (`#chatBtn`, comment-dots icon, red unread badge "5") → `openInbox()` loads `admin-messages.html` into the iframe and highlights the Admin Messages sidebar item.
  - A global **account / avatar dropdown** showing **Taro Tanaka / Senior Sales Agent** (avatar "TT", email `taro.tanaka@anna-fudosan.co.jp`). The dropdown has **My Profile** (`acctOpenMyProfile()` → loads `profile.html`, highlights Agency Profile) and **Log out** (`acctLogout()` → native confirm "Log out of the Agent Portal?…" then `window.location.href = "agent_signin.html"`).
- **Palette:** white sidebar, gold accent `#8B7340` / hover `#6F5C33` / light `#c9a85c`, warm off-white `#fffaf2`, `#f5f5f5` page background. Responsive: below 860px the sidebar collapses to icons.

### Auth pages are standalone (not in the shell)

`agent_signin.html` and `agent_signup.html` are full-page documents, **not** loaded in the iframe:

- **Sign-in:** credentials → 2FA OTP step → redirects to `index.html` (the shell).
- **Sign-up:** registers a new agency, then swaps to a "Verify your email" success state.

---

## Sidebar menu map (`index.html`)

**Workspace**
| Label | `data-content` | Doc |
|---|---|---|
| Dashboard | `dashboard.html` | `agent-portal__dashboard.md` |
| Properties | `property-list-oversight.html` | `agent-portal__property-list-oversight.md` |
| Projects | `project-management.html` | `agent-portal__project-management.md` |
| Leads | `lead-management.html` | `agent-portal__lead-management.md` |
| CRM Activities | `crm-activities.html` | `agent-portal__crm-activities.md` |
| Advertising | `ad-monetisation.html` | `agent-portal__ad-monetisation.md` |
| Subscription | `billing.html` | `agent-portal__billing.md` |

**Messages**
| Label | `data-content` | Doc |
|---|---|---|
| Inquiries | `leads-inquiries.html` | `agent-portal__leads-inquiries.md` |
| Admin Messages | `admin-messages.html` | `agent-portal__admin-messages.md` |
| Message Center | `message-center.html` | `agent-portal__message-center.md` |

**Agency**
| Label | `data-content` | Doc |
|---|---|---|
| Staff Management | `staff-management.html` | `agent-portal__staff-management.md` |
| Roles & Permissions | `role-and-permission.html` | `agent-portal__role-and-permission.md` |
| Agency Profile | `profile.html` | `agent-portal__profile.md` |

### Files present but NOT linked in the sidebar

These exist on disk and are reachable only programmatically or as lighter siblings — they are **not** wired into the shell sidebar:

- `crm.html` — a lighter, tab-based CRM (sibling of `crm-activities.html`). Doc: `agent-portal__crm.md`.
- `advertising.html` — a lighter, tab-based advertising page (sibling of `ad-monetisation.html`). Doc: `agent-portal__advertising.md`.
- `property-detail-view.html` — read-only property detail, opened from the property list. Doc: `agent-portal__property-detail-view.md`.
- `agent_signin.html`, `agent_signup.html` — standalone auth. Docs: `agent-portal__agent_signin.md`, `agent-portal__agent_signup.md`.

### Shared assets

- `property-card.js` — property-card renderer used by the property list/project pages (referenced as `../property-card.js` in those copied files).
- `automation-catalog.js` — shared automation-trigger catalog + `AutoStore` (localStorage `yuushi.automations`); used by `message-center.html` only.

---

## Per-screen documents in this folder

1. `agent-portal__index.md` — the shell (sidebar map, header chat + avatar dropdown, iframe loader, logout target).
2. `agent-portal__agent_signin.md` — standalone sign-in (credentials → 2FA).
3. `agent-portal__agent_signup.md` — standalone agency registration → verify-email success.
4. `agent-portal__dashboard.md` — agent home/overview.
5. `agent-portal__property-list-oversight.md` — property listings (copy of admin screen).
6. `agent-portal__project-management.md` — new-development projects (copy of admin screen).
7. `agent-portal__property-detail-view.md` — read-only property detail (copy of admin screen).
8. `agent-portal__lead-management.md` — lead CRM (list / detail / edit).
9. `agent-portal__crm-activities.md` — full CRM activities (7 modules).
10. `agent-portal__crm.md` — lighter CRM (Tasks kanban / Viewings / Activity Log).
11. `agent-portal__ad-monetisation.md` — full advertising/monetisation console.
12. `agent-portal__advertising.md` — lighter advertising page.
13. `agent-portal__billing.md` — subscription & billing.
14. `agent-portal__leads-inquiries.md` — inquiry inbox + users who saved properties.
15. `agent-portal__admin-messages.md` — 1:1 chat (agent perspective; pinned Admin/Support + Clients).
16. `agent-portal__message-center.md` — broadcast/campaign center (Admin/Client audiences).
17. `agent-portal__staff-management.md` — staff table + add/edit drawer.
18. `agent-portal__role-and-permission.md` — roles list + permission matrix.
19. `agent-portal__profile.md` — Agency Profile + My Profile.

---

## Conventions & cross-cutting notes

- **No persistence except where noted.** Almost every page keeps state in memory only and resets on reload. The exceptions that touch `localStorage`:
  - `admin-messages.html` and `message-center.html` share the Lead Management store via keys `yuushiLeadGroups` / `yuushiLeads`.
  - `automation-catalog.js` (used by `message-center.html`) persists per-trigger drafts under `yuushi.automations`.
  - The copied property list/project pages read/write parent-window state via `window.parent.localStorage` for in-shell navigation.
- **Toasts** appear bottom-right and auto-dismiss (~2.4–3s), with success (gold/green) and error (red) variants. A few pages still use native `alert()`/`confirm()` (e.g. `dashboard.html` uses `alert()`).
- **Known drift to flag for the BA / next maintainer:**
  - In `message-center.html` the audience radio `value` attributes are legacy (`all_users`/`all_agents`/`all_leads`) even though the labels/model are Client / Admin.
  - Several "save" flows show a success toast without actually reverting/persisting (e.g. `profile.html`'s discard does not restore field values).
