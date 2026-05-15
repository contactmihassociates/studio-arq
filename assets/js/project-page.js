/* =============================================================
   STUDIO ARQS — project-page.js
   Renders a project detail page from the master ARQ_PROJECTS
   data + the page's data-slug attribute on <body>.
   ============================================================= */

(function () {
  "use strict";

  const slug = document.body && document.body.dataset.slug;
  if (!slug || !window.ARQ_PROJECTS) return;

  const proj = window.ARQ_PROJECTS.find((p) => p.slug === slug);
  if (!proj) return;

  /* --- meta --------------------------------------------------- */
  document.title = proj.title + " — Studio ARQS";

  /* --- hero --------------------------------------------------- */
  const heroBgImg = document.querySelector(".project-hero .hero__bg img");
  if (heroBgImg) {
    heroBgImg.src = "../assets/img/projects/" + proj.slug + "/" + proj.images[0] + ".jpg";
    heroBgImg.alt = proj.title + " — hero image";
  }
  const titleEl   = document.querySelector("[data-bind=title]");
  const sectorEl  = document.querySelector("[data-bind=sector]");
  const locEl     = document.querySelector("[data-bind=location]");
  const yearEl    = document.querySelector("[data-bind=year]");
  const summaryEl = document.querySelector("[data-bind=summary]");
  const countEl   = document.querySelector("[data-bind=imgCount]");
  if (titleEl)   titleEl.textContent = proj.title;
  if (sectorEl)  sectorEl.textContent = proj.sector;
  if (locEl)     locEl.textContent = proj.location;
  if (yearEl)    yearEl.textContent = proj.year;
  if (summaryEl) summaryEl.textContent = proj.summary;
  if (countEl)   countEl.textContent = proj.images.length;

  /* --- lead architect + tools (auto-filled from defaults) ----- */
  const defaults = window.ARQ_DEFAULTS || {};
  const leadEl  = document.querySelector("[data-bind=lead]");
  const toolsEl = document.querySelector("[data-bind=tools]");
  if (leadEl)  leadEl.textContent  = proj.lead  || defaults.lead  || "";
  if (toolsEl) toolsEl.textContent = (proj.tools || defaults.tools || []).join(" · ");

  /* --- gallery ------------------------------------------------ */
  const grid = document.querySelector("[data-bind=gallery]");
  if (grid) {
    const html = proj.images.map(function (f, i) {
      const src = "../assets/img/projects/" + proj.slug + "/" + f + ".jpg";
      const delay = (i % 3) * 100;
      const sizeClass = (i % 7 === 0) ? " is-wide" : ((i % 5 === 0) ? " is-tall" : "");
      return (
        '<a href="' + src + '" data-lightbox="' + proj.slug + '" class="gallery__item reveal' + sizeClass + '"' +
        (delay ? ' data-delay="' + delay + '"' : "") + '>' +
          '<img src="' + src + '" alt="' + proj.title + ' — render ' + (i + 1) + '" loading="lazy" />' +
        '</a>'
      );
    }).join("");
    grid.innerHTML = html;
  }

  /* --- related projects --------------------------------------- */
  const relWrap = document.querySelector("[data-bind=related]");
  if (relWrap) {
    const others = window.ARQ_PROJECTS.filter((p) => p.slug !== slug).slice(0, 2);
    relWrap.innerHTML = others.map(function (p) {
      const src = "../assets/img/projects/" + p.slug + "/" + p.images[0] + ".jpg";
      return (
        '<a href="' + p.slug + '.html" class="project-card reveal">' +
          '<div class="project-card__media"><img src="' + src + '" alt="' + p.title + '" loading="lazy" /></div>' +
          '<span class="project-card__index">— ' + p.sector + '</span>' +
          '<div class="project-card__body">' +
            '<div class="project-card__title">' +
              '<span class="project-card__tag">' + p.location + '</span>' +
              '<h3>' + p.title + '</h3>' +
            '</div>' +
            '<span class="project-card__cta" aria-hidden="true">→</span>' +
          '</div>' +
        '</a>'
      );
    }).join("");
  }
})();
