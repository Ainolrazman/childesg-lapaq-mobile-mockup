import { state, resetState } from './state/store.js';
import { t } from './state/i18n.js';

import { renderHeader, renderDrawer } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderModals } from './components/Modals.js';

// 🔧 CACHE BUSTERS ADDED HERE
import { renderRegistrationPage, toggleRegisterFields } from './views/AuthView.js?v=4';
import { renderParentProfilePage, renderPartnerProfilePage } from './views/HomeProfileView.js?v=4';
import { renderProgramsPage } from './views/MarketplaceView.js?v=4';
import { renderChildProfile } from './views/ChildProfileView.js?v=4';
import { renderLaPaQPage } from './views/LaPaQView.js?v=4';
import { renderParentSdgPassport, renderPartnerSdgPassport } from './views/SdgPassportView.js?v=4';
import { renderPartnerDashboard } from './views/PartnerDashView.js?v=4';
import { renderTokensPage } from './views/TokensView.js?v=4';
import { renderScannerPage } from './views/ScannerView.js?v=4';

// B2C Pricing View Import
import { renderUpgradeView, setB2CCurrency, setB2CTerm, handleB2CSubscribe } from './views/UpgradeView.js?v=4';

import { startScanner, simulateScan, stopScannerIfActive } from './utils/qrScanner.js';
import { showModalOverlay, closeModalOverlay, getTodayDateString, getMaxCalendarDateString } from './utils/helpers.js';

// --- Global Clock Update ---
function updateStatusBarTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeEl = document.getElementById('status-bar-time');
    if (timeEl) timeEl.innerText = `${hours}:${minutes}`;
}
setInterval(updateStatusBarTime, 1000);

// --- Core Navigation Router ---
export function switchTab(tabKey) {
    state.activeTabKey = tabKey;

    if (state.currentUserRole === 'partner' && ['layer3', 'tokens', 'lapaq', 'upgrade'].includes(tabKey)) {
        alert(state.currentLang === 'bm' 
            ? "🔒 Akses Terhad: Akaun Rakan Kongsi hanya boleh melihat Profil, Pemuka Rakan Kongsi, dan Pengimbas QR." 
            : "🔒 Access Restricted: Organization Partner accounts can only view Partner Profile Home, Partner Dashboard, and QR Scanner.");
        return;
    }

    if (state.currentUserRole === 'parent' && tabKey === 'school') {
        alert(state.currentLang === 'bm' 
            ? "🔒 Akses Terhad: Akaun Ibu Bapa tidak mempunyai akses ke Pemuka Rakan Kongsi." 
            : "🔒 Access Restricted: Parent accounts do not have access to the Partner Organization Dashboard.");
        return;
    }

    if (tabKey !== 'scanner') {
        stopScannerIfActive();
    }

    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.innerText = t(state.currentLang, `titles.${tabKey}`) || "ChildESG™ Mobile";
    }

    const content = document.getElementById('app-content');
    if (!content) return;

    switch (tabKey) {
        case 'layer1':
            content.innerHTML = renderRegistrationPage();
            setTimeout(() => toggleRegisterFields(state.currentUserRole), 50);
            break;
        case 'home':
            content.innerHTML = state.currentUserRole === 'partner' ? renderPartnerProfilePage() : renderParentProfilePage();
            break;
        case 'programs':
            content.innerHTML = renderProgramsPage();
            break;
        case 'layer3':
            const activeChild = state.selectedChild || 'adam';
            state.selectedChild = activeChild; 
            content.innerHTML = renderChildProfile(activeChild);
            setTimeout(() => {
                const orgSel = document.getElementById('apply-org-select');
                if (orgSel) window.updateCourseDropdown(orgSel.value);
            }, 50);
            break;
        case 'lapaq':
            content.innerHTML = renderLaPaQPage();
            break;
        case 'sdg':
            content.innerHTML = state.currentUserRole === 'partner' ? renderPartnerSdgPassport() : renderParentSdgPassport();
            break;
        case 'school':
            content.innerHTML = renderPartnerDashboard();
            break;
        case 'tokens':
            content.innerHTML = renderTokensPage();
            break;
        case 'scanner':
            content.innerHTML = renderScannerPage();
            break;
        case 'upgrade':
            content.innerHTML = renderUpgradeView();
            break;
        default:
            content.innerHTML = `<div class="p-4 bg-white rounded-xl shadow-sm text-center"><p class="text-xs text-slate-500 font-bold">ChildESG™ Mobile</p></div>`;
            break;
    }

    document.getElementById('header-container').innerHTML = renderHeader();
    document.getElementById('bottom-nav-container').innerHTML = renderBottomNav();
    updateStatusBarTime();
}

// --- Window Handler Bindings for HTML Attributes ---
window.switchTab = switchTab;

// B2C Pricing Functions
window.setB2CCurrency = setB2CCurrency;
window.setB2CTerm = setB2CTerm;
window.handleB2CSubscribe = handleB2CSubscribe;

window.setLanguage = function(lang) {
    state.currentLang = lang;
    switchTab(state.activeTabKey);
};

window.toggleMenuDrawer = function() {
    const overlay = document.getElementById('nav-drawer-overlay');
    const content = document.getElementById('nav-drawer-content');
    if (!overlay || !content) return;
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        setTimeout(() => content.classList.remove('-translate-x-full'), 10);
    } else {
        content.classList.add('-translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
};

window.toggleProfilePanel = function() {
    const panel = document.getElementById('profile-dropdown-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
};

window.handleMobileLogout = function() {
    if (confirm(state.currentLang === 'bm' ? "Adakah anda pasti mahu log keluar?" : "Are you sure you want to log out?")) {
        resetState();
        switchTab('layer1');
        alert(state.currentLang === 'bm' ? "🔒 Anda telah berjaya log keluar." : "🔒 You have been securely logged out.");
    }
};

window.addEventListener('click', function(e) {
    const panel = document.getElementById('profile-dropdown-panel');
    const target = e.target;
    if (panel && !panel.classList.contains('hidden') && !target.closest('button[onclick="toggleProfilePanel()"]') && !target.closest('#profile-dropdown-panel')) {
        panel.classList.add('hidden');
    }
});

window.openNotificationsModal = function() {
    const modal = document.getElementById('notifications-modal');
    const container = document.getElementById('notifications-list-container');
    if (!modal || !container) return;

    const list = state.notificationsData[state.currentUserRole] || state.notificationsData.parent;
    container.innerHTML = list.map(item => {
        const colorClasses = {
            blue: { bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-600', textTitle: 'text-blue-900', textBody: 'text-blue-800', tagBg: 'bg-blue-100', tagText: 'text-blue-600' },
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-600', textTitle: 'text-emerald-900', textBody: 'text-emerald-800', tagBg: 'bg-emerald-100', tagText: 'text-emerald-600' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-600', textTitle: 'text-amber-900', textBody: 'text-amber-800', tagBg: 'bg-amber-100', tagText: 'text-amber-600' },
            purple: { bg: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-600', textTitle: 'text-purple-900', textBody: 'text-purple-800', tagBg: 'bg-purple-100', tagText: 'text-purple-600' }
        }[item.color] || { bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-600', textTitle: 'text-blue-900', textBody: 'text-blue-800', tagBg: 'bg-blue-100', tagText: 'text-blue-600' };

        return `
            <div class="p-3 ${colorClasses.bg} rounded-xl border ${colorClasses.border} shadow-2xs space-y-1.5 relative overflow-hidden text-left">
                <div class="absolute top-0 left-0 w-1 h-full ${colorClasses.bar}"></div>
                <div class="flex justify-between items-center pl-1">
                    <span class="font-extrabold ${colorClasses.textTitle} flex items-center space-x-1.5">
                        <span>${item.icon}</span> <span>${item.title}</span>
                    </span>
                    <span class="text-[9px] ${colorClasses.tagText} font-mono font-bold ${colorClasses.tagBg} px-1.5 py-0.5 rounded">${item.time}</span>
                </div>
                <p class="text-[11px] ${colorClasses.textBody} pl-1 leading-relaxed">${item.message}</p>
            </div>
        `;
    }).join('');
    modal.classList.remove('hidden');
};

window.closeNotificationsModal = function() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.add('hidden');
};

window.markAllNotificationsRead = function() {
    window.closeNotificationsModal();
    const badge = document.getElementById('notification-badge');
    if (badge) badge.style.display = 'none';
    alert(state.currentLang === 'bm' ? "Semua pemberitahuan telah ditandakan sebagai dibaca." : "All notifications marked as read.");
};

window.openRoleDashboard = function() {
    if (state.currentUserRole === 'partner') {
        switchTab('school');
    } else {
        switchTab('layer3');
    }
};

window.resetDemo = function() {
    stopScannerIfActive();
    resetState();
    const badge = document.getElementById('notification-badge');
    if (badge) badge.style.display = 'flex';
    switchTab('layer1');
    alert("🔄 Demo application state has been reset back to default!");
};

window.onGatewayRoleChange = function(role) {
    state.currentUserRole = role;
    if (state.currentAuthTab === 'register') {
        toggleRegisterFields(role);
    }
};

window.setAuthMode = function(mode) {
    state.currentAuthTab = mode;
    switchTab('layer1');
    if (mode === 'register') {
        setTimeout(() => {
            const roleSelect = document.getElementById('gateway-role-select');
            toggleRegisterFields(roleSelect ? roleSelect.value : state.currentUserRole);
        }, 50);
    }
};

window.handleLoginSubmit = function() {
    const roleSelect = document.getElementById('gateway-role-select');
    if (roleSelect) state.currentUserRole = roleSelect.value;
    alert(state.currentLang === 'bm' ? "Log masuk berjaya! Memuatkan Profil Utama..." : "Authenticated successfully! Loading Home Profile...");
    switchTab('home');
};

window.handleRegisterSubmit = function() {
    const roleSelect = document.getElementById('gateway-role-select');
    const roleSel = roleSelect ? roleSelect.value : state.currentUserRole;
    state.currentUserRole = roleSel;

    if (roleSel === 'parent') {
        state.userProfiles.parent.name = document.getElementById('reg-p-name').value;
        state.userProfiles.parent.email = document.getElementById('reg-p-email').value;
        state.userProfiles.parent.phone = document.getElementById('reg-p-phone').value;
        state.userProfiles.parent.state = document.getElementById('reg-p-state').value;
        state.userProfiles.parent.address = document.getElementById('reg-p-address').value;
        state.userProfiles.parent.dob = document.getElementById('reg-p-dob').value;
        state.userProfiles.parent.occupation = document.getElementById('reg-p-occ').value;
    } else {
        state.userProfiles.partner.orgName = document.getElementById('reg-o-name').value;
        state.userProfiles.partner.regNumber = document.getElementById('reg-o-regno').value;
        state.userProfiles.partner.email = document.getElementById('reg-o-email').value;
        state.userProfiles.partner.contactPerson = document.getElementById('reg-o-contact').value;
        state.userProfiles.partner.designation = document.getElementById('reg-o-desig').value;
        state.userProfiles.partner.personEmail = document.getElementById('reg-o-pemail').value;
        state.userProfiles.partner.personPhone = document.getElementById('reg-o-pphone').value;
    }
    alert(state.currentLang === 'bm' ? "Akaun berjaya didaftarkan! Memuatkan Profil Utama..." : "Account registered & details saved! Loading Home Profile...");
    switchTab('home');
};

window.handleSocialAuth = function(provider) {
    alert(state.currentLang === 'bm' 
        ? `Berjaya log masuk menggunakan ${provider} (${state.currentUserRole === 'partner' ? 'Akaun Organisasi' : 'Akaun Ibu Bapa'})! Memuatkan Profil Utama...` 
        : `Successfully authenticated with ${provider} (${state.currentUserRole === 'partner' ? 'Organization Account' : 'Parent Account'})! Loading Home Profile...`);
    switchTab('home');
};

window.switchProfileRole = function(role) {
    state.currentUserRole = role;
    switchTab('home');
};

window.updateParentProfile = function() {
    state.userProfiles.parent.name = document.getElementById('hp-name').value;
    state.userProfiles.parent.email = document.getElementById('hp-email').value;
    state.userProfiles.parent.phone = document.getElementById('hp-phone').value;
    state.userProfiles.parent.state = document.getElementById('hp-state').value;
    state.userProfiles.parent.address = document.getElementById('hp-address').value;
    state.userProfiles.parent.dob = document.getElementById('hp-dob').value;
    state.userProfiles.parent.occupation = document.getElementById('hp-occ').value;
    alert(state.currentLang === 'bm' ? "Profil Penjaga berjaya dikemaskini!" : "Parents Guardian Profile updated successfully!");
};

window.updatePartnerProfile = function() {
    state.userProfiles.partner.orgName = document.getElementById('ho-name').value;
    state.userProfiles.partner.regNumber = document.getElementById('ho-regno').value;
    state.userProfiles.partner.email = document.getElementById('ho-email').value;
    state.userProfiles.partner.contactPerson = document.getElementById('ho-contact').value;
    state.userProfiles.partner.designation = document.getElementById('ho-desig').value;
    state.userProfiles.partner.personEmail = document.getElementById('ho-pemail').value;
    state.userProfiles.partner.personPhone = document.getElementById('ho-pphone').value;
    alert(state.currentLang === 'bm' ? "Profil Rakan Kongsi berjaya dikemaskini!" : "Partner Organization Profile updated successfully!");
};

window.updateMarketplaceFilters = function() {
    state.marketplaceSearchQuery = (document.getElementById('market-search-input')?.value || '').toLowerCase();
    state.marketplaceStartDate = document.getElementById('market-filter-start')?.value || getTodayDateString();
    state.marketplaceEndDate = document.getElementById('market-filter-end')?.value || getMaxCalendarDateString();
    switchTab('programs');
};

window.toggleMarketCustomCategoryInput = function(val) {
    const wrapper = document.getElementById('market-custom-category-wrapper');
    if (!wrapper) return;
    if (val === 'Others - Please add') {
        wrapper.classList.remove('hidden');
    } else {
        wrapper.classList.add('hidden');
    }
};

window.checkProgramDescriptionWordCount = function() {
    const descInput = document.getElementById('market-prog-desc');
    const indicator = document.getElementById('word-count-indicator');
    if (!descInput || !indicator) return;
    const text = descInput.value.trim();
    const words = text === "" ? [] : text.split(/\s+/);
    const count = words.length;
    indicator.innerText = `${count} / 150 words`;
    indicator.className = count > 150 ? "text-[9px] font-bold text-red-600" : "text-[9px] font-bold text-slate-400";
};

window.handleMarketplaceAddProgram = function() {
    const isBm = state.currentLang === 'bm';
    const catSelect = document.getElementById('market-prog-category').value;
    let finalCategory = catSelect;
    if (catSelect === 'Others - Please add') {
        const customInput = document.getElementById('market-prog-custom-cat').value.trim();
        if (!customInput) {
            alert(isBm ? "Sila masukkan nama kategori lain." : "Please specify the custom category.");
            return;
        }
        finalCategory = customInput;
    }
    const progName = document.getElementById('market-prog-name').value.trim();
    const progDesc = document.getElementById('market-prog-desc').value.trim();
    const startDate = document.getElementById('market-prog-start').value;
    const endDate = document.getElementById('market-prog-end').value;

    if (!progName || !progDesc) {
        alert(isBm ? "Sila masukkan nama dan penerangan program." : "Please enter program name and description.");
        return;
    }

    state.featuredProgramsList.unshift({
        org: state.userProfiles.partner.orgName,
        rating: 5,
        ratingScore: "5.0",
        sdgs: [2, 3, 4],
        title: progName,
        category: finalCategory,
        desc: progDesc,
        slots: "30 Available",
        reward: "150 Impact Tokens",
        badge: "🌱 New Partner Event",
        startDate: startDate,
        endDate: endDate
    });

    if (!state.organizationCoursesMap[state.userProfiles.partner.orgName]) {
        state.organizationCoursesMap[state.userProfiles.partner.orgName] = [];
    }
    state.organizationCoursesMap[state.userProfiles.partner.orgName].push(progName);

    alert(isBm ? `✅ Berjaya Diterbitkan!\nProgram "${progName}" telah ditambah ke pasaran program rakan kongsi.` : `✅ Published Successfully!\nProgram "${progName}" has been successfully added to the partner programs marketplace.`);
    switchTab('programs');
};

window.openProgramChildSelector = function(courseName, orgName) {
    state.pendingMarketplaceProgram = { courseName, orgName };
    const isBm = state.currentLang === 'bm';
    document.getElementById('prog-modal-title').innerText = isBm ? 'Pilih Kanak-kanak untuk Program' : 'Select Child for Program';
    document.getElementById('prog-modal-subtitle').innerText = `"${courseName}" (${orgName})`;
    document.getElementById('program-child-modal').classList.remove('hidden');
};

window.closeProgramChildModal = function() {
    document.getElementById('program-child-modal').classList.add('hidden');
    state.pendingMarketplaceProgram = null;
};

window.confirmProgramApplication = function() {
    if (!state.pendingMarketplaceProgram) return;
    const chosenChildKey = document.getElementById('modal-child-select').value;
    const { courseName, orgName } = state.pendingMarketplaceProgram;
    window.closeProgramChildModal();
    const isBm = state.currentLang === 'bm';
    const child = state.childrenData[chosenChildKey];
    if (!child.appliedCourses) child.appliedCourses = [];

    if (child.appliedCourses.some(ac => ac.name === courseName)) {
        showModalOverlay(isBm ? "Notis" : "Notice", `${child.name} ${isBm ? 'telah pun memohon untuk' : 'has already applied for'} "${courseName}".`);
        return;
    }

    child.appliedCourses.push({
        name: courseName,
        org: orgName,
        status: isBm ? "Menunggu Kelulusan" : "Pending Approval"
    });

    state.pendingApplications.push({
        childKey: chosenChildKey,
        childName: `${child.name} (${child.token})`,
        courseName: `${courseName} (${orgName})`,
        parentName: state.userProfiles.parent.name,
        contact: `${state.userProfiles.parent.phone} / ${state.userProfiles.parent.email}`,
        parentEmail: state.userProfiles.parent.email
    });

    showModalOverlay(
        isBm ? "Permohonan Diterima" : "Application Received", 
        isBm ? `Terima kasih kerana memohon "${courseName}" untuk ${child.name}.\n\nBorang pendaftaran akan dihantar ke E-mel anda (${state.userProfiles.parent.email}), sila isi dan e-mel kembali kepada kami.` : `Thank you for applying for "${courseName}" on behalf of ${child.name}.\n\nA registration form will be sent to your Email (${state.userProfiles.parent.email}), please fill in the form and email back to us.`
    );
};

window.updateCourseDropdown = function(selectedOrg) {
    const courseSelect = document.getElementById('apply-course-select');
    if (!courseSelect) return;
    const courses = state.organizationCoursesMap[selectedOrg] || [];
    courseSelect.innerHTML = courses.map(c => `<option value="${c}">${c}</option>`).join('');
};

window.submitNewCourseApplication = function() {
    const orgSelect = document.getElementById('apply-org-select');
    const courseSelect = document.getElementById('apply-course-select');
    const isBm = state.currentLang === 'bm';
    if (!orgSelect || !courseSelect) return;
    const org = orgSelect.value;
    const courseName = courseSelect.value;
    const child = state.childrenData[state.selectedChild];
    
    if (!child.appliedCourses) child.appliedCourses = [];
    if (child.appliedCourses.some(ac => ac.name === courseName)) {
        showModalOverlay(isBm ? "Notis" : "Notice", `${child.name} ${isBm ? 'telah pun memohon untuk' : 'has already applied for'} "${courseName}".`);
        return;
    }

    child.appliedCourses.push({ name: courseName, org: org, status: isBm ? "Menunggu Kelulusan" : "Pending Approval" });
    state.pendingApplications.push({
        childKey: state.selectedChild,
        childName: `${child.name} (${child.token})`,
        courseName: `${courseName} (${org})`,
        parentName: state.userProfiles.parent.name,
        contact: `${state.userProfiles.parent.phone} / ${state.userProfiles.parent.email}`,
        parentEmail: state.userProfiles.parent.email
    });

    showModalOverlay(
        isBm ? "Permohonan Diterima" : "Application Received", 
        isBm ? `Terima kasih kerana memohon kursus / aktiviti untuk ${child.name}.\n\nBorang pendaftaran akan dihantar ke E-mel anda (${state.userProfiles.parent.email}), sila isi dan e-mel kembali kepada kami.` : `Thank you for applying for the course / activity on behalf of ${child.name}.\n\nA registration form will be sent to your Email (${state.userProfiles.parent.email}), please fill in the form and email back to us.`
    );
};

window.switchChildView = function(childKey) {
    state.selectedChild = childKey;
    switchTab('layer3');
};

window.changeLaPaQChild = function(childKey) {
    state.selectedChild = childKey;
    switchTab('lapaq');
};

window.changeTokenChild = function(childKey) {
    state.selectedChild = childKey;
    switchTab('tokens');
};

window.setLaPaQTimeSpan = function(span) {
    state.lapaqTimeSpan = span;
    switchTab('lapaq');
};

window.updateLaPaQCustomDates = function() {
    state.lapaqStartDate = document.getElementById('lapaq-start-date')?.value || '';
    state.lapaqEndDate = document.getElementById('lapaq-end-date')?.value || getTodayDateString();
    switchTab('lapaq');
};

window.recalculateGrowthMetrics = function() {
    const h = parseFloat(document.getElementById('input-height').value) || 100;
    const w = parseFloat(document.getElementById('input-weight').value) || 15;
    const bmiValue = (w / ((h/100) * (h/100))).toFixed(1);
    document.getElementById('res-bmi').innerText = `${bmiValue} kg/m²`;
    state.childrenData[state.selectedChild].height = h;
    state.childrenData[state.selectedChild].weight = w;
    state.childrenData[state.selectedChild].bmi = `${bmiValue} kg/m²`;
};

window.claimRNIToken = function() {
    const child = state.childrenData[state.selectedChild];
    const isBm = state.currentLang === 'bm';
    child.rniClaimed = true;
    child.nutritionTokens += 10;
    child.totalTokens += 10;
    alert(isBm ? `🎉 Sasaran Diet RNI Harian Tercapai! 10 Token Pemakanan dicetak ke dompet ${child.name}.` : `🎉 Daily RNI Balanced Diet Target Met! 10 Nutrition Tokens minted to ${child.name}'s wallet.`);
    switchTab('lapaq');
};

window.redeemReward = function(rewardName, tokenCost) {
    const child = state.childrenData[state.selectedChild];
    const isBm = state.currentLang === 'bm';
    if (child.totalTokens >= tokenCost) {
        child.totalTokens -= tokenCost;
        alert(isBm ? `🎉 Berjaya Ditukar: [${rewardName}]!\n${tokenCost} token ditolak daripada dompet ${child.name}.` : `🎉 Successfully Redeemed: [${rewardName}]!\n${tokenCost} tokens deducted from ${child.name}'s wallet balance.`);
        switchTab('tokens');
    } else {
        alert(isBm ? `❌ Token Tidak Mencukupi!\n${child.name} mempunyai ${child.totalTokens} token, tetapi memerlukan ${tokenCost} token.` : `❌ Insufficient Tokens!\n${child.name} has ${child.totalTokens} tokens, but requires ${tokenCost} tokens for this reward.`);
    }
};

window.openLiveScannerModal = function(category) {
    switchTab('scanner');
    setTimeout(() => {
        startScanner();
        const resEl = document.getElementById('scan-result');
        if (resEl) resEl.innerText = `Camera active. Scanning for [${category}] QR Code...`;
    }, 300);
};

window.startScanner = function() {
    startScanner();
};

window.simulateSuccessfulScan = function() {
    simulateScan();
};

window.switchPartnerDashboardLayer = function(layer) {
    state.partnerDashboardLayer = layer;
    switchTab('school');
};

window.openPaymentGateway = function(tierTitle, amountDue) {
    document.getElementById('pay-modal-title').innerText = "Secure Payment Gateway";
    document.getElementById('pay-modal-subtitle').innerText = tierTitle;
    document.getElementById('pay-org-name').innerText = state.userProfiles.partner.orgName;
    document.getElementById('pay-amount-due').innerText = amountDue;
    document.getElementById('payment-gateway-modal').classList.remove('hidden');
};

window.closePaymentModal = function() {
    document.getElementById('payment-gateway-modal').classList.add('hidden');
};

window.confirmPaymentSuccess = function() {
    window.closePaymentModal();
    alert("✅ Payment Successful via FPX Online Banking!\nYour certification tier has been successfully updated and your audit trail has been submitted for review.");
};

window.approveApplication = function(index) {
    const app = state.pendingApplications[index];
    if (!app) return;
    const childObj = state.childrenData[app.childKey];
    if (childObj && childObj.appliedCourses) {
        const targetApp = childObj.appliedCourses.find(ac => app.courseName.includes(ac.name) || ac.name.includes(ac.name));
        if (targetApp) targetApp.status = "Approved";
    }
    alert(state.currentLang === 'bm' ? `✅ Permohonan Diluluskan!\n${app.childName} telah diluluskan untuk "${app.courseName}".` : `✅ Application Approved!\n${app.childName} has been successfully approved for "${app.courseName}".`);
    state.pendingApplications.splice(index, 1);
    switchTab('school');
};

window.sendFormToRecipient = function(index) {
    const app = state.pendingApplications[index];
    if (!app) return;
    const emailAddr = app.parentEmail || state.userProfiles.parent.email;
    state.currentUserRole = 'parent';
    switchTab('home');
    showModalOverlay(
        state.currentLang === 'bm' ? "Permohonan Diterima" : "Application Received", 
        state.currentLang === 'bm' ? `Terima kasih kerana memohon kursus / aktiviti.\n\nBorang pendaftaran akan dihantar ke E-mel (${emailAddr}), sila isi dan e-mel kembali kepada kami.` : `Thank you for applying for the course / activity.\n\nA registration form will be sent to your Email (${emailAddr}), please fill in the form and email back to us.`
    );
};

window.openParticipantGroup = function(groupName) {
    state.currentPartnerView = 'group_detail';
    state.activeParticipantGroup = groupName;
    switchTab('school');
};

window.closeParticipantGroup = function() {
    state.currentPartnerView = 'dashboard';
    state.activeParticipantGroup = '';
    switchTab('school');
};

window.rateCommunityToken = function(studentName) {
    const isBm = state.currentLang === 'bm';
    const rating = prompt(isBm ? `Penilaian Penganjur untuk ${studentName} (1 hingga 5 Bintang):` : `Organizer / Peer Rating for ${studentName} (1 to 5 Stars):`, "5");
    if (rating) {
        const parsedRating = parseInt(rating);
        if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
            const group = state.participantGroups[state.activeParticipantGroup];
            if (group) {
                const participant = group.find(p => p.name === studentName);
                if (participant) participant.stars = parsedRating;
            }
            const key = studentName.toLowerCase().includes('adam') ? 'adam' : 'maya';
            if (state.childrenData[key]) {
                state.childrenData[key].communityTokens += parsedRating * 10;
                state.childrenData[key].totalTokens += parsedRating * 10;
            }
            alert(isBm ? `🤝 Penilaian Komuniti & Kepimpinan Disimpan! Dianugerahkan ${parsedRating} bintang (${parsedRating * 10} token) kepada ${studentName}.` : `🤝 Community & Leadership Rating Saved! Awarded ${parsedRating} stars (${parsedRating * 10} tokens) to ${studentName}.`);
            switchTab('school');
        } else {
            alert(isBm ? "❌ Sila masukkan nombor sah antara 1 dan 5." : "❌ Please enter a valid number between 1 and 5.");
        }
    }
};

window.setSdgFilter = function(value) {
    state.sdgSelectedFilter = value;
    switchTab('sdg');
};

window.setSdgChildFilter = function(value) {
    state.sdgSelectedChild = value;
    switchTab('sdg');
};

window.addSdgRecord = function() {
    const titleEl = document.getElementById('sdg-new-title');
    const evidenceEl = document.getElementById('sdg-new-evidence');
    const childEl = document.getElementById('sdg-new-child');
    const goalEl = document.getElementById('sdg-new-goal');
    const title = titleEl ? titleEl.value.trim() : '';
    const evidence = evidenceEl ? evidenceEl.value.trim() : '';
    if (!title || !evidence) {
        alert(state.currentLang === 'bm' ? 'Sila masukkan nama aktiviti dan rujukan bukti.' : 'Please enter an activity name and evidence reference.');
        return;
    }
    const goal = Number(goalEl.value);
    state.sdgEvidenceRecords.unshift({
        id: 'DEMO-' + Date.now().toString().slice(-8),
        child: childEl.value,
        title,
        sdgs: [goal],
        category: 'community',
        date: new Date().toISOString().slice(0, 10),
        measure: 'Activity recorded',
        value: 1,
        unit: 'record',
        evidence,
        status: 'pending',
        note: 'Demo record only. Evidence has not been independently verified.'
    });
    state.sdgSelectedFilter = 'all';
    state.sdgSelectedChild = 'all';
    switchTab('sdg');
};

window.reviewSdgRecord = function(id) {
    const record = state.sdgEvidenceRecords.find(r => r.id === id);
    if (!record || record.status !== 'verified') {
        record.status = 'verified';
        record.note = 'Verified by Kemaih Sdn Bhd partner audit team.';
        alert(state.currentLang === 'bm' ? '✅ Rekod impak SDG berjaya disahkan oleh Kemaih Sdn Bhd!' : '✅ SDG Impact record successfully verified by Kemaih Sdn Bhd!');
        switchTab('sdg');
    }
};

window.closeModalOverlay = closeModalOverlay;

// --- DOM Bootstrap ---
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-container').innerHTML = renderHeader();
    document.getElementById('drawer-container').innerHTML = renderDrawer();
    document.getElementById('modals-container').innerHTML = renderModals();
    document.getElementById('bottom-nav-container').innerHTML = renderBottomNav();
    switchTab('layer1');
});
