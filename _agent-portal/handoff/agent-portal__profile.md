# Profile — Agency Profile & My Profile (`profile.html`)

Source: [profile.html](../profile.html), current working-tree implementation.

## Purpose and navigation

Agency → Agency Profile. The page has **Agency Profile** and **My Profile** tabs. `Withdraw from YUUSHI` belongs to Agency Profile only; My Profile does not contain withdrawal.

## Header status

The former `View mode / Editing…` label has been removed. The header shows operational status only:

- `Verification: Verified / Pending Review / Returned / Denied …`
- `Profile: {n}% complete`

The eligibility rule remains internal: Agency scoring/property-upload eligibility is derived from **Verified + 100% required Agency Profile completion**. The UI does not display explanatory business-rule sentences.

## Agency Profile verification flow

Licensing & legal information includes **License Verification**:

- Real Estate Transaction Business License *
- Real Estate Transaction Agent Certificate *
- Supplementary Document
- `Submit for Verification`

File types follow the platform-wide upload policy. Agency must complete all required Agency Profile fields and attach both required verification documents before submission.

Submission creates a record in localStorage `yuushi.agencyLicenseVerificationRequests`, updates `yuushi.agencyVerificationState` to `Pending Review`, and makes the request visible to Admin → Agency License Verification. Admin status changes are synced back to Agency Profile through the same local prototype bridge.

## Profile completeness

`profileCompletion()` calculates completion from required Agency Profile fields. `updateProfileStatus()` updates the verification/completeness pills and persists `yuushi.agencyProfileEligibility`.

## Edit behavior

Profile data is read-only until Edit Profile. Save validates enabled required fields. Cancel/dirty-check behavior remains local frontend behavior.

## Persistence / prototype boundary

Verification request/status and eligibility use localStorage for cross-page prototype flow. General profile field persistence remains frontend-only unless explicitly stored by the page. This handoff describes current UI behavior, not backend persistence.
