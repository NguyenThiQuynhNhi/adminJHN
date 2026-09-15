# Agreement — accepted agreements

Source: [agreement-management.html](../agreement-management.html), current working-tree implementation.

Access: Workspace → Agreement.

- Accepted-only list: Agreement name, accepted status (`ACCEPTED`), Published, Accepted On, and view action. Rows and eye icons open the selected agreement.
- `getFiltered()` searches titles case-insensitively; sort selects newest/oldest acceptance date or title. Ten rows per page with previous/numbered/next controls and count.
- `showDetail(id)` renders that record's title, published date, acceptance date, accepting user and agreement body; Back returns to the list.
- Read-only review of already accepted documents. There is no create/edit/accept/approval flow or Agency pending state here. The empty result message means no accepted agreements match, not an unimplemented page.
- Evidence: `agreements`, `getFiltered`, `renderList`, `showDetail`. Records are seeded; `agency-dashboard-source.js` exposes a read-only preview of these page records.
