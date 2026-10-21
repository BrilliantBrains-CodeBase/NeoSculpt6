# NeoSculpt6 site

Vite + React 18 + Tailwind v4, prerendered with [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg).
Every route builds to `dist/<path>/index.html` with its title, meta, canonical, OG/Twitter and JSON-LD in the static HTML.
Page bodies are placeholders (H1 only) for now.

```sh
npm install
npm run gen:og    # first time: build page data and download og images from the live site
npm run dev       # http://localhost:5173
npm run build     # gen -> prerender all routes -> dist/404.html
npm run verify    # check every built page against src/data/pages.json
npm run preview   # serve dist/
```

## Where the SEO comes from

`scripts/generate-pages.mjs` builds everything from `../scraped/` (the old-site capture) and the SEO CSV. Don't edit the
generated files by hand: `src/data/pages.json`, `src/data/routes.json`, `src/data/seo-report.csv`,
`public/sitemap.xml`, `public/robots.txt` and `public/_redirects`.

| Field | Source, in order |
|---|---|
| URL | Old URL path, unchanged (trailing slash kept) |
| Title | SEO CSV → live `<title>`; draft for the 5 technology pages that 404 on the old site |
| Description | SEO CSV → live text, if real (not the phone number or demo copy) → generated draft |
| Home | `content/home-page/homepage.md` (title, description, H1) |
| Robots / canonical | `index, follow`, self-canonical (the old site's `noindex` and YouTube canonicals are not carried over) |
| og:image | Old page's image, downloaded to `public/og/`, otherwise `public/og/default.png` |
| H1 | Old page's H1 |

- **New pages** (speciality hubs, `/technology/`, `/dr-saranya-t/`, `/international-patients/`) have draft meta in `src/data/hubs.ts`.
- **Theme-demo URLs** left over from WordPress (`/product/…`, `/portfolio/…`, `/pxl-template/…` and so on) keep their routes so nothing 404s. They are `noindex` and left out of the sitemap.
- **`/service/`** 301-redirects to Post-Pregnancy Belly Correction: in `_redirects`, plus a meta-refresh fallback page.
- `src/data/seo-report.csv` lists each page's title and description sources and open `todo` items, for SEO sign-off.

## Layout

```
src/data/site.ts          clinic NAP, hours, SITE_URL
src/data/hubs.ts          draft meta for new pages
src/components/Seo.tsx    all head tags + JSON-LD
src/components/PageShell  Seo + the template for the page type
src/templates/            one per type: Home, Service, Technology, Hub, Doctor, Contact, Legacy
src/layouts/SiteLayout    header / footer slots
src/styles/theme.css      Rejuvita tokens (from ../rejuvita-scrape/design/theme.css)
```

Each record in `pages.json` has `oldSite.dataJson` and `oldSite.contentMd`, pointing at the old page's captured copy, for when templates get real content. v2
