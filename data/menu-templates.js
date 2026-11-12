// js/data/menu-templates.js — sample menu templates for the "Quick Load" buttons
// in the Create New Menu modal (js/modules/menu-engine.js).

export const sampleMenuTemplates = {
    'nasi-lemak': {
        label: 'Nasi Lemak',
        emoji: '🍚',
        name: 'Nasi Lemak Sejahtera (Fortified)',
        day: 'Monday',
        ingredients: [
            { name: 'Beras (rice, raw)', qty: '50', unit: 'g', micro: 'Carbs 39.5g' },
            { name: 'Ikan bilis (dried anchovies)', qty: '15', unit: 'g', micro: 'Calcium 230mg' },
            { name: 'Telur ayam rebus (boiled egg)', qty: '1', unit: 'pcs', micro: 'Vit A 74µg' },
            { name: 'Kacang tanah (roasted peanuts)', qty: '10', unit: 'g', micro: 'Potassium 70mg' },
            { name: 'Timun (cucumber)', qty: '30', unit: 'g', micro: 'Potassium 44mg' },
            { name: 'Santan kelapa (coconut milk)', qty: '20', unit: 'ml', micro: 'Energy 46kcal' },
            { name: 'Sambal tumis (chili paste)', qty: '15', unit: 'g', micro: 'Sodium 250mg' },
            { name: 'Susu kalsium fortifikasi (fortified milk)', qty: '200', unit: 'ml', micro: 'Calcium 300mg' },
            { name: 'Bayam hijau (spinach)', qty: '30', unit: 'g', micro: 'Vit A 141µg' }
        ],
        nutrients: {
            'Energy': 568, 'Carbohydrates': 58, 'Protein': 28.3, 'Fiber': 3.4,
            'Sugar': 13.8, 'Sodium': 780, 'Calcium': 615, 'Iron': 3.8,
            'Potassium': 878, 'Vitamin A': 397, 'Vitamin C': 16.4
        }
    },
    'chicken-porridge': {
        label: 'Chicken Porridge',
        emoji: '🍲',
        name: 'Chicken Porridge Edamame Sejahtera',
        day: 'Tuesday',
        ingredients: [
            { name: 'Beras (rice, raw)', qty: '50', unit: 'g', micro: 'Carbs 39.5g' },
            { name: 'Isi ayam (chicken breast)', qty: '50', unit: 'g', micro: 'Protein 15.5g' },
            { name: 'Edamame (steamed)', qty: '40', unit: 'g', micro: 'Fiber 2.1g' },
            { name: 'Karot (carrot)', qty: '30', unit: 'g', micro: 'Vit A 251µg' },
            { name: 'Susu kalsium fortifikasi', qty: '200', unit: 'ml', micro: 'Calcium 300mg' },
            { name: 'Minyak masak (cooking oil)', qty: '5', unit: 'ml', micro: 'Energy 44kcal' },
            { name: 'Bawang putih & halia', qty: '5', unit: 'g', micro: 'Vit C 1.5mg' },
            { name: 'Garam (salt)', qty: '1', unit: 'g', micro: 'Sodium 390mg' },
            { name: 'Oren segar (fresh orange)', qty: '80', unit: 'g', micro: 'Vit C 42.6mg' }
        ],
        nutrients: {
            'Energy': 532, 'Carbohydrates': 67, 'Protein': 31.6, 'Fiber': 5.4,
            'Sugar': 19.8, 'Sodium': 543, 'Calcium': 388, 'Iron': 2.1,
            'Potassium': 909, 'Vitamin A': 386, 'Vitamin C': 50.3
        }
    },
    'beehoon': {
        label: 'Bee Hoon Sup',
        emoji: '🍜',
        name: 'Bee Hoon Sup Ayam Sejahtera',
        day: 'Wednesday',
        ingredients: [
            { name: 'Bee hoon (dry rice vermicelli)', qty: '55', unit: 'g', micro: 'Carbs 45.1g' },
            { name: 'Isi ayam (chicken)', qty: '40', unit: 'g', micro: 'Protein 12.4g' },
            { name: 'Sawi hijau (choy sum)', qty: '40', unit: 'g', micro: 'Vit C 18mg' },
            { name: 'Karot (carrot)', qty: '25', unit: 'g', micro: 'Vit A 209µg' },
            { name: 'Fishball', qty: '30', unit: 'g', micro: 'Sodium 210mg' },
            { name: 'Minyak masak', qty: '5', unit: 'ml', micro: 'Energy 44kcal' },
            { name: 'Bawang putih & halia', qty: '5', unit: 'g', micro: 'Vit C 1.5mg' },
            { name: 'Garam (salt)', qty: '1', unit: 'g', micro: 'Sodium 390mg' },
            { name: 'Tembikai susu (honeydew)', qty: '80', unit: 'g', micro: 'Vit C 14.4mg' }
        ],
        nutrients: {
            'Energy': 394, 'Carbohydrates': 59.6, 'Protein': 21.2, 'Fiber': 3.1,
            'Sugar': 8.4, 'Sodium': 688, 'Calcium': 96, 'Iron': 2.0,
            'Potassium': 570, 'Vitamin A': 334, 'Vitamin C': 35.4
        }
    },
    'ikan-kembung': {
        label: 'Ikan Kembung',
        emoji: '🐟',
        name: 'Nasi Ikan Kembung Kalsium',
        day: 'Thursday',
        ingredients: [
            { name: 'Beras (rice, raw)', qty: '50', unit: 'g', micro: 'Carbs 39.5g' },
            { name: 'Ikan kembung (mackerel, w/ bones)', qty: '60', unit: 'g', micro: 'Calcium 90mg' },
            { name: 'Tauhu (calcium-set tofu)', qty: '40', unit: 'g', micro: 'Calcium 140mg' },
            { name: 'Brokoli', qty: '40', unit: 'g', micro: 'Vit C 35.6mg' },
            { name: 'Bayam hijau', qty: '30', unit: 'g', micro: 'Vit A 141µg' },
            { name: 'Susu kalsium fortifikasi', qty: '200', unit: 'ml', micro: 'Calcium 300mg' },
            { name: 'Minyak masak', qty: '5', unit: 'ml', micro: 'Energy 44kcal' },
            { name: 'Garam (salt)', qty: '1', unit: 'g', micro: 'Sodium 390mg' },
            { name: 'Oren segar', qty: '80', unit: 'g', micro: 'Vit C 42.6mg' }
        ],
        nutrients: {
            'Energy': 556, 'Carbohydrates': 63.3, 'Protein': 27.3, 'Fiber': 4.2,
            'Sugar': 18.5, 'Sodium': 577, 'Calcium': 616, 'Iron': 4.4,
            'Potassium': 1020, 'Vitamin A': 312, 'Vitamin C': 53.1
        }
    }
};
