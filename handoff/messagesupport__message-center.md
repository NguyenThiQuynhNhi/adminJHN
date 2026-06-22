## Message Center

**Purpose:** A single admin workspace for the in-app **chat** communication channel. From here an admin can: (1) build and send chat message campaigns to platform audiences, (2) create and manage reusable message templates, (3) configure the platform's library of automated chat messages (101 system triggers such as "Payment successful" or "Viewing reminder"), and (4) review delivery analytics. Note: this screen edits the **chat** side of automations only; the matching email side lives in the separate Email Center screen but shares the same underlying trigger catalog.

**Access:** Admin portal only. Reached from the left sidebar under **SUPPORT & COMMUNICATION → "Message Center"**. There is no per-feature permission gating in the mockup — any admin who can open the screen can use every tab.

---

### Layout & Structure (left nav tabs + screens)

The screen is split into two columns:

- **Left rail (always visible):** A heading "Message Center" followed by four navigation items. Clicking one swaps the content panel on the right; the page URL never changes and nothing reloads. Only one panel is shown at a time. "Message Campaigns" is selected by default when the screen first opens.
- **Right content panel:** Shows whichever of the four tab screens is active.

The four tabs (in order):

1. **Message Campaigns** (chart-column icon) — default tab. Has two views: a campaign **list** and a 5-step campaign **builder** that replaces the list in place.
2. **Message Templates** (clipboard icon) — has two views: a template **list** and a template **editor** that replaces the list in place.
3. **Automations** (lightning-bolt icon), titled "Automated Messages" inside the panel — a single flat table of all chat triggers, plus a slide-in **edit drawer** from the right.
4. **Delivery Analytics** (line-chart icon) — a delivery-detail table plus a 30-day trend line chart.

Shared overlays exist regardless of tab: the **Create New Group** modal (opened from the campaign builder), the **Property Picker** and **Agency Picker** modals (opened from the message editor), and the **Automation edit drawer** (opened from the Automations tab). A toast notification strip appears bottom-center for confirmations.

---

### Every Element

#### Tab 1 — Message Campaigns (list view)

- **Page title:** "Message Campaigns".
- **Button "New Message Campaign"** (primary, plus icon) — opens the campaign builder in "New Message Campaign" mode.
- **Filter bar:**
  - **Search box** — placeholder "Search campaigns...". Filters the list live as you type (matches the campaign name).
  - **Status dropdown** — options verbatim: "All Status", "Sent", "Scheduled", "Draft".
  - **Audience dropdown** — options verbatim: "All Audiences", "End User", "Agent", "Custom Group".
- **Campaigns table** — columns: "Campaign Name", "Audience", "Status", "Scheduled", "Sent", "Delivered", and a blank actions column. Status shows as a colored badge (green = Sent, blue = Scheduled, grey = Draft). Sent/Delivered numbers are formatted with thousands separators.
- **Per-row actions menu** — a "⋯" (kebab) button opens a small menu with four items: "View", "Edit", "Recreate", "Delete" (Delete shown in red). ("Recreate" replaces the former "Duplicate".) Opening one row's menu closes any other open menu. Clicking anywhere off the menu closes it.
- Seed data (4 named demo campaigns): "Dormant User Re-engagement" (End User — Dormant Investors, Sent, 2026-04-05 14:00, sent 1,240 / delivered 1,180); "Agent Monthly Reminder" (Agent — Premium Plan, Scheduled, 2026-04-25 09:00, 0/0); "New Listing Alert" (End User — All Investors, Sent, 2026-04-10 10:30, 850/820); "Premium Agent Outreach" (Agent — All Agents, Draft, "—", 0/0). These are followed by deterministic auto-seeded filler campaigns so the list totals **60 campaigns** (exercises pagination).
- **Pagination (universal 50/page):** a result-count line above the table reads "Showing {start}–{end} of {total} campaigns" ("Showing 0 of 0 campaigns" when empty). Controls below the table: Previous · numbered pages (max 7, with "…" for gaps) · Next; the current page is highlighted in gold; Previous is disabled on page 1 and Next on the last page; the row is hidden when ≤50 rows match. Page size is fixed at 50. The page resets to 1 on search, status/audience filter change, and tab switch back to Campaigns; it is **not** persisted across reload but is **preserved** while opening/closing the builder. (The Delivery Analytics table and audience/property/agency pickers are unaffected.)

#### Tab 1 — Campaign builder (5 steps)

Shown in place of the list. Top of builder:

- **Back link** "Back to campaigns" (left arrow) — returns to the list (no confirmation, no save).
- **Title** — "New Message Campaign" for a new one, or "Edit Campaign" when opened from View/Edit.
- **Step indicator** — five steps labeled "Details", "Audience", "Message", "Schedule", "Review". The current step is highlighted; completed steps show a green checkmark.

**Step 1 — Details:**

- "Campaign Name" (required) — text input, placeholder "e.g. Spring Investor Outreach".
- "Description" (optional) — textarea, placeholder "Optional notes about this campaign...".
- (The former "Campaign Type" three-card selector — One-time / Recurring / Triggered — has been **removed**. Step 1 now holds only Campaign Name and Description; builder validation/save no longer depend on a campaign-type field. Recurring vs one-time is determined later in Step 4 — Schedule.)

**Step 2 — Audience:**

- Heading "Select your audience".
- Radio options (verbatim): "All End Users" (default selected), "All Agents", "All Leads (End Users + Agents)", "Custom Group".
- **Group picker** (appears only when "Custom Group" is chosen): a search box (placeholder "Search groups..."), a checkbox list of groups with member counts, a "Create new group" link (opens the Create Group modal)
- **Shared Lead Management groups:** the Custom-Group picker reads and writes the **same `localStorage` key Lead Management uses — `yuushiLeadGroups`**. The picker list is the built-in synthetic segments **plus** every group stored under `yuushiLeadGroups` (each lead group is shown with its member count = number of `leadIds`). Groups created from the Create New Group modal here are saved back to `yuushiLeadGroups` (shape `{ id, name, entityType, leadIds:[], createdDate }`, entityType `agent` when Audience base = Agent, otherwise `end_user`) so they appear in Lead Management too. No separate Message-Center group key is used.
- **Reach note** — "Estimated recipients: ~1,240" (recalculates as audience/group selections change). Fixed estimates: All End Users = 1,240; All Agents = 430; All Leads = 1,670; Custom = sum of selected groups' member counts.
- Seed synthetic segments: "End User — Dormant Investors" (342), "End User — All Investors" (1,240), "End User — Premium Members" (89), "Agent — Premium Plan" (156), "Agent — All Agents" (430), "Agent — New Sign-ups" (67), "VIP Buyers — Tokyo" (25), "High-Intent Leads Q2" (58) — these are appended with any shared `yuushiLeadGroups` entries.

**Step 3 — Message (compose):**

- Heading "Compose your message" with sub-note "Delivered as an in-app chat message."
- **Rich text editor** (see "Rich Text Editor" below). Toolbar now also has an **Insert property** button (building icon, opens the Property Picker) and an **Insert agency** button (user-tie icon, opens the Agency Picker).
- **Template library** — heading "Use a template" with a horizontal row of template cards (name, an 80-character body preview, and a "Use" button). Clicking "Use" loads that template's body into the editor.

**Step 4 — Schedule:**

- Heading "When should this be sent?".
- Radio options (verbatim): "Send immediately (after review)" (default), "Schedule for specific date & time", "Recurring".
  - If "Schedule…": shows a Date picker and a Time picker.
  - If "Recurring": shows "Frequency" dropdown (options: "Daily", "Weekly", "Monthly"), a Time picker, and "End date (optional)".
- Static note: "Timezone: JST (UTC+9)".

**Step 5 — Review & launch:**

- Heading "Review & launch".
- A summary card listing: Campaign name; Audience + estimated recipient count; Channel ("In-app chat message"); Scheduled (e.g. "Immediately", or the chosen date/time + " JST", or "<Frequency> at <time> JST"); Message preview (first 100 characters of the body, or "(empty)").

**Builder action buttons** (bottom, change per step):

- Step 1: "Next" only.
- Steps 2–4: "Back" + "Next".
- Step 5: "Save as Draft" + "Launch Campaign".

#### Tab 2 — Message Templates (list view)

- **Page title:** "Message Templates".
- **Button "New Template"** (primary, plus icon) — opens the template editor in "New Template" mode.
- **Template list** — each row shows the template name, a category chip ("Automation" or "Campaign"), right-aligned "Last used: <value>", and on hover two icon buttons: Edit (pen) and Delete (trash). Clicking the row body also opens the editor.
- Seed templates (5): "New Property Alert" (Automation, "Yesterday"), "Re-engagement Message" (Campaign, "3 days ago"), "Price Drop Notification" (Automation, "1 week ago"), "Welcome Message" (Campaign, "2 weeks ago"), "Monthly Portfolio Summary" (Automation, "1 month ago").

#### Tab 2 — Template editor

- **Back link** "Back to Templates".
- **Title** — "New Template" or "Edit Template".
- "Template Name" (required) — text input, placeholder "e.g. New Property Alert".
- "Category" (required) — dropdown, options verbatim: "Automation", "Campaign".
- "Message Body" (required label) — rich text editor (same component as the campaign builder).
- "Tags" (optional) — text input, placeholder "comma, separated, tags". (Note: this field is displayed but is **not saved** — it is discarded on Save.)
- Buttons: "Cancel" (returns to list, no save) and "Save Template".

#### Tab 3 — Automations ("Automated Messages")

- **Page title:** "Automated Messages".
- **Filter bar:**
  - **Search box** — placeholder "Search by trigger name". Matches against both the trigger name and the trigger ID.
  - **Status dropdown** — options verbatim: "All status", "Active", "Inactive".
  - **Count text** (right-aligned) — e.g. "42 triggers" (or "1 trigger" singular).
- **Triggers table** — columns: "Active", "Trigger", "Timing", "Admin Can Disable", and a blank edit column. Each row:
  - **Active** — an on/off toggle switch. Some are locked (dimmed, not clickable) — see locked rule below.
  - **Trigger** — the trigger's display name in bold plus its ID underneath (e.g. "Payment successful" / "PAY-001").
  - **Timing** — when the message fires (e.g. "Immediate", "24 hours before viewing", "Weekly", "30 days after last review").
  - **Admin Can Disable** — a blue badge "Admin can disable" if the trigger is user-configurable, or a grey badge "Required" if it is not.
  - **Edit column** — a pen icon button that opens the edit drawer. Clicking anywhere on the row (except the toggle) also opens the drawer.
- The table lists only triggers that have a chat channel (chat = "O"). Triggers that are email-only do not appear here.

This tab is driven by the shared automation catalog of 101 triggers — see "The 101-trigger catalog & locked rule" below.

#### Tab 4 — Delivery Analytics

- **Page title:** "Message Delivery Analytics".
- **Card "Campaign Delivery Detail"** — lists **only status = Sent message campaigns** (Draft / Scheduled excluded). Sub-note: "Showing sent message campaigns only." This is an in-app **chat** channel, so it tracks **Read** (opened), **not** clicks — there are no Click columns.
  - **Live filters (no Apply button):**
    - **Time range** — dropdown: "All time" (default), "Last 30 days", "Last 90 days", "Custom". Choosing "Custom" reveals From / To date inputs. (Range is evaluated against each campaign's Sent Date; "today" = 2026-06-21.)
    - **Audience** — "All Audiences" (default), "End User", "Agent", "Custom Group".
    - **Search box** — matches campaign name, case-insensitive.
  - **Columns (in order):** Campaign Name (sortable), Audience, Sent Date (sortable, **default desc**), Recipients (sortable), **Read** (sortable — recipients who opened/read), **Read Rate** (sortable; pill green ≥50 / amber ≥30 / red <30), Actions (a "Recreate" button). The former **Delivered** and **Delivery Rate** columns were removed — an in-app chat message either reaches the user or not, so the meaningful metric is whether the recipient actually read it. **Read Rate is now Read ÷ Recipients** (no longer Read ÷ Delivered).
  - **Sticky Actions column + horizontal scroll:** the Actions (Recreate) column is pinned to the right edge (`position:sticky; right:0`) with a subtle left border so it stays visible while the rest of the table scrolls sideways; the table is wrapped in an `overflow-x:auto` container and uses per-column min-widths (Campaign Name 200px, ellipsis with full name on hover via `title`; Audience 100; Sent Date 110; Recipients 100; Read & Read Rate 120 each; Actions 110).
  - **Recipients header tooltip** (`title`): "Actual number of recipients at send time. Users who joined later are not included."
  - **Sorting:** 3-state per column (▲ asc → ▼ desc → unsorted/back to default Sent Date desc), one column at a time; default sort is Sent Date descending.
  - **Recurring campaigns (hybrid):** a recurring campaign shows ONE aggregate row with an expand arrow (▶ collapsed / ▼ expanded). Aggregate: Sent Date cell reads "since {first-send date}", Recipients/Read are the **sums** of all sends, Read Rate is the weighted average (sum read ÷ sum recipients). Expanding reveals indented per-send rows (each send's own Recipients, Read, Read Rate); per-send rows have **no** Recreate button (only the aggregate does). One-time campaigns are a single row with no arrow.
  - **Seed (Sent only, last 90 days):** 6 one-time campaigns — "Dormant User Re-engagement" (End User, 2026-06-12, 1,240/1,180/742), "New Listing Alert" (End User, 2026-06-05, 850/820/503), "Premium Agent Briefing" (Agent, 2026-05-28, 156/150/96), "Spring Open House Invites" (Custom, 2026-05-15, 25/25/18), "Price Drop Notice" (End User, 2026-04-22, 1,240/1,090/410), "Agent Compliance Reminder" (Agent, 2026-04-08, 430/180/40) — plus 1 recurring "Weekly Market Digest" (End User, since 2026-04-13) with 4 per-send rows (2026-05-25 → 2026-06-15).
  - **Empty state:** "No sent campaigns found." when filters match nothing.
- **Card "Delivery Trend (Last 30 Days)"** — a line chart with two series, "Sent" (navy) and "Delivered" (terracotta), legend at the bottom. Demo data spans 10 labeled points May 24 → Jun 2: Sent [120, 180, 150, 210, 240, 190, 260, 300, 280, 320]; Delivered [110, 170, 145, 200, 230, 182, 250, 288, 270, 308].

**Recipient rule:** the Recipients value (and the header tooltip) conveys the actual number of recipients at send time; users who joined the audience later are not included.

#### Rich Text Editor (used in campaign Step 3 and the template editor)

- **Toolbar buttons:** Bold ("B"), Italic ("I"), Underline ("U"), Heading ("H2"), Bullet list, Numbered list, Link, Insert image, **Insert property** (building icon), **Insert agency** (user-tie icon), Insert variable (code icon, opens a small variable dropdown).
- **Editing area** — placeholder "Write your message here...".
- **Live preview** — labeled "In-app message preview", renders the message as a chat bubble.
- **Variables — unified to exactly 4:** `{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}`. (`{first_name}`, `{last_name}`, and `{date}` have been removed everywhere — toolbar dropdown, side panel, automation drawer chips, and all seed message bodies.) Both the toolbar dropdown and the "Insert Variables" side panel show these 4 chips. **Click behavior:**
  - `{property_name}` → opens the **Property Picker** modal (does not insert a raw token).
  - `{agent_name}` → opens the **Agency Picker** modal.
  - `{full_name}` and `{platform_name}` → inserted directly as literal tokens at the cursor.
- **Link button** prompts "Enter URL:" (prefilled "https://"). **Insert image** prompts "Enter image URL:" (prefilled "https://").

#### Property Picker (opened by the `{property_name}` chip or the toolbar "Insert property" button)

A large modal that mirrors the Property Management list. Usable repeatedly within one compose session.

- **Filters** (live, no Apply): Search ("Search by name or ID" — matches Property Name **and** Property ID only), Listing Type (All / For Sale / For Rent / Sale + Rent), Property Type, Prefecture, City (re-populates from the chosen prefecture), Price min (¥M), Price max (¥M).
- **View toggle** — Grid (default) and Table, both functional.
- **Data** — only Active/Published properties (deterministic seed of **32**, no `Math.random`): mixed property types, 8 prefectures, including **6 New Development** listings (badged "New Dev", IDs `PRJ-…`). New Development listings are included inline, with no Group separation.
- **Pagination** — 10 per page; the pager is hidden when ≤10 results. A result count ("N properties") is always shown.
- **Selection** — single-select radio (grid card or table row). Footer reads "Selected: {name}" or "No property selected".
- **Insert** — "Insert property" inserts the property name at the cursor, closes the modal, and shows toast "Property inserted." Cancel / × / Esc close without inserting.

#### Agency Picker (opened by the `{agent_name}` chip or the toolbar "Insert agency" button)

Same modal UX as the Property Picker, mirroring Agent Management filters.

- **Filters** (live): Search ("Search by name or ID"), Status (Active / Suspended / Withdrawn), Plan (Free / Bronze / Silver / Gold), Service Area, Language, Specialism.
- **View toggle** — Grid (default) / Table.
- **Data** — deterministic seed of **20 agencies** (mixed status/plan/area/language/specialism).
- **Pagination** — 10/page, pager hidden when ≤10, result count ("N agencies") shown.
- **Selection** — single-select radio; footer "Selected: {name}" / "No agency selected".
- **Insert** — "Insert agency" inserts the agency **name** at the cursor but keeps an internal data reference (the agency id is recorded in `insertedAgentRefs`), closes the modal, and shows toast "Agent inserted."

---

### Modals & Popups

#### Create New Group modal (opened from campaign builder Step 2)

- **Title:** "Create new group".
- "Group name" (required) — text input, placeholder "e.g. VIP Buyers — Tokyo".
- "Audience base" — radio options verbatim: "End User" (default), "Agent", "Both". The choice maps to the stored group's `entityType` ("Agent" → `agent`, otherwise `end_user`).
- "Filter (optional)" — a dropdown plus a free-text value box. Dropdown options verbatim: "— None —", "Plan type", "Registration date", "Activity level". (Not stored.)
- Buttons: "Cancel" and "Save Group".
- On open, focus jumps to the Group name field. Closes on Cancel, on Save, or via the Esc key. There is **no** backdrop-click-to-close and **no** unsaved-changes warning. **On Save the group is persisted to the shared `yuushiLeadGroups` localStorage store** (`{ id, name, entityType, leadIds:[], createdDate }`) with 0 members, immediately appears in the Custom-Group picker here, and is visible in Lead Management. Toast: 'Group "{name}" created successfully.'

#### Automation edit drawer (opened from the Automations tab)

Slides in from the right over a dimmed backdrop. Contents:

- **Header:** the trigger ID (small, e.g. "PROP-007") above the trigger name (e.g. "Viewing reminder"), and a "×" close button.
- **Read-only info block:**
  - "Timing" — the trigger's timing string.
  - "Channels" — shown as "Chat O · Email O" where each channel is a small circular badge containing "O" (green, enabled) or "X" (grey, not on that channel).
  - "Email Pattern" — the pattern letter in bold followed by its description, one of:
    - **A** — "Pattern A — Transactional confirmation, sent once when the action completes."
    - **B** — "Pattern B — Reminder / nudge, scheduled to follow up with the recipient."
    - **C** — "Pattern C — Time-sensitive alert or security / status warning."
    - **D** — "Pattern D — Engagement / marketing content (promotional or re-engagement)."
- **Editable area:**
  - "Chat Body" — a multi-line textarea, placeholder "Enter chat message…", prefilled with the saved (or default) chat text for this trigger.
  - "Insert variables:" — clickable chips that insert tokens into the Chat Body textarea at the cursor: `{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}` (the unified 4-variable set; `{date}` removed). In the drawer textarea these chips insert the literal token (the drawer is a plain textarea, not the rich-text editor, so the chips do not open the entity pickers). This 4-chip set is defined locally in the screen (`MC_AUTO_VARS`); the shared automation catalog (`automation-catalog.js` / `AUTO_VARS`) and the `yuushi.automations` localStorage store are **not** modified.
- **Footer:** "Save" button, "Cancel" button, and a "Restore default" link (right-aligned).
- **Closing behavior:**
  - "×", "Cancel", Esc key, or clicking the backdrop all close the drawer. If the Chat Body has unsaved edits, a confirm appears: "You have unsaved changes. Discard them?" — choosing Cancel keeps the drawer open.
  - "Save" closes the drawer immediately **without** the unsaved-changes prompt.
  - "Restore default" shows its own confirm (below) and, if confirmed, resets the Chat Body to the catalog default **without** closing the drawer.

---

### Conditional Display

- **Campaign builder vs. list:** the builder replaces the list when "New Message Campaign" / View / Edit is invoked, and the list returns on Back / Save as Draft / Launch.
- **Step visibility:** only the current builder step's fields are shown; the step indicator reflects progress.
- **Builder action buttons** change by step (Step 1: Next only; middle steps: Back + Next; Step 5: Save as Draft + Launch Campaign).
- **Group picker** is hidden until "Custom Group" is selected in Step 2.
- **Schedule sub-fields:** date/time fields appear only for "Schedule for specific date & time"; frequency/time/end-date fields appear only for "Recurring".
- **Template editor vs. list:** editor replaces the list when New Template / a row is clicked, list returns on Back / Cancel / Save.
- **Automations toggle locked state:** a trigger's toggle is dimmed and non-interactive when it is a locked/required trigger (see rule below); a tooltip explains why.
- **Admin Can Disable badge:** "Admin can disable" (blue) when the trigger is user-configurable, otherwise "Required" (grey).
- **Channel badges in the drawer:** each badge shows "O" or "X" depending on whether the trigger uses that channel.
- **Read Rate pill color** (green ≥50 / amber ≥30 / red <30) depends on the computed Read ÷ Recipients rate. (The old Delivery Rate pill no longer exists — that column was removed.)
- **Analytics custom date range:** From / To inputs appear only when Time range = "Custom".
- **Recurring analytics row:** shows an expand arrow (▶ / ▼); per-send rows are revealed only while expanded, and only the aggregate row has a Recreate button.
- **Property / Agency Picker:** Grid vs Table body swaps on the view toggle; the pager is hidden when ≤10 results; the footer selection label and the "Insert" enablement reflect the single radio selection. The Property Picker's City options re-populate from the chosen Prefecture.
- **Row action menus and variable dropdowns** are shown only when toggled open and auto-close on outside click or Esc.

---

### User Flows

**Create and launch a campaign:**

1. Click "New Message Campaign" → builder opens at Step 1.
2. Enter a Campaign Name, optionally add a description → click "Next". (If name is blank, the field shows an error and you cannot advance.)
3. Step 2: choose an audience (or "Custom Group" → tick groups, optionally create a new group) → the reach estimate updates → "Next".
4. Step 3: compose the message (type, format, insert variables, or apply a template) → "Next".
5. Step 4: choose Send immediately / Schedule / Recurring and fill any sub-fields → "Next".
6. Step 5: review the summary → click "Launch Campaign" (status becomes "Sent", toast "Message campaign launched successfully.", returns to list) **or** "Save as Draft" (status "Draft", toast "Draft saved successfully.", returns to list).

**Edit / view / recreate / delete a campaign:**

- Open a row's "⋯" menu → "View" or "Edit" opens the builder titled "Edit Campaign" prefilled with the name.
- "Recreate" (replaces "Duplicate") → opens the builder at **Step 1**, pre-filled with Name = "{Original} (Copy)" plus Description, Audience, and Message Body; schedule reset to "Send immediately"; treated as a **new, independent** campaign (saved as Draft when saved — not linked to the original). Toast: `Recreated from "{Original Name}". Adjust and launch when ready.`
- "Delete" → removes the row immediately (no confirm); toast "Campaign deleted".

**Recreate from Analytics:**

- Each Analytics row (and each recurring **aggregate** row — not per-send rows) has a "Recreate" button. Clicking it switches to the Message Campaigns tab and opens the builder pre-filled exactly as above (Name "{Original} (Copy)", Audience derived from the campaign's audience type, Body from the campaign), with the same toast.

**Manage templates:**

- "New Template" → editor → enter name (required), category, body, (tags ignored) → "Save Template" → toast "Template saved", returns to list. New templates also appear as cards in the campaign builder library.
- Click a row or its Edit icon → editor titled "Edit Template" prefilled → Save updates it.
- Delete icon → confirm "Delete template \"<name>\"? This cannot be undone." → if confirmed, removed; toast "Template deleted".

**Configure an automation:**

- Toggle a trigger's switch → if it's user-configurable, the state flips and a toast says "<trigger name> enabled" / "<trigger name> disabled". If it's locked, the toggle does nothing.
- Click a row (or its pen icon) → edit drawer opens.
- Edit the Chat Body (type, insert variables) → "Save" → toast "Automation saved", drawer closes, list refreshes.
- "Restore default" → confirm → if accepted, Chat Body reverts to the catalog default; toast "Restored to default" (drawer stays open).
- Close without saving with unsaved edits → confirm "You have unsaved changes. Discard them?".
- Search/filter the table to find a trigger; the count text updates to reflect matches.

**View analytics:**

- Open the Delivery Analytics tab → the delivery-detail table and the 30-day trend chart render.

**Persistence note:** automation changes (active state + chat body) are saved to the browser (localStorage key `yuushi.automations`) and persist across reloads and across the Email Center, which shares the same store. Custom audience groups created in the builder persist to the shared `yuushiLeadGroups` store (the same one Lead Management uses). Campaign, template, and analytics data are in-memory demo data and reset on reload.

---

### Validation

- **Campaign Name** — required to leave Step 1. If blank/whitespace, the field is highlighted and the inline error "Campaign name is required." appears; "Next" does nothing until filled. No other builder field is validated (audience, message body, schedule date/time can all be left empty; missing date/time appear as "[date]" / "[time]" placeholders in the Step 5 review). Validation/save no longer reference a Campaign Type field (removed).
- **Template Name** — required to save. If blank, the field is highlighted with the inline error "Template name is required." and Save is blocked. Category defaults to a valid value; Message Body is labeled required but is **not enforced** (a template can be saved with an empty body); Tags are not validated and not saved.
- **Create Group — Group name** — required. If blank, focus returns to the field (no error message is shown). No other group field is validated.
- **Automations** — no field validation; the Chat Body may be saved empty.
- There are no format checks (no email, URL, or date-range validation anywhere on this screen).

---

### Empty States

- **Campaigns table** (no rows match filters): a single centered row "No campaigns found."
- **Automations table** (no triggers match search/filter): a single centered row "No triggers match your filters."
- **Templates list:** None. (If the list were empty it would simply render nothing — there is no explicit empty-state message.)
- **Analytics table:** "No sent campaigns found." when the live filters (time range / audience / search) match no Sent campaigns. The trend chart always renders its seeded demo data.

---

### Notifications & Feedback

**Toasts** (bottom-center, auto-dismiss after 3 seconds) — exact text (no "(demo)" wording anywhere):

- `Recreated from "{Original Name}". Adjust and launch when ready.`
- "Property inserted."
- "Agent inserted."
- 'Group "{name}" created successfully.'
- "Message campaign launched successfully."
- "Draft saved successfully."
- "Campaign deleted"
- "Template applied"
- "Template saved"
- "Template deleted"
- "<trigger name> enabled"
- "<trigger name> disabled"
- "Automation saved"
- "Restored to default"

**Confirmation dialogs** — exact text:

- Delete template: 'Delete template "<name>"? This cannot be undone.'
- Drawer close with unsaved edits: "You have unsaved changes. Discard them?"
- Restore automation default: "Restore this trigger's message to the catalog default? Your edits will be replaced."

**Prompt dialogs** (rich text editor): "Enter URL:" (default "https://") and "Enter image URL:" (default "https://").

**Inline validation messages:** "Campaign name is required." and "Template name is required."

**Note:** Deleting a campaign does **not** ask for confirmation (it just deletes and toasts). There are no `alert()` popups anywhere on this screen.

---

### Navigation

- **Left rail tabs** switch between Message Campaigns, Message Templates, Automations, and Delivery Analytics. No URL change, no page reload; selecting Delivery Analytics initializes the chart.
- **In-place view transitions:** Campaigns list ↔ builder ("Back to campaigns"); Templates list ↔ editor ("Back to Templates"); Automations table → edit drawer; campaign builder Step 2 → Create Group modal.
- **Outbound links to other admin screens:** None. This screen is self-contained.

**The 101-trigger catalog & locked rule (for the Automations tab):**

- The Automations tab is powered by a shared catalog of **101 triggers** (IDs from AUTH-001 through ADM-001), grouped into 12 categories: Authentication (AUTH), Security (SEC), Account (ACCT), Property (PROP), Messaging (MSG), Leads (LEAD), Payment (PAY), Subscription (SUB), Reports (REP), Violation (VIO), Engagement (ENG), and Admin (ADM). Each trigger records its name, category, timing, whether it uses the chat channel, whether it uses the email channel, whether an admin can disable it ("userConfig" Yes/No), and an email pattern (A/B/C/D). This Message Center tab shows only the triggers that have a chat channel; the rest appear in the Email Center.
- **Locked rule:** a trigger is **locked ON** (toggle dimmed and non-clickable) when it is **not admin-disable-able (userConfig = No)** AND it belongs to an **Authentication, Security, Payment, or Subscription** category (i.e., critical auth/security/monetization messages). Locked triggers always start active and cannot be turned off; hovering the disabled toggle shows the tooltip "This notification is required and cannot be disabled." Triggers that are userConfig = No but in other categories show the grey "Required" badge but are not force-locked the same way (their badge says Required; the lock only dims the toggle for the four critical categories).
- **Persistence:** each trigger's active state and edited chat body are stored in localStorage under `yuushi.automations` (shape `{ [triggerId]: { active, chatBody, emailSubject, emailBody } }`). The store seeds defaults on first load (deriving default message text from the trigger name and pattern tone), is forward-compatible (adds any newly introduced trigger IDs on later loads), and is shared with the Email Center screen so edits made in one are reflected in the other.
