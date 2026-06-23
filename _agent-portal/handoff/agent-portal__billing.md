# Subscription & Billing (`billing.html`)

**Purpose:** The agent's subscription/billing screen — current plan, ad wallet, plan comparison, and billing history. All demo data; actions are confirm/toast stubs.

**Access:** Sidebar → Workspace → Subscription.

---

## Layout & structure (4 sections)

1. **Current Plan** hero.
2. **Ad Wallet** hero.
3. **Plan Comparison** (`#compare`).
4. **Billing History.**

---

## Current Plan

Hero: **Silver Plan** + "Silver" tier badge. Meta: Active · Billing Monthly · Started Jan 12, 2026 · Renews Jun 12, 2026 · ¥12,000/mo. Feature checklist (6): "Up to 30 active listings", "Full CRM access (Tasks + Viewings)", "Ad wallet enabled", "Standard analytics", "Email support (24h response)", "1 featured listing per month".

Actions: **Upgrade Plan** (smooth-scrolls to `#compare`) and **Cancel plan** link.

## Ad Wallet

Hero: Current Balance ¥24,500; "Spent this month: ¥15,500 of ¥40,000 lifetime top-up"; **Top Up** button (opens modal).

Transaction History table (wallet) — columns: **Date**, **Description**, **Amount** (colored +/−), **Balance After**. From `WALLET` (5 rows).

## Plan Comparison

Four cards from `PLANS` (Free / Bronze / Silver / Gold): icon, price (Free or ¥N/mo), feature list (dim features shown with a minus icon), CTA button. The current plan card is highlighted ("Current plan" badge, disabled button). Button label logic: Current = disabled "Current plan"; Free target = "Downgrade"; otherwise "Upgrade" if current price < card price, else "Switch".

## Billing History

Table — columns: **Invoice #**, **Date**, **Description**, **Amount**, **Status**, **PDF**. Status badge `paid` / `pending`; the PDF button is disabled unless paid. From `INVOICES` (4 rows).

---

## Modals

**Top Up Ad Wallet** (`#topupModal`). Title "Top Up Ad Wallet". Quick amounts grid: ¥10,000 / ¥30,000 (default selected) / ¥50,000 / ¥100,000; or custom amount (number, min 1000, step 1000). Info note "Payment is processed instantly. Balance reflects within 30 seconds." Footer: Cancel, "Pay & Top Up".

---

## Notifications (toasts, ~2.7s; some after a native `confirm()`)

- Switch plan: confirm "Switch to {name} plan?…" then "Switched to {name} plan (demo)".
- Cancel plan: confirm "Cancel your Silver Plan?…" then "Plan cancellation scheduled for Jun 12, 2026 (demo)".
- Download PDF: "Download {id}.pdf (demo)".
- Top up: "Minimum top-up is ¥1,000" if amount < 1000, else "Top up of {¥amount} processed (demo)".

## Validation

Top-up minimum ¥1,000 (otherwise an error toast). No other validation.

## Persistence

None. `CURRENT_PLAN = "silver"`, `PLANS`, `WALLET`, `INVOICES` are inline; the displayed balance and history are not actually updated. "Upgrade Plan" uses in-page smooth scroll, not navigation. State resets on reload.
