# Property Detail (Read-only) (`property-detail-view.html`)

**Purpose:** Read-only detail view for a single property — gallery, map, video/360 tour, and all listing fields including Sale Status.

> **This file is byte-for-byte identical to the Admin Portal screen `property/property-detail-view.html`** (zero differences). The title reads "Admin - Property Detail (Read-only)". For the authoritative field-level spec, refer to the admin property handoff docs; this is the same read-only detail screen reused in the agent portal.

**Access:** Opened from the Properties list (`property-list-oversight.html`); not directly linked in the sidebar.

---

## Key features (summary)

- **Photo gallery** — main image + thumbnails.
- **Embedded map** iframe (`mapEmbedUrl`).
- **Video** and **360 tour** iframes (`videoUrl`, `tourUrl`).
- **Sale Status** shown read-only.
- Read-only throughout — no edit/save controls.
- Does **not** load `property-card.js`.

---

## Navigation

Simple back link via `window.location.href = "property-list-oversight.html"`. It does not manipulate the parent window / iframe (unlike the list and project pages).

## Persistence

None of its own; displays hardcoded demo property data.
