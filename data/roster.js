// data/roster.js — 220 synthetic participant records for demo purposes.

import { kemaihCourses } from './programs.js';

const firstNames = ["Adam", "Maya", "Ahmad", "Siti", "Muhamad", "Nur", "Danial", "Sarah", "Iman", "Afiqah", "Zarifah", "Syahmi", "Harith", "Amira", "Khairul", "Farah", "Irfan", "Nadia", "Luqman", "Aisha", "Haziq", "Anis", "Faiz", "Syafiqah", "Amir", "Aina", "Hakim", "Athirah", "Zul", "Aqilah"];
const lastNames = ["bin Ainol", "binti Ainol", "bin Ghazaly", "binti Ghazaly", "bin Syahmi", "binti Syahmi", "bin Razman", "binti Razman", "bin Ismanto", "binti Ismanto", "bin Hakim", "binti Hakim", "bin Mudzaffar", "binti Zulkifle", "bin Ahmad", "binti Omar", "bin Hassan", "binti Zain", "bin Yusof", "binti Ali", "bin Latif", "binti Latif"];
const dates = ["2026-10-15", "2026-10-12", "2026-10-10", "2026-10-08", "2026-09-28", "2026-09-25", "2026-09-20", "2026-09-15", "2026-09-02", "2026-08-20"];
const ratings = ["⭐⭐⭐⭐⭐ (5.0)", "⭐⭐⭐⭐☆ (4.8)", "⭐⭐⭐⭐☆ (4.6)", "⭐⭐⭐⭐⭐ (4.9)", "⭐⭐⭐⭐☆ (4.7)"];

export const participantRoster = Array.from({ length: 220 }, (_, i) => {
    const id = i + 1;
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const name = `${fn} ${ln}`;
    const course = kemaihCourses[i % kemaihCourses.length];
    const tokenCode = `#${fn.substring(0,2).toUpperCase()}-${(100+i)}X-KEMAIH`;
    const date = dates[i % dates.length];
    return {
        id,
        name,
        token: tokenCode,
        course,
        date,
        org: "Kemaih Sdn Bhd",
        attendance: (90 + (i % 11)) + "%",
        rating: ratings[i % ratings.length],
        verified: (i % 5 !== 1),
        tokensApproved: (i % 3 === 0)
    };
});
