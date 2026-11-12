// js/modules/programs.js — programs grid, filters, and create-program flow.

import { kemaihProgramsList } from '../../data/programs.js';   // ← FIX: two ../
import { state }              from '../state.js';

/* ── Render the programs grid ─────────────────────────────── */
export function renderProgramsGrid() {
    const container = document.getElementById('programs-grid-container');
    const cnt       = document.getElementById('programs-filtered-count');
    if (cnt) cnt.innerText = state.programsFiltered.length;
    if (!container) return;

    if (state.programsFiltered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <span class="text-3xl block mb-2">🔍</span>
                <p class="font-bold text-sm text-slate-300">No programs found.</p>
                <button onclick="resetProgramFilters()" class="mt-3 text-xs text-emerald-400 underline font-semibold">Reset Filters</button>
            </div>`;
        return;
    }

    container.innerHTML = state.programsFiltered.map(prog => `
        <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 ${prog.borderHover || 'hover:border-emerald-500/50'} transition group relative flex flex-col justify-between">
            <div class="space-y-3">
                <div class="flex justify-between items-start">
                    <span class="text-2xl">${prog.icon || '📋'}</span>
                    <span class="${prog.statusClass || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'} text-[10px] font-extrabold px-2 py-0.5 rounded-full border">${prog.status || 'Active'}</span>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-white ${prog.titleHover || 'group-hover:text-emerald-400'} transition">${prog.title}</h3>
                    <p class="text-xs text-slate-400 mt-1">${prog.desc || ''}</p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>📅 <strong class="text-emerald-400">${prog.date || '—'}</strong></div>
                    <div>📍 <strong class="text-indigo-300">${prog.location || '—'}</strong></div>
                    <div>👥 <strong class="text-amber-400">${prog.participants || 0} Pax</strong></div>
                    <div>🏢 <strong class="text-slate-200">Kemaih</strong></div>
                </div>
            </div>
            <div class="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-mono">
                <span class="text-slate-400">Cohort: <strong class="text-slate-200">${prog.cohort || 'All Ages'}</strong></span>
                <span class="text-indigo-400 font-bold">${prog.sdg || 'SDG 3'}</span>
            </div>
        </div>
    `).join('');
}

/* ── Apply filter combinations ────────────────────────────── */
export function applyProgramFilters() {
    const courseVal   = document.getElementById('prog-filter-course')?.value ?? 'all';
    const dateFrom    = document.getElementById('prog-filter-date-from')?.value ?? '';
    const dateTo      = document.getElementById('prog-filter-date-to')?.value ?? '';
    const locationVal = document.getElementById('prog-filter-location')?.value ?? 'all';
    const minPartVal  = parseInt(document.getElementById('prog-filter-participants')?.value ?? '0', 10);

    state.programsFiltered = kemaihProgramsList.filter(p =>
        (courseVal === 'all' || p.title === courseVal) &&
        (!dateFrom || p.date >= dateFrom) &&
        (!dateTo   || p.date <= dateTo) &&
        (locationVal === 'all' || p.location === locationVal) &&
        (p.participants >= minPartVal)
    );
    renderProgramsGrid();
}

/* ── Reset all filters ────────────────────────────────────── */
export function resetProgramFilters() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('prog-filter-course', 'all');
    set('prog-filter-date-from', '');
    set('prog-filter-date-to', '');
    set('prog-filter-location', 'all');
    set('prog-filter-participants', '0');

    state.programsFiltered = [...kemaihProgramsList];
    renderProgramsGrid();
}

/* ── Create program modal ─────────────────────────────────── */
export function openNewProgramModal() {
    const m = document.getElementById('modal-new-program');
    if (m) m.classList.remove('hidden');
}

export function closeNewProgramModal() {
    const m = document.getElementById('modal-new-program');
    if (m) m.classList.add('hidden');
}

export function handleCreateProgramSubmit(e) {
    e.preventDefault();

    const customName = document.getElementById('prog-custom-name')?.value.trim() || '';
    const progName   = document.getElementById('prog-name')?.value || '';
    const progDate   = document.getElementById('prog-date')?.value || '2026-10-25';
    const progLoc    = document.getElementById('prog-location')?.value || 'Kuala Lumpur';
    const progCohort = document.getElementById('prog-cohort')?.value || 'All Ages';
    const progSdg    = document.getElementById('prog-sdg')?.value || 'SDG 3';
    const progDesc   = document.getElementById('prog-desc')?.value || 'New Kemaih initiative course.';

    const displayTitle = customName || progName;

    kemaihProgramsList.unshift({
        id: kemaihProgramsList.length + 1,
        title: displayTitle,
        icon: '✨',
        status: 'Active Launch',
        statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        borderHover: 'hover:border-emerald-500/50',
        titleHover: 'group-hover:text-emerald-400',
        desc: progDesc,
        cohort: progCohort,
        sdg: progSdg,
        date: progDate,
        location: progLoc,
        participants: 25,
        courseType: progName
    });

    resetProgramFilters();
    closeNewProgramModal();
    alert(`🎉 Kemaih Course Published Successfully!\n\n"${displayTitle}" is now active.`);
}
