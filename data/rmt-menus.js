// data/rmt-menus.js — 20 MoE Standard RMT school menus + pre-computed averages.
// Shape matches js/modules/menu-rmt.js expectations:
//   rmtMenus[]    → array of { id, name, note?, nutrients: {11 keys} }
//   rmtAverages{} → pre-computed average per nutrient (raw units, not %)

export const rmtMenus = [
    { id: 1,  name: 'Nasi Lemak Ikan Bilis + Telur + Timun',    note: 'Classic · High Ca',    nutrients: { 'Energy': 568, 'Carbohydrates': 58.0, 'Protein': 28.3, 'Fiber': 3.4, 'Sugar': 13.8, 'Sodium': 780, 'Calcium': 615,  'Iron': 3.8, 'Potassium': 878,  'Vitamin A': 397, 'Vitamin C': 16.4 } },
    { id: 2,  name: 'Chicken Porridge + Edamame',                note: 'High Protein',         nutrients: { 'Energy': 532, 'Carbohydrates': 67.0, 'Protein': 31.6, 'Fiber': 5.4, 'Sugar': 19.8, 'Sodium': 543, 'Calcium': 388,  'Iron': 2.1, 'Potassium': 909,  'Vitamin A': 386, 'Vitamin C': 50.3 } },
    { id: 3,  name: 'Bee Hoon Sup Ayam + Sawi Hijau',            note: 'Low Ca ⚠️',            nutrients: { 'Energy': 394, 'Carbohydrates': 59.6, 'Protein': 21.2, 'Fiber': 3.1, 'Sugar': 8.4,  'Sodium': 688, 'Calcium': 96,   'Iron': 2.0, 'Potassium': 570,  'Vitamin A': 334, 'Vitamin C': 35.4 } },
    { id: 4,  name: 'Nasi Ikan Kembung Kalsium',                 note: '🦴 Highest Ca',        nutrients: { 'Energy': 556, 'Carbohydrates': 63.3, 'Protein': 27.3, 'Fiber': 4.2, 'Sugar': 18.5, 'Sodium': 577, 'Calcium': 616,  'Iron': 4.4, 'Potassium': 1020, 'Vitamin A': 312, 'Vitamin C': 53.1 } },
    { id: 5,  name: 'Nasi Ayam Masak Merah + Sayur Campur',      note: 'High Protein',         nutrients: { 'Energy': 540, 'Carbohydrates': 62.0, 'Protein': 28.0, 'Fiber': 3.8, 'Sugar': 11.0, 'Sodium': 710, 'Calcium': 140,  'Iron': 3.8, 'Potassium': 780,  'Vitamin A': 340, 'Vitamin C': 22.0 } },
    { id: 6,  name: 'Nasi Goreng Kampung + Telur Mata',          note: '',                     nutrients: { 'Energy': 480, 'Carbohydrates': 56.0, 'Protein': 18.0, 'Fiber': 3.0, 'Sugar': 9.0,  'Sodium': 680, 'Calcium': 110,  'Iron': 3.0, 'Potassium': 640,  'Vitamin A': 290, 'Vitamin C': 18.0 } },
    { id: 7,  name: 'Mee Goreng Mamak + Tauhu',                  note: 'High Sodium',          nutrients: { 'Energy': 470, 'Carbohydrates': 62.0, 'Protein': 16.0, 'Fiber': 3.2, 'Sugar': 10.0, 'Sodium': 750, 'Calcium': 130,  'Iron': 3.2, 'Potassium': 590,  'Vitamin A': 210, 'Vitamin C': 16.0 } },
    { id: 8,  name: 'Bihun Goreng Singapore + Ayam',             note: '',                     nutrients: { 'Energy': 455, 'Carbohydrates': 58.0, 'Protein': 20.0, 'Fiber': 3.0, 'Sugar': 8.0,  'Sodium': 690, 'Calcium': 105,  'Iron': 3.1, 'Potassium': 600,  'Vitamin A': 240, 'Vitamin C': 20.0 } },
    { id: 9,  name: 'Lontong + Kuah Kacang + Telur',             note: 'High K',               nutrients: { 'Energy': 430, 'Carbohydrates': 54.0, 'Protein': 15.0, 'Fiber': 4.5, 'Sugar': 9.0,  'Sodium': 620, 'Calcium': 140,  'Iron': 2.8, 'Potassium': 820,  'Vitamin A': 280, 'Vitamin C': 24.0 } },
    { id: 10, name: 'Nasi Minyak + Ayam Masak Rose',             note: '',                     nutrients: { 'Energy': 555, 'Carbohydrates': 64.0, 'Protein': 26.0, 'Fiber': 3.4, 'Sugar': 10.0, 'Sodium': 730, 'Calcium': 135,  'Iron': 3.6, 'Potassium': 760,  'Vitamin A': 330, 'Vitamin C': 19.0 } },
    { id: 11, name: 'Bubur Ayam + Cakoi',                        note: 'Low Fibre ⚠️',         nutrients: { 'Energy': 380, 'Carbohydrates': 52.0, 'Protein': 14.0, 'Fiber': 2.4, 'Sugar': 7.0,  'Sodium': 560, 'Calcium': 100,  'Iron': 2.2, 'Potassium': 530,  'Vitamin A': 180, 'Vitamin C': 12.0 } },
    { id: 12, name: 'Nasi Dagang + Ikan Tongkol',                note: '',                     nutrients: { 'Energy': 525, 'Carbohydrates': 60.0, 'Protein': 25.0, 'Fiber': 3.6, 'Sugar': 9.0,  'Sodium': 700, 'Calcium': 125,  'Iron': 3.4, 'Potassium': 800,  'Vitamin A': 320, 'Vitamin C': 21.0 } },
    { id: 13, name: 'Nasi Kerabu + Ayam Percik',                 note: 'High Vit A',           nutrients: { 'Energy': 510, 'Carbohydrates': 58.0, 'Protein': 24.0, 'Fiber': 4.2, 'Sugar': 8.0,  'Sodium': 660, 'Calcium': 150,  'Iron': 3.5, 'Potassium': 850,  'Vitamin A': 360, 'Vitamin C': 28.0 } },
    { id: 14, name: 'Mee Kari + Telur + Sayur',                  note: 'High Sodium',          nutrients: { 'Energy': 490, 'Carbohydrates': 60.0, 'Protein': 17.0, 'Fiber': 3.5, 'Sugar': 9.0,  'Sodium': 770, 'Calcium': 140,  'Iron': 3.3, 'Potassium': 700,  'Vitamin A': 250, 'Vitamin C': 22.0 } },
    { id: 15, name: 'Nasi Tomato + Ayam Masak Merah',            note: '',                     nutrients: { 'Energy': 530, 'Carbohydrates': 62.0, 'Protein': 25.0, 'Fiber': 3.6, 'Sugar': 10.0, 'Sodium': 700, 'Calcium': 130,  'Iron': 3.5, 'Potassium': 770,  'Vitamin A': 330, 'Vitamin C': 20.0 } },
    { id: 16, name: 'Roti Jala + Kari Ayam',                     note: '',                     nutrients: { 'Energy': 465, 'Carbohydrates': 52.0, 'Protein': 20.0, 'Fiber': 2.8, 'Sugar': 8.0,  'Sodium': 690, 'Calcium': 145,  'Iron': 3.0, 'Potassium': 660,  'Vitamin A': 270, 'Vitamin C': 17.0 } },
    { id: 17, name: 'Nasi Ulam + Ayam Bakar',                    note: '🌿 High Fibre',        nutrients: { 'Energy': 495, 'Carbohydrates': 56.0, 'Protein': 24.0, 'Fiber': 4.8, 'Sugar': 7.0,  'Sodium': 640, 'Calcium': 170,  'Iron': 3.4, 'Potassium': 880,  'Vitamin A': 380, 'Vitamin C': 30.0 } },
    { id: 18, name: 'Char Kuey Teow + Sayur',                    note: 'High Sodium',          nutrients: { 'Energy': 505, 'Carbohydrates': 64.0, 'Protein': 18.0, 'Fiber': 3.0, 'Sugar': 11.0, 'Sodium': 780, 'Calcium': 120,  'Iron': 3.2, 'Potassium': 640,  'Vitamin A': 200, 'Vitamin C': 15.0 } },
    { id: 19, name: 'Nasi Hainan Chicken + Sup Sayur',           note: 'High Protein',         nutrients: { 'Energy': 545, 'Carbohydrates': 60.0, 'Protein': 30.0, 'Fiber': 3.4, 'Sugar': 9.0,  'Sodium': 690, 'Calcium': 140,  'Iron': 3.7, 'Potassium': 780,  'Vitamin A': 290, 'Vitamin C': 24.0 } },
    { id: 20, name: 'Laksa Penang + Telur',                      note: '',                     nutrients: { 'Energy': 445, 'Carbohydrates': 54.0, 'Protein': 16.0, 'Fiber': 3.6, 'Sugar': 8.0,  'Sodium': 720, 'Calcium': 115,  'Iron': 2.9, 'Potassium': 700,  'Vitamin A': 230, 'Vitamin C': 26.0 } }
];

// Pre-computed averages across all 20 menus (raw units: kcal / g / mg / µg).
export const rmtAverages = Object.keys(rmtMenus[0].nutrients).reduce((acc, k) => {
    acc[k] = rmtMenus.reduce((sum, m) => sum + m.nutrients[k], 0) / rmtMenus.length;
    return acc;
}, {});
