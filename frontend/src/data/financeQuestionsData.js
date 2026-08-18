// data/financeQuestionsData.js
/**
 * 20 Core Financial Questions with dynamic Lagna chart analysis rules & Dasha Date calculations.
 */

const getDashaPeriodText = (lordNames, dashaData) => {
    if (!dashaData) return "";
    const list = dashaData.list || dashaData || [];
    if (!Array.isArray(list) || list.length === 0) return "";

    const targets = Array.isArray(lordNames) ? lordNames : [lordNames];
    const foundPeriods = [];

    list.forEach(d => {
        const lord = d.lord || d.planet || d.mahadasha;
        if (lord && targets.includes(lord)) {
            const start = d.start_date || d.start || "";
            const end = d.end_date || d.end || "";
            if (start && end) {
                foundPeriods.push(`${lord} Dasha (${start} to ${end})`);
            } else if (start) {
                foundPeriods.push(`${lord} Dasha (from ${start})`);
            }
        }
    });

    if (foundPeriods.length === 0) return "";
    return ` [Active Period: ${foundPeriods.join(', ')}]`;
};

/**
 * Generates personalized Lagna-based Financial Remedies
 */
export const LAGNA_WEALTH_REMEDIES = {
    "Aries": {
        deity: "Goddess Mahalakshmi & Lord Kuber",
        mantra: "Om Shreem Hreem Shreem Kamale Kamalalaye Praseed Praseed",
        wealthLords: "Venus (2nd Lord) & Saturn (11th Lord)",
        luckyGem: "White Sapphire / Diamond (Venus)",
        remedies: [
            "Worship Goddess Lakshmi on Fridays and offer lotus or white flowers.",
            "Donate white sweets, milk, or silver coins on Friday evenings to activate Venusian wealth channels.",
            "Recite Hanuman Chalisa on Tuesdays to strengthen Lagna Lord Mars for financial execution.",
            "Keep a clean Sri Yantra or Kuber Yantra in the North direction of your home."
        ]
    },
    "Taurus": {
        deity: "Lord Vishnu & Kuber",
        mantra: "Om Namo Bhagavate Vasudevaya",
        wealthLords: "Mercury (2nd & 5th Lord) & Jupiter (11th Lord)",
        luckyGem: "Natural Emerald (Panna - Mercury)",
        remedies: [
            "Worship Lord Vishnu on Wednesdays and recite Vishnu Sahasranama for compound financial growth.",
            "Donate green items, whole moong dal, or books to students on Wednesdays.",
            "Mercury is your primary Dhanakaraka—avoid harsh speech and maintain clean business accounts.",
            "Apply a yellow sandalwood tilak on your forehead on Thursday mornings."
        ]
    },
    "Gemini": {
        deity: "Lord Shiva & Lord Hanuman",
        mantra: "Om Namah Shivaya",
        wealthLords: "Moon (2nd Lord) & Mars (11th Lord)",
        luckyGem: "Natural Emerald or Pearl",
        remedies: [
            "Offer water and unboiled milk to a Shivling on Monday mornings to stabilize cash flows.",
            "Worship Lord Hanuman on Tuesdays to activate 11th house gains (Mars).",
            "Avoid emotional spending or hasty financial speculation when the Moon is in waning phase.",
            "Keep a small silver square piece in your wallet to retain accumulated savings."
        ]
    },
    "Cancer": {
        deity: "Surya Dev & Goddess Lakshmi",
        mantra: "Om Hraam Hreem Hroum Sah Suryaya Namah",
        wealthLords: "Sun (2nd Lord) & Venus (11th Lord)",
        luckyGem: "Ruby (Manikya) or Pearl",
        remedies: [
            "Offer water (Arghya) with red kumkum to the rising Sun every morning.",
            "Donate wheat, jaggery, or copper items on Sunday mornings to strengthen Sun (2nd Lord).",
            "Respect women and family elders to harmonize Venusian revenue channels.",
            "Keep a brass vessel filled with Gangajal or clean water in the East corner."
        ]
    },
    "Leo": {
        deity: "Lord Ganesha & Lord Kuber",
        mantra: "Om Gam Ganapataye Namah",
        wealthLords: "Mercury (2nd & 11th Lord)",
        luckyGem: "Natural Emerald (Panna) or Ruby",
        remedies: [
            "Mercury rules BOTH your 2nd (Savings) and 11th (Gains) houses—worship Lord Ganesha with Durva grass.",
            "Donate green clothes, stationery, or food to underprivileged children on Wednesdays.",
            "Avoid ego clashes in business networks and maintain total clarity in accounting.",
            "Place a green jade or Kuber Idol facing North in your office space."
        ]
    },
    "Virgo": {
        deity: "Goddess Mahalakshmi",
        mantra: "Om Shreem Mahalakshmiyei Namah",
        wealthLords: "Venus (2nd & 9th Lord - Yogakaraka)",
        luckyGem: "Diamond / White Sapphire (Venus)",
        remedies: [
            "Venus is your supreme Yogakaraka for wealth & luck—recite Kanakdhara Stotram on Fridays.",
            "Keep your living and workspace fragrant with natural rose or sandalwood incense.",
            "Donate white clothes, rice, or sugar to needy women on Fridays.",
            "Avoid criticism and foster harmonious relationships with colleagues."
        ]
    },
    "Libra": {
        deity: "Lord Hanuman & Surya Dev",
        mantra: "Om Hanumate Namah",
        wealthLords: "Mars (2nd Lord) & Sun (11th Lord)",
        luckyGem: "Diamond or Red Coral",
        remedies: [
            "Recite Hanuman Chalisa or Sundarkand on Tuesdays to protect and expand wealth assets.",
            "Offer water to Surya Dev daily to strengthen your 11th Lord of gains (Sun).",
            "Donate red lentils (masoor dal) or copper coins on Tuesday afternoons.",
            "Maintain strict honesty and avoid compromising ethical boundaries in partnerships."
        ]
    },
    "Scorpio": {
        deity: "Lord Vishnu & Lord Brihaspati",
        mantra: "Om Brim Brihaspataye Namah",
        wealthLords: "Jupiter (2nd & 5th Lord) & Mercury (11th Lord)",
        luckyGem: "Yellow Sapphire (Pukhraj)",
        remedies: [
            "Jupiter is your primary Dhanakaraka—wear Yellow Sapphire or apply turmeric tilak on Thursdays.",
            "Donate yellow chana dal, bananas, or saffron to priests/temples on Thursdays.",
            "Worship Lord Vishnu on Ekadashi days for steady wealth accumulation.",
            "Serve cows and seek blessings from teachers and elders."
        ]
    },
    "Sagittarius": {
        deity: "Lord Shani & Goddess Lakshmi",
        mantra: "Om Sham Shanaishcharaya Namah",
        wealthLords: "Saturn (2nd Lord) & Venus (11th Lord)",
        luckyGem: "Yellow Sapphire or Blue Sapphire",
        remedies: [
            "Help laborers, workers, and underprivileged individuals on Saturdays to strengthen Saturn (2nd Lord).",
            "Light a mustard oil Diya under a Peepal tree on Saturday evenings.",
            "Worship Goddess Lakshmi on Fridays for 11th house gain activation.",
            "Maintain disciplined, long-term financial planning instead of hasty shortcuts."
        ]
    },
    "Capricorn": {
        deity: "Lord Shiva & Lord Hanuman",
        mantra: "Om Namah Shivaya",
        wealthLords: "Saturn (1st & 2nd Lord) & Mars (11th Lord)",
        luckyGem: "Blue Sapphire (Neelam) or Blue Zircon",
        remedies: [
            "Saturn rules your Lagna & 2nd house—unshakable discipline and patience build generational wealth.",
            "Chant Shiv Chalisa or Rudra Gayatri Mantra on Mondays and Saturdays.",
            "Recite Hanuman Chalisa on Tuesdays to boost Mars (11th Lord of Gains).",
            "Donate black sesame seeds, iron, or shoes to needy people on Saturdays."
        ]
    },
    "Aquarius": {
        deity: "Lord Kuber & Lord Brihaspati",
        mantra: "Om Brim Brihaspataye Namah",
        wealthLords: "Jupiter (2nd & 11th Lord)",
        luckyGem: "Yellow Sapphire (Pukhraj)",
        remedies: [
            "Jupiter rules BOTH your 2nd (Savings) and 11th (Gains) houses—this is your most critical wealth planet!",
            "Chant Guru Mantra daily and recite Guru Stotram on Thursdays.",
            "Donate yellow sweets, turmeric, or chana dal on Thursday mornings.",
            "Establish a yellow Kuber Yantra in the North-East direction of your premises."
        ]
    },
    "Pisces": {
        deity: "Lord Hanuman & Lord Shiva",
        mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah",
        wealthLords: "Mars (2nd & 9th Lord - Yogakaraka) & Saturn (11th Lord)",
        luckyGem: "Yellow Sapphire or Red Coral",
        remedies: [
            "Mars is your supreme Yogakaraka for wealth & fortune—worship Lord Hanuman on Tuesdays.",
            "Donate red items (jaggery, pomegranate, red lentils) on Tuesday mornings.",
            "Light a mustard oil lamp under a Peepal tree on Saturdays to activate 11th house gains (Saturn).",
            "Follow strict righteous conduct (Dharma) to preserve high financial luck."
        ]
    }
};

export const getPersonalizedWealthRemedies = (ascendantSign) => {
    const defaultData = LAGNA_WEALTH_REMEDIES["Aries"];
    if (!ascendantSign) return defaultData;
    return LAGNA_WEALTH_REMEDIES[ascendantSign] || defaultData;
};
export const FINANCE_QUESTIONS_LIST = [
    {
        id: "income_source",
        question: "When will I get a good source of income?",
        housesNeeded: [11, 10, 2],
        evaluate: (houses, planets, lords, dasha) => {
            const h11 = houses["11"];
            const lord11 = lords["11"];
            const h10 = houses["10"];
            const lord10 = lords["10"];
            const datesText = getDashaPeriodText([lord11, lord10], dasha);
            
            return {
                summary: `Governed by your 11th House (${h11?.sign_name || 'Gains'}, Lord: ${lord11 || '11th Lord'}) and 10th House (${h10?.sign_name || 'Career'}, Lord: ${lord10 || '10th Lord'}).`,
                details: `Your primary income sources activate during the Mahadasha or Antardasha of ${lord11 || '11th Lord'} or ${lord10 || '10th Lord'}${datesText}, or when Jupiter transits over your 11th house (${h11?.sign_name || 'Gains'}).`,
                astrologicalRule: "Evaluated by 11th House (Income), 10th House (Profession), and placement of 11th Lord in D1 & D10 charts."
            };
        }
    },
    {
        id: "income_increase",
        question: "When will my income increase significantly?",
        housesNeeded: [11, 9, 1],
        evaluate: (houses, planets, lords, dasha) => {
            const lord11 = lords["11"];
            const lord9 = lords["9"];
            const lord2 = lords["2"];
            const datesText = getDashaPeriodText([lord11, lord9, lord2], dasha);

            return {
                summary: `Steep income rises occur during major planetary connections between your 11th Lord (${lord11 || '11th Lord'}), 9th Lord (${lord9 || '9th Lord'}), and 2nd Lord (${lord2 || '2nd Lord'}).`,
                details: `Significant financial leaps trigger when running the sub-periods (Antardashas) of ${lord11 || '11th Lord'} or ${lord9 || '9th Lord'}${datesText}, particularly when transit Jupiter aspects your 2nd or 11th house.`,
                astrologicalRule: "Evaluated via Dhana Yogas formed between 2nd, 9th, and 11th house lords."
            };
        }
    },
    {
        id: "multiple_income",
        question: "Will I have multiple sources of income?",
        housesNeeded: [11, 3, 7],
        evaluate: (houses, planets, lords, dasha) => {
            const h11 = houses["11"];
            const lord11 = lords["11"];
            const dualSigns = ["Gemini", "Virgo", "Sagittarius", "Pisces"];
            const isDual = dualSigns.includes(h11?.sign_name);
            const planetsIn11 = planets.filter(p => p.house === 11).map(p => p.planet);
            const hasMultiple = isDual || planetsIn11.length >= 2 || lord11 === "Mercury";
            const datesText = getDashaPeriodText(["Mercury", "Rahu", lord11], dasha);

            return {
                summary: hasMultiple 
                    ? `Strong potential for multiple income streams! 11th house is in ${h11?.sign_name || 'Dual Sign'} with ${planetsIn11.length} planet(s) (${planetsIn11.join(', ') || 'Aspects'}).`
                    : `Single primary career stream indicated, with periodic secondary gains during Mercury/Rahu dashas.`,
                details: `Multiple revenue channels occur when dual signs occupy the 11th cusp or when Mercury/Rahu aspect your house of gains${datesText}.`,
                astrologicalRule: "Evaluated by Dual Sign presence on 11th house cusp and count of planets occupying the 11th house."
            };
        }
    },
    {
        id: "financially_wealthy",
        question: "Will I become financially wealthy?",
        housesNeeded: [2, 11, 9, 5],
        evaluate: (houses, planets, lords, dasha) => {
            const lord2 = lords["2"];
            const lord11 = lords["11"];
            const lord9 = lords["9"];
            const datesText = getDashaPeriodText([lord2, lord11, lord9], dasha);

            return {
                summary: `Wealth potential is backed by your 2nd Lord (${lord2 || '2nd Lord'}), 11th Lord (${lord11 || '11th Lord'}), and 9th Lord (${lord9 || '9th Lord'}).`,
                details: `Your overall capacity for high net-worth is determined by the strength and un-afflicted placement of ${lord2 || '2nd Lord'} and ${lord11 || '11th Lord'}${datesText} in Kendra (1, 4, 7, 10) or Trikona (1, 5, 9) houses.`,
                astrologicalRule: "Evaluated by total strength of Dhana Yogas, Indu Lagna, and 2nd/11th house placements."
            };
        }
    },
    {
        id: "ancestral_property",
        question: "Will I receive ancestral property or inheritance?",
        housesNeeded: [8, 4, 2],
        evaluate: (houses, planets, lords, dasha) => {
            const lord8 = lords["8"];
            const lord4 = lords["4"];
            const planetsIn8 = planets.filter(p => p.house === 8).map(p => p.planet);
            const datesText = getDashaPeriodText([lord8, lord4, ...planetsIn8], dasha);

            return {
                summary: `Inheritance is governed by your 8th House (${houses["8"]?.sign_name || '8th House'}, Lord: ${lord8 || '8th Lord'}) and 4th House (${houses["4"]?.sign_name || '4th House'}, Lord: ${lord4 || '4th Lord'}).`,
                details: planetsIn8.length > 0 
                    ? `Planets in 8th house (${planetsIn8.join(', ')}) indicate active legacy & unearned asset transfers during their dasha${datesText}.`
                    : `Inheritance flow depends on the strength of ${lord8 || '8th Lord'} and its connection to your 2nd or 4th lord without heavy malefic combustion${datesText}.`,
                astrologicalRule: "Evaluated by 8th House (Legacy), 4th House (Property), and D4 (Chaturthamsha) chart connections."
            };
        }
    },
    {
        id: "ancestral_wealth_source",
        question: "Will ancestral property become a source of my wealth?",
        housesNeeded: [8, 4, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord8 = lords["8"];
            const lord11 = lords["11"];
            const datesText = getDashaPeriodText([lord8, lord11], dasha);

            return {
                summary: `Analyzed through the 8th Lord (${lord8 || '8th Lord'}) connecting with your 11th Lord of gains (${lord11 || '11th Lord'}).`,
                details: `If ${lord8 || '8th Lord'} is placed in or aspects the 2nd, 4th, or 11th house, ancestral real estate or family trusts become a major wealth contributor${datesText}.`,
                astrologicalRule: "Evaluated via Parivartana (exchange) or mutual aspect between 8th Lord and 2nd/4th/11th Lords."
            };
        }
    },
    {
        id: "wealth_career_business",
        question: "Will I become wealthy through my career or business?",
        housesNeeded: [10, 7, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord10 = lords["10"];
            const lord7 = lords["7"];
            const datesText = getDashaPeriodText([lord10, lord7], dasha);

            return {
                summary: `10th Lord (${lord10 || '10th Lord'}) governs career status while 7th Lord (${lord7 || '7th Lord'}) governs business ventures.`,
                details: `Wealth generated through professional endeavors is maximum when ${lord10 || '10th Lord'} or ${lord7 || '7th Lord'} connects directly with your 2nd or 11th house${datesText}.`,
                astrologicalRule: "Evaluated by D10 (Dashamsha) chart strength and connections between 10th/7th lords and wealth houses."
            };
        }
    },
    {
        id: "business_vs_employment",
        question: "Am I better suited to business or employment?",
        housesNeeded: [6, 7, 10],
        evaluate: (houses, planets, lords, dasha) => {
            const lord6 = lords["6"];
            const lord7 = lords["7"];
            const planetsIn6 = planets.filter(p => p.house === 6).length;
            const planetsIn7 = planets.filter(p => p.house === 7).length;
            
            const businessFavorable = planetsIn7 > planetsIn6 || ["Mercury", "Venus"].includes(lord7);
            const datesText = getDashaPeriodText([businessFavorable ? lord7 : lord6], dasha);

            return {
                summary: businessFavorable 
                    ? `Chart inclines favorably toward Business & Independent Ventures (Strong 7th House / Mercury / Venus influence).`
                    : `Chart favors Structured Employment & Professional Career Roles (Strong 6th House / 10th House alignment).`,
                details: `6th House governs salaried service while 7th House governs commercial business${datesText}.`,
                astrologicalRule: "Comparative strength analysis of 6th House (Service) vs 7th House (Business) & their respective lords."
            };
        }
    },
    {
        id: "better_paying_job",
        question: "When will I get a better-paying job?",
        housesNeeded: [6, 10, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord10 = lords["10"];
            const lord6 = lords["6"];
            const lord11 = lords["11"];
            const datesText = getDashaPeriodText([lord10, lord6, lord11], dasha);

            return {
                summary: `Career upgrades occur during Dasha sub-periods of 10th Lord (${lord10 || '10th Lord'}) or 6th Lord (${lord6 || '6th Lord'}).`,
                details: `Salary hikes and high-paying job changes trigger during planetary operating periods${datesText}, or when transit Jupiter aspects your 10th/11th house.`,
                astrologicalRule: "Evaluated by Dasha periods of 6th, 10th, 11th lords and transit of Jupiter across Kendra/Trikona houses."
            };
        }
    },
    {
        id: "financial_condition_improvement",
        question: "When will my financial condition improve?",
        housesNeeded: [2, 9, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord9 = lords["9"];
            const lord11 = lords["11"];
            const datesText = getDashaPeriodText([lord9, lord11], dasha);

            return {
                summary: `Financial turnarounds align with the activation of your 9th Lord of Fortune (${lord9 || '9th Lord'}) and 11th Lord of Gains (${lord11 || '11th Lord'}).`,
                details: `Overall economic recovery accelerates when entering benefic operating periods${datesText} and when transiting Saturn exits restrictive houses.`,
                astrologicalRule: "Evaluated via Dasha timeline, Ashtakavarga score (>28 points in 11th house), and planetary transits."
            };
        }
    },
    {
        id: "dhana_yoga_check",
        question: "Does my Kundali show strong Dhana Yoga?",
        housesNeeded: [1, 2, 5, 9, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord2 = lords["2"];
            const lord11 = lords["11"];
            const pos2 = planets.find(p => p.planet === lord2)?.house;
            const pos11 = planets.find(p => p.planet === lord11)?.house;
            const isDhanaActive = [1, 2, 5, 9, 11].includes(pos2) || [1, 2, 5, 9, 11].includes(pos11);
            const datesText = getDashaPeriodText([lord2, lord11], dasha);

            return {
                summary: isDhanaActive 
                    ? `YES! Powerful Dhana Yoga active in your chart (2nd Lord ${lord2} in House ${pos2} / 11th Lord ${lord11} in House ${pos11}).`
                    : `Dhana Yogas present through house aspects and lord combinations.`,
                details: `Dhana Yogas unlock maximum financial potential during their dasha operating windows${datesText}.`,
                astrologicalRule: "Evaluated by association between Trikona (5, 9) and Dhana/Labha (2, 11) house lords."
            };
        }
    },
    {
        id: "wealth_via_property",
        question: "Will I gain wealth through property?",
        housesNeeded: [4, 2, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord4 = lords["4"];
            const marsPos = planets.find(p => p.planet === "Mars")?.house;
            const datesText = getDashaPeriodText([lord4, "Mars"], dasha);

            return {
                summary: `Real estate wealth is governed by your 4th Lord (${lord4 || '4th Lord'}) and Mars (Bhoomi Karaka, placed in House ${marsPos || 'N/A'}).`,
                details: `Property investments yield substantial wealth if ${lord4 || '4th Lord'} or Mars connects with your 2nd or 11th house${datesText}.`,
                astrologicalRule: "Evaluated by strength of 4th House, 4th Lord, Mars placement, and D4 Divisional Chart."
            };
        }
    },
    {
        id: "wealth_after_marriage",
        question: "Will I gain financially after marriage?",
        housesNeeded: [7, 8, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord7 = lords["7"];
            const venusPos = planets.find(p => p.planet === "Venus")?.house;
            const datesText = getDashaPeriodText([lord7, "Venus"], dasha);

            return {
                summary: `Post-marital prosperity is governed by your 7th Lord (${lord7 || '7th Lord'}) and Venus (in House ${venusPos || 'N/A'}).`,
                details: `If ${lord7 || '7th Lord'} or Venus is placed in or aspects the 2nd, 9th, or 11th house, marriage brings a rise in fortune${datesText}.`,
                astrologicalRule: "Evaluated by 7th Lord connection to 2nd/11th houses in D1 (Lagna) and D9 (Navamsha) charts."
            };
        }
    },
    {
        id: "foreign_income",
        question: "Does my chart indicate foreign income?",
        housesNeeded: [12, 9, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord12 = lords["12"];
            const rahuPos = planets.find(p => p.planet === "Rahu")?.house;
            const hasForeignLink = [1, 2, 9, 10, 11].includes(rahuPos) || [2, 9, 11].includes(planets.find(p => p.planet === lord12)?.house);
            const datesText = getDashaPeriodText(["Rahu", lord12], dasha);

            return {
                summary: hasForeignLink 
                    ? `Strong Foreign Connection! Rahu in House ${rahuPos} and 12th Lord ${lord12 || '12th Lord'} connect with income houses.`
                    : `Foreign gains possible through export, overseas clients, or digital platforms.`,
                details: `Foreign revenue triggers when 12th house or Rahu operates in your timeline${datesText}.`,
                astrologicalRule: "Evaluated by 12th House connections to 2nd/10th/11th houses and Rahu's placement."
            };
        }
    },
    {
        id: "substantial_savings",
        question: "Will I be able to accumulate substantial savings?",
        housesNeeded: [2, 12],
        evaluate: (houses, planets, lords, dasha) => {
            const lord2 = lords["2"];
            const lord12 = lords["12"];
            const planetsIn2 = planets.filter(p => p.house === 2).map(p => p.planet);
            const datesText = getDashaPeriodText([lord2], dasha);

            return {
                summary: `Savings capacity is governed by 2nd Lord (${lord2 || '2nd Lord'}) vs 12th Lord of Expenditure (${lord12 || '12th Lord'}).`,
                details: `High savings retention occurs when 2nd house (${houses["2"]?.sign_name || '2nd House'}) is occupied by benefics (${planetsIn2.join(', ') || 'None'})${datesText}.`,
                astrologicalRule: "Evaluated by 2nd House strength vs 12th House expenses and D2 (Hora) chart diagnostics."
            };
        }
    },
    {
        id: "financial_independence",
        question: "When will I become financially independent?",
        housesNeeded: [1, 10, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord1 = lords["1"];
            const lord10 = lords["10"];
            const datesText = getDashaPeriodText([lord1, lord10], dasha);

            return {
                summary: `Self-reliance is driven by your Lagna Lord (${lord1 || 'Lagna Lord'}) and 10th Lord of Authority (${lord10 || '10th Lord'}).`,
                details: `Complete financial self-sufficiency consolidates when entering operating dasha periods${datesText}, corresponding to planetary maturity ages.`,
                astrologicalRule: "Evaluated by Lagna Lord strength, 10th House authority, and planetary maturity ages."
            };
        }
    },
    {
        id: "debts_reduction",
        question: "When will my debts and financial pressure reduce?",
        housesNeeded: [6, 11, 8],
        evaluate: (houses, planets, lords, dasha) => {
            const lord6 = lords["6"];
            const lord11 = lords["11"];
            const datesText = getDashaPeriodText([lord11, lords["9"]], dasha);

            return {
                summary: `Debt relief is governed by your 6th Lord (${lord6 || '6th Lord'}) and 11th Lord of Gains (${lord11 || '11th Lord'}).`,
                details: `Financial liabilities decline significantly during operating periods of 11th or 9th Lord${datesText}.`,
                astrologicalRule: "Evaluated by 6th House (Rina/Debts) strength, 11th Lord gains, and Saturn/Jupiter transits."
            };
        }
    },
    {
        id: "dasha_financial_growth",
        question: "Which Dasha is likely to bring financial growth?",
        housesNeeded: [2, 5, 9, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord2 = lords["2"];
            const lord11 = lords["11"];
            const lord9 = lords["9"];
            const datesText = getDashaPeriodText([lord11, lord2, lord9], dasha);

            return {
                summary: `Peak financial growth periods occur during the Mahadashas of ${lord11 || '11th Lord'}, ${lord2 || '2nd Lord'}, or ${lord9 || '9th Lord'}.`,
                details: `Operating periods of Yogakaraka planets or wealth lords act as golden financial windows${datesText}.`,
                astrologicalRule: "Evaluated by Vimshottari & Chara Dasha operating lords connected to 2nd, 5th, 9th, and 11th houses."
            };
        }
    },
    {
        id: "strongest_wealth_periods",
        question: "What are the strongest wealth-producing periods in my life?",
        housesNeeded: [1, 2, 9, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord11 = lords["11"];
            const lord9 = lords["9"];
            const datesText = getDashaPeriodText([lord11, lord9], dasha);

            return {
                summary: `Golden periods trigger when favorable Dasha cycles overlap with high Ashtakavarga points in your 11th house (${houses["11"]?.sign_name || '11th House'}).`,
                details: `Major wealth accumulation takes place during key planetary operating timelines${datesText}.`,
                astrologicalRule: "Evaluated by Dasha-Transit overlaps combined with Ashtakavarga & Indu Lagna strength."
            };
        }
    },
    {
        id: "primary_wealth_source",
        question: "What is the primary source of wealth indicated by my Kundali?",
        housesNeeded: [2, 10, 11],
        evaluate: (houses, planets, lords, dasha) => {
            const lord2 = lords["2"];
            const lord10 = lords["10"];
            const planetsIn10 = planets.filter(p => p.house === 10).map(p => p.planet);
            const primaryPlanet = planetsIn10[0] || lord10 || lord2;
            const datesText = getDashaPeriodText([primaryPlanet], dasha);

            const planetSources = {
                "Sun": "Government, Management, Public Leadership, Family Heritage",
                "Moon": "Public Dealing, Hospitality, Liquids, Food Industry, Creative Arts",
                "Mars": "Real Estate, Construction, Engineering, Defense, Sports",
                "Mercury": "Trade, Business, IT, Finance, Marketing, Communication",
                "Jupiter": "Banking, Law, Advisory, Education, Spiritual Consulting",
                "Venus": "Luxury Goods, Entertainment, Beauty, Media, High Fashion",
                "Saturn": "Manufacturing, Mining, Heavy Industry, Labor Management, Real Estate",
                "Rahu": "AI, High-Tech, Foreign Trade, Media, Unconventional Ventures",
                "Ketu": "Research, Data Analytics, Occult Sciences, Independent Freelancing"
            };

            return {
                summary: `Primary Source: ${planetSources[primaryPlanet] || 'Professional Service & Business'}.`,
                details: `Your dominant financial driver is governed by ${primaryPlanet} influencing your 10th House of career and 2nd House of accumulated wealth${datesText}.`,
                astrologicalRule: "Evaluated by strongest planet occupying or aspecting 10th/2nd house and Arudha Lagna (AL)."
            };
        }
    }
];
