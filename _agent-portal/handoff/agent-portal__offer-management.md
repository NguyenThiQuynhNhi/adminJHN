# Offers (`offer-management.html`)

**Purpose:** A lighter offer workspace for the agent portal. The screen is a single static HTML file with inline CSS and vanilla JS, combining an offers list, a detail view, and an edit form. All data is hardcoded demo content; save/delete actions are stubbed with toasts and confirm dialogs.

**Access:** Sidebar → Workspace → Offers.

## Layout & structure

The page uses three in-memory screens inside one document:

- **List** — searchable/filterable offers table with status pills, gap badge, pagination, and row actions.
- **Detail** — selected offer summary with linked lead callout, property/client sections, negotiation history tabs, activity rail, and comments.
- **Edit** — form for updating offer details with lead/client/property context locked from the source lead.

Switching between List / Detail / Edit is handled by inline JS functions (`showList()`, `showDetail()`, `showEdit()`). No routing, backend, or persistence is used.

## Sidebar and navigation

The screen is now wired into the Agent Portal shell sidebar via `index.html` under Workspace as **Offers**. It loads in the iframe like the other agent pages.

## Export action

The CRM lighter page uses a new Export menu pattern with two choices:

- **CSV** — downloads the filtered activity log as `activity-log.csv`.
- **Excel** — downloads an `.xls` file using an HTML table payload so Excel can open it without extra dependencies.

## Data model

Demo data is stored in in-memory arrays:

- `OFFERS` — list rows with property, client, prices, date, status, and owner.
- `STAGES` — pipeline step labels for the detail view.

All actions are local-only and reset on reload.