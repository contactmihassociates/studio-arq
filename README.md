# Studio ARQ — Website

A boutique architectural-practice site for **Studio ARQ** (Chennai), built as a static HTML/CSS/JS bundle that can be hosted on any plain web host (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.).

The site is intentionally framework-free so you can hand-edit content without a build step.

## 1. Folder layout

```
site/
├─ index.html                 ← landing page (hero, manifesto, services, projects, testimonials, FAQ, contact)
├─ portfolio.html             ← full portfolio (all 6 projects with their galleries)
├─ about.html                 ← studio profile (extend this for a personal portfolio later)
├─ services.html              ← services & engagement models
├─ contact.html               ← standalone contact form
├─ projects/
│  ├─ akp-illam.html
│  ├─ hussain-haji-kattupakam.html
│  ├─ bloom-apartments.html
│  ├─ jp-pet-hospital.html
│  ├─ nh44-restaurant.html
│  └─ interiors.html
├─ sitemap.xml
├─ robots.txt
└─ assets/
   ├─ css/styles.css
   ├─ js/
   │  ├─ site.js              ← header, splash, scroll progress, lightbox, filters, cursor, back-to-top
   │  ├─ gallery-data.js      ← master list of projects + images (one source of truth)
   │  └─ project-page.js      ← renders each project detail page from gallery-data.js
   └─ img/
      ├─ brand/               ← favicon + Instagram QR + logo
      └─ projects/<slug>/     ← all renders, one folder per project
```

## 2. Adding a new project

1. Drop the renders into `assets/img/projects/<your-slug>/`. Filenames can be anything — convention here is `0001.jpg`, `0002.jpg`, …
2. Add a new entry to `window.ARQ_PROJECTS` in `assets/js/gallery-data.js`:

   ```js
   {
     slug: "your-slug",
     title: "Project Name",
     sector: "Residential",
     location: "City, State",
     summary: "One-line description shown on the project page hero.",
     year: "2026",
     href: "projects/your-slug.html",
     images: ["0001","0002","0003"]
   }
   ```

3. Duplicate any file in `projects/` (e.g. `akp-illam.html`) and:
   - Change `<body data-slug="...">` to your new slug.
   - Update the `<title>`, `<meta description>` and the static `<img src="">` in `.project-hero .hero__bg`.
4. Optionally add the new project as a card to `index.html` → `#projects` and to `portfolio.html`.

That's it — the gallery, related-projects and meta will auto-populate from `gallery-data.js`.

## 3. Brand palette (sampled from the logo)

| Token        | Value     | Use                              |
|--------------|-----------|----------------------------------|
| `--navy-900` | `#061A33` | Page background                  |
| `--navy-800` | `#0B2545` | Card / surface background        |
| `--aqua`     | `#3AAFE4` | Accent (cyan from logo S)        |
| `--green`    | `#5CC683` | Accent (green from logo S)       |
| `--grad-brand` | green → aqua linear-gradient | Headings, buttons, pulses |

Fonts: **Cormorant Garamond** (display) + **Inter** (body) + **JetBrains Mono** (small monospace eyebrow numbers).

## 4. Local preview

Any static server works. Easiest:

```bash
cd site
python -m http.server 8000
# → open http://localhost:8000
```

## 5. Where the WhatsApp images live

The original WhatsApp export sits at `../whatsapp_extract/` (outside the `site/` folder). The 78 images sent on 2 May 2026 (11:34 – 11:45 AM IST) have been categorised and copied into `assets/img/projects/<slug>/`. The folder is the source of truth for the site — you can safely delete the original `whatsapp_extract/` archive once you're happy.

## 6. Roadmap (turning this into a personal portfolio)

The structure is ready to grow into an architect's portfolio:

- `about.html` — already has Story, Principles, Recognition sections. Add a "Team" block + photo.
- `services.html` — pricing, engagement models, ready to add a downloadable PDF rate card.
- `contact.html` — full enquiry form with budget tiers.
- `gallery-data.js` — single file controls all projects everywhere.
- The CSS design system (`styles.css`) is component-based: `card`, `section`, `gallery`, `service`, `process__step`, `testimonial`, `awards__item`, `faq__item`. Reuse them rather than writing new CSS.

That's the whole thing. No build step, no framework, no surprise.
