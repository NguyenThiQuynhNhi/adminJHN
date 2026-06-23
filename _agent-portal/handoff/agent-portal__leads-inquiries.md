# Inquiries (`leads-inquiries.html`)

**Purpose:** A two-tab inbox: agent conversations with potential buyers/inquirers, plus a list of users who saved the agent's properties. All data is hardcoded demo content; mutations are in-memory only.

**Access:** Sidebar → Messages → Inquiries.

---

## Layout & structure

Page header ("Conversations with potential buyers and users who saved your properties") + a tab bar:

- **Inquiries** — count badge (`#cntInq`, = number of inquiries with unread > 0; initially 5). A split panel: inquiry list (left) + conversation panel (right).
- **Saved by Users** — static count 3. A table of users who saved a property.

`switchTab('inq'|'saved')` toggles display.

---

## Inquiries tab

**Left panel:**
- Search input "Search by user or property…" (live, matches user + property).
- Filter pills: **All**, **Unread**, **Replied**, **Archived** (`setFilter`).
- Inquiry list rows: avatar initials, user name, last-message time, property, last-message preview, user-type tag, "N new" unread badge.

**Conversation panel (right):**
- Header: contact name, property, "View Property →" link, "Archive" button.
- Message bubbles (`user` vs `agent`) with day separators and timestamps.
- Quick-reply chips (3) that populate the composer:
  - "Thank you for your inquiry!" → "Thank you for your inquiry! I will get back to you shortly with more details."
  - "I will arrange a viewing" → "I would be happy to arrange a viewing for you. What day and time works best?"
  - "Please provide your availability" → "Please provide your availability for the next 7 days, and I will confirm a slot."
- Composer: textarea "Type a message…" (Enter to send) + Send.
- Empty state: "No conversation selected".

**Behavior:** opening an inquiry sets unread = 0 and flips status `unread`→`replied`; sending appends an agent message timestamped "Today HH:MM"; archive sets status `archived` and clears the panel.

---

## Saved by Users tab

Table columns: **User**, **Property Saved**, **Date Saved**, **User Type**, **Actions** (Send Message → toast). Rendered from `SAVED` (3 rows).

---

## Modals / forms

No modals. Forms: the composer textarea and the search input only.

## Notifications (toasts, bottom-right, ~2.4s)

"Message sent", "Conversation archived" (success), "Open property in My Properties (demo)", "Open message to {name} (demo)".

## Persistence

None. In-memory arrays `INQS` (5) and `SAVED` (3); "View Property" and "Send Message" fire toasts only (no navigation). State resets on reload.
