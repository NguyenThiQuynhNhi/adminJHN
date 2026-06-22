## New Development Projects

**Purpose:** This screen lets an admin (or an agent) browse, search, review, create, edit, suspend/re-activate, and delete the platform's "new development" real-estate projects (approval/rejection of pending projects is performed on the Property Approval screen) — brand-new buildings being sold before or during construction. Unlike resale listings (handled in Property Management), every project here is a multi-unit development, so each project carries a whole roster of sub-units: Group 5 apartment projects list their unit types as "Floor Plan Types" (Type A, B, C…), and Group 6 house projects list each individual house as a "Lot". The screen is "schema-driven": the same set of detail sections is reused for both groups, but which extra section appears (Floor Plan Types vs Lots) and which fields are required depends on the group. All data is demo/hardcoded; destructive actions are confirmed via a styled in-page confirm modal (not the browser's native pop-up) and then simulated.

**Access:** Admin sidebar → PROPERTY MANAGEMENT → "New Development Projects". The page lives inside the admin shell as an embedded frame; there is no separate URL, no browser back/forward, and the address bar never changes. It can also be reached automatically as a "deep link" from the Property Management module (see Navigation).

---

### Layout & Structure

The screen is one page that shows one of two views at a time, plus the pop-up windows (the Create modal, the Upgrade modal, a reusable styled confirm modal used for every destructive action, the per-unit Mark-as-Sold modal, and the **Advanced Filter modal**), a right slide-out **Change History drawer**, and a toast (small confirmation message) area.

**1. List View (default when the screen opens).** Top to bottom:

- **Page header** — title "New Development Projects" on the left; on the right two buttons: "Export CSV" and "New project".
- **Compact popover filter bar** (replaces the old "Filters" card). A single horizontal bar of controls, left→right: a live **Search** box; a **Buy/Rent dropdown** (All / For Sale / For Rent / Sale + Rent); **Property Type** popover (groups G5: Apartment, Tower Mansion, Resort Apartment & Condo Hotel Unit; G6: House, Resort House & Villa & Ski Chalet); **Region / Station** popover (Region Prefecture→Cities tree + Railway Prefecture→Line→Station tree, OR-combined); **Bedroom** popover (1–5, where 5 = 5+); **Size** popover (From/To m² + presets 0–20 … 100–150); **Price** popover (From/To million yen + presets 0–20 … 300–500); **Publish Status** popover (Pending Review / Published / Rejected / Suspended); **Sale Status** popover (On Sale / Sold Out); **Sort** popover (radio list); and an **Advanced Filter** button (sliders icon). There is no Save-Searches control and no gear. Active filters surface as a **count badge** on each popover button plus a **chips row** below the bar ("{Filter}: {summary}" each with an × to clear, and a "Clear all filters" link). Every popover applies on Apply/Done, on outside-click, and closes on ESC; any change re-filters **both** the Table and Grid views, updates the "Showing …" count, and resets the page to 1. (See Modals & Popups → "Compact popover filter bar" for the full per-popover spec.)
- **Results card** — a header row with the result-count line on the left (reads "Showing {start}–{end} of {total} projects", e.g. "Showing 1–50 of 62 projects"; when there are no matches it reads "Showing 0 projects") and a **Table / Grid view toggle** on the right (pill control, two buttons: "Table" and "Grid"; the active view is highlighted). Below the header, the project list is shown as either a table or a grid of cards depending on the selected view, paginated 50 per page. The toggle swaps the view in place — the active filters/search and the result count apply to both views. The view defaults to **Table** and is remembered for the session. **Pagination** appears below the list (see Pagination).

**2. Project list — Table view** — columns, in this exact left-to-right order:

1. **Project** — a small building/house icon, the project name in bold, and below it the project ID and the romaji (English-spelling) name.
2. **Type** — the property type text.
3. **Transaction** — a badge driven by the project's **Transaction Type** field (Basic Information): For Sale → success (green), For Rent → warning (amber), Sale + Rent → accent/members variant. (No longer hardcoded "For Sale"; missing values fall back to "For Sale".)
4. **Price** — the project's overall price range (or "TBA" if no priced units), shown in short form (e.g. "¥3億 – ¥1.8億" style, or "¥35M").
5. **Address** — "{Prefecture} · {City}".
6. **Agent** — the listing agent's name, or "—" if none. (Note: this column was renamed from "Developer" to "Agent" to match the Property Management list, and the old "Units / Lots" column was removed.)
7. **Status** — the publish-status badge (Pending Review / Published / Rejected / Suspended).
8. **Updated** — the last-updated date, or "—".

Clicking anywhere on a row opens that project's Detail View.

The publish-status badge in both the Table "Status" column and the Grid card uses the same 4-status set (Pending Review → warning, Published → success, Rejected → danger, Suspended → danger), so the two views always stay in sync. The demo seed ships a mix of these statuses (e.g. one Pending Review project and one Rejected project; the Rejected one carries a reject category and notes, surfaced in its detail alert).

**2a. Project list — Grid view** — the same filtered projects shown as a grid of cards (one card per project), mirroring the Property Management (property-list-oversight) grid. Each card has: a thumbnail/icon area (gold tile with the group icon — city for Group 5, house for Group 6) carrying the publish-status badge in the corner; the project name; the project ID plus romaji name; a sub-line "{Prefecture} · {City} • {Type}"; and a facts row with the price range on the left and the sales-status badge on the right. Clicking anywhere on a card opens the **same** Detail View as a table row click. When no projects match the filters, the grid shows "No projects match the filters."

**3. Detail View (opens on row click or grid card click; replaces the List View).** Top to bottom:

- **Sticky detail toolbar** (stays pinned at the top while scrolling):
  - Left side: "Back to list" button, a **mode indicator** pill ("View mode" or, while editing, a highlighted "Edit mode"), a **group badge** showing the group icon plus "Group 5 — New Dev Apartments" or "Group 6 — New Dev Houses", and a **"View change history"** link (clock-rotate-left icon) that opens the Change History drawer.
  - Right side, in View mode: "Edit", a single **Suspend / Re-activate** toggle (shown only for Published or Suspended projects; hidden for Pending Review and Rejected), and "Delete" (always available). There is no "Approve" button on this screen.
  - Right side, in Edit mode (replaces the above): "Cancel", "Save changes".
- **Detail hero banner** — a large tinted card with a building/house icon, the project name as a heading, and a meta row: an ID pill (e.g. "PRJ-1042"), the address, then four badges separated by "·" — sales-status badge, publish-status badge, a **Transaction Type badge** (For Sale / For Rent / Sale + Rent, placed between the publish badge and the members badge), and a members badge ("Open" or a locked "Members Only").
- **Alerts area** — zero or more colored banners (expiry status, pending-review notice, rejected notice) appear here depending on the project (see Conditional Display & Notifications).
- **Detail sections** — a sequence of cards rendered from the schema (see "Schema-driven detail" below).

**Schema-driven detail (sections appear in this order):**

1. Basic Information
2. Project Information
3. Building Details
4. Land Details
5. Highlight Features
6. Amenities / Facilities
7. **Floor Plan Types (Group 5 only)** OR **Lot / Block Details (Group 6 only)** — these two are mutually exclusive; a project shows exactly one of them based on its group.
8. Points of Interest Map
9. Media
10. Description

**Floor-plan types (Group 5 — the "Floor Plan Types" section):** Begins with a gold "price summary" banner (Project Price Range, Area Range, Layout Range, a "Types" count, and a row of chips — one chip per type, sold-out types show a "🚫"). Below the banner is a **row of tabs**, one tab per type (e.g. "Type A", "Type B"…). The active tab is highlighted; sold-out tabs are dimmed and carry a "SOLD OUT" badge; any type that is the 5th-or-later (index ≥ 4, i.e. Type E onward) carries a yellow "🟡" paid marker. In Edit mode an extra dashed "+ Add Type" tab appears at the end. Selecting a tab shows that type's field pane (a grid of all the type's fields plus its own 3D Tour / Videos / Photos line). In Edit mode each pane also shows two buttons at the bottom: "Duplicate this type" and "Delete this type".

**Lots (Group 6 — the "Lot / Block Details" section):** Begins with the same style of price summary banner but labeled for lots (Project Price Range, "Area Range (Total Floor)", Layout Range, a "Lots" count, and a chip per lot). Then each lot is shown as its own **card** (not a tab) stacked vertically. Each card has a header (house icon, the lot name, and an "ON SALE"/"SOLD OUT" badge) and a grid of all the lot's fields plus its own 3D Tour / Videos / Photos line. In Edit mode the card header shows "Duplicate" and a trash (delete) button, and an "+ Add Lot" button appears at the bottom of the section.

**Create modal — group picker:** Opened by the "New project" button. Title "New project — Select group". It shows two clickable cards (see Modals & Popups) — Group 5 and Group 6 — plus a "Cancel" button and an "×" close button.

**Upgrade modal:** A paid-unlock pop-up that appears when an agent tries to add a 5th floor-plan type (see Modals & Popups).

---

### Every Element

**Page header**

- "Export CSV" button (icon: file-export) — triggers a demo CSV export (toast only).
- "New project" button (primary, icon: plus) — opens the Create modal.

**Compact popover filter bar — every control with every option, verbatim** (replaces the old Filters card; full popover behaviour is under Modals & Popups):

- **Search** — a free-text box with a magnifier icon, placeholder "Name, ID, agent, address…". **Live**: typing re-filters immediately and resets to page 1. Matches as a substring against name, romaji name, ID, agent, prefecture, city, chome, and property type.
- **Buy/Rent dropdown** — single-select, between Search and Property Type. Options: "All (Buy/Rent)" (no filter), "For Sale", "For Rent", "Sale + Rent". Filters on the project's **Transaction Type**. Two-way synced with the Advanced modal's Buy/Rent toggle. Applies immediately on change.
- **Property Type** popover — a search box plus grouped checkboxes: "G5 — New Dev Apartments" (Apartment, Tower Mansion, Resort Apartment & Condo Hotel Unit) and "G6 — New Dev Houses" (House, Resort House & Villa & Ski Chalet). "Done" applies + closes.
- **Region / Station** popover — two tabs: "Region" (Prefecture → Cities expandable tree; checking a prefecture auto-checks its cities) and "Railway / Station" (Prefecture → Line → Station tree). Region and Railway selections combine with **OR**. Each tab has its own search box. "Apply" applies + closes.
- **Bedroom** popover — checkboxes 1–5 ("5+" means 5 or more bedrooms; derived from each project's unit/lot bedroom max). "Apply".
- **Size** popover — From/To m² inputs plus preset buttons (0–20, 20–30, 30–40, 40–50, 50–60, 60–70, 70–80, 80–100, 100–150). Filters on the project's max exclusive/floor area. "Done".
- **Price** popover — From/To inputs in **million yen** plus presets (0–20, 20–30, 30–40, 40–60, 60–80, 80–100, 100–150, 150–200, 200–300, 300–500). Overlaps against the project price range. "Done".
- **Publish Status** popover — checkboxes: "Pending Review", "Published", "Rejected", "Suspended". "Apply".
- **Sale Status** popover — checkboxes: "On Sale", "Sold Out". "Apply".
- **Sort** popover — radio list (applies + closes on pick): "Price Low → High", "Price High → Low", "Building Age Newest → Oldest", "Building Age Oldest → Newest", "Upload Date Latest → Oldest", "Last Update Latest → Oldest" (**default**), "Size Largest → Smallest", "Size Smallest → Largest".
- **Advanced Filter** button (sliders icon) — opens the Advanced Filter modal (see Modals & Popups).
- **Active-filter chips row** (below the bar) — one chip per active filter, "{Filter}: {summary}" with an × to remove that filter, plus a "Clear all filters" link that resets everything. Each popover button also shows a count badge when it has active selections.

There is no separate "Reset" / "Apply" button row — applying is automatic per popover / chip; "Clear all filters" replaces the old Reset.

**Results card**

- Live count line: "Showing {start}–{end} of {total} projects" (reflects the current page slice; "Showing 0 projects" when empty).
- A Table / Grid view toggle (defaults to Table; session-remembered).
- The list table (8 columns described above) in Table view, or a grid of project cards in Grid view. Both share the same filtered set and count and are paginated 50 per page. Rows and cards are clickable and open the same Detail View.
- **Pagination bar** below the list (see Pagination).
- Grid cards now use the shared rich property card (`property-card.js`, `window.renderPropertyCard`) instead of the old lightweight `.pcard`. Each project maps onto the card contract: title = project name, price = the same price-range string used in the table ("¥35M – ¥80M" or "TBA"), location = "{Prefecture} · {City}", agent = listing agent (or "—"), type = the apartment type for Group 5 / "House" for Group 6, units = Total Units (when present), area = site/building area (when present), badge = "New Dev · {publish status}", desc = the project description. Clicking a card still calls `showDetail(id)`. The grid lays out with `repeat(auto-fill, minmax(300px, 1fr))` and ~18px gap; the component injects its own CSS.

**Detail toolbar buttons**

- "Back to list" (ghost style, icon: left arrow) — returns to the list (with a discard prompt if editing).
- Mode indicator pill — non-clickable status; reads "View mode" or "Edit mode".
- Group badge — non-clickable; shows the group icon + label.
- "Edit" (icon: edit) — switches the detail into Edit mode.
- **Suspend / Re-activate toggle** (a single button) — its label, style, and visibility depend on the project's publish status: Published → "Suspend" (danger style, icon: ban) which sets status to Suspended; Suspended → "Re-activate" (success style, icon: circle-check) which sets status back to Published; for Pending Review or Rejected projects the button is hidden. (There is no separate "Approve" button — approval/rejection happens on the Property Approval screen.)
- "Delete" (red, icon: trash) — permanently removes the project; always available regardless of status.
- "Cancel" (Edit mode, icon: ×) — discards edits and returns to View mode.
- "Save changes" (Edit mode, primary, icon: check) — saves edits.

**Detail hero**

- Thumbnail icon (city icon for Group 5, house-chimney for Group 6).
- Project name (heading). If a new project has no name, shows "(Unnamed)".
- ID pill, address text, sales badge, publish badge, members badge.

**Detail sections — every section and the fields inside each.**

Field display rules: a red "★" marks a required field (visual only). Money fields show as "¥…"; number/percent fields show formatted; empty values show "—". In View mode, multi-checkbox fields with nothing chosen show "None selected". In Edit mode, fields become inputs/dropdowns/checkboxes.

**Basic Information** (fields in order): Property Name — Japanese ★; Property Name — Romaji ★; Property Type ★ (dropdown — options depend on group, see below); Post Code ★; Prefecture ★ (Tokyo, Osaka, Kanagawa, Kyoto, Hokkaido, Fukuoka, Saitama, Chiba, Aichi, Hyogo); City / Ward ★ (dropdown — options depend on the chosen Prefecture); Chome; Building Name; Unit No.; Map Pin (read-only, shows "📍 Auto-placed"); **Transaction Type ★** (placed near Sales Status; options: **For Sale** (default) / **For Rent** / **Sale + Rent** — drives the list "Transaction" badge and the hero Transaction Type badge); Sales Status ★ (now exactly two options: **On Sale** (default) / **Sold Out**); Building Permit No. ★; Move-in Period (Available Now, Specified Due Date, Consultation); Publish Status (Pending Review, Published, Rejected, Suspended); Members Only (Open for Public, Members Only); Date Published (read-only date); Date Updated (read-only date); Next Update Schedule (date); Special Updates (checkboxes, full width: "Price Reduction", "Price Negotiable"); an inline price-info note; a "(Project Summary)" auto block showing Overall Price Range / Area Range / Layout Range; "Set ALL prices as TBA (Coming Soon)" (Yes/No toggle, full width); Tax (applies to all types) (Tax included, No Tax included).

City options by prefecture (verbatim): Tokyo → Shibuya, Shinjuku, Minato, Setagaya, Chuo, Meguro, Bunkyo, Koto, Shinagawa, Suginami, Taito, Edogawa. Osaka → Osaka, Sakai, Toyonaka, Higashi-Osaka, Suita, Hirakata. Kanagawa → Yokohama, Kawasaki, Sagamihara, Yokosuka, Fujisawa. Kyoto → Kyoto, Uji, Kameoka. Hokkaido → Sapporo, Hakodate, Asahikawa. Fukuoka → Fukuoka, Kitakyushu, Kurume. Saitama → Saitama, Kawaguchi, Tokorozawa, Kawagoe. Chiba → Chiba, Funabashi, Matsudo, Ichikawa. Aichi → Nagoya, Toyota, Toyohashi, Okazaki. Hyogo → Kobe, Himeji, Nishinomiya, Amagasaki.

Property Type options by group: Group 5 → "Apartment", "Tower Mansion", "Resort Apartment & Condo Hotel Unit". Group 6 → "House", "Resort House & Villa & Ski Chalet".

**Project Information** (fields in order): Developer / Seller (売主) ★; **Brokerage Type** (renamed from the old "Transaction Type"; same options: Owner, Agent, Exclusive Brokerage, Exclusive Agency, General Brokerage); Construction Company; Design / Architecture Firm; Management Company; Management Type (Self-management, Partially consigned, Full consignment); Management Association (Yes, No); Total Units (number); Units Available This Phase (number); Expected Sales Start Date (text, placeholder "YYYY-MM-DD or 'Undecided'"); Expected Completion Date ★ (date); Expected Move-in Period (Available Now, Specified Due Date, Consultation); No. of Floors Above Ground (number); No. of Floors Below Ground (number); Site Area (m²) (number); Building Area (m²) (number); Total Floor Area (m²) (number). (There is no longer a fixed expiry info note at the bottom of this section.)

**Building Details** (fields in order): Building Structure (Steel Reinforced Concrete (SRC), Reinforced Concrete (RC), Steel Frame, Wooden); Building Area (m²) (number); Building Area Measurement (Wall-to-Wall, Centre-Line, Actual, Registered); Land Area (m²) (number); Land Area Measurement (Actual Measurement, Registered Area); No. of Floors (number); No. of Units (number); Elevator (Yes/No toggle); Parking / Bicycle Parking (checkboxes, full width: Parallel, Underground garage, Carport, Visitor parking, Bicycle parking, Motorcycle storage, Free parking for 1 car); Form of Management (Self-management, Partially consigned, Full consignment); Manager (Resident, Day shift, Part-time, None); Management Association (Yes, No).

**Land Details** (fields in order): Land Right (Ownership, Freehold, Leasehold, Surface Right); Type of Leasehold Rights (Ordinary Leasehold, Old Law Leasehold, Fixed-Term Leasehold) — only shows when Land Right = Leasehold; Lease Term (text) — Leasehold only; Lease Term Remaining (text) — Leasehold only; Land Rent — Monthly Amount (¥) — Leasehold only; Land Rent — Annual Amount (¥) — Leasehold only; Land Use (Residential, Commercial, Field, Agricultural, Forest, Miscellaneous, Other); Zoning (14 options: First-class low-rise exclusive residential, Second-class low-rise exclusive residential, First-class medium-to-high-rise exclusive residential, Second-class medium-to-high-rise exclusive residential, First-class residential zone, Second-class residential zone, Semi-residential zone, Rural residential zone, Neighbourhood commercial zone, Commercial zone, Semi-industrial zone, Industrial zone, Exclusive industrial zone, Mixed use zone); Land Law Notification (Yes, No); Land Area (m²) (number); Area Measurement Method (Actual Measurement, Registered Area); Building Coverage Ratio (%) (percent); Floor Area Ratio (%) (percent); Road Access (One side, Two sided); Access to Road (text); Road Width (m) (number); City Planning (Urbanization Zone, Urbanization Control Zone, Non-delineated Area, Outside the city planning area, Quasi-Urban Planning Area); Direction of Road (North, South, East, West, NE, NW, SE, SW); Current Land Condition (Vacant Land, With Building, Car Park, Farmland, Field, Mountain, Forest, Wilderness, Hybrid land, Other).

**Highlight Features**: a single full-width checkbox grid (no field label). Options: Pets Allowed, Corner Unit, South Facing, Maisonette, Parking Lot, Bicycle Parking, Garden, Rooftop, Building Concierge (English Speaking), Condominium / Tower Mansion, All-electric, Fully Furnished, Bay Window, Designer Property, Quiet Residential Area.

**Amenities / Facilities**: 9 collapsible accordion panels (the first is open by default; each header shows a count when items are chosen). Panels and their options:

- "🏠 Interior": Flooring, Partial flooring, Underfloor Heating, Cushion floor, Natural material, Staircase, Ceiling fan, Blinds, Shutter, Earthquake-resistant door, Parent-child door, Loft, Pet allowed, Balcony, 2 or more balconies, Roof balcony, Wooden deck, Garden (private garden), Trunk Room.
- "📺 Furniture & Home Appliances": Air conditioner, Fan, Curtain, Blind, Floor heating, Washing machine, Dryer, Lighting, Television, Dining table & chairs, Walk-in closet, Shoe-in closet, Storage, Desk, Other.
- "🍳 Kitchen": Dishwasher, Gas Hob, IH Hob, Microwave, Oven, Refrigerator, Kitchen counter, Sink, Other.
- "🛁 Bath & Toilet": Separate bath and toilet, Dressing room, Sauna, Shower, Washbasin, Bathtub, Other.
- "🔒 Security": Auto-lock, Electronic lock, Double lock key, Key card, Security camera, 24hr emergency call system, Building manager onsite, Security company, Monitored Intercom, Other.
- "🏢 Building Services": Front Desk, Concierge, Garbage disposal, Garbage collection service, Mailbox / Delivery box, EV Charging Facilities, Other.
- "🏋️ Building Facilities": Elevator, Guest Rooms, Kid's Playground, Swimming Pool, Public Bath, Natural Onsen, Gym, Meeting Room, Rooftop Terrace, Theater Room, Lounge, Music Room, Pet allowed, Smoking Area, Gardens, Restaurant, Cafe, Other.
- "📡 TV & Communications": BS terminal, CS, CATV, Fiber Optics, Free Internet.
- "🌱 Environmental Certification": ZEH, ZEH-M, Certified Low-Carbon Housing, Long-Life Housing, Solar Power Generation.
- Plus a full-width free-text field below the panels: "Note for Changes / Renovations".

**Floor Plan Types (Group 5)** — per-type fields, in order, inside each tab pane: (when the type is Sold Out and sale details were captured, an info banner at the top of the pane reads "Sold at ¥{final price} on {date}" plus an optional "Notes: …" line — see Mark-as-Sold below); Type Name ★; Sale Status (On Sale / Sold Out; shown as a badge in View mode, a dropdown in Edit mode); Price Mode (Edit mode only — "Enter price range" or "Price TBD (Coming Soon)"); then the price block — if Price Mode is TBD, a small italic "Price TBD" label above the two price fields, which are shown disabled (no banner); otherwise two side-by-side money fields Selling Price Min (¥) ★ and Selling Price Max (¥) ★; a computed "Price per m²" line (only shown when both a min price and min area exist); Layout (1K, 1R, 1DK, 1LDK, 1SLDK, 2DK, 2LDK, 2SLDK, 3DK, 3LDK, 3SLDK, 4DK, 4LDK, 4SLDK, 5DK, 5LDK, 5SLDK, 6LDK+); Units of This Type (number); Exclusive Area Min (m²) ★; Exclusive Area Max (m²) ★; Area Measurement Method (Wall-to-Wall, Centre-Line, Actual, Registered); Balcony Area (m²); Roof Balcony Area (m²); Private Garden Area (m²); Floor Location — From (number); Floor Location — To (number); Balcony Direction (8 directions); Bedrooms; Bathrooms; Toilets; Study / Den; Storage Rooms; Walk-in Wardrobes; Shoe-in Cabinets; Monthly Management Fee (¥); Monthly Repair Reserve (¥); Lump-sum Repair Reserve (¥); Management Association Fee (¥); Ground Rent (¥); Estimated Monthly Income (¥); Estimated Annual Income (¥); Estimated Gross Yield (%); Remarks (free text). Then a media line: 3D Tour (link, opens in a new tab), Videos ("N file(s)"), Photos ("N photo(s)"). Edit-mode buttons: "Duplicate this type", "Delete this type".

**Lot / Block Details (Group 6)** — per-lot fields, in order, inside each lot card: (card header) Lot name (editable text in Edit mode) + ON SALE/SOLD OUT badge; (when the lot is Sold Out and sale details were captured, an info banner under the header reads "Sold at ¥{final price} on {date}" plus an optional "Notes: …" line — see Mark-as-Sold below); Sale Status (Edit-mode dropdown: On Sale / Sold Out); Price TBD (Edit-mode Yes/No toggle); then the price block — if Price TBD is on, a banner "Price TBD", otherwise Selling Price (¥) ★; a computed "Price per m²" line (only when both a price and a total floor area exist); Layout (same list as above); Total Floor Area (m²) ★; Land Area per Lot (m²) ★; Area Measurement Method; Balcony Area (m²); Roof Balcony Area (m²); Private Garden Area (m²); Floor Location (number); Balcony Direction (8 directions); Bedrooms; Bathrooms; Toilets; Study / Den; Storage Rooms; Walk-in Wardrobes; Shoe-in Cabinets; Monthly Management Fee (¥); Monthly Repair Reserve (¥); Lump-sum Repair Reserve (¥); Management Association Fee (¥); Ground Rent (¥); Road Access (per lot) (One side / Two sided); Land Right (per lot) (Ownership, Freehold, Leasehold, Surface Right); Building Structure (per block) (SRC, RC, Steel Frame, Wooden); Parking Space (text); Bicycle Parking (Yes/No toggle); Est. Monthly Income (¥); Est. Annual Income (¥); Est. Gross Yield (%); Remarks. Then a media line: 3D Tour (link), Videos ("N file(s)"), Photos ("N photo(s)"). Edit-mode buttons in the card header: "Duplicate", trash/delete.

**Points of Interest Map** — header label "📍 Points of Interest (within 5 km · auto-detected)" with a "Locate POIs" button (becomes "Re-locate POIs" once located). When located, shows a green confirmation line ("N POIs found within 5 km · Located {timestamp} · 📍 {address}") and category cards for: Metro / Bus Station, Supermarket, School, Park, Hospital — each listing place names with distance and "· N min walk".

**Media** — a line with: 3D Tour (a link in View mode; in Edit mode a text box with placeholder "Paste Matterport / 360 link"); Videos ("N file(s)"); Photos ("N photo(s)"). Below, a photo gallery of up to 8 placeholder tiles (the first tile labeled "Cover"); if more than 8 photos exist, an extra tile reads "+N more".

**Description** — a single full-width free-text area, label "Description (max 200 words)".

**Status badges and what triggers them:**

- Sales status badge: "On Sale" (success style) or "Sold Out" (danger style) — the only two options. Set by the project's Sales Status field; shown in the detail hero.
- Publish status badge: "Pending Review" (warning style), "Published" (success style), "Rejected" (danger style), "Suspended" (danger style). Shown in the list "Status" column (both Table and Grid views) and the hero. Changed by the Suspend / Re-activate toggle or by saving an edit to Publish Status; newly created projects default to "Pending Review". (Approval/rejection itself is handled on the Property Approval screen, not here.)
- Members badge: "Members Only" (locked) vs "Open" — driven by the Members Only field.
- Per-type / per-lot badge: "ON SALE" (success style) or "SOLD OUT" (danger style), driven by each type's/lot's Sale Status.

---

### Modals & Popups

**Create modal — "New project — Select group".** Opened by the "New project" header button (or automatically via the deep-link flow). Contains two large clickable cards:

- **Group 5 card** — city icon, bold "Group 5 — New Dev Apartments", a green "Buy only" badge, and type tags: "Apartment", "Tower Mansion", "Resort Apartment & Condo Hotel Unit", and a highlighted tag "★ Floor Plan Types (up to 4 free, more = paid)". Clicking it creates a new Group 5 project and opens it in Edit mode.
- **Group 6 card** — house icon, bold "Group 6 — New Dev Houses", a green "Buy only" badge, and type tags: "House", "Resort House & Villa & Ski Chalet", and a highlighted tag "★ Per Lot / Block (unlimited, no paywall)". Clicking it creates a new Group 6 project and opens it in Edit mode.
- Footer "Cancel" button and an "×" close button — both just close the modal.

**Upgrade modal — "🟡 Paid — Unlock more Floor Plan Types".** Appears only when an agent clicks "+ Add Type" on a Group 5 project that already has 4 types. Body text: "Standard plan includes up to 4 Floor Plan Types (A–D)." / "Upgrade to add Type E and beyond. Additional types are billed monthly per project." Footer: "Cancel" (closes without adding) and "Confirm upgrade" (icon: unlock) which closes the modal and adds the new type (auto-named with the next letter, e.g. the 5th type = "Type E"). An "×" close button is also present.

**Mark-as-Sold modal (per-unit).** A styled pop-up that appears at Save time whenever an individual Floor Plan Type (G5) or Lot (G6) was just switched to "Sold Out" in this edit session (and no sale details exist yet). Title: "Mark {Type/Lot name} as Sold?". Fields: **Final Sale Price (¥)** (required, red `*`), **Sold Date** (required, red `*`, defaults to today), **Notes** (optional free text). Footer: "Cancel" and "Confirm Sale" (danger/red). Inline validation: if the price is empty/≤0 or the date is blank, a small red error message shows under the offending field and the modal stays open. Four close methods (× / Cancel / backdrop / ESC) all dismiss it; dismissing **skips** capturing details for that unit (the unit stays Sold Out but with no sale data). On "Confirm Sale", the unit stores `finalSalePrice`, `soldDate`, `soldNotes`, an info banner appears in its pane/card ("Sold at ¥{price} on {date}" + Notes), and a toast fires. If several units were flipped to Sold Out in the same save, the modal is shown once per unit in sequence. This does **not** auto-suspend the parent project.

**Project Sold-Out confirm.** When the admin sets the **project-level** Sales Status to "Sold Out" and clicks Save, the reusable confirm modal opens with title "Mark entire project as Sold Out?" / body "This will auto-suspend the project from the Client Portal. Confirm only when all units are sold or the project is no longer for sale." / buttons "Cancel" and "Confirm" (danger). There is **no** price/date prompt at project level. On Confirm: Sales Status is set to "Sold Out" and Publish Status is auto-set to "Suspended" (one atomic action); toast "Project marked as Sold Out and suspended." If dismissed by any of the four close methods, the project-level Sales Status is reverted to its pre-edit value and the rest of the save proceeds normally (no suspend).

**Confirm modal (styled).** A single reusable confirmation pop-up replaces every browser-native confirm dialog. It is a white card on a dark scrim with: a header (the question as a title, plus an "×" close button), a one-line body, and a footer with a "Cancel" button and a single coloured action button (danger/red for destructive actions, success/green for re-activate). It can be dismissed four ways: the "×" button, the "Cancel" button, clicking the dark backdrop, or pressing the ESC key — all of which cancel without performing the action. Only the action button performs the action. It is used for: discard-on-Back-to-list, discard-on-Cancel, Suspend, Re-activate, Delete project, Delete floor-plan type, and Delete lot (exact titles/bodies listed under Notifications & Feedback).

**Compact popover filter bar (PART B).** The list filters live in lightweight popovers anchored to each bar button (Property Type, Region/Station, Bedroom, Size, Price, Publish Status, Sale Status, Sort) plus the inline Search box and Buy/Rent dropdown. Behaviour shared by every popover: opening one closes any other; clicking the panel itself does not close it; each has four ways to commit/close — its "Apply"/"Done" button (commits + closes), an **outside click** (commits + closes), and **ESC** (closes). The Sort popover commits the instant a radio is chosen and closes. Applying any popover re-filters both Table and Grid views, refreshes the "Showing …" count, updates the per-button count badges and the chips row, and resets to page 1. Region/Railway use expandable trees (caret toggles); checking a prefecture in the Region tree auto-checks all its cities. Size/Price preset buttons fill the From/To inputs. The chips row shows active filters as removable chips with a "Clear all filters" link (= full reset).

**Advanced Filter modal (PART C) — "Filter".** Opened by the bar's "Advanced Filter" button. A centred-title modal (~680px) with an "×" close, a scrolling body of stacked sections (dividers between), and a sticky footer with "Clear filters" (ghost, left — resets the modal's fields without closing) and "Search" (gold, right — writes everything back to the shared filter state, syncs the compact bar, closes, applies, and resets to page 1). Sections, in order: 1) Search location (text); 2) Buy/Rent toggle (Buy / Rent segment, default Buy, two-way synced with the compact Buy/Rent dropdown); 3) Property type (2-col, G5 + G6); 4) Region / Station (Region + Railway tabs with trees); 5) Bedroom / Floor Plan (2-col: 1R/1K, 1DK/1LDK, 2K/2DK/2LDK, 3K/3DK/3LDK, 4K/4DK/4LDK, 5K/5DK/5LDK and over); 6) Yield (No limit / 3% or more / 5% / 10% / 15% / 20% or more — radio); 7) Price (0–10M / 10–50M / 50–100M / 100–200M / 200–300M / 300–500M / 500M–1B / Over 1B — checkboxes that fill the range); 8) Price Range (custom No Min / No Max, ¥M); 9) Land Area ("Land Area (for building, land, parking lot)": 0–50 / 50–100 / 100–150 / 150–200 / 200–500 / Over 500 m² + Min/Max); 10) Publish Status; 11) Sale Status; 12) **Developer** (free text "Developer name"); 13) **Completion Date** (From/To date pickers). The modal closes four ways (× / backdrop / ESC / — and the footer "Search" closes on apply); state is two-way synced with the compact bar.

**Toast messages** — small confirmation pop-ups appear bottom-right and auto-dismiss after a couple of seconds (see Notifications & Feedback).

**Change History drawer (PART A).** A right slide-out drawer (~520px, dark backdrop) opened by the detail toolbar's "View change history" link. Header "Change History — {project ID}" + an "×" close, subtitle "Full edit log for this project". A drawer filter bar with two selects: **Actor** (All actors / Agent only / Admin only) and **Field** (All fields / one option per distinct field present in this project's log). Body lists the project's `changeHistory` newest-first; each row shows the timestamp ("YYYY-MM-DD HH:MM") · actor name + a role badge (Admin / Agent) · the field label · and "Old → New" (long-text fields such as Description/Notes render as "(Text modified)"). Paginated 50 per page (prev/next when needed). Empty state: "No changes recorded yet for this project." Footer has a "Export change log to CSV" button (fires a toast only). Closes three ways: the "×", a backdrop click, or ESC.

---

### Pagination

- Both the Table view and the Grid view are paginated at **50 projects per page**.
- A pagination bar renders below the list: a previous/next chevron pair plus numbered page buttons (with "…" ellipses for large gaps); the current page is highlighted, and the prev/next buttons are disabled at the first/last page. Clicking a page button switches the page and scrolls to the top.
- The bar is **hidden** when the result set fits on one page (≤ 50 results).
- The result-count line reflects the current slice: "Showing {start}–{end} of {total} projects".
- The page **resets to page 1** whenever filters are applied, filters are reset, the Table/Grid view is toggled, or the page is reloaded. The current page is **preserved** while opening a project's Detail View / any modal and returning to the list (returning does not re-render the list, so you stay on the same page).
- The demo seed ships **62 projects** (2 hand-authored + 60 deterministic filler), so two pages exist out of the box.

---

### Conditional Display

**Group 5 vs Group 6 — section differences:**

- Group 5 projects show the **Floor Plan Types** section (tabbed unit types) and never the Lots section.
- Group 6 projects show the **Lot / Block Details** section (stacked lot cards) and never the Floor Plan Types section.
- All other sections (Basic, Project Info, Building, Land, Highlights, Amenities, POI, Media, Description) appear for both groups.

**Group 5 vs Group 6 — field differences:**

- "Property Type" dropdown options differ by group (apartment-style vs house-style; listed above).
- Floor Plan Type panes (G5) and Lot cards (G6) have different field sets: G5 has "Units of This Type", "Floor Location — From/To"; G6 has single "Floor Location", plus lot-specific fields "Land Area per Lot (m²)", "Road Access (per lot)", "Land Right (per lot)", "Building Structure (per block)", "Parking Space". G5 controls the price block via a "Price Mode" dropdown (range vs TBD); G6 controls it via a "Price TBD" toggle.
- The price-summary banner is labeled "Area Range" for G5 and "Area Range (Total Floor)" for G6, with a "Types" count vs a "Lots" count.

**Value-dependent shows:**

- **Leasehold fields** — Type of Leasehold Rights, Lease Term, Lease Term Remaining, Land Rent — Monthly Amount, Land Rent — Annual Amount appear only when "Land Right" = "Leasehold". Changing Land Right in Edit mode immediately shows/hides them.
- **Price block (per type / per lot)** — switches between the price input(s) and a "Price TBD" banner depending on the type's Price Mode (G5) or the lot's Price TBD toggle (G6).
- **"Price per m²"** computed line — appears only when both a price and the relevant area are filled in.
- **Mode-dependent controls** — Edit / Suspend-or-Re-activate toggle / Delete show in View mode; Cancel/Save show in Edit mode. The Suspend/Re-activate toggle itself is further conditioned on publish status (visible only for Published or Suspended; hidden for Pending Review and Rejected). "Sale Status" and "Price Mode" appear as dropdowns only in Edit mode (badges in View mode). "+ Add Type" / "+ Add Lot" / Duplicate / Delete buttons appear only in Edit mode.
- **Paid marker** — the 5th-and-later floor-plan tab (Type E onward) shows a "🟡" badge; sold-out tabs/cards are dimmed/badged.
- **Alerts** — expiry, pending-review, and rejected banners appear conditionally (see Notifications & Feedback). A Pending Review project shows a warning banner; a Rejected project shows a danger banner with the reject reason (and notes if present).
- **POI content** — category cards and the located-summary line only appear after "Locate POIs" has been run; otherwise an empty state shows.
- Changing Property Type, Land Right, Type of Leasehold, Prefecture, or Sales Status while editing re-renders the detail (so dependent options/fields update immediately).

---

### User Flows

**Filter via the compact bar:** Open the screen → type in Search (live), pick Buy/Rent, and/or open any popover (Property Type, Region/Station, Bedroom, Size, Price, Publish Status, Sale Status, Sort) and choose values → Apply/Done (or click outside) commits it. Each change re-filters both views, updates the "Showing {start}–{end} of {total} projects" count line and pagination, refreshes the chips row and per-button badges, and resets to page 1. Remove a single filter via its chip's ×, or "Clear all filters" to reset everything.

**Advanced filtering:** Click "Advanced Filter" → set location, Buy/Rent, property type, region/station, bedroom/floor plan, yield, price (presets or custom range), land area, publish/sale status, **Developer**, and **Completion Date** range → "Search" applies all of it, syncs the compact bar, closes, and resets to page 1. "Clear filters" empties the modal's fields without closing.

**Open a project's detail:** Click any row → the Detail View opens at the top, in View mode.

**Edit and save:** In a project detail, click "Edit" → the mode pill turns to "Edit mode" and fields become inputs → make changes → click "Save changes". Before the save completes, two conditional prompts may fire: (1) for any Floor Plan Type / Lot that was just flipped to "Sold Out", the **Mark-as-Sold** modal opens (once per such unit) to capture Final Sale Price, Sold Date, and Notes; (2) if the **project-level** Sales Status was changed to "Sold Out", the **project Sold-Out confirm** opens (confirming auto-suspends the project). After any prompts resolve, the project's "Date Updated" is set to today, the list refreshes, and a "Changes saved." toast appears. Clicking "Cancel" instead (or "Back to list" while editing) prompts to discard changes.

**Mark a unit as sold:** In Edit mode, set an individual Floor Plan Type's or Lot's Sale Status to "Sold Out" → click "Save changes" → the Mark-as-Sold modal opens → enter Final Sale Price (required) and Sold Date (required, default today), optionally Notes → "Confirm Sale". The unit now shows a "Sold at ¥{price} on {date}" banner (with Notes if given) and a toast confirms. This does **not** suspend the parent project. Dismissing the modal leaves the unit Sold Out but without captured sale details.

**Mark the whole project as Sold Out:** In Edit mode, set the project-level Sales Status (Basic Information) to "Sold Out" → "Save changes" → confirm the "Mark entire project as Sold Out?" dialog → the project becomes Sold Out and is auto-suspended (Publish Status → Suspended) in one step; toast "Project marked as Sold Out and suspended." Dismissing the dialog reverts Sales Status and saves without suspending.

**Create a project in a group:** Click "New project" → the group picker opens → click the Group 5 or Group 6 card → a new project is created (with a random ID, agent "(unassigned)", Sales Status "On Sale", Pending Review publish status, defaults filled, completion date set 12 months out, and an empty Floor Plan Types or Lots list) and opens immediately in Edit mode for you to fill in.

**Add / duplicate / delete a floor-plan type (Group 5, in Edit mode):**

- Add: click "+ Add Type". If fewer than 4 types exist, a new type is added straight away (named "Type A", "Type B"…). If 4 already exist, the Upgrade modal opens; confirming it adds the next type (e.g. "Type E") with the paid marker.
- Duplicate: open a type's tab → "Duplicate this type" → a copy is inserted right after, named "{name} (copy)", and selected.
- Delete: "Delete this type" → confirm → the type is removed and the active tab adjusts.

**Add / duplicate / delete a lot (Group 6, in Edit mode):**

- Add: "+ Add Lot" → a new lot ("Lot N") is added; no paywall ever.
- Duplicate: the lot card's "Duplicate" button → a copy named "{name} (copy)" is inserted right after.
- Delete: the lot card's trash button → confirm → the lot is removed.

**Suspend / re-activate / delete a project (View mode):**

- Suspend (shown only when Published) → confirm → publish status becomes "Suspended"; list refreshes (Table and Grid); toast "Project suspended."
- Re-activate (shown only when Suspended) → confirm → publish status becomes "Published"; toast "Project re-activated."
- (For Pending Review or Rejected projects the toggle is hidden; approval/rejection is done on the Property Approval screen.)
- Delete → confirm → the project is removed from the list and you return to the List View; toast "Project deleted."

**Locate points of interest:** In the POI section, ensure Prefecture and City are set → click "Locate POIs" → nearby places (stations, supermarkets, schools, parks, hospitals within 5 km) are generated and displayed with distances; a toast confirms the count. The button then reads "Re-locate POIs" for re-running after address edits.

**Deep-link from Property Management:** If the Property Management module sends the user here intending to create a new development, the screen reads that intent on load and automatically opens the create flow for the requested group (see Navigation).

---

### Validation

Required markers ("★") on the detail fields are visual only — "Save changes" does not block on empty required fields, and creating a project does not require any field to be filled. Number fields accept numeric entry (blank stays blank); checkboxes store on/off; multi-select checkbox groups add/remove their value. No format checks, no uniqueness checks on the detail form.

The **one place with enforced validation** is the per-unit **Mark-as-Sold modal**: Final Sale Price (required, must be > 0) and Sold Date (required) — if either is missing the modal shows an inline red error under the field and will not confirm until both are valid. (Required markers there use a red `*`.)

Exact error messages: "Final Sale Price is required." / "Sold Date is required." (inline in the Mark-as-Sold modal). The only error-styled toast anywhere is the POI "Set Prefecture & City first, then click Locate POIs." — listed under Notifications & Feedback.

---

### Empty States

- **Project list (no matches):** "No projects match the filters." (shown in the table body in Table view, or in the grid area in Grid view; the count line reads "Showing 0 projects").
- **Floor Plan Types (Group 5, none defined):** "No Floor Plan Types defined. Click + Add Type to begin." In Edit mode an "+ Add Type" button appears below it.
- **Lots (Group 6, none defined):** "No lots defined yet." In Edit mode an "+ Add Lot" button appears below it.
- **Points of Interest (not yet located):** "No POIs located yet." followed by the sub-text "Click Locate POIs above to auto-fetch nearby Metro / Bus Station, Supermarket, School, Park and Hospital within 5 km of the project address."
- **Media (no photos):** the photo gallery simply does not render (only the 3D Tour / Videos / Photos line shows).
- **Multi-checkbox fields with nothing chosen (View mode):** "None selected".

---

### Notifications & Feedback

**Toasts (auto-dismiss):**

- "Changes saved." — after Save changes.
- "Project suspended." — after suspending (status → Suspended).
- "Project re-activated." — after re-activating (status → Published).
- "Project deleted." — after confirming Delete (red/error styling).
- "Exported {N} projects to CSV." — after clicking Export CSV.
- "{Type/Lot name} marked as Sold at ¥{price} on {date}." — after confirming a per-unit Mark-as-Sold prompt at Save time.
- "Project marked as Sold Out and suspended." — after confirming the project-level Sold-Out dialog (sets Sales Status = Sold Out + Publish Status = Suspended atomically).
- "Set Prefecture & City first, then click Locate POIs." — error toast when Locate POIs is clicked without prefecture/city.
- "Located {N} POIs within 5 km from {address}." — after a successful Locate POIs.

**Confirmation dialogs (styled confirm modal — title + body, with a Cancel button and one coloured action button), exact text:**

- Title "Discard unsaved changes?" / body "Your edits will be lost if you leave now." / action "Discard" (danger) — when clicking "Back to list" while in Edit mode.
- Title "Discard changes?" / body "Your edits in this session will be lost." / action "Discard" (danger) — when clicking "Cancel" in Edit mode.
- Title "Suspend project?" / body "Suspend {ID} ({Name})? The project will be hidden from public view until re-activated." / action "Suspend" (danger) — Suspend (Published → Suspended).
- Title "Re-activate project?" / body "Re-activate {ID} ({Name})? The project will be visible publicly again." / action "Re-activate" (success) — Re-activate (Suspended → Published).
- Title "Delete project?" / body "Permanently delete {ID} ({Name})? This cannot be undone." / action "Delete" (danger) — Delete project.
- Title "Delete floor-plan type?" / body "Delete \"{type name}\"? This cannot be undone." / action "Delete" (danger) — Delete a floor-plan type.
- Title "Delete lot?" / body "Delete \"{lot name}\"? This cannot be undone." / action "Delete" (danger) — Delete a lot.
- Title "Mark entire project as Sold Out?" / body "This will auto-suspend the project from the Client Portal. Confirm only when all units are sold or the project is no longer for sale." / action "Confirm" (danger) — project-level Sold Out at Save time (Confirm → Sales Status = Sold Out + Publish Status = Suspended; dismiss → revert Sales Status, no suspend).

(Plus the separate **Mark-as-Sold** modal described under Modals & Popups, which has its own Final Sale Price / Sold Date / Notes fields and a "Confirm Sale" action — not a plain confirm.)

Each of these dialogs can be dismissed (cancelled) four ways: the "×" button, "Cancel", a backdrop click, or the ESC key. The action runs only when the coloured action button is clicked.

**Inline alert banners (in the detail Alerts area / sections), exact text:**

- (Danger, when the listing has passed its expiry date) "EXPIRED — listing expired on {date}. Update Completion Date if the project is delayed."
- (Warning, when 30 or fewer days remain) "EXPIRY WARNING — {N} days remaining. Listing expires on {date} (Completion {date} + 365 days). Update completion date if the project is delayed."
- (Info, otherwise) "Listing auto-expires on {date} (Completion {date} + 365 days). {N} days remaining."
- (Warning, when publish status is Pending Review) "This project is awaiting approval. Open Property Approval to approve or reject it."
- (Danger, when publish status is Rejected) "This project was rejected. Reason: {reject category}. {reject notes, if any}"
- (Per type, when Price Mode = TBD) a small italic "Price TBD" label above the disabled price inputs (no banner).
- (Info, per lot, when Price TBD is on) "Price TBD".

(Removed in this revision: the all-prices-TBA alert, the Project-Information expiry info note, the per-type "Price TBD … price inputs disabled." banner, the top-of-Lots info banner, the POI footer note, and the Upgrade-modal info note. The data-driven expiry / pending-review / rejected alerts above are unchanged. No "(demo)" text remains anywhere on the screen.)

---

### SRS notes for BA / Business rules

**Sale Status (project level).** A project's Sales Status is now a strict two-state value: **On Sale** (default for new and migrated projects) or **Sold Out**. The legacy "Pre-sale Announcement" and "Phased Release" states were retired; on load, any project still carrying a legacy value is migrated to "On Sale" (seed migration). Hero/list badge mapping: On Sale → success (green), Sold Out → danger (red).

**Per-unit Sale Status (Floor Plan Type / Lot).** Independent of the project-level status, each Floor Plan Type (G5) and each Lot (G6) keeps its own On Sale / Sold Out status (unchanged schema). A project can be On Sale while some of its units are individually Sold Out.

**Per-unit Final Sale Price capture (Mark-as-Sold).** When an individual unit transitions to Sold Out (in Edit mode) and the admin saves, the system must capture sale details for that unit: **Final Sale Price (¥)** (required), **Sold Date** (required, defaults to today), **Notes** (optional). These persist on the unit object as new fields `finalSalePrice`, `soldDate`, `soldNotes`, and surface as a "Sold at ¥{price} on {date}" record (plus Notes) in that unit's pane/card. Capturing a unit sale does **not** change the parent project's Sales Status or Publish Status — units sell independently. Business intent: record the actual transacted price per unit for reporting/audit, separate from the listed price range.

**Project-level Sold Out → auto-suspend.** Marking the **whole project** Sold Out is a deliberate, confirmed action with portal-visibility consequences: on confirm, the project's Sales Status becomes Sold Out **and** its Publish Status is atomically set to Suspended, which removes it from the Client Portal. No price/date is captured at the project level (that lives at the unit level). Rationale: a fully-sold or withdrawn development should no longer be publicly listed. The admin can later Re-activate (Suspended → Published) from the detail toolbar if needed; re-activation does not change Sales Status.

**Change history (drawer now built — PART A).** Every project carries a `changeHistory` array of audit entries `{ts, actorId, actorName, role, field, oldVal, newVal}` (seed ships 3–5 per project). The detail toolbar's "View change history" link opens a right slide-out drawer titled "Change History — {project ID}" that lists entries newest-first, filterable by Actor (All / Agent only / Admin only) and Field (distinct fields), paginated 50/page, with an "Export change log to CSV" (toast only) and an empty state. Long-text fields (Description, Notes, etc.) render as "(Text modified)". BA note: future writes should append an entry whenever a tracked field (publish status, sales status, transaction type, brokerage type, per-unit sale status, completion date, etc.) changes, recording who (actor + role) and the before/after values.

**Brokerage Type vs Transaction Type (schema fix).** The Project Information field formerly labelled "Transaction Type" (options Owner / Agent / Exclusive Brokerage / Exclusive Agency / General Brokerage — describing the brokerage relationship) is now labelled **"Brokerage Type"** (schema key `txTypeProject` is unchanged; only the displayed label changed). A genuinely new field **"Transaction Type"** (schema key `transactionType`) was added to Basic Information with options **For Sale** (default) / **For Rent** / **Sale + Rent**, required. It is the deal type and now drives both the list "Transaction" column badge (For Sale → success, For Rent → warning, Sale + Rent → accent) and the new hero Transaction Type badge, and is filterable via the compact bar's Buy/Rent dropdown and the Advanced modal's Buy/Rent toggle. The demo seed mixes the values roughly 80% For Sale / 10% For Rent / 10% Sale + Rent (each value present on ≥5–6 projects).

**Pagination & scale.** The list is paginated at 50/page across both views; the demo seed is padded to 62 projects so the behaviour is visible. No server-side paging — all filtering/paging is client-side over the in-memory set.

---

### Navigation

- **Entry:** Admin sidebar → PROPERTY MANAGEMENT → "New Development Projects". The screen is embedded in the admin shell; the address bar never changes and there is no browser-history navigation.
- **In-screen navigation:** Row click or grid card click → Detail View; Table/Grid toggle swaps the list view in place; "Back to list" → List View; floor-plan-type tabs switch panes; amenity accordions expand/collapse. These are all in-page swaps, not page loads.
- **Deep-link IN (from Property Management):** When Property Management hands off to "create a new development of group 5 or 6", it writes the chosen group into browser storage under the key **`yuushi.autoCreateGroup`** (value 5 or 6, in `localStorage`). On load, this screen reads that key; if it is 5 or 6, it clears the key and automatically opens the create flow for that group (effectively the same as clicking the matching group card). This is the only persistence used.
- **Navigation OUT (reverse link):** A function exists to return to the Property Management module (target "property/property-list-oversight.html") by pointing the shell's content frame at that page and highlighting its sidebar item. It is defined but not wired to any visible button on this screen.
- **Persistence note:** Aside from the one-time `yuushi.autoCreateGroup` handoff key (`localStorage`) and the Table/Grid view preference (`sessionStorage`, key `prj.view`), nothing is persisted — no edits, filters, created projects, captured unit sales, or the current page survive a reload. POI results, edits, and new projects live only in the current page session.
- **External links:** 3D Tour links (Matterport / 360 URLs) open in a new browser tab.

---

### Visual Design

The screen uses the unified YUUSHI gold/white design system, driven entirely by CSS custom-property tokens (page background a light grey, white cards with warm off-white sub-surfaces, a muted gold primary accent for primary buttons / active states / icons, and warm neutral borders). Status badges, alert banners, and per-type/per-lot sale badges are themed by meaning using shared status tokens: success (Published / On Sale / Yes), warning (Pending Review / Pre-sale / Phased / paid markers), danger (Rejected / Suspended / Sold Out / No / expired), and neutral (fallback). Buttons use a solid gold primary, with outlined success/danger variants for the Suspend (danger) / Re-activate (success) toggle and Delete (danger); toasts are a dark pill (success vs error styling); modals — including the reusable confirm modal — are white cards on a dark scrim, with the confirm modal's action button reusing the same danger/success button tokens. This is a presentation-only layer — it does not change any fields, options, logic, validation, navigation, or persistence described above.
