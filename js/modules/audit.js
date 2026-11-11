// js/modules/audit.js — immutable ledger audit trail renderer.

import { state } from '../state.js';

export function renderAuditLogs() {
    const container = document.getElementById('audit-log-container');
    container.innerHTML = state.logs.map(log => `
        <div class="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
            <div class="flex items-center space-x-2"><span class="text-emerald-400 font-bold">[${log.time}]</span><span class="text-slate-200">${log.text}</span></div>
            <span class="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">${log.hash}</span>
        </div>
    `).join('');
}
