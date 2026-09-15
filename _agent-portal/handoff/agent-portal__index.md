# Agency Portal shell

Source: [index.html](../index.html), current working-tree implementation.

The iframe shell owns navigation, header and account controls. Initial `contentFrame.src` is `dashboard.html`; active-menu normalization treats this as `dashboard.html#overview`. The browser's outer URL does not route with sidebar changes.

## Navigation


## Workspace

| Navigation | Current page | Handoff |
|---|---|---|
| Dashboard → Overview | [dashboard.html#overview](../dashboard.html#overview) | [Dashboard → Overview](AGENCY_DASHBOARD_IMPLEMENTATION.md) |
| Dashboard → Ads & Subscriptions | [dashboard.html#subscriptions](../dashboard.html#subscriptions) | [Dashboard → Ads & Subscriptions](AGENCY_DASHBOARD_IMPLEMENTATION.md) |
| Properties | [property-list-oversight.html](../property-list-oversight.html) | [Properties](agent-portal__property-list-oversight.md) |
| Projects | [project-management.html](../project-management.html) | [Projects](agent-portal__project-management.md) |
| Appraisals | [appraisal-management.html](../appraisal-management.html) | [Appraisals](agent-portal__appraisal-management.md) |
| Leads | [lead-management.html](../lead-management.html) | [Leads](agent-portal__lead-management.md) |
| Transactions | [transaction-management.html](../transaction-management.html) | [Transactions](agent-portal__transaction-management.md) |
| Offers | [offer-management.html](../offer-management.html) | [Offers](agent-portal__offer-management.md) |
| Agreement | [agreement-management.html](../agreement-management.html) | [Agreement](agent-portal__agreement-management.md) |
| CRM Activities → Calendar | [calendar.html](../calendar.html) | [CRM Activities → Calendar](agent-portal__calendar.md) |
| CRM Activities → Viewing | [crm-activities.html#viewing](../crm-activities.html#viewing) | [CRM Activities → Viewing](agent-portal__crm-activities.md) |
| CRM Activities → Task | [crm-activities.html#task](../crm-activities.html#task) | [CRM Activities → Task](agent-portal__crm-activities.md) |
| CRM Activities → Jobs | [crm-activities.html#jobs](../crm-activities.html#jobs) | [CRM Activities → Jobs](agent-portal__crm-activities.md) |
| CRM Activities → Calls | [crm-activities.html#calls](../crm-activities.html#calls) | [CRM Activities → Calls](agent-portal__crm-activities.md) |
| CRM Activities → Emails | [crm-activities.html#emails](../crm-activities.html#emails) | [CRM Activities → Emails](agent-portal__crm-activities.md) |
| CRM Activities → SMS | [crm-activities.html#sms](../crm-activities.html#sms) | [CRM Activities → SMS](agent-portal__crm-activities.md) |
| CRM Activities → Comments | [crm-activities.html#comments](../crm-activities.html#comments) | [CRM Activities → Comments](agent-portal__crm-activities.md) |

## Messages

| Navigation | Current page | Handoff |
|---|---|---|
| Contacts | [contact-management.html](../contact-management.html) | [Contacts](agent-portal__contact-management.md) |
| Groups | [group-management.html](../group-management.html) | [Groups](agent-portal__group-management.md) |
| Messages Box | [admin-messages.html](../admin-messages.html) | [Messages Box](agent-portal__admin-messages.md) |
| Message Center | [message-center.html](../message-center.html) | [Message Center](agent-portal__message-center.md) |

## Agency

| Navigation | Current page | Handoff |
|---|---|---|
| Staff Management | [staff-management.html](../staff-management.html) | [Staff Management](agent-portal__staff-management.md) |
| Roles & Permissions | [role-and-permission.html](../role-and-permission.html) | [Roles & Permissions](agent-portal__role-and-permission.md) |
| Agency Profile | [profile.html](../profile.html) | [Agency Profile](agent-portal__profile.md) |

## Ads & Subscriptions

| Navigation | Current page | Handoff |
|---|---|---|
| Book Ad | [book-ad.html](../book-ad.html) | [Book Ad](agent-portal__book-ad.md) |
| My Campaigns | [my-campaigns.html](../my-campaigns.html) | [My Campaigns](agent-portal__my-campaigns.md) |
| Plans | [plans.html](../plans.html) | [Plans](agent-portal__plans.md) |
| Cart | [cart.html](../cart.html) | [Cart](agent-portal__cart.md) |
| Billing & Payments | [billing-payments.html](../billing-payments.html) | [Billing & Payments](agent-portal__billing-payments.md) |

## Header and navigation behavior

- `setActiveMenu()` highlights the exact target and expands the Dashboard or CRM Activities group. Calendar belongs to CRM Activities.
- Sidebar click handlers call `dashboardAllowsNavigation()` before changing the iframe; it consults the Dashboard's `AgencyDashboardCanLeave()` guard when available. This is not a universal unsaved-change guard for all modules.
- `updateTopSearch()` changes the header search placeholder by module; this alone does not filter the iframe's records.
- Notification dropdown displays module alerts and routes through `openNotifTarget()`; chat shortcut `openInbox()` opens Messages Box (`admin-messages.html`).
- Account menu shows Taro Tanaka / Senior Sales Agent. `acctOpenMyProfile()` opens Agency Profile; `acctLogout()` confirms before navigating to standalone `agent_signin.html`. Outside click closes account/notification dropdowns; Escape closes the account menu.
- Dashboard's Ads & Subscriptions submenu is separate from the Ads & Subscriptions sidebar section containing the five monetization pages.
