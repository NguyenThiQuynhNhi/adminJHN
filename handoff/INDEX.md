# Admin Portal — BA Handoff Index

Plain-English UI/UX → Business-Analyst walkthroughs for every **admin** screen, one Markdown file per screen.
Scope: all screens reachable from the `index.html` admin sidebar **except** the `overview/` dashboards and the `support/`, `_agent-portal/`, `_support-portal/` folders (excluded per request). Each file follows the same structure: Purpose & Access → Layout & Structure → Every Element → Modals & Popups → Conditional Display → User Flows → Validation → Empty States → Notifications & Feedback → Navigation.

**Shell:** All screens load inside `index.html` (the admin shell): left sidebar nav + top Quick-Search bar + account menu + content iframe. The "Access / nav path" in each file is the sidebar route. All data is demo data in `localStorage` (no backend).

| # | Sidebar Section | Sidebar Label | Screen file | Handoff |
|---|---|---|---|---|
| 1 | Users Management | End User Management | usermanagement/user-account-management.html | [usermanagement__user-account-management.md](usermanagement__user-account-management.md) |
| 2 | Users Management | Admin Management | usermanagement/admin-management.html | [usermanagement__admin-management.md](usermanagement__admin-management.md) |
| 3 | Users Management | Agent Management | usermanagement/agent-management.html | [usermanagement__agent-management.md](usermanagement__agent-management.md) |
| 4 | Users Management | Agent Activities | usermanagement/agent-activities.html | [usermanagement__agent-activities.md](usermanagement__agent-activities.md) |
| 5 | Users Management | Support Portal Management | usermanagement/support-account-management.html | [usermanagement__support-account-management.md](usermanagement__support-account-management.md) |
| 6 | Users Management | Lead Management | usermanagement/lead-management.html | [usermanagement__lead-management.md](usermanagement__lead-management.md) |
| 7 | Users Management | Login Recovery Management | usermanagement/login-recovery-management.html | [usermanagement__login-recovery-management.md](usermanagement__login-recovery-management.md) |
| 8 | Users Management | Roles & Permissions | usermanagement/roles-permissions.html | [usermanagement__roles-permissions.md](usermanagement__roles-permissions.md) |
| 9 | Users Management | Legal & Agreement Templates | usermanagement/agreement-templates.html | [usermanagement__agreement-templates.md](usermanagement__agreement-templates.md) |
| 10 | Users Management | Legal & Agreements | legal/agreement-management.html | [legal__agreement-management.md](legal__agreement-management.md) |
| 11 | Support & Communication | Messages | messagesupport/admin-messages.html | [messagesupport__admin-messages.md](messagesupport__admin-messages.md) |
| 12 | Support & Communication | Message Center | messagesupport/message-center.html | [messagesupport__message-center.md](messagesupport__message-center.md) |
| 13 | Support & Communication | Email Center | messagesupport/email-center.html | [messagesupport__email-center.md](messagesupport__email-center.md) |
| 14 | Property Management | Property Management | property/property-list-oversight.html | [property__property-list-oversight.md](property__property-list-oversight.md) |
| 15 | Property Management | Property Approval | property/property-approval-moderation.html | [property__property-approval-moderation.md](property__property-approval-moderation.md) |
| 16 | Property Management | New Development Projects | property/project-management.html | [property__project-management.md](property__project-management.md) |
| 17 | Property Management | Property Reports | property/property-report-management.html | [property__property-report-management.md](property__property-report-management.md) |
| 18 | Content Management | Static Page Management | contentmanagement/static-page-management.html | [contentmanagement__static-page-management.md](contentmanagement__static-page-management.md) |
| 19 | Content Management | Visibility Control | contentmanagement/cms-homepage-management.html | [contentmanagement__cms-homepage-management.md](contentmanagement__cms-homepage-management.md) |
| 20 | Content Management | Locations* | contentmanagement/locations-management.html | [contentmanagement__locations-management.md](contentmanagement__locations-management.md) |
| 21 | Content Management | Insight Management | contentmanagement/blog.html | [contentmanagement__blog.md](contentmanagement__blog.md) |
| 22 | Content Management | Sell Guide Management | contentmanagement/sell-guide-management.html | [contentmanagement__sell-guide-management.md](contentmanagement__sell-guide-management.md) |
| 23 | Content Management | Category Search | contentmanagement/category-search-management.html | [contentmanagement__category-search-management.md](contentmanagement__category-search-management.md) |
| 24 | Monetisation & Advertising | Plans & Subscriptions | monetisation ads/plans-subscriptions.html | [monetisation-ads__plans-subscriptions.md](monetisation-ads__plans-subscriptions.md) |
| 25 | Monetisation & Advertising | Ad Management | monetisation ads/ad-management.html | [monetisation-ads__ad-management.md](monetisation-ads__ad-management.md) |
| 26 | System Settings & Integrations | Platform Information | systemsetting/platform-information-management.html | [systemsetting__platform-information-management.md](systemsetting__platform-information-management.md) |
| 27 | System Settings & Integrations | Region / Station / Railway Master Data | systemsetting/region-station-railway.html | [systemsetting__region-station-railway.md](systemsetting__region-station-railway.md) |
| 28 | System Settings & Integrations | Translation Glossary | systemsetting/translation-glossary.html | [systemsetting__translation-glossary.md](systemsetting__translation-glossary.md) |
| 29 | System Settings & Integrations | Keyword Blacklist | systemsetting/keyword-blacklist.html | [systemsetting__keyword-blacklist.md](systemsetting__keyword-blacklist.md) |
| 30 | System Settings & Integrations | Basic & Security Settings | systemsetting/security-settings.html | [systemsetting__security-settings.md](systemsetting__security-settings.md) |
| 31 | System Settings & Integrations | Appraisal Form Field Configuration | systemsetting/appraisal-form-field-configuration.html | [systemsetting__appraisal-form-field-configuration.md](systemsetting__appraisal-form-field-configuration.md) |
| 32 | System Settings & Integrations | Audit Logs | systemsetting/audit-logs.html | [systemsetting__audit-logs.md](systemsetting__audit-logs.md) |
| 33 | Support & Communication | Ticket Management | messagesupport/ticket-management.html | [messagesupport__ticket-management.md](messagesupport__ticket-management.md) |

\* **Locations** — the screen exists and is fully documented, but its sidebar `data-content` entry is currently **missing from `index.html`** (it is unreachable from the nav right now). Flagged as an action item: re-add a "Locations" entry under Content Management.

## Excluded from this handoff (per request)
- `overview/` — the 11 dashboards (KPI, Agent League, Marketing, End User Stats, Agent Stats, Property Stats, Ad Performance, Market Analysis, Financial Reports, Sales Reports, Report Management).
- `_agent-portal/`, `_support-portal/`. (`messagesupport/ticket-management.html` is now documented — row 33 above.)
- Non-admin / commented-out: `messagesupport/customer-support-console.html`, `messagesupport/notification-management.html`, `operation/*` (files removed), and the agent/client-facing `agent-ad-booking.html`, `agent-monetisation.html`, `client-monetisation.html`.
