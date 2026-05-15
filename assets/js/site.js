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
      setInterval(() => {
        slides[i].classList.remove("is-active");
        i = (i + 1) % slides.length;
        slides[i].classList.add("is-active");
      }, 5500);
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
      if (status) {
        status.style.color = "var(--green-bright)";
        status.textContent = "Thanks — we'll reply within 48 hours.";
      }
      form.reset();
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

  /* ----- custom cursor (desktop, only after first mouse move) - */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    let dot, ring, rafId = 0;
    let rx = 0, ry = 0, dx = 0, dy = 0, lastDX = 0, lastDY = 0;
    let idleCount = 0;

    const ensureNodes = () => {
      if (dot) return;
      dot  = document.createElement("div");
      ring = document.createElement("div");
      dot.className = "cursor-dot";
      ring.className = "cursor-ring";
      document.body.appendChild(dot);
      document.body.appendChild(ring);
    };

    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring) ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";

      // stop the loop if the cursor has settled (avoids endless rAF)
      const settled = Math.abs(dx - rx) < 0.3 && Math.abs(dy - ry) < 0.3 && dx === lastDX && dy === lastDY;
      if (settled) {
        idleCount += 1;
      } else {
        idleCount = 0;
      }
      lastDX = dx; lastDY = dy;

      if (idleCount > 8) {
        rafId = 0;
        return; // stop; will restart on next mousemove
      }
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", (e) => {
      ensureNodes();
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)";
      if (!rafId) { idleCount = 0; rafId = requestAnimationFrame(tick); }
    }, { passive: true });

    const hovers = "a, button, [data-lightbox], summary, .project-card, .gallery__item";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hovers)) document.body.classList.add("is-hovering-link");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hovers)) document.body.classList.remove("is-hovering-link");
    });
  }

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
