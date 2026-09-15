# Staff Management

Source: [staff-management.html](../staff-management.html), current working-tree implementation.

Access: Agency → Staff Management.

List, read-only staff detail and full-page Add/Edit form switch through `showView()`, `openView()`, `openAdd()` and `openEdit()`. This is no longer a slide-in drawer. Table: Name, Email (login), Role, Phone, Status, Last sign-in, actions. Search and Role/Status filters plus Reset are available. Current statuses are **Active, Suspended**; roles are **Agency Admin, Sales Agent, Property Manager, Reception**. Summary cards are sample counts; pagination buttons are static.

Form tabs: Identity, Bio & hours, Account & security. Identity includes photo, Full Name, login Email, Phone and required Role select (there is no separate display-title field). Bio/working hours include Use agency default. Account settings show invitation/temporary-password controls for Add and password-reset/2FA/sign-out controls for Edit.

`saveEdit()` validates name, email format and role, mutates the in-memory staff array, and creates new staff as Active while showing an invitation toast. Phone/email uniqueness and live temporary-password rules are not enforced by this save handler. Image preview validates size/type. Security actions are simulated.

Suspend/reactivate and remove update the array; self-removal is blocked. The removal message says listings transfer to the Agency Admin, but the handler only removes staff locally. No actual listing reassignment, invitation email or session invalidation is implemented. State resets on reload.
