# Admin — Area & Market Data Configuration

Current implementation sources:

- `PopularLandPrice.html`
- `contentmanagement/cms-homepage-management.html`
- `contentmanagement/cms-land-price-management.js`
- `contentmanagement/cms-land-price-management.css`

## Current terminology

The old Land Prices / Popular_LandPrice_Average meaning is no longer used in the operational UI.

Current Area Guide sections:

- **Popular Neighbourhoods**
- **Station Price Ranking**

Station Price Ranking uses station-level median price per m² data. Organic explanatory/SRS-style calculation prose is intentionally not shown on the Admin working screen.

## Admin safety filter

When an Area or Station has no usable current-period data, the Add Areas / Add Stations picker renders it unavailable and disables its checkbox. The UI uses the concise state **No available data** rather than exposing internal threshold calculations.

## Station ranking display

The review table shows:

- Rank
- Station Name
- Median Price per m²
- Median Price per Tsubo
- Q1–Q3 Price Band
- YoY Change
- Transaction Count (n)

YoY = 0 is rendered as a neutral value with no up/down arrow. If current data is unavailable, the operational empty state is concise.

## Property Detail configuration

Admin can toggle **Area Sale Benchmark & Trend** visibility.

The previous long blocks describing data source, supported types, trimming, n-threshold rules and fallback calculations were removed from the working UI. Those belong in SRS/technical documentation, not the operational Admin page.

## Market Trend

Market Trend uses a fixed 14-column CSV contract. Upload validation rejects added/removed/renamed/reordered columns.

The current prototype seeds two reviewable dataset records when Market Trend storage is empty:

1. `Tokyo 23 Wards Market Trend` — `MT-20261006-001`
2. `Yokohama / Kawasaki Market Trend` — `MT-20261006-002`

The seed is one-time only and does not repopulate after the user intentionally deletes stored datasets.

## UI principle

Do not place calculation tutorials, source-contract explanations, pending-spec prose, mock/demo wording or backend implementation notes into the Admin operational screen. Keep only controls, data, statuses, validation and actionable errors.
