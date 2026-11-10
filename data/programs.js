// data/programs.js — Kemaih course catalog and program instances.

export const kemaihCourses = [
    "AI Nutrition & Health Junior Bootcamp",
    "Zero Waste Kids Workshop",
    "Program SEJAHTERA School Meal Trial",
    "Junior Active Physical Play & Fitness",
    "LaPaQ Micronutrient Fortification Workshop",
    "Eco-Warrior Tree Planting & Biodiversity",
    "ChildESG Baseline Health Assessment",
    "Early Childhood Nutrition Screening",
    "Sustainable Food Systems Seminar",
    "Community Wellness & Hygiene Drive",
    "Kemaih Youth Leadership & Fitness Orientation"
];

export const courseIconMap = {
    "AI Nutrition & Health Junior Bootcamp": "🤖",
    "Zero Waste Kids Workshop": "♻️",
    "Program SEJAHTERA School Meal Trial": "🌱",
    "Junior Active Physical Play & Fitness": "🏃‍♂️",
    "LaPaQ Micronutrient Fortification Workshop": "🥗",
    "Eco-Warrior Tree Planting & Biodiversity": "🌳",
    "ChildESG Baseline Health Assessment": "📋",
    "Early Childhood Nutrition Screening": "🔬",
    "Sustainable Food Systems Seminar": "🌍",
    "Community Wellness & Hygiene Drive": "🧼",
    "Kemaih Youth Leadership & Fitness Orientation": "🏆"
};

export const courseShortMap = {
    "AI Nutrition & Health Junior Bootcamp": "AI Bootcamp",
    "Zero Waste Kids Workshop": "Zero Waste",
    "Program SEJAHTERA School Meal Trial": "SEJAHTERA Trial",
    "Junior Active Physical Play & Fitness": "Active Play",
    "LaPaQ Micronutrient Fortification Workshop": "LaPaQ Fortify",
    "Eco-Warrior Tree Planting & Biodiversity": "Eco-Warrior",
    "ChildESG Baseline Health Assessment": "ESG Baseline",
    "Early Childhood Nutrition Screening": "EC Screening",
    "Sustainable Food Systems Seminar": "Food Systems",
    "Community Wellness & Hygiene Drive": "Wellness Drive",
    "Kemaih Youth Leadership & Fitness Orientation": "Youth Leadership"
};

export const kemaihProgramsList = [
    { id: 1, title: "AI Nutrition & Health Junior Bootcamp", icon: "🤖", status: "Active Launch", statusClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", borderHover: "hover:border-emerald-500/50", titleHover: "group-hover:text-emerald-400", desc: "Interactive AI nutrition education and diet tracking for early childhood.", cohort: "Age 3–6", sdg: "SDG 2, 3", date: "2026-10-15", location: "Kuala Lumpur", participants: 48 },
    { id: 2, title: "Zero Waste Kids Workshop", icon: "♻️", status: "Scheduled", statusClass: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", borderHover: "hover:border-indigo-500/50", titleHover: "group-hover:text-indigo-400", desc: "Interactive food waste sorting and sustainable cooking awareness for primary juniors.", cohort: "Age 7–12", sdg: "SDG 12, 13", date: "2026-10-12", location: "Petaling Jaya", participants: 35 },
    { id: 3, title: "Program SEJAHTERA School Meal Trial", icon: "🌱", status: "Active Launch", statusClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", borderHover: "hover:border-emerald-500/50", titleHover: "group-hover:text-emerald-400", desc: "Targeting Calcium & Vitamin C daily fortification across pilot centers.", cohort: "Age 3–6", sdg: "SDG 2, 3", date: "2026-10-10", location: "Shah Alam", participants: 50 },
    { id: 4, title: "Junior Active Physical Play & Fitness", icon: "🏃‍♂️", status: "Drafting", statusClass: "bg-amber-500/20 text-amber-400 border-amber-500/30", borderHover: "hover:border-amber-500/50", titleHover: "group-hover:text-amber-400", desc: "Physical play tracking combined with WHO height-for-age trajectory monitoring.", cohort: "All Ages", sdg: "SDG 3, 4", date: "2026-10-08", location: "Ipoh", participants: 30 },
    { id: 5, title: "LaPaQ Micronutrient Fortification Workshop", icon: "🥗", status: "Active Launch", statusClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", borderHover: "hover:border-emerald-500/50", titleHover: "group-hover:text-emerald-400", desc: "RNI deficit monitoring and fortified lunch meal planning for school children.", cohort: "Age 7–12", sdg: "SDG 2, 3", date: "2026-09-28", location: "Kuala Lumpur", participants: 42 },
    { id: 6, title: "Eco-Warrior Tree Planting & Biodiversity", icon: "🌳", status: "Scheduled", statusClass: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", borderHover: "hover:border-indigo-500/50", titleHover: "group-hover:text-indigo-400", desc: "Outdoor tree planting and hands-on ESG environmental stewardship field days.", cohort: "All Ages", sdg: "SDG 13, 15", date: "2026-09-25", location: "Kuantan", participants: 28 },
    { id: 7, title: "AI Nutrition & Health Junior Bootcamp", icon: "🤖", status: "Completed", statusClass: "bg-slate-800 text-slate-300 border-slate-700", borderHover: "hover:border-slate-600", titleHover: "group-hover:text-emerald-400", desc: "Cohort 1 execution focusing on digital dietary log verification and tokens.", cohort: "Age 7–12", sdg: "SDG 3, 4", date: "2026-09-20", location: "Petaling Jaya", participants: 40 },
    { id: 8, title: "Zero Waste Kids Workshop", icon: "♻️", status: "Completed", statusClass: "bg-slate-800 text-slate-300 border-slate-700", borderHover: "hover:border-slate-600", titleHover: "group-hover:text-indigo-400", desc: "Kitchen surplus composting and zero waste habit building for primary students.", cohort: "Age 7–12", sdg: "SDG 12", date: "2026-09-15", location: "Shah Alam", participants: 32 },
    { id: 9, title: "Program SEJAHTERA School Meal Trial", icon: "🌱", status: "Completed", statusClass: "bg-slate-800 text-slate-300 border-slate-700", borderHover: "hover:border-slate-600", titleHover: "group-hover:text-emerald-400", desc: "Initial pilot rollout for daily micronutrient fortified dietary supplements.", cohort: "Age 3–6", sdg: "SDG 2", date: "2026-09-02", location: "Ipoh", participants: 45 },
    { id: 10, title: "LaPaQ Micronutrient Fortification Workshop", icon: "🥗", status: "Completed", statusClass: "bg-slate-800 text-slate-300 border-slate-700", borderHover: "hover:border-slate-600", titleHover: "group-hover:text-emerald-400", desc: "Parent and educator nutrition workshop covering WHO standard growth metrics.", cohort: "All Ages", sdg: "SDG 2, 3", date: "2026-08-20", location: "Kuantan", participants: 38 }
];
