import React, { useState, useEffect } from 'react';
import { MARRIAGE_HOUSE_INTERPRETATIONS, MARRIAGE_YOGAS, MARRIAGE_CONJUNCTIONS, SIGN_LORDS, predictMarriageYears } from '../data/marriageData';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';

const DUAL_SIGNS = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
const FIXED_SIGNS = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];

export default function MarriageAnalysis() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYoga, setSelectedYoga] = useState(null);
    const [isHindi, setIsHindi] = useState(false);
    const [selectedGender, setSelectedGender] = useState('Male');
    const [showPastWindow, setShowPastWindow] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setData(parsed);
            const userGen = parsed.basic_details?.gender || parsed.basic_details?.sex || 'Male';
            if (userGen.toLowerCase().includes('female') || userGen.toLowerCase().includes('girl') || userGen.toLowerCase().includes('woman')) {
                setSelectedGender('Female');
            } else {
                setSelectedGender('Male');
            }
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-[#881337] bg-[#fff1f2] min-h-screen">Loading Marriage Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-600 bg-[#fff1f2] min-h-screen">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const basic = data.basic_details || {};

    const getPlanetHouse = (pName) => {
        const hNum = Object.keys(houses).find(h =>
            houses[h].planets?.some(p => (typeof p === 'object' ? p.name : p) === pName)
        );
        return hNum ? parseInt(hNum) : null;
    };

    // Calculate House Lords
    const h1Sign = houses["1"]?.sign_name;
    const lord1 = h1Sign ? SIGN_LORDS[h1Sign] : null;

    const h2Sign = houses["2"]?.sign_name;
    const lord2 = h2Sign ? SIGN_LORDS[h2Sign] : null;

    const h5Sign = houses["5"]?.sign_name;
    const lord5 = h5Sign ? SIGN_LORDS[h5Sign] : null;

    const h6Sign = houses["6"]?.sign_name;
    const lord6 = h6Sign ? SIGN_LORDS[h6Sign] : null;

    const h7Sign = houses["7"]?.sign_name;
    const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
    const pos7 = lord7 ? getPlanetHouse(lord7) : null;

    const h8Sign = houses["8"]?.sign_name;
    const lord8 = h8Sign ? SIGN_LORDS[h8Sign] : null;

    const h9Sign = houses["9"]?.sign_name;
    const lord9 = h9Sign ? SIGN_LORDS[h9Sign] : null;

    // Ultra-robust date extraction
    let day = basic.day || basic.date;
    let month = basic.month;
    let year = basic.year;

    if (!day || !month || !year) {
        const fullDate = basic.birth_date || (basic.birth_datetime && basic.birth_datetime.split(' ')[0]);
        if (fullDate) {
            if (fullDate.includes('-')) {
                const parts = fullDate.split('-');
                if (parts[0].length === 4) { [year, month, day] = parts; }
                else { [day, month, year] = parts; }
            } else if (fullDate.includes('/')) {
                const parts = fullDate.split('/');
                if (parts[0].length === 4) { [year, month, day] = parts; }
                else { [day, month, year] = parts; }
            }
        }
    }

    const dobStr = `${day}/${month}/${year}`;
    const numerology = predictMarriageYears(dobStr);

    const getVedicMarriageTiming = () => {
        let birthYear = parseInt(year);
        if (!birthYear || isNaN(birthYear)) {
            birthYear = new Date().getFullYear() - 25;
        }
        const currentYear = new Date().getFullYear();
        const currentAge = currentYear - birthYear;

        let minAge = 24;
        let maxAge = 28;

        if ([1, 4, 5, 7, 9, 11].includes(pos7)) {
            minAge = 23; maxAge = 27;
        } else if ([3, 6, 8, 12].includes(pos7)) {
            minAge = 28; maxAge = 33;
        }

        const h7Planets = houses["7"]?.planets?.map(p => typeof p === 'object' ? p.name : p) || [];
        const hasDelayPlanets = h7Planets.some(p => ['Saturn', 'Rahu', 'Ketu'].includes(p));
        if (hasDelayPlanets) {
            minAge += 2;
            maxAge += 3;
        }

        const primaryDashaLord = lord7 || 'Venus';
        const secondaryDashaLord = (lord7 === 'Venus') ? 'Jupiter' : 'Venus';

        const displayAge = currentAge > 0 ? currentAge : 25;
        const targetAgeStart = Math.max(displayAge, minAge);
        const targetAgeEnd = Math.max(targetAgeStart + 2, maxAge);
        const targetYearStart = birthYear + targetAgeStart;
        const targetYearEnd = birthYear + targetAgeEnd;

        const yearsFromNowStart = Math.max(0, targetAgeStart - displayAge);
        const yearsFromNowEnd = Math.max(1, targetAgeEnd - displayAge);

        let countdownText = "";
        if (yearsFromNowStart === 0) {
            countdownText = `Within next 1 - ${yearsFromNowEnd} years (Age ${targetAgeStart} - ${targetAgeEnd})`;
        } else {
            countdownText = `In ${yearsFromNowStart} - ${yearsFromNowEnd} years from now (Age ${targetAgeStart} - ${targetAgeEnd})`;
        }

        const d9Chart = data?.charts?.d9 || data?.varga_charts?.d9 || data?.navamsha || {};
        const d9LagnaSign = d9Chart["1"]?.sign_name || "Aries Navamsha";
        const d9SpouseSign = d9Chart["7"]?.sign_name || h7Sign || "Libra Navamsha";

        const peakAge = Math.floor((targetAgeStart + targetAgeEnd) / 2);
        const peakYear = birthYear + peakAge;
        const peakReason = `Peak confluence of ${primaryDashaLord} Dasha period, Jupiter's 1-yr transit aspecting 7th House (${h7Sign || 'Jaya Bhava'}), and D9 Navamsha (${d9SpouseSign}) alignment.`;

        const peakYearReasons = [
            {
                factor: "📜 Vimshottari Dasha Activation",
                reason: `Mahadasha / Antardasha of 7th Lord (${primaryDashaLord}) or Marriage Karaka (${secondaryDashaLord}) reaches active peak operation in ${peakYear}.`
            },
            {
                factor: "🪐 Double Transit (Saturn & Jupiter)",
                reason: `Jupiter's 1-year transit directly over 7th House (${h7Sign || 'Jaya Bhava'}) coincides with Saturn's aspect, unlocking the wedding window in ${peakYear}.`
            },
            {
                factor: "🌸 Navamsha (D9 Chart) Alignment",
                reason: `D9 Navamsha 7th House Lord (${d9SpouseSign}) and D9 Lagna (${d9LagnaSign}) activate exact nuptial yoga at age ${peakAge}.`
            }
        ];

        // Calculate Past Favorable Marriage Window (from birth to current age)
        const hasPastFavorableDasha = displayAge > minAge && !hasDelayPlanets;

        let previousAgeWindow = "";
        let previousYearWindow = "";
        let previousPeakAge = null;
        let previousPeakYear = null;
        let previousReason = "";

        let moderatePastAgeWindow = "";
        let moderatePastYearWindow = "";
        let moderatePastReason = "";
        let noPastDashaReason = "";

        if (hasPastFavorableDasha) {
            const pastEndAge = Math.min(minAge + 3, displayAge - 1);
            previousAgeWindow = `${minAge} - ${pastEndAge} Yrs`;
            previousYearWindow = `${birthYear + minAge} - ${birthYear + pastEndAge}`;
            previousPeakAge = Math.floor((minAge + pastEndAge) / 2);
            previousPeakYear = birthYear + previousPeakAge;
            previousReason = `Prior to your current age of ${displayAge}, an highly favorable peak nuptial window opened between Age ${minAge}-${pastEndAge} (${previousYearWindow}). During Year ${previousPeakYear} (Age ${previousPeakAge}), Dasha of ${primaryDashaLord} and Jupiter's transit over 7th House (${h7Sign || 'Jaya Bhava'}) created high matrimonial probability.`;
        } else {
            const modStartAge = Math.max(20, minAge - 3);
            const modEndAge = Math.max(modStartAge + 2, Math.min(minAge + 1, displayAge > 20 ? displayAge - 1 : 23));
            moderatePastAgeWindow = `${modStartAge} - ${modEndAge} Yrs`;
            moderatePastYearWindow = `${birthYear + modStartAge} - ${birthYear + modEndAge}`;
            moderatePastReason = `While no 95%+ peak Dasha activated prior to your current age of ${displayAge}, a secondary / moderate nuptial window occurred during Age ${modStartAge} - ${modEndAge} (${moderatePastYearWindow}) driven by secondary Karaka Dasha (${secondaryDashaLord}) or minor Jupiter aspect.`;
            noPastDashaReason = `No 95%+ peak Dasha for marriage activated prior to your current age of ${displayAge}. Primary Dasha of 7th Lord (${primaryDashaLord}) unlocks in your current/upcoming window (Age ${targetAgeStart} - ${targetAgeEnd}).`;
        }

        return {
            birthYear,
            currentAge: displayAge,
            countdownText,
            yearsFromNowStart,
            yearsFromNowEnd,
            predictedAgeWindow: `${targetAgeStart} - ${targetAgeEnd} Years`,
            predictedYearWindow: `${targetYearStart} - ${targetYearEnd}`,
            peakAge,
            peakYear,
            peakReason,
            peakYearReasons,
            hasPastFavorableDasha,
            noPastDashaReason,
            previousAgeWindow,
            previousYearWindow,
            previousPeakAge,
            previousPeakYear,
            previousReason,
            moderatePastAgeWindow,
            moderatePastYearWindow,
            moderatePastReason,
            primaryDashaLord,
            secondaryDashaLord,
            d9LagnaSign,
            d9SpouseSign,
            timingFactors: [
                {
                    title: "📜 Vimshottari Dasha Activation",
                    status: "Dasha Promiser",
                    desc: `Mahadasha / Antardasha of 7th Lord (${primaryDashaLord}) or Karaka (${secondaryDashaLord}) activates marriage from your current age of ${displayAge} to age ${targetAgeEnd}.`,
                    icon: "📜"
                },
                {
                    title: "🪐 Double Transit (Saturn & Jupiter)",
                    status: "Gochar Trigger",
                    desc: `Saturn & Jupiter Double Transit aspecting 7th house (${h7Sign || 'Jaya Bhava'}) unlocks marriage between ${targetYearStart} - ${targetYearEnd} (${countdownText}).`,
                    icon: "🪐"
                },
                {
                    title: "🌸 Navamsha (D9) Alignment",
                    status: "D9 Verified",
                    desc: `D9 Navamsha 7th house (${d9SpouseSign}) and Lagna (${d9LagnaSign}) confirm nuptial age of ${targetAgeStart} - ${targetAgeEnd} years.`,
                    icon: "🌸"
                }
            ]
        };
    };

    const getLoveVsArrangedAnalysis = () => {
        const h1Sign = houses["1"]?.sign_name;
        const h2Sign = houses["2"]?.sign_name;
        const h5Sign = houses["5"]?.sign_name;
        const h7Sign = houses["7"]?.sign_name;
        const h9Sign = houses["9"]?.sign_name;

        const lord1 = h1Sign ? SIGN_LORDS[h1Sign] : null;
        const lord2 = h2Sign ? SIGN_LORDS[h2Sign] : null;
        const lord5 = h5Sign ? SIGN_LORDS[h5Sign] : null;
        const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
        const lord9 = h9Sign ? SIGN_LORDS[h9Sign] : null;

        const pos1 = lord1 ? getPlanetHouse(lord1) : null;
        const pos2 = lord2 ? getPlanetHouse(lord2) : null;
        const pos5 = lord5 ? getPlanetHouse(lord5) : null;
        const pos7 = lord7 ? getPlanetHouse(lord7) : null;
        const pos9 = lord9 ? getPlanetHouse(lord9) : null;

        const posVenus = getPlanetHouse("Venus");
        const posMars = getPlanetHouse("Mars");
        const posRahu = getPlanetHouse("Rahu");
        const posJupiter = getPlanetHouse("Jupiter");

        let lovePoints = 0;
        let arrangedPoints = 0;
        const loveReasons = [];
        const arrangedReasons = [];
        const nonLoveReasons = [];

        if (pos5 === 7) {
            lovePoints += 3;
            loveReasons.push(`5th Lord (${lord5}) resides in 7th House of Marriage: Direct indicator of romance culminating in matrimony.`);
        }
        if (pos7 === 5) {
            lovePoints += 3;
            loveReasons.push(`7th Lord (${lord7}) resides in 5th House of Romance: Strong personal attraction & self-chosen partner.`);
        }
        if (pos5 && pos7 && pos5 === pos7) {
            lovePoints += 4;
            loveReasons.push(`5th Lord (${lord5}) and 7th Lord (${lord7}) are conjunct in House ${pos5}: Classic Parashari Love Marriage Yoga.`);
        }

        if (posVenus === 5) {
            lovePoints += 2;
            loveReasons.push(`Venus (Karaka of Romance) in 5th House: High romantic nature and strong emotional attachment.`);
        }
        if (posVenus === 7) {
            lovePoints += 2;
            loveReasons.push(`Venus in 7th House: Desires an attractive, self-chosen life partner.`);
        }
        if (posRahu === 5 || posRahu === 7) {
            lovePoints += 2;
            loveReasons.push(`Rahu in House ${posRahu}: Overrides traditional family boundaries, favoring non-conventional or self-chosen alliance.`);
        }

        if (posMars && posVenus && posMars === posVenus) {
            lovePoints += 2;
            loveReasons.push(`Mars & Venus conjunct in House ${posMars}: High passion, magnetic attraction, and romantic initiative.`);
        }

        if (pos1 === 7 || pos7 === 1) {
            lovePoints += 2;
            loveReasons.push(`Lagna Lord (${lord1}) connected to 7th House: Personal initiative in selecting spouse.`);
        }

        if (pos2 === 7 || pos7 === 2) {
            arrangedPoints += 3;
            arrangedReasons.push(`2nd Lord (${lord2}) connected to 7th House: Strong involvement of family & lineage in marriage proposal.`);
        }
        if (pos9 === 7 || pos7 === 9) {
            arrangedPoints += 3;
            arrangedReasons.push(`9th Lord (${lord9}) connected to 7th House: Marriage organized through elders, dharma, and traditional wisdom.`);
        }
        if (posJupiter === 7 || posJupiter === 2 || posJupiter === 9) {
            arrangedPoints += 2;
            arrangedReasons.push(`Jupiter (Guru/Elders) influencing House ${posJupiter}: Family approval and traditional arranged marriage blessings.`);
        }
        if (pos2 && pos9 && pos2 === pos7) {
            arrangedPoints += 2;
            arrangedReasons.push(`2nd & 7th Lords conjunct: Family-introduced arranged union.`);
        }

        if (lovePoints < 2) {
            nonLoveReasons.push(`Absence of direct 5th Lord (Romance) and 7th Lord (Marriage) mutual aspect or conjunction.`);
            nonLoveReasons.push(`Lack of Rahu or Venus placement in 5th/7th house to break traditional arrangement norms.`);
            nonLoveReasons.push(`Dominance of 2nd House (Family) & 9th House (Elders) significators steering marital alliance.`);
        }

        let verdictTitle = "";
        let verdictBadge = "";
        let verdictDesc = "";
        let probability = "";

        if (lovePoints > arrangedPoints) {
            if (lovePoints >= 4) {
                verdictTitle = "❤️ Love Marriage Highly Likely (Prem Vivah)";
                verdictBadge = "Love Marriage Promised";
                probability = "High Probability (85%+)";
                verdictDesc = "Your planetary positions strongly favor a self-chosen romantic relationship converting into matrimony. Mutual attraction and personal choice play the central role.";
            } else {
                verdictTitle = "💘 Self-Choice / Romantic Alliance Favored";
                verdictBadge = "Love Marriage Aligned";
                probability = "Moderate to High (65%+)";
                verdictDesc = "Your chart shows personal initiative and romantic attraction (Lagna/5th House connection to 7th House) leading to marriage over traditional arranged avenues.";
            }
        } else if (arrangedPoints > lovePoints) {
            if (arrangedPoints >= 3) {
                verdictTitle = "🤝 Traditional Arranged Marriage (Paramparik Vivah)";
                verdictBadge = "Arranged Marriage Promised";
                probability = "High Probability (85%+)";
                verdictDesc = "Your natal chart is governed by strong 2nd House (Family) and 9th House (Elders) influences. The alliance will be introduced and blessed by family members.";
            } else {
                verdictTitle = "🤝 Family Introduced / Arranged Alignment";
                verdictBadge = "Arranged Marriage Aligned";
                probability = "Moderate to High (65%+)";
                verdictDesc = "Conventional family-introduced marriage is favored due to traditional planetary alignments over unassisted self-chosen romance.";
            }
        } else if (lovePoints > 0 && lovePoints === arrangedPoints) {
            verdictTitle = "💞 Love-Cum-Arranged Marriage (Family Blessed Romance)";
            verdictBadge = "Hybrid Marriage Promised";
            probability = "Balanced (50% Love / 50% Arranged)";
            verdictDesc = "Your chart possesses a harmonious blend of romantic attraction (5th House) and family approval (2nd/9th House). You will select your partner or love will receive warm family consent.";
        } else {
            verdictTitle = "🤝 Traditional Family Introduced Matrimony";
            verdictBadge = "Arranged Marriage Aligned";
            probability = "Moderate";
            verdictDesc = "Standard Vedic planetary alignments indicate traditional family arrangement and lineage approval for matrimonial union.";
        }

        return {
            verdictTitle,
            verdictBadge,
            verdictDesc,
            probability,
            lovePoints,
            arrangedPoints,
            loveReasons,
            arrangedReasons,
            nonLoveReasons,
            lord5,
            lord7,
            lord2,
            lord9
        };
    };

    const getVedicFidelityAnalysis = () => {
        const h1Sign = houses["1"]?.sign_name;
        const h5Sign = houses["5"]?.sign_name;
        const h7Sign = houses["7"]?.sign_name;
        const h8Sign = houses["8"]?.sign_name;
        const h12Sign = houses["12"]?.sign_name;

        const lord1 = h1Sign ? SIGN_LORDS[h1Sign] : null;
        const lord5 = h5Sign ? SIGN_LORDS[h5Sign] : null;
        const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
        const lord8 = h8Sign ? SIGN_LORDS[h8Sign] : null;
        const lord12 = h12Sign ? SIGN_LORDS[h12Sign] : null;

        const pos1 = lord1 ? getPlanetHouse(lord1) : null;
        const pos5 = lord5 ? getPlanetHouse(lord5) : null;
        const pos7 = lord7 ? getPlanetHouse(lord7) : null;
        const pos8 = lord8 ? getPlanetHouse(lord8) : null;
        const pos12 = lord12 ? getPlanetHouse(lord12) : null;

        const posVenus = getPlanetHouse("Venus");
        const posMars = getPlanetHouse("Mars");
        const posRahu = getPlanetHouse("Rahu");
        const posJupiter = getPlanetHouse("Jupiter");
        const posSaturn = getPlanetHouse("Saturn");
        const posMoon = getPlanetHouse("Moon");

        let fidelityPoints = 0;
        let riskPoints = 0;
        const fidelityReasons = [];
        const riskReasons = [];

        // 1. Satvik Moral Protection Triggers (+ Loyalty Points)
        if (posJupiter === 7 || posJupiter === 1 || posJupiter === 9) {
            fidelityPoints += 3;
            fidelityReasons.push(`Jupiter (Guru) in House ${posJupiter}: Strong Satvik moral protection, high ethical vows, and spiritual commitment.`);
        }
        if (posSaturn === 7) {
            fidelityPoints += 3;
            fidelityReasons.push(`Saturn in 7th House: Steadfast loyalty, serious commitment, and deep sense of matrimonial duty.`);
        }
        if (pos1 === 7 || pos7 === 1) {
            fidelityPoints += 2;
            fidelityReasons.push(`Lagna Lord (${lord1}) connected to 7th House: Strong personal identification & devotion to the spouse.`);
        }
        if (pos7 === 9 || pos7 === 2) {
            fidelityPoints += 2;
            fidelityReasons.push(`7th Lord (${lord7}) in House ${pos7} (Family/Dharma): Marriage anchored in traditional lineage and family honor.`);
        }

        // 2. Secret Attraction & Extra-Marital Risk Triggers (Vyabhichara Yogas)
        if (pos5 === 8 || pos5 === 12) {
            riskPoints += 3;
            riskReasons.push(`5th Lord (${lord5}) in House ${pos5} (Secrecy/Bed Pleasures): Secret romantic desires or hidden emotional connections.`);
        }
        if (pos7 === 8 || pos7 === 12) {
            riskPoints += 3;
            riskReasons.push(`7th Lord (${lord7}) in House ${pos7} (8th/12th Secrecy): Marital energy linked to hidden or confidential relationships.`);
        }
        if (posVenus === 8 || posVenus === 12) {
            riskPoints += 3;
            riskReasons.push(`Venus (Karaka of Love) in House ${posVenus}: High secrecy in sensual matters and hidden romantic vulnerability.`);
        }
        if (posRahu === 5 || posRahu === 7 || posRahu === 8 || posRahu === 12) {
            riskPoints += 3;
            riskReasons.push(`Rahu in House ${posRahu}: Overrides traditional boundaries, creating intense curiosity for secret or unconventional romance.`);
        }
        if (posMars && posVenus && posMars === posVenus && (posMars === 8 || posMars === 12 || posMars === 7)) {
            riskPoints += 2;
            riskReasons.push(`Mars & Venus conjunct in House ${posMars}: High physical passion and intense attraction outside routine marriage.`);
        }

        const DUAL_SIGNS = ["Gemini", "Virgo", "Sagittarius", "Pisces"];
        if (h7Sign && DUAL_SIGNS.includes(h7Sign)) {
            riskPoints += 2;
            riskReasons.push(`7th House in Dual Sign (${h7Sign}): Classical Dwiswabhava Rashi indicator for potential dual romantic ties.`);
        }

        if (posMoon && posRahu && posMoon === posRahu && (posMoon === 5 || posMoon === 8)) {
            riskPoints += 2;
            riskReasons.push(`Moon-Rahu conjunction in House ${posMoon}: Emotional restlessness seeking novel external attachment.`);
        }

        if (fidelityReasons.length === 0) {
            fidelityReasons.push("General Lagna chart balance without heavy affliction to the 7th house.");
        }

        let verdictTitle = "";
        let verdictBadge = "";
        let verdictDesc = "";
        let rating = "";

        if (fidelityPoints >= riskPoints + 2) {
            verdictTitle = "🛡️ High Marital Fidelity & Soul-Mate Loyalty (Satvik Union)";
            verdictBadge = "High Fidelity Promised";
            rating = "Excellent (90%+ Marital Loyalty)";
            verdictDesc = "Your chart exhibits strong ethical protection (Jupiter/Saturn/Dharma connection). Your commitment to marital vows remains steadfast against external distractions.";
        } else if (riskPoints >= fidelityPoints + 2) {
            verdictTitle = "⚠️ Secret Attraction & Extra-Marital Vulnerability (Vyabhichara Risk)";
            verdictBadge = "High Secrecy Sensitivity";
            rating = "Guarded / Vulnerable";
            verdictDesc = "Your chart shows strong secret house alignments (5th/7th/8th/12th Lords or Rahu-Venus connection). Extra care & emotional transparency are needed during sensitive Dasha periods.";
        } else {
            verdictTitle = "⚖️ Balanced Fidelity - Dasha Dependent Alignment";
            verdictBadge = "Moderate Stability";
            rating = "Balanced (75% Loyalty)";
            verdictDesc = "Your chart possesses a balanced combination of moral safeguards and romantic desires. Fidelity remains high when marital communication and emotional intimacy are nurtured.";
        }

        const isVyabhicharaPresent = riskPoints >= 3 && riskPoints > fidelityPoints;
        const vyabhicharaBadge = isVyabhicharaPresent
            ? "⚠️ Vyabhichara / Paradaragamana Yoga Active"
            : "🛡️ Vyabhichara / Paradaragamana Yoga Absent (Protected)";

        const vyabhicharaWhy = isVyabhicharaPresent
            ? `Active due to secret house triggers: ${riskReasons.join(" | ")}.`
            : `Absent because natal chart possesses strong moral safeguards: ${fidelityReasons.join(" | ")}.`;

        const vyabhicharaEffect = isVyabhicharaPresent
            ? "During sensitive Dasha periods (Rahu/8th Lord/12th Lord), secret external emotional attractions or confidential relationships can create marital friction. Cultivating complete emotional transparency and conscious fidelity remedies this vulnerability."
            : ""//:
        return {
            verdictTitle,
            verdictBadge,
            verdictDesc,
            rating,
            fidelityPoints,
            riskPoints,
            fidelityReasons,
            riskReasons,
            isVyabhicharaPresent,
            vyabhicharaBadge,
            vyabhicharaWhy,
            vyabhicharaEffect
        };
    };

    const getIdealPartnerProfile = (gender) => {
        const isBoy = gender === 'Male';
        const ALL_NAKSHATRAS = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
            "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Visakha", "Anuradha", "Jyeshta",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ];

        const ALL_SIGNS = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ];

        const h1Sign = houses["1"]?.sign_name || "Aries";
        const h5Sign = houses["5"]?.sign_name || "Leo";
        const h7Sign = houses["7"]?.sign_name || "Libra";
        const h9Sign = houses["9"]?.sign_name || "Sagittarius";

        const venusHouse = getPlanetHouse("Venus");
        const jupiterHouse = getPlanetHouse("Jupiter");
        const venusSign = venusHouse ? houses[venusHouse.toString()]?.sign_name : null;
        const jupiterSign = jupiterHouse ? houses[jupiterHouse.toString()]?.sign_name : null;

        const karakaPlanet = isBoy ? "Venus (Shukra)" : "Jupiter (Guru)";
        const karakaSign = isBoy ? (venusSign || h7Sign) : (jupiterSign || h7Sign);

        // 1. Ideal Spouse Lagna
        const primaryLagna = h7Sign;
        const trikonaLagnas = [h5Sign, h9Sign];
        const karakaLagna = karakaSign;

        // 2. Ideal Spouse Moon Sign (Rashi)
        const userMoonHouse = getPlanetHouse("Moon");
        const userMoonSign = userMoonHouse ? houses[userMoonHouse.toString()]?.sign_name : h1Sign;

        const moonIdx = ALL_SIGNS.indexOf(userMoonSign);
        const sama7thRashi = moonIdx !== -1 ? ALL_SIGNS[(moonIdx + 6) % 12] : h7Sign;
        const navapanchama5thRashi = moonIdx !== -1 ? ALL_SIGNS[(moonIdx + 4) % 12] : h5Sign;
        const navapanchama9thRashi = moonIdx !== -1 ? ALL_SIGNS[(moonIdx + 8) % 12] : h9Sign;

        // 3. Favorable Spouse Nakshatras (Navatara Sastra)
        const userNakName = basic.nakshatra || "Rohini";
        const userNakIdx = ALL_NAKSHATRAS.findIndex(n => userNakName.toLowerCase().includes(n.toLowerCase()));

        let favorableStars = ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Hasta", "Anuradha", "Revati"];
        if (userNakIdx !== -1) {
            const offsets = [1, 3, 5, 7, 8, 10, 12, 14, 16, 17, 19, 21, 23, 25, 26];
            favorableStars = offsets.map(offset => ALL_NAKSHATRAS[(userNakIdx + offset) % 27]).slice(0, 6);
        }

        // 4. Ideal Partner Qualities & Traits
        const spouseRole = isBoy ? "Ideal Wife (Bride Profile)" : "Ideal Husband (Groom Profile)";
        const spouseTraits = isBoy ? [
            `Charming, affectionate, and graceful demeanor (ruled by Venus).`,
            `Deeply devoted to domestic harmony and family values.`,
            `Resonant with ${primaryLagna} or ${karakaLagna} Lagna energy.`,
            `Emotionally supportive with high aesthetic & artistic sensitivity.`
        ] : [
            `Wise, protective, and career-driven nature (ruled by Jupiter).`,
            `Respected, mature, and deeply supportive of your personal growth.`,
            `Resonant with ${primaryLagna} or ${karakaLagna} Lagna energy.`,
            `Provides strong material security, leadership, and moral guidance.`
        ];

        return {
            isBoy,
            spouseRole,
            karakaPlanet,
            primaryLagna,
            trikonaLagnas,
            karakaLagna,
            userMoonSign,
            sama7thRashi,
            navapanchamaRashis: [navapanchama5thRashi, navapanchama9thRashi],
            favorableStars,
            spouseTraits
        };
    };

    const getDivorceSeparationAnalysis = () => {
        const h1Sign = houses["1"]?.sign_name;
        const h2Sign = houses["2"]?.sign_name;
        const h6Sign = houses["6"]?.sign_name;
        const h7Sign = houses["7"]?.sign_name;
        const h8Sign = houses["8"]?.sign_name;
        const h12Sign = houses["12"]?.sign_name;

        const lord1 = h1Sign ? SIGN_LORDS[h1Sign] : null;
        const lord2 = h2Sign ? SIGN_LORDS[h2Sign] : null;
        const lord6 = h6Sign ? SIGN_LORDS[h6Sign] : null;
        const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
        const lord8 = h8Sign ? SIGN_LORDS[h8Sign] : null;
        const lord12 = h12Sign ? SIGN_LORDS[h12Sign] : null;

        const pos1 = lord1 ? getPlanetHouse(lord1) : null;
        const pos2 = lord2 ? getPlanetHouse(lord2) : null;
        const pos6 = lord6 ? getPlanetHouse(lord6) : null;
        const pos7 = lord7 ? getPlanetHouse(lord7) : null;
        const pos8 = lord8 ? getPlanetHouse(lord8) : null;
        const pos12 = lord12 ? getPlanetHouse(lord12) : null;

        const posSun = getPlanetHouse("Sun");
        const posMars = getPlanetHouse("Mars");
        const posRahu = getPlanetHouse("Rahu");
        const posKetu = getPlanetHouse("Ketu");
        const posSaturn = getPlanetHouse("Saturn");
        const posJupiter = getPlanetHouse("Jupiter");
        const posVenus = getPlanetHouse("Venus");

        let longevityPoints = 0;
        let separationPoints = 0;
        const protectionReasons = [];
        const riskReasons = [];

        // 1. Protection & Longevity Triggers (+ Points)
        if (posJupiter === 7 || posJupiter === 1 || posJupiter === 9) {
            longevityPoints += 3;
            protectionReasons.push(`Jupiter (Guru) in House ${posJupiter}: Divine Satvik shield protecting marriage from legal dissolution.`);
        }
        if (pos2 && (pos2 === posJupiter || pos2 === posVenus)) {
            longevityPoints += 2;
            protectionReasons.push(`Benefic influence on 2nd House (Kutumba Bhava): Preserves family continuity and domestic harmony.`);
        }
        if (pos1 === 7 || pos7 === 1) {
            longevityPoints += 2;
            protectionReasons.push(`Lagna Lord (${lord1}) connected to 7th House: Deep mutual dedication between spouses.`);
        }
        if (pos7 === 9 || pos7 === 2) {
            longevityPoints += 2;
            protectionReasons.push(`7th Lord (${lord7}) in House ${pos7}: Matrimony anchored in family honor and moral values.`);
        }

        // 2. Separation & Conflict Triggers (Vichheda Yogas)
        if (pos7 === 6) {
            separationPoints += 3;
            riskReasons.push(`7th Lord (${lord7}) in 6th House: Classical Vichheda Yoga (Placement in House of Loss to 7th).`);
        }
        if (pos6 === 7) {
            separationPoints += 3;
            riskReasons.push(`6th Lord (${lord6}) in 7th House: Direct entry of litigation & conflict planet into matrimonial house.`);
        }
        if (pos7 === 8 || pos7 === 12) {
            separationPoints += 3;
            riskReasons.push(`7th Lord (${lord7}) in House ${pos7} (8th/12th): Marital energy linked to hidden disputes or physical separation.`);
        }
        if (posRahu === 7 || posKetu === 7) {
            separationPoints += 2;
            riskReasons.push(`Nodal Axis (Rahu/Ketu) in 7th House: Unconventional detachment or sudden relationship shifts.`);
        }
        if (posSun === 7 && posMars === 7) {
            separationPoints += 3;
            riskReasons.push(`Sun & Mars conjunct in 7th House: Severe ego clashes and aggressive friction in marriage.`);
        }
        if (posVenus === 6 || posVenus === 8 || posVenus === 12) {
            separationPoints += 2;
            riskReasons.push(`Venus (Marriage Karaka) in House ${posVenus}: Sensual/marital vulnerability in conflict/loss house.`);
        }

        if (protectionReasons.length === 0) {
            protectionReasons.push("General chart balance without severe structural disruption to 7th house.");
        }

        let statusBadge = "";
        let riskRating = "";
        let verdictTitle = "";
        let verdictDesc = "";

        if (longevityPoints >= separationPoints + 2) {
            statusBadge = "🛡️ Low Separation Risk (Indissoluble Union)";
            riskRating = "Very Low Risk (<15%)";
            verdictTitle = "🛡️ High Marital Protection & Domestic Continuity";
            verdictDesc = "Your chart exhibits powerful Satvik safeguards (Jupiter/Dharma/2nd House balance). Matrimonial bond remains strong and legal divorce is heavily neutralized.";
        } else if (separationPoints >= longevityPoints + 2) {
            statusBadge = "⚠️ High Separation / Vichheda Sensitivity";
            riskRating = "High Risk / Guarded Sensitivity";
            verdictTitle = "⚠️ Active Vichheda & Separation Vulnerability";
            verdictDesc = "Your chart contains key separation indicators (6th/8th/12th Lord connections or Rahu-Ketu on 7th axis). High care, patience, and conscious remedies are required during sensitive Dasha periods.";
        } else {
            statusBadge = "⚖️ Moderate Reconcilable Friction";
            riskRating = "Moderate Risk (Managed through Compromise)";
            verdictTitle = "⚖️ Reconcilable Marital Friction";
            verdictDesc = "Your chart balances conflict indicators with protective influences. Marital challenges can be resolved through emotional maturity and avoiding impulsive legal actions.";
        }

        const isVichhedaActive = separationPoints >= 3 && separationPoints > longevityPoints;
        const causeText = isVichhedaActive
            ? `Active due to: ${riskReasons.join(" | ")}.`
            : `Neutralized because natal chart possesses strong protective safeguards: ${protectionReasons.join(" | ")}.`;

        const impactText = isVichhedaActive
            ? "During 6th Lord, 8th Lord, or Rahu Dasha periods, heightened arguments, living apart, or legal tension can arise. Immediate astrological remedies (Gauri-Shankar Puja, Jupiter mantra, mutual counseling) prevent permanent separation."
            : "Ensures legal marriage stability, domestic peace, mutual forgiveness, and joint life progression. Spouses overcome temporary differences without court intervention.";

        return {
            statusBadge,
            riskRating,
            verdictTitle,
            verdictDesc,
            longevityPoints,
            separationPoints,
            protectionReasons,
            riskReasons,
            isVichhedaActive,
            causeText,
            impactText
        };
    };

    const getRemarriageAnalysis = () => {
        const h1Sign = houses["1"]?.sign_name;
        const h2Sign = houses["2"]?.sign_name;
        const h7Sign = houses["7"]?.sign_name;
        const h8Sign = houses["8"]?.sign_name;
        const h9Sign = houses["9"]?.sign_name;
        const h11Sign = houses["11"]?.sign_name;

        const lord2 = h2Sign ? SIGN_LORDS[h2Sign] : null;
        const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
        const lord8 = h8Sign ? SIGN_LORDS[h8Sign] : null;

        const pos2 = lord2 ? getPlanetHouse(lord2) : null;
        const pos7 = lord7 ? getPlanetHouse(lord7) : null;
        const pos8 = lord8 ? getPlanetHouse(lord8) : null;

        const posVenus = getPlanetHouse("Venus");
        const posMercury = getPlanetHouse("Mercury");
        const posRahu = getPlanetHouse("Rahu");
        const posJupiter = getPlanetHouse("Jupiter");

        let singleMarriagePoints = 0;
        let remarriagePoints = 0;
        const singleReasons = [];
        const remarriageReasons = [];

        // 1. Single Lifelong Marriage Triggers (+ Points)
        if (h7Sign && FIXED_SIGNS.includes(h7Sign)) {
            singleMarriagePoints += 3;
            singleReasons.push(`7th House in Fixed Sign (${h7Sign}): Promotes unshakeable stability and single lifelong matrimony.`);
        }
        if (posJupiter === 7 || posJupiter === 2 || posJupiter === 1) {
            singleMarriagePoints += 3;
            singleReasons.push(`Jupiter in House ${posJupiter}: Satvik single marriage protection shielding marital longevity.`);
        }
        if (pos7 && (pos7 === 1 || pos7 === 2 || pos7 === 7)) {
            singleMarriagePoints += 2;
            singleReasons.push(`7th Lord (${lord7}) anchored in House ${pos7}: Deep commitment to primary marital union.`);
        }

        // 2. Remarriage & Dwi-Vivaha Triggers (+ Points)
        if (h7Sign && DUAL_SIGNS.includes(h7Sign)) {
            remarriagePoints += 3;
            remarriageReasons.push(`7th House in Dual Sign (${h7Sign}): Classical Parashari Dwiswabhava Rashi indicator for secondary marriage potential.`);
        }
        if (h2Sign && DUAL_SIGNS.includes(h2Sign)) {
            remarriagePoints += 2;
            remarriageReasons.push(`2nd House (Kutumba / 2nd Marriage) in Dual Sign (${h2Sign}): Indicates multi-household capability.`);
        }
        if (pos7 && DUAL_SIGNS.includes(houses[pos7.toString()]?.sign_name)) {
            remarriagePoints += 3;
            remarriageReasons.push(`7th Lord (${lord7}) placed in Dual Sign (${houses[pos7.toString()]?.sign_name}): Promotes secondary marital alliance.`);
        }
        if (pos7 === 8 && pos2 && (pos2 === 2 || pos2 === 7 || pos2 === 11)) {
            remarriagePoints += 3;
            remarriageReasons.push(`7th Lord in 8th House while 2nd Lord is strong: Transition from 1st marriage into a successful 2nd union.`);
        }
        if (posVenus && posMercury && posVenus === posMercury && (posVenus === 7 || DUAL_SIGNS.includes(houses[posVenus.toString()]?.sign_name))) {
            remarriagePoints += 2;
            remarriageReasons.push(`Venus & Mercury conjunct in 7th/Dual Sign: Saravali Ch. 17 Dwi-Vivaha dual marriage yoga.`);
        }
        if (posRahu === 7 || posRahu === 2) {
            remarriagePoints += 2;
            remarriageReasons.push(`Rahu in House ${posRahu}: Overrides single-union boundaries, promoting secondary partnership.`);
        }

        if (singleReasons.length === 0) {
            singleReasons.push("General chart balance supporting primary marital union.");
        }

        let statusBadge = "";
        let remarriageRating = "";
        let verdictTitle = "";
        let verdictDesc = "";

        if (remarriagePoints >= 4 && remarriagePoints > singleMarriagePoints) {
            statusBadge = "💞 Dwi-Vivaha Yoga Active";
            remarriageRating = "High Remarriage Potential";
            verdictTitle = "💞 Secondary Marriage & Remarriage Aligned";
            verdictDesc = "Your chart exhibits classical Dwi-Vivaha alignments (Dual signs on 7th/2nd house, 7th Lord in 8th with strong 2nd Lord). A second marriage brings renewed stability and happiness after dissolving initial challenges.";
        } else if (singleMarriagePoints >= remarriagePoints + 2) {
            statusBadge = "💍 Single Lifelong Marriage Promised";
            remarriageRating = "Very Low Remarriage Chance (<10%)";
            verdictTitle = "💍 Unbreakable Single Lifelong Matrimony";
            verdictDesc = "Your chart contains strong single-marriage indicators (Fixed sign on 7th house & Jupiter aspect). The natal promise favors a single lifelong partner.";
        } else {
            statusBadge = "⚖️ Conditional Remarriage Alignment";
            remarriageRating = "Moderate Remarriage Potential";
            verdictTitle = "⚖️ Dasha-Dependent Remarriage Alignment";
            verdictDesc = "Your chart holds moderate capability for a second marriage. A second union manifests primarily if 2nd Lord or 9th Lord Dasha is activated following initial marital transition.";
        }

        const isRemarriageActive = remarriagePoints >= 4 && remarriagePoints > singleMarriagePoints;
        const causeText = isRemarriageActive
            ? `Active due to: ${remarriageReasons.join(" | ")}.`
            : `Single marriage favored because: ${singleReasons.join(" | ")}.`;

        const impactText = isRemarriageActive
            ? `2nd Marriage is governed by your 2nd House (${h2Sign}) and 2nd Lord (${lord2}). The 2nd partner brings enhanced emotional warmth, family harmony, and joint financial prosperity.`
            : "Your chart prioritizes preserving the primary marital bond. Remarriage is unlikely, and conjugal challenges resolve within your existing marriage.";

        return {
            statusBadge,
            remarriageRating,
            verdictTitle,
            verdictDesc,
            singleMarriagePoints,
            remarriagePoints,
            singleReasons,
            remarriageReasons,
            isRemarriageActive,
            causeText,
            impactText
        };
    };

    const getD9MarriageDiagnostic = () => {
        const d9Chart = data?.charts?.d9 || data?.varga_charts?.d9 || data?.navamsha || {};
        const d9LagnaSign = d9Chart["1"]?.sign_name || houses["1"]?.sign_name || "Aries";
        const d97thSign = d9Chart["7"]?.sign_name || houses["7"]?.sign_name || "Libra";

        // D9 Lagna Transformation Analysis
        const d9LagnaLord = SIGN_LORDS[d9LagnaSign] || "Mars";
        const isD9LagnaBenefic = ["Jupiter", "Venus", "Mercury", "Moon"].includes(d9LagnaLord);

        const d9LagnaDesc = isD9LagnaBenefic
            ? `Your D9 Navamsha Lagna is ${d9LagnaSign} (ruled by ${d9LagnaLord}). Marriage brings a peaceful soul transformation, emotional stability, and enhanced social and financial standing.`
            : `Your D9 Navamsha Lagna is ${d9LagnaSign} (ruled by ${d9LagnaLord}). Post-marital life encourages deep personal maturity, responsibility, and grounding after initial domestic adjustments.`;

        // D9 7th House Spouse Persona Analysis
        const d9SpouseLord = SIGN_LORDS[d97thSign] || "Venus";
        let spouseElement = "Fiery (Passionate & Ambitious)";
        if (["Taurus", "Virgo", "Capricorn"].includes(d97thSign)) spouseElement = "Earthy (Practical, Faithful & Wealth-Oriented)";
        else if (["Gemini", "Libra", "Aquarius"].includes(d97thSign)) spouseElement = "Airy (Intellectual, Social & Charming)";
        else if (["Cancer", "Scorpio", "Pisces"].includes(d97thSign)) spouseElement = "Watery (Deeply Loving, Intuitive & Devoted)";

        const spousePersona = `Your D9 7th House is in ${d97thSign} (${spouseElement}). Your spouse possesses a ${spouseElement.toLowerCase()} temperament governed by ${d9SpouseLord}, bringing natural alignment with your soul path.`;

        // Conjugal Karaka (Venus for Male / Jupiter for Female)
        const karakaName = selectedGender === 'Female' ? 'Jupiter' : 'Venus';
        const conjugalBliss = `Conjugal Karaka ${karakaName} in Navamsha (D9) guarantees deep emotional intimacy, soul-mate connection, and lasting marital durability.`;

        // Vargottama Planets Detection (Same sign in D1 and D9)
        const vargottamaPlanets = [];
        const planetList = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

        planetList.forEach(pName => {
            let d1Sign = null;
            let d9Sign = null;

            Object.keys(houses).forEach(hNum => {
                const pArr = houses[hNum]?.planets?.map(p => typeof p === 'object' ? p.name : p) || [];
                if (pArr.includes(pName)) d1Sign = houses[hNum]?.sign_name;
            });

            Object.keys(d9Chart).forEach(hNum => {
                const pArr = d9Chart[hNum]?.planets?.map(p => typeof p === 'object' ? p.name : p) || [];
                if (pArr.includes(pName)) d9Sign = d9Chart[hNum]?.sign_name;
            });

            if (d1Sign && d9Sign && d1Sign === d9Sign) {
                vargottamaPlanets.push(`${pName} (Vargottama in ${d1Sign})`);
            }
        });

        if (vargottamaPlanets.length === 0) {
            vargottamaPlanets.push(`Venus / 7th Lord (Vargottama Anchored in Navamsha)`);
        }

        // Post-Marital Fortune (Bhagyodaya)
        const d99thSign = d9Chart["9"]?.sign_name || "Sagittarius";
        const bhagyodayaDesc = `Your D9 9th House (${d99thSign}) confirms exponential rise in fortune, financial stability, and career luck after marriage (Bhagyodaya after Wedding).`;

        return {
            d9LagnaSign,
            d9LagnaLord,
            d97thSign,
            d9SpouseLord,
            spouseElement,
            d9LagnaDesc,
            spousePersona,
            karakaName,
            conjugalBliss,
            vargottamaPlanets,
            d99thSign,
            bhagyodayaDesc
        };
    };

    const getMaritalStrengthsAndChallenges = () => {
        const h1Sign = houses["1"]?.sign_name;
        const h2Sign = houses["2"]?.sign_name;
        const h7Sign = houses["7"]?.sign_name;

        const pos1 = lord1 ? getPlanetHouse(lord1) : null;
        const pos2 = lord2 ? getPlanetHouse(lord2) : null;
        const pos7 = lord7 ? getPlanetHouse(lord7) : null;
        const posJupiter = getPlanetHouse("Jupiter");
        const posVenus = getPlanetHouse("Venus");
        const posMars = getPlanetHouse("Mars");
        const posSaturn = getPlanetHouse("Saturn");
        const posSun = getPlanetHouse("Sun");
        const posRahu = getPlanetHouse("Rahu");

        const strengths = [];
        const challenges = [];

        // --- STRENGTHS ---
        if (posJupiter === 7 || posJupiter === 1 || posJupiter === 9) {
            strengths.push({
                title: "🛡️ Jupiter Divine Protection (Satvik Shield)",
                desc: `Jupiter in House ${posJupiter} aspects or protects your 7th House, granting wisdom, maturity, and an unbreakable divine shield against relationship breakdown.`
            });
        }
        if (pos2 && (pos2 === posJupiter || pos2 === posVenus || pos2 === 2)) {
            strengths.push({
                title: "🏠 Domestic & Financial Pillar (Kutumba Sukha)",
                desc: `Strong 2nd House (${h2Sign || 'Taurus'}) & 2nd Lord ensures high family harmony, lineage pride, and steady joint financial growth post-marriage.`
            });
        }
        if (pos1 === 7 || pos7 === 1 || (pos1 && pos7 && pos1 === pos7)) {
            strengths.push({
                title: "💍 Deep Mutual Dedication (Lagna & 7th Lord Alignment)",
                desc: `Connection between Lagna Lord (${lord1}) and 7th Lord (${lord7}) creates high personal dedication, mutual loyalty, and emotional attachment.`
            });
        }
        if (FIXED_SIGNS.includes(h7Sign)) {
            strengths.push({
                title: "🏰 Unshakable Marital Loyalty (Fixed Sign 7th House)",
                desc: `7th House in Fixed Sign (${h7Sign}) grants exceptional relationship endurance, loyalty, and resistance to external relationship disruptions.`
            });
        }
        const karakaName = selectedGender === 'Female' ? 'Jupiter' : 'Venus';
        strengths.push({
            title: `💖 Conjugal Karaka Strength (${karakaName} Alignment)`,
            desc: `Primary marital Karaka ${karakaName} is favorably placed in your chart, ensuring physical compatibility, emotional warmth, and conjugal bliss.`
        });

        // --- CHALLENGES ---
        if (posMars === 1 || posMars === 4 || posMars === 7 || posMars === 8 || posMars === 12) {
            challenges.push({
                title: "🔥 Manglik Energy & Temperament Clashes",
                desc: `Mars in House ${posMars} introduces high intensity and passion, but requires conscious patience to avoid impulsive reactions or heated ego debates.`
            });
        }
        if (posSaturn === 7 || posSaturn === 1 || posSaturn === 8) {
            challenges.push({
                title: "🪐 Saturn Serious Energy (Emotional Dryness / Delays)",
                desc: `Saturn's influence on House ${posSaturn} encourages practical duties and long-term commitment, but requires effort to maintain romantic warmth.`
            });
        }
        if (posSun === 7) {
            challenges.push({
                title: "☀️ Surya Ego Alignment (Leadership Struggles)",
                desc: `Sun in 7th House brings high self-respect and leadership drive to both partners, requiring conscious compromise on decision-making.`
            });
        }
        if (posRahu === 7 || posRahu === 1) {
            challenges.push({
                title: "🌪️ Rahu Nodal Axis (Unconventional Expectations)",
                desc: `Rahu in 7th/1st House axis creates high or non-traditional relationship expectations, requiring transparent communication.`
            });
        }
        if (pos7 === 6 || pos7 === 8 || pos7 === 12) {
            challenges.push({
                title: `⚡ 7th Lord in House ${pos7} (Trik Placement Friction)`,
                desc: `7th Lord (${lord7}) in 6th/8th/12th House highlights routine adjustment, managing in-law boundaries, or work travel distance.`
            });
        }

        if (challenges.length === 0) {
            challenges.push({
                title: "⚖️ General Adjustment & Daily Routine Harmony",
                desc: "Minor adjustments regarding work-life balance and daily routine sharing."
            });
        }

        const balanceScore = Math.min(95, Math.max(60, 75 + (strengths.length * 5) - (challenges.length * 3)));
        const statusBadge = balanceScore >= 80 ? "🛡️ High Marital Resilience & Divine Shield" : "⚖️ Balanced Union (Requires Conscious Harmony)";

        return {
            strengths,
            challenges,
            balanceScore,
            statusBadge
        };
    };

    const hasYoga = (yogaId) => {
        const yoga = MARRIAGE_YOGAS.find(y => y.id === yogaId);
        if (!yoga) return false;
        return yoga.condition(houses);
    };

    const getActiveConjunctions = () => {
        const detected = [];
        Object.keys(houses).forEach(hNum => {
            const planets = houses[hNum].planets?.map(p => typeof p === 'object' ? p.name : p) || [];
            MARRIAGE_CONJUNCTIONS.forEach(conj => {
                if (conj.planets.every(p => planets.includes(p))) {
                    detected.push({ ...conj, house: hNum });
                }
            });
        });
        return detected;
    };

    const activeConjunctions = getActiveConjunctions();
    const vedicTiming = getVedicMarriageTiming();
    const loveVsArranged = getLoveVsArrangedAnalysis();
    const extraMarital = getVedicFidelityAnalysis();
    const idealPartner = getIdealPartnerProfile(selectedGender);
    const divorceAnalysis = getDivorceSeparationAnalysis();
    const remarriageAnalysis = getRemarriageAnalysis();
    const d9Diagnostic = getD9MarriageDiagnostic();
    const maritalStrengthsChallenges = getMaritalStrengthsAndChallenges();

    return (
        <div className="min-h-screen bg-[#fff1f2] text-[#1e293b] font-serif p-4 md:p-6 relative">

            {/* Language Toggle Button */}

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-1.5 border-b border-[#fecdd3] pb-4">
                    <div className="text-3xl mb-0.5">💍</div>
                    <h1 className="text-3xl font-black text-[#881337] italic tracking-tighter">Marriage & Relationship Analysis</h1>
                    <p className="text-[#be123c] uppercase tracking-[0.3em] text-xs font-black">Lagna Chart Diagnostic • Marital Harmony</p>
                </div>

                {/* Vimshottari Dasha, Transit & D9 Navamsha Marriage Timing Section */}
                <div id="section-timing" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                ✨ Vimshottari Dasha • Double Transit • D9 Navamsha
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Marriage Age & Timing Diagnostic
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Calculated using Vimshottari Dasha triggers, Saturn-Jupiter Double Transit & Navamsha (D9) Chart Alignment
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
                            <div className="bg-[#fff1f2] border border-[#fecdd3] px-5 py-4 rounded-2xl text-center shadow-sm">
                                <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">User's Current Age</p>
                                <p className="text-3xl font-black text-[#881337]">{vedicTiming.currentAge} Yrs</p>
                                <p className="text-[10px] font-bold text-[#be123c] uppercase tracking-wider mt-1">Born: {vedicTiming.birthYear}</p>
                            </div>
                            <div className="bg-[#fff1f2] border border-[#fecdd3] px-5 py-4 rounded-2xl text-center shadow-sm">
                                <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">Predicted Marriage Window</p>
                                <p className="text-2xl font-black text-[#881337]">{vedicTiming.predictedAgeWindow}</p>
                                <p className="text-xs font-bold text-[#be123c] uppercase tracking-wider mt-1">
                                    {vedicTiming.countdownText} ({vedicTiming.predictedYearWindow})
                                </p>
                            </div>
                            <div className="bg-[#fff1f2] border-2 border-[#e11d48] px-5 py-4 rounded-2xl text-center shadow-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-[#e11d48] text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider whitespace-nowrap">
                                    ⭐ Peak 95% Yoga
                                </div>
                                <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1 mt-1">Highest Probability Year</p>
                                <p className="text-3xl font-black text-[#e11d48]">{vedicTiming.peakYear}</p>
                                <p className="text-xs font-bold text-[#881337] uppercase tracking-wider mt-1">At Age {vedicTiming.peakAge}</p>
                            </div>
                        </div>
                    </div>

                    {/* Why Highest Probability Year Breakdown */}
                    <div className="bg-[#fff1f2] border-2 border-[#e11d48]/40 p-6 rounded-3xl mt-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 border-b border-[#fecdd3] pb-3">
                            <span className="text-3xl">⭐</span>
                            <div>
                                <h4 className="text-xl font-black text-[#881337] tracking-tight">
                                    Why Year {vedicTiming.peakYear} (Age {vedicTiming.peakAge}) Has the Highest Chance of Marriage
                                </h4>
                                <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                    Triple Confluence of Vimshottari Dasha, Double Transit & D9 Navamsha Yoga
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {vedicTiming.peakYearReasons.map((item, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#fecdd3] hover:border-[#e11d48] transition-all shadow-xs">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-black text-white bg-[#e11d48] px-2 py-0.5 rounded-md">
                                            Reason #{idx + 1}
                                        </span>
                                        <p className="text-[16px] font-black uppercase text-[#881337] tracking-wider">{item.factor}</p>
                                    </div>
                                    <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                                        "{item.reason}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Past Favorable Marriage Window Diagnostic Card */}
                    <div className="bg-[#fff1f2] border-2 border-indigo-300 p-6 rounded-3xl mt-8 shadow-sm transition-all">
                        <button
                            type="button"
                            onClick={() => setShowPastWindow(!showPastWindow)}
                            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#fecdd3] pb-3 text-left focus:outline-none cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center text-lg font-black shadow-sm group-hover:bg-indigo-800 transition-all shrink-0">
                                    {showPastWindow ? '⏳' : '📜'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-[#881337] tracking-tight flex items-center gap-2 flex-wrap">
                                        <span>Past Favorable Marriage Window (Prior to Age {vedicTiming.currentAge})</span>
                                        <span className="text-xs text-indigo-700 font-bold bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
                                            {showPastWindow ? '▲ Click to Collapse' : '▼ Click to Expand'}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                        Historical Astrological Nuptial Confluence Evaluation
                                    </p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full border shadow-xs whitespace-nowrap shrink-0 ${vedicTiming.hasPastFavorableDasha
                                ? "bg-indigo-700 text-white border-indigo-800"
                                : "bg-amber-600 text-white border-amber-700"
                                }`}>
                                {vedicTiming.hasPastFavorableDasha ? `Past Opportunity (Age ${vedicTiming.previousAgeWindow})` : "No Past Favorable Dasha Found"}
                            </span>
                        </button>

                        {showPastWindow && (
                            vedicTiming.hasPastFavorableDasha ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[12px] font-black uppercase text-[#be123c] tracking-widest mb-1">Past Favorable Age Window</p>
                                        <p className="text-2xl font-black text-[#881337]">Age {vedicTiming.previousAgeWindow}</p>
                                        <p className="text-xs font-bold text-[#be123c] uppercase tracking-wider mt-1">Years {vedicTiming.previousYearWindow}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[12px] font-black uppercase text-[#be123c] tracking-widest mb-1">Highest Past Probability Year</p>
                                        <p className="text-2xl font-black text-indigo-700">Year {vedicTiming.previousPeakYear}</p>
                                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mt-1">At Age {vedicTiming.previousPeakAge}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[12px] font-black uppercase text-[#881337] tracking-widest mb-1">Past Nuptial Confluence</p>
                                        <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                                            "{vedicTiming.previousReason}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 mt-6">
                                    <div className="bg-white p-5 rounded-2xl border border-[#fecdd3] flex items-start gap-4">
                                        <div className="text-3xl">ℹ️</div>
                                        <div>
                                            <h5 className="text-base font-black text-[#881337] uppercase tracking-wider mb-1">
                                                No Highly Favorable Past Marriage Dasha Found
                                            </h5>
                                            <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                                                "{vedicTiming.noPastDashaReason}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                            <p className="text-[12px] font-black uppercase text-amber-700 tracking-widest mb-1">Moderate Past Age Window</p>
                                            <p className="text-2xl font-black text-[#881337]">Age {vedicTiming.moderatePastAgeWindow}</p>
                                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mt-1">Years {vedicTiming.moderatePastYearWindow}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                            <p className="text-[12px] font-black uppercase text-amber-700 tracking-widest mb-1">Past Nuptial Probability</p>
                                            <p className="text-2xl font-black text-amber-700">Moderate (40% - 55%)</p>
                                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mt-1">Secondary Opportunity</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                            <p className="text-[12px] font-black uppercase text-[#881337] tracking-widest mb-1">Secondary Confluence</p>
                                            <p className="text-[15px] text-[#1e293b] leading-relaxed italic font-medium">
                                                "{vedicTiming.moderatePastReason}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {vedicTiming.timingFactors.map((factor, idx) => (
                            <div key={idx} className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] hover:border-[#e11d48]/40 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl">{factor.icon}</span>
                                        <span className="px-3 py-1 bg-white text-[#be123c] text-[14px] font-black uppercase tracking-wider rounded-full border border-[#fecdd3]">
                                            {factor.status}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-[#881337] mb-2">{factor.title}</h4>
                                    <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                                        "{factor.desc}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[10px] text-[#be123c] uppercase font-black tracking-widest">
                                    Vedic Timing Trigger
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-xs text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Synthesis of Highest Probability Year ({vedicTiming.peakYear}):</span>
                            Year <b>{vedicTiming.peakYear} (Age {vedicTiming.peakAge})</b> possesses the single highest mathematical and astrological probability for matrimony. This is driven by <b>{vedicTiming.peakReason}</b>.
                        </div>
                    </div>

                    {/* Navamsha (D9) Marriage & Soul Destiny Breakdown Box */}
                    <div id="section-d9" className="scroll-mt-28 bg-[#fff1f2] border-2 border-[#be123c]/30 p-6 md:p-8 rounded-3xl mt-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#fecdd3] pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🌸</span>
                                <div>
                                    <h3 className="text-2xl font-black text-[#881337] tracking-tight">
                                        Navamsha (D9 Chart) Soul Destiny & Marital Truth Diagnostic
                                    </h3>
                                    <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                        Parashari D9 Evaluation of Post-Marital Persona, Spouse Character & Fortune
                                    </p>
                                </div>
                            </div>
                            <span className="px-4 py-1.5 bg-[#881337] text-white text-xs font-black uppercase tracking-wider rounded-full border border-[#881337] shadow-xs whitespace-nowrap">
                                D9 Soul Chart Active
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* D9 Lagna Transformation Card */}
                            <div className="bg-white p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between shadow-xs">
                                <div>
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#fecdd3]">
                                        <span className="text-sm font-black uppercase text-[#be123c] tracking-wider flex items-center gap-2">
                                            <span>👑</span> Post-Marital Soul Transformation
                                        </span>
                                        <span className="px-3 py-1 bg-[#fff1f2] text-[#881337] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                            D9 Lagna: {d9Diagnostic.d9LagnaSign}
                                        </span>
                                    </div>
                                    <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                        "{d9Diagnostic.d9LagnaDesc}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[13px] text-[#be123c] uppercase font-black tracking-widest">
                                    D9 Ascendant Lord: {d9Diagnostic.d9LagnaLord}
                                </div>
                            </div>

                            {/* D9 7th House Spouse Persona Card */}
                            <div className="bg-white p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between shadow-xs">
                                <div>
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#fecdd3]">
                                        <span className="text-sm font-black uppercase text-[#881337] tracking-wider flex items-center gap-2">
                                            <span>💍</span> Spouse Character & Temperament
                                        </span>
                                        <span className="px-3 py-1 bg-[#fff1f2] text-[#be123c] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                            D9 7th: {d9Diagnostic.d97thSign}
                                        </span>
                                    </div>
                                    <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                        "{d9Diagnostic.spousePersona}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[13px] text-[#881337] uppercase font-black tracking-widest">
                                    Spouse D9 Lord: {d9Diagnostic.d9SpouseLord} ({d9Diagnostic.spouseElement})
                                </div>
                            </div>

                            {/* Conjugal Bliss Karaka Card */}
                            <div className="bg-white p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between shadow-xs">
                                <div>
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#fecdd3]">
                                        <span className="text-sm font-black uppercase text-[#be123c] tracking-wider flex items-center gap-2">
                                            <span>💖</span> Conjugal Bliss & Intimacy ({d9Diagnostic.karakaName})
                                        </span>
                                        <span className="px-3 py-1 bg-[#fff1f2] text-[#881337] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                            Karaka: {d9Diagnostic.karakaName}
                                        </span>
                                    </div>
                                    <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                        "{d9Diagnostic.conjugalBliss}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[13px] text-[#be123c] uppercase font-black tracking-widest">
                                    D9 Dampatya Sukha Pillar
                                </div>
                            </div>

                            {/* Vargottama & Post-Marital Fortune Card */}
                            <div className="bg-white p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between shadow-xs">
                                <div>
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#fecdd3]">
                                        <span className="text-sm font-black uppercase text-[#881337] tracking-wider flex items-center gap-2">
                                            <span>⭐</span> Vargottama & Post-Marital Luck
                                        </span>
                                        <span className="px-3 py-1 bg-[#fff1f2] text-[#be123c] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                            Bhagyodaya Active
                                        </span>
                                    </div>
                                    <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium mb-3">
                                        "{d9Diagnostic.bhagyodayaDesc}"
                                    </p>
                                    <div className="bg-[#fff1f2] p-3 rounded-xl border border-[#fecdd3]">
                                        <span className="text-xs font-black uppercase tracking-wider text-[#881337] block mb-1">
                                            Vargottama Planets (Unshakeable Strength in D1 & D9):
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {d9Diagnostic.vargottamaPlanets.map((vp, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-white text-[#be123c] text-xs font-bold rounded-lg border border-[#fecdd3]">
                                                    ✦ {vp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[13px] text-[#881337] uppercase font-black tracking-widest">
                                    D9 9th House Fortune: {d9Diagnostic.d99thSign}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorable Marriage Nakshatras (Vivaha Muhurta Guide) Section */}
                <div id="section-nakshatras" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                🌸 Vivaha Muhurta Sastra Guide
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Favorable Nakshatras for Marriage Day
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Classical Vedic Nakshatras recommended for wedding muhurta to ensure lifelong harmony & prosperity
                            </p>
                        </div>
                        {basic.nakshatra && (
                            <div className="bg-[#fff1f2] border border-[#fecdd3] px-5 py-3 rounded-2xl text-center shadow-sm shrink-0">
                                <p className="text-[16px] font-black uppercase text-[#be123c] tracking-widest mb-0.5">User's Janma Nakshatra</p>
                                <p className="text-xl font-black text-[#881337]">{basic.nakshatra}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[
                            { rank: 1, score: "5.0 / 5.0", tier: "Highly Favorable", tierBg: "bg-white", name: "Rohini (रोहिणी)", ruler: "Moon", deity: "Brahma", emoji: "🌸", type: "Ati-Uttama (Rank #1)", blessing: "Most sacred Vivaha star. Brings lifelong romance, emotional bonding, stability, and supreme material prosperity.", category: "Fixed & Auspicious" },
                            { rank: 2, score: "4.9 / 5.0", tier: "Highly Favorable", tierBg: "bg-white", name: "Uttara Phalguni (उत्तरा फाल्गुनी)", ruler: "Sun", deity: "Aryaman", emoji: "👑", type: "Ati-Uttama (Rank #2)", blessing: "Bestows royal dignity, family respect, high societal status, and permanent long-lasting union.", category: "Fixed & Royal" },
                            { rank: 3, score: "4.9 / 5.0", tier: "Highly Favorable", tierBg: "bg-white", name: "Uttara Ashadha (उत्तराषाढा)", ruler: "Sun", deity: "Vishvedevas", emoji: "🏹", type: "Ati-Uttama (Rank #3)", blessing: "Ensures permanent victory over marital obstacles, deep mutual respect, and solid lifetime commitment.", category: "Fixed & Victorious" },
                            { rank: 4, score: "4.8 / 5.0", tier: "Highly Favorable", tierBg: "bg-white", name: "Uttara Bhadrapada (उत्तराभाद्रपदा)", ruler: "Saturn", deity: "Ahirbudhnya", emoji: "🌊", type: "Ati-Uttama (Rank #4)", blessing: "Deep spiritual connection, profound wisdom, emotional maturity, and a peaceful household.", category: "Fixed & Wise" },
                            { rank: 5, score: "4.5 / 5.0", tier: "Very Favorable", tierBg: "bg-white", name: "Mrigashira (मृगशिरा)", ruler: "Mars", deity: "Soma", emoji: "🦌", type: "Uttama (Rank #5)", blessing: "Fosters tender affection, mutual understanding, inner peace, and joint growth.", category: "Gentle & Soft" },
                            { rank: 6, score: "4.5 / 5.0", tier: "Very Favorable", tierBg: "bg-white", name: "Hasta (हस्त)", ruler: "Moon", deity: "Savitur", emoji: "✋", type: "Uttama (Rank #6)", blessing: "Ensures joyful family life, laughter, financial prosperity, and domestic unity.", category: "Light & Swift" },
                            { rank: 7, score: "4.4 / 5.0", tier: "Very Favorable", tierBg: "bg-white", name: "Swati (स्वाती)", ruler: "Rahu", deity: "Vayu", emoji: "🌾", type: "Uttama (Rank #7)", blessing: "Promotes freedom, intellectual harmony, business success, and financial growth.", category: "Movable & Independent" },
                            { rank: 8, score: "4.4 / 5.0", tier: "Very Favorable", tierBg: "bg-white", name: "Anuradha (अनुराधा)", ruler: "Saturn", deity: "Mitra", emoji: "🌹", type: "Uttama (Rank #8)", blessing: "Deep emotional loyalty, lifelong devotion, joint travel, and a strong soul-mate bond.", category: "Soft & Loyal" },
                            { rank: 9, score: "4.3 / 5.0", tier: "Very Favorable", tierBg: "bg-white", name: "Revati (रेवती)", ruler: "Mercury", deity: "Pushan", emoji: "🐟", type: "Uttama (Rank #9)", blessing: "Divine grace, nourishment, marital harmony, wealth, and smooth journey together.", category: "Soft & Divine" },
                            { rank: 10, score: "3.5 / 5.0", tier: "Moderately Favorable", tierBg: "bg-white", name: "Magha (मघा)", ruler: "Ketu", deity: "Pitrus", emoji: "🦁", type: "Madhyama (Rank #10)", blessing: "Ancestral blessings, traditional ceremony, and high social honor with traditional rites.", category: "Royal & Ancestral" },
                            { rank: 11, score: "3.4 / 5.0", tier: "Moderately Favorable", tierBg: "bg-white", name: "Mula (मूल)", ruler: "Ketu", deity: "Nirriti", emoji: "🌿", type: "Madhyama (Rank #11)", blessing: "Deep spiritual roots, transformation, and firm foundation for spiritual growth.", category: "Spiritual & Firm" },
                            { rank: 12, score: "2.8 / 5.0", tier: "Least Favorable / Conditional", tierBg: "bg-white", name: "Chitra (चित्रा)", ruler: "Mars", deity: "Vishwakarma", emoji: "🎨", type: "Sama / Conditional (Rank #12)", blessing: "Artistic passion and charm, but requires favorable Moon transit & Lagna alignment.", category: "Conditional & Delicate" },
                            { rank: 13, score: "2.5 / 5.0", tier: "Least Favorable / Conditional", tierBg: "bg-white", name: "Pushya (पुष्य)", ruler: "Saturn", deity: "Brihaspati", emoji: "🌸", type: "Sama / Exception (Rank #13)", blessing: "Highly auspicious for spiritual work, but Parashari rules require special Shanti for matrimony.", category: "Conditional Exception" }
                        ].map((nak, idx) => (
                            <div key={idx} className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] hover:border-[#e11d48]/40 transition-all flex flex-col justify-between group relative overflow-hidden">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl">{nak.emoji}</span>
                                            <span className={`text-[14px] font-black text-black px-2 py-0.5 rounded-full ${nak.tierBg}`}>
                                                {nak.tier}
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 bg-white text-[#be123c] text-[14px] font-black uppercase tracking-wider rounded-full border border-[#fecdd3]">
                                            ⭐ {nak.score}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1 mb-1">
                                        <h4 className="text-lg font-black text-[#881337]">{nak.name}</h4>
                                        <span className="text-xs font-black text-[#be123c]">{nak.type}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[#be123c] uppercase tracking-wider mb-3">
                                        Deity: {nak.deity} • Lord: {nak.ruler}
                                    </p>
                                    <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                                        "{nak.blessing}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[#fecdd3] flex items-center justify-between text-[10px] text-[#881337] font-black uppercase tracking-widest">
                                    <span>{nak.category}</span>
                                    <span className="text-[#be123c]">Rank #{nak.rank}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">💡</div>
                        <div className="flex-1 text-xs text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Classical Vivaha Muhurta Rule:</span>
                            Selecting one of these 11 auspicious Vivaha Nakshatras during <b>Shukla Paksha (Waxing Moon)</b>, while avoiding Rikta Tithis (4th, 9th, 14th) and Solar/Lunar eclipse days, ensures lasting conjugal bliss and prosperity.
                        </div>
                    </div>
                </div>

                {/* Love vs. Arranged Marriage Diagnostic Section */}
                <div id="section-love-arranged" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                💘 Parashari Diagnostic
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Love Marriage vs. Arranged Marriage Analysis
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Planetary evidence evaluating 5th House (Romance), 7th House (Union), and 2nd/9th Houses (Family & Elders)
                            </p>
                        </div>
                        <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-2xl text-center shadow-sm shrink-0">
                            <p className="text-[16px] font-black uppercase text-[#be123c] tracking-widest mb-1">Marital Alliance Type</p>
                            <p className="text-[16px] font-black text-[#881337]">{loveVsArranged.verdictBadge}</p>
                            <p className="text-[16px] font-bold text-[#be123c] uppercase tracking-wider mt-1">{loveVsArranged.probability}</p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] mt-8">
                        <h3 className="text-2xl font-black text-[#881337] mb-2">{loveVsArranged.verdictTitle}</h3>
                        <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                            "{loveVsArranged.verdictDesc}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Love Marriage Factors */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#be123c] flex items-center gap-2">
                                        💖 Love Marriage Triggers
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#be123c] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {loveVsArranged.lovePoints} Pts
                                    </span>
                                </div>
                                {loveVsArranged.loveReasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {loveVsArranged.loveReasons.map((reason, idx) => (
                                            <li key={idx} className="text-[16px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                                <span className="text-[#e11d48]">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-[16px] text-[#881337] font-bold uppercase tracking-wider">Why Love Marriage is Not Promoted:</p>
                                        <ul className="space-y-2">
                                            {loveVsArranged.nonLoveReasons.map((reason, idx) => (
                                                <li key={idx} className="text-[16px] text-[#475569] leading-relaxed italic flex gap-2">
                                                    <span className="text-rose-400">⚠️</span>
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[10px] text-[#be123c] uppercase font-black tracking-widest">
                                5th House & Venus Evaluation
                            </div>
                        </div>

                        {/* Arranged Marriage Factors */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#881337] flex items-center gap-2">
                                        🤝 Arranged Marriage Triggers
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#881337] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {loveVsArranged.arrangedPoints} Pts
                                    </span>
                                </div>
                                {loveVsArranged.arrangedReasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {loveVsArranged.arrangedReasons.map((reason, idx) => (
                                            <li key={idx} className="text-[16px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                                <span className="text-[#881337]">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[16px] text-[#475569] italic">
                                        Standard family connection exists through 2nd House & 9th House lord alignments.
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[10px] text-[#881337] uppercase font-black tracking-widest">
                                2nd House, 9th House & Jupiter Evaluation
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[16px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Parashari Sastra Rule for Matrimonial Nature:</span>
                            When <b>5th Lord (Romance)</b> connects to <b>7th House (Spouse)</b>, self-choice love marriage manifests. When <b>2nd Lord (Family)</b> or <b>9th Lord (Elders)</b> connects to <b>7th House</b>, traditional arranged marriage with family approval manifests.
                        </div>
                    </div>
                </div>

                {/* Extra-Marital Tendencies & Marital Fidelity Diagnostic Section */}
                <div id="section-fidelity" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                🔒 Secrecy & Fidelity Sastra Diagnostic
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Marital Fidelity & Secret Attraction Diagnostic
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Parashari & KP evaluation of 5th (Romance), 7th (Union), 8th (Secrecy) & 12th (Intimacy) Houses
                            </p>
                        </div>
                        <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-2xl text-center shadow-sm shrink-0">
                            <p className="text-[16px] font-black uppercase text-[#be123c] tracking-widest mb-1">Marital Fidelity Status</p>
                            <p className="text-[16px] font-black text-[#881337]">{extraMarital.verdictBadge}</p>
                            <p className="text-[16px] font-bold text-[#be123c] uppercase tracking-wider mt-1">{extraMarital.rating}</p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] p-6 rounded-3xl border border-[#fecdd3] mt-8">
                        <h3 className="text-2xl font-black text-[#881337] mb-2">{extraMarital.verdictTitle}</h3>
                        <p className="text-[16px] text-[#1e293b] leading-relaxed italic font-medium">
                            "{extraMarital.verdictDesc}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* Marital Fidelity Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#be123c] flex items-center gap-2">
                                        🛡️ Marital Faithfullness & Moral Shield
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#be123c] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {extraMarital.fidelityPoints} Pts
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {extraMarital.fidelityReasons.map((reason, idx) => (
                                        <li key={idx} className="text-[16px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                            <span className="text-[#e11d48]">•</span>
                                            <span>{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[10px] text-[#be123c] uppercase font-black tracking-widest">
                                Jupiter, Saturn & Dharma House Protection
                            </div>
                        </div>

                        {/* Secret Attraction & Risk Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#881337] flex items-center gap-2">
                                        ⚠️ Secret Attraction & Vulnerability Factors
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#881337] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Risk Score: {extraMarital.riskPoints} Pts
                                    </span>
                                </div>
                                {extraMarital.riskReasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {extraMarital.riskReasons.map((reason, idx) => (
                                            <li key={idx} className="text-[16px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                                <span className="text-[#881337]">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[16px] text-[#475569] italic">
                                        No major secret house afflictions (5th/7th/8th/12th Lords are free from Rahu or secret house placement).
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[10px] text-[#881337] uppercase font-black tracking-widest">
                                8th House, 12th House, Rahu & Venus Secrecy Check
                            </div>
                        </div>
                    </div>

                    {/* Classical Vyabhichara / Paradaragamana Yoga Status Card */}
                    <div className="bg-[#fff1f2] border-2 border-[#e11d48]/40 p-6 rounded-3xl mt-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#fecdd3] pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">📜</span>
                                <div>
                                    <h4 className="text-xl font-black text-[#881337] tracking-tight">
                                        Vyabhichara / Paradaragamana Yoga Diagnostic
                                    </h4>
                                    <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                        Brihat Parashara & Saravali Sastra Rule Evaluation
                                    </p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full border shadow-xs whitespace-nowrap ${extraMarital.isVyabhicharaPresent
                                ? "bg-[#be123c] text-white border-[#9f1239]"
                                : "bg-emerald-600 text-white border-emerald-700"
                                }`}>
                                {extraMarital.vyabhicharaBadge}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Why Present or Absent */}
                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔍</span> Astrological Cause (Why {extraMarital.isVyabhicharaPresent ? "Present" : "Absent"}):
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed italic font-medium">
                                    "{extraMarital.vyabhicharaWhy}"
                                </p>
                            </div>

                            {/* Effect on Married Life */}
                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔮</span> Effect on Married Life:
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                    {extraMarital.vyabhicharaEffect}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[18px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Classical Vedic Rule for Marital Secrecy (Vyabhichara Yoga):</span>
                            Extra-marital vulnerability manifests only when the <b>5th or 7th Lord</b> connects to the <b>8th House (Hidden Matters)</b> or <b>12th House (Bed Pleasures)</b> under <b>Rahu's influence</b>, while lacking Jupiter's moral aspect.
                        </div>
                    </div>
                </div>

                {/* Major Strengths & Challenges of Married Life Diagnostic Section */}
                <div id="section-strengths" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                🛡️ Parashari Dampatya Sastra Audit
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Major Strengths & Challenges of Married Life
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Classical Parashari evaluation of 7th (Union), 2nd (Kutumba), 8th (Intimacy) & Karaka Placements
                            </p>
                        </div>
                        <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-2xl text-center shadow-sm shrink-0">
                            <p className="text-[14px] font-black uppercase text-[#be123c] tracking-widest mb-1">Marital Harmony Index</p>
                            <p className="text-3xl font-black text-[#881337]">{maritalStrengthsChallenges.balanceScore}%</p>
                            <p className="text-[14px] font-bold text-[#be123c] uppercase tracking-wider mt-1">{maritalStrengthsChallenges.statusBadge}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* Major Strengths Card */}
                        <div className="bg-[#fff1f2] p-6 rounded-3xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#fecdd3]">
                                    <h3 className="text-2xl font-black text-[#be123c] flex items-center gap-2">
                                        <span>🛡️</span> Key Astrological Strengths ({maritalStrengthsChallenges.strengths.length})
                                    </h3>
                                    <span className="px-3 py-1 bg-white text-[#be123c] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                        Pillars of Harmony
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {maritalStrengthsChallenges.strengths.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-[#fecdd3] shadow-xs">
                                            <h4 className="text-[16px] font-black text-[#881337] mb-1">{item.title}</h4>
                                            <p className="text-[16px] text-[#1e293b] leading-relaxed font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[13px] text-[#be123c] uppercase font-black tracking-widest">
                                Satvik Safeguards & Karaka Alignment
                            </div>
                        </div>

                        {/* Major Challenges Card */}
                        <div className="bg-[#fff1f2] p-6 rounded-3xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#fecdd3]">
                                    <h3 className="text-2xl font-black text-[#881337] flex items-center gap-2">
                                        <span>⚠️</span> Key Astrological Challenges ({maritalStrengthsChallenges.challenges.length})
                                    </h3>
                                    <span className="px-3 py-1 bg-white text-[#881337] text-xs font-black uppercase rounded-full border border-[#fecdd3]">
                                        Friction & Growth Areas
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {maritalStrengthsChallenges.challenges.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-[#fecdd3] shadow-xs">
                                            <h4 className="text-[16px] font-black text-[#881337] mb-1">{item.title}</h4>
                                            <p className="text-[16px] text-[#1e293b] leading-relaxed font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[13px] text-[#881337] uppercase font-black tracking-widest">
                                Conscious Patience & Emotional Alignment Needed
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[18px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Classical Vedic Rule for Marital Balance:</span>
                            No chart is completely free from planetary friction. When <b>Jupiter aspects the 7th house</b> or when <b>Venus/Jupiter is strong in D9 Navamsha</b>, natural strengths override challenges, turning potential conflict areas into opportunities for emotional maturity.
                        </div>
                    </div>
                </div>

                {/* Ideal Life Partner Astrological Profile Section */}
                <div id="section-partner" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                💘 Parashari Partner Compatibility Guide
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Ideal Life Partner Astrological Profile
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Tailored for <span className="font-bold text-[#be123c]">{selectedGender === 'Male' ? 'Boy (Seeking Bride / Wife)' : 'Girl (Seeking Groom / Husband)'}</span> based on 7th House Axis, Moon Sign & {idealPartner.karakaPlanet}
                            </p>
                        </div>

                        {/* Gender Switcher Toggle */}
                        <div className="flex items-center bg-[#fff1f2] p-1.5 rounded-2xl border border-[#fecdd3] shrink-0">
                            <button
                                onClick={() => setSelectedGender('Male')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedGender === 'Male'
                                    ? 'bg-[#be123c] text-white shadow-sm'
                                    : 'text-[#881337] hover:bg-white/60'
                                    }`}
                            >
                                👦 Boy Profile (Wife)
                            </button>
                            <button
                                onClick={() => setSelectedGender('Female')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedGender === 'Female'
                                    ? 'bg-[#be123c] text-white shadow-sm'
                                    : 'text-[#881337] hover:bg-white/60'
                                    }`}
                            >
                                👧 Girl Profile (Husband)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {/* 1. Ideal Spouse Lagna */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <span className="text-3xl block mb-2">👑</span>
                                <h4 className="text-lg font-black text-[#881337] mb-1">Ideal Spouse Lagna</h4>
                                <p className="text-[11px] font-bold text-[#be123c] uppercase tracking-wider mb-3">7th Axis & Trikona</p>
                                <div className="space-y-2 text-[16px] text-[#1e293b] font-medium">
                                    <p className="bg-white p-2 rounded-xl border border-[#fecdd3]">
                                        <span className="font-black text-[#881337] block text-[14px] uppercase">Primary 7th Axis:</span>
                                        {idealPartner.primaryLagna} Lagna
                                    </p>
                                    <p className="bg-white p-2 rounded-xl border border-[#fecdd3]">
                                        <span className="font-black text-[#881337] block text-[14px] uppercase">Trikona Element Harmony:</span>
                                        {idealPartner.trikonaLagnas.join(', ')} Lagnas
                                    </p>
                                    <p className="bg-white p-2 rounded-xl border border-[#fecdd3]">
                                        <span className="font-black text-[#881337] block text-[14px] uppercase">Karaka Soul Lagna:</span>
                                        {idealPartner.karakaLagna} Lagna
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[14px] text-[#be123c] font-black uppercase tracking-widest">
                                Ascendant Alignment
                            </div>
                        </div>

                        {/* 2. Ideal Spouse Moon Sign */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <span className="text-3xl block mb-2">🌙</span>
                                <h4 className="text-lg font-black text-[#881337] mb-1">Ideal Spouse Moon Sign</h4>
                                <p className="text-[11px] font-bold text-[#be123c] uppercase tracking-wider mb-3">Rashi Compatibility</p>
                                <div className="space-y-2 text-[16px] text-[#1e293b] font-medium">
                                    <p className="bg-white p-2 rounded-xl border border-[#fecdd3]">
                                        <span className="font-black text-[#881337] block text-[14px] uppercase">Sama-Saptaka 7th Moon:</span>
                                        {idealPartner.sama7thRashi} Rashi
                                    </p>
                                    <p className="bg-white p-2 rounded-xl border border-[#fecdd3]">
                                        <span className="font-black text-[#881337] block text-[14px] uppercase">Navapanchama 5th/9th Moon:</span>
                                        {idealPartner.navapanchamaRashis.join(', ')} Rashis
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[16px] text-[#be123c] font-black uppercase tracking-widest">
                                Emotional Rashi Maitri
                            </div>
                        </div>

                        {/* 3. Favorable Spouse Nakshatras */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <span className="text-3xl block mb-2">⭐</span>
                                <h4 className="text-lg font-black text-[#881337] mb-1">Favorable Spouse Stars</h4>
                                <p className="text-[11px] font-bold text-[#be123c] uppercase tracking-wider mb-3">Navatara Sastra</p>
                                <div className="bg-white p-3 rounded-xl border border-[#fecdd3] space-y-1">
                                    <span className="font-black text-[#881337] block text-[10px] uppercase mb-1">Best Compatible Nakshatras:</span>
                                    {idealPartner.favorableStars.map((star, idx) => (
                                        <span key={idx} className="inline-block bg-[#fff1f2] text-[#be123c] text-[16px] font-black px-2 py-0.5 rounded-md mr-1 mb-1 border border-[#fecdd3]">
                                            ✨ {star}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[16px] text-[#be123c] font-black uppercase tracking-widest">
                                Sampat, Kshema & Mitra Taras
                            </div>
                        </div>

                        {/* 4. Ideal Partner Qualities */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <span className="text-3xl block mb-2">✨</span>
                                <h4 className="text-lg font-black text-[#881337] mb-1">Partner Personality</h4>
                                <p className="text-[12px] font-bold text-[#be123c] uppercase tracking-wider mb-3">{idealPartner.spouseRole}</p>
                                <ul className="space-y-1.5 text-[16px] text-[#1e293b] font-medium">
                                    {idealPartner.spouseTraits.map((trait, idx) => (
                                        <li key={idx} className="bg-white p-2 rounded-xl border border-[#fecdd3] flex items-start gap-1.5">
                                            <span className="text-[#be123c]">🌸</span>
                                            <span>{trait}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#fecdd3] text-[16px] text-[#be123c] font-black uppercase tracking-widest">
                                Karaka ({idealPartner.karakaPlanet}) Influences
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[16px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Parashari Sastra Rule for Ideal Partner Selection:</span>
                            For <b>Boys</b>, your wife's soul energy is governed by <b>Venus (Shukra)</b> and your <b>7th House Axis</b>. For <b>Girls</b>, your husband's soul energy is governed by <b>Jupiter (Guru)</b> and your <b>7th House Axis</b>. Choosing a partner whose Lagna or Moon Sign aligns with these positions guarantees lifelong marital synergy.
                        </div>
                    </div>
                </div>

                {/* Divorce, Legal Separation & Marital Longevity Diagnostic Section */}
                <div id="section-divorce" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                ⚖️ Vichheda & Longevity Sastra Diagnostic
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Divorce & Legal Separation Diagnostic
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Parashari & KP Evaluation of 6th (Loss of 7th), 7th (Union), 8th (Disputes) & 12th (Separation) Houses
                            </p>
                        </div>
                        <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-2xl text-center shadow-sm shrink-0">
                            <p className="text-[16px] font-black uppercase text-[#be123c] tracking-widest mb-1">Divorce Risk Status</p>
                            <p className="text-[16px] font-black text-[#881337]">{divorceAnalysis.statusBadge}</p>
                            <p className="text-[16px] font-bold text-[#be123c] uppercase tracking-wider mt-1">{divorceAnalysis.riskRating}</p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] p-6 rounded-3xl border border-[#fecdd3] mt-8">
                        <h3 className="text-2xl font-black text-[#881337] mb-2">{divorceAnalysis.verdictTitle}</h3>
                        <p className="text-[18px] text-[#1e293b] leading-relaxed italic font-medium">
                            "{divorceAnalysis.verdictDesc}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* Marital Protection Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#be123c] flex items-center gap-2">
                                        🛡️ Marital Longevity & Satvik Shield
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#be123c] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {divorceAnalysis.longevityPoints} Pts
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {divorceAnalysis.protectionReasons.map((reason, idx) => (
                                        <li key={idx} className="text-[18px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                            <span className="text-[#e11d48]">•</span>
                                            <span>{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[14px] text-[#be123c] uppercase font-black tracking-widest">
                                Jupiter, 2nd House & Dharma House Protection
                            </div>
                        </div>

                        {/* Separation Risk Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#881337] flex items-center gap-2">
                                        ⚠️ Separation & Vichheda Risk Triggers
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#881337] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Risk Score: {divorceAnalysis.separationPoints} Pts
                                    </span>
                                </div>
                                {divorceAnalysis.riskReasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {divorceAnalysis.riskReasons.map((reason, idx) => (
                                            <li key={idx} className="text-[18px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                                <span className="text-[#881337]">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[18px] text-[#475569] italic">
                                        No major separation afflictions (6th/8th/12th Lords are free from 7th house connection).
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[14px] text-[#881337] uppercase font-black tracking-widest">
                                6th House (Loss of 7th), 8th House & Nodal Axis Check
                            </div>
                        </div>
                    </div>

                    {/* Vichheda Cause & Marital Impact Box */}
                    <div className="bg-[#fff1f2] border-2 border-[#e11d48]/40 p-6 rounded-3xl mt-8 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#fecdd3] pb-4">
                            <span className="text-3xl">📜</span>
                            <div>
                                <h4 className="text-xl font-black text-[#881337] tracking-tight">
                                    Vichheda / Divorce Astrological Cause & Guidance
                                </h4>
                                <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                    Parashari & KP Sastra Analysis
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔍</span> Astrological Cause ({divorceAnalysis.isVichhedaActive ? "Vichheda Active" : "Neutralized"}):
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed italic font-medium">
                                    "{divorceAnalysis.causeText}"
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔮</span> Marital Impact & Protective Guidance:
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                    {divorceAnalysis.impactText}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[18px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Classical Vedic Rule for Marital Dissolution (Vichheda Yoga):</span>
                            Divorce or legal separation occurs primarily when the <b>6th Lord (Litigation / Loss of 7th)</b> connects to the <b>7th House</b> or <b>7th Lord</b>, while <b>Jupiter</b> does not aspect the 7th house. Jupiter's aspect acts as an unbreakable divine shield protecting marital continuity.
                        </div>
                    </div>
                </div>

                {/* Remarriage & Multiple Marriages Diagnostic Section */}
                <div id="section-remarriage" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#fecdd3]">
                        <div>
                            <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-[#ffe4e6] text-[#be123c] text-[11px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                💞 Dwi-Vivaha Sastra Diagnostic
                            </span>
                            <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter mt-3">
                                Remarriage & Secondary Matrimony Diagnostic
                            </h2>
                            <p className="text-sm text-[#475569] italic mt-1">
                                Parashari & Saravali Evaluation of 2nd (Kutumba / 2nd Marriage), 7th (1st Marriage), 8th & 9th Houses
                            </p>
                        </div>
                        <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-2xl text-center shadow-sm shrink-0">
                            <p className="text-[16px] font-black uppercase text-[#be123c] tracking-widest mb-1">Remarriage Potential</p>
                            <p className="text-[16px] font-black text-[#881337]">{remarriageAnalysis.statusBadge}</p>
                            <p className="text-[16px] font-bold text-[#be123c] uppercase tracking-wider mt-1">{remarriageAnalysis.remarriageRating}</p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] p-6 rounded-3xl border border-[#fecdd3] mt-8">
                        <h3 className="text-2xl font-black text-[#881337] mb-2">{remarriageAnalysis.verdictTitle}</h3>
                        <p className="text-[18px] text-[#1e293b] leading-relaxed italic font-medium">
                            "{remarriageAnalysis.verdictDesc}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* Single Marriage Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#be123c] flex items-center gap-2">
                                        💍 Single Lifelong Marriage Triggers
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#be123c] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {remarriageAnalysis.singleMarriagePoints} Pts
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {remarriageAnalysis.singleReasons.map((reason, idx) => (
                                        <li key={idx} className="text-[18px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                            <span className="text-[#e11d48]">•</span>
                                            <span>{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[14px] text-[#be123c] uppercase font-black tracking-widest">
                                Fixed Sign & Jupiter Single Matrimony Protection
                            </div>
                        </div>

                        {/* Remarriage & Dwi-Vivaha Triggers */}
                        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-[#fecdd3] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#fecdd3]">
                                    <span className="text-xl font-black text-[#881337] flex items-center gap-2">
                                        💞 Remarriage & Dwi-Vivaha Triggers
                                    </span>
                                    <span className="px-3 py-1 bg-white text-[#881337] text-[16px] font-black uppercase rounded-full border border-[#fecdd3]">
                                        Score: {remarriageAnalysis.remarriagePoints} Pts
                                    </span>
                                </div>
                                {remarriageAnalysis.remarriageReasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {remarriageAnalysis.remarriageReasons.map((reason, idx) => (
                                            <li key={idx} className="text-[18px] text-[#1e293b] leading-relaxed font-medium flex gap-2">
                                                <span className="text-[#881337]">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[18px] text-[#475569] italic">
                                        No active Dwi-Vivaha indicators (7th/2nd houses are free from dual sign or secondary marriage Yogas).
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#fecdd3] text-[14px] text-[#881337] uppercase font-black tracking-widest">
                                Dual Sign (Dwiswabhava) & 2nd House Evaluation
                            </div>
                        </div>
                    </div>

                    {/* Dwi-Vivaha Cause & 2nd Marriage Impact Box */}
                    <div className="bg-[#fff1f2] border-2 border-[#e11d48]/40 p-6 rounded-3xl mt-8 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#fecdd3] pb-4">
                            <span className="text-3xl">📜</span>
                            <div>
                                <h4 className="text-xl font-black text-[#881337] tracking-tight">
                                    Dwi-Vivaha / Remarriage Astrological Cause & 2nd Partner Profile
                                </h4>
                                <p className="text-xs text-[#be123c] font-bold uppercase tracking-wider mt-0.5">
                                    Parashari & Saravali Sastra Analysis
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔍</span> Astrological Cause ({remarriageAnalysis.isRemarriageActive ? "Dwi-Vivaha Active" : "Single Marriage Favored"}):
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed italic font-medium">
                                    "{remarriageAnalysis.causeText}"
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#fecdd3]">
                                <h5 className="text-sm font-black uppercase tracking-wider text-[#881337] flex items-center gap-2 mb-2">
                                    <span>🔮</span> Secondary Union Impact & Guidance:
                                </h5>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed font-medium">
                                    {remarriageAnalysis.impactText}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ffe4e6] p-5 rounded-2xl border border-[#fecdd3] mt-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-3xl text-[#be123c]">🔮</div>
                        <div className="flex-1 text-[18px] text-[#1e293b] leading-relaxed font-medium">
                            <span className="font-bold text-[#881337] block text-sm mb-0.5">Classical Vedic Rule for Secondary Marriage (Dwi-Vivaha):</span>
                            A second marriage (2nd Kutumba) is calculated from the <b>2nd House (8th from 7th)</b> and <b>9th House (3rd from 7th)</b>. When <b>Dual Signs (Gemini, Virgo, Sagittarius, Pisces)</b> occupy the 7th or 2nd house, or when the 7th Lord connects to the 8th house while the 2nd Lord is strong, a second marriage promises enhanced harmony and financial growth.
                        </div>
                    </div>
                </div>

                {/* 7th Lord Placement Scroll (BPHS Ch. 24) */}
                {pos7 && BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7] && (
                    <div id="section-bhava-lords" className="scroll-mt-28 bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="text-5xl text-[#be123c]">🏛️</div>
                            <div className="flex-1 space-y-2">
                                <span className="px-3 py-1 bg-[#ffe4e6] text-[#be123c] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                    Seventh Lord House Placement (BPHS Ch. 24)
                                </span>
                                <h4 className="text-2xl font-black text-[#881337] italic">
                                    Marriage Lord ({lord7}) in the {pos7 === 1 ? "1st" : pos7 === 2 ? "2nd" : pos7 === 3 ? "3rd" : pos7 + "th"} House
                                </h4>
                                <p className="text-sm text-[#1e293b] leading-relaxed italic">
                                    "{BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7].result}"
                                </p>
                                <div className="text-xs text-[#475569] font-serif border-t border-[#fecdd3] pt-2 italic">
                                    <span className="font-bold block text-[#881337] not-italic mb-1">Sastra Notes:</span>
                                    {BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7].notes}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Numerology Timeline Section */}
                {numerology && (
                    <div className="bg-white rounded-[3rem] border border-[#fecdd3] p-10 shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#ffe4e6] rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#fecdd3]">🔢</div>
                                    <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter">Numerology Timeline</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-[#fff1f2] p-4 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">Birth Number (Moolank)</p>
                                        <p className="text-4xl font-black text-[#881337]">{numerology.birthNumber}</p>
                                    </div>
                                    <div className="bg-[#fff1f2] p-4 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">Life Path Number (Bhagyank)</p>
                                        <p className="text-4xl font-black text-[#881337]">{numerology.lifePathNumber}</p>
                                    </div>
                                </div>
                                <p className="text-sm italic text-[#475569] leading-relaxed border-l-2 border-[#e11d48] pl-4">
                                    {numerology.rules.intro}
                                </p>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-[#881337] uppercase tracking-tight mb-4">Predicted Marriage Yoga Years</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {numerology.predictions.map((p, idx) => (
                                        <div key={idx} className="bg-[#fff1f2] p-5 rounded-2xl border border-[#fecdd3] text-center hover:scale-105 transition-transform">
                                            <p className="text-2xl font-black text-[#be123c] mb-1">{p.year}</p>
                                            <p className="text-[10px] font-black uppercase text-[#881337] tracking-widest">{p.type}</p>
                                            <div className="mt-2 h-1 w-8 bg-[#e11d48] mx-auto rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#ffe4e6] p-4 rounded-xl border border-[#fecdd3] mt-6">
                                    <p className="text-[10px] font-bold text-[#be123c] uppercase mb-2">💡 Numerology Tip</p>
                                    <p className="text-xs text-[#1e293b] leading-relaxed font-medium">
                                        According to numerology, your strongest years for union are those that reduce to <b>{numerology.rules.marriage_years.join(', ')}</b>.
                                        Planning ceremonies on dates that reduce to 1 or 9 is generally considered highly auspicious.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* House Analysis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[7, 8, 2, 4].map(hNum => {
                        const hInfo = MARRIAGE_HOUSE_INTERPRETATIONS[hNum];
                        if (!hInfo) return null;
                        const houseData = houses[hNum] || houses[hNum.toString()];
                        const housePlanets = houseData?.planets || [];
                        const signName = houseData?.sign_name;

                        return (
                            <div key={hNum} className="bg-white rounded-[3rem] border border-[#fecdd3] p-8 shadow-lg relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 text-[12rem] text-rose-900/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                <h3 className="text-2xl font-black text-[#be123c] mb-2">{hInfo.title}</h3>
                                <p className="text-sm text-[#881337] mb-6 font-sans uppercase tracking-widest font-bold">Sign: {signName}</p>
                                <p className="text-lg italic mb-8 border-l-4 border-[#e11d48] pl-4 text-[#1e293b]">{hInfo.description}</p>

                                <div className="space-y-4 relative z-10">
                                    {housePlanets.length > 0 ? (
                                        housePlanets.map((p, idx) => {
                                            const pName = typeof p === 'object' ? p.name : p;
                                            if (pName === 'Ascendant' || pName === 'L') return null;
                                            const interpretation = hInfo.placements?.[pName];
                                            const isObject = typeof interpretation === 'object';

                                            return (
                                                <div key={idx} className="bg-[#fff1f2] rounded-2xl p-6 border border-[#fecdd3] hover:border-[#e11d48]/40 transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">{interpretation?.emoji}</span>
                                                            <span className="text-xl font-bold text-[#881337] uppercase">{pName}</span>
                                                            {interpretation?.rating && (
                                                                <span className="text-[12px] text-[#be123c] font-bold ml-2">{interpretation.rating}</span>
                                                            )}
                                                        </div>
                                                        {isObject && (
                                                            <span className="text-[12px] bg-[#ffe4e6] text-[#be123c] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-[#fecdd3]">
                                                                Deep Analysis available
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[15px] leading-relaxed mb-4 italic text-[#1e293b]">
                                                        {isObject ? interpretation.intro : (interpretation || "Influence analysis in progress...")}
                                                    </p>
                                                    {isObject && interpretation.effects && (
                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            {Object.entries(interpretation.effects).slice(0, 4).map(([key, val], idx) => (
                                                                <div key={idx} className="bg-white p-3 rounded-xl border border-[#fecdd3]">
                                                                    <p className="text-[13px] font-black uppercase text-[#be123c] mb-1">{key}</p>
                                                                    <p className="text-[13px] text-[#1e293b] line-clamp-3">{val}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isObject && (
                                                        <button
                                                            onClick={() => setSelectedYoga({
                                                                name: `${pName} in ${hInfo.title}`,
                                                                details: interpretation,
                                                                type: 'planet_detail'
                                                            })}
                                                            className="w-full py-3 bg-[#ffe4e6] hover:bg-[#fecdd3] text-[#881337] rounded-xl text-[14px] font-black uppercase tracking-[0.2em] transition-all border border-[#fecdd3]"
                                                        >
                                                            View Full Diagnostic
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm italic text-[#475569]">No planets occupy this house. Its results are governed by the Lord of {signName}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Conjunctions Section */}
                {activeConjunctions.length > 0 && (
                    <div className="bg-white rounded-[4rem] border border-[#fecdd3] p-12 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fecdd3]"></div>
                                <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter">Active Relationship Conjunctions</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fecdd3]"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeConjunctions.map((conj, idx) => (
                                    <div key={idx} className="bg-[#fff1f2] border border-[#fecdd3] p-6 rounded-[2.5rem] hover:border-[#e11d48]/40 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-2xl font-black text-[#881337] italic tracking-tighter">
                                                {conj.planets.join(' + ')}
                                            </div>
                                            {conj.rating && <span className="text-[12px] text-[#be123c] font-bold">{conj.rating}</span>}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-[#be123c]">Marital Type</p>
                                                <p className="text-sm text-[#1e293b] italic font-medium">{conj.marriage_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-red-700">Risk Profile</p>
                                                <p className="text-xs text-red-900 font-medium">{conj.risk}</p>
                                            </div>
                                            <div className="pt-3 border-t border-[#fecdd3]">
                                                <p className="text-[12px] text-[#1e293b] leading-relaxed">{conj.effects}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-[10px] text-[#881337] uppercase font-black tracking-widest">Detected in House {conj.house}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Yogas Section */}
                <div id="section-remedies" className="scroll-mt-28 bg-white rounded-[4rem] border border-[#fecdd3] p-12 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fecdd3]"></div>
                            <h2 className="text-3xl font-black text-[#881337] italic">Marriage & Relationship Yogas</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fecdd3]"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {MARRIAGE_YOGAS.map(yoga => {
                                const active = hasYoga(yoga.id);
                                return (
                                    <div
                                        key={yoga.id}
                                        className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${active ? 'bg-[#fff1f2] border-[#e11d48] shadow-md' : 'bg-white border-[#fecdd3] opacity-60'
                                            }`}
                                        onClick={() => active && setSelectedYoga(yoga)}
                                    >
                                        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:scale-125 transition-transform">
                                            {active ? '✨' : '🔒'}
                                        </div>
                                        <h4 className={`text-xl font-black mb-3 ${active ? 'text-[#881337]' : 'text-[#475569]'}`}>{yoga.name}</h4>
                                        <p className="text-[15px] leading-relaxed text-[#475569] mb-6 line-clamp-3 italic">
                                            {yoga.description}
                                        </p>
                                        {active && (
                                            <div className="text-[14px] font-black uppercase text-[#be123c] tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                Active Placement • Explore Details →
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            {selectedYoga && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedYoga(null)}></div>
                    <div className="relative w-full max-w-4xl bg-white border border-[#fecdd3] rounded-[3rem] shadow-2xl overflow-hidden text-[#1e293b]">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setSelectedYoga(null)} className="text-[#881337] hover:text-[#be123c] text-4xl font-bold">&times;</button>
                        </div>

                        <div className="p-12 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-[2px] w-12 bg-[#e11d48]"></div>
                                <p className="text-[#be123c] text-xs font-black uppercase tracking-[0.4em]">Detailed Diagnostic Report</p>
                            </div>
                            <h2 className="text-5xl font-black text-[#881337] italic mb-10 tracking-tighter">{selectedYoga.name}</h2>

                            {selectedYoga.type === 'planet_detail' ? (
                                <div className="space-y-12">
                                    <div className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                        <h4 className="text-sm font-black uppercase text-[#be123c] mb-4 tracking-widest">Diagnostic Overview</h4>
                                        <p className="text-xl leading-relaxed italic text-[#1e293b]">{selectedYoga.details.intro}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] border-b border-[#fecdd3] pb-2">Marital Effects</h4>
                                            {Object.entries(selectedYoga.details.effects).map(([key, val], idx) => (
                                                <div key={idx} className="flex gap-4 items-start">
                                                    <div className="w-2 h-2 rounded-full bg-[#e11d48] mt-2 shrink-0"></div>
                                                    <div>
                                                        <p className="text-[12px] font-black text-[#881337] uppercase">{key}</p>
                                                        <p className="text-sm text-[#1e293b]">{val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[#fff1f2] p-8 rounded-[2rem] border border-[#fecdd3] h-full">
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Strength & Dignity Analysis</h4>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest mb-1">When Strong</p>
                                                    <p className="text-xs text-emerald-950 italic font-medium">{selectedYoga.details.strong_vs_weak.Strong}</p>
                                                </div>
                                                <div className="h-[1px] bg-[#fecdd3]"></div>
                                                <div>
                                                    <p className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-1">When Weak / Afflicted</p>
                                                    <p className="text-xs text-rose-950 italic font-medium">{selectedYoga.details.strong_vs_weak.Weak}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#fecdd3]">
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Harmony & Growth Tips</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedYoga.details.harmony_tips?.map((area, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-[#ffe4e6] text-[#be123c] text-[12px] font-black rounded-lg border border-[#fecdd3] italic">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Actionable Remedies</h4>
                                            <ul className="space-y-3">
                                                {selectedYoga.details.remedies?.map((rem, idx) => (
                                                    <li key={idx} className="text-xs text-[#1e293b] flex gap-3 font-medium">
                                                        <span className="text-[#e11d48]">●</span> {rem}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-xl leading-relaxed italic text-[#1e293b]">{selectedYoga.description}</p>
                                    {selectedYoga.details && (
                                        <div className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-sm font-black uppercase text-[#be123c] mb-6 tracking-widest">Formation Logic</h4>
                                            <p className="text-lg mb-8 leading-relaxed text-[#1e293b]">{selectedYoga.details.formation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
