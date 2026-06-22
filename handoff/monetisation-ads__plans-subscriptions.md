## Plans & Subscriptions

**Purpose:** Lets an administrator manage subscription plans (for agents and for end customers), see which agents are currently contracted, and run the Property Appraisal Referral lead-fee program (fee schedule by area, per-agent advertising budgets, and global appraisal settings).

**Access:** Admin sidebar → MONETISATION & ADVERTISING → "Plans & Subscriptions". Opens inside the admin shell content area. The page assumes the user is a logged-in administrator; there are no separate role checks or permission gates visible on the screen.

---

### Layout & Structure

Top to bottom:

1. **Page header** — a breadcrumb reading "Monetisation & Advertising › Plans & Subscriptions" (static text, not clickable), and below it the page title "Plans & Subscriptions".
2. **Tab bar** — two tabs (pill-shaped buttons): "Subscription Plans" (selected by default) and "Property Appraisal Referral". Only one tab's content shows at a time.
3. **Tab content area** — changes depending on which tab is active.

**Tab 1 — "Subscription Plans"** contains, top to bottom:
- A row of 4 summary metric cards (KPIs).
- Section A: "Agent Subscription Plans" — a table with an "Add Plan" button in its header.
- Section B: "Customer Subscription Plans" — a table with an "Add Plan" button in its header.
- Section C: "Currently Contracted Agents" — a table with an "Export Excel" button in its header.

**Tab 2 — "Property Appraisal Referral"** contains, top to bottom:
- A row of 4 summary metric cards (KPIs).
- Section A: "Lead Fee Schedule" — a table with an "Add Area" button in its header.
- Section B: "Agent Budget Management" — a table (no header button) with budget usage bars.
- Section C: "Appraisal Settings" — a two-column grid of individual settings.

The page is centered with a maximum width. On narrower screens the KPI cards collapse from 4 columns to 2, the settings grid collapses to one column, and wide tables scroll sideways.

---

### Every Element

#### Tabs (top of page)
- **"Subscription Plans"** (id-card icon) — default selected; shows the Subscription Plans content.
- **"Property Appraisal Referral"** (house/medical icon) — shows the Appraisal Referral content.
- Selected tab is highlighted gold with white text. Switching tabs only swaps the visible content; nothing is saved or loaded.

---

#### TAB 1 — Subscription Plans

**KPI cards (4, display only, not clickable):**
1. "142" — Total Active Agent Plans
2. "¥4,820,000" — Monthly Recurring Revenue (Subscriptions)
3. "2,615" — Total Active Customer Plans
4. "¥33,940" — Average Revenue per Agent

**Section A — Agent Subscription Plans**

Header button:
- **"Add Plan"** (plus icon, gold) — opens an add-agent-plan action (currently shows a placeholder message).

Table — columns in order:
1. Plan Name
2. Monthly Fee (¥)
3. Listings Allowed
4. Users Allowed
5. CRM Inquiry History
6. Status (status badge)
7. Actions

Rows (4, fixed demo data):
| Plan Name | Monthly Fee | Listings Allowed | Users Allowed | CRM Inquiry History | Status |
|---|---|---|---|---|---|
| Free | ¥0 | 5 | 1 | 30 days | Active |
| Bronze | ¥15,000 | 25 | 1 | 3 months | Active |
| Silver | ¥35,000 | 100 | 3 | 6 months | Active |
| Gold | ¥80,000 | 500+ | Custom | Unlimited | Active |

Per-row actions (two buttons each):
- **"Edit"** — opens edit for that plan (placeholder message naming the plan).
- **"Toggle Status"** — asks for confirmation, then reports the status as toggled (placeholder; no real change).

Not sortable; rows are not clickable; no pagination; no per-table search/filter.

Footnote under the table: "* All prices exclude tax. Long-term discounts: 6 months −10%, 12 months −20% (configurable)."

**Section B — Customer Subscription Plans**

Header button:
- **"Add Plan"** (plus icon, gold) — opens an add-customer-plan action (placeholder message).

Table — columns in order:
1. Plan Name
2. Monthly Fee (¥)
3. Message History
4. Property Comparison
5. Agent Reviews
6. Status (status badge)
7. Actions

Rows (2, fixed demo data):
| Plan Name | Monthly Fee | Message History | Property Comparison | Agent Reviews | Status |
|---|---|---|---|---|---|
| Free | ¥0 | 6 months | Up to 2 | Star rating only | Active |
| Paid | ¥2,000–¥3,000 | Unlimited | Up to 8 | Full comments | Active |

Per-row actions (two buttons each): **"Edit"** and **"Toggle Status"** — same behaviour as Section A.

Not sortable; rows not clickable; no pagination; no search/filter.

**Section C — Currently Contracted Agents**

Header button:
- **"Export Excel"** (Excel icon, outline style) — exports the contracted-agents list (placeholder message; no file is produced).

Table — columns in order:
1. Agent Name
2. Plan
3. Start Date
4. Renewal Date
5. Cumulative Charge
6. Status (status badge)

No Actions column. Rows (5, fixed demo data):
| Agent Name | Plan | Start Date | Renewal Date | Cumulative Charge | Status |
|---|---|---|---|---|---|
| Tanaka Hiroshi | Gold | 2025-01-15 | 2026-01-15 | ¥960,000 | Active |
| Sato Yuki | Silver | 2025-06-01 | 2026-06-01 | ¥420,000 | Active |
| Suzuki Kenji | Bronze | 2026-03-10 | 2026-09-10 | ¥45,000 | Pending |
| Watanabe Mei | Silver | 2024-11-20 | 2025-11-20 | ¥385,000 | Suspended |
| Yamamoto Daiki | Free | 2026-04-01 | — | ¥0 | Active |

Beyond the 5 highlighted rows the list is seeded with deterministic demo agents to a total of 60 records so pagination is demonstrable. A free plan with no renewal shows "—" in Renewal Date.

**Pagination:** Fixed at 50 agents per page (universal standard). Below the table a result-count reads "Showing {start}–{end} of {total} agents" (e.g. "Showing 1–50 of 60 agents"; "Showing 0 of 0 agents" when empty). Controls: Previous | numbered pages (up to 7, with "…" when there are more) | Next; the current page is highlighted gold, Previous is disabled on page 1 and Next on the last page. Controls are hidden when there are 50 or fewer rows. The view resets to page 1 on any filter/search/sort/tab change or reload; the current page is preserved while modals/inline editors are open. Rows are not sortable and not clickable; there is still no per-table search/filter.

---

#### TAB 2 — Property Appraisal Referral

**KPI cards (4, display only, not clickable):**
1. "84" — Leads Generated This Month
2. "¥1,050,000" — Total Revenue (Appraisal CPL)
3. "¥12,500" — Average Lead Fee
4. "7" — Duplicate Requests Blocked

**Section A — Lead Fee Schedule**

Header button:
- **"Add Area"** (plus icon, gold) — opens an add-area-fee action (placeholder message).

Table — columns in order:
1. Area (Prefecture + City)
2. Property Type
3. Fee per Lead (¥)
4. Last Updated
5. Actions

Rows (5, fixed demo data):
| Area | Property Type | Fee per Lead | Last Updated |
|---|---|---|---|
| Tokyo / Shibuya | Apartment | ¥15,000 | 2026-04-01 |
| Tokyo / Minato | House | ¥15,000 | 2026-04-01 |
| Osaka / Namba | Apartment | ¥12,000 | 2026-03-15 |
| Fukuoka / Hakata | House | ¥10,000 | 2026-03-15 |
| All Other Areas | All Types | ¥10,000 | 2026-01-01 |

Per-row action: **"Edit"** — opens edit for that area's fee (placeholder message naming the area). The last row ("All Other Areas") is the catch-all default fee.

Not sortable; rows not clickable; no pagination; no search/filter.

**Section B — Agent Budget Management**

No header button.

Table — columns in order:
1. Agent
2. Monthly Budget Cap (¥)
3. Used This Month (¥)
4. Remaining (¥)
5. % Used (shown as a horizontal usage bar plus a percentage)
6. Auto-excluded? (Yes/No; "Yes" shows as a red badge)
7. Actions

Rows (4, fixed demo data):
| Agent | Monthly Budget Cap | Used This Month | Remaining | % Used | Auto-excluded? |
|---|---|---|---|---|---|
| Sakura Realty | ¥200,000 | ¥150,000 | ¥50,000 | 75% (gold bar) | No |
| Tokyo Prime Homes | ¥100,000 | ¥98,500 | ¥1,500 | 99% (red bar) | No |
| Osaka Living | ¥80,000 | ¥80,000 | ¥0 | 100% (red bar) | Yes (excluded) — red badge |
| Nagoya Estate | ¥50,000 | ¥12,000 | ¥38,000 | 24% (gold bar) | No |

The usage bar turns red (instead of gold) when usage is high (the 99% and 100% rows, and seeded rows at ≥90% used). An agent at 100% used is marked "Yes (excluded)", meaning it is auto-excluded from receiving further leads.

Beyond the 4 highlighted rows the list is seeded with deterministic demo agencies to a total of 60 records so pagination is demonstrable.

Per-row action: **"Edit Budget"** — turns the Monthly Budget Cap cell into an inline editor (see User Flows / Validation).

**Pagination:** Fixed at 50 agents per page (universal standard). Below the table a result-count reads "Showing {start}–{end} of {total} agents" (e.g. "Showing 1–50 of 60 agents"; "Showing 0 of 0 agents" when empty). Controls: Previous | numbered pages (up to 7, with "…") | Next; the current page is highlighted gold, Previous disabled on page 1 and Next on the last page; controls hidden when there are 50 or fewer rows. Resets to page 1 on filter/search/sort/tab change or reload; the current page is preserved while the inline budget editor is open. Rows are not sortable and not clickable; there is still no per-table search/filter.

**Section C — Appraisal Settings**

A grid of 5 settings:
1. **"Max agents displayed per request"** — shows "10 (top 5 fixed + 5 random)" with an **"Edit"** link beside it that turns the value into a free-text field (see User Flows).
2. **"Max agents customer can select"** — shows "5" with an **"Edit"** link that turns the value into a free-text field.
3. **"Duplicate request block window"** — a dropdown. Options in order: "30 days", "60 days", "90 days". Default shown: "30 days" (first option). Changing it auto-saves immediately (no Save button; no visible confirmation message, only logged internally).
4. **"Monthly budget auto-reset"** — read-only text: "1st of each month at 00:00 JST". No edit control.
5. **"Lead fee billing"** — read-only text (full width): "Real-time via Stripe on customer submission". No edit control.

---

### Modals & Popups

There are **no rich modal dialogs or drawers** on this screen. All "dialogs" are either browser pop-up boxes (alert/confirm — see Notifications & Feedback) or inline editors that replace a cell/value in place:

- **Inline Budget editor** — Trigger: "Edit Budget" button in Agent Budget Management. The Monthly Budget Cap cell is replaced by a number field (pre-filled with the current cap, digits only) plus a "Save" button and a "Cancel" button. Title: none. Save: validates then asks for confirmation, then writes the new value. Cancel: restores the original cell unchanged. No separate close icon.
- **Inline Setting editor** — Trigger: "Edit" link on "Max agents displayed per request" or "Max agents customer can select". The value is replaced by a free-text field plus "Save" and "Cancel". Title: none. Save: stores the typed text and shows a confirmation message, then returns to display mode with a fresh "Edit" link. Cancel: restores the original value with its "Edit" link. No separate close icon.

The "Add Plan", "Edit" (plan), "Add Area", "Edit" (area), and "Export Excel" buttons currently only show a placeholder pop-up message; the full dialogs they imply are not yet built.

---

### Conditional Display

- **Tab content** — Only the selected tab's content is visible; the other tab's content is hidden. Default visible: "Subscription Plans".
- **Usage bar colour (Agent Budget Management)** — The % Used bar and percentage display in red when usage is high (e.g. 99%, 100%); otherwise gold. (In the demo this is fixed per row, not recalculated.)
- **Auto-excluded badge** — When an agent has used 100% of its budget (¥0 remaining), the Auto-excluded? column shows "Yes (excluded)" as a red badge; otherwise plain "No".
- **Renewal Date "—"** — Shown for agents on the Free plan with no renewal date (e.g. Yamamoto Daiki).
- **Status badge colour** — Active = green, Pending = orange/amber, Suspended = red (see badge list below).
- **Inline editors** — The number/text field, Save, and Cancel buttons appear only after the corresponding Edit button is clicked, and revert to display mode on Save or Cancel.

---

### User Flows

**Switch tabs:** Click "Property Appraisal Referral" → that tab is highlighted and its content (KPIs, Lead Fee Schedule, Agent Budget Management, Appraisal Settings) replaces the Subscription Plans content. Click "Subscription Plans" → switches back. Nothing is saved or reloaded.

**Add an agent plan:** Click "Add Plan" in the Agent Subscription Plans header → a placeholder message appears ("Add agent plan dialog.").

**Add a customer plan:** Click "Add Plan" in the Customer Subscription Plans header → placeholder message ("Add customer plan dialog.").

**Edit a plan:** Click "Edit" on a plan row → placeholder message naming that plan (e.g. "Edit plan: Gold.").

**Toggle a plan's status:** Click "Toggle Status" on a plan row → confirmation box "Toggle status of plan '<name>'?". Confirm → message "Status toggled." (no real change). Cancel → nothing happens.

**Export contracted agents:** Click "Export Excel" → placeholder message "Exporting contracted agents to Excel…" (no file is generated).

**Add a fee area:** Click "Add Area" in the Lead Fee Schedule header → placeholder message "Add new area fee row."

**Edit an area fee:** Click "Edit" on a fee row → placeholder message naming the area (e.g. "Edit fee for Tokyo/Shibuya.").

**Edit an agent budget:**
1. Click "Edit Budget" on a budget row → the Monthly Budget Cap cell becomes a number field (pre-filled with the current cap as a plain number) plus "Save" and "Cancel".
2. Type a new amount (steps of 1,000) → click "Save".
3. If the amount is invalid (empty, 0, or negative) → message "Please enter a valid budget amount." and the editor stays open.
4. If valid → confirmation box "Update <agent> monthly cap to ¥<amount>?". Confirm → the cell shows the new formatted amount and message "Budget updated." appears. Cancel (on the confirmation) → the editor closes with no change written.
5. Clicking "Cancel" instead of Save at any point → the cell reverts to its original value.

**Edit a numeric appraisal setting (Max agents displayed / Max agents customer can select):**
1. Click "Edit" → the value becomes a free-text field plus "Save" and "Cancel".
2. Type a value → click "Save" → message "Setting '<key>' saved as: <value>" appears and the value returns to display mode with a fresh "Edit" link.
3. Click "Cancel" → original value restored with its "Edit" link.

**Change the duplicate request block window:** Choose "30 days", "60 days", or "90 days" from the dropdown → the change is saved immediately (no confirmation message shown to the user).

---

### Validation

- **Edit agent budget (number field):** On Save, the value must be a number greater than 0. Empty, 0, non-numeric, or negative values are rejected with the message "Please enter a valid budget amount." and the editor remains open. The field steps in increments of 1,000 and has a minimum of 0, but values entered are normalized to a number before checking. Valid values then require confirmation before being applied.
- **Edit numeric appraisal settings (text field):** No validation — any text is accepted and saved, including non-numeric text or empty input.
- **Duplicate request block window dropdown:** Always has one of the three preset values; no validation needed.
- All other actions (Add Plan, Edit plan, Add Area, Edit area, Export) have no input and therefore no validation.

---

### Empty States

None as a styled message. Every table and KPI is populated with demo data, and there is no "no results" / "nothing to show" message anywhere on the screen. The two paginated tables (Currently Contracted Agents, Agent Budget Management) do show a "Showing 0 of 0 agents" count when empty, but no dedicated empty-state panel exists. (When the real system has no records, an empty-state message would need to be designed; it is not present today.)

---

### Notifications & Feedback

All feedback is via the browser's built-in pop-up boxes (alert = simple OK message; confirm = OK/Cancel question). Exact text:

| Trigger | Type | Exact text |
|---|---|---|
| "Add Plan" (Agent) | alert | Add agent plan dialog. |
| "Add Plan" (Customer) | alert | Add customer plan dialog. |
| "Edit" on a plan | alert | Edit plan: <name>. (e.g. Edit plan: Gold.) |
| "Toggle Status" on a plan | confirm | Toggle status of plan '<name>'? |
| After confirming toggle | alert | Status toggled. |
| "Export Excel" | alert | Exporting contracted agents to Excel… |
| "Add Area" | alert | Add new area fee row. |
| "Edit" on a fee area | alert | Edit fee for <area>. (e.g. Edit fee for Tokyo/Shibuya.) |
| "Save" on budget edit with invalid amount | alert | Please enter a valid budget amount. |
| "Save" on budget edit with valid amount | confirm | Update <agent> monthly cap to ¥<amount>? |
| After confirming budget update | alert | Budget updated. |
| "Save" on a numeric setting edit | alert | Setting '<key>' saved as: <value> |
| Changing the block-window dropdown | (silent) | No visible message; change is only recorded internally. |

There are no styled in-page toasts, success banners, or error banners.

---

### Navigation

- **In-page tabs** — "Subscription Plans" and "Property Appraisal Referral" switch the visible content without leaving the page. Note: switching tabs does **not** remember your place — the page always opens with "Subscription Plans" selected, and no field edits or scroll position persist across a reload.
- **Breadcrumb** — "Monetisation & Advertising › Plans & Subscriptions" is display-only text, not clickable.
- **No links** out to other pages from the visible content, and **no back button**.
- **No persistence** — nothing entered or changed on this screen (plan edits, budget edits, setting edits, dropdown changes) is stored; reloading the page resets everything to the original demo values.
- There is an internal helper that could jump to the Ad Management screen, but it is **not connected to any button** on this screen, so it is not reachable by the user here.
