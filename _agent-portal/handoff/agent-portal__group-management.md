# Groups

Source: [group-management.html](../group-management.html), current working-tree implementation.

Access: Messages → Groups.

List: Group Name, Members, Created, Last Modified, Actions; search and owner filter. Create/Edit modal has required Group Name, Description and Color Tag. `saveGroupModal()` creates/updates the page-local group; detail shows owner, dates, member count and members.

Add Contact selects existing contacts outside the group, requires at least one selection, and adds memberships. Individual/bulk Remove from Group removes membership only. Deleting a group removes its memberships while keeping contacts.

Member table: Contact Name, Last Interaction, Buyer Status, Nation, Status, Actions plus selection. Export and Send Broadcast controls are mock feedback; contact detail action is an alert directing the reviewer to Contacts, not an integrated detail navigation. There is no contact creation in this screen. Arrays are local to the page, not a shared Contacts/Groups/Message Center persistence layer.
