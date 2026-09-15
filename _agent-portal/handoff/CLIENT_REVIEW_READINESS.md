# Client-review readiness — current implementation limits

This documentation-only review follows the current working-tree HTML/JS. These are observed mockup limitations; no runtime fix or new requirement is implied.

## Document coverage

Every sidebar leaf, including Dashboard submenus and CRM hashes, has an entry in [INDEX.md](INDEX.md). Standalone authentication and supplementary property detail are documented separately. Obsolete monetization, Inquiry and alternate CRM docs have been replaced/removed. Historical Dashboard scope material is isolated under `historical/`, outside the client-review package. The Dashboard implementation handoff is unchanged.

## Remaining implementation inconsistencies

| Area | Current behavior / limitation |
|---|---|
| Lead | Pipeline and edit dropdown have different status coverage. Sold lock applies to the local detail pipeline, not all editable controls or persisted lead state. General Save and Send to Client Chat are toast-only. Lead closing does not feed the shared transaction verification store. |
| CRM | Required field markers exceed save-handler checks; Save does not change records. Lead comments and CRM Comments have no shared write path. |
| Calendar | Quick-create lacks required Viewing Lead/Property relationships, permits Comment creation, and does not share CRM records. Notes are not saved. SMS/email labels do not implement delivery. |
| Offer | List/edit statuses differ from detail pipeline; selected rows open a fixed sample. Save and Convert to Agreement are toast-only. |
| Contacts / Groups / Messages | Contacts/Groups arrays and legacy chat/Message Center group storage are separate. Group member contact navigation, exports and broadcast actions are placeholders. |
| Message Center | Admin-oriented title and End User/Agency audience terminology remain; builder default can target a legacy value absent from current radios. Future/recurring Launch records Sent, not a scheduled delivery. Automation timing edits are not saved. |
| Property detail | Read-only title conflicts with working Edit / Add UI. Agent-relative back navigation is implemented. |
| Monetization | Stripe flows are represented, not connected. Book Ad draft/submit do not create persistent bookings. Cancellation updates a campaign card but not its fixed detail map. Plans/Billing/Cart are not synchronized. |
| Agency | Profile discard does not restore values. Staff removal and role deletion do not actually reassign listings/staff across screens. Security/email actions are simulated. Role matrix retains legacy feature names and is not universal enforcement. |
| Transactions | Verification and dispute workflows use localStorage; client confirmation is a simulation, evidence is file metadata. Suspension records use differing field shapes between entry points, so shared verification import is not uniform. |

## Client-review blockers

No documentation coverage blocker remains. This package can describe the current mockup for review, provided the above simulations and inconsistencies are visible to reviewers; it does not establish production readiness or a fully connected workflow.

The three unresolved BA questions remain in [AGENCY_DASHBOARD_IMPLEMENTATION.md](AGENCY_DASHBOARD_IMPLEMENTATION.md): Sales Value by Staff attribution, repeated Inquiry reuse-versus-create, and repeated Property View deduplication. They have not been resolved or expanded by this documentation task.

## Documentation validation

Static source checks passed: all 29 sidebar leaf destinations and matching handoffs; 154 current-document local links; all seven CRM status/column configurations; exact Lead pipeline values; no obsolete HTML references in current docs. The Dashboard implementation document is byte-unchanged. Hash comparison confirmed all 165 existing files outside the handoff directory were unchanged by this task. Runtime/browser tests were not run for this documentation-only synchronization.
