// js/modules/filters.js — sidebar global filters + time selector.

import { state } from '../state.js';

export function applyGlobalFilters() {
    state.filterRegion = document.getElementById('filter-region').value;
    const mult = state.filterRegion === 'perak' ? 0.6
               : state.filterRegion === 'pahang' ? 0.45
               : 1;

    document.getElementById('kpi-children').innerText = Math.round(220 * mult);
    document.getElementById('kpi-tokens').innerText = (Math.round(45850 * mult)).toLocaleString();
    document.getElementById('kpi-hubs').innerText = Math.round(14 * mult);
}

export function resetGlobalFilters() {
    document.getElementById('filter-region').value = 'selangor';
    applyGlobalFilters();
}

export function setFilterTime(key) {
    ['1m', '6m', 'ytd'].forEach(k => {
        document.getElementById(`time-${k}`).className = k === key
            ? "py-1 text-[10px] font-bold rounded-lg bg-indigo-600 text-white shadow transition"
            : "py-1 text-[10px] font-bold rounded-lg text-slate-400 hover:text-white transition";
    });
}
