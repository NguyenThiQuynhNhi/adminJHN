# Appraisals

Source: [appraisal-management.html](../appraisal-management.html), current working-tree implementation.

Access: Workspace → Appraisals. The page title is Appraisal Requests Management.

List fields: Client Name, Property Type, Location, Status, Received Date, Actions. Search, Status and Property Type (House / Apartment / Villa / Office) filters, sortable headings, and 10/25/50 row pagination are implemented by `getFiltered()`/`renderList()`.

Exact statuses: **In Progress, Converted, Declined**. Row actions open detail, mark Converted or Declined. Decline confirms; conversion changes the sample status and removes it from the active queue conceptually, without creating a listing or lead.

`showDetail()` renders client and property sections, score where applicable, document/image files, related appraisals and comments. Enter posts a comment; uploads/images are mock UI interactions. `markConverted()`, `declineAppraisal()` and `quickAction()` mutate the local records. There is no Agency request-creation form. The source adapter exposes a read-only preview of the page's records; it does not synchronize mutations to a backend or shared Dashboard business store.
