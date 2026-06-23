# Roles & Permissions (`role-and-permission.html`)

**Purpose:** Two-pane page to control what each role can see/do via a permission matrix. System roles are read-only; custom roles can be created, edited, duplicated, and deleted. All in-memory demo data.

**Access:** Sidebar → Agency → Roles & Permissions.

---

## Layout & structure

Page head ("Roles & Permissions" + subtitle + a mode pill "View mode" / "Editing…") → an info box explaining **Scope rules** ("None / Own / Agency"; "Own = only items the agent owns. Agency = every item across the agency.") → a two-column grid (left = sticky Roles list; right = role Detail) → a fixed bottom action bar → three modals + toasts.

## Left — Roles list

Header "Roles" with a live count ("4 total"), rows (name + "System" tag + description + member-count pill), footer button "+ Create custom role".

## Right — Detail card

1. Detail head: role name (+ "System" pill), description, and "Duplicate" + "Delete role" (Delete hidden for system roles).
2. Members preview: up to 4 chips, "+N more", "Manage staff →".
3. Role metadata (disabled unless editing): **Role name \*** (≤60), **Description** (≤200), **Members assigned** (always read-only).
4. Five matrix sections (see below).

---

## Permission matrix

Five section tables (the categories): **Listings & Properties**, **Inquiries, Leads & Appraisals**, **Analytics & Reports**, **Advertising & Monetisation**, **Agency Administration**.

Each table: a **Feature** column (name + description), an optional **Scope** column (only for scope-bearing features), then one column per **action**. The scope cell is a pill cycling **No access → Own only → Agency-wide** (cycles only in edit mode; setting "none" clears that row's action checkboxes and locks them). Action cells are checkbox squares; non-edit mode shows them disabled.

**Features & actions by section:**
- *Listings:* Property listings (scope; create/edit/delete/publish), Listing drafts (scope; create/edit/delete), New development projects (scope; create/edit/delete).
- *Inquiries:* Inquiries from clients (scope; reply/assign/close), Lead group / saved searches (scope; create/edit/delete), Appraisal requests (scope; accept/quote/close).
- *Analytics:* Performance analytics (scope; export), Revenue & billing reports (scope; export).
- *Ads:* Sponsored listing slots (scope; create/edit/cancel), Banner & featured ads (scope; create/edit/cancel), Appraisal budget (scope; edit).
- *Admin (no scope):* Staff management (view/create/edit/remove), Roles & permissions (view/create/edit/delete), Agency profile (view/edit), Billing & plan (view/edit).

Action labels: View, Create, Edit, Delete, Publish, Reply, Assign, Close, Accept, Quote, Export, Cancel, Remove.

## Roles (4 system, seeded)

- **Agency Admin** (system, 2 members; full access).
- **Sales Agent** (system, 7 members; default selected; mostly "Own" scope).
- **Property Manager** (system, 2 members; mostly "Agency" scope).
- **Reception** (system, 1 member; largely read-only).

---

## Bottom action bar

Left info ("{name} · System role — read-only" / "· Custom role"); right buttons Cancel (hidden until editing), "Edit role", "Save changes" (hidden until editing).

## Modals (3)

- **Create custom role** — Role name \* (≤60, unique), Description (≤200), "Start from" select (Blank (no permissions) / Sales Agent / Property Manager / Reception). On create, switches to the new role and enters edit mode.
- **Delete this role?** — warns it will reassign members to **Sales Agent** automatically (or "No staff are currently assigned"). Cancel + red "Delete role".
- **Discard unsaved changes?** — "Keep editing" + red "Discard changes".

## Guards & validation

- Editing a system role → toast "System roles are read-only. Duplicate it to create a custom role." (error).
- Deleting a system role → "System roles cannot be deleted." (error).
- Switching roles while dirty opens the discard modal; `beforeunload` warns when editing + dirty; ESC closes modals.
- Save requires non-empty, case-insensitively unique name. Duplicate auto-names "Copy of {name}" (with "(n)" suffix to avoid collisions).

## Notifications (toasts)

"System roles are read-only. Duplicate it to create a custom role." · "Changes discarded." · "Role name is required." · "A role with this name already exists." · "Role saved." · "Custom role created. Tune its permissions below." · "Role duplicated. Edit the permissions as needed." · "System roles cannot be deleted." · "{name} deleted."

## Persistence

None. Edits mutate the in-memory `roles` array; a deep-clone `snapshot` is used only for in-session discard/revert. Resets on reload.
