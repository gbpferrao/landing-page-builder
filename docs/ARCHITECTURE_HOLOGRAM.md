# Architecture Hologram

## Core Invariant

The whole system revolves around one canonical project object.

```txt
defaultProject
  -> normalizeProject
  -> ProjectsView / IndexedDB project record
  -> builder/editor fields
  -> live preview
  -> exportHtml
  -> exportLandingFolder
```

The editor, preview, JSON editor, and export must consume the same project shape. Exported output should match preview and should not invent data outside the editor fields.

## Canonical Project Shape

```txt
site.meta
site.brand
site.footer
site.tracking
sections.<section>.content
sections.<section>.assets
```

Main sections:

```txt
hero
problems
solutions
value
team
testimonials
cta
faq
footer
```

## Main Modules

- `src/domain/defaultProject.js`: complete default project data.
- `src/domain/normalizeProject.js`: project shape normalization.
- `src/domain/projectSchema.js`: editable slot descriptors.
- `src/domain/projectPaths.js`: nested path read/write helpers.
- `src/lib/projectStore.js`: IndexedDB project and image blob persistence.
- `src/lib/objectUrls.js`: object URL registry for uploaded assets.
- `src/lib/exportLandingFolder.js`: ZIP download export for HTML, CSS, local assets, and uploaded assets.
- `src/app/App.jsx`: app shell state and routing between projects/editor.
- `src/app/AppHeader.jsx`: shared black app header and shared header button classes.
- `src/projects/ProjectsView.jsx`: dashboard/project manager.
- `src/builder/*`: editor shell, shared header usage, help flow, export action, preview frame.
- `src/editor/*`: slot renderers, JSON editor, prompt flow, tracking editor, image asset picker.
- `src/sections/*`: section schemas and preview components.
- `src/preview/LandingPage.jsx`: live landing composition.
- `src/preview/exportHtml.jsx`: static HTML rendering and tracking injection.
- `src/preview/landing-page.css`: exported landing CSS.
- `src/styles/tokens.css`: builder UI color/radius/shadow tokens.
- `src/styles/tailwind.css`: builder UI component styles.

## Editor UI Notes

- Builder UI color values should use `src/styles/tokens.css`; avoid new one-off beige/gold literals.
- Dashboard and editor use the shared `AppHeader`.
- The editor is a two-column surface: `Geral` and `Copywriting`.
- Repeater fields use `ItemGroupCarousel.jsx` to avoid tall vertical stacks.
- Image fields use a URL/path input plus an asset chip with left preview, central detail, right upload region, and a hover X delete.
- Tracking provider IDs are inline controls with attached enable buttons.
- Tracking event tags are grouped as Google row plus Meta row.

## Asset Model

Default static assets live under:

```txt
public/assets/defaults/
public/assets/defaults/team/
```

Project image fields may point to:

- `assets/...`
- external URLs
- data URLs
- uploaded `idb-asset://...` references

Uploaded images are persisted as IndexedDB blobs and exported under:

```txt
assets/uploads/
```
