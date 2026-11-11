// js/charts/esg.js — ESG pillar bar chart.

export function initEsgCharts() {
    const ctx = document.getElementById('chart-esg-pillars').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Environmental (E)', 'Social (S)', 'Governance (G)'],
            datasets: [{
                data: [78, 86, 81],
                backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(168, 85, 247, 0.7)'],
                borderColor: ['#22c55e', '#3b82f6', '#a855f7'],
                borderWidth: 1.5,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { weight: 'bold' } } }
            }
        }
    });
}
