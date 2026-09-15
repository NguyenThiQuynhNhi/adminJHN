# Billing & Payments

Source: [billing-payments.html](../billing-payments.html), current working-tree implementation.

Access: Ads & Subscriptions → Billing & Payments.

Payment methods support Add card, Set default and Remove. `removeCard()` prevents deleting the last card and promotes a remaining card if the default is removed. `addCard()` inserts a fixed demo VISA ending 4242 (it does not tokenize the entered card); the Set as default checkbox changes the local default.

Subscription status displays current plan, paid-cycle end, renewal confirmation and failed recurring-charge notice. UI copy states paid access continues through the already-paid cycle; cancellation stops renewal without refunding unused time. `confirmCancelSubscription()` disables the confirmation launcher and toasts; it does not synchronize Plans.

Transaction History columns: Date, Item, Engine, Amount, Status / reason. `filterTx()` provides All / Subscription / Cart / Advertising filters. Sample outcomes include Succeeded, Failed — card declined, Authorization released.

Three engines: Subscription charges at cycle start/new subscription/upgrade; Cart & Add-on charges immediately per item (separate PaymentIntent); Advertising pre-authorizes on submission and captures once on Admin approval.

## Payment boundary

The UI represents direct Stripe payments across Subscription, Cart & Add-on and Advertising. No wallet, top-up or stored balance is used. JavaScript simulates outcomes with DOM updates/toasts; it does not call Stripe or persist cross-page payment state. Displayed prices/dates are sample configuration, not a live catalog.
