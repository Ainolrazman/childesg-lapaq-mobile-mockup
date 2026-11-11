import { state } from '../state/store.js';

export function renderChildProfile(childKey) {
    const child = state.childrenData[childKey];
    const isBm = state.currentLang === 'bm';
    
    const orgOptions = Object.keys(state.organizationCoursesMap).map(org => `<option value="${org}">${org}</option>`).join('');

    return `
        <div class="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg space-y-3">
            <div class="flex justify-between items-center border-b border-indigo-400/30 pb-2.5">
                <span class="bg-indigo-400/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Profil Kanak-kanak' : 'Children Profile Dashboard'}</span>
                <select onchange="window.switchChildView(this.value)" class="bg-white text-indigo-900 text-xs font-extrabold px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                    <option value="adam" ${childKey === 'adam' ? 'selected' : ''}>👦 Adam (8 Yrs)</option>
                    <option value="maya" ${childKey === 'maya' ? 'selected' : ''}>👧 Maya (5 Yrs)</option>
                </select>
            </div>
            <div>
                <h2 class="text-xl font-bold">${child.name} ${isBm ? 'Pasport & Kaunter Aktiviti' : "'s Passport & Activity Counters"}</h2>
                <p class="text-xs text-indigo-100">${child.age} • ${child.school} • Token: <span class="font-mono bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-200">${child.token}</span></p>
            </div>
        </div>

        <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-xl border border-indigo-500/30 space-y-3 relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div class="flex justify-between items-center border-b border-indigo-500/30 pb-2.5">
                <div>
                    <span class="text-[9px] uppercase font-extrabold text-indigo-400 tracking-wider">${isBm ? 'Identiti Digital Sepanjang Hayat' : 'Lifelong Digital Identity'}</span>
                    <h3 class="text-sm font-bold text-white flex items-center">🛡️ ChildESG Passport™ Ledger</h3>
                </div>
                <div class="text-right">
                    <span class="text-xl font-black text-emerald-400">${child.impactScore}</span><span class="text-[10px] text-slate-400">/100</span>
                    <p class="text-[8px] text-indigo-300 uppercase font-bold">${isBm ? 'Impak Keseluruhan' : 'Overall Impact'}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span class="text-[9px] text-slate-400 uppercase font-bold block">${isBm ? 'Khidmat Sukarela' : 'Volunteer & Service'}</span>
                    <strong class="text-amber-400 text-sm font-black">${child.volunteerHours} hrs</strong>
                </div>
                <div class="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span class="text-[9px] text-slate-400 uppercase font-bold block">${isBm ? 'Kursus Pembelajaran ESG' : 'ESG Learning Courses'}</span>
                    <strong class="text-teal-400 text-sm font-black">${child.esgCoursesCount} ${isBm ? 'Selesai' : 'Completed'}</strong>
                </div>
                <div class="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span class="text-[9px] text-slate-400 uppercase font-bold block">${isBm ? 'Tindakan SDG' : 'SDG Actions Logged'}</span>
                    <strong class="text-blue-400 text-sm font-black">${child.sdgActionsCount} ${isBm ? 'Tindakan' : 'Actions'}</strong>
                </div>
                <div class="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span class="text-[9px] text-slate-400 uppercase font-bold block">${isBm ? 'Lencana Kepimpinan' : 'Leadership Badges'}</span>
                    <strong class="text-purple-400 text-sm font-black">${child.leadershipBadges} ${isBm ? 'Lencana' : 'Badges'}</strong>
                </div>
            </div>
            <div class="pt-1 text-center">
                <span class="text-[9px] text-indigo-300 font-mono">🔒 ${isBm ? 'Disahkan pada Hash Lejar: 0x89F...34A2' : 'Verified on Immutable Ledger Hash: 0x89F...34A2'}</span>
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">📝 ${isBm ? 'Mohon Kursus / Aktiviti Baru' : 'Apply for New Course / Activities'}</h3>
            <p class="text-[10px] text-slate-500">${isBm ? 'Anda juga boleh meneroka senarai lengkap program di menu "Program Rakan Kongsi" (ikon ☰ atas).' : 'You can also browse the full advertised catalog in the menu (top-left ☰ icon).'}</p>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Senarai Organisasi' : 'List of Organization'}</label>
                <select id="apply-org-select" onchange="window.updateCourseDropdown(this.value)" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                    ${orgOptions}
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Senarai Kursus / Aktiviti' : 'List of Courses / Activities'}</label>
                <select id="apply-course-select" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"></select>
            </div>
            <button onclick="window.submitNewCourseApplication()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow">
                + ${isBm ? 'Mohon & Daftar Kursus' : 'Apply & Register Course'}
            </button>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">📋 ${isBm ? 'Senarai Kursus / Aktiviti Dipohon' : 'List course/Activity Applied'}</h3>
            <div class="space-y-2">
                ${child.appliedCourses && child.appliedCourses.length > 0 ? child.appliedCourses.map(ac => {
                    let badge = ac.status === 'Approved'
                        ? `<span class="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ ${isBm ? 'Diluluskan' : 'Approved'}</span>`
                        : `<span class="text-[9px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">⏳ ${isBm ? 'Menunggu Kelulusan' : 'Pending Approval'}</span>`;
                    return `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                            <div>
                                <p class="font-bold text-slate-800">${ac.name}</p>
                                <p class="text-[10px] text-slate-500">Org: ${ac.org}</p>
                            </div>
                            <div>${badge}</div>
                        </div>
                    `;
                }).join('') : `<p class="text-xs text-slate-400 italic">${isBm ? 'Tiada permohonan kursus dihantar lagi.' : 'No course or activity applications submitted yet.'}</p>`}
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">📚 ${isBm ? 'Senarai Kursus Dihadiri' : 'List of Courses Attended'}</h3>
            <div class="space-y-2">
                ${child.courses && child.courses.length > 0 ? child.courses.map(c => {
                    let starsStr = '⭐'.repeat(c.stars) + '☆'.repeat(5 - c.stars);
                    let statusText = c.status === 'Completed' ? (isBm ? 'Selesai' : 'Completed') : (isBm ? 'Aktif' : 'Active');
                    return `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                            <div class="flex justify-between items-center">
                                <p class="text-xs font-bold text-slate-800">${c.name}</p>
                                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}">${statusText}</span>
                            </div>
                            <div class="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>${isBm ? 'Kehadiran:' : 'Attendance:'} <strong class="text-emerald-600">${c.attendance}</strong></span>
                                <span class="text-amber-500 font-bold">${starsStr} (${c.stars}/5)</span>
                            </div>
                        </div>
                    `;
                }).join('') : `<p class="text-xs text-slate-400 italic">${isBm ? 'Tiada kursus dihadiri lagi.' : 'No courses attended yet.'}</p>`}
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold text-slate-800">🏃 ${isBm ? 'Impak (Permainan Fizikal)' : 'Impact (Physical Play)'}</span><span class="text-xs font-extrabold text-amber-600">${child.impactTokens} Tokens</span></div>
            <p class="text-[10px] text-slate-500">${isBm ? 'Jam Aktif:' : 'Active Hours:'} <strong class="text-slate-800">${child.activeHours} hrs</strong></p>
            <button onclick="window.openLiveScannerModal('Physical Play')" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs transition mt-1">📷 ${isBm ? 'Imbas QR Rakan Kongsi (Fizikal)' : 'Scan Partner QR for Physical Play'}</button>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold text-slate-800">🌱 ${isBm ? 'Tabiat Eko (Sifar Sisa)' : 'Eco-Habits (Zero Waste)'}</span><span class="text-xs font-extrabold text-teal-600">${child.ecoTokens} Tokens</span></div>
            <p class="text-[10px] text-slate-500">${isBm ? 'Sisa Makanan Dialih Keluar:' : 'Food Waste Diverted:'} <strong class="text-emerald-600">${child.foodWasteKg} kg</strong></p>
            <button onclick="window.openLiveScannerModal('Eco Zero Waste')" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs transition mt-1">📷 ${isBm ? 'Imbas QR Rakan Kongsi (Sifar Sisa)' : 'Scan Partner QR for Zero Waste'}</button>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold text-slate-800">🥗 ${isBm ? 'Token Pemakanan' : 'Nutrition Tokens'}</span><span class="text-xs font-extrabold text-emerald-600">${child.nutritionTokens} Tokens</span></div>
            <button onclick="window.switchTab('lapaq')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition">${isBm ? 'Lihat Analisis RNI LaPaQ →' : 'View LaPaQ RNI Analytics →'}</button>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold text-slate-800">📚 ${isBm ? 'Kehadiran Aktiviti' : 'Activity Attendance'}</span><span class="text-xs font-extrabold text-blue-600">${child.activityTokens} Tokens</span></div>
            <p class="text-[10px] text-slate-500">${isBm ? 'Jam Kehadiran:' : 'Attendance Hours:'} <strong class="text-slate-800">${child.activityHours} hrs</strong></p>
            <button onclick="window.openLiveScannerModal('Activity Attendance')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition mt-1">📷 ${isBm ? 'Imbas QR Rakan Kongsi (Kehadiran)' : 'Scan Partner QR for Attendance'}</button>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold text-slate-800">🤝 ${isBm ? 'Komuniti & Kepimpinan' : 'Community & Leadership'}</span><span class="text-xs font-extrabold text-purple-600">${child.communityTokens} Tokens</span></div>
            <p class="text-[10px] text-slate-500">${isBm ? 'Dinilai melalui pemuka penganjur organisasi & rakan sebaya.' : 'Rated via Partner Organization Dashboard organizer & peers.'}</p>
        </div>
    `;
}
