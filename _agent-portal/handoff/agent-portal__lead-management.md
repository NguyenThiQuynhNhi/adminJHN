# Leads (Lead Management CRM) (`lead-management.html`)

**Purpose:** A lead-management CRM for the agent: browse the lead list, open a lead's detail (pipeline + read-only sections + activities/comments), and edit a lead through a full form. Three views swap in place (List / Detail / Edit). All data is hardcoded demo content; nothing persists.

**Access:** Sidebar → Workspace → Leads.

---

## Layout & structure

A top nav strip (search "Search leads, properties, contacts…" + icon buttons: Add → Edit screen, Notifications, Profile, Settings, Apps) and three screens toggled via a `.hidden` class:

- **Screen 1 — List** (default).
- **Screen 2 — Detail.**
- **Screen 3 — Edit.**

(The file carries sidebar `.sb-*` CSS but does not render its own sidebar; only the `.main` column is shown.)

---

## List screen

**Filter bar:**
- Intent pill toggle **To Buy / To Rent** (`setIntent`).
- Location text input.
- **Status** select: (blank) / New / Assigned / Converted / In Progress.
- **Price Range** select: ¥0 – ¥2M / ¥2M – ¥5M / ¥5M+.
- **Property Type** select: House / Apartment / Office.

(The location/select filters are visual only — not wired to the render.)

**Table columns:** checkbox · **Contact Name** · **Property Type** · **Enquiry Date** · **Net Follow Up Date** · **Status** · **Owner** · **Actions**. Headers are sortable (`sortBy` on name/type/enquiry/follow/status/owner, asc/desc toggle). Row actions: edit (pen) and delete (trash → confirm → toast). Row click opens Detail.

**Pagination:** rows-per-page cycles 10 → 25 → 50 (`cycleRows`); "Showing X to Y of 100 entries"; up to 5 numbered page buttons + prev/next. (`TOTAL = 100`, but only 10 demo leads exist in `LEADS`.)

---

## Detail screen

- Header stat blocks: "Looking for" = House, "Interest" = To Buy, "Budget" = ¥2,000,000.
- **Pipeline stages** (clickable, set current stage + toast): New, Assigned, Contact, Viewing, Proposal, Negotiation, Asleep, Closed Won, Closed Lost (default active = Proposal).
- Read-only KV sections: **Details**, **Source Details**, **Locations**, **Budget & Necessities** (with doc counts Leads Files / KYC Documents / VIP Documents = 0), **Main Features**, **Say Hello** (contact info).
- Right panel: **Activities** list ("View All") and **Comments** (textarea "Press Enter to Submit", sample comment, "View All").
- Bottom tab tables (`detailTab`): **Matching Properties** (filters + empty state "No entries were found"), **Offers** (columns: Property, Offer Price, Offer Date Sent, Counteroffer Price, Counteroffer Date Sent, Actions; 1 sample row), **Agreements** (Ref, Property, List Selling Price, Final Selling Price, Assigned To; empty), **Related Leads** (Contact Name, Enquiry Date, Created, Status, Owner, Budget from, Budget to; empty).
- **"More" menu** (dropdown popover): Duplicate, Archive, Delete (Delete confirms then toast).
- **"Add activity"** popover: Arrange Viewing, Log Call, Add Note.

---

## Edit screen

Cancel / Save buttons; sections and fields:

- **Details:** Contact Name\* (combo), Status\* (New/Assigned/Proposal/Negotiation/Closed Won), Owner, Enquiry Date, Next Follow Up Date, Enquiry Type (House/Apartment/Office), Enquiry Subtypes (Villa/Townhouse).
- **Source Details:** Source (Direct/Website/Referral), Direct Source (Walk-In/Phone/Email), Website URL, Campaign, Broker/External Agent, Source Description.
- **Locations:** Location input method (From list / Draw on map / Post code), Locations.
- **Budget & Necessities:** Transaction Type (To Buy/To Rent), Properties, Projects, List Selling Price From/To, Leads Files / KYC Documents / VIP Documents, Description.
- **Main Features:** New Build, Construction Stage, Bedrooms From/To, Bathrooms From/To, Internal/Covered/Plot/Total Area From/To, Air Condition, Furnished, Elevator, Pets Allowed, Private Swimming Pool, Title Deeds.

Save → toast "Lead saved successfully" then returns to Detail (~400ms).

---

## Modals / popovers

No backdrop modals; uses dropdown popovers (More menu, Add-activity). Deletes use the toast confirm flow.

## Notifications (toasts, bottom-right, ~2.6s)

"Duplicate lead (demo)", "Archive lead (demo)", "Deleted (demo)", "Status: {Stage}", "{ActivityType} added", "Comment added", "Showing all activities (demo)", "Showing all comments (demo)", "Add offer (demo)", "Lead saved successfully" (success).

## Persistence

None. In-memory arrays only (`OWNERS`, `LEADS`, `STAGES`); resets on reload. No `parent.frame` navigation and no external page links — navigation is internal screen switching.
