import { state } from '../state/store.js';
import { t } from '../state/i18n.js';

export function renderBottomNav() {
    const isRegisterActive = state.activeTabKey === 'layer1';
    const isHomeActive = state.activeTabKey === 'home';

    return `
        <nav class="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around items-center shrink-0 z-40">
            <button onclick="window.switchTab('layer1')" id="nav-layer1" class="flex flex-col items-center py-1 px-3 ${isRegisterActive ? 'text-emerald-600' : 'text-slate-400'} hover:text-slate-600 transition-all">
                <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                <span id="nav-label-register" class="text-[9px] font-bold">${t(state.currentLang, 'register')}</span>
            </button>
            
            <button onclick="window.openRoleDashboard()" class="flex flex-col items-center group py-0.5 px-2 transition-all" title="Open Role Dashboard">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                    🌍
                </div>
                <span class="text-[9px] font-extrabold text-indigo-700 mt-0.5">Dashboard</span>
            </button>

            <button onclick="window.switchTab('home')" id="nav-home" class="flex flex-col items-center py-1 px-3 ${isHomeActive ? 'text-emerald-600' : 'text-slate-400'} hover:text-slate-600 transition-all">
                <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span id="nav-label-home" class="text-[9px] font-bold">${t(state.currentLang, 'home')}</span>
            </button>
        </nav>
    `;
}
