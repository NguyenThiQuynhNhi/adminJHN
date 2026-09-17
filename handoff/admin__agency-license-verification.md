# Admin — Agency License Verification

## Purpose and navigation

Independent content-only module at `usermanagement/agency-license-verification.html`. Admin sidebar → Users Management → Agency License Verification; `data-content="usermanagement/agency-license-verification.html"`. The existing iframe loader handles navigation. Default view is Verification Queue. Rules & Thresholds and Audit Log are sibling tabs. Review opens a full detail view in the same file, not an oversized modal.

All styles, scripts, icons and mock data are inline. The page works standalone without a CDN or external stylesheet. It follows User Management's gold/white tokens, responsive cards, scrollable tables, badges, dialogs, dropdown indicators and toasts. No Agency Management section is changed.

## List and filters

Ten hardcoded requests cover OCR Processing, full match without code, passed/awaiting entry, confirmed/approval-ready, critical mismatch, connection failure, parsing failure, returned, denied and approved. The returned example also demonstrates a normalized company-name match.

Summary filters: Pending Review, Manual Review Required, Awaiting Verification Code, External Check Error, Approved This Month, Returned or Denied. Counts use the whole mock queue and current month. Clicking a card applies that constraint alongside all current filters (AND).

Filters: keyword (request ID, agency ID/name, license number), verification status, OCR status, match result, external result, critical confidence min/max, submitted date range, expiry date range, assigned admin/team, critical mismatch, verification method and code status. Apply validates ranges; Reset clears all constraints. Applied filter chips clear one constraint each. Empty results have an explicit empty state. Selection clears when filters change; select-all covers the visible filtered rows.

Review, Assign and View Audit Log are available per row. Bulk assignment accepts an individual Yuushi Admin or a team. Assigning an individual preserves the existing team; assigning a team preserves the individual. Assignment changes are audited.

## Status flow and decision rules

1. OCR extraction and evidence comparison.
2. Full match permits an explicit Admin document-review decision; it never automatically approves the Agency.
3. `Document Review Passed` means only `documentReviewStatus === "Passed"`.
4. Contact or Address Verification Required.
5. Generate → Sent → Awaiting Entry.
6. Agency code confirmation → Confirmed.
7. Separate, confirmed Final Approval → Approved; Verified Date and Verified By are recorded.

The mock records both Sent and Awaiting Entry transitions in Audit Log. No direct cross-file persistence or update to `agent-management.html` occurs.

Final approval is guarded both in the button and handler: document review must be Passed and code must be Confirmed, the request must not be terminal, and Approve Agency permission is required. The confirmation callback checks the gate again. The disabled explanation is: “Final approval is available only after the verification code has been confirmed.”

OCR must be completed and external results Matched or Manually Confirmed before document review can pass. Mismatches, low confidence, missing critical evidence or policy-selected normalized review require a manual findings note. Normalized Match is never classified as mismatch. The Exact Match setting treats accepted normalization as equivalent evidence; missing critical evidence cannot silently satisfy it.

Return requires a reason, selected correction field/document, and confirmation. Additional instruction is optional. Deny requires a reason, internal note and explicit attestation of independently checked evidence. Address or Representative Name mismatch alone, and external errors alone, are not valid sole denial grounds. This is a human review control, not automated semantic validation of free text. Neither errors nor mismatches automatically deny.

Approved, Denied and Returned requests disable completed decision/code actions. Administrative assignment and audited document access remain available with permission. Retrying OCR after review has passed invalidates that review and revokes any code. External evidence retries similarly invalidate passed review. Changing verification method revokes prior confirmation and requires a new code.

## Detail sections

- **A — Request Summary:** IDs, Agency, timestamps, status, assignee/team, deadline, prior submissions, fraud and duplicate warnings, internal notes.
- **B — Uploaded Documents:** license, agent certificate and supplementary file; name/type/size/upload date, virus scan, deletion date, sensitive label, preview/download/access history. Preview is synthetic; download is a clearly named `.pdf.mock.txt` placeholder, not a real PDF original.
- **C — OCR Extraction:** requested eight fields, confidence, priority, extraction status and threshold warnings. Retry uses a short loading state and completion notification. OCR content is permission-restricted.
- **D — Three Source Comparison:** registered data vs OCR, Corporate Number API and external search; all requested fields, confidence, priority and result. API license fields explicitly show Not Available. Critical Mismatch is red; Exact Match green; normalized/low-confidence/manual review amber; unavailable gray; external failures purple.
- **E — Normalization Details:** illustrative original/normalized values for full-width, numerals, hyphens, entity notation, whitespace, variant Kanji, addresses and decomposed license numbers.
- **F — Corporate API:** number/name/official address/history/response/timestamp. Explicitly confirms corporate identity, not license validity.
- **G — External Search:** separate Matched, No Matching Information Found, Connection Failure, Parsing Failure, Timeout, Not Checked, Manually Confirmed states. Retry outcome is selectable under a mock-only expander. Manual confirmation requires an official-source attestation and note, with actor/time. The official-search link opens a separate tab; the module makes no external API request.
- **H — Document Review:** explicit pass, return and deny decisions, followed by the separate Contact/Address Verification and Final Approval cards.

## Verification code gate

Methods: Registered Email, Eligible Phone, Postal Mail to Official Registry Address. Postal destination always uses the stored official license/registry address, not the Agency-entered website address. A seed record includes an ineligible mobile number. The mock blocks Japanese 050, 070, 080 and 090 prefixes; production needs authoritative phone eligibility and international normalization. The required “IP phone and mobile phone are not eligible under the current rule.” note remains visible.

Controls expose timestamps, expiry, delivery status, attempts/max attempts, reissue history and status. Generate, Mark as Sent, Reissue, Revoke and Simulate Agency Code Confirmation enforce their allowed predecessor states. A generated but unsent code cannot confirm. Expired, locked and revoked codes cannot confirm. Reissue respects cooldown, revokes the old code and resets attempts. Expiry is checked by an interval and before actions. Mock Wrong Code and Expiry buttons exercise failure states. Successful confirmation is simulated, without disclosing or generating actual codes.

Generated codes snapshot expiry and maximum attempts from the current policy. Later policy changes do not retrospectively extend or expire them. Reissue uses the newly saved policy. Completed confirmations remain recorded until explicitly revoked or superseded.

## Rules & Thresholds

Per-field OCR thresholds and priorities, critical confidence, exact-evidence requirement, normalized handling, code expiry/attempts/cooldown, retention, formats and max file size are editable. At least one High priority field and allowed format are required. Thresholds are 0–100; numeric limits are validated. Maximum attempts and limits are whole numbers.

Save creates a Settings Changed audit entry; Discard restores saved values. Navigating away or changing mock permission profile with unsaved edits asks for confirmation; browser close/reload uses beforeunload. Auto Approval is OFF/disabled and marked Future Phase. Even future automated document review cannot bypass code confirmation without changing the business rule.

Retention and upload rules apply to future submissions: this Admin mock has no upload endpoint, and does not silently delete/revalidate stored seed documents. A generated code retains its snapshot limits.

## Permissions

The permission-profile selector is a testing fixture, not authentication. Verification Admin has all permissions; Read Only has queue and audit visibility; Restricted Reviewer adds OCR results, assignment and manual checks but no final decisions, originals or exports.

Permissions represented and checked:

- View Verification Queue
- View OCR Result
- View Original Document
- Download Original Document
- Assign Review
- Perform Manual Check
- Pass Document Review
- Return Application
- Deny Application
- Generate Verification Code (includes mock code lifecycle controls)
- Approve Agency
- Manage Verification Settings
- View Audit Log
- Export Audit Log

Sensitive controls are disabled and handlers recheck permissions. Original access also requires a clean scan and an unexpired retention date. Production authorization must be server-side; the static mock is not a security boundary.

## Audit and notifications

Audit includes timestamp, admin/team, action, request/Agency, previous/new status, document, IP/device and safe summary note. Required actions: View Original, Download, Assign, OCR Retry, External Check Retry, Manual Check, Document Review Passed, Return, Deny, Generate Code, Send Code, Reissue Code, Revoke Code, Code Confirmed, Approve and Settings Changed. Additional lifecycle entries cover processing, expiry, failed attempts and method changes.

Filters support request/action/admin/date range, and document access can be opened from a file. CSV exports the current filtered audit set with quoting and spreadsheet-formula escaping. No raw OCR values or verification-code values are automatically inserted in audit notes. Manual notes are retained in the permission-controlled detail rather than copied to ordinary activity messages.

Toasts cover processing completion, manual review, document pass, return, deny, code generation/send/expiry/attempt lock/confirmation, approval, external failure, assignment and settings saves. Notification claims are explicitly mock; no actual email/SMS/post is sent.

## Security and mock limitations

Sensitive-document labels, restricted access, clean-virus-scan fixture, access history and deletion dates are shown. OCR handling text explicitly confirms no AI training use and Japan processing/storage as mock contractual/environment assumptions. There are no production images, real secrets, encryption, scanners or OCR/network integrations. Normalization is illustrative, not a complete Japanese address or legal-name matching engine.

Everything is in memory and resets on reload. No backend, cross-file persistence, production authentication or automatic Agency updates. Final results would feed Agency Management only after real backend integration. Code delivery, Agency entry, policy enforcement on uploads, email notifications, lifecycle history and IP/device are synthetic demonstrations.

## Files changed

- Created `usermanagement/agency-license-verification.html`.
- Created `handoff/admin__agency-license-verification.md`.
- Modified only the sidebar menu in `index.html` for this task.
- Existing Agency Management and all unrelated worktree changes remain untouched. No commit or push.

## Validation

JavaScript syntax, unique static/dynamic IDs, menu iframe navigation, queue filters, KPI filtering, assignment, document preview/download logs, OCR/external retry, manual decisions, code gate/lifecycle, policy validation/discard, permissions, CSV and responsive layout are checked during handoff. Exact results are recorded after the final verification run.
