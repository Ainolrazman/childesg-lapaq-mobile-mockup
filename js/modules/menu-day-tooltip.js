// js/modules/menu-day-tooltip.js
// Day-card nutrition tooltip (kept for future Mon-Fri menu grids).
// Also exports getMenuDayStatus() — used by the RMT comparison.

import { menuDayData } from '../../data/menu-days.js';

let menuDayPinnedCard  = null;
let menuDayHideTimeout = null;

/* ── Status color lookup (used by RMT too) ───────────────── */
export function getMenuDayStatus(pct) {
    if (pct >= 100) return { color: '#34d399', barColor: 'rgba(16,185,129,0.85)' };
    if (pct >= 50)  return { color: '#818cf8', barColor: 'rgba(99,102,241,0.85)' };
    if (pct >= 25)  return { color: '#fbbf24', barColor: 'rgba(245,158,11,0.85)' };
    return              { color: '#fb7185', barColor: 'rgba(244,63,94,0.85)' };
}

/* ── Tooltip HTML builder ─────────────────────────────────── */
function buildMenuDayTooltip(dayKey, isPinned) {
    const d = menuDayData[dayKey];
    if (!d) return '';
    const accentMap = { Monday: '#f59e0b', Tuesday: '#10b981', Wednesday: '#6366f1', Thursday: '#f43f5e', Friday: '#a855f7' };
    const accent = accentMap[dayKey] || '#6366f1';
    const icons = { 'Energy': '⚡', 'Carbohydrates': '🍚', 'Protein': '🥩', 'Fiber': '🥦', 'Sugar': '🍬', 'Sodium': '🧂', 'Calcium': '🥛', 'Iron': '🩸', 'Potassium': '🍌', 'Vitamin A': '🥕', 'Vitamin C': '🍊' };

    const rows = Object.entries(d.nutrients).map(([name, info]) => {
        const st = getMenuDayStatus(info.pct);
        const icon = icons[name] || '•';
        return `<div style="display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: rgba(2,6,23,0.6); border: 1px solid rgba(51,65,85,0.5); border-radius: 8px;">
            <span style="font-size: 12px; flex-shrink: 0;">${icon}</span>
            <span style="font-size: 10px; color: #cbd5e1; font-weight: 600; min-width: 78px;">${name}</span>
            <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #ffffff; min-width: 62px; text-align: right;">${info.value} ${info.unit}</span>
            <span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${st.color}; min-width: 40px; text-align: right;">${info.pct}%</span>
            <div style="width: 44px; height: 4px; background: rgba(30,41,59,1); border-radius: 9999px; overflow: hidden; flex-shrink: 0;"><div style="width: ${Math.min(100, info.pct)}%; height: 100%; background: ${st.barColor}; border-radius: 9999px;"></div></div>
        </div>`;
    }).join('');

    const closeBtn = isPinned
        ? `<button type="button" onclick="event.stopPropagation(); unpinMenuDay();" title="Close (or press Esc)" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(244,63,94,0.2); border: 1px solid rgba(244,63,94,0.4); color: #fb7185; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; line-height: 1; flex-shrink: 0;">✕</button>`
        : '';

    const footer = isPinned
        ? `<div style="font-size: 8px; font-family: 'JetBrains Mono', monospace; color: #64748b; text-align: center; padding-top: 6px; border-top: 1px solid rgba(51,65,85,0.5); margin-top: 8px;">📌 Pinned · Click ✕ or press Esc to close</div>`
        : `<div style="font-size: 8px; font-family: 'JetBrains Mono', monospace; color: #64748b; text-align: center; padding-top: 6px; border-top: 1px solid rgba(51,65,85,0.5); margin-top: 8px;">Click to pin · Esc to close</div>`;

    return `<div style="padding: 14px; min-width: 340px; max-width: 380px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; padding-bottom: 10px; border-bottom: 1px solid rgba(51,65,85,0.5);">
            <div style="min-width: 0;">
                <p style="font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${accent}; margin-bottom: 3px; letter-spacing: 0.5px;">SEJAHTERA CYCLE · ${d.tag.toUpperCase()}</p>
                <p style="font-size: 14px; font-weight: 800; color: #ffffff; line-height: 1.2;">${d.day}</p>
                <p style="font-size: 10px; color: #94a3b8; line-height: 1.35; margin-top: 4px;">${d.label}</p>
            </div>
            ${closeBtn}
        </div>
        <div style="margin-top: 10px;">
            <p style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${accent}; margin-bottom: 6px;">11-Nutrient Breakdown (per serving)</p>
            <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">${rows}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(51,65,85,0.5); font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #64748b;">
            <span>% of RNI · 7–12 yrs</span>
            <span>SHA-256 ledger</span>
        </div>
        ${footer}
    </div>`;
}

function positionMenuDayTooltip(tooltip, cardEl) {
    const rect = cardEl.getBoundingClientRect();
    const tw = 380;
    const th = tooltip.offsetHeight || 480;
    let left = rect.right + 12;
    let top = rect.top;
    if (left + tw > window.innerWidth - 12) left = rect.left - tw - 12;
    if (left < 12) left = 12;
    if (top + th > window.innerHeight - 12) top = window.innerHeight - th - 12;
    if (top < 12) top = 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
}

/* ── Show / Hide / Pin / Unpin ───────────────────────────── */
export function showMenuDayTooltip(dayKey, cardEl) {
    if (menuDayPinnedCard) return;
    const tooltip = document.getElementById('menu-day-tooltip');
    if (!tooltip || !menuDayData[dayKey]) return;
    if (menuDayHideTimeout) { clearTimeout(menuDayHideTimeout); menuDayHideTimeout = null; }
    tooltip.innerHTML = buildMenuDayTooltip(dayKey, false);
    tooltip.classList.add('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    requestAnimationFrame(() => positionMenuDayTooltip(tooltip, cardEl));
}

export function hideMenuDayTooltip() {
    if (menuDayPinnedCard) return;
    if (menuDayHideTimeout) clearTimeout(menuDayHideTimeout);
    menuDayHideTimeout = setTimeout(() => {
        if (menuDayPinnedCard) return;
        const tooltip = document.getElementById('menu-day-tooltip');
        if (!tooltip) return;
        tooltip.classList.add('opacity-0');
        tooltip.classList.remove('opacity-100');
    }, 80);
}

export function pinMenuDay(dayKey, cardEl) {
    const tooltip = document.getElementById('menu-day-tooltip');
    if (!tooltip || !menuDayData[dayKey]) return;
    if (menuDayHideTimeout) { clearTimeout(menuDayHideTimeout); menuDayHideTimeout = null; }
    menuDayPinnedCard = cardEl;
    tooltip.innerHTML = buildMenuDayTooltip(dayKey, true);
    tooltip.classList.remove('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    document.querySelectorAll('.menu-day-card').forEach(c => c.classList.remove('pinned'));
    cardEl.classList.add('pinned');
    requestAnimationFrame(() => positionMenuDayTooltip(tooltip, cardEl));
}

export function unpinMenuDay() {
    menuDayPinnedCard = null;
    if (menuDayHideTimeout) { clearTimeout(menuDayHideTimeout); menuDayHideTimeout = null; }
    const tooltip = document.getElementById('menu-day-tooltip');
    if (tooltip) {
        tooltip.classList.add('pointer-events-none', 'opacity-0');
        tooltip.classList.remove('opacity-100');
    }
    document.querySelectorAll('.menu-day-card').forEach(c => c.classList.remove('pinned'));
}

/* ── Attach cards (no-op today — no Mon-Fri cards exist) ── */
export function initMenuDayCards() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const spans = document.querySelectorAll('#modal-menu-analysis span.font-bold.text-white.block');
    dayNames.forEach(day => {
        const targetSpan = [...spans].find(s => s.textContent.trim() === day);
        if (!targetSpan) return;
        const card = targetSpan.parentElement;
        if (!card || !card.classList.contains('bg-slate-950') || card.classList.contains('menu-day-card')) return;
        card.classList.add('menu-day-card');
        card.setAttribute('data-menu-day', day);
        card.addEventListener('mouseenter', () => showMenuDayTooltip(day, card));
        card.addEventListener('mouseleave', () => hideMenuDayTooltip());
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuDayPinnedCard === card) unpinMenuDay();
            else pinMenuDay(day, card);
        });
    });
}

/* ── Document-level listeners ────────────────────────────── */
export function initMenuDayListeners() {
    document.addEventListener('click', (e) => {
        if (!menuDayPinnedCard) return;
        const tooltip = document.getElementById('menu-day-tooltip');
        if (tooltip && tooltip.contains(e.target)) return;
        if (menuDayPinnedCard.contains(e.target)) return;
        unpinMenuDay();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuDayPinnedCard) unpinMenuDay();
    });
}
