# Admin — Agency License Verification

Source: `usermanagement/agency-license-verification.html`.

## Purpose

Lean semi-automated review flow for Agency license verification. The implementation follows:

**Verification Queue → Agency information/documents → three-source comparison → external/manual check → decision.**

## Queue

Filters are limited to:

- Keyword (Agency / request / license)
- Status
- Submitted From
- Submitted To

There is **no bulk assign**, Assigned Admin/Team, review deadline, confidence/mismatch filter matrix, code-status filter, or module-specific permission-profile UI.

## Detail

The review page keeps four operational sections:

1. **Agency Information & Documents** — submitted files with View/Download.
2. **Three-Source Comparison** — Registered Information vs OCR Result vs Corporate Number API with Match/Mismatch result.
3. **External Search Check** — external result, admin note/manual confirmation, official search-site link.
4. **Decision** — Pass Document Review / Return / Deny.

Normalization tutorials, legal/provider infrastructure text, training/SOP explanations and document-handling permission matrices are not shown in the operational UI.

## Rules & Thresholds

Rules & Thresholds remain available. Default state is read-only. **Edit Settings** enables controls; only then are **Save Settings** and **Discard Changes** shown.

`Auto Approval` is an editable checkbox. File types follow the platform-wide upload policy; the module does not maintain its own Allowed File Formats list.

## Agency-side bridge

Agency Profile submissions are loaded from localStorage `yuushi.agencyLicenseVerificationRequests`. Admin status changes are persisted back to `yuushi.agencyVerificationState` so the Agency Profile status pill reflects the review result in the prototype.

## Prototype boundary

The bridge is browser-local and exists to make the Agency → Admin workflow reviewable end-to-end. It is not a production API/storage implementation.
