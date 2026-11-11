// js/modules/menu-rmt.js — RMT 20-menu library, tooltip, filter, comparison.

import { RNI_REFERENCE } from '../../config.js';
import { getMenuDayStatus } from './menu-day-tooltip.js';

/* ── Module state ─────────────────────────────────────────── */
let rmtMenus       = [];
let rmtAverages    = {};
let currentRmtFilter = '';
let rmtPinnedMenuId  = null;
let rmtHideTimeout   = null;

/* ── Load + init ──────────────────────────────────────────── */
export async function initRmtMenus() {
    try {
        const mod = await import('../../data/rmt-menus.js');
        rmtMenus    = mod.rmtMenus;
        rmtAverages = mod.rmtAverages;
        renderRmtMenuGrid();
        renderRmtComparison();
    } catch (err) {
        console.error('Failed to load RMT menus:', err);
        const grid = document.getElementById('rmt-menu-grid');
        if (grid) grid.innerHTML = `<div class="col-span-full text-center text-rose-400 text-[10px] italic py-2">⚠️ Failed to load RMT menus. Check console.</div>`;
    }
}

/* ── Filter ───────────────────────────────────────────────── */
export function filterRmtMenus() {
    const el = document.getElementById('rmt-menu-search');
    currentRmtFilter = el ? el.value : '';
    renderRmtMenuGrid();
}

/* ── Grid render ──────────────────────────────────────────── */
export function renderRmtMenuGrid() {
    const grid = document.getElementById('rmt-menu-grid');
    if (!grid) return;
    const q = currentRmtFilter.toLowerCase().trim();
    const filtered = !q ? rmtMenus : rmtMenus.filter(m => m.name.toLowerCase().includes(q));

    if (!filtered.length) {
        grid.innerHTML = `<div class="col-span-full text-center text-slate-500 text-[10px] italic py-3">No menus match "${q.replace(/</g,'&lt;')}". <button onclick="document.getElementById('rmt-menu-search').value=''; filterRmtMenus();" class="text-emerald-400 underline font-semibold ml-1">Clear search</button></div>`;
        return;
    }

    grid.innerHTML = filtered.map(m => {
        const kcal = m.nutrients['Energy'];
        const entries = Object.entries(m.nutrients).map(([k, v]) => ({ k, v, pct: (v / RNI_REFERENCE[k].ref) * 100 }));
        const critical = entries.filter(e => e.pct < 25).length;
        const warning  = entries.filter(e => e.pct >= 25 && e.pct < 50).length;
        const adequate = entries.filter(e => e.pct >= 50).length;
        return `
            <div class="rmt-menu-card bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-1 cursor-pointer hover:border-indigo-500/50 transition"
                 data-rmt-id="${m.id}"
                 onmouseenter="showRmtTooltip(event, ${m.id})"
                 onmouseleave="hideRmtTooltip()"
                 onclick="pinRmtTooltip(event, ${m.id})">
                <div class="flex justify-between items-start">
                    <span class="text-[9px] font-mono text-slate-500">#${String(m.id).padStart(2,'0')}</span>
                    <span class="text-[9px] font-mono text-emerald-400 font-bold">${kcal} kcal</span>
                </div>
                <p class="text-[10px] font-bold text-white leading-tight min-h-[24px]" title="${m.name.replace(/"/g,'&quot;')}">${m.name}</p>
                ${m.note ? `<p class="text-[8px] font-mono text-amber-400/70 leading-tight">${m.note}</p>` : ''}
                <div class="flex items-center gap-1.5 text-[8px] font-mono">
                    <span class="text-rose-400">🔴${critical}</span>
                    <span class="text-amber-400">🟡${warning}</span>
                    <span class="text-emerald-400">🟢${adequate}</span>
                </div>
            </div>`;
    }).join('');
}

/* ── Tooltip builder ──────────────────────────────────────── */
export function buildRmtTooltip(menuId, isPinned) {
    const m = rmtMenus.find(x => x.id === menuId);
    if (!m) return '';
    const icons = { 'Energy':'⚡','Carbohydrates':'🍚','Protein':'🥩','Fiber':'🥦','Sugar':'🍬','Sodium':'🧂','Calcium':'🥛','Iron':'🩸','Potassium':'🍌','Vitamin A':'🥕','Vitamin C':'🍊' };
    const units = { 'Energy':'kcal','Carbohydrates':'g','Protein':'g','Fiber':'g','Sugar':'g','Sodium':'mg','Calcium':'mg','Iron':'mg','Potassium':'mg','Vitamin A':'µg','Vitamin C':'mg' };

    const rows = Object.entries(m.nutrients).map(([k, v]) => {
        const pct = (v / RNI_REFERENCE[k].ref) * 100;
        const st  = getMenuDayStatus(pct);
        return `<div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(2,6,23,0.6);border:1px solid rgba(51,65,85,0.5);border-radius:8px;">
            <span style="font-size:12px;flex-shrink:0;">${icons[k] || '•'}</span>
            <span style="font-size:10px;color:#cbd5e1;font-weight:600;min-width:78px;">${k}</span>
            <span style="font-size:11px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#ffffff;min-width:62px;text-align:right;">${v} ${units[k]}</span>
            <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:${st.color};min-width:40px;text-align:right;">${pct.toFixed(0)}%</span>
            <div style="width:44px;height:4px;background:rgba(30,41,59,1);border-radius:9999px;overflow:hidden;flex-shrink:0;"><div style="width:${Math.min(100,pct)}%;height:100%;background:${st.barColor};border-radius:9999px;"></div></div>
        </div>`;
    }).join('');

    const closeBtn = isPinned
        ? `<button type="button" onclick="event.stopPropagation(); unpinRmtTooltip();" title="Close (or press Esc)" style="width:22px;height:22px;border-radius:9999px;background:rgba(244,63,94,0.2);border:1px solid rgba(244,63,94,0.4);color:#fb7185;font-size:10px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;flex-shrink:0;">✕</button>`
        : '';

    const footer = isPinned
        ? `<div style="font-size:8px;font-family:'JetBrains Mono',monospace;color:#64748b;text-align:center;padding-top:6px;border-top:1px solid rgba(51,65,85,0.5);margin-top:8px;">📌 Pinned · Click ✕ or press Esc to close</div>`
        : `<div style="font-size:8px;font-family:'JetBrains Mono',monospace;color:#64748b;text-align:center;padding-top:6px;border-top:1px solid rgba(51,65,85,0.5);margin-top:8px;">Click to pin · Esc to close</div>`;

    return `<div style="padding:14px;min-width:340px;max-width:380px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(51,65,85,0.5);">
            <div style="min-width:0;">
                <p style="font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#818cf8;margin-bottom:3px;letter-spacing:0.5px;">RMT MENU #${String(m.id).padStart(2,'0')} · MoE STANDARD</p>
                <p style="font-size:14px;font-weight:800;color:#ffffff;line-height:1.2;">${m.name}</p>
                ${m.note ? `<p style="font-size:9px;color:#fbbf24;margin-top:3px;font-family:'JetBrains Mono',monospace;">${m.note}</p>` : ''}
            </div>
            ${closeBtn}
        </div>
        <div style="margin-top:10px;">
            <p style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#818cf8;margin-bottom:6px;">11-Nutrient Breakdown (per serving)</p>
            <div style="display:grid;grid-template-columns:1fr;gap:4px;">${rows}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px solid rgba(51,65,85,0.5);font-size:9px;font-family:'JetBrains Mono',monospace;color:#64748b;">
            <span>% of RNI · 7–12 yrs</span>
            <span>MoE Lampiran B</span>
        </div>
        ${footer}
    </div>`;
}

/* ── Positioning ──────────────────────────────────────────── */
function positionRmtTooltip(tooltip, cardEl) {
    const rect = cardEl.getBoundingClientRect();
    const tw = 380, th = tooltip.offsetHeight || 480;
    let left = rect.right + 12, top = rect.top;
    if (left + tw > window.innerWidth - 12) left = rect.left - tw - 12;
    if (left < 12) left = 12;
    if (top + th > window.innerHeight - 12) top = window.innerHeight - th - 12;
    if (top < 12) top = 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
}

/* ── Show / Hide / Pin / Unpin ────────────────────────────── */
export function showRmtTooltip(event, menuId) {
    if (rmtPinnedMenuId !== null) return;
    const tooltip = document.getElementById('menu-day-tooltip');
    if (!tooltip) return;
    if (rmtHideTimeout) { clearTimeout(rmtHideTimeout); rmtHideTimeout = null; }
    tooltip.innerHTML = buildRmtTooltip(menuId, false);
    tooltip.classList.add('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    requestAnimationFrame(() => positionRmtTooltip(tooltip, event.currentTarget));
}

export function hideRmtTooltip() {
    if (rmtPinnedMenuId !== null) return;
    if (rmtHideTimeout) clearTimeout(rmtHideTimeout);
    rmtHideTimeout = setTimeout(() => {
        if (rmtPinnedMenuId !== null) return;
        const tooltip = document.getElementById('menu-day-tooltip');
        if (!tooltip) return;
        tooltip.classList.add('opacity-0');
        tooltip.classList.remove('opacity-100');
    }, 80);
}

export function pinRmtTooltip(event, menuId) {
    event.stopPropagation();
    if (rmtPinnedMenuId === menuId) { unpinRmtTooltip(); return; }
    const tooltip = document.getElementById('menu-day-tooltip');
    if (!tooltip) return;
    if (rmtHideTimeout) { clearTimeout(rmtHideTimeout); rmtHideTimeout = null; }
    rmtPinnedMenuId = menuId;
    tooltip.innerHTML = buildRmtTooltip(menuId, true);
    tooltip.classList.remove('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    document.querySelectorAll('.rmt-menu-card').forEach(c => c.classList.remove('pinned'));
    if (event.currentTarget) event.currentTarget.classList.add('pinned');
    requestAnimationFrame(() => positionRmtTooltip(tooltip, event.currentTarget));
}

export function unpinRmtTooltip() {
    rmtPinnedMenuId = null;
    if (rmtHideTimeout) { clearTimeout(rmtHideTimeout); rmtHideTimeout = null; }
    const tooltip = document.getElementById('menu-day-tooltip');
    if (tooltip) {
        tooltip.classList.add('pointer-events-none', 'opacity-0');
        tooltip.classList.remove('opacity-100');
    }
    document.querySelectorAll('.rmt-menu-card').forEach(c => c.classList.remove('pinned'));
}

/* ── Comparison table ─────────────────────────────────────── */
export function renderRmtComparison() {
    const container = document.getElementById('rmt-comparison-table');
    if (!container) return;
    const cohortPct = {
        'Energy': 30.5, 'Carbohydrates': 27.9, 'Protein': 111.6, 'Fiber': 15.5, 'Sugar': 11.8,
        'Sodium': 39.7, 'Calcium': 15.9, 'Iron': 70.3, 'Potassium': 7.9, 'Vitamin A': 68.6, 'Vitamin C': 40.3
    };
    const icons = { 'Energy':'⚡','Carbohydrates':'🍚','Protein':'🥩','Fiber':'🥦','Sugar':'🍬','Sodium':'🧂','Calcium':'🥛','Iron':'🩸','Potassium':'🍌','Vitamin A':'🥕','Vitamin C':'🍊' };
    const lowerIsBetter = ['Sugar', 'Sodium'];

    const rows = Object.entries(rmtAverages).map(([k, v]) => {
        const rmtPct = (v / RNI_REFERENCE[k].ref) * 100;
        const cohPct = cohortPct[k] || 0;
        const delta  = rmtPct - cohPct;
        const rmtStatus = getMenuDayStatus(rmtPct);
        const cohStatus = getMenuDayStatus(cohPct);
        const rmtWins   = lowerIsBetter.includes(k) ? (rmtPct < cohPct) : (rmtPct > cohPct);
        const winBadge  = Math.abs(delta) < 1
            ? '<span class="text-slate-500 text-[9px] font-mono">≈ tie</span>'
            : (rmtWins
                ? '<span class="text-emerald-400 text-[9px] font-mono font-bold">▲ RMT</span>'
                : '<span class="text-rose-400 text-[9px] font-mono font-bold">▼ Cohort</span>');
        const deltaStr = (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' pp';
        return `<tr class="hover:bg-slate-800/40 transition">
            <td class="py-1.5 px-2 font-sans font-bold text-slate-200">${icons[k] || '•'} ${k}</td>
            <td class="py-1.5 px-2 text-center font-mono font-bold" style="color:${rmtStatus.color}">${rmtPct.toFixed(1)}%</td>
            <td class="py-1.5 px-2 text-center font-mono font-bold" style="color:${cohStatus.color}">${cohPct.toFixed(1)}%</td>
            <td class="py-1.5 px-2 text-center font-mono text-slate-400">${deltaStr}</td>
            <td class="py-1.5 px-2 text-center">${winBadge}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `<table class="w-full text-left text-[10px]">
        <thead class="text-[9px] font-extrabold uppercase text-slate-500 border-b border-slate-800">
            <tr>
                <th class="py-1.5 px-2">Nutrient</th>
                <th class="py-1.5 px-2 text-center">RMT Avg (20 menus)</th>
                <th class="py-1.5 px-2 text-center">Kemaih Cohort (N=220)</th>
                <th class="py-1.5 px-2 text-center">Delta</th>
                <th class="py-1.5 px-2 text-center">Leader</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 font-mono">${rows}</tbody>
    </table>`;
}

/* ── Document-level listeners ─────────────────────────────── */
export function initRmtListeners() {
    document.addEventListener('click', (e) => {
        if (rmtPinnedMenuId === null) return;
        const tooltip = document.getElementById('menu-day-tooltip');
        if (tooltip && tooltip.contains(e.target)) return;
        if (e.target.closest('.rmt-menu-card')) return;
        unpinRmtTooltip();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rmtPinnedMenuId !== null) unpinRmtTooltip();
    });
}
