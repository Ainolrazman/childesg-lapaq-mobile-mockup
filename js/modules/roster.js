// js/modules/roster.js — participant roster table + verification actions.

import { state } from '../state.js';
import { participantRoster } from '../../data/roster.js';   // ← FIX: two ../
import { renderClassAttendanceSummary } from './class-health.js';

export function renderRosterTable() {
    const tbody = document.getElementById('roster-table-body');
    const total = state.rosterFiltered.length;
    const pageSize = state.rosterPageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (state.rosterPage > totalPages) state.rosterPage = totalPages;
    const startIndex = (state.rosterPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const pageData = state.rosterFiltered.slice(startIndex, endIndex);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-500 font-bold">No records.</td></tr>`;
    } else {
        tbody.innerHTML = pageData.map(item => `
            <tr class="hover:bg-slate-800/40 transition">
                <td class="py-3 px-4"><div class="font-bold text-white">${item.name}</div><div class="text-[10px] font-mono text-indigo-400">${item.token}</div></td>
                <td class="py-3 px-4 font-semibold text-slate-200">${item.course}</td>
                <td class="py-3 px-4 font-mono text-slate-300 text-[11px]">${item.date}</td>
                <td class="py-3 px-4">${item.org}</td>
                <td class="py-3 px-4"><span class="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">${item.attendance}</span></td>
                <td class="py-3 px-4 text-amber-400 font-bold">${item.rating}</td>
                <td class="py-3 px-4"><span class="${item.verified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'} px-2 py-0.5 rounded text-[10px] font-bold">${item.verified ? '✓ Verified' : '⏳ Pending'}</span></td>
                <td class="py-3 px-4"><button onclick="approveTokenPoints('${item.id}')" class="${item.tokensApproved ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-amber-600/20 text-amber-300 border border-amber-500/30'} text-[10px] font-bold px-2.5 py-1 rounded-lg transition">${item.tokensApproved ? '✓ 25 Approved' : '⚡ Approve'}</button></td>
                <td class="py-3 px-4 text-right"><button onclick="verifySdgevidence('${item.id}')" class="${item.verified ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-emerald-600 text-white'} text-[10px] font-bold px-2.5 py-1 rounded-lg transition">${item.verified ? 'Verify Proof' : 'Verify Evidence'}</button></td>
            </tr>
        `).join('');
    }
    document.getElementById('roster-start').innerText = total === 0 ? 0 : startIndex + 1;
    document.getElementById('roster-end').innerText = endIndex;
    document.getElementById('roster-total').innerText = total;
    document.getElementById('roster-page-indicator').innerText = `Page ${state.rosterPage} of ${totalPages}`;
    document.getElementById('btn-prev-page').disabled = state.rosterPage <= 1;
    document.getElementById('btn-next-page').disabled = state.rosterPage >= totalPages;
}

export function changePageSize(newSize) {
    state.rosterPageSize = parseInt(newSize, 10);
    state.rosterPage = 1;
    renderRosterTable();
}

export function changeRosterPage(delta) {
    state.rosterPage += delta;
    renderRosterTable();
}

export function filterRosterTable() {
    const query = document.getElementById('roster-search').value.toLowerCase().trim();
    state.rosterFiltered = !query
        ? [...participantRoster]
        : participantRoster.filter(p =>
            p.name.toLowerCase().includes(query)   ||
            p.course.toLowerCase().includes(query) ||
            p.token.toLowerCase().includes(query)  ||
            p.org.toLowerCase().includes(query)    ||
            p.date.includes(query)
        );
    state.rosterPage = 1;
    renderRosterTable();
}

export function verifySdgevidence(rowId) {
    const target = participantRoster.find(p => p.id == rowId);
    if (target) {
        target.verified = true;
        renderRosterTable();
        renderClassAttendanceSummary();
        alert(`✅ SDG Evidence Verified for ${target.name}!`);
    }
}

export function approveTokenPoints(rowId) {
    const target = participantRoster.find(p => p.id == rowId);
    if (target) {
        target.tokensApproved = !target.tokensApproved;
        renderRosterTable();
        renderClassAttendanceSummary();
        alert(target.tokensApproved ? `🪙 25 Impact Tokens minted for ${target.name}.` : `⚠️ Tokens revoked for ${target.name}.`);
    }
}
