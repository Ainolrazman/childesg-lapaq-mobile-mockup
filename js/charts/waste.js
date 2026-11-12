// js/charts/waste.js — 7-day leftovers vs diverted trend chart.

import { wasteLogs } from '../../data/waste.js';   // ← FIX: two ../

let wasteTrendChart = null;

export function initWasteTrendChart() {
    const el = document.getElementById('chart-waste-trend');
    if (!el) return;
    if (wasteTrendChart) { wasteTrendChart.destroy(); wasteTrendChart = null; }

    const labels        = wasteLogs.map(l => l.date.slice(5));
    const leftoversData = wasteLogs.map(l => l.leftovers);
    const divertedData  = wasteLogs.map(l => l.diverted);

    wasteTrendChart = new Chart(el.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Leftovers (kg)',
                    data: leftoversData,
                    backgroundColor: 'rgba(244, 63, 94, 0.75)',
                    borderColor: '#f43f5e',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: 'Diverted (kg)',
                    data: divertedData,
                    backgroundColor: 'rgba(16, 185, 129, 0.75)',
                    borderColor: '#10b981',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        font: { size: 10, weight: 'bold' },
                        boxWidth: 12,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} kg`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(51, 65, 85, 0.3)' },
                    ticks: { color: '#94a3b8', callback: (v) => v + ' kg' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#cbd5e1', font: { size: 10, weight: 'bold' } }
                }
            }
        }
    });
}
