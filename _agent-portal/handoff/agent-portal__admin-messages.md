# Admin Messages — 1:1 Chat (Agent perspective) (`admin-messages.html`)

**Purpose:** A three-panel 1:1 chat built for the **agent**. The logged-in user is the agent ("me" = Taro Tanaka), so the platform side appears as a pinned "Platform Admin / Support" thread, and the people the agent chats with are **Clients** (end users). Demo data; mutations are in-memory (except lead-group writes, which use localStorage).

**Access:** Sidebar → Messages → Admin Messages, or the header chat button in the shell.

---

## Layout & structure

Three panels: conversation list (left) · chat thread (center) · info panel (right).

## Conversation list (left)

- Header is just a search box ("Search messages, people"). **The old End User / Agent tabs do NOT exist** (the tab CSS remains in the stylesheet as dead styles, but no tab markup is rendered).
- `renderList()` builds two parts:
  1. **A single pinned "Platform Admin / Support" thread at the top** (sticky, gold left-border, headset icon, a thumbtack pin-flag, online dot, time "10:25 AM", unread badge 1). Always first unless filtered out by search.
  2. **A "Clients" section** (a `Clients` label) listing 8 client conversations: Liam Anderson, Lucas Williams, Grace Miller, Sophia Chen, Benjamin Knight, Olivia Foster, Jackson Adams, Ethan Sullivan.
- Empty state: "No conversations found."

## "Me" identity

"Me" is **Taro Tanaka** — outgoing message sender name is hardcoded "Taro Tanaka"; seeded client messages address the agent as "Hi Taro!".

## Pinned Admin thread (data)

`adminThread`: name "Platform Admin / Support", company "YUUSHI Platform Administration – SUPPORT", address "YUUSHI Operations Center, Chiyoda, Tokyo 100-0001", response "Within 15 min", 4 seeded messages (verification-approved flow). When offline it shows a system message: "Platform Admin support hours are 08:00 – 16:00." / "They will get back to you as soon as possible." This thread is the default opened on init.

---

## Chat header (center, top)

Avatar, name, online/offline. Actions:
- **Save Client** (heart, becomes "Saved Client") — opens the "Add to lead group" popup. **Hidden for the Admin thread** (support can't be saved as a lead).
- **Language** (default "English") — opens a 15-language dropdown for per-message manual translation.
- **Toggle info panel** icon.

## Save → Lead Group popup

Header "Add to lead group". Integrates with Lead Management via `localStorage` keys `yuushiLeadGroups` / `yuushiLeads` (only end-user/client lead groups are shown). Picking a group → toast 'Client added to "{group}"'; removing → toast "Removed from saved". Empty state "No Client lead groups yet. Create one in Lead Management."

## Messages & composer

- Bubbles render as `me` / `them` with per-message meta (name · time). Failed messages show "Message failed to send. Tap to retry" (Grace Miller has one seeded); retry → toast "Message sent".
- **Pin bar** ("PIN MESSAGE") above the thread shows pinned messages with VIEW MORE / VIEW LESS and a clear-all (×). Grace Miller's chat has 3 demo pins.
- **Manual translation only:** when the target language differs, a "Translate to {Lang}" / "Show original" link appears; `pseudoTranslate()` is a no-op placeholder (returns the original). Translated bubble tag "Translated · {src} → {target}".
- **Composer:** emoji button (18 emojis), text input ("Type message...", Enter sends), paperclip attach (toast "Attached: {filename}"), a **Message Templates** button, and **Send**. Sending appends a "me" message with time "Now".
- **Message Templates** popup (4): "Initial greeting", "Viewing confirmation", "Follow up", "Out of office" — each with a "Use" button that fills the composer.
- **Context menu** (right-click a bubble): "Pin message" / "Unpin message", and "Copy message" (toast "Message copied").

## Info panel (right)

- **Client view:** Full Name, Email, Phone, then tabs **Media / Files / Links** (default Media), each with "View all >".
- **Admin view:** company, address, "Usual response time: Within 15 min", same tabs (default Links).

---

## Notifications (toasts)

"Message sent", "Message copied", "Attached: {filename}", 'Client added to "{group}"', "Removed from saved".

## Persistence

Lead-group saves use shared `localStorage` keys `yuushiLeadGroups` / `yuushiLeads` (shared with Lead Management and Message Center). All chat/message state is in-memory and resets on reload.

> **Note:** the file references `property-card.js` (`renderPropertyCard`) and has property-card CSS, but no property card is actually mounted in the current rendered info panels.
