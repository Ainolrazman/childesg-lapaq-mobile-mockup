// js/charts/lapaq.js — self-contained. No imports. Only depends on global Chart.

/* ── Inline constants ───────────────────────────────────── */
const pieStateKeys    = ['selangor', 'kl', 'perak', 'pahang'];
const pieStateLabels  = ['Selangor', 'K. Lumpur', 'Perak', 'Pahang'];
const pieStateValues  = [12, 8, 6, 10];
const pieStateColors  = [
  'rgba(16,185,129,0.85)', 'rgba(99,102,241,0.85)',
  'rgba(245,158,11,0.85)', 'rgba(244,63,94,0.85)'
];

const pieStuntingStateKeys   = ['kl', 'selangor', 'perak', 'pahang'];
const pieStuntingStateLabels = ['K. Lumpur', 'Selangor', 'Perak', 'Pahang'];
const pieStuntingStateValues = [8, 8, 6, 16];
const pieStuntingStateColors = [
  'rgba(99,102,241,0.85)', 'rgba(16,185,129,0.85)',
  'rgba(245,158,11,0.85)', 'rgba(244,63,94,0.85)'
];

const barStateKeys        = ['kl', 'selangor', 'perak', 'pahang'];
const obesityGenderByState = { all:[24,12], kl:[6,2], selangor:[8,4], perak:[4,2], pahang:[6,4] };
const stuntingGenderByState= { all:[13,6], kl:[3,1], selangor:[3,1], perak:[2,1], pahang:[5,3] };

const TOTAL_OBESITY_CASES  = 36;
const TOTAL_STUNTING_CASES = 38;

/* ── Inline helpers ─────────────────────────────────────── */
function withPercentLabels(labels, values) {
  const total = values.reduce((a, b) => a + b, 0);
  return labels.map((l, i) => `${l} (${total ? ((values[i] / total) * 100).toFixed(1) : '0.0'}%)`);
}
function dimColor(c, dim) { return dim ? c.replace('0.85', '0.22') : c; }
function setCardText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }

/* ── Module state ───────────────────────────────────────── */
let obesityStatePieChart, obesityGenderPieChart;
let stuntingStatePieChart, stuntingGenderPieChart, stateComparisonBarChart;
let selectGeoStateFn = null;

/* ── initLapaqCharts: trajectory + radar ────────────────── */
export function initLapaqCharts() {
  const trajEl = document.getElementById('chart-lapaq-trajectory');
  if (trajEl) {
    new Chart(trajEl.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan 2025','Apr 2025','Jul 2025','Oct 2025','Jan 2026','Oct 2026'],
        datasets: [
          { label: 'Cohort Height Trajectory', data: [102.1,103.5,105.2,106.8,107.5,108.2],
            borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', fill:true, tension:0.3 },
          { label: 'WHO Normal Median Target', data: [104.0,105.1,106.2,107.1,108.0,108.8],
            borderColor:'#22c55e', borderDash:[5,5] }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color:'#cbd5e1', font:{ size:10 } } } },
        scales: {
          y: { grid:{ color:'rgba(51,65,85,0.3)' }, ticks:{ color:'#94a3b8' } },
          x: { grid:{ color:'rgba(51,65,85,0.3)' }, ticks:{ color:'#94a3b8' } }
        }
      }
    });
  }

  const rniEl = document.getElementById('chart-rni-radar');
  if (rniEl) {
    new Chart(rniEl.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Energy','Carbohydrates','Protein','Fiber','Sugar','Sodium',
                 'Calcium','Iron','Potassium','Vitamin A','Vitamin C'],
        datasets: [{
          label: 'Cohort Intake (% of RNI)',
          data: [30.5,27.9,111.6,15.5,11.8,39.7,15.9,70.3,7.9,68.6,40.3],
          backgroundColor:'rgba(239,68,68,0.2)', borderColor:'#ef4444', pointBackgroundColor:'#ef4444'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: {
          angleLines: { color:'rgba(51,65,85,0.4)' },
          grid: { color:'rgba(51,65,85,0.4)' },
          pointLabels: { color:'#cbd5e1', font:{ size:9, weight:'bold' } },
          ticks: { display:false, beginAtZero:true, max:120 }
        }}
      }
    });
  }
}

/* ── initLapaqGeoCharts: 4 pies + 1 bar ─────────────────── */
export function initLapaqGeoCharts(selectFn) {
  selectGeoStateFn = selectFn || null;

  const obStateEl = document.getElementById('chart-obesity-state-pie');
  if (obStateEl) {
    obesityStatePieChart = new Chart(obStateEl.getContext('2d'), {
      type: 'pie',
      data: { labels: withPercentLabels(pieStateLabels, pieStateValues),
              datasets: [{ data: pieStateValues, backgroundColor: pieStateColors,
                           borderColor:'#0f172a', borderWidth:2, hoverOffset:8, offset:[0,0,0,0] }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        onClick: (evt, els) => {
          if (!els?.length || !selectGeoStateFn) return;
          const clicked = pieStateKeys[els[0].index];
          selectGeoStateFn(window.__geoState === clicked ? 'all' : clicked);
        },
        plugins: {
          legend: { position:'bottom', labels:{ color:'#cbd5e1', font:{ size:10, weight:'bold' }, boxWidth:10, padding:8 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label} — click to focus` } }
        }
      }
    });
  }

  const obGenderEl = document.getElementById('chart-obesity-gender-pie');
  if (obGenderEl) {
    obesityGenderPieChart = new Chart(obGenderEl.getContext('2d'), {
      type: 'pie',
      data: { labels: withPercentLabels(['Boys','Girls'], obesityGenderByState.all),
              datasets: [{ data: obesityGenderByState.all,
                           backgroundColor:['rgba(59,130,246,0.85)','rgba(236,72,153,0.85)'],
                           borderColor:'#0f172a', borderWidth:2, hoverOffset:8 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position:'bottom', labels:{ color:'#cbd5e1', font:{ size:10, weight:'bold' }, boxWidth:10, padding:8 } } }
      }
    });
  }

  const stStateEl = document.getElementById('chart-stunting-state-pie');
  if (stStateEl) {
    stuntingStatePieChart = new Chart(stStateEl.getContext('2d'), {
      type: 'pie',
      data: { labels: withPercentLabels(pieStuntingStateLabels, pieStuntingStateValues),
              datasets: [{ data: pieStuntingStateValues, backgroundColor: pieStuntingStateColors,
                           borderColor:'#0f172a', borderWidth:2, hoverOffset:8, offset:[0,0,0,0] }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        onClick: (evt, els) => {
          if (!els?.length || !selectGeoStateFn) return;
          const clicked = pieStuntingStateKeys[els[0].index];
          selectGeoStateFn(window.__geoState === clicked ? 'all' : clicked);
        },
        plugins: {
          legend: { position:'bottom', labels:{ color:'#cbd5e1', font:{ size:10, weight:'bold' }, boxWidth:10, padding:8 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label} — click to focus` } }
        }
      }
    });
  }

  const stGenderEl = document.getElementById('chart-stunting-gender-pie');
  if (stGenderEl) {
    stuntingGenderPieChart = new Chart(stGenderEl.getContext('2d'), {
      type: 'pie',
      data: { labels: withPercentLabels(['Girls','Boys'], stuntingGenderByState.all),
              datasets: [{ data: stuntingGenderByState.all,
                           backgroundColor:['rgba(236,72,153,0.85)','rgba(20,184,166,0.85)'],
                           borderColor:'#0f172a', borderWidth:2, hoverOffset:8 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position:'bottom', labels:{ color:'#cbd5e1', font:{ size:10, weight:'bold' }, boxWidth:10, padding:8 } } }
      }
    });
  }

  const barEl = document.getElementById('chart-state-obesity-stunting-bar');
  if (barEl) {
    stateComparisonBarChart = new Chart(barEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['K. Lumpur','Selangor','Perak','Pahang'],
        datasets: [
          { label: 'Obesity Rate (%)', data: [11.4,20.0,15.0,20.0],
            backgroundColor:'rgba(244,63,94,0.85)', borderColor:'#f43f5e', borderWidth:1.5, borderRadius:6 },
          { label: 'Stunting Rate (%)', data: [11.4,13.3,15.0,32.0],
            backgroundColor:'rgba(245,158,11,0.85)', borderColor:'#f59e0b', borderWidth:1.5, borderRadius:6 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        onClick: (evt, els) => {
          if (!els?.length || !selectGeoStateFn) return;
          const clicked = barStateKeys[els[0].index];
          selectGeoStateFn(window.__geoState === clicked ? 'all' : clicked);
        },
        plugins: {
          legend: { labels:{ color:'#cbd5e1', font:{ size:10, weight:'bold' }, boxWidth:12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}% — click to focus` } }
        },
        scales: {
          y: { beginAtZero:true, max:25, grid:{ color:'rgba(51,65,85,0.3)' }, ticks:{ color:'#94a3b8', callback: v => v+'%' } },
          x: { grid:{ display:false }, ticks:{ color:'#cbd5e1', font:{ weight:'bold', size:10 } } }
        }
      }
    });
  }
}

/* ── updatePieChartsForState: called by modules/lapaq.js ── */
export function updatePieChartsForState(stateKey) {
  const isAll = stateKey === 'all';

  if (obesityStatePieChart) {
    obesityStatePieChart.data.datasets[0].offset =
      pieStateKeys.map(k => (!isAll && k === stateKey) ? 14 : 0);
    obesityStatePieChart.data.datasets[0].backgroundColor =
      pieStateKeys.map((k, i) => dimColor(pieStateColors[i], !isAll && k !== stateKey));
    obesityStatePieChart.update();
  }
  if (obesityGenderPieChart) {
    const vals = obesityGenderByState[stateKey] || obesityGenderByState.all;
    obesityGenderPieChart.data.datasets[0].data = vals;
    obesityGenderPieChart.data.labels = withPercentLabels(['Boys','Girls'], vals);
    obesityGenderPieChart.update();
  }
  if (stuntingStatePieChart) {
    stuntingStatePieChart.data.datasets[0].offset =
      pieStuntingStateKeys.map(k => (!isAll && k === stateKey) ? 14 : 0);
    stuntingStatePieChart.data.datasets[0].backgroundColor =
      pieStuntingStateKeys.map((k, i) => dimColor(pieStuntingStateColors[i], !isAll && k !== stateKey));
    stuntingStatePieChart.update();
  }
  if (stuntingGenderPieChart) {
    const vals = stuntingGenderByState[stateKey] || stuntingGenderByState.all;
    stuntingGenderPieChart.data.datasets[0].data = vals;
    stuntingGenderPieChart.data.labels = withPercentLabels(['Girls','Boys'], vals);
    stuntingGenderPieChart.update();
  }
  if (stateComparisonBarChart) {
    stateComparisonBarChart.data.datasets[0].backgroundColor =
      barStateKeys.map(k => (!isAll && k !== stateKey) ? 'rgba(244,63,94,0.22)' : 'rgba(244,63,94,0.85)');
    stateComparisonBarChart.data.datasets[1].backgroundColor =
      barStateKeys.map(k => (!isAll && k !== stateKey) ? 'rgba(245,158,11,0.22)' : 'rgba(245,158,11,0.85)');
    stateComparisonBarChart.update();
  }

  /* card text updates (unchanged from original) */
  const data = (window.geoStateData || {})[stateKey] || { name:'All Active States' };
  const stateLabel = isAll ? 'All States' : (data.name || '').split('(')[0].trim();
  const oB = (obesityGenderByState[stateKey] || obesityGenderByState.all)[0];
  const oG = (obesityGenderByState[stateKey] || obesityGenderByState.all)[1];
  const sG = (stuntingGenderByState[stateKey] || stuntingGenderByState.all)[0];
  const sB = (stuntingGenderByState[stateKey] || stuntingGenderByState.all)[1];
  const oTot = oB + oG, sTot = sG + sB;

  setCardText('card-obesity-state-title',  isAll ? 'Obesity Cases by State' : `Obesity Focus: ${stateLabel}`);
  setCardText('card-obesity-state-badge',  isAll ? `${TOTAL_OBESITY_CASES} Cases` : `${((oTot/TOTAL_OBESITY_CASES)*100).toFixed(1)}%`);
  setCardText('card-obesity-gender-badge', isAll ? 'All States' : stateLabel);
  setCardText('card-stunting-state-title', isAll ? 'Stunting Cases by State' : `Stunting Focus: ${stateLabel}`);
  setCardText('card-stunting-state-badge', isAll ? `${TOTAL_STUNTING_CASES} Cases` : `${((sTot/TOTAL_STUNTING_CASES)*100).toFixed(1)}%`);
  setCardText('card-stunting-gender-badge', isAll ? 'All States' : stateLabel);
}
