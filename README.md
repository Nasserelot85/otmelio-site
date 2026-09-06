# OTMELIO website

Production static website for [otmelio.com](https://otmelio.com), deployed with GitHub Pages from the repository root on `main`.

## Architecture

- `index.html` — single-page storefront, SEO metadata, Search Console verification, and product structured data.
- `styles.css` — responsive visual system; no build step.
- `script.js` — dynamic copyright year and privacy-safe CTA event emission.
- `404.html` — static fallback page.
- `robots.txt` and `sitemap.xml` — search-engine discovery files.
- `CNAME` — GitHub Pages custom-domain binding for `otmelio.com`.

## Production invariants

The following values are intentional and must not be changed casually:

- Canonical origin: `https://otmelio.com/`
- Custom domain: `otmelio.com`
- CCK-001 checkout: `https://elotmani58.gumroad.com/l/oaglw`
- Checkout price shown on the site: USD 9
- Search Console verification meta tag must remain in the homepage `<head>`.
- CTA attribution parameters and the `cck_cta_click` event contract must remain compatible with CAM analytics consumers.

The current CTA tracker stores at most 20 events locally in the visitor's browser and emits the same event to `dataLayer` and the `otmelio:cck-cta-click` browser event. It does not send events to a centralized analytics endpoint by itself.

## Local validation

Requires Node.js 20 or newer and no third-party dependencies:

```bash
npm test
```

The validator checks the custom domain, canonical URL, Search Console verification marker, Gumroad destination, CTA tracking contract, robots directives, sitemap consistency, and accidental credential-like files. GitHub Actions runs the same checks for pushes and pull requests.

## Deployment

GitHub Pages publishes the repository root from `main`. Normal content changes should be proposed on a branch and merged after `npm test` passes. Do not edit DNS or GitHub Pages domain settings as part of routine site changes.

## CAM integration boundary

This repository contains the public website and browser-side tracking contract. CAM/n8n workflows, credentials, payment settings, and production webhook secrets belong outside this public repository. Configuration examples committed here must contain placeholders only.
