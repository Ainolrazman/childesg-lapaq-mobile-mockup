// data/pricing-b2b2c.js — B2B2C institution-side pricing tiers.
// Source: Subscription Fee Model PDF, Part 2.

export const b2b2cPlans = [
    {
        id: 'trial',
        name: 'Trial',
        tagline: '7-day free · full feature parity with Standard',
        eligibility: 'New partners · proof of concept',
        maxKids: 500,
        maxLocations: 1,
        adminSeats: 3,
        auditRetentionDays: 30,
        price: { 1: 0, 3: 0, 12: 0 },          // free
        minCommit: { 1: 0, 3: 0, 12: 0 },
        perChild: { 1: 0, 3: 0, 12: 0 }
    },
    {
        id: 'standard',
        name: 'Standard',
        tagline: 'Single location · up to 500 kids',
        eligibility: 'Single-location institutions',
        maxKids: 500,
        maxLocations: 1,
        adminSeats: 3,
        auditRetentionDays: 30,
        price: {
            1: { perChild: 8.00, minTotal: 200 },       // per child/mo, min RM200/mo
            3: { perChild: 18.00, minTotal: 420 },      // per child/quarter, min RM420/qtr
            12: { perChild: 50.00, minTotal: 1000 }     // per child/year, min RM1,000/yr
        },
        effectiveAnnualPerChild: { 1: 96, 3: 72, 12: 50 },
        savings: { 1: 0, 3: 25, 12: 48 }
    },
    {
        id: 'chain',
        name: 'Chain',
        tagline: '5+ locations · 100–1,999 kids per chain',
        eligibility: 'Multi-location groups',
        maxKids: 1999,
        maxLocations: '5+',
        adminSeats: '10+',
        auditRetentionDays: 90,
        price: {
            1: { perChild: 7.00, minTotalPerLocation: 175 },
            3: { perChild: 16.00, minTotalPerLocation: 380 },
            12: { perChild: 45.00, minTotalPerLocation: 1000 }
        },
        effectiveAnnualPerChild: { 1: 84, 3: 64, 12: 45 },
        savings: { 1: 0, 3: 24, 12: 46 }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: '500+ kids · GLC / Government',
        eligibility: 'GLCs · Government agencies',
        maxKids: 'Unlimited',
        maxLocations: 'Unlimited',
        adminSeats: 'Unlimited',
        auditRetentionDays: 'Unlimited',
        price: {
            1: { perChild: 6.50, minTotal: 3250 },       // 500 kids min
            3: { perChild: 15.00, minTotal: 7500 },
            12: { perChild: 40.00, minTotal: 20000 }
        },
        effectiveAnnualPerChild: { 1: 78, 3: 60, 12: 40 },
        savings: { 1: 0, 3: 23, 12: 49 }
    }
];

export const b2b2cTerms = [
    { months: 1,  label: '1 Month',   notice: 'Auto-renews; 14-day cancellation notice; only <30 kids or new partners testing' },
    { months: 3,  label: '3 Months',  notice: 'Auto-renews; 30-day cancellation notice; mid-tier trial option' },
    { months: 12, label: '1 Year',    notice: 'Auto-renews; 60-day pre-renewal check-in call; cancel before day 30 for 50% refund' }
];

// What each subscribed parent gets for free (the B2B2C value)
export const parentBenefitFromInstitution = {
    childProfiles: 4,
    mealHistoryDays: 30,
    rniBars: true,
    specificConsequences: true,
    specificFoodSuggestions: true,
    personalizedMealPlan: true,
    budgetOptimization: true,
    autoShoppingList: true,
    aiCoach: true,
    weeklyPdfReport: true,
    growthChartPdf: true,
    tokenMultiplier: 1.5,
    minRedemption: 30,
    ads: false,
    tokenRollover: 50,                    // %
    tokenRolloverCap: 300,
    priorityBooking: '24–48h priority',
    partnerBadgedRewards: true,
    bilingual: true,
    equivalentValue: 79                   // RM/year if bought B2C directly
};

export const billingRules = {
    priceLock: 'Once signed at RM50/child/year, price cannot increase until renewal',
    upgrades: '1M or 1Y anytime (pro-rated)',
    downgrades: 'At renewal only'
};
