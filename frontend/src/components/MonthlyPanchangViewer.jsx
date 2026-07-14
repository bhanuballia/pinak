import React, { useState, useEffect } from 'react';
import { fetchMonthlyPanchang, fetchNextAdhikMaas } from '../services/api';

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
    if (name.includes("shravana") || name.includes("dhanishta")) return "Shravana";
    if (name.includes("shatabhisha") || name.includes("bhadrapada")) return "Bhadrapada"; // Purva/Uttara Bhadrapada
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
            return (month === 7 || month === 8) && dayData?.tithi?.tithi_index === 14 && (hinduMonth === "Shravana" || hinduMonth.includes("Shravana"));
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
        name: "Dhanteras / Govatsa Dwadashi",
        hindiName: "धनतेरस / गोवत्स द्वादशी",
        description: "First day of Diwali, dark fortnight of Ashvin/Kartik",
        match: (day, month, year, dayData, hinduMonth) => {
            return (month === 9 || month === 10) && dayData?.tithi?.tithi_index === 26 && (hinduMonth === "Ashvina" || hinduMonth.includes("Ashvina") || hinduMonth === "Kartika" || hinduMonth.includes("Kartika"));
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
            purnimaDate: purnimaDay ? `${purnimaDay.day_number} ${MONTHS[currentDate.getMonth()]}` : 'N/A'
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
                <div key={day} style={{
                    border: isSelectedFestival ? '3px solid #fbbf24' : isToday ? '3px solid #22c55e' : '1px solid #fcf1faff',
                    background: isSelectedFestival ? '#fffbeb' : isToday ? 'hsla(142, 18%, 88%, 1.00)' : 'hsla(311, 52%, 94%, 1.00)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minHeight: '180px',
                    boxShadow: isSelectedFestival ? '0 0 15px rgba(251,191,36,0.3) inset' : isToday ? '0 0 15px rgba(34,197,94,0.3) inset' : 'inset 0 0 10px hsla(0, 29%, 93%, 0.99)',
                    transition: 'all 0.3s'
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
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
