# Agency Dashboard — current handoff

## Run

From the repository root, run `python3 -m http.server 8766` and open
`http://127.0.0.1:8766/_agent-portal/dashboard.html` (or use the Agent Portal shell).
This is a frontend implementation with a shared deterministic data store, no backend dependency.
Runtime assets require no build or package installation.

## Access model

Agency Dashboard access is controlled by the role's binary **Dashboard View** permission.
When View is granted, all system and custom Dashboard metrics are calculated from the
Agency's eligible records. Dashboard does not use None/Own/Agency record scope and does
not inherit record scope from source modules. Staff identifiers remain available as
analytics filters and group-by dimensions, including Sales Value by Staff.

Dashboard Export remains a separate action. A viewer with Dashboard View and Dashboard
Export exports the same Agency-level data shown by the Dashboard. Plan and advertising
suppression gates remain independent. Drill-through destinations continue to enforce
their own module permissions and Dashboard never grants write access to source records.

## Current scope

Add Widget contains exactly these 29 selectable metrics. The runtime definitions in
`agency-dashboard-model.js` govern the selector; workbook rows are not automatic approval.

| No. | Title |
|---|---|
| 64 | Active Listings |
| 65 | New Inquiries |
| 66 | Scheduled Viewings |
| 67 | Profile Views |
| 75 | Active Campaigns |
| 76 | Pending Review |
| 77 | Payment Issues |
| 96 | Property Views |
| 97 | Property Clicks |
| 98 | Organic Keep / Saves |
| 103 | Top Listings by Conversion |
| 104 | Combined Property Performance |
| 118 | Sell-through Rate |
| 149 | Appraisal Conversion Rate |
| 220 | Offer Acceptance Rate |
| 231 | Total Sales Value |
| 232 | Average Sale Value |
| 234 | Sales Value Trend |
| 236 | Average Days to Close |
| 250 | Unread Messages |
| 252 | Message Volume |
| 253 | Average Response Time |
| 256 | Inquiry-to-Viewing Rate |
| 288 | Ad Impressions |
| 289 | Ad Clicks |
| 290 | Ad CTR |
| 291 | Ad Keep / Saves |
| 292 | Ad KPR |
| 324 | Sales Value by Staff |


System definitions remain separate: #56 Personal Greeting (header), #58 Current Plan / Tier,
#69 Recent Activity Feed, #70 Upcoming Viewings, #71 Property Performance — Top 5,
#73 Action Required, #74 Appraisal Lead Quota, #78 Coverage Areas,
#79 Advertising Snapshot, #207 Upcoming Activities. #207 supports valid existing system
layouts without adding a default card. System settings edit presentation only; custom
dashboards cannot create system-only widgets. Overview has 7 default cards; Ads has 8.

Supporting fields appear only inside their parents:

| No. | Supporting value | Parent |
|---|---|---|
| 57 | Agent Rating | #56 Overview/header |
| 156 | Appraisal Leads Used | #74 Appraisal Lead Quota |
| 157 | Appraisal Lead Limit | #74 Appraisal Lead Quota |
| 159 | Quota Utilization | #74 Appraisal Lead Quota |
| 271 | Pending Review Deadline | #76 Pending Review; #79 Advertising Snapshot; #73 Action Required |
| 299 | Paid Cycle End | #58 Current Plan / Tier; #73 Action Required |
| 300 | Auto-renewal Status | #58 Current Plan / Tier; subscription notice state |
| 301 | Renewal Confirmation Required | #58 Current Plan / Tier; #73 Action Required |


Quota includes Remaining and Unlimited handling. Review deadlines and subscription notices
use Agency-level Dashboard data. Table remains a generic presentation option.

## Runtime and maintenance

- `dashboard.html`, `agency-dashboard.css`, `agency-dashboard.js`: page, styling and builder.
- `agency-dashboard-model.js`, `agency-dashboard-rules.js`: definitions, calculation,
  access gates and saved-layout normalization.
- `agency-dashboard-mock.js`, `agency-dashboard-data.js`: shared records, context and reads.
- `agency-dashboard-source.js`: adapter used by Agency module pages.
- `agency-dashboard-charts.js`, `agency-dashboard-export.js`: rendering and exports.
- `agency-dashboard-catalog.js`: checked-in workbook metadata loaded by the page.
- `dashboard-tools/build_catalog.py` consumes `approved-metrics.json` and the supplied
  `YUUSHI_Agency_Dashboard_Function_Spec_v2 (1).xlsx` to regenerate that catalog.
  Run `python3 _agent-portal/dashboard-tools/build_catalog.py` only when intentionally
  updating workbook metadata; it does not rebuild the runtime metric definitions.
  Keep this minimal two-file build path and its scope exclusions together.

Saved layouts use `yuushi.agency.dashboard.mock.v2`. Loading preserves valid dashboards,
panels and widgets, converts permitted legacy system references, and discards unsupported
references/settings. Save persists the normalized layout. Dashboard View and platform
advertising-suppression gates apply to rendering and selection. Agency users are not shown
preview controls and cannot change platform suppression from Dashboard.

Monetary metrics count sold Sale transactions, including New Development units, and exclude
Rentals. Days to Close includes confirmed sold listings without a Lead. Inquiry records,
messages and response cycles are distinct; response time uses the last consecutive client
message to the first agency reply. These rules remain in `agency-dashboard-rules.js`.

This document supersedes the removed Dashboard reports and original dashboard handoff.
Historical provenance strings in the unchanged model/config still name the old handoff
and scope audit; those are historical citations, not file-loading dependencies.

## Verification

Unit suite (test-only QuickJS dependency):

```sh
python3 -m venv /tmp/yuushi-dashboard-tests
/tmp/yuushi-dashboard-tests/bin/pip install quickjs
/tmp/yuushi-dashboard-tests/bin/python -B -m unittest discover -s _agent-portal/tests -p 'test_dashboard.py' -v
```

Browser smoke test uses Python's standard library and a dedicated Chrome profile.
With the HTTP server running, start Chrome in a separate terminal (macOS example):

```sh
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless=new --remote-debugging-port=9227 --remote-allow-origins=http://localhost:9227 --user-data-dir=/tmp/yuushi-dashboard-chrome --no-first-run --no-default-browser-check about:blank
python3 -B _agent-portal/tests/browser_mock_scenario.py
```

The browser test checks actual selector options, system/supporting presentations, builder
create/edit/save/reload/duplicate/remove, exports, drill-down, stored-layout migration,
suppression and mobile overflow. It restores the tested localStorage keys even on failure.
No external test harness or generated screenshot files are required.

## Pending BA decisions — unchanged

1. Sales Value by Staff attribution: internally isolated; no user-facing attribution selector.
2. Repeated Inquiry for the same Client + Agency + Property: reuse-versus-create remains undecided.
3. Repeated Property View counting: no approved Client/Property/Day/Session deduplication policy.
