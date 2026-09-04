# OTMELIO Website v1

Zero-cost static website package prepared for GitHub Pages.

## Included
- `index.html`
- `styles.css`
- `script.js`
- `CNAME` configured for `otmelio.com`
- `404.html`

## Before publishing
The CCK-001 "Buy on Gumroad" button is intentionally disabled because the public Gumroad listing URL was not available in the project context.

Replace this line in `index.html`:

```html
<a id="buy-cck" class="btn btn-primary" href="#" data-placeholder="true" aria-disabled="true">Buy on Gumroad</a>
```

with:

```html
<a id="buy-cck" class="btn btn-primary" href="YOUR_PUBLIC_GUMROAD_URL">Buy on Gumroad</a>
```

## GitHub Pages
1. Create a public repository, e.g. `otmelio-site`.
2. Upload all files from this package to the repository root.
3. Settings → Pages → Deploy from a branch → `main` / root.
4. Set custom domain to `otmelio.com`.
5. Wait for GitHub to provide the DNS instructions.
6. Only then update Porkbun DNS.
7. Enable "Enforce HTTPS" after DNS validation.

Do not guess DNS values before GitHub Pages displays them.
