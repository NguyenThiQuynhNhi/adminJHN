# Message Center

Source: [message-center.html](../message-center.html), current working-tree implementation.

Access: Messages → Message Center. Current internal navigation has **Message Campaigns, Message Templates, Automations**. Delivery Trend is part of Campaigns, not a separate Delivery Analytics screen.

## Campaigns

Search name, filter **Sent / Scheduled / Draft**, and sort Newest first / Oldest first by sent date. Table: Campaign Name, Audience, Status, Sent Date, Recipients, Read (count/rate), actions; 50 rows per page. Recurring seed campaigns expand to per-send rows. Sent rows offer View/Recreate; others Edit/Delete. Admin-first pinning is not implemented.

Five-step builder: Details, Audience, Message, Schedule, Review. Campaign name is checked on progression. Visible audience choices are **All (End Users + Agencies), End User Group, Agency Group**, with a group picker and create-group action. Runtime also retains `End User`/`Agent` audience values and legacy `all_users`/`all_agents` branches; do not describe this as Admin/Client-only. The default builder code can select a legacy audience value with no matching visible radio.

Message editor supports formatting, preview, templates, property/agency pickers and variables `{full_name}`, `{agent_name}`, `{property_name}`, `{platform_name}`. Schedule UI offers immediate, date/time, or recurring Daily/Weekly/Monthly with time/end date (JST).

`saveDraft()`/`launchCampaign()` mutate the in-memory campaign collection. Launch passes **Sent** even when a future/recurring schedule was chosen; no scheduler or message delivery runs. Editing saves name/status only. Do not promise persisted rich message content or recurring sends.

## Templates and Automations

Template list/editor provides name/body, save/delete and reuse. `saveTemplate()` stores local template data; no service is called.

Automations list comes from `AUTOMATION_CATALOG` entries with chat enabled. Search and Active/Inactive filters, locked required triggers and optional toggles remain. `openAutoDrawer()` now opens an inline detail view with timing controls, Message Pattern and a rich-text Chat Body. `saveAutoDrawer()` saves the Chat Body via `AutoStore`; timing controls are not saved by that handler. Unsaved body changes can prompt discard.

Create group requires a name and End User/Agency audience, writing `yuushiLeadGroups` with `end_user`/`agent` entity type. This is separate from Contacts/Groups page-local arrays. `automation-catalog.js` supplies its own local automation store. Chart.js renders the seeded Delivery Trend. Page title and audience terminology retain Admin-oriented copy; these are implementation mismatches, not new Agency requirements.
