/* =============================================================
   studio arqss — gallery-data.js
   Master list of every project image, used to power the
   portfolio masonry galleries and project detail pages.
   Add a new project here and every gallery picks it up.
   ============================================================= */

/* Studio defaults — applied to every project unless overridden */
window.ARQ_DEFAULTS = {
  lead: "Abdul Azeem · Principal Architect",
  tools: ["Revit", "AutoCAD", "SketchUp", "Twin Motion"],
  studio: "studio arqss"
};

window.ARQ_PROJECTS = [
  {
    slug: "akp-illam",
    title: "AKP Illam",
    sector: "Residential",
    location: "Shanagamputham, Chennai",
    summary: "A modern family residence with a layered facade — wood, plaster, perforated metal and glass.",
    year: "2025",
    href: "projects/akp-illam.html",
    images: [
      "0081","0083","0016","0082","0084","0085","0086","0087",
      "0088","0089","0090","0091","0092","0093","0094","0095",
      "0096","0097","0098","0099","0100","0101","0102","0103",
      "0104","0105","0106","0107","0108","0109","0110","0111",
      "0112","0113"
    ]
  },
  {
    slug: "hussain-haji-kattupakam",
    title: "Hussain Haji",
    sector: "Residential",
    location: "Kattupakam, Poonamallee",
    summary: "A residence with corten-toned cladding, a vertical garden screen and a layered roof deck.",
    year: "2026",
    href: "projects/hussain-haji-kattupakam.html",
    images: ["0119","0114","0115","0116","0117","0118"]
  },
  {
    slug: "bloom-apartments",
    title: "Bloom Apartments",
    sector: "Apartments",
    location: "Chennai",
    summary: "A boutique apartment block balancing privacy and street life — vertical timber screens and planter balconies.",
    year: "2025",
    href: "projects/bloom-apartments.html",
    images: ["0080","0078"]
  },
  {
    slug: "jp-pet-hospital",
    title: "JP Pet Hospital",
    sector: "Healthcare",
    location: "Chennai",
    summary: "A pet-first clinic with a louvered facade, illuminated identity and a calm grey-and-timber palette.",
    year: "2025",
    href: "projects/jp-pet-hospital.html",
    images: ["0066","0013","0068","0070","0072","0074"]
  },
  {
    slug: "nh44-restaurant",
    title: "NH 44 Highway Restaurant",
    sector: "Hospitality",
    location: "NH 44 corridor, Tamil Nadu",
    summary: "A tensile-canopy outdoor plaza for highway travellers with seating clusters, EV charging and landscape.",
    year: "2025",
    href: "projects/nh44-restaurant.html",
    images: ["0076","0014"]
  },
  {
    slug: "interiors",
    title: "Interior Portfolio",
    sector: "Interiors",
    location: "Various · Chennai",
    summary: "Bedrooms, kitchens, living rooms and study nooks across multiple homes — a library of material studies.",
    year: "2024 — 2026",
    href: "projects/interiors.html",
    images: [
      "0015","0018","0020","0022","0024","0025","0027","0028",
      "0030","0032","0034","0036","0037","0039","0041","0042",
      "0044","0046","0047","0049","0051","0053","0055","0057",
      "0059","0061","0063","0065"
    ]
  }
];

/* Helpers ----------------------------------------------------- */
window.ARQ = window.ARQ || {};
window.ARQ.imagePath = function (slug, fileBase) {
  return "assets/img/projects/" + slug + "/" + fileBase + ".jpg";
};
window.ARQ.imagePathFromPage = function (slug, fileBase) {
  /* used from /projects/*.html — one level deeper */
  return "../assets/img/projects/" + slug + "/" + fileBase + ".jpg";
};

/* Auto-render interiors gallery on the portfolio page --------- */
document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("interiorsGallery");
  if (!target) return;
  const proj = window.ARQ_PROJECTS.find((p) => p.slug === "interiors");
  if (!proj) return;
  const html = proj.images.map(function (f, i) {
    const src = window.ARQ.imagePath(proj.slug, f);
    const delay = (i % 3) * 100;
    return (
      '<a href="' + src + '" data-lightbox="interiors" class="gallery__item reveal"' +
      (delay ? ' data-delay="' + delay + '"' : "") + '>' +
        '<img src="' + src + '" alt="Interior design render — image ' + (i + 1) + '" loading="lazy" />' +
      '</a>'
    );
  }).join("");
  target.innerHTML = html;
});
