import { state } from '../state/store.js';
import { renderStarRatingSvg, renderSdgBadges, getTodayDateString, getMaxCalendarDateString } from '../utils/helpers.js';

export function renderProgramsPage() {
    const isBm = state.currentLang === 'bm';
    const todayDateStr = getTodayDateString();
    const maxDateStr = getMaxCalendarDateString();
    
    let addProgramPanelHtml = '';
    if (state.currentUserRole === 'partner') {
        addProgramPanelHtml = `
            <div class="bg-white rounded-xl p-4 shadow-sm border border-indigo-200 space-y-3">
                <h3 class="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
                    <span>➕ ${isBm ? 'Tambah Program / Aktiviti Baru' : 'Add New Program / Activity'} (${state.userProfiles.partner.orgName})</span>
                </h3>
                <div class="space-y-2.5 text-xs">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">1. ${isBm ? 'Pilih Kategori Program' : 'Choose Category'}</label>
                        <select id="market-prog-category" onchange="window.toggleMarketCustomCategoryInput(this.value)" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                            <option value="Environment">Environment</option>
                            <option value="Physical & Sports">Physical & Sports</option>
                            <option value="Nutrition and Health">Nutrition and Health</option>
                            <option value="Community & Leadership">Community & Leadership</option>
                            <option value="Leadership">Leadership</option>
                            <option value="Others - Please add">Others - Please add</option>
                        </select>
                    </div>
                    <div id="market-custom-category-wrapper" class="hidden">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nyatakan Kategori Lain' : 'Specify Other Category'}</label>
                        <input type="text" id="market-prog-custom-cat" placeholder="Enter custom category" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">2. ${isBm ? 'Nama Program / Aktiviti' : 'Name of Program / Activity'}</label>
                        <input type="text" id="market-prog-name" placeholder="e.g. Junior Green Science Workshop" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="block text-[10px] font-bold text-slate-500 uppercase">3. ${isBm ? 'Ringkasan & Penerangan Program (Maks 150 Kata)' : 'Program Summary & Description (Max 150 Words)'}</label>
                            <span id="word-count-indicator" class="text-[9px] font-bold text-slate-400">0 / 150 words</span>
                        </div>
                        <textarea id="market-prog-desc" rows="3" oninput="window.checkProgramDescriptionWordCount()" placeholder="Enter a brief summary and description of the program/activity (max 150 words)..." class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"></textarea>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">4. ${isBm ? 'Jangka Masa Kalendar (Hingga 12 Bulan)' : 'Calendar Date Range (Within 12 Months)'}</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">From (Today)</span>
                                <input type="date" id="market-prog-start" value="${todayDateStr}" min="${todayDateStr}" max="${maxDateStr}" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold">
                            </div>
                            <div>
                                <span class="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">To (Max 12 Mo)</span>
                                <input type="date" id="market-prog-end" value="${todayDateStr}" min="${todayDateStr}" max="${maxDateStr}" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold">
                            </div>
                        </div>
                    </div>
                    <button onclick="window.handleMarketplaceAddProgram()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow mt-1">
                        + ${isBm ? 'Terbit Program ke Pasaran' : 'Publish Program to Marketplace'}
                    </button>
                </div>
            </div>
        `;
    }

    const searchAndCalendarBox = `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <span class="text-sm">🔍</span>
                <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">${isBm ? 'Carian Program & Aktiviti' : 'Search for Programs & Activities'}</h3>
            </div>
            <div class="space-y-2">
                <input type="text" id="market-search-input" value="${state.marketplaceSearchQuery}" oninput="window.updateMarketplaceFilters()" placeholder="${isBm ? 'Cari program, aktiviti, atau rakan kongsi...' : 'Search programs, activities, or partners...'}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div>
                    <label class="block text-[9px] font-bold text-slate-400 uppercase mb-1">${isBm ? 'Julat Tarikh Program (Hari ini hingga 1 Tahun)' : 'Program Date Range (Today to 1 Year)'}</label>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <span class="text-[9px] text-slate-400 font-semibold block mb-0.5">From (Today)</span>
                            <input type="date" id="market-filter-start" value="${state.marketplaceStartDate}" min="${todayDateStr}" max="${maxDateStr}" onchange="window.updateMarketplaceFilters()" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">
                        </div>
                        <div>
                            <span class="text-[9px] text-slate-400 font-semibold block mb-0.5">To (1 Year Max)</span>
                            <input type="date" id="market-filter-end" value="${state.marketplaceEndDate}" min="${todayDateStr}" max="${maxDateStr}" onchange="window.updateMarketplaceFilters()" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const filteredPrograms = state.featuredProgramsList.filter(prog => {
        const matchesQuery = !state.marketplaceSearchQuery || 
            prog.title.toLowerCase().includes(state.marketplaceSearchQuery) || 
            prog.org.toLowerCase().includes(state.marketplaceSearchQuery) || 
            prog.category.toLowerCase().includes(state.marketplaceSearchQuery) || 
            prog.desc.toLowerCase().includes(state.marketplaceSearchQuery);
        const matchesDate = (!state.marketplaceStartDate || prog.endDate >= state.marketplaceStartDate) && 
                            (!state.marketplaceEndDate || prog.startDate <= state.marketplaceEndDate);
        return matchesQuery && matchesDate;
    });

    const programCards = filteredPrograms.length > 0 ? filteredPrograms.map((prog) => `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2.5">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">${prog.category}</span>
                    <h3 class="text-xs font-bold text-slate-900 mt-1">${prog.title}</h3>
                    <p class="text-[10px] text-indigo-600 font-semibold">🏢 ${prog.org}</p>
                </div>
                <span class="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">${prog.badge}</span>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Organization Rating:</span>
                    ${renderStarRatingSvg(prog.rating || 5, prog.ratingScore || "5.0")}
                </div>
                <div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Covered UN SDGs:</span>
                    <div class="flex flex-wrap gap-1">
                        ${renderSdgBadges(prog.sdgs || [2, 3, 4])}
                    </div>
                </div>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">${prog.desc}</p>
            <div class="text-[10px] text-slate-400 font-mono">
                📅 ${prog.startDate} to ${prog.endDate}
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                <span class="text-slate-500">👥 <strong>${prog.slots}</strong> • 🪙 <strong class="text-amber-600">${prog.reward}</strong></span>
                <button onclick="window.openProgramChildSelector('${prog.title.replace(/'/g, "\\'")}', '${prog.org.replace(/'/g, "\\'")}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-xs">
                    ${isBm ? 'Mohon Sekarang →' : 'Apply Now →'}
                </button>
            </div>
        </div>
    `).join('') : `
        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <p class="text-xs text-slate-500 font-bold">${isBm ? 'Tiada program dijumpai mengikut kriteria carian anda.' : 'No programs found matching your search criteria.'}</p>
        </div>
    `;

    return `
        <div class="bg-gradient-to-br from-indigo-800 to-blue-900 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <span class="bg-blue-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Partner Marketplace</span>
            <h2 class="text-xl font-bold">${isBm ? 'Program & Aktiviti Rakan Kongsi' : 'Partner Programs & Activities'}</h2>
            <p class="text-xs text-blue-100">${isBm ? 'Teroka dan mohon program ESG, bengkel, dan aktiviti kanak-kanak yang diiklankan oleh rakan institusi.' : 'Browse and apply for advertised ESG programs, workshops, and children activities from institutional partners.'}</p>
        </div>
        ${searchAndCalendarBox}
        ${addProgramPanelHtml}
        <div class="space-y-3">
            ${programCards}
        </div>
    `;
}
