# Product State

## Current Product

A&A Studio is a local-first landing page builder for legal-services campaigns. The builder is published as a static Vite app and produces static landing ZIP downloads that can be uploaded to traditional hosting.

## Current User Flow

1. Open the builder.
2. Create or open a saved project from the dashboard.
3. Edit the project in the two-column editor.
4. Preview the landing in desktop or mobile mode.
5. Optionally generate copywriting prompts and paste returned JSON.
6. Configure tracking tags and event names.
7. Download a named static landing ZIP.

## Current Features

- Project dashboard with local project records.
- Shared black app header across dashboard and editor.
- Project name controls the saved project name and exported folder slug.
- Two-column editor organized as `Geral` and `Copywriting`.
- Slot-based editing for site metadata, brand, footer/contact, sections, assets, and tracking.
- Compact repeater carousel for item-heavy fields, with labeled fixed-width tabs and slide reorder.
- Image fields with URL/path input, upload chip, preview region, upload region, and hover X removal.
- Copywriting prompt flow with instruction, direction copy buttons, JSON paste, and full-width apply action.
- Canonical JSON editing for full-project recovery and advanced edits.
- Tracking provider setup for GA4, Google Ads, and Meta Pixel.
- Tracking event setup for pageview and WhatsApp clicks; video click/watch remain supported in code but hidden from the project UI for quick reactivation.
- Desktop/mobile preview from the same canonical project object used for export.
- ZIP export through a normal browser download.
- Uploaded image persistence through IndexedDB.

## Persistence

Projects and uploaded image blobs are local to the current browser/device. They survive refresh and reopening in the same browser profile, but they are not cloud-synced.

## Export Contract

Export downloads:

```txt
page-name.zip
  page-name/
    index.html
    styles.css
    assets/
      defaults/
      uploads/
```

Uploaded images are written under `assets/uploads/`. Default images are copied from `public/assets/defaults/`.

## Tracking Contract

Tracking lives under `site.tracking`.

- Provider tags are injected only when enabled and configured with IDs.
- `pageView` fires on landing load.
- `videoClick` fires on video click when the hidden project event is re-enabled.
- `videoWatch` fires after the configured seconds when the hidden project event is re-enabled.
- `whatsappClick` fires from WhatsApp buttons.

## Content Rules

- The builder should not invent hidden content outside the project object.
- The preview and export should match.
- Testimonials do not render fallback names, dates, photos, or avatars when identity fields are blank.
- FAQ text uses a simple `Q1/R1` plain-text format.
- Checklist text uses a simple `I1` plain-text format.
