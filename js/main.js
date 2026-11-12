// js/main.js — entry point. Wires every module together.

/* ── Charts ─────────────────────────────────────────────────── */
import { initEsgCharts } from './charts/esg.js';
import {
    initLapaqCharts,
    initLapaqGeoCharts,
    updatePieChartsForState
    // 🔧 FIX: removed `selectGeoState` — charts/lapaq.js never exported it
} from './charts/lapaq.js';
import {
    initPredictiveCharts,
    toggleHeightGender,
    highlightHeightSeries,
    handleHeightChartHover
} from './charts/predictive.js';
import { initWasteTrendChart } from './charts/waste.js';

/* ── Modules ────────────────────────────────────────────────── */
import { switchMainTab } from './modules/navigation.js';
import { initCollapsibleListeners } from './modules/collapsible.js';
import {
    toggleProfileDropdown,
    handleUserLogout,
    initHeaderListeners
} from './modules/header.js';
import {
    applyGlobalFilters,
    resetGlobalFilters,
    setFilterTime
} from './modules/filters.js';
import {
    renderProgramsGrid,
    applyProgramFilters,
    resetProgramFilters,
    openNewProgramModal,
    closeNewProgramModal,
    handleCreateProgramSubmit
} from './modules/programs.js';
import {
    renderClassAttendanceSummary,
    regenerateClassHealth,
    handleClassCardEnter,
    handleClassCardLeave,
    handleClassCardClick,
    unpinClassHealth,
    initClassHealthListeners
} from './modules/class-health.js';
import {
    renderRosterTable,
    changePageSize,
    changeRosterPage,
    filterRosterTable,
    verifySdgevidence,
    approveTokenPoints
} from './modules/roster.js';
import { renderAuditLogs } from './modules/audit.js';
import {
    handleSdgHover,
    handleSdgLeave,
    handleSdgClick,
    unpinSdg,
    openSdgReportModal,
    closeSdgReportModal,
    initSdgListeners
} from './modules/sdg.js';
import {
    loadSampleMenu,
    buildNutrientGrid,
    updateNutrientBadges,
    addIngredientRow,
    openNewMenuModal,
    closeNewMenuModal,
    handleSaveMenu,
    deleteCustomMenu,
    renderCustomMenus
} from './modules/menu-engine.js';
import {
    pinMenuDay,
    unpinMenuDay,
    initMenuDayCards,
    initMenuDayListeners
} from './modules/menu-day-tooltip.js';
import {
    initRmtMenus,
    filterRmtMenus,
    showRmtTooltip,
    hideRmtTooltip,
    pinRmtTooltip,
    unpinRmtTooltip,
    initRmtListeners
} from './modules/menu-rmt.js';
import {
    openMenuAnalysisModal,
    closeMenuAnalysisModal,
    updateWasteStats,
    updateWasteCostPreview,
    openWasteLogModal,
    closeWasteLogModal,
    handleWasteLogSubmit,
    openWasteHistoryModal,
    closeWasteHistoryModal
} from './modules/waste.js';
import {
    openNutritionistModal,
    closeNutritionistModal,
    openBookingModal,
    closeBookingModal,
    handleBookingSubmit
} from './modules/nutritionist.js';
import {
    initSocialSDKs,
    loginWithGoogle,
    loginWithFacebook,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
    handleAuthSubmit
} from './modules/auth.js';
import {
    openEsgBreakdownModal,
    closeEsgBreakdownModal,
    openWizardModal,
    closeWizardModal,
    selectTier,
    openHistoryModal,
    closeHistoryModal
} from './modules/modals.js';

/* ── Inline-only helpers (dashboard-local, kept here) ────────── */

// 🔧 FIX: geoStateData inlined to remove the /data/geo.js dependency.
// If you've confirmed /data/geo.js exists on the server, you can restore:
//   import { geoStateData } from '../data/geo.js';
// and delete this const block.
const geoStateData = {
    all: {
        name: 'All Active States (Entire Malaysia)',
        title: 'State Analysis: All Active States',
        coursesCount: '12 Total Courses', paxCount: '220 Pax',
        badge: '17.3% Overall Stunting', stuntingDetail: '38 / 220 Children',
        stuntingGender: 'Girls: 26 cases (24%) • Boys: 12 cases (11%)',
        obesityBadge: '20.0% Peak (Selangor & Pahang)',
        obesityDetail: '36 / 220 Children',
        obesityGender: 'Boys: 24 cases (22%) • Girls: 12 cases (11%)',
        calcium: '12% RNI', vitc: '38% RNI'
    },
    kl: {
        name: 'W.P. Kuala Lumpur (HQ Hub)',
        title: 'State Analysis: W.P. Kuala Lumpur Hub',
        coursesCount: '4 Courses Executed', paxCount: '70 Pax',
        badge: '11.4% Stunting Rate', stuntingDetail: '8 / 70 Children',
        stuntingGender: 'Girls: 6 cases (15%) • Boys: 2 cases (6%)',
        obesityBadge: '11.4% Obesity Rate',
        obesityDetail: '8 / 70 Children',
        obesityGender: 'Boys: 6 cases (15%) • Girls: 2 cases (6%)',
        calcium: '14% RNI', vitc: '42% RNI'
    },
    selangor: {
        name: 'Selangor (Petaling Jaya & Shah Alam)',
        title: 'State Analysis: Selangor (Petaling Jaya & Shah Alam)',
        coursesCount: '4 Courses Executed', paxCount: '60 Pax',
        badge: '13.3% Stunting Rate', stuntingDetail: '8 / 60 Children',
        stuntingGender: 'Girls: 6 cases (18%) • Boys: 2 cases (7%)',
        obesityBadge: '⚠️ Highest Obesity: 20.0%',
        obesityDetail: '12 / 60 Children',
        obesityGender: 'Boys: 8 cases (25%) • Girls: 4 cases (14%)',
        calcium: '12% RNI', vitc: '35% RNI'
    },
    perak: {
        name: 'Perak (Ipoh Regional Hub)',
        title: 'State Analysis: Perak (Ipoh Regional Hub)',
        coursesCount: '2 Courses Executed', paxCount: '40 Pax',
        badge: '15.0% Stunting Rate', stuntingDetail: '6 / 40 Children',
        stuntingGender: 'Girls: 4 cases (18%) • Boys: 2 cases (11%)',
        obesityBadge: '15.0% Obesity Rate',
        obesityDetail: '6 / 40 Children',
        obesityGender: 'Boys: 4 cases (18%) • Girls: 2 cases (11%)',
        calcium: '10% RNI', vitc: '30% RNI'
    },
    pahang: {
        name: 'Pahang (Kuantan Community Hub)',
        title: 'State Analysis: Pahang (Kuantan Community Hub)',
        coursesCount: '2 Courses Executed', paxCount: '50 Pax',
        badge: '🚨 Highest Stunting: 32.0%', stuntingDetail: '16 / 50 Children',
        stuntingGender: 'Girls: 10 cases (20%) • Boys: 6 cases (12%)',
        obesityBadge: '20.0% Obesity Rate',
        obesityDetail: '10 / 50 Children',
        obesityGender: 'Boys: 6 cases (12%) • Girls: 4 cases (8%)',
        calcium: '18% RNI', vitc: '45% RNI'
    }
};

// 🔧 FIX: expose geoStateData for charts/lapaq.js (updatePieChartsForState reads it)
window.geoStateData = geoStateData;

function handleMapHover(event, stateKey) {
    const data = geoStateData[stateKey] || geoStateData.all;
    const tooltip = document.getElementById('map-hover-tooltip');
    const containerBox = document.getElementById('map-container-box');
    document.getElementById('tooltip-state-name').innerText = data.name;
    document.getElementById('tooltip-badge').innerText =
        data.coursesCount !== '0 Courses' ? 'Active Kemaih Hub' : 'Inactive Region';
    document.getElementById('tooltip-courses').innerText = data.coursesCount;
    document.getElementById('tooltip-pax').innerText = data.paxCount;
    document.getElementById('tooltip-stunting').innerText = data.badge;
    document.getElementById('tooltip-obesity').innerText = data.obesityBadge;
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top = `${event.clientY - 10}px`;
    tooltip.classList.remove('hidden');
    if (containerBox) containerBox.classList.add('map-active-hover');
}

function handleMapLeave() {
    document.getElementById('map-hover-tooltip').classList.add('hidden');
    document.getElementById('map-container-box')?.classList.remove('map-active-hover');
}

// 🔧 FIX: selectGeoState was previously imported from charts/lapaq.js
// (which never exported it). Defined locally now.
function selectGeoState(stateKey) {
    window.__geoState = stateKey;
    const data = geoStateData[stateKey] || geoStateData.all;

    // 1. Update state selector buttons
    ['all', 'kl', 'selangor', 'perak', 'pahang'].forEach(k => {
        const btn = document.getElementById(`geo-btn-${k}`);
        if (btn) {
            btn.className = k === stateKey
                ? 'p-3 bg-indigo-600 text-white rounded-2xl border border-indigo-400/30 text-left transition space-y-1 shadow-lg shadow-indigo-600/20'
                : 'p-3 bg-slate-950/60 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-800/80 text-left transition space-y-1';
        }
    });

    // 2. Highlight SVG paths
    ['kl', 'selangor', 'perak', 'pahang'].forEach(s => {
        const el = document.getElementById(`svg-state-${s}`);
        if (el) {
            el.style.strokeWidth = s === stateKey ? '4px' : '2.5px';
            el.style.stroke = s === stateKey
                ? '#f59e0b'
                : (s === 'pahang' ? '#f43f5e' : (s === 'selangor' ? '#10b981' : '#6366f1'));
        }
    });

    // 3. Update text badges
    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
    setTxt('geo-selected-badge',   `Viewing: ${data.name}`);
    setTxt('geo-card-title',       data.title);
    setTxt('geo-courses-count',    data.coursesCount);
    setTxt('geo-stunting-badge',   data.badge);
    setTxt('geo-stunting-detail',  data.stuntingDetail);
    setTxt('geo-stunting-gender',  data.stuntingGender);
    setTxt('geo-obesity-badge',    data.obesityBadge);
    setTxt('geo-obesity-detail',   data.obesityDetail);
    setTxt('geo-obesity-gender',   data.obesityGender);
    setTxt('geo-calcium-val',      data.calcium);
    setTxt('geo-vitc-val',         data.vitc);

    // 4. Update pies + bar chart
    updatePieChartsForState(stateKey);
}

function highlightNutrients(category, activate) {
    const rows = document.querySelectorAll('tr[data-nutrient]');
    rows.forEach(row => {
        if (!activate) {
            row.classList.remove('nutrient-highlight', 'nutrient-dim');
        } else if (category === 'all') {
            row.classList.add('nutrient-highlight');
            row.classList.remove('nutrient-dim');
        } else if (row.dataset.category === category) {
            row.classList.add('nutrient-highlight');
            row.classList.remove('nutrient-dim');
        } else {
            row.classList.add('nutrient-dim');
            row.classList.remove('nutrient-highlight');
        }
    });
    document.querySelectorAll('.nutrient-kpi-card').forEach(card => {
        if (!activate) {
            card.classList.remove('active-filter');
            return;
        }
        const filter = card.getAttribute('onmouseenter') || '';
        const matches =
            filter.includes(`'${category}'`) ||
            (category === 'all' && filter.includes(`'all'`));
        card.classList.toggle('active-filter', matches);
    });
}

/* ── Expose to window (bridges inline on*="..." handlers) ───── */
Object.assign(window, {
    // Navigation & filters
    switchMainTab,
    applyGlobalFilters,
    resetGlobalFilters,
    setFilterTime,

    // Programs
    applyProgramFilters,
    resetProgramFilters,
    openNewProgramModal,
    closeNewProgramModal,
    handleCreateProgramSubmit,

    // SDG
    handleSdgHover,
    handleSdgLeave,
    handleSdgClick,
    unpinSdg,
    openSdgReportModal,
    closeSdgReportModal,

    // Map
    handleMapHover,
    handleMapLeave,
    selectGeoState,

    // Class health
    regenerateClassHealth,
    unpinClassHealth,
    handleClassCardEnter,
    handleClassCardLeave,
    handleClassCardClick,

    // RMT menus
    filterRmtMenus,
    showRmtTooltip,
    hideRmtTooltip,
    pinRmtTooltip,
    unpinRmtTooltip,

    // Menu engine
    openNewMenuModal,
    closeNewMenuModal,
    handleSaveMenu,
    loadSampleMenu,
    addIngredientRow,
    updateNutrientBadges,
    deleteCustomMenu,
    renderCustomMenus,

    // Menu-day tooltip (legacy, harmless no-op now)
    pinMenuDay,
    unpinMenuDay,

    // Waste
    openMenuAnalysisModal,
    closeMenuAnalysisModal,
    openWasteLogModal,
    closeWasteLogModal,
    handleWasteLogSubmit,
    openWasteHistoryModal,
    closeWasteHistoryModal,

    // Nutritionist
    openNutritionistModal,
    closeNutritionistModal,
    openBookingModal,
    closeBookingModal,
    handleBookingSubmit,

    // Auth
    openAuthModal,
    closeAuthModal,
    setAuthMode,
    handleAuthSubmit,
    loginWithGoogle,
    loginWithFacebook,

    // Header
    toggleProfileDropdown,
    handleUserLogout,

    // Roster
    changePageSize,
    changeRosterPage,
    filterRosterTable,
    verifySdgevidence,
    approveTokenPoints,

    // Modals
    openEsgBreakdownModal,
    closeEsgBreakdownModal,
    openWizardModal,
    closeWizardModal,
    selectTier,
    openHistoryModal,
    closeHistoryModal,

    // Height chart controls
    toggleHeightGender,
    highlightHeightSeries,
    handleHeightChartHover,

    // Nutrient table
    highlightNutrients,

    // Charts (exposed so waste.js / other modules can lazy-init)
    initWasteTrendChart
});

/* ── Diagnostics: verify every inline handler resolves ──────── */
const REQUIRED_HANDLERS = [
    'switchMainTab',
    'openAuthModal', 'closeAuthModal',
    'loginWithGoogle', 'loginWithFacebook',
    'setAuthMode', 'handleAuthSubmit',
    'toggleProfileDropdown', 'handleUserLogout',
    'applyGlobalFilters', 'resetGlobalFilters', 'setFilterTime',
    'applyProgramFilters', 'resetProgramFilters',
    'openNewProgramModal', 'closeNewProgramModal', 'handleCreateProgramSubmit',
    'openHistoryModal', 'closeHistoryModal',
    'openWizardModal', 'closeWizardModal', 'selectTier',
    'openEsgBreakdownModal', 'closeEsgBreakdownModal',
    'handleSdgClick', 'handleSdgHover', 'handleSdgLeave', 'closeSdgReportModal',
    'selectGeoState', 'handleMapHover', 'handleMapLeave',
    'regenerateClassHealth',
    'openMenuAnalysisModal', 'closeMenuAnalysisModal',
    'openNewMenuModal', 'closeNewMenuModal',
    'loadSampleMenu', 'addIngredientRow', 'handleSaveMenu',
    'filterRmtMenus',
    'openWasteLogModal', 'closeWasteLogModal', 'handleWasteLogSubmit',
    'openWasteHistoryModal', 'closeWasteHistoryModal',
    'openNutritionistModal', 'closeNutritionistModal',
    'openBookingModal', 'closeBookingModal', 'handleBookingSubmit',
    'highlightNutrients',
    'toggleHeightGender', 'highlightHeightSeries',
    'filterRosterTable', 'changePageSize', 'changeRosterPage'
];

/* ── Chart resize sweep (fixes 0×0 in hidden tabs) ──────────── */
function resizeAllCharts() {
    requestAnimationFrame(() => {
        if (!window.Chart || typeof window.Chart.getChart !== 'function') return;
        document.querySelectorAll('canvas').forEach(canvas => {
            if (canvas.offsetParent === null) return; // still hidden
            const chart = window.Chart.getChart(canvas);
            if (chart) chart.resize();
        });
    });
}
window.resizeAllCharts = resizeAllCharts;

/* ── Boot ───────────────────────────────────────────────────── */
function boot() {
    console.log('🚀 boot() running');

    // 1. Document-level listeners (event delegation)
    initCollapsibleListeners();
    initHeaderListeners();
    initClassHealthListeners();
    initSdgListeners();
    initMenuDayListeners();
    initRmtListeners();

    // 2. Charts — 🔧 FIX: pass selectGeoState as callback so pie/bar clicks focus
    initEsgCharts();
    initLapaqCharts();
    initLapaqGeoCharts(selectGeoState);
    initPredictiveCharts();
    updatePieChartsForState('all');

    // 3. Render UI
    renderAuditLogs();
    renderProgramsGrid();
    renderRosterTable();
    renderClassAttendanceSummary();
    buildNutrientGrid();
    renderCustomMenus();
    updateWasteStats();
    initMenuDayCards();   // no-op now (SEJAHTERA cards were removed) — safe to leave

    // 4. Async loads
    initRmtMenus();
    initSocialSDKs();

    // 5. Waste-log live cost preview
    const leftoversInput = document.getElementById('waste-log-leftovers');
    if (leftoversInput) {
        leftoversInput.addEventListener('input', updateWasteCostPreview);
    }

    // 6. First resize sweep — fixes charts created while tabs were hidden
    resizeAllCharts();

    // 7. Verify every inline handler is wired
    const missing = REQUIRED_HANDLERS.filter(fn => typeof window[fn] !== 'function');
    if (missing.length) {
        console.warn(`[dashboard] ${missing.length} inline handler(s) missing:`, missing);
    } else {
        console.info(`[dashboard] ✓ all ${REQUIRED_HANDLERS.length} inline handlers wired`);
    }

    // 8. Ready flag for external verification scripts
    window.__dashboardReady = true;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
    boot();
}
