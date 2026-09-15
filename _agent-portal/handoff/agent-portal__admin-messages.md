# Messages Box

Source: [admin-messages.html](../admin-messages.html), current working-tree implementation.

Access: Messages → Messages Box, or shell chat shortcut. The filename remains `admin-messages.html`.

Three panels: conversation list, chat/composer, contact/info panel. Default demo role is CEO (`currentUserRole = "ceo"`), with **Agency Message / Agents Message** tabs. Agency Message shows pinned Platform Admin plus client conversations; Agents Message groups client conversations by staff. CEO review threads marked `ceoReadOnly` disable composing; the header identifies CEO View.

Messages support local sending, failed-message retry, pin/unpin/clear, copy feedback, emoji/templates, attachments and manual translation controls. `pseudoTranslate()` returns the original text. The plus menu includes a property picker with search/filter/grid/table selection; property and appraisal cards are rendered in chat. Appraisal detail and PDF controls are mock interactions.

CEO Suggest Agent on eligible appraisal cards opens the staff picker; `confirmSuggestAgent()` creates/selects a local staff/client conversation marked read-only for CEO. This does not implement a server assignment or create an Agency-owned Inquiry entity.

Save Client uses the legacy `yuushiLeadGroups` / `yuushiLeads` localStorage store; the Platform Admin thread cannot be saved as a client. This store is not the page-local data in Contacts or Groups. Client info includes name/email/phone and Media / Files / Links. Message delivery, attachment upload and translation are simulated; conversation changes reset on reload.

Evidence: `renderList`, `renderStaffView`, `selectConvo`, `renderHeader`, `sendMessage`, `renderMessages`, `openPropertyPicker`, `renderAppraisalCard`, `confirmSuggestAgent`.
