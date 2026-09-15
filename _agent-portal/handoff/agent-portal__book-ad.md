# Book Ad

Source: [book-ad.html](../book-ad.html), current working-tree implementation.

Access: Ads & Subscriptions → Book Ad.

Wizard (`goStep`, `state`): choose property or Agency brand → placement → slot/date configuration → 1/2/3-month package → one creative image → review/submit → confirmation.

Property placements include homepage New Development and Featured carousels and Sponsored Search. Brand placements include static-page, in-article, property-detail and City/Area banners. Configuration describes relevant eligibility: New Development separation, Area/Station search slots, published article categories, matching property type/location and separate City/Area tiers. Calendar availability and waitlist UI use demo slot data.

`buildPackages()` applies the configured multi-month discount; `selectPackage()` compares it with the Sponsored Search location-match discount and applies the better single discount. Discounts do not stack. Review displays the locked price, dates, placement, creative and destination (the current handler displays My YUUSHI agency profile).

Submission represents card pre-authorization, with capture only on Admin approval; rejection, cancellation before approval or timeout releases authorization. `submitBooking()` only waits and switches to the success pane. `saveDraft()` only toasts despite its locally-saved wording; it does not persist selections. There is no actual booking handoff to My Campaigns.

## Payment boundary

The UI represents direct Stripe payments across Subscription, Cart & Add-on and Advertising. No wallet, top-up or stored balance is used. JavaScript simulates outcomes with DOM updates/toasts; it does not call Stripe or persist cross-page payment state. Displayed prices/dates are sample configuration, not a live catalog.
