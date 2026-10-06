# YUUSHI / JHN — Current Code State — 2026-10-06

This snapshot is derived from the current repository implementation after the latest Admin + Agency reconciliation work. It is a handoff aid, not a replacement for the source-of-truth hierarchy.

## Source priority

1. Latest explicit JHN/Yuki answer / latest MoM
2. Latest corrected Q&A / confirmed specification
3. UI Implementation Confirmation
4. Current SRS
5. Approved BA proposal
6. Current code/mockup

Code is implementation evidence. It must not silently override a newer client decision.

## Agency — current changes

### Dashboard

- Embedded Agency Dashboard no longer renders its own internal left sidebar inside the Agency shell.
- Dashboard selector remains available from the embedded header.
- 29 selectable metrics remain.
- Property View = organic Property Card visible in viewport; Property Detail page load is not a View.
- Repeated valid viewport exposures are counted when the card leaves and re-enters.
- Organic and Paid Property performance remain separate; no Organic + Paid combined total.
- External/off-platform transactions are excluded from Yuushi Sales KPIs.
- Sales Value by Staff uses Closed By / `closedByStaffId`.
- Average Days to Close uses the same eligible on-platform Sale population.

### Projects

- Missing Project filter runtime fixed.
- `FILT`, `buildPtypeChecks()`, filter synchronization, apply/sort/pagination and `renderPagination()` are restored.

### Messages / File Library

- Agency Admin inquiry actions: view/reply/assign/close.
- Composer + menu: Add work content / Upload images and files / Insert Property / Message Templates.
- Agency File Library is Agency-wide and reuses the same stored `fileId` across multiple chats.
- Delete rights: uploader or Agency Admin.
- Deleted file leaves the chat message and attachment becomes unavailable.
- Suggest Agent forwarding is fixed.

### Agency Profile

- Withdraw from YUUSHI is under Agency Profile only, not My Profile.
- Header shows Verification status and Profile completion percentage.
- Do not display business-rule sentences explaining scoring/property-upload eligibility.
- License Verification contains required Agency document upload and Submit for Verification.
- Submission flows to Admin Agency License Verification through the current browser-local prototype bridge.

### Property notifications

Current Agency Property notifications include:

- Property rejected by Admin — with reason.
- Property suspended by Admin — with reason and Admin note when available.
- Property report requires response — with report reason.
- Property pending Admin review.

Notification copy is operational only: event/status/reason/action. Do not add SRS explanations to the notification UI.

### Inquiry duplication

- Repeated Chat with Agency reopens the active Client–Property Inquiry.
- If the previous Inquiry is closed, a later request creates a new Inquiry.
- Lead is not reused as an Inquiry record.

## Admin — current changes

### Agency License Verification

Lean current flow:

Verification Queue → Agency Information & Documents → Three-Source Comparison → External Search Check → Decision.

Queue filters only: Keyword / Status / Submitted From / Submitted To.

Removed from operational UI:

- Bulk Assign
- Assigned Admin / Team
- Review Deadline
- module-specific permission profile/granular permission matrix
- confidence/mismatch over-filtering
- code-status lifecycle UI
- normalization tutorial
- OCR provider/legal/infrastructure training copy

Decision actions: Pass Document Review / Return / Deny.

Rules & Thresholds are read-only by default. Edit Settings enables controls; Save Settings / Discard Changes only appear while editing. Auto Approval is an editable checkbox. File types follow platform-wide upload policy.

### Area & Market Data

- Land Prices renamed to Station Price Ranking.
- Admin safety filter disables Area/Station choices when data is unavailable.
- No explanatory threshold/calculation tutorial on operational screens.
- Market Trend validates the fixed 14-column CSV schema.
- Two initial dataset records are seeded for UI review when storage is empty.

### SEO

Primary tabs: Global Settings / Property Detail / Agency Profile / Insight.

Insight subtypes render as a secondary tab row: Area Guide / Article / News / FAQ.

## Still pending client confirmation

**Transaction Verification / Review:**
- Agency/Client price mismatch final workflow.
- Client says transaction was not completed.
- Final statistics/review eligibility/evidence-dispute consequences for those cases.

Do not silently resolve these in code or SRS until JHN confirms.

## Known SRS reconciliation needed later

The latest Word Agency SRS must be updated only from the exact latest final DOCX when available. Do not rebuild from an older DOCX without explicit user approval.

Dashboard SRS still needs the code/client decisions reconciled where old text remains stale, especially:
- confirmed repeated Property View rule
- confirmed Inquiry reuse/new-record rule
- Organic vs Paid separation
- Closed By attribution
- External/off-platform transaction exclusion
- client-Japanese Total Platform CPA formula
