/* =============================================================
   studio arq — tools-shared.js · v2
   Common helpers + INR formatting + standard rate constants
   used across every tool page.

   Designed to be load-order independent: provides a queue-based
   ARQ_TOOLS.ready(cb) so inline tool scripts can call it whether
   this file has fully run or not. Safe to load with or without
   `defer` — works either way.
   ============================================================= */

(function () {
  "use strict";

  // Preserve anything that was queued before this file loaded
  var preQueue = (window.ARQ_TOOLS && window.ARQ_TOOLS.__queue) || [];

  // Replace (or create) the namespace
  var T = window.ARQ_TOOLS = window.ARQ_TOOLS || {};
  T.version = "v2";

  /* ----- INR formatting --------------------------------------- */
  T.fmtINR = function (n) {
    n = Number(n) || 0;
    if (n >= 1e7)  return "₹" + (n / 1e7).toFixed(2)   + " Cr";
    if (n >= 1e5)  return "₹" + (n / 1e5).toFixed(2)   + " L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1)  + "K";
    return "₹" + Math.round(n).toLocaleString("en-IN");
  };
  T.fmtINRflat = function (n) {
    return "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
  };
  T.fmtRange = function (lo, hi) {
    return T.fmtINR(lo) + " — " + T.fmtINR(hi);
  };

  /* ----- Generic helpers -------------------------------------- */
  T.clamp = function (n, min, max) { return Math.max(min, Math.min(max, Number(n))); };
  T.toNum = function (v, fallback) { var n = parseFloat(v); return isNaN(n) ? (fallback || 0) : n; };
  T.toInt = function (v, fallback) { var n = parseInt(v, 10); return isNaN(n) ? (fallback || 0) : n; };
  T.round = function (n, places) { var p = Math.pow(10, places || 0); return Math.round(n * p) / p; };

  /* ----- Slider ↔ number input binder ------------------------- */
  T.bindRangeNumber = function (root, sliderSel, numberSel, onChange) {
    var s = root.querySelector(sliderSel);
    var n = root.querySelector(numberSel);
    if (!s || !n) return;
    var sync = function (src) {
      var v = T.toNum(src.value, 0);
      if (src === s) { n.value = v; } else { s.value = T.clamp(v, +s.min, +s.max); }
      if (onChange) onChange();
    };
    s.addEventListener("input",  function () { sync(s); });
    n.addEventListener("input",  function () { sync(n); });
  };

  T.onAnyInput = function (root, callback) {
    root.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input",  callback);
      el.addEventListener("change", callback);
    });
  };

  /* ----- Queue-based ready() (the load-order safety net) ------ */
  T.ready = function (cb) {
    if (typeof cb !== "function") return;
    if (document.readyState === "complete" || document.readyState === "interactive") {
      // DOM is ready — call immediately
      try { cb(); } catch (e) { console.error("[ARQ_TOOLS.ready] callback threw:", e); }
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        try { cb(); } catch (e) { console.error("[ARQ_TOOLS.ready] callback threw:", e); }
      });
    }
  };

  /* ----- Standard rate tables --------------------------------- */
  T.STAMP = {
    stampPct: 7,
    regPct: 4
  };

  T.MATERIAL = {
    cementBags:    9,
    steelKg:       400,
    sandCft:       90,
    aggregateCft:  60,
    bricks:        800,
    rates: {
      cementBag:    410,
      steelKg:      72,
      sandCft:      65,
      aggregateCft: 60,
      brick:        9
    }
  };

  T.PAINT = {
    coverage: {
      smooth:   140,
      rough:    90,
      ceiling:  130,
      exterior: 90
    },
    rate: 280
  };

  T.TILE = {
    wastage: 12,
    sizes: [
      { value: "300x300",   label: "300 × 300 mm (1×1 ft)" },
      { value: "600x600",   label: "600 × 600 mm (2×2 ft)" },
      { value: "600x1200",  label: "600 × 1200 mm (2×4 ft)" },
      { value: "800x1600",  label: "800 × 1600 mm (large format)" }
    ]
  };

  /* ----- Flush any pre-queued ready() callers ----------------- */
  while (preQueue.length) {
    var cb = preQueue.shift();
    T.ready(cb);
  }
})();
