/* =============================================================
   studio arqs — estimator.js
   Wires up any DOM element with [data-estimator-root] to the
   rates in rates.js. Designed to live on a tool page or as an
   embedded homepage widget.
   ============================================================= */

(function () {
  "use strict";

  const RATES = window.ARQ_RATES;
  if (!RATES) {
    console.warn("[estimator] window.ARQ_RATES missing — load rates.js first");
    return;
  }

  /* ----- helpers ---------------------------------------------- */
  const fmtINR = (n) => {
    if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
    if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
    return "₹" + Math.round(n);
  };
  const fmtRange = (low, high) => fmtINR(low) + " — " + fmtINR(high);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  /* ----- compute ---------------------------------------------- */
  function compute({ area, type, grade, location }) {
    const rate = RATES.build[type] && RATES.build[type][grade];
    const loc  = RATES.location[location];
    const speed = RATES.timeline[type] && RATES.timeline[type][grade];
    if (!rate || !loc || !speed) return null;

    const lowCost  = rate.low  * loc.mult * area;
    const highCost = rate.high * loc.mult * area;
    const lowMon   = Math.max(2, Math.round((area / 1000) * speed * 0.8));
    const highMon  = Math.max(3, Math.round((area / 1000) * speed * 1.2));

    return {
      area, type, grade, location,
      lowCost, highCost,
      lowPerSqft: Math.round(rate.low * loc.mult),
      highPerSqft: Math.round(rate.high * loc.mult),
      lowMonths: lowMon,
      highMonths: highMon
    };
  }

  /* ----- render ----------------------------------------------- */
  function render(root) {
    const area     = parseInt(root.querySelector('[data-estimator=area]').value, 10) || 0;
    const type     = root.querySelector('[data-estimator=type]').value;
    const grade    = root.querySelector('[data-estimator=grade]').value;
    const location = root.querySelector('[data-estimator=location]').value;

    const out = root.querySelector('[data-estimator=output]');
    if (!area || area < 100) {
      out.innerHTML = '<div class="est-out__empty">Enter your built-up area to see an indicative range.</div>';
      return;
    }

    const r = compute({ area: clamp(area, 100, 200000), type, grade, location });
    if (!r) {
      out.innerHTML = '<div class="est-out__empty">Pick all four options to see a result.</div>';
      return;
    }

    out.innerHTML =
      '<div class="est-out__total">' +
        '<div class="est-out__lbl">Indicative construction cost</div>' +
        '<div class="est-out__val">' + fmtRange(r.lowCost, r.highCost) + '</div>' +
      '</div>' +
      '<div class="est-out__row">' +
        '<div><span class="est-out__lbl">Per built-up sq ft</span><span class="est-out__sub">₹' + r.lowPerSqft + ' — ₹' + r.highPerSqft + '</span></div>' +
        '<div><span class="est-out__lbl">Built timeline</span><span class="est-out__sub">' + r.lowMonths + ' — ' + r.highMonths + ' months</span></div>' +
        '<div><span class="est-out__lbl">Area</span><span class="est-out__sub">' + r.area.toLocaleString("en-IN") + ' sq ft</span></div>' +
      '</div>' +
      '<div class="est-out__lists">' +
        '<div><span class="est-out__lbl">Includes</span><ul>' +
          RATES.includes.map(i => '<li>' + i + '</li>').join('') +
        '</ul></div>' +
        '<div><span class="est-out__lbl">Does not include</span><ul>' +
          RATES.excludes.map(i => '<li>' + i + '</li>').join('') +
        '</ul></div>' +
      '</div>' +
      '<p class="est-out__disclaimer">' + RATES.disclaimer + '</p>';
  }

  /* ----- area slider ↔ number input sync ---------------------- */
  function bindSlider(root) {
    const slider = root.querySelector('[data-estimator=area-slider]');
    const number = root.querySelector('[data-estimator=area]');
    if (!slider || !number) return;
    slider.addEventListener('input', () => { number.value = slider.value; render(root); });
    number.addEventListener('input', () => {
      const v = parseInt(number.value, 10) || 0;
      slider.value = clamp(v, slider.min, slider.max);
      render(root);
    });
  }

  /* ----- init ------------------------------------------------- */
  function init() {
    document.querySelectorAll('[data-estimator-root]').forEach((root) => {
      bindSlider(root);
      root.querySelectorAll('select, input').forEach((el) => {
        el.addEventListener('input', () => render(root));
        el.addEventListener('change', () => render(root));
      });
      render(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
