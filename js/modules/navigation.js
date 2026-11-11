// js/modules/navigation.js — top-level tab switching.

import { state } from '../state/store.js';   // ⚠ see note below

export function switchMainTab(tabKey) {
    state.currentTab = tabKey;

    ['new-program', 'esg', 'lapaq', 'roster', 'audit'].forEach(key => {
        const view = document.getElementById(`view-${key}`);
        const nav  = document.getElementById(`nav-${key}`);
        if (key === tabKey) {
            view.classList.remove('hidden');
            nav.className = key === 'new-program'
                ? "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition"
                : "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition";
        } else {
            view.classList.add('hidden');
            nav.className = "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition";
        }
    });

    const lapaqHeaderBtn = document.getElementById('lapaq-portal-header-btn');
    if (lapaqHeaderBtn) {
        if (tabKey === 'lapaq') lapaqHeaderBtn.classList.remove('hidden');
        else                    lapaqHeaderBtn.classList.add('hidden');
    }

    // ✅ Resize charts now that the target view is visible.
    //    Without this, charts created while the tab was display:none
    //    stay stuck at 0×0 the first time the tab is opened.
    if (typeof window.resizeAllCharts === 'function') {
        window.resizeAllCharts();
    }
}
