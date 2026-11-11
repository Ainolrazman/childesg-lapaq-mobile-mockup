// js/main.js — entry point. Wires every module together.

/* ── Charts ─────────────────────────────────────────────────── */
import { initEsgCharts } from './charts/esg.js';
import { initLapaqCharts, initLapaqGeoCharts, selectGeoState, updatePieChartsForState } from './charts/lapaq.js';
import { initPredictiveCharts, toggleHeightGender, highlightHeightSeries, handleHeightChartHover } from './charts/predictive.js';
import { initWasteTrendChart } from './charts/waste.js';

/* ── Modules ────────────────────────────────────────────────── */
import { switchMainTab } from './modules/navigation.js';
import { toggleCollapsible, initCollapsibleListeners } from './modules/collapsible.js';
import { toggleProfileDropdown, handleUserLogout, initHeaderListeners } from './modules/header.js';
import { applyGlobalFilters, resetGlobalFilters, setFilterTime } from './modules/filters.js';
import {
    renderProgramsGrid, applyProgramFilters, resetProgramFilters,
    openNewProgramModal, closeNewProgramModal, handleCreateProgramSubmit
} from './modules/programs.js';
import {
    renderClassAttendanceSummary, regenerateClassHealth, handleClassCardEnter,
    handleClassCardLeave, handleClassCardClick, unpinClassHealth,
    initClassHealthListeners
} from './modules/class-health.js';
import {
    renderRosterTable, changePageSize, changeRosterPage, filterRosterTable,
    verifySdgevidence, approveTokenPoints
} from './modules/roster.js';
import { renderAuditLogs } from './modules/audit.js';
import {
    handleSdgHover, handleSdgLeave, handleSdgClick, unpinSdg,
    openSdgReportModal, closeSdgReportModal, initSdgListeners
} from './modules/sdg.js';
import {
    loadSampleMenu, buildNutrientGrid, updateNutrientBadges, addIngredientRow,
    openNewMenuModal, closeNewMenuModal, handleSaveMenu, deleteCustomMenu,
    renderCustomMenus
} from './modules/menu-engine.js';
import {
    showMenuDayTooltip, hideMenuDayTooltip, pinMenuDay, unpinMenuDay,
    initMenuDayCards, initMenuDayListeners
} from './modules/menu-day-tooltip.js';
import {
    initRmtMenus, filterRmtMenus, showRmtTooltip, hideRmtTooltip,
    pinRmtTooltip, unpinRmtTooltip, initRmtListeners
} from './modules/menu-rmt.js';
import {
    openMenuAnalysisModal, closeMenuAnalysisModal, updateWasteStats,
    updateWasteCostPreview, openWasteLogModal, closeWasteLogModal,
    handleWasteLogSubmit, openWasteHistoryModal, closeWasteHistoryModal
} from './modules/waste.js';
import {
    openNutritionistModal, closeNutritionistModal, openBookingModal,
    closeBookingModal, handleBookingSubmit
} from './modules/nutritionist.js';
import {
    initSocialSDKs, loginWithGoogle, loginWithFacebook, openAuthModal,
    closeAuthModal, setAuthMode, handleAuthSubmit
} from './modules/auth.js';
import {
    openEsgBreakdownModal, closeEsgBreakdownModal, openWizardModal,
    closeWizardModal, selectTier, openHistoryModal, closeHistoryModal
} from './modules/modals.js';

/* ── Inline-only helpers (kept local — not worth their own module) ────── */
import { geoStateData } from '../data/geo.js';

function handleMapHover(event, stateKey) {
    const data = geoStateData[stateKey] || geoStateData.all;
    const tooltip = document.getElementById('map-hover-tooltip');
    const containerBox = document.getElementById('map-container-box');
    document.getElementById('tooltip-state-name').innerText = data.name;
    document.getElementById('tooltip-badge').innerText = data.coursesCount !== "0 Courses" ? "Active Kemaih Hub" : "Inactive Region";
    document.getElementById('tooltip-courses').innerText = data.coursesCount;
    document.getElementById('tooltip-pax').innerText = data.paxCount;
    document.getElementById('tooltip-stunting').innerText = data.badge;
    document.getElementById('tooltip-obesity').innerText = data.obesityBadge;
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top  = `${event.clientY - 10}px`;
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
        if (!activate) row.classList.remove('nutrient-highlight', 'nutrient-dim');
        else if (category === 'all') { row.classList.add('nutrient-highlight'); row.classList.remove('nutrient-dim'); }
        else {
            if (row.dataset.category === category) { row.classList.add('nutrient-highlight'); row.classList.remove('nutrient-dim'); }
            else { row.classList.add('nutrient-dim'); row.classList.remove('nutrient-highlight'); }
        }
    });
    document.querySelectorAll('.nutrient-kpi-card').forEach(card => {
        if (activate) {
            const filter = card.getAttribute('onmouseenter') || '';
            const matches = filter.includes(`'${category}'`) || (category === 'all' && filter.includes("'all'"));
            card.classList.toggle('active-filter', matches);
        } else card.classList.remove('active-filter');
    });
}

/* ── Expose to window (bridges inline on*="..." handlers) ───── */
Object.assign(window, {
    // Navigation & filters
    switchMainTab, applyGlobalFilters, resetGlobalFilters, setFilterTime,
    // Programs
    applyProgramFilters, resetProgramFilters, openNewProgramModal, closeNewProgramModal, handleCreateProgramSubmit,
    // SDG
    handleSdgHover, handleSdgLeave, handleSdgClick, unpinSdg, openSdgReportModal, closeSdgReportModal,
    // Map
    handleMapHover, handleMapLeave, selectGeoState,
    // Class-health
    regenerateClassHealth, unpinClassHealth, handleClassCardEnter, handleClassCardLeave, handleClassCardClick,
    // RMT
    filterRmtMenus, showRmtTooltip, hideRmtTooltip, pinRmtTooltip, unpinRmtTooltip,
    // Menu-engine
    openNewMenuModal, closeNewMenuModal, handleSaveMenu, loadSampleMenu,
    addIngredientRow, updateNutrientBadges, deleteCustomMenu, renderCustomMenus,
    // Menu-day tooltip
    unpinMenuDay,
    // Waste
    openMenuAnalysisModal, closeMenuAnalysisModal, openWasteLogModal, closeWasteLogModal,
    handleWasteLogSubmit, openWasteHistoryModal, closeWasteHistoryModal,
    // Nutritionist
    openNutritionistModal, closeNutritionistModal, openBookingModal, closeBookingModal, handleBookingSubmit,
    // Auth
    openAuthModal, closeAuthModal, setAuthMode, handleAuthSubmit, loginWithGoogle, loginWithFacebook,
    // Header
    toggleProfileDropdown, handleUserLogout,
    // Roster
    changePageSize, changeRosterPage, filterRosterTable, verifySdgevidence, approveTokenPoints,
    // Modals
    openEsgBreakdownModal, closeEsgBreakdownModal, openWizardModal, closeWizardModal, selectTier,
    openHistoryModal, closeHistoryModal,
    // Height chart controls
    toggleHeightGender, highlightHeightSeries, handleHeightChartHover,
    // Nutrient table
    highlightNutrients
});

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Register document-level listeners (previously auto-registered by inline script)
    initCollapsibleListeners();
    initHeaderListeners();
    initClassHealthListeners();
    initSdgListeners();
    initMenuDayListeners();
    initRmtListeners();

    // Initialize charts
    initEsgCharts();
    initLapaqCharts();
    initLapaqGeoCharts();
    initPredictiveCharts();
    updatePieChartsForState('all');

    // Render UI
    renderAuditLogs();
    renderProgramsGrid();
    renderRosterTable();
    renderClassAttendanceSummary();
    buildNutrientGrid();
    renderCustomMenus();
    updateWasteStats();
    initMenuDayCards();

    // Async: load RMT dataset
    initRmtMenus();

    // Social SDKs
    initSocialSDKs();

    // Waste-log leftovers cost preview
    const leftoversInput = document.getElementById('waste-log-leftovers');
    if (leftoversInput) leftoversInput.addEventListener('input', updateWasteCostPreview);
});
