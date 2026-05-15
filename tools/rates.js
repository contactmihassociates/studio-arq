/* =============================================================
   studio arq — rates.js
   ONE place to edit every number the estimator uses.
   All rates in INR per built-up sq ft, except where noted.
   Indicative Chennai-area construction costs as of 2026.
   ============================================================= */

window.ARQ_RATES = {

  /* ----- Built construction rates (₹/sq ft, built-up area) ----- */
  build: {
    residential: {       // private villas, single-family residences
      standard: { low: 1800, high: 2200 },
      premium:  { low: 2500, high: 3200 },
      luxury:   { low: 3500, high: 5000 }
    },
    apartments: {        // mid-rise residential apartment blocks
      standard: { low: 2000, high: 2400 },
      premium:  { low: 2600, high: 3400 },
      luxury:   { low: 3600, high: 4800 }
    },
    commercial: {        // offices, retail, mixed-use
      standard: { low: 1800, high: 2400 },
      premium:  { low: 2500, high: 3500 },
      luxury:   { low: 3800, high: 5200 }
    },
    hospitality: {       // restaurants, cafes, hotels
      standard: { low: 3000, high: 4000 },
      premium:  { low: 4200, high: 5500 },
      luxury:   { low: 6000, high: 8500 }
    },
    healthcare: {        // clinics, specialty hospitals
      standard: { low: 2800, high: 3600 },
      premium:  { low: 3800, high: 5000 },
      luxury:   { low: 5500, high: 7500 }
    },
    interior: {          // interior fit-out only, no civil
      standard: { low: 1200, high: 1800 },
      premium:  { low: 2000, high: 3200 },
      luxury:   { low: 3800, high: 6000 }
    }
  },

  /* ----- Location multipliers ----- */
  location: {
    chennai:   { mult: 1.00, label: "Chennai" },
    tn:        { mult: 0.88, label: "Other Tamil Nadu" },
    outside:   { mult: 1.10, label: "Outside Tamil Nadu" }
  },

  /* ----- Timeline (months per 1000 sq ft) ----- */
  /* Used as: months = (area / 1000) * speed.<grade> */
  timeline: {
    residential:  { standard: 1.4, premium: 1.7, luxury: 2.1 },
    apartments:   { standard: 1.1, premium: 1.4, luxury: 1.8 },
    commercial:   { standard: 1.0, premium: 1.3, luxury: 1.6 },
    hospitality:  { standard: 0.9, premium: 1.2, luxury: 1.5 },
    healthcare:   { standard: 1.1, premium: 1.4, luxury: 1.8 },
    interior:     { standard: 0.4, premium: 0.6, luxury: 0.9 }
  },

  /* ----- What's included / excluded copy ----- */
  includes: [
    "Civil + structural work",
    "Plumbing & electrical",
    "Finishing (paint, tile, basic fittings)",
    "Project supervision"
  ],
  excludes: [
    "Land cost",
    "Architectural design fee (3 – 8% of construction value)",
    "Loose furniture, lighting & soft furnishings",
    "Statutory approvals, taxes & duties"
  ],

  /* ----- Disclaimer always shown under the output ----- */
  disclaimer: "Indicative range based on Chennai market rates (2026). A studio arq site visit + brief gives you a precise quote within 7 days."
};
