// js/charts/predictive.js — projected height trajectory + adult risk multipliers.

import { heightData } from '../data/height.js';
import { hexToRgba } from '../utils/color.js';

let predictedHeightChart = null;
let adultRiskMultipliersChart = null;
let currentHeightGender = 'male';
let heightSeriesDefaults = [];
let currentHighlightedSeries = null;

function captureHeightDefaults() {
    if (!predictedHeightChart) return;
    heightSeriesDefaults = predictedHeightChart.data.datasets.map(ds => ({
        borderColor: ds.borderColor,
        borderWidth: ds.borderWidth,
        pointRadius: ds.pointRadius,
        pointBackgroundColor: ds.pointBackgroundColor,
        backgroundColor: ds.backgroundColor
    }));
}

export function highlightHeightSeries(index, force = false) {
    if (!predictedHeightChart || !heightSeriesDefaults.length) return;
    if (currentHighlightedSeries === index && !force) return;
    currentHighlightedSeries = index;
    predictedHeightChart.data.datasets.forEach((ds, i) => {
        const base = heightSeriesDefaults[i];
        if (!base) return;
        if (index === null) {
            ds.borderColor = base.borderColor;
            ds.borderWidth = base.borderWidth;
            ds.pointRadius = base.pointRadius;
            ds.pointBackgroundColor = base.pointBackgroundColor;
            ds.backgroundColor = base.backgroundColor;
        } else if (i === index) {
            ds.borderColor = base.borderColor;
            ds.borderWidth = base.borderWidth + 1.5;
            ds.pointRadius = base.pointRadius + 2;
            ds.pointBackgroundColor = base.pointBackgroundColor;
            ds.backgroundColor = base.backgroundColor;
        } else {
            ds.borderColor = hexToRgba(base.borderColor, 0.18);
            ds.borderWidth = 1;
            ds.pointRadius = 0;
            ds.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
    });
    predictedHeightChart.update('none');
}

export function handleHeightChartHover(event, activeElements) {
    if (!activeElements || activeElements.length === 0) { highlightHeightSeries(null); return; }
    highlightHeightSeries(activeElements[0].datasetIndex);
}

export function toggleHeightGender(gender) {
    currentHeightGender = gender;
    const d = heightData[gender];
    document.getElementById('btn-height-male').className = gender === 'male'
        ? "px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-600 text-white shadow transition"
        : "px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-400 hover:text-white transition";
    document.getElementById('btn-height-female').className = gender === 'female'
        ? "px-2.5 py-1 text-[10px] font-bold rounded-lg bg-pink-600 text-white shadow transition"
        : "px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-400 hover:text-white transition";
    document.getElementById('who-label').innerText = d.label;
    document.getElementById('who-value').innerText = `${d.whoRef} cm`;
    if (predictedHeightChart) {
        predictedHeightChart.data.datasets[0].data = d.whoMedian;
        predictedHeightChart.data.datasets[1].data = d.currentDiet;
        predictedHeightChart.data.datasets[2].data = d.intervention;
        predictedHeightChart.update();
        captureHeightDefaults();
        if (currentHighlightedSeries !== null) {
            const prev = currentHighlightedSeries;
            currentHighlightedSeries = null;
            highlightHeightSeries(prev, true);
        }
    }
}

export function initPredictiveCharts() {
    const ctxH = document.getElementById('chart-predicted-height');
    if (ctxH) {
        const d = heightData.male;
        predictedHeightChart = new Chart(ctxH.getContext('2d'), {
            type: 'line',
            data: {
                labels: d.labels,
                datasets: [
                    { label: 'WHO Median (Male 171 cm)', data: d.whoMedian, borderColor: '#6366f1', borderDash: [5, 5], borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#6366f1', fill: false, tension: 0.3 },
                    { label: 'Current Diet (Projected)', data: d.currentDiet, borderColor: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.15)', fill: true, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#f43f5e', tension: 0.3 },
                    { label: 'Intervention @ 6mo', data: d.intervention, borderColor: '#22c55e', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#22c55e', borderDash: [2, 3], fill: false, tension: 0.3 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'nearest', intersect: false },
                onHover: handleHeightChartHover,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.96)',
                        borderColor: 'rgba(99, 102, 241, 0.55)',
                        borderWidth: 1,
                        padding: 10,
                        titleColor: '#e2e8f0',
                        titleFont: { family: 'JetBrains Mono', size: 11, weight: 'bold' },
                        bodyColor: '#f1f5f9',
                        bodyFont: { family: 'JetBrains Mono', size: 12, weight: 'bold' },
                        displayColors: true,
                        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} cm` }
                    }
                },
                scales: {
                    y: { beginAtZero: false, min: 40, max: 180, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', callback: (v) => v + ' cm' } },
                    x: { grid: { color: 'rgba(51, 65, 85, 0.15)' }, ticks: { color: '#cbd5e1', font: { weight: 'bold', size: 10 } } }
                }
            }
        });
        ctxH.addEventListener('mouseleave', () => highlightHeightSeries(null));
        captureHeightDefaults();
    }

    const ctxR = document.getElementById('chart-adult-risk-multipliers');
    if (ctxR) {
        adultRiskMultipliersChart = new Chart(ctxR.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Dental Caries', 'Iron Deficiency Anemia', 'Metabolic Syndrome', 'Hypertension (40s+)', 'Osteoporosis (60s+)', 'Type 2 Diabetes', 'Chronic Immune Dysfunction'],
                datasets: [{
                    label: 'Risk Multiplier vs Baseline',
                    data: [2.30, 2.50, 1.55, 1.40, 1.35, 1.28, 1.15],
                    backgroundColor: ['rgba(244, 63, 94, 0.85)', 'rgba(239, 68, 68, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(234, 179, 8, 0.85)', 'rgba(168, 85, 247, 0.85)', 'rgba(99, 102, 241, 0.85)', 'rgba(59, 130, 246, 0.85)'],
                    borderColor: ['#f43f5e', '#ef4444', '#f59e0b', '#eab308', '#a855f7', '#6366f1', '#3b82f6'],
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => {
                        const v = ctx.parsed.x;
                        const pct = ((v - 1) * 100).toFixed(0);
                        return ` ${v.toFixed(2)}× risk (${pct >= 0 ? '+' : ''}${pct}% vs baseline)`;
                    } } }
                },
                scales: {
                    x: { beginAtZero: true, max: 3, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', callback: (v) => v + '×' } },
                    y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { weight: 'bold', size: 10 } } }
                }
            }
        });
    }
}
