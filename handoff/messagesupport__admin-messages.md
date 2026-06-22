## Messages

**Purpose:** A three-panel chat console that lets an admin (signed in as "Jack Raymonds") read and reply to conversations with both End Users and Agents on the platform. From here the admin can browse conversations, send messages, attach files, insert emoji, use canned message templates, pin and copy individual messages, manually translate any individual message into a selected language (no auto-translation), view a contact's profile plus shared Media/Files/Links (and, for agents, the agent's company info and property listings), and save a contact into a lead group that is shared with the Lead Management screen.

**Access:** Admin sidebar → SUPPORT & COMMUNICATION → "Messages". The screen opens inside the admin shell. All data is hardcoded demo content; there is no real backend. Saving a contact to a lead group writes to the browser's local storage, which the Lead Management screen reads from.

---

### Layout & Structure (3 panels + tabs)

The screen fills the whole window and is split into three side-by-side panels.

- **Panel 1 — Conversation list (left, fixed width).** Top to bottom: the YUUSHI logo; a search box; two tabs ("End User" and "Agent"); and the scrollable list of conversations for whichever tab is selected.
- **Panel 2 — Chat thread (center, flexible width).** Top to bottom: a chat header (the contact's avatar, name, online status, and three action buttons); an optional pinned-messages bar; the scrolling message thread; and the message composer at the bottom.
- **Panel 3 — Contact / info panel (right, fixed width).** Shows the selected contact's details. Its contents differ depending on whether the contact is an End User or an Agent (see Conditional Display). Both versions include three sub-tabs: "Media", "Files", and "Links". This panel can be hidden and re-shown.

**Tabs on this screen:**
- **Conversation-list tabs (Panel 1):** "End User" (selected by default) and "Agent". Each tab shows that audience's conversations only. Switching tabs reloads the list and automatically opens the first conversation in it.
- **Info-panel sub-tabs (Panel 3):** "Media", "Files", "Links". For an End User, "Media" is the default open sub-tab. For an Agent, "Links" is the default open sub-tab.
- **Agent property sub-tabs (Panel 3, agents only):** "Buy" and "Rent", with "Rent" selected by default.

**Default state when the screen opens:** The "End User" tab is active and the conversation with "Grace Miller" (End User id `u3`) is opened unconditionally on load. On a narrow/mobile width the conversation list collapses behind a hamburger button.

**`?userId=` deep link (not implemented):** Other screens — notably End User Management's "Chat" button — link to this page with a `?userId=` URL parameter intended to open a specific conversation. **The current code does not read any URL parameter**: `init()` always calls `selectConvo("u3")` (Grace Miller) regardless of the query string, so the deep link currently has no effect and the page always opens on Grace Miller. (Honoring `?userId=` to auto-open the matching conversation would be a future enhancement.)

---

### Every Element

#### Panel 1 — Conversation list

- **Logo:** "YUUSHI" wordmark with a flower/spa icon. Decorative only.
- **Search box:** A single text field with a magnifying-glass icon, placeholder "Search messages, people". Typing filters the conversation list live (see Validation). No search button; it filters as you type.
- **"End User" tab / "Agent" tab:** Switches which audience's conversations are listed.
- **Conversation rows:** One row per conversation. Each row shows:
  - **Avatar** with a small green dot in the corner if the contact is currently online (no dot if offline).
  - **Name** of the contact.
  - **Preview** — the last message text (truncated with an ellipsis if long).
  - **Time** — last-activity time (e.g. "04:50 PM", "10:30 AM", or "Yesterday").
  - **Unread badge** — a small number badge showing the unread count, only when there are unread messages. When unread, the name is shown bold in the accent color.
  - The currently open conversation is highlighted with a gold left border.
  - **End User conversations (8):** Liam Anderson; Lucas Williams (2 unread, online); Grace Miller (online); Sophia Chen; Benjamin Knight (1 unread); Olivia Foster; Jackson Adams; Ethan Sullivan.
  - **Agent conversations (4):** Grace Miller (online); Liam Anderson; Haruka Sato (3 unread, online); Oliver Brown.
- **Empty state:** If the search matches nothing, the list area shows "No conversations found."

#### Panel 2 — Chat header

- **Hamburger button:** Appears only on narrow/mobile widths; opens the conversation list as a slide-in overlay.
- **Contact avatar + online dot:** The dot shows only when the contact is online.
- **Contact name** with a green dot beside it when online.
- **Status subtitle:** Shows "Online" (green) or "Offline" (grey). For an Agent it also appends the company name (the part before the dash), e.g. "Online | Stockdale & Leggo Gladstone Park".
- **Save button:** A heart button. Label and icon depend on state:
  - End User, not saved → outline heart, "Save User".
  - End User, saved → solid heart (pink), "Saved User".
  - Agent, not saved → outline heart, "Save Agent".
  - Agent, saved → solid heart (pink), "Saved Agent".
  - Clicking it opens the lead-group picker popup (see Modals & Popups).
- **Language button:** A globe button showing the currently **selected target language** (default "English") and a chevron. Clicking opens the language dropdown. The chosen language is the target that per-message **Translate** actions translate into (see Message thread); selecting it does not auto-translate anything on its own.
- **Info-panel toggle button:** A window icon that shows or hides the right info panel. It appears "on" (highlighted) while the panel is visible.

#### Panel 2 — Pinned-messages bar

Hidden unless at least one message is pinned. When shown:
- Header label "PIN MESSAGE" with a thumbtack icon.
- **"VIEW MORE" / "VIEW LESS" link** with a chevron — only appears when more than one message is pinned. Collapsed, only the first pinned message is shown; expanded, all pinned messages show.
- **Close-all (X) icon** — removes all pins at once (tooltip "Remove all pins").
- **Each pinned row:** thumbtack icon, the pinned text prefixed by the sender's name in bold (e.g. "Grace Miller: ..."), and an unpin (X) icon (tooltip "Click → Remove Pin") that removes just that pin.

#### Panel 2 — Message thread

- **Day separator:** A centered "Today" label at the top.
- **Working-hours system message:** For an Agent who is offline only, a centered italic note: "This agent's working hours are 08:00 – 16:00. They will get back to you as soon as possible."
- **Message bubbles:** Each message shows the sender avatar, a meta line, and the bubble:
  - **Their messages** appear on the left; the meta line reads "Name · time".
  - **My (admin) messages** appear on the right; the meta line reads "time · Jack Raymonds".
  - A **pinned** bubble shows a small thumbtack badge in its corner.
  - Right-clicking any bubble opens the message context menu (Pin/Unpin, Copy).
- **"Translate" link (per message):** Under **every** message bubble (both incoming and my own), whenever the selected target language differs from the message's own language, a link **"🌐 Translate to {selected language}"** appears. Clicking it translates **that one message** into the selected language: the bubble shows a "Translated · {source} → {target}" tag above the text, and the link changes to **"Show original"** (clicking again reverts). Translation is **manual and per-message — nothing is auto-translated**. (In this mockup the translated text itself is a placeholder; a real backend would return the message rendered in the target language.)
- **"Message failed to send. Tap to retry" link:** Appears in red under any of my messages that failed to send. The last message in the Grace Miller demo thread is in this failed state. Clicking it retries (see User Flows).

#### Panel 2 — Composer

- **Emoji button** (smiley icon): opens the emoji picker.
- **Message input:** Text field, placeholder "Type message...". Pressing Enter sends the message.
- **Attach button** (paperclip icon): opens the system file chooser. After picking a file a toast confirms it (no file is actually uploaded).
- **"Message Templates" button** (plus icon): opens the templates popup.
- **"Send" button** (paper-plane icon): sends the typed message.

#### Panel 3 — Contact / info panel

- **Header:** Contact avatar, contact name (in accent color), and a close (X) icon that hides the panel.
- **End User body:** A details block with three rows — "Full Name", "Email", "Phone" — followed by the Media/Files/Links sub-tabs.
- **Agent body:** A details block showing the company name, full address, and "Usual response time: ..." (with a clock icon); the Media/Files/Links sub-tabs (Links open by default); and then an "Agent's Properties" block (see below).
- **Media sub-tab:** A 3-column grid of 9 thumbnail images, with a "View all >" link below (link is non-functional, static text).
- **Files sub-tab:** A list of shared files, each with a file-type icon, file name, and a source line. The four demo files: "Floor-plan-326-Keilor.pdf" (Shared by Grace Miller); "Lease-Agreement-Draft.docx" (Shared by you); "Property-photos.zip" (Shared by Grace Miller); "Inspection-report.pdf" (Shared by Grace Miller). With a "View all >" link below (non-functional).
- **Links sub-tab:** A list of shared links, each with a thumbnail, a title, and a source. The five demo links: "Plan Your Perfect Trip in Minutes" (Facebook); "Top 10 Investment Properties in Tokyo" (Facebook); "Modern Living: Design Trends 2026" (Instagram); "Why Niddrie Is the Next Hotspot" (LinkedIn); "Your Mortgage Guide, Simplified" (Facebook). With a "View all >" link below (non-functional).
- **Agent's Properties block (agents only):**
  - Header "Agent's Properties" with a "View all >" link (non-functional, static text).
  - "Buy" / "Rent" toggle tabs (Rent selected by default).
  - A single property card rendered via the shared rich property-card component (`window.renderPropertyCard`, from the repo-root `property-card.js`, included before the page's inline script). It shows: a built-in hero illustration (chosen deterministically per listing) with the listing agent's name overlaid, a heart (favorite) icon, and decorative left/right nav arrows; the title, price (with "(monthly)" for rent or "(sale)" for buy as the price unit), location, and gross return overlaid on the hero; then an amenities row (type chip + beds/baths/parking/area) and a clamped description. Rent listing maps to type "Residential" (6 beds, 4 baths, 2 parking, 100 m²); Buy listing maps to type "Apartment" (3 beds, 2 baths, 1 parking, 120 m²). The component injects its own CSS; the old `.pcard*` styles remain in the page but are unused. The Buy/Rent tab toggle still re-renders the card; `cardNav` is retained (the new card's arrows are decorative only).
  - Three dots beneath the card (decorative pager; the first is highlighted).
  - Rent listing: "Tiny Home In Shinano Kamiminochi", ¥4,000,000 (monthly), Tokyo Japan, 5.8%. Buy listing: "Luxury Apartment In Minato", ¥98,500,000 (sale), Minato Tokyo, 6.4%.

#### Dropdowns — label, every option, default, effect

- **Language dropdown** (globe button). Default: **English**. Options, in order: English, Spanish, Japanese, Italian, Traditional Chinese, Arabic, Simplified Chinese, Portuguese, Korean, Indonesian, Thai, Vietnamese, German, Hindi, French. Effect: selecting a language updates the button label, highlights the chosen option, clears any messages currently shown translated, and re-renders the thread. The selected language is only the **target** for per-message translation — selecting it does not auto-translate anything. Whenever the selected language differs from a message's own language, a per-message **"Translate to {language}"** link appears under **every** message (both incoming and my own); clicking it translates just that one message and the link becomes **"Show original"**. Note: this is a demo — the message text itself is not actually re-translated; only the tag/toggle appears.
- **Emoji picker** (smiley button): A grid of emoji. Available: smiling face, laughing, smiling-with-eyes, heart-eyes, thumbs up, folded hands, party popper, fire, red heart, smiling-with-sunglasses, thinking, sweat-smile, clapping, sparkles, crying, winking, raised hands, hundred. Clicking one appends it to the message input and closes the picker.
- **Status badges:** The only status-style indicators are the unread count badge on conversation rows, the online green dots, and the "Online" / "Offline" subtitle text. There are no role/approval badges on this screen.

---

### Modals & Popups

- **Lead-group picker / Save popup.**
  - **Trigger:** the Save (heart) button in the chat header.
  - **Title:** "Add to lead group".
  - **Subtitle:** "Add this contact to a lead group." when the contact is not yet saved; "This contact is saved. Pick a lead group or remove it." when already saved.
  - **Group list:** one selectable row per existing lead group that matches the current tab's audience (End User groups when on the End User tab; Agent groups when on the Agent tab). The row shows the group name; a check mark appears on the group this contact is currently saved into. Default End User groups: "High-Net-Worth Investors", "First-time Buyers Vietnam", "International Buyers". Default Agent groups: "Top Performing Agents", "Standard Agents Tokyo/Osaka".
  - **Empty state inside the popup:** if there are no groups for the current audience, it shows "No End User lead groups yet. Create one in Lead Management." (or "No Agent lead groups yet. Create one in Lead Management." on the Agent tab).
  - **"Remove from saved" link (footer):** a heart-icon link shown only when the contact is currently saved. Removes the contact from saved.
  - **Buttons / close:** there is no explicit Save/Cancel button — clicking a group row commits the save and closes the popup. The popup also closes when you click the Save button again, click anywhere outside it, or press Escape.
- **Language dropdown** (covered above) — opens from the globe button, closes on outside click or Escape.
- **Emoji picker** (covered above) — opens from the smiley button, closes on outside click or Escape, or after picking an emoji.
- **Message Templates popup.**
  - **Trigger:** the "Message Templates" button in the composer.
  - **Title:** "Message Templates".
  - **Contents:** four template rows, each with a title, a preview of the text, and a "Use" button. The templates: "Initial greeting" — "Hi! Thank you for reaching out to YUUSHI. How can I help you today?"; "Viewing confirmation" — "Your viewing has been confirmed for [date] at [time]. Please let us know if you need to reschedule."; "Follow up" — "Just checking in to see if you had any further questions about the property."; "Out of office" — "Thank you for your message. I am currently out of office and will respond as soon as possible."
  - **Effect of "Use":** fills the message input with that template's text (does not send it) and closes the popup.
  - **Close:** outside click or Escape, or using a template.
- **Message context menu.**
  - **Trigger:** right-click on any message bubble.
  - **Items:** "Pin message" (shows as "Unpin message" with a filled star icon if that message is already pinned) and "Copy message".
  - **Close:** clicking an item, or clicking outside it.
- **Note:** There are no browser confirm()/alert() dialogs on this screen, and no full-screen modal overlay; the styled confirm modal that exists in the code is not used. All feedback is via toast messages.

---

### Conditional Display

- **Online green dot (row, header, side dot):** shown only when the contact is online.
- **Unread badge + bold name:** shown only when a conversation has unread messages; cleared to zero the moment the conversation is opened.
- **Status subtitle company suffix:** the company name is appended to the status line only for Agent conversations.
- **Working-hours system message:** shown in the thread only when the contact is an Agent and is offline.
- **Per-message "Translate" / "Show original" link:** shown under a message only when the selected target language differs from that message's language; it toggles that single message between original and translated (manual, never automatic).
- **"Message failed to send. Tap to retry":** shown only under my messages whose status is "failed".
- **Pinned thumbtack badge on a bubble:** shown only when that message is pinned.
- **Pinned-messages bar:** shown only when at least one message is pinned. The "VIEW MORE/LESS" link within it appears only when more than one message is pinned.
- **Info panel content:** End-User layout (name/email/phone) vs. Agent layout (company/address/response time + Agent's Properties) depends on which tab the contact belongs to. The default open sub-tab also differs (Media for users, Links for agents).
- **Save button label/icon:** depends on audience (User vs. Agent) and on whether the contact is saved.
- **Lead-group popup subtitle and "Remove from saved" link:** depend on whether the contact is currently saved.
- **Lead-group list contents:** filtered to the current tab's audience; replaced by an empty-state message if none exist.
- **Demo pins:** when the conversation with "Grace Miller" is opened, three pinned messages are pre-seeded automatically.
- **Mobile/narrow width:** hamburger button appears, the conversation list becomes a slide-in overlay, the info panel becomes an overlay, and action-button text labels are hidden (icons only).

---

### User Flows

- **Open a conversation:** Click a row in Panel 1. The thread loads in Panel 2, the contact's info loads in Panel 3, that conversation's unread badge clears to zero, the row highlights, the target language resets to English and any open per-message translations are cleared, and the cursor focuses the message input. (Opening Grace Miller also loads three demo pins.)
- **Send a message:** Type in the composer and press Enter, or click "Send". The message is appended to the thread on the right (time shows as "Now"), the conversation's preview updates to that text, the input clears, and any open popups close. Sending an empty/whitespace-only message does nothing.
- **Switch audience tab:** Click "End User" or "Agent". The list reloads for that audience and the first conversation in it opens automatically.
- **Save a contact to a lead group:** Click the Save (heart) button to open the picker, then click a lead group row. The contact is marked saved with a check mark on that group, the Save button switches to its "Saved" state, a confirmation toast appears, and the contact is written into the shared lead-group store (and added as a lightweight lead record) so it appears in Lead Management. To undo, reopen the picker and click "Remove from saved".
- **Other flows:** Retry a failed message by clicking its "Tap to retry" link (it becomes sent, toast confirms). Pin/unpin via right-click context menu or the pin bar's unpin/close-all controls. Copy a message via the context menu. Insert an emoji or a template via their composer popups. Attach a file via the paperclip (toast confirms the filename). Toggle the right info panel via the window button or its close X. **Translate a message:** pick a target language from the globe dropdown, then click "Translate to {language}" under any individual message to translate just that one (click "Show original" to revert) — there is no automatic translation.

---

### Validation

- **Search box:** Optional. Filters the conversation list as you type; the match is case-insensitive and checks both the contact name and the message preview. No match shows the "No conversations found." empty state.
- **Message composer:** The text must contain at least one non-whitespace character to send; otherwise Send/Enter is ignored silently. No length limit, no other field validation.
- **File attach:** No type/size restriction (demo only; the file is not uploaded — it just confirms the chosen filename).
- **Lead-group picker:** Selection only from existing groups; there is no free-text entry, so no input validation. If no groups exist for the audience, the user is directed to create one in Lead Management.
- There are no required-field forms or error messages anywhere on this screen.

---

### Empty States

- **Conversation list (no search match):** "No conversations found."
- **Lead-group picker (no groups for the audience):** "No End User lead groups yet. Create one in Lead Management." or "No Agent lead groups yet. Create one in Lead Management."
- **Pinned-messages bar:** hidden entirely when there are no pins (not an explicit empty message).

---

### Notifications & Feedback

All feedback is shown as a brief toast at the bottom of the screen (auto-dismisses after about 2 seconds). Exact texts:
- "Message sent" — after retrying a failed message.
- "Message copied" — after using "Copy message" in the context menu.
- "User added to "{group name}"" (e.g. User added to "High-Net-Worth Investors") on the End User tab, or "Agent added to "{group name}"" on the Agent tab — after saving a contact to a lead group. The group name is wrapped in curly quotes.
- "Removed from saved" — after removing a contact from saved.
- "Attached: {filename}" — after choosing a file with the paperclip.

In-thread (non-toast) feedback text: "Message failed to send. Tap to retry" on a failed message; "Translate to {language}" / "Show original" on the per-message translate toggle, with a "Translated · {source} → {target}" tag on a translated bubble.

There are no native confirm dialogs and no success/error banners — only the toasts above.

---

### Navigation

- **Within this screen (no page change):** audience tabs "End User" / "Agent"; info sub-tabs "Media" / "Files" / "Links"; agent property tabs "Buy" / "Rent" with prev/next arrows on the property card; show/hide of the right info panel; all popups (lead-group picker, language, emoji, templates, context menu).
- **No hyperlinks to other admin pages** exist on this screen. The "View all >" links (Media, Files, Links, and Agent's Properties) are static text with no action.
- **Cross-screen data integration (persistence):** Saving a contact to a lead group writes to browser local storage under the keys **yuushiLeadGroups** (the lead groups, including which contacts belong to each) and **yuushiLeads** (a lightweight lead record per saved contact). These same keys are used by the Lead Management screen, so contacts saved here show up there. Saved contacts are given generated lead IDs prefixed "U-MSG-" (End Users) or "A-MSG-" (Agents). If the lead-group store does not yet exist, a default set of groups is seeded automatically.
- **Note:** The saved/lead-group state is the only persisted data. Other in-session changes (sent messages, pins, read/unread, current language) are not persisted and reset on reload; reloading also reopens the default Grace Miller conversation on the End User tab.
