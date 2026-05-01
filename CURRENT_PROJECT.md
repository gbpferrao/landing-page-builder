# Current Project

Last updated: 2026-05-01

## Product

This repository is a static React landing page builder. It lets a user configure a legal-services landing page through structured editor fields, preview the result inside the builder, generate AI copy prompts, paste back copy JSON, upload images, configure tracking tags, name the page folder, and export a ready-to-host landing folder.

The builder itself is published as a Vite app. The exported landing is a separate static folder named from the header page name field and containing:

```txt
page-name/
  index.html
  styles.css
  assets/
```

That folder is intended for direct upload into a traditional host such as Hostinger `public_html/`.

## Main Functionalities

- Slot-based editor for brand, SEO, contact, section content, team, testimonials, FAQ, CTAs, images, and tracking.
- Live desktop/mobile preview rendered from the same project object used for export.
- Canonical JSON editor for full project-level edits and recovery.
- Copywriting prompt helper that sends only copy-safe fields and preserves identity/image fields in testimonials.
- Image upload support through browser blob URLs while editing.
- Folder export that rewrites uploaded blob URLs into `assets/uploads/...` paths and includes referenced local assets.
- Tracking configuration for GA4, Google Ads, Meta Pixel, pageview, video click/watch, and WhatsApp clicks.
- Review/testimonial identity is editor-owned: no default names, no default photos, and no fallback avatar is rendered when identity fields are blank.

## GitHub Pages Integration

GitHub Pages is integrated through:

```txt
.github/workflows/deploy-pages.yml
```

The workflow runs on pushes to `main` and can also be triggered manually with `workflow_dispatch`.

Deployment flow:

1. Checkout the repository with `actions/checkout@v4`.
2. Set up Node 20 with npm cache.
3. Install dependencies with `npm ci`.
4. Build the builder with `npm run build`.
5. Upload the generated `dist/` folder using `actions/upload-pages-artifact@v3`.
6. Deploy the artifact using `actions/deploy-pages@v4`.

The Vite config uses `base: "./"`, which makes the built builder work from a GitHub Pages project subpath as well as from local/static hosting:

```txt
vite.config.mjs
  base: "./"
  build.outDir: "dist"
```

## Architecture Hologram

The whole system revolves around one canonical project object.

```txt
defaultProject
  -> normalizeProject
  -> builder/editor fields
  -> live preview
  -> exportHtml
  -> exportLandingFolder
```

Each layer reflects the same shape:

- `src/domain/defaultProject.js` defines the complete default project data.
- `src/domain/projectSchema.js` defines which paths become editable slots.
- `src/domain/projectPaths.js` provides path reads/writes and deep merge behavior.
- `src/editor/*` turns schema slots into field controls.
- `src/builder/*` arranges the editor, help flow, export action, and preview frame.
- `src/preview/LandingPage.jsx` composes all landing sections from the project object.
- `src/sections/*` owns section-specific preview rendering and schema.
- `src/preview/exportHtml.jsx` renders the landing to static HTML and injects CSS/runtime/tracking.
- `src/lib/exportLandingFolder.js` writes HTML, CSS, local assets, and uploaded assets into the named landing folder.

The important design invariant is that the editor, preview, JSON, and export all consume the same project object. When this invariant holds, the exported page should match the preview and should not invent data outside the editor fields.

## Asset Model

Default static assets live under:

```txt
public/assets/defaults/
public/assets/defaults/team/
```

Project image fields may point to an `assets/...` path, an external URL, a data URL, or an uploaded browser `blob:` URL.

On export, uploaded blob assets are resolved from the in-memory object URL registry and written into:

```txt
assets/uploads/
```

Upload filenames are made unique inside the exported folder, so two different edited fields using files with the same filename do not overwrite each other.

## Git State

Repository root:

```txt
C:/dev/wpp-automation/temporary-workspace
```

Remote:

```txt
origin https://github.com/gbpferrao/landing-page-builder.git
```

Branch:

```txt
main
```

Current relationship:

```txt
main...origin/main
```

Latest commits before this update:

```txt
2389c41 Update hosting help for slug publishing
99e9c2f Document project state and fix review export assets
946379e Add GitHub Pages deploy workflow
```

Current export-related implementation:

```txt
src/app/App.jsx
src/builder/BuilderHeader.jsx
src/builder/BuilderShell.jsx
src/lib/exportLandingFolder.js
```

The header owns the page/folder name, `BuilderShell` passes it into export, and `exportLandingFolder.js` writes the static landing folder directly through the browser File System Access API. The previous ZIP writer was removed.
