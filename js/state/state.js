// js/state/state.js — single source of truth for cross-module mutable state.
// Mutations by any module are visible everywhere (shared object reference).

import { participantRoster } from '../../data/roster.js';
import { kemaihProgramsList } from '../../data/programs.js';

export const state = {
    /* ── Navigation & filters ─────────────────────────── */
    currentTab:        'lapaq',       // 'new-program' | 'esg' | 'lapaq' | 'roster' | 'audit'
    selectedGeoState:  'all',         // 'all' | 'kl' | 'selangor' | 'perak' | 'pahang'
    filterRegion:      'selangor',
    filterCohort:      'all',
    filterPartner:     'kemaih',
    filterTime:        '6m',          // '1m' | '6m' | 'ytd'

    /* ── Auth ─────────────────────────────────────────── */
    authMode:          'login',       // 'login' | 'register'

    /* ── Roster pagination & filter ───────────────────── */
    rosterPage:        1,
    rosterPageSize:    20,
    rosterFiltered:    [...participantRoster],     // filterRosterTable() replaces this

    /* ── Programs grid ────────────────────────────────── */
    programsFiltered:  [...kemaihProgramsList],    // applyProgramFilters() replaces this

    /* ── Audit ledger (4 seed entries) ────────────────── */
    logs: [
        { time: '18:42:10', text: 'QR Scan Verified: #AB-34X-KEMAIH (+25 Tokens)',  hash: '0x3a2f...1b9c' },
        { time: '17:30:15', text: 'LaPaQ RNI Claimed: Maya (100% Balanced Target)',   hash: '0x89f...34a2' },
        { time: '15:12:00', text: 'SDG Evidence Verified: Zero Waste Kids Workshop', hash: '0x7c1e...4f88' },
        { time: '12:05:40', text: 'WHO Growth Check Logged: SK Petaling Jaya Hub',   hash: '0x2d4a...91e3' }
    ]
};
