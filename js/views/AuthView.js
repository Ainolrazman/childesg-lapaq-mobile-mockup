import { state } from '../state/store.js';
import { malaysiaStatesOptions, getTodayDateString } from '../utils/helpers.js';

export function renderRegistrationPage() {
    const isBm = state.currentLang === 'bm';
    return `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-1">
            <span class="bg-blue-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-blue-300">ChildESG™ Gateway</span>
            <h2 class="text-xl font-bold">Registration & Authentication</h2>
            <p class="text-xs text-slate-300">${isBm ? 'Log masuk atau daftar sebagai Ibu Bapa atau Rakan Kongsi' : 'Sign in or register as Parent or Organization Partner'}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-md border border-slate-100 space-y-3">
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Pilih Peranan Pendaftaran / Log Masuk' : 'Select Account Role'}</label>
                <select id="gateway-role-select" onchange="window.onGatewayRoleChange(this.value)" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                    <option value="parent" ${state.currentUserRole === 'parent' ? 'selected' : ''}>${isBm ? '👤 Akaun Ibu Bapa / Penjaga' : '👤 Parent / Guardian Account'}</option>
                    <option value="partner" ${state.currentUserRole === 'partner' ? 'selected' : ''}>${isBm ? '🏢 Akaun Organisasi Rakan Kongsi' : '🏢 Organization Partner Account'}</option>
                </select>
            </div>
            <div class="flex bg-slate-100 p-1 rounded-xl">
                <button onclick="window.setAuthMode('register')" id="auth-tab-register" class="flex-1 py-1.5 text-xs font-bold rounded-lg transition ${state.currentAuthTab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">${isBm ? '📝 Daftar' : '📝 Register'}</button>
                <button onclick="window.setAuthMode('login')" id="auth-tab-login" class="flex-1 py-1.5 text-xs font-bold rounded-lg transition ${state.currentAuthTab === 'login' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">${isBm ? '🔐 Log Masuk' : '🔐 Login'}</button>
            </div>
            
            <div id="auth-form-register" class="${state.currentAuthTab === 'register' ? 'block' : 'hidden'} space-y-2.5">
                <div class="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                    <span class="text-[10px] font-bold text-blue-700 uppercase">${isBm ? 'Persetujuan PDPA Termasuk' : 'PDPA Consent Included'}</span>
                    <p class="text-[10px] text-blue-600 mt-0.5">${isBm ? 'Pendaftaran mencipta akaun anda dan merekodkan persetujuan PDPA.' : 'Registration creates your account and registers PDPA hashing consent.'}</p>
                </div>
                <div id="register-fields-container" class="space-y-2.5 pt-1"></div>
                <button onclick="window.handleRegisterSubmit()" class="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition mt-1">${isBm ? '✓ Daftar & Pergi ke Profil Utama' : '✓ Register & Go to Home Profile'}</button>
            </div>
            <div id="auth-form-login" class="${state.currentAuthTab === 'login' ? 'block' : 'hidden'} space-y-2.5">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Pengguna / E-mel' : 'Username / Email'}</label>
                    <input type="text" id="login-input-user" placeholder="guardian123 or partner@organization.my" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Kata Laluan' : 'Password'}</label>
                    <input type="password" id="login-input-pass" placeholder="••••••••" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                </div>
                <button onclick="window.handleLoginSubmit()" class="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-700 transition mt-1">${isBm ? 'Log Masuk → Pergi ke Profil' : 'Sign In → Go to Home Profile'}</button>
            </div>
            <div class="space-y-2 pt-2 border-t border-slate-100">
                <span class="text-[10px] font-bold text-slate-400 uppercase block text-center">${isBm ? 'Atau teruskan dengan' : 'Or continue with'}</span>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="window.handleSocialAuth('Google')" class="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition">
                        <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.24 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.12 0 9.8 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                        <span>Google</span>
                    </button>
                    <button onclick="window.handleSocialAuth('Facebook')" class="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-2 px-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition">
                        <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span>Facebook</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function toggleRegisterFields(role) {
    const container = document.getElementById('register-fields-container');
    const isBm = state.currentLang === 'bm';
    if (!container) return;
    if (role === 'parent') {
        container.innerHTML = `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Penuh:' : 'Name:'}</label>
                <input type="text" id="reg-p-name" placeholder="Full Name" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.parent.name}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat E-mel:' : 'Email Address:'}</label>
                <input type="email" id="reg-p-email" placeholder="email@example.com" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.parent.email}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nombor Telefon:' : 'Phone Number:'}</label>
                <input type="tel" id="reg-p-phone" placeholder="+6012-3456789" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.parent.phone}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Negeri:' : 'State:'}</label>
                <select id="reg-p-state" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold">
                    ${malaysiaStatesOptions}
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat Kediaman:' : 'Home Address:'}</label>
                <textarea id="reg-p-address" placeholder="Full residential address" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" rows="2">${state.userProfiles.parent.address}</textarea>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Tarikh Lahir:' : 'Date of Birth:'}</label>
                <input type="date" id="reg-p-dob" max="${getTodayDateString()}" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.parent.dob}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Pekerjaan (pilihan):' : 'Occupation (optional):'}</label>
                <input type="text" id="reg-p-occ" placeholder="e.g. Engineer / Manager" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.parent.occupation}">
            </div>
        `;
    } else {
        container.innerHTML = `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Organisasi:' : 'Name of Organization:'}</label>
                <input type="text" id="reg-o-name" placeholder="Organization Name" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.orgName}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nombor Pendaftaran:' : 'Registration Number:'}</label>
                <input type="text" id="reg-o-regno" placeholder="Registration No." class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.regNumber}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Alamat E-mel:' : 'Email Address:'}</label>
                <input type="email" id="reg-o-email" placeholder="org@email.my" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.email}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Pegawai Perhubungan:' : 'Contact person:'}</label>
                <input type="text" id="reg-o-contact" placeholder="Contact Person Name" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.contactPerson}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Jawatan Pegawai Perhubungan:' : 'Designation of Contact Person:'}</label>
                <input type="text" id="reg-o-desig" placeholder="e.g. Director / CEO" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.designation}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'E-mel Pegawai Perhubungan:' : 'Contact person Email Address:'}</label>
                <input type="email" id="reg-o-pemail" placeholder="person@email.my" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.personEmail}">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Telefon Pegawai Perhubungan:' : 'Contact person Phone Number:'}</label>
                <input type="tel" id="reg-o-pphone" placeholder="+6012-3456789" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg" value="${state.userProfiles.partner.personPhone}">
            </div>
        `;
    }
}
