// data/pricing-b2b2c.js — B2B2C institution-side pricing.
// Source: Subscription Fee Model PDF, Part 2.

export const b2b2cPlans = [
    {
        id: 'trial',
        name: 'Trial',
        tagline: '7-day free · full feature parity',
        eligibility: 'New partners · proof of concept',
        accent: 'slate',
        icon: '🎁',
        badge: null,
        price: { 1: 0, 3: 0, 12: 0 },
        limits: { maxKids: 500, maxLocations: 1, adminSeats: 3, auditRetentionDays: 30 },
        effectiveAnnual: { 1: 0, 3: 0, 12: 0 },
        savings: { 1: 0, 3: 0, 12: 0 },
        highlights: [
            '100% of Standard features',
            'Up to 500 children',
            '7-day time limit',
            'No payment required'
        ]
    },
    {
        id: 'standard',
        name: 'Standard',
        tagline: 'Single location · up to 500 kids',
        eligibility: 'Single-location institution',
        accent: 'emerald',
        icon: '🏫',
        badge: 'Most popular',
        price: {
            1:  { perChild: 8.00, minTotal: 200 },
            3:  { perChild: 18.00, minTotal: 420 },
            12: { perChild: 50.00, minTotal: 1000 }
        },
        limits: { maxKids: 500, maxLocations: 1, adminSeats: 3, auditRetentionDays: 30 },
        effectiveAnnual: { 1: 96, 3: 72, 12: 50 },
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
        price: {
            1:  { perChild: 7.00, minPerLocation: 175 },
            3:  { perChild: 16.00, minPerLocation: 380 },
            12: { perChild: 45.00, minPerLocation: 1000 }
        },
        limits: { maxKids: 1999, maxLocations: '5+', adminSeats: '10+', auditRetentionDays: 90 },
        effectiveAnnual: { 1: 84, 3: 64, 12: 45 },
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
        price: {
            1:  { perChild: 6.50, minTotal: 3250 },
            3:  { perChild: 15.00, minTotal: 7500 },
            12: { perChild: 40.00, minTotal: 20000 }
        },
        limits: { maxKids: 'Unlimited', maxLocations: 'Unlimited', adminSeats: 'Unlimited', auditRetentionDays: 'Unlimited' },
        effectiveAnnual: { 1: 78, 3: 60, 12: 40 },
        savings: { 1: 0, 3: 23, 12: 49 },
        highlights: [
            'Everything in Chain',
            'National state filter',
            'Custom branding + own logo',
            'API access + SSO (roadmap)'
        ]
    }
];

export const b2b2cTerms = [
    { months: 1,  label: '1 Month',  shortLabel: '1M', notice: 'Auto-renews · 14-day cancellation notice · for <30 kids or trial extensions' },
    { months: 3,  label: '3 Months', shortLabel: '3M', notice: 'Auto-renews · 30-day cancellation notice · mid-tier trial option' },
    { months: 12, label: '1 Year',   shortLabel: '1Y', notice: 'Auto-renews · 60-day pre-renewal check-in call · cancel before day 30 for 50% refund', recommended: true }
];

export const parentBenefit = {
    headline: 'Your parents get Plus-tier access — free',
    valuePerChild: 79,
    description: 'Every subscribed child receives the full Plus tier equivalent (RM79/year value) at no cost to the parent. This is included in your partner subscription.',
    features: [
        { name: 'Child profiles',        value: '4' },
        { name: 'Meal history',           value: '30 days + custom' },
        { name: 'All 9 RNI nutrient bars',value: '✓' },
        { name: 'Personalized meal plan', value: '✓' },
        { name: 'AI nutrition coach',     value: '✓' },
        { name: 'Weekly PDF report',      value: '✓' },
        { name: 'Token multiplier',       value: '1.5×' },
        { name: 'Ads removed',            value: '✓' },
        { name: 'Priority nutritionist',  value: '24–48h' },
        { name: 'Partner-badged rewards', value: '✓' },
        { name: 'Bilingual BM / EN',      value: '✓' }
    ]
};

export const billingRules = [
    { term: '1M', rule: 'Auto-renews · 14-day cancellation notice · available to partners with <30 children or new partners testing' },
    { term: '3M', rule: 'Auto-renews · 30-day cancellation notice · mid-tier trial option' },
    { term: '1Y', rule: 'Auto-renews by default · 60-day pre-renewal check-in call · cancel before day 30 for 50% refund' },
    { term: '⌁',  rule: 'Upgrade 1M ↔ 1Y anytime (pro-rated) · downgrade at renewal only' },
    { term: '🔒', rule: 'Annual pricing locked: once signed at RM50/child/year, price cannot increase until renewal' }
];

// Feature matrix — grouped, rendered as collapsible sections.
// Each tier value can be: true (✓) · false (×) · string (renders as text)
export const featureMatrix = [
    {
        group: '1. Portal · Identity & Access',
        rows: [
            { id: '1.1', label: 'Custom organization branding',     trial: true,  standard: true,  chain: true,  enterprise: '✓ + own logo' },
            { id: '1.2', label: 'SHA-256 audit ledger hash display', trial: true, standard: true,  chain: true,  enterprise: true },
            { id: '1.3', label: 'WHO Standard RNI Engine v4.2 badge', trial: true, standard: true, chain: true,  enterprise: true },
            { id: '1.4', label: 'Mobile PWA link (parents see same data)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '1.5', label: 'LaPaQ parent portal login',          trial: true, standard: true,  chain: true,  enterprise: true },
            { id: '1.6', label: 'View Report · FY ESG report export', trial: true, standard: true,  chain: true,  enterprise: true }
        ]
    },
    {
        group: '2. Live Filters & Navigation',
        rows: [
            { id: '2.1', label: 'State / Region filter',   trial: 'own state', standard: 'own state', chain: 'own states', enterprise: 'national' },
            { id: '2.2', label: 'Child Cohort / Age filter', trial: true, standard: true, chain: true, enterprise: true },
            { id: '2.3', label: 'Partner Organization filter', trial: false, standard: true, chain: true, enterprise: 'multi-tenant' },
            { id: '2.4', label: 'Time Horizon (1M / 6M / YTD)', trial: true, standard: true, chain: true, enterprise: '✓ + custom range' }
        ]
    },
    {
        group: '3. Program & Activity Builder',
        rows: [
            { id: '3.3', label: 'Create New Program modal', trial: true, standard: true, chain: true, enterprise: true },
            { id: '3.4', label: 'SDG binding per program',   trial: true, standard: true, chain: true, enterprise: true },
            { id: '3.6', label: 'Multi-location program management', trial: '1 loc', standard: '1 loc', chain: true, enterprise: true },
            { id: '3.7', label: 'Cross-location program duplication', trial: false, standard: false, chain: true, enterprise: true },
            { id: '3.8', label: 'Program templates library',  trial: false, standard: false, chain: true, enterprise: true }
        ]
    },
    {
        group: '4. ESG & Impact Dashboard',
        rows: [
            { id: '4.1', label: '5 KPI cards + methodology (40+ criteria)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '4.5', label: 'Weighted Score Breakdown modal', trial: true, standard: true, chain: true, enterprise: true },
            { id: '4.7', label: 'SDG Full Report modal (per goal)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '4.8', label: 'Full PDF Report export', trial: true, standard: true, chain: true, enterprise: true }
        ]
    },
    {
        group: '5. LaPaQ Nutrition & Growth Analytics',
        rows: [
            { id: '5.1',  label: 'State Hub Selector', trial: 'own state', standard: 'own state', chain: '3–5 states', enterprise: 'national' },
            { id: '5.14', label: 'Health Risk Projection (12mo / 5yr / adult)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '5.19', label: 'Counterfactual section ("What if we intervene?")', trial: true, standard: true, chain: true, enterprise: true },
            { id: '5.20', label: 'Inter-location comparison view', trial: false, standard: false, chain: true, enterprise: true },
            { id: '5.21', label: 'Custom cohort segmentation', trial: false, standard: false, chain: true, enterprise: true },
            { id: '5.22', label: 'API data access', trial: false, standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '6. Roster & Class Management',
        rows: [
            { id: '6.4',  label: 'Participant Roster table + pagination', trial: true, standard: true, chain: true, enterprise: true },
            { id: '6.7',  label: 'Approve Token Points (25/child)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '6.9',  label: 'Bulk import from CSV', trial: true, standard: true, chain: true, enterprise: true },
            { id: '6.10', label: 'Bulk operations (verify, approve, delete)', trial: false, standard: true, chain: true, enterprise: true },
            { id: '6.11', label: 'Cross-location roster view', trial: false, standard: false, chain: true, enterprise: true },
            { id: '6.12', label: 'Roster API sync', trial: false, standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '7. Audit & Ledger Trail',
        rows: [
            { id: '7.1', label: 'Immutable SHA-256 audit log stream', trial: true, standard: true, chain: true, enterprise: true },
            { id: '7.6', label: 'Audit trail retention', trial: '30 days', standard: '30 days', chain: '90 days', enterprise: 'Unlimited' },
            { id: '7.7', label: 'Audit trail export', trial: false, standard: false, chain: true, enterprise: true },
            { id: '7.8', label: 'Temporary auditor access link', trial: false, standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '8. Menu & Dietary Analysis Module',
        rows: [
            { id: '8.2',  label: 'Weekly SEJAHTERA Menu (5-day)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '8.6',  label: 'Custom Menu Library (create/edit/delete)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '8.8',  label: 'Food Cost Optimization calculator', trial: true, standard: true, chain: true, enterprise: true },
            { id: '8.10', label: 'Cross-location menu library', trial: false, standard: false, chain: true, enterprise: true },
            { id: '8.11', label: 'Menu template library (enterprise)', trial: false, standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '9. Food Waste Tracking (SDG 12.3)',
        rows: [
            { id: '9.1', label: 'Daily waste log + cost calculator', trial: true, standard: true, chain: true, enterprise: true },
            { id: '9.4', label: 'SDG 12.3 progress bar (2030 target)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '9.7', label: 'Multi-location waste comparison', trial: false, standard: false, chain: true, enterprise: true },
            { id: '9.8', label: 'Composting receipts upload', trial: false, standard: false, chain: true, enterprise: true },
            { id: '9.9', label: 'CO₂e calculator', trial: 'display', standard: 'display', chain: 'custom', enterprise: 'custom + API' }
        ]
    },
    {
        group: '10. Nutritionist Marketplace',
        rows: [
            { id: '10.1', label: 'Nutritionist directory + credentials', trial: true, standard: true, chain: true, enterprise: true },
            { id: '10.3', label: 'Booking flow (consultation type, date, hub)', trial: true, standard: true, chain: true, enterprise: true },
            { id: '10.5', label: 'Booking commission (paid to Nutritionist)', trial: '15–25%', standard: '15–25%', chain: '15–25%', enterprise: '10–15% (negotiated)' },
            { id: '10.6', label: 'Dedicated nutritionist assigned', trial: false, standard: false, chain: true, enterprise: true },
            { id: '10.7', label: 'In-person clinic referral', trial: false, standard: false, chain: false, enterprise: true }
        ]
    },
    {
        group: '12. Nutritionist Services (Marketplace Economics)',
        rows: [
            { id: '12.1', label: 'Browse dietitian directory', trial: true, standard: true, chain: true, enterprise: true },
            { id: '12.2', label: 'Book consultation on behalf of parent', trial: true, standard: true, chain: true, enterprise: true },
            { id: '12.3', label: 'Auto-route booking to assigned dietitian', trial: false, standard: false, chain: true, enterprise: true },
            { id: '12.5', label: 'Dedicated dietitian', trial: false, standard: false, chain: false, enterprise: true }
        ]
    }
];
