## Property Management

**Purpose:** The central admin oversight screen for every property listing on the real-estate platform. Admins use it to browse all listings (Groups 1/2/3 are managed in this page; New-Development Groups 5/6 also appear in the grid but are handed off to a separate Project Management page), filter and search them, open a schema-driven detail view whose sections change depending on the property's "group", edit any field inline, and run lifecycle actions (Suspend / Re-activate / Delete). Approval/rejection of a Pending Review listing is NOT performed here — it is handed off to the separate Property Approval module; this screen only edits, suspends/re-activates and deletes. Creating a new property starts by picking a group from a modal. All data is hardcoded demo content; destructive actions are stubbed (a styled confirm modal + toast — no native browser dialogs).

**Status model (4 statuses):** Every listing has one publish status from this set — **Pending Review** (new listing awaiting moderation; badge = warning variant), **Published** (live/public; badge = success variant), **Rejected** (declined in moderation; badge = danger variant), **Suspended** (was live, now hidden from public until re-activated; badge = danger variant). The legacy "Draft" and "Private" statuses are no longer used in the admin view.

**Sale Status (separate axis):** In addition to the publish status, every Group 1/2/3 listing carries a **Sale Status** with exactly two values — **On Sale** (default; badge = success variant) and **Sold Out** (badge = danger variant). Sale Status is independent of publish status, but the two are coupled by the mark-as-sold rule: marking a listing Sold Out **auto-suspends** it (publish status → Suspended), and re-activating a Sold-Out listing clears the sale and resets Sale Status to On Sale (publish status → Published). See "Mark-as-Sold flow" under User Flows and the "SRS notes for BA / Business rules" section at the end.

**Access:** Admin sidebar → PROPERTY MANAGEMENT → "Property Management". The screen loads inside the admin shell's content frame. There is no URL change while navigating between the list and detail views (everything happens by showing/hiding sections in the same page).

**Design system:** Re-skinned to the unified YUUSHI gold/white design system. Tokenized palette: page background `#f5f5f5`; white cards (`#ffffff`) with warm cards (`#fffaf2`) for the hero, accordions, group-picker hover and POI panels; gold accent `#8B7340` (hover `#6d5a32`, light `#c9a85c`); muted text `#7a6a5c`; default borders `#e0e0e0`. The system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) is applied to the body. All badges, alerts, button variants and the mode pill use the shared status variants (success / warning / danger / neutral) plus the accent/members variant — see badge descriptions below, which name variants by status rather than color. Buttons map to primary / secondary / cancel / danger / warning / success styles. Shared radii (`--r-sm/md/lg/full`) and shadow tokens are used throughout. This was a re-skin only; no business logic, event handlers, demo seed data, or persistence keys changed.

---

### Layout & Structure

The screen has two top-level views that swap in place (only one visible at a time), plus a create modal and a toast area.

**1. List view (default on load)**

- **Page header:** title "Property Management" on the left; on the right two buttons — "Export CSV" and "New property" (primary, opens the create modal).
- **Compact popover filter bar** (a single card, no "Filters" title) containing, left → right: a live **Search** box, a **Buy/Rent** dropdown, then popover-trigger buttons for **Property Type**, **Region/Station**, **Bedroom**, **Size**, **Price**, **Publish Status**, **Sale Status**, **Sort**, and an **Advanced Filter** button. Each filter that has an active selection shows a small count badge on its button (and the button is highlighted). Below the bar is an **active-filter chips row** (one chip per active filter + a "Clear all filters" link), hidden when no filters are active. There is no Save-Searches control and no gear/settings icon. (This replaced the older six-control "Filters" card with Reset/Apply buttons.)
- **Results card** containing:
  - A results header row: on the left a **result-count line** "Showing {start}–{end} of {total} listings" (when the list is empty it reads "Showing 0 of 0 listings"); on the right a **Table / Grid view toggle** (pill-style two-button group; "Table" is selected by default unless the user previously chose Grid — the choice is remembered).
  - Either the **list table** (default) or the **grid of cards** (when Grid is selected) — both showing only the current page's slice (see Pagination).
  - A **pagination bar** below the list (Previous · numbered pages · Next).

**2. Detail view** (hidden until a listing is opened)

- **Sticky toolbar** at top: on the left a "Back to list" button, a mode indicator pill ("View mode" or "Edit mode"), a group badge (e.g. "Group 1 — Single Unit"), and a **"View change history"** link (clock-rotate-left icon) sitting between the back/mode area and the right-hand action buttons — it opens the Change History drawer (see Modals & Popups). On the right, the action buttons — in View mode: **Edit**, a single **Suspend / Re-activate toggle button** (shown only for Published or Suspended listings; hidden for Pending Review and Rejected), and **Delete** (always available). There is NO "Approve" button. In Edit mode these are replaced by Cancel and "Save changes".
- **Hero banner:** a colored thumbnail icon (chosen by group), the property name, an ID pill (e.g. "PROP-58102"), and a meta line showing address · publish-status badge · members badge · transaction badge.
- **Alerts area:** zero or more colored status alerts (see Conditional Display).
- **Schema-driven section cards:** a responsive grid of cards. Which cards appear, and which fields appear inside each, is fully determined by the property's group and certain field values. In View mode each field shows its formatted value; in Edit mode editable fields become inputs. Two cards (Amenities, POI/Media) render with custom layouts.

**3. Create modal — "New property — Select group":** a group-picker dialog with one card per creatable group (Groups 1/2/3 create in-page; Groups 5/6 link out to Project Management).

There is **no in-detail group switcher** — a property's group is fixed once created. The group is chosen only at creation time in the modal.

---

### Every Element

#### Page header

- **Export CSV** button — shows a toast ("Exported {N} listings to CSV."); does not download a file.
- **New property** button — opens the create modal.

#### Compact popover filter bar (left → right)

All filters live in one compact bar. Each popover supports the standard four close methods where it has an explicit footer button (Done/Apply) **plus** outside-click (which applies + closes) and ESC. Buttons with an active selection show a numeric count badge and a highlighted state. A chips row beneath the bar summarises every active filter.

1. **Search** — live text input, placeholder "Search by name, ID, agent, address…". Filters as you type (resets to page 1). Matches name, ID, agent, prefecture, city, chome, and property type.
2. **Buy/Rent** — dropdown: "All (Buy/Rent)" (default), "Buy", "Rent". Applies immediately on change.
3. **Property Type** popover — a search box plus checkboxes grouped under **G1 / G2 / G3** headings (G1: Apartment, Tower Mansion, House, Retail Unit, Office Unit, Factory & Warehouse Unit, Resort Apartment & Condo Hotel Unit, Car Park; G2: House, Residential Multi-Family Building, Retail Building, Office Building, Factory & Warehouse Building, Mixed-Use Building, Hotel & Ryokan, Resort House & Villa & Ski Chalet; G3: Residential Land, Commercial Land, Other Land, Carpark (Operational), Carpark (Development Land)). "Done" applies + closes; outside-click also applies + closes.
4. **Region/Station** popover — two tabs (**Region** is the default; **Railway/Station**). Region tab = a search box + a **Prefecture → Cities** checkbox tree for the 10 prefectures (Tokyo, Osaka, Kanagawa, Kyoto, Hokkaido, Fukuoka, Saitama, Chiba, Aichi, Hyogo); ticking a prefecture auto-ticks all its cities (partial city selection is allowed). Railway tab = a search box + a **Prefecture → Line → Station** tree (seeded with 2–3 lines per major prefecture, 3–5 stations each, for Tokyo / Osaka / Kanagawa / Hokkaido / Fukuoka / Aichi). "Apply" commits. Region and Railway selections combine with **OR** (a listing matches if it falls in any selected region OR is served by any selected station).
5. **Bedroom** popover — checkboxes 1, 2, 3, 4, 5+ (5 means "5 or more") + "Apply".
6. **Size** popover — From / "to" / To (m²) number inputs + preset buttons (0–20, 20–30, 30–40, 40–50, 50–60, 60–70, 70–80, 80–100, 100–150) + "Done". Matches a listing's exclusive / land / building area.
7. **Price** popover — From / "to" / To (million yen) inputs + preset buttons (0–20, 20–30, 30–40, 40–60, 60–80, 80–100, 100–150, 150–200, 200–300, 300–500) + "Done".
8. **Publish Status** popover — checkboxes "Pending Review", "Published", "Rejected", "Suspended" + "Apply".
9. **Sale Status** popover — checkboxes "On Sale", "Sold Out" + "Apply".
10. **Sort** popover — radio list (applies + closes on selection): Price Low→High, Price High→Low, Building Age Newest→Oldest, Building Age Oldest→Newest, Upload Date Latest→Oldest, **Last Update Latest→Oldest (default)**, Size Largest→Smallest, Size Smallest→Largest.
11. **Advanced Filter** button (sliders icon) — opens the Advanced Filter modal (see below).

**Active-filter chips row** (below the bar): one chip per active filter formatted "{Filter}: {summary}" each with an "×" to clear just that filter, plus a "Clear all filters" link when any chip exists. The row is hidden when no filters are active. Clearing a chip (or clicking the corresponding button's selections off) updates the bar badge counts and re-runs the filter, resetting to page 1.

#### View toggle

- **Table** button and **Grid** button. Selecting one highlights it and switches the results display. The selection is remembered for the session (persisted in `sessionStorage` key `plo.view`). Toggling the view resets pagination to page 1 (the two views are different-sized datasets — Grid also appends matching New-Dev cards).

#### Result count & Pagination (universal 50/page)

- **Result-count line** (above the list): "Showing {start}–{end} of {total} listings", where start/end are the 1-based bounds of the current page's slice and total is the count of items in the active view (Table = filtered listings; Grid = filtered listings + matching New-Dev cards). With no matches it reads "Showing 0 of 0 listings".
- **Pagination is fixed at 50 rows per page** — there is no page-size selector. The active view's dataset is paginated and only the current page's (up to) 50 items are rendered, in whichever view is active.
- **Pager controls** (below the list): **Previous** | numbered page buttons | **Next**. Up to 7 page numbers are shown at once; skipped ranges collapse to a "…" ellipsis (first and last page always shown). The current page is highlighted in the accent-gold token. **Previous** is disabled on page 1; **Next** is disabled on the last page. The entire pager is **hidden when total ≤ 50** (single page).
- **Reset to page 1** happens on: Apply filter, Reset filter, real-time search typing, view toggle (changes the dataset), and page reload (the page is not persisted — every load starts on page 1). Sorting by a column header would also reset to page 1 (no sortable headers exist on this screen today).
- **Page is preserved** (not reset) when opening or closing the detail view or any modal — returning to the list keeps the page the user was on. Deleting the open listing keeps the page (clamped to the last page if it became empty).

#### List table — columns in exact order

1. **Property** — group thumbnail icon + property name (bold) + ID underneath.
2. **Type** — the property type text.
3. **Transaction** — a badge: "Buy" (success variant), "Rent" (warning variant) (members/accent variant), or "—" (neutral variant) when none. Group 3 (Land) with no transaction value shows "Buy".
4. **Sale Status** — a badge: "On Sale" (success variant) or "Sold Out" (danger variant). Defaults to "On Sale" when unset. (New column, placed between Transaction and Price.)
5. **Price** — formatted price. For "Rent" it shows "¥…/mo"; for "" it shows "¥buy · ¥rent/mo"; otherwise the buy price.
6. **Address** — "prefecture · city".
7. **Agent** — agent name/agency.
8. **Status** — publish-status badge using the 4-status set: Pending Review (warning variant), Published (success variant), Rejected (danger variant), Suspended (danger variant); any unknown value falls back to the neutral variant.
9. **Updated** — the last-updated date (or "—").

Clicking any table row opens that property's detail view.

#### Grid cards — fields per card

Grid view now renders each property with the **shared rich property card** (`property-card.js` → `renderPropertyCard`, included once before the page script; the component injects its own CSS). Each card shows:

- A hero illustration (one of three built-in SVGs, chosen deterministically from the property ID) with a dark bottom gradient overlay, a heart button, and left/right nav arrows (decorative).
- The listing **agent** with an avatar (top-left); "—" if none.
- A **status badge** ribbon (publish status, e.g. "Published" / "Pending Review"; "New Dev" on New-Development cards, which use the gold ribbon variant).
- **Title** = property name and a **price overlay** (price + a price-unit line derived from transaction type: "(for sale)" / "(monthly)" / "(sale + rent)"; "(from)" for New-Dev), with **location** = "prefecture · city" and, when available, a **Gross Return** line (from `estGrossYield`).
- An **amenity row** led by a **type chip with a type-specific icon** (Residential / Commercial / Land), followed by whichever specs exist on the record: beds (`fpBedrooms`, falling back to layout), baths (`fpBathrooms`), parking (count of parking facilities), units (`totalUnits`), and area (m², from exclusive / land / building area).
- A two-line **description** (from the property's description).
- Clicking a regular card opens its detail (`showDetail(id)`); clicking a New-Dev card jumps to Project Management (`gotoNewDev(group)`). The card click handler is passed via the component's `onClick`.

Cards lay out in a CSS grid (`repeat(auto-fill, minmax(300px, 1fr))`, ~18px gap).

**New-Development cards** (only appear in Grid view, appended after the regular cards): four demo projects —

- "Shinagawa Bayfront Residence" (Group 5, New Dev Apartment, Tokyo · Shinagawa, "¥78M~", Published)
- "Umeda Sky Towers" (Group 5, New Dev Apartment, Osaka · Osaka, "¥62M~", Published)
- "Kohoku New Town Houses" (Group 6, New Dev House, Kanagawa · Yokohama, "¥54M~", Published)
- "Sapporo Garden Villas" (Group 6, New Dev House, Hokkaido · Sapporo, "¥41M~", Pending Review)

In Grid view, the total count (and the paginated dataset) includes both regular results and matching New-Dev cards; New-Dev cards are appended after the regular cards within each page.

#### Detail toolbar buttons

- **Back to list** — returns to the list view.
- **View change history** (clock-rotate-left icon link, between the mode/group area and the right-hand actions) — opens the Change History drawer for the open listing.
- **View mode (default):**
  - **Edit** — enters edit mode.
  - **Suspend / Re-activate toggle** (single button; visibility & label depend on status):
    - Published → button reads **"Suspend"** (danger styling) → sets status to **Suspended**.
    - Suspended → button reads **"Re-activate"** (success styling) → sets status to **Published**.
    - Pending Review or Rejected → button is **hidden** (these statuses are resolved in the Property Approval module, not here).
  - **Delete** — permanently removes the listing (always available, all statuses).
  - There is **no Approve button** on this screen.
- **Edit mode:**
  - **Cancel** — discards edits and returns to view mode.
  - **Save changes** — saves edits, stamps "today" as the updated date, returns to view mode.

#### Detail hero

- Thumbnail icon by group, property name (or "(Unnamed)" if blank), ID pill, and a meta line: address (prefecture · city · chome) · publish badge · **Sale Status badge** (On Sale → success variant, Sold Out → danger variant) · members badge ("🔒 Members Only" or "Open" — success variant) · transaction badge.
- **Sold-Out sale record card:** when Sale Status is "Sold Out", a prominent danger-tinted card appears **above** the Basic Information / section cards reading "Sold at ¥{finalSalePrice} on {soldDate}" plus a "Notes: …" line if notes were captured. The hero then shows both a Suspended publish badge and a Sold Out sale badge (both danger variant). In the section cards the original Selling/Buy Price stays visible but is greyed and struck-through (it is never overwritten by the final sale price).

#### Detail sections (per group)

The set and order of section cards depend on the group:

- **Group 1 (Single Unit):** Basic Information → Transaction Type & Price → Property Details → Building Details → Land Details → Highlight Features → Amenities/Facilities → Points of Interest Map → Media → Description.
- **Group 2 (Whole Building):** Basic Information → Transaction Type, Price & Occupancy → Property Details (Whole Building) → Building Details → Land Details → Highlight Features → Amenities/Facilities → Points of Interest Map → Media → Description.
- **Group 3 (Land):** Basic Information → Selling Price → Land Details → Facilities & Conditions → Points of Interest Map → Media → Description.

Every field per section is listed below. A red asterisk "*" after a label means the field is marked required (the required marker glyph is a red `*`). Most required markers are visual-only (no enforced validation on save), the one exception being the Mark-as-Sold modal, whose Final Sale Price and Sold Date ARE validated (see below). Fields marked "computed" are display-only and never editable. Fields marked "read-only" are never editable.

**Basic Information (Groups 1 & 2):**

- Property Type ★ (dropdown; options depend on group — see below)
- Property Name (text)
- Property Name — Romaji (text; helper "For overseas investor display and search")
- Post Code ★ (text; placeholder "150-0001")
- Prefecture ★ (dropdown; the 10 prefectures)
- City / Ward ★ (dropdown; options depend on the chosen prefecture)
- Chome (text)
- Building Name (text)
- House / Unit Number (text)
- Map Pin (computed; shows "📍 Auto-placed")
- Current Status (dropdown: "Owner Occupied", "Vacant", "Tenanted (Owner Change)", "Under Construction")
- Build Status (dropdown: "Newly-Built", "Newly Built not yet occupied", "Secondhand", "Under Construction")
- Move-in Period (dropdown: "Available Now", "Specified Due Date", "Consultation")
- Publish Status (dropdown: "Pending Review", "Published", "Rejected", "Suspended")
- Sale Status * (dropdown: "On Sale" (default), "Sold Out"; **required**, placed immediately after Publish Status) — see the Mark-as-Sold flow for the side effects of changing this to "Sold Out".
- Members Only (dropdown: "Open for Public", "Members Only")
- Date Published (date; read-only)
- Date Updated (date; read-only)
- Special Updates (checkboxes, full width: "Price Reduction", "Price Negotiable")

**Basic Information (Group 3 / Land):** same as above but WITHOUT Romaji, Map Pin and Build Status, and with these differences:

- Property Type ★ uses the Land types.
- Current Status options are "Owner Occupied", "Tenanted", "Vacant".
- Adds **Current Situation** (dropdown: "Vacant Land", "With Building", "Car Park", "Farmland", "Field", "Mountain", "Forest", "Wilderness", "Hybrid land", "Other").
- Building Name / House Number labels read "Building Name (if any)" / "House Number (if any)".

**Transaction Type & Price (Group 1):**

- Transaction Type ★ (dropdown: "Buy", "Rent"; full width)
- (Selling block — shows only for "Buy" / ""): header "— Selling Price"; Price (Buy) ★ (yen); Tax (dropdown: "Tax included", "No Tax included"); Expected Annual Income (fully occupied) (yen); Expected Monthly Income (fully occupied) (yen); Estimated Gross Yield (%) (percent); Price per m² (computed); Monthly Management Fee (¥); Monthly Repair Reserve Fund (¥); Lump-sum Repair Reserve (¥) (helper "Paid at handover"); Management Association Fee (¥); Ground Rent (¥).
- **Gross Yield (%)** — shows only when Current Status is "Tenanted (Owner Change)".
- (Rental block — shows only for "Rent" / ""): header "— Rental Details"; Rental Price Monthly (¥) ★; Tax (dropdown taxes); Unit Price per m² (computed); Security Deposit (months) (number); Security Deposit Amount (¥); Key Money (yen); Key Money Tax (dropdown taxes); Management & Common Service Fees (¥); Renewal Fee (yen); Renewal Fee Tax (dropdown taxes); Rental Contract Type (dropdown: "Ordinary Lease", "Fixed Term Lease"); Contract Period (text; placeholder "Duration (YY/MM) or Ends date").

**Transaction Type, Price & Occupancy (Group 2):**

- Transaction Type ★ (full width; same three options)
- (Selling block — "Buy" / ""): header "— Selling Price"; Price (Buy) ★; Tax; Price per m² (computed).
- (Rental block — shows only when transaction is "Rent"/"" AND property type is "House"): header "— Rental Details (House only)"; Rental Price Monthly (¥); Tax.
- (Occupancy block — always shown): header "— Occupancy Details"; Number of Units Occupied (number); Occupancy Rate (%) (computed); Current Gross Return (¥); Est. Gross Return at Full Occupancy (¥); Current Gross Yield (%); Est. Gross Yield at Full Occupancy (%).
- (Hotel block — shows only when property type is "Hotel & Ryokan"): header "— Hotel Details"; Number of Rooms; Type of Lodging License (dropdown: "Hotel", "Ryokan License", "Simple Lodging License", "Minpaku", "Tokkyu Minpaku", "Under Application", "None"); Hotel Management Structure (dropdown: "Leasehold", "Hotel Management Contract", "Franchise", "Owner Managed", "Vacant"); then these [Members Only] fields — Leasehold — Annual Rent; Leasehold — Contract Duration (text; placeholder "Start date / End date"); Gross Yield (%); Avg Occupancy Rate % Last 12 Months; Avg Daily Room Rate Last 12 Months; Annual Revenue; Annual Expenses; Gross Operating Profit; Est. Annual Revenue; Est. Annual Expenses; Est. Gross Operating Profit.
- (Mixed-Use block — shows only when property type is "Mixed-Use Building"): header "— Mixed-Use Breakdown (units by type)"; Residential units; Retail units; Office units; Factory / Warehouse units; Hotel / Ryokan units (all numbers).

**Selling Price (Group 3):**

- Selling Price (¥) ★ (yen)
- Tax (dropdown taxes)
- Unit Price per m² (computed)
- Unit Price per Tsubo (computed; helper "1 Tsubo = 3.306 m²")
- Gross Return [Carpark only] — shows only when property type is "Carpark (Operational)" or "Carpark (Development Land)".
- Gross Yield (%) [Carpark only] — same condition.

**Property Details (Group 1):** Layout (dropdown: "1K", "1R", "1DK", "1LDK", "1SLDK", "2DK", "2LDK", "2SLDK", "3DK", "3LDK", "3SLDK", "4DK", "4LDK", "4SLDK", "5DK", "5LDK", "5SLDK", "6LDK+"); Bedrooms; Toilets; Bathrooms; Storage Rooms; Study / Den; Walk-in Wardrobes (WIC); Shoe-in Cabinets (SIC); Construction Date (date); Handover Timing (date); Exclusive Area / Footprint (m²) ★; Area Measurement Method (dropdown: "Wall-to-Wall", "Centre-Line", "Actual", "Registered"); Balcony Area (m²); Roof Balcony Area (m²); Private Garden Area (m²); Floor / Total Floors (text; placeholder "5F / 12F"); Balcony Direction (dropdown: "North", "South", "East", "West", "NE", "NW", "SE", "SW").

**Property Details (Whole Building) (Group 2):** Layout Mix (e.g. 2× 1LDK, 5× 2LDK) (text, full width); Building Area (m²); Area Measurement Method (dropdown areaMethod); Balcony Area (m²); Balcony Direction (text); Rooftop Area (m²); Outdoor Area (m²); Construction Date (date); Total Floors (number); Maintenance Fee (yen); Repair Reserve Fund (yen); Management Fee (yen); Expected Annual Income (fully occupied) (yen); Expected Monthly Income (fully occupied) (yen); Handover Timing (date); Direction (dropdown directions).

**Building Details (Groups 1 & 2):** Building Structure (dropdown: "Steel Reinforced Concrete (SRC)", "Reinforced Concrete (RC)", "Steel Frame", "Wooden"); Building Area (m²); Building Area Measurement (dropdown areaMethod); Land Area (m²); Land Area Measurement (dropdown: "Actual Measurement", "Registered Area"); No. of Floors; No. of Units; Elevator (Yes/No toggle); Parking / Bicycle Parking (checkboxes, full width: "Parallel", "Underground garage", "Carport", "Visitor parking", "Bicycle parking", "Motorcycle storage", "Free parking for 1 car"); Form of Management (dropdown: "Self-management", "Partially consigned", "Consignment of all"); Manager (dropdown: "Resident", "Day shift", "Part-time", "None"); Management Association (dropdown: "Yes", "No").

**Land Details (Groups 1 & 2):** Land Right (dropdown: "Ownership", "Freehold", "Leasehold", "Surface Right").

- (Leasehold conditionals — show only when Land Right is "Leasehold"): Type of Leasehold Rights (dropdown: "Ordinary Leasehold", "Old Law Leasehold", "Fixed-Term Leasehold"); Lease Term (text; placeholder "Date or years"); Lease Term Remaining (text); Land Rent — Monthly Amount (yen); Land Rent — Annual Amount (yen); Renewal Fee (text); Transfer Fee (text); Deposit (text).
- (Further conditional): Demolition Reserve Fund (Fixed-Term) — shows only when Type of Leasehold Rights is "Fixed-Term Leasehold".
- (Common): Land Use (dropdown: "Residential", "Commercial", "Field", "Agricultural", "Forest", "Miscellaneous", "Other"); Zoning (dropdown — 14 options: "First-class low-rise exclusive residential", "Second-class low-rise exclusive residential", "First-class medium-to-high-rise exclusive residential", "Second-class medium-to-high-rise exclusive residential", "First-class residential zone", "Second-class residential zone", "Semi-residential zone", "Rural residential zone", "Neighbourhood commercial zone", "Commercial zone", "Semi-industrial zone", "Industrial zone", "Exclusive industrial zone", "Mixed use zone"); Land Law Notification (Yes/No dropdown); Land Area (m²); Area Measurement Method (dropdown land-area methods); Building Coverage Ratio (%); Floor Area Ratio (%); Road Access (dropdown: "One side", "Two sided"); Access to Road (text); Road Width (m); City Planning (dropdown: "Urbanization Zone", "Urbanization Control Zone", "Non-delineated Area", "Outside the city planning area", "Quasi-Urban Planning Area"); Direction of Road (dropdown directions); Current Land Condition (dropdown — same 10 as Current Situation).

**Land Details (Group 3):** same as above but: Land Area (m²) is **required ★**; the leasehold conditionals are limited to Type of Leasehold Rights, Lease Term (no placeholder), Lease Term Remaining, Land Rent — Monthly Amount, Land Rent — Annual Amount (no Renewal/Transfer/Deposit/Demolition fields); and it adds at the end **Ideal For** (checkboxes, full width: "House", "Residential Multi-Family", "Retail Building", "Office Building", "Factory & Warehouse", "Mixed-Use", "Hotel & Ryokan", "Resort House & Villa", "Other").

**Facilities & Conditions (Group 3):** Equipment Available (checkboxes, full width: "Water service", "Drainage", "Gas", "Electricity", "Other"); Note for Renovation (multi-line text, full width).

**Highlight Features (Groups 1 & 2):** a single full-width checkbox group (label hidden): "Pets Allowed", "Corner Unit", "South Facing", "Maisonette", "Parking Lot", "Bicycle Parking", "Garden", "Rooftop", "Building Concierge (English Speaking)", "Condominium / Tower Mansion", "All-electric", "Fully Furnished", "Bay Window", "Designer Property", "Quiet Residential Area".

**Amenities / Facilities (Groups 1 & 2):** an accordion of 9 collapsible panels (the first panel is expanded by default; each panel header shows a count "(n)" when items are selected). In View mode selected items appear as success-variant badges, or "None selected" if empty; in Edit mode each panel is a checkbox grid. Panels and their checkbox options:

- 🏠 Interior: "Flooring", "Partial flooring", "Underfloor Heating", "Cushion floor", "Natural material", "Staircase", "Ceiling fan", "Blinds", "Shutter", "Earthquake-resistant door", "Parent-child door", "Loft", "Pet allowed", "Balcony", "2 or more balconies", "Roof balcony", "Wooden deck", "Garden (private garden)", "Trunk Room".
- 📺 Furniture & Home Appliances: "Air conditioner", "Fan", "Curtain", "Blind", "Floor heating", "Washing machine", "Dryer", "Lighting", "Television", "Dining table & chairs", "Walk-in closet", "Shoe-in closet", "Storage", "Desk", "Other".
- 🍳 Kitchen: "Dishwasher", "Gas Hob", "IH Hob", "Microwave", "Oven", "Refrigerator", "Kitchen counter", "Sink", "Other".
- 🛁 Bath & Toilet: "Separate bath and toilet", "Dressing room", "Sauna", "Shower", "Washbasin", "Bathtub", "Other".
- 🔒 Security: "Auto-lock", "Electronic lock", "Double lock key", "Key card", "Security camera", "24hr emergency call system", "Building manager onsite", "Security company", "Monitored Intercom", "Other".
- 🏢 Building Services: "Front Desk", "Concierge", "Garbage disposal", "Garbage collection service", "Mailbox / Delivery box", "EV Charging Facilities", "Other".
- 🏋️ Building Facilities: "Elevator", "Guest Rooms", "Kid's Playground", "Swimming Pool", "Public Bath", "Natural Onsen", "Gym", "Meeting Room", "Rooftop Terrace", "Theater Room", "Lounge", "Music Room", "Pet allowed", "Smoking Area", "Gardens", "Restaurant", "Cafe", "Other".
- 📡 TV & Communications: "BS terminal", "CS", "CATV", "Fiber Optics", "Free Internet".
- 🌱 Environmental Certification: "ZEH", "ZEH-M", "Certified Low-Carbon Housing", "Long-Life Housing", "Solar Power Generation".
- Below the panels: a full-width multi-line "Note for Changes / Renovations" field.

**Points of Interest Map (all groups):** a custom section. Header label "📍 Points of Interest (within 5 km · auto-detected)" with a button on the right labeled "Locate POIs" (or "Re-locate POIs" once POIs exist). When located, a success-variant confirmation bar shows "N POIs found within 5 km · Located [timestamp] 📍 [address]". Below it, a grid of 5 category cards (Metro / Bus Station, Supermarket, School, Park, Hospital) — empty categories appear faded with a count of 0; populated ones list each place name with its distance and "· N min walk". When nothing has been located yet, an empty-state block shows instead (see Empty States).

**Media (all groups):** custom section with three labeled cells — "3D Viewing Tour" (a clickable link in View mode, or a text input with placeholder "Paste Matterport / 360 link" in Edit mode), "Videos" ("N file(s)"), "Photos" ("N photo(s)" plus a warning-variant "Cover: photo-1.jpg" badge when photos exist). Below: a thumbnail gallery of up to 8 tiles ("photo-1.jpg" … with the first tagged "Cover"), plus a "+N more" tile if there are more than 8. In Edit mode two extra buttons appear: "Upload photos" and "Upload videos".

**Description (all groups):** a single full-width multi-line text field labeled "Description (max 200 words)" (the word limit is text only; not enforced).

#### Property Type options by group (used in the Property Type dropdown and create modal)

- **Group 1:** "Apartment", "Tower Mansion", "House", "Retail Unit", "Office Unit", "Factory & Warehouse Unit", "Resort Apartment & Condo Hotel Unit", "Car Park".
- **Group 2:** "House", "Residential Multi-Family Building", "Retail Building", "Office Building", "Factory & Warehouse Building", "Mixed-Use Building", "Hotel & Ryokan", "Resort House & Villa & Ski Chalet".
- **Group 3:** "Residential Land", "Commercial Land", "Other Land", "Carpark (Operational)", "Carpark (Development Land)".

#### City / Ward options by prefecture

- Tokyo: Shibuya, Shinjuku, Minato, Setagaya, Chuo, Meguro, Bunkyo, Koto, Shinagawa, Suginami, Taito, Edogawa.
- Osaka: Osaka, Sakai, Toyonaka, Higashi-Osaka, Suita, Hirakata.
- Kanagawa: Yokohama, Kawasaki, Sagamihara, Yokosuka, Fujisawa.
- Kyoto: Kyoto, Uji, Kameoka.
- Hokkaido: Sapporo, Hakodate, Asahikawa.
- Fukuoka: Fukuoka, Kitakyushu, Kurume.
- Saitama: Saitama, Kawaguchi, Tokorozawa, Kawagoe.
- Chiba: Chiba, Funabashi, Matsudo, Ichikawa.
- Aichi: Nagoya, Toyota, Toyohashi, Okazaki.
- Hyogo: Kobe, Himeji, Nishinomiya, Amagasaki.

---

### Modals & Popups

**Create modal — "New property — Select group"** (opens from the "New property" button). Header title "New property — Select group" with an × close button. Body shows a vertical stack of group cards; a footer "Cancel" button. Cards:

- **Group 1 — Single Unit Property** (home icon, badge "Buy / Rent / Both"). Type tags shown: Apartment, Tower Mansion, House, Retail Unit, Office Unit, Factory & Warehouse Unit, Resort Apartment & Condo Hotel Unit, Car Park. Clicking creates a Group 1 listing in-page (Pending Review status).
- **Group 2 — Whole Building** (building icon, badge "Buy / Rent / Both"). Type tags: House, Residential Multi-Family Building, Retail Building, Office Building, Factory & Warehouse Building, Mixed-Use Building, Hotel & Ryokan, Resort House & Villa & Ski Chalet. Clicking creates a Group 2 listing in-page (Pending Review status).
- **Group 3 — Land** (mountain icon, badge "Buy only"). Type tags: Residential Land, Commercial Land, Other Land, Carpark (Operational), Carpark (Development Land). Clicking creates a Group 3 listing in-page (Pending Review status).
- A divider labeled "New Development".
- **Group 5 — New Dev Apartments** (dashed-border card, city icon, badge "Buy only"). Type tags: Apartment, Tower Mansion, Resort Apartment & Condo Hotel Unit, and a highlighted meta tag "★ Multi Floor Plan Types". Clicking navigates to Project Management (does not create here).
- **Group 6 — New Dev Houses** (dashed-border card, house-chimney icon, badge "Buy only"). Type tags: House, Resort House & Villa & Ski Chalet, and meta tag "★ Per Lot / Block". Clicking navigates to Project Management.

**Styled confirm modal** (reusable, callback-style — replaces all native browser confirm/alert dialogs). A centered card over a dimmed backdrop with: a header (title + "×" close icon), a body message, and a footer with a **Cancel** button and a single **action button** whose label and style vary per use (danger = red, or success = green). It can be dismissed four ways: the × close icon, the Cancel button, clicking the backdrop, or pressing **ESC** (any dismissal cancels without running the action). Confirming runs the supplied callback. Used by: Back-to-list-while-editing, Cancel edit, Suspend, Re-activate, and Delete (see Notifications for exact title/body/action text).

**Mark as Sold modal** (sale-details capture; opens from "Save changes" when Sale Status was changed from On Sale to Sold Out — BEFORE the save commits). Styled to match the confirm modal (same box/header/footer). Title "Mark as Sold?"; body "Confirm the sale details. This listing will be auto-suspended (hidden from Client Portal) once marked sold." Fields:

- **Final Sale Price (¥)** — number input, **required** (red `*`), placeholder "Enter final sale price in JPY".
- **Sold Date** — date input, **required** (red `*`), defaults to today.
- **Notes** — textarea, optional, placeholder "Optional notes about this sale".

Footer buttons: **Cancel** and **Confirm Sale** (danger). The modal can be dismissed four ways (× close icon, Cancel, backdrop click, ESC) — any dismissal cancels the sale and the save does NOT proceed (the listing stays On Sale / unsaved). On Confirm Sale it validates the two required fields (inline errors, modal stays open if invalid), then performs the atomic save (see Mark-as-Sold flow).

**Change History drawer** (opens from the "View change history" toolbar link in the detail view). A right-hand slide-out drawer (~520px wide) over a dark backdrop. Header: "Change History — {listing ID}" with an × close button; subtitle "Full edit log for this listing". A drawer filter bar with two dropdowns: **Actor** ("All actors" / "Admin" / "Agency") and **Field** ("All fields" + one option per distinct field present in this listing's history, including a "Reports" option when the listing has report events). Body lists the listing's `changeHistory[]` entries merged with its report history, **newest-first**:
- **Edit rows** show the timestamp formatted "YYYY-MM-DD HH:MM" · an **actor badge of either "Admin" (members variant) or "Agency" (success/accent variant)** — individual agent names are no longer shown; every non-admin edit is labelled **Agency** · the field label · and the change. **Short values** render inline as "Old: {oldVal} → New: {newVal}". **Long values** (Description, Sold Notes, or any value over ~60 chars) render in an **expandable panel** — a "View change" toggle that reveals the full **Before → After** text (this replaces the old "(Text modified)" placeholder).
- **Report rows** render in the same timeline as "**Reported — {reason}**" with a flag icon (danger accent) and a "**Report**" actor label. Reportable reasons include Inappropriate content / Suspected duplicate / Misleading price / Wrong photos.
- **Actor filter:** "Admin" shows admin edits only; "Agency" shows all non-admin edits (and hides reports); reports are hidden whenever a specific actor is selected. **Field filter:** reports are selectable via the "Reports" option.

The drawer paginates at **50 entries per page** (Prev/Next inside the drawer footer). Empty state (no entries, or none matching the filters): "No changes recorded yet for this listing." Footer also has an **"Export change log to CSV"** button → toast "Exported change log to CSV." (no file generated). Closes via × icon, backdrop click, or ESC. Changing either filter dropdown re-renders and resets to drawer page 1. (The `changeHistory[]` and report data are seeded per listing — see Demo seed.)

**Advanced Filter modal** (opens from the "Advanced Filter" button on the compact bar). Centered modal (~600–700px wide; full-screen on mobile) over a dimmed backdrop. Header: centered title "Filter" + an × close button. Sticky footer: **"Clear filters"** (ghost, left — resets the modal's fields but does NOT close the modal) and **"Search"** (primary gold, right — applies all the modal's selections, closes, resets to page 1). Closes via × icon, backdrop click, or ESC (without applying). Body sections (inline, with dividers between):

1. **Search location** — text input "Search suburb, postcode, or state".
2. **Buy/Rent** — Buy/Rent segmented toggle (default Buy → "Buy"; Rent → "Rent").
3. **Property type** — 2-column checkbox grid covering all G1 + G2 + G3 types.
4. **Region/Station** — two tabs (Region / Railway-or-Station) with the same Prefecture→Cities and Prefecture→Line→Station trees as the compact-bar popover.
5. **Bedroom / Floor Plan** — 2-column checkboxes: 1R/1K, 1DK/1LDK, 2K/2DK/2LDK, 3K/3DK/3LDK, 4K/4DK/4LDK, 5K/5DK/5LDK and over (mapped to bedroom counts 1–5, the last meaning 5+).
6. **Yield** — 2-column radio: No limit / 3% or more / 5% or more / 10% or more / 15% or more / 20% or more.
7. **Price** — 2-column checkboxes: 0–10M / 10–50M / 50–100M / 100–200M / 200–300M / 300–500M / 500M–1B / Over 1B (ticking one fills the Price Range inputs below).
8. **Price Range** — custom From / To inputs ("No Min" / "No Max" placeholders, million yen).
9. **Land Area** — heading "Land Area (for building, land, parking lot)"; 2-column checkboxes 0–50 / 50–100 / 100–150 / 150–200 / 200–500 / Over 500 m² plus custom Min / Max inputs.
10. **Publish Status** — checkboxes (the 4 publish statuses).
11. **Sale Status** — checkboxes (On Sale / Sold Out).

**State sync:** opening the modal pre-populates every section from the current compact-bar filter state; clicking "Search" writes the selections back to the compact-bar popovers (and their badge counts), the chips row, and the list.

There are no other modals. Toasts appear bottom-right (see Notifications).

---

### Conditional Display

**By group (which section cards appear):** Group 1, Group 2, and Group 3 each show a different ordered set of section cards (listed under Layout & Structure / detail sections). Groups 5 and 6 have no in-page detail at all — they redirect to Project Management.

**By group (within Basic Information):** the Property Type dropdown options come from the property's group. Group 3 hides Romaji, Map Pin and Build Status, and shows the extra "Current Situation" field; its Current Status uses the land-specific options.

**By prefecture:** the City / Ward dropdown only lists cities belonging to the currently selected prefecture.

**By transaction type (Groups 1 & 2 price sections):**

- The Selling Price block (and its Price/Tax/income/yield fields) shows only when Transaction Type is "Buy" or "".
- The Rental Details block shows only when Transaction Type is "Rent" or "". In Group 2 the rental block additionally requires the property type to be "House".

**By current status (Group 1):** the "Gross Yield (%)" field shows only when Current Status is "Tenanted (Owner Change)".

**By property type (Group 2):** the Hotel Details block (and its note + all hotel/[Members Only] fields) shows only for "Hotel & Ryokan"; the Mixed-Use Breakdown block shows only for "Mixed-Use Building".

**By property type (Group 3):** "Gross Return [Carpark only]" and "Gross Yield (%) [Carpark only]" show only for "Carpark (Operational)" or "Carpark (Development Land)".

**By land right (Groups 1/2/3 land sections):** the leasehold fields show only when Land Right is "Leasehold". In Groups 1/2 only, "Demolition Reserve Fund (Fixed-Term)" further shows only when Type of Leasehold Rights is "Fixed-Term Leasehold".

**Reactive re-render in Edit mode:** changing any of these fields immediately re-renders the detail to show/hide dependent fields: Transaction Type, Property Type, Current Status, Land Right, Type of Leasehold Rights, Prefecture (the last so City options update).

**Status alerts (top of detail):**

- Pending Review listing → **warning** alert: "This listing is awaiting approval. Open Property Approval to approve or reject it." — "Property Approval" is an inline link to the Property Approval module (`property/property-approval-moderation.html`, opened in the shell top frame).
- Rejected listing → **danger** alert: "This listing was rejected. Reason: {reject category}. {notes if any}" (the reject category and optional notes are seeded on the rejected demo listing).
  (Both can appear together. Members-Only listings no longer show an inline alert — the members status is conveyed by the hero members badge only.)

**Toolbar buttons:** the View-mode buttons (Edit / Suspend-or-Re-activate toggle / Delete) and Edit-mode buttons (Cancel/Save) are mutually exclusive depending on mode; the mode pill text and styling also change ("View mode" neutral variant vs "Edit mode" warning variant). The Suspend/Re-activate toggle button is itself shown only for Published (label "Suspend", danger) or Suspended (label "Re-activate", success) listings and hidden for Pending Review / Rejected.

**Members badge:** "🔒 Members Only" (members/accent variant) when Members Only is set, otherwise "Open" (success variant).

**Sale Status badge / sold display:** the hero always shows a Sale Status badge (On Sale = success variant, Sold Out = danger variant). When a listing is Sold Out: the danger sale-record card appears above the section cards, the original Selling/Buy price is greyed + struck-through in its section, and (because sold listings are auto-suspended) the publish badge reads Suspended. The Suspend/Re-activate toggle for such a listing uses the Sold-Out re-activate variant (clears the sale record).

**POI section:** shows the empty-state block until POIs are located; afterward shows the confirmation bar + category grid, and the button label changes from "Locate POIs" to "Re-locate POIs".

**Media gallery:** the gallery and "Cover: photo-1.jpg" badge appear only when there is at least one photo; the "+N more" tile appears only when there are more than 8 photos. Upload buttons appear only in Edit mode.

---

### User Flows

**Filter (compact bar):** open any popover, make selections, and click its Done/Apply (or click outside it / press ESC) → the list, result-count line, chips row, button badge counts and pager all update, returning to page 1. Typing in **Search** and changing the **Buy/Rent** or **Sort** controls apply immediately (also resetting to page 1). Remove an individual filter via its chip's "×" or by un-ticking it in the popover; click **"Clear all filters"** (chips row) to reset every filter to defaults and restore the full list at page 1. (Filters apply to the current view; in Grid view, matching New-Dev cards are also included and counted.) Region and Railway/Station selections combine with OR.

**Advanced Filter:** click "Advanced Filter" → the modal opens pre-filled from the current filters → adjust any sections → "Search" applies everything, closes the modal, syncs the compact-bar popovers/chips, and resets to page 1; "Clear filters" empties the modal's fields without closing; the × / backdrop / ESC close it without applying.

**View change history:** in the detail view click "View change history" → the right-hand drawer opens listing the property's edit log (plus any report events) newest-first. Filter by Actor (Admin / Agency) or Field (including "Reports"), page through 50-at-a-time, expand long-value changes via "View change", click "Export change log to CSV" for a toast, and close via × / backdrop / ESC.

**Switch view:** click "Table" or "Grid". The chosen view replaces the other, resets to page 1, and is remembered for next time.

**Paginate:** click a numbered page button, or Previous / Next, to move through the 50-per-page list. The current page is highlighted; Previous/Next disable at the ends; the pager hides when there is only one page (≤ 50 items).

**Open detail:** click a table row or a regular grid card → opens that property's detail in View mode and scrolls to top.

**Enter edit:** in detail View mode click "Edit" → fields become inputs, toolbar swaps to Cancel / Save, mode pill switches to the warning-variant "Edit mode".

**Save:** in Edit mode click "Save changes" → all inputs are captured into the listing, "Date Updated" is set to today, view returns to View mode, the list and detail refresh, toast "Changes saved." **Exception — Mark-as-Sold:** if the save changed Sale Status from On Sale → Sold Out, the Mark as Sold modal opens first and the save is deferred until it is confirmed (see below).

**Mark-as-Sold flow:** in Edit mode set Sale Status to "Sold Out" and click "Save changes" → the **Mark as Sold modal** opens before anything is saved. The admin enters Final Sale Price (required), Sold Date (required, defaults today) and optional Notes, then clicks "Confirm Sale". On confirm the save is committed atomically: Sale Status = "Sold Out"; `finalSalePrice` / `soldDate` / `soldNotes` stored as separate fields (the listing's Selling Price is NOT overwritten); publish status set to "Suspended" (auto-suspend / hidden from Client Portal); Date Updated stamped today. Toast: "Listing marked as Sold. Final sale price: ¥{price}. Listing has been suspended." Cancelling the modal (any of the four close methods) aborts both the sale and the save. Afterwards the detail shows the Suspended + Sold Out badges, the danger sale-record card, and the greyed original price.

**Cancel edit:** click "Cancel" → styled confirm modal ("Discard changes?"); on confirm, edits are reverted and view returns to View mode.

**Suspend / Re-activate:** the single toggle button only appears for Published or Suspended listings. For a Published listing the button reads "Suspend" → styled confirm modal (danger action "Suspend") → sets status to Suspended, toast "Listing suspended." For a Suspended listing the button reads "Re-activate" → styled confirm modal (success action "Re-activate"). There are two re-activate variants depending on Sale Status:

- **Non-sold suspended listing:** body "Re-activate {id} ({name})? The listing will be visible publicly again." → sets publish status to Published, toast "Listing re-activated."
- **Sold-Out suspended listing:** body "This listing is marked as Sold Out (sold ¥{price} on {date}). Re-activating will reset Sale Status to On Sale and clear the sale record." → sets Sale Status back to On Sale, clears `finalSalePrice` / `soldDate` / `soldNotes`, sets publish status to Published. Toast: "Listing re-activated. Sale record cleared."

(Approval/rejection of Pending Review listings is handled in the Property Approval module, not here.)

**Delete:** click "Delete" → styled confirm modal (danger action "Delete"); on confirm the listing is removed from the list and the screen returns to the list view, toast "Listing deleted."

**Create in group (Groups 1/2/3):** "New property" → modal → click a Group 1/2/3 card → a new listing is created with **Pending Review** status (defaults filled), opened directly in Edit mode so the admin can fill it in.

**New-Dev handoff (Groups 5/6):** either click a Group 5/6 card in the create modal, or click a "New Dev" grid card → navigates to the Project Management page, passing the group number so that page can pre-open the right new-development flow.

**Back:** "Back to list" returns to the list (if currently editing, it first opens the styled confirm modal "Discard unsaved changes?", danger action "Discard").

**Locate POIs:** in the POI section click "Locate POIs" → if prefecture and city are set, nearby places are generated (deterministically) and displayed, with a success toast; otherwise an error toast. Re-clicking ("Re-locate POIs") regenerates them (e.g. after editing the address).

**Export CSV:** click "Export CSV" → toast "Exported {N} listings to CSV." (no file is actually generated).

---

### Validation

- Required fields are marked with a red-asterisk "*" but (except the Mark-as-Sold modal) there is **no enforced validation** — "Save changes" accepts the listing regardless of missing required fields. (Required markers appear on: Property Type, Post Code, Prefecture, City/Ward, **Sale Status**, Transaction Type, Price (Buy) / Selling Price, Rental Price Monthly (Group 1), Exclusive Area (Group 1), Land Area (Group 3).)
- **Mark-as-Sold modal (enforced):** Final Sale Price (¥) and Sold Date are required. Leaving Final Sale Price empty shows the inline error "Please enter the final sale price."; leaving Sold Date empty shows "Please select the sold date." The modal stays open and no save occurs until both are valid. Notes are optional.
- No format checks beyond the browser's native handling of number inputs (numeric only) and date inputs (date picker). Post Code, text fields, etc., accept any text.
- Empty number fields are stored as blank rather than zero.
- Filters: price min/max accept numbers (interpreted as millions of yen); an empty max means no upper limit.
- **Exact error messages:** the POI one — "Set Prefecture & City first, then click Locate POIs." (error toast when locating POIs without a prefecture/city); and the two Mark-as-Sold inline errors above.

---

### Empty States

- **List table, no matches:** a single full-width row reading "No properties match the filters."
- **Grid, no matches:** a centered full-width message "No properties match the filters."
- **POI section, nothing located:** a bordered block with a crosshair icon and the text "No POIs located yet." followed by "Click Locate POIs above to auto-fetch nearby Metro / Bus Station, Supermarket, School, Park and Hospital within 5 km of the property address."
- **Empty field values (View mode):** plain fields show "—"; checkbox groups / amenity panels with nothing selected show "None selected".
- **Unnamed property:** the hero title shows "(Unnamed)" when the name is blank.
- **POI empty category:** a faded category card with a count of "0".

---

### Notifications & Feedback

**Toasts (bottom-right, auto-dismiss):**

- Export CSV: "Exported {N} listings to CSV." (success)
- Change History drawer → "Export change log to CSV": "Exported change log to CSV." (success)
- Save: "Changes saved." (success)
- Mark as Sold (On Sale → Sold Out, confirmed): "Listing marked as Sold. Final sale price: ¥{price}. Listing has been suspended." (success)
- Suspend (Published → Suspended): "Listing suspended." (success)
- Re-activate (non-sold Suspended → Published): "Listing re-activated." (success)
- Re-activate (Sold-Out Suspended → Published, sale record cleared): "Listing re-activated. Sale record cleared." (success)
- Delete: "Listing deleted." (error styling)
- Locate POIs, missing prefecture/city: "Set Prefecture & City first, then click Locate POIs." (error)
- Locate POIs, success: "Located {N} POIs within 5 km from {address}." (success)
- Media "Upload photos" (Edit mode): "Photo uploader will be available in production." (success)
- Media "Upload videos" (Edit mode): "Video uploader will be available in production." (success)

**Styled confirm modal (exact title / body / action button):**

- Leaving detail while editing (Back to list): title "Discard unsaved changes?", body "Your edits will be lost if you leave now.", action "Discard" (danger).
- Cancel edit: title "Discard changes?", body "Your edits in this session will be lost.", action "Discard" (danger).
- Suspend (when currently Published): title "Suspend listing?", body "Suspend {id} ({name})? The listing will be hidden from public view until re-activated.", action "Suspend" (danger).
- Re-activate (Suspended, NOT sold): title "Re-activate listing?", body "Re-activate {id} ({name})? The listing will be visible publicly again.", action "Re-activate" (success).
- Re-activate (Suspended AND Sold Out): title "Re-activate listing?", body "This listing is marked as Sold Out (sold ¥{price} on {date}). Re-activating will reset Sale Status to On Sale and clear the sale record.", action "Re-activate" (success).
- Delete: title "Delete listing?", body "Permanently delete {id} ({name})? This cannot be undone.", action "Delete" (danger).

**Mark as Sold modal (exact text):** title "Mark as Sold?", body "Confirm the sale details. This listing will be auto-suspended (hidden from Client Portal) once marked sold.", action "Confirm Sale" (danger) + "Cancel". Inline validation errors: "Please enter the final sale price." / "Please select the sold date."

(There are no native browser `confirm()` / `alert()` dialogs anywhere on this screen, and no "(demo)" placeholder text remains. The Upload-photos / Upload-videos stubs fire the production-wording toasts above; the New-Dev fallback alert was removed — if the Project Management link is unavailable the failure is only logged to the console, with no UI popup.)

**Inline status alerts (top of detail):** see Conditional Display — Pending Review: "This listing is awaiting approval. Open Property Approval to approve or reject it." (with a link to the Property Approval module) / Rejected: "This listing was rejected. Reason: {reject category}. {notes if any}". (There is no longer a Members-only inline alert.)

**Other inline text:** POI confirmation bar "{N} POIs found within 5 km · Located {timestamp} 📍 {address}". (The former Hotel "[Members Only]" section note and the POI "Google Maps Places API" footer note have been removed.)

---

### Navigation

- The screen is loaded into the admin shell's content frame; there is no URL/hash change between its own list and detail views.
- **Back to list** swaps the detail view back to the list view in place.
- **Row / regular grid card → detail** opens that property's detail in the same screen.
- **New-Dev grid card → Project Management** and **create-modal Group 5/6 cards → Project Management** both navigate the shell's content frame to the Project Management page, mark that page's sidebar item active, and pass the group number to it so it can auto-open the correct new-development creation flow.
- **3D tour link** (Media, View mode) opens the external Matterport/360 URL in a new tab.

**Persistence:**

- The Table/Grid view choice is persisted in **`sessionStorage` under the key `plo.view`** (values `"table"` / `"grid"`, default `"table"`). It survives in-tab reloads for the session but is NOT remembered across browser sessions (sessionStorage, not localStorage).
- The current **page number is NOT persisted across reloads** (every load starts on page 1), but it **is preserved** while opening/closing the detail view or any modal.
- When handing off to Project Management, the chosen group number (5 or 6) is written to **`localStorage` under the key `yuushi.autoCreateGroup`** (the parent shell's `localStorage` when embedded in the iframe, otherwise the page's own) so the Project Management page can pre-select that new-development group. This is the only `localStorage` key the screen writes.
- Edits are held in memory only (this is a demo); there is no backend save.

**Demo seed status mix:** the in-page demo data holds **61 listings** so the 50/page pager is exercised — 9 curated listings plus 52 **deterministic filler** listings appended after them (generated from their index, no randomness, reusing the same record shape; they cycle through Groups 1/2/3, the 10 prefectures, the 4 statuses, and the 3 transaction types). The 9 curated listings cover all 4 statuses, including the **Rejected** example (Setagaya Residential Land, Group 3) with its seeded reject category ("Incomplete documentation") and notes that drive its danger alert, the **Suspended** Shinjuku Studio Apartment (Group 1), and the Pending Review examples. The filler set also includes Rejected/Suspended/Pending rows so the status filter has matches across pages. (The four New-Development grid cards remain separate demo data; one, "Sapporo Garden Villas", is seeded as Pending Review.)

**Sale Status & change-history seeding (deterministic, post-filler normalisation pass):** after the filler runs, a pass sets `saleStatus` on every listing (default "On Sale") and marks a deterministic spread of **10 sale-capable listings** (those with a buy price; capped at `soldCount < 10`, matching `index % 6 === 2`) as **Sold Out** — each with a `finalSalePrice` (≈ buy price minus a small deterministic discount, a SEPARATE field from the asking price), a `soldDate`, optional `soldNotes`, and publish status forced to **Suspended** (matching the auto-suspend rule). The same pass gives every listing a `changeHistory[]` array of **3–5 sample entries** (`{ts, actorId, actorName, role:"Agent"|"Admin", field, oldVal, newVal}`); sold listings get an extra entry recording the saleStatus change. In the drawer the actor is surfaced as just **Admin** or **Agency** (all non-admin roles collapse to "Agency"; individual agent names are not shown). A subset of listings also carries a `reports[]` array (seeded report events with a `ts` and a `reason` from Inappropriate content / Suspected duplicate / Misleading price / Wrong photos) that is merged into the same timeline as "Reported — {reason}" rows. This data drives the **Change History drawer** (opened from the "View change history" toolbar link). Newly created listings start with `saleStatus:"On Sale"` and an empty `changeHistory` (the drawer then shows its empty state).

---

### SRS notes for BA / Business rules

These rules formalise the Sale Status / Mark-as-Sold behaviour for the SRS. They are independent of, but interact with, the existing 4-state publish-status model.

**Data model (per listing):**

- `saleStatus` — enum, **required**, values `On Sale` | `Sold Out`, default `On Sale`. Set on every Group 1/2/3 listing.
- `finalSalePrice` — integer JPY, the agreed final transaction price. **Distinct from** the listing's asking/`priceBuy` (Selling Price) field, which is never overwritten. Present only while `saleStatus = Sold Out`.
- `soldDate` — date the sale completed. Present only while `saleStatus = Sold Out`.
- `soldNotes` — free text, optional. Present only while `saleStatus = Sold Out`.
- `changeHistory[]` — audit trail entries `{ts, actorId, actorName, role, field, oldVal, newVal}` (surfaced in the Change History drawer).

**BR-1 — Sale Status is mandatory.** Every listing must carry a Sale Status; the field is marked required and defaults to `On Sale` on creation and for any legacy record lacking the value.

**BR-2 — Marking as Sold requires sale capture.** A transition `On Sale → Sold Out` may only be committed after the admin supplies a **Final Sale Price** (required, JPY) and a **Sold Date** (required; defaults to today). Notes are optional. The capture happens in a confirmation modal that opens at Save time, before the save is persisted. If the admin cancels the modal, the transition is abandoned and nothing is saved.

**BR-3 — Final Sale Price is recorded separately.** The captured Final Sale Price is stored as `finalSalePrice` and never overwrites the listing's original asking/Selling Price. In the UI the original price remains visible but greyed/struck-through to signal it has been superseded.

**BR-4 — Auto-suspend on sale.** Committing a sale atomically sets `publishStatus = Suspended` so the listing is immediately hidden from the Client Portal. The publish-status change and the sale-record write are a single save (no intermediate visible state). Date Updated is stamped to today.

**BR-5 — Sold listings surface the sale prominently.** A Sold-Out listing displays both a `Suspended` publish badge and a `Sold Out` sale badge (both danger), and a danger-tinted "Sold at ¥{finalSalePrice} on {soldDate}" card (plus Notes if any) above the main detail.

**BR-6 — Re-activating a sold listing clears the sale.** Re-activating a listing that is both Suspended and Sold Out resets `saleStatus → On Sale`, clears `finalSalePrice` / `soldDate` / `soldNotes`, and sets `publishStatus → Published`. A non-sold suspended listing re-activates normally (publish status only) and keeps its On Sale status. The admin is warned of the sale-record clearing in the re-activation confirmation.

**BR-7 — No partial / inconsistent sold states.** Because the sale capture and auto-suspend are atomic, a listing should never be `Sold Out` without a `finalSalePrice` + `soldDate`, nor `Sold Out` while still Published. (The seed data honours this: all seeded Sold-Out listings are Suspended with both sale fields set.)

**Change-history audit trail:** the `changeHistory[]` array (plus an optional `reports[]` array) is populated per listing and surfaced in the **Change History drawer** (actor/field/old→new/timestamp rows, newest-first, Actor/Field filters, 50/page, CSV-export toast). The actor is shown only as **Admin** or **Agency** (Agency = all non-admin roles; no individual agent names). Report events appear in the same timeline as "Reported — {reason}" rows (reasons: Inappropriate content / Suspected duplicate / Misleading price / Wrong photos) and are selectable via the "Reports" field-filter option. Long-value changes (Description, Sold Notes, or any value over ~60 chars) render in an **expandable "View change" panel** showing the full Before → After (replacing the old "(Text modified)" placeholder); short values show inline old→new. Sale-related changes (mark-as-sold) already append a history-style record conceptually and should be logged to `changeHistory` when real edits are wired to the audit trail.
