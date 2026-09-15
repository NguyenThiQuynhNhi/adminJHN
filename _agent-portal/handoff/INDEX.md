# YUUSHI Agency Portal — current client-review handoff

The current working-tree HTML and referenced JavaScript are the implementation source of truth. This is a frontend mockup; a success message does not establish a backend operation. Page-specific documents identify simulations and persistence limits. `agency-dashboard-source.js` exposes read-only previews of module records; it does not persist business data or synchronize every module to the Dashboard store.

The shell is [index.html](../index.html); see [shell behavior](agent-portal__index.md). The following map is derived from its `data-content` links. Dashboard and CRM Activities are expandable groups, not additional standalone pages.

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

## Additional current screens

- [Sign-in](agent-portal__agent_signin.md) — [agent_signin.html](../agent_signin.html), standalone.
- [Sign-up](agent-portal__agent_signup.md) — [agent_signup.html](../agent_signup.html), standalone.
- [Property detail / editor](agent-portal__property-detail-view.md) — [property-detail-view.html](../property-detail-view.html), supplementary screen outside the sidebar; the Properties list has its own inline detail.

## Review boundaries

[AGENCY_DASHBOARD_IMPLEMENTATION.md](AGENCY_DASHBOARD_IMPLEMENTATION.md) is the Dashboard handoff: 29 selectable metrics, existing System Widgets and Supporting Fields, and three unchanged BA questions. Historical scope-correction material is outside this client-review package.

Monetization comprises Subscription, Cart & Add-on, and Advertising with direct Stripe payment flows represented by the UI; there is no wallet or stored balance. Actual payment calls are simulated.

Inquiry remains a client-initiated Chat-with-Agency business concept. Contacts and Groups organize existing relationships; they do not introduce an Agency-created Inquiry entity.

[Review limitations](CLIENT_REVIEW_READINESS.md) records observed inconsistencies in the implementation. Legacy shell alternatives are not current navigation or current requirements.
