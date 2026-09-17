# Monetization CMS review and source mapping

Completed before implementation. Source: `MONETIZATION YUUSHI - NEW VERSION.docx`, containing Admin, Agency/Support Portal, and Customer Portal specifications. Read all ten Admin pages and Agency/Supportal plans, cart, booking, campaigns and billing mockups, plus Customer plans/billing. Existing portal sample prices are independent examples, not business constants.

## Engine understanding
- Subscription: scoped plan records own cycle, price, tier and features. Active changes preserve paid terms until cycle end and require explicit renewal acceptance. Retirement stops new purchases and renewal; no forced migration.
- Cart: existing functional catalog only; configurable quantities, durations and prices. Each purchase succeeds/fails independently. Coverage uses shared ward tiers; Supportal also has service categories.
- Advertising: seven Agency products and one exclusive Supportal page. Each concrete placement owns pricing/capacity. Pending bookings reserve capacity and retain their submitted price. Review within seven days; approval charges once; rejection requires a reason. Approved bookings cannot be cancelled/refunded or extended.

## Gaps and proposed controls
| Screen | Existing gaps | Proposed controls and source |
|---|---|---|
| 01 Plans & Features | Generic feature rows, missing category/base score, toast save, misleading removal, no subscribers | Search/scope/status filters; complete plan drawer including assignments, quotas, discounts, disclaimer and score (Admin 1.1–1.5, 1.9, 3.7); feature registry create/edit/remove with affected-plan review (1.1/1.6); before/after and subscriber confirmation for publish/retire (1.6/1.8; Customer 8–9); secondary global ranking and renewal offsets (1.6/1.9). |
| 02 Requests | Audience only changes label; no category; quota edits disconnected | Scoped plan quota + included wards in one table with links to owning plan review (2.1–2.2); numeric duplicate window, separate account coefficients (2.4–2.6); simple Ward/Tier editor and single tier price source (2.3). |
| 03 Add-ons | Configure price contradicts row; uncontrolled variants and no persisted changes | Existing-item drawer, eligible accounts, bundle, numeric duration and price variants, disclaimer (3.1–3.2/3.7); parameter variants only; per-item volume factors (3.3); coverage links to tier price owner (2.3). |
| 04 Ads | Free-text inventory, disconnected calendar, incomplete sold-range controls | Seven Agency products + Supportal (4.1/4.25); entity selectors and exact slot key (4.3); dated price/capacity drawer and sold/pending timeline, waitlist detail (4.4/4.6/4.10); future-range validation and cutover conflict check (4.8–4.9); package and hometown discounts (4.5). |
| 05 Approvals | Placeholder creative, old dates, missing deadline and real decision | Actual local creative assets, submitted copy, target/destination, scope, fixed schedule/price, deadline and late-start warning (4.3/4.14–4.16/4.22); confirm approval; mandatory rejection reason and Other text; state updates and ledger/audit entries (4.12–4.19). |
| 06 Recommendations | Sparse evidence, wrong homepage peers, immutable guardrails, toast actions | Separate engines; evidence drawer, peers/fallback, observed period, samples, current/proposed price, confidence (5.1–5.5); editable engine guardrails and signal thresholds (0.2); effective date and approval/rejection with affected object review; no automatic application. |
| 07 Revenue | Totals fail reconciliation; no dates or drill-down | Date filters, totals calculated from successful charges/captures, engine → product → placement → transaction detail (6.3–6.4). |
| 08 Dashboard | Static counters and fake navigation | Read-only derived counters and links to booking, transaction, renewal, delivery and reconciliation details (7.1–7.7). |
| 09 Audit | Search only; unrelated suspension row | Read-only date/actor/action/engine filters, before/after detail, appended mock changes (8.2). No suspension action. |
| 10 Operations | Nonfunctional transaction filters; no incident drill-down; visibility lacks typed confirmation | Engine/account/date/status/reason filters and transaction details (6.1); reconciliation incidents (6.2), renewal/stale/delivery detail (7); simple global performance visibility with CONFIRM to reveal (4.24). |

## Ambiguities / implementation boundaries
- Supportal category taxonomy conflicts: Admin examples Moving/Cleaning vs Agency eight-category list. Use the explicit eight-category list as mock platform inventory (Law, Tax, Repair, Construction, Mortgage Provider, Mortgage Broker, Property Manager, Insurance); do not create categories here.
- Admin 4.8 uses campaign dates for cutover pricing, 4.9 uses submission timestamp. Preserve locked bookings and block overlapping mode changes; do not simulate ambiguous buyer quotes.
- Generic CPM toggle vs detailed CPM rate derivation restricted to 4/5/6: expose mode and rate configuration per Admin 4.7/4.25, but do not invent impression forecasts or quote calculations for other products.
- Immediate notification is called both mandatory and configurable. Keep first notice immediate; expose numeric pre-end reminder, document immediate-offset ambiguity.
- Broad no-code principle conflicts with explicit seven-day review and absolute no-refund rules. Keep the explicit fixed lifecycle boundaries; configure operational thresholds separately.
- Ward bulk assignment is supported by source 2.3, but user explicitly requests simple Ward/Tier and no extra bulk actions; omit bulk actions.
- Additional Service Category conflicts with exactly-one account category wording. Preserve the existing Supportal-only add-on; do not redefine account identity or matching rules.
- Local browser mock storage only; no APIs, real charges, messages or external writes. Mock fixture clock is labeled. Portal fixtures remain independent.
