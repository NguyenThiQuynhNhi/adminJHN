# Offers

Source: [offer-management.html](../offer-management.html), current working-tree implementation.

Access: Workspace → Offers.

The list searches/filters seeded offers, sorts columns, and cycles 10/25/50 rows. Columns include Property, Client, Offer Price, Counteroffer, Gap, Last Updated, Status and Owner. List/edit status values are **Pending, Countered, Accepted, Rejected, Withdrawn, Expired** (lowercase keys in list data).

Detail presents linked lead/client/property, price summary, negotiation/history panels, activities and comments. The detail pipeline separately uses **Draft, Sent, Viewed, Countered, Negotiating, Accepted**, plus a Mark Rejected toast action. This pipeline is not synchronized to the list status model.

Editor: linked Lead, Client, Property and List Price are disabled. Editable controls are Status, Offer Price, Offer Date Sent, Expiry Date, Counteroffer Price, Counteroffer Date Sent, Owner, Next Follow Up Date and Notes. Status/Offer Price have required markers.

`showDetail()` displays the fixed sample detail rather than resolving the clicked row. `saveOffer()` only toasts and returns to that detail. `setStage()` changes the detail pipeline presentation. **Convert to Agreement** is present but only calls `toast('Convert to Agreement')`; it does not create an agreement or navigate. Activity/comment actions are local UI demonstrations. No CRM Export function is implemented here.
