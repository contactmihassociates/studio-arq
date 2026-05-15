# studio arqss — website

A boutique architectural-practice site for **studio arqss** (Chennai),
led by **Abdul Azeem** ([LinkedIn](https://in.linkedin.com/in/abd-al-azeem) ·
[Instagram @studio_arqs](https://www.instagram.com/studio_arqs)).

Built as a static HTML / CSS / JS bundle — no build step. Host it on
any plain web host (GitHub Pages, Netlify, Cloudflare Pages, S3).

## Live preview

```bash
cd site
python -m http.server 8000
# open http://localhost:8000
```

## Folder layout

```
site/
├─ index.html              ← landing
├─ portfolio.html          ← full portfolio (all 6 projects, masonry galleries)
├─ founder.html            ← Abdul Azeem — bio, skills, geo arc, timeline
├─ about.html              ← studio profile
├─ services.html           ← services & engagement models
├─ contact.html            ← enquiry form
├─ projects/
│  ├─ akp-illam.html              (34 renders)
│  ├─ hussain-haji-kattupakam.html (6)
│  ├─ bloom-apartments.html       (2)
│  ├─ jp-pet-hospital.html        (6)
│  ├─ nh44-restaurant.html        (2)
│  └─ interiors.html              (28)
├─ sitemap.xml
├─ robots.txt
└─ assets/
   ├─ css/styles.css      ← single design-system stylesheet
   ├─ js/
   │  ├─ site.js          ← header, splash, scroll progress, lightbox, filters, cursor, back-to-top
   │  ├─ gallery-data.js  ← master list of projects + ARQ_DEFAULTS (lead architect + tools)
   │  └─ project-page.js  ← renders each project detail from gallery-data.js
   └─ img/
      ├─ brand/           ← logo.jpg, logo-sm.png, logo-mark.svg, favicon.svg, instagram-qr.jpg
      └─ projects/<slug>/ ← project renders, one folder per project
```

## v1 → v10 — what shipped after the LinkedIn discovery

After watching a screen recording of Abdul Azeem's LinkedIn profile,
the site went through 10 focused versions:

| Version | Commit | What landed |
|---|---|---|
| v1 | `d9439a9` | Rebrand `Studio ARQS` → `studio arqss`; SVG logo mark replaces the text 'a'; splash uses the actual logo SVG; logo-sm.png raster generated |
| v2 | `1022878` | Founder-page **Skills & toolchain** block — top skills, expertise list, software stack, credential IDs, all from the verified profile |
| v3 | `9a9ffa8` | **Chennai ↔ Jeddah** career-arc section — animated SVG map + three location cards listing every role and year |
| v4 | `c3e5c51` | Hero typography polish — new headline with `<em>` brand-gradient emphasis, founder credit in the lead paragraph, secondary CTA points to /founder.html |
| v5 | `f923e1b` | Project pages now show **Lead architect: Abdul Azeem** and **Tools used: Revit · AutoCAD · SketchUp · Twin Motion**, driven by `ARQ_DEFAULTS` so new projects auto-inherit |
| v6 | `f56fb82` | **Numbers that matter** big-stats grid — `13+ yrs`, `CA/2012/57306`, `2019 Revit cert.`, `40+ projects` with hover gradient bars |
| v7 | `a930496` | Splash screen now shows the full `logo.jpg` (not just the mark); favicon SVG redrawn to read 'as' in white + gradient |
| v8 | `edf48a1` | Footer **Brand kit** — downloadable logo files, 4-swatch palette, 3-font typography card |
| v9 | `4eebba7` | `lang="en-IN"`, canonical URLs, apple-touch-icon, slide-in skip-to-content link, `prefers-reduced-motion` disables splash/marquee/cursor animations |
| v10 | `34bef34` | Skip-link + `<main id="main">` consistent on every page; first README refresh |
| — | `0bd1eed` | Native cursor restored; firm renamed `studio arqss` → **`studio arqs`**; real `logo.jpg` wired into header |
| v11 | `f3943c5` | Founder portrait — `assets/img/brand/azeem.jpg` replaces 'AA' placeholder on founder.html + homepage |
| v12 | `b8d2b5f` | Responsive portrait variants (400 / 800 / 1200) + face-crop variants (96 / 200 sq) + srcset everywhere |
| v13 | `cacd244` | **'Led by Abdul Azeem'** face chip in the hero, next to 'Recently shipped' + 'Award-winning' |
| v14 | `7d33cf3` | New `.portrait-card` component on about.html (200px photo + bio + CTAs) |
| v15 | `92a3df2` | Same component on contact.html — **'Your first reply is from this person'** above the form |
| v16 | `522566b` | New `.voice-card` on founder.html — portrait + giant italic pull-quote |
| v17 | `99e6313` | `.reply-strip` above the homepage contact details — 60px avatar + 'replies in 48h' microcopy |
| v18 | `db6938a` | Header logo polish — 44px height, drop-shadow, hover lift |
| v19 | `65d10fc` | Brand-kit footer adds portrait downloads (full / 800 / face avatar) |
| v20 | (this commit) | README refreshed with v11-v20 changelog, final cross-page verification |

## Verified founder facts (used throughout the site)

All copy on the site is sourced from the LinkedIn profile of
**Abdul Azeem . S . A**:

- **Title:** Principal Architect at studio arqss (since Apr 2024;
  Senior Architect Apr 2019 – Mar 2024, 5 yrs total tenure)
- **Education:** B.Arch in Architecture & Interior Design,
  **MEASI Academy of Architecture**, 2006 – 2011
- **Registration:** **Council of Architecture, India** — credential
  **CA/2012/57306**, issued Oct 2012
- **Software certification:** Autodesk Revit Architecture 2019 (wCrJd-48bp)
- **13+ years experience** spanning:
  - Chennai 2010 — Architectural Intern · Eta Star Properties & Developers
  - Chennai 2011 – 2012 — Junior Architect · KKR Architects
  - Jeddah 2013 — Designer · ALUMCO
  - Jeddah 2013 – 2019 — Architect · SAUDI ABV General Contractors (5y 7m)
  - Chennai 2019 — now — studio arqss (Senior → Principal Architect)
- **Skills:** Building Design · Project Management · AutoCAD · Shop
  Drawings · MS Office (top 5 of 31 listed)
- **Tools:** AutoCAD · Revit · SketchUp · Twin Motion · MS Office

## Adding a new project

1. Drop renders into `assets/img/projects/<slug>/`.
2. Add a new entry to `window.ARQ_PROJECTS` in `assets/js/gallery-data.js`:

   ```js
   {
     slug: "your-slug",
     title: "Project Name",
     sector: "Residential",
     location: "City, State",
     summary: "One-line description.",
     year: "2026",
     href: "projects/your-slug.html",
     images: ["0001","0002","0003"]
     // optional per-project overrides:
     // lead: "Abdul Azeem · Principal Architect",
     // tools: ["Revit","AutoCAD","SketchUp"]
   }
   ```

3. Duplicate `projects/akp-illam.html`, change the `data-slug` attribute,
   `<title>`, `<meta description>` and the static hero `<img src>`.
4. Optionally add a project card to `index.html` → `#projects` and a
   section to `portfolio.html`.

The gallery, related-projects, **Lead architect**, and **Tools** rows
all auto-populate from `gallery-data.js` defaults.

## Founder portrait

- Source: `assets/img/brand/azeem.jpg` (original, ~1.4 MB)
- Generated variants for performance:
  - `azeem-1200.jpg` · 1200w · ~310 KB · desktop founder hero
  - `azeem-800.jpg` · 800w · ~96 KB · homepage portrait
  - `azeem-400.jpg` · 400w · ~15 KB · mobile / portrait card
  - `azeem-face-200.jpg` · 200x200 sq · ~6 KB · chip / avatar
  - `azeem-face-96.jpg` · 96x96 sq · ~2 KB · favicon-size chip

Used in:
- Founder portrait card on `founder.html` (full 1200w with srcset)
- Homepage 'Meet the founder' section
- 'Led by Abdul Azeem' chip in the hero (face crop)
- About + Contact portrait cards
- Quote 'voice card' on the founder page
- 'Replies in 48h' avatar strip above the contact form
- Brand kit downloads (footer)

## Brand palette (from the logo)

| Token         | Value     | Use                          |
|---------------|-----------|------------------------------|
| `--navy-900`  | `#061A33` | Page background              |
| `--navy-800`  | `#0B2545` | Card / surface background    |
| `--aqua`      | `#3AAFE4` | Accent (cyan from logo S)    |
| `--green`     | `#5CC683` | Accent (green from logo S)   |
| `--grad-brand`| green → aqua linear-gradient | Buttons, headings, pulses |

Fonts: **Cormorant Garamond** (display) + **Inter** (body) +
**JetBrains Mono** (mono accents).

## Deploy

- **GitHub Pages**: Settings → Pages → Source: `main` / `(root)` — site
  is live at `https://<user>.github.io/studio-arq/`.
- **Netlify / Cloudflare Pages / Vercel**: connect this repo, no build
  command, output dir `/`.
- **Custom domain**: drop a `CNAME` file at the repo root and point DNS
  to your host.

No build step, no framework, no surprise.
