## Category Search

**Purpose:** Lets an admin build and arrange the "category search" navigation that end users see on the storefront. The admin creates a list of **Tabs**, and inside each tab one or more **Sections** (a section can be a labeled divider or an unlabeled "general" group), and inside each section a list of **Items**. Every item is a saved search shortcut: it carries a set of property-search filters (built in a side panel called the Filter Builder), an optional "popularity rule", and an automatically-calculated count of matching properties. The admin can rename, reorder, show/hide, and delete tabs, sections, and items. All changes save instantly to the browser (local storage) — this is a demo with no backend, so all numbers and lists are sample data.

**Access:** Admin sidebar → CONTENT MANAGEMENT → "Category Search". The screen opens inside the admin shell. There is no login gate on the screen itself, no permission checks, and no URL parameters.

---

### Layout & Structure

- **Page title (top of page):** "Category Search". (No sub-title line is shown.)
- **Two-column layout** below the title:
  - **Left column ("Tabs" panel)** — a card listing every tab, with an "Add Tab" button in its header.
  - **Right column ("Content" panel)** — a card showing the currently-selected tab's sections and their item tables, with an "Add Section" button in its header.
- On narrow screens (phone/small window, under ~900px wide) the two columns stack into a single column (left panel on top).
- **Hidden overlays** that appear on demand:
  - A **Filter Builder** slide-in panel (drawer) that slides in from the right edge, covering part of the screen with a dark backdrop.
  - A **small popup (modal)** used for renaming / naming (single text box).
  - A **confirmation popup (modal)** used before deleting.
  - **Toast messages** that appear briefly in the bottom-right corner.

---

### Every Element

#### Left panel — "Tabs"

- **Panel heading:** folder icon + "Tabs".
- **"Add Tab" button** (top-right of panel, primary/orange, plus icon). Effect: opens the naming popup titled "Add tab" (see Modals).
- **Tab list:** one row per tab, shown in the admin-defined order. Each tab row contains, left to right:
  - **Reorder controls:** an up-arrow and a down-arrow stacked vertically.
    - Up arrow: moves this tab one position earlier. Disabled (greyed, not clickable) when the tab is already first.
    - Down arrow: moves this tab one position later. Disabled when the tab is already last.
  - **Tab name** (the label text; long names are cut off with "…" and the full name shows on hover). If the tab is hidden, the name is shown in muted grey.
  - **Visibility toggle** (a switch, tooltip "Visible"). On = green, the tab is shown on the storefront; Off = grey, hidden. Toggling saves immediately, no confirmation.
  - **Rename button** (pencil icon, tooltip "Rename"). Opens the naming popup titled "Rename tab", pre-filled with the current name.
  - **Delete button** (trash icon, red on hover, tooltip "Delete"). Opens the delete confirmation popup.
  - Clicking anywhere else on the row (not on the controls above) selects that tab, loading its content into the right panel and highlighting the row.

#### Right panel — "Content" (for the selected tab)

- **Content header:**
  - **Title:** a list icon + the selected tab's name. If the tab is hidden, a small grey "HIDDEN" badge appears next to the name. When no tab is selected, the title shows a dash "—".
  - **"Add Section" button** (plus icon). Effect: opens the naming popup titled "Add section divider" pre-filled with "【 】". (If no tab is selected, instead shows a toast "Select a tab first".)
- **Section blocks:** one block per section in the tab, in order. Each block has a section header bar followed by an items table.
  - **Section header bar:**
    - **Section title:**
      - For a normal labeled section: the divider text. If hidden, a "HIDDEN" badge follows it.
      - For a "default" / unlabeled section: the italic muted text "General" (shown on a dashed-border bar). This means items in this section appear on the storefront with no divider heading above them.
    - **Move up arrow** (tooltip "Move up") — moves the section earlier; disabled when first.
    - **Move down arrow** (tooltip "Move down") — moves the section later; disabled when last.
    - **Visibility toggle** (switch, tooltip "Visible") — show/hide this section; saves immediately.
    - **Rename divider button** (pencil, tooltip "Rename divider") — opens naming popup titled "Rename divider", pre-filled with the section label. Note: if the admin clears the name to empty, the section becomes a "default / no-divider" section.
    - **Delete section button** (trash, red, tooltip "Delete section") — opens delete confirmation.
    - **"Add Item" button** (plus icon) — opens the Filter Builder drawer in "Add Item" mode for this section.

#### Items table (one per section)

Columns, in order:

1. **Order** — shows the item's position number, plus an up-arrow (tooltip "Up", disabled when first) and down-arrow (tooltip "Down", disabled when last) to reorder the item within its section.
2. **Label** — the item's display name (may include emoji).
3. **Filter Summary** — a row of small chips summarizing the saved filters (e.g. a "Buy" chip in accent color, region names, property types, price range, feature tags). If the item has no filters at all, shows muted text "No filter".
4. **Popularity** — if the item has an enabled popularity rule, a yellow chip like "Clicks ≥ 10" (the word is "Clicks", "Keep", or "CV" depending on the chosen metric). If no rule, shows a muted dash "—".
5. **Property Count** — a number (the count of matching properties, formatted with thousands separators) followed by a small "auto" tag. Hovering the "auto" tag shows the tooltip "Calculated live from current property data." This number is read-only (not editable).
6. **Visible** — a switch to show/hide the individual item; saves immediately.
7. **Actions** — an Edit button (pencil, tooltip "Edit", opens the Filter Builder drawer pre-loaded with this item) and a Delete button (trash, red, tooltip "Delete", opens delete confirmation).

- **Sorting:** rows always follow the admin-set order; columns are not click-sortable.
- **Search / filter within the table:** None.
- **Pagination:** None — all items show at once.

#### Status badges

- **"HIDDEN" badge** — grey pill shown beside a tab name (in the content header) or a section name when its visibility toggle is off.
- **"auto" tag** — gold/cream tag in the Property Count column indicating the number is computed automatically.
- **Filter chips** — neutral grey chips for most criteria; an accent/orange chip specifically for the transaction type ("Buy" / "Rent").
- **Popularity chip** — yellow pill in the Popularity column.

---

### Modals & Popups

#### 1. Filter Builder drawer (right slide-in panel)

- **Trigger:** "Add Item" (section header) opens it empty in "Add Item" mode; the row Edit (pencil) opens it pre-filled in "Edit Item" mode.
- **Title:** "Add Item" when creating, "Edit Item" when editing.
- **Fields, grouped in labeled boxes:**
  - **Required-field marker convention:** required fields show a red asterisk "*" directly after the label. Optional fields have no asterisk and no "(Optional)" text. In this drawer the only required fields are **Item label** (always) and, conditionally, the Popularity **Metric** and **Threshold** (required only when Popularity "Enabled" is checked). Every other Filter Builder field is optional.
  - **No Author field:** this screen has no Author / created-by field anywhere (the Filter Builder has only the fields listed below). Nothing to mark.
  - **Basics**
    - **Item label (emoji supported)** * — text box. Placeholder: "e.g. 🐕 Pet-Friendly Property". **Required** (red asterisk).
  - **Popularity rule**
    - **Enabled** — checkbox (unchecked by default for a new item). Optional (no asterisk).
    - **Metric** * — dropdown. Options: "Clicks (CL)" (default), "Keep (saves)", "CV (conversions)". Marked required (red asterisk) because it is required **only when "Enabled" is checked** (conditionally required); ignored/not saved when Enabled is off.
    - **Threshold ( ≥ )** * — number box, minimum 0, default 10. Marked required (red asterisk), **conditionally required only when "Enabled" is checked**; ignored/not saved when Enabled is off.
    - (The rule is only saved if "Enabled" is checked; otherwise the item has no popularity rule, and Metric/Threshold are not applied.)
  - **Transaction & keyword**
    - **Transaction type** — three selectable buttons (radio): "Any" (default), "Buy", "Rent".
    - **Keyword** — text box, placeholder "free text".
  - **Region (Prefecture → City)** — a scrollable checklist. Each prefecture has a "(whole)" checkbox plus a checkbox per city. Prefectures and cities, exactly:
    - Tokyo (whole): Chuo, Minato, Setagaya, Shibuya, Shinjuku
    - Kanagawa (whole): Kawasaki, Sagamihara, Yokohama
    - Osaka (whole): Osaka, Sakai, Toyonaka
    - Aichi (whole): Nagoya, Okazaki, Toyota
    - Hokkaido (whole): Asahikawa, Hakodate, Sapporo
    - Fukuoka (whole): Fukuoka, Kitakyushu, Kurume
    - Hiroshima (whole): Fukuyama, Hiroshima, Kure
    - Hyogo (whole): Himeji, Kobe, Nishinomiya
    - Kyoto (whole): Kameoka, Kyoto, Uji
    - Saitama (whole): Kawagoe, Kawaguchi, Saitama
    - Nagano (whole): Karuizawa, Matsumoto, Nagano
    - Okinawa (whole): Naha, Okinawa, Urasoe
    - (Lists are shown alphabetically. If "(whole)" is ticked for a prefecture, any individual city ticks for that same prefecture are ignored on save.)
  - **Station (Prefecture → Line → Station)** — a scrollable checklist grouped by prefecture, then railway line, then station:
    - Tokyo → JR Yamanote Line: Shibuya, Shinjuku, Tokyo, Shinagawa, Ikebukuro
    - Tokyo → Tokyo Metro Ginza Line: Ginza, Asakusa, Ueno, Omotesando
    - Kanagawa → Tokyu Toyoko Line: Yokohama, Musashi-Kosugi, Jiyugaoka
    - Kanagawa → JR Negishi Line: Kannai, Sakuragicho
    - Osaka → Osaka Metro Midosuji Line: Umeda, Namba, Tennoji, Shinsaibashi
    - **Walk time from station** — dropdown. Options: "Any" (default), "≤5 min", "≤10 min", "≤15 min", "≤20 min".
  - **Property type & sale unit**
    - **Property types** — multi-select pills (toggle on/off). Full list (20): Apartment, Tower Mansion, House, Residential Multi-Family Building (shown as "Residential Bldg"), Retail Unit, Retail Building, Office Unit, Office Building, Factory & Warehouse Unit (shown "Factory/WH Unit"), Factory & Warehouse Building (shown "Factory/WH Bldg"), Mixed-Use Building (shown "Mixed-Use"), Hotel & Ryokan (shown "Hotel/Ryokan"), Resort Apartment & Condo Hotel Unit (shown "Resort/Condo-Hotel"), Resort House & Villa & Ski Chalet (shown "Resort/Villa/Chalet"), Residential Land, Commercial Land, Other Land, Car Park, New Development, New House.
    - **Sale unit** — dropdown. Options: "Any" (default), "Unit", "Whole Building".
  - **Layout & rooms**
    - **Floor plan minimum (≥)** — dropdown. Options: "Any" (default), "1LDK+", "2LDK+", "3LDK+", "4LDK+".
    - **Specific layouts (LDK)** — multi-select pills: 1R, 1K, 1DK, 1LDK, 1SLDK, 2DK, 2LDK, 2SLDK, 3DK, 3LDK, 3SLDK, 4DK, 4LDK, 4SLDK, 5DK, 5LDK, 6LDK+.
    - **Bedrooms** — multi-select pills: 1, 2, 3, 4, 5+.
  - **Size & price**
    - **Size min (m²)** — number box, minimum 0.
    - **Size max (m²)** — number box, minimum 0.
    - **Price min (¥)** — number box, minimum 0, steps of 1,000,000.
    - **Price max (¥)** — number box, minimum 0, steps of 1,000,000.
    - Helper note: "Enter absolute yen (e.g. 10000000 = ¥10M, 500000000 = ¥500M)."
  - **Age, recency & investment**
    - **Building age** — dropdown. Options: "Any" (default), "Completed ≤1yr", "Built 1–5yr", "Built 2–10yr", "30yr+".
    - **Listing recency** — dropdown. Options: "Any" (default), "Registered ≤1 week", "Registered ≤1 month".
    - **Gross yield min (%)** — number box, minimum 0, steps of 0.1.
    - **Building floors** — dropdown. Options: "Any" (default), "≤5 floors (Low-Rise)".
    - **Occupancy** — dropdown. Options: "Any" (default), "Fully Occupied".
  - **Condition & area type**
    - **Build / condition** — multi-select pills: Newly Built, Renovated.
    - **Area type / POI proximity** — multi-select pills: Coastal, Resort, Ski, Near University.
  - **Feature flags** — multi-select pills: Pet-friendly, Parking, Furnished, View, 3D/VR Tour, Short-stay, Move-in ready / Immediate, No Key Money, Low initial fees.
- **Buttons (footer):** "Cancel" (closes without saving) and "Save Item" (check icon, saves).
- **Close options:** the X icon (tooltip "Close") in the header, clicking the dark backdrop, the Cancel button, or pressing the Escape key.

#### 2. Naming popup (rename / add)

- **Trigger:** Add Tab, Rename tab, Add Section, Rename divider.
- **Title:** varies by action ("Add tab", "Rename tab", "Add section divider", "Rename divider").
- **Field:** a single text box (pre-filled depending on the action).
- **Buttons:** "Cancel" and "Save".
- **Close options:** an X icon (tooltip "Close") in the popup header, the Cancel button, clicking the backdrop, or pressing Escape. Pressing Enter is the same as "Save". The box is auto-focused and its text auto-selected when it opens.
- **Blank-name handling:**
  - **Add tab / Rename tab** with an empty/whitespace name → error toast "Tab name is required." and the popup stays open with focus returned to (and the text re-selected in) the input. Nothing is saved.
  - **Add section divider** with an empty/whitespace name → error toast "Section name is required." and the popup stays open with focus returned to the input. Nothing is saved.
  - **Rename divider** with a blank value is the EXCEPTION — it is still allowed and intentionally converts the section to a "default / no-divider" section; no error toast is shown in that case.

#### 3. Delete confirmation popup

- **Trigger:** Delete tab, Delete section, or Delete item.
- **Title:** "Delete tab?", "Delete section?", or "Delete item?".
- **Message:** see Validation/Notifications for exact text.
- **Buttons:** "Cancel" and a red "Delete".
- **Close options:** an X icon (tooltip "Close") in the popup header, the Cancel button, clicking the backdrop, or pressing Escape. "Delete" performs the deletion then closes.

---

### Conditional Display

- **Right panel "no tab selected" message** — shown when no tab is selected: "Select a tab on the left to manage its sections and items."
- **"HIDDEN" badge on tab title** — shown only when the selected tab's visibility is off.
- **Hidden tab row styling** — a tab whose visibility is off shows its name in muted grey in the left list.
- **"HIDDEN" badge on a section** — shown only when that section's visibility is off (labeled sections only).
- **Default-section text** — a section shows "General" (dashed style) only when it has no label / is marked default; otherwise it shows its divider label.
- **"No sections." message** — shown in the right panel when the selected tab has zero sections.
- **Popularity column content** — shows the yellow "<metric> ≥ <value>" chip only when the item's popularity rule exists and is enabled; otherwise a dash "—".
- **Filter Summary content** — shows chips only for criteria that are set; if nothing is set, shows "No filter".
- **Reorder arrows** — up arrow disabled when the row is first; down arrow disabled when last (applies to tabs, sections, and items).
- **Popularity rule on save** — only saved if the "Enabled" checkbox is on; otherwise the item is saved with no rule.
- **Region "whole" vs city** — if a prefecture's "(whole)" box is ticked, individual city selections for that prefecture are dropped when saving.
- **Drawer title** — "Add Item" vs "Edit Item" depending on whether you opened it to create or edit.

---

### User Flows

**Add a tab**

1. Click "Add Tab" → naming popup "Add tab" opens with an empty box.
2. Type a name, click Save (or press Enter). If the box is empty/blank, an error toast "Tab name is required." appears, the popup stays open, and focus returns to the input — nothing is saved.
3. The new tab is added at the end of the list, automatically gets one default (no-divider) section, becomes the selected tab, and a toast shows: Tab "<name>" added.

**Rename a tab**

1. Click the pencil on a tab → naming popup "Rename tab" opens pre-filled.
2. Edit and Save. A blank name is rejected with error toast "Tab name is required." (popup stays open, focus returns to the input). On success: toast "Tab renamed".

**Show/hide a tab** — toggle the tab's switch. Saves immediately; hidden tabs show the "HIDDEN" treatment. No confirmation.

**Reorder a tab** — click the up/down arrow on the tab row; it swaps position with its neighbor. Saves immediately.

**Delete a tab**

1. Click the trash icon → confirmation "Delete tab?" with message: Delete "<name>" and all its sections & items? This cannot be undone.
2. Click Delete → the tab, all its sections, and all their items are removed. If it was the selected tab, the first remaining tab becomes selected. Toast: "Tab deleted".

**Select a tab** — click the tab row → right panel loads that tab's sections and items.

**Add a section**

1. With a tab selected, click "Add Section" → naming popup "Add section divider" pre-filled with "【 】". (If no tab is selected: toast "Select a tab first" and nothing opens.)
2. Type the divider label and Save. A blank name is rejected with error toast "Section name is required." (popup stays open, focus returns to the input). On success: section added to the end; toast "Section added".

**Rename a section divider**

1. Click the pencil on the section header → naming popup "Rename divider" pre-filled.
2. Save. If you leave the name non-empty, it stays a labeled divider. If you clear it to empty and save, the section becomes a "default / no divider" section. Toast: "Section updated".

**Show/hide a section** — toggle the section switch; saves immediately.

**Reorder a section** — up/down arrows on the section header; saves immediately.

**Delete a section**

1. Click the trash on the section header → confirmation "Delete section?" with message: Delete this section and its <n> item(s)?
2. Click Delete → the section and its items are removed. If that leaves the tab with no sections, a new empty default section is automatically created so every tab keeps at least one. Toast: "Section deleted".

**Add an item**

1. Click "Add Item" in a section header → Filter Builder drawer opens ("Add Item").
2. Enter at least the Item label, set any filters / popularity rule.
3. Click "Save Item". If the label is empty: toast "Item label is required", the label box is focused, and the drawer stays open. On success: the item is added to the end of the section with an auto-computed property count; toast "Item added"; drawer closes.

**Edit an item**

1. Click the pencil in the item's Actions column → drawer opens ("Edit Item") pre-filled with the item's label, filters, and popularity rule.
2. Change fields, click "Save Item" → item updated; toast "Item updated"; drawer closes. (Label still required.)

**Show/hide an item** — toggle the item's Visible switch; saves immediately.

**Reorder an item** — up/down arrows in the Order column; swaps with the neighbor in the same section.

**Delete an item**

1. Click the trash in the Actions column → confirmation "Delete item?" with message: Delete "<label>"?
2. Click Delete → item removed; toast "Item deleted".

**Pill / checkbox interactions in the drawer** — toggling a pill checkbox highlights it (orange) live; multiple pills can be on at once.

---

### Validation

- **Required-field markers (Filter Builder):** required fields carry a red asterisk "*" after the label. Required: **Item label** (always); **Metric** and **Threshold** (conditionally — only when Popularity "Enabled" is checked). All other Filter Builder fields are optional and carry no marker (no "*", no "(Optional)" text).
- **Item label (Filter Builder):** required. If blank/whitespace on Save: toast "Item label is required" and focus returns to the label box; nothing saves.
- **Popularity Metric / Threshold (Filter Builder):** conditionally required — meaningful and applied only when the "Enabled" checkbox is on. When Enabled is off they are ignored and no popularity rule is saved. (No separate blank-rejection toast; Metric always has a default selection and Threshold defaults to 10.)
- **Naming-popup required status (single text-box modal):**
  - **Tab name (Add tab / Rename tab):** required. Blank/whitespace is rejected with an error toast "Tab name is required."; the popup stays open and focus returns to the input. Nothing is saved.
  - **Section divider name (Add section divider):** required **on Add**. Blank/whitespace is rejected with an error toast "Section name is required."; the popup stays open and focus returns to the input.
  - **Section divider name (Rename divider):** **NOT required on Rename** — a blank value is accepted (no error toast) and converts the section to a "default / no-divider" section. This is the deliberate exception to the blank-name rule.
- **Number fields** (size min/max, price min/max, yield min, popularity threshold): enforce a minimum of 0 via the browser; empty is allowed (treated as "not set"). No cross-field checks (e.g. the screen does not verify min ≤ max).
- **All other Filter Builder fields:** optional; an item can be saved with no filters (it will display "No filter").
- **Confirmation message text (exact):**
  - Delete tab → `Delete "<name>" and all its sections & items? This cannot be undone.`
  - Delete section → `Delete this section and its <n> item(s)?`
  - Delete item → `Delete "<label>"?`

---

### Empty States

- **No tabs at all (left list):** `No tabs. Click "Add Tab".`
- **No tab selected (right panel):** `Select a tab on the left to manage its sections and items.` (Title shows "—".)
- **Selected tab has no sections:** `No sections.`
- **A section has no items:** `No items in this section yet.`
- **An item has no filters (Filter Summary column):** `No filter`
- **An item has no popularity rule (Popularity column):** a dash `—`.

---

### Notifications & Feedback

All feedback uses on-screen toasts (bottom-right, auto-dismiss after ~2.4 seconds) and the custom confirmation popup. No browser-native alert/confirm dialogs are used.

**Toasts (exact text):**

- `Tab "<name>" added` — after adding a tab.
- `Tab name is required.` — attempting to Save an Add tab / Rename tab popup with a blank name (popup stays open, focus returns to the input).
- `Tab renamed` — after renaming a tab.
- `Tab deleted` — after confirming tab deletion.
- `Select a tab first` — clicking "Add Section" with no tab selected.
- `Section name is required.` — attempting to Save an Add section divider popup with a blank name (popup stays open, focus returns to the input).
- `Section added` — after adding a section.
- `Section updated` — after renaming/clearing a section divider.
- `Section deleted` — after confirming section deletion.
- `Item label is required` — saving an item with no label.
- `Item added` — after adding a new item.
- `Item updated` — after editing an existing item.
- `Item deleted` — after confirming item deletion.

**Confirmation popups:** see Validation for exact message text. Each has Cancel and a red Delete button.

**Other feedback:** toggling a switch, reordering, and selecting a tab give immediate visual change (no toast). The Property Count "auto" tag has a tooltip "Calculated live from current property data."

---

### Navigation

- This is a self-contained screen with **no in-screen links to other admin pages, no breadcrumbs, and no back button.** It is reached only via the sidebar (CONTENT MANAGEMENT → "Category Search").
- The "tabs" on this screen are content tabs being configured (not page navigation); selecting one only changes the right-hand panel — the page/URL does not change.
- **Persistence:** every change (add/rename/reorder/show-hide/delete of tabs, sections, items, and item filters) is saved immediately to the browser's local storage under the key `yuushi.categorySearchConfig`. On reopening the screen, it reloads from that saved data. If nothing is saved yet (or the saved data is invalid), the screen loads a built-in sample configuration (7 starter tabs: "Popular Cities", "Popular Properties", "New Listings ※Register within one month", "Properties For Sale", "Rental Properties", "Investment Properties", "Featured Properties") and the first tab is auto-selected. Because storage is per-browser and there is no backend, changes are local to that browser only and are not shared with other users.
