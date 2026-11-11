import { state } from '../state/store.js';
import { t } from '../state/i18n.js';

export function renderHeader() {
    const isBm = state.currentLang === 'bm';

    return `
        <!-- Top Status Bar Mock (Dynamic Local Time) -->
        <div class="bg-slate-900 text-white px-6 py-2.5 flex justify-between items-center text-xs font-semibold shrink-0 z-20">
            <span id="status-bar-time">--:--</span>
            <div class="w-20 h-4 bg-slate-800 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 hidden sm:block"></div>
            <div class="flex space-x-1.5 items-center">
                <span>5G</span>
                <div class="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
                    <div class="w-full h-full bg-white rounded-2xs"></div>
                </div>
            </div>
        </div>

        <!-- App Header with Hamburger Menu, Flags Toggle, and Notification Bell -->
        <header class="bg-white border-b border-slate-200 px-3 py-2.5 flex justify-between items-center shrink-0 z-30 shadow-xs relative">
            <div class="flex items-center space-x-2">
                <button onclick="window.toggleMenuDrawer()" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center justify-center" title="More Menu Choices">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <div class="overflow-hidden pr-1">
                    <span class="text-[9px] font-bold tracking-wider text-blue-600 uppercase block">ChildESG™ Mobile</span>
                    <h1 id="app-title" class="text-xs font-bold text-slate-900 truncate">Registration Gateway</h1>
                </div>
            </div>
            
            <div class="flex items-center space-x-1.5 shrink-0">
                <div class="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                    <button onclick="window.setLanguage('en')" id="lang-btn-en" class="px-2 py-1 text-[10px] font-bold rounded-md transition ${!isBm ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'} flex items-center space-x-1">
                        <span>🇬🇧</span>
                        <span>EN</span>
                    </button>
                    <button onclick="window.setLanguage('bm')" id="lang-btn-bm" class="px-2 py-1 text-[10px] font-bold rounded-md transition ${isBm ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'} flex items-center space-x-1">
                        <span>🇲🇾</span>
                        <span>BM</span>
                    </button>
                </div>
                
                <!-- Notification / Message Bell -->
                <button onclick="window.openNotificationsModal()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition relative flex items-center justify-center" title="Notifications">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    <span id="notification-badge" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">3</span>
                </button>
            </div>
        </header>
    `;
}

export function renderDrawer() {
    const isBm = state.currentLang === 'bm';
    return `
        <div id="nav-drawer-overlay" class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 hidden transition-opacity" onclick="window.toggleMenuDrawer()">
            <div id="nav-drawer-content" class="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col p-5 space-y-4 transform -translate-x-full transition-transform duration-300" onclick="event.stopPropagation()">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                        <span class="text-[10px] font-bold text-blue-600 uppercase block">ChildESG™ Platform</span>
                        <h3 class="text-sm font-bold text-slate-900" id="drawer-menu-title">${t(state.currentLang, 'menuTitle')}</h3>
                    </div>
                    <button onclick="window.toggleMenuDrawer()" class="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs">✕</button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-1.5 text-xs font-semibold text-slate-700">
                    <button onclick="window.switchTab('programs'); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition">
                        <span>🏷️</span>
                        <span id="menu-item-programs">${t(state.currentLang, 'menu.programs')}</span>
                    </button>
                    <button onclick="window.switchTab('lapaq'); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition">
                        <span>🥗</span>
                        <span id="menu-item-lapaq">${t(state.currentLang, 'menu.lapaq')}</span>
                    </button>
                    <button onclick="window.switchTab('sdg'); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-3 transition">
                        <span>🌍</span>
                        <span id="menu-item-sdg">${t(state.currentLang, 'menu.sdg')}</span>
                    </button>
                    <button onclick="window.switchTab('scanner'); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition">
                        <span>📷</span>
                        <span id="menu-item-scanner">${t(state.currentLang, 'menu.scanner')}</span>
                    </button>
                    <button onclick="window.switchTab('tokens'); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition">
                        <span>🪙</span>
                        <span id="menu-item-tokens">${t(state.currentLang, 'menu.tokens')}</span>
                    </button>

                    <a href="./dashboard.html" target="_blank" class="w-full text-left px-3 py-2.5 rounded-xl bg-slate-900 text-blue-400 hover:bg-slate-800 flex items-center space-x-3 transition font-bold mt-2">
                        <span>🖥️</span>
                        <span>${isBm ? 'Hab Eksekutif Desktop' : 'Desktop Executive Hub'}</span>
                    </a>

                    <!-- Logout Button Inside Menu -->
                    <button onclick="window.toggleMenuDrawer(); window.handleMobileLogout();" class="w-full text-left px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 flex items-center space-x-3 transition font-bold border border-rose-500/30">
                        <span>🚪</span>
                        <span>${isBm ? 'Log Keluar' : 'Log Out'}</span>
                    </button>

                    <hr class="border-slate-100 my-2">
                    <button onclick="window.resetDemo(); window.toggleMenuDrawer();" class="w-full text-left px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center space-x-3 transition font-bold">
                        <span>🔄</span>
                        <span id="menu-item-reset">${t(state.currentLang, 'menu.reset')}</span>
                    </button>
                </div>
                <div class="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-mono">
                    ChildESG™ v2.6 • Secure PWA Mobile
                </div>
            </div>
        </div>
    `;
}
