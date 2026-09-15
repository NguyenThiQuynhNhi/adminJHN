# Contacts

Source: [contact-management.html](../contact-management.html), current working-tree implementation.

Access: Messages → Contacts.

Existing contacts are searched by the page filters: group, Active/Inactive status, last interaction (all/7/30/90 days), owner and search. Table: Contact Name, First Contact, Last Interaction, Groups, Status, Actions plus selection. Bulk actions assign groups or show an Export toast.

Detail shows contact info, profile, additional information, investment/preferences, groups, related leads/offers, activity and comments. Enter adds a local comment. Edit exposes contact/name/date/phone/email/notes, profile, Japan ownership and residency, buyer status, preferred area, budget, yield, bedrooms, purpose and property status. `saveEditContactModal()` writes the local object. Restore Original confirms and restores the seeded snapshot. Some duplicated phone inputs are not independent: saving takes country code primarily from the combined Phone field.

`saveAssignModal()` adds checked memberships without removing unchecked existing memberships; it can create a named group inline. No new-contact or Inquiry creation workflow is present. Export is a toast, not a downloaded file. Contacts/groups here use page-local arrays; do not assume they synchronize with the separate Groups page or chat's legacy localStorage group store.
