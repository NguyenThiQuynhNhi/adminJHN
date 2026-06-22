## Platform Information

**Purpose:** Lets an administrator manage the platform's core identity and contact details (platform name, company name, hotline, email, legal representative, head office address), upload the platform logo, and maintain a list of company branches (add, edit, remove). All edits are made through a single page-wide Edit mode and committed atomically with one Save action.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Platform Information". This is an admin-only configuration screen that opens inside the main admin shell's content area.

### Layout & Structure

- The page has a single top heading: "Platform Information".
- Below the heading, the screen is split into two equal side-by-side panels (cards):
  - **Left panel — "Basic Information":** a form with six fields (no per-card buttons).
  - **Right panel — "Platform Logo":** a logo upload area at the top, followed (below a divider line) by a "Branches" sub-section that lists existing branches and provides a form to add branches.
- **Single bottom action bar** (full page width, below both cards): contains the page-wide Edit / Cancel / Save controls (see User Flows). There are NO per-card Save buttons.
- Responsive behavior: on narrower screens (roughly tablet width and below) the two panels stack into a single column and the form fields become full-width. On very narrow (phone) screens the add-branch form and inline branch-edit form fields stack vertically and each branch row stacks its content vertically.
- Visual theme is the unified gold/white palette (white cards on a light-grey `#f5f5f5` page, gold `#8B7340` accents, `#e0e0e0` borders, near-black `#1a1a1a` headings; reuses the file's `:root` tokens). No tabs, no top toolbar, no breadcrumbs.

### View mode vs. Edit mode (page-wide)

The whole page operates under a single edit toggle:

- **View mode (default, on load):** every field across Basic Information, Logo, and Branches is **disabled** (read-only). The Logo upload/remove controls are disabled, the add-branch form is hidden, and branch rows show no Edit/Delete icons. The bottom action bar shows ONE button: **"Edit"** (pen icon).
- **Edit mode (after clicking "Edit"):** all fields become editable, the Logo controls are enabled, the add-branch form is shown, and each branch row shows Edit + Delete icons. The bottom action bar shows TWO buttons: **"Cancel"** and **"Save settings"** (check icon). Entering edit mode starts from a fresh draft copy of the saved state.

All changes in edit mode are held in an in-memory **draft** and are not committed until "Save settings". "Cancel" discards the entire draft.

### Every Element

**Left panel — "Basic Information" card**

Six fields, all stacked in a single column. On page load every field is pre-filled from saved state (defaults below if nothing persisted). Fields are disabled in view mode. Each field has a hidden inline error slot shown below it when validation fails.

1. **Platform Name** — single-line text input, required (label shows `*`), max 255 chars. Placeholder: "e.g., AnnaJapan". Default: "AnnaJapan".
2. **Company Name** — single-line text input, required (label shows `*`), max 255 chars. Placeholder: "e.g., Anna Japan Inc.". Default: "Anna Japan Inc.".
3. **Hotline** — telephone input, optional (no format validation). Placeholder: "e.g., +81-800-123-4567". Default: "+81-800-123-4567".
4. **Email** — email input, required, must be a valid email format. Placeholder: "e.g., support@annajapan.jp". Default: "support@annajapan.jp".
5. **Legal Representative** — single-line text input, optional, max 255 chars. Placeholder: "e.g., John Tanaka". Default: "Admin Tanaka".
6. **Head Office Address** — multi-line text area (vertically resizable), optional, max 500 chars. Placeholder: "Street address, building, etc.". Default: "Tokyo, Japan".

There is no Save button on this card.

**Right panel — "Platform Logo" card**

- **Logo preview box** — an 80×80 square with a dashed border. Empty state shows a placeholder image icon; after a logo is selected it displays the image scaled to fit. The preview reflects the **pending draft** logo in edit mode (visual only, not yet committed).
- **"Upload Logo" button** — label "Upload Logo" with an upload icon. Enabled only in edit mode. Clicking it opens the OS file picker (hidden file input). Accepts JPG/PNG/WEBP only (`image/jpeg,image/png,image/webp`). Selecting a valid file updates the preview but does NOT apply until "Save settings".
- **"Remove logo" button** — red/danger styled, with a trash icon, placed next to "Upload Logo". Shown only in edit mode AND only when a logo currently exists in the draft. Clicking it clears the preview pending save (sets the draft logo to none). On Cancel it reverts; on Save the removal commits.
- **Hint text:** "JPG, JPEG, PNG or WEBP. Max 5MB.".
- **Inline error slot** for logo validation (type / size errors).

**Right panel — "Branches" sub-section** (below a divider)

- **Sub-section title:** "Branches".
- **Branch list** — a vertical list of branch cards. On load it shows the saved branches (three seeded defaults if nothing persisted):
  - Branch Tokyo — Phone: +81 3-1234-5678 — Address: 1-1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan
  - Branch Saitama — Phone: +81 3-6427-8451 — Address: 3-12-7 Shibuya, Shibuya-ku Saitama 150-0002, Japan
  - Branch Osaka — Phone: +81 6-1234-5678 — Address: 1-2-3 Umeda, Kita-ku, Osaka 530-0001, Japan
  - Each branch card shows: the branch name (bold), a "Phone:" line, and an "Address:" line. Empty phone/address shows a dash ("—").
  - **View mode:** branch cards show no action icons.
  - **Edit mode:** each card shows two icon-only buttons on the right: **Edit** (pencil, tooltip "Edit") and **Delete** (trash, tooltip "Remove"). A branch marked for deletion is visually marked (struck-through, danger background) and its action area shows an **Undo remove** button (rotate-left icon) instead.
- **Inline branch edit (edit mode only):** clicking a row's Edit icon turns that row into an inline editable form (name full-width + phone + address) with **Cancel** and **Done** buttons. Only one row can be inline-edited at a time. "Done" validates and applies the changes to the draft row; "Cancel" reverts that row. These changes remain pending until the page Save.
- **Add-branch form** — a dashed-border box below the list, shown only in edit mode, containing:
  - **Branch name input** — full-width single-line text, required, max 255. Placeholder: "Branch name (e.g., Branch Saitama)". (Has its own inline error slot.)
  - **Phone input** — telephone input, optional. Placeholder: "Phone (e.g., +81 3-6427-8451)".
  - **Address input** — single-line text, optional, max 500. Placeholder: "Address".
  - **Add branch button** — label "Add branch" with a plus icon. Appends the row to the in-memory draft list (pending save) and clears the form. There is no separate "Save changes" / "Cancel" button on this form anymore (inline editing replaced the previous combined add/edit form).

**Bottom action bar**

- **Edit button** (view mode) — "Edit" with a pen icon. Enters edit mode.
- **Cancel button** (edit mode) — "Cancel". Discards all pending changes (with a confirm modal if there are unsaved changes).
- **Save settings button** (edit mode) — "Save settings" with a check icon. Validates and commits all changes atomically.

**Dropdowns / selects / radios / checkboxes / toggles:** None on this screen.

**Tables:** None. Branch data is shown as a list of cards (no sorting, filtering, search, or pagination).

**Status badges:** None.

### Modals & Popups

There are NO native browser `alert()` / `confirm()` dialogs anywhere on this screen. All feedback is styled in-page:

- **Toast** — a styled success toast (bottom-right, green/success tokens) auto-dismissing after ~3 seconds. Used after a successful Save.
- **Confirm modal** — a styled centered modal overlay (dimmed backdrop) with a title, message, a "Cancel" button, and a danger-styled confirm button. Used for:
  - **Remove branch** confirmation.
  - **Discard changes** confirmation on Cancel when there are pending changes.
  - Clicking the dimmed backdrop or "Cancel" dismisses the modal without acting.

Branch editing happens inline within the row (not in a dialog).

### Conditional Display

- **View vs. Edit mode:** controls the disabled/enabled state of all fields, visibility of the add-branch form, the branch row action icons, and which bottom buttons appear (Edit alone vs. Cancel + Save settings).
- **Logo preview placeholder vs. image:** placeholder image icon until a logo exists in the (draft or saved) state; otherwise the image is shown.
- **Remove logo button:** shown only in edit mode and only when a logo currently exists in the draft.
- **Branch list vs. empty state:** empty-state message shown when there are no branches.
- **Phone / Address dash:** an empty phone or address value is shown as a dash "—".
- **Branch row normal vs. inline-edit vs. pending-delete:**
  - Normal (edit mode): shows Edit + Delete icons.
  - Inline-edit: the row becomes an editable form with Cancel + Done.
  - Pending-delete: the row is struck-through with a danger background and shows an Undo remove button.

### User Flows

**Edit and save platform settings (single atomic flow)**

1. Admin clicks **"Edit"** in the bottom bar. The page enters edit mode (a fresh draft of the saved state); all fields become editable.
2. Admin changes any Basic Information fields, the logo, and/or branches (all changes accumulate in the draft, nothing is committed yet).
3. Admin clicks **"Save settings"**.
4. Validation runs (basic fields + any open inline branch edit). If anything is invalid, inline errors appear and the save is blocked.
5. On success, all changes (basic info + logo + branches) commit atomically, the state persists to `localStorage`, the page returns to view mode, and a success toast appears: "Platform information updated successfully."

**Cancel editing**

1. Admin clicks **"Cancel"** in the bottom bar.
2. If there are pending changes, a styled "Discard changes?" confirm modal appears (Cancel / Discard).
   - On Discard, the entire draft is thrown away, the form reverts to the saved state, and the page returns to view mode.
   - On Cancel (in the modal), nothing changes and editing continues.
3. If there are no pending changes, editing exits immediately to view mode.

**Upload / remove a logo (pending until save)**

1. In edit mode, admin clicks "Upload Logo" → OS file picker opens (JPG/PNG/WEBP).
2. Admin selects an image. If type/size is invalid, an inline error appears and nothing changes. Otherwise the preview updates immediately (pending only).
3. If a logo exists, admin can click "Remove logo" to clear the preview (pending).
4. The logo change applies only on "Save settings"; on "Cancel" it reverts to the previously-saved logo.

**Add a branch (pending until save)**

1. In edit mode, admin fills the add-branch form (name required; phone/address optional).
2. Admin clicks "Add branch".
3. If the name is blank, an inline error "Branch name is required." appears under the name field and focus returns to it (not added).
4. Otherwise the branch is appended to the draft list and the form is cleared. It commits only on Save.

**Edit a branch inline (pending until save)**

1. In edit mode, admin clicks the Edit (pencil) icon on a branch card.
2. That row turns into an inline editable form (name + phone + address) with Cancel + Done.
3. Admin edits values and clicks "Done" → validation runs (name required); on success the draft row updates in place. "Cancel" reverts the row.
4. Changes commit only on "Save settings".

**Remove a branch (pending until save)**

1. In edit mode, admin clicks the Delete (trash) icon on a branch card.
2. A styled confirm modal appears — title "Remove branch?", message `Remove branch "{Branch Name}"? It will be removed when you save.`, buttons Cancel | Remove (danger).
3. On Remove, the branch is marked pending-delete (struck-through, danger background) with an Undo remove button; it is NOT removed yet.
4. On "Save settings" the pending deletions commit (rows removed). On "Cancel" all pending deletes/edits/adds are discarded.

### Validation

Validation runs on "Save settings" (basic fields) and inline when adding/editing branches.

- **Platform Name:** required, max 255. Inline error if blank/too long.
- **Company Name:** required, max 255. Inline error if blank/too long.
- **Email:** required and must be valid email format. Inline error: "Please enter a valid email address."
- **Hotline:** optional, no format validation.
- **Legal Representative:** optional, max 255.
- **Head Office Address:** optional, max 500.
- **Logo:** optional; must be JPG/PNG/WEBP and ≤ 5MB. Inline error on oversized file: "File size must not exceed 5MB."; inline error on wrong type: "Please upload a JPG, JPEG, PNG or WEBP image."
- **Branch name (add and inline edit):** required, max 255. Inline error if blank: "Branch name is required." (focus returns to the name field).
- **Branch phone:** optional, no format validation.
- **Branch address:** optional, max 500.

If a branch row is still mid inline-edit when Save is pressed, Save first attempts to commit that row; if its validation fails, Save is blocked until resolved.

### Empty States

- **No branches:** the branch list shows "No branches configured yet."
- **No logo:** the logo preview shows a placeholder image icon (dashed box).
- **Empty branch phone/address:** shown as a dash "—" on that branch card line.

### Notifications & Feedback

All feedback is styled in-page (no native browser pop-ups, no multi-line save-summary alert):

1. **Save success (toast):** "Platform information updated successfully." (success-styled toast, auto-dismiss ~3s).
2. **Discard changes (confirm modal):** title "Discard changes?", message "You have unsaved changes. Are you sure you want to discard them?", buttons Cancel | Discard (danger).
3. **Remove branch (confirm modal):** title "Remove branch?", message `Remove branch "{Branch Name}"? It will be removed when you save.`, buttons Cancel | Remove (danger).
4. **Inline field errors:** shown below the relevant field (required/length/format), including logo type/size and branch name required.
5. **Logo upload:** no toast; the preview updates (or an inline error shows on invalid file).

### Navigation

- The screen has no internal links, back buttons, breadcrumbs, or tabs.
- It is reached only from the admin sidebar (SYSTEM SETTINGS & INTEGRATIONS → "Platform Information") and loads inside the admin shell's content area.
- **Persistence:** Saved settings are persisted to `localStorage` under the key `platformInfo` (schema: `{ platformName, companyName, hotline, email, legalRepresentative, headOfficeAddress, branches: [{ name, phone, address }], logo }`). On load, saved state is read from this key (falling back to the seeded defaults). The draft, pending logo/branch changes, and inline-edit markers are in-memory only until committed on Save. (This remains a demo screen; in production the same Save would also record to Audit Logs.)
