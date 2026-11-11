export function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getMaxCalendarDateString() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function renderStarRatingSvg(rating, scoreText) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        const fillClass = i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-200';
        starsHtml += `<svg class="w-3.5 h-3.5 ${fillClass}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    return `
        <div class="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
            <div class="flex space-x-0.5">${starsHtml}</div>
            <span class="text-[11px] font-black text-amber-800 ml-0.5">${scoreText}</span>
        </div>
    `;
}

export function renderSdgBadges(sdgIds) {
    const sdgInfoMap = {
        2: { code: "SDG 2", title: "Zero Hunger", color: "bg-amber-100 text-amber-800 border-amber-300" },
        3: { code: "SDG 3", title: "Good Health & Well-being", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
        4: { code: "SDG 4", title: "Quality Education", color: "bg-red-100 text-red-800 border-red-300" },
        10: { code: "SDG 10", title: "Reduced Inequalities", color: "bg-pink-100 text-pink-800 border-pink-300" },
        12: { code: "SDG 12", title: "Responsible Consumption", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
        13: { code: "SDG 13", title: "Climate Action", color: "bg-green-100 text-green-800 border-green-300" },
        15: { code: "SDG 15", title: "Life on Land", color: "bg-lime-100 text-lime-800 border-lime-300" },
        17: { code: "SDG 17", title: "Partnerships for the Goals", color: "bg-blue-100 text-blue-800 border-blue-300" }
    };
    return sdgIds.map(id => {
        const s = sdgInfoMap[id] || { code: `SDG ${id}`, title: `SDG ${id}`, color: "bg-slate-100 text-slate-800 border-slate-300" };
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${s.color}" title="${s.title}">🌍 ${s.code}</span>`;
    }).join('');
}

export function showModalOverlay(title, message, callback) {
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');
    const overlay = document.getElementById('custom-modal-overlay');
    if (titleEl && msgEl && overlay) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        overlay.classList.remove('hidden');
    }
}

export function closeModalOverlay() {
    const overlay = document.getElementById('custom-modal-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        if (window.switchTab) window.switchTab('home');
    }
}

export const malaysiaStatesOptions = `
    <option>W.P. Kuala Lumpur / Selangor</option>
    <option>Johor</option>
    <option>Kedah</option>
    <option>Kelantan</option>
    <option>Melaka</option>
    <option>Negeri Sembilan</option>
    <option>Pahang</option>
    <option>Penang</option>
    <option>Perak</option>
    <option>Perlis</option>
    <option>Sabah</option>
    <option>Sarawak</option>
    <option>Terengganu</option>
    <option>W.P. Labuan</option>
    <option>W.P. Putrajaya</option>
`;
