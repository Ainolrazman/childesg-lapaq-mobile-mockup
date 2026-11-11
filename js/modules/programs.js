// js/modules/programs.js — program grid, filtering, creation.

import { state } from '../state.js';
import { kemaihProgramsList } from '../data/programs.js';

export function renderProgramsGrid() {
    const container = document.getElementById('programs-grid-container');
    const cnt = document.getElementById('programs-filtered-count');
    if (cnt) cnt.innerText = state.programsFiltered.length;

    if (state.programsFiltered.length === 0) {
        container.innerHTML = `<div class="col-span-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400"><span class="text-3xl block mb-2">🔍</span><p class="font-bold text-sm text-slate-300">No programs found.</p><button onclick="resetProgramFilters()" class="mt-3 text-xs text-emerald-400 underline font-semibold">Reset Filters</button></div>`;
        return;
    }

    container.innerHTML = state.programsFiltered.map(prog => `
        <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 ${prog.borderHover} transition group relative flex flex-col justify-between">
            <div class="space-y-3">
                <div class="flex justify-between items-start"><span class="text-2xl">${prog.icon}</span><span class="${prog.statusClass} text-[10px] font-extrabold px-2 py-0.5 rounded-full border">${prog.status}</span></div>
                <div><h3 class="text-sm font-bold text-white ${prog.titleHover} transition">${prog.title}</h3><p class="text-xs text-slate-400 mt-1">${prog.desc}</p></div>
                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>📅 <strong class="text-emerald-400">${prog.date}</strong></div>
                    <div>📍 <strong class="text-indigo-300">${prog.location}</strong></div>
                    <div>👥 <strong class="text-amber-400">${prog.participants} Pax</strong></div>
                    <div>🏢 <strong class="text-slate-200">Kemaih</strong></div>
                </div>
            </div>
            <div class="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-mono">
                <span class="text-slate-400">Cohort: <strong class="text-slate-200">${prog.cohort}</strong></span>
                <span class="text-indigo-400 font-bold">${prog.sdg}</span>
            </div>
        </div>
    `).join('');
}

export function applyProgramFilters() {
    const courseVal   = document.getElementById('prog-filter-course').value;
    const dateFrom    = document.getElementById('prog-filter-date-from').value;
    const dateTo      = document.getElementById('prog-filter-date-to').value;
    const locationVal = document.getElementById('prog-filter-location').value;
    const minPartVal  = parseInt(document.getElementById('prog-filter-participants').value, 10);

    state.programsFiltered = kemaihProgramsList.filter(p =>
        (courseVal === 'all' || p.title === courseVal) &&
        (!dateFrom || p.date >= dateFrom) &&
        (!dateTo || p.date <= dateTo) &&
        (locationVal === 'all' || p.location === locationVal) &&
        p.participants >= minPartVal
    );
    renderProgramsGrid();
}

export function resetProgramFilters() {
    document.getElementById('prog-filter-course').value = 'all';
    document.getElementById('prog-filter-date-from').value = '';
    document.getElementById('prog-filter-date-to').value = '';
    document.getElementById('prog-filter-location').value = 'all';
    document.getElementById('prog-filter-participants').value = '0';
    state.programsFiltered = [...kemaihProgramsList];
    renderProgramsGrid();
}

export function openNewProgramModal()  { document.getElementById('modal-new-program').classList.remove('hidden'); }
export function closeNewProgramModal() { document.getElementById('modal-new-program').classList.add('hidden'); }

export function handleCreateProgramSubmit(e) {
    e.preventDefault();
    const customName = document.getElementById('prog-custom-name').value.trim();
    const progName   = document.getElementById('prog-name').value;
    const progDate   = document.getElementById('prog-date').value || "2026-10-25";
    const progLoc    = document.getElementById('prog-location').value;
    const progCohort = document.getElementById('prog-cohort').value;
    const progSdg    = document.getElementById('prog-sdg').value;
    const progDesc   = document.getElementById('prog-desc').value || "New Kemaih initiative course.";
    const displayTitle = customName || progName;

    kemaihProgramsList.unshift({
        id: kemaihProgramsList.length + 1,
        title: displayTitle,
        icon: "✨",
        status: "Active Launch",
        statusClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        borderHover: "hover:border-emerald-500/50",
        titleHover: "group-hover:text-emerald-400",
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
