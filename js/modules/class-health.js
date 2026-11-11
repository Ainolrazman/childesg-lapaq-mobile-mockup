// js/modules/class-health.js — class attendance cards + health tooltip.

import { state } from '../state.js';
import { participantRoster } from '../data/roster.js';
import { courseIconMap } from '../data/programs.js';
import { SELANGOR_OBESITY_RATE, SELANGOR_STUNTING_RATE } from '../config.js';
import { shuffleArray } from '../utils/random.js';

let classHealthRows = [];
let classHealthAllocation = {};
let classHealthPinnedIndex = null;

function generateHealthAllocation() {
    const total    = participantRoster.length;
    const nObese   = Math.round(SELANGOR_OBESITY_RATE * total);
    const nStunted = Math.round(SELANGOR_STUNTING_RATE * total);

    const indices   = shuffleArray(participantRoster.map((_, i) => i));
    const obeseSet  = new Set(indices.slice(0, nObese));
    const stuntedSet = new Set(indices.slice(nObese, nObese + nStunted));

    const alloc = {};
    participantRoster.forEach((p, i) => {
        if (!alloc[p.course]) alloc[p.course] = { stunted: 0, obese: 0 };
        if (obeseSet.has(i))   alloc[p.course].obese++;
        if (stuntedSet.has(i)) alloc[p.course].stunted++;
    });
    return alloc;
}

export function renderClassAttendanceSummary() {
    const container = document.getElementById('class-attendance-grid');
    const countEl   = document.getElementById('class-summary-count');
    const totalEl   = document.getElementById('class-summary-total');
    if (!container) return;

    if (!Object.keys(classHealthAllocation).length) {
        classHealthAllocation = generateHealthAllocation();
    }

    const groups = {};
    participantRoster.forEach(p => {
        if (!groups[p.course]) groups[p.course] = { kids: [], verified: 0, tokensApproved: 0 };
        groups[p.course].kids.push(p);
        if (p.verified)       groups[p.course].verified++;
        if (p.tokensApproved) groups[p.course].tokensApproved++;
    });

    const entries = Object.entries(groups).map(([course, data]) => {
        const count    = data.kids.length;
        const avgAtt   = data.kids.reduce((sum, k) => sum + (parseInt(k.attendance, 10) || 0), 0) / (count || 1);
        const health   = classHealthAllocation[course] || { stunted: 0, obese: 0 };
        const healthy  = Math.max(0, count - health.stunted - health.obese);
        return {
            course, data, count, kids: count, avgAtt,
            stunted: health.stunted, obese: health.obese, healthy,
            verified: data.verified, tokensApproved: data.tokensApproved
        };
    }).sort((a, b) => b.count - a.count);

    classHealthRows = entries;

    const maxCount     = entries.length ? entries[0].count : 1;
    const totalKids    = entries.reduce((s, e) => s + e.count, 0);
    const totalStunted = entries.reduce((s, e) => s + e.stunted, 0);
    const totalObese   = entries.reduce((s, e) => s + e.obese, 0);

    if (countEl) countEl.innerText = entries.length;
    if (totalEl) totalEl.innerText = totalKids;
    const st  = document.getElementById('class-stunt-total');
    const stp = document.getElementById('class-stunt-pct');
    const ob  = document.getElementById('class-obese-total');
    const obp = document.getElementById('class-obese-pct');
    if (st)  st.innerText  = totalStunted;
    if (stp) stp.innerText = totalKids ? ((totalStunted / totalKids) * 100).toFixed(1) : '0.0';
    if (ob)  ob.innerText  = totalObese;
    if (obp) obp.innerText = totalKids ? ((totalObese / totalKids) * 100).toFixed(1) : '0.0';

    if (!entries.length) {
        container.innerHTML = `<div class="col-span-full bg-slate-950 border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs italic">No roster records yet.</div>`;
        return;
    }

    container.innerHTML = entries.map(({ course, count, avgAtt, stunted, obese, healthy, verified, tokensApproved }, idx) => {
        const icon     = courseIconMap[course] || "📚";
        const pctOfMax = Math.max(2, (count / maxCount) * 100);
        const avgColor = avgAtt >= 95 ? 'text-emerald-300' : avgAtt >= 90 ? 'text-indigo-300' : 'text-amber-300';
        const stPct    = count ? ((stunted / count) * 100).toFixed(0) : '0';
        const obPct    = count ? ((obese / count) * 100).toFixed(0) : '0';
        return `
            <div class="class-card bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2"
                 data-class-index="${idx}"
                 onmouseenter="handleClassCardEnter(event, ${idx})"
                 onmouseleave="handleClassCardLeave(event, ${idx})"
                 onclick="handleClassCardClick(event, ${idx})">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center space-x-2 min-w-0">
                        <span class="text-lg shrink-0">${icon}</span>
                        <p class="text-[11px] font-bold text-white leading-tight" title="${course}">${course}</p>
                    </div>
                </div>
                <div class="flex items-baseline space-x-2">
                    <span class="text-2xl font-black text-emerald-400">${count}</span>
                    <span class="text-[10px] font-mono text-slate-400">kids attended</span>
                </div>
                <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style="width: ${pctOfMax}%"></div>
                </div>
                <div class="grid grid-cols-3 gap-1 text-[9px] font-mono pt-1 border-t border-slate-800/60">
                    <div class="bg-amber-500/10 border border-amber-500/30 rounded px-1 py-0.5 text-center">
                        <div class="text-[8px] text-amber-400 uppercase font-bold">Stunt</div>
                        <div class="text-white font-bold">${stunted} <span class="text-amber-400">(${stPct}%)</span></div>
                    </div>
                    <div class="bg-rose-500/10 border border-rose-500/30 rounded px-1 py-0.5 text-center">
                        <div class="text-[8px] text-rose-400 uppercase font-bold">Obese</div>
                        <div class="text-white font-bold">${obese} <span class="text-rose-400">(${obPct}%)</span></div>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded px-1 py-0.5 text-center">
                        <div class="text-[8px] text-emerald-400 uppercase font-bold">Healthy</div>
                        <div class="text-white font-bold">${healthy}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                    <div class="text-slate-400">Avg: <strong class="${avgColor}">${avgAtt.toFixed(1)}%</strong></div>
                    <div class="text-slate-400 text-right">✓ <strong class="text-emerald-400">${verified}</strong> verified</div>
                    <div class="text-slate-400 col-span-2">🪙 <strong class="text-amber-400">${tokensApproved}</strong> tokens approved</div>
                </div>
            </div>
        `;
    }).join('');

    if (classHealthPinnedIndex !== null) {
        const card = container.querySelector(`.class-card[data-class-index="${classHealthPinnedIndex}"]`);
        if (card) {
            card.classList.add('pinned');
            const tooltip = document.getElementById('class-health-tooltip');
            if (tooltip && classHealthRows[classHealthPinnedIndex]) {
                tooltip.innerHTML = buildClassHealthTooltip(classHealthPinnedIndex, true);
                requestAnimationFrame(() => positionClassHealthTooltip(tooltip, card));
            }
        } else {
            unpinClassHealth();
        }
    }
}

export function regenerateClassHealth() {
    unpinClassHealth();
    classHealthAllocation = generateHealthAllocation();
    renderClassAttendanceSummary();
}

export function handleClassCardEnter(event, idx) {
    if (classHealthPinnedIndex !== null) return;
    showClassHealthTooltip(idx, event.currentTarget);
}

export function handleClassCardLeave(event, idx) {
    if (classHealthPinnedIndex !== null) return;
    hideClassHealthTooltip();
}

export function handleClassCardClick(event, idx) {
    event.stopPropagation();
    if (classHealthPinnedIndex === idx) unpinClassHealth();
    else                                 pinClassHealth(idx, event.currentTarget);
}

function buildClassHealthTooltip(idx, isPinned) {
    const r = classHealthRows[idx];
    if (!r) return '';
    const icon       = courseIconMap[r.course] || '📚';
    const stuntPct   = r.kids ? ((r.stunted / r.kids) * 100).toFixed(1) : '0.0';
    const obesePct   = r.kids ? ((r.obese / r.kids) * 100).toFixed(1) : '0.0';
    const healthyPct = r.kids ? ((r.healthy / r.kids) * 100).toFixed(1) : '0.0';
    const attColor   = r.avgAtt >= 95 ? '#34d399' : r.avgAtt >= 90 ? '#818cf8' : '#fbbf24';

    const closeBtn = isPinned
        ? `<button type="button" onclick="event.stopPropagation(); unpinClassHealth();" title="Close (or press Esc)" style="width:22px;height:22px;border-radius:9999px;background:rgba(244,63,94,0.2);border:1px solid rgba(244,63,94,0.4);color:#fb7185;font-size:10px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;flex-shrink:0;">✕</button>`
        : '';

    return `
    <div style="padding:14px;min-width:300px;max-width:340px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(51,65,85,0.5);">
            <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                <span style="font-size:20px;flex-shrink:0;">${icon}</span>
                <div style="min-width:0;">
                    <p style="font-size:12px;font-weight:800;color:#ffffff;line-height:1.25;">${r.course}</p>
                    <p style="font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#818cf8;margin-top:3px;letter-spacing:0.5px;">${r.kids} KIDS ENROLLED</p>
                </div>
            </div>
            ${closeBtn}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px;">
            <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.35);border-radius:10px;padding:8px;">
                <p style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#fbbf24;">Stunted</p>
                <p style="font-size:18px;font-weight:900;color:#ffffff;margin-top:2px;line-height:1.1;">${r.stunted}</p>
                <p style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#fbbf24;margin-top:2px;">${stuntPct}%</p>
            </div>
            <div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.35);border-radius:10px;padding:8px;">
                <p style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#fb7185;">Obese</p>
                <p style="font-size:18px;font-weight:900;color:#ffffff;margin-top:2px;line-height:1.1;">${r.obese}</p>
                <p style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#fb7185;margin-top:2px;">${obesePct}%</p>
            </div>
            <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:10px;padding:8px;">
                <p style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#34d399;">Healthy</p>
                <p style="font-size:18px;font-weight:900;color:#ffffff;margin-top:2px;line-height:1.1;">${r.healthy}</p>
                <p style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#34d399;margin-top:2px;">${healthyPct}%</p>
            </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(51,65,85,0.5);">
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(2,6,23,0.6);border:1px solid rgba(51,65,85,0.5);border-radius:6px;padding:4px 6px;">
                <span style="font-size:9px;color:#94a3b8;">Avg Att</span>
                <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:${attColor};">${r.avgAtt.toFixed(1)}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(2,6,23,0.6);border:1px solid rgba(51,65,85,0.5);border-radius:6px;padding:4px 6px;">
                <span style="font-size:9px;color:#94a3b8;">Verified</span>
                <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#34d399;">${r.verified}/${r.kids}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(2,6,23,0.6);border:1px solid rgba(51,65,85,0.5);border-radius:6px;padding:4px 6px;">
                <span style="font-size:9px;color:#94a3b8;">Tokens</span>
                <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#fbbf24;">${r.tokensApproved}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(2,6,23,0.6);border:1px solid rgba(51,65,85,0.5);border-radius:6px;padding:4px 6px;">
                <span style="font-size:9px;color:#94a3b8;">Ref Rate</span>
                <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#94a3b8;">13.3/21.0%</span>
            </div>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(51,65,85,0.5);font-size:8px;font-family:'JetBrains Mono',monospace;color:#64748b;text-align:center;">
            ${isPinned ? '📌 Pinned · Click ✕ or press Esc to close' : 'Click to pin · Esc to close'}
        </div>
    </div>`;
}

function positionClassHealthTooltip(tooltip, cardEl) {
    let rect;
    if (cardEl && cardEl.getBoundingClientRect) {
        rect = cardEl.getBoundingClientRect();
    } else {
        rect = { left: 100, right: 400, top: 200, bottom: 200, width: 300, height: 0 };
    }
    const tw = tooltip.offsetWidth  || 320;
    const th = tooltip.offsetHeight || 380;
    let left = rect.right + 12;
    let top  = rect.top;
    if (left + tw > window.innerWidth  - 12) left = rect.left - tw - 12;
    if (left < 12) left = 12;
    if (top + th > window.innerHeight - 12) top = window.innerHeight - th - 12;
    if (top < 12) top = 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
}

function showClassHealthTooltip(idx, cardEl) {
    if (classHealthPinnedIndex !== null) return;
    const tooltip = document.getElementById('class-health-tooltip');
    if (!tooltip || !classHealthRows[idx]) return;
    tooltip.innerHTML = buildClassHealthTooltip(idx, false);
    tooltip.classList.add('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    requestAnimationFrame(() => positionClassHealthTooltip(tooltip, cardEl));
}

function hideClassHealthTooltip() {
    if (classHealthPinnedIndex !== null) return;
    const tooltip = document.getElementById('class-health-tooltip');
    if (!tooltip) return;
    tooltip.classList.add('opacity-0');
    tooltip.classList.remove('opacity-100');
}

function pinClassHealth(idx, cardEl) {
    const tooltip = document.getElementById('class-health-tooltip');
    if (!tooltip || !classHealthRows[idx]) return;
    classHealthPinnedIndex = idx;
    tooltip.innerHTML = buildClassHealthTooltip(idx, true);
    tooltip.classList.remove('pointer-events-none');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('pinned'));
    if (cardEl) cardEl.classList.add('pinned');
    requestAnimationFrame(() => positionClassHealthTooltip(tooltip, cardEl));
}

export function unpinClassHealth() {
    classHealthPinnedIndex = null;
    const tooltip = document.getElementById('class-health-tooltip');
    if (tooltip) {
        tooltip.classList.add('pointer-events-none', 'opacity-0');
        tooltip.classList.remove('opacity-100');
    }
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('pinned'));
}

/**
 * Register the document-level outside-click + Esc listeners.
 * Call once at app startup (Phase 9).
 */
export function initClassHealthListeners() {
    document.addEventListener('click', (e) => {
        if (classHealthPinnedIndex === null) return;
        const tooltip = document.getElementById('class-health-tooltip');
        if (tooltip && tooltip.contains(e.target)) return;
        unpinClassHealth();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && classHealthPinnedIndex !== null) unpinClassHealth();
    });
}
