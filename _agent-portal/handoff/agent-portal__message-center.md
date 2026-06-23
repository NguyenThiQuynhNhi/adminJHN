# Message Center — Broadcast / Campaign Center (`message-center.html`)

**Purpose:** The agent's broadcast/campaign center: create and manage message campaigns, manage reusable templates, configure automated messages, and review delivery analytics. Audiences are **Admin / Client** (not Agent/Client). Single-page app with a left nav and 4 screens. Loads Chart.js (CDN) and the shared `automation-catalog.js`.

**Access:** Sidebar → Messages → Message Center.

---

## Left nav — 4 screens

**Message Campaigns** (default) · **Message Templates** · **Automations** · **Delivery Analytics**.

## Audience model = Admin / Client

Confirmed throughout: campaign filter (All Audiences / Admin / Client / Custom Group); builder Step 2 radios labelled **All Clients / Admin Announcement / All (Clients + Admin) / Custom Group** (note: the internal radio `value` attributes are legacy `all_users`/`all_agents`/`all_leads`, but the labels/model are Admin/Client); create-group "Audience base" radios Client (default) / Admin / Both; analytics audience labels Admin / Client / Custom Group.

---

## Screen 1: Message Campaigns

- Header button **New Message Campaign**. Filters: search ("Search campaigns..."), status (All Status / Sent / Scheduled / Draft), audience.
- **Admin announcements are pinned to the top** — `renderCampaigns()` stable-sorts `audType === "Admin"` rows to the top; pinned rows get a beige background and a gold thumbtack (title "Pinned admin announcement").
- Table columns: **Campaign Name, Audience, Status, Scheduled, Sent, Delivered, actions**. Status badges: Sent (green) / Scheduled (blue) / Draft (grey). Row actions: View, Edit, Recreate, Delete.
- Pagination: `PAGE_SIZE = 50`; data padded to 60 demo campaigns. Count "Showing X–Y of N campaigns". Empty "No campaigns found."

### Campaign Builder — 5 steps

Step labels: **Details, Audience, Message, Schedule, Review**. Title "New Message Campaign" / "Edit Campaign".
- **Details:** Campaign Name (required, error "Campaign name is required."), Description.
- **Audience:** "Select your audience" — the 4 radios above; Custom shows a group picker (search + checkboxes from synthetic segments + shared lead groups, "Create new group" link). Live "Estimated recipients: ~N" (All Clients ~1,240; Admin Announcement ~430; All ~1,670; Custom = sum of selected).
- **Message:** "Compose your message", note "Delivered as an in-app chat message." Rich text editor (bold/italic/underline/H2/lists/link/image/Insert property/Insert agency/Insert variable), variable chips, live in-app preview, and a "Use a template" row.
- **Schedule:** "When should this be sent?" — Send immediately (after review) / Schedule for specific date & time / Recurring (Frequency Daily/Weekly/Monthly + time + optional end date). Note "Timezone: JST (UTC+9)".
- **Review:** "Review & launch" — summary (name, audience+reach, "Channel: In-app chat message", scheduled, message preview).
- Actions: Back / Next; on Review, **Save as Draft** and **Launch Campaign**.

### Variables & entity pickers

Variables: `{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}`. `{property_name}` opens the **Property Picker** modal (filters: search, Listing Type, Property Type, Prefecture, City, Price min/max; grid/table views; 32 seeded properties; toast "Property inserted."); `{agent_name}` opens the **Agency Picker** modal (filters: search, Status, Plan, Service Area, Language, Specialism; 22 seeded agencies; toast "Agent inserted."); the others insert literally.

---

## Screen 2: Message Templates

- Header **New Template**. Rows: name, category chip (Automation / Campaign), "Last used: …", edit/delete on hover. 5 seeded templates (New Property Alert, Re-engagement Message, Price Drop Notification, Welcome Message, Monthly Portfolio Summary).
- Editor: Template Name (required, "Template name is required."), Category (Automation / Campaign), Message Body (RTE), Tags. Buttons Cancel / Save Template.
- Toasts: "Template saved", "Template deleted", "Template applied". Delete uses `confirm('Delete template "{name}"? This cannot be undone.')`.

## Screen 3: Automations ("Automated Messages")

- Catalog-driven (from `automation-catalog.js`), showing only triggers where `chat === "O"`. Filters: search ("Search by trigger name"), status (All / Active / Inactive), count "N trigger(s)".
- Table columns: **Active, Trigger, Timing, Admin Can Disable, edit**. "Admin Can Disable" shows "Admin can disable" or "Required" (required triggers have a locked toggle: "This notification is required and cannot be disabled.").
- Toggling → toast "{name} enabled" / "{name} disabled".
- Edit drawer (right slide-in): ID, name, Timing, Channels (Chat/Email O/X badges), Email Pattern (+ description), editable **Chat Body** with the 4 variable chips. Buttons Save / Cancel / Restore default. Toasts "Automation saved", "Restored to default". Unsaved-changes guard "You have unsaved changes. Discard them?".

## Screen 4: Delivery Analytics ("Message Delivery Analytics")

- Card "Campaign Delivery Detail", note "Showing sent message campaigns only." Filters: search, range (All time / Last 30 days / Last 90 days / Custom + from/to), audience (Admin / Client / Custom Group).
- Table columns: **Campaign Name, Audience, Sent Date, Recipients, Read, Read Rate, Actions**. Recipients header tooltip "Actual number of recipients at send time. Users who joined later are not included." 3-state sortable columns (default Sent Date desc). Recurring campaigns expand into per-send rows. Read-rate pills: green ≥50%, amber ≥30%, red below. Actions: "Recreate" (jumps to the builder; toast 'Recreated from "{name}". Adjust and launch when ready.').
- Second card "Delivery Trend (Last 30 Days)" — Chart.js line chart (Sent vs Delivered).

> KPI card styles (`.kpi`/`.kpi-row`) exist in CSS but **no KPI cards are actually rendered** in any screen.

---

## Modals

- **Create new group** — Group name (required), Audience base (Client / Admin / Both), optional Filter (Plan type / Registration date / Activity level) + value. Persists to shared `yuushiLeadGroups` localStorage (Admin → `agent`, else `end_user`). Toast 'Group "{name}" created successfully.'
- **Property Picker** and **Agency Picker** (above).
- **Automation edit drawer** (above).

## Notifications (toasts)

"Draft saved successfully.", "Message campaign launched successfully.", "Campaign deleted", 'Recreated from "{name}". Adjust and launch when ready.', "Property inserted.", "Agent inserted.", "Template saved", "Template deleted", "Template applied", "{name} enabled" / "{name} disabled", "Automation saved", "Restored to default", 'Group "{name}" created successfully.'

## Persistence

- Custom groups persist to shared `localStorage` key `yuushiLeadGroups` (shared with Admin Messages and Lead Management).
- Automation per-trigger drafts persist via `automation-catalog.js` under `yuushi.automations`.
- Campaigns/templates are in-memory and reset on reload.

> **Drift note:** in the builder, the audience radio `value` attributes remain legacy (`all_users` / `all_agents` / `all_leads`) even though the labels/model are Client / Admin — worth flagging for maintainers.
