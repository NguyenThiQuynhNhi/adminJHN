# My Campaigns

Source: [my-campaigns.html](../my-campaigns.html), current working-tree implementation.

Access: Ads & Subscriptions → My Campaigns.

Seed cards show **Active, Approved, Pending Review, Completed, Rejected, Timed Out**. Filters: All, Active, Approved, Pending, Completed, Rejected / Timeout. Details show configured dates, locked budget, review deadline and rejection/timeout explanations.

Advertising UI rules: pre-authorize on submission; capture once on approval, not per impression. Dates remain the original Start/End dates even with late approval. Pending Review can be cancelled with confirmation, releasing the hold; cancellation is unavailable after approval. Seven-day timeout releases the hold. Rejected/Timed Out cards offer resubmission.

`filterCampaigns()` filters cards and `openCampaignDetails()` reads fixed detail data. `confirmCancelCampaign()` changes the card to Cancelled but assigns its internal filter status to `rejected`; the detail map is not updated. Performance suppression hides granular impressions/clicks/CTR while dates, status and budget remain visible.

## Payment boundary

The UI represents direct Stripe payments across Subscription, Cart & Add-on and Advertising. No wallet, top-up or stored balance is used. JavaScript simulates outcomes with DOM updates/toasts; it does not call Stripe or persist cross-page payment state. Displayed prices/dates are sample configuration, not a live catalog.
