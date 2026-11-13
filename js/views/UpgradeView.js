// js/views/UpgradeView.js — B2C Mobile Pricing View

import { currencies, b2cPlans } from '../../data/pricing-b2c.js';

const b2cState = {
    currency: 'MYR',
    selectedTerm: 12 // Default to yearly
};

function fmtPrice(amount, currency) {
    if (amount === 0) return 'Free';
    if (currency === 'MYR') return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (currency === 'USD') return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (currency === 'IDR') return `IDR ${Math.round(amount).toLocaleString('en-US')}`;
    return amount.toString();
}

function renderCurrencySwitcher() {
    return `
        <div class="flex justify-center gap-2 mb-6">
            ${currencies.map(c => `
                <button type="button" onclick="window.setB2CCurrency('${c.code}')"
                        class="px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1
                        ${b2cState.currency === c.code ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}">
                    <span>${c.flag}</span> ${c.code}
                </button>
            `).join('')}
        </div>
    `;
}

function renderTermSwitcher() {
    const terms = [
        { months: 1, label: 'Monthly' },
        { months: 3, label: 'Quarterly', save: 'Save 16%' },
        { months: 12, label: 'Yearly', save: 'Save 33%' }
    ];
    
    return `
        <div class="flex bg-slate-100 p-1 rounded-2xl mb-8">
            ${terms.map(t => `
                <button type="button" onclick="window.setB2CTerm(${t.months})"
                        class="flex-1 py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center
                        ${b2cState.selectedTerm === t.months ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
                    <span>${t.label}</span>
                    ${t.save ? `<span class="text-[9px] font-medium ${b2cState.selectedTerm === t.months ? 'text-emerald-600' : 'text-slate-400'}">${t.save}</span>` : ''}
                </button>
            `).join('')}
        </div>
    `;
}

function renderPlanCards() {
    return b2cPlans.map(plan => {
        const isPaid = plan.id !== 'free';
        const termPrice = plan.pricing[b2cState.currency][b2cState.selectedTerm];
        const monthlyEquiv = isPaid ? (termPrice / b2cState.selectedTerm) : 0;
        
        const isPlus = plan.id === 'plus';
        const borderClass = isPlus ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200';
        
        return `
            <div class="relative bg-white rounded-3xl p-5 mb-4 border ${borderClass} shadow-sm">
                ${plan.badge ? `
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        ${plan.badge}
                    </div>
                ` : ''}
                
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
                        ${plan.icon}
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-slate-900">${plan.name}</h3>
                        <p class="text-xs text-slate-500 font-medium">${plan.tagline}</p>
                    </div>
                </div>

                <div class="mb-6">
                    ${isPaid ? `
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black text-slate-900">${fmtPrice(termPrice, b2cState.currency)}</span>
                            <span class="text-xs font-semibold text-slate-500">/${b2cState.selectedTerm === 12 ? 'yr' : (b2cState.selectedTerm === 3 ? 'qtr' : 'mo')}</span>
                        </div>
                        ${b2cState.selectedTerm !== 1 ? `
                            <p class="text-[11px] text-slate-400 font-mono mt-1">
                                ≈ ${fmtPrice(monthlyEquiv, b2cState.currency)} / month
                            </p>
                        ` : ''}
                    ` : `
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black text-slate-900">Free</span>
                            <span class="text-xs font-semibold text-slate-500">forever</span>
                        </div>
                    `}
                </div>

                <div class="space-y-2 mb-6">
                    <div class="flex items-center gap-2 text-xs text-slate-700">
                        <span class="text-emerald-500">✓</span> <span><strong>${plan.features.childProfiles}</strong> child profile(s)</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-700">
                        <span class="text-emerald-500">✓</span> <span><strong>${plan.features.mealHistory}</strong> meal history</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-700">
                        <span class="text-emerald-500">✓</span> <span><strong>${plan.features.rniBars}</strong> RNI nutrient bars</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-700">
                        <span class="text-emerald-500">✓</span> <span>Earn <strong>${plan.features.tokenEarn}</strong> tokens</span>
                    </div>
                </div>

                <button type="button" 
                        onclick="window.handleB2CSubscribe('${plan.id}')"
                        class="w-full py-3.5 rounded-xl text-sm font-bold transition
                        ${isPlus ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 
                                  (isPaid ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700')}">
                    ${isPaid ? `Choose ${plan.name}` : 'Current Plan'}
                </button>
            </div>
        `;
    }).join('');
}

function renderFeatureMatrix() {
    const features = [
        { label: 'Child Profiles', key: 'childProfiles' },
        { label: 'Meal History', key: 'mealHistory' },
        { label: 'RNI Nutrient Bars', key: 'rniBars' },
        { label: 'Health Advice', key: 'advice' },
        { label: '7-Day Meal Plan', key: 'mealPlan' },
        { label: 'AI Nutrition Coach', key: 'aiCoach' },
        { label: 'Daily Token Earn', key: 'tokenEarn' },
        { label: 'Token Rollover', key: 'tokenRollover' },
        { label: 'Nutritionist Booking', key: 'priorityBooking' }
    ];

    return `
        <div class="mt-8 border border-slate-200 rounded-3xl overflow-hidden bg-white">
            <div class="grid grid-cols-4 bg-slate-50 border-b border-slate-200 p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                <div class="text-left pl-2">Feature</div>
                <div class="text-slate-500">Free</div>
                <div class="text-emerald-600">Plus</div>
                <div class="text-indigo-600">Family</div>
            </div>
            <div class="divide-y divide-slate-100">
                ${features.map(f => `
                    <div class="grid grid-cols-4 p-3 text-xs text-center items-center">
                        <div class="text-left pl-2 font-semibold text-slate-700">${f.label}</div>
                        <div class="text-slate-400 text-[10px]">${b2cPlans[0].features[f.key]}</div>
                        <div class="text-emerald-700 font-bold text-[10px]">${b2cPlans[1].features[f.key]}</div>
                        <div class="text-indigo-700 font-bold text-[10px]">${b2cPlans[2].features[f.key]}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/* ── Main Render Function (Returns String) ────────────────── */
export function renderUpgradeView() {
    return `
        <div class="p-6 pb-24">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-black text-slate-900 mb-2">Upgrade Your Plan</h1>
                <p class="text-sm text-slate-500">Unlock advanced nutrition tracking, meal plans, and AI coaching for your child.</p>
            </div>

            ${renderCurrencySwitcher()}
            ${renderTermSwitcher()}
            
            <div class="space-y-4">
                ${renderPlanCards()}
            </div>

            <div class="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                <span class="text-2xl">🏫</span>
                <div>
                    <h4 class="text-sm font-bold text-blue-900 mb-1">Is your school partnered with us?</h4>
                    <p class="text-[11px] text-blue-700 leading-relaxed">If your child's institution is a Kemaih partner, you get the <strong>Plus</strong> tier completely free. Ask your school admin for your parent access code.</p>
                </div>
            </div>

            ${renderFeatureMatrix()}
        </div>
    `;
}

/* ── Handlers ─────────────────────────────────────────────── */
export function setB2CCurrency(code) {
    b2cState.currency = code;
    window.switchTab('upgrade');
}

export function setB2CTerm(months) {
    b2cState.selectedTerm = months;
    window.switchTab('upgrade');
}

export function handleB2CSubscribe(planId) {
    const plan = b2cPlans.find(p => p.id === planId);
    if (!plan) return;
    
    if (planId === 'free') {
        alert("You are currently on the Free plan.");
        return;
    }

    const price = plan.pricing[b2cState.currency][b2cState.selectedTerm];
    const termLabel = b2cState.selectedTerm === 12 ? '1 Year' : (b2cState.selectedTerm === 3 ? '3 Months' : '1 Month');
    
    alert(
        `💳 Proceed to Checkout?\n\n` +
        `Plan: ${plan.name}\n` +
        `Term: ${termLabel}\n` +
        `Total: ${fmtPrice(price, b2cState.currency)}\n\n` +
        `(Mockup — no real payment gateway yet)`
    );
}
