// js/modules/collapsible.js — collapsible section headers.

export function toggleCollapsible(btn) {
    const panel   = btn.closest('.collapsible-panel');
    if (!panel) return;
    const body    = panel.querySelector(':scope > .collapsible-body');
    const inner   = panel.querySelector(':scope > .collapsible-body > .collapsible-inner');
    const chevron = btn.querySelector('.collapsible-chevron');
    if (!body) return;

    const next = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(next));
    body.style.gridTemplateRows = next ? '1fr' : '0fr';
    if (chevron) chevron.style.transform = next ? 'rotate(180deg)' : 'rotate(0deg)';

    if (inner) {
        if (next) {
            inner.removeAttribute('inert');
            setTimeout(() => {
                inner.querySelectorAll('canvas').forEach(cv => {
                    const chart = Chart.getChart(cv);
                    if (chart) chart.resize();
                });
            }, 340);
        } else {
            inner.setAttribute('inert', '');
        }
    }
}

/**
 * Register the delegated click handler. Call once at app startup (Phase 9).
 * Kept separate so importing this module has no side effects during Phase 8.
 */
export function initCollapsibleListeners() {
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.collapsible-header');
        if (btn) toggleCollapsible(btn);
    });
}
