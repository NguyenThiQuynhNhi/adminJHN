# Agent Portal Shell (`index.html`)

**Purpose:** The single navigation host for the YUUSHI Agent Portal. It provides the left sidebar, the global top header (chat shortcut + account dropdown), and an iframe that renders every other content page. No content of its own beyond chrome.

**Access:** Opened directly (`index.html`). Sign-in (`agent_signin.html`) redirects here after a successful OTP, so the agent always lands on the full shell.

---

## Design system

Warm gold/white palette via CSS custom properties in `:root`: `--accent #8B7340`, `--accent-hover #6F5C33`, `--accent-light #c9a85c`, `--bg #f5f5f5`, `--card #fff`, `--warm #fffaf2`, `--border #e0e0e0`, `--danger #c53030`. Font Awesome 6.5 from CDN. Vanilla JS, no build.

---

## Layout & structure

A flex `.layout` filling the viewport:

- **Sidebar** (`aside.sidebar`, 248px, white, scrollable). Top: logo ("Y" mark + "YUUSHI" + a gold "AGENT" badge). Then three `.menu-section` groups, each with a `.section-title` and `.menu-item[data-content]` links.
- **Content area** (`.content-area`, flex column): a 56px `.top-bar` (right-aligned) + a full-bleed `<iframe id="contentFrame">` (default `src="dashboard.html"`).
- Responsive: below 860px the sidebar shrinks to 64px and hides labels/badges.

---

## Sidebar menu map

**Workspace:** Dashboard → `dashboard.html` (active by default) · Properties → `property-list-oversight.html` · Projects → `project-management.html` · Leads → `lead-management.html` · CRM Activities → `crm-activities.html` · Advertising → `ad-monetisation.html` · Subscription → `billing.html`

**Messages:** Inquiries → `leads-inquiries.html` · Admin Messages → `admin-messages.html` · Message Center → `message-center.html`

**Agency:** Staff Management → `staff-management.html` · Roles & Permissions → `role-and-permission.html` · Agency Profile → `profile.html`

Each item has a Font Awesome icon. The clicked item gets `.active` (gold left-border + warm background); all others lose it.

---

## Top header

- **Chat button** (`#chatBtn`, round, `fa-comment-dots`) with a red unread badge (`#chatBadge`, static "5"). `onclick="openInbox()"` → sets the iframe to `admin-messages.html` and calls `setActiveMenu("admin-messages.html")`.
- **Account dropdown** (`#acctMenu`):
  - Trigger: avatar "TT" + name **Taro Tanaka** + role **Senior Sales Agent** + caret. `toggleAcctMenu()` toggles `.open`.
  - Dropdown header card: avatar "TT", name **Taro Tanaka**, email **taro.tanaka@anna-fudosan.co.jp**, role pill **Senior Sales Agent**.
  - **My Profile** item → `acctOpenMyProfile()`: closes menu, loads `profile.html`, `setActiveMenu("profile.html")`.
  - Divider.
  - **Log out** item (danger) → `acctLogout()`: closes menu, native `confirm("Log out of the Agent Portal?\nAll unsaved changes will be lost.")`; on OK, `window.location.href = "agent_signin.html"`.

---

## Scripts / behavior

- On `DOMContentLoaded`, wires every `.menu-item[data-content]` click to set `frame.src` and toggle `.active`.
- `setActiveMenu(target)` — highlights the sidebar item whose `data-content` matches `target` (used by `openInbox` and `acctOpenMyProfile`).
- Account menu closes on outside click and on **Esc**.

---

## Navigation & persistence

- Pure iframe swapping; the browser URL never changes; no history/back integration.
- The shell itself stores nothing. (Content pages may read/write `window.parent.localStorage` — e.g. the property pages persist their view/filter state there.)
- Logout is the only action that leaves the shell (to `agent_signin.html`).
