// data/pricing-b2c.js — B2C parent-side pricing.

export const currencies = [
    { code: 'MYR', label: 'MYR', symbol: 'RM',  flag: '🇲🇾' },
    { code: 'USD', label: 'USD', symbol: '$',   flag: '🇺🇸' },
    { code: 'IDR', label: 'IDR', symbol: 'IDR', flag: '🇮🇩' }
];

export const b2cPlans = [
    {
        id: 'free',
        name: 'Free',
        tagline: 'Try before you commit',
        icon: '🌱',
        accent: 'slate',
        pricing: { MYR: { 1: 0, 3: 0, 12: 0 }, USD: { 1: 0, 3: 0, 12: 0 }, IDR: { 1: 0, 3: 0, 12: 0 } },
        features: {
            childProfiles: '1',
            mealHistory: '7 days',
            rniBars: 'Basic',
            advice: 'Teased',
            mealPlan: '—',
            aiCoach: '—',
            tokenEarn: '1–10 / day',
            tokenRollover: '0%',
            priorityBooking: 'Standard'
        }
    },
    {
        id: 'plus',
        name: 'Plus',
        tagline: '1 child · full features',
        icon: '⭐',
        accent: 'emerald',
        badge: 'Most Popular',
        pricing: {
            MYR: { 1: 9.90, 3: 24.90, 12: 79.00 },
            USD: { 1: 2.50, 3: 6.50, 12: 18.00 },
            IDR: { 1: 33000, 3: 82000, 12: 260000 }
        },
        features: {
            childProfiles: '1',
            mealHistory: '30 days + custom',
            rniBars: 'All 9',
            advice: 'Full',
            mealPlan: '✓',
            aiCoach: '✓',
            tokenEarn: '1.5–15 / day',
            tokenRollover: '50% (cap 300)',
            priorityBooking: 'Standard'
        }
    },
    {
        id: 'family',
        name: 'Family',
        tagline: '2+ children · best value',
        icon: '👨‍👩‍👧‍👦',
        accent: 'indigo',
        badge: 'Best Value',
        pricing: {
            MYR: { 1: 19.90, 3: 49.90, 12: 159.00 },
            USD: { 1: 5.00, 3: 12.90, 12: 39.00 },
            IDR: { 1: 66000, 3: 165000, 12: 520000 }
        },
        features: {
            childProfiles: '4',
            mealHistory: 'Unlimited',
            rniBars: 'All 9',
            advice: 'Full',
            mealPlan: '✓',
            aiCoach: '✓',
            tokenEarn: '2–20 / day',
            tokenRollover: '100%',
            priorityBooking: 'Priority 24h'
        }
    }
];
