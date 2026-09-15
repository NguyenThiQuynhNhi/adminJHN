# Cart

Source: [cart.html](../cart.html), current working-tree implementation.

Access: Ads & Subscriptions → Cart.

Cart & Add-on purchases are checked out separately per item. The sample contains a failed Additional Coverage Area item and a ready Additional User Seat. Retry charges only the failed item; Remove deletes it; Pay this item updates its badge to Purchased and shows immediate provisioning feedback.

Add-on configuration (`addonForms`): Additional Coverage Area (ward/tier + duration), Additional Listing Slots (bundle + duration), Profile Enhancement (level + duration), CRM Enhancement (level + duration), Additional User Seat (quantity + duration). UI says final durations and prices come from the catalog. `addConfiguredAddon()` creates a generic ready row with “Current price”; it does not preserve a priced catalog configuration.

`retryFailedItem`, `payReadyItem`, `payGeneric` simulate separate successful payments. There is no combined checkout or shared stored credit. Empty-state handling runs after removals; successful rows can remain displayed as Purchased.

## Payment boundary

The UI represents direct Stripe payments across Subscription, Cart & Add-on and Advertising. No wallet, top-up or stored balance is used. JavaScript simulates outcomes with DOM updates/toasts; it does not call Stripe or persist cross-page payment state. Displayed prices/dates are sample configuration, not a live catalog.
