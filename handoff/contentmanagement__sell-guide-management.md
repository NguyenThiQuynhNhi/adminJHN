## Sell Guide Content Management

**Purpose:** Lets an admin edit the content of the public-facing "Sell Guide" landing page. The admin manages two content sections — a "Step Cards" section (a page title, a subtitle, and up to 6 numbered step cards, each with an icon image, a header, and a body) and a "Feature Highlight" section (one image, a heading, and a body). Each section shows a live preview that mirrors how it will look on the public website. Saved content is stored in the browser's local storage.

**Access:** Admin sidebar → CONTENT MANAGEMENT → "Sell Guide Management". (Note: at documentation time this page is not yet linked in the sidebar, so it may currently be unreachable from the shell until a menu entry is added.)

---

### Layout & Structure

- **Page header:** A single large title reading "Sell Guide Content Management". There is no subtitle and no breadcrumb shown.
- **Two stacked panels**, one above the other:
  - **Panel 1 — "Step Cards Section"** (marked with a round "01" badge and a list icon).
  - **Panel 2 — "Feature Highlight Section"** (marked with a round "02" badge and an image icon).
- **Each panel has three parts:**
  - A **panel header** containing the panel title (left) and a **save-status indicator** (right).
  - A **two-column body**: the **left column is the editor** (where the admin types/uploads), and the **right column is the "Live Preview"** (a read-only mock of the public page, with a small "Live Preview" eye-icon tag in the top-right corner). On narrow screens (under ~1000px wide) the two columns stack vertically.
  - A **panel footer** containing a single "Save Changes" button.
- **Toasts** (small confirmation/error messages) appear stacked in the bottom-right corner of the screen.

---

### Every Element

#### Panel 1 — Step Cards Section

**Panel header**

- Title: "Step Cards Section" with a "01" badge and list icon.
- Save-status indicator (right side): a colored dot plus a text label. Initial text: "Not saved yet". See Status badges below.

**Editor (left column)**

- **Page Title** — single-line text input.
  - Label: "Page Title" with a red required asterisk "*" and a live character counter showing "N / 100" beside it.
  - No placeholder. Max length 100 characters (cannot type past 100).
  - Default value when nothing has been saved before: "Explore your property accurate value".
  - Required when saving Panel 1.
  - Saves into the Step Cards section content (trimmed of surrounding spaces on save).
- **Page Subtitle** — single-line text input.
  - Label: "Page Subtitle" with a red required asterisk "*" and a counter "N / 60".
  - No placeholder. Max length 60 characters.
  - Default value: "with 3 easy steps".
  - Required when saving Panel 1.
- **"Steps" sub-divider** — a small section heading reading "Steps" with a footprints icon.
- **Step cards list** — a vertical list of step cards (see "Step card" below). Default content has 3 steps.
- **"Add Step" button** — full-width button labeled "Add Step" with a plus icon and an inline counter "(N/6)" showing current step count out of the maximum.
  - Effect: adds one new step to the bottom of the list, pre-filled with header "New step" and body "Describe what happens in this step." (no icon image).
  - Becomes disabled (greyed out, not clickable) once there are 6 steps.

**Each Step card contains:**

- A round number badge (1, 2, 3, …) and a "Step N" label.
- Three action buttons (top-right of the card):
  - **Move up** (up-arrow icon) — moves the step one position earlier. Disabled on the first step.
  - **Move down** (down-arrow icon) — moves the step one position later. Disabled on the last step.
  - **Delete step** (X icon, red) — removes the step (asks for confirmation first). Disabled when only 1 step remains.
- **Icon image row** — an upload area showing a circular thumbnail plus:
  - Label "Icon image" with a red required asterisk "*".
  - Sub-text: when no image is set, "PNG/JPG/JPEG/WEBP"; when an image is set, "Custom icon uploaded". (Compression still happens silently, but there is no longer any visible disclaimer text about it.)
  - An upload button labeled "Upload" (cloud icon) when empty, or "Replace" (rotate icon) when an image already exists. Opens the file picker (accepts PNG/JPG/JPEG/WEBP only).
  - When an image exists, a small red trash button also appears to remove the icon.
  - When an image is set, the row is highlighted (solid gold border, gold background) and the thumbnail shows the uploaded image; otherwise it shows a placeholder image icon.
  - Required: every step must have an icon image to save Panel 1.
- **Header** — single-line text input. Label "Header" with a red required asterisk "*" and counter "N / 60". Max length 60. Required (every step must have a header to save Panel 1).
- **Body** — multi-line textarea. Label "Body" with a red required asterisk "*" and counter "N / 200". Max length 200. Required (every step must have body text to save Panel 1).

**Preview (right column)** — read-only mock showing:

- The page title (large, centered). Shows "—" before any title is entered.
- The page subtitle (centered). Shows "—" before any subtitle is entered.
- A row of step preview cards (one per step), each with a circular icon (the uploaded icon image, or a placeholder image icon), the step header (falls back to "—" if blank), and the step body. The row's columns adjust to the number of steps.

**Panel footer**

- **"Save Changes" button** (primary gold button, floppy-disk icon) — validates and saves Panel 1.

#### Panel 2 — Feature Highlight Section

**Panel header**

- Title: "Feature Highlight Section" with a "02" badge and image icon.
- Save-status indicator: same behavior as Panel 1, initial text "Not saved yet".

**Editor (left column)**

- **Section Image** — an upload dropzone.
  - Label: "Section Image" with a red required asterisk "*". Required when saving Panel 2.
  - Default (empty) content: a cloud-upload icon with text "Click to upload". Clicking opens the file picker (accepts PNG/JPG/JPEG/WEBP only).
  - Below the dropzone, a meta row holds only a remove button (there is no visible status-text element for this section image):
    - Remove button (trash icon, ghost style) — hidden when no image; shown when an image exists. Clears the image.

  - When an image is set, the dropzone shows the uploaded image preview instead of the empty prompt.

- **Heading** — single-line text input. Label "Heading" with a red required asterisk "*" and counter "N / 100". Max length 100. Default value "Why should you work with agent?". Required when saving Panel 2.
- **Body** — multi-line textarea (5 rows). Label "Body" with a red required asterisk "*" and counter "N / 500". Max length 500. Default value "Enjoy the afternoon with relaxing and enjoying our variety of pastries and special tea from Zerra with afternoon tea, IDR 80K for 2 pax...". Required when saving Panel 2.

**Preview (right column)** — read-only mock showing:

- The section image on one side (shows a built-in placeholder graphic of "two people reviewing documents" when no image has been uploaded).
- The heading (falls back to blank if empty; shows "—" before any input) and the body text on the other side.

**Panel footer**

- **"Save Changes" button** (primary gold button, floppy-disk icon) — validates and saves Panel 2.

#### Dropdowns / Radios / Checkboxes / Toggles

None. This screen has no dropdowns, radio buttons, checkboxes, or toggle switches.

#### Tables

None. There are no tables, no pagination, and no search/filter on this screen.

#### Status badges (save-status indicator, one per panel)

- **"Not saved yet"** — grey/neutral dot. Shown initially when the panel has not been saved this session.
- **"Unsaved changes"** — orange/info-colored dot and orange text. Triggered automatically whenever the admin edits any field, uploads/removes an image, or reorders/adds/deletes a step in that panel.
- **"Last saved: HH:MM"** — green dot. Triggered after a successful save; shows the local clock time of the save. (Green is reserved for the successful-save state only.)

---

### Modals & Popups

- **Styled confirmation modal** (custom, centered, dimmed overlay) — used for the Delete-step confirmation (and the otherwise-unreachable reset action). It shows a warning-triangle title with an "×" close icon in the top-right of the header, a message, and two buttons: "Cancel" (neutral) and a danger-styled confirm button ("Delete"). Dismissed by the "×" close icon, Cancel, clicking the overlay backdrop, or pressing Escape (all treated as cancel). There are no native `confirm()`/`alert()` dialogs on this screen anymore.
- **Corner toast messages** — small auto-dismissing confirmation/error notices in the bottom-right (success = dark with green check, error = red).

**Every field on this screen is required** (all-required convention): Page Title, Page Subtitle, each step's Icon image / Header / Body, Section Image, Heading, and Body. Each label carries a red required asterisk "*".

---

### Conditional Display

- **Add Step button disabled** — when the step count reaches 6.
- **Move Up button disabled** — on the first step in the list.
- **Move Down button disabled** — on the last step in the list.
- **Delete step button disabled** — when only 1 step remains (at least one step must always exist).
- **Step icon: "Upload" vs "Replace"** — the upload button reads "Upload" when the step has no icon image, and "Replace" when it already has one.
- **Step icon: remove button** — only shown when the step has an icon image.
- **Step icon row highlight + sub-text** — when an icon image exists, the row gets a highlighted (solid gold) style and the sub-text changes to "Custom icon uploaded"; otherwise it shows the dashed style and the "PNG/JPG/JPEG/WEBP" guidance text. (There is no longer a visible compression-disclaimer sub-line.)
- **Panel 2 dropzone** — shows the empty "Click to upload" prompt when no image is set, or the image preview when one is uploaded.
- **Panel 2 remove-image button** — hidden when no image; shown when an image exists.

- **Preview placeholders** — title/subtitle/heading show "—" (or blank) until content is entered; preview step icons and the Panel 2 image fall back to placeholders when no image is uploaded.
- **Character counter turns red/bold** — if a field's length somehow exceeds its maximum (the inputs already block typing past the max, so this is a safeguard).

---

### User Flows

- **Edit page title/subtitle (Panel 1):** Type in the field → counter updates live → the preview title/subtitle updates live → the save-status flips to "Unsaved changes".
- **Add a step:** Click "Add Step" → a new step card appears at the bottom (header "New step", body "Describe what happens in this step.") → the preview gains a new card → status becomes "Unsaved changes". If already at 6 steps, the button is disabled and nothing happens.
- **Edit a step header/body:** Type in the field → counter updates → preview card updates live → status "Unsaved changes".
- **Upload a step icon:** Click "Upload"/"Replace" → choose an image file → if the type is not PNG/JPG/JPEG/WEBP an error toast appears, and if the file is over 5 MB an error toast appears (selection cleared in both cases); otherwise it is accepted (and automatically compressed if over ~1 MB or wider/taller than 1920px — see Validation) and the icon thumbnail and the preview card icon update → status "Unsaved changes".
- **Remove a step icon:** Click the trash button on the icon row → the icon clears back to the placeholder → status "Unsaved changes".
- **Move a step up/down:** Click the up/down arrow → the step swaps places with its neighbor (in both the editor list and the preview) → status "Unsaved changes". Arrows are disabled at the list edges.
- **Delete a step:** Click the red X → a styled confirmation modal appears (title "Delete step?", message "Delete Step N? This cannot be undone.", buttons Cancel | Delete) → on Delete, the step is removed from the list and preview and status becomes "Unsaved changes"; on Cancel / overlay click / Escape, nothing changes. Disabled when only one step is left.
- **Save Panel 1:** Click "Save Changes" → all values are trimmed → validation runs (see Validation) → on failure an error toast shows and nothing is saved; on success the content is stored, status changes to "Last saved: HH:MM", and a success toast appears.
- **Edit heading/body (Panel 2):** Type in the field → counter updates → preview updates live → status "Unsaved changes".
- **Upload section image (Panel 2):** Click the dropzone → choose an image → if the type is not PNG/JPG/JPEG/WEBP an error toast appears, and if over 5 MB an error toast appears (selection cleared in both cases); otherwise it is accepted (and automatically compressed if over ~1 MB or wider/taller than 1920px) and the dropzone shows the preview, the remove button appears, and the preview image updates → status "Unsaved changes".
- **Remove section image (Panel 2):** Click the trash button → the image clears (dropzone returns to empty, preview returns to the placeholder graphic) → status "Unsaved changes".
- **Save Panel 2:** Click "Save Changes" → values trimmed → validation runs → on failure an error toast; on success content is stored, status "Last saved: HH:MM", and a success toast appears.

---

### Validation

Validation runs only when "Save Changes" is clicked for that panel. The first failed check stops the save and shows an error toast.

- **Panel 1:**
  - Page Title must not be empty (after trimming). Error: "Page title cannot be empty."
  - Page Subtitle must not be empty (after trimming). Error: "Page subtitle cannot be empty."
  - There must be at least one step. Error: "Add at least 1 step."
  - Every step must have an icon image. Error: "Every step needs an icon image."
  - Every step must have a non-empty header (after trimming). Error: "Every step needs a header."
  - Every step must have non-empty body text (after trimming). Error: "Every step needs body text."
- **Panel 2:**
  - Section Image is required. Error: "Section image is required."
  - Heading must not be empty (after trimming). Error: "Heading cannot be empty."
  - Body must not be empty (after trimming). Error: "Body cannot be empty."
- **Image uploads (both the per-step icon and the Panel 2 section image):**
  - Allowed types: PNG, JPG, JPEG, WEBP only (SVG is rejected). Validation checks both the file extension (.png/.jpg/.jpeg/.webp) and the MIME type. Other types → error toast "Invalid file type. PNG/JPG/JPEG/WEBP only." (selection cleared).
  - Maximum file size: 5 MB. Larger → error toast "Image must not exceed 5MB." (selection cleared).
  - Client-side compression: when an accepted image is over ~1 MB or wider/taller than 1920px, it is compressed before storing — the longest edge is scaled down to 1920px and the image is re-encoded as JPEG at quality 0.85 (stored as a data URL).
- **Length limits** are enforced by the inputs themselves: Page Title 100, Page Subtitle 60, Step Header 60, Step Body 200, Heading 100, Body 500.

---

### Empty States

- **No saved content yet:** the editor and preview load with built-in default content (default title, subtitle, 3 default steps, default Panel 2 heading/body), and both save-status indicators read "Not saved yet".
- **No step icon uploaded:** the step shows a placeholder image icon and the guidance sub-text "PNG/JPG/JPEG/WEBP".
- **No section image uploaded:** the dropzone shows "Click to upload" (no separate status text), and the preview shows a built-in placeholder graphic (two people reviewing documents, labeled "Placeholder · Replace via Section Image upload").
- **Empty title/subtitle/heading in preview:** the preview shows "—" as a placeholder.
- **Empty step header in preview:** the preview card header shows "—".

---

### Notifications & Feedback

**Toast messages (corner, auto-dismiss after a couple seconds):**

- Error: "Invalid file type. PNG/JPG/JPEG/WEBP only." — any image upload (step icon or Panel 2 image) of a disallowed type (e.g. SVG).
- Error: "Image must not exceed 5MB." — any image upload (step icon or Panel 2 image) over 5 MB.
- Error: "Page title cannot be empty." — saving Panel 1 with an empty title.
- Error: "Page subtitle cannot be empty." — saving Panel 1 with an empty subtitle.
- Error: "Add at least 1 step." — saving Panel 1 with no steps.
- Error: "Every step needs an icon image." — saving Panel 1 when any step has no icon image.
- Error: "Every step needs a header." — saving Panel 1 when any step header is blank.
- Error: "Every step needs body text." — saving Panel 1 when any step body is blank.
- Error: "Section image is required." — saving Panel 2 with no image.
- Error: "Heading cannot be empty." — saving Panel 2 with an empty heading.
- Error: "Body cannot be empty." — saving Panel 2 with an empty body.
- Success: "Step Cards section saved successfully." — Panel 1 saved successfully.
- Success: "Feature Highlight section saved successfully." — Panel 2 saved successfully.

**Styled confirmation modal:**

- Delete step: title "Delete step?" (with an "×" close icon in the header), message "Delete Step N? This cannot be undone." (N is the step number), buttons Cancel | Delete (danger). The deletion proceeds only if the admin clicks Delete; the "×", Cancel, backdrop click, and Escape all cancel.

**Inline feedback:**

- Save-status text per panel: "Not saved yet" / "Unsaved changes" / "Last saved: HH:MM".
- Live character counters ("N / max") on every text field.
- Step icon sub-text: "Custom icon uploaded" (when a step icon image is set). The Panel 2 section image has no equivalent visible status text.

(Note: there is no Reset button on this screen, so the reset-related confirmation modal and "Reverted to defaults" message are not reachable by the admin.)

---

### Navigation

- **Inbound:** Loaded inside the admin shell's content area when its sidebar menu item is selected. (A sidebar link may need to be added for it to be reachable.)
- **In-page actions** (none navigate away): Save Changes (Panel 1), Save Changes (Panel 2), Add Step, per-step Move Up / Move Down / Delete / Upload-Replace icon / Remove icon, Panel 2 image upload / Remove image.
- **No links, tabs, or back buttons.** The URL never changes.
- **Persistence:** All saved content for both sections is stored in the browser under the local-storage key `yuushi.sellGuide.v2`. On reload, the screen restores from that saved data (falling back to defaults if none exists). Uploaded images are stored inline (as data) within that same saved content. Note that "Unsaved changes" and the "Last saved" time are session-only and reset on reload.
