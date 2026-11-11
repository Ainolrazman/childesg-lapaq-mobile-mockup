import { state } from '../state/store.js';
import { getTodayDateString } from '../utils/helpers.js';

export function renderParentProfilePage() {
    const p = state.userProfiles.parent;
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <span class="bg-emerald-400/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Profil Utama' : 'Home Profile'}</span>
            <h2 class="text-xl font-bold">${p.name}</h2>
            <p class="text-xs text-emerald-100">${isBm ? 'Urus butiran peribadi penjaga anda' : 'Manage your personal guardian particulars'}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">${isBm ? 'Tukar Profil' : 'Profile Switch'}</span>
                <button onclick="window.switchProfileRole('partner')" class="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-lg">${isBm ? 'Tukar ke Profil Organisasi →' : 'Switch to Organization Profile →'}</button>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama:' : 'Name:'}</label>
                <input type="text" id="hp-name" value="${p.name}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat E-mel:' : 'Email Address:'}</label>
                <input type="email" id="hp-email" value="${p.email}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-blue-600">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nombor Telefon:' : 'Phone Number:'}</label>
                <input type="tel" id="hp-phone" value="${p.phone}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Negeri:' : 'State:'}</label>
                <select id="hp-state" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
                    <option ${p.state.includes('Kuala Lumpur') ? 'selected' : ''}>W.P. Kuala Lumpur / Selangor</option>
                    <option ${p.state === 'Johor' ? 'selected' : ''}>Johor</option>
                    <option ${p.state === 'Kedah' ? 'selected' : ''}>Kedah</option>
                    <option ${p.state === 'Kelantan' ? 'selected' : ''}>Kelantan</option>
                    <option ${p.state === 'Melaka' ? 'selected' : ''}>Melaka</option>
                    <option ${p.state === 'Negeri Sembilan' ? 'selected' : ''}>Negeri Sembilan</option>
                    <option ${p.state === 'Pahang' ? 'selected' : ''}>Pahang</option>
                    <option ${p.state === 'Penang' ? 'selected' : ''}>Penang</option>
                    <option ${p.state === 'Perak' ? 'selected' : ''}>Perak</option>
                    <option ${p.state === 'Perlis' ? 'selected' : ''}>Perlis</option>
                    <option ${p.state === 'Sabah' ? 'selected' : ''}>Sabah</option>
                    <option ${p.state === 'Sarawak' ? 'selected' : ''}>Sarawak</option>
                    <option ${p.state === 'Terengganu' ? 'selected' : ''}>Terengganu</option>
                    <option ${p.state === 'W.P. Labuan' ? 'selected' : ''}>W.P. Labuan</option>
                    <option ${p.state === 'W.P. Putrajaya' ? 'selected' : ''}>W.P. Putrajaya</option>
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat Kediaman:' : 'Home Address:'}</label>
                <textarea id="hp-address" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold" rows="2">${p.address}</textarea>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Tarikh Lahir:' : 'Date of Birth:'}</label>
                <input type="date" id="hp-dob" max="${getTodayDateString()}" value="${p.dob}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Pekerjaan (pilihan):' : 'Occupation (optional):'}</label>
                <input type="text" id="hp-occ" value="${p.occupation}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            </div>
            <button onclick="window.updateParentProfile()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow transition mt-2">
                ${isBm ? 'Kemaskini' : 'Update'}
            </button>
        </div>
        ${renderRegisteredChildrenList()}
        ${renderAddChildSection()}
    `;
}

export function renderPartnerProfilePage() {
    const o = state.userProfiles.partner;
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <span class="bg-indigo-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">${isBm ? 'Profil Utama' : 'Home Profile'}</span>
            <h2 class="text-xl font-bold">${o.orgName}</h2>
            <p class="text-xs text-indigo-100">${isBm ? 'Urus butiran institusi dan rakan kongsi' : 'Manage institutional and partner contact particulars'}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">${isBm ? 'Tukar Profil' : 'Profile Switch'}</span>
                <button onclick="window.switchProfileRole('parent')" class="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg">${isBm ? 'Tukar ke Profil Ibu Bapa →' : 'Switch to Parent Profile →'}</button>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Organisasi:' : 'Name of Organization:'}</label>
                <input type="text" id="ho-name" value="${o.orgName}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nombor Pendaftaran:' : 'Registration Number:'}</label>
                <input type="text" id="ho-regno" value="${o.regNumber}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat E-mel:' : 'Email Address:'}</label>
                <input type="email" id="ho-email" value="${o.email}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Pegawai Perhubungan:' : 'Contact person:'}</label>
                <input type="text" id="ho-contact" value="${o.contactPerson}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Jawatan Pegawai Perhubungan:' : 'Designation of Contact Person:'}</label>
                <input type="text" id="ho-desig" value="${o.designation}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'E-mel Pegawai Perhubungan:' : 'Contact person Email Address:'}</label>
                <input type="email" id="ho-pemail" value="${o.personEmail}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Telefon Pegawai Perhubungan:' : 'Contact person Phone Number:'}</label>
                <input type="tel" id="ho-pphone" value="${o.personPhone}" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold">
            </div>
            <button onclick="window.updatePartnerProfile()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs shadow transition mt-2">
                ${isBm ? 'Kemaskini' : 'Update'}
            </button>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2">📋 ${isBm ? 'Senarai Program Dianjurkan & Peserta' : 'List of Programs Organized & Participants'}</h3>
            <div class="space-y-2.5">
                <div onclick="window.openParticipantGroup('Vegan Cooking Class Cohort 3/2026')" class="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer transition">
                    <div>
                        <p class="text-xs font-bold text-slate-800">Vegan Cooking Class Cohort 3/2026</p>
                        <p class="text-[10px] text-slate-500">${isBm ? 'Mula:' : 'Began:'} 01 Oct 2026 • ${isBm ? 'Negeri:' : 'State:'} W.P. Kuala Lumpur / Selangor</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-extrabold text-indigo-600">33 ${isBm ? 'Peserta' : 'Participants'}</span>
                        <p class="text-[9px] text-emerald-600 font-bold">Active →</p>
                    </div>
                </div>
                <div onclick="window.openParticipantGroup('Zero Waste Kids Workshop Cohort 1/2026')" class="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer transition">
                    <div>
                        <p class="text-xs font-bold text-slate-800">Zero Waste Kids Workshop Cohort 1/2026</p>
                        <p class="text-[10px] text-slate-500">${isBm ? 'Mula:' : 'Began:'} 15 Aug 2026 • ${isBm ? 'Negeri:' : 'State:'} Penang</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-extrabold text-indigo-600">25 ${isBm ? 'Peserta' : 'Participants'}</span>
                        <p class="text-[9px] text-emerald-600 font-bold">Active →</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderRegisteredChildrenList() {
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">👶 ${isBm ? 'Senarai Kanak-kanak Berdaftar' : 'Registered Children List'}</h3>
            <div class="space-y-2">
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                        <p class="text-xs font-bold text-slate-800">Adam (${isBm ? 'Lelaki, 8 Tahun' : 'Boy, 8 Yrs'})</p>
                        <p class="text-[10px] text-slate-500">SK Petaling Jaya • Token: #AB-34X-KEMAIH</p>
                    </div>
                    <button onclick="window.switchChildView('adam'); window.switchTab('layer3');" class="text-[10px] bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition">${isBm ? 'Lihat Profil →' : 'View Profile →'}</button>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                        <p class="text-xs font-bold text-slate-800">Maya (${isBm ? 'Perempuan, 5 Tahun' : 'Girl, 5 Yrs'})</p>
                        <p class="text-[10px] text-slate-500">Taska Permata KEMAS • Token: #MY-99Z-PERMATA</p>
                    </div>
                    <button onclick="window.switchChildView('maya'); window.switchTab('layer3');" class="text-[10px] bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition">${isBm ? 'Lihat Profil →' : 'View Profile →'}</button>
                </div>
            </div>
        </div>
    `;
}

function renderAddChildSection() {
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">➕ ${isBm ? 'Tambah Kanak-kanak / Peserta Baru' : 'Add New Child / Participant'}</h3>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Penuh Kanak-kanak' : "Child's Full Name"}</label>
                <input type="text" placeholder="e.g. Nurul Ain / Hakim" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Jantina' : 'Gender'}</label>
                    <select class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <option>${isBm ? 'Lelaki' : 'Boy'}</option>
                        <option>${isBm ? 'Perempuan' : 'Girl'}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Tarikh Lahir' : 'Date of Birth'}</label>
                    <input type="date" max="${getTodayDateString()}" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg">
                </div>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Sekolah / Pusat Organisasi' : 'School / Organization Center'}</label>
                <input type="text" placeholder="e.g. SK Petaling Jaya" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg">
            </div>
            <button onclick="alert('${isBm ? 'Kanak-kanak berjaya didaftarkan!' : 'Child / Participant registered successfully and added to system tracking!'}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold text-xs transition">
                + ${isBm ? 'Daftar / Tambah Kanak-kanak' : 'Register / Add Child'}
            </button>
        </div>
    `;
}
