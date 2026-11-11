// js/modules/menu-engine.js — custom menu builder (SEJAHTERA cycle).

import { RNI_REFERENCE } from '../config.js';
import { sampleMenuTemplates } from '../data/menu-templates.js';
import { slug, escHtml } from '../utils/format.js';

/* Module-scoped custom menu store (persists while app is open). */
const customMenus = [];

/* ── Sample preset loader ─────────────────────────────────── */
export function loadSampleMenu(key) {
    const tpl = sampleMenuTemplates[key];
    if (!tpl) return;

    document.getElementById('new-menu-name').value = tpl.name;
    document.getElementById('new-menu-day').value  = tpl.day;

    const rows = document.getElementById('ingredient-rows');
    rows.innerHTML = '';
    tpl.ingredients.forEach(ing => addIngredientRow(ing));

    Object.keys(RNI_REFERENCE).forEach(k => {
        const el = document.getElementById(`mn-${slug(k)}`);
        if (el) el.value = tpl.nutrients[k] ?? '';
    });
    updateNutrientBadges();

    console.log(`[SEJAHTERA] Loaded sample "${tpl.name}" with ${tpl.ingredients.length} ingredients.`);
}

/* ── Nutrient grid + % badges ─────────────────────────────── */
export function buildNutrientGrid() {
    const grid = document.getElementById('menu-nutrient-grid');
    if (!grid) return;
    grid.innerHTML = Object.keys(RNI_REFERENCE).map(k => {
        const s = slug(k);
        return `<div class="bg-slate-950 border border-slate-800 rounded-xl p-2 space-y-1"><label class="block text-[9px] font-bold text-slate-400 uppercase">${k} <span class="text-slate-500 normal-case font-mono">(${RNI_REFERENCE[k].unit})</span></label><input type="number" min="0" step="0.1" id="mn-${s}" oninput="updateNutrientBadges()" placeholder="0" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"><span id="mnpct-${s}" class="block text-[9px] font-mono text-slate-500">0% of daily RNI</span></div>`;
    }).join('');
}

export function updateNutrientBadges() {
    Object.keys(RNI_REFERENCE).forEach(k => {
        const s = slug(k);
        const input = document.getElementById(`mn-${s}`);
        const badge = document.getElementById(`mnpct-${s}`);
        if (!input || !badge) return;
        const v   = parseFloat(input.value) || 0;
        const pct = (v / RNI_REFERENCE[k].ref) * 100;
        let color = 'text-slate-500';
        if (pct >= 100) color = 'text-emerald-400';
        else if (pct >= 50) color = 'text-indigo-400';
        else if (pct >= 25) color = 'text-amber-400';
        else if (pct > 0)   color = 'text-rose-400';
        badge.className = `block text-[9px] font-mono ${color}`;
        badge.innerText = `${pct.toFixed(0)}% of daily RNI`;
    });
}

/* ── Ingredient row add/remove ────────────────────────────── */
export function addIngredientRow(data = {}) {
    const container = document.getElementById('ingredient-rows');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'ingredient-row grid grid-cols-12 gap-1.5 items-center';
    row.innerHTML = `
        <input data-field="name" value="${escHtml(data.name || '')}" placeholder="Ingredient (e.g. Ikan Bilis)" class="col-span-4 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500">
        <input type="number" min="0" step="0.1" data-field="qty" value="${escHtml(data.qty || '')}" placeholder="Qty" class="col-span-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-mono text-white focus:outline-none focus:border-emerald-500">
        <select data-field="unit" class="col-span-2 bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500">${['g','ml','pcs','cup','tbsp','tsp','slice'].map(u => `<option ${data.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select>
        <input data-field="micro" value="${escHtml(data.micro || '')}" placeholder="Key micro (e.g. Calcium 120mg)" class="col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500">
        <button type="button" onclick="this.closest('.ingredient-row').remove()" title="Remove ingredient" class="col-span-1 text-rose-400 hover:text-rose-300 font-bold text-xs">✕</button>
    `;
    container.appendChild(row);
}

/* ── New-menu modal open / close ──────────────────────────── */
export function openNewMenuModal() {
    document.getElementById('new-menu-name').value = '';
    document.getElementById('new-menu-day').value  = 'Monday';
    const rows = document.getElementById('ingredient-rows');
    rows.innerHTML = '';
    addIngredientRow(); addIngredientRow(); addIngredientRow();
    Object.keys(RNI_REFERENCE).forEach(k => { const el = document.getElementById(`mn-${slug(k)}`); if (el) el.value = ''; });
    updateNutrientBadges();
    document.getElementById('modal-new-menu').classList.remove('hidden');
}
export function closeNewMenuModal() {
    document.getElementById('modal-new-menu').classList.add('hidden');
}

/* ── Save new menu ────────────────────────────────────────── */
export function handleSaveMenu(e) {
    e.preventDefault();
    const name = document.getElementById('new-menu-name').value.trim();
    if (!name) { alert('Please enter a menu name.'); return; }
    const day = document.getElementById('new-menu-day').value;
    const ingredients = [...document.querySelectorAll('#ingredient-rows .ingredient-row')].map(row => ({
        name:  row.querySelector('[data-field="name"]').value.trim(),
        qty:   row.querySelector('[data-field="qty"]').value.trim(),
        unit:  row.querySelector('[data-field="unit"]').value,
        micro: row.querySelector('[data-field="micro"]').value.trim()
    })).filter(i => i.name);
    if (!ingredients.length) { alert('Add at least one ingredient.'); return; }
    const nutrients = {};
    Object.keys(RNI_REFERENCE).forEach(k => {
        const el = document.getElementById(`mn-${slug(k)}`);
        const v  = el ? parseFloat(el.value) : 0;
        nutrients[k] = isNaN(v) ? 0 : v;
    });
    if (Object.values(nutrients).every(v => v === 0)) { alert('Enter at least one micronutrient value.'); return; }

    customMenus.push({ id: Date.now(), name, day, ingredients, nutrients, createdAt: new Date().toISOString().slice(0, 10) });
    closeNewMenuModal();
    renderCustomMenus();
    alert(`✅ Menu Saved to SEJAHTERA Cycle!\n\n"${name}" • ${day} • ${ingredients.length} ingredients`);
}

/* ── Delete menu ──────────────────────────────────────────── */
export function deleteCustomMenu(id) {
    const idx = customMenus.findIndex(m => m.id === id);
    if (idx === -1) return;
    if (!confirm(`Remove "${customMenus[idx].name}" from the SEJAHTERA cycle?`)) return;
    customMenus.splice(idx, 1);
    renderCustomMenus();
}

/* ── Custom menu card render ──────────────────────────────── */
export function renderCustomMenus() {
    const list  = document.getElementById('custom-menu-list');
    const empty = document.getElementById('custom-menu-empty');
    const count = document.getElementById('custom-menu-count');
    if (!list) return;

    count.innerText = `${customMenus.length} Menu${customMenus.length === 1 ? '' : 's'}`;
    if (!customMenus.length) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');

    list.innerHTML = customMenus.map(m => {
        const entries    = Object.keys(RNI_REFERENCE).map(k => { const v = m.nutrients[k] || 0; return { k, v, pct: (v / RNI_REFERENCE[k].ref) * 100, unit: RNI_REFERENCE[k].unit }; });
        const critical   = entries.filter(e => e.pct > 0 && e.pct < 25).length;
        const warning    = entries.filter(e => e.pct >= 25 && e.pct < 50).length;
        const adequate   = entries.filter(e => e.pct >= 50).length;
        const kcal       = m.nutrients['Energy'] || 0;
        return `<div class="bg-slate-950 border border-emerald-500/30 rounded-xl p-3 space-y-2"><div class="flex justify-between items-start gap-2"><div class="min-w-0"><p class="text-[11px] font-extrabold text-white truncate">${escHtml(m.name)}</p><p class="text-[9px] text-slate-500 font-mono">${m.day} • ${kcal} kcal • ${m.ingredients.length} ingredients</p></div><button onclick="deleteCustomMenu(${m.id})" title="Delete menu" class="shrink-0 text-slate-500 hover:text-rose-400 text-[11px] font-bold">✕</button></div><div class="flex flex-wrap gap-1">${m.ingredients.map(i => `<span class="bg-slate-900 border border-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono">${escHtml(i.name)} · ${escHtml(i.qty || '—')}${i.unit}${i.micro ? ' · ' + escHtml(i.micro) : ''}</span>`).join('')}</div><div class="flex items-center gap-2 text-[9px] font-mono pt-1 border-t border-slate-800/70"><span class="text-rose-400">🔴 ${critical} critical</span><span class="text-amber-400">🟡 ${warning} warning</span><span class="text-emerald-400">🟢 ${adequate} adequate</span></div><details><summary class="text-[10px] font-bold text-indigo-400 cursor-pointer select-none">Micronutrient breakdown (11)</summary><div class="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1.5">${entries.map(e => { const color = e.pct >= 100 ? 'text-emerald-400' : e.pct >= 50 ? 'text-indigo-400' : e.pct >= 25 ? 'text-amber-400' : 'text-rose-400'; return `<div class="flex justify-between items-center bg-slate-900 rounded px-1.5 py-0.5 border border-slate-800"><span class="text-[9px] text-slate-400">${e.k}</span><span class="text-[9px] font-mono ${color}">${e.v} ${e.unit} · ${e.pct.toFixed(0)}%</span></div>`; }).join('')}</div></details></div>`;
    }).join('');
}
