// data/pricing-b2c.js — B2C parent-side pricing tiers.
// Source: Subscription Fee Model PDF, Part 1.

export const b2cTiers = [
    {
        id: 'free',
        name: 'Free',
        tagline: 'Try before you commit',
        price: { 1: 0, 3: 0, 12: 0 },
        perMonth: { 1: 0, 3: 0, 12: 0 },
        savings: { 1: 0, 3: 0, 12: 0 },
        features: {
            childProfiles: 1,
            mealHistoryDays: 7,
            rniBars: false,
            dailyRniClaimRange: [1, 10],
            streak7d: 20,
            streak30d: 100,
            tokenReset: 'monthly',
            tokenRollover: 0,
            minRedemption: 50,
            ads: true,
            mealPlans: false,
            aiCoach: false,
            weeklyReport: false
        }
    },
    {
        id: 'plus',
        name: 'Plus',
        tagline: '1 child · full features',
        price: { 1: 9.90, 3: 24.90, 12: 79.00 },
        perMonth: { 1: 9.90, 3: 8.30, 12: 6.58 },
        savings: { 1: 0, 3: 16, 12: 33 },
        features: {
            childProfiles: 1,
            mealHistoryDays: 30,
            rniBars: true,
            dailyRniClaimRange: [1.5, 15],
            streak7d: 30,
            streak30d: 150,
            tokenReset: 'monthly',
            tokenRollover: 50,           // %
            tokenRolloverCap: 300,
            minRedemption: 30,
            ads: false,
            mealPlans: true,
            aiCoach: true,
            weeklyReport: true
        }
    },
    {
        id: 'family',
        name: 'Family',
        tagline: '2+ children · best value',
        price: { 1: 19.90, 3: 49.90, 12: 159.00 },
        perMonth: { 1: 19.90, 3: 16.63, 12: 13.25 },
        savings: { 1: 0, 3: 16, 12: 33 },
        features: {
            childProfiles: 4,
            mealHistoryDays: 365,        // unlimited (but 365 is the cap)
            rniBars: true,
            dailyRniClaimRange: [2, 20],
            streak7d: 40,
            streak30d: 200,
            tokenReset: 'never',
            tokenRollover: 100,          // %
            minRedemption: 20,
            ads: false,
            mealPlans: true,
            aiCoach: true,
            weeklyReport: true
        }
    }
];

export const b2cTerms = [
    { months: 1,  label: '1 Month',   notice: 'Cancel anytime, no notice required' },
    { months: 3,  label: '3 Months',  notice: 'Auto-renews; 7-day cancellation notice' },
    { months: 12, label: '1 Year',    notice: 'Auto-renews; 30-day pre-renewal reminder; pro-rated refund minus RM10 admin (first 30 days)' }
];

export const b2cGuarantee = '7-day money-back guarantee on first purchase';
