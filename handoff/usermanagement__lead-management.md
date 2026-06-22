## Lead Management

**Purpose:** This screen lets an administrator organise "leads" (potential or existing customers) into named **Groups**, kept separate for two kinds of people: **End Users** (buyers/individuals) and **Agents** (real-estate agencies). Each group is just a labelled bucket of lead IDs. When the admin clicks a group, the right side shows a filterable table of the people in that group. The table deliberately looks and behaves like the End-User Account Management list (for end-user groups) or the Agent Management list (for agent groups), so the admin sees the same columns and the same filter controls they already know. This is a *viewing and curation* screen: the admin can create, rename, and delete groups, filter the membership, and start a chat with a member — but they cannot add or edit the underlying lead records (name, email, status, etc.) here.

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Lead Management". The page opens inside the admin shell's content iframe. The browser tab/window title is "Admin - Lead Directory". There is no separate login or permission gate inside this page itself.

---

### Layout & Structure (groups sidebar + type toggle + tables)

The page is two columns side by side.

**Left column — the Groups sidebar (fixed ~340px wide card):**
1. A small heading at the top: "Lead Management".
2. A **lead-type toggle** — two side-by-side buttons, "End User" and "Agent". This decides which world the admin is looking at. "End User" is selected by default. (Behind the scenes there is a hidden field that copies whichever type is active; it is only used when creating a new group, and the admin never sees it.)
3. Below that, a "Groups" sub-heading on the left with a "+ New Group" button on the right.
4. Under the heading, the **group list** — one row per group that belongs to the currently selected type. End-user groups only appear when "End User" is active; agent groups only appear when "Agent" is active. Each row shows the group name, a count of how many leads are in it (in parentheses), and two small round buttons on the right: a pencil (edit/rename) and a trash can (delete).

**Right column — the main content area:**
1. A header showing the **current group's name** as a large title. Before any group is chosen it reads "Select a group to view leads". (There is a thin grey sub-line under the title reserved for extra info, but it is always blank in this build.)
2. A **Filters card** that is injected fresh each time a group loads. Its fields differ depending on whether the group is an end-user group or an agent group (full lists below).
3. A **Results card** containing the lead table. It is hidden until a group is loaded. At the top it shows a result-count line in the standard format "Showing {start}–{end} of {total} end users" (or "… agents"). Below that is the table, and beneath the table a **pagination bar** (50 rows per page; hidden when the filtered result is 50 rows or fewer).
4. An **empty-state message** shown when no group is selected: "No leads in this group yet. / Please select a group."

**The two tables** are not two tables on screen at once — it is one table area that re-renders with different columns depending on the active type. End-user groups show the end-user column set; agent groups show the agent column set. Details of each are in "Every Element".

On first load the page automatically seeds demo data (if none is stored yet) and auto-opens the first end-user group ("High-Net-Worth Investors") so the admin immediately sees populated data rather than a blank screen.

---

### Every Element

#### Lead-type toggle (top of sidebar)
- **"End User" button** — default selected (highlighted in the accent brown/orange). When clicked while not already active: switches the whole screen to end-user mode, repaints the group list to show only end-user groups, deselects any current group, and then auto-loads the first end-user group (or, if there are none, clears the table and shows "Select a group to view leads").
- **"Agent" button** — same behaviour but for agent groups.
- Clicking the button that is already active does nothing (no reload, no flicker).
- Switching type also updates the hidden "new group type" so that a group created next will be created for the type now shown.

#### "+ New Group" button
- Opens the **Create new group** modal (see Modals). The new group is created for whichever type is currently active.

#### Group list rows (one per group)
- **Row body (name + count):** clicking anywhere on the row (except the two action buttons) loads that group — the right side repaints with that group's filters and members, the row highlights as active, and the title updates to the group name.
- **Pencil button (✎, tooltip "Edit group"):** opens the **Rename group** modal pre-filled with the current name.
- **Trash button (🗑, tooltip "Delete group"):** opens the **Delete group?** confirmation.
- The currently selected group's row is shown highlighted (accent background, white text and white-outlined action buttons).

#### Filters card — header & actions (both types)
- Title: a funnel icon + "Filters".
- **Reset button** ("Reset"): clears every filter field in the card, sets the two "All"-defaulted dropdowns back to "All", and immediately re-runs the filter so the table returns to the full group membership.
- **Apply button** (a magnifying-glass icon + "Apply", accent-coloured): re-runs the filter against the current group's members and repaints the table.

> Note: filters apply only within the selected group. They never search across all leads or all groups.

#### End-User filter fields (shown when the active group is an end-user group)
All optional. Multi-select boxes let the admin pick several values (any match passes).
1. **Status** (multi-select, 3 rows visible): options — Active, Suspended, Withdrawn. Default: nothing selected (= no status restriction).
2. **Registration — From** (date picker). Default empty.
3. **Registration — To** (date picker). Default empty.
4. **Last Login — From** (date picker). Default empty.
5. **Last Login — To** (date picker). Default empty.
6. **Failed Logins (24h)** — a Min/Max numeric pair (each min 0). Default empty.
7. **Or Threshold** (single dropdown): options — "— Any —" (default), "0", "1–4", "5+". An alternative to the Min/Max pair for failed logins.
8. **Buyer Status** (multi-select, 4 rows): options — Cash Buyer, Mortgage Approved, Mortgage Needed, Not Set. Default none.
9. **Budget (¥)** — Min ¥ / Max ¥ numeric pair (min 0). Default empty.
10. **Auth Provider** (multi-select, 4 rows): options — None, Email, Google, Apple, Weibo, WeChat, Line, Facebook. Default none.
11. **Subscription Plan** (multi-select, 2 rows): options — Free, Premium. Default none.
12. **Last Support — From** (date picker). Default empty.
13. **Last Support — To** (date picker). Default empty.
14. **Resident Country** (multi-select, 4 rows): options (label shown) — Japan, Vietnam, United States, China, Korea, Taiwan, Singapore, United Kingdom. Default none.

#### Agent filter fields (shown when the active group is an agent group)
All optional.
1. **Status** (multi-select, 3 rows): options — Active, Suspended, Withdrawn. Default none.
2. **License Expiry — From** (date picker). Default empty.
3. **License Expiry — To** (date picker). Default empty.
4. **License Preset** (single dropdown): options — "— All —" (default), Expired, Expiring in 30d, Expiring in 60d, Expiring in 90d. (Measured against today's date.)
5. **Subscription Plan** (multi-select, 4 rows): options — Free, Bronze, Silver, Gold. Default none.
6. **Response Rate (%)** — Min % / Max % numeric pair (0–100). Default empty.
7. **Response Time** (single dropdown): options — "— Any —" (default), "≤ 2h", "≤ 24h", "> 24h".
8. **Unpaid / Overdue** (single dropdown): options — All (default), Has Outstanding Balance, Overdue, No Issues.
9. **Violation Count** — Min/Max numeric pair (min 0), counts the agent's report/violation total. Default empty.
10. **Or Bucket** (single dropdown): options — "— Any —" (default), "0", "1–2", "3–5", "5+". An alternative to the Min/Max pair for violations.
11. **Active Listings** — Min/Max numeric pair (min 0). Default empty.
12. **Service Area** (multi-select, 4 rows): options — Tokyo, Kanagawa, Osaka, Saitama, Chiba, Kyoto. Default none.
13. **Language** (multi-select, 4 rows): options (label shown) — Japanese, English, Chinese (S), Chinese (T), Vietnamese, Korean, Other. Default none.
14. **Specialism** (multi-select, 4 rows): options — Real Estate Brokerage, Direct Property Acquisition, Rental Brokerage, Property Management, Short Sale, Inheritance Consultation. Default none.
15. **Appraisal Participation** (single dropdown): options — All (default), Participating, Not Participating.
16. **Remaining Budget (¥)** — Min ¥ / Max ¥ numeric pair (min 0), filters the agent's remaining appraisal budget. Default empty.

#### End-User lead table — columns, in order
1. **User** — round initials avatar + the person's name in bold, with their ID and email underneath.
2. **Buyer status** — e.g. Cash Buyer / Mortgage Needed; shows "—" if not set.
3. **Nation** — resident country code (e.g. VN, KR); "—" if missing.
4. **Status** — a coloured status badge (see status badges below).
5. **Last active** — last-login date/time text, or "—".
6. **Logins** (right-aligned) — total login count.
7. **Avg session (min)** (right-aligned) — average session length in minutes, one decimal.
8. **Saved searches** (right-aligned) — count.
9. **Saved properties** (right-aligned) — count.
10. **Appraisals** (right-aligned) — count of appraisal requests.
11. **Alerts** — a small pill (see "Alerts pill" below).
12. **Chat** — a chat button (comment icon).

#### Agent lead table — columns, in order
1. **Agency** — initials avatar + agency name in bold, with the agency ID underneath.
2. **Established date** — the agency's establishment date (falls back to its created date, else "—").
3. **Head office address** — full address text (wraps to multiple lines); "—" if missing.
4. **Badge** — the agency's first badge as a gold pill (e.g. "Top Agent"); if it has more than one, a "+N" is appended; "—" if none.
5. **Rating** — star display plus the numeric rating (e.g. ★★★★½ 4.7); "—" if none.
6. **Reviews** (right-aligned) — total review count.
7. **Members** (right-aligned) — number of agency members.
8. **Plan** — a coloured plan badge (Gold/Silver/Bronze/Free).
9. **Chat** — a chat button.

#### Table behaviours (both tables)
- **Sorting:** none. No column header is clickable; the order is whatever order the leads sit in the group.
- **Row click:** rows are *not* clickable to open a detail page. Only the in-row Chat button does anything; clicking elsewhere on a row does nothing.
- **Per-row action — Chat button:** shows a notification "Open chat with {name} — would navigate to Messages." It is a stub; it does not actually navigate. The click is isolated to the button so it does not trigger anything else on the row.
- **Pagination:** 50 rows per page (fixed; no page-size selector). Controls sit directly below the table: Previous | numbered pages | Next, with up to 7 numbered pages and ellipsis (…) for skipped ranges; the current page is highlighted in the accent colour; Previous is disabled on page 1 and Next on the last page. The whole bar is hidden when the filtered result is 50 rows or fewer. All filtered rows flow through pagination (it is the last step before rendering). The page resets to 1 on Apply, Reset, group switch, and type switch; it is not persisted across reloads.
- **Result count:** the line at the top of the Results card reads "Showing {start}–{end} of {total} end users" (or "… agents"), and "Showing 0 of 0 …" when nothing matches.

#### Status badges (status + colour + when shown)
Status badge (used in the end-user Status column and as the basis for both filters). Exactly three values platform-wide, coloured from the shared YUUSHI status tokens:
- **Active** — green "success" badge. Shown when a lead's status is "Active".
- **Suspended** — red "danger" badge. Status "Suspended".
- **Withdrawn** — grey "neutral" badge. Status "Withdrawn" (also the fallback for any unrecognised value). The obsolete "Pending" and "Deactivated" values have been removed.

Plan badge (agent Plan column) — distinct accents kept via the design tokens:
- **Gold** — gold/amber badge. Plan = Gold.
- **Silver** — slate/neutral badge. Plan = Silver.
- **Bronze** — bronze/amber badge. Plan = Bronze.
- **Free / other** — grey/neutral badge. Plan = Free or anything unrecognised.

Badge pill (agent Badge column): the agency's badge text is shown in a gold "top" pill style regardless of which badge it is.

Alerts pill (end-user Alerts column): counts up to four risk signals on the lead —
- a non-zero number of failed logins,
- ID verification = Unverified,
- account lock status = Locked,
- a non-zero outstanding balance.
If the count is zero, the cell shows a **green pill with a check mark** (tooltip "No alerts"). If one or more apply, it shows a **red pill with a warning triangle and the number**, and a tooltip that lists each issue separated by " · " — e.g. "2 failed logins · ID unverified", "5 failed logins · ID unverified · Account locked", "¥ 48,000 outstanding".

---

### Modals & Popups

#### Create new group modal
- **Trigger:** "+ New Group" button.
- **Title:** "Create new group".
- **Fields:**
  - "Group name *" (required) — text box, placeholder "e.g. VIP Buyers — Tokyo".
  - "For" — read-only label showing "End User" or "Agent" (whichever type is active). The admin cannot change it here; it follows the toggle.
  - An inline error line appears under the name box when validation fails.
- **Buttons:** "Cancel" and "Create group" (primary).
- **Close behaviours:** Cancel button; clicking the dark backdrop outside the box; pressing Escape. Pressing Enter in the name box submits (same as "Create group"). On close the name box and any error are cleared.

#### Rename group modal
- **Trigger:** the pencil (✎) button on a group row.
- **Title:** "Rename group".
- **Fields:** "Group name" — text box pre-filled with the current name and auto-selected so the admin can type over it. An inline error line shows the relevant message if validation fails.
- **Buttons:** "Cancel" and "Save" (primary).
- **Close behaviours:** Cancel; backdrop click; Escape. Enter saves. If validation fails the modal stays open and shows the error (same rules and messages as Create — empty / over-60 / duplicate).

#### Delete group confirmation
- **Trigger:** the trash (🗑) button on a group row.
- **Title:** "Delete group?".
- **Message:** `Permanently delete group "{group name}"? This action cannot be undone.`
- **Buttons:** "Cancel" and "Delete" (red/danger button).
- **Close behaviours:** Cancel; backdrop click; Escape. Confirming runs the delete then closes. Focus returns to the element that was focused before opening.

#### Toast notifications
- Small messages that slide in at the bottom-right, auto-dismiss after about 3.8 seconds, and have a manual "×" to close. They come in success (green accent), error (red accent), and info (brand/gold accent) styles. Exact texts are listed under Notifications & Feedback.

#### Drawers / side panels
None.

---

### Conditional Display

- **Group list contents depend on the active type.** With "End User" selected, only end-user groups appear; with "Agent" selected, only agent groups appear. There is no "all groups" view.
- **Filter fields depend on the active group's type.** The end-user filter set (Status, Registration dates, Last Login dates, Failed Logins, Buyer Status, Budget, Auth Provider, Plan, Last Support dates, Resident Country) shows for end-user groups; the agent filter set (Status, License Expiry, License Preset, Plan, Response Rate, Response Time, Unpaid/Overdue, Violation Count, Active Listings, Service Area, Language, Specialism, Appraisal Participation, Remaining Budget) shows for agent groups.
- **Table columns depend on the active group's type** — the 12-column end-user layout vs the 9-column agent layout described above.
- **Result-count noun** switches between "end users" and "agents" based on type.
- **Results card vs empty state:** before any group is chosen, the Results card is hidden and the "Select a group to view leads" empty state shows. Once a group loads, the empty state hides and the Results card shows.
- **Title text** is "Select a group to view leads" when nothing is selected, otherwise the selected group's name.
- **Badge/pill rendering** is conditional on each lead's data (status value, plan value, presence of badges, alert signals) as described in the badges section.
- **Auto-load on entry / on type switch:** if the active type has at least one group, the first one is opened automatically; if it has none, the screen clears to the empty state.

---

### User Flows

**Browse a group's leads**
1. Admin opens the screen → first end-user group auto-loads → its members fill the table.
2. Admin clicks a different group in the sidebar → that row highlights, the title changes to the group name, the filters repaint for the type, and the table shows that group's members.

**Switch between End User and Agent**
1. Admin clicks "Agent" → group list now lists only agent groups → first agent group auto-loads → table switches to the 9-column agent layout. (If there were no agent groups, the table clears and the title returns to "Select a group to view leads".)
2. Clicking "End User" again returns to end-user groups the same way.

**Filter within a group**
1. Admin sets one or more filters → clicks "Apply" → table re-renders to only matching members and the Total count updates.
2. Admin clicks "Reset" → all filters clear (the two "All" dropdowns go back to "All") and the full group membership reappears immediately.

**Create a group**
1. Admin clicks "+ New Group" → modal opens, "For" shows the active type → admin types a name → clicks "Create group" (or presses Enter).
2. On success: modal closes, the new (empty) group is added and saved, the group list repaints, the new group is auto-selected and loaded (its table will show the in-table "No leads match the filters." message because it has no members yet), and a success toast appears.

**Rename a group**
1. Admin clicks the pencil on a group → Rename modal opens pre-filled → admin edits → clicks "Save".
2. On success: name is saved, the list repaints, the title updates if that group is currently open, and a "Group renamed successfully." toast appears.

**Delete a group**
1. Admin clicks the trash on a group → confirmation appears.
2. On "Delete": the group is removed and saved, and a "Group deleted successfully." toast appears. If it was the group currently open, the screen loads the first remaining group of the same type; if none remain, it clears to the empty state ("Select a group to view leads"). If it was not the open group, only the list repaints.

**Start a chat with a member**
1. Admin clicks the Chat button on a row → an info toast "Open chat with {name} — would navigate to Messages module." appears. No actual navigation happens (stub).

---

### Validation

- **Create group name:** required (cannot be blank/whitespace); maximum 60 characters; must be unique among groups of the same type, compared case-insensitively (an end-user group and an agent group may share a name, but two end-user groups may not). Inline messages: empty → "This field is required."; over 60 → "Group name cannot exceed 60 characters."; duplicate → "This group name already exists. Please use another one." On failure the modal stays open with the inline error.
- **Rename group name:** same three rules and the same three inline messages as Create (empty / over-60 / duplicate within the same type, excluding the group being renamed). On failure the modal stays open with the inline error.
- **Filters:** no field is required; nothing is validated as mandatory. Numeric inputs carry HTML min (and max for response rate, 0–100) hints but the admin can still leave them empty. Date and number filters simply have no effect when left blank. (There is no check that "From" precedes "To".)
- There is a generic built-in form validator in the page's UX kit (required-field and email-format checks) but this screen's flows do not use it.

---

### Empty States

- **No group selected:** the main area shows "No leads in this group yet." on the first line and "Please select a group." on the second. (This is the same message used both before any selection and as the general placeholder.)
- **Selected group but zero leads match the filters:** the table renders a single full-width row reading "No leads match the filters." (spanning all 12 end-user columns or all 9 agent columns). The Total count shows 0.
- **A type with no groups at all** (e.g. after deleting the last agent group, or switching to a type that has none): the table and filters clear and the title reverts to "Select a group to view leads".
- **A newly created group:** has no members, so loading it shows the "No leads match the filters." in-table message until leads are added (which is not possible from this screen in the current build).

---

### Notifications & Feedback

**Toasts (bottom-right, auto-dismiss ~3.8s):**
- Success: `Group "{name}" created successfully.` — after a group is successfully created (`{name}` is the typed name).
- Success: `Group renamed successfully.` — after a successful rename.
- Success: `Group deleted successfully.` — after a group is deleted.
- Info: `Open chat with {who} — would navigate to Messages module.` — when a row's Chat button is clicked (`{who}` is the lead's name, or its ID if no name). If the toast system is unavailable, the same text appears as a native browser alert instead.

**Inline errors in the Create AND Rename group modals (under the name box):**
- `This field is required.` (empty/whitespace name)
- `Group name cannot exceed 60 characters.` (over 60 chars)
- `This group name already exists. Please use another one.` (duplicate within the same type)

**Confirmation dialog (Delete):**
- Title `Delete group?`, message `Permanently delete group "{name}"? This action cannot be undone.`, buttons "Delete" (red) and "Cancel".

No toasts fire for applying or resetting filters (the table simply updates).

---

### Navigation

- **In-page tabs:** the "End User" / "Agent" toggle behaves like tabs that swap the group list, filters, and table. It does not change the browser URL.
- **Internal links / cross-page navigation:** none. There are no links to other admin screens, no back button, and no row-to-detail navigation. The Chat button only promises navigation to Messages but is a stub.
- **Shell context:** the page is meant to load inside the admin shell's content iframe via the sidebar entry for "Lead Management"; the URL bar does not change when navigating to it.

**Persistence (localStorage):**
- `yuushiLeads` — the array of all lead records (both end-user and agent). Seeded with demo data on first visit if not already present. This screen reads from it but does not modify it. Seed notes: lead statuses use the three platform values (Active / Suspended / Withdrawn); agent leads' specialties use the client-facing wording (Real Estate Brokerage, Direct Property Acquisition, Rental Brokerage, Property Management, Short Sale, Inheritance Consultation); and the seed includes a large end-user group "Bulk Import — 2026" with 58 members so pagination is visible by default.
- `yuushiLeadGroups` — the array of groups (id, name, type, list of member lead IDs, created date). Seeded with demo groups on first visit. Creating, renaming, and deleting groups all read and write this key, so group changes persist across reloads. New groups get an id like `group_{timestamp}` and today's date as their created date, and start with an empty member list.
- The currently selected group and the active type are *not* persisted — on reload the screen always returns to End User and auto-opens the first end-user group. Filter selections are also not persisted; they reset whenever a group reloads.

(One implementation note for the SRS author: in agent groups the "Remaining Budget (¥)" Min/Max inputs reuse the same internal field names as the end-user "Budget (¥)" inputs; functionally they correctly filter the agent's remaining appraisal budget. No user-visible impact.)
