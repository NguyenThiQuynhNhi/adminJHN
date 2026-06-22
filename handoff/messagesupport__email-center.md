## Email Center

**Purpose:** A single admin console for everything email on the YUUSHI real-estate platform. From one screen an admin can (1) build and manage outbound marketing **Email Campaigns** through a 5-step wizard, (2) create and maintain reusable **Email Templates**, (3) review and edit the platform's **Automated Emails** (the transactional / triggered emails the system sends automatically, e.g. "Payment successful"), and (4) read **Delivery Analytics** for campaign performance. Demo build: all data is mock; campaigns and templates live only in browser memory and are lost on refresh; automated-email edits persist in local storage (`yuushi.automations`) and custom lead groups persist in the shared local-storage key `yuushiLeadGroups`.

**Access:** Admin sidebar → SUPPORT & COMMUNICATION → "Email Center". The page opens to the **Email Campaigns** tab by default. There is no per-role gating in the mockup; assume admin-only in production.

---

### Layout & Structure

The screen has its own internal two-column layout (it does not use the main app sidebar for its sub-navigation):

- **Left rail (its own mini-sidebar):** title "Email Center" plus four nav items, each switching the right panel. Only one panel is visible at a time; switching does NOT change the browser URL.
  1. Email Campaigns (envelope icon) — default/active on load
  2. Email Templates (clipboard icon)
  3. Automated Emails (lightning-bolt icon)
  4. Delivery Analytics (line-chart icon)
- **Right panel:** shows the content of the selected tab.
- **Overlays** (appear on top of everything, used across tabs): Create-Group modal, Insert-Property picker modal, Automation Edit drawer (slides in from the right), and a small toast message at bottom-center.

Each tab is described in full below. Tabs that have a "list view" and a "form/editor view" swap between them in place (the list disappears, the editor appears; a "Back" link returns).

---

### Every Element

#### TAB 1 — EMAIL CAMPAIGNS

**Campaign list view**

- **Page title:** "Email Campaigns".
- **Button "New Email Campaign"** (plus icon) — opens the 5-step campaign builder (blank/new).
- **Filter bar:**
  - **Search box** — placeholder "Search campaigns..."; filters the table live by campaign name as you type.
  - **Status dropdown** — options verbatim: "All Status", "Sent", "Scheduled", "Draft".
  - **Audience dropdown** — options verbatim: "All Audiences", "End User", "Agent", "Custom Group".
- **Campaigns table** — columns: "Campaign Name", "Audience", "Status", "Sent", "Open Rate", "Click Rate", "Conversion", and a final actions column (no header).
  - Status shows as a colored badge (green = Sent, blue = Scheduled, grey = Draft).
  - "Sent" is the recipient count with thousands separators; Open/Click/Conversion are computed live from each campaign's actuals (for a Recurring campaign they are the summed/weighted totals across all its sends).
  - **Click Rate "N/A":** Click Rate shows **"N/A"** when the campaign's saved email body HTML contains zero `<a href>` links (a campaign that has no clickable links cannot have a click rate). If the body has ≥1 link but zero clicks, it shows "0%". (A per-campaign helper counts `<a href` occurrences in the stored body HTML.)
  - **Row actions menu** (three-dots / kebab button at row end) opens a small menu with: "View", "Edit", "Recreate", "Delete" (Delete shown in red). "View" and "Edit" both open the builder for that campaign. **"Recreate"** opens the builder pre-filled to make an independent copy (see flow below). "Delete" removes the row. (The old "Duplicate" item was replaced by "Recreate".)
  - Seed rows (demo data): "Spring Japan Investment EDM" (End User, Sent, body has a link → real click rate); "Agent Monthly Performance Digest" (Agent, Sent, body has **no** link → Click Rate "N/A"); "New Build Showcase — Tokyo" (End User, Sent, has link); "Re-engagement: Dormant Investors" (Custom, Sent, has link); "Agent Plan Upgrade Offer" (Agent, Sent, **no** link → "N/A"); "Weekly Newsletter" (End User, Sent, **Recurring** with 4 sends, has link); "New Listing Spotlight — April" (End User, Scheduled, 0s); "Premium Agent Outreach" (Agent, Draft, 0s). These 8 named rows are followed by deterministic auto-seeded filler campaigns so the list totals **60 campaigns** (exercises pagination).
  - **Pagination (universal 50/page):** a result-count line above the table reads "Showing {start}–{end} of {total} campaigns" ("Showing 0 of 0 campaigns" when empty). Controls below the table: Previous · numbered pages (max 7, with "…" for gaps) · Next; the current page is highlighted in gold; Previous is disabled on page 1 and Next on the last page; the whole control row is hidden when ≤50 rows match. Page size is fixed at 50. The page resets to 1 on search, status/audience filter change, sort, and tab switch back to Campaigns; it is **not** persisted across reload but is **preserved** while opening/closing the builder. (Click Rate "N/A" / Recurring totals logic is unchanged.)

**Campaign builder (5-step wizard)** — appears in place of the list.

- **"Back to campaigns" link** (left arrow) — returns to the list. No "discard changes" warning.
- **Title:** "New Email Campaign" (new), "Edit Campaign" (editing existing via View/Edit), or "Recreate Campaign" (entered via Recreate).
- **Step indicator** — five labeled steps: "Details", "Audience", "Message", "Schedule", "Review". The current step is highlighted; completed steps show a checkmark.
- **Action bar (bottom):** "Back" button (shown on steps 2-5), "Next" button (shown on steps 1-4). On step 5 the buttons become "Save as Draft" and "Launch Campaign".

Step 1 — Details (only two fields):

- **Campaign Name** (required) — text input, placeholder "e.g. Spring Japan Property Update".
- **Description** (optional) — textarea, placeholder "Optional notes about this campaign...".

(The old "Campaign Type" cards — One-time / Recurring / Triggered — were removed: Triggered lives in the Automated Emails tab, and Recurring is configured in Step 4 Schedule, so the type field is no longer in the builder.)

Step 2 — Audience:

- Heading "Select your audience".
- Four radio choices: "All End Users" (default, est. 1,240 recipients), "All Agents" (430), "All Leads (End Users + Agents)" (1,670), "Custom Group".
- Choosing "Custom Group" reveals a **group picker**: a "Search groups..." box, a checkbox list of admin-created groups (each shows its name and member count), a "Create new group" link (opens the Create-Group modal)
  - **Shared groups:** this checkbox list reads the **same** browser localStorage key Lead Management uses — `yuushiLeadGroups` (NOT a private in-memory list). Each stored group has the shape `{ id, name, entityType ("end_user" | "agent" | "both"), leadIds[], createdDate }`; the member count shown is `leadIds.length`. Groups created here persist to that key, so they appear in Lead Management, Messages, and Message Campaigns too (and vice-versa). On first load a seed set is written if the key is empty.
  - Seed groups (written to `yuushiLeadGroups` if absent): "End User — Dormant Investors" (342), "End User — All Investors" (1,240), "End User — Premium Members" (89), "Agent — Premium Plan" (156), "Agent — All Agents" (430), "VIP Buyers — Tokyo" (25).
- **Estimated recipients** line — updates live; for Custom Group it sums the members of all checked groups.

Step 3 — Message (the compose step):

- Heading "Compose your email" + note "Delivered as an email to recipients' inboxes."
- **Subject line** (required) — text input, placeholder "e.g. Spring Japan Property Update — April Edition". Typing updates the live preview.
- **Rich text editor (RTE)** for the email body (full toolbar described in the RTE section below), with a live **Email preview** card beneath it showing "From: YUUSHI <no-reply@yuushi.jp>", the subject, and the formatted body.
- **"Use a template"** — a horizontal strip of template cards; each card shows the template name, an 80-character body preview, and a "Use" button that loads that template's subject and body into the editor.

Step 4 — Schedule:

- Heading "When should this be sent?"
- Three radio choices: "Send immediately (after review)" (default); "Schedule for specific date & time" (reveals **Send Date** and **Send Time** fields, time defaults to 09:00); "Recurring" (reveals **Frequency** dropdown — options "Daily", "Weekly", "Monthly" — plus **Send Time** (default 09:00) and **End date (optional)**).
- Static note: "Timezone: Asia/Tokyo — JST (UTC+9)".

Step 5 — Review & launch:

- Heading "Review & launch".
- A summary card listing: Campaign name, Audience + estimated recipients, Channel ("Email"), Scheduled (e.g. "Immediately", or the date/time, or the recurring frequency), Subject, and a 100-character Email preview snippet.
- Buttons "Save as Draft" (saves with status Draft) and "Launch Campaign" (saves with status Sent).

#### TAB 2 — EMAIL TEMPLATES

**Template list view**

- **Page title:** "Email Templates".
- **Button "New Template"** (plus icon) — opens the blank template editor.
- **Template list** — one row per template, each showing: name, a category chip ("Automation" or "Campaign"), "Last used: <when>", and on hover two icon buttons: Edit (pencil) and Delete (trash). Clicking a row opens it for editing.
  - Seed templates: "New Property Alert" (Automation, "2 days ago"), "Investment Opportunity Newsletter" (Campaign, "1 week ago"), "Price Drop Notification" (Automation, "Yesterday"), "Welcome Email" (Campaign, "2 weeks ago"), "Monthly Portfolio Summary" (Automation, "1 month ago").
  - No filter, sort, or pagination on this list.

**Template editor**

- **"Back to Templates" link.**
- **Title:** "New Template" or "Edit Template".
- **Template Name** (required) — text, placeholder "e.g. New Property Alert".
- **Category** (required) — dropdown, options verbatim: "Automation" (default), "Campaign".
- **Subject Line** (required) — text, placeholder "Email subject line"; updates the live preview.
- **Email Body** (required label) — the same RTE component as the campaign builder (with live preview). Note: body is not actually enforced as required by the demo.
- **Tags** (optional) — text, placeholder "comma, separated, tags". Note: tags are not saved/persisted in the demo (always cleared on save).
- Buttons: "Cancel" and "Save Template".

#### TAB 3 — AUTOMATED EMAILS

This tab manages the catalog of system-sent emails. There is **no Add and no Delete** — the catalog is fixed (defined in the shared `automation-catalog.js`). The Email Center shows only the triggers that have email as a channel (i.e. catalog entries where the email channel = "O"). See the "101-trigger catalog" explanation below.

- **Page title:** "Automated Emails" (no action button).
- **Filter row:**
  - **Search box** — placeholder "Search by trigger name"; matches against the trigger name OR its ID (e.g. "PAY-001").
  - **Status dropdown** — options verbatim: "All status" (default), "Active", "Inactive".
  - **Count label** — e.g. "23 triggers" / "1 trigger", reflecting the filtered count.
- **Automated emails table** — a single flat table (no grouping). Columns verbatim:
  - **Active** — an on/off toggle switch. Locked triggers show the switch dimmed and disabled with tooltip "This notification is required and cannot be disabled."
  - **Trigger** — the trigger name (e.g. "Payment successful") with its ID beneath (e.g. "PAY-001").
  - **Timing** — free-text timing from the catalog (e.g. "Immediate", "Weekly", "24 hours before viewing", "30 days after last review").
  - **Admin Can Disable** — a badge: blue "Admin can disable" when the trigger is user-configurable, grey "Required" when it is not.
  - **(edit column)** — a pencil (Edit) icon.
  - Clicking anywhere on a row, or the pencil, opens the **Automation Edit drawer** (described under Modals).
  - No sorting, no pagination (catalog order).

#### TAB 4 — DELIVERY ANALYTICS

- **Page title:** "Email Delivery Analytics".
- **Card "Campaign Performance Detail"** — the delivery-analytics table. It lists **ONLY campaigns whose status is "Sent"** (Draft and Scheduled campaigns are excluded).
  - **Live filters above the table** (no Apply button — they apply on change):
    - **Time range** — "All time" (default), "Last 30 days", "Last 90 days", "Custom". Choosing "Custom" reveals a **From** and **To** date picker; rows are kept whose (first) send date falls in range. (Relative ranges are measured against the demo "today" = 2026-06-21.)
    - **Audience** — "All Audiences" (default), "End User", "Agent", "Custom Group".
    - **Search box** — placeholder "Search campaign name..."; matches the campaign name, case-insensitive.
  - **Columns (in this exact order):** "Campaign Name" (sortable), "Audience", "Sent Date" (sortable; DEFAULT sort, descending), "Recipients" (sortable), "Opened" (sortable), "Clicked" (sortable), "Converted" (sortable), "Actions". The previous **count + rate pairs were combined into one column each** — Opened / Clicked / Converted. Each combined cell renders the **count** followed by a small inline **rate pill** (e.g. `1,782` then a green `55%` pill). The header shows only the count metric name, and **sorting on the column sorts by the count value**. (Bounce Rate / Unsubscribe Rate / Test-send columns and controls were removed earlier; the separate "Open Rate" / "Click Rate" / "Conversion Rate" columns are now folded into their count columns as inline pills.)
  - **Inline rate-pill colors (per metric):** Opened pill — green ≥50, amber ≥30, red <30, grey when Recipients = 0. Clicked pill — green ≥30, amber ≥10, red <10, neutral grey **"N/A"** when the body has no `<a href>` link. Converted pill — green ≥10, amber ≥5, red <5, grey when Recipients = 0. The pill is `inline-block`, small (font 11px, padding 2px 8px, pill radius), with a 6px gap after the count.
  - **Sticky Actions column + horizontal scroll:** the Actions (Recreate) column is pinned to the right edge (`position:sticky; right:0`) with a subtle left border so it stays visible while the rest of the table scrolls sideways; the table is wrapped in an `overflow-x:auto` container with per-column min-widths (Campaign Name 200px, ellipsis + full name on hover via `title`; Audience 100; Sent Date 110; Recipients 100; Opened/Clicked/Converted 120 each; Actions 110).
  - **Recipients column tooltip** (title attr on the header): "Actual number of recipients at send time. Users who joined later are not included."
  - **Sorting:** click a sortable header to cycle 3 states — ascending ▲ → descending ▼ → unsorted; only one column sorts at a time. Default is **Sent Date descending**.
  - **Actions column:** a **"Recreate"** button per aggregate row (see Recreate flow). Per-send sub-rows of a recurring campaign have no Recreate button.
  - **Recurring campaigns (hybrid rows):** a campaign whose timing is Recurring renders as **one aggregate row by default** with totals — Sent Date = "since {first send date}", Recipients = sum, and the Opened / Clicked / Converted combined cells show summed counts with the rate pill = weighted average (Clicked pill = "N/A" if the body has no link). A small **expand arrow (▶)** at the row's left toggles to (▼) and reveals indented per-send sub-rows, each showing that send's own Sent Date and its three combined count+pill cells; collapsing hides them. Per-send sub-rows have no Recreate button. One-time campaigns render as a single row with no expand arrow. Seed includes "Weekly Newsletter" (recurring, 4 sends across 2026-05-26 → 2026-06-16).
  - Seed Sent campaigns (≥6, mixed audiences and dates across the last ~90 days) make the filters and sort demonstrable.
- **Card "Email Trend (Last 10 Days)"** — a line chart with two series, "Sent" and "Opened", across ten fixed demo dates (May 24 → Jun 2).

#### RICH TEXT EDITOR (RTE) — used in Campaign Step 3 and the Template editor

A composing area with a toolbar, a typing area, a live preview, and a variable side-panel.

- **Toolbar buttons (left to right):**
  - "B" — Bold
  - "I" — Italic
  - "U" — Underline
  - "H2" — Heading 2
  - Bulleted list
  - Numbered list
  - Link — prompts "Enter URL:" (default "https://") and links the selected text
  - Insert image — prompts "Enter image URL:" (default "https://")
  - Insert variable (code icon) — toggles a small dropdown of variable chips
  - "Property" (building icon) — opens the Insert Property picker modal
- **Insert Variables dropdown** (from the code icon) and a permanent **"Insert Variables" side panel** both list the same four clickable chips: `{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}`. (The `{date}` chip was removed.) Chip behavior differs by chip:
  - `{full_name}` and `{platform_name}` — direct literal text insert at the cursor (plus a trailing space), as before.
  - `{property_name}` — **opens the Property Picker** (see Modals); on Insert it drops the selected property as an inline block at the cursor (toast "Property inserted."). It does NOT insert the literal `{property_name}` token.
  - `{agent_name}` — **opens the Agency Picker** (see Modals); on Insert it inserts the chosen agency's name wrapped in a `<span class="agref" data-agency-id="…">` so the reference can be resolved on re-render (toast "Agent inserted."). It does NOT insert the literal `{agent_name}` token.
  - The same chip→picker routing applies in all three chip locations: the RTE toolbar dropdown, the RTE side panel, and the Automation drawer (body and subject chips). In the Automation drawer the **subject** is a plain-text input, so a property/agent chip there opens the picker but inserts the selected item's **name as plain text** (a block can't go in a subject); the drawer **body** inserts a block / agency span like the campaign RTE.
- **Typing area** — placeholder "Write your email content here...".
- **Email preview** card — labeled "Email preview"; live-renders "From: YUUSHI <no-reply@yuushi.jp>", the subject, and the formatted body HTML (including any inserted property blocks, but with their remove "×" hidden in the preview).

#### INSERTED PROPERTY BLOCK (the result of using "Insert Property")

Once a property is inserted into the email body, a card block appears inline showing: a thumbnail image, the property name, "<City>, <Prefecture>", the price, a **"View Property"** link (opens the property detail page in a new browser tab), and a circular remove **"×"** button at the top-right. The "×" removes the whole block from the email. The View Property link points to: `../property/property-detail-view.html?id=<property id>`. A property block may be inserted **multiple times** per email (no limit); each insert lands at the cursor.

#### INSERTED AGENCY REFERENCE (the result of using the `{agent_name}` chip)

Picking an agency in the Agency Picker inserts the agency's display name into the body wrapped in `<span class="agref" data-agency-id="<AG-id>">`. The `data-agency-id` keeps an internal reference so a future re-render can resolve the name from the agency record. In the Automation drawer subject (a plain input) the name is inserted as plain text instead.

---

### Modals & Popups

**1. Create Group modal** (opened from the campaign builder's Custom Group picker → "Create new group")

- Title "Create new group".
- **Group name** (required) — text, placeholder "e.g. VIP Buyers — Tokyo".
- **Audience base** — radio: "End User" (default), "Agent", "Both". (Note: not actually saved in the demo.)
- **Filter (optional)** — dropdown with options verbatim: "— None —" (default), "Plan type", "Registration date", "Activity level"; plus a free-text value box (placeholder "value"). (Note: not saved in the demo.)
- Buttons "Cancel" and "Save Group". New groups are created with 0 members and appear immediately in the picker.
- Closes on Cancel or Esc. (No "click outside to close" for this modal; no unsaved-changes warning.)

**2. Insert Property picker modal** (opened from the RTE toolbar "Property" button OR the `{property_name}` chip) — rebuilt to mirror the **Property Management list** screen.

- Title "Insert property"; close "×".
- **Data source:** ONLY properties whose status is published-equivalent (Published / Members Only) are shown — Draft / Suspended / Withdrawn / unpublished are excluded. New Development listings (project groups 5/6) are mixed into the same list (NOT separated by a Group dropdown — the old G1/G2/G3 group dropdown was removed).
- **Filters** (mirror the Property Management list's exposed filters; apply live):
  - **Status** — "Status: All", "Published", "Members Only".
  - **Listing Type** — "Listing Type: All", "For Sale", "For Rent", "Sale + Rent".
  - **Property Type** — "Property Type: All" plus the distinct property types in the data (e.g. Apartment, Tower Mansion, Detached House, Mixed-Use Building, Residential/Office Building, Residential/Commercial Land, New Dev Apartment, New Dev House).
  - **Prefecture** — "Prefecture: All" plus prefectures present in the data (sorted).
  - **City** — "City: All"; the city options repopulate based on the chosen Prefecture.
  - **Price min / Price max** — numeric ¥M range inputs.
  - **Owner Type** — "Owner Type: All", "Agency", "Direct Owner".
  - **Verification** — "Verification: All", "Verified", "Pending".
  - **Search box** — placeholder "Search by name or ID"; matches **Property Name AND Property ID only**.
  - **View toggle** — "Grid" (default) / "Table"; both functional.
- **Results:** filtered properties shown as cards (grid) or rows (table). **Single-select** via radio button. A **result count** appears above the list ("N published properties").
  - Grid card shows: image, name, "<City>, <Prefecture> · <Type>", price, and a "New Dev" badge for new-development listings.
  - Table columns: (radio), "Property" (name + "New Dev" badge if applicable + ID), "Type", "Listing Type", "Price", "Address" (Prefecture · City), "Status".
  - Price format follows Property Management rules: For Sale = "¥<N>M", For Rent = "¥<N>/mo", Sale + Rent = "¥<N>M · ¥<N>/mo".
  - **Pagination:** 10 rows per page; a Prev / "Page x of y" / Next pager appears only when more than 10 properties match (hidden when ≤10).
  - **Seed:** a deterministic generator (no Math.random) produces ≥30 published demo properties across mixed property types and prefectures, including 5+ New Development listings (project groups 5/6). IDs are "PROP-#####" (regular) and "PRJ-####" (new development).
- **Footer:** selection status ("No property selected" / "Selected: <name>"), "Cancel", and "Insert property". Inserting drops the property block at the cursor in the email body and closes the modal (toast "Property inserted."); it may be used **multiple times** per email (no limit). With nothing selected, "Insert property" shows toast "Select a property first" and keeps the modal open.
- Closes on Cancel, "×", Esc, or clicking the dark backdrop. No unsaved-changes warning.

**3. Insert Agency picker modal** (opened from the `{agent_name}` chip in any of the three chip locations) — mirrors the **Agent Management list** filters.

- Title "Insert agent"; close "×". (The entity is an **agency / company**, not an individual agent.)
- **Filters** (apply live): **Status** ("All", Active, Suspended, Withdrawn); **Plan** ("All", Free, Bronze, Silver, Gold); **Service Area** ("All", Tokyo, Kanagawa, Osaka, Saitama, Chiba, Kyoto); **Language** ("All", Japanese, English, Chinese (Simplified), Chinese (Traditional), Vietnamese, Korean, Other); **Specialism** ("All", Real Estate Brokerage, Direct Property Acquisition, Rental Brokerage, Property Management, Short Sale, Inheritance Consultation); **Search box** placeholder "Search by name or ID" (matches company name and AG-id); **View toggle** Grid (default) / Table.
- **Results:** **single-select** via radio button; a result count is shown. Grid card shows company name, "AG-id · Plan · ★rating", service areas, languages, status + active-listings count. Table columns: (radio), "Agency" (company + AG-id), "Plan", "Service Area", "Language", "Specialism", "Status". **Pagination:** 10 per page, pager hidden when ≤10. **Seed:** ~20 agencies (IDs AG-00000001…) with mixed status/plan/area/language/specialism.
- **Footer:** selection status ("No agency selected" / "Selected: <company>"), "Cancel", and "Insert agent". Confirming inserts the agency name (as an `agref` span in a body, or plain text in a subject input) and closes (toast "Agent inserted."). With nothing selected: toast "Select an agency first".
- Closes on Cancel, "×", Esc, or backdrop click.

**4. Automation Edit drawer** (opened by clicking a row or the pencil on the Automated Emails tab) — slides in from the right.

- **Read-only header:** the trigger ID (e.g. "PAY-001") and trigger name (e.g. "Payment successful"); close "×".
- **Read-only info block:**
  - "Timing" — the trigger's timing text.
  - "Channels" — "Chat O/X · Email O/X" (O = on, X = off for that channel).
  - "Email Pattern" — the pattern letter and its description (see pattern list below).
- **Editable Email Subject** — single-line text, placeholder "Email subject…", with a row of variable chips labeled "Insert variables:" (`{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}`). `{full_name}`/`{platform_name}` insert their literal token at the cursor; `{property_name}` opens the Property Picker and inserts the chosen property's **name** as plain text; `{agent_name}` opens the Agency Picker and inserts the chosen agency's **name** as plain text (a subject is plain text, so no block/span).
- **Editable Email Body** — a rich text editor with a 12-button toolbar: Bold, Italic, Underline, H1, H2, H3, Bulleted list, Numbered list, Link (prompts "Enter URL:"), Align left, Align center, Align right. Below it, the same four variable chips ("Insert variables:"): `{full_name}`/`{platform_name}` insert literal tokens; `{property_name}` opens the Property Picker and inserts a property **block**; `{agent_name}` opens the Agency Picker and inserts an agency `agref` span.
- **Footer:** "Save", "Cancel", and a "Restore default" link.
- **Behavior:** edits are tracked as "dirty". Closing with unsaved edits (via Cancel, "×", Esc, or backdrop click) asks "You have unsaved changes. Discard them?" — staying if cancelled. "Save" stores the subject/body and closes without that prompt. "Restore default" asks "Restore this email to the catalog default? Your edits will be replaced." and, if confirmed, resets subject and body to the catalog default (drawer stays open).

---

### Conditional Display

- **Campaign list ↔ builder:** the list hides and the 5-step builder shows when "New Email Campaign" / View / Edit is used; "Back to campaigns" reverses it.
- **Template list ↔ editor:** same pattern via "New Template" / row click and "Back to Templates".
- **Builder steps:** only the current step's fields are visible; the others are hidden.
- **Step 2 group picker:** the group search + checkbox list + "Create new group" link appear ONLY when "Custom Group" is selected.
- **Step 4 schedule fields:** the Send Date/Time fields appear ONLY when "Schedule for specific date & time" is selected; the Frequency/Send Time/End date fields appear ONLY when "Recurring" is selected.
- **Automated Emails — locked toggle:** a trigger's Active switch is shown locked/disabled (cannot be turned off) when the trigger is "Required" (not user-configurable) AND belongs to Authentication, Security, Payment, or Subscription. The "Admin Can Disable" badge reflects the same: "Required" (grey) vs "Admin can disable" (blue). See isLocked rule below.
- **Inserted property block in preview:** the block's remove "×" is hidden inside the read-only email preview (it only shows in the editable body).
- **Analytics inline rate-pill colors (inside the combined count cells):** Opened pill green ≥50% / amber ≥30% / red <30% / grey when Recipients = 0; Clicked pill green ≥30% / amber ≥10% / red <10% / neutral grey "N/A" when the body has no link; Converted pill green ≥10% / amber ≥5% / red <5% / grey when Recipients = 0.
- **Step indicator state:** current step highlighted; earlier steps show a checkmark.
- **Click Rate "N/A":** wherever a click rate is shown — the campaign **list** "Click Rate" column, and the analytics table's combined **Clicked** cell pill (aggregate + recurring sub-rows) — it reads "N/A" when the campaign body has zero `<a href>` links, else a percentage. In the analytics Clicked cell the count still displays (e.g. `0` with an "N/A" pill).
- **Analytics Custom date range:** the From/To date pickers appear only when Time range = "Custom".
- **Analytics — Sent only:** Draft and Scheduled campaigns never appear in the analytics table.
- **Analytics column sort indicator:** the active sorted column shows ▲ (asc) or ▼ (desc); cycling a third time clears the sort (default returns to Sent Date descending only on reload / re-selection). For the combined Opened / Clicked / Converted columns, sorting operates on the **count** value (not the rate pill).
- **Recurring analytics row:** shows an expand arrow ▶/▼ and per-send sub-rows when expanded; one-time campaigns have no arrow.
- **Property/Agency picker pager:** shown only when more than 10 results match.
- **Property picker City dropdown:** repopulates from the selected Prefecture.

---

### User Flows

**Create and launch a campaign**

1. Email Campaigns tab → click "New Email Campaign" → builder opens at Step 1.
2. Enter Campaign Name, optionally a description → "Next" (blocked if name empty). (There is no Campaign Type field — it was removed.)
3. Step 2: choose audience (or Custom Group + check groups) → recipient estimate updates → "Next".
4. Step 3: enter Subject, compose body (use toolbar, variables, templates, or Insert Property) → "Next" (blocked if subject empty).
5. Step 4: choose send timing (immediate / scheduled / recurring) → "Next".
6. Step 5: review the summary → "Launch Campaign" (toast "Campaign launched successfully.", returns to list, row appears as Sent) OR "Save as Draft" (toast "Draft saved successfully.", row appears as Draft).

**Edit / View / Recreate / Delete a campaign**

- Row three-dots → "View" or "Edit" → opens builder for that campaign.
- **"Recreate"** (also available as a per-row button on the Analytics table) → opens the Campaign Builder at **Step 1 pre-filled from the original**: Campaign Name = "<Original Name> (Copy)", plus Description, Audience (radio), Subject, and Email Body (including any inserted property blocks). (The builder has no Template field, so nothing template-related is restored.) The **Step 4 schedule is reset to "Send immediately"** regardless of the original. Toast on entering the builder: `Recreated from "<Original Name>". Adjust and launch when ready.` Saving creates a **new, independent** campaign with status Draft (or Sent on Launch); the original is untouched and keeps its analytics. (Recreate replaced the old "Duplicate".)
- "Delete" → removes the row immediately (toast "Campaign deleted"). No confirmation prompt for campaign delete.

**Insert a property into an email**

1. In the RTE (campaign Step 3 or template editor), place the cursor where you want the property → click "Property".
2. The picker opens. Filter by Group/Transaction/Prefecture/Search, toggle Grid/Table, click one property to select it (footer shows "Selected: <name>").
3. Click "Insert property" → the property block is inserted at the cursor (toast "Property inserted.") and the modal closes. If nothing is selected, clicking "Insert property" shows toast "Select a property first" and keeps the modal open. The picker may be reopened and used any number of times in one email.
4. To remove an inserted block, click its "×".

- The `{property_name}` chip (RTE dropdown, RTE side panel, Automation drawer) opens this same picker instead of inserting a literal token.

**Insert an agency (via `{agent_name}`)**

1. Click the `{agent_name}` chip → the Agency Picker opens.
2. Filter (Status / Plan / Service Area / Language / Specialism / Search), toggle Grid/Table, select one agency.
3. Click "Insert agent" → the agency name is inserted at the cursor (toast "Agent inserted."), wrapped in an `agref` span with `data-agency-id` (or plain text in a subject input). Nothing selected → toast "Select an agency first".

**Create a custom group**

1. Campaign Step 2 → select "Custom Group" → "Create new group" → modal opens.
2. Enter Group name (required) → optionally pick base (End User / Agent / Both → stored as `entityType` "end_user" / "agent" / "both") / filter → "Save Group" → the group is written to the shared **`yuushiLeadGroups`** localStorage key (shape `{ id, name, entityType, leadIds: [], createdDate }`) → toast 'Group "<name>" created successfully.'; the new group (0 members) appears in the checkbox list here AND in Lead Management / Messages / Message Campaigns.

**Create / edit / delete a template**

- "New Template" or click a row → fill Name (req), Category, Subject (req), Body, Tags → "Save Template" → toast "Template saved", returns to list.
- Hover a row → trash icon → confirm prompt → toast "Template deleted".

**Enable/disable or edit an automated email**

1. Automated Emails tab → toggle the Active switch on a row → toast "<trigger name> enabled" / "<trigger name> disabled". Locked (Required) triggers cannot be toggled.
2. Click a row or its pencil → drawer opens → edit Subject and/or Body (with formatting + variable chips) → "Save" → toast "Automated email saved", drawer closes, edit persists across reloads.
3. "Restore default" → confirm → resets to catalog default (toast "Restored to default").

**View analytics**

- Delivery Analytics tab → the performance table and the 10-day trend chart render.

#### The 101-trigger catalog (background for the BA)

The Automated Emails list is driven by a shared catalog of **101 system triggers** (IDs run AUTH-001 through ADM-001), shared with the Message Center. They are grouped by category: Authentication (AUTH), Security (SEC), Account (ACCT), Property (PROP), Messaging (MSG), Leads (LEAD), Payment (PAY), Subscription (SUB), Reports (REP), Violation (VIO), Engagement (ENG), Admin (ADM). Each trigger declares: a name, a timing, which channels it uses (Chat O/X and Email O/X), whether it is user-configurable (Yes/No), and a content **pattern** (A/B/C/D). **The Email Center lists only triggers whose Email channel is "O"** (those that actually send email). Each trigger comes with a default subject and body generated from its pattern; admins can override these per trigger and edits are saved to local storage (`yuushi.automations`).

Pattern meanings (shown verbatim in the drawer):

- A — "Pattern A — Transactional confirmation, sent once when the action completes."
- B — "Pattern B — Reminder / nudge, scheduled to follow up with the recipient."
- C — "Pattern C — Time-sensitive alert or security / status warning."
- D — "Pattern D — Engagement / marketing content (promotional or re-engagement)."

#### The isLocked rule (which automated emails cannot be turned off)

A trigger's Active toggle is **locked ON** (disabled, badge "Required") when BOTH conditions hold: it is **not user-configurable** AND its category is one of **Authentication, Security, Payment, or Subscription**. These are mandatory transactional/legal emails (e.g. password reset, payment receipt, subscription expiry) that must always send. All other triggers are toggleable ("Admin can disable"). A handful start OFF by default in the demo (Security checkup reminder, Profile completeness reminder, Weekly new listings digest, Inquiry follow-up nudge, Weekly lead summary, Trial ending reminder, Survey invitation, Win-back offer, Monthly moderation summary); the rest start ON.

---

### Validation

- **Campaign Name** (Step 1) — required. Advancing with it empty shows inline error "Campaign name is required." and blocks "Next".
- **Subject line** (Step 3) — required. Advancing empty shows "Subject line is required for emails." and blocks "Next".
- **Template Name** (editor) — required. Saving empty shows "Template name is required.".
- **Template Subject Line** (editor) — required. Saving empty shows "Subject line is required.".
- **Group name** (Create Group modal) — required; saving empty does nothing and re-focuses the field (no visible error text).
- **Insert Property** — a property must be selected; otherwise toast "Select a property first".
- **Insert Agency** — an agency must be selected; otherwise toast "Select an agency first".
- **Automation drawer** — no required-field validation; only the unsaved-changes confirmation on discard.
- Steps 2 (Audience), 4 (Schedule), 5 (Review) have no field validation. Email body in both the campaign builder and template editor is not enforced as required despite the label.

---

### Empty States

- **Campaigns table:** "No campaigns found." when no rows match the filters.
- **Automated Emails table:** "No triggers match your filters." when search/status filter excludes everything.
- **Insert Property results:** "No properties match the filters." when filters exclude all properties.
- **Insert Agency results:** "No agencies match the filters." when filters exclude all agencies.
- **Templates list:** none defined — if empty, the area simply shows nothing.
- **Analytics performance table:** "No sent campaigns match your filters." when the time-range / audience / search filters exclude every Sent campaign. The 10-day trend chart has no empty state (always demo data).

---

### Notifications & Feedback

**Toasts (bottom-center, exact text):**

- `Recreated from "<Original Name>". Adjust and launch when ready.` — entering the builder via Recreate.
- "Campaign deleted" — row Delete.
- "Draft saved successfully." — Save as Draft (Step 5).
- "Campaign launched successfully." — Launch Campaign (Step 5).
- "Template deleted" — template delete confirmed.
- "Template saved" — template Save.
- "Template applied" — "Use" on a template card.
- "<trigger name> enabled" / "<trigger name> disabled" — automation toggle.
- "Automated email saved" — drawer Save.
- "Restored to default" — drawer Restore default confirmed.
- "Select a property first" — Insert property with nothing selected.
- "Property inserted." — property inserted (also when `{property_name}` chip inserts into a subject).
- "Select an agency first" — Insert agent with nothing selected.
- "Agent inserted." — agency inserted via `{agent_name}`.
- 'Group "<name>" created successfully.' — Create Group save (persisted to `yuushiLeadGroups`).

**Confirmation dialogs (exact text):**

- Template delete: 'Delete template "<name>"? This cannot be undone.'
- Automation drawer discard: "You have unsaved changes. Discard them?"
- Automation restore default: "Restore this email to the catalog default? Your edits will be replaced."

**Input prompts (exact text):**

- RTE Link (campaign/template) and drawer Link: "Enter URL:" (default "https://").
- RTE Insert image: "Enter image URL:" (default "https://").

**Inline / live feedback:**

- Estimated recipients line updates as audience/groups change.
- Live email preview updates as subject/body change.
- Property picker selection status: "Selected: <name>" / "No property selected".
- Locked toggle tooltip: "This notification is required and cannot be disabled."
- Automated emails count label: "<n> trigger" / "<n> triggers".
- There are no browser `alert()` messages on this screen.

---

### Navigation

- **Internal tab switching:** the four left-rail items swap the right panel in place; the browser URL does not change and there is no back/forward history for tab changes.
- **Sub-view switching:** campaign list ↔ builder and template list ↔ editor swap in place; "Back" links return to the list.
- **Outbound link — property detail:** the "View Property" link in an inserted property block opens, in a new browser tab, the property detail page at `../property/property-detail-view.html?id=<property id>`.
- **Persistence:** Automated-email edits and on/off states persist under `yuushi.automations` (shared with the Message Center; seeded/forward-compatible on first load). **Custom lead groups persist** under the shared key **`yuushiLeadGroups`** (the same key Lead Management uses), so groups created in the Audience step appear in Lead Management / Messages / Message Campaigns and vice-versa. Campaigns and templates remain in-memory only and reset on page reload.
- This page is self-contained and designed to load inside the admin shell's content area.
