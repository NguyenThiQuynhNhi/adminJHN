# Transactions

Source: [transaction-management.html](../transaction-management.html), current working-tree implementation.

Access: Workspace → Transactions.

List combines closed deals, suspended-listing records and shared verification records. Filters include type, search by property/reference, reason, price publication, agent and date range; pagination and row counts are implemented. Detail/edit screens differ for closed deals and suspended listings; comments/activity panels remain demo content.

Suspended-listing edit selects a property and removal reason, transaction price (required for Sold), date, agent and public-price option. `saveTransaction('suspended')` writes `yuushi.suspensionTx`. Other general edit saves remain toast-only. `publishTransaction()` updates price visibility in the corresponding local record.

## Current verification integration

`../mock-workflows.js` supplies localStorage-backed records in `yuushi.transactionVerificationRecords`; tickets use `yuushi.adminTickets`. Detail shows Listed Price, Agent Submitted Price, Client Submitted Price, Final Sale Price, difference, verification status, dispute ticket and timeline.

Shared exact verification statuses: **Pending Client Confirmation, Matched, Disputed, Evidence Submitted, Admin Resolved, Rejected**. The Agency UI simulates client confirmation from Pending Client Confirmation: positive whole-JPY price and completion checkbox; equal prices become Matched, differing prices become Disputed, and final price becomes the client price. A difference of at least 20% is a warning only.

From Disputed, Raise Price Dispute requires reason, proposed positive whole-JPY price and evidence file, plus optional note. It creates a local ticket and advances to Evidence Submitted. The file is stored as metadata, not an uploaded attachment. Admin resolution is not an Agency action here. Storage events refresh verification data. This is a local demonstration, not a client verification or support service.
