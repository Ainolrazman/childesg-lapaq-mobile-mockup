// js/main.js — entry point. Wires every module together.

/* ── Charts ─────────────────────────────────────────────────── */
import { initEsgCharts } from './charts/esg.js';
import {
    initLapaqCharts,
    initLapaqGeoCharts,
    selectGeoState,
    updatePieChartsForState
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
import { geoStateData } from '../data/geo.js';

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

    // Menu-day tooltip
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
    // 1. Document-level listeners (event delegation)
    initCollapsibleListeners();
    initHeaderListeners();
    initClassHealthListeners();
    initSdgListeners();
    initMenuDayListeners();
    initRmtListeners();

    // 2. Charts
    initEsgCharts();
    initLapaqCharts();
    initLapaqGeoCharts();
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
    initMenuDayCards();

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
        console.warn(
            `[dashboard] ${missing.length} inline handler(s) missing:`,
            missing
        );
    } else {
        console.info(
            `[dashboard] ✓ all ${REQUIRED_HANDLERS.length} inline handlers wired`
        );
    }

    // 8. Ready flag for external verification scripts
    window.__dashboardReady = true;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
    // Module ran after DOMContentLoaded (bundler, dynamic import, etc.)
    boot();
}
