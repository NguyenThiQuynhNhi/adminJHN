# Leads

Source: [lead-management.html](../lead-management.html), current working-tree implementation.

Access: Workspace → Leads.

## List and pipeline

`STAGES` exactly: **New, Assigned, Contact, Viewing, Proposal, Negotiation, Asleep, Sold, Closed Lost**. The pipeline uses Sold; rental closing uses the same stage with rental-specific wording.

Intent keys are `buy`, `rent`, `project` (purchase, rental, new development). Search/filter/sort and 10/25/50 row controls operate on the seeded list. Detail is selected with `showDetail(id)` and includes related property/project target, offers, activity and comments. Listing Owner and operational assignee are separate; `assignEnquiry()` checks the demo role permissions and records assignment history using `YuushiWorkflow` without changing Listing Owner.

## Editor

Visible editable controls: Lead Name, Contact Name, Status, Owner, Created, Next Follow Up Date, Property Type; location input method and locations; Transaction Type (To Buy / To Rent), Properties, Projects, price range and Description; New Build, Construction Stage, bedroom/bathroom ranges, area ranges, Air Condition and Furnished.

The editor Status dropdown contains only **New, Assigned, Proposal, Negotiation, Sold**. It is a subset of the pipeline. `saveLead()` only toasts and returns to detail; it does not persist these form values. Required markers are not comprehensive validation.

## Closing and lock

Selecting Sold opens `openLeadSoldModal()`: sale price + Sold Date for purchase; monthly rent, duration and Lease Start Date for rental; fixed related Type/Lot + sale price/date for project. `confirmLeadSold()` checks presence of price/date and project target, sets local closing state. Group 6 updates the selected lot; Group 5 appends a local transaction log without marking the whole floor-plan type sold. Purchase/rental closure displays local totals; this handler does not write shared verification records. The pipeline blocks further stage changes when `leadIsSold` is true. This is a status lock, not a blanket disabling of the editor, and does not apply to Closed Lost.

## Activity and messaging

Offer creation is available from the detail Offers tab. Activity additions and Enter-to-post comments update the local detail UI; they do not establish synchronized CRM records. File/image controls are mock interactions. Send to Client Chat confirmation describes sending a property and automatically creating a lead, but `confirmSendToChat()` is toast feedback; no delivered chat or new Inquiry is created by that handler.

Inquiry is client-initiated Chat-with-Agency. The assignment terminology used here does not add an Agency-created Inquiry workflow. Evidence: `STAGES`, `setStage`, `confirmLeadSold`, `assignEnquiry`, `saveLead`, `addActivityType`, `commentKey`, `confirmSendToChat`; shared `../mock-workflows.js` and Dashboard source adapter.
