## Appraisal Form Field Configuration (Property Information Form)

**Purpose:** A single-screen configuration sheet for the public appraisal / "Property Information Form". It lists every field the seller-facing valuation form can contain, organised into two steps (STEP 1 Property Information, STEP 2 Personal Information) and grouped into sections. For each field the admin can see its bilingual name (EN / JP), its attribute (Required vs Optional), its input format, the EN/JP options/remarks, and — per property type — whether that field applies (○) or not (—). The table is **read-only by default**; the admin clicks **Edit** to enable the in-cell toggles, then **Save** to persist (or **Cancel** to discard). It controls form *behaviour/structure* only; it does not show any answers sellers typed.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Appraisal Form Field Configuration". Opens inside the admin shell's content area. No role restrictions are implemented in the page itself. Saved changes persist to browser localStorage (`yuushi.appraisalFieldConfig`) and survive reloads; Cancel reverts to the last saved state.

### Layout & Structure

The screen is a single full-height layout (no left/right split, no detail panel):

1. **Page header** (top, gold underline): the title "Property Information Form" with the sub-line "YUUSHI — Field Configuration Sheet" on the left; on the right a **legend** explaining the two toggles, plus the **action buttons** — an **Edit** button in view mode, which is replaced by **Cancel** + **Save** (and an "Editing…" pill) while in edit mode.
2. **Configuration table** (fills the rest of the screen, scrolls both directions inside its area):
   - A gold **STEP bar** ("STEP 1. Property Information") above the table.
   - A table with **sticky dark column headers**.
   - **Section rows** (cream/gold banded) that group fields.
   - One **data row per field**.
   - Partway down, a gold **"STEP 2. Personal Information"** banner row separates the two steps; the STEP 2 fields follow in the same table.

### Every Element

**Legend** (top-right, explanatory only):
- "Required ↔ Optional (click Attribute cell)" — a coloured key for the Attribute toggle.
- "○ ↔ — (click ○ / — cell)" — a key for the per-property-type applicability toggle.

**Table columns** (left to right):
1. **No.** — the field's number within its step (e.g. 1, 4-1, 4-2…). A red **"編集不可"** (not-editable) tag appears above the number for locked fields (e.g. Property Type).
2. **Field Name (EN)** — English field name.
3. **項目名 (JP)** — Japanese field name.
4. **Attribute / 属性** — a badge: amber **Required** or green **Optional**. In **edit mode**, click the cell to toggle Required ↔ Optional (read-only otherwise).
5. **Input Format / 入力形式** — the field's input type (e.g. Free Text, Numeric, Single Choice, Tick Box, Multi Select, Year/Month, Address Input (API)…).
6. **Options / Remarks (EN)** — English options or notes.
7. **選択肢・備考 (JP)** — Japanese options or notes.
8–12. **Property-type columns** — five columns: **1. Apt (アパート/マンション)**, **2. House (一戸建て)**, **3. Land (土地)**, **4. Other Unit (収益区分)**, **5. Whole Bldg (収益一棟)**. Each shows **○** (applies, green) or **—** (does not apply, grey). In **edit mode**, click a cell to toggle ○ ↔ — (read-only otherwise).

Long text cells are truncated with an ellipsis and show the full value on hover (native tooltip). Rows highlight on hover; even rows are lightly shaded.

**Section grouping rows** (STEP 1): "COMMON FIELDS （共通項目）", "BUILDING / UNIT INFO （建物・部屋情報）", "LAND INFO （土地情報）", "OCCUPANCY & REVENUE （入居・収益情報）", "COMPETITOR-SOURCED FIELDS （他社参考項目）".

**STEP 2 banner row:** "STEP 2. Personal Information" — separates the personal-information fields (Name, Email, Phone, Relationship to Property, Country/Region, Current Address, Contact Method, Preferred Contact Time, Preferred Language, Special Requests, Reason for Selling, Age, Preferred Valuation Method).

### Conditional Display

- **View vs. edit mode:** by default the table is read-only and only the **Edit** button shows. In edit mode the table gets a gold highlight, an "Editing…" pill appears, and the buttons switch to **Cancel** + **Save**.
- **Cells interactive only in edit mode:** the Attribute and ○/— cells only respond to clicks while editing; in view mode they show no pointer/hover affordance.
- **Attribute badge colour:** amber when Required, green when Optional; flips when its cell is clicked (edit mode).
- **Property-type cell:** green ○ when the field applies to that property type, grey — when not; flips when clicked (edit mode).
- **"編集不可" tag:** shown only on fields flagged as not-editable (a visual marker).

### User Flows

- **Enter edit mode:** click **Edit** → the toggles become interactive; the header shows Cancel/Save and the "Editing…" pill. (A snapshot of the current configuration is taken for a possible Cancel.)
- **Toggle whether a field is required:** (in edit mode) click the Attribute cell → the badge flips Required ↔ Optional.
- **Toggle whether a field applies to a property type:** (in edit mode) click the ○ / — cell → it flips ○ ↔ —.
- **Save:** click **Save** → the current configuration is written to localStorage, a "Configuration saved successfully." toast shows, and the screen returns to view mode (changes persist across reloads).
- **Cancel:** click **Cancel** → all unsaved toggles are reverted to the snapshot, a "Changes discarded." toast shows, and the screen returns to view mode.
- **Browse:** scroll the table vertically (sticky headers stay) and horizontally; STEP 1 fields appear first, then the STEP 2 banner and STEP 2 fields.

### Validation

None. There are no free inputs to validate — interaction is limited to the two in-cell toggles, available only in edit mode.

### Empty States

None — the table is always populated from the built-in field catalogue.

### Notifications & Feedback

Bottom-right toasts (auto-dismiss ~2.4s): "Configuration saved successfully." on Save, and "Changes discarded." on Cancel. Plus visual feedback: badge/symbol flips, hover highlights (edit mode), a brief press animation on ○/— cells, the gold table outline while editing, and the "Editing…" pill. No modals or confirmation dialogs.

### Navigation

- Reached from the admin sidebar (SYSTEM SETTINGS & INTEGRATIONS → "Appraisal Form Field Configuration"); loads in the content area, URL unchanged.
- No links, tabs, or buttons that navigate elsewhere.
- **Persistence:** the **field catalogue** (which fields exist, their names/format/options) is hardcoded reference data. The **per-field attribute and per-property-type applicability** are saved to browser localStorage under `yuushi.appraisalFieldConfig` when **Save** is clicked, and are re-applied on load — so configuration changes survive reloads. **Cancel** (or simply not saving) leaves the stored config unchanged.
