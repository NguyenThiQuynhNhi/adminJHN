## Region / Station / Railway Master Data

**Purpose:** Let administrators rename the display labels (Japanese and English) of the platform's fixed geographical and transport hierarchy — Prefectures, Cities, Wards, Railway Lines, and Stations. The underlying structure itself is fixed and cannot be added to, deleted, or re-parented here; only the human-readable labels may be edited. Every label originally comes from Google Maps. An admin can override a label by hand, lock a row so an automatic refresh never overwrites it, or reset an overridden label back to the original Google value. A "Sync from Google Maps" action refreshes all non-locked rows back to their Google labels.

### Phase 1 scope

**In scope (Phase 1):**

- Manual edit of labels (Japanese + English) per row.
- Per-row sync-mode toggle (Auto Update / Manually Locked).
- Per-row "Reset to Google" action — available only for Manually Edited rows.
- Global "Sync from Google Maps" action — refreshes all Auto Update rows and skips Manually Locked rows.
- Concurrent-edit conflict detection via a per-row version number.

**Out of scope (Phase 1):**

- MLIT API integration.
- Adding, removing, or re-parenting any hierarchy entries (the 5-level structure is fixed).
- Importing from sources other than Google Maps.

**Access:** Admin sidebar → SYSTEM SETTINGS & INTEGRATIONS → "Region / Station / Railway Master Data". The screen opens inside the admin portal frame. There is no separate role gate described on the screen beyond reaching it through the admin portal.

### Layout & Structure

The screen is one self-contained page with a header strip across the top and a two-column body below it.

- **Page header (top strip):**
  - Title: "Master Data — Region & Station".
  - A single button on the right side of the header: "Sync from Google Maps".

- **Sync banner:** A full-width amber notice bar that sits between the header and the body. It is hidden during normal use and only appears while a Google sync is running.
- **Body — two columns:**
  - **Left column — "Levels" navigation panel.** A card titled "Levels" containing a vertical list of the five hierarchy levels. Each entry shows an icon, the level name, and a small count badge on the right showing how many rows currently exist at that level. The currently selected level is highlighted. Selecting a level changes the entire right column to show that level's data.
  - **Right column — data panel.** This is where the selected level's records are shown and edited. From top to bottom it contains:
    1. **Dynamic header line:** the level name (e.g., "City") followed by a context label that explains exactly which set of rows is shown (e.g., "Cities under 東京都 (Tokyo)"). The context label updates automatically when the level or the chosen parent changes.
    2. **Parent-selector bar:** one or more dropdowns that let the admin pick which parent the listed rows belong to. This bar only appears for levels that have a parent (City, Ward, Station). It is hidden for Prefecture and Railway Line.
    3. **Search & filter bar:** a search box plus two filter dropdowns and a Reset button.
    4. **Result count line:** text reading "Showing X of Y entries".
    5. **Data table:** the rows for the current level and parent.
- **Toasts:** small confirmation/error messages appear at the bottom-right corner.

### Every Element

**Header**

- **Title** "Master Data — Region & Station" — static text.
- **"Sync from Google Maps" button** — gold button with a circular-arrow icon. Triggers a confirmation, then a simulated sync of all non-locked rows across all five levels. Disabled while a sync is already running.

**Left "Levels" navigation — the five level items (top to bottom):**

1. **Prefecture** (map icon) — shows all prefectures.
2. **City** (city icon) — shows cities, filtered to one selected prefecture.
3. **Ward** (location-pin icon) — shows wards, filtered to one selected city.
4. **Railway Line** (train icon) — shows all railway lines.
5. **Station** (subway icon) — shows stations, filtered to one selected railway line.

Each item displays a live count badge (number of rows at that level). Clicking an item selects that level, clears the search and filters, sets up the appropriate parent-selector bar, and re-draws the table. If the admin is in the middle of an inline edit, clicking another level first asks them to confirm discarding the edit.

**Dynamic header context label** (changes by level):

- Prefecture → "All Prefectures".
- City → "Cities under <selected prefecture JP> (<EN>)".
- Ward → "Wards under <selected city JP> (<EN>)"; if no city is available it reads "Wards (select a city)".
- Railway Line → "All Railway Lines".
- Station → "Stations under <selected line JP> (<EN>)".

**Parent-selector bar dropdowns** (only the relevant ones are shown):

- **Prefecture dropdown** — appears on **City** and **Ward** levels. Options are every prefecture (shown as "JP (EN)", e.g., "東京都 (Tokyo)"). Default selection: **東京都 (Tokyo)**. Source of options: the full Prefecture list. Changing it reloads the City list (and, on the Ward level, repopulates the City dropdown with cities of the newly chosen prefecture).
- **City dropdown** — appears on the **Ward** level only. Options are the cities that belong to the currently selected prefecture (shown as "JP (EN)"). Default selection: **渋谷区 (Shibuya)**. Changing it reloads the Ward list. When the prefecture changes, this dropdown resets to the first city of the new prefecture.
- **Railway Line dropdown** — appears on the **Station** level only. Options are every railway line (shown as "JP (EN)"). Default selection: **山手線 (Yamanote Line)**. Source of options: the full Railway Line list. Changing it reloads the Station list.
- On **Prefecture** and **Railway Line** levels the parent-selector bar is hidden entirely (all rows shown).

**Search & filter bar** (present on every level):

- **Search box** — placeholder "Search by name JP or EN...". Filters as you type (real-time), case-insensitive, matching either the Japanese name or the English name.
- **Sync-mode filter dropdown** — three options: "Sync mode: All" (default), "Auto Update", "Manually Locked".
- **Status filter dropdown** — three options: "Status: All" (default), "Google Source", "Manually Edited".
- **Reset button** — "Reset" with an X icon. Clears the search box and sets both dropdowns back to "All", then re-draws.
- **Result count line** — "Showing X of Y entries", where X is the number of rows after search/filter/parent narrowing and Y is the total rows at the current level.

**Data table columns** (left to right):

1. **Name (JP)** — the Japanese label (shown in bold). Editable inline.
2. **Name (EN)** — the English label. Editable inline.
3. **Company** — shown **only on the Railway Line level**. Read-only operator name (e.g., "JR East", "Tokyu"). This column is absent on all other levels.
4. **Status** — a badge: "Google Source" (blue, Google icon) when the row has never been hand-edited, or "Manually Edited" (amber, pen icon) when a label has been overridden.
5. **Sync mode** — a badge: "Auto Update" (green, rotate icon) or "Manually Locked" (gray, lock icon).
6. **Toggle** — a switch that flips the row between Auto Update (on) and Manually Locked (off); the switch shows the word "Auto" or "Locked" beside it. Disabled while a sync is running and while that row is being edited.
7. **Actions** (right-aligned):
   - When not editing: an **Edit** button, plus a **Reset to Google** button that appears only when the row is Manually Edited.
   - When editing that row: a **Save** button and a **Cancel** button (Edit/Reset are replaced).

**Inline edit controls** (appear in the row being edited):

- **Name (JP) input** — pre-filled with the current Japanese label. Required.
- **Name (EN) input** — pre-filled with the current English label. Required.
- **Save** — validates and stores the changes.
- **Cancel** — exits edit mode without saving.

### Modals & Popups

All editing happens inline within the table row (no edit drawer). Confirmations use a **styled in-page confirmation modal** (centered card over a dimmed overlay), not native browser dialogs. The modal has an icon + title row, a message body, and a footer with a **Cancel** button (ghost style) and a confirm button whose label and color vary by action. It can be dismissed by Cancel, by clicking the dimmed backdrop, or by pressing Escape; the confirm button is focused on open. Feedback uses bottom-right toast messages. The only banner is the in-page "Syncing…" notice described above.

The three confirmation modals:

- **Switch level mid-edit** — title "Discard inline edit?", message "You have an unsaved edit. Switch level and discard the edit?", buttons **Cancel** | **Discard** (danger styling). Confirming switches the level and discards the edit; Cancel keeps the edit open on the current level.
- **Reset to Google** — title "Reset to Google data?", message "Reset this label to Google data? Your manual edit will be lost.", buttons **Cancel** | **Reset** (danger styling).
- **Sync from Google Maps** — title "Sync from Google Maps?", message "Sync data from Google Maps? Rows set to Manually Locked will not be updated.", buttons **Cancel** | **Sync** (primary styling).

### Conditional Display

- **Parent-selector bar visibility:**
  - Shown when the level is City, Ward, or Station; hidden for Prefecture and Railway Line.
  - Within the bar, the Prefecture dropdown shows for City and Ward; the City dropdown shows for Ward only; the Railway Line dropdown shows for Station only.
- **Company column:** displayed only when the current level is Railway Line; hidden on all other levels.
- **"Reset to Google" button:** displayed for a row only when that row's Status is "Manually Edited". A pure Google-source row has no Reset button.
- **Edit vs Save/Cancel actions:** Edit (and Reset, if applicable) show when the row is at rest; Save and Cancel show only for the row currently in edit mode.
- **Status badge:** "Manually Edited" shows when the row has been hand-edited; otherwise "Google Source".
- **Sync-mode badge and toggle position:** "Auto Update" / switch ON when sync mode is auto; "Manually Locked" / switch OFF when locked.
- **Disabled-while-syncing:** during a Google sync, the Sync button, the per-row Edit, Reset to Google, and the sync toggle are all disabled.
- **Context label "select a city" variant:** on the Ward level, if no city is available under the chosen prefecture, the header reads "Wards (select a city)".

### User Flows

1. **Switch level.** Admin clicks a level in the left "Levels" panel → the right panel re-draws for that level, search and filters are cleared, and the correct parent-selector dropdowns appear (or hide). If an inline edit is open, the "Discard inline edit?" modal asks whether to discard it first; confirming with Discard switches and drops the edit, Cancel keeps the edit.
2. **Change parent context.** On City, Ward, or Station, admin picks a value in the parent dropdown(s) → the table reloads showing only rows under that parent, and the header context label updates. Changing the prefecture on the Ward level also refreshes the City dropdown and selects the first city of that prefecture.
3. **Search / filter.** Admin types in the search box (filters live by JP or EN name) and/or chooses a Sync-mode and/or Status filter → the table and the "Showing X of Y entries" count update immediately. Reset clears all three controls.
4. **Edit a label → save.** Admin clicks Edit on a row → Name (JP) and Name (EN) become editable inputs (JP focused). Admin changes one or both and clicks Save → the labels update, the row becomes "Manually Edited", its sync mode is forced to "Manually Locked", and a success toast appears. Cancel exits without saving.
5. **Toggle sync mode.** Admin flips the row's toggle → the row switches between Auto Update and Manually Locked immediately, with a confirmation toast naming the row.
6. **Reset to Google.** On a Manually Edited row, admin clicks Reset to Google → the "Reset to Google data?" modal appears → on confirming with Reset, the JP and EN labels revert to the original Google values, Status returns to "Google Source", and sync mode returns to "Auto Update", with a toast.
7. **Run a Google sync.** Admin clicks "Sync from Google Maps" → the "Sync from Google Maps?" modal appears → on confirming with Sync, the Sync button is disabled and the "Syncing…" banner appears for the duration. Every Auto Update row across all five levels is refreshed back to its Google label (and reset to Google Source); every Manually Locked row is skipped. When finished, the banner disappears and a toast reports how many rows were updated and how many were skipped.

### Validation

- **Both names required.** On Save, both Name (JP) and Name (EN) must be non-empty after trimming whitespace. If either is empty, the save is blocked and an error toast appears: "Both Name (JP) and Name (EN) are required."
- **Maximum length 255.** Both Name (JP) and Name (EN) are capped at 255 characters. The inline inputs enforce a `maxlength` of 255, and Save re-checks the trimmed length; if either exceeds 255 the save is blocked and the same error toast appears: "Both Name (JP) and Name (EN) are required."
- **Conflict detection (concurrent edit).** Each row carries a version number captured when editing begins. On Save, the stored copy is re-read; if its version no longer matches the version captured at the start of editing (meaning the record changed elsewhere), the save is aborted with the exact error toast: "This record was updated by another user. Please refresh and try again." The screen then adopts the latest stored data and exits edit mode.

### Empty States

- **Level has no rows at all:** the table body shows "No data available for this level."
- **Rows exist but none match the current search/filters/parent:** the table body shows "No entries match your search or filters."

### Notifications & Feedback

**Confirmation dialogs (styled in-page modals — Cancel + a labeled confirm button):**

- Switching level mid-edit: title "Discard inline edit?", message "You have an unsaved edit. Switch level and discard the edit?", buttons Cancel | Discard (danger).
- Reset to Google: title "Reset to Google data?", message "Reset this label to Google data? Your manual edit will be lost.", buttons Cancel | Reset (danger).
- Sync from Google Maps: title "Sync from Google Maps?", message "Sync data from Google Maps? Rows set to Manually Locked will not be updated.", buttons Cancel | Sync (primary).

**Success toasts (green):**

- After Save: "Label saved. This row is now Manually Locked."
- After toggling to auto: "<English name> set to Auto Update."
- After toggling to locked: "<English name> set to Manually Locked."
- After Reset to Google: "Label reset to Google data."
- After a completed sync: "Sync completed. X rows updated, Y rows skipped (manually locked)." (X and Y are the actual counts.)

**Error toasts (red):**

- Validation failure: "Both Name (JP) and Name (EN) are required."
- Concurrent-edit conflict: "This record was updated by another user. Please refresh and try again."

**Banner (in-page):**

- During sync: "Syncing data from Google Maps. Please wait." (with a spinning icon; visible only while the sync runs).

### Navigation

- This is a leaf screen. There are **no** links out to other screens, no breadcrumb, and no back button.
- The five left-panel "Levels" items act as in-page tabs that swap the right panel's content; they are not separate pages or URLs.
- **Persistence:** all data is stored in the browser under the key **`yuushi.regionMasterData`**. It is an object keyed by level (prefecture, city, ward, railway, station), each holding that level's rows. The data is seeded on first visit and saved after every edit, toggle, reset, and sync, so changes survive page reloads on the same browser. Older saved data missing parent links is repaired on load using defaults (city → 東京都, ward → 渋谷区, station → 山手線).
