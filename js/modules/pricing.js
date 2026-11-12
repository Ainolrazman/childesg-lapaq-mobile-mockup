// js/modules/pricing.js — B2B2C partner pricing page.

import {
    b2b2cPlans,
    b2b2cTerms,
    parentBenefit,
    billingRules,
    featureMatrix
} from '../../data/pricing-b2b2c.js';

/* ── Module state ─────────────────────────────────────────── */
const pricingState = {
    selectedTerm: 12,
    selectedPlan: 'standard',
    childCount: 220,
    locationCount: 1
};

/* ── Helpers ──────────────────────────────────────────────── */
function fmtRM(n) {
    return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function accentClasses(accent, kind = 'text') {
    const map = {
        slate:   { text: 'text-slate-300',   border: 'border-slate-700/80',  bg: 'bg-slate-800/40' },
        emerald: { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/30' },
        indigo:  { text: 'text-indigo-400',  border: 'border-indigo-500/40',  bg: 'bg-indigo-950/30' },
        purple:  { text: 'text-purple-400',  border: 'border-purple-500/40',  bg: 'bg-purple-950/30' }
    };
    return map[accent]?.[kind] || map.slate[kind];
}

/* ── Cost calculation ─────────────────────────────────────── */
function calculateCost(planId, months, kids, locations) {
    const plan = b2b2cPlans.find(p => p.id === planId);
    if (!plan) return null;
    if (planId === 'trial') {
        return { total: 0, monthlyTotal: 0, annualTotal: 0, minRequired: 0, minMet: true, perChild: 0 };
    }
    const p = plan.price[months];
    let total, minRequired;
    if (planId === 'chain') {
        const locs = Math.max(1, locations || 1);
        minRequired = p.minPerLocation * locs;
        total = Math.max(kids * p.perChild, minRequired);
    } else {
        minRequired = p.minTotal;
        total = Math.max(kids * p.perChild, minRequired);
    }
    const monthlyTotal = months === 12 ? total / 12 : (months === 3 ? total / 3 : total);
    const annualTotal  = monthlyTotal * 12;
    return { total, monthlyTotal, annualTotal, minRequired, minMet: total >= minRequired, perChild: p.perChild };
}

/* ── Render: term bar ─────────────────────────────────────── */
function renderPricingTermBar() {
    const container = document.getElementById('pricing-term-bar');
    if (!container) return;
    container.innerHTML = b2b2cTerms.map(t => {
        const active = pricingState.selectedTerm === t.months;
        return `
            <button type="button" onclick="setPricingTerm(${t.months})"
                    class="flex-1 py-2 text-[11px] font-extrabold rounded-xl transition ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                ${t.label}${t.recommended ? ' ★' : ''}
            </button>`;
    }).join('');
}

/* ── Render: plan cards ───────────────────────────────────── */
function renderPlanCards() {
    const container = document.getElementById('pricing-plans-grid');
    if (!container) return;
    const months = pricingState.selectedTerm;

    container.innerHTML = b2b2cPlans.map(plan => {
        const isSelected = pricingState.selectedPlan === plan.id;
        const accent = accentClasses(plan.accent, 'text');
        const accentBorder = accentClasses(plan.accent, 'border');

        let priceLine, perLabel, savingsBadge = '';
        if (plan.id === 'trial') {
            priceLine = 'Free';
            perLabel = '7 days';
        } else if (months === 12) {
            priceLine = `RM ${plan.effectiveAnnual[12]}`;
            perLabel = '/child/year';
            if (plan.savings[12] > 0) savingsBadge = `<span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Save ${plan.savings[12]}%</span>`;
        } else if (months === 3) {
            priceLine = `RM ${plan.effectiveAnnual[3]}`;
            perLabel = '/child/year';
            if (plan.savings[3] > 0) savingsBadge = `<span class="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">Save ${plan.savings[3]}%</span>`;
        } else {
            priceLine = `RM ${plan.effectiveAnnual[1]}`;
            perLabel = '/child/year';
        }

        const badgeHtml = plan.badge
            ? `<span class="text-[9px] font-extrabold uppercase tracking-wider ${accent} bg-slate-950 border ${accentBorder} px-2 py-0.5 rounded-full">${plan.badge}</span>`
            : '';

        const highlightsHtml = plan.highlights.map(h =>
            `<li class="flex items-start gap-2 text-[11px] text-slate-300"><span class="${accent} mt-0.5">✓</span><span>${h}</span></li>`
        ).join('');

        const ctaLabel = plan.id === 'trial' ? 'Start Free Trial' : plan.id === 'enterprise' ? 'Request Quote' : 'Choose Plan';
        const selectedRing = isSelected ? `ring-2 ring-offset-2 ring-offset-slate-900 ${accentBorder}` : 'border-slate-800';

        return `
            <div class="pricing-plan-card bg-slate-950/70 border ${selectedRing} rounded-2xl p-5 space-y-3 cursor-pointer transition hover:border-slate-700"
                 data-plan-id="${plan.id}" onclick="selectPricingPlan('${plan.id}')">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${plan.icon}</span>
                        <div>
                            <p class="text-sm font-black text-white">${plan.name}</p>
                            <p class="text-[10px] text-slate-400">${plan.tagline}</p>
                        </div>
                    </div>
                    ${badgeHtml}
                </div>
                <div class="pt-1">
                    <div class="flex items-baseline gap-1">
                        <span class="text-3xl font-black ${accent}">${priceLine}</span>
                        <span class="text-[11px] text-slate-400 font-mono">${perLabel}</span>
                    </div>
                    ${savingsBadge}
                </div>
                <div class="pt-2 border-t border-slate-800/80">
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Eligibility</p>
                    <p class="text-[11px] text-slate-300">${plan.eligibility}</p>
                </div>
                <ul class="space-y-1.5 pt-1">${highlightsHtml}</ul>
                <div class="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>Kids: <strong class="text-white">${plan.limits.maxKids}</strong></div>
                    <div>Locations: <strong class="text-white">${plan.limits.maxLocations}</strong></div>
                    <div>Admin: <strong class="text-white">${plan.limits.adminSeats}</strong></div>
                    <div>Audit: <strong class="text-white">${plan.limits.auditRetentionDays}d</strong></div>
                </div>
                <button type="button"
                        onclick="event.stopPropagation(); handleSubscribeClick('${plan.id}');"
                        class="w-full mt-2 py-2 rounded-xl text-xs font-extrabold transition ${isSelected ? `${accentClasses(plan.accent, 'bg')} ${accent} border ${accentBorder}` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                    ${ctaLabel}
                </button>
            </div>`;
    }).join('');
}

/* ── Render: calculator ───────────────────────────────────── */
function renderCalculator() {
    const container = document.getElementById('pricing-calculator');
    if (!container) return;
    const plan = b2b2cPlans.find(p => p.id === pricingState.selectedPlan);
    const cost = calculateCost(pricingState.selectedPlan, pricingState.selectedTerm, pricingState.childCount, pricingState.locationCount);
    if (!plan || !cost) return;

    const accent = accentClasses(plan.accent, 'text');
    const accentBorder = accentClasses(plan.accent, 'border');
    const minMetHtml = cost.minMet ? `<span class="text-emerald-400 font-bold">✓ Minimum met</span>` : `<span class="text-amber-400 font-bold">⚠ Minimum not met</span>`;
    const locDisabled = (plan.id !== 'chain' && plan.id !== 'enterprise') ? 'disabled' : '';

    container.innerHTML = `
        <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">🧮 Cost Calculator</h3>
                    <p class="text-[10px] text-slate-400">Live estimate for ${plan.name} · ${b2b2cTerms.find(t => t.months === pricingState.selectedTerm)?.label}</p>
                </div>
                <span class="text-xs font-mono font-bold ${accent} bg-slate-900 border ${accentBorder} px-2.5 py-1 rounded-lg">${plan.icon} ${plan.name}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Total Children</label>
                    <input type="number" min="1" value="${pricingState.childCount}" oninput="updatePricingInput('childCount', this.value)"
                           class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Locations</label>
                    <input type="number" min="1" value="${pricingState.locationCount}" oninput="updatePricingInput('locationCount', this.value)" ${locDisabled}
                           class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-40">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Term</label>
                    <select onchange="setPricingTerm(parseInt(this.value, 10))" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500">
                        ${b2b2cTerms.map(t => `<option value="${t.months}" ${pricingState.selectedTerm === t.months ? 'selected' : ''}>${t.label}${t.recommended ? ' (best value)' : ''}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div class="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <p class="text-[9px] uppercase font-bold text-slate-500">Per Child</p>
                    <p class="text-sm font-black text-white mt-1">${cost.perChild === 0 ? 'Free' : `RM ${cost.perChild.toFixed(2)}`}</p>
                    <p class="text-[9px] text-slate-500 font-mono">${pricingState.selectedTerm === 12 ? '/yr' : (pricingState.selectedTerm === 3 ? '/qtr' : '/mo')}</p>
                </div>
                <div class="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <p class="text-[9px] uppercase font-bold text-slate-500">Monthly</p>
                    <p class="text-sm font-black ${accent} mt-1">${fmtRM(cost.monthlyTotal)}</p>
                    <p class="text-[9px] text-slate-500 font-mono">per month</p>
                </div>
                <div class="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <p class="text-[9px] uppercase font-bold ${accent}">Annual Total</p>
                    <p class="text-lg font-black text-white mt-1">${fmtRM(cost.annualTotal)}</p>
                    <p class="text-[9px] text-slate-500 font-mono">per year</p>
                </div>
                <div class="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <p class="text-[9px] uppercase font-bold text-slate-500">Minimum</p>
                    <p class="text-sm font-black text-white mt-1">${cost.minRequired > 0 ? fmtRM(cost.minRequired) : 'None'}</p>
                    <p class="text-[9px] font-mono">${minMetHtml}</p>
                </div>
            </div>
        </div>`;
}

/* ── Render: parent benefit ───────────────────────────────── */
function renderParentBenefit() {
    const container = document.getElementById('pricing-parent-benefit');
    if (!container) return;
    const kids = pricingState.childCount;
    const annualValue = kids * parentBenefit.valuePerChild;

    container.innerHTML = `
        <div class="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
            <div class="flex items-start gap-3">
                <span class="text-3xl">🎁</span>
                <div class="flex-1">
                    <h3 class="text-sm font-black text-white">${parentBenefit.headline}</h3>
                    <p class="text-[11px] text-slate-300 mt-1">${parentBenefit.description}</p>
                </div>
                <div class="text-right shrink-0">
                    <p class="text-[10px] uppercase font-bold text-emerald-400">Value to your parents</p>
                    <p class="text-2xl font-black text-emerald-400">${fmtRM(annualValue)}</p>
                    <p class="text-[10px] font-mono text-slate-400">${kids} × ${fmtRM(parentBenefit.valuePerChild)}/year</p>
                </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-[10px]">
                ${parentBenefit.features.map(f => `
                    <div class="bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5">
                        <p class="text-[9px] text-slate-400">${f.name}</p>
                        <p class="font-bold text-emerald-400 font-mono">${f.value}</p>
                    </div>`).join('')}
            </div>
        </div>`;
}

/* ── Render: feature matrix ───────────────────────────────── */
function renderFeatureMatrix() {
    const container = document.getElementById('pricing-feature-matrix');
    if (!container) return;
    const cell = (v) => {
        if (v === true)  return `<span class="text-emerald-400 font-bold">✓</span>`;
        if (v === false) return `<span class="text-slate-600">×</span>`;
        return `<span class="text-[10px] font-mono text-slate-300">${v}</span>`;
    };

    container.innerHTML = featureMatrix.map((group, gi) => `
        <details class="group bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden" ${gi < 2 ? 'open' : ''}>
            <summary class="cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-slate-900/60 transition select-none">
                <span class="text-xs font-bold text-white">${group.group}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono text-slate-500">${group.rows.length} features</span>
                    <svg class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
            </summary>
            <div class="border-t border-slate-800 overflow-x-auto custom-scrollbar">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-900/80 text-[9px] font-extrabold uppercase text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="py-2 px-3">#</th>
                            <th class="py-2 px-3">Feature</th>
                            <th class="py-2 px-3 text-center text-slate-300">Trial</th>
                            <th class="py-2 px-3 text-center text-emerald-400">Standard</th>
                            <th class="py-2 px-3 text-center text-indigo-400">Chain</th>
                            <th class="py-2 px-3 text-center text-purple-400">Enterprise</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60 font-medium text-[11px]">
                        ${group.rows.map(r => `
                            <tr class="hover:bg-slate-900/40">
                                <td class="py-1.5 px-3 font-mono text-slate-500 text-[10px]">${r.id}</td>
                                <td class="py-1.5 px-3 text-slate-200">${r.label}</td>
                                <td class="py-1.5 px-3 text-center">${cell(r.trial)}</td>
                                <td class="py-1.5 px-3 text-center">${cell(r.standard)}</td>
                                <td class="py-1.5 px-3 text-center">${cell(r.chain)}</td>
                                <td class="py-1.5 px-3 text-center">${cell(r.enterprise)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </details>`).join('');
}

/* ── Render: billing rules ────────────────────────────────── */
function renderBillingRules() {
    const container = document.getElementById('pricing-billing-rules');
    if (!container) return;
    container.innerHTML = `
        <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">📋 Billing Rules (Institution / Organization)</h3>
            <div class="space-y-1.5">
                ${billingRules.map(r => `
                    <div class="flex items-start gap-2 text-[11px]">
                        <span class="shrink-0 text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">${r.term}</span>
                        <span class="text-slate-300">${r.rule}</span>
                    </div>`).join('')}
            </div>
        </div>`;
}

/* ── Public render entry ──────────────────────────────────── */
export function renderPricingPage() {
    renderPricingTermBar();
    renderPlanCards();
    renderCalculator();
    renderParentBenefit();
    renderFeatureMatrix();
    renderBillingRules();
}

/* ── Public handlers ──────────────────────────────────────── */
export function setPricingTerm(months) {
    pricingState.selectedTerm = months;
    renderPricingPage();
}

export function selectPricingPlan(planId) {
    pricingState.selectedPlan = planId;
    renderPricingPage();
}

export function updatePricingInput(field, value) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) return;
    pricingState[field] = num;
    renderPricingPage();
}

export function handleSubscribeClick(planId) {
    const plan = b2b2cPlans.find(p => p.id === planId);
    if (!plan) return;
    const term = b2b2cTerms.find(t => t.months === pricingState.selectedTerm);
    const cost = calculateCost(planId, pricingState.selectedTerm, pricingState.childCount, pricingState.locationCount);

    let msg;
    if (planId === 'trial') {
        msg = `🎁 Start Trial?\n\nPlan: ${plan.name} · 7 days\nChildren: ${pricingState.childCount}\n\n(This is a mockup — no real signup flow yet.)`;
    } else if (planId === 'enterprise') {
        msg = `📞 Request Quote?\n\nPlan: ${plan.name} · ${term.label}\nChildren: ${pricingState.childCount}\nLocations: ${pricingState.locationCount}\nEstimated annual: ${fmtRM(cost.annualTotal)}\n\n(This is a mockup — no real sales flow yet.)`;
    } else {
        msg = `💳 Choose ${plan.name}?\n\nTerm: ${term.label}\nChildren: ${pricingState.childCount}\nLocations: ${pricingState.locationCount}\nMonthly: ${fmtRM(cost.monthlyTotal)}\nAnnual: ${fmtRM(cost.annualTotal)}\n\n(This is a mockup — no real checkout yet.)`;
    }
    alert(msg);
}

/* ── Init ─────────────────────────────────────────────────── */
export function initPricing() {
    renderPricingPage();
}
