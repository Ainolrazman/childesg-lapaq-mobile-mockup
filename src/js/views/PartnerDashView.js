import { state } from '../state/store.js';

export function renderPartnerDashboard() {
    if (state.currentPartnerView === 'group_detail') {
        return renderParticipantGroupDetails(state.activeParticipantGroup);
    }
    const isBm = state.currentLang === 'bm';
    
    const subNavButtonsHtml = `
        <div class="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button onclick="window.switchPartnerDashboardLayer('esg')" class="py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${state.partnerDashboardLayer === 'esg' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}">
                <span>🏆</span>
                <span class="truncate">ESG & Cert</span>
            </button>
            <button onclick="window.switchPartnerDashboardLayer('programs')" class="py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${state.partnerDashboardLayer === 'programs' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}">
                <span>📥</span>
                <span class="truncate">Programs & Roster</span>
            </button>
        </div>
    `;

    let layerContentHtml = '';
    if (state.partnerDashboardLayer === 'esg') {
        layerContentHtml = `
            <div class="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-2xl p-4 text-white shadow-lg space-y-3 relative overflow-hidden border border-slate-800">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span class="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700">🏆 Partner Overall Score</span>
                    <span class="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">5-Star Tier</span>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-4xl font-black tracking-tight text-white drop-shadow-sm">82%</span>
                        <p class="text-[11px] text-slate-300 font-semibold mt-0.5">Silver Verified Institution</p>
                    </div>
                    <div class="text-right">
                        <div class="text-xl tracking-tight text-amber-400 drop-shadow">⭐⭐⭐⭐⭐</div>
                        <span class="text-[9px] text-slate-400 font-bold uppercase">80 - 100 Score Rating</span>
                    </div>
                </div>
                <div class="pt-2 border-t border-slate-800 grid grid-cols-5 gap-1 text-center text-[9px] font-semibold text-slate-300">
                    <div class="bg-slate-800/80 rounded p-1">1⭐<br>0-40%</div>
                    <div class="bg-slate-800/80 rounded p-1">2⭐<br>41-50%</div>
                    <div class="bg-slate-800/80 rounded p-1">3⭐<br>51-60%</div>
                    <div class="bg-slate-800/80 rounded p-1">4⭐<br>61-79%</div>
                    <div class="bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold rounded p-1 shadow-xs">5⭐<br>80-100%</div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm border border-indigo-200 space-y-3">
                <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 class="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center">
                        <span>🛡️ ${isBm ? 'Status Kematangan & Pensijilan ESG' : 'ESG Maturity & Certification Status'}</span>
                    </h3>
                    <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Silver Verified (82/100)</span>
                </div>
                <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center text-xs">
                    <div>
                        <p class="font-bold text-indigo-900">Assessment ID: CHILDESG-2025-0515-001</p>
                        <p class="text-[10px] text-indigo-600 mt-0.5">Valid until annual audit cycle • <span class="underline cursor-pointer" onclick="alert('QR Verification Link: https://verify.childesg.my/cert/0515-001')">Verify QR Link</span></p>
                    </div>
                    <span class="text-2xl">🛡️</span>
                </div>
                <div class="space-y-2 pt-1">
                    <span class="text-[10px] font-bold text-slate-500 uppercase block">Certification Tier Breakdown:</span>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                            <p class="font-bold text-slate-800">Level 1: Baseline Assessment</p>
                            <p class="text-[10px] text-slate-500">4–6 pages • Fee: RM699</p>
                        </div>
                        <button onclick="window.openPaymentGateway('Level 1: Baseline Assessment', 'RM699.00')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition shadow-xs">Pay Now →</button>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                            <p class="font-bold text-slate-800">Level 2: Executive Report</p>
                            <p class="text-[10px] text-slate-500">≈15 pages • Fee: RM2,699</p>
                        </div>
                        <button onclick="window.openPaymentGateway('Level 2: Executive Assessment Report', 'RM2,699.00')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition shadow-xs">Pay Now →</button>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                            <p class="font-bold text-slate-800">Level 3: Comprehensive Cert.</p>
                            <p class="text-[10px] text-slate-500">≈45–60 pages • Fee: RM9,800</p>
                        </div>
                        <button onclick="window.openPaymentGateway('Level 3: Comprehensive Assessment Report & Certification', 'RM9,800.00')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition shadow-xs">Pay Now →</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">📊 ${isBm ? 'Kad Skor 3 Pilar ESG (40+ Indikator)' : 'The 3 Pillars of ESG Scorecard (40+ Indicators)'}</h3>
                <div class="space-y-2.5 text-xs">
                    <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-emerald-900">🌱 Environmental (E) Score: 78/100</span>
                            <span class="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Good</span>
                        </div>
                        <p class="text-[10px] text-emerald-700">Tracks green learning & climate literacy, energy & emissions, water stewardship, waste & recycling management, and biodiversity.</p>
                    </div>
                    <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-blue-900">👥 Social (S) Score: 86/100</span>
                            <span class="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">Excellent</span>
                        </div>
                        <p class="text-[10px] text-blue-700">Tracks child safety & safeguarding, wellbeing & mental health, child development & learning, nutrition & healthy living, and family engagement.</p>
                    </div>
                    <div class="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-purple-900">🏛️ Governance (G) Score: 81/100</span>
                            <span class="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">Strong</span>
                        </div>
                        <p class="text-[10px] text-purple-700">Tracks leadership & commitment, child protection policies, risk management, ethics & transparency, and data privacy.</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">⚠️ ${isBm ? 'Peta Haba Risiko & Analisis Jurang' : 'Risk Heat Map & Gap Analysis Matrix'}</h3>
                <p class="text-[11px] text-slate-600">5x5 grid matrix categorizing organizational risks by likelihood vs impact. Top identified focus areas:</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                        <span class="text-[9px] font-bold text-amber-800 uppercase block">High Priority</span>
                        <p class="font-bold text-amber-900 mt-0.5">Child Mental Wellbeing & Support</p>
                    </div>
                    <div class="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                        <span class="text-[9px] font-bold text-amber-800 uppercase block">High Priority</span>
                        <p class="font-bold text-amber-900 mt-0.5">Digital Safety & Screen Time Controls</p>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-[9px] font-bold text-slate-500 uppercase block">Medium Priority</span>
                        <p class="font-bold text-slate-800 mt-0.5">Climate Education Effectiveness</p>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-[9px] font-bold text-slate-500 uppercase block">Medium Priority</span>
                        <p class="font-bold text-slate-800 mt-0.5">Emergency Preparedness Protocols</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">🗺️ ${isBm ? 'Pelan Hala Tuju Penambahbaikan & Muat Naik Bukti' : 'Actionable Improvement Roadmap & Evidence Upload'}</h3>
                <p class="text-[11px] text-slate-600">Milestones to transition from Silver to Gold certification, plus the evidence point audit trail repository (collecting 200+ evidence points):</p>
                <div class="space-y-2 text-xs">
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-slate-800">Short-Term: Child Safeguarding Policy Update</p>
                            <p class="text-[10px] text-emerald-600">Status: Completed (Verified)</p>
                        </div>
                        <button onclick="alert('Evidence repository opened: 45/45 documents attached.')" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded text-[10px]">📁 View Files</button>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-slate-800">Medium-Term: Zero Waste Kitchen Integration</p>
                            <p class="text-[10px] text-amber-600">Status: In Progress (Upload photos/reports)</p>
                        </div>
                        <button onclick="alert('Upload Dialog: Select PDF, JPG, or PNG files for audit trail verification.')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded text-[10px]">+ Upload Evidence</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2">📥 ${isBm ? 'Hab Eksport Laporan Strategik' : 'Strategic Report Export & Use-Cases Hub'}</h3>
                <p class="text-[11px] text-slate-600">One-click audit-ready PDF report generators optimized for multi-stakeholder financing and reporting:</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <button onclick="alert('Generating Grant Submissions & NGO Funding PDF Report... Download ready.')" class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold border border-indigo-200 text-left transition">📑 Grant Submissions & NGO Funding</button>
                    <button onclick="alert('Generating Investor Due Diligence & Impact Financing PDF Report... Download ready.')" class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold border border-indigo-200 text-left transition">💼 Investor Due Diligence & Impact</button>
                    <button onclick="alert('Generating Sustainability-Linked Bank Loans PDF Report... Download ready.')" class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold border border-indigo-200 text-left transition">🏦 Sustainability-Linked Bank Loans</button>
                    <button onclick="alert('Generating CSR & GRI/SASB/ISSB Corporate Reporting PDF Report... Download ready.')" class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold border border-indigo-200 text-left transition">📊 CSR & GRI/SASB/ISSB Corporate</button>
                </div>
            </div>
        `;
    } else {
        let pendingHtml = '';
        if (state.pendingApplications.length > 0) {
            pendingHtml = state.pendingApplications.map((app, idx) => `
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-amber-900">🔔 ${isBm ? 'Permohonan Kursus Baru' : 'New Course Application'}</span>
                        <span class="text-[9px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">${isBm ? 'Menunggu' : 'Pending'}</span>
                    </div>
                    <div class="space-y-0.5 text-slate-700">
                        <p><strong>${isBm ? 'Kursus / Aktiviti:' : 'Course / Activity:'}</strong> ${app.courseName}</p>
                        <p><strong>${isBm ? 'Nama Kanak-kanak:' : 'Child Name:'}</strong> ${app.childName}</p>
                        <p><strong>${isBm ? 'Ibu Bapa / Penjaga:' : 'Parent / Guardian:'}</strong> ${app.parentName}</p>
                        <p><strong>${isBm ? 'Maklumat Hubungan:' : 'Contact Info:'}</strong> <span class="font-mono text-blue-600">${app.contact}</span></p>
                    </div>
                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <button onclick="window.approveApplication(${idx})" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition">✓ ${isBm ? 'Luluskan' : 'Approve'}</button>
                        <button onclick="window.sendFormToRecipient(${idx})" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition">📤 ${isBm ? 'Hantar Borang' : 'Send Form'}</button>
                    </div>
                </div>
            `).join('');
        } else {
            pendingHtml = `<p class="text-xs text-slate-400 italic text-center py-2">${isBm ? 'Tiada permohonan kursus buat masa ini.' : 'No pending course applications at this time.'}</p>`;
        }

        layerContentHtml = `
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-amber-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>📥 ${isBm ? 'Pemberitahuan Permohonan Kursus' : 'Course Application Notifications'}</span>
                    <span class="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">${state.pendingApplications.length} ${isBm ? 'Menunggu' : 'Pending'}</span>
                </h3>
                <div class="space-y-2.5">
                    ${pendingHtml}
                </div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <h3 class="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2">📋 ${isBm ? 'Senarai Program Dianjurkan & Peserta' : 'List of Programs Organized & Participants'}</h3>
                <div onclick="window.openParticipantGroup('Vegan Cooking Class Cohort 3/2026')" class="p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg flex justify-between items-center border border-slate-100 cursor-pointer">
                    <div><p class="text-xs font-bold text-slate-800">Vegan Cooking Class Cohort 3/2026</p><p class="text-[10px] text-slate-500">${isBm ? 'Peserta:' : 'Participants:'} 33 • ${isBm ? 'Ketua:' : 'Lead:'} Cikgu Faridah</p></div>
                    <span class="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold">${isBm ? 'Lihat Senarai →' : 'View List →'}</span>
                </div>
                <div onclick="window.openParticipantGroup('Zero Waste Kids Workshop Cohort 1/2026')" class="p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg flex justify-between items-center border border-slate-100 cursor-pointer">
                    <div><p class="text-xs font-bold text-slate-800">Zero Waste Kids Workshop Cohort 1/2026</p><p class="text-[10px] text-slate-500">${isBm ? 'Peserta:' : 'Participants:'} 25 • ${isBm ? 'Ketua:' : 'Lead:'} Ainol Razman</p></div>
                    <span class="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold">${isBm ? 'Lihat Senarai →' : 'View List →'}</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <span class="bg-indigo-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Portal Rakan Kongsi' : 'Partner Portal'}</span>
            <h2 class="text-xl font-bold">${state.userProfiles.partner.orgName}</h2>
            <p class="text-xs text-indigo-100">${isBm ? 'Pemuka Organisasi Rakan Kongsi & Pusat Komuniti' : 'Partner Organization Dashboard & Community Centers'}</p>
        </div>
        ${subNavButtonsHtml}
        ${layerContentHtml}
    `;
}

export function renderParticipantGroupDetails(groupName) {
    const roster = state.participantGroups[groupName] || [];
    const isBm = state.currentLang === 'bm';
    let html = `
        <div class="space-y-3">
            <button onclick="window.closeParticipantGroup()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition">← ${isBm ? 'Kembali ke Pemuka' : 'Back to Dashboard'}</button>
            <div class="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-4 text-white shadow-lg space-y-1">
                <span class="bg-indigo-500/40 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Kumpulan Peserta' : 'Participants Group'}</span>
                <h2 class="text-lg font-bold">${groupName}</h2>
            </div>
            <div class="space-y-2">
    `;
    
    roster.forEach(p => {
        const isGoodAttendance = parseFloat(p.attendanceRate) >= 80;
        let starsDisplay = '⭐'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
        html += `
            <div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex justify-between items-center text-xs">
                <div>
                    <p class="font-bold text-slate-800">${p.name}</p>
                    <p class="text-[10px] text-slate-500 font-mono">${p.token} • ${isBm ? 'Kehadiran:' : 'Attendance:'} <strong class="${isGoodAttendance ? 'text-emerald-600' : 'text-amber-600'}">${p.attendanceRate}</strong></p>
                    <p class="text-[11px] text-amber-500 mt-0.5 tracking-tight">${isBm ? 'Bintang Diberikan:' : 'Awarded Stars:'} <span class="font-bold">${starsDisplay}</span> (${p.stars}/5)</p>
                </div>
                <button onclick="window.rateCommunityToken('${p.name}')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px]">⭐ ${isBm ? 'Nilai & Anugerah' : 'Rate & Award'}</button>
            </div>
        `;
    });
    html += `
            </div>
        </div>
    `;
    return html;
}
