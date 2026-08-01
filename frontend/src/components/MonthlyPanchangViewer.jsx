import React, { useState, useEffect } from 'react';
import { fetchMonthlyPanchang, fetchNextAdhikMaas, fetchAnimatedTransits } from '../services/api';

const detectTransitYogas = (planets) => {
    if (!planets) return [];
    const zodiacOrder = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const planetSigns = {};
    planets.forEach(p => {
        const sIdx = zodiacOrder.findIndex(z => z.toLowerCase().startsWith(p.zodiac.toLowerCase().slice(0, 3)));
        if (sIdx !== -1) {
            planetSigns[p.name] = sIdx;
        }
    });

    const activeYogas = [];
    const planetsList = ["Sun", "Mars", "Mercury", "Venus", "Jupiter", "Saturn", "Rahu", "Ketu", "Moon"];

    for (let i = 0; i < planetsList.length; i++) {
        for (let j = i + 1; j < planetsList.length; j++) {
            const p1 = planetsList[i];
            const p2 = planetsList[j];
            if (planetSigns[p1] === undefined || planetSigns[p2] === undefined) continue;

            const s1 = planetSigns[p1];
            const s2 = planetSigns[p2];

            const diff = (s2 - s1 + 12) % 12;

            // 1. Shadashtak Yoga (6/8)
            if ((diff === 5 || diff === 7) && p1 !== "Moon" && p2 !== "Moon") {
                activeYogas.push({
                    name: `षडाष्टक योग / Shadashtak Yoga (${p1}-${p2})`,
                    desc: `${p1} and ${p2} are in a 6/8 relationship, suggesting potential tension and friction.`,
                    isBenefic: false
                });
            }
            // 2. Dwishwirdhan (2/12)
            else if ((diff === 1 || diff === 11) && p1 !== "Moon" && p2 !== "Moon") {
                activeYogas.push({
                    name: `द्विद्वादश योग / Dwishwirdhan Yoga (${p1}-${p2})`,
                    desc: `${p1} and ${p2} are in a 2/12 relationship, indicating rising expenses or minor shifts.`,
                    isBenefic: false
                });
            }
            // 3. Conjunction (Yuti)
            else if (diff === 0) {
                if ((p1 === "Jupiter" && p2 === "Rahu") || (p1 === "Rahu" && p2 === "Jupiter")) {
                    activeYogas.push({
                        name: "गुरु चांडाल योग / Guru Chandal Yoga",
                        desc: "Jupiter and Rahu are conjoined, indicating ethical tests and spiritual realignment.",
                        isBenefic: false
                    });
                } else if ((p1 === "Mars" && p2 === "Rahu") || (p1 === "Rahu" && p2 === "Mars") || (p1 === "Mars" && p2 === "Ketu") || (p1 === "Ketu" && p2 === "Mars")) {
                    activeYogas.push({
                        name: "अंगारक योग / Angarak Yoga",
                        desc: "Mars and Node (Rahu/Ketu) are conjoined, indicating highly impulsive or aggressive energy.",
                        isBenefic: false
                    });
                } else if ((p1 === "Mercury" && p2 === "Venus") || (p1 === "Venus" && p2 === "Mercury")) {
                    activeYogas.push({
                        name: "लक्ष्मी नारायण योग / Laxmi Narayan Yoga",
                        desc: "Mercury and Venus are conjoined, bringing creativity, intelligence, and fortune.",
                        isBenefic: true
                    });
                } else if ((p1 === "Sun" && p2 === "Mercury") || (p1 === "Mercury" && p2 === "Sun")) {
                    activeYogas.push({
                        name: "बुधादित्य योग / Budhaditya Yoga",
                        desc: "Sun and Mercury are conjoined, boosting career growth, communication, and intellect.",
                        isBenefic: true
                    });
                }
            }

            // 4. Gaja Kesari (Jupiter - Moon Kendra)
            if ((p1 === "Moon" && p2 === "Jupiter") || (p1 === "Jupiter" && p2 === "Moon")) {
                if (diff === 0 || diff === 3 || diff === 6 || diff === 9) {
                    activeYogas.push({
                        name: "गज केसरी योग / Gaja Kesari Yoga",
                        desc: "Jupiter and Moon are in Kendra (1/4/7/10), indicating wisdom, mental peace, and prosperity.",
                        isBenefic: true
                    });
                }
            }
        }
    }
    return activeYogas;
};

const checkAuspiciousCeremonies = (dayData, dateStr) => {
    if (!dayData) return [];
    
    const nakName = dayData.nakshatra?.nakshatra_name || "";
    const tithiVal = dayData.tithi ? (dayData.tithi.tithi_index % 15) + 1 : 0;
    const dateObj = new Date(dateStr);
    const jsDay = dateObj.getDay();

    const ceremonies = [
        {
            name: "विवाह संस्कार / Marriage (Vivah)",
            nakshatras: ["Rohini", "Mrigashira", "Magha", "Hasta", "Swati", "Anuradha", "Mool", "Moola", "Uttara Phalguni", "Uttara Ashadha", "Uttarashada", "Uttara Bhadrapada", "Revati"],
            tithis: [2, 3, 5, 7, 11, 13],
            days: [1, 3, 4, 5] // Mon, Wed, Thu, Fri
        },
        {
            name: "गृह प्रवेश / House Warming (Grih Pravesh)",
            nakshatras: ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Uttarashada", "Uttara Bhadrapada", "Dhanishta"],
            tithis: [2, 3, 5, 7, 10, 11, 12, 13],
            days: [1, 3, 4, 5] // Mon, Wed, Thu, Fri
        },
        {
            name: "सगाई, रोका और तिलक / Engagement, Sagai, Roka & Tilak",
            nakshatras: ["Ashwini", "Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mool", "Moola", "Uttara Ashadha", "Uttarashada", "Uttara Bhadrapada", "Revati", "Pushya", "Shravana"],
            tithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
            days: [1, 3, 4, 5]
        },
        {
            name: "मुंडन संस्कार / Tonsure (Mundan)",
            nakshatras: ["Ashwini", "Mrigashira", "Pushya", "Hasta", "Punarvasu"],
            tithis: [2, 3, 5, 7, 10, 11, 13],
            days: [1, 3, 4, 5]
        },
        {
            name: "उपनयन संस्कार / Sacred Thread (Up Nayan)",
            nakshatras: ["Hasta", "Chitra", "Swati", "Anuradha", "Shravana", "Dhanishta", "Revati"],
            tithis: [2, 3, 5, 10, 11, 12],
            days: [0, 1, 3, 4, 5] // Sun, Mon, Wed, Thu, Fri
        },
        {
            name: "नया वाहन खरीद / New Vehicle Purchase",
            nakshatras: ["Pushya", "Punarvasu", "Swati", "Shravana", "Ashwini", "Revati"],
            tithis: [2, 3, 5, 7, 8, 10, 11, 12, 13],
            days: [1, 3, 4, 5]
        }
    ];

    const results = [];
    ceremonies.forEach(c => {
        const hasNak = c.nakshatras.some(n => nakName.toLowerCase().includes(n.toLowerCase()));
        const hasTithi = c.tithis.includes(tithiVal);
        const hasDay = c.days.includes(jsDay);
        
        if (hasNak && hasTithi && hasDay) {
            results.push(c.name);
        }
    });

    return results;
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EKADASHI_NAMES = {
    "Chaitra": { Krishna: "Papmochani", Shukla: "Kamada" },
    "Vaishakha": { Krishna: "Varuthini", Shukla: "Mohini" },
    "Jyeshtha": { Krishna: "Apara", Shukla: "Nirjala" },
    "Ashadha": { Krishna: "Yogini", Shukla: "Devshayani" },
    "Shravana": { Krishna: "Kamika", Shukla: "Shravana Putrada" },
    "Bhadrapada": { Krishna: "Aja", Shukla: "Parivartini" },
    "Ashvina": { Krishna: "Indira", Shukla: "Papankusha" },
    "Kartika": { Krishna: "Rama", Shukla: "Prabodhini" },
    "Margashirsha": { Krishna: "Utpanna", Shukla: "Mokshada" },
    "Pausha": { Krishna: "Saphala", Shukla: "Pausha Putrada" },
    "Magha": { Krishna: "Shattila", Shukla: "Jaya" },
    "Phalguna": { Krishna: "Vijaya", Shukla: "Amalaki" },
    "Adhik": { Krishna: "Parama", Shukla: "Padmini" }
};

const calculateHinduYears = (gregorianYear, gregorianMonthIndex) => {
    // Chaitra roughly starts around March/April. 
    // We use index 3 (April) as a simple heuristic for the new year having started
    const isNewYearStarted = gregorianMonthIndex >= 3;
    return {
        vikramSamvat: isNewYearStarted ? gregorianYear + 57 : gregorianYear + 56,
        shakaSamvat: isNewYearStarted ? gregorianYear - 78 : gregorianYear - 79
    };
};

const getHinduMonthFromNakshatra = (nakshatraName) => {
    if (!nakshatraName) return "Unknown";
    const name = nakshatraName.toLowerCase();

    if (name.includes("chitra") || name.includes("swati")) return "Chaitra";
    if (name.includes("vishakha") || name.includes("anuradha")) return "Vaishakha";
    if (name.includes("jyeshtha") || name.includes("mula")) return "Jyeshtha";
    if (name.includes("ashadha")) return "Ashadha"; // Purva/Uttara Ashadha
    if (name.includes("shravana") || name.includes("dhanishta") || name.includes("shatabhisha")) return "Shravana";
    if (name.includes("bhadrapada")) return "Bhadrapada"; // Purva/Uttara Bhadrapada
    if (name.includes("revati") || name.includes("ashwini") || name.includes("bharani")) return "Ashvina";
    if (name.includes("krittika") || name.includes("rohini")) return "Kartika";
    if (name.includes("mrigashira") || name.includes("ardra")) return "Margashirsha";
    if (name.includes("punarvasu") || name.includes("pushya")) return "Pausha";
    if (name.includes("ashlesha") || name.includes("magha")) return "Magha";
    if (name.includes("phalguni") || name.includes("hasta")) return "Phalguna"; // Purva/Uttara Phalguni

    return "Unknown";
};
const FESTIVALS = [
    {
        name: "Bhogi / Lohri",
        hindiName: "भोगी / लोहड़ी",
        description: "One day before Makar Sankranti, transition of the Sun",
        match: (day, month, year, dayData, hinduMonth) => month === 0 && day === 13,
        month: 0 // January
    },
    {
        name: "Makar Sankranti / Pongal",
        hindiName: "मकर संक्रांति / पोंगल",
        description: "Sun enters Capricorn, Uttarayana starts",
        match: (day, month, year, dayData, hinduMonth) => month === 0 && (day === 14 || day === 15),
        month: 0 // January
    },
    {
        name: "Vasant Panchami",
        hindiName: "वसंत पंचमी",
        description: "Fifth day of the waxing moon of Magha, Saraswati Puja",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 0 || month === 1) && dayData?.tithi?.tithi_index === 4 && (hinduMonth === "Magha" || hinduMonth.includes("Magha") || hinduMonth.includes("Magha/Phalguna") || hinduMonth.includes("Pausha/Magha"));
        },
        month: 1 // February
    },
    {
        name: "Thaipusam / Kavadi",
        hindiName: "थाईपुसम / कावड़ी",
        description: "Full moon day of Thai (Jan/Feb) in Pushya Nakshatra",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 0 || month === 1) && dayData?.tithi?.tithi_index === 14 && dayData?.nakshatra?.nakshatra_name.toLowerCase().includes("pushya");
        },
        month: 0 // January
    },
    {
        name: "Maha Shivratri",
        hindiName: "महाशिवरात्रि",
        description: "Great Night of Shiva, Krishna Chaturdashi of Phalguna",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 1 || month === 2) && dayData?.tithi?.tithi_index === 28;
        },
        month: 1 // February
    },
    {
        name: "Holi",
        hindiName: "होली",
        description: "Festival of Colors, Purnima of Phalguna",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Phalguna" || hinduMonth.includes("Phalguna"));
        },
        month: 2 // March
    },
    {
        name: "Shigmo",
        hindiName: "शिगमो",
        description: "Goan spring festival coinciding with Holi Purnima",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Phalguna" || hinduMonth.includes("Phalguna"));
        },
        month: 2 // March
    },
    {
        name: "Rang Panchami",
        hindiName: "रंगपंचमी",
        description: "Festival of colours celebrated five days after Holi",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 19 && (hinduMonth === "Phalguna" || hinduMonth.includes("Phalguna"));
        },
        month: 2 // March
    },
    {
        name: "Gangaur",
        hindiName: "गणगौर",
        description: "Worship of Gauri starting in Chaitra, celebrated by women",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 2 && (hinduMonth === "Chaitra" || hinduMonth.includes("Chaitra"));
        },
        month: 2 // March
    },
    {
        name: "Chaitra Navratri",
        hindiName: "चैत्र नवरात्रि",
        description: "Nine nights of goddess worship starting in Chaitra",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 0 && (hinduMonth === "Chaitra" || hinduMonth.includes("Chaitra"));
        },
        month: 2 // March
    },
    {
        name: "Rama Navami",
        hindiName: "राम नवमी",
        description: "Celebration of the birth of Lord Rama, 9th of Chaitra",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 8 && (hinduMonth === "Chaitra" || hinduMonth.includes("Chaitra"));
        },
        month: 3 // April
    },
    {
        name: "Gudi Padwa / Ugadi",
        hindiName: "गुड़ी पड़वा / उगादी",
        description: "First day of Chaitra, Hindu Lunar New Year",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 2 || month === 3) && dayData?.tithi?.tithi_index === 0 && (hinduMonth === "Chaitra" || hinduMonth.includes("Chaitra"));
        },
        month: 2 // March
    },
    {
        name: "Mesha Sankranti / Baisakhi",
        hindiName: "मेष संक्रांति / बैसाखी",
        description: "Solar New Year, Sun enters Aries",
        match: (day, month, year, dayData, hinduMonth) => month === 3 && (day === 13 || day === 14),
        month: 3 // April
    },
    {
        name: "Vishu / Puthandu",
        hindiName: "विशु / पुथंडु",
        description: "Kerala and Tamil New Year celebrations",
        match: (day, month, year, dayData, hinduMonth) => month === 3 && day === 14,
        month: 3 // April
    },
    {
        name: "Rongali Bihu",
        hindiName: "रोंगाली बिहू",
        description: "Assamese Spring and New Year festival",
        match: (day, month, year, dayData, hinduMonth) => month === 3 && day === 14,
        month: 3 // April
    },
    {
        name: "Hanuman Jayanti",
        hindiName: "हनुमान जयंती",
        description: "Lord Hanuman Birth Anniversary, Purnima of Chaitra",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 3 || month === 4) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Chaitra" || hinduMonth.includes("Chaitra"));
        },
        month: 3 // April
    },
    {
        name: "Sitalsasthi",
        hindiName: "शीतल षष्ठी",
        description: "Ceremonial marriage of Shiva and Parvati in Odisha",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 4 || month === 5) && dayData?.tithi?.tithi_index === 5 && (hinduMonth === "Jyeshtha" || hinduMonth.includes("Jyeshtha"));
        },
        month: 5 // June
    },
    {
        name: "Vat Savitri",
        hindiName: "वट सावित्री",
        description: "Full moon of Jyeshtha, women pray for husband's welfare",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 5 || month === 6) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Jyeshtha" || hinduMonth.includes("Jyeshtha"));
        },
        month: 5 // June
    },
    {
        name: "Bonalu",
        hindiName: "बोनालु",
        description: "Goddess Mahakali festival celebrated on Sundays of Ashadha",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 6 || month === 7) && dayData?.day === "Sunday" && (hinduMonth === "Ashadha" || hinduMonth.includes("Ashadha"));
        },
        month: 6 // July
    },
    {
        name: "Bathukamma",
        hindiName: "बथुकम्मा",
        description: "Flower festival of Telangana starting on Mahalaya Amavasya",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 8 || month === 9) && dayData?.tithi?.tithi_index === 29 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 8 // September
    },
    {
        name: "Rath Yatra",
        hindiName: "रथ यात्रा",
        description: "Jagannath Chariot Procession, Shukla Dwitiya of Ashadha",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 5 || month === 6) && dayData?.tithi?.tithi_index === 1 && (hinduMonth === "Ashadha" || hinduMonth.includes("Ashadha"));
        },
        month: 6 // July
    },
    {
        name: "Raja Parba",
        hindiName: "राजा पर्बा",
        description: "Welcomes the agricultural year in Odisha, Mithuna Sankranti",
        match: (day, month, year, dayData, hinduMonth) => month === 5 && (day === 14 || day === 15),
        month: 5 // June
    },
    {
        name: "Guru Purnima",
        hindiName: "गुरु पूर्णिमा",
        description: "Full moon of Ashadha, offering puja to Gurus",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 6 || month === 7) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Ashadha" || hinduMonth.includes("Ashadha"));
        },
        month: 6 // July
    },
    {
        name: "Varalakshmi Vratham",
        hindiName: "वरलक्ष्मी व्रत",
        description: "Friday before Shravana Purnima, seeks wealth & prosperity",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 6 || month === 7) && dayData?.day === "Friday" && (hinduMonth === "Shravana" || hinduMonth.includes("Shravana")) && dayData?.tithi?.tithi_index < 14 && (14 - dayData?.tithi?.tithi_index <= 7);
        },
        month: 7 // August
    },
    {
        name: "Onam",
        hindiName: "ओणम",
        description: "Harvest festival of Kerala on Shravana Nakshatra",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.nakshatra?.nakshatra_name.toLowerCase().includes("shravana");
        },
        month: 7 // August
    },
    {
        name: "Raksha Bandhan",
        hindiName: "रक्षाबंधन",
        description: "Sibling Bond Festival, Full moon of Shravana",
        match: (day, month, year, dayData, hinduMonth) => {
            const naks = dayData?.nakshatra?.nakshatra_name.toLowerCase() || "";
            const isRakshaNaks = naks.includes("shravana") || naks.includes("sravana") || naks.includes("dhanishta") || naks.includes("shatabhisha") || naks.includes("uttara ashadha") || naks.includes("ashadha");
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 14 && isRakshaNaks && (hinduMonth.includes("Shravana") || hinduMonth.includes("Bhadrapada") || hinduMonth.includes("Ashadha"));
        },
        month: 7 // August
    },
    {
        name: "Kajri Teej",
        hindiName: "कजरी तीज",
        description: "Third day after Raksha Bandhan, fasting for husband",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 17 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 7 // August
    },
    {
        name: "Shitla Satam",
        hindiName: "शीतला सातम",
        description: "Seventh day after Raksha Bandhan, fasting and cool food",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 21 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 7 // August
    },
    {
        name: "Krishna Janmashtami",
        hindiName: "कृष्ण जन्माष्टमी",
        description: "Lord Krishna Birth Anniversary, Krishna Ashtami of Bhadrapada",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 22 && (hinduMonth === "Bhadrapada" || hinduMonth === "Shravana" || hinduMonth.includes("Bhadrapada") || hinduMonth.includes("Shravana"));
        },
        month: 7 // August
    },
    {
        name: "Radhashtami",
        hindiName: "राधाष्टमी",
        description: "Birth anniversary of Goddess Radha, Shukla Ashtami of Bhadrapada",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 7 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 7 // August
    },
    {
        name: "Hartalika Teej",
        hindiName: "हरितालिका तीज",
        description: "Worship of Goddess Gowri, Shukla Tritiya of Bhadrapada",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 2 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 7 // August
    },
    {
        name: "Ganesh Chaturthi",
        hindiName: "गणेश चतुर्थी",
        description: "Lord Ganesha Festival, Shukla Chaturthi of Bhadrapada",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 3 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 8 // September
    },
    {
        name: "Nuakhai",
        hindiName: "नुआखाई",
        description: "Welcome new rice harvest of the season, Shukla Panchami of Bhadrapada",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 4 && (hinduMonth === "Bhadrapada" || hinduMonth.includes("Bhadrapada"));
        },
        month: 7 // August
    },
    {
        name: "Naga Panchami",
        hindiName: "नाग पंचमी",
        description: "Traditional snake worship, Shukla Panchami of Shravana",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 6 || month === 7) && dayData?.tithi?.tithi_index === 4 && (hinduMonth === "Shravana" || hinduMonth.includes("Shravana"));
        },
        month: 7 // August
    },
    {
        name: "Shardiya Navratri",
        hindiName: "शारदीय नवरात्रि",
        description: "Nine nights of the divine feminine starting in Ashvin",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 8 || month === 9) && dayData?.tithi?.tithi_index === 0 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina"));
        },
        month: 9 // October
    },
    {
        name: "Durga Puja",
        hindiName: "दुर्गा पूजा",
        description: "Triumph of Goddess Durga, starts on Shukla Sashti of Ashvin",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 8 || month === 9) && dayData?.tithi?.tithi_index === 5 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina"));
        },
        month: 9 // October
    },
    {
        name: "Dussehra",
        hindiName: "दशहरा / विजयादशमी",
        description: "Vijayadashami, Shukla Dashami of Ashvin",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 9 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina"));
        },
        month: 9 // October
    },
    {
        name: "Govatsa Dwadashi",
        hindiName: "गोवत्स द्वादशी",
        description: "Worship of cows and calves, Krishna Dwadashi of Ashvin/Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 26 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina") || hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 9 // October
    },
    {
        name: "Dhanteras",
        hindiName: "धनतेरस",
        description: "Worship of Lord Dhanvantari, starting of Diwali, Krishna Trayodashi of Ashvin/Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 27 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina") || hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 9 // October
    },
    {
        name: "Naraka Chaturdashi (Choti Diwali)",
        hindiName: "नरक चतुर्दशी (छोटी दिवाली)",
        description: "Second day of Diwali, Krishna Chaturdashi of Ashvin/Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 28 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina") || hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 9 // October
    },
    {
        name: "Diwali",
        hindiName: "दिवाली / दीपावली",
        description: "Festival of Lights, Amavasya of Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 29 && (hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 9 // October
    },
    {
        name: "Bhai Dooj",
        hindiName: "भाई दूज",
        description: "Sibling festival performed on Shukla Dwitiya of Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 1 && (hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 10 // November
    },
    {
        name: "Karva Chauth",
        hindiName: "करवा चौथ",
        description: "Fasting for husband's longevity, 4 days after Ashvin Purnima",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 18 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina") || hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 9 // October
    },
    {
        name: "Kartika Purnima / Dev Deepavali",
        hindiName: "कार्तिक पूर्णिमा / देव दीपावली",
        description: "Varanasi festival of lights, Full Moon of Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 10 || month === 11) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 10 // November
    },
    {
        name: "Chhath Puja",
        hindiName: "छठ पूजा",
        description: "Sun worship festival, Shukla Sashti of Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 5 && (hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 10 // November
    },
    {
        name: "Skanda Sashti",
        hindiName: "स्कंद षष्ठी",
        description: "Dedicated to Lord Murugan, Shukla Sashti of Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 5 && (hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
        },
        month: 10 // November
    },
    {
        name: "Champa Sashti",
        hindiName: "चंपा षष्ठी",
        description: "Dedicated to Lord Khandoba, Shukla Sashti of Margashirsha",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 10 || month === 11) && dayData?.tithi?.tithi_index === 5 && (hinduMonth === "Margashirsha" || hinduMonth.includes("Margashirsha"));
        },
        month: 11 // December
    },
    {
        name: "Prathamastami",
        hindiName: "प्रथमाष्टमी",
        description: "Odia festival for eldest child prosperity, 8 days after Kartik Purnima",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 10 || month === 11) && dayData?.tithi?.tithi_index === 22 && (hinduMonth === "Margashirsha" || hinduMonth.includes("Margashirsha"));
        },
        month: 11 // December
    },
    {
        name: "Karthikai Deepam",
        hindiName: "कार्तिकेय दीपम",
        description: "Ancient Tamil and Telugu lights festival on Karthigai Purnima",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 10 || month === 11) && dayData?.tithi?.tithi_index === 14;
        },
        month: 10 // November
    },
    {
        name: "Vaikasi Visakam",
        hindiName: "वैकासी विशाखम",
        description: "Birth star of Lord Kartikeya, Visakha Nakshatra of Vaisakha",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 4 || month === 5) && dayData?.nakshatra?.nakshatra_name.toLowerCase().includes("vishakha");
        },
        month: 4 // May
    },
    {
        name: "Tulsi Pujan Diwas",
        hindiName: "तुलसी पूजन दिवस",
        description: "Spiritual and prosperity festival dedicated to Holy Basil, 25 Dec",
        match: (day, month, year, dayData, hinduMonth) => month === 11 && day === 25,
        month: 11 // December
    }
];

export default function MonthlyPanchangViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [nextAdhik, setNextAdhik] = useState(null);
    const [selectedFestival, setSelectedFestival] = useState("");
    const [selectedDayTransit, setSelectedDayTransit] = useState(null);
    const [transitLoading, setTransitLoading] = useState(false);
    const [transitError, setTransitError] = useState(null);

    useEffect(() => {
        const loadPanchang = async () => {
            try {
                setLoading(true);
                let lat = 19.0760, lon = 72.8777, tz = 5.5;
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    if (parsed.basic_details) {
                        lat = parsed.basic_details.lat || lat;
                        lon = parsed.basic_details.lon || lon;
                        tz = (new Date().getTimezoneOffset() / -60.0);
                    }
                }
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; // 1-12
                const res = await fetchMonthlyPanchang(lat, lon, tz, year, month);
                setData(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const loadNextAdhikMaas = async () => {
            try {
                const res = await fetchNextAdhikMaas();
                if (res.found) {
                    setNextAdhik(res);
                }
            } catch (err) {
                console.error("Failed to fetch next Adhik Maas:", err);
            }
        };

        loadPanchang();
        if (!nextAdhik) {
            loadNextAdhikMaas();
        }
    }, [currentDate]);

    const monthInfo = React.useMemo(() => {
        if (!data || !data.data) return null;
        // tithi_index 29 is Amavasya, 14 is Purnima
        const amavasyaDay = data.data.find(d => d.tithi.tithi_index === 29);
        const purnimaDay = data.data.find(d => d.tithi.tithi_index === 14);
        const { vikramSamvat, shakaSamvat } = calculateHinduYears(currentDate.getFullYear(), currentDate.getMonth());

        let hinduMonth = "N/A";
        if (purnimaDay) {
            hinduMonth = getHinduMonthFromNakshatra(purnimaDay.nakshatra.nakshatra_name);
            if (purnimaDay.is_adhik_maas) {
                hinduMonth += " (Adhik)";
            }
        } else {
            const gregorianMonth = currentDate.getMonth();
            const fallbackMonths = [
                "Pausha/Magha", "Magha/Phalguna", "Phalguna/Chaitra", "Chaitra/Vaishakha",
                "Vaishakha/Jyeshtha", "Jyeshtha/Ashadha", "Ashadha/Shravana", "Shravana/Bhadrapada",
                "Bhadrapada/Ashvina", "Ashvina/Kartika", "Kartika/Margashirsha", "Margashirsha/Pausha"
            ];
            hinduMonth = fallbackMonths[gregorianMonth] + " (Approx)";
            // Approximate check using the first day if Purnima is missing
            if (data.data[0] && data.data[0].is_adhik_maas) {
                hinduMonth += " (Adhik)";
            }
        }

        return {
            vikramSamvat,
            shakaSamvat,
            hinduMonth,
            amavasyaDate: amavasyaDay ? `${amavasyaDay.day_number} ${MONTHS[currentDate.getMonth()]}` : 'N/A',
            purnimaDate: purnimaDay ? `${purnimaDay.day_number} ${MONTHS[currentDate.getMonth()]}` : 'N/A',
            boundaries: data.boundaries
        };
    }, [data, currentDate]);

    useEffect(() => {
        if (selectedFestival && data && data.data) {
            const baseMonth = monthInfo?.hinduMonth ? monthInfo.hinduMonth.replace(" (Adhik)", "").replace(" (Approx)", "") : "Unknown";
            const found = data.data.some(d => {
                const fest = FESTIVALS.find(f => f.name === selectedFestival);
                return fest && fest.match(d.day_number, currentDate.getMonth(), currentDate.getFullYear(), d, baseMonth);
            });
            if (!found) {
                const fest = FESTIVALS.find(f => f.name === selectedFestival);
                if (fest && currentDate.getMonth() === fest.month) {
                    // Try next month (for deviation e.g. Diwali in Nov instead of Oct)
                    const nextMonthDate = new Date(currentDate.getFullYear(), fest.month + 1, 1);
                    setCurrentDate(nextMonthDate);
                }
            }
        }
    }, [data, selectedFestival, monthInfo]);

    const ekadashisList = React.useMemo(() => {
        if (!data || !data.data) return [];
        const baseMonth = monthInfo?.hinduMonth ? monthInfo.hinduMonth.replace(" (Adhik)", "").replace(" (Approx)", "") : "Unknown";
        const isAdhik = monthInfo?.hinduMonth ? monthInfo.hinduMonth.includes("(Adhik)") : false;

        const list = [];
        data.data.forEach(d => {
            if (d.ekadashi_vrat_type) {
                let eName = isAdhik ? EKADASHI_NAMES["Adhik"]?.[d.ekadashi_vrat_type] : EKADASHI_NAMES[baseMonth]?.[d.ekadashi_vrat_type];
                eName = eName ? `${eName} Ekadashi` : "Ekadashi";

                const dateParts = d.date.split('-');
                const formattedDate = `${parseInt(dateParts[2])} ${MONTHS[parseInt(dateParts[1]) - 1]} ${dateParts[0]} (${d.day})`;

                list.push({
                    dateString: formattedDate,
                    name: eName,
                    timing: `${d.ekadashi_start} – ${d.ekadashi_end}`
                });
            }
        });
        return list;
    }, [data, monthInfo]);

    const handleDayClick = async (dayNumber) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        const dayData = data?.data?.find(d => d.day_number === dayNumber);
        setSelectedDayTransit({ dayNumber, dateStr, planets: null, dayData });
        setTransitLoading(true);
        setTransitError(null);

        try {
            let bDate = "1990-01-01";
            let bTime = "12:00:00";
            let lat = 19.0760;
            let lon = 72.8777;
            let tz = 5.5;

            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const basic = parsed.basic_details || parsed.basic || {};
                bDate = basic.date || basic.birth_date || bDate;
                bTime = basic.time || basic.birth_time || bTime;
                lat = basic.lat || lat;
                lon = basic.lon || lon;
                tz = basic.tz_offset !== undefined ? basic.tz_offset : tz;
            }

            if (bTime && bTime.split(':').length === 2) {
                bTime = `${bTime}:00`;
            }

            const payload = {
                birth_date: bDate,
                birth_time: bTime,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                tz_offset: parseFloat(tz),
                transit_date: dateStr,
                transit_time: "12:00:00",
                transit_tz_offset: parseFloat(tz)
            };

            const res = await fetchAnimatedTransits(payload);

            let lagnaName = "Aries";
            if (savedData) {
                const parsed = JSON.parse(savedData);
                lagnaName = parsed.chart?.ascendant_sign || parsed.basic?.ascendant || parsed.ascendant || "Aries";
            }

            const zodiacOrder = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            const lagnaIndex = zodiacOrder.findIndex(z => z.toLowerCase().startsWith(lagnaName.toLowerCase().slice(0, 3))) !== -1
                ? zodiacOrder.findIndex(z => z.toLowerCase().startsWith(lagnaName.toLowerCase().slice(0, 3)))
                : 0;

            const sunData = res.transit_chart?.find(p => p.planet === "Su");
            const sunLon = sunData ? sunData.absolute_degree : 0;

            const planetFullNames = {
                "Su": "Sun", "Mo": "Moon", "Ma": "Mars", "Me": "Mercury",
                "Ju": "Jupiter", "Ve": "Venus", "Sa": "Saturn", "Ra": "Rahu", "Ke": "Ketu", "Asc": "Ascendant"
            };

            const mappedPlanets = (res.transit_chart || []).map(p => {
                const planetName = planetFullNames[p.planet] || p.planet;

                const planetSignIndex = zodiacOrder.findIndex(z => z.toLowerCase().startsWith(p.rashi.toLowerCase().slice(0, 3)));
                const transitHouse = planetSignIndex !== -1
                    ? ((planetSignIndex - lagnaIndex + 12) % 12) + 1
                    : "N/A";

                const isRahuKetu = p.planet === "Ra" || p.planet === "Ke";
                const motion = isRahuKetu ? "Vakri" : (p.rc === "R" ? "Vakri" : "Margi");

                let combustionState = "Uday";
                if (p.planet !== "Su" && p.planet !== "Asc" && !isRahuKetu) {
                    const limits = { "Mo": 12, "Ma": 17, "Me": 14, "Ju": 11, "Ve": 10, "Sa": 15 };
                    const limit = limits[p.planet] || 15;
                    let diff = Math.abs(p.absolute_degree - sunLon) % 360;
                    if (diff > 180) diff = 360 - diff;
                    if (diff <= limit) {
                        combustionState = "Asth";
                    }
                } else if (p.planet === "Su") {
                    combustionState = "Self";
                } else if (isRahuKetu) {
                    combustionState = "N/A";
                }

                return {
                    code: p.planet,
                    name: planetName,
                    house: transitHouse,
                    zodiac: p.rashi,
                    nakshatra: p.nakshatra,
                    pada: p.pada,
                    degree: parseFloat(p.degree).toFixed(2),
                    motion,
                    combustion: combustionState
                };
            });

            setSelectedDayTransit(prev => ({ ...prev, planets: mappedPlanets }));
        } catch (err) {
            setTransitError(err.message);
        } finally {
            setTransitLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderGrid = () => {
        if (!data || !data.data) return null;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const gridCells = [];

        const baseMonth = monthInfo?.hinduMonth ? monthInfo.hinduMonth.replace(" (Adhik)", "").replace(" (Approx)", "") : "Unknown";
        const isAdhik = monthInfo?.hinduMonth ? monthInfo.hinduMonth.includes("(Adhik)") : false;

        // Empty cells for offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            gridCells.push(<div key={`empty-${i}`} style={{ background: 'hsla(0, 31%, 94%, 1.00)', border: '1px solid rgba(255,255,255,0.05)' }}></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = data.data.find(d => d.day_number === day);
            const isToday = (year === new Date().getFullYear() && month === new Date().getMonth() && day === new Date().getDate());
            const isAmavasya = dayData && dayData.tithi.tithi_index === 29;
            const isPurnima = dayData && dayData.tithi.tithi_index === 14;
            const isShuklaEkadashi = dayData && dayData.ekadashi_vrat_type === "Shukla";
            const isKrishnaEkadashi = dayData && dayData.ekadashi_vrat_type === "Krishna";

            let ekadashiName = null;
            if (isShuklaEkadashi) {
                ekadashiName = isAdhik ? EKADASHI_NAMES["Adhik"]?.Shukla : EKADASHI_NAMES[baseMonth]?.Shukla;
                if (ekadashiName) ekadashiName += " Ekadashi";
            } else if (isKrishnaEkadashi) {
                ekadashiName = isAdhik ? EKADASHI_NAMES["Adhik"]?.Krishna : EKADASHI_NAMES[baseMonth]?.Krishna;
                if (ekadashiName) ekadashiName += " Ekadashi";
            }

            let nakshatraFestival = null;
            if (dayData && dayData.nakshatra) {
                const naksName = dayData.nakshatra.nakshatra_name.toLowerCase();
                if (naksName.includes("ardra") || naksName.includes("thiruvathirai")) {
                    nakshatraFestival = "Arudra Darisanam";
                } else if (naksName.includes("rohini")) {
                    nakshatraFestival = "Rohini Vrat";
                } else if (naksName.includes("punarvasu")) {
                    nakshatraFestival = "Punarvasu (Rama Birth Star)";
                } else if (naksName.includes("pushya") || naksName.includes("pushyami")) {
                    nakshatraFestival = "Pushya (Auspicious)";
                } else if (naksName.includes("shravana")) {
                    nakshatraFestival = "Shravana (Onam/Vamana)";
                }
            }

            let majorFestival = null;
            let majorFestivalHindi = null;
            if (dayData) {
                const matchedFest = FESTIVALS.find(f => f.match(day, month, year, dayData, baseMonth));
                if (matchedFest) {
                    majorFestival = matchedFest.name;
                    majorFestivalHindi = matchedFest.hindiName;
                }
            }

            let navratriDayInfo = null;
            let navratriDayInfoHindi = null;
            if (dayData && dayData.tithi) {
                const tIndex = dayData.tithi.tithi_index;
                if (tIndex >= 0 && tIndex <= 8) {
                    const isChaitra = baseMonth === "Chaitra" || baseMonth.includes("Chaitra");
                    const isAshvin = baseMonth === "Ashvina" || baseMonth === "Ashvin" || baseMonth.includes("Ashvina") || baseMonth.includes("Ashvin");
                    if (isChaitra) {
                        if (tIndex === 0) {
                            navratriDayInfo = "Chaitra Navratri Starts (Day 1)";
                            navratriDayInfoHindi = "चैत्र नवरात्रि प्रारंभ (दिवस 1)";
                        } else if (tIndex === 7) {
                            navratriDayInfo = "Chaitra Navratri (Day 8 - Maha Ashtami)";
                            navratriDayInfoHindi = "चैत्र नवरात्रि (दिवस 8 - महा अष्टमी)";
                        } else if (tIndex === 8) {
                            navratriDayInfo = "Chaitra Navratri (Day 9 - Maha Navami)";
                            navratriDayInfoHindi = "चैत्र नवरात्रि (दिवस 9 - महा नवमी)";
                        } else {
                            navratriDayInfo = `Chaitra Navratri (Day ${tIndex + 1})`;
                            navratriDayInfoHindi = `चैत्र नवरात्रि (दिवस ${tIndex + 1})`;
                        }
                    } else if (isAshvin) {
                        if (tIndex === 0) {
                            navratriDayInfo = "Shardiya Navratri Starts (Day 1)";
                            navratriDayInfoHindi = "शारदीय नवरात्रि प्रारंभ (दिवस 1)";
                        } else if (tIndex === 7) {
                            navratriDayInfo = "Shardiya Navratri (Day 8 - Maha Ashtami)";
                            navratriDayInfoHindi = "शारदीय नवरात्रि (दिवस 8 - महा अष्टमी)";
                        } else if (tIndex === 8) {
                            navratriDayInfo = "Shardiya Navratri (Day 9 - Maha Navami)";
                            navratriDayInfoHindi = "शारदीय नवरात्रि (दिवस 9 - महा नवमी)";
                        } else {
                            navratriDayInfo = `Shardiya Navratri (Day ${tIndex + 1})`;
                            navratriDayInfoHindi = `शारदीय नवरात्रि (दिवस ${tIndex + 1})`;
                        }
                    }
                }
            }

            const isSelectedFestival = (majorFestival && majorFestival === selectedFestival) ||
                (selectedFestival === "Chaitra Navratri" && navratriDayInfo && navratriDayInfo.includes("Chaitra Navratri")) ||
                (selectedFestival === "Shardiya Navratri" && navratriDayInfo && navratriDayInfo.includes("Shardiya Navratri"));

            gridCells.push(
                <div key={day} onClick={() => handleDayClick(day)} style={{
                    border: isSelectedFestival ? '3px solid #fbbf24' : isToday ? '3px solid #22c55e' : '1px solid #fcf1faff',
                    background: isSelectedFestival ? '#fffbeb' : isToday ? 'hsla(142, 18%, 88%, 1.00)' : 'hsla(311, 52%, 94%, 1.00)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minHeight: '180px',
                    boxShadow: isSelectedFestival ? '0 0 15px rgba(251,191,36,0.3) inset' : isToday ? '0 0 15px rgba(34,197,94,0.3) inset' : 'inset 0 0 10px hsla(0, 29%, 93%, 0.99)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ color: '#740518ff', fontSize: '13px', display: 'flex', gap: '5px' }}>
                            <span>☀️ {dayData?.sun_rise}</span>
                            <span>🌙 {dayData?.sun_set}</span>
                        </div>
                        <div style={{ color: 'rgba(22, 20, 20, 1)', fontSize: '24px', fontWeight: 900, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isAmavasya && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} title="Amavasya (New Moon)">🌑</span>}
                            {isPurnima && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} title="Purnima (Full Moon)">🌕</span>}
                            {day}
                        </div>
                    </div>
                    {dayData ? (
                        <div style={{ fontSize: '13px', color: 'hsla(0, 16%, 8%, 0.70)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {navratriDayInfo && (
                                <div style={{ background: 'rgba(219,39,119,0.15)', color: '#9d174d', fontWeight: 'bold', padding: '5px 10px', borderRadius: '6px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(219,39,119,0.3)', boxShadow: '0 2px 4px rgba(219,39,119,0.05)', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span>🌸 {navratriDayInfo}</span>
                                    {navratriDayInfoHindi && <span style={{ fontSize: '11px', opacity: 0.85 }}>{navratriDayInfoHindi}</span>}
                                </div>
                            )}
                            {majorFestival && !navratriDayInfo && (
                                <div style={{ background: 'rgba(220,38,38,0.15)', color: '#991b1b', fontWeight: 'bold', padding: '5px 10px', borderRadius: '6px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(220,38,38,0.3)', boxShadow: '0 2px 4px rgba(220,38,38,0.05)', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span>🪔 {majorFestival}</span>
                                    {majorFestivalHindi && <span style={{ fontSize: '11px', opacity: 0.85 }}>{majorFestivalHindi}</span>}
                                </div>
                            )}
                            {ekadashiName && (
                                <div style={{ background: 'rgba(212,175,55,0.2)', color: '#92400e', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(212,175,55,0.5)' }}>
                                    🌾 {ekadashiName}
                                </div>
                            )}
                            {nakshatraFestival && (
                                <div style={{ background: 'rgba(147,51,234,0.1)', color: '#6b21a8', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(147,51,234,0.3)' }}>
                                    ✨ {nakshatraFestival}
                                </div>
                            )}
                            <div style={{ color: 'black' }}><strong>Tithi:</strong> {dayData.tithi.tithi_name} <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold' }}>(Udaya Tithi)</span></div>
                            <div>
                                <strong style={{ color: 'black' }}>Nakshatra:</strong> <span style={{ color: '#e46c0bff', fontWeight: 'bold' }}>{dayData.nakshatra.nakshatra_name}</span>
                                {dayData.nakshatra_start && dayData.nakshatra_end && (
                                    <div style={{ fontSize: '12px', color: 'hsla(0, 30%, 5%, 1.00)', marginTop: '2px', lineHeight: '1.3', padding: '2px 4px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
                                        ⏱️ {dayData.nakshatra_start} to {dayData.nakshatra_end}
                                    </div>
                                )}
                            </div>
                            <div><strong>Yoga:</strong> {dayData.yoga.yoga_name}</div>
                            <div><strong>Karana:</strong> {dayData.karana.karana_name}</div>
                            <div style={{ color: '#ef4444', marginTop: '4px' }}><strong>Rahu Kaal:</strong><br />{dayData.muhurtas.rahu_kaal.start} - {dayData.muhurtas.rahu_kaal.end}</div>
                            <div style={{ color: '#22c55e', marginTop: '2px' }}><strong>Abhijit Muhurta:</strong><br />{dayData.muhurtas.abhijit.start} - {dayData.muhurtas.abhijit.end}</div>
                        </div>
                    ) : (
                        <div style={{ color: 'hsla(0, 55%, 4%, 0.30)', fontSize: '13px' }}>Loading...</div>
                    )}
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} style={{ background: 'hsla(29, 83%, 55%, 1.00)', color: 'rgba(22, 19, 10, 1)', textAlign: 'center', padding: '10px 0', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {day}
                    </div>
                ))}
                {gridCells}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 40px', background: 'linear-gradient(to right, #020617, rgba(212,175,55,0.1), #020617)', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#d4af37', fontSize: '24px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Monthly Panchang Calendar</h1>
                    {nextAdhik && (
                        <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 900, marginTop: '8px', letterSpacing: '1px' }}>
                            UPCOMING ADHIK MAAS: {getHinduMonthFromNakshatra(nextAdhik.nakshatra_name)} ({nextAdhik.date})
                        </div>
                    )}
                </div>
                <button onClick={() => window.close()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Close Window</button>
            </div>

            {/* Navigation */}
            <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
                <button onClick={handlePrevMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>&laquo;</button>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', minWidth: '350px' }}>
                    <select
                        value={currentDate.getMonth()}
                        onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                        style={{ background: 'rgba(212,175,55,0.05)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '10px 20px', fontSize: '28px', fontWeight: 900, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
                    >
                        {MONTHS.map((m, idx) => <option key={m} value={idx} style={{ background: '#020617', color: '#d4af37', fontSize: '18px' }}>{m}</option>)}
                    </select>

                    <select
                        value={currentDate.getFullYear()}
                        onChange={(e) => {
                            setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
                            setSelectedFestival("");
                        }}
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', fontSize: '28px', fontWeight: 300, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
                    >
                        {Array.from({ length: 201 }, (_, i) => 1900 + i).map(y => <option key={y} value={y} style={{ background: '#020617', color: 'white', fontSize: '18px' }}>{y}</option>)}
                    </select>

                    <select
                        value={selectedFestival}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedFestival(val);
                            if (val) {
                                const fest = FESTIVALS.find(f => f.name === val);
                                if (fest) {
                                    setCurrentDate(new Date(currentDate.getFullYear(), fest.month, 1));
                                }
                            }
                        }}
                        style={{ background: 'rgba(212,175,55,0.05)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '10px 20px', fontSize: '22px', fontWeight: 900, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="" style={{ background: '#020617', color: '#d4af37' }}>-- Festivals (त्यौहार) --</option>
                        {FESTIVALS.map(f => (
                            <option key={f.name} value={f.name} style={{ background: '#020617', color: 'white', fontSize: '16px' }}>{f.name} {f.hindiName ? `(${f.hindiName})` : ''}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleNextMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>&raquo;</button>
            </div>

            {/* Info Bar */}
            {monthInfo && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 40px 20px 40px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Hindu Month</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.hinduMonth}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Vikram Samvat</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.vikramSamvat}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Shaka Samvat</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.shakaSamvat}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Amavasya</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.amavasyaDate}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Purnima</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.purnimaDate}</span>
                    </div>
                </div>
            )}

            {/* Month boundaries start / end dates */}
            {monthInfo && monthInfo.boundaries && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '0 40px 30px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px 30px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', textAlign: 'left' }}>
                        {monthInfo.boundaries.purnimanta && (
                            <div style={{ borderRight: '1px solid rgba(212,175,55,0.1)', paddingRight: '20px' }}>
                                <h4 style={{ color: '#d4af37', margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    🌙 {monthInfo.hinduMonth} Month Duration (Purnimanta / North India)
                                </h4>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '4px 0' }}>
                                    <strong style={{ color: '#fbbf24' }}>Starts:</strong> {monthInfo.boundaries.purnimanta.start}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '4px 0' }}>
                                    <strong style={{ color: '#fca5a5' }}>Ends:</strong> {monthInfo.boundaries.purnimanta.end}
                                </p>
                            </div>
                        )}
                        {monthInfo.boundaries.amavasyanta && (
                            <div style={{ paddingLeft: '10px' }}>
                                <h4 style={{ color: '#d4af37', margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    🌑 {monthInfo.hinduMonth} Month Duration (Amavasyanta / South & West India)
                                </h4>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '4px 0' }}>
                                    <strong style={{ color: '#fbbf24' }}>Starts:</strong> {monthInfo.boundaries.amavasyanta.start}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '4px 0' }}>
                                    <strong style={{ color: '#fca5a5' }}>Ends:</strong> {monthInfo.boundaries.amavasyanta.end}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Ekadashi Summary */}
            {ekadashisList.length > 0 && (
                <div style={{ padding: '0 40px 20px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                    <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', padding: '20px' }}>
                        <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '16px' }}>🌾 Ekadashi Vrat Timings (Udaya Tithi Rules)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {ekadashisList.map((e, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '5px', color: '#fbbf24', fontSize: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{e.dateString}</div>
                                    <div style={{ fontWeight: 'bold', color: '#fcd34d' }}>{e.name}</div>
                                    <div style={{ opacity: 0.9 }}>{e.timing}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar */}
            <div style={{ flex: 1, padding: '0 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#d4af37', padding: '100px 0', fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
                        Calculating Panchang data...
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: '#ef4444', padding: '100px 0' }}>{error}</div>
                ) : (
                    renderGrid()
                )}
            </div>

            {selectedDayTransit && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(212,175,55,0.4)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.15)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh'
                    }}>
                        <div style={{
                            padding: '20px 30px',
                            borderBottom: '1px solid rgba(212,175,55,0.2)',
                            background: 'linear-gradient(to right, rgba(246, 249, 255, 1), hsla(40, 33%, 98%, 1.00))',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ color: '#d4af37', margin: 0, fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    📅 Transit Details for Day {selectedDayTransit.dayNumber}
                                </h2>
                                <p style={{ color: '#970707ff', margin: '4px 0 0 0', fontWeight: "bold", fontSize: '18px' }}>
                                    Target Date: {selectedDayTransit.dateStr}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDayTransit(null)}
                                style={{
                                    background: 'transparent',
                                    color: '#d4af37',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '22px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                            {transitLoading ? (
                                <div style={{ textAlign: 'center', color: '#d4af37', padding: '60px 0', fontSize: '16px' }}>
                                    <div style={{ width: '30px', height: '30px', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }}></div>
                                    Fetching Planetary Positions...
                                </div>
                            ) : transitError ? (
                                <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px 0' }}>
                                    Error loading transits: {transitError}
                                </div>
                            ) : selectedDayTransit.planets ? (
                                <div>
                                    {/* Active Yogas formed on this day */}
                                    {(() => {
                                        const yogas = detectTransitYogas(selectedDayTransit.planets);
                                        if (yogas.length === 0) return null;
                                        return (
                                            <div style={{ marginBottom: '30px', background: 'rgba(228, 225, 216, 1)', border: '1px solid rgba(212,175,55,0.2)', padding: '20px', borderRadius: '12px' }}>
                                                <h3 style={{ color: '#cc130dff', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>🪐</span> Transit Yogas Formed (गोचर योग)
                                                </h3>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                                    {yogas.map((y, yidx) => (
                                                        <div key={yidx} style={{ background: 'hsla(225, 33%, 95%, 1.00)', padding: '15px', borderRadius: '8px', border: `1px solid ${y.isBenefic ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: y.isBenefic ? 'rgba(6, 156, 101, 1)' : '#f87171'
                                                                }}></span>
                                                                <strong style={{ color: y.isBenefic ? 'rgba(4, 122, 79, 1)' : '#d30404ff', fontWeight: "bold", fontSize: '18px' }}>{y.name}</strong>
                                                            </div>
                                                            <p style={{ color: 'rgba(33, 8, 177, 1)', fontSize: '16px', margin: 0, lineHeight: '1.4' }}>{y.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Auspicious Muhuratas / शुभ मुहूर्त */}
                                    {(() => {
                                        const auspiciousList = checkAuspiciousCeremonies(selectedDayTransit.dayData, selectedDayTransit.dateStr);
                                        return (
                                            <div style={{ marginBottom: '30px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212,175,55,0.3)', padding: '20px', borderRadius: '12px' }}>
                                                <h3 style={{ color: '#d4af37', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>✨</span> Favorable Ceremonies / शुभ मुहूर्त
                                                </h3>
                                                {auspiciousList.length === 0 ? (
                                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>
                                                        No standard auspicious timings matching general rules for major ceremonies on this date.
                                                    </p>
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                        {auspiciousList.map((cName, idx) => (
                                                            <div key={idx} style={{ padding: '8px 16px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '30px', color: '#fcd34d', fontWeight: 'bold', fontSize: '15px' }}>
                                                                ✓ {cName}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    <div style={{ overflowX: 'auto' }}>
                                        {(() => {
                                            const PLANET_HI = {
                                                "Sun": "सूर्य (Sun)", "Moon": "चन्द्र (Moon)", "Mars": "मंगल (Mars)", "Mercury": "बुध (Mercury)",
                                                "Jupiter": "बृहस्पति (Jupiter)", "Venus": "शुक्र (Venus)", "Saturn": "शनि (Saturn)", "Rahu": "राहु (Rahu)",
                                                "Ketu": "केतु (Ketu)", "Ascendant": "लग्न (Ascendant)"
                                            };

                                            const ZODIAC_HI = {
                                                "Aries": "मेष (Aries)", "Taurus": "वृषभ (Taurus)", "Gemini": "मिथुन (Gemini)", "Cancer": "कर्क (Cancer)",
                                                "Leo": "सिंह (Leo)", "Virgo": "कन्या (Virgo)", "Libra": "तुला (Libra)", "Scorpio": "वृश्चिक (Scorpio)",
                                                "Sagittarius": "धनु (Sagittarius)", "Capricorn": "मकर (Capricorn)", "Aquarius": "कुंभ (Aquarius)", "Pisces": "मीन (Pisces)",
                                                "Ari": "मेष (Aries)", "Tau": "वृषभ (Taurus)", "Gem": "मिथुन (Gemini)", "Can": "कर्क (Cancer)",
                                                "Leo": "सिंह (Leo)", "Vir": "कन्या (Virgo)", "Lib": "तुला (Libra)", "Sco": "वृश्चिक (Scorpio)",
                                                "Sag": "धनु (Sagittarius)", "Cap": "मकर (Capricorn)", "Aqu": "कुंभ (Aquarius)", "Pis": "मीन (Pisces)"
                                            };

                                            const NAKSHATRA_HI = {
                                                "Ashwini": "अश्विनी (Ashwini)", "Bharani": "भरणी (Bharani)", "Krittika": "कृत्तिका (Krittika)",
                                                "Rohini": "रोहिणी (Rohini)", "Mrigashira": "मृगशिरा (Mrigashira)", "Ardra": "आर्द्रा (Ardra)",
                                                "Punarvasu": "पुनर्वसु (Punarvasu)", "Pushya": "पुष्य (Pushya)", "Ashlesha": "आश्लेषा (Ashlesha)",
                                                "Magha": "मघा (Magha)", "Purva Phalguni": "पूर्वा फाल्गुनी (Purva Phalguni)", "Uttara Phalguni": "उत्तरा फाल्गुनी (Uttara Phalguni)",
                                                "Hasta": "हस्त (Hasta)", "Chitra": "चित्रा (Chitra)", "Swati": "स्वाती (Swati)",
                                                "Vishakha": "विशाखा (Vishakha)", "Anuradha": "अनुराधा (Anuradha)", "Jyeshtha": "ज्येष्ठा (Jyeshtha)",
                                                "Mula": "मूल (Mula)", "Purva Ashadha": "पूर्वाषाढ़ा (Purva Ashadha)", "Uttara Ashadha": "उत्तराषाढ़ा (Uttara Ashadha)",
                                                "Shravana": "श्रवण (Shravana)", "Dhanishta": "धनिष्ठा (Dhanishta)", "Shatabhisha": "शतभिषा (Shatabhisha)",
                                                "Purva Bhadrapada": "पूर्वभाद्रपद (Purva Bhadrapada)", "Uttara Bhadrapada": "उत्तरभाद्रपद (Uttara Bhadrapada)", "Revati": "रेवती (Revati)"
                                            };

                                            const MOTION_HI = {
                                                "Vakri": "वक्री (Retrograde)",
                                                "Margi": "मार्गी (Direct)"
                                            };

                                            const COMBUSTION_HI = {
                                                "Asth": "अस्त (Combust)",
                                                "Uday": "उदय (Rising)",
                                                "Self": "स्व (Own)",
                                                "N/A": "N/A"
                                            };

                                            return (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '18px' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '2px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)' }}>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>ग्रह (Planet)</th>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>भाव (House Placed)</th>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>राशि (Zodiac Sign)</th>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>नक्षत्र (Nakshatra - Pada)</th>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>गति (Motion)</th>
                                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#d4af37', fontWeight: 'bold' }}>अवस्था (State)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedDayTransit.planets.map((p, idx) => {
                                                            const planetDisp = PLANET_HI[p.name] || p.name;
                                                            const zodiacDisp = ZODIAC_HI[p.zodiac] || p.zodiac;
                                                            const nakshatraNameOnly = p.nakshatra ? p.nakshatra.split(' ')[0] : '';
                                                            const nakshatraDisp = NAKSHATRA_HI[nakshatraNameOnly] || p.nakshatra || '';
                                                            const motionDisp = MOTION_HI[p.motion] || p.motion;
                                                            const combustionDisp = COMBUSTION_HI[p.combustion] || p.combustion;

                                                            return (
                                                                <tr key={idx} style={{
                                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                                    transition: 'background 0.2s'
                                                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'} onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}>
                                                                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#fbbf24' }}>
                                                                        {planetDisp}
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>
                                                                        भाव {p.house} (House {p.house})
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px', color: '#60a5fa' }}>
                                                                        {zodiacDisp} ({p.degree}°)
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px', color: '#c084fc' }}>
                                                                        {nakshatraDisp} (Pada {p.pada})
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px' }}>
                                                                        <span style={{
                                                                            padding: '3px 8px',
                                                                            borderRadius: '4px',
                                                                            fontSize: '16px',
                                                                            fontWeight: 'bold',
                                                                            background: p.motion === 'Vakri' ? 'hsla(0, 23%, 91%, 1.00)' : 'hsla(147, 47%, 96%, 1.00)',
                                                                            color: p.motion === 'Vakri' ? '#b10808ff' : 'rgba(4, 184, 19, 1)'
                                                                        }}>
                                                                            {motionDisp}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px' }}>
                                                                        <span style={{
                                                                            padding: '3px 8px',
                                                                            borderRadius: '4px',
                                                                            fontSize: '16px',
                                                                            fontWeight: 'bold',
                                                                            background: p.combustion === 'Asth' ? 'hsla(26, 54%, 98%, 1.00)' : p.combustion === 'Self' ? 'hsla(210, 18%, 93%, 1.00)' : p.combustion === 'N/A' ? 'hsla(0, 0%, 100%, 1.00)' : 'hsla(142, 100%, 98%, 1.00)',
                                                                            color: p.combustion === 'Asth' ? 'hsla(27, 96%, 35%, 0.81)' : p.combustion === 'Self' ? 'rgba(11, 87, 179, 1)' : p.combustion === 'N/A' ? '#94a3b8' : 'rgba(21, 196, 5, 1)'
                                                                        }}>
                                                                            {combustionDisp}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
