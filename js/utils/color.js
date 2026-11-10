// js/utils/color.js — colour manipulation helpers.

/**
 * Convert "#rrggbb" to "rgba(r,g,b,alpha)".
 * Returns the input unchanged if already rgba/rgb or malformed.
 */
export function hexToRgba(hex, alpha) {
    if (!hex) return hex;
    if (typeof hex === 'string' && (hex.startsWith('rgba') || hex.startsWith('rgb'))) return hex;
    if (typeof hex !== 'string' || hex.length < 7) return hex;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Dim an rgba() colour by swapping 0.85 → 0.22.
 * Used by the pie/bar charts when one state is focused and the others fade out.
 */
export function dimColor(c, shouldDim) {
    return shouldDim ? c.replace('0.85', '0.22') : c;
}
