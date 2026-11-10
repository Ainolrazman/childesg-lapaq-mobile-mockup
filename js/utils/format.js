// js/utils/format.js — string / label formatting helpers.

/**
 * Build chart labels that include each value's percentage of the total.
 * e.g. ['Selangor', 'K. Lumpur'] + [12, 8] → ['Selangor (60.0%)', 'K. Lumpur (40.0%)']
 */
export function withPercentLabels(baseLabels, values) {
    const total = values.reduce((a, b) => a + b, 0);
    return baseLabels.map((label, i) => {
        const pct = total ? ((values[i] / total) * 100).toFixed(1) : '0.0';
        return `${label} (${pct}%)`;
    });
}

/**
 * Convert a nutrient name to a DOM-id-safe string.
 * e.g. 'Vitamin A' → 'Vitamin-A'
 */
export const slug = (k) => k.replace(/\s+/g, '-');

/**
 * Escape untrusted text before interpolating into innerHTML.
 * Works on null/undefined by returning ''.
 */
export const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));
