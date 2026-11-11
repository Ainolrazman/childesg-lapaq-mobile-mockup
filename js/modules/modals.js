// js/modules/modals.js — small modal open/close helpers (ESG breakdown, wizard, program history).

/* ── ESG Score Breakdown ──────────────────────────────────── */
export function openEsgBreakdownModal() {
    document.getElementById('modal-esg-breakdown').classList.remove('hidden');
}
export function closeEsgBreakdownModal() {
    document.getElementById('modal-esg-breakdown').classList.add('hidden');
}

/* ── Partner Certification Wizard ─────────────────────────── */
export function openWizardModal() {
    document.getElementById('modal-wizard').classList.remove('hidden');
}
export function closeWizardModal() {
    document.getElementById('modal-wizard').classList.add('hidden');
}
export function selectTier(title, fee) {
    closeWizardModal();
    alert(`🎉 Tier Selected: ${title} (${fee})`);
}

/* ── Program Deployment History ───────────────────────────── */
export function openHistoryModal() {
    document.getElementById('modal-history').classList.remove('hidden');
}
export function closeHistoryModal() {
    document.getElementById('modal-history').classList.add('hidden');
}
