## Roles & Permissions

**Purpose:** This screen lets an administrator manage the platform's admin roles and what each role is allowed to do. The main view is a simple list of roles (name + description); from a slide-in side drawer the operator can create a new role or edit an existing one, set its name and description, and tick the individual permissions it should hold, grouped by functional area. It is the central place where "who can do what" is defined.

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Roles & Permissions". The page opens inside the admin shell's content frame. There is no separate login or sub-permission gate inside the page itself.

> Note: this is a UI mockup. Add/Edit/Delete are front-end only — there is no backend and nothing is persisted; reloading restores the original four seed roles.

---

### Layout & Structure

The screen is a single page (white card surface) with:

1. **Page header (top):** the heading "Roles & Permissions" on the left and a gold **"Add"** button on the right.
2. **Search box:** a single rounded search field (magnifier icon) below the header, placeholder "Search role name".
3. **Roles table:** a bordered table with three columns — **Role name** (clickable header that toggles A→Z / Z→A sort), **Description**, and **Actions** (right-aligned). Each row has Edit and Delete icon buttons. The table is rendered from a JS-backed roles list (the 4 named roles + deterministic filler, **60 roles** total) and is **paginated at 50 per page**. A **result-count line** above the table reads "Showing {start}–{end} of {total} roles" ("Showing 0 of 0 roles" when empty); the **table footer** still shows a simple range count ("{start} – {end} of {total}").
4. **Slide-in drawer (hidden until triggered):** a right-hand panel that covers most of the screen over a dimmed backdrop, used for both **New Role** (Add) and **Edit role**. It contains a header (title + subtitle + Cancel/Save), a "General" form section, and a "Permission table" section of grouped checkboxes.

There are no tabs and no separate detail page — role create/edit happens entirely in the drawer overlay.

---

### Every Element

**Page header**
- **Heading** "Roles & Permissions" — display only.
- **"Add" button** (gold) — opens the drawer in **Add mode**: title "New Role", subtitle "Add a new Role", empty Role name + Description, all permission checkboxes cleared, Save button inactive (greyed) until a name is typed. Focus moves to the Role name field.

**Search box**
- Text input, placeholder "Search role name". Real-time filter on the Role name column; typing resets the list to page 1.

**Pagination (universal 50/page)**
- Fixed 50 roles per page. A result-count line above the table shows "Showing {start}–{end} of {total} roles". Controls below the table: Previous · numbered pages (max 7, with "…" for gaps) · Next; current page highlighted in gold; Previous disabled on page 1, Next on the last page; the control row is hidden when ≤50 roles match. Page resets to 1 on search, on a sort toggle, and on reload; it is **preserved** while opening/closing the Add/Edit drawer. The seed list contains **60 roles** (4 named + deterministic filler) so pagination is exercised.

**Roles table** — columns in order:
1. **Role name** — the role's name; the header is clickable and toggles the list between A→Z and Z→A (sort-arrow icon). Sorting resets to page 1.
2. **Description** — a one-line description of the role.
3. **Actions** (right-aligned) — two icon buttons per row:
   - **Edit** (pencil) — opens the drawer in **Edit mode** for that role.
   - **Delete** (trash) — delete affordance for that role (UI only).
- **Table footer:** a muted range line reflecting the current page, e.g. "1 – 50 of 60".
- Rows highlight on hover. Rows are not otherwise clickable (only the Edit/Delete icons act). The list is paginated at 50/page (see Pagination above).

**Drawer — header**
- **Title** (`#drawerTitle`): "New Role" in Add mode, or the role's name in Edit mode.
- **Subtitle** (`#drawerSubtitle`): "Add a new Role" (Add) or "Edit role" (Edit), shown in gold.
- **Cancel button** (grey) — closes the drawer without saving.
- **Save button** — greyed/inactive by default; becomes active (gold) when there is a role name (typed in Add mode, or pre-filled in Edit mode). UI only — does not persist.

**Drawer — "General" section**
- Section title "General" with sub-line "Basic information about the role".
- **Role name** (text input, required — marked with a red asterisk). Typing here toggles the Save button active/inactive.
- **Description** (textarea, optional).

**Drawer — "Permission table" section**
- Section title "Permission table" with a sub-line that echoes the role's description (or "Full platform configuration and operations" in Add mode).
- Permissions are organised into **grouped cards**, each with a group header and a list of checkbox rows (custom gold checkbox + label):
  - **User management:** View User List · Edit User Information · Suspend / Delete Account · Approve / Reject Agent · Send Password Reset · Grant / Remove Badge · Change KYC Verification Status.
  - **Property Management:** View Property List · Publish / Suspend / Delete Property · Review & Process Reported Properties · Edit Property Type & Filter Settings.
  - **Financial Management:** View Transaction History · Approve / Reject Payouts · Manage Invoices & Reconciliation.
- Each row is a clickable label with a custom checkbox; in Edit mode the role's existing permissions are pre-ticked.

---

### Modals & Popups

**Role drawer (Add / Edit)** — the only overlay.
- **Trigger:** the "Add" button (Add mode) or a row's Edit pencil (Edit mode).
- **Open animation:** the dim backdrop fades in and the right panel slides in; body scroll is locked while open.
- **Close behaviours:** the Cancel button, clicking the dim backdrop on the left, or pressing **Escape**. Closing restores body scroll.
- Add vs Edit differences: title/subtitle text, whether fields and checkboxes are pre-filled, and whether Save starts active.

There are no toasts or confirmation dialogs in this UI build.

---

### Conditional Display

- **Drawer mode (Add vs Edit):** title, subtitle, field pre-fill, checkbox pre-tick, and the Permission-table sub-line all depend on whether the drawer was opened via "Add" or a row's "Edit".
- **Save button state:** inactive (grey) when the Role name is empty; active (gold) when a name is present.
- **Checkbox checked state:** a custom checkbox shows a gold box with a white check when its permission is enabled for the role; Add mode starts all unchecked.

---

### User Flows

**Add a role**
1. Click **Add** → drawer opens in Add mode (empty fields, Save inactive, focus on Role name).
2. Type a Role name (Save becomes active) and optionally a Description, tick the desired permissions across the groups.
3. Click **Save** to confirm, or **Cancel** / backdrop / Esc to dismiss. (UI only — not persisted in this build.)

**Edit a role**
1. Click a row's **Edit** pencil → drawer opens in Edit mode, pre-filled with that role's name, description, and ticked permissions; Save is active.
2. Adjust fields/permissions → **Save**, or dismiss via Cancel / backdrop / Esc.

**Delete a role**
1. Click a row's **Delete** trash icon (UI affordance in this build).

---

### Validation

- **Role name** is the only required field (red asterisk). The Save button stays inactive until the name is non-empty. No other field rules in this UI build.

---

### Empty States

- **No roles match the search:** the table body shows a single centered row "No roles found.", the result-count line reads "Showing 0 of 0 roles", and the footer shows "0 – 0 of 0". (Search is a live filter on the Role name column, so this state is reachable by typing a non-matching query.)

---

### Notifications & Feedback

- Visual feedback only: hover highlight on table rows and action icons; the Save button activating when a name is present; checkbox fill on toggle; the drawer slide/backdrop-fade animation. No toasts, banners, or native pop-ups in this UI build.

---

### Navigation

- **Entry:** Admin portal sidebar → USERS MANAGEMENT → "Roles & Permissions" (loads in the content frame; URL does not change).
- **In-page:** the role drawer opens/closes over the list; there are no links to other screens, no tabs, and no back button. Esc / backdrop / Cancel close the drawer.
- **Persistence:** none — UI mockup only (the current page is not persisted across reload; reload restores page 1). Seed roles on load: four named roles — **Platform Admin** ("Full platform configuration and operations."), **Support Lead** ("Head of CS, manages tickets and queues."), **Content Editor** ("Create and schedule content."), **Finance & Ops** ("Manage payouts, invoices and reconciliation.") — each with a representative set of pre-ticked permissions used when its Edit drawer is opened, followed by deterministic auto-seeded filler roles to total **60 roles** (each filler also has a generated permission set so its Edit drawer works).
