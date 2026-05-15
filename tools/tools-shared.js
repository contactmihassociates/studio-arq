/* =============================================================
   studio arq — tools-shared.js
   Common helpers + INR formatting + standard rate constants
   used across every tool. Load before any individual tool js.
   ============================================================= */

(function () {
  "use strict";

  window.ARQ_TOOLS = window.ARQ_TOOLS || {};

  /* ----- INR formatting --------------------------------------- */
  ARQ_TOOLS.fmtINR = function (n) {
    n = Number(n) || 0;
    if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
    if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
    return "₹" + Math.round(n).toLocaleString("en-IN");
  };
  ARQ_TOOLS.fmtINRflat = function (n) {
    return "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
  };
  ARQ_TOOLS.fmtRange = function (lo, hi) {
    return ARQ_TOOLS.fmtINR(lo) + " — " + ARQ_TOOLS.fmtINR(hi);
  };

  /* ----- Generic number helpers ------------------------------- */
  ARQ_TOOLS.clamp  = function (n, min, max) { return Math.max(min, Math.min(max, Number(n))); };
  ARQ_TOOLS.toNum  = function (v, fallback) { var n = parseFloat(v); return isNaN(n) ? (fallback || 0) : n; };
  ARQ_TOOLS.toInt  = function (v, fallback) { var n = parseInt(v, 10); return isNaN(n) ? (fallback || 0) : n; };
  ARQ_TOOLS.round  = function (n, places) { var p = Math.pow(10, places || 0); return Math.round(n * p) / p; };

  /* ----- Universal slider ↔ number binder --------------------- */
  ARQ_TOOLS.bindRangeNumber = function (root, sliderSel, numberSel, onChange) {
    var s = root.querySelector(sliderSel);
    var n = root.querySelector(numberSel);
    if (!s || !n) return;
    var sync = function (src) {
      var v = ARQ_TOOLS.toNum(src.value, 0);
      if (src === s) { n.value = v; } else { s.value = ARQ_TOOLS.clamp(v, +s.min, +s.max); }
      if (onChange) onChange();
    };
    s.addEventListener("input", function () { sync(s); });
    n.addEventListener("input", function () { sync(n); });
  };

  ARQ_TOOLS.onAnyInput = function (root, callback) {
    root.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", callback);
      el.addEventListener("change", callback);
    });
  };

  /* ----- Tamil Nadu / Chennai rate tables --------------------- */
  ARQ_TOOLS.STAMP = {
    /* TN stamp duty: 7% on market value, registration 4% */
    stampPct: 7,
    regPct: 4
  };

  ARQ_TOOLS.MATERIAL = {
    /* Per 100 sqft built-up area — typical RCC residential */
    cementBags:  9,        // 50kg bags per 100 sqft
    steelKg:     400,      // kg per 100 sqft
    sandCft:     90,       // cubic feet per 100 sqft
    aggregateCft:60,       // cubic feet per 100 sqft
    bricks:      800,      // No.s per 100 sqft (4.5" wall)
    /* Indicative ₹ rates (Chennai 2026, easy to edit) */
    rates: {
      cementBag:  410,     // per 50kg bag
      steelKg:    72,      // per kg
      sandCft:    65,      // per cft
      aggregateCft: 60,    // per cft
      brick:      9        // per piece
    }
  };

  ARQ_TOOLS.PAINT = {
    /* Coverage (sqft per litre) by surface */
    coverage: {
      smooth:    140,     // smooth plastered wall, primer + 2 coats
      rough:     90,      // rough/textured wall
      ceiling:   130,     // ceiling, white
      exterior:  90       // exterior, weatherproof
    },
    /* Rate ₹/litre indicative */
    rate: 280
  };

  ARQ_TOOLS.TILE = {
    /* Wastage % to add */
    wastage: 12,
    /* Common tile sizes — width × height in mm */
    sizes: [
      { value: "300x300",   label: "300 × 300 mm (1×1 ft)" },
      { value: "600x600",   label: "600 × 600 mm (2×2 ft)" },
      { value: "600x1200",  label: "600 × 1200 mm (2×4 ft)" },
      { value: "800x1600",  label: "800 × 1600 mm (large format)" }
    ]
  };

  /* ----- Auto-init wrapper any tool can use ------------------- */
  ARQ_TOOLS.ready = function (cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb);
    } else {
      cb();
    }
  };
})();
