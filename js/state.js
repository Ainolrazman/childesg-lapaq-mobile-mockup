// js/state.js — mutable application state object.

import { participantRoster }  from '../data/roster.js';   // 🔧 FIX: './data/' → '../data/'
import { kemaihProgramsList } from '../data/programs.js'; // 🔧 FIX: './data/' → '../data/'

export const state = {
    currentTab: 'lapaq',
    selectedGeoState: 'all',
    filterRegion: 'selangor',
    filterCohort: 'all',
    filterPartner: 'kemaih',
    filterTime: '6m',
    authMode: 'login',
    rosterPage: 1,
    rosterPageSize: 20,
    rosterFiltered:   [...participantRoster],
    programsFiltered: [...kemaihProgramsList],
    logs: [
        { time: '18:42:10', text: 'QR Scan Verified: #AB-34X-KEMAIH (+25 Tokens)', hash: '0x3a2f...1b9c' },
        { time: '17:30:15', text: 'LaPaQ RNI Claimed: Maya (100% Balanced Target)', hash: '0x89f...34a2' },
        { time: '15:12:00', text: 'SDG Evidence Verified: Zero Waste Kids Workshop', hash: '0x7c1e...4f88' },
        { time: '12:05:40', text: 'WHO Growth Check Logged: SK Petaling Jaya Hub', hash: '0x2d4a...91e3' }
    ]
};
