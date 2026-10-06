# Admin — SEO Management

Current implementation sources:

- `contentmanagement/seo-management.html`
- `contentmanagement/seo-management.css`
- `contentmanagement/seo-management.js`

## Navigation hierarchy

Primary tabs are one row:

- Global Settings
- Property Detail
- Agency Profile
- Insight

When the current tab belongs to Insight, a secondary navigation row is shown:

- Area Guide
- Article
- News
- FAQ

The Insight parent remains selected while any Insight subtype is active.

The previous layout where **Insight** appeared as a separate floating column and its four subtype tabs dropped below it has been removed.

## UI principle

SEO navigation must read as a normal primary/secondary tab hierarchy. Do not expose implementation explanations or documentation prose in the tab area.
