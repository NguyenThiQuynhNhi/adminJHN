# File Library

Source: [file-library.html](../file-library.html) with shared data layer [agency-file-library.js](../agency-file-library.js).

## Purpose

Agency-wide reusable file library used by Messages. One stored file can be referenced from multiple Chat sessions without creating another stored copy.

## Current UI

Messages → File Library.

Functions:

- upload images/files;
- search by file name or uploader;
- filter by file type;
- sort by uploaded date, name or size;
- show uploader, uploaded date, last shared date and share count;
- download;
- delete when the signed-in user is the uploader or Agency Admin;
- show Agency storage usage, current plan and remaining storage.

## Chat integration

Messages → `+` → **Add work content** selects existing File Library records and sends their existing `fileId`. **Upload images and files** creates a new stored file and sends it.

Deleting a stored file does not delete existing Chat messages; the attachment is rendered as **No longer available**.

## Current plan rules represented

The frontend data layer includes the currently confirmed/provisional storage caps and file/video eligibility by plan. Same-file reuse across Chat sessions counts storage once. Re-uploading creates a new stored file.

## Prototype persistence

Metadata: localStorage `yuushi.agencyFileLibrary`.

Binary file content: IndexedDB database `yuushiAgencyFiles`, object store `blobs`.

This is a browser-local prototype of the agreed behavior, not production object storage or authenticated download infrastructure.
