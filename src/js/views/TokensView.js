import { state } from '../state/store.js';

export function renderTokensPage() {
    const child = state.childrenData[state.selectedChild];
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg space-y-3">
            <div class="flex justify-between items-center">
                <span class="bg-amber-400/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Dompet Impak' : 'Impact Wallet Dashboard'}</span>
                <select onchange="window.changeTokenChild(this.value)" class="bg-amber-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg outline-none cursor-pointer">
                    <option value="adam" ${state.selectedChild === 'adam' ? 'selected' : ''}>Adam (8 Yrs)</option>
                    <option value="maya" ${state.selectedChild === 'maya' ? 'selected' : ''}>Maya (5 Yrs)</option>
                </select>
            </div>
            <div class="flex justify-between items-end">
                <div>
                    <h2 class="text-xl font-bold">${child.name}${isBm ? 'Baki Token' : "'s Token Balance"}</h2>
                    <p class="text-xs text-amber-100 mt-0.5">${isBm ? 'Disahkan melalui QR Rakan Kongsi & Analisis LaPaQ' : 'Verified via Partner QR, LaPaQ Intelligence & Organizer Rating'}</p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-extrabold text-white">${child.totalTokens}</span>
                    <p class="text-[9px] text-amber-200 uppercase font-bold">${isBm ? 'Jumlah Token' : 'Total Tokens'}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">🎁 ${isBm ? 'Sistem Pertukaran Ganjaran Token' : 'Token Reward Exchange System'}</h3>
                <span class="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">${isBm ? 'Boleh Ditukar' : 'Redeemable'}</span>
            </div>
            <div class="space-y-2">
                <div class="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                    <div><p class="text-xs font-bold text-slate-800">💻 Apple MacBook Air (M2)</p><p class="text-[10px] text-indigo-600 font-semibold">${isBm ? 'Kos: 100,000 Token' : 'Cost: 100,000 Tokens'}</p></div>
                    <button onclick="window.redeemReward('Apple MacBook Air', 100000)" class="text-[10px] bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold">${isBm ? 'Tukar' : 'Exchange'}</button>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                    <div><p class="text-xs font-bold text-slate-800">🥛 ${isBm ? 'Susu di Jaya Grocer' : 'Pint of Milk at Jaya Grocer'}</p><p class="text-[10px] text-emerald-600 font-semibold">${isBm ? 'Kos: 50 Token' : 'Cost: 50 Tokens'}</p></div>
                    <button onclick="window.redeemReward('Pint of Milk at Jaya Grocer', 50)" class="text-[10px] bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">${isBm ? 'Tukar' : 'Exchange'}</button>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                    <div><p class="text-xs font-bold text-slate-800">🏷️ ${isBm ? 'Vaucer Diskaun 5% Shopee' : '5% Rebate Voucher at Shopee'}</p><p class="text-[10px] text-orange-600 font-semibold">${isBm ? 'Kos: 10 Token' : 'Cost: 10 Tokens'}</p></div>
                    <button onclick="window.redeemReward('5% Rebate Voucher at Shopee', 10)" class="text-[10px] bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold">${isBm ? 'Tukar' : 'Exchange'}</button>
                </div>
            </div>
        </div>
    `;
}
