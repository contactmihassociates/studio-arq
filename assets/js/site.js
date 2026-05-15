/* =============================================================
   STUDIO ARQ — site.js
   Header behavior, hero slideshow, reveal animations,
   project filter, lightbox, contact form, mobile nav.
   ============================================================= */

(function () {
  "use strict";

  /* ----- helpers ---------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ----- Project page OG image + CreativeWork JSON-LD --------- */
  (function injectProjectSchema() {
    const slug = document.body && document.body.dataset && document.body.dataset.slug;
    if (!slug || !window.ARQ_PROJECTS) return;
    const proj = window.ARQ_PROJECTS.find(function (p) { return p.slug === slug; });
    if (!proj) return;

    const baseURL = window.location.origin;
    const imgURL = baseURL + "/assets/img/projects/" + proj.slug + "/" + proj.images[0] + ".jpg";

    // Set or insert <meta property="og:*">
    function setMeta(key, value, type) {
      type = type || "property";
      let m = document.querySelector('meta[' + type + '="' + key + '"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute(type, key);
        document.head.appendChild(m);
      }
      m.setAttribute("content", value);
    }
    setMeta("og:title", proj.title + " — studio arq");
    setMeta("og:description", proj.summary || "");
    setMeta("og:image", imgURL);
    setMeta("og:type", "article");
    setMeta("og:url", baseURL + window.location.pathname);
    setMeta("og:locale", "en_IN");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", proj.title + " — studio arq", "name");
    setMeta("twitter:description", proj.summary || "", "name");
    setMeta("twitter:image", imgURL, "name");

    // CreativeWork / Project JSON-LD
    const data = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": proj.title,
      "description": proj.summary,
      "image": imgURL,
      "dateCreated": proj.year,
      "locationCreated": { "@type": "Place", "address": proj.location },
      "creator": {
        "@type": "Organization",
        "name": "studio arq",
        "founder": { "@type": "Person", "name": "Abdul Azeem", "jobTitle": "Principal Architect" }
      },
      "about": proj.sector
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);

    // ImageGallery + per-image ImageObject schema (boosts image search)
    if (proj.images && proj.images.length > 1) {
      const gallery = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": proj.title + " — gallery",
        "description": proj.summary,
        "image": proj.images.map(function (f, i) {
          return {
            "@type": "ImageObject",
            "contentUrl": baseURL + "/assets/img/projects/" + proj.slug + "/" + f + ".jpg",
            "name": proj.title + " — render " + (i + 1),
            "description": proj.title + ", " + proj.sector + ", " + proj.location + ".",
            "creditText": "studio arq",
            "creator": { "@type": "Organization", "name": "studio arq" }
          };
        })
      };
      const g = document.createElement("script");
      g.type = "application/ld+json";
      g.textContent = JSON.stringify(gallery);
      document.head.appendChild(g);
    }
  })();

  /* ----- SoftwareApplication JSON-LD + OG meta on tool pages -- */
  (function injectToolSchema() {
    const path = window.location.pathname;
    if (path.indexOf("/tools/") !== 0) return;

    const baseURL = window.location.origin;

    // -- tools directory: emit ItemList of all tools (for SEO) --
    if (path === "/tools/" || path === "/tools/index.html") {
      const cards = document.querySelectorAll(".tool-link[href]");
      if (cards.length) {
        const items = Array.from(cards).map(function (a, i) {
          const h = a.querySelector("h3");
          return {
            "@type": "ListItem",
            "position": i + 1,
            "name": h ? h.textContent.trim() : a.textContent.trim().slice(0, 60),
            "url": new URL(a.getAttribute("href"), baseURL + path).href
          };
        });
        const list = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "studio arq · architect's toolkit",
          "itemListElement": items
        };
        const sList = document.createElement("script");
        sList.type = "application/ld+json";
        sList.textContent = JSON.stringify(list);
        document.head.appendChild(sList);
      }
      return;
    }

    // -- individual tool page: SoftwareApplication + OG meta --
    const titleEl = document.querySelector("h1");
    const descEl  = document.querySelector('meta[name="description"]');
    const title   = (titleEl ? titleEl.textContent : document.title).trim().replace(/\s+/g, " ");
    const desc    = (descEl ? descEl.getAttribute("content") : "Free calculator by studio arq.").trim();
    const fullURL = baseURL + path;
    const ogImg   = baseURL + "/assets/img/projects/akp-illam/0081.jpg";

    // SoftwareApplication schema
    const data = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": title,
      "description": desc,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any (browser-based)",
      "url": fullURL,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
      "publisher": { "@type": "Organization", "name": "studio arq", "url": baseURL + "/" }
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);

    // OG / Twitter meta — only if not already present
    function setMeta(key, value, type) {
      type = type || "property";
      let m = document.querySelector('meta[' + type + '="' + key + '"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute(type, key);
        document.head.appendChild(m);
      }
      m.setAttribute("content", value);
    }
    setMeta("og:title", title + " · studio arq toolkit");
    setMeta("og:description", desc);
    setMeta("og:image", ogImg);
    setMeta("og:type", "website");
    setMeta("og:url", fullURL);
    setMeta("og:locale", "en_IN");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title + " · studio arq toolkit", "name");
    setMeta("twitter:description", desc, "name");
    setMeta("twitter:image", ogImg, "name");
  })();

  /* ----- breadcrumb JSON-LD (auto-generated per page) --------- */
  (function injectBreadcrumb() {
    const path = window.location.pathname;
    const baseURL = window.location.origin;
    let items = null;

    // Tool pages
    if (path.indexOf("/tools/") === 0 && path !== "/tools/" && path !== "/tools/index.html") {
      const title = (document.title || "").replace(/\s*[—-]\s*studio arq.*$/i, "").trim();
      items = [
        { name: "Home",  url: baseURL + "/" },
        { name: "Tools", url: baseURL + "/tools/" },
        { name: title,   url: baseURL + path }
      ];
    } else if (path === "/tools/" || path === "/tools/index.html") {
      items = [
        { name: "Home",  url: baseURL + "/" },
        { name: "Tools", url: baseURL + "/tools/" }
      ];
    } else if (path.indexOf("/projects/") === 0) {
      const title = (document.title || "").replace(/\s*[—-]\s*studio arq.*$/i, "").trim();
      items = [
        { name: "Home",      url: baseURL + "/" },
        { name: "Portfolio", url: baseURL + "/portfolio.html" },
        { name: title,       url: baseURL + path }
      ];
    } else if (path === "/portfolio.html") {
      items = [
        { name: "Home",      url: baseURL + "/" },
        { name: "Portfolio", url: baseURL + "/portfolio.html" }
      ];
    } else if (path === "/founder.html" || path === "/about.html" || path === "/services.html" || path === "/contact.html") {
      const title = (document.title || "").replace(/\s*[—-]\s*studio arq.*$/i, "").trim();
      items = [
        { name: "Home",  url: baseURL + "/" },
        { name: title,   url: baseURL + path }
      ];
    }

    if (items) {
      const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map(function (it, i) {
          return { "@type": "ListItem", "position": i + 1, "name": it.name, "item": it.url };
        })
      };
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);

      // Visible breadcrumb (skip if a project-hero is taking the slot — it has its own meta)
      if (items.length > 1) {
        const crumbs = document.createElement("nav");
        crumbs.className = "crumbs";
        crumbs.setAttribute("aria-label", "Breadcrumb");
        const inner = document.createElement("div");
        inner.className = "crumbs__inner";
        items.forEach(function (it, i) {
          if (i > 0) {
            const sep = document.createElement("span");
            sep.className = "sep";
            sep.textContent = "/";
            inner.appendChild(sep);
          }
          if (i === items.length - 1) {
            const cur = document.createElement("span");
            cur.className = "current";
            cur.textContent = it.name;
            inner.appendChild(cur);
          } else {
            const a = document.createElement("a");
            a.href = it.url;
            a.textContent = it.name;
            inner.appendChild(a);
          }
        });
        crumbs.appendChild(inner);
        // Insert at top of <main>
        const main = document.getElementById("main") || document.querySelector("main");
        if (main && main.firstChild) {
          // If first child is a section with project-hero, put crumbs INSIDE it (over the bg)
          const firstSection = main.querySelector("section");
          if (firstSection && firstSection.classList.contains("project-hero")) {
            firstSection.appendChild(crumbs);
          } else {
            main.insertBefore(crumbs, main.firstChild);
          }
        }
      }
    }
  })();

  /* ----- universal head meta: PWA + default OG --------------- */
  (function injectHeadMeta() {
    function meta(name, content, isProp) {
      var key = isProp ? "property" : "name";
      if (document.querySelector('meta[' + key + '="' + name + '"]')) return;
      var m = document.createElement("meta");
      m.setAttribute(key, name);
      m.setAttribute("content", content);
      document.head.appendChild(m);
    }
    function linkOnce(rel, href, attrs) {
      var existing = document.querySelector('link[rel="' + rel + '"]');
      if (existing) return;
      var l = document.createElement("link");
      l.setAttribute("rel", rel);
      l.setAttribute("href", href);
      if (attrs) Object.keys(attrs).forEach(function (k) { l.setAttribute(k, attrs[k]); });
      document.head.appendChild(l);
    }
    // PWA / mobile-app metadata — only inject if missing
    linkOnce("manifest", "/manifest.webmanifest");
    meta("apple-mobile-web-app-capable", "yes");
    meta("apple-mobile-web-app-status-bar-style", "black-translucent");
    meta("apple-mobile-web-app-title", "studio arq");
    meta("application-name", "studio arq");
    meta("msapplication-TileColor", "#0B2545");
    meta("color-scheme", "dark");

    // Default OG / Twitter — set only if not already present.
    // (Project pages override via injectProjectSchema; tool pages via injectToolSchema.)
    var defaultImg = window.location.origin + "/assets/img/projects/akp-illam/0081.jpg";
    var defaultTitle = document.title || "studio arq";
    var defaultDesc  = (document.querySelector('meta[name="description"]') || {}).content || "studio arq — architecture, interiors and 3D in Chennai.";
    meta("og:title",       defaultTitle, true);
    meta("og:description", defaultDesc,  true);
    meta("og:image",       defaultImg,   true);
    meta("og:type",        "website",    true);
    meta("og:url",         window.location.origin + window.location.pathname, true);
    meta("og:locale",      "en_IN",      true);
    meta("twitter:card",        "summary_large_image");
    meta("twitter:title",       defaultTitle);
    meta("twitter:description", defaultDesc);
    meta("twitter:image",       defaultImg);
  })();

  /* ----- image perf: lazy + decode async on non-hero imgs ----- */
  function tagImg(img) {
    if (img.closest(".hero__bg") || img.closest(".project-hero .hero__bg") || img.closest(".brand-mark")) return;
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    // Anti-CLS: if a gallery-style img has no intrinsic dimensions, set sensible
    // defaults based on its container so the browser reserves the right space
    // before the image actually loads.
    if (!img.hasAttribute("width") && !img.hasAttribute("height")) {
      var inGallery = img.closest(".gallery__item") || img.closest(".project-card__media");
      if (inGallery) {
        img.setAttribute("width", "800");
        img.setAttribute("height", "1000");
      }
    }
  }
  // Run once on existing imgs
  document.querySelectorAll("img").forEach(tagImg);
  // And on any JS-injected imgs after the fact
  if ("MutationObserver" in window) {
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        r.addedNodes && r.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === "IMG") tagImg(n);
          else if (n.querySelectorAll) n.querySelectorAll("img").forEach(tagImg);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ----- decorative background -------------------------------- */
  if (!document.querySelector(".bg-grid")) {
    const grid  = document.createElement("div"); grid.className  = "bg-grid";
    const grain = document.createElement("div"); grain.className = "bg-grain";
    document.body.appendChild(grid);
    document.body.appendChild(grain);
  }

  /* ----- year ------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- sticky header shadow on scroll ----------------------- */
  const header = $("#siteHeader");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- mobile nav ------------------------------------------- */
  const navToggle = $("#navToggle");
  const nav       = $("#primaryNav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ----- hero slideshow --------------------------------------- */
  const slideshow = $("#heroSlideshow");
  if (slideshow) {
    const slides = $$(".slide", slideshow);
    if (slides.length > 1) {
      let i = 0;
      let intervalId = null;
      const advance = function () {
        slides[i].classList.remove("is-active");
        i = (i + 1) % slides.length;
        slides[i].classList.add("is-active");
      };
      const start = function () {
        if (intervalId) return;
        intervalId = setInterval(advance, 5500);
      };
      const stop = function () {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
      };
      start();

      // Pause when hero leaves the viewport (no point cycling unseen)
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { rootMargin: "0px" }).observe(slideshow);
      }
      // Pause when the tab is hidden
      document.addEventListener("visibilitychange", function () {
        document.hidden ? stop() : start();
      });
    }
    // gentle zoom (toggled, not infinite) — kinder to renderers
    const heroImg = slideshow.querySelector("img");
    if (heroImg) {
      requestAnimationFrame(() => heroImg.classList.add("is-zoom"));
    }
  }

  /* ----- reveal-on-scroll ------------------------------------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----- project filter --------------------------------------- */
  const filterBar = $(".filter-bar");
  const cards     = $$(".projects-grid .project-card");
  if (filterBar && cards.length) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      const target = btn.dataset.filter;
      $$("button", filterBar).forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      cards.forEach((card) => {
        const cat = card.dataset.category || "";
        const show = target === "all" || cat === target;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ----- contact form ----------------------------------------- */
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = $("#formStatus");
      if (!form.checkValidity()) {
        if (status) {
          status.style.color = "#ff9b9b";
          status.textContent = "Please complete the required fields.";
        }
        form.reportValidity();
        return;
      }
      // Build a structured enquiry the studio can act on
      const f = (name) => (form.querySelector("[name=" + name + "]") || {}).value || "";
      const subject = "Enquiry — " + (f("type") || "studio arq website");
      const body =
        "Name: "    + f("name")    + "\n" +
        "Email: "   + f("email")   + "\n" +
        "Phone: "   + f("phone")   + "\n" +
        "Type: "    + f("type")    + "\n" +
        "Budget: "  + f("budget")  + "\n\n" +
        "Message:\n" + f("message") + "\n\n" +
        "—\nSent from studioarq.com";
      const mailto = "mailto:hello@studioarq.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      // Also build a WhatsApp version
      const waText = "Hi Abdul, I'd like to talk to studio arq.\n\n" + body;
      const waUrl = "https://wa.me/917200078603?text=" + encodeURIComponent(waText);

      if (status) {
        status.style.color = "var(--green-bright)";
        status.innerHTML =
          "Thanks — your details are ready. " +
          "<a href=\"" + mailto + "\" style=\"color:var(--aqua-bright);text-decoration:underline;\">Send by email</a> " +
          "or <a href=\"" + waUrl + "\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--green-bright);text-decoration:underline;\">send on WhatsApp</a>. " +
          "We reply within 48 hours.";
      }
      // Auto-open the mailto so it doesn't feel like a dead form
      window.location.href = mailto;
    });
  }

  /* ----- lightbox (used on portfolio + project pages) --------- */
  const lightbox = $("#lightbox");
  if (lightbox) {
    const imgEl   = $("#lbImage", lightbox);
    const capEl   = $("#lbCaption", lightbox);
    const closeEl = $("#lbClose", lightbox);
    const prevEl  = $("#lbPrev", lightbox);
    const nextEl  = $("#lbNext", lightbox);
    let items = [];
    let idx   = 0;

    const open = (i) => {
      idx = i;
      const item = items[idx];
      if (!item) return;
      imgEl.src = item.src;
      imgEl.alt = item.alt || "";
      capEl.textContent = item.caption || (idx + 1) + " / " + items.length;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const step = (dir) => {
      idx = (idx + dir + items.length) % items.length;
      open(idx);
    };

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-lightbox]");
      if (!trigger) return;
      e.preventDefault();
      const group = trigger.dataset.lightbox || "default";
      items = $$(`[data-lightbox="${group}"]`).map((el) => {
        const img = el.tagName === "IMG" ? el : el.querySelector("img");
        return {
          src: el.dataset.src || (img && img.src) || el.href || "",
          alt: el.dataset.alt || (img && img.alt) || "",
          caption: el.dataset.caption || (img && img.alt) || ""
        };
      });
      const i = items.findIndex((it) => it.src === (trigger.dataset.src || (trigger.querySelector("img") && trigger.querySelector("img").src) || trigger.href));
      open(i >= 0 ? i : 0);
    });

    closeEl.addEventListener("click", close);
    prevEl.addEventListener("click", () => step(-1));
    nextEl.addEventListener("click", () => step(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft")  step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ----- nav 'Get a quote' CTA ------------------------------- */
  (function injectNavCta() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    // Skip on the quote page itself
    if (location.pathname.indexOf("/tools/quote") === 0 || location.pathname === "/tools/quote.html") return;
    // Skip if already present
    if (nav.querySelector(".nav-cta")) return;
    // Determine href prefix
    const isSub = location.pathname.indexOf("/projects/") === 0 || location.pathname.indexOf("/tools/") === 0;
    const href = isSub ? "../tools/quote.html" : "tools/quote.html";
    const a = document.createElement("a");
    a.href = href;
    a.className = "nav-cta";
    a.textContent = "Get a quote";
    nav.appendChild(a);
  })();

  /* ----- floating WhatsApp button ----------------------------- */
  if (!document.querySelector(".wa-fab")) {
    const waPhone = "917200078603";
    const waMsg   = encodeURIComponent("Hi Abdul — I'd like to talk to studio arq about a project.");
    const wa = document.createElement("a");
    wa.className = "wa-fab";
    wa.href = "https://wa.me/" + waPhone + "?text=" + waMsg;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat with studio arq on WhatsApp");
    wa.innerHTML =
      '<span class="wa-fab__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 14.6c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1s-.7.9-.9 1.1-.3.2-.6 0c-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1.1 2.8 1.2 3 2.1 3.3 5.2 4.6c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.2 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/></svg>' +
      '</span>' +
      '<span class="wa-fab__label">WhatsApp</span>';
    document.body.appendChild(wa);
    // Show after small delay (avoid flash during splash)
    setTimeout(function () { wa.classList.add("is-visible"); }, 1200);
  }

  /* ----- back to top button ----------------------------------- */
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "<span aria-hidden='true'>↑</span>";
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(toTop);
  const onScrollTop = () => toTop.classList.toggle("is-visible", window.scrollY > 600);
  window.addEventListener("scroll", onScrollTop, { passive: true });

  /* ----- scroll progress bar ---------------------------------- */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  const onProgress = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progress.style.width = pct + "%";
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* Native cursor is used — custom cursor removed. */

  /* ----- splash dismissal ------------------------------------- */
  const splash = $(".splash");
  if (splash) {
    const dismiss = () => splash.classList.add("is-done");
    if (document.readyState === "complete") {
      setTimeout(dismiss, 400);
    } else {
      window.addEventListener("load", () => setTimeout(dismiss, 400));
    }
  }

  /* ----- service worker registration -------------------------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () { /* silent */ });
    });
  }

  /* ----- nav active section highlight ------------------------- */
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach((s) => sio.observe(s));
  }
})();
