import { state } from '../state/store.js';
import { askGemini } from '../utils/geminiService.js';

window.runCustomAiInquiry = async function() {
    const inputEl = document.getElementById('ai-coach-input');
    const outputEl = document.getElementById('ai-coach-response');
    const btnEl = document.getElementById('ai-coach-btn');
    const userQuery = inputEl?.value.trim();
    const isBm = state.currentLang === 'bm';

    if (!userQuery) {
        alert(isBm ? 'Sila masukkan soalan anda terlebih dahulu.' : 'Please enter your question first.');
        return;
    }

    if (outputEl) {
        outputEl.innerHTML = `<span class="italic text-slate-400 animate-pulse">${isBm ? '🤖 Gemini sedang menganalisis...' : '🤖 Gemini is analyzing...'}</span>`;
    }
    if (btnEl) btnEl.disabled = true;

    const child = state.childrenData[state.selectedChild];
    const prompt = `Act as a professional pediatric nutritionist for the LaPaQ child nutrition platform. 
    Child context: ${child.name}, ${child.age || 'young'} years old. 
    User question: "${userQuery}". 
    Provide a concise, practical, and affordable local Malaysian food recommendation or answer. Keep it under 3 sentences.`;

    try {
        let apiKey = localStorage.getItem('GEMINI_API_KEY');
        if (!apiKey || apiKey === 'undefined' || apiKey === 'YOUR_ACTUAL_API_KEY' || apiKey.trim() === '') {
            apiKey = 'AQ.Ab8RN6LXSvTJhvnmYSv-uvjYYERj6GAV-ECzHTR0F_C2sWEBWg';
            localStorage.setItem('GEMINI_API_KEY', apiKey);
        }

        const aiResponse = await askGemini(prompt, apiKey);
        
        if (outputEl) {
            outputEl.innerHTML = `<p class="text-xs text-slate-700 leading-relaxed font-medium">✨ ${aiResponse}</p>`;
        }
    } catch (error) {
        console.error('AI Inquiry Error:', error);
        if (outputEl) {
            outputEl.innerHTML = `<p class="text-xs text-rose-600 font-medium">⚠️ Error: ${error.message}</p>`;
        }
    } finally {
        if (btnEl) btnEl.disabled = false;
    }
};

// ✅ FIX: Local timezone function to match the browser's date picker exactly.
function getTodayDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

/* ============================================================ */
/* ============ MEAL LOG ENGINE ============================== */
/* ============================================================ */

const RNI_REFERENCE = {
    'Calories':      { ref: 1800, unit: 'kcal' },
    'Carbohydrate':  { ref: 240,  unit: 'g'    },
    'Protein':       { ref: 45,   unit: 'g'    },
    'Fiber':         { ref: 20,   unit: 'g'    },
    'Calcium':       { ref: 800,  unit: 'mg'   },
    'Iron':          { ref: 12,   unit: 'mg'   },
    'Potassium':     { ref: 2300, unit: 'mg'   },
    'Vitamin A':     { ref: 500,  unit: 'µg RE'},
    'Vitamin C':     { ref: 40,   unit: 'mg'   }
};

const METRIC_KEY_MAP = {
    'Calories (Kcal)':  'Calories',
    'Kalori (Kcal)':    'Calories',
    'Carbohydrate':     'Carbohydrate',
    'Karbohidrat':      'Carbohydrate',
    'Protein':          'Protein',
    'Fiber':            'Fiber',
    'Serat':            'Fiber',
    'Calcium':          'Calcium',
    'Kalsium':          'Calcium',
    'Iron':             'Iron',
    'Zat Besi':         'Iron',
    'Potassium':        'Potassium',
    'Kalium':           'Potassium',
    'Vitamin A':        'Vitamin A',
    'Vitamin C':        'Vitamin C'
};

const mealSlug = (k) => k.replace(/\s+/g, '-');
const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function getLoggedMeals() {
    try { return JSON.parse(localStorage.getItem('lapaq_logged_meals') || '[]'); }
    catch (e) { return []; }
}

function persistLoggedMeals(meals) {
    try {
        localStorage.setItem('lapaq_logged_meals', JSON.stringify(meals));
    } catch (e) {
        console.error("Failed to save to localStorage", e);
        alert("⚠️ Storage limit reached. Cannot save new meals.");
    }
}

/* ============================================================ */
/* ============ COST HELPERS ================================== */
/* ============================================================ */

function getMealCost(meal) {
    if (typeof meal.cost === 'number' && meal.cost >= 0) return meal.cost;
    return (meal.ingredients || []).reduce((sum, i) => sum + (Number(i.cost) || 0), 0);
}

function getPeriodCost(meals) {
    return meals.reduce((sum, m) => sum + getMealCost(m), 0);
}

function formatRM(amount) {
    return `RM ${Number(amount || 0).toFixed(2)}`;
}

/* ============================================================ */
/* ============ DATE HELPERS ================================== */
/* ============================================================ */

function formatDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

function getLast7Days() {
    const todayStr = getTodayDateString();
    const [y, m, d] = todayStr.split('-').map(Number);
    const end = new Date(y, m - 1, d);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const cur = new Date(end);
        cur.setDate(cur.getDate() - i);
        days.push(formatDateKey(cur));
    }
    return days;
}

function formatDisplayDate(dateStr, isBm) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const locale = isBm ? 'ms-MY' : 'en-MY';
    const label = date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    return isToday ? (isBm ? `Hari Ini · ${label}` : `Today · ${label}`) : label;
}

function formatShortDate(dateStr, isBm) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const locale = isBm ? 'ms-MY' : 'en-MY';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

/* ============================================================ */
/* ============ TOKEN CLAIM GATE + TIERS ====================== */
/* ============================================================ */

const RNI_TOKEN_THRESHOLD = 75;   // ✅ unlocked at 75%
const RNI_METRIC_KEYS = ['Calories','Carbohydrate','Protein','Fiber','Calcium',
                         'Iron','Potassium','Vitamin A','Vitamin C'];

/* ============================================================ */
/* ============ RNI TOKEN TIER REWARDS ======================== */
/* ============================================================ */

const RNI_TOKEN_TIERS = [
    { min: 96, tokens: 10, label: '96-100%' },
    { min: 91, tokens: 8,  label: '91-95%'  },
    { min: 86, tokens: 4,  label: '86-90%'  },
    { min: 81, tokens: 2,  label: '81-85%'  },
    { min: 75, tokens: 1,  label: '75-80%'  }
];

function getRNITokenReward(pct) {
    for (const tier of RNI_TOKEN_TIERS) {
        if (pct >= tier.min) return tier.tokens;
    }
    return 0;
}

function getPeriodDayCount(timeSpan, startDate, endDate) {
    if (timeSpan === '1week')  return 7;
    if (timeSpan === '1month') return 30;
    if (timeSpan === 'custom' && startDate && endDate) {
        const [sy, sm, sd] = startDate.split('-').map(Number);
        const [ey, em, ed] = endDate.split('-').map(Number);
        const startUTC = Date.UTC(sy, sm - 1, sd);
        const endUTC   = Date.UTC(ey, em - 1, ed);
        return Math.max(1, Math.round((endUTC - startUTC) / 86400000) + 1);
    }
    return 1;
}

function getPeriodMeals(childId, timeSpan, startDate, endDate) {
    const todayDateStr = getTodayDateString();
    const meals = getLoggedMeals().filter(m => m.child === childId);

    if (timeSpan === '1week') {
        const days = getLast7Days();
        return meals.filter(m => days.includes(m.date));
    }
    if (timeSpan === '1month') {
        const days = [];
        const t = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(t);
            d.setDate(d.getDate() - i);
            days.push(formatDateKey(d));
        }
        return meals.filter(m => days.includes(m.date));
    }
    if (timeSpan === 'custom' && startDate && endDate) {
        return meals.filter(m => m.date >= startDate && m.date <= endDate);
    }
    return meals.filter(m => m.date === todayDateStr);
}

function computeOverallRniCompliancePct(childId, timeSpan, startDate, endDate) {
    const dayCount = getPeriodDayCount(timeSpan, startDate, endDate);
    const meals    = getPeriodMeals(childId, timeSpan, startDate, endDate);

    const totals = meals.reduce((acc, m) => {
        Object.entries(m.nutrients || {}).forEach(([k, v]) => {
            acc[k] = (acc[k] || 0) + (Number(v) || 0);
        });
        return acc;
    }, {});

    let sum = 0;
    RNI_METRIC_KEYS.forEach(k => {
        const dailyAvg = (totals[k] || 0) / dayCount;
        sum += Math.min((dailyAvg / RNI_REFERENCE[k].ref) * 100, 100);
    });
    return Math.round(sum / RNI_METRIC_KEYS.length);
}

window.claimRNITokenWithGate = function () {
    const childId = state.selectedChild;
    const child = state.childrenData[childId];
    const isBm = state.currentLang === 'bm';

    if (!child) return;

    let alreadyClaimed = !!child.rniClaimed;
    if (!alreadyClaimed) {
        try {
            const claims = JSON.parse(localStorage.getItem('lapaq_rni_claims') || '{}');
            if (claims[childId]) alreadyClaimed = true;
        } catch (e) { /* ignore */ }
    }
    if (alreadyClaimed) return;

    const pct = computeOverallRniCompliancePct(
        childId,
        state.lapaqTimeSpan,
        state.lapaqStartDate,
        state.lapaqEndDate
    );

    if (pct < RNI_TOKEN_THRESHOLD) {
        alert(isBm
            ? `🔒 Token belum boleh dituntut.\n\nPematuhan RNI harian anda: ${pct}%\nDiperlukan: ${RNI_TOKEN_THRESHOLD}%\n\nTambah makanan bernutrisi untuk mencapai sasaran.`
            : `🔒 Token locked.\n\nYour daily RNI compliance: ${pct}%\nRequired: ${RNI_TOKEN_THRESHOLD}%\n\nLog more nutritious meals to reach the target.`);
        return;
    }

    const reward = getRNITokenReward(pct);
    if (reward <= 0) return;

    child.totalTokens    = (child.totalTokens || 0) + reward;
    child.rniClaimed     = true;
    child.rniClaimPct    = pct;
    child.rniClaimTokens = reward;
    child.rniClaimDate   = new Date().toISOString();

    try {
        const claims = JSON.parse(localStorage.getItem('lapaq_rni_claims') || '{}');
        claims[childId] = {
            pct,
            tokens: reward,
            date:   child.rniClaimDate
        };
        localStorage.setItem('lapaq_rni_claims', JSON.stringify(claims));
    } catch (e) {
        console.error('Failed to persist RNI claim', e);
    }

    alert(isBm
        ? `🎉 Tahniah!\n\nPematuhan RNI harian: ${pct}%\nGanjaran: ${reward} token 🪙\n\n${reward} token telah ditambah ke dompet anda.`
        : `🎉 Congratulations!\n\nDaily RNI compliance: ${pct}%\nReward: ${reward} token${reward > 1 ? 's' : ''} 🪙\n\n${reward} token${reward > 1 ? 's have' : ' has'} been added to your wallet.`);

    window._refreshLaPaQView?.();
    window._refreshTokensView?.();
};

window.RNI_TOKEN_THRESHOLD = RNI_TOKEN_THRESHOLD;
window.RNI_TOKEN_TIERS     = RNI_TOKEN_TIERS;
window.getRNITokenReward   = getRNITokenReward;

window.getRNIClaimPreview = function () {
    try {
        const pct = computeOverallRniCompliancePct(
            state.selectedChild,
            state.lapaqTimeSpan,
            state.lapaqStartDate,
            state.lapaqEndDate
        );
        return {
            pct,
            tokens:   getRNITokenReward(pct),
            eligible: pct >= RNI_TOKEN_THRESHOLD
        };
    } catch (e) {
        return null;
    }
};

/* ============================================================ */
/* ============ TOKEN RESET (minted claim) ==================== */
/* ============================================================ */

window.resetRNIClaim = function () {
    const childId = state.selectedChild;
    const child   = state.childrenData[childId];
    if (!child) return;

    let claimedTokens = Number(child.rniClaimTokens) || 0;
    if (!claimedTokens) {
        try {
            const claims = JSON.parse(localStorage.getItem('lapaq_rni_claims') || '{}');
            claimedTokens = Number(claims[childId]?.tokens) || 0;
        } catch (e) { /* ignore */ }
    }

    const isBm = state.currentLang === 'bm';
    const msg = isBm
        ? `Set semula token yang telah dicetak untuk ${child.name}?\n\n• Buang rekod tuntutan RNI\n• Tolak ${claimedTokens} token dari dompet\n• Benarkan tuntutan baharu apabila RNI ≥ ${RNI_TOKEN_THRESHOLD}%`
        : `Reset the minted token for ${child.name}?\n\n• Remove the RNI claim record\n• Deduct ${claimedTokens} token${claimedTokens === 1 ? '' : 's'} from the wallet\n• Allow a new claim once RNI ≥ ${RNI_TOKEN_THRESHOLD}%`;
    if (!confirm(msg)) return;

    child.rniClaimed     = false;
    child.rniClaimPct    = null;
    child.rniClaimTokens = null;
    child.rniClaimDate   = null;

    if (claimedTokens > 0) {
        child.totalTokens = Math.max(0, (Number(child.totalTokens) || 0) - claimedTokens);
    }

    try {
        const claims = JSON.parse(localStorage.getItem('lapaq_rni_claims') || '{}');
        delete claims[childId];
        localStorage.setItem('lapaq_rni_claims', JSON.stringify(claims));
    } catch (e) { /* ignore */ }

    window._refreshLaPaQView?.();
    window._refreshTokensView?.();
    console.log(`[LaPaQ] RNI claim reset for ${childId}. Deducted ${claimedTokens} token(s).`);
};

/* ============================================================ */
/* ============ TAB NAVIGATION ================================ */
/* ============================================================ */

window._lapaqActiveTab = window._lapaqActiveTab || 'nutrition';
window.setLaPaQTab = function (tab) {
    if (!['nutrition', 'growth', 'history'].includes(tab)) return;
    if (window._lapaqActiveTab === tab) return;
    window._lapaqActiveTab = tab;
    window._refreshLaPaQView?.();
};

/* ============================================================ */
/* ============ WHO HEIGHT-FOR-AGE REFERENCE ================== */
/* ============================================================ */

const WHO_HEIGHT_FOR_AGE = {
    6: { median: 115.1, sd: 6.0 },
    9: { median: 132.6, sd: 7.0 }
};

const CHILD_CURRENT_AGE = { adam: 8, maya: 5 };

function getWhoNextBirthYearRef(childId, child, isBm) {
    const rawAge = Number(child?.age);
    const currentAge = (Number.isFinite(rawAge) && rawAge > 0)
        ? Math.floor(rawAge)
        : (CHILD_CURRENT_AGE[childId] ?? null);

    if (currentAge == null) return null;

    const nextAge = currentAge + 1;
    const ref = WHO_HEIGHT_FOR_AGE[nextAge];
    if (!ref) return null;

    return {
        age:    nextAge,
        median: ref.median,
        sd:     ref.sd,
        low:    +(ref.median - 2 * ref.sd).toFixed(1),
        high:   +(ref.median + 2 * ref.sd).toFixed(1),
        label:  isBm ? `WHO ${nextAge} Thn` : `WHO ${nextAge} yrs`
    };
}

/* ============================================================ */
/* ============ GROWTH CHART BUILDER ========================== */
/* ============================================================ */

const GROWTH_SERIES_META = {
    height: { color: '#2563eb', en: 'Height', bm: 'Tinggi' },
    weight: { color: '#059669', en: 'Weight', bm: 'Berat'  },
    bmi:    { color: '#dc2626', en: 'BMI',    bm: 'BMI'    }
};

function buildGrowthChartSvg(records, child, isBm, opts = {}) {
    const W = 300, PAD = 15;
    const H = opts.height || 120;
    const AXIS_BOTTOM = H - 20;

    const seriesKeys  = (Array.isArray(opts.series) && opts.series.length) ? opts.series : ['height', 'bmi'];
    const highlightId = opts.highlightId ?? null;
    const svgClass    = opts.svgClass || 'w-full h-32 overflow-visible';
    const whoRef      = opts.whoRef || null;

    const pts = [...records].reverse().map(r => ({
        id:     r.id,
        date:   r.date,
        height: Number(r.height) || 0,
        weight: Number(r.weight) || 0,
        bmi:    Number(r.bmi)    || 0
    })).filter(p => p.height > 0 || p.bmi > 0 || p.weight > 0);

    let maxHeightSoFar = 0;
    pts.forEach(p => {
        if (p.height > 0) {
            if (p.height < maxHeightSoFar) {
                p.height = maxHeightSoFar;
            } else {
                maxHeightSoFar = p.height;
            }
        }
    });

    if (pts.length === 0) {
        const liveH = Number(child.height) || 0;
        const liveW = Number(child.weight) || 0;
        const liveB = Number(child.bmi)    || 0;
        if (liveH > 0 || liveB > 0 || liveW > 0) {
            pts.push({ id: 'live', date: getTodayDateString(), height: liveH, weight: liveW, bmi: liveB, live: true });
        }
    }

    if (pts.length === 0) {
        return `
            <div class="h-32 flex flex-col items-center justify-center text-[10px] italic text-slate-400 gap-1">
                <span class="text-lg opacity-60">📊</span>
                <span>${isBm ? 'Rekod ukuran pertama anda untuk melihat trend.' : 'Log your first measurement to see your trend.'}</span>
            </div>
        `;
    }

    const n = pts.length;
    const scaleX = (i) => n <= 1 ? W / 2 : PAD + (i / (n - 1)) * (W - PAD * 2);
    const scaleY = (vals) => {
        const min = Math.min(...vals), max = Math.max(...vals);
        const range = Math.max(max - min, 1);
        const lo = min - range * 0.1, hi = max + range * 0.1;
        return v => AXIS_BOTTOM - ((v - lo) / (hi - lo)) * (AXIS_BOTTOM - PAD);
    };

    const highlightIdx = highlightId != null ? pts.findIndex(p => p.id === highlightId) : -1;

    let heightYFn = null;

    const seriesSvg = seriesKeys.map(key => {
        const meta = GROWTH_SERIES_META[key];
        if (!meta) return '';

        let vals = pts.map(p => p[key]).filter(v => v > 0);

        if (key === 'height' && whoRef) {
            vals = [...vals, whoRef.low, whoRef.median, whoRef.high];
        }

        if (vals.length === 0) return '';
        const yFn = scaleY(vals);
        if (key === 'height') heightYFn = yFn;

        const linePts = pts
            .map((p, i) => p[key] > 0 ? `${scaleX(i).toFixed(1)},${yFn(p[key]).toFixed(1)}` : null)
            .filter(Boolean).join(' ');

        const dots = pts.map((p, i) => {
            if (!(p[key] > 0)) return '';
            const cx = scaleX(i).toFixed(1);
            const cy = yFn(p[key]).toFixed(1);

            if (i !== highlightIdx) {
                return `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${meta.color}"/>`;
            }

            const anchor = i === 0 ? 'start' : (i === n - 1 ? 'end' : 'middle');
            const label  = key === 'height' ? `${p.height}cm`
                         : key === 'weight' ? `${p.weight}kg`
                         : `${p.bmi}`;
            return `
                <circle cx="${cx}" cy="${cy}" r="7.5" fill="${meta.color}" opacity="0.18"/>
                <circle cx="${cx}" cy="${cy}" r="4.5" fill="#ffffff" stroke="${meta.color}" stroke-width="2"/>
                <text x="${cx}" y="${(+cy - 10).toFixed(1)}" font-size="7.5" font-weight="bold"
                      fill="${meta.color}" font-family="monospace" text-anchor="${anchor}">${label}</text>
            `;
        }).join('');

        return `
            ${n > 1 ? `<polyline fill="none" stroke="${meta.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${linePts}" />` : ''}
            ${dots}
        `;
    }).join('');

    const whoSvg = (whoRef && heightYFn) ? (() => {
        const yHigh   = heightYFn(whoRef.high);
        const yLow    = heightYFn(whoRef.low);
        const yMedian = heightYFn(whoRef.median);
        const bandTop = Math.min(yHigh, yLow);
        const bandH   = Math.max(1, Math.abs(yLow - yHigh));

        return `
            <rect x="${PAD}" y="${bandTop.toFixed(1)}" width="${W - PAD * 2}" height="${bandH.toFixed(1)}"
                  fill="#f59e0b" opacity="0.12" />
            <line x1="${PAD}" y1="${yHigh.toFixed(1)}" x2="${W - PAD}" y2="${yHigh.toFixed(1)}"
                  stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.55" />
            <line x1="${PAD}" y1="${yLow.toFixed(1)}" x2="${W - PAD}" y2="${yLow.toFixed(1)}"
                  stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.55" />
            <line x1="${PAD}" y1="${yMedian.toFixed(1)}" x2="${W - PAD}" y2="${yMedian.toFixed(1)}"
                  stroke="#d97706" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.9" />
            <text x="${PAD + 2}" y="${(yMedian - 3).toFixed(1)}"
                  font-size="6.5" fill="#b45309" font-weight="bold"
                  font-family="monospace" text-anchor="start">${escHtml(whoRef.label)}</text>
        `;
    })() : '';

    const guideLine = highlightIdx >= 0 ? `
        <line x1="${scaleX(highlightIdx).toFixed(1)}" y1="${PAD}"
              x2="${scaleX(highlightIdx).toFixed(1)}" y2="${AXIS_BOTTOM}"
              stroke="#10b981" stroke-width="1" stroke-dasharray="3,3" opacity="0.55" />
    ` : '';

    const labelIdx = n <= 2
        ? pts.map((_, i) => i)
        : Array.from(new Set([0, Math.floor((n - 1) / 2), n - 1]));

    const xLabels = labelIdx.map(i => `
        <text x="${scaleX(i).toFixed(1)}" y="${H - 2}"
              font-size="8" fill="#94a3b8" font-family="monospace" text-anchor="middle">
            ${formatShortDate(pts[i].date, isBm)}
        </text>
    `).join('');

    const zLine = (state.selectedChild === 'maya' && pts.length >= 2 && seriesKeys.includes('bmi'))
        ? `<line x1="${PAD}" y1="${(PAD + AXIS_BOTTOM) / 2}" x2="${W - PAD}" y2="${(PAD + AXIS_BOTTOM) / 2}"
                stroke="#cbd5e1" stroke-dasharray="3,3" stroke-width="1" />`
        : '';

    return `
        <svg viewBox="0 0 ${W} ${H}" class="${svgClass}">
            <line x1="${PAD}" y1="${PAD}"  x2="${W - PAD}" y2="${PAD}"  stroke="#f1f5f9" stroke-width="1" />
            <line x1="${PAD}" y1="${(PAD + AXIS_BOTTOM) / 2}" x2="${W - PAD}" y2="${(PAD + AXIS_BOTTOM) / 2}" stroke="#f1f5f9" stroke-width="1" />
            <line x1="${PAD}" y1="${AXIS_BOTTOM}" x2="${W - PAD}" y2="${AXIS_BOTTOM}" stroke="#e2e8f0" stroke-width="1" />
            ${zLine}
            ${whoSvg}
            ${guideLine}
            ${seriesSvg}
            ${xLabels}
        </svg>
    `;
}

/* ============================================================ */
/* ============ SAMPLE MEAL DATA (WITH COST) ================== */
/* ============================================================ */

const SAMPLE_MEAL_TEMPLATES = {
    Breakfast: [
        {
            name: 'Roti Canai with Dhal',
            ingredients: [
                { name: 'Roti Canai', qty: 2, unit: 'pcs', micro: 'Carb-heavy', cost: 1.50 },
                { name: 'Dhal Curry', qty: 100, unit: 'ml', micro: 'Protein 4g', cost: 0.50 }
            ],
            nutrients: { Calories: 320, Carbohydrate: 42, Protein: 8, Fiber: 4, Calcium: 80, Iron: 2.5, Potassium: 380, 'Vitamin A': 100, 'Vitamin C': 5 }
        },
        {
            name: 'Nasi Lemak with Egg',
            ingredients: [
                { name: 'Nasi Lemak', qty: 1, unit: 'cup', micro: 'Coconut rice', cost: 1.50 },
                { name: 'Hard Boiled Egg', qty: 1, unit: 'pcs', micro: 'Protein 6g', cost: 0.50 },
                { name: 'Ikan Bilis', qty: 15, unit: 'g', micro: 'Calcium 60mg', cost: 0.30 }
            ],
            nutrients: { Calories: 380, Carbohydrate: 45, Protein: 12, Fiber: 3, Calcium: 120, Iron: 3.5, Potassium: 420, 'Vitamin A': 90, 'Vitamin C': 8 }
        },
        {
            name: 'Cereal with Milk & Banana',
            ingredients: [
                { name: 'Cornflakes', qty: 30, unit: 'g', micro: 'Fortified', cost: 0.40 },
                { name: 'Fresh Milk', qty: 200, unit: 'ml', micro: 'Calcium 240mg', cost: 1.20 },
                { name: 'Banana', qty: 1, unit: 'pcs', micro: 'Potassium 400mg', cost: 0.50 }
            ],
            nutrients: { Calories: 280, Carbohydrate: 48, Protein: 10, Fiber: 3, Calcium: 280, Iron: 4.2, Potassium: 520, 'Vitamin A': 180, 'Vitamin C': 12 }
        },
        {
            name: 'Milo with Marie Biscuits',
            ingredients: [
                { name: 'Milo Drink', qty: 200, unit: 'ml', micro: 'Fortified malt', cost: 1.00 },
                { name: 'Marie Biscuits', qty: 4, unit: 'pcs', micro: 'Light snack', cost: 0.40 }
            ],
            nutrients: { Calories: 220, Carbohydrate: 38, Protein: 5, Fiber: 2, Calcium: 140, Iron: 2.8, Potassium: 280, 'Vitamin A': 60, 'Vitamin C': 2 }
        },
        {
            name: 'Chicken Porridge',
            ingredients: [
                { name: 'Rice Porridge', qty: 1, unit: 'cup', micro: 'Soft & warm', cost: 0.30 },
                { name: 'Shredded Chicken', qty: 50, unit: 'g', micro: 'Protein 10g', cost: 1.50 },
                { name: 'Carrot', qty: 30, unit: 'g', micro: 'Vit A 200µg', cost: 0.20 }
            ],
            nutrients: { Calories: 260, Carbohydrate: 38, Protein: 14, Fiber: 2, Calcium: 60, Iron: 2.2, Potassium: 340, 'Vitamin A': 350, 'Vitamin C': 6 }
        }
    ],
    Lunch: [
        {
            name: 'Nasi Ayam',
            ingredients: [
                { name: 'Steamed Rice', qty: 1, unit: 'cup', micro: 'Carb base', cost: 0.40 },
                { name: 'Roast Chicken', qty: 80, unit: 'g', micro: 'Protein 22g', cost: 3.00 },
                { name: 'Cucumber', qty: 30, unit: 'g', micro: 'Hydration', cost: 0.20 }
            ],
            nutrients: { Calories: 520, Carbohydrate: 65, Protein: 28, Fiber: 3, Calcium: 60, Iron: 2.8, Potassium: 480, 'Vitamin A': 120, 'Vitamin C': 8 }
        },
        {
            name: 'Chicken Rice with Clear Soup',
            ingredients: [
                { name: 'Chicken Rice', qty: 1, unit: 'cup', micro: 'Aromatic rice', cost: 1.00 },
                { name: 'Clear Chicken Soup', qty: 1, unit: 'cup', micro: 'Broth', cost: 0.80 },
                { name: 'Bok Choy', qty: 50, unit: 'g', micro: 'Vit C 15mg', cost: 0.30 }
            ],
            nutrients: { Calories: 480, Carbohydrate: 58, Protein: 26, Fiber: 4, Calcium: 80, Iron: 3.2, Potassium: 520, 'Vitamin A': 280, 'Vitamin C': 18 }
        },
        {
            name: 'Fried Rice with Vegetables',
            ingredients: [
                { name: 'Fried Rice', qty: 1, unit: 'cup', micro: 'Egg fried', cost: 1.00 },
                { name: 'Mixed Vegetables', qty: 60, unit: 'g', micro: 'Fiber 3g', cost: 0.50 },
                { name: 'Egg', qty: 1, unit: 'pcs', micro: 'Protein 6g', cost: 0.50 }
            ],
            nutrients: { Calories: 460, Carbohydrate: 62, Protein: 16, Fiber: 4, Calcium: 90, Iron: 3.5, Potassium: 420, 'Vitamin A': 320, 'Vitamin C': 14 }
        },
        {
            name: 'Nasi Kandar',
            ingredients: [
                { name: 'White Rice', qty: 1, unit: 'cup', micro: 'Carb base', cost: 0.40 },
                { name: 'Fried Chicken', qty: 80, unit: 'g', micro: 'Protein 22g', cost: 3.00 },
                { name: 'Okra', qty: 40, unit: 'g', micro: 'Fiber 2g', cost: 0.20 },
                { name: 'Curry Gravy', qty: 50, unit: 'ml', micro: 'Spice blend', cost: 0.30 }
            ],
            nutrients: { Calories: 580, Carbohydrate: 68, Protein: 26, Fiber: 4, Calcium: 110, Iron: 4.2, Potassium: 520, 'Vitamin A': 180, 'Vitamin C': 12 }
        },
        {
            name: 'Egg & Cheese Sandwich',
            ingredients: [
                { name: 'Whole Wheat Bread', qty: 2, unit: 'slice', micro: 'Whole grain', cost: 0.60 },
                { name: 'Egg', qty: 1, unit: 'pcs', micro: 'Protein 6g', cost: 0.50 },
                { name: 'Cheese Slice', qty: 1, unit: 'pcs', micro: 'Calcium 150mg', cost: 0.80 }
            ],
            nutrients: { Calories: 340, Carbohydrate: 38, Protein: 18, Fiber: 3, Calcium: 220, Iron: 2.4, Potassium: 320, 'Vitamin A': 160, 'Vitamin C': 4 }
        }
    ],
    Dinner: [
        {
            name: 'Maggie Goreng',
            ingredients: [
                { name: 'Maggi Noodles', qty: 1, unit: 'pack', micro: 'Carb-heavy', cost: 1.00 },
                { name: 'Egg', qty: 1, unit: 'pcs', micro: 'Protein 6g', cost: 0.50 },
                { name: 'Cabbage', qty: 40, unit: 'g', micro: 'Fiber 1.5g', cost: 0.20 }
            ],
            nutrients: { Calories: 380, Carbohydrate: 52, Protein: 12, Fiber: 3, Calcium: 70, Iron: 2.8, Potassium: 320, 'Vitamin A': 100, 'Vitamin C': 10 }
        },
        {
            name: 'Fish Soup with Rice',
            ingredients: [
                { name: 'Fish Fillet', qty: 80, unit: 'g', micro: 'Omega-3', cost: 3.50 },
                { name: 'Steamed Rice', qty: 1, unit: 'cup', micro: 'Carb base', cost: 0.40 },
                { name: 'Tomato', qty: 50, unit: 'g', micro: 'Vit C 8mg', cost: 0.30 }
            ],
            nutrients: { Calories: 420, Carbohydrate: 55, Protein: 24, Fiber: 3, Calcium: 100, Iron: 2.5, Potassium: 540, 'Vitamin A': 200, 'Vitamin C': 14 }
        },
        {
            name: 'Roti Jala with Chicken Curry',
            ingredients: [
                { name: 'Roti Jala', qty: 3, unit: 'pcs', micro: 'Lacy crepe', cost: 1.50 },
                { name: 'Chicken Curry', qty: 120, unit: 'ml', micro: 'Protein 15g', cost: 2.00 }
            ],
            nutrients: { Calories: 480, Carbohydrate: 48, Protein: 22, Fiber: 3, Calcium: 130, Iron: 3.8, Potassium: 460, 'Vitamin A': 220, 'Vitamin C': 8 }
        },
        {
            name: 'Tom Yam Soup with Rice',
            ingredients: [
                { name: 'Tom Yam Soup', qty: 1, unit: 'cup', micro: 'Spicy sour', cost: 1.50 },
                { name: 'Steamed Rice', qty: 1, unit: 'cup', micro: 'Carb base', cost: 0.40 },
                { name: 'Prawns', qty: 40, unit: 'g', micro: 'Protein 8g', cost: 2.50 }
            ],
            nutrients: { Calories: 440, Carbohydrate: 54, Protein: 22, Fiber: 2, Calcium: 90, Iron: 2.6, Potassium: 480, 'Vitamin A': 180, 'Vitamin C': 20 }
        },
        {
            name: 'Chicken Stir Fry with Rice',
            ingredients: [
                { name: 'Steamed Rice', qty: 1, unit: 'cup', micro: 'Carb base', cost: 0.40 },
                { name: 'Chicken Breast', qty: 80, unit: 'g', micro: 'Lean protein', cost: 2.00 },
                { name: 'Broccoli', qty: 60, unit: 'g', micro: 'Vit C 30mg', cost: 0.80 }
            ],
            nutrients: { Calories: 460, Carbohydrate: 56, Protein: 28, Fiber: 4, Calcium: 90, Iron: 3, Potassium: 520, 'Vitamin A': 240, 'Vitamin C': 24 }
        }
    ]
};

const SAMPLE_MEAL_DATA_ADAM = {
    1: { Breakfast: 1, Lunch: 0, Dinner: 1 },
    2: { Breakfast: 2, Lunch: 1, Dinner: 3 },
    3: { Breakfast: 3, Lunch: 2, Dinner: 0 },
    4: { Breakfast: 4, Lunch: 3, Dinner: 4 },
    5: { Breakfast: 0, Lunch: 1, Dinner: 2 },
    6: { Breakfast: 1, Lunch: 4, Dinner: 3 }
};

const SAMPLE_MEAL_DATA_MAYA = {
    1: { Breakfast: 4, Lunch: 0, Dinner: 2 },
    2: { Breakfast: 1, Lunch: 4, Dinner: 1 },
    3: { Breakfast: 0, Lunch: 1, Dinner: 3 },
    4: { Breakfast: 3, Lunch: 2, Dinner: 0 },
    5: { Breakfast: 2, Lunch: 3, Dinner: 4 },
    6: { Breakfast: 4, Lunch: 0, Dinner: 2 }
};

let SAMPLE_MEAL_ID_BASE = Date.now();
let SAMPLE_MEAL_ID_COUNTER = 1;

function seedMealsForChild(childId, daySchedule, scaleFactor) {
    const todayStr = getTodayDateString();
    const [y, m, d] = todayStr.split('-').map(Number);
    const today = new Date(y, m - 1, d);
    const out = [];

    Object.entries(daySchedule).forEach(([dayOffset, mealsByType]) => {
        const offset = parseInt(dayOffset, 10);
        if (offset === 0) return;

        const date = new Date(today);
        date.setDate(date.getDate() - parseInt(dayOffset, 10));
        const dateStr = formatDateKey(date);

        Object.entries(mealsByType).forEach(([type, templateIdx]) => {
            const tpl = SAMPLE_MEAL_TEMPLATES[type][templateIdx];
            if (!tpl) return;

            const scaledNutrients = {};
            Object.entries(tpl.nutrients).forEach(([k, v]) => {
                scaledNutrients[k] = +(v * scaleFactor).toFixed(1);
            });

            const scaledIngredients = tpl.ingredients.map(i => ({
                ...i,
                qty:  typeof i.qty  === 'number' ? +(i.qty  * scaleFactor).toFixed(1) : i.qty,
                cost: typeof i.cost === 'number' ? +(i.cost * scaleFactor).toFixed(2) : (i.cost || 0)
            }));

            const mealCost = +scaledIngredients.reduce((s, i) => s + (Number(i.cost) || 0), 0).toFixed(2);

            out.push({
                id: SAMPLE_MEAL_ID_BASE + SAMPLE_MEAL_ID_COUNTER++,
                name: tpl.name,
                type,
                date: dateStr,
                ingredients: scaledIngredients,
                nutrients: scaledNutrients,
                cost: mealCost,
                child: childId,
                isSample: true
            });
        });
    });

    return out;
}

const SAMPLE_MEAL_NAMES = new Set();
Object.values(SAMPLE_MEAL_TEMPLATES).forEach(templates => {
    templates.forEach(t => SAMPLE_MEAL_NAMES.add(t.name));
});

function isSampleMeal(m) {
    if (m.isSample === true)  return true;
    if (m.isSample === false) return false;
    return SAMPLE_MEAL_NAMES.has(m.name);
}

function ensureSampleMeals() {
    const todayStr = getTodayDateString();
    let all = getLoggedMeals();

    const todaySamplesCount = all.filter(m => isSampleMeal(m) && m.date === todayStr).length;
    if (todaySamplesCount > 0) {
        all = all.filter(m => !(isSampleMeal(m) && m.date === todayStr));
        persistLoggedMeals(all);
        console.log(`[LaPaQ] 🧹 Cleared ${todaySamplesCount} sample meal(s) for today (${todayStr}).`);
    }
    console.log(`[LaPaQ] ✅ Today (${todayStr}) is empty and ready for manual entry.`);

    const userMeals = all.filter(m => !isSampleMeal(m));
    const samples   = all.filter(m =>  isSampleMeal(m));
    const past6     = getLast7Days().slice(1);

    const adamDaysCovered = past6.filter(day =>
        samples.some(m => m.child === 'adam' && m.date === day)
    ).length;
    const mayaDaysCovered = past6.filter(day =>
        samples.some(m => m.child === 'maya' && m.date === day)
    ).length;

    if (adamDaysCovered === 6 && mayaDaysCovered === 6) return;

    SAMPLE_MEAL_ID_BASE = Date.now();
    SAMPLE_MEAL_ID_COUNTER = 1;
    const adamMeals = seedMealsForChild('adam', SAMPLE_MEAL_DATA_ADAM, 1.0);
    const mayaMeals = seedMealsForChild('maya', SAMPLE_MEAL_DATA_MAYA, 0.65);

    persistLoggedMeals([...userMeals, ...adamMeals, ...mayaMeals]);
    console.log(`[LaPaQ] Past 6 days refreshed — Today (${todayStr}) left empty.`);
}

window.resetSampleMeals = function () {
    if (!confirm(
        'This will wipe ALL logged meals (samples + your own) and reload the demo dataset for the past 6 days.\n\n' +
        'Today will be left empty so you can log your own meals.\n\nContinue?'
    )) return;
    localStorage.removeItem('lapaq_logged_meals');
    SAMPLE_MEAL_ID_BASE = Date.now();
    SAMPLE_MEAL_ID_COUNTER = 1;
    ensureSampleMeals();
    window._refreshLaPaQView?.();
};

window.resetLaPaQDemo = function () {
    try {
        localStorage.removeItem('lapaq_logged_meals');
        localStorage.removeItem('lapaq_growth_records');
        localStorage.removeItem('lapaq_rni_claims');
    } catch (e) {
        console.warn('[LaPaQ] Could not clear localStorage during reset:', e);
    }
    if (state.childrenData) {
        Object.values(state.childrenData).forEach(child => {
            if (!child) return;
            child.rniClaimed     = false;
            child.rniClaimPct    = null;
            child.rniClaimTokens = null;
            child.rniClaimDate   = null;
        });
    }
    
    state.lapaqTimeSpan  = '1day';
    state.lapaqStartDate = getTodayDateString();
    state.lapaqEndDate   = getTodayDateString();
    window._lapaqActiveTab = 'nutrition';

    SAMPLE_MEAL_ID_BASE    = Date.now();
    SAMPLE_MEAL_ID_COUNTER = 1;
    ensureSampleMeals();
    seedGrowthData();
    removeNov2026AdamRecord();

    window._refreshLaPaQView?.();

    console.log('[LaPaQ] 🔄 Demo reset — today empty, past 6 days re-seeded, no claims, time span = 1 day.');
};

ensureSampleMeals();

window.clearTodayMeals = function () {
    const todayStr = getTodayDateString();
    const before = getLoggedMeals();
    const after  = before.filter(m => m.date !== todayStr);
    const removed = before.length - after.length;

    if (removed === 0) {
        alert('No meals are logged for today.');
        return;
    }
    if (!confirm(`Clear all ${removed} meal(s) logged for today (${todayStr})?`)) return;

    persistLoggedMeals(after);
    window._refreshLaPaQView?.();
    console.log(`[LaPaQ] 🧹 Cleared ${removed} meal(s) for today (${todayStr}).`);
};

/* ============================================================ */
/* ============ GROWTH RECORD HELPERS ========================= */
/* ============================================================ */

function getGrowthRecords() {
    try { return JSON.parse(localStorage.getItem('lapaq_growth_records') || '[]'); }
    catch (e) { return []; }
}
function persistGrowthRecords(records) {
    localStorage.setItem('lapaq_growth_records', JSON.stringify(records));
}
function computeBMI(heightCm, weightKg) {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
    const hM = heightCm / 100;
    return +(weightKg / (hM * hM)).toFixed(2);
}

function seedGrowthData() {
    let records = getGrowthRecords();
    let changed = false;

    function generateRecords(childId, startHeight, monthlyGrowth, startBmi, bmiGrowth) {
        const today = new Date();
        const newRecords = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today);
            d.setMonth(d.getMonth() - i);
            const height = startHeight + (11 - i) * monthlyGrowth + (Math.random() * 0.4 - 0.2);
            const bmi = startBmi + (11 - i) * bmiGrowth + (Math.random() * 0.1 - 0.05);
            const weight = +(bmi * Math.pow(height/100, 2)).toFixed(1);

            newRecords.push({
                id: Date.now() - (i * 10000000),
                child: childId,
                date: formatDateKey(d),
                height: +height.toFixed(1),
                weight: weight,
                bmi: +bmi.toFixed(2),
                stuntingStatus: 'Normal',
                wastingStatus: 'Normal'
            });
        }
        return newRecords;
    }

    const adamRecords = records.filter(r => r.child === 'adam');
    if (adamRecords.length < 6) {
        records = [...records.filter(r => r.child !== 'adam'), ...generateRecords('adam', 123, 0.5, 15.8, 0.05)];
        changed = true;
    }

    const mayaRecords = records.filter(r => r.child === 'maya');
    if (mayaRecords.length < 6) {
        records = [...records.filter(r => r.child !== 'maya'), ...generateRecords('maya', 103, 0.5, 14.5, 0.05)];
        changed = true;
    }

    if (changed) {
        persistGrowthRecords(records);
        ['adam', 'maya'].forEach(id => {
            const childRecs = records.filter(r => r.child === id).sort((a,b) => b.id - a.id);
            if (childRecs.length > 0 && state.childrenData[id]) {
                state.childrenData[id].height = childRecs[0].height;
                state.childrenData[id].weight = childRecs[0].weight;
                state.childrenData[id].bmi = childRecs[0].bmi;
            }
        });
    }
}

seedGrowthData();

function removeNov2026AdamRecord() {
    let records = getGrowthRecords();
    const originalLength = records.length;
    records = records.filter(r => !(r.child === 'adam' && r.date === '2026-11-01'));

    if (records.length !== originalLength) {
        persistGrowthRecords(records);
        console.log(`[LaPaQ] Successfully deleted the 2026-11-01 reading for Adam.`);
    }
}
removeNov2026AdamRecord();

window.resetGrowthData = function () {
    if (!confirm('Reset growth data to default realistic demo values?')) return;
    localStorage.removeItem('lapaq_growth_records');
    seedGrowthData();
    window._refreshLaPaQView?.();
};

window._refreshLaPaQView = () => {
    const root = document.getElementById('lapaq-view-root');
    if (!root) return;
    root.outerHTML = renderLaPaQPage();
};

window.recalculateGrowthMetrics = function () {
    const h = parseFloat(document.getElementById('input-height')?.value) || 0;
    const w = parseFloat(document.getElementById('input-weight')?.value) || 0;
    const bmi = computeBMI(h, w);
    const bmiEl = document.getElementById('res-bmi');
    if (bmiEl) {
        bmiEl.innerText = bmi === null ? '—' : bmi;
    }
};

window.recordGrowthMeasurement = function () {
    const h = parseFloat(document.getElementById('input-height')?.value);
    const w = parseFloat(document.getElementById('input-weight')?.value);

    if (!h || !w || h <= 0 || w <= 0) { alert('Please enter a valid height and weight.'); return; }
    if (h < 30 || h > 250) { alert('Height must be between 30 cm and 250 cm.'); return; }
    if (w < 2 || w > 200) { alert('Weight must be between 2 kg and 200 kg.'); return; }

    const child = state.childrenData[state.selectedChild];
    if (!child) return;

    const bmi = computeBMI(h, w);
    const records = getGrowthRecords();
    const newId = Date.now();
    records.push({
        id: newId,
        child: state.selectedChild,
        date: getTodayDateString(),
        height: h,
        weight: w,
        bmi,
        stuntingStatus: child.stuntingStatus,
        wastingStatus: child.wastingStatus
    });
    persistGrowthRecords(records);

    child.height = h;
    child.weight = w;
    child.bmi = bmi;

    window._refreshLaPaQView?.();

    window.showGrowthRecordedPopup(newId);
};

window.closeGrowthRecordedPopup = function () {
    document.getElementById('modal-growth-recorded')?.remove();
};

window.showGrowthRecordedPopup = function (recordId) {
    window.closeGrowthRecordedPopup();

    const isBm  = state.currentLang === 'bm';
    const child = state.childrenData[state.selectedChild];
    if (!child) return;

    const records = getGrowthRecords()
        .filter(r => r.child === state.selectedChild)
        .filter(r => !(state.selectedChild === 'adam' && r.date === '2026-11-01'))
        .sort((a, b) => b.id - a.id);

    const rec = records.find(r => r.id === recordId) || records[0];
    if (!rec) return;

    const prev = records
        .filter(r => r.id !== rec.id && (r.date < rec.date || (r.date === rec.date && r.id < rec.id)))
        .sort((a, b) => (a.date === b.date ? b.id - a.id : (a.date < b.date ? 1 : -1)))[0] || null;

    const deltaHtml = (cur, old, digits) => {
        if (old === null || old === undefined || !isFinite(old)) return '';
        const d    = +(cur - old).toFixed(digits);
        const sign = d > 0 ? '+' : '';
        const cls  = d > 0 ? 'text-emerald-600' : d < 0 ? 'text-rose-600' : 'text-slate-400';
        const arrow = d > 0 ? '▲' : d < 0 ? '▼' : '·';
        return `<span class="text-[9px] font-mono font-bold ${cls}">${arrow} ${sign}${d}</span>`;
    };

    const statCard = (label, value, unit, delta, colorCls) => `
        <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <p class="text-[8px] font-bold uppercase ${colorCls}">${label}</p>
            <p class="text-sm font-black text-slate-800 font-mono leading-tight">
                ${value}<span class="text-[9px] text-slate-400 font-normal">${unit}</span>
            </p>
            ${delta || '<span class="text-[9px] text-slate-300 font-mono">—</span>'}
        </div>
    `;

    const whoRef = getWhoNextBirthYearRef(state.selectedChild, child, isBm);

    const chartSvg = buildGrowthChartSvg(records, child, isBm, {
        series: ['height', 'weight'],
        highlightId: rec.id,
        whoRef,
        svgClass: 'w-full overflow-visible'
    });

    const el = document.createElement('div');
    el.id = 'modal-growth-recorded';
    el.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
    el.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button onclick="window.closeGrowthRecordedPopup()" class="absolute top-3 right-3 text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>

            <div class="flex items-center space-x-3 border-b border-slate-200 pb-3 pr-6">
                <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">✅</div>
                <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-800">${isBm ? 'Ukuran Direkodkan' : 'Measurement Recorded'}</h3>
                    <p class="text-[10px] text-slate-500 truncate">
                        ${isBm ? 'Titik baharu dipaparkan pada carta pertumbuhan' : 'New point plotted on your growth chart'} · ${rec.date}
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-1.5">
                ${statCard(isBm ? 'Tinggi' : 'Height', rec.height, ' cm',
                           prev ? deltaHtml(rec.height, prev.height, 1) : '', 'text-blue-600')}
                ${statCard(isBm ? 'Berat' : 'Weight', rec.weight, ' kg',
                           prev ? deltaHtml(rec.weight, prev.weight, 1) : '', 'text-emerald-600')}
                ${statCard('BMI', rec.bmi, '',
                           prev ? deltaHtml(rec.bmi, prev.bmi, 2) : '', 'text-rose-600')}
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[9px] font-bold uppercase text-slate-500">
                        ${isBm ? 'Trend Tinggi & Berat' : 'Height & Weight Trend'}
                    </span>
                    <div class="flex items-center space-x-2 text-[8px] font-bold">
                        <span class="flex items-center text-blue-600">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mr-0.5"></span>${isBm ? 'Tinggi' : 'Height'}
                        </span>
                        <span class="flex items-center text-emerald-600">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-0.5"></span>${isBm ? 'Berat' : 'Weight'}
                        </span>
                        ${whoRef ? `
                            <span class="flex items-center text-amber-600">
                                <span class="w-2.5 h-1.5 rounded-sm bg-amber-400/50 border border-amber-500 inline-block mr-0.5"></span>${escHtml(whoRef.label)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                ${chartSvg}
                <p class="text-[9px] text-emerald-700 font-mono text-center mt-1">
                    ● ${isBm ? 'Titik terbaru' : 'Latest point'}: ${rec.height} cm · ${rec.weight} kg
                </p>
                ${whoRef ? `
                    <p class="text-[8px] text-amber-700 font-mono text-center">
                        ${isBm
                            ? `WHO ${whoRef.age} thn: median ${whoRef.median} cm (julat normal ${whoRef.low}–${whoRef.high} cm)`
                            : `WHO ${whoRef.age} yrs: median ${whoRef.median} cm (normal range ${whoRef.low}–${whoRef.high} cm)`}
                    </p>
                ` : ''}
            </div>

            ${prev ? `
                <p class="text-[9px] text-slate-400 font-mono text-center">
                    ${isBm ? 'Berbanding rekod' : 'vs previous'}: ${prev.date} (${prev.height} cm · ${prev.weight} kg)
                </p>
            ` : ''}

            <button onclick="window.closeGrowthRecordedPopup()"
                    class="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold py-2 rounded-lg shadow-sm transition">
                ${isBm ? 'Selesai' : 'Done'}
            </button>
        </div>
    `;
    el.addEventListener('click', (e) => { if (e.target === el) window.closeGrowthRecordedPopup(); });
    document.body.appendChild(el);
};

window.deleteGrowthRecord = function (id) {
    if (!confirm('Remove this measurement record?')) return;
    const remaining = getGrowthRecords().filter(r => r.id !== id);
    persistGrowthRecords(remaining);

    const child = state.childrenData[state.selectedChild];
    if (child) {
        const childRecords = remaining
            .filter(r => r.child === state.selectedChild)
            .sort((a, b) => b.id - a.id);
        if (childRecords.length > 0) {
            child.height = childRecords[0].height;
            child.weight = childRecords[0].weight;
            child.bmi    = childRecords[0].bmi;
        }
    }
    window._refreshLaPaQView?.();
};

window.openCreateMealModal = function (date, type) {
    const modal = document.getElementById('modal-create-meal');
    if (!modal) return;
    document.getElementById('new-meal-name').value = '';
    document.getElementById('new-meal-type').value = type || 'Breakfast';
    document.getElementById('new-meal-date').value = date || getTodayDateString();
    document.getElementById('meal-ingredient-rows').innerHTML = '';
    const picker = document.getElementById('sample-meal-picker');
    if (picker) picker.value = '';
    window.addMealIngredientRow();
    window.addMealIngredientRow();
    Object.keys(RNI_REFERENCE).forEach(k => {
        const el = document.getElementById(`meal-mn-${mealSlug(k)}`);
        if (el) el.value = '';
    });
    window.updateMealNutrientBadges();
    window.updateMealCostTotal();
    modal.classList.remove('hidden');
};

window.closeCreateMealModal = function () {
    const modal = document.getElementById('modal-create-meal');
    if (modal) modal.classList.add('hidden');
};

window.loadSampleMealTemplate = function (value) {
    if (!value) return;
    const [type, idxStr] = value.split(':');
    const idx = parseInt(idxStr, 10);
    const tpl = SAMPLE_MEAL_TEMPLATES[type] && SAMPLE_MEAL_TEMPLATES[type][idx];
    if (!tpl) return;

    document.getElementById('new-meal-name').value = tpl.name;
    document.getElementById('new-meal-type').value = type;

    const container = document.getElementById('meal-ingredient-rows');
    container.innerHTML = '';
    tpl.ingredients.forEach(ing => window.addMealIngredientRow(ing));

    Object.entries(tpl.nutrients).forEach(([k, v]) => {
        const el = document.getElementById(`meal-mn-${mealSlug(k)}`);
        if (el) el.value = v;
    });
    window.updateMealNutrientBadges();
    window.updateMealCostTotal();
};

window.viewLoggedMeal = function (id) {
    const m = getLoggedMeals().find(x => x.id === id);
    if (!m) return;
    const ingredients = (m.ingredients || [])
        .map(i => `  • ${i.name}${i.qty || i.unit ? ' (' + (i.qty || '') + (i.unit || '') + ')' : ''}${i.micro ? ' — ' + i.micro : ''}${i.cost ? ' — ' + formatRM(i.cost) : ''}`)
        .join('\n') || '  (none)';
    const nutrients = Object.entries(m.nutrients || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `  • ${k}: ${v}${RNI_REFERENCE[k]?.unit || ''}`)
        .join('\n') || '  (none)';
    const cost = getMealCost(m);
    alert(`🍽️ ${m.name}\n\n📅 ${m.date} • ${m.type}\n\n📋 Ingredients:\n${ingredients}\n\n🥗 Nutrients:\n${nutrients}\n\n💰 Total Cost: ${formatRM(cost)}`);
};

window.addMealIngredientRow = function (data = {}) {
    const container = document.getElementById('meal-ingredient-rows');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'meal-ingredient-row grid grid-cols-12 gap-1.5 items-center';
    row.innerHTML = `
        <input data-field="name" value="${escHtml(data.name || '')}" placeholder="Ingredient" class="col-span-4 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500">
        <input type="number" min="0" step="0.1" data-field="qty" value="${escHtml(data.qty || '')}" placeholder="0" class="col-span-1 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1.5 text-[11px] text-slate-800 font-mono focus:outline-none focus:border-emerald-500">
        <select data-field="unit" class="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500">
            ${['g','ml','pcs','cup','tbsp','tsp','slice','pack'].map(u => `<option ${data.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
        </select>
        <input data-field="micro" value="${escHtml(data.micro || '')}" placeholder="Key micro" class="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500">
        <input type="number" min="0" step="0.01" data-field="cost" value="${escHtml(data.cost || '')}" placeholder="0.00" oninput="window.updateMealCostTotal()" class="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1.5 text-[11px] text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500">
        <button type="button" onclick="this.closest('.meal-ingredient-row').remove(); window.updateMealCostTotal()" class="col-span-1 text-rose-500 hover:text-rose-600 font-bold text-xs">✕</button>
    `;
    container.appendChild(row);
};

window.updateMealCostTotal = function () {
    const rows = document.querySelectorAll('#meal-ingredient-rows .meal-ingredient-row');
    let total = 0;
    rows.forEach(r => {
        const cost = parseFloat(r.querySelector('[data-field="cost"]')?.value) || 0;
        total += cost;
    });
    const el = document.getElementById('meal-cost-total');
    if (el) el.innerText = formatRM(total);
};

window.updateMealNutrientBadges = function () {
    Object.keys(RNI_REFERENCE).forEach(k => {
        const s = mealSlug(k);
        const input = document.getElementById(`meal-mn-${s}`);
        const badge = document.getElementById(`meal-mnpct-${s}`);
        if (!input || !badge) return;
        const v = parseFloat(input.value) || 0;
        const pct = (v / RNI_REFERENCE[k].ref) * 100;
        let color = 'text-slate-400';
        if (pct >= 100) color = 'text-emerald-600';
        else if (pct >= 50) color = 'text-blue-600';
        else if (pct >= 25) color = 'text-amber-600';
        else if (pct > 0) color = 'text-rose-600';
        badge.className = `block text-[8px] font-mono ${color}`;
        badge.innerText = `${pct.toFixed(0)}% RNI`;
    });
};

window.saveNewMeal = function (event) {
    event.preventDefault();
    const name = document.getElementById('new-meal-name').value.trim();
    if (!name) { alert('Please enter a meal name.'); return; }

    const ingredients = [...document.querySelectorAll('#meal-ingredient-rows .meal-ingredient-row')]
        .map(row => ({
            name: row.querySelector('[data-field="name"]').value.trim(),
            qty: row.querySelector('[data-field="qty"]').value.trim(),
            unit: row.querySelector('[data-field="unit"]').value,
            micro: row.querySelector('[data-field="micro"]').value.trim(),
            cost: parseFloat(row.querySelector('[data-field="cost"]').value) || 0
        }))
        .filter(i => i.name);

    const nutrients = {};
    Object.keys(RNI_REFERENCE).forEach(k => {
        const el = document.getElementById(`meal-mn-${mealSlug(k)}`);
        nutrients[k] = el ? (parseFloat(el.value) || 0) : 0;
    });

    if (Object.values(nutrients).every(v => v === 0)) {
        alert('Please enter at least one nutrient value.');
        return;
    }

    const mealType = document.getElementById('new-meal-type').value;
    const mealDate = document.getElementById('new-meal-date').value || getTodayDateString();
    const totalCost = +ingredients.reduce((s, i) => s + (i.cost || 0), 0).toFixed(2);

    const meals = getLoggedMeals();
    meals.push({
        id: Date.now(),
        name,
        type: mealType,
        date: mealDate,
        ingredients,
        nutrients,
        cost: totalCost,
        child: state.selectedChild,
        isSample: false
    });
    persistLoggedMeals(meals);

    window.closeCreateMealModal();
    window._refreshLaPaQView?.();

    alert(`✅ Meal logged!\n\n"${name}" (${mealType})\n📅 Date: ${mealDate}\n💰 Cost: ${formatRM(totalCost)}`);
};

window.deleteLoggedMeal = function (id) {
    if (!confirm('Remove this meal from log?')) return;
    persistLoggedMeals(getLoggedMeals().filter(m => m.id !== id));
    window._refreshLaPaQView?.();
};

const RNI_CONSEQUENCES = {
    'Calories':     { bm: 'Tenaga rendah, cepat letih, kurang tumpuan, pertumbuhan terbantut',
                      en: 'Low energy, fatigue, poor focus, stunted growth' },
    'Carbohydrate': { bm: 'Lemah, gula darah rendah, cepat letih semasa aktiviti',
                      en: 'Weakness, low blood sugar, fatigue during activity' },
    'Protein':      { bm: 'Otot lemah, imuniti rendah, luka lambat sembuh, pertumbuhan terganggu',
                      en: 'Muscle weakness, low immunity, slow wound healing, impaired growth' },
    'Fiber':        { bm: 'Sembelit, penghadaman lemah, gula darah tidak stabil',
                      en: 'Constipation, poor digestion, unstable blood sugar' },
    'Calcium':      { bm: 'Tulang & gigi lemah, risiko osteoporosis, pertumbuhan terbantut',
                      en: 'Weak bones & teeth, osteoporosis risk, stunted growth' },
    'Iron':         { bm: 'Anemia, letih, kurang fokus, perkembangan kognitif terjejas',
                      en: 'Anemia, fatigue, poor focus, impaired cognitive development' },
    'Potassium':    { bm: 'Kekejangan otot, lemah, degupan jantung tidak teratur',
                      en: 'Muscle cramps, weakness, irregular heartbeat' },
    'Vitamin A':    { bm: 'Masalah penglihatan, imuniti rendah, kulit kering',
                      en: 'Vision problems, low immunity, dry skin' },
    'Vitamin C':    { bm: 'Imuniti lemah, luka lambat sembuh, gusi berdarah',
                      en: 'Weak immunity, slow wound healing, bleeding gums' }
};

const RNI_FOOD_SUGGESTIONS = {
    'Calories':     { bm: 'nasi, roti, lemak sihat (avokado, kacang)',  en: 'rice, bread, healthy fats (avocado, nuts)' },
    'Carbohydrate': { bm: 'nasi, mee, ubi kentang, bijirin penuh',      en: 'rice, noodles, potatoes, whole grains' },
    'Protein':      { bm: 'telur, ayam, ikan, tauhu, kacang',           en: 'eggs, chicken, fish, tofu, beans' },
    'Fiber':        { bm: 'buah-buahan, sayur, bijirin penuh, kekacang', en: 'fruits, vegetables, whole grains, legumes' },
    'Calcium':      { bm: 'susu, yogurt, keju, sardin, tauhu',          en: 'milk, yogurt, cheese, sardines, tofu' },
    'Iron':         { bm: 'bayam, hati, daging merah, kangkung',        en: 'spinach, liver, red meat, kangkung' },
    'Potassium':    { bm: 'pisang, ubi kentang, bayam, kacang',         en: 'bananas, potatoes, spinach, beans' },
    'Vitamin A':    { bm: 'lobak merah, keledek, labu, telur',          en: 'carrots, sweet potato, pumpkin, eggs' },
    'Vitamin C':    { bm: 'oren, jambu batu, betik, tomato',            en: 'oranges, guava, papaya, tomatoes' }
};

function buildNutritionReport(rniMetrics, isBm, periodDayCount, hasMeals) {
    const isMultiDay = periodDayCount > 1;

    if (!hasMeals) {
        return `
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center space-y-2">
                <div class="text-2xl opacity-60">📋</div>
                <p class="text-xs font-bold text-slate-700">${isBm ? 'Belum Ada Laporan' : 'No Report Yet'}</p>
                <p class="text-[10px] text-slate-500 leading-relaxed">
                    ${isBm
                        ? 'Log makanan pertama anda untuk melihat laporan pemakanan harian dan kesan kekurangan nutrien.'
                        : 'Log your first meal to see your daily nutrition report and nutrient shortfall impacts.'}
                </p>
            </div>
        `;
    }

    const items = rniMetrics.map(m => {
        const pct = Math.min((m.current / m.target) * 100, 100);
        const key = METRIC_KEY_MAP[m.name] || m.name;
        return { ...m, pct: Math.round(pct), key };
    });

    const met      = items.filter(m => m.pct >= 100);
    const below    = items.filter(m => m.pct >= 50 && m.pct < 100);
    const critical = items.filter(m => m.pct < 50);
    const gaps     = [...critical, ...below].sort((a, b) => a.pct - b.pct);

    const scoreLabel = met.length >= 7 ? (isBm ? 'Sangat Baik' : 'Excellent')
                     : met.length >= 4 ? (isBm ? 'Sederhana'   : 'Moderate')
                     :                   (isBm ? 'Perlu Perhatian' : 'Needs Attention');
    const scoreCls = met.length >= 7 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                   : met.length >= 4 ? 'bg-amber-50 text-amber-700 border-emerald-200'
                   :                   'bg-rose-50 text-rose-700 border-rose-200';

    const title = isMultiDay
        ? (isBm ? `Laporan Pemakanan · Purata ${periodDayCount} Hari` : `Nutrition Report · ${periodDayCount}-Day Avg`)
        : (isBm ? 'Laporan Pemakanan Harian' : 'Daily Nutrition Report');

    const gapRows = gaps.map(m => {
        const cons = RNI_CONSEQUENCES[m.key];
        const label = cons ? (isBm ? cons.bm : cons.en) : '';
        const sev = m.pct < 25
            ? { wrap: 'bg-rose-50 border-rose-200',     pct: 'text-rose-700',   icon: '🚨', tag: isBm ? 'Kritikal' : 'Critical' }
            : m.pct < 50
            ? { wrap: 'bg-orange-50 border-orange-200', pct: 'text-orange-700', icon: '⚠️', tag: isBm ? 'Rendah'   : 'Low'      }
            : { wrap: 'bg-amber-50 border-amber-200',   pct: 'text-amber-700',  icon: '⚠️', tag: isBm ? 'Hampir'   : 'Near'     };
        return `
            <div class="flex items-start space-x-2 p-2 border rounded-lg ${sev.wrap}">
                <span class="text-xs shrink-0">${sev.icon}</span>
                <div class="min-w-0 flex-1">
                    <div class="flex justify-between items-baseline gap-1">
                        <span class="text-[10px] font-bold text-slate-800">${escHtml(m.name)}</span>
                        <span class="text-[9px] font-mono font-bold ${sev.pct}">${m.pct}% · ${sev.tag}</span>
                    </div>
                    ${label ? `<p class="text-[9px] text-slate-600 leading-snug mt-0.5">${escHtml(label)}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');

    const metList = met.map(m => escHtml(m.name)).join(', ');

    const topGaps = gaps.slice(0, 3).filter(m => RNI_FOOD_SUGGESTIONS[m.key]);
    const suggestions = topGaps.map(m => {
        const f = isBm ? RNI_FOOD_SUGGESTIONS[m.key].bm : RNI_FOOD_SUGGESTIONS[m.key].en;
        return `<li class="flex items-start space-x-1"><span class="text-emerald-500 shrink-0">▸</span><span><strong>${escHtml(m.name)}</strong>: ${escHtml(f)}</span></li>`;
    }).join('');

    return `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-center border-b border-slate-100 pb-2 gap-2 flex-wrap">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                    <span>📋</span>
                    <span>${title}</span>
                </h3>
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${scoreCls}">${scoreLabel} · ${met.length}/${items.length}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <div class="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <p class="text-[9px] font-bold text-emerald-600 uppercase">${isBm ? 'Mencapai' : 'Met'}</p>
                    <p class="text-lg font-black text-emerald-700 leading-tight">${met.length}</p>
                </div>
                <div class="p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p class="text-[9px] font-bold text-amber-600 uppercase">${isBm ? 'Hampir' : 'Near'}</p>
                    <p class="text-lg font-black text-amber-700 leading-tight">${below.length}</p>
                </div>
                <div class="p-2 bg-rose-50 border border-rose-200 rounded-lg text-center">
                    <p class="text-[9px] font-bold text-rose-600 uppercase">${isBm ? 'Kritikal' : 'Critical'}</p>
                    <p class="text-lg font-black text-rose-700 leading-tight">${critical.length}</p>
                </div>
            </div>

            ${met.length > 0 ? `
                <p class="text-[10px] text-slate-600 leading-relaxed">
                    <span class="font-bold text-emerald-700">✅ ${isBm ? 'Nutrien dicapai' : 'Nutrients met'}:</span>
                    ${metList}
                </p>
            ` : ''}

            ${gaps.length > 0 ? `
                <div class="space-y-1.5">
                    <p class="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        ${isBm ? '⚠️ Kesan Kekurangan Nutrien' : '⚠️ Consequences of Shortfall'}
                    </p>
                    <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        ${gapRows}
                    </div>
                </div>
            ` : `
                <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <p class="text-[11px] font-bold text-emerald-700">
                        🎉 ${isBm ? 'Semua nutrien mencapai sasaran harian!' : 'All nutrients hit the daily target!'}
                    </p>
                </div>
            `}

            ${suggestions ? `
                <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <p class="text-[10px] font-bold text-blue-700 uppercase mb-1">💡 ${isBm ? 'Cadangan Makanan' : 'Food Suggestions'}</p>
                    <ul class="text-[10px] text-slate-700 space-y-0.5">${suggestions}</ul>
                </div>
            ` : ''}

            ${isMultiDay ? `
                <p class="text-[9px] text-slate-400 italic text-center">
                    ${isBm ? `Berdasarkan purata harian ${periodDayCount} hari` : `Based on ${periodDayCount}-day daily average`}
                </p>
            ` : ''}
        </div>
    `;
}

export function renderLaPaQPage() {
    const child = state.childrenData[state.selectedChild];
    const isBm = state.currentLang === 'bm';
    const todayDateStr = getTodayDateString();
    const activeTab = window._lapaqActiveTab || 'nutrition';

    let spanLabel = isBm ? "1 Hari" : "1 Day";
    let periodDayCount = 1;

    if (state.lapaqTimeSpan === '1week') {
        periodDayCount = 7;
        spanLabel = isBm ? "1 Minggu" : "1 Week";
    } else if (state.lapaqTimeSpan === '1month') {
        periodDayCount = 30;
        spanLabel = isBm ? "1 Bulan" : "1 Month";
    } else if (state.lapaqTimeSpan === 'custom') {
        spanLabel = isBm ? "Carian Tarikh" : "Date Range";
        if (state.lapaqStartDate && state.lapaqEndDate) {
            const [sy, sm, sd] = state.lapaqStartDate.split('-').map(Number);
            const [ey, em, ed] = state.lapaqEndDate.split('-').map(Number);
            const startUTC = Date.UTC(sy, sm - 1, sd);
            const endUTC   = Date.UTC(ey, em - 1, ed);
            periodDayCount = Math.max(1, Math.round((endUTC - startUTC) / 86400000) + 1);
        }
    }

    const isMultiDay = periodDayCount > 1;

    const rawMetrics = [
        { name: isBm ? "Kalori (Kcal)" : "Calories (Kcal)", target: 1800, unit: "kcal",  color: "bg-emerald-500" },
        { name: isBm ? "Karbohidrat"   : "Carbohydrate",    target: 240,  unit: "g",     color: "bg-blue-500"    },
        { name: isBm ? "Protein"       : "Protein",         target: 45,   unit: "g",     color: "bg-indigo-500"  },
        { name: isBm ? "Serat"         : "Fiber",           target: 20,   unit: "g",     color: "bg-amber-500"   },
        { name: isBm ? "Kalsium"       : "Calcium",         target: 800,  unit: "mg",    color: "bg-purple-500"  },
        { name: isBm ? "Zat Besi"      : "Iron",            target: 12,   unit: "mg",    color: "bg-teal-500"    },
        { name: isBm ? "Kalium"        : "Potassium",       target: 2300, unit: "mg",    color: "bg-sky-500"     },
        { name: isBm ? "Vitamin A"     : "Vitamin A",       target: 500,  unit: "µg RE", color: "bg-orange-500"  },
        { name: isBm ? "Vitamin C"     : "Vitamin C",       target: 40,   unit: "mg",    color: "bg-rose-500"    }
    ];

    const loggedMealsForChild = getLoggedMeals().filter(m => m.child === state.selectedChild);

    let periodMeals = [];
    const last7DaysArr = getLast7Days();

    if (state.lapaqTimeSpan === '1day') {
        periodMeals = loggedMealsForChild.filter(m => m.date === todayDateStr);
    } else if (state.lapaqTimeSpan === '1week') {
        periodMeals = loggedMealsForChild.filter(m => last7DaysArr.includes(m.date));
    } else if (state.lapaqTimeSpan === '1month') {
        const last30DaysArr = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last30DaysArr.push(formatDateKey(d));
        }
        periodMeals = loggedMealsForChild.filter(m => last30DaysArr.includes(m.date));
    } else if (state.lapaqTimeSpan === 'custom') {
        periodMeals = loggedMealsForChild.filter(m => m.date >= state.lapaqStartDate && m.date <= state.lapaqEndDate);
    } else {
        periodMeals = loggedMealsForChild.filter(m => m.date === todayDateStr);
    }

    const mealTotals = periodMeals.reduce((acc, m) => {
        Object.entries(m.nutrients).forEach(([k, v]) => { acc[k] = (acc[k] || 0) + v; });
        return acc;
    }, {});

    const periodCost = getPeriodCost(periodMeals);
    const dailyAvgCost = periodCost / periodDayCount;
    const perMealCost = periodMeals.length > 0 ? periodCost / periodMeals.length : 0;

    const rniMetrics = rawMetrics.map(m => {
        const mealKey = METRIC_KEY_MAP[m.name];
        const totalLogged = mealKey ? (mealTotals[mealKey] || 0) : 0;
        const dailyAvg    = totalLogged / periodDayCount;

        return {
            ...m,
            current:      dailyAvg,
            totalLogged,
            target:       m.target,
            periodTarget: m.target * periodDayCount
        };
    });

    let totalCompliance = 0;
    rniMetrics.forEach(m => {
        const pct = Math.min((m.current / m.target) * 100, 100);
        totalCompliance += pct;
    });
    const overallCompliancePct = rniMetrics.length > 0 ? Math.round(totalCompliance / rniMetrics.length) : 0;

    const statusPrefix = isMultiDay ? (isBm ? 'Purata Harian: ' : 'Daily Avg: ') : '';

    let calculatedRniStatus = "";
    let statusColor = "text-emerald-400";
    if (overallCompliancePct >= 90) {
        calculatedRniStatus = statusPrefix + (isBm
            ? `Sasaran Seimbang Dicapai (${overallCompliancePct}% RNI)`
            : `Balanced Target Met (${overallCompliancePct}% RNI)`);
        statusColor = "text-emerald-400";
    } else if (overallCompliancePct >= 75) {
        calculatedRniStatus = statusPrefix + (isBm
            ? `Hampir Seimbang (${overallCompliancePct}% RNI)`
            : `Nearly Balanced (${overallCompliancePct}% RNI)`);
        statusColor = "text-blue-400";
    } else if (overallCompliancePct > 0) {
        calculatedRniStatus = statusPrefix + (isBm
            ? `Perlu Penambahbaikan (${overallCompliancePct}% RNI)`
            : `Needs Improvement (${overallCompliancePct}% RNI)`);
        statusColor = "text-amber-400";
    } else {
        calculatedRniStatus = isBm
            ? `Tiada Makanan Direkodkan (0% RNI)`
            : `No Meals Logged Yet (0% RNI)`;
        statusColor = "text-slate-400";
    }

    const MAIN_MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
    const ALL_MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const mealTypeLabel = {
        Breakfast: isBm ? 'Sarapan' : 'Breakfast',
        Lunch:     isBm ? 'Makan Tengahari' : 'Lunch',
        Dinner:    isBm ? 'Makan Malam' : 'Dinner',
        Snack:     isBm ? 'Snek' : 'Snack'
    };
    const mealTypeIcon = { Breakfast: '🍳', Lunch: '🍱', Dinner: '🍽️', Snack: '🍎' };

    const last7Days = getLast7Days();

    const last7Entries = last7Days.map(day => {
        const dayMeals = loggedMealsForChild.filter(m => m.date === day);
        const byType = {};
        dayMeals.forEach(m => { if (ALL_MEAL_TYPES.includes(m.type)) byType[m.type] = m; });
        const coverage = MAIN_MEAL_TYPES.filter(t => byType[t]).length;
        return { day, dayMeals, byType, coverage };
    });

    const totalMainMeals7 = last7Entries.reduce((s, e) => s + e.coverage, 0);
    const targetMainMeals7 = last7Days.length * MAIN_MEAL_TYPES.length;
    const fullDays7  = last7Entries.filter(e => e.coverage === 3).length;
    const emptyDays7 = last7Entries.filter(e => e.coverage === 0).length;
    const partialDays7 = last7Days.length - fullDays7 - emptyDays7;

    const perTypeCount7 = { Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 };
    last7Entries.forEach(e => ALL_MEAL_TYPES.forEach(t => { if (e.byType[t]) perTypeCount7[t]++; }));

    const oldest7 = last7Days[last7Days.length - 1];
    const newest7 = last7Days[0];
    const year7 = (newest7 || todayDateStr).split('-')[0];
    const sevenDayRangeLabel = oldest7 && newest7
        ? `${formatShortDate(oldest7, isBm)} – ${formatShortDate(newest7, isBm)}, ${year7}`
        : '';

    const growthRecordsForChild = getGrowthRecords()
        .filter(r => r.child === state.selectedChild)
        .filter(r => !(state.selectedChild === 'adam' && r.date === '2026-11-01'))
        .sort((a, b) => b.id - a.id);

    const whoRef = getWhoNextBirthYearRef(state.selectedChild, child, isBm);

    const latestGrowth = growthRecordsForChild[0] || null;
    const latestHeight = latestGrowth ? Number(latestGrowth.height) : (Number(child.height) || 0);

    let whoStatus = null;
    if (whoRef && latestHeight > 0) {
        if (latestHeight < whoRef.low) {
            whoStatus = {
                cls: 'text-rose-700 bg-rose-50 border-rose-200',
                icon: '⚠️',
                text: isBm
                    ? `Di bawah julat normal WHO ${whoRef.age} tahun (${whoRef.low}–${whoRef.high} cm)`
                    : `Below the WHO ${whoRef.age}-yr normal range (${whoRef.low}–${whoRef.high} cm)`
            };
        } else if (latestHeight > whoRef.high) {
            whoStatus = {
                cls: 'text-blue-700 bg-blue-50 border-blue-200',
                icon: '📈',
                text: isBm
                    ? `Melebihi median WHO ${whoRef.age} tahun (${whoRef.median} cm) — dalam julat normal`
                    : `Above the WHO ${whoRef.age}-yr median (${whoRef.median} cm) — within normal range`
            };
        } else {
            whoStatus = {
                cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                icon: '✅',
                text: isBm
                    ? `Dalam julat normal WHO ${whoRef.age} tahun (${whoRef.low}–${whoRef.high} cm)`
                    : `Within the WHO ${whoRef.age}-yr normal range (${whoRef.low}–${whoRef.high} cm)`
            };
        }
    }

    const growthSvgContent = buildGrowthChartSvg(growthRecordsForChild, child, isBm, { whoRef });

    const childClaim = (() => {
        try {
            return JSON.parse(localStorage.getItem('lapaq_rni_claims') || '{}')[state.selectedChild] || null;
        } catch (e) { return null; }
    })();
    const isRniClaimed = !!(child.rniClaimed || childClaim);
    const rewardPreview = getRNITokenReward(overallCompliancePct);

    const tabBtn = (tab, icon, label, badge) => `
        <button onclick="window.setLaPaQTab('${tab}')"
                class="py-2 rounded-lg text-[11px] font-extrabold transition flex items-center justify-center space-x-1 ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>${icon}</span><span>${label}</span>
            ${badge ? `<span class="text-[8px] px-1 rounded font-mono bg-slate-100 text-slate-600">${badge}</span>` : ''}
        </button>
    `;

    return `
        <div id="lapaq-view-root" class="space-y-3 pb-8">
            <!-- ===== TOP BAR ===== -->
            <div class="flex items-center justify-between mb-3 gap-2">
                <div class="flex items-center space-x-2.5">
                    <img src="https://i.imgur.com/USLbaEN.png"
                         alt="LaPaQ Logo"
                         class="w-10 h-10 rounded-xl object-contain bg-slate-800 p-1 shadow-md ring-1 ring-slate-700">
                    <div>
                        <p class="text-sm font-extrabold text-slate-800 leading-tight">LaPaQ</p>
                        <p class="text-[10px] font-mono text-slate-500 leading-tight">Nutrition &amp; Growth Intelligence</p>
                    </div>
                </div>
                <a href="https://lapaq.app:3000/login" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition shadow-md inline-block whitespace-nowrap">Sign in to LaPaQ</a>
            </div>

            <!-- ===== HERO CARD ===== -->
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-3">
                <div class="flex justify-between items-center border-b border-slate-700 pb-2.5">
                    <span class="bg-slate-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-blue-400">Intelligence Engine</span>
                    <select onchange="window.changeLaPaQChild(this.value)" class="bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                        <option value="adam" ${state.selectedChild === 'adam' ? 'selected' : ''}>👦 Adam (8 Yrs)</option>
                        <option value="maya" ${state.selectedChild === 'maya' ? 'selected' : ''}>👧 Maya (5 Yrs)</option>
                    </select>
                </div>
                <div>
                    <h2 class="text-xl font-bold">${child.name}${isBm ? 'Ambilan RNI LaPaQ' : "'s LaPaQ RNI Intake"}</h2>
                    <p class="text-xs text-slate-300 mt-0.5">${isBm ? 'Profil pematuhan Pengambilan Nutrien Disyorkan (RNI)' : 'Recommended Nutrient Intake (RNI) compliance profile'}</p>
                </div>
                <div class="p-3 bg-slate-700/60 rounded-xl border border-slate-600 flex justify-between items-center text-xs mt-2">
                    <div>
                        <p class="text-slate-300 text-[10px] font-bold uppercase">
                            ${isMultiDay
                                ? (isBm
                                    ? `Sasaran Diet RNI Harian · Purata ${periodDayCount} Hari`
                                    : `Daily RNI Diet Target · ${periodDayCount}-Day Avg`)
                                : (isBm ? 'Sasaran Diet RNI Harian' : 'Daily RNI Diet Target')}
                        </p>
                        <p class="font-bold ${statusColor} mt-0.5">${calculatedRniStatus}</p>
                    </div>
                    ${isRniClaimed
                        ? `<div class="flex items-center space-x-2">
                               <span class="bg-emerald-600/30 text-emerald-300 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                                   ✓ ${isBm ? 'Token Dicetak' : 'Token Minted'} · ${child.rniClaimTokens || childClaim?.tokens || rewardPreview} 🪙
                               </span>
                               <button onclick="window.resetRNIClaim()" 
                                       title="${isBm ? 'Set semula tuntutan' : 'Reset RNI claim'}" 
                                       class="bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] px-2 py-1 rounded-lg font-bold transition shadow-sm">
                                   ↺
                               </button>
                           </div>`
                        : overallCompliancePct >= RNI_TOKEN_THRESHOLD
                            ? `<button onclick="window.claimRNITokenWithGate()" 
                                       class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-md transition">
                                  🥗 ${isBm ? `Tuntut ${rewardPreview} Token` : `Claim ${rewardPreview} Token${rewardPreview > 1 ? 's' : ''}`}
                               </button>`
                            : `<div class="flex flex-col items-end gap-0.5">
                                    <button disabled
                                            title="${isBm ? `Perlu ${RNI_TOKEN_THRESHOLD}% RNI harian untuk menuntut` : `Reach ${RNI_TOKEN_THRESHOLD}% daily RNI to claim`}"
                                            class="bg-slate-600/40 text-slate-400 text-[10px] px-3 py-1.5 rounded-lg font-extrabold cursor-not-allowed border border-slate-600">
                                        🔒 ${isBm ? 'Token Dikunci' : 'Token Locked'}
                                    </button>
                                    <span class="text-[8px] font-mono text-slate-400">${overallCompliancePct}% / ${RNI_TOKEN_THRESHOLD}% RNI</span>
                               </div>`
                    }
                </div>
            </div>

            <!-- ===== TAB BAR ===== -->
            <div class="mt-3 grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl">
                ${tabBtn('nutrition', '🥗', isBm ? 'Pemakanan' : 'Nutrition', periodMeals.length > 0 ? periodMeals.length : '')}
                ${tabBtn('growth',    '📏', isBm ? 'Pertumbuhan' : 'Growth',  growthRecordsForChild.length > 0 ? growthRecordsForChild.length : '')}
                ${tabBtn('history',   '📜', isBm ? 'Sejarah' : 'History',     fullDays7 > 0 ? `${fullDays7}/${last7Days.length}` : '')}
            </div>

            <!-- ===== TAB: NUTRITION ===== -->
            ${activeTab === 'nutrition' ? `
            <div class="mt-3 space-y-3">

                <!-- ===== AI NUTRITION COACH CARD ===== -->
                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div class="flex justify-between items-center border-b border-emerald-200/60 pb-2">
                        <h3 class="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                            <span>🤖</span>
                            <span>${isBm ? 'AI Pakar Pemakanan LaPaQ' : 'LaPaQ AI Nutrition Coach'}</span>
                        </h3>
                    </div>
                    
                    <!-- Interactive Inquiry Box & Send Button -->
                    <div class="flex gap-2">
                        <input type="text" id="ai-coach-input" 
                               placeholder="${isBm ? 'Taip soalan pemakanan di sini...' : 'Ask a nutrition or meal question...'}" 
                               class="flex-1 bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
                        <button id="ai-coach-btn" onclick="window.runCustomAiInquiry()" 
                                class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-xs transition whitespace-nowrap flex items-center space-x-1">
                            <span>✨</span>
                            <span>${isBm ? 'Hantar' : 'Ask AI'}</span>
                        </button>
                    </div>

                    <div id="ai-coach-response" class="p-2.5 bg-white rounded-lg border border-emerald-100 min-h-[48px] flex items-center">
                        <p class="text-[10px] text-slate-500 italic">
                            ${isBm 
                                ? 'Taip soalan anda di atas dan klik Hantar untuk mendapatkan jawapan daripada Gemini AI.' 
                                : 'Type your question above and click Ask AI to get personalized guidance.'}
                        </p>
                    </div>
                </div>

                <!-- ===== CARD 1: Time Span + Cost Summary ===== -->
                <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                            <span>⏱️</span>
                            <span>${isBm ? 'Tetapan Tempoh Masa RNI' : 'RNI Time Span Calculator'}</span>
                        </h3>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">${spanLabel}</span>
                    </div>
                    <div class="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-center">
                        <button onclick="window.setLaPaQTimeSpan('1day')" class="py-1.5 rounded-lg text-[10px] font-extrabold transition ${state.lapaqTimeSpan === '1day' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">1 Day</button>
                        <button onclick="window.setLaPaQTimeSpan('1week')" class="py-1.5 rounded-lg text-[10px] font-extrabold transition ${state.lapaqTimeSpan === '1week' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">1 Week</button>
                        <button onclick="window.setLaPaQTimeSpan('1month')" class="py-1.5 rounded-lg text-[10px] font-extrabold transition ${state.lapaqTimeSpan === '1month' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">1 Month</button>
                        <button onclick="window.setLaPaQTimeSpan('custom')" class="py-1.5 rounded-lg text-[10px] font-extrabold transition ${state.lapaqTimeSpan === 'custom' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">Date Search</button>
                    </div>
                    ${state.lapaqTimeSpan === 'custom' ? `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <span class="text-[9px] font-bold text-slate-500 uppercase block">${isBm ? 'Pilih Tarikh Dengan Kalendar:' : 'Date Search with Calendar:'}</span>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">From (Open)</label>
                                    <input type="date" id="lapaq-start-date" value="${state.lapaqStartDate}" max="${todayDateStr}" onchange="window.updateLaPaQCustomDates()" class="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                                </div>
                                <div>
                                    <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">To (Today)</label>
                                    <input type="date" id="lapaq-end-date" value="${state.lapaqEndDate}" max="${todayDateStr}" onchange="window.updateLaPaQCustomDates()" class="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- ===== COST SUMMARY CARD ===== -->
                    <div class="grid grid-cols-3 gap-2 pt-1">
                        <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p class="text-[9px] font-bold text-emerald-600 uppercase">${isBm ? 'Jumlah Kos' : 'Total Spend'}</p>
                            <p class="text-base font-black text-emerald-700 font-mono">${formatRM(periodCost)}</p>
                            <p class="text-[8px] text-emerald-600">${periodMeals.length} ${isBm ? 'makanan' : 'meals'}</p>
                        </div>
                        <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <p class="text-[9px] font-bold text-blue-600 uppercase">${isBm ? 'Purata Harian' : 'Daily Avg'}</p>
                            <p class="text-base font-black text-blue-700 font-mono">${formatRM(dailyAvgCost)}</p>
                            <p class="text-[8px] text-blue-600">${isBm ? 'sehari' : 'per day'}</p>
                        </div>
                        <div class="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                            <p class="text-[9px] font-bold text-purple-600 uppercase">${isBm ? 'Purata Makanan' : 'Per Meal'}</p>
                            <p class="text-base font-black text-purple-700 font-mono">${formatRM(perMealCost)}</p>
                            <p class="text-[8px] text-purple-600">${isBm ? 'setiap hidangan' : 'avg cost'}</p>
                        </div>
                    </div>
                </div>

                <!-- ===== CARD 2: 9 RNI Intake Bars (the indicator) ===== -->
                <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-2 gap-2 flex-wrap">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">${isBm ? 'Pematuhan 9 Bar Ambilan RNI' : '9 RNI Intake Bars Compliance'}</h3>
                        <div class="flex items-center space-x-2">
                            ${periodMeals.length > 0
                                ? `<span class="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">🥘 ${periodMeals.length} ${isBm ? 'makanan' : 'meals'}</span>`
                                : ''}
                            <button onclick="window.openCreateMealModal()" class="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm transition">＋ ${isBm ? 'Log Makanan' : 'Log Meal'}</button>
                        </div>
                    </div>
                    <div class="space-y-2.5">
                        ${rniMetrics.map(m => {
                            const pct = Math.min(Math.round((m.current / m.target) * 100), 100);
                            const displayCurrent = isMultiDay
                                ? m.current.toLocaleString(undefined, { maximumFractionDigits: 1 })
                                : m.current.toLocaleString();
                            const totalSuffix = isMultiDay
                                ? `<span class="text-[9px] text-slate-400 font-mono ml-1" title="${isBm ? 'Jumlah dalam tempoh' : 'Period total'}">Σ ${Math.round(m.totalLogged).toLocaleString()}</span>`
                                : '';
                            return `
                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs font-semibold gap-2">
                                        <span class="text-slate-700">${m.name}${isMultiDay ? ` <span class="text-[9px] text-slate-400 font-normal">/day</span>` : ''}</span>
                                        <span class="text-slate-800 text-right whitespace-nowrap">
                                            ${displayCurrent} / ${m.target.toLocaleString()}${m.unit}${isMultiDay ? '/day' : ''}
                                            <span class="text-emerald-600 font-bold">(${pct}%)</span>
                                            ${totalSuffix}
                                        </span>
                                    </div>
                                    <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div class="${m.color} h-full transition-all duration-500" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ===== CARD 3: Daily Nutrition Report ===== -->
                ${buildNutritionReport(rniMetrics, isBm, periodDayCount, periodMeals.length > 0)}

                <!-- ===== CARD 4: Logged Meals list ===== -->
                ${periodMeals.length > 0 ? `
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
                        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                                <span>🥘</span>
                                <span>${isBm ? 'Makanan Direkodkan' : 'Logged Meals'}</span>
                            </h4>
                            <span class="text-[9px] text-emerald-700 font-mono font-bold">${formatRM(periodCost)}</span>
                        </div>
                        <div class="space-y-1.5 max-h-56 overflow-y-auto">
                            ${periodMeals.slice().reverse().map(m => `
                                <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start gap-2">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center space-x-1.5 flex-wrap">
                                            <span class="text-[8px] font-extrabold text-white bg-blue-500 px-1.5 py-0.5 rounded">${escHtml(m.type)}</span>
                                            <span class="text-[11px] font-bold text-slate-800 truncate">${escHtml(m.name)}</span>
                                            <span class="text-[8px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold">${formatRM(getMealCost(m))}</span>
                                        </div>
                                        <p class="text-[9px] text-slate-500 font-mono mt-0.5">${m.date} • ${m.ingredients.length} ${isBm ? 'bahan' : 'ingredients'}</p>
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            ${Object.entries(m.nutrients).filter(([k,v]) => v > 0).slice(0, 4).map(([k, v]) =>
                                                `<span class="text-[8px] bg-white border border-slate-200 text-slate-600 px-1 py-0.5 rounded font-mono">${k}: ${v}${RNI_REFERENCE[k]?.unit || ''}</span>`
                                            ).join('')}
                                            ${Object.values(m.nutrients).filter(v => v > 0).length > 4 ? `<span class="text-[8px] text-slate-400 font-mono">+${Object.values(m.nutrients).filter(v => v > 0).length - 4} more</span>` : ''}
                                        </div>
                                    </div>
                                    <button onclick="window.deleteLoggedMeal(${m.id})" title="Delete meal" class="text-rose-500 hover:text-rose-600 text-xs font-bold shrink-0">✕</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

            </div>
            ` : ''}

            <!-- ===== TAB: GROWTH ===== -->
            ${activeTab === 'growth' ? `
            <div class="mt-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">🩺 ${isBm ? 'Pemeriksaan Kesihatan & Pertumbuhan Tahunan' : 'Annual Health & Growth Check'}</h3>
                    <span class="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">WHO Standards</span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div class="flex justify-between items-center flex-wrap gap-1">
                        <span class="text-[10px] font-bold text-slate-700 uppercase">${isBm ? 'Trend Pertumbuhan & BMI' : 'Growth & BMI Trend'}</span>
                        <div class="flex items-center space-x-3 text-[9px] font-bold">
                            <span class="flex items-center text-blue-600"><span class="w-2 h-2 rounded-full bg-blue-600 inline-block mr-1"></span>${isBm ? 'Tinggi' : 'Height'}</span>
                            <span class="flex items-center text-red-600"><span class="w-2 h-2 rounded-full bg-red-600 inline-block mr-1"></span>BMI</span>
                            ${whoRef ? `<span class="flex items-center text-amber-700"><span class="w-2.5 h-1.5 rounded-sm bg-amber-400/60 border border-amber-500 inline-block mr-1"></span>${escHtml(whoRef.label)}</span>` : ''}
                        </div>
                    </div>
                    <div class="pt-2">
                        ${growthSvgContent}
                    </div>

                    ${whoStatus ? `
                        <div class="flex items-start space-x-1.5 p-2 border rounded-lg ${whoStatus.cls}">
                            <span class="text-xs shrink-0">${whoStatus.icon}</span>
                            <p class="text-[10px] font-bold leading-snug">${whoStatus.text}</p>
                        </div>
                    ` : ''}

                    ${whoRef ? `
                        <p class="text-[9px] text-amber-700 font-mono text-center">
                            ${isBm
                                ? `WHO ${whoRef.age} thn · median ${whoRef.median} cm · jalur normal (±2 SD) ${whoRef.low}–${whoRef.high} cm`
                                : `WHO ${whoRef.age} yrs · median ${whoRef.median} cm · normal band (±2 SD) ${whoRef.low}–${whoRef.high} cm`}
                        </p>
                    ` : ''}

                    <p class="text-[10px] text-slate-500 italic text-center pt-1">
                        ${state.selectedChild === 'maya'
                            ? (isBm
                                ? "Tinggi Maya berbanding umur sebelum ini di bawah skor-Z, tetapi menunjukkan peningkatan pada Julai 2025 dan kini berada pada trajektori yang sihat."
                                : "Maya's height-for-age was previously below Z-score, but improved in July 2025 and is now on a healthy growth trajectory.")
                            : (isBm
                                ? `${child.name} mengekalkan pertumbuhan yang sihat dan kadar BMI yang stabil.`
                                : `${child.name} maintains a consistent healthy growth and stable BMI rate.`)
                        }
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <div><label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Tinggi (cm)' : 'Height (cm)'}</label><input type="number" id="input-height" value="${child.height}" oninput="window.recalculateGrowthMetrics()" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"></div>
                    <div><label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Berat (kg)' : 'Weight (kg)'}</label><input type="number" id="input-weight" value="${child.weight}" oninput="window.recalculateGrowthMetrics()" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"></div>
                </div>

                <button onclick="window.recordGrowthMeasurement()" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center space-x-2">
                    <span class="text-sm">📏</span>
                    <span>${isBm ? 'Rekod Berat & Tinggi' : 'Record Weight & Height'}</span>
                </button>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div class="flex justify-between"><span class="text-slate-500 font-semibold">BMI:</span><span id="res-bmi" class="font-bold text-slate-800">${child.bmi}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500 font-semibold">${isBm ? 'Status Bantut:' : 'Stunting Status:'}</span><span id="res-stunting" class="font-bold text-emerald-600">${child.stuntingStatus}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500 font-semibold">${isBm ? 'Pembaziran / Obesiti:' : 'Wasting / Obesity:'}</span><span id="res-wasting" class="font-bold text-emerald-600">${child.wastingStatus}</span></div>
                </div>

                ${growthRecordsForChild.length > 0 ? `
                    <div class="pt-3 border-t border-slate-100 space-y-2">
                        <div class="flex justify-between items-center">
                            <h4 class="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">📏 ${isBm ? 'Rekod Pertumbuhan' : 'Growth Records'}</h4>
                            <button onclick="window.resetGrowthData()" class="text-[9px] font-bold text-rose-500 hover:text-rose-600 px-2 py-0.5 rounded border border-rose-200 transition">Reset Chart Data</button>
                        </div>
                        <div class="space-y-1.5 max-h-48 overflow-y-auto">
                            ${growthRecordsForChild.map((r, idx) => `
                                <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start gap-2">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center space-x-1.5 flex-wrap">
                                            ${idx === 0 ? `<span class="text-[8px] font-extrabold text-white bg-emerald-500 px-1.5 py-0.5 rounded">LATEST</span>` : ''}
                                            <span class="text-[11px] font-extrabold text-slate-800">${r.height} cm · ${r.weight} kg</span>
                                            <span class="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">BMI ${r.bmi}</span>
                                        </div>
                                        <p class="text-[9px] text-slate-500 font-mono mt-0.5">${r.date}</p>
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            <span class="text-[8px] bg-white border border-slate-200 text-slate-600 px-1 py-0.5 rounded font-mono">Stunting: ${escHtml(r.stuntingStatus)}</span>
                                            <span class="text-[8px] bg-white border border-slate-200 text-slate-600 px-1 py-0.5 rounded font-mono">Wasting: ${escHtml(r.wastingStatus)}</span>
                                        </div>
                                    </div>
                                    <button onclick="window.deleteGrowthRecord(${r.id})" title="Delete record" class="text-rose-500 hover:text-rose-600 text-xs font-bold shrink-0">✕</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- ===== TAB: HISTORY ===== -->
            ${activeTab === 'history' ? `
            <div class="mt-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div class="flex justify-between items-center border-b border-slate-100 pb-2 gap-2 flex-wrap">
                    <div>
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                            <span>📜</span>
                            <span>${isBm ? 'Sejarah Makanan 7 Hari' : '7-Day Meal History'}</span>
                        </h3>
                        <p class="text-[10px] text-slate-400 font-mono mt-0.5">${sevenDayRangeLabel}</p>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">${totalMainMeals7}/${targetMainMeals7} ${isBm ? 'hidangan' : 'meals'}</span>
                        <button onclick="window.resetSampleMeals()" title="Reset & reload sample demo data (today will remain empty)" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 px-1.5 py-0.5 rounded border border-slate-200 hover:border-rose-300 transition">↻</button>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div class="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p class="text-[9px] font-bold text-emerald-600 uppercase">${isBm ? 'Hari Penuh' : 'Full Days'}</p>
                        <p class="text-lg font-black text-emerald-700">${fullDays7}<span class="text-xs text-emerald-500">/${last7Days.length}</span></p>
                        <p class="text-[8px] text-emerald-600">3/3 meals</p>
                    </div>
                    <div class="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <p class="text-[9px] font-bold text-amber-600 uppercase">${isBm ? 'Sebahagian' : 'Partial'}</p>
                        <p class="text-lg font-black text-amber-700">${partialDays7}</p>
                        <p class="text-[8px] text-amber-600">1–2 meals</p>
                    </div>
                    <div class="p-2 bg-rose-50 border border-rose-200 rounded-lg">
                        <p class="text-[9px] font-bold text-rose-600 uppercase">${isBm ? 'Tiada' : 'Missed'}</p>
                        <p class="text-lg font-black text-rose-700">${emptyDays7}</p>
                        <p class="text-[8px] text-rose-600">0 meals</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    ${ALL_MEAL_TYPES.map(type => {
                        const count = perTypeCount7[type];
                        const pct = Math.round((count / last7Days.length) * 100);
                        const color = pct >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : pct >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-rose-700 bg-rose-50 border-rose-200';
                        const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                        return `
                            <div class="p-2 border rounded-lg ${color}">
                                <div class="flex justify-between items-center">
                                    <p class="text-[10px] font-bold uppercase">${mealTypeIcon[type]} ${mealTypeLabel[type]}</p>
                                    <p class="text-[10px] font-mono font-black">${count}/${last7Days.length}</p>
                                </div>
                                <div class="w-full bg-white/60 h-1.5 rounded-full overflow-hidden mt-1">
                                    <div class="${barColor} h-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    ${last7Entries.map(({ day, byType, coverage }, idx) => {
                        const isToday = idx === 0;
                        const covBg = coverage === 3 ? 'bg-emerald-500' : coverage === 2 ? 'bg-amber-500' : coverage === 1 ? 'bg-orange-500' : 'bg-rose-500';
                        const covBorder = coverage === 3 ? 'border-emerald-200' : coverage === 2 ? 'border-amber-200' : coverage === 1 ? 'border-orange-200' : 'border-rose-200';
                        const todayHighlight = isToday ? 'ring-2 ring-emerald-400/40 shadow-md' : '';
                        const dayCost = Object.values(byType).reduce((s, m) => s + getMealCost(m), 0);
                        return `
                            <div class="border ${covBorder} ${todayHighlight} rounded-lg overflow-hidden bg-white">
                                <div class="px-2.5 py-1.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                                    <div class="flex items-center space-x-2">
                                        ${isToday ? `<span class="text-[8px] font-extrabold text-white bg-emerald-500 px-1.5 py-0.5 rounded">TODAY</span>` : ''}
                                        <span class="text-[11px] font-extrabold text-slate-800">${formatDisplayDate(day, isBm)}</span>
                                        <span class="text-[8px] font-mono font-bold text-white ${covBg} px-1.5 py-0.5 rounded">${coverage}/3</span>
                                    </div>
                                    <span class="text-[9px] font-mono text-emerald-700 font-bold">${formatRM(dayCost)}</span>
                                </div>
                                <div class="divide-y divide-slate-100">
                                    ${ALL_MEAL_TYPES.map(type => {
                                        const meal = byType[type];
                                        if (meal) {
                                            const kcal = meal.nutrients?.Calories || 0;
                                            return `
                                                <div class="px-2.5 py-1.5 flex items-center justify-between hover:bg-emerald-50/40 transition">
                                                    <div class="flex items-center space-x-2 min-w-0 flex-1">
                                                        <span class="text-sm shrink-0">${mealTypeIcon[type]}</span>
                                                        <div class="min-w-0">
                                                            <div class="flex items-center space-x-1.5 flex-wrap">
                                                                <span class="text-[9px] font-bold text-emerald-600">${mealTypeLabel[type]}</span>
                                                                <span class="text-[10px] font-bold text-slate-800 truncate">${escHtml(meal.name)}</span>
                                                                <span class="text-[8px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold">${formatRM(getMealCost(meal))}</span>
                                                            </div>
                                                            <p class="text-[8px] text-slate-400 font-mono">${meal.ingredients.length} ${isBm ? 'bahan' : 'ing.'}${kcal > 0 ? ' · ' + kcal + ' kcal' : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center space-x-1 shrink-0 ml-2">
                                                        <button onclick="window.viewLoggedMeal(${meal.id})" title="View details" class="text-blue-500 hover:text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-blue-50 transition">👁</button>
                                                        <button onclick="window.deleteLoggedMeal(${meal.id})" title="Delete" class="text-rose-500 hover:text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-rose-50 transition">✕</button>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                        return `
                                            <div class="px-2.5 py-1.5 flex items-center justify-between text-slate-400">
                                                <div class="flex items-center space-x-2">
                                                    <span class="text-sm shrink-0 opacity-40">${mealTypeIcon[type]}</span>
                                                    <span class="text-[10px] italic">${mealTypeLabel[type]} — ${isBm ? 'tidak direkod' : 'not logged'}</span>
                                                </div>
                                                <button onclick="window.openCreateMealModal('${day}', '${type}')" class="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 px-2 py-0.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 rounded transition">＋ ${isBm ? 'Log' : 'Log'}</button>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}

            <!-- ===== CREATE MEAL MODAL (always present) ===== -->
            <div id="modal-create-meal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 hidden">
                <div class="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
                    <button onclick="window.closeCreateMealModal()" class="absolute top-3 right-3 text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>

                    <div class="flex items-center space-x-3 border-b border-slate-200 pb-3">
                        <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-extrabold">🍽️</div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-800">${isBm ? 'Rekod Makanan Baru' : 'Log New Meal'}</h3>
                            <p class="text-[10px] text-slate-500">${isBm ? 'Nama makanan · bahan · ukuran · kiraan mikronutrien · kos' : 'Meal name · ingredients · measurement · micronutrient count · cost'}</p>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-2.5 space-y-1.5">
                        <div class="flex justify-between items-center gap-2 flex-wrap">
                            <label class="block text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider">⚡ Quick Load Sample Menu</label>
                            <span class="text-[8px] font-mono text-emerald-600">Auto-fills name, ingredients, nutrients &amp; costs</span>
                        </div>
                        <select id="sample-meal-picker" onchange="window.loadSampleMealTemplate(this.value)" class="w-full bg-white border border-emerald-300 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer">
                            <option value="">— Choose a sample meal to auto-fill —</option>
                            ${Object.entries(SAMPLE_MEAL_TEMPLATES).map(([type, templates]) => `
                                <optgroup label="${mealTypeIcon[type] || '🍽️'} ${mealTypeLabel[type] || type}">
                                    ${templates.map((t, i) => {
                                        const tplCost = t.ingredients.reduce((s, ing) => s + (Number(ing.cost) || 0), 0);
                                        return `<option value="${type}:${i}">${escHtml(t.name)} · ${t.nutrients.Calories} kcal · ${formatRM(tplCost)}</option>`;
                                    }).join('')}
                                </optgroup>
                            `).join('')}
                        </select>
                    </div>

                    <form onsubmit="window.saveNewMeal(event)" class="space-y-3 text-xs">
                        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div class="sm:col-span-2">
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Nama Makanan' : 'Meal Name'}</label>
                                <input type="text" id="new-meal-name" required placeholder="e.g. Nasi Lemak Ikan Bilis" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Jenis' : 'Meal Type'}</label>
                                <select id="new-meal-type" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500">
                                    <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">${isBm ? 'Tarikh' : 'Date'}</label>
                                <input type="date" id="new-meal-date" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-500 uppercase">${isBm ? 'Bahan, Ukuran & Kos' : 'Ingredients, Measurement & Cost'}</label>
                                <button type="button" onclick="window.addMealIngredientRow()" class="text-[9px] font-extrabold text-emerald-600 hover:text-emerald-700 border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded transition">＋ ${isBm ? 'Tambah Bahan' : 'Add Ingredient'}</button>
                            </div>
                            <div class="overflow-x-auto pb-1">
                                <div class="min-w-[520px]">
                                    <div class="grid grid-cols-12 gap-1.5 text-[8px] font-bold uppercase text-slate-400 px-1 mb-1">
                                        <span class="col-span-4">${isBm ? 'Bahan' : 'Ingredient'}</span>
                                        <span class="col-span-1">${isBm ? 'Kuantiti' : 'Qty'}</span>
                                        <span class="col-span-2">${isBm ? 'Unit' : 'Unit'}</span>
                                        <span class="col-span-2">${isBm ? 'Mikro' : 'Key Micro'}</span>
                                        <span class="col-span-2 text-emerald-600">${isBm ? 'Kos (RM)' : 'Cost (RM)'}</span>
                                        <span class="col-span-1"></span>
                                    </div>
                                    <div id="meal-ingredient-rows" class="space-y-1.5 max-h-52 overflow-y-auto pr-1"></div>
                                    <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 px-1">
                                        <span class="text-[9px] font-bold text-slate-500 uppercase">${isBm ? 'Jumlah Kos Makanan' : 'Total Meal Cost'}</span>
                                        <span id="meal-cost-total" class="text-[12px] font-black text-emerald-700 font-mono">RM 0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-500 uppercase">${isBm ? 'Kiraan Mikronutrien' : 'Micronutrient Count'}</label>
                                <span class="text-[8px] font-mono text-slate-400">${isBm ? '% daripada RNI harian' : '% of daily RNI'}</span>
                            </div>
                            <div class="grid grid-cols-3 gap-1.5">
                                ${Object.keys(RNI_REFERENCE).map(k => {
                                    const s = mealSlug(k);
                                    return `
                                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                                        <label class="block text-[8px] font-bold text-slate-600 truncate">${k} <span class="text-slate-400 font-mono">(${RNI_REFERENCE[k].unit})</span></label>
                                        <input type="number" min="0" step="0.1" id="meal-mn-${s}" oninput="window.updateMealNutrientBadges()" placeholder="0" class="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] font-mono text-slate-800 focus:outline-none focus:border-emerald-500">
                                        <span id="meal-mnpct-${s}" class="block text-[8px] font-mono text-slate-400">0% RNI</span>
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="pt-2 flex justify-end space-x-2 border-t border-slate-200">
                            <button type="button" onclick="window.closeCreateMealModal()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600">${isBm ? 'Batal' : 'Cancel'}</button>
                            <button type="submit" class="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-sm">${isBm ? 'Simpan Makanan' : 'Save Meal'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
