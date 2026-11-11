// js/modules/sdg.js — SDG impact matrix tooltips + full report modal.

import { sdgImpactData, sdgColorMap } from '../data/sdg.js';

let sdgTooltipTimeout = null;
let sdgPinnedKey = null;

/* ── Tooltip HTML builder ─────────────────────────────────── */
function buildSdgTooltip(key, isPinned = false) {
    const d = sdgImpactData[key];
    if (!d) return '';
    const c = d.theme;
    const getColor = (n) => sdgColorMap[n] || sdgColorMap.emerald;

    const metricsHtml = d.metrics.map(m => {
        const col = getColor(m.color);
        return `<div style="background: rgba(2,6,23,0.6); border: 1px solid ${col.border}; border-radius: 10px; padding: 8px;"><p style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;">${m.label}</p><p style="font-size: 16px; font-weight: 900; color: #ffffff; margin-top: 2px; line-height: 1.1;">${m.value}</p><p style="font-size: 9px; font-family: 'JetBrains Mono', monospace; color: ${col.text}; margin-top: 2px;">${m.trend}</p></div>`;
    }).join('');

    const subTargetsHtml = d.subTargets.map(s => `<div style="margin-bottom: 6px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;"><span style="font-size: 10px; color: #cbd5e1; line-height: 1.2;">${s.name}</span><span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${c.hex}; margin-left: 6px;">${s.progress}%</span></div><div style="width: 100%; height: 5px; background: rgba(30,41,59,1); border-radius: 9999px; overflow: hidden;"><div style="width: ${s.progress}%; height: 100%; background: ${c.hex}; border-radius: 9999px; transition: width 0.4s;"></div></div></div>`).join('');

    const programsHtml = d.programs.map(p => `<div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 8px; background: rgba(2,6,23,0.6); border: 1px solid rgba(51,65,85,0.5); border-radius: 8px; margin-bottom: 4px;"><div style="display: flex; align-items: center; gap: 6px; min-width: 0;"><span style="width: 5px; height: 5px; border-radius: 9999px; background: ${p.status === 'Active' ? '#34d399' : '#64748b'}; flex-shrink: 0;"></span><span style="font-size: 10px; color: #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</span></div><span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #94a3b8; flex-shrink: 0; margin-left: 6px;">${p.pax} pax</span></div>`).join('');

    const headerRightHtml = isPinned
        ? `<div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;"><span style="font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; background: rgba(${c.rgb},0.15); color: ${c.hex}; border: 1px solid rgba(${c.rgb},0.35);">✓ VERIFIED</span><button type="button" onclick="event.stopPropagation(); unpinSdg();" title="Close (or press Esc)" style="width: 20px; height: 20px; border-radius: 9999px; background: rgba(244,63,94,0.2); border: 1px solid rgba(244,63,94,0.4); color: #fb7185; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; line-height: 1;">✕</button></div>`
        : `<span style="font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; background: rgba(${c.rgb},0.15); color: ${c.hex}; border: 1px solid rgba(${c.rgb},0.35); flex-shrink: 0;">✓ VERIFIED</span>`;

    const reportFooterHtml = isPinned
        ? `<button type="button" onclick="event.stopPropagation(); openSdgReportModal('${key}');" style="font-size: 10px; font-weight: 700; color: ${c.hex}; background: rgba(${c.rgb},0.15); border: 1px solid rgba(${c.rgb},0.4); border-radius: 6px; padding: 3px 8px; cursor: pointer; font-family: inherit; transition: background 0.15s;" onmouseover="this.style.background='rgba(${c.rgb},0.3)';" onmouseout="this.style.background='rgba(${c.rgb},0.15)';">Full SDG Report →</button>`
        : `<span style="font-size: 10px; font-weight: 700; color: ${c.hex};">Full SDG Report →</span>`;

    const pinnedHintHtml = isPinned ? `<div style="font-size: 8px; font-family: 'JetBrains Mono', monospace; color: #64748b; text-align: center; padding-top: 6px;">📌 Pinned · Click outside or press Esc to close</div>` : '';

    return `
        <div style="padding: 14px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 10px; border-bottom: 1px solid rgba(51,65,85,0.5);">
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <span style="font-size: 22px; flex-shrink: 0;">${d.icon}</span>
                    <div style="min-width: 0;"><p style="font-size: 13px; font-weight: 800; color: #ffffff; line-height: 1.2;">${d.title}</p><p style="font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${c.hex}; margin-top: 2px;">${d.number} • ACTIVE GOAL</p></div>
                </div>
                ${headerRightHtml}
            </div>
            <p style="font-size: 10px; color: #94a3b8; line-height: 1.5; margin: 8px 0 10px 0;">${d.description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 10px;">${metricsHtml}</div>
            <div style="margin-bottom: 10px;"><p style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${c.hex}; margin-bottom: 6px;">Sub-target Progress</p>${subTargetsHtml}</div>
            <div><p style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 6px;">Contributing Programs</p>${programsHtml}</div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(51,65,85,0.5); display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                <span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #64748b;">Ledger-verified • SHA-256</span>
                ${reportFooterHtml}
            </div>
            ${pinnedHintHtml}
        </div>`;
}

/* ── Tooltip positioning ─────────────────────────────────── */
function positionSdgTooltip(tooltip, event) {
    const rect = (event.currentTarget || event.target || document.activeElement).getBoundingClientRect();
    const tw = 360;
    const th = tooltip.offsetHeight || 460;
    let left = rect.left - tw - 12;
    let top  = rect.top;
    if (left < 12) left = rect.right + 12;
    if (left + tw > window.innerWidth  - 12) left = window.innerWidth - tw - 12;
    if (top + th > window.innerHeight - 12) top  = window.innerHeight - th - 12;
    if (top < 12) top = 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
}

/* ── Hover / Leave / Click / Pin ──────────────────────────── */
export function handleSdgHover(event, key) {
    if (sdgPinnedKey) return;
    const tooltip = document.getElementById('sdg-impact-tooltip');
    const d = sdgImpactData[key];
    if (!tooltip || !d) return;
    if (sdgTooltipTimeout) { clearTimeout(sdgTooltipTimeout); sdgTooltipTimeout = null; }
    tooltip.innerHTML = buildSdgTooltip(key, false);
    tooltip.style.borderColor = `rgba(${d.theme.rgb}, 0.45)`;
    tooltip.style.boxShadow = `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(${d.theme.rgb},0.18), 0 0 40px rgba(${d.theme.rgb},0.15)`;
    tooltip.classList.add('pointer-events-none');
    positionSdgTooltip(tooltip, event);
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
}

export function handleSdgLeave() {
    if (sdgPinnedKey) return;
    if (sdgTooltipTimeout) clearTimeout(sdgTooltipTimeout);
    sdgTooltipTimeout = setTimeout(() => {
        if (sdgPinnedKey) return;
        const tooltip = document.getElementById('sdg-impact-tooltip');
        if (!tooltip) return;
        tooltip.classList.add('opacity-0', 'pointer-events-none');
        tooltip.classList.remove('opacity-100');
    }, 100);
}

export function handleSdgClick(event, key) {
    event.stopPropagation();
    if (sdgPinnedKey === key) unpinSdg();
    else pinSdg(key, event);
}

export function pinSdg(key, event) {
    const tooltip = document.getElementById('sdg-impact-tooltip');
    const d = sdgImpactData[key];
    if (!tooltip || !d) return;
    if (sdgTooltipTimeout) { clearTimeout(sdgTooltipTimeout); sdgTooltipTimeout = null; }
    sdgPinnedKey = key;
    tooltip.innerHTML = buildSdgTooltip(key, true);
    tooltip.style.borderColor = `rgba(${d.theme.rgb}, 0.55)`;
    tooltip.style.boxShadow = `0 20px 60px rgba(0,0,0,0.8), 0 0 0 2px rgba(${d.theme.rgb},0.3), 0 0 40px rgba(${d.theme.rgb},0.2)`;
    tooltip.classList.remove('pointer-events-none');
    positionSdgTooltip(tooltip, event);
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    document.querySelectorAll('[data-sdg]').forEach(card => {
        if (card.dataset.sdg === key) {
            card.style.boxShadow = `0 0 0 2px rgba(${d.theme.rgb}, 0.7), 0 8px 24px rgba(0,0,0,0.5)`;
            card.style.transform = 'translateY(-2px)';
        } else {
            card.style.boxShadow = '';
            card.style.transform = '';
        }
    });
}

export function unpinSdg() {
    sdgPinnedKey = null;
    if (sdgTooltipTimeout) { clearTimeout(sdgTooltipTimeout); sdgTooltipTimeout = null; }
    const tooltip = document.getElementById('sdg-impact-tooltip');
    if (tooltip) { tooltip.classList.add('opacity-0', 'pointer-events-none'); tooltip.classList.remove('opacity-100'); }
    document.querySelectorAll('[data-sdg]').forEach(card => { card.style.boxShadow = ''; card.style.transform = ''; });
}

/* ── Full SDG Report Modal ────────────────────────────────── */
export function openSdgReportModal(key) {
    const d = sdgImpactData[key];
    if (!d) return;
    const c = d.theme;
    const content = document.getElementById('sdg-report-content');
    if (!content) return;

    content.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-800 pb-4 pr-8">
            <div class="flex items-center space-x-3">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style="background: rgba(${c.rgb},0.15); border: 1px solid rgba(${c.rgb},0.35);">${d.icon}</div>
                <div><h3 class="text-xl font-bold text-white">${d.title}</h3><p class="text-xs font-mono font-bold" style="color: ${c.hex};">${d.number} • Full Impact Report</p></div>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full" style="background: rgba(${c.rgb},0.15); color: ${c.hex}; border: 1px solid rgba(${c.rgb},0.35);">✓ VERIFIED</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed">${d.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">${d.metrics.map(m => { const col = sdgColorMap[m.color] || sdgColorMap.emerald; return `<div class="bg-slate-950 border rounded-xl p-3" style="border-color: ${col.border};"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${m.label}</p><p class="text-2xl font-black text-white mt-1">${m.value}</p><p class="text-[10px] font-mono mt-1" style="color: ${col.text};">${m.trend}</p></div>`; }).join('')}</div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4"><p class="text-xs font-extrabold uppercase tracking-wider mb-3" style="color: ${c.hex};">Sub-Target Progress</p><div class="space-y-3">${d.subTargets.map(s => `<div><div class="flex justify-between items-center mb-1.5"><span class="text-xs text-slate-300">${s.name}</span><span class="text-xs font-mono font-bold" style="color: ${c.hex};">${s.progress}%</span></div><div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width: ${s.progress}%; background: ${c.hex};"></div></div></div>`).join('')}</div></div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4"><p class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Contributing Programs</p><div class="space-y-2">${d.programs.map(p => `<div class="flex justify-between items-center p-2.5 bg-slate-900 rounded-lg border border-slate-800"><div class="flex items-center space-x-2 min-w-0"><span class="w-2 h-2 rounded-full flex-shrink-0" style="background: ${p.status === 'Active' ? '#34d399' : '#64748b'};"></span><span class="text-xs text-slate-200 truncate">${p.name}</span></div><div class="flex items-center space-x-2 flex-shrink-0 ml-2"><span class="text-[10px] font-mono text-slate-400">${p.pax} pax</span><span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${p.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">${p.status}</span></div></div>`).join('')}</div></div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-400 flex items-center justify-between flex-wrap gap-2"><span>Ledger-verified • SHA-256 • 0x89F...34A2</span><span>Last audit: 2026-10-15</span></div>
        <div class="flex justify-end pt-2 border-t border-slate-800"><button onclick="closeSdgReportModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">Close Report</button></div>
    `;
    document.getElementById('modal-sdg-report').classList.remove('hidden');
    if (sdgPinnedKey) unpinSdg();
}

export function closeSdgReportModal() {
    document.getElementById('modal-sdg-report').classList.add('hidden');
}

/* ── Document-level listeners ─────────────────────────────── */
export function initSdgListeners() {
    document.addEventListener('click', (e) => {
        if (!sdgPinnedKey) return;
        const tooltip = document.getElementById('sdg-impact-tooltip');
        if (tooltip && tooltip.contains(e.target)) return;
        if (e.target.closest('[data-sdg]')) return;
        if (e.target.closest('#modal-sdg-report')) return;
        unpinSdg();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const reportModal = document.getElementById('modal-sdg-report');
            if (reportModal && !reportModal.classList.contains('hidden')) closeSdgReportModal();
            else if (sdgPinnedKey) unpinSdg();
        }
    });

    document.addEventListener('scroll', () => {
        const t = document.getElementById('sdg-impact-tooltip');
        if (t && !t.classList.contains('opacity-0')) {
            if (sdgPinnedKey) unpinSdg();
            else handleSdgLeave();
        }
    }, true);
}
