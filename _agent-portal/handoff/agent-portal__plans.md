# Plans

Source: [plans.html](../plans.html), current working-tree implementation.

Access: Ads & Subscriptions → Plans.

Sample tiers Free, Silver, Gold (current), Platinum show Admin-configured prices/features/cycles. Gold's paid cycle ends Apr 14 in the fixture. Current-cycle access remains intact when renewal needs confirmation or cancellation is scheduled.

- Higher-tier upgrade: UI describes direct Stripe Checkout, immediate provisioning after payment, unused-plan prorated invoice credit. Same-cycle upgrade retains cycle end; a different-cycle upgrade starts its cycle at successful payment. Failure leaves the existing plan unchanged.
- Lower-tier move: cancel current renewal, wait for paid-cycle expiration/baseline, then buy a lower-tier plan. Lower tiers cannot be purchased, activated or scheduled during the active paid cycle.
- Changed next-cycle terms require confirmation; renewal is paused until accepted. Cancellation stops renewal and keeps paid access to cycle end, with no cash refund.
- Long-term commitment discounts are configured; only the better single discount applies. Search ranking is automatic from plan and rating, not an Agency bidding control.

`confirmPlanRenewal()` updates the renewal label and blocks confirmation after cancellation. `confirmCancellation()` updates labels and removes the renewal alert. `continueUpgrade()` only shows a Stripe Checkout toast; it neither redirects nor activates Platinum.

## Payment boundary

The UI represents direct Stripe payments across Subscription, Cart & Add-on and Advertising. No wallet, top-up or stored balance is used. JavaScript simulates outcomes with DOM updates/toasts; it does not call Stripe or persist cross-page payment state. Displayed prices/dates are sample configuration, not a live catalog.
