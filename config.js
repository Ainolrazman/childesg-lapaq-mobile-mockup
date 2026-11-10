// config.js — application constants. No DOM, no imports, no side effects.

// ── Malaysian cohort reference rates (Selangor, N=220) ────────────
export const SELANGOR_STUNTING_RATE = 0.133;
export const SELANGOR_OBESITY_RATE  = 0.210;

// ── Case totals for WHO classification ────────────────────────────
export const TOTAL_OBESITY_CASES  = 36;
export const TOTAL_STUNTING_CASES = 38;

// ── Food-waste cost accounting ────────────────────────────────────
export const WASTE_COST_PER_KG = 8.50;

export function getWasteCost(kg) {
    return (parseFloat(kg) || 0) * WASTE_COST_PER_KG;
}

// ── WHO / Malaysian RNI reference (per 7–12 yrs child) ────────────
export const RNI_REFERENCE = {
    'Energy':        { ref: 1600, unit: 'kcal' },
    'Carbohydrates': { ref: 250,  unit: 'g'    },
    'Protein':       { ref: 35,   unit: 'g'    },
    'Fiber':         { ref: 20,   unit: 'g'    },
    'Sugar':         { ref: 50,   unit: 'g'    },
    'Sodium':        { ref: 1500, unit: 'mg'   },
    'Calcium':       { ref: 1000, unit: 'mg'   },
    'Iron':          { ref: 10,   unit: 'mg'   },
    'Potassium':     { ref: 2000, unit: 'mg'   },
    'Vitamin A':     { ref: 500,  unit: 'µg'   },
    'Vitamin C':     { ref: 35,   unit: 'mg'   }
};

// ── Pie chart palette — obesity by state ──────────────────────────
export const pieStateKeys   = ['selangor', 'kl', 'perak', 'pahang'];
export const pieStateLabels = ['Selangor', 'K. Lumpur', 'Perak', 'Pahang'];
export const pieStateValues = [12, 8, 6, 10];
export const pieStateColors = [
    'rgba(16, 185, 129, 0.85)',
    'rgba(99, 102, 241, 0.85)',
    'rgba(245, 158, 11, 0.85)',
    'rgba(244, 63, 94, 0.85)'
];

// ── Pie chart palette — stunting by state ─────────────────────────
export const pieStuntingStateKeys   = ['kl', 'selangor', 'perak', 'pahang'];
export const pieStuntingStateLabels = ['K. Lumpur', 'Selangor', 'Perak', 'Pahang'];
export const pieStuntingStateValues = [8, 8, 6, 16];
export const pieStuntingStateColors = [
    'rgba(99, 102, 241, 0.85)',
    'rgba(16, 185, 129, 0.85)',
    'rgba(245, 158, 11, 0.85)',
    'rgba(244, 63, 94, 0.85)'
];

// ── Bar chart state ordering ──────────────────────────────────────
export const barStateKeys = ['kl', 'selangor', 'perak', 'pahang'];

// ── Gender split tables (used by selectGeoState) ──────────────────
export const obesityGenderByState = {
    all:      [24, 12],
    kl:       [6, 2],
    selangor: [8, 4],
    perak:    [4, 2],
    pahang:   [6, 4]
};

export const stuntingGenderByState = {
    all:      [13, 6],
    kl:       [3, 1],
    selangor: [3, 1],
    perak:    [2, 1],
    pahang:   [5, 3]
};
