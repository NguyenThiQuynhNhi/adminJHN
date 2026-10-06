# Messages Box

Source: [admin-messages.html](../admin-messages.html), current working-tree implementation.

## Current behavior

Messages → Messages Box. Three-panel conversation UI with Agency Message / Agents Message views, local sending, property insertion, appraisal cards, templates and attachment handling.

Agency Admin inquiry actions are enabled (`view/reply/assign/close`). Platform Admin pinned support thread remains non-replyable.

## Plus menu

The composer `+` menu contains:

- **Add work content** — opens the Agency File Library picker.
- **Upload images and files** — uploads a new file to the shared Agency File Library, then sends its file reference in Chat.
- Insert Property.
- Message Templates.

Existing files are reused by the same `fileId`; they are not duplicated per Chat. If a stored file is deleted, the Chat message remains and the attachment displays **No longer available**.

## Agency File Library integration

Shared implementation: [agency-file-library.js](../agency-file-library.js).

Metadata is persisted in localStorage and file binary data in IndexedDB for the prototype. File ownership is Agency-wide; delete is allowed for uploader or Agency Admin. Storage usage/caps follow the current plan model in the shared file-library layer.

## Suggest Agent

`Suggest Agent` on an eligible appraisal card opens the staff picker. Selecting a staff member calls `confirmSuggestAgent(agentId, clientName)`, creates/selects the staff/client conversation and shows `Forwarded to {Agent}`. The earlier broken unquoted appraisal-id argument was removed.

## Persistence boundary

Conversation and attachment behavior is implemented for frontend review. File Library persistence is browser-local; there is no production storage/API in this prototype.
