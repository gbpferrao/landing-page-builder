# Git And GitHub Pages

## Repository

```txt
Root: C:/dev/wpp-automation/temporary-workspace
Remote: origin https://github.com/gbpferrao/landing-page-builder.git
Branch: main
```

## GitHub Pages

GitHub Pages is deployed by:

```txt
.github/workflows/deploy-pages.yml
```

The workflow runs on pushes to `main` and can also be triggered manually with `workflow_dispatch`.

Deployment flow:

1. Checkout with `actions/checkout@v4`.
2. Set up Node 20 with npm cache.
3. Install dependencies with `npm ci`.
4. Build with `npm run build`.
5. Upload `dist/` using `actions/upload-pages-artifact@v3`.
6. Deploy using `actions/deploy-pages@v4`.

## Vite Pages Settings

`vite.config.mjs` uses:

```txt
base: "./"
build.outDir: "dist"
```

This makes the built builder work from a GitHub Pages project subpath and from local/static hosting.

## Local Workflow

```powershell
npm install
npm run dev
npm run build
```

Before pushing UI changes, run:

```powershell
npm run build
```

After pushing, check Pages:

```powershell
gh run list --workflow "Deploy to GitHub Pages" --limit 3
```

## Manual Export Publishing

Inside the builder, fill the project/page name, then use `Baixar ZIP`.

The downloaded ZIP contains:

```txt
nome-da-pagina.zip
  nome-da-pagina/
    index.html
    styles.css
    assets/
```

For Hostinger-style hosting, extract/upload the folder into:

```txt
public_html/
  nome-da-pagina/
```

The landing is then available at:

```txt
https://dominio.com/nome-da-pagina/
```
