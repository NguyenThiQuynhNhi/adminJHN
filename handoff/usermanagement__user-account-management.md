## End User Management

**Purpose:** This is the admin console for managing the platform's end users (the home buyers / investors who use the public-facing real-estate site). From here an administrator can browse and filter the full list of end-user accounts, open any single account to inspect a deep profile (engagement activity, personal and investment details, saved items, message history, billing, security, support notes), and take actions on that account — edit details, suspend or re-activate, permanently delete, force a password reset, or flag the person as a sales lead. All data is demonstration data baked into the page; nothing is saved to a real server, and the page resets on reload.

**Access:** Platform administrator (back-office staff). Reached via: Admin portal sidebar → USERS MANAGEMENT → "End User Management".

---

### Design System

This screen uses the unified **YUUSHI gold/white design system**. All colors, border-radii, shadows, and the font stack are driven by CSS design tokens declared once in the page's `:root` (e.g. `--bg-page`, `--bg-card`, `--bg-card-warm`, `--color-primary`, the `--status-*` families, `--r-*` radii, `--shadow-*`, `--font-stack`); the file's older local theme variables (`--bg-body`, `--accent`, `--badge-*`, …) are repointed to those tokens so every existing `var()` reference adopts the new look. There are no hardcoded color literals left in the styling apart from the token definitions themselves.

- **Palette:** light grey page background (`#f5f5f5`), white cards (warm off-white `#fffaf2` for accent surfaces such as the detail hero, KPI tiles, and the avatar/chat chips), gold brand/accent (`#8B7340`, hover `#6d5a32`, light `#c9a85c`), warm muted text, and neutral light-grey borders.
- **Buttons** follow the shared variants: primary (gold gradient), secondary/default (white with border), ghost, plus the danger / warning / star / primary-danger action variants.
- **Status badges** use variant classes only (no inline colors); each maps to a status token: success, warning, danger, or neutral.
- **Component patterns** (filters/results card, KPI tiles, mini-tables, accordion cards, notification list, modals, toasts) all read from the same tokens, so this screen is visually consistent with the rest of the admin portal. Toasts use the success/danger/warning/primary status tokens for their accent border and icon; the success/danger action buttons in modals reuse the shared `--status-success-text` / `--status-danger-text` tokens.

---

### Layout & Structure

The whole portal runs inside a shell: a left sidebar for navigation, and a large content area on the right where each screen loads. This screen lives entirely in that content area and never changes the sidebar. There is no separate browser page or tab change when you move around inside it — it swaps what is shown in place.

The screen has two main "views" that replace each other in the same space:

**1. List View (the default landing state)** — shown when you first open the screen. Top to bottom:
- A page header: the title "End User Management" on the left, and an "Export CSV" button on the right.
- A "Filters" card: a grid of filter controls (status, dates, numeric ranges, buyer status, budget, etc.) with "Reset" and "Apply" buttons at the bottom right.
- A "Results" card: a one-line count ("Showing {start}–{end} of {total} end users") followed by the main table of users, with pagination controls below the table.

**2. Detail View (opens when you click a user row)** — replaces the whole list view. Top to bottom:
- A sticky toolbar that stays pinned at the top as you scroll. Left side: a "Back to list" button and a mode badge that reads "View mode" or "Edit mode". Right side: the action buttons (these change depending on whether you are viewing or editing).
- A hero banner: a large square avatar (the person's initials), their name, and a meta line showing User ID · email · a status badge.
- A stack of eleven numbered information cards (Sections 1–11), described below.
- A Password Reset pop-up modal that floats over everything when triggered from Section 10.

There are no tabs anywhere. The detail view is one long scrolling page of cards. The eleven sections are:

- **Section 1 — Engagement Analytics:** A row of seven summary tiles (icon + label + value): Total Logins, Last Login, Avg Session, Saved Searches, Saved Properties, Appraisals Submitted, Avg. Response to Agents. These are read-only at all times.
- **Section 2 — Profile:** A label/value grid of core identity fields (name, email, phone, status, address, etc.). Becomes editable in edit mode.
- **Section 3 — Additional Information (Optional):** Property-ownership question, resident country, buyer status, and a security question + answer. Editable in edit mode; the security question (dropdown) and security answer (text box) are now plain fields committed together with the main "Save changes" (no separate per-field Save buttons).
- **Section 4 — Investment & Preferences:** What kind of property the person wants — type, city, area, budget range, target yield, bedrooms, purpose, and property status tickboxes. Editable in edit mode.
- **Section 5 — Saved Items:** A "Saved Properties List" mini-table, plus a "Saved Search Criteria" set of expandable accordion cards (one per saved search) that the admin can read and delete.
- **Section 6 — Inquiry & Message History:** An "Inquiry History" mini-table, two monthly bar charts (Messages Sent per Month, Messages Received per Month), and a "Blocked Agents" mini-table.
- **Section 7 — Transaction History (Phase 2):** A "Closing Reports" mini-table (currently always empty — a future-phase feature).
- **Section 8 — Billing & Transaction History:** Four billing summary values (Subscription Status, Total Billing Amount, Outstanding Balance, Payment Status), a "Purchase History" mini-table, and a "Refund History" mini-table.
- **Section 9 — Notification Settings:** A read-only review of the user's email notification preferences (master switch, several grouped channels with their frequencies/times, and quiet hours). Read-only even in edit mode.
- **Section 10 — Security:** Lock status, two-factor (2FA) status, last password change, last login device, failed login attempts, identity verification, a "Reset password" button, and a "Login History" mini-table. Read-only values; the only action is the password reset button.
- **Section 11 — Customer Support:** a read-only **Support Tickets** table (Ticket ID · Category · Status) listing this user's support tickets, plus an "Admin Internal Memo" free-text note. The memo becomes editable in edit mode.

---

### Every Element

#### List View — buttons

- **Export CSV** (page header, top right). Clicking it shows a bottom-right success toast "Exported {N} users to CSV." (N = current filtered count; no file is actually produced). Never disabled.
- **Reset** (bottom of Filters card, left of Apply). Clears every filter back to empty/none and re-shows the full unfiltered list of users. Never disabled.
- **Apply** (bottom of Filters card, far right, the primary highlighted button with a magnifying-glass icon). Reads all the filter controls and re-runs the list to show only matching users, and updates the count. Never disabled.

#### List View — filters

These all sit in the Filters card. Nothing filters automatically as you type or select; **nothing happens until you click "Apply"** (or "Reset"). Filters can be combined — a user must satisfy all of the filters you set.

- **Status** (multi-select list box, shows 3 rows). You can pick one or more of: "Active" (the user is active and using the platform), "Suspended" (the account has been suspended by an admin), "Withdrawn" (the user has voluntarily left the platform). Default: nothing selected (= no status restriction). If any are selected, only users with one of those statuses show.
- **Registration — From** (date picker). Default empty. Keeps users whose registration date is on or after this date.
- **Registration — To** (date picker). Default empty. Keeps users whose registration date is on or before this date.
- **Last Login — From** (date picker). Default empty. Keeps users whose last login is on or after this date.
- **Last Login — To** (date picker). Default empty. Keeps users whose last login is on or before this date.
- **Failed Logins (24h)** — a Min and a Max number box side by side (each accepts 0 or higher). Default both empty. Min keeps users with at least that many failed logins; Max keeps users with at most that many.
- **Or Threshold** (single-select dropdown). Options exactly: "— Any —" (default, no restriction), "0", "1–4", "5+". Picking "0" keeps only users with exactly zero failed logins; "1–4" keeps users with 1 to 4; "5+" keeps users with 5 or more. (Note: this works alongside the Min/Max boxes — both apply if both are set.)
- **Buyer Status** (multi-select list box, shows 5 rows). Options: "First-time buyer", "Cash buyer", "Need to sell existing property first", "Investor", "Mortgage buyer" — these now match the values stored on users. Buyer Status is a multi-value field (a user can have several), so the filter matches a user if **any** of their buyer-status values is among those selected. Default nothing selected.
- **Budget (¥)** — a Min ¥ and a Max ¥ number box side by side (each accepts 0 or higher). Default both empty. This does an overlap test: a user is kept if their own budget range overlaps the range you typed (i.e. excluded only if the user's max budget is below your Min, or the user's min budget is above your Max).
- **Auth Provider** (multi-select list box, shows 4 rows). Options shown: "None", "Email", "Google", "Apple", "Weibo", "WeChat", "Line", "Facebook". Default nothing selected. (Mismatch to flag: user records also store "LINE" in capitals and the control lists "Line" — exact-text matching means casing differences may cause misses. The BA should standardize.)
- **Subscription Plan** (multi-select list box, shows 2 rows). Options: "Free", "Premium". Default nothing selected.
- **Last Support — From** (date picker). Default empty. Keeps users whose last support inquiry is on or after this date.
- **Last Support — To** (date picker). Default empty. Keeps users whose last support inquiry is on or before this date.
- **Resident Country** (multi-select list box, shows 4 rows). Options (what the admin sees → the stored code): "Japan" (JP), "Vietnam" (VN), "United States" (US), "China" (CN), "Korea" (KR), "Taiwan" (TW), "Singapore" (SG), "United Kingdom" (GB). Default nothing selected.

One behavior worth noting for the BA: if you set a date "From" or "To" but a user has no value in that date field (e.g. a user who never logged in, or has no support history), that user is treated as not matching and is filtered out.

#### List View — results table

Above the table is a single line: "Showing **{start}–{end}** of **{total}** end users" (e.g. "Showing 1–50 of 63 end users"), where start–end is the range of rows on the current page and total is the count of all matching users. When no users match it reads "Showing 0 of 0 end users".

Table columns, left to right, exactly:
1. **User** — square avatar (initials) + the person's full name, with their User ID and email in smaller grey text underneath.
2. **Buyer status** — one or more values, comma-separated (e.g. "Cash buyer, Investor").
3. **Nation** — the stored resident-country code (e.g. "JP").
4. **Status** — a colored status badge.
5. **Last active** — the last login date/time, or "—" if none.
6. **Logins** — total logins, a right-aligned number with thousands separators.
7. **Avg session (min)** — average session length in minutes, right-aligned, shown to one decimal place.
8. **Saved searches** — count, right-aligned number.
9. **Saved properties** — count, right-aligned number.
10. **Appraisals** — count, right-aligned number.
11. **Alerts** — a small alert indicator (see Status badges below).
12. **Chat** — a round chat button (speech-bubble icon).

- Sorting: none. No column is sortable; there are no sort controls.
- Row click: clicking anywhere on a row (except the Chat button) opens that user's Detail View.
- The Chat button: clicking it does not open the detail; it instead navigates the shell content frame to the Messages module (`messagesupport/admin-messages.html?userId={id}`) and highlights the Messages sidebar item. If the screen is not running inside the shell (no content frame reachable), it instead opens a styled "Open conversation" stub modal. (It deliberately stops the row click from firing.)
- Pagination: platform-standard, fixed at **50 rows per page** (no page-size selector). All filtered rows flow through pagination. Pagination controls sit directly below the table: a "‹ Prev" button, numbered page buttons (up to 7 shown, with "…" ellipsis for skipped ranges when there are many pages — e.g. 20 pages on page 8 shows 1 … 6 7 8 9 10 … 20), and a "Next ›" button. The current page is highlighted in the accent/primary style. "Prev" is disabled on page 1; "Next" is disabled on the last page. The whole pager is hidden when there are 50 or fewer matching users. The page resets to 1 whenever the dataset changes — on clicking Apply, on Reset, and on page load — and would reset on any sort/tab change (there are none on this screen). The page is preserved when opening and returning from a user's detail view. The page number is not persisted across reloads (it always starts on page 1). The current demo seed has 60 end users, so pagination shows by default (2 pages).
- Search box: there is no free-text search box; filtering is only via the Filters card.

#### Detail View — toolbar buttons

While in **View mode**, the right side of the toolbar shows:
- **Edit** (pencil icon). Switches the detail into Edit mode (fields become inputs, and the toolbar swaps to the edit buttons).
- **Suspend** (amber, ban icon). Toggles the account between Suspended and Active. The label is always "Suspend", but it actually flips whichever way the account currently is — if the user is already Suspended this re-activates them. Opens a styled confirm modal first.
- **Delete account** (red, trash icon). Permanently removes the account. Opens a styled confirm modal first.
- **Save as lead** (gold, star icon). Flags the person as a sales lead by opening the styled **Lead Group picker** modal (see Modals).

While in **Edit mode**, the right side instead shows:
- **Cancel** (X icon). Discards changes and returns to View mode (opens a styled confirm modal first).
- **Save changes** (primary highlighted, check icon). Saves all edited fields and returns to View mode.

Always present in the toolbar:
- **Back to list** (left side, arrow icon). Returns to the List View. If you are in Edit mode, it opens a styled "Discard unsaved changes?" confirm modal first.
- **Mode badge** — a small pill reading "View mode" (neutral) or "Edit mode" (amber). Not clickable; just reflects state.

#### Detail View — Section 1 (Engagement Analytics) tiles

Seven read-only tiles, each just a label and a value pulled from the user record: Total Logins, Last Login, Avg Session, Saved Searches, Saved Properties, Appraisals Submitted, Avg. Response to Agents. No buttons, never editable.

#### Detail View — Section 2 (Profile) fields

In View mode these show as text/badges. In Edit mode the editable ones become input boxes.
- **User ID** — read-only always (never editable).
- **Registration / First Login** — read-only always.
- **Avatar** — read-only; shows the initials tile and, if present, the stored avatar file name in grey.
- **Full Name** — text input when editing.
- **Email Address** — text input when editing. No email-format checking is done.
- **Country Code** — text input when editing (e.g. "+81").
- **Phone Number** — text input when editing.
- **Status** — in View mode a colored badge; in Edit mode a dropdown with exactly: "Active", "Suspended", "Withdrawn".
- **Current Address** — text input when editing.
- **Nationality** — text input when editing.
- **Gender** — dropdown when editing with exactly: "Male", "Female", "Other", "Prefer not to say".
- **Age** — number input when editing.
- **Authentication Provider** — read-only always (e.g. "Email", "Google", "Apple", "LINE", "Facebook").
- **Withdrawal Date & Reason** — read-only always, full width; shows "—" if the account was never withdrawn.

#### Detail View — Section 3 (Additional Information) fields

- **Have you ever owned any property in Japan?** — In View mode shows the stored value ("Yes" / "No" / "—"). In Edit mode a dropdown with exactly two options: "Yes" and "No". Changing this enables/disables the location field below (see Conditional Display).
- **Property location (city / ward)** — In View mode shows the stored location or "—". In Edit mode a dropdown with a blank first option then exactly: "Tokyo — Shibuya", "Tokyo — Shinjuku", "Tokyo — Minato", "Tokyo — Setagaya", "Tokyo — Chuo", "Yokohama — Naka", "Osaka — Kita", "Osaka — Chuo", "Kyoto — Nakagyo", "Fukuoka — Hakata". This dropdown is disabled (greyed out) unless the ownership question is set to "Yes".
- **Resident Country** — text input when editing (free text here, unlike the coded dropdown used in filters).
- **Buyer Status** — a multi-select **checkbox group** (not a dropdown). Options: "First-time buyer", "Cash buyer", "Need to sell existing property first", "Investor", "Mortgage buyer". The admin can tick several at once. In view mode the selected values render as inline badges (or "—" when none); in edit mode each option is a checkbox, pre-ticked for the user's current values. Saved as an array.
- **Security Question** — In View mode shows the question text or "—". In Edit mode it is a plain dropdown (no separate Save button). Dropdown options: "Select a question" (blank), "What is your mother's maiden name?", "What was the name of your first pet?", "What city were you born in?", "What was the name of your elementary school?", "What is your favorite movie?", "What is your favorite book?", "What is the name of the street you grew up on?". The selection is committed together with the main "Save changes" button.
- **Your Answer** — In View mode shows masked dots "••••••••" if an answer exists, otherwise "—" (the real answer is never shown to the admin). In Edit mode a plain text box (placeholder "Enter your answer"), committed together with the main "Save changes" button (no separate per-field Save).

#### Detail View — Section 4 (Investment & Preferences) fields

- **Property Type** — In View mode shows one badge per value (e.g. "Apartment", "House"). In Edit mode a single text box where multiple types are typed comma-separated (placeholder "Comma-separated"); on save it splits them into a list.
- **Desired City** — text input when editing.
- **Desired Area** — text input when editing.
- **Budget (Min)** — In View mode shows "¥ " plus a comma-formatted number (or "—" if zero/empty). In Edit mode a number box (placeholder "¥").
- **Budget (Max)** — same as Budget (Min).
- **Target Yield** — dropdown when editing with a blank option then exactly: ">3%", ">4%", ">5%", ">6%", ">7%", ">8%", ">10%".
- **Number of bedrooms** — dropdown when editing with a blank option then exactly: "1", "2", "3", "4", "5".
- **Purpose of purchase** — dropdown when editing with a blank option then exactly: "Primary Home", "Second Home", "Investment".
- **Property Status** — In View mode shows one badge per selected value. In Edit mode shows four tickboxes (checkboxes): "New Property", "Pre-owned Property", "Vacant", "Tenanted". You can tick any combination.

#### Detail View — Section 5 (Saved Items)

- **Saved Properties List** — a mini-table with columns: Property Name, Saved Date, Current Listing Status (a success badge if "Active", otherwise a neutral badge). Read-only.
- **Saved Search Criteria** — a list of accordion cards, one per saved search. Each card's header shows the search name and a "Transaction Type: …" line (Buy or Rent). Each card header has two buttons on the right: a trash button (delete this saved search) and a chevron button (collapse/expand). The first card is expanded by default; the rest are collapsed. When expanded, the body lists grouped criteria with green check marks: Search Keywords, Property Type, Yield, Price (plus a "Custom price range" sub-section when present), Floor Plan, Land Area.

#### Detail View — Section 6 (Inquiry & Message History)

- **Inquiry History** mini-table — columns: Property, DateTime, Agent Name, Message Status (badge: success for "Replied", warning for "Read", danger for anything else). Read-only.
- **Messages Sent per Month** bar chart and **Messages Received per Month** bar chart — twelve bars each, fixed month labels: Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May. Received bars are styled in a neutral grey, sent bars are styled in the gold accent color. Hovering a bar shows its number. Read-only.
- **Blocked Agents** mini-table — columns: Agent Name, Block Date. Read-only.

#### Detail View — Section 7 (Transaction History — Phase 2)

- **Closing Reports** mini-table — columns: Property, Agent Name, Closing Date, Approval Status (warning badge). Always empty in the current data (Phase 2 feature). Read-only.

#### Detail View — Section 8 (Billing & Transaction History)

- **Subscription Status** — a plan badge ("Premium" = highlighted gold variant, otherwise neutral for "Free").
- **Total Billing Amount** — "¥ " amount or "—".
- **Outstanding Balance** — "¥ " amount or "—".
- **Payment Status** — a badge: "Paid" = success, "Pending" = warning, "Overdue" = warning, "None" = neutral.
- **Purchase History** mini-table — columns: Date, Item, Amount (¥). Read-only.
- **Refund History** mini-table — columns: Date, Item, Refund Amount (¥), Reason. Read-only.

#### Detail View — Section 9 (Notification Settings)

A read-only review (never editable, even in edit mode). It shows:
- **Master switch** — "Receive notifications via email" with an ON/OFF pill, sub-text "Master switch for all email notifications below".
- Group **Property & Service Updates:**
  - **Saved Property Updates** with two sub-items each showing a check (on) or empty box (off): "Prices Only" (Frequency value shown), and "Any Other Updates" (Frequency + Time shown).
  - **Saved Search Matches** — Frequency shown.
  - **New Service Proposals** — Frequency + Day + Time shown.
- Group **Proposals & Replies:** **Agent Communications** (Frequency) and **Support Communications** (Frequency).
- Group **Other Notifications:** **Promotional Messages** (Frequency, e.g. "Off").
- Group **Quiet Hours:** **Enable Quiet Hours** with an ON/OFF pill, plus From / To / Timezone values.

#### Detail View — Section 10 (Security)

- **Account Lock Status** — badge: "Locked" = danger or "Normal" = success.
- **2FA Status** — badge: "ON · Email OTP" = success or "OFF" = danger.
- **Last Password Change** — date text.
- **Last Login Device** — text (e.g. "Mobile", "Desktop", "App", "Tablet").
- **Failed Login Attempts (24h)** — number.
- **Identity Verification** — badge: "Verified" = success or "Unverified" = danger. This value is **derived from the Phone Number field** (the single source of truth): Verified when the phone has a non-empty value, Unverified when the phone is blank/whitespace. It is never edited directly — a small italic hint under the value reads "Auto-derived from Phone Number — Verified when phone is present, Unverified when blank." When a profile edit is saved, the stored field is re-synced from the phone so any legacy reads stay consistent, and the list's Alerts indicator ("ID unverified") is computed the same way.
- **Password Reset** — a small danger-styled "Reset password" button (key icon). Clicking opens the Password Reset modal (see Modals).
- **Login History** mini-table — columns: DateTime, Device Type, IP Address, Country, Status & Reason. The Status & Reason cell shows a success "Success" badge for successful logins, or a danger "Failed" badge followed by the failure reason in red text for failed logins. Read-only.

#### Detail View — Section 11 (Customer Support)

- **Support Tickets** — a read-only table with three columns: **Ticket ID**, **Category**, **Status**. Each row is one of this user's support tickets (pulled from the ticket records — same data shape as the Ticket Management module). Status shows as a coloured badge: Open = red, In Progress = amber, Resolved = green, Closed = grey. If the user has no tickets it shows "No support tickets." (The user's "last support" date is still used by the list's "Last Support — From/To" filter, but is no longer shown as a standalone value here.)
- **Admin Internal Memo** — In View mode shows the memo text (preserving line breaks), or an italic "No notes." if empty. In Edit mode becomes a multi-line text box, saved with the main Save changes button.

#### Status badges (every status, variant, trigger)

Badges are rendered with variant classes mapped to the shared status tokens (success / warning / danger / neutral) — described here by status name, not color.

- Account status: "Active" = success; "Suspended" = danger; "Withdrawn" = neutral.
- Subscription plan: "Premium" = a highlighted (gold) variant; "Free" (or anything else) = neutral.
- Payment status: "Paid" = success; "Pending" = warning; "Overdue" = warning; "None" = neutral.
- 2FA: "ON · Email OTP" = success; "OFF" = danger.
- Lock: "Locked" = danger; "Normal" = success.
- Identity verification: "Verified" = success; "Unverified" = danger. (Derived from the Phone Number field — Verified when a phone is present, Unverified when blank; never set directly.)
- Saved-property listing status (Section 5 table): "Active" = success; anything else (e.g. "Sold") = neutral.
- Inquiry message status (Section 6 table): "Replied" = success; "Read" = warning; anything else = danger.
- Support-ticket status (Section 11 table): "Resolved" = success; "Open" = warning; "In Progress" = warning; "Closed"/other = neutral.
- Property type / property status values shown in detail render as neutral badges.
- **Alerts indicator** (list table, Alerts column): If the user has no issues it is a success-styled circle with a check mark (tooltip "No alerts"). If there are issues it is a danger-styled badge with a warning icon and a count of issues. The count goes up by one for each of these conditions that is true: failed logins greater than 0, identity is "Unverified", account is "Locked", outstanding balance greater than 0. Hovering shows the list of issues, e.g. "7 failed logins · ID unverified · Account locked · ¥ 5,000 outstanding".

---

### Modals & Popups

All dialogs on this screen are styled in-page modals (no browser-native `confirm()`/`alert()` anywhere). Every modal supports **four ways to close**: the X icon in its header, the Cancel button, clicking the dark backdrop, and pressing the **Esc** key. All transient confirmations after actions appear as **toasts**: small cards stacked in the **bottom-right**, colored by type (success / error / warning / info), auto-dismissing after about 3 seconds (and dismissable on click).

**Password Reset modal.**
- **Trigger:** the "Reset password" button in Section 10 (Security).
- **Title:** "Reset password" (key icon).
- **Contents, top to bottom:**
  - A yellow warning banner reading, in bold: "Force-reset password without email verification." then below it: "The account owner must use the new password to log in next time. This action is recorded in Audit Logs."
  - A read-only "Subject account" line showing the target as: User ID · Full Name (email).
  - **New password** field (masked password input, with a show/hide eye toggle). Its placeholder reads "Min {N} characters" where **N is the customer minimum password length** read from system security settings (localStorage `yuushi.basicSecuritySettings.passwordPolicy.customer.minChars`, defaulting to **8** when unavailable). A live complexity checklist sits under the field and is **generated dynamically from the customer password policy** each time the modal opens: it always shows "At least {N} characters", and then shows "One uppercase letter (A–Z)", "One lowercase letter (a–z)", "One number (0–9)", and "One special character (!@#$%^&*)" **only for the complexity rules that are enabled** in `yuushi.basicSecuritySettings.passwordPolicy.customer.complexity` ({uppercase, lowercase, numbers, symbols} — each defaulting to true if missing). Disabled rules are omitted entirely from the list (not just hidden). Items tick green as satisfied.
  - **Confirm new password** field (masked password input, with show/hide eye toggle).
  - An error message area (hidden until there is an error).
- **Buttons:**
  - **Cancel** — closes the modal without doing anything.
  - **Reset password** (red primary, key icon) — validates the two fields (see Validation). If valid, closes the modal and shows the success toast "Password reset successfully. Action recorded in Audit Logs."
  - **X** (top right of the modal) — closes the modal.
- **Close behavior:** four close methods (X, Cancel, backdrop click, Esc) plus a successful submit. When opened, the minimum-length **and the complexity flags** are re-read from settings and the checklist `<li>` items are rebuilt (so the placeholder and the set of shown rules reflect the current policy), the cursor lands in the New password field, and the fields and any prior error are cleared.

**Confirm modal (reusable).** A single styled confirm dialog reused for several actions; it shows a title, an explanatory body, a Cancel button, and one accent action button (danger or success styling depending on the action). Four close methods. Used for:
- **Discard unsaved changes?** (Back to list while editing) — body "Your edits will be lost if you leave this page." — Cancel + Discard (danger).
- **Discard changes?** (Cancel edit) — body "Your edits in this session will be lost." — Cancel + Discard (danger).
- **Suspend account? / Re-activate account?** (Suspend button, by current status) — body shows the User ID + Full Name and the impact ("The user will be unable to log in." / "The user will regain access.") — Cancel + Suspend (danger) / Cancel + Re-activate (success).
- **Permanently delete account?** (Delete account) — body "Permanently delete {User ID} ({Full Name})? This action cannot be undone. All saved searches, properties, and history will be removed." — Cancel + Delete (danger).
- **Delete saved search?** (trash on a saved-search card) — body 'Delete the saved search "{name}"? This cannot be undone.' — Cancel + Delete (danger).
- **Open conversation** (Chat stub, only when not running inside the shell) — body "This would open the conversation with {Full Name} in the Messages module." — Cancel + OK.

**Lead Group picker modal** (Save as lead).
- **Trigger:** the "Save as lead" toolbar button.
- **Title:** "Save as lead — Select group" (star icon).
- **Contents:** a dropdown of existing lead groups read from localStorage `yuushi.leadGroups`. If there are no groups, the dropdown is replaced by an info banner "No lead groups available — please create one in Lead Management first." and the Save button is disabled. A "+ Create new group" link reveals an inline "New group name" text input (and enables Save even when no groups exist yet).
- **Buttons:** Cancel + Save (primary). On Save, the current user (id, name, email) is appended to the chosen group's `leads` array (creating the named group first if the new-group input was used), the data is written back to `yuushi.leadGroups`, the modal closes, and a success toast shows: '{Full Name} saved as lead in group "{group}".' Four close methods.

---

### Conditional Display

- **View mode vs Edit mode:** In View mode all fields show as text/badges and the toolbar shows Edit / Suspend / Delete account / Save as lead. Clicking Edit switches every editable field to an input control and swaps the toolbar to Cancel / Save changes; the mode badge changes from "View mode" to "Edit mode" (and turns amber). Read-only fields (User ID, Registration date, Avatar, Authentication Provider, Withdrawal, and all of Sections 1, 5, 6, 7, 8, 9, 10's values, and the Last Support value) stay non-editable in both modes.
- **Property ownership → location dropdown:** In Edit mode, the "Property location (city / ward)" dropdown is disabled (greyed) unless "Have you ever owned any property in Japan?" is set to "Yes". If the admin changes that question from "Yes" to "No", the location dropdown immediately becomes disabled and is cleared to blank. Changing it back to "Yes" re-enables it.
- **Security Question / Your Answer:** these appear as plain text (answer masked as dots) in View mode, and switch to a plain dropdown / plain text box (no per-field Save buttons) in Edit mode, committed by the main "Save changes".
- **Toolbars:** the View-mode toolbar and Edit-mode toolbar are mutually exclusive — only one set of action buttons shows at a time depending on the mode.
- **Avatar file name:** the grey file-name text next to the avatar in Section 2 only appears if the user record has an avatar file stored; otherwise just the initials tile shows.
- **Custom price range** (Section 5 saved-search card): the "Custom price range" sub-block only appears for a saved search that has a custom price value.
- **Alerts badge** (list): success-styled check when there are zero alert conditions; danger-styled count badge when one or more conditions are true.
- **Empty value fallbacks:** many fields show "—" when empty (e.g. Withdrawal, Last Support, last active, optional profile fields), and the memo shows "No notes." when empty.

---

### User Flows

**Filter the list:**
1. Open the screen — the full list of users shows with the total count.
2. Set any combination of filters in the Filters card (statuses, date ranges, failed-login range/threshold, buyer status, budget, auth provider, plan, support dates, resident countries).
3. Click "Apply". The table redraws to show only matching users and the count updates. (Nothing happens until Apply is clicked.)
4. Click "Reset" at any time to clear all filters and show everyone again.

**Open a user's detail:**
1. Click anywhere on a user's row (other than the Chat button).
2. The list disappears and the detail view loads for that user, scrolled to the top, in View mode.

**Return to the list:**
1. Click "Back to list" (or, if you were editing, confirm the discard prompt first).
2. The detail view disappears and the list returns.

**Edit a user:**
1. From a user's detail in View mode, click "Edit".
2. Editable fields turn into inputs; toolbar shows Cancel / Save changes; mode badge reads "Edit mode".
3. Change any fields. For the ownership question, picking "No" disables and clears the location dropdown; picking "Yes" enables it.
4. Click "Save changes". All edits are written to the user (text saved as-is, numbers converted, comma lists split into arrays, tickboxes collected into a list; the Section 3 security question and answer are now part of this save), the list is refreshed in the background, the screen returns to View mode, and a "User updated successfully." toast appears.
5. Or click "Cancel" to abandon — after confirming via the styled "Discard changes?" modal, all fields revert to their pre-edit values and you return to View mode.

**Security question / answer:** These are edited inline in Section 3 in Edit mode and are saved together with "Save changes" (there are no separate per-field Save buttons anymore).

**Suspend / re-activate an account:**
1. In the detail toolbar (View mode), click "Suspend".
2. A styled confirm modal ("Suspend account?" or, if already suspended, "Re-activate account?") shows the user ID + name and the impact.
3. On confirm, the status flips, both the detail badge and the list update, and a toast shows ("Account suspended." / "Account re-activated.").

**Delete an account:**
1. Click "Delete account".
2. A styled "Permanently delete account?" confirm modal warns the deletion is permanent.
3. On confirm, the user is removed from the list, you are returned to the List View, and a danger-styled "Account deleted." toast shows.

**Save as lead:**
1. Click "Save as lead". The Lead Group picker modal opens.
2. Pick an existing group (or use "+ Create new group" to name a new one), then click Save.
3. The user is appended to that group's leads in localStorage (`yuushi.leadGroups`), the modal closes, and a toast confirms: '{Full Name} saved as lead in group "{group}".' If no groups exist and you do not create one, Save is disabled.

**Reset password:**
1. In Section 10, click "Reset password".
2. The Password Reset modal opens, pre-filled with the subject account, cursor in the New password field; the minimum-length and the set of complexity rules (placeholder + dynamically built checklist) reflect the current customer password policy.
3. Enter the new password and confirm it.
4. Click "Reset password". If valid, the modal closes and a success toast confirms the reset and that it was recorded in Audit Logs. If invalid, an inline error shows and the modal stays open.

**Expand / collapse a saved-search card (Section 5):**
1. Click a card's header (or its chevron). It toggles between expanded and collapsed; the chevron flips up/down. Cards toggle independently.

**Delete a saved search (Section 5):**
1. Click the trash button on a saved-search card.
2. A styled "Delete saved search?" confirm modal names the search.
3. On confirm, that card is removed from the list and a "Saved search deleted." toast shows.

**Open chat from the list:**
1. Click the Chat button in a user's row. The shell content frame navigates to the Messages module for that user (the row itself does not open). Outside the shell, a styled "Open conversation" stub modal appears instead.

**Export CSV:**
1. Click "Export CSV" in the header. A success toast "Exported {N} users to CSV." shows (N = current filtered count).

---

### Validation

- **Password Reset modal** (the only form with validation):
  - Both fields are required. If either is empty, the inline error shows: "Both fields are required."
  - New password must satisfy **only the enabled rules** shown in the checklist: at least **{N} characters** (always required; N = the customer minimum from `yuushi.basicSecuritySettings.passwordPolicy.customer.minChars`, default 8), plus each of one uppercase / one lowercase / one number / one special character **only when its corresponding `passwordPolicy.customer.complexity` flag is on** (each defaults to true if missing). A char-class rule whose flag is off is not enforced and not shown. If the enabled rules are not all met, the inline error shows: "Password does not meet the complexity requirements below."
  - The two fields must match. If not, the inline error shows: "Passwords do not match."
  - The error appears inside the modal, just above the footer buttons, and the modal stays open until the input is valid.
- **All other fields:** there is no validation. Email, phone, age, country code, budget, and every other edit field accept whatever is entered. The numeric filter and budget boxes only enforce a minimum of 0 via the input itself; there are no other rules and no error messages anywhere else.

---

### Empty States

- **List table (no matching users):** a single centered line reading "No users match the filters."
- **Saved Properties List:** "No saved properties."
- **Saved Search Criteria:** "No saved searches."
- **Inquiry History:** "No inquiries."
- **Blocked Agents:** "No blocked agents."
- **Closing Reports:** "No closing reports (Phase 2)."
- **Purchase History:** "No purchases."
- **Refund History:** "No refunds."
- **Login History:** "No login history."
- **Admin Internal Memo (empty):** italic "No notes."
- Individual empty values throughout show "—".

---

### Notifications & Feedback

**Toasts (bottom-right, ~3s auto-dismiss, click to dismiss):**
- After Save changes: "User updated successfully." (success)
- After Suspend: "Account suspended." (success)
- After Re-activate: "Account re-activated." (success)
- After Delete: "Account deleted." (danger/error styling)
- After deleting a saved search: "Saved search deleted." (success)
- After successful password reset: "Password reset successfully. Action recorded in Audit Logs." (success)
- After Export CSV: "Exported {N} users to CSV." (success; N = current filtered count)
- After Save as lead: '{Full Name} saved as lead in group "{group}".' (success)

**Styled confirm modals (Cancel + action button; four close methods each):**
- Leaving detail while editing (Back to list): title "Discard unsaved changes?", body "Your edits will be lost if you leave this page." — Cancel + Discard (danger).
- Cancel edit: title "Discard changes?", body "Your edits in this session will be lost." — Cancel + Discard (danger).
- Suspend: title "Suspend account?" / "Re-activate account?" (by current status), body with User ID + Full Name + impact line — Cancel + Suspend (danger) / Cancel + Re-activate (success).
- Delete: title "Permanently delete account?", body "Permanently delete {User ID} ({Full Name})? This action cannot be undone. All saved searches, properties, and history will be removed." — Cancel + Delete (danger).
- Delete a saved search: title "Delete saved search?", body 'Delete the saved search "{name}"? This cannot be undone.' — Cancel + Delete (danger).
- Open conversation (Chat outside the shell): title "Open conversation", body "This would open the conversation with {Full Name} in the Messages module." — Cancel + OK.

**Inline messages:**
- The password-reset errors listed under Validation, shown inside the modal.

**Visual feedback:** the mode badge ("View mode" / "Edit mode"), the colored status/alert badges, and the toolbar swapping between view and edit button sets.

---

### Navigation

- This screen is reached from the sidebar (USERS MANAGEMENT → "End User Management") and lives in the content area. The Chat action navigates the shell content frame to the Messages module (`messagesupport/admin-messages.html?userId={id}`), and Save-as-lead writes to the shared lead-group store (localStorage `yuushi.leadGroups`) used by Lead Management; outside the shell, Chat falls back to a stub modal.
- Within the screen, navigation follows the standard **Pattern A (full detail-page swap)**: the List View and Detail View are sibling sections, only one visible at a time. Clicking a user row hides the list and shows that user's full detail page; the back arrow ("Back to list") returns to the list. The detail page lays out a wide main content column (~75%) with an information sidebar (~25%) of cards. The browser URL never changes and there are no breadcrumbs.
- After actions: Save changes and Suspend keep you in the Detail View (now in View mode). Delete returns you to the List View. The password modal closes back to the detail. Cancel/Back from edit return to View mode / list (with a discard confirmation if there are unsaved edits).
- Persistence: user edits, deletions, suspensions, and saved-search deletions live only in memory and are lost on reload. The exceptions are (a) **Save as lead**, which writes the lead into the shared `yuushi.leadGroups` localStorage store, and (b) the password-reset modal, which **reads** the customer minimum-length and complexity policy from the `yuushi.basicSecuritySettings` localStorage store (it never writes there). There is no server.
