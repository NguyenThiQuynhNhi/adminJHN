# Property detail and Edit / Add

Source: [property-detail-view.html](../property-detail-view.html), current working-tree implementation.

Supplementary screen outside the sidebar. Source has a read-only title, but the actual `buildActionRow()` adds **Edit / Add** and status-dependent controls. It must not be treated as read-only throughout or as an identical Admin file.

`renderProperty()` displays seeded property data: metadata, gallery/lightbox, basic and price fields, property/building/land details, restricted owner fields, features, project/plans, POIs/map, media and description. `enterEditMode()` builds a multi-section editor with floor-plan editing, media input UI, validation and review summary.

`saveDraft()` stores FormData under `property-draft-{id}` (or `new`); autosave/restoration are local. `publishListing()` validates, asks for publish-preview confirmation, clears the local draft and reports “Listing published (demo)”; this is not a server publish.

`goBackToList()` navigates the current document to `property-list-oversight.html`; it does not update the parent menu. The Properties list normally uses its own inline `showDetail()` screen rather than linking here. Admin-oriented title text remains a mockup labeling inconsistency.
