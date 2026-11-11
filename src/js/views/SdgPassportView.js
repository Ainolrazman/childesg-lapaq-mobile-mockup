import { state } from '../state/store.js';

function sdgEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function sdgStatusLabel(status, isBm) {
    if (status === 'verified') return isBm ? 'Disahkan (demo)' : 'Verified (demo)';
    if (status === 'rejected') return isBm ? 'Ditolak' : 'Rejected';
    return isBm ? 'Menunggu semakan' : 'Pending review';
}

export function renderParentSdgPassport() {
    const isBm = state.currentLang === 'bm';
    const records = state.sdgEvidenceRecords.filter(r =>
        (state.sdgSelectedChild === 'all' || r.child === state.sdgSelectedChild) &&
        (state.sdgSelectedFilter === 'all' || r.sdgs.includes(Number(state.sdgSelectedFilter)))
    );
    const verified = records.filter(r => r.status === 'verified').length;
    const pending = records.filter(r => r.status === 'pending').length;
    
    const sdgCards = state.sdgCatalog.map(sdg => {
        const linked = records.filter(r => r.sdgs.includes(sdg.id)).length;
        const confirmed = records.filter(r => r.sdgs.includes(sdg.id) && r.status === 'verified').length;
        return `<button onclick="window.setSdgFilter('${sdg.id}')" class="text-left p-3 rounded-xl border ${String(state.sdgSelectedFilter) === String(sdg.id) ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'} transition">
            <div class="flex items-center justify-between"><span class="text-xl">${sdg.icon}</span><span class="text-[10px] font-bold text-slate-500">SDG ${sdg.id}</span></div>
            <p class="text-xs font-extrabold text-slate-800 mt-2">${isBm ? sdg.bm : sdg.name}</p>
            <p class="text-[10px] text-slate-500 mt-1">${linked} ${isBm ? 'rekod' : 'records'} · ${confirmed} ${isBm ? 'disahkan' : 'verified'}</p>
        </button>`;
    }).join('');

    const recordCards = records.length ? records.map(r => {
        const child = state.childrenData[r.child];
        const badges = r.sdgs.map(id => `<span class="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[9px] font-bold">SDG ${id}</span>`).join(' ');
        return `<article class="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
            <div class="flex justify-between gap-2 items-start"><div><h4 class="text-xs font-extrabold text-slate-900">${sdgEscape(r.title)}</h4><p class="text-[10px] text-slate-500 mt-1">${sdgEscape(child ? child.name : r.child)} · ${sdgEscape(r.date)} · ${sdgEscape(r.id)}</p></div><span class="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${r.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${sdgStatusLabel(r.status,isBm)}</span></div>
            <div class="flex flex-wrap gap-1">${badges}</div>
            <div class="grid grid-cols-2 gap-2"><div class="bg-slate-50 rounded-lg p-2"><p class="text-[9px] text-slate-500">${isBm ? 'Ukuran' : 'Measure'}</p><p class="text-[10px] font-bold text-slate-800">${sdgEscape(r.measure)}</p><p class="text-[10px] text-slate-600">${sdgEscape(r.value)} ${sdgEscape(r.unit)}</p></div><div class="bg-slate-50 rounded-lg p-2"><p class="text-[9px] text-slate-500">${isBm ? 'Bukti' : 'Evidence'}</p><p class="text-[10px] font-bold text-slate-800">${sdgEscape(r.evidence)}</p></div></div>
            <p class="text-[10px] text-slate-500">${sdgEscape(r.note || '')}</p>
        </article>`;
    }).join('') : `<div class="p-5 text-center bg-white border border-dashed border-slate-300 rounded-xl text-xs text-slate-500">${isBm ? 'Tiada rekod untuk penapis ini.' : 'No records match these filters.'}</div>`;

    return `
        <div class="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <div class="flex justify-between items-center">
                <span class="inline-block bg-white/15 px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold">👤 Parent SDG Passport</span>
                <button onclick="window.switchProfileRole('partner'); window.switchTab('sdg');" class="text-[10px] bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-lg transition">Switch to Partner Passport →</button>
            </div>
            <h2 class="text-xl font-extrabold truncate">${state.userProfiles.parent.name}</h2>
            <p class="text-xs text-emerald-50">${isBm ? 'Pasport impak SDG keluarga dan anak-anak anda.' : 'Family and children SDG impact passport tracking achievements and activities.'}</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Jumlah rekod' : 'Activity records'}</p><p class="text-2xl font-black text-slate-900">${records.length}</p></div>
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Disahkan' : 'Reviewed'}</p><p class="text-2xl font-black text-emerald-700">${verified}</p></div>
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Menunggu' : 'Pending'}</p><p class="text-2xl font-black text-amber-600">${pending}</p></div>
        </div>
        <section class="space-y-2"><div class="flex items-center justify-between"><h3 class="text-sm font-extrabold text-slate-900">${isBm ? 'Fokus SDG' : 'SDG focus areas'}</h3><button onclick="window.setSdgFilter('all')" class="text-[10px] text-emerald-700 font-bold">${isBm ? 'Semua' : 'Show all'}</button></div><div class="grid grid-cols-2 gap-2">${sdgCards}</div></section>
        <section class="bg-white rounded-xl border border-slate-200 p-3 space-y-3"><div><h3 class="text-sm font-extrabold text-slate-900">${isBm ? 'Penapis & rekod bukti' : 'Filters & evidence records'}</h3><p class="text-[10px] text-slate-500 mt-1">${isBm ? 'Pilih anak untuk melihat rekod berkaitan.' : 'Choose a child to view related records.'}</p></div>
            <select onchange="window.setSdgChildFilter(this.value)" class="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg text-xs font-bold"><option value="all" ${state.sdgSelectedChild==='all'?'selected':''}>${isBm ? 'Semua anak (Adam & Maya)' : 'All children (Adam & Maya)'}</option><option value="adam" ${state.sdgSelectedChild==='adam'?'selected':''}>Adam</option><option value="maya" ${state.sdgSelectedChild==='maya'?'selected':''}>Maya</option></select>
            <div class="space-y-2">${recordCards}</div>
        </section>
        <section class="bg-white rounded-xl border border-slate-200 p-4 space-y-3"><div><h3 class="text-sm font-extrabold text-slate-900">${isBm ? 'Tambah rekod aktiviti' : 'Add an activity record'}</h3><p class="text-[10px] text-slate-500">${isBm ? 'Rekod baharu anak anda.' : 'Log a new activity for your children.'}</p></div>
            <label class="block text-[10px] font-bold text-slate-600">${isBm ? 'Kanak-kanak' : 'Child'}<select id="sdg-new-child" class="mt-1 w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"><option value="adam">Adam</option><option value="maya">Maya</option></select></label>
            <label class="block text-[10px] font-bold text-slate-600">${isBm ? 'Nama aktiviti' : 'Activity name'}<input id="sdg-new-title" maxlength="100" class="mt-1 w-full p-2.5 rounded-lg border border-slate-200 text-xs" placeholder="e.g. Home recycling project"></label>
            <label class="block text-[10px] font-bold text-slate-600">${isBm ? 'SDG utama' : 'Primary SDG'}<select id="sdg-new-goal" class="mt-1 w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">${state.sdgCatalog.map(x=>`<option value="${x.id}">SDG ${x.id} — ${isBm?x.bm:x.name}</option>`).join('')}</select></label>
            <label class="block text-[10px] font-bold text-slate-600">${isBm ? 'Bukti / rujukan' : 'Evidence / reference'}<input id="sdg-new-evidence" maxlength="160" class="mt-1 w-full p-2.5 rounded-lg border border-slate-200 text-xs" placeholder="Photo reference, activity certificate..."></label>
            <button onclick="window.addSdgRecord()" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">＋ ${isBm ? 'Tambah rekod baharu' : 'Add family activity record'}</button>
        </section>
    `;
}

export function renderPartnerSdgPassport() {
    const isBm = state.currentLang === 'bm';
    const orgName = state.userProfiles.partner.orgName;
    const records = state.sdgEvidenceRecords;
    const verified = records.filter(r => r.status === 'verified').length;
    const pending = records.filter(r => r.status === 'pending').length;
    
    const sdgCards = state.sdgCatalog.map(sdg => {
        const sponsored = records.filter(r => r.sdgs.includes(sdg.id)).length;
        return `<div class="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-1">
            <div class="flex items-center justify-between"><span class="text-xl">${sdg.icon}</span><span class="text-[9px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">SDG ${sdg.id}</span></div>
            <p class="text-xs font-extrabold text-indigo-900 mt-1">${isBm ? sdg.bm : sdg.name}</p>
            <p class="text-[10px] text-indigo-700">${sponsored * 12} ${isBm ? 'peserta terlibat' : 'participants engaged'} · ${sponsored} ${isBm ? 'program aktif' : 'active programs'}</p>
        </div>`;
    }).join('');

    const reviewCards = records.map(r => {
        const child = state.childrenData[r.child];
        return `<article class="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
            <div class="flex justify-between gap-2 items-start"><div><h4 class="text-xs font-extrabold text-slate-900">${sdgEscape(r.title)}</h4><p class="text-[10px] text-slate-500 mt-1">${sdgEscape(child ? child.name : r.child)} · ${sdgEscape(r.date)}</p></div><span class="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${r.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${sdgStatusLabel(r.status,isBm)}</span></div>
            <p class="text-[10px] text-slate-600">Evidence: ${sdgEscape(r.evidence)}</p>
            ${r.status === 'pending' ? `<button onclick="window.reviewSdgRecord('${r.id}')" class="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2">✓ ${isBm ? 'Sahkan Rekod Impak SDG' : 'Verify SDG Impact Record'}</button>` : `<p class="text-[10px] text-emerald-600 font-bold">✓ Verified by ${orgName}</p>`}
        </article>`;
    }).join('');

    return `
        <div class="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-2xl p-5 text-white shadow-lg space-y-2">
            <div class="flex justify-between items-center">
                <span class="inline-block bg-white/15 px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold">🏢 Organization SDG Passport</span>
                <button onclick="window.switchProfileRole('parent'); window.switchTab('sdg');" class="text-[10px] bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-lg transition">Switch to Parent Passport →</button>
            </div>
            <h2 class="text-xl font-extrabold truncate">${orgName}</h2>
            <p class="text-xs text-indigo-100">${isBm ? 'Pasport impak institusi rakan kongsi, pengesahan program, dan pematuhan SDG.' : 'Institutional partner SDG impact passport, program verifications, and sustainability metrics.'}</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Program Ditaja' : 'Programs Led'}</p><p class="text-2xl font-black text-indigo-700">6</p></div>
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Disahkan' : 'Verified'}</p><p class="text-2xl font-black text-emerald-700">${verified}</p></div>
            <div class="bg-white p-3 rounded-xl border border-slate-200"><p class="text-[9px] text-slate-500">${isBm ? 'Menunggu' : 'Pending'}</p><p class="text-2xl font-black text-amber-600">${pending}</p></div>
        </div>
        <section class="space-y-2">
            <h3 class="text-sm font-extrabold text-slate-900">${isBm ? 'Matlamat SDG Ditaja oleh Kemaih' : 'SDG Goals Impacted by Kemaih'}</h3>
            <div class="grid grid-cols-2 gap-2">${sdgCards}</div>
        </section>
        <section class="bg-white rounded-xl border border-slate-200 p-3 space-y-3">
            <div>
                <h3 class="text-sm font-extrabold text-slate-900">${isBm ? 'Pengesahan & Semakan Bukti Rakan Kongsi' : 'Partner Verification & Evidence Review'}</h3>
                <p class="text-[10px] text-slate-500 mt-0.5">${isBm ? 'Sahkan rekod aktiviti peserta untuk menyumbang kepada metrik ESG korporat.' : 'Verify participant activity records to feed into corporate ESG reporting.'}</p>
            </div>
            <div class="space-y-2">
                ${reviewCards}
            </div>
        </section>
    `;
}
