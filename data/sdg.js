// data/sdg.js — UN SDG impact matrix data for the interactive SDG card tooltips.

export const sdgImpactData = {
    '2': {
        number: 'SDG 2',
        title: 'Zero Hunger',
        icon: '🥗',
        theme: { hex: '#f59e0b', rgb: '245,158,11' },
        description: 'End hunger, achieve food security and improved nutrition, and promote sustainable agriculture for all children in our cohort.',
        metrics: [
            { label: 'Evidence Records', value: '142', trend: '+18 this month', color: 'emerald' },
            { label: 'Children Reached', value: '220', trend: '100% cohort', color: 'indigo' },
            { label: 'Meals Fortified', value: '12.4K', trend: 'LaPaQ daily', color: 'amber' }
        ],
        subTargets: [
            { name: '2.1 Safe & nutritious food access', progress: 78 },
            { name: '2.2 End malnutrition (stunting/obesity)', progress: 62 },
            { name: '2.3 Double small-scale food productivity', progress: 45 }
        ],
        programs: [
            { name: 'Program SEJAHTERA School Meal Trial', pax: 50, status: 'Active' },
            { name: 'LaPaQ Micronutrient Fortification Workshop', pax: 42, status: 'Active' },
            { name: 'Early Childhood Nutrition Screening', pax: 38, status: 'Completed' }
        ]
    },
    '3': {
        number: 'SDG 3',
        title: 'Good Health & Well-being',
        icon: '💚',
        theme: { hex: '#10b981', rgb: '16,185,129' },
        description: 'Ensure healthy lives and promote well-being through WHO-standard growth monitoring, physical play, and preventive care.',
        metrics: [
            { label: 'Health Checkups', value: '220', trend: '100% screened', color: 'emerald' },
            { label: 'Physical Play Hours', value: '840', trend: '+120 this month', color: 'indigo' },
            { label: 'Z-Score Logs', value: '660', trend: 'WHO v4.2', color: 'teal' }
        ],
        subTargets: [
            { name: '3.2 End preventable child deaths (under 5)', progress: 92 },
            { name: '3.4 Reduce NCD mortality via nutrition', progress: 58 },
            { name: '3.8 Universal health coverage access', progress: 71 }
        ],
        programs: [
            { name: 'ChildESG Baseline Health Assessment', pax: 40, status: 'Completed' },
            { name: 'Junior Active Physical Play & Fitness', pax: 30, status: 'Active' },
            { name: 'Community Wellness & Hygiene Drive', pax: 32, status: 'Completed' }
        ]
    },
    '4': {
        number: 'SDG 4',
        title: 'Quality Education',
        icon: '📚',
        theme: { hex: '#ef4444', rgb: '239,68,68' },
        description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for every child in our partner network.',
        metrics: [
            { label: 'Workshops Delivered', value: '18', trend: '+3 this month', color: 'emerald' },
            { label: 'Learning Hours', value: '1,080', trend: 'avg 4.9/workshop', color: 'indigo' },
            { label: 'SDG Literacy Rate', value: '87%', trend: 'post-assessment', color: 'rose' }
        ],
        subTargets: [
            { name: '4.1 Free, equitable, quality primary education', progress: 84 },
            { name: '4.4 Relevant skills for employment', progress: 68 },
            { name: '4.7 Education for sustainable development', progress: 76 }
        ],
        programs: [
            { name: 'AI Nutrition & Health Junior Bootcamp', pax: 48, status: 'Active' },
            { name: 'Sustainable Food Systems Seminar', pax: 45, status: 'Completed' },
            { name: 'Kemaih Youth Leadership Orientation', pax: 50, status: 'Completed' }
        ]
    },
    '10': {
        number: 'SDG 10',
        title: 'Reduced Inequalities',
        icon: '🤝',
        theme: { hex: '#ec4899', rgb: '236,72,153' },
        description: 'Reduce inequality by ensuring equitable access to nutrition, education and health for underserved children across all hubs.',
        metrics: [
            { label: 'Community Centers', value: '4', trend: 'KL • SGR • PRK • PHG', color: 'emerald' },
            { label: 'B40 Children', value: '180', trend: '82% of cohort', color: 'indigo' },
            { label: 'Meal Subsidies', value: 'RM 54K', trend: 'YTD 2026', color: 'pink' }
        ],
        subTargets: [
            { name: '10.1 Income growth of bottom 40%', progress: 64 },
            { name: '10.2 Social & economic inclusion', progress: 79 },
            { name: '10.3 Equal opportunity & non-discrimination', progress: 88 }
        ],
        programs: [
            { name: 'Early Childhood Nutrition Screening', pax: 38, status: 'Completed' },
            { name: 'Program SEJAHTERA School Meal Trial', pax: 50, status: 'Active' },
            { name: 'Community Wellness & Hygiene Drive', pax: 32, status: 'Completed' }
        ]
    },
    '12': {
        number: 'SDG 12',
        title: 'Responsible Consumption',
        icon: '♻️',
        theme: { hex: '#eab308', rgb: '234,179,8' },
        description: 'Ensure sustainable consumption and production through zero-waste kitchen operations, food surplus diversion and sustainable sourcing.',
        metrics: [
            { label: 'Food Waste Diverted', value: '1,420 kg', trend: '-3.4t CO₂e', color: 'emerald' },
            { label: 'Composting Receipts', value: '86', trend: '+12 this month', color: 'indigo' },
            { label: 'Kitchen Audit Score', value: '94%', trend: 'Green Kitchen', color: 'yellow' }
        ],
        subTargets: [
            { name: '12.3 Halve per-capita food waste by 2030', progress: 72 },
            { name: '12.5 Reduce waste via prevention & recycling', progress: 81 },
            { name: '12.7 Sustainable public procurement', progress: 66 }
        ],
        programs: [
            { name: 'Zero Waste Kids Workshop', pax: 35, status: 'Active' },
            { name: 'Program SEJAHTERA School Meal Trial', pax: 50, status: 'Active' },
            { name: 'Sustainable Food Systems Seminar', pax: 45, status: 'Completed' }
        ]
    },
    '13': {
        number: 'SDG 13',
        title: 'Climate Action',
        icon: '🌱',
        theme: { hex: '#22c55e', rgb: '34,197,94' },
        description: 'Take urgent action to combat climate change through environmental education, tree planting and climate literacy programs.',
        metrics: [
            { label: 'Trees Planted', value: '1,240', trend: 'Kuantan & Shah Alam', color: 'emerald' },
            { label: 'CO₂e Offset', value: '3.4t', trend: '-24% vs 2025', color: 'indigo' },
            { label: 'Climate Workshops', value: '8', trend: 'Eco-Warrior series', color: 'green' }
        ],
        subTargets: [
            { name: '13.1 Strengthen resilience & adaptive capacity', progress: 74 },
            { name: '13.2 Integrate climate measures into policy', progress: 61 },
            { name: '13.3 Improve climate education & awareness', progress: 89 }
        ],
        programs: [
            { name: 'Eco-Warrior Tree Planting & Biodiversity', pax: 28, status: 'Active' },
            { name: 'Zero Waste Kids Workshop', pax: 35, status: 'Active' },
            { name: 'Sustainable Food Systems Seminar', pax: 45, status: 'Completed' }
        ]
    }
};

export const sdgColorMap = {
    emerald: { text: '#34d399', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)' },
    indigo:  { text: '#818cf8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)' },
    teal:    { text: '#2dd4bf', bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.35)' },
    amber:   { text: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)' },
    rose:    { text: '#fb7185', bg: 'rgba(244,63,94,0.15)',  border: 'rgba(244,63,94,0.35)'  },
    pink:    { text: '#f472b6', bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.35)' },
    yellow:  { text: '#facc15', bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.35)'  },
    green:   { text: '#4ade80', bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)'  }
};
