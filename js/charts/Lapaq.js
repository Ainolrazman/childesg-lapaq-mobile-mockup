// js/charts/lapaq.js — LaPaQ growth + geo charts.

import { state } from '../state.js';
import {
    pieStateKeys, pieStateLabels, pieStateValues, pieStateColors,
    pieStuntingStateKeys, pieStuntingStateLabels, pieStuntingStateValues, pieStuntingStateColors,
    barStateKeys, obesityGenderByState, stuntingGenderByState,
    TOTAL_OBESITY_CASES, TOTAL_STUNTING_CASES
} from '../config.js';
import { geoStateData } from '../data/geo.js';
import { withPercentLabels } from '../utils/format.js';
import { dimColor } from '../utils/color.js';
import { setCardText } from '../utils/dom.js';

let obesityStatePieChart = null;
let obesityGenderPieChart = null;
let stuntingStatePieChart = null;
let stuntingGenderPieChart = null;
let stateComparisonBarChart = null;

/* ── Growth Trajectory + RNI Radar ────────────────────────────── */
export function initLapaqCharts() {
    const ctxTraj = document.getElementById('chart-lapaq-trajectory').getContext('2d');
    new Chart(ctxTraj, {
        type: 'line',
        data: {
            labels: ['Jan 2025', 'Apr 2025', 'Jul 2025', 'Oct 2025', 'Jan 2026', 'Oct 2026'],
            datasets: [
                { label: 'Cohort Height Trajectory', data: [102.1, 103.5, 105.2, 106.8, 107.5, 108.2], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.3 },
                { label: 'WHO Normal Median Target', data: [104.0, 105.1, 106.2, 107.1, 108.0, 108.8], borderColor: '#22c55e', borderDash: [5, 5] }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#cbd5e1', font: { size: 10 } } } },
            scales: {
                y: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });

    const ctxRadar = document.getElementById('chart-rni-radar').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Energy', 'Carbohydrates', 'Protein', 'Fiber', 'Sugar', 'Sodium', 'Calcium', 'Iron', 'Potassium', 'Vitamin A', 'Vitamin C'],
            datasets: [{
                label: 'Cohort Intake (% of RNI)',
                data: [30.5, 27.9, 111.6, 15.5, 11.8, 39.7, 15.9, 70.3, 7.9, 68.6, 40.3],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#ef4444',
                pointBackgroundColor: '#ef4444'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { r: {
                angleLines: { color: 'rgba(51, 65, 85, 0.4)' },
                grid: { color: 'rgba(51, 65, 85, 0.4)' },
                pointLabels: { color: '#cbd5e1', font: { size: 9, weight: 'bold' } },
                ticks: { display: false, beginAtZero: true, max: 120 }
            } }
        }
    });
}

/* ── Geo Pie + Bar Charts ────────────────────────────────────── */
export function initLapaqGeoCharts() {
    obesityStatePieChart = new Chart(document.getElementById('chart-obesity-state-pie').getContext('2d'), {
        type: 'pie',
        data: { labels: withPercentLabels(pieStateLabels, pieStateValues), datasets: [{ data: pieStateValues, backgroundColor: pieStateColors, borderColor: '#0f172a', borderWidth: 2, hoverOffset: 8, offset: [0, 0, 0, 0] }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, elements) => {
                if (!elements || !elements.length) return;
                const clicked = pieStateKeys[elements[0].index];
                if (state.selectedGeoState === clicked) selectGeoState('all'); else selectGeoState(clicked);
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, boxWidth: 10, padding: 8 } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.label} — click to focus` } }
            }
        }
    });

    obesityGenderPieChart = new Chart(document.getElementById('chart-obesity-gender-pie').getContext('2d'), {
        type: 'pie',
        data: { labels: withPercentLabels(['Boys', 'Girls'], obesityGenderByState.all), datasets: [{ data: obesityGenderByState.all, backgroundColor: ['rgba(59, 130, 246, 0.85)', 'rgba(236, 72, 153, 0.85)'], borderColor: '#0f172a', borderWidth: 2, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, boxWidth: 10, padding: 8 } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}` } }
            }
        }
    });

    stuntingStatePieChart = new Chart(document.getElementById('chart-stunting-state-pie').getContext('2d'), {
        type: 'pie',
        data: { labels: withPercentLabels(pieStuntingStateLabels, pieStuntingStateValues), datasets: [{ data: pieStuntingStateValues, backgroundColor: pieStuntingStateColors, borderColor: '#0f172a', borderWidth: 2, hoverOffset: 8, offset: [0, 0, 0, 0] }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, elements) => {
                if (!elements || !elements.length) return;
                const clicked = pieStuntingStateKeys[elements[0].index];
                if (state.selectedGeoState === clicked) selectGeoState('all'); else selectGeoState(clicked);
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, boxWidth: 10, padding: 8 } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.label} — click to focus` } }
            }
        }
    });

    stuntingGenderPieChart = new Chart(document.getElementById('chart-stunting-gender-pie').getContext('2d'), {
        type: 'pie',
        data: { labels: withPercentLabels(['Girls', 'Boys'], stuntingGenderByState.all), datasets: [{ data: stuntingGenderByState.all, backgroundColor: ['rgba(236, 72, 153, 0.85)', 'rgba(20, 184, 166, 0.85)'], borderColor: '#0f172a', borderWidth: 2, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, boxWidth: 10, padding: 8 } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}` } }
            }
        }
    });

    stateComparisonBarChart = new Chart(document.getElementById('chart-state-obesity-stunting-bar').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['K. Lumpur', 'Selangor', 'Perak', 'Pahang'],
            datasets: [
                { label: 'Obesity Rate (%)', data: [11.4, 20.0, 15.0, 20.0], backgroundColor: 'rgba(244, 63, 94, 0.85)', borderColor: '#f43f5e', borderWidth: 1.5, borderRadius: 6 },
                { label: 'Stunting Rate (%)', data: [11.4, 13.3, 15.0, 32.0], backgroundColor: 'rgba(245, 158, 11, 0.85)', borderColor: '#f59e0b', borderWidth: 1.5, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, elements) => {
                if (!elements || !elements.length) return;
                const clicked = barStateKeys[elements[0].index];
                if (state.selectedGeoState === clicked) selectGeoState('all'); else selectGeoState(clicked);
            },
            plugins: {
                legend: { labels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, boxWidth: 12 } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}% — click to focus` } }
            },
            scales: {
                y: { beginAtZero: true, max: 25, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', callback: (v) => v + '%' } },
                x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { weight: 'bold', size: 10 } } }
            }
        }
    });
}

/* ── State Selector ──────────────────────────────────────────── */
export function selectGeoState(stateKey) {
    state.selectedGeoState = stateKey;
    const data = geoStateData[stateKey] || geoStateData.all;

    ['all', 'kl', 'selangor', 'perak', 'pahang'].forEach(k => {
        const btn = document.getElementById(`geo-btn-${k}`);
        if (btn) btn.className = k === stateKey
            ? "p-3 bg-indigo-600 text-white rounded-2xl border border-indigo-400/30 text-left transition space-y-1 shadow-lg shadow-indigo-600/20"
            : "p-3 bg-slate-950/60 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-800/80 text-left transition space-y-1";
    });

    ['kl', 'selangor', 'perak', 'pahang'].forEach(s => {
        const el = document.getElementById(`svg-state-${s}`);
        if (el) {
            el.style.strokeWidth = s === stateKey ? "4px" : "2.5px";
            el.style.stroke = s === stateKey ? "#f59e0b" : (s === 'pahang' ? '#f43f5e' : (s === 'selangor' ? '#10b981' : '#6366f1'));
        }
    });

    document.getElementById('geo-selected-badge').innerText = `Viewing: ${data.name}`;
    document.getElementById('geo-card-title').innerText = data.title;
    document.getElementById('geo-courses-count').innerText = data.coursesCount;
    document.getElementById('geo-stunting-badge').innerText = data.badge;
    document.getElementById('geo-stunting-detail').innerText = data.stuntingDetail;
    document.getElementById('geo-stunting-gender').innerText = data.stuntingGender;
    document.getElementById('geo-obesity-badge').innerText = data.obesityBadge;
    document.getElementById('geo-obesity-detail').innerText = data.obesityDetail;
    document.getElementById('geo-obesity-gender').innerText = data.obesityGender;
    document.getElementById('geo-calcium-val').innerText = data.calcium;
    document.getElementById('geo-vitc-val').innerText = data.vitc;

    updatePieChartsForState(stateKey);
}

/* ── Sync Pie/Bar Charts to Selected State ───────────────────── */
export function updatePieChartsForState(stateKey) {
    const isAll = stateKey === 'all';
    const data = geoStateData[stateKey] || geoStateData.all;

    if (obesityStatePieChart) {
        const offsets = pieStateKeys.map(k => (!isAll && k === stateKey) ? 14 : 0);
        const bgColors = pieStateKeys.map((k, i) => dimColor(pieStateColors[i], !isAll && k !== stateKey));
        obesityStatePieChart.data.datasets[0].offset = offsets;
        obesityStatePieChart.data.datasets[0].backgroundColor = bgColors;
        obesityStatePieChart.update();
    }
    if (obesityGenderPieChart) {
        const vals = obesityGenderByState[stateKey] || obesityGenderByState.all;
        obesityGenderPieChart.data.datasets[0].data = vals;
        obesityGenderPieChart.data.labels = withPercentLabels(['Boys', 'Girls'], vals);
        obesityGenderPieChart.update();
    }
    if (stuntingStatePieChart) {
        const offsets = pieStuntingStateKeys.map(k => (!isAll && k === stateKey) ? 14 : 0);
        const bgColors = pieStuntingStateKeys.map((k, i) => dimColor(pieStuntingStateColors[i], !isAll && k !== stateKey));
        stuntingStatePieChart.data.datasets[0].offset = offsets;
        stuntingStatePieChart.data.datasets[0].backgroundColor = bgColors;
        stuntingStatePieChart.update();
    }
    if (stuntingGenderPieChart) {
        const vals = stuntingGenderByState[stateKey] || stuntingGenderByState.all;
        stuntingGenderPieChart.data.datasets[0].data = vals;
        stuntingGenderPieChart.data.labels = withPercentLabels(['Girls', 'Boys'], vals);
        stuntingGenderPieChart.update();
    }
    if (stateComparisonBarChart) {
        const obesityColors = barStateKeys.map(k => (!isAll && k !== stateKey) ? 'rgba(244, 63, 94, 0.22)' : 'rgba(244, 63, 94, 0.85)');
        const stuntingColors = barStateKeys.map(k => (!isAll && k !== stateKey) ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.85)');
        stateComparisonBarChart.data.datasets[0].backgroundColor = obesityColors;
        stateComparisonBarChart.data.datasets[1].backgroundColor = stuntingColors;
        stateComparisonBarChart.update();
    }

    const stateLabel = isAll ? 'All States' : data.name.split('(')[0].trim();
    const obesityBoys = (obesityGenderByState[stateKey] || obesityGenderByState.all)[0];
    const obesityGirls = (obesityGenderByState[stateKey] || obesityGenderByState.all)[1];
    const stuntingGirls = (stuntingGenderByState[stateKey] || stuntingGenderByState.all)[0];
    const stuntingBoys = (stuntingGenderByState[stateKey] || stuntingGenderByState.all)[1];
    const obesityTotal = obesityBoys + obesityGirls;
    const stuntingTotal = stuntingGirls + stuntingBoys;
    const obesitySharePct = TOTAL_OBESITY_CASES ? ((obesityTotal / TOTAL_OBESITY_CASES) * 100).toFixed(1) : '0.0';
    const stuntingSharePct = TOTAL_STUNTING_CASES ? ((stuntingTotal / TOTAL_STUNTING_CASES) * 100).toFixed(1) : '0.0';
    const obesityBoysPct = obesityTotal ? ((obesityBoys / obesityTotal) * 100).toFixed(1) : '0.0';
    const obesityGirlsPct = obesityTotal ? ((obesityGirls / obesityTotal) * 100).toFixed(1) : '0.0';
    const stuntingGirlsPct = stuntingTotal ? ((stuntingGirls / stuntingTotal) * 100).toFixed(1) : '0.0';
    const stuntingBoysPct = stuntingTotal ? ((stuntingBoys / stuntingTotal) * 100).toFixed(1) : '0.0';

    setCardText('card-obesity-state-title', isAll ? 'Obesity Cases by State' : `Obesity Focus: ${stateLabel}`);
    setCardText('card-obesity-state-badge', isAll ? `${TOTAL_OBESITY_CASES} Cases` : `${obesitySharePct}%`);
    setCardText('card-obesity-state-note', isAll ? 'Distribution of confirmed child obesity cases (Age 7–12) across active Kemaih state hubs. Click any slice to focus.' : `${stateLabel} accounts for ${obesitySharePct}% of all confirmed obesity cases. Click the same slice again to reset.`);
    setCardText('card-obesity-gender-title', isAll ? 'Obesity Gender Split' : `${stateLabel} Obesity Gender`);
    setCardText('card-obesity-gender-badge', isAll ? 'All States' : stateLabel);
    setCardText('card-obesity-gender-note', isAll ? `Boys: ${obesityBoysPct}% • Girls: ${obesityGirlsPct}% of confirmed obesity cases.` : `${stateLabel}: Boys ${obesityBoysPct}% • Girls ${obesityGirlsPct}%.`);
    setCardText('card-stunting-state-title', isAll ? 'Stunting Cases by State' : `Stunting Focus: ${stateLabel}`);
    setCardText('card-stunting-state-badge', isAll ? `${TOTAL_STUNTING_CASES} Cases` : `${stuntingSharePct}%`);
    setCardText('card-stunting-state-note', isAll ? 'Distribution of confirmed child stunting cases (Age 3–6) across active Kemaih state hubs. Click any slice to focus.' : `${stateLabel} accounts for ${stuntingSharePct}% of all confirmed stunting cases. Click the same slice again to reset.`);
    setCardText('card-stunting-gender-title', isAll ? 'Stunting Gender Split' : `${stateLabel} Stunting Gender`);
    setCardText('card-stunting-gender-badge', isAll ? 'All States' : stateLabel);
    setCardText('card-stunting-gender-note', isAll ? `Girls: ${stuntingGirlsPct}% • Boys: ${stuntingBoysPct}% of confirmed stunting cases.` : `${stateLabel}: Girls ${stuntingGirlsPct}% • Boys ${stuntingBoysPct}%.`);
}
