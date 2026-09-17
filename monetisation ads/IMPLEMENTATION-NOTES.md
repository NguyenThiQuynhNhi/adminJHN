# Monetization CMS implementation

## Files
- Updated all existing `01-…html` through `10-…html` pages. Each remains a separately addressable HTML mockup.
- `cms.css`: retained original gold/cream design system; responsive tables, drawers, confirmation dialogs and calendars.
- `cms-data.js`: shared, explicitly labeled sample commercial objects, inventories, bookings, transactions, recommendations and controls.
- `cms.js`: filters, validation, editable records, review dialogs, navigation and browser persistence.
- `creative-0.svg` through `creative-3.svg`: local sample submitted banner artwork for visual booking review.
- `REVIEW-MAPPING.md`: pre-implementation gaps, source sections, engine understanding and ambiguities.
- `cms-verification.js`: browser integration checks; never loaded by the product pages.

## Major corrections
- Plans own feature assignments, quotas, coverage, discounts, category and ranking score. Registry changes and plan publishing show subscriber impact. Retirement preserves paid access and stops future purchases/renewals.
- Request configuration uses the same plans; Agency and category-specific Supportal values no longer share a cosmetic audience toggle.
- Add-on editors load actual catalog values; only existing functional types and parameter variants are editable. Coverage tier prices have one owner.
- Advertising has eight distinct products and concrete position/page/category/location/property/rank inventory. Calendar edits block reserved ranges, protect locked prices, and display capacity and waitlist data. Existing future ranges can be edited.
- Booking drawers display local creative artwork, submitted copy, destination preview, fixed schedule, deadline and price. Approval/rejection changes state and creates corresponding ledger/audit records. Other requires explanation.
- Pricing review separates engines, shows period/sample/evidence/peer basis, configurable guardrails and thresholds, and schedules approved future prices on the owning object. Homepage comparisons are historical only; three-page Static Banner peers fall back below minimum size.
- Revenue derives from successful charges and captures and reconciles through product/placement/transaction drill-down. Holds and releases are excluded.
- Dashboard and operations link to records; ledger and audit filters work. Nonzero reconciliation counts open incident rows. Performance visibility requires typed CONFIRM to reveal figures globally.

## Verification
Chrome browser integration suite: 42 checks passed, including all ten page renders and desktop overflow checks; plan save/reopen, category requirement, retirement, registry creation, add-on consistency and duplicate validation, eight ad products, reserved-date blocking, future calendar save, loaded creative, mandatory rejection text, approval/release ledger effects, scheduled recommendation, homepage comparison, revenue recognition and empty periods, audit filtering, typed visibility confirmation, transaction filtering, and nonzero incident drill-down.

Visually inspected the advertising calendar drawer. Browser tests use isolated iframe fixtures and restore prior mock storage. Run from a locally served CMS page: load `cms-verification.js`, then await `runCMSVerification()` in the browser console. Native Node is not installed in this environment; verification used Chrome's JavaScript runtime.

## Boundaries and unresolved source questions
See `REVIEW-MAPPING.md` for exact source conflicts: Supportal taxonomy/additional categories, cutover timestamp basis, CPM applicability, immediate notification offsets, and generic configurable thresholds versus fixed lifecycle rules.

This is a local browser mock, not a payment or scheduling service. Future plan/add-on prices are displayed as approved scheduled changes; a backend clock/job is intentionally absent. Subscriber impact uses labeled aggregate cohorts because actual subscriber rosters were not supplied. Inventory, evidence and financial rows are sample records, not live platform data. Agency/Supportal/Customer portal fixtures remain independent references.

No new monetization page, account-management/suspension action, functional add-on type, wallet, ad refund/credit, forced migration, external messaging or backend API was added. No unsupported bulk ward actions were added.
