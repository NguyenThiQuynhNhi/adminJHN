# Transactions (`transaction-management.html`)

**Purpose:** Transaction management workspace for the agent portal. The page is a standalone static HTML document with inline CSS/JS, covering closed deals and suspended listings, along with detail screens, edit flows, and pricing visibility controls. All data is demo-only.

**Access:** Sidebar → Workspace → Transactions.

## Layout & structure

The page contains:

- A list view with filters, stats cards, table rows, and row actions.
- A closed-deal detail screen with price visibility toggle, profile preview, activity rail, and comments.
- A suspended-listing detail screen with removal reason, visibility toggle, and comments.
- Separate edit screens for closed deals and suspended listings.

State is in memory only. The page switches between screens with inline JS (`showList()`, `showDetailClosed()`, `showDetailSuspended()`, `showEdit()`).

## Notes

- Closed-deal prices can be made public or private for agent profile display.
- Suspended listings are modeled separately so they can stay private and show removal reasons.