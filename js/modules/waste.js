// js/modules/waste.js — food-waste tracking + menu-analysis modal entry.

import { wasteLogs } from '../data/waste.js';
import { WASTE_COST_PER_KG } from '../config.js';
import { initWasteTrendChart } from '../charts/waste.js';

/* ── Menu Analysis modal (contains the waste section) ──────── */
export function openMenuAnalysisModal() {
    document.getElementById('modal-menu-analysis').classList.remove('hidden');
    setTimeout(() => { updateWasteStats(); initWasteTrendChart(); }, 80);
}
export function closeMenuAnalysisModal() {
    document.getElementById('modal-menu-analysis').classList.add('hidden');
}

/* ── Dashboard KPI refresh ─────────────────────────────────── */
export function updateWasteStats() {
    if (!wasteLogs.length) return;
    const today = wasteLogs[wasteLogs.length - 1];
    const yesterday = wasteLogs.length > 1 ? wasteLogs[wasteLogs.length - 2] : null;
    const divPct = today.leftovers > 0 ? (today.diverted / today.leftovers * 100) : 0;

    const elPlates = document.getElementById('waste-stat-plates');
    if (elPlates) elPlates.innerText = today.platesServed;

    const elLo = document.getElementById('waste-stat-leftovers');
    if (elLo) elLo.innerText = `${today.leftovers.toFixed(1)} kg`;

    const elLoSub = document.getElementById('waste-stat-leftovers-sub');
    if (elLoSub) {
        if (yesterday && yesterday.leftovers > 0) {
            const pct = ((today.leftovers - yesterday.leftovers) / yesterday.leftovers) * 100;
            const arrow = pct >= 0 ? '▲' : '▼';
            const color = pct >= 0 ? 'text-rose-400' : 'text-emerald-400';
            elLoSub.className = `text-[9px] font-mono ${color}`;
            elLoSub.innerText = `${arrow} ${Math.abs(pct).toFixed(0)}% vs yesterday`;
        } else {
            elLoSub.innerText = 'Today';
        }
    }

    const elDv = document.getElementById('waste-stat-diverted');
    if (elDv) elDv.innerText = `${today.diverted.toFixed(1)} kg`;

    const elDvSub = document.getElementById('waste-stat-diverted-sub');
    if (elDvSub) elDvSub.innerText = `${divPct.toFixed(1)}% diversion`;

    const elSdgNote = document.getElementById('waste-stat-sdg-note');
    if (elSdgNote) elSdgNote.innerText = `${divPct.toFixed(1)}%`;

    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

    const costToday   = today.leftovers * WASTE_COST_PER_KG;
    const cost7d      = wasteLogs.reduce((sum, l) => sum + (l.leftovers * WASTE_COST_PER_KG), 0);
    const avgPerDay   = wasteLogs.length ? cost7d / wasteLogs.length : 0;
    const costMonthProj = avgPerDay * 30;
    const costPerPlate  = today.platesServed > 0 ? costToday / today.platesServed : 0;

    setText('waste-stat-cost',         `RM ${costToday.toFixed(2)}`);
    setText('waste-stat-cost-sub',     `@ RM ${WASTE_COST_PER_KG.toFixed(2)}/kg`);
    setText('waste-cost-today',        `RM ${costToday.toFixed(2)}`);
    setText('waste-cost-7d',           `RM ${cost7d.toFixed(2)}`);
    setText('waste-cost-month',        `RM ${costMonthProj.toFixed(2)}`);
    setText('waste-cost-per-plate',    `RM ${costPerPlate.toFixed(2)}`);
    setText('waste-cost-rate-label',   WASTE_COST_PER_KG.toFixed(2));
}

/* ── Live cost preview inside the log modal ────────────────── */
export function updateWasteCostPreview() {
    const el = document.getElementById('waste-log-leftovers');
    const preview = document.getElementById('waste-log-cost-preview');
    if (preview) {
        const kg = parseFloat(el?.value) || 0;
        preview.innerText = `Estimated: RM ${(kg * WASTE_COST_PER_KG).toFixed(2)}`;
    }
}

/* ── Log modal open / close / submit ──────────────────────── */
export function openWasteLogModal() {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('waste-log-date').value      = today;
    document.getElementById('waste-log-plates').value     = '220';
    document.getElementById('waste-log-leftovers').value  = '';
    document.getElementById('waste-log-diverted').value   = '';
    document.getElementById('waste-log-notes').value      = '';
    const rateEl = document.getElementById('waste-log-rate');
    if (rateEl) rateEl.innerText = WASTE_COST_PER_KG.toFixed(2);
    updateWasteCostPreview();
    document.getElementById('modal-waste-log').classList.remove('hidden');
}
export function closeWasteLogModal() {
    document.getElementById('modal-waste-log').classList.add('hidden');
}

export function handleWasteLogSubmit(e) {
    e.preventDefault();
    const date      = document.getElementById('waste-log-date').value;
    const plates    = parseInt(document.getElementById('waste-log-plates').value, 10) || 0;
    const leftovers = parseFloat(document.getElementById('waste-log-leftovers').value) || 0;
    const diverted  = parseFloat(document.getElementById('waste-log-diverted').value) || 0;

    if (diverted > leftovers) { alert('⚠️ Diverted kg cannot exceed total leftovers kg.'); return; }
    if (plates <= 0)          { alert('⚠️ Plates served must be greater than zero.');    return; }

    const divPct = leftovers > 0 ? (diverted / leftovers * 100) : 0;
    const cost   = leftovers * WASTE_COST_PER_KG;

    const existingIdx = wasteLogs.findIndex(l => l.date === date);
    const newRecord = { date, platesServed: plates, leftovers, diverted };
    if (existingIdx >= 0) wasteLogs[existingIdx] = newRecord;
    else { wasteLogs.push(newRecord); while (wasteLogs.length > 7) wasteLogs.shift(); }

    updateWasteStats();
    initWasteTrendChart();
    closeWasteLogModal();

    alert(`✅ Waste log saved!\n\n📅 ${date}\n🍽️ ${plates} plates served\n🥀 ${leftovers.toFixed(1)} kg leftovers\n♻️ ${diverted.toFixed(1)} kg diverted (${divPct.toFixed(1)}%)\n💰 Waste cost: RM ${cost.toFixed(2)}`);
}

/* ── History modal ────────────────────────────────────────── */
export function openWasteHistoryModal() {
    const tbody = document.getElementById('waste-history-tbody');
    if (!tbody) return;
    let totalCost = 0;
    tbody.innerHTML = [...wasteLogs].reverse().map(l => {
        const pct  = l.leftovers > 0 ? (l.diverted / l.leftovers * 100).toFixed(1) : '0.0';
        const cost = l.leftovers * WASTE_COST_PER_KG;
        totalCost += cost;
        return `
            <tr class="hover:bg-slate-800/40 transition">
                <td class="py-2 px-3 font-mono text-slate-300">${l.date}</td>
                <td class="py-2 px-3 font-mono text-slate-200">${l.platesServed}</td>
                <td class="py-2 px-3 font-mono text-rose-400 font-bold">${l.leftovers.toFixed(1)} kg</td>
                <td class="py-2 px-3 font-mono text-emerald-400 font-bold">${l.diverted.toFixed(1)} kg</td>
                <td class="py-2 px-3 font-mono text-emerald-300">${pct}%</td>
                <td class="py-2 px-3 font-mono text-amber-400 font-bold">RM ${cost.toFixed(2)}</td>
            </tr>`;
    }).join('');
    const totalEl = document.getElementById('waste-history-total');
    if (totalEl) totalEl.innerText = `${wasteLogs.length} records · RM ${totalCost.toFixed(2)} total`;
    document.getElementById('modal-waste-history').classList.remove('hidden');
}
export function closeWasteHistoryModal() {
    document.getElementById('modal-waste-history').classList.add('hidden');
}
