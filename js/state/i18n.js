export const translations = {
    en: {
        logout: "🚪",
        register: "Register",
        home: "Home",
        menuTitle: "More Menu Choices",
        menu: {
            programs: "Partner Programs & Activities",
            lapaq: "LaPaQ RNI Intelligence",
            sdg: "SDG Impact Passport",
            scanner: "QR Code Scanner",
            tokens: "Impact Tokens Wallet",
            reset: "Reset Demo State"
        },
        titles: {
            layer1: "Registration Gateway",
            home: "Profile Management",
            programs: "Partner Programs & Activities",
            layer3: "Children Profile",
            lapaq: "LaPaQ RNI Analytics",
            sdg: "SDG Impact Passport",
            school: "Partner Dashboard",
            scanner: "QR Code Scanner",
            tokens: "Impact Tokens Wallet"
        }
    },
    bm: {
        logout: "🚪",
        register: "Daftar",
        home: "Utama",
        menuTitle: "Pilihan Menu Lanjutan",
        menu: {
            programs: "Program & Aktiviti Rakan Kongsi",
            lapaq: "Analisis RNI LaPaQ",
            sdg: "Pasport Impak SDG",
            scanner: "Pengimbas Kod QR",
            tokens: "Dompet Token Impak",
            reset: "Set Semula Demo"
        },
        titles: {
            layer1: "Gerbang Pendaftaran",
            home: "Pengurusan Profil",
            programs: "Program & Aktiviti Rakan Kongsi",
            layer3: "Profil Kanak-kanak",
            lapaq: "Analisis RNI LaPaQ",
            sdg: "Pasport Impak SDG",
            school: "Pemuka Rakan Kongsi",
            scanner: "Pengimbas Kod QR",
            tokens: "Dompet Token Impak"
        }
    }
};

export function t(lang, path) {
    const keys = path.split('.');
    let result = translations[lang] || translations.en;
    for (const key of keys) {
        if (result && result[key] !== undefined) {
            result = result[key];
        } else {
            return path;
        }
    }
    return result;
}
