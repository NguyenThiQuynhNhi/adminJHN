# Staff Management (`staff-management.html`)

**Purpose:** Lets an Agency Admin create, edit, and manage the agents under the agency. Staff inherit permissions from their assigned permission role. All demo data; actions are toast stubs, in-memory only.

**Access:** Sidebar → Agency → Staff Management.

---

## Layout & structure

Page head ("Staff" + live "N members" badge + subtitle + "+ Add agent" button) → 4 stat cards → toolbar (search + filters + Reset) → table card → slide-in right drawer for Add/Edit → remove-confirm modal + toasts.

## Stat cards (4, static)

Total staff 12 · Active 10 (83%) · Pending invite 1 · Suspended 1.

## Toolbar / filters

- Search (live): matches name + email + role + title.
- Role select: All roles / Agency Admin / Sales Agent / Property Manager / Reception.
- Status select: All statuses / Active / Suspended / Pending invite.
- Reset.

## Table

Columns: **Name** (avatar + name, "(You)" marker for self, title sub-line) · **Email (login)** · **Role** (badge) · **Phone** · **Status** (badge: active/suspended/pending) · **Last sign-in** · actions. Empty state "No staff match your search or filters." Pager text is dynamic but page buttons are static/disabled.

Row actions: **Edit** + a ⋯ menu: "Send password-reset email", "Force sign-out", separator, "Suspend access" / "Reactivate access", "Remove from agency".

---

## Add/Edit drawer — 4 tabs

Title "Add agent" / "Edit {name}". Footer: Cancel + Save ("Send invitation" in add mode / "Save changes" in edit mode).

- **Identity:** Photo upload (preview; JPG/PNG/WEBP, "Max 5 MB. Falls back to initials."), **Full Name \*** (≤255), **Email (login) \*** (agents cannot change it; only Agency Admin), **Phone Number** (optional, +xx.xxx.xxx.xxx, unique if provided), **Role / Title (display) \*** (free text shown on the client card; separate from the permission Role).
- **Bio & hours:** **Bio / Description** (≤2,000), **Working Hours** (free text), "Inherit agency business hours" toggle ("Use agency default" → "Mon–Fri 9:00–18:00").
- **Role:** intro hint linking to a roles page; a 2×2 radio role picker — **Agency Admin** ("Full access… Cannot be removed if last admin."), **Sales Agent** (default, pre-selected), **Property Manager**, **Reception** ("Read-only access…").
- **Account & security:**
  - *Add mode:* "Send invitation email" toggle (checked by default — agent sets own password on first sign-in); "Require 2FA at sign-in" toggle (Email OTP only). When invitation is toggled OFF, a "Temporary password \*" field appears with live password rules.
  - *Edit mode:* "Reset password" → "Send password-reset email" (24h link) with Send; "Two-factor authentication (2FA)" toggle; "Force sign-out everywhere" with Sign out; **Danger zone** — "Suspend access" (toggles to "Reactivate access") and "Remove from agency".

### Password rules (add-mode temp password, live)

At least 12 characters · One uppercase · One lowercase · One number · One symbol · plus an always-on info rule "Force change on first sign-in".

---

## Modals

**Remove this agent?** — "This action cannot be undone. All listings currently assigned to {name} will be transferred to you, the Agency Admin." Buttons Cancel + red "Remove". Removing yourself is blocked ("You cannot remove yourself.").

---

## Validation

`saveDrawer()` requires Full Name, Email (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`), and Title; invalid fields get `.invalid` + `.err`. File upload: ≤5 MB and JPG/PNG/WEBP only.

## Notifications (toasts, ~3s)

"File size must not exceed 5MB." (error) · "Please upload a JPG, PNG or WEBP image." (error) · "Please complete the required fields on the Identity tab." (error) · "Invitation sent to {email}." / "Changes saved." · "Password-reset email sent." / "…sent to {name}." · "All sessions ended." / "{name}'s active sessions have been ended." · "{name}'s access suspended." / "…reactivated." · "You cannot remove yourself." (error) · "{name} removed. Their listings have been transferred to you."

## Persistence

None. In-memory `staff` array; suspend/reactivate/remove mutate it and re-render but do not persist. ESC closes the drawer/modals; outside-click closes the ⋯ menu.

The Role-tab hint links to **Roles & Permissions** (`role-and-permission.html`), which loads in the iframe.
