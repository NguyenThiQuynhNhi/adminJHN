## Agent Management

**Purpose:** Lets an admin browse the roster of registered real-estate agencies ("agents"), filter that roster on many criteria, export it to CSV, and open a deep per-agency detail page. The detail page is a single long scroll of 19 numbered sections that surface everything known about one agency — engagement analytics, basic/contact info, performance, badges, staff, licensing, branches, listings, completed deals, billing, inquiries, security, compliance, and legal agreements. From here the admin can edit core agency fields, grant/remove badges, suspend or re-activate, save the agency as a sales lead, open a chat, and force-reset the login password. Agencies are never deleted — only suspended.

**Design system:** The page uses the unified YUUSHI gold/white design tokens (light-grey page `#f5f5f5`, white cards, gold primary accent `#8B7340` / hover `#6d5a32` / light `#c9a85c`, warm muted text `#7a6a5c`, shared status colors and radii). Status badges use the shared variant classes — success (green), warning (amber), danger (red), neutral (grey). This is purely a visual re-skin; all logic, handlers, seed data, and the read-only localStorage behavior in Section 19 are unchanged.

**Access:** Admin portal sidebar → USERS MANAGEMENT → "Agent Management". The page is a standalone HTML document loaded inside the portal shell's iframe. It is entirely self-contained — all data is hardcoded demo data; nothing is fetched from or saved to a backend (one read-only exception: the Legal section reads two browser localStorage keys, see Conditional Display / Navigation). The seed now holds **more than 50 agencies** (3 fully-detailed demo agencies plus deterministic filler so the roster exceeds one page) to exercise pagination.

---

### Layout & Structure

The page has two mutually exclusive views. Only one is visible at a time (the other is hidden via a CSS class).

**A. List view** (shown first on load):
1. Page header — title "Agent Management" on the left; an "Export CSV" button on the right.
2. Filters card — titled "Filters", holding 14 filter controls in a responsive grid, with "Reset" and "Apply" buttons bottom-right.
3. Results card — a line reading `Showing {start}–{end} of {total} agents` (or `Showing 0 of 0 agents` when empty), followed by the agents table and, below it, the pager.

**B. Detail view** (opens when a table row is clicked; hidden until then):
1. Sticky toolbar (stays pinned at top while scrolling) — left side has a "Back to list" button and a mode-indicator pill ("View mode" / "Edit mode"); right side shows one of two button sets depending on mode (view-mode buttons vs. edit-mode buttons).
2. Hero header — square avatar with the agency initials, the agency name, and a meta line of `Agency ID · Plan badge · Status badge`.
3. A grid of 19 numbered section cards (single scroll, no tabs):

- **Section 1 — Engagement Analytics** (full width): a row of 10 KPI tiles — Total Logins, Last Login, Avg Session, Active Listings, Saved Properties, Inquiries (30d), Properties Inq (30d), Closed Deals (30d), Appraisal Req (30d), Avg Resp Time.
- **Section 2 — Agency & Basic Information**: key/value grid (editable fields — see Every Element). Fields: User ID (read-only), Registration / First Login (read-only), Logo Image, Company Name / Trade Name, Company Name (Katakana), Invoice Registration Number, Establishment Date, Representative Name, Business Description / Profile / Strengths, Website URL, Withdrawal Date & Reason (read-only).
- **Section 3 — Performance & Analytics**: key/value pairs — Rating Score, Total Review Count, Response Rate, Average Response Time, Avg Active Listings (90d), Total Inquiries / CV (90d), Total Closings (90d), Total Transaction Volume, Average Closing Price; plus a "Review Distribution" block of five horizontal rating bars (5★ down to 1★).
- **Section 4 — Badges**: "Current Badges" chips; "Grant Badge (Admin Only)" dropdown + Grant button; "Remove Badge (Admin Only)" dynamic per-badge Remove buttons.
- **Section 5 — Contact & Account Info**: Operational Email Address, Inquiry Email — Main, Inquiry Email — CC, Representative Phone Number, Public Phone Number, Registration / First Login (read-only).
- **Section 6 — Operations & Professional Services**: Business Hours, Regular Holidays, Average Response Time (min), Specialized Services.
- **Section 7 — Service Areas**: Target Cities.
- **Section 8 — Languages Supported**: Supported Languages.
- **Section 9 — Staff Information** (full width): Total Staff Count + a staff mini-table with eight columns: Photo, Name, Role, Bio, Business Hours, Status, Rating, Suspension Info.
- **Section 10 — Licensing & Legal Information**: Representative Name, Real Estate License Number, License Expiry Date, Real Estate Association, Guarantee Association, Headquarters Address; plus a "License Renewal History" mini-table.
- **Section 11 — Branch Information**: a branches mini-table.
- **Section 12 — Active Listings** (full width): an active-listings mini-table (15 columns).
- **Section 13 — Completed Transactions** (full width): four KPIs (Count last 12 months, Count all time, Volume last 12 months, Volume all time); "Completed Property List" mini-table (15 columns); "Closing Notification History (Phase 2)" mini-table.
- **Section 14 — Ads, Subscription & Billing** (full width): eight key/value pairs (Plan Name, Plan Status, Contract Start Date, Appraisal Monthly Budget, Appraisal Remaining Budget, Total Spend (LTV), Outstanding Balance, Payment Status); plus four mini-tables — Plan History, Transaction History (Consolidated), Delinquency History, Refund History.
- **Section 15 — Inquiry & Message History** (full width): an inquiries mini-table.
- **Section 16 — Notification Settings**: Quiet Hours — Start, Quiet Hours — End, Quiet Hours — Timezone.
- **Section 17 — Security**: Account Lock Status, 2FA Status, Last Password Change, Last Login Device, Failed Login Attempts (24h); "Reset password" button; "Login History" mini-table.
- **Section 18 — Compliance & Safety** (full width): five KPI tiles (Suspension Count, Valid Reports, Invalid Reports, Total Reports, Blocked Users); three mini-tables — Report History, Violation & Penalty History, Block History.
- **Section 19 — Legal & Agreements** (full width): a read-only agreements mini-table.

---

### Every Element

#### List view

**Export CSV button** (top-right header). Action: shows a toast `Exporting {N} agent records to CSV…` where N is the count of currently-filtered agencies. No real file is produced. Never disabled.

**Filters card.** All filters are optional; none required, none validated. Controls (label → type → options/default):

- **Status** — multi-select list box (3 rows visible). Options: Active (active and using the platform); Suspended (suspended by an admin); Withdrawn (voluntarily left the platform). Default: nothing selected. Effect: keeps agencies whose status is among the selected.
- **License Expiry — From** — date picker, empty by default. Keeps agencies whose license expiry date is on/after this date.
- **License Expiry — To** — date picker, empty by default. Keeps agencies whose license expiry date is on/before this date.
- **License Preset** — single dropdown. Options: "— All —" (default, no filter); Expired (expiry before today); Expiring in 30d; Expiring in 60d; Expiring in 90d (each keeps agencies whose expiry is 0–N days away).
- **Subscription Plan** — multi-select list box (4 rows). Options: Free; Bronze; Silver; Gold. Default none. Keeps agencies whose plan is among the selected.
- **Response Rate (%)** — two number inputs Min/Max (0–100), placeholders "Min %" and "Max %". Keeps agencies whose response rate is ≥ Min and ≤ Max (whichever are filled).
- **Response Time** — dropdown. Options: "— Any —" (default, no filter); ≤ 2h; ≤ 24h; > 24h. Parses the leading number from the agency's avg response time text. If the agency's response time is non-numeric (e.g. "N/A") and any option is chosen, that agency is excluded.
- **Unpaid / Overdue** — dropdown. Options: All (default); Overdue (payment status = Overdue); No issue (no outstanding balance and not overdue). (There is no "Has Outstanding Balance" option; only "Overdue" and "No issue" have filter logic.)
- **Violation Count** — two number inputs Min/Max (min 0), placeholders "Min"/"Max". NOTE: despite the label, this filters on the agency's **Total Reports** count, not the violations list.
- **Active Listings** — two number inputs Min/Max (min 0), placeholders "Min"/"Max". Filters on active-listing count.
- **Service Area** — multi-select list box (4 rows). Options: Tokyo; Kanagawa; Osaka; Saitama; Chiba; Kyoto. Default none. Keeps agencies whose target cities include any selected city.
- **Language** — multi-select list box (4 rows). 15 options, plain full-name values (no display/value remap): English; Spanish; Japanese; Italian; Traditional Chinese; Arabic; Simplified Chinese; Portuguese; Korean; Indonesian; Thai; Vietnamese; German; Hindi; French. Keeps agencies supporting any selected language.
- **Specialism** — multi-select list box (4 rows). Options: Real Estate Brokerage; Direct Property Acquisition; Rental Brokerage; Property Management; Short Sale; Inheritance Consultation. Keeps agencies whose specialized services include any selected. (The detail-view Section 6 "Specialized Services" edit picker offers the same six options.)
- **Appraisal Participation** — dropdown. Options: All (default); Participating (appraisal budget > 0); Not Participating (appraisal budget ≤ 0).

(There is no "Or Bucket" filter and no "Remaining Budget (¥)" filter on the page — 14 filter controls total.)

- **Reset button** (bottom-right of card): clears every filter — empties all multi-selects, date/number inputs, and preset dropdowns; sets Unpaid/Overdue and Appraisal Participation back to "All"; restores the full agency list and re-renders. Never disabled.
- **Apply button** (bottom-right, primary, magnifier icon): applies all filters together (combined with AND) and re-renders the table. Never disabled.

**Agents table** — columns in order:
1. **Agency** — avatar + company name (bold) + agency ID beneath.
2. **Established date** — establishment date text, or "—".
3. **Head office address** — HQ address text (wraps), or "—".
4. **Badge** — first badge shown as a gold "Top" style badge; if more than one badge, a `+N` suffix shows the remainder count; "—" if no badges.
5. **Rating** — star glyphs + numeric rating; "—" if rating is 0.
6. **Reviews** (right-aligned) — total review count.
7. **Members** (right-aligned) — staff count.
8. **Plan** — colored plan badge.
9. **Chat** — a round chat-icon button.

- **Row click**: opens the detail view for that agency (scrolls to top).
- **Chat button** (per row): shows alert `Open chat with {company} ({id}) — would navigate to Messages module.` Clicking it does NOT open the detail view (the row click is suppressed for this cell).
- No column sorting, no per-column filtering (filtering is via the Filters card only).
- **Pagination (platform standard):** the LIST is paged at a fixed **50 agencies per page**. A result-count line above the table reads `Showing {start}–{end} of {total} agents` (`Showing 0 of 0 agents` when empty). A pager sits directly **below the LIST table**: `‹ Prev` | numbered page buttons (≤ 7 shown; with leading/trailing `…` ellipsis for larger ranges) | `Next ›`. The current page uses the primary button style; **Prev** is disabled on page 1 and **Next** on the last page; the pager is **hidden entirely when total ≤ 50**. All filtered+sorted rows flow through pagination. The page **resets to 1** on Apply, Reset, and on load; it is **preserved** when opening/closing the agency detail view and the password-reset modal. Pagination state is in-memory only (not persisted across reloads). Only the LIST is paged — the detail view's 19 sections and their mini-tables are never paginated.

#### Detail view — toolbar

- **Back to list** (ghost button, left arrow): returns to the list view. If currently in Edit mode, first asks to confirm discarding changes (see User Flows / Notifications).
- **Mode-indicator pill**: a non-clickable status pill reading "View mode" (neutral) or "Edit mode" (amber).
- View-mode button set (shown when not editing) — exactly three buttons; there is no Delete:
  - **Edit** (pencil icon): switches the detail page into Edit mode.
  - **Suspend** (warning style, ban icon): toggles the agency between Suspended and Active. (Label is always "Suspend" but the action re-activates if the agency is already suspended.)
  - **Save as lead** (star style): saves the agency as a sales lead (stub).
- Edit-mode button set (shown only while editing):
  - **Cancel** (X icon): discards edits and returns to View mode (with confirm).
  - **Save changes** (primary, check icon): writes edited fields back and returns to View mode.

#### Detail view — editable vs. read-only fields

In View mode, editable fields render as plain text (arrays render as chips). In Edit mode they render as inputs with the following types. None of the edit inputs are required or range-validated.

- **Section 2:** Logo Image (text — filename; in view mode shows the avatar plus filename), Company Name / Trade Name (text), Company Name (Katakana) (text), Invoice Registration Number (text), Establishment Date (text), Representative Name (text), Business Description / Profile / Strengths (textarea), Website URL (text; in view mode rendered as a clickable link opening in a new tab). Always read-only: User ID, Registration / First Login, Withdrawal Date & Reason.
- **Section 5:** Operational Email Address, Inquiry Email — Main, Inquiry Email — CC, Representative Phone Number, Public Phone Number (all text). Registration / First Login is read-only.
- **Section 6:** Business Hours (text), Regular Holidays (text), Average Response Time (min) (number — saved as 0 if blank), Specialized Services (in Edit mode a multi-select list box, size 6, of the six specialty options — Real Estate Brokerage; Direct Property Acquisition; Rental Brokerage; Property Management; Short Sale; Inheritance Consultation — with current services pre-selected, saved as the array of selected values; in view mode shown as chips).
- **Section 7:** Target Cities (comma-separated array).
- **Section 8:** Supported Languages (comma-separated array).
- **Section 16:** Quiet Hours — Start, Quiet Hours — End, Quiet Hours — Timezone (all text).

All other detail values (Sections 1, 3, 9–15, 17–19, plus the hero) are display-only and never editable on this screen.

#### Section 4 — Badge controls

- **Grant Badge dropdown** (`Grant Badge (Admin Only)`): options Top Agent (default); Premium Agent; Other.
- **Grant button**: grants the selected badge (see User Flows).
- **Remove Badge area**: one "Remove {badge}" button per current badge. If the agency has no badges, shows the text "No badges to remove."

#### Section 17 — Reset password

- **Reset password button** (danger style, key icon): opens the Password Reset modal.

---

### Modals & Popups

**Password Reset Modal** (the only modal on the page).
- **Trigger:** Section 17 "Reset password" button.
- **Title:** "Reset password" (key icon).
- **Body contents:**
  - Warning banner: "**Force-reset password without email verification.** The account owner must use the new password to log in next time. This action is recorded in Audit Logs."
  - "Subject account" read-only line, prefilled as `{agency id} · {company} ({operational email, or inquiry email, or blank})`.
  - **New password** field — password input, placeholder "Min {N} characters". Required. The complexity checklist is **generated from the role policy** (role = **agent**) on modal open: the whole policy is read defensively (try/catch) from `localStorage` key `yuushi.basicSecuritySettings` → `passwordPolicy.agent` with shape `{minChars, complexity:{uppercase,lowercase,numbers,symbols}}`; on any error/absence it falls back to **minChars 8** with all complexity flags `true`. The placeholder ("Min {N} characters") and the length validation use the same N.
  - Beneath the New password field, a live password-complexity checklist **built dynamically from the policy**. It always shows "At least {N} characters"; then "One uppercase letter (A–Z)" only if `complexity.uppercase`, "One lowercase letter (a–z)" only if `complexity.lowercase`, "One number (0–9)" only if `complexity.numbers`, and "One special character (!@#$%^&*)" only if `complexity.symbols`. **Disabled rules are omitted entirely from the DOM (not hidden).** Each rendered item is red when unmet and green when met. `pwComplexity().all` is true when the length rule plus every **enabled** complexity rule passes.
  - **Confirm new password** field — password input. Required, must match the New password.
  - An inline error region (hidden until a validation error occurs).
- **Buttons:** footer **Cancel** (closes modal) and **Reset password** (danger-primary, key icon — validates and submits). Header **X** also closes.
- **Close behavior:** header X, footer Cancel, or a successful submit all close the modal. There is no click-outside-to-close (clicking the backdrop does nothing). On open, both password fields are cleared, any prior error is hidden, and focus moves to the New password field.

---

### Conditional Display

- **Two views:** List view and Detail view are mutually exclusive; one is always hidden.
- **Toolbar button sets:** the view-mode set (Edit/Suspend/Save as lead — no Delete) shows only in View mode; the edit-mode set (Cancel/Save changes) shows only in Edit mode. The mode pill text and color switch accordingly.
- **Edit vs. read-only rendering:** editable fields appear as inputs only in Edit mode; otherwise as text/chips. Logo shows avatar + filename in view mode but a text input in edit mode. Website shows a clickable link in view mode but a text input in edit mode.
- **List table cells:**
  - Badge cell shows "—" when no badges; otherwise first badge with a `+N` suffix only if more than one badge exists.
  - Rating cell shows "—" when rating is 0; otherwise stars + number.
- **Rating Score (Section 3):** shows "—" if rating is 0; otherwise `stars 4.7 / 5.0`.
- **Star rendering:** floor stars + a half-star (½) when the fractional part is ≥ 0.5, padded with empty stars to 5.
- **License Expiry badge (Section 10 and list logic):** if no date → "—"; if expiry is in the past → date + red "Expired" badge; if expiry is within 90 days → date + amber "≤ 90 days" badge; otherwise just the date.
- **Suspend button wording:** the confirm prompt says "Re-activate …" when the agency is already Suspended, otherwise "Suspend …".
- **Staff table (Section 9) — Status / Rating / Suspension Info columns:**
  - **Status** shows a colored badge: Active (green), Suspended (red), Withdrawn (grey).
  - **Rating** shows star glyphs + the numeric rating, or "—" when the staff member has no rating.
  - **Suspension Info** appears only for staff whose status is Suspended — it shows two lines, "Suspended: {date}" and "Weight: {100% / 50% / 25% / 0%}". For Active or Withdrawn staff this column shows "—".
  - The **weight** is derived from how long ago the staff member was suspended: 0–6 months ago = 100%; 6–12 months = 50%; 12–24 months = 25%; over 24 months = 0%. (The seed data includes a Suspended staff example, suspended roughly 4 months ago, so it currently shows 100%.)
- **Review distribution bars:** bar widths are scaled to the largest single rating count (a fallback minimum is used so a zeroed distribution doesn't divide by zero).
- **Empty / "—" handling:** Real Estate Association, Guarantee Association, withdrawal, and various optional fields show "—" when blank. Monetary fields show "—" when zero/empty (so a ¥0 value displays as "—"). Mini-table cells like resolution date / lifted date show "—" when blank.
- **Section 19 (Legal & Agreements):** read-only. It reads two browser localStorage stores (`yuushi.agreements` and `yuushi.agreementAcceptances`). It shows only agreements whose status is "published" (case-insensitive), sorted by sent date newest-first. Per row, the status badge is "Agreed" (green) if there is a matching acceptance record for this agency and this agreement (and the acceptance has no status, or a status of signed/agreed/accepted); otherwise "Pending" (gray). If the stores are missing/empty, demo fallback data is used (three demo agreements, of which two are published; one demo acceptance for agency AG-00000001). This section never writes to localStorage.

#### Status badges (every status, color, trigger)

- **Agency status:** Active = green (success); Suspended = red (danger); Withdrawn (any other value) = gray (neutral). (These three values appear everywhere status is shown — the list Status filter, the hero/detail status badge, and the new staff Status column in Section 9.)
- **Staff status (Section 9):** Active = green; Suspended = red; Withdrawn = gray (same badge styles as agency status; defaults to Active if blank).
- **Staff Rating column (Section 9):** star glyphs + the numeric rating; shows "—" when the staff member has no rating (0/blank).
- **Staff Suspension Info column (Section 9):** for Suspended staff only, shows two lines — "Suspended: {YYYY-MM-DD}" and "Weight: {value}"; for Active/Withdrawn staff it shows "—". The weight is computed from the number of whole months since the suspension date: < 6 months → 100%; 6 to < 12 → 50%; 12 to < 24 → 25%; ≥ 24 → 0%. (The empty-state row for this 8-column table spans all 8 columns.)
- **Plan:** Gold = gold; Silver = silver/blue; Bronze = bronze/orange; Free (or any other) = gray "none".
- **Plan status:** Active = green; Suspended = red (shares the danger badge style); Cancelled (any other) = gray.
- **Payment status:** Paid = green; Pending = amber; Overdue = amber; None (any other) = gray.
- **Report status:** Valid = red ("invalid" style, i.e. flagged as a real problem); Invalid = gray; anything else = amber pending.
- **2FA:** ON → green "ON · Email OTP"; OFF → red "OFF".
- **Account lock:** Locked → red "Locked"; anything else → green "Normal".
- **Inquiry message status:** Replied = green; Read = amber; anything else = red/off.
- **Listing status:** Active = green; Closed = gray; anything else = amber pending.
- **Closing notification status:** rendered as an amber "pending" badge regardless of value.
- **Legal agreement status:** Agreed = green; Pending = gray.

---

### User Flows

**Filter the roster:** Set any combination of filters → click **Apply** → table re-renders to matching agencies, the result-count line updates, and the page resets to 1. Click **Reset** → all filters cleared, full list restored, page reset to 1.

**Open an agency:** Click a table row → detail view opens in View mode, scrolled to top, showing all 19 sections for that agency.

**Open chat (from list):** Click the chat button in a row → alert describing navigation to the Messages module. Row does not open.

**Edit an agency:** In detail view, click **Edit** → page enters Edit mode (editable fields become inputs, toolbar switches to Cancel/Save changes). Edit fields → click **Save changes** → contact-field uniqueness is checked first (Email / Phone — see Validation); if all is clear, values are written back to the agency, list + detail re-rendered, Edit mode exits, and a toast "Agent updated successfully." appears. If a duplicate is found, the field is flagged inline, an error toast "Please fix the highlighted fields." appears, and the save is blocked (page stays in Edit mode). Or click **Cancel** → confirm prompt → on OK, edits reverted and Edit mode exits; on Cancel of the prompt, stays in Edit mode.

**Leave while editing:** Click **Back to list** while in Edit mode → confirm "Discard unsaved changes?" → on OK, returns to list (edits dropped); on Cancel, stays.

**Suspend / re-activate:** Click **Suspend** → confirm ("Suspend …" or "Re-activate …" depending on current status) → on OK, status toggles, badges and list update, and a toast appears ("Agent suspended successfully." or "Agent reactivated successfully."). (Does not change plan status or suspension count.) Agencies cannot be deleted — suspension is the only deactivation path.

**Save as lead:** Click **Save as lead** → toast "Saved as lead: {company}." (Stub; nothing else happens.)

**Grant a badge:** In Section 4, pick a badge → click **Grant**. If the agency already has that badge → red error toast "{badge} already granted." Otherwise → confirm "Grant "{badge}" to {company}?" → on OK, badge added, detail and list refresh, toast "Badge granted successfully."

**Remove a badge:** Click the "Remove {badge}" button → confirm "Remove "{badge}" from {company}?" → on OK, badge removed, detail and list refresh, toast "Badge removed successfully."

**Reset password:** Section 17 → click **Reset password** → modal opens prefilled with the subject account → enter New password + Confirm (the live checklist turns each condition green as it is satisfied) → click **Reset password** → on valid input, modal closes and a toast appears: "Password reset successful for {company}. The action has been recorded in Audit Logs." On invalid input, an inline error shows and the modal stays open.

**Export CSV:** Click **Export CSV** (list view) → toast "Exporting {N} agent records to CSV…" with the filtered record count. No file.

---

### Validation

Filters: none — all optional, no error messages.

Detail edit inputs: most fields have no format/range checks (number fields default to 0 when left blank; comma-separated array fields are split on commas, trimmed, and empties dropped). However, three contact fields are checked for uniqueness against every other agency when **Save changes** is clicked:
- **Operational Email Address** and **Inquiry Email — Main** — if the entered value already belongs to another agency, an inline error appears beneath the field: "Email already exists. Please use another one."
- **Representative Phone Number** — if the entered value already belongs to another agency, an inline error appears beneath the field: "Phone number already exists. Please use another one."
When any of these fail, the offending field is highlighted, an error toast "Please fix the highlighted fields." appears, and the save is blocked until corrected. (Blank values are not checked; the agency's own current value does not count as a duplicate.)

Password Reset modal (all errors appear in the inline error region inside the modal, in order checked):
- Either field blank → "Both fields are required."
- New password does not meet the complexity requirements (minimum **N** characters — N from the agent role policy `yuushi.basicSecuritySettings.passwordPolicy.agent`, read defensively, **default 8** — plus only the **enabled** complexity rules among uppercase, lowercase, number, and special character, as shown in the dynamically generated live checklist) → "Password does not meet the complexity requirements below."
- New and Confirm don't match → "Passwords do not match."

No other validation exists on the page.

---

### Empty States

- **Agents table (no matches):** "No agents match the filters." (centered, spanning all columns).
- **Section 9 Staff:** "No staff registered." (spans all 8 columns of the staff table).
- **Section 10 License Renewal History:** "No renewals."
- **Section 11 Branches:** "No branches."
- **Section 12 Active Listings:** "No active listings."
- **Section 13 Completed Property List:** "No completed transactions."
- **Section 13 Closing Notification History (Phase 2):** "No closing notifications (Phase 2)."
- **Section 14 Plan History:** "No plan history."
- **Section 14 Transaction History:** "No transactions."
- **Section 14 Delinquency History:** "No delinquency."
- **Section 14 Refund History:** "No refunds."
- **Section 15 Inquiries:** "No inquiries received."
- **Section 17 Login History:** "No login history."
- **Section 18 Report History:** "No reports."
- **Section 18 Violation & Penalty History:** "No violations."
- **Section 18 Block History:** "No blocks."
- **Section 19 Legal Agreements (no published agreements):** "No agreements have been sent yet."
- **Section 4 Badges:** Current Badges shows "None" when empty; Remove area shows "No badges to remove." when empty.

---

### Notifications & Feedback

Confirm dialogs (OK proceeds, Cancel aborts) — these are still browser confirm pop-ups:
- "Discard unsaved changes?" — Back to list while editing.
- "Discard changes and return to view mode?" — Cancel edit.
- "Suspend {id} ({company})?" or "Re-activate {id} ({company})?" — Suspend toggle.
- "Grant "{badge}" to {company}?" — Grant badge.
- "Remove "{badge}" from {company}?" — Remove badge.

Toast notifications (small auto-dismissing banners, top-right; green for success, red for error) — these replaced the old OK-only alert pop-ups, and the "(demo)" wording is gone:
- "Agent updated successfully." — after a successful Save changes.
- "Please fix the highlighted fields." (error) — Save changes blocked by a duplicate Email/Phone.
- "Agent suspended successfully." — after suspending.
- "Agent reactivated successfully." — after re-activating.
- "Badge granted successfully." — after granting a badge.
- "Badge removed successfully." — after removing a badge.
- "{badge} already granted." (error) — trying to grant a badge the agency already has.
- "Saved as lead: {company}." — Save as lead.
- "Exporting {N} agent records to CSV…" — Export CSV.
- "Password reset successful for {company}. The action has been recorded in Audit Logs." — successful password reset.

Informational alert (still a browser pop-up, unchanged):
- "Open chat with {company} ({id}) — would navigate to Messages module." — chat button.

Inline field errors (detail edit, Email/Phone uniqueness): "Email already exists. Please use another one."; "Phone number already exists. Please use another one."

Inline modal errors (Password Reset): "Both fields are required."; "Password does not meet the complexity requirements below."; "Passwords do not match."

---

### Navigation

- **Within the page:** navigation is purely toggling between List view and Detail view (no URL change, no tabs, no browser history). "Back to list" returns to the roster; clicking a row opens detail.
- **No links to other portal pages.** The chat button (via alert) describes where it *would* navigate — to the Messages module — and Save as lead shows a confirmation toast; neither actually navigates.
- **External link:** in View mode the agency's Website URL (Section 2) is a real link that opens in a new browser tab.
- **The detail page is one long scroll** of 19 section cards; the toolbar stays sticky at the top.

**Persistence / data sources:**
- Agency records, all edits, suspend/re-activate, and badge changes exist only in memory for the session (agencies are never deleted); password resets are not persisted either — nothing is saved to a backend, and changes are lost on reload.
- **Section 19 reads two browser localStorage keys (read-only, never written by this page):**
  - `yuushi.agreements` — the catalog of agreement definitions (id/title/status/sent-date). Only "published" ones are listed.
  - `yuushi.agreementAcceptances` — records of which agency accepted which agreement, used to mark each row "Agreed" vs "Pending".
  - If either key is missing/empty, built-in demo fallback data is used instead.
- **Password policy (reset modal):** the full agent policy is read once on modal open (defensively, try/catch) from `yuushi.basicSecuritySettings.passwordPolicy.agent` with shape `{minChars, complexity:{uppercase,lowercase,numbers,symbols}}` (read-only), **default minChars 8** with all complexity flags `true`. It drives the length rule (placeholder "Min {N} characters" and checklist line "At least {N} characters") **and** which complexity rules appear: the checklist is generated from the policy so disabled rules are omitted from the DOM, and `pwComplexity().all` requires the length rule plus only the enabled complexity rules.

### Pending Implementation

- **Reset password modal markup is absent in the HTML.** The script defines `resetPwd()`, `closePwdResetModal()`, `submitPwdReset()`, `pwComplexity()`, `updatePwChecklist()`, plus the new policy helpers `loadPwPolicy()` and `buildPwChecklist()`. `resetPwd()` references elements `#pwdResetModal`, `#pwdSubject`, `#pwdNew`, `#pwdConfirm`, `#pwdError`, and `#pwdChecklist` — but **none of those elements exist in the document**. (The supporting CSS *is* present — `.modal-backdrop`/`.modal-box`/`.modal-header`/`.modal-body`/`.modal-footer`, `.warning-banner`, `.modal-field`, `.modal-error`, `.btn-primary-danger`, and `.pw-checklist` — but there is no matching markup that uses it.) As a result, clicking "Reset password" currently throws (the modal cannot open: `resetPwd()` calls `$("pwdSubject").textContent` on a null element after `buildPwChecklist` safely no-ops). The reset JS is now **policy-driven and dynamic**: `resetPwd()` calls `loadPwPolicy("agent", 8)` (reads the whole `passwordPolicy.agent` defensively, default minChars 8 + all complexity flags true) and `buildPwChecklist($("pwdChecklist"), PWD_POLICY)` to generate the `<li>` list (length always; each complexity rule only when its flag is enabled — disabled rules omitted from the DOM); `pwComplexity().all` is true when the length rule plus every **enabled** complexity rule passes. The placeholder update is guarded (only if `#pwdNew` exists), and `buildPwChecklist` no-ops when its `<ul>` is missing. **When the modal markup is eventually added (mirror admin-management.html's `#pwdResetModal` block — an empty `<ul class="pw-checklist" id="pwdChecklist"></ul>` is enough since the list is generated at runtime), the dynamic logic will drive its text/validation automatically with no further JS change.**
