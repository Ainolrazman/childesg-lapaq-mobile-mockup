// data/pricing-b2b2c.js — B2B2C institution pricing, 3 tiers × 3 currencies.

export const currencies = [
    { code: 'MYR', label: 'MYR', symbol: 'RM',  flag: '🇲🇾', name: 'Malaysian Ringgit' },
    { code: 'USD', label: 'USD', symbol: '$',   flag: '🇺🇸', name: 'US Dollar' },
    { code: 'IDR', label: 'IDR', symbol: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah' }
];

export const b2b2cPlans = [
    {
        id: 'standard',
        name: 'Standard',
        tagline: 'Single location · up to 500 kids',
        eligibility: 'Single-location institution',
        accent: 'emerald',
        icon: '🏫',
        badge: 'Most popular',
        limits: { maxKids: 500, maxLocations: 1, adminSeats: 3, auditRetentionDays: 30 },
        pricing: {
            MYR: {
                1:  { perChild: 8.00,   minTotal: 200 },
                3:  { perChild: 18.00,  minTotal: 420 },
                12: { perChild: 50.00,  minTotal: 1000 }
            },
            USD: {
                1:  { perChild: 2.00,   minTotal: 40 },
                3:  { perChild: 4.50,   minTotal: 90 },
                12: { perChild: 12.00,  minTotal: 210 }
            },
            IDR: {
                1:  { perChild: 26000,  minTotal: 650000 },
                3:  { perChild: 59000,  minTotal: 1400000 },
                12: { perChild: 165000, minTotal: 3300000 }
            }
        },
        effectiveAnnual: {
            MYR: { 1: 96,     3: 72,     12: 50 },
            USD: { 1: 24,     3: 18,     12: 12 },
            IDR: { 1: 312000, 3: 236000, 12: 165000 }
        },
        savings: { 1: 0, 3: 25, 12: 48 },
        highlights: [
            'All analytics + feature matrix',
            'Parents get Plus access free',
            'SHA-256 audit ledger',
            'Up to 500 children, 1 location'
        ]
    },
    {
        id: 'chain',
        name: 'Chain',
        tagline: '5+ locations · 100–1,999 kids',
        eligibility: 'Multi-location groups',
        accent: 'indigo',
        icon: '🏢',
        badge: 'Scale tier',
        limits: { maxKids: 1999, maxLocations: '5+', adminSeats: '10+', auditRetentionDays: 90 },
        pricing: {
            MYR: {
                1:  { perChild: 7.00,   minPerLocation: 175 },
                3:  { perChild: 16.00,  minPerLocation: 380 },
                12: { perChild: 45.00,  minPerLocation: 1000 }
            },
            USD: {
                1:  { perChild: 1.75,   minPerLocation: 37 },
                3:  { perChild: 4.00,   minPerLocation: 80 },
                12: { perChild: 10.50,  minPerLocation: 210 }
            },
            IDR: {
                1:  { perChild: 23000,  minPerLocation: 600000 },
                3:  { perChild: 53000,  minPerLocation: 1300000 },
                12: { perChild: 148000, minPerLocation: 3300000 }
            }
        },
        effectiveAnnual: {
            MYR: { 1: 84,     3: 64,     12: 45 },
            USD: { 1: 21,     3: 16,     12: 10.50 },
            IDR: { 1: 276000, 3: 212000, 12: 148000 }
        },
        savings: { 1: 0, 3: 24, 12: 46 },
        highlights: [
            'Multi-location dashboard',
            'Cross-location analytics',
            'Cross-location menu library',
            '90-day audit retention'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: '500+ kids · GLC / Government',
        eligibility: 'GLC · Government agency',
        accent: 'purple',
        icon: '🏛️',
        badge: 'Full control',
        limits: { maxKids: 'Unlimited', maxLocations: 'Unlimited', adminSeats: 'Unlimited', auditRetentionDays: 'Unlimited' },
        pricing: {
            MYR: {
                1:  { perChild: 6.50,   minTotal: 3250 },
                3:  { perChild: 15.00,  minTotal: 7500 },
                12: { perChild: 40.00,  minTotal: 20000 }
            },
            USD: {
                1:  { perChild: 1.50,   minTotal: 690 },
                3:  { perChild: 3.50,   minTotal: 1600 },
                12: { perChild: 9.00,   minTotal: 4300 }
            },
            IDR: {
                1:  { perChild: 21000,  minTotal: 10700000 },
                3:  { perChild: 49000,  minTotal: 24750000 },
                12: { perChild: 132000, minTotal: 66000000 }
            }
        },
        effectiveAnnual: {
            MYR: { 1: 78,     3: 60,     12: 40 },
            USD: { 1: 18,     3: 14,     12: 9 },
            IDR: { 1: 252000, 3: 196000, 12: 132000 }
        },
        savings: { 1: 0, 3: 22, 12: 49 },
        highlights: [
            'Everything in Chain',
            'National state filter',
            'Custom branding + own logo',
            'API access + SSO (roadmap)'
        ]
    }
];

export const b2b2cTerms = [
    { months: 1,  label: '1 Month',  notice: 'Auto-renews · 14-day cancellation notice' },
    { months: 3,  label: '3 Months', notice: 'Auto-renews · 30-day cancellation notice · mid-tier trial option' },
    { months: 12, label: '1 Year',   notice: 'Auto-renews · 60-day pre-renewal check-in call · cancel before day 30 for 50% refund', recommended: true }
];

export const parentBenefit = {
    headline: 'Your parents get Plus-tier access — free',
    valuePerChild: { MYR: 79, USD: 18, IDR: 260000 },
    description: 'Every subscribed child receives the full Plus tier equivalent at no cost to the parent. This is included in your partner subscription.',
    features: [
        { name: 'Child profiles',           value: '4' },
        { name: 'Meal history',              value: '30 days + custom' },
        { name: 'All 9 RNI bars',            value: '✓' },
        { name: 'Personalized meal plan',    value: '✓' },
        { name: 'AI nutrition coach',        value: '✓' },
        { name: 'Weekly PDF report',         value: '✓' },
        { name: 'Token multiplier',          value: '1.5×' },
        { name: 'Ads removed',               value: '✓' },
        { name: 'Priority nutritionist',     value: '24–48h' },
        { name: 'Partner-badged rewards',    value: '✓' },
        { name: 'Bilingual BM / EN',         value: '✓' }
    ]
};

export const billingRules = [
    { term: '1M', rule: 'Auto-renews · 14-day cancellation notice · available to partners with <30 children or new partners testing' },
    { term: '3M', rule: 'Auto-renews · 30-day cancellation notice · mid-tier trial option' },
    { term: '1Y', rule: 'Auto-renews by default · 60-day pre-renewal check-in call · cancel before day 30 for 50% refund' },
    { term: '⌁',  rule: 'Upgrade 1M ↔ 1Y anytime (pro-rated) · downgrade at renewal only' },
    { term: '🔒', rule: 'Annual pricing locked: once signed, price cannot increase until renewal' },
    { term: '🎁', rule: '7-day free trial available on all tiers — full feature parity, no card required' }
];

export const featureMatrix = [
    {
        group: '1. Portal · Identity & Access',
        rows: [
            { id: '1.1', label: 'Custom organization branding',      standard: true,  chain: true,  enterprise: '✓ + own logo' },
            { id: '1.2', label: 'SHA-256 audit ledger hash display', standard: true,  chain: true,  enterprise: true },
            { id: '1.3', label: 'WHO Standard RNI Engine badge',     standard: true,  chain: true,  enterprise: true },
            { id: '1.4', label: 'Mobile PWA link',                   standard: true,  chain: true,  enterprise: true },
            { id: '1.5', label: 'LaPaQ parent portal login',         standard: true,  chain: true,  enterprise: true },
            { id: '1.6', label: 'View Report · ESG export',          standard: true,  chain: true,  enterprise: true }
        ]
    },
    {
        group: '2. Live Filters & Navigation',
        rows: [
            { id: '2.1', label: 'State / Region filter',        standard: 'own',    chain: 'own',    enterprise: 'national' },
            { id: '2.2', label: 'Child Cohort / Age filter',    standard: true,     chain: true,     enterprise: true },
            { id: '2.3', label: 'Partner Organization filter',  standard: true,     chain: true,     enterprise: 'multi' },
            { id: '2.4', label: 'Time Horizon (1M/6M/YTD)',     standard: true,     chain: true,     enterprise: '+ custom' }
        ]
    },
    {
        group: '3. Program & Activity Builder',
        rows: [
            { id: '3.3', label: 'Create New Program modal',   standard: true,  chain: true,  enterprise: true },
            { id: '3.4', label: 'SDG binding per program',     standard: true,  chain: true,  enterprise: true },
            { id: '3.6', label: 'Multi-location management',   standard: '1',   chain: true,  enterprise: true },
            { id: '3.7', label: 'Cross-location duplication',  standard: false, chain: true,  enterprise: true },
            { id: '3.8', label: 'Program templates library',   standard: false, chain: true,  enterprise: true }
        ]
    },
    {
        group: '4. ESG & Impact Dashboard',
        rows: [
            { id: '4.1', label: '5 KPI cards + methodology',  standard: true, chain: true, enterprise: true },
            { id: '4.5', label: 'Weighted Score Breakdown',    standard: true, chain: true, enterprise: true },
            { id: '4.7', label: 'SDG Full Report modal',       standard: true, chain: true, enterprise: true },
            { id: '4.8', label: 'Full PDF Report export',      standard: true, chain: true, enterprise: true }
        ]
    },
    {
        group: '5. LaPaQ Nutrition & Growth',
        rows: [
            { id: '5.1',  label: 'State Hub Selector',         standard: 'own', chain: '3–5', enterprise: 'national' },
            { id: '5.14', label: 'Health Risk Projection',     standard: true,  chain: true,  enterprise: true },
            { id: '5.19', label: 'Counterfactual section',     standard: true,  chain: true,  enterprise: true },
            { id: '5.20', label: 'Inter-location comparison',  standard: false, chain: true,  enterprise: true },
            { id: '5.21', label: 'Custom cohort segmentation', standard: false, chain: true,  enterprise: true },
            { id: '5.22', label: 'API data access',            standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '6. Roster & Class Management',
        rows: [
            { id: '6.4',  label: 'Participant Roster + pagination', standard: true,  chain: true,  enterprise: true },
            { id: '6.7',  label: 'Approve Token Points',            standard: true,  chain: true,  enterprise: true },
            { id: '6.9',  label: 'Bulk import from CSV',            standard: true,  chain: true,  enterprise: true },
            { id: '6.10', label: 'Bulk operations',                 standard: true,  chain: true,  enterprise: true },
            { id: '6.11', label: 'Cross-location roster',           standard: false, chain: true,  enterprise: true },
            { id: '6.12', label: 'Roster API sync',                 standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '7. Audit & Ledger Trail',
        rows: [
            { id: '7.1', label: 'Immutable SHA-256 log stream',  standard: true,  chain: true,  enterprise: true },
            { id: '7.6', label: 'Audit trail retention',          standard: '30d', chain: '90d', enterprise: '∞' },
            { id: '7.7', label: 'Audit trail export',             standard: false, chain: true,  enterprise: true },
            { id: '7.8', label: 'Temporary auditor access',       standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '8. Menu & Dietary Analysis',
        rows: [
            { id: '8.2',  label: 'Weekly SEJAHTERA Menu (5-day)', standard: true,  chain: true,  enterprise: true },
            { id: '8.6',  label: 'Custom Menu Library',            standard: true,  chain: true,  enterprise: true },
            { id: '8.8',  label: 'Food Cost Optimization',         standard: true,  chain: true,  enterprise: true },
            { id: '8.10', label: 'Cross-location menu library',    standard: false, chain: true,  enterprise: true },
            { id: '8.11', label: 'Menu template library',          standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '9. Food Waste Tracking (SDG 12.3)',
        rows: [
            { id: '9.1', label: 'Daily waste log + calculator',    standard: true,  chain: true,  enterprise: true },
            { id: '9.4', label: 'SDG 12.3 progress bar',           standard: true,  chain: true,  enterprise: true },
            { id: '9.7', label: 'Multi-location waste comparison', standard: false, chain: true,  enterprise: true },
            { id: '9.8', label: 'Composting receipts upload',      standard: false, chain: true,  enterprise: true },
            { id: '9.9', label: 'CO₂e calculator',                 standard: 'display', chain: 'custom', enterprise: 'API' }
        ]
    },
    {
        group: '10. Nutritionist Marketplace',
        rows: [
            { id: '10.1', label: 'Nutritionist directory',          standard: true,  chain: true,  enterprise: true },
            { id: '10.3', label: 'Booking flow',                     standard: true,  chain: true,  enterprise: true },
            { id: '10.5', label: 'Booking commission',               standard: '15-25%', chain: '15-25%', enterprise: '10-15%' },
            { id: '10.6', label: 'Dedicated nutritionist assigned',  standard: false, chain: true,  enterprise: true },
            { id: '10.7', label: 'In-person clinic referral',        standard: false, chain: false, enterprise: true }
        ]
    }
];
