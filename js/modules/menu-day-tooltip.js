// js/modules/menu-day-tooltip.js — legacy helper only.
// The SEJAHTERA Mon–Fri cards were removed from the dashboard.
// menu-rmt.js still imports `getMenuDayStatus` for RMT tooltip colours.

export function getMenuDayStatus(pct) {
    if (pct >= 100) return { color: '#34d399', barColor: 'rgba(16,185,129,0.85)' };
    if (pct >= 50)  return { color: '#818cf8', barColor: 'rgba(99,102,241,0.85)' };
    if (pct >= 25)  return { color: '#fbbf24', barColor: 'rgba(245,158,11,0.85)' };
    return              { color: '#fb7185', barColor: 'rgba(244,63,94,0.85)' };
}

// Stubs — main.js imports these by name, so they must exist.
// They're intentionally no-ops now.
export function initMenuDayCards()     {}
export function initMenuDayListeners() {}
export function pinMenuDay()           {}
export function unpinMenuDay()         {}
