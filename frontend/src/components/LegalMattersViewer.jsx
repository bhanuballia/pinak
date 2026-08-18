import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import legalData from '../data/legalMatters.json';
import legalDashaAnalysis from '../data/legalDashaCombinations.json';

export default function LegalMattersViewer() {
    const [worksheetData, setWorksheetData] = useState(null);
    const [transitData, setTransitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLightMode, setIsLightMode] = useState(true);
    const [fontScale, setFontScale] = useState(1);
    const [activeSection, setActiveSection] = useState('All');
    const [showApplicableOnly, setShowApplicableOnly] = useState(true);
    const [showExamples, setShowExamples] = useState(false);

    const increaseFont = () => setFontScale(prev => Math.min(prev + 0.1, 1.5));
    const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.1, 0.7));
    const resetFont = () => setFontScale(1);

    const theme = {
        bg: isLightMode ? '#f8fafc' : '#0f172a',
        text: isLightMode ? '#1e293b' : '#f1f5f9',
        heading: isLightMode ? '#334155' : '#e2e8f0',
        cardBg: isLightMode ? '#ffffff' : '#1e293b',
        borderColor: isLightMode ? '#e2e8f0' : '#334155',
        accent1: '#4f46e5', // indigo
        accent2: '#0ea5e9', // sky
        accent3: '#e11d48', // rose
        highlightBg: isLightMode ? '#eef2ff' : '#312e81',
        highlightBorder: '#818cf8',
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setWorksheetData(parsed);
                }

                // Try to fetch current transit positions if needed or load from local
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = now.toTimeString().split(' ')[0];
                const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);

                // Fetch transit data
                try {
                    const res = await fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=28.6&lon=77.2`);
                    const json = await res.json();
                    if (json.positions) setTransitData(json.positions);
                } catch (e) {
                    console.error("Transit fetch failed", e);
                }

            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper functions for astrological logic
    const getHouseLord = (houseNum, lagnaSignNum) => {
        const signNum = ((lagnaSignNum - 1 + (houseNum - 1)) % 12) + 1;
        const lordships = {
            1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
            7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
        };
        return lordships[signNum];
    };

    const analyzePlacements = () => {
        if (!worksheetData?.planet_positions || !worksheetData?.basic_details) return {};

        const lagnaSign = worksheetData.basic_details.ascendant;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const lagnaSignNum = signs.indexOf(lagnaSign) + 1;
        if (!lagnaSignNum) return {};

        const sixthLord = getHouseLord(6, lagnaSignNum);
        const eighthLord = getHouseLord(8, lagnaSignNum);
        const twelfthLord = getHouseLord(12, lagnaSignNum);
        const lagnaLord = getHouseLord(1, lagnaSignNum);

        const getHouseOfPlanet = (planetName) => {
            const pos = worksheetData.planet_positions.find(p => p.planet === planetName);
            return pos ? pos.house : null;
        };

        const sixthLordHouse = getHouseOfPlanet(sixthLord);
        const eighthLordHouse = getHouseOfPlanet(eighthLord);
        const twelfthLordHouse = getHouseOfPlanet(twelfthLord);
        const lagnaLordHouse = getHouseOfPlanet(lagnaLord);

        const currentMahaDasha = worksheetData.dasha?.current?.mahadasha?.planet;
        const currentAntarDasha = worksheetData.dasha?.current?.antardasha?.planet;
        const currentPratyantarDasha = worksheetData.dasha?.current?.pratyantardasha?.planet || worksheetData.dasha?.current?.pratyantar?.planet;

        const activeDashas = [currentMahaDasha, currentAntarDasha, currentPratyantarDasha].filter(Boolean);

        const planetsIn6th = worksheetData.planet_positions.filter(p => p.house === 6).map(p => p.planet);
        const planetsIn8th = worksheetData.planet_positions.filter(p => p.house === 8).map(p => p.planet);
        const planetsIn12th = worksheetData.planet_positions.filter(p => p.house === 12).map(p => p.planet);

        const isDusthanaPlanetDasha = activeDashas.some(d => planetsIn6th.includes(d) || planetsIn8th.includes(d) || planetsIn12th.includes(d));

        const malefics = ['Rahu', 'Ketu', 'Saturn', 'Mars'];
        const sixthHouseAssociates = [...planetsIn6th, sixthLord];
        const isMaleficAfflictedDasha = activeDashas.some(d => malefics.includes(d) && sixthHouseAssociates.includes(d));

        const conditions = {
            sixthLordInLagna: sixthLordHouse === 1,
            lagnaLordInSixth: lagnaLordHouse === 6,
            sixthLordWithLagnaLord: sixthLordHouse !== null && sixthLordHouse === lagnaLordHouse,
            marsInSixth: getHouseOfPlanet('Mars') === 6,
            marsInEighth: getHouseOfPlanet('Mars') === 8,
            marsInTwelfth: getHouseOfPlanet('Mars') === 12,
            rahuInSixth: getHouseOfPlanet('Rahu') === 6,
            saturnInSixth: getHouseOfPlanet('Saturn') === 6,
            eighthLordInSixth: eighthLordHouse === 6,
            sixthLordInEighth: sixthLordHouse === 8,
            twelfthLordInSixth: twelfthLordHouse === 6,
            // Transit logic
            transitSaturnOnNatalMoon: transitData?.Saturn?.sign === worksheetData.planet_positions.find(p => p.planet === 'Moon')?.sign,
            // Dasha logic
            isSixthLordDasha: activeDashas.includes(sixthLord),
            isEighthLordDasha: activeDashas.includes(eighthLord),
            isTwelfthLordDasha: activeDashas.includes(twelfthLord),
            isDusthanaPlanetDasha,
            isMaleficAfflictedDasha,
        };

        return conditions;
    };

    const userConditions = analyzePlacements();

    const analyzeTransits = () => {
        if (!transitData || !worksheetData?.planet_positions || !worksheetData?.basic_details) return [];

        const lagnaSign = worksheetData.basic_details.ascendant;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const lagnaSignNum = signs.indexOf(lagnaSign) + 1;

        const getHouseLord = (houseNum) => {
            const signNum = ((lagnaSignNum - 1 + (houseNum - 1)) % 12) + 1;
            const lordships = {
                1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
                7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
            };
            return lordships[signNum];
        };

        const sixthLord = getHouseLord(6);
        const eighthLord = getHouseLord(8);
        const twelfthLord = getHouseLord(12);

        const getTransitHouse = (planetName) => {
            if (!transitData[planetName]) return null;
            const tSign = transitData[planetName].sign;
            const tSignNum = signs.indexOf(tSign) + 1;
            if (tSignNum === 0) return null;
            return ((tSignNum - lagnaSignNum + 12) % 12) + 1;
        };

        const getAspects = (planetName, housePos) => {
            if (!housePos) return [];
            let aspects = [(housePos + 6) % 12 === 0 ? 12 : (housePos + 6) % 12]; // 7th
            if (planetName === 'Saturn') {
                aspects.push((housePos + 2) % 12 === 0 ? 12 : (housePos + 2) % 12); // 3rd
                aspects.push((housePos + 9) % 12 === 0 ? 12 : (housePos + 9) % 12); // 10th
            } else if (planetName === 'Jupiter' || planetName === 'Rahu' || planetName === 'Ketu') {
                aspects.push((housePos + 4) % 12 === 0 ? 12 : (housePos + 4) % 12); // 5th
                aspects.push((housePos + 8) % 12 === 0 ? 12 : (housePos + 8) % 12); // 9th
            } else if (planetName === 'Mars') {
                aspects.push((housePos + 3) % 12 === 0 ? 12 : (housePos + 3) % 12); // 4th
                aspects.push((housePos + 7) % 12 === 0 ? 12 : (housePos + 7) % 12); // 8th
            }
            return aspects;
        };

        const transitPositions = {};
        const transitAspects = {};
        ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].forEach(p => {
            transitPositions[p] = getTransitHouse(p);
            transitAspects[p] = getAspects(p, transitPositions[p]);
        });

        const planetsInHouse = (h) => Object.keys(transitPositions).filter(p => transitPositions[p] === h);

        const currentMahaDasha = worksheetData.dasha?.current?.mahadasha?.planet;
        const currentAntarDasha = worksheetData.dasha?.current?.antardasha?.planet;
        const currentPratyantarDasha = worksheetData.dasha?.current?.pratyantardasha?.planet || worksheetData.dasha?.current?.pratyantar?.planet;
        const activeDashas = [currentMahaDasha, currentAntarDasha, currentPratyantarDasha].filter(Boolean);

        const results = [];

        // 1. Role of the 6th House & 6th Lord
        const p6 = planetsInHouse(6);
        const t6Lord = transitPositions[sixthLord];
        results.push({
            topic: "Role of the 6th House & 6th Lord",
            status: p6.length > 0 || [6, 8, 12].includes(t6Lord) ? "Active" : "Neutral",
            details: `Transiting planets in 6th: ${p6.length ? p6.join(', ') : 'None'}. Transit 6th Lord (${sixthLord}) is in House ${t6Lord}.`
        });

        // 2. Role of the 8th House
        const p8 = planetsInHouse(8);
        results.push({
            topic: "Role of the 8th House",
            status: p8.length > 0 ? "Active" : "Neutral",
            details: `Transiting planets in 8th: ${p8.length ? p8.join(', ') : 'None'}.`
        });

        // 3. Role of the 12th House
        const p12 = planetsInHouse(12);
        results.push({
            topic: "Role of the 12th House",
            status: p12.length > 0 ? "Active" : "Neutral",
            details: `Transiting planets in 12th: ${p12.length ? p12.join(', ') : 'None'}.`
        });

        // 4. Enemy Yogas and Enemy Planets
        const maleficsIn6 = p6.filter(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p));
        results.push({
            topic: "Enemy Yogas and Enemy Planets",
            status: maleficsIn6.length > 0 ? "Warning" : "Neutral",
            details: maleficsIn6.length > 0 ? `Malefics transiting 6th house: ${maleficsIn6.join(', ')}.` : `No malefic transits in the 6th house.`
        });

        // 5. Influence of Rahu and Ketu
        results.push({
            topic: "Influence of Rahu and Ketu",
            status: [6, 8, 12].includes(transitPositions['Rahu']) || [6, 8, 12].includes(transitPositions['Ketu']) ? "Warning" : "Neutral",
            details: `Rahu is transiting House ${transitPositions['Rahu']}. Ketu is transiting House ${transitPositions['Ketu']}.`
        });

        // 6. Position of Mars
        results.push({
            topic: "Position of Mars",
            status: [6, 8, 12].includes(transitPositions['Mars']) ? "Warning" : transitPositions['Mars'] === 1 ? "Strong" : "Neutral",
            details: `Mars is transiting House ${transitPositions['Mars']}.`
        });

        // 7. Timing from Dasha
        const activeDashasInDusthana = activeDashas.filter(d => [6, 8, 12].includes(transitPositions[d]));
        results.push({
            topic: "Timing from Dasha",
            status: activeDashasInDusthana.length > 0 ? "Warning" : "Neutral",
            details: `Current Dashas: ${activeDashas.join(', ')}. ${activeDashasInDusthana.length ? `Dasha lords in Dusthana transits: ${activeDashasInDusthana.join(', ')}.` : 'Dasha lords transiting well.'}`
        });

        // 8. Reasons for Delay in Case
        const saturnAspects = transitAspects['Saturn'] || [];
        const delay = saturnAspects.includes(6) || saturnAspects.includes(8) || transitPositions['Saturn'] === 6 || transitPositions['Saturn'] === 8;
        results.push({
            topic: "Reasons for Delay in Case",
            status: delay ? "Active" : "Neutral",
            details: delay ? `Saturn is transiting or aspecting the 6th or 8th house, causing potential delays.` : `No significant Saturn delay influence on 6th/8th house.`
        });

        // 9. Yogas for Victory
        const juAspects = transitAspects['Jupiter'] || [];
        const victory = juAspects.includes(1) || juAspects.includes(6) || juAspects.includes(11) || [1, 6, 11].includes(transitPositions['Jupiter']);
        results.push({
            topic: "Yogas for Victory",
            status: victory ? "Favorable" : "Neutral",
            details: victory ? `Jupiter is transiting or aspecting Lagna, 6th, or 11th house, favoring victory.` : `No immediate Jupiter victory yoga in transit.`
        });

        // 10. Yogas for Defeat
        const defeat = ([8, 12].includes(transitPositions['Saturn'])) && (saturnAspects.includes(1) || transitPositions['Saturn'] === 1);
        results.push({
            topic: "Yogas for Defeat",
            status: defeat ? "Warning" : "Neutral",
            details: defeat ? `Saturn in 8th/12th aspecting Lagna warns of defeat.` : `No Saturn defeat yoga.`
        });

        // 11. Settlement
        const settlement = [6, 7].includes(transitPositions['Jupiter']) || [6, 7].includes(transitPositions['Venus']) || juAspects.includes(6) || juAspects.includes(7) || (transitAspects['Venus'] || []).includes(6) || (transitAspects['Venus'] || []).includes(7);
        results.push({
            topic: "Settlement",
            status: settlement ? "Favorable" : "Neutral",
            details: settlement ? `Jupiter or Venus transiting/aspecting 6th/7th promotes settlement.` : `No settlement yogas active.`
        });

        // 12. Yogas for Jail
        const jail = transitPositions['Saturn'] === 12 || transitPositions['Rahu'] === 12;
        results.push({
            topic: "Yogas for Jail",
            status: jail ? "Warning" : "Neutral",
            details: jail ? `Saturn or Rahu in 12th house (Bandhan Yoga).` : `No immediate transit jail yogas.`
        });

        // 13. Timing of Final Decision from Dasha & Transit
        results.push({
            topic: "Timing of Final Decision from Dasha & Transit",
            status: victory ? "Favorable" : (defeat || jail) ? "Warning" : "Neutral",
            details: victory ? `Favorable transits align with Dasha for positive outcome.` : (defeat || jail) ? `Adverse transits indicate negative decisions.` : `Mixed or neutral transits for final decision.`
        });

        return results;
    };

    const calculateLegalRisk = () => {
        if (!worksheetData?.planet_positions || !transitData || !worksheetData?.basic_details) return null;

        let score = 0;
        const reasons = [];

        const lagnaSign = worksheetData.basic_details.ascendant;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const lagnaSignNum = signs.indexOf(lagnaSign) + 1;

        const getHouseLord = (houseNum) => {
            const signNum = ((lagnaSignNum - 1 + (houseNum - 1)) % 12) + 1;
            const lordships = {
                1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
                7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
            };
            return lordships[signNum];
        };

        const sixthLord = getHouseLord(6);
        const eighthLord = getHouseLord(8);
        const twelfthLord = getHouseLord(12);

        const currentAntarDasha = worksheetData.dasha?.current?.antardasha?.planet;
        const currentMahaDasha = worksheetData.dasha?.current?.mahadasha?.planet;
        const activeDashas = [currentMahaDasha, currentAntarDasha].filter(Boolean);

        const getHouseOfPlanet = (planetName) => {
            const pos = worksheetData.planet_positions.find(p => p.planet === planetName);
            return pos ? pos.house : null;
        };

        // 1. Dasha Logic
        if (activeDashas.includes(sixthLord)) {
            score += 20;
            reasons.push(`Running Dasha of 6th Lord (${sixthLord})`);
        } else if (activeDashas.includes(eighthLord) || activeDashas.includes(twelfthLord)) {
            score += 10;
            reasons.push(`Running Dasha of Dusthana Lord`);
        }

        const adPlanetHouse = getHouseOfPlanet(currentAntarDasha);
        if ([6, 8, 12].includes(adPlanetHouse)) {
            score += 15;
            reasons.push(`${currentAntarDasha} (Antardasha Lord) is in ${adPlanetHouse}th house`);
        }

        if (['Mars', 'Rahu'].includes(currentAntarDasha) && [6, 8, 12].includes(adPlanetHouse)) {
            score += 15;
            reasons.push(`Malefic ${currentAntarDasha} Dasha active in Dusthana`);
        }

        // 2. Transit Logic
        const getTransitHouse = (planetName) => {
            if (!transitData[planetName]) return null;
            const tSign = transitData[planetName].sign;
            const tSignNum = signs.indexOf(tSign) + 1;
            if (tSignNum === 0) return null;
            return ((tSignNum - lagnaSignNum + 12) % 12) + 1;
        };

        const tSaturn = getTransitHouse('Saturn');
        const tRahu = getTransitHouse('Rahu');
        const tMars = getTransitHouse('Mars');
        const tSixthLord = getTransitHouse(sixthLord);

        if ([6, 8, 12].includes(tSaturn)) {
            score += 20;
            reasons.push(`Saturn transiting ${tSaturn}th house`);
        }

        if (tRahu === 6 || tMars === 6) {
            score += 20;
            reasons.push(`Malefic transiting 6th house`);
        }

        if ([8, 12].includes(tSixthLord)) {
            score += 10;
            reasons.push(`Transit 6th Lord in ${tSixthLord}th house`);
        }

        let level = 'Low Risk';
        let color = '#10b981'; // green
        let bg = 'rgba(16, 185, 129, 0.1)';
        let title = 'Low Risk: No major legal indicators active right now.';

        if (score >= 40 && score < 70) {
            level = 'Moderate Risk';
            color = '#f59e0b'; // yellow
            bg = 'rgba(245, 158, 11, 0.1)';
            title = 'Moderate Risk: Be mindful of hidden enemies or minor disputes.';
        } else if (score >= 70) {
            level = 'High Risk';
            color = '#e11d48'; // red
            bg = 'rgba(225, 29, 72, 0.1)';
            title = 'High Probability of Legal Disputes. Exercise extreme caution.';
        }

        return { score, level, color, bg, title, reasons };
    };

    const generatePredictiveTimeline = () => {
        if (!worksheetData?.dasha?.list || !worksheetData?.planet_positions || !worksheetData?.basic_details) return [];

        const lagnaSign = worksheetData.basic_details.ascendant;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const lagnaSignNum = signs.indexOf(lagnaSign) + 1;

        const getHouseLord = (houseNum) => {
            const signNum = ((lagnaSignNum - 1 + (houseNum - 1)) % 12) + 1;
            const lordships = {
                1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
                7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
            };
            return lordships[signNum];
        };

        const sixthLord = getHouseLord(6);
        const eighthLord = getHouseLord(8);
        const twelfthLord = getHouseLord(12);

        const getHouseOfPlanet = (planetName) => {
            const pos = worksheetData.planet_positions.find(p => p.planet === planetName);
            return pos ? pos.house : null;
        };

        const maleficInDusthana = ['Saturn', 'Mars', 'Rahu'].filter(p => [6, 8, 12].includes(getHouseOfPlanet(p)));
        const troublemakers = [sixthLord, eighthLord, twelfthLord, ...maleficInDusthana];

        const computeAge = (birthDateStr, dashaDateStr) => {
            if (!birthDateStr || !dashaDateStr) return null;
            try {
                let birthY, birthM, birthD;
                if (birthDateStr.includes('/')) {
                    [birthD, birthM, birthY] = birthDateStr.split('/').map(Number);
                } else {
                    [birthY, birthM, birthD] = birthDateStr.split('-').map(Number);
                }

                let y, m, d;
                if (dashaDateStr.includes('/')) {
                    [d, m, y] = dashaDateStr.split('/').map(Number);
                } else if (dashaDateStr.length >= 10 && dashaDateStr.includes('-')) {
                    [y, m, d] = dashaDateStr.split('T')[0].split('-').map(Number);
                } else {
                    return null;
                }

                let ageY = y - birthY;
                let ageM = m - birthM;
                if (ageM < 0 || (ageM === 0 && d < birthD)) {
                    ageY--;
                    ageM += 12;
                }
                if (d < birthD) {
                    ageM--;
                    if (ageM < 0) {
                        ageM += 12;
                    }
                }
                if (ageY < 0) return '0 yrs';
                return ageM === 0 ? `${ageY} yrs` : `${ageY}y ${ageM}m`;
            } catch { return null; }
        };

        let dob = worksheetData.basic_details?.birth_date || worksheetData.meta?.date || null;
        if (!dob && worksheetData.basic_details?.day) {
            dob = `${worksheetData.basic_details.day}/${worksheetData.basic_details.month}/${worksheetData.basic_details.year}`;
        }

        const timeline = [];

        worksheetData.dasha.list.forEach(md => {
            const mdIsTrouble = troublemakers.includes(md.lord);

            (md.antardashas || []).forEach(ad => {
                const adIsTrouble = troublemakers.includes(ad.lord);

                if (mdIsTrouble && adIsTrouble) {
                    const ageStart = dob ? computeAge(dob, ad.start_date) : null;
                    const ageEnd = dob ? computeAge(dob, ad.end_date) : null;

                    timeline.push({
                        period: `${md.lord} - ${ad.lord}`,
                        ageRange: ageStart !== null ? `${ageStart} to ${ageEnd}` : 'N/A',
                        startDate: ad.start_date.split('T')[0],
                        endDate: ad.end_date.split('T')[0],
                        risk: 'High',
                        reason: `Both Mahadasha (${md.lord}) and Antardasha (${ad.lord}) are connected to 6th/8th/12th houses or are malefics in dusthanas.`,
                        analysis: legalDashaAnalysis[md.lord]?.[ad.lord] || []
                    });
                } else if (!mdIsTrouble && ad.lord === sixthLord) {
                    const ageStart = dob ? computeAge(dob, ad.start_date) : null;
                    const ageEnd = dob ? computeAge(dob, ad.end_date) : null;

                    timeline.push({
                        period: `${md.lord} - ${ad.lord}`,
                        ageRange: ageStart !== null ? `${ageStart} to ${ageEnd}` : 'N/A',
                        startDate: ad.start_date.split('T')[0],
                        endDate: ad.end_date.split('T')[0],
                        risk: 'Moderate',
                        reason: `Antardasha of 6th Lord (${ad.lord}) indicates potential for disputes or litigation.`,
                        analysis: legalDashaAnalysis[md.lord]?.[ad.lord] || []
                    });
                }
            });
        });
        return timeline;
    };

    const riskData = calculateLegalRisk();
    const predictiveTimeline = generatePredictiveTimeline();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: `${64 * fontScale}px`, marginBottom: '30px', animation: 'pulse 2s infinite' }}>⚖️</div>
                <p style={{ color: theme.accent1, fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: `${24 * fontScale}px`, textTransform: 'uppercase' }}>Analyzing Legal Placements...</p>
                <style>{` @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } } `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', paddingBottom: '100px', transition: 'background-color 0.3s ease' }}>
            {/* Header */}
            <div style={{
                padding: '16px 40px',
                background: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: isLightMode ? '0 8px 30px rgba(0, 0, 0, 0.05)' : '0 8px 30px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%', background: theme.cardBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                            border: `2px solid ${theme.borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>⚖️</div>
                        <div>
                            <h1 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: 0, letterSpacing: '-0.5px' }}>Legal Matters Analysis</h1>
                            <p style={{ color: theme.accent1, textTransform: 'uppercase', letterSpacing: '2px', fontSize: `${12 * fontScale}px`, fontWeight: 700, marginTop: '4px' }}>
                                Litigation, Court Cases & Conflict Resolution
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={() => setShowExamples(!showExamples)}
                            style={{ background: showExamples ? theme.accent1 : 'transparent', color: showExamples ? '#fff' : theme.text, border: `1px solid ${theme.borderColor}`, padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', fontWeight: 'bold', fontSize: `${14 * fontScale}px`, transition: 'all 0.2s ease' }}
                        >
                            {showExamples ? 'Hide Examples' : 'Show Examples'}
                        </button>
                        <div style={{ display: 'flex', background: theme.cardBg, borderRadius: '100px', border: `1px solid ${theme.borderColor}`, overflow: 'hidden' }}>
                            <button onClick={decreaseFont} style={{ background: 'transparent', border: 'none', borderRight: `1px solid ${theme.borderColor}`, padding: '6px 12px', color: theme.text, cursor: 'pointer', fontWeight: 'bold' }}>A-</button>
                            <button onClick={resetFont} style={{ background: 'transparent', border: 'none', borderRight: `1px solid ${theme.borderColor}`, padding: '6px 12px', color: theme.text, cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
                            <button onClick={increaseFont} style={{ background: 'transparent', border: 'none', padding: '6px 12px', color: theme.text, cursor: 'pointer', fontWeight: 'bold' }}>A+</button>
                        </div>


                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
                {riskData && (
                    <div style={{ marginBottom: '24px', padding: '24px', background: riskData.bg, borderRadius: '24px', border: `2px solid ${riskData.color}`, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '100%', background: riskData.color }}></div>
                        <h2 style={{ fontSize: `${22 * fontScale}px`, color: riskData.color, fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{riskData.level === 'High Risk' ? '🚨' : riskData.level === 'Moderate Risk' ? '⚠️' : '✅'}</span>
                            Legal Risk Prediction: {riskData.level}
                        </h2>
                        <p style={{ fontSize: `${20 * fontScale}px`, color: theme.text, opacity: 0.9, lineHeight: 1.6, marginBottom: riskData.reasons.length > 0 ? '16px' : '0' }}>
                            {riskData.title}
                        </p>
                        {riskData.reasons.length > 0 && (
                            <div style={{ background: isLightMode ? '#ffffff' : '#1e293b', padding: '16px', borderRadius: '12px', border: `1px solid ${theme.borderColor}` }}>
                                <h4 style={{ fontSize: `${18 * fontScale}px`, textTransform: 'uppercase', color: theme.heading, marginBottom: '8px', letterSpacing: '1px' }}>Active Indicators:</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: theme.text, fontSize: `${18 * fontScale}px`, lineHeight: 1.6 }}>
                                    {riskData.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {predictiveTimeline.length > 0 && (
                    <div style={{ marginBottom: '40px', padding: '24px', background: theme.cardBg, borderRadius: '24px', border: `1px solid ${theme.borderColor}` }}>
                        <h2 style={{ fontSize: `${22 * fontScale}px`, color: theme.heading, fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            ⏳ Lifetime Legal Vulnerability Timeline
                        </h2>
                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, opacity: 1.5, marginBottom: '20px' }}>
                            This timeline scans your entire 120-year Vimshottari Dasha cycle to predict periods where you are most vulnerable to legal matters, conflicts, or litigation.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                            {predictiveTimeline.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', background: isLightMode ? '#f8fafc' : '#0f172a', padding: '16px', borderRadius: '16px', borderLeft: `4px solid ${item.risk === 'High' ? '#e11d48' : '#f59e0b'}`, flexWrap: 'wrap' }}>
                                    <div style={{ minWidth: '120px' }}>
                                        <div style={{ fontSize: `${18 * fontScale}px`, fontWeight: 'bold', color: item.risk === 'High' ? '#e11d48' : '#f59e0b' }}>Age: {item.ageRange}</div>
                                        <div style={{ fontSize: `${18 * fontScale}px`, color: 'hsla(0, 0%, 0%, 1.00)', opacity: 1.5, marginTop: '4px' }}>{item.startDate} to {item.endDate}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: `${18 * fontScale}px`, fontWeight: 'bold', color: theme.heading }}>Dasha: {item.period} ({item.risk} Risk)</div>
                                        <div style={{ fontSize: `${18 * fontScale}px`, color: 'hsla(282, 100%, 2%, 1.00)', opacity: 1.5, marginTop: '4px', marginBottom: item.analysis && item.analysis.length > 0 ? '16px' : '4px' }}>{item.reason}</div>

                                        {item.analysis && item.analysis.map((paragraph, idx) => (
                                            <div key={idx} style={{ marginBottom: '12px', background: isLightMode ? '#ffffff' : '#1e293b', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.borderColor}` }}>
                                                <strong style={{ color: theme.accent1, fontSize: `${18 * fontScale}px`, display: 'block', marginBottom: '4px' }}>{paragraph.title}</strong>
                                                <span style={{ color: theme.text, fontSize: `${18 * fontScale}px`, opacity: 1.5 }}>{paragraph.content} </span>
                                                {paragraph.links && paragraph.links.map((link, lIdx) => (
                                                    <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" style={{ color: theme.accent2, textDecoration: 'none', marginLeft: '4px', fontSize: `${18 * fontScale}px`, fontWeight: 'bold' }}>
                                                        {link.text}
                                                    </a>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {worksheetData ? (
                    <div style={{ marginBottom: '40px', padding: '24px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', borderRadius: '24px', border: `1px solid ${theme.accent1}` }}>
                        <h2 style={{ fontSize: `${22 * fontScale}px`, color: theme.accent1, fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✨</span> Personalized Assessment Active
                        </h2>
                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, opacity: 1.5, lineHeight: 1.6 }}>
                            Your chart data is loaded. Rules that match your planetary positions (like the 6th Lord, 8th Lord, Mars placement, and current Dasha) will be highlighted with a distinctive border and badge to help you quickly identify applicable yogas.
                        </p>
                    </div>
                ) : (
                    <div style={{ marginBottom: '40px', padding: '24px', background: theme.cardBg, borderRadius: '24px', border: `1px dashed ${theme.accent3}` }}>
                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.accent3, textAlign: 'center', fontWeight: 600 }}>
                            ⚠️ Showing general rules. Open a worksheet to see personalized highlights.
                        </p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                    {(() => {
                        const transitResults = analyzeTransits();
                        const transitMap = transitResults.reduce((acc, curr) => {
                            acc[curr.topic] = curr;
                            return acc;
                        }, {});

                        const mappedItems = legalData.content?.map((item) => {
                            const topic = item.category;
                            let isHighlighted = false;
                            let highlightReason = "";

                            if (topic === "Strong Yogas for Legal Matters" && (userConditions.sixthLordInLagna || userConditions.lagnaLordInSixth || userConditions.sixthLordWithLagnaLord)) {
                                isHighlighted = true;
                                highlightReason = "Your 1st/6th Lord connection indicates this yoga.";
                            }
                            if (topic === "Role of the 6th House & 6th Lord" && (userConditions.lagnaLordInSixth || userConditions.sixthLordInLagna)) {
                                isHighlighted = true;
                                highlightReason = "Your 6th Lord and Lagna Lord are connected.";
                            }
                            if (topic === "Role of the 8th House" && userConditions.sixthLordInEighth) {
                                isHighlighted = true;
                                highlightReason = "Your 6th Lord is in the 8th House.";
                            }
                            if (topic === "Role of the 12th House" && userConditions.twelfthLordInSixth) {
                                isHighlighted = true;
                                highlightReason = "Your 12th Lord is connected to the 6th House.";
                            }
                            if (topic === "Position of Mars" && (userConditions.marsInSixth || userConditions.marsInEighth || userConditions.marsInTwelfth)) {
                                isHighlighted = true;
                                highlightReason = "Mars is in a Dusthana (6/8/12) house in your chart.";
                            }
                            if (topic === "Influence of Rahu and Ketu" && userConditions.rahuInSixth) {
                                isHighlighted = true;
                                highlightReason = "Rahu is placed in your 6th house.";
                            }
                            if (topic === "Timing from Dasha" && (userConditions.isSixthLordDasha || userConditions.isEighthLordDasha || userConditions.isTwelfthLordDasha || userConditions.isDusthanaPlanetDasha || userConditions.isMaleficAfflictedDasha)) {
                                isHighlighted = true;
                                if (userConditions.isMaleficAfflictedDasha) {
                                    highlightReason = "You are currently running the Dasha of a Malefic associated with the 6th House.";
                                } else if (userConditions.isDusthanaPlanetDasha) {
                                    highlightReason = "You are currently running the Dasha of a planet placed in a Dusthana (6/8/12) House.";
                                } else {
                                    highlightReason = "You are currently running the Dasha of a Dusthana (6/8/12) Lord.";
                                }
                            }

                            const transitInfo = transitMap[topic];
                            const hasTransitInfluence = transitInfo && transitInfo.status !== 'Neutral';

                            if (hasTransitInfluence) {
                                isHighlighted = true;
                            }

                            return { ...item, isHighlighted, lagnaHighlightReason: highlightReason, transitInfo: hasTransitInfluence ? transitInfo : null };
                        }) || [];

                        const displayItems = (showApplicableOnly && worksheetData) ? mappedItems.filter(item => item.isHighlighted) : mappedItems;

                        if (displayItems.length === 0) {
                            return (
                                <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', background: theme.cardBg, borderRadius: '24px', border: `1px dashed ${theme.borderColor}` }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕊️</div>
                                    <h3 style={{ fontSize: `${24 * fontScale}px`, color: theme.heading, marginBottom: '12px' }}>No Legal Conflicts Found</h3>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, opacity: 1.5, maxWidth: '600px', margin: '0 auto' }}>
                                        Based on your current planetary placements and Dasha, there are no immediate strong astrological indicators for litigation or legal matters. You can toggle "Show Only Mine" to view the general reference guide.
                                    </p>
                                </div>
                            );
                        }

                        return displayItems.map((item, idx) => {
                            const { isHighlighted, lagnaHighlightReason, transitInfo, category: topic } = item;
                            return (
                                <div key={idx} style={{
                                    background: isHighlighted ? theme.highlightBg : theme.cardBg,
                                    borderRadius: '24px',
                                    border: `2px solid ${isHighlighted ? theme.highlightBorder : theme.borderColor}`,
                                    padding: '30px',
                                    boxShadow: isHighlighted ? '0 12px 30px rgba(79, 70, 229, 0.15)' : '0 4px 15px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isHighlighted ? '0 12px 30px rgba(79, 70, 229, 0.15)' : '0 4px 15px rgba(0,0,0,0.05)'; }}
                                >
                                    {isHighlighted && (
                                        <div style={{ position: 'absolute', top: 0, right: 0, background: theme.accent1, color: '#fff', padding: '6px 16px', borderBottomLeftRadius: '16px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            Applies to You
                                        </div>
                                    )}

                                    <h3 style={{ fontSize: `${22 * fontScale}px`, fontWeight: 800, color: isHighlighted ? theme.accent1 : theme.heading, marginBottom: '20px', lineHeight: 1.3, paddingRight: isHighlighted ? '100px' : '0' }}>
                                        {topic}
                                    </h3>

                                    {isHighlighted && (lagnaHighlightReason || transitInfo) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                            {lagnaHighlightReason && (
                                                <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '10px 16px', borderRadius: '12px', color: theme.accent1, fontSize: `${14 * fontScale}px`, fontWeight: 600, borderLeft: `4px solid ${theme.accent1}` }}>
                                                    <span style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Lagna Chart</span>
                                                    {lagnaHighlightReason}
                                                </div>
                                            )}
                                            {transitInfo && (
                                                <div style={{ background: transitInfo.status === 'Warning' ? 'rgba(225, 29, 72, 0.1)' : transitInfo.status === 'Favorable' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)', padding: '10px 16px', borderRadius: '12px', color: transitInfo.status === 'Warning' ? '#e11d48' : transitInfo.status === 'Favorable' ? '#10b981' : theme.accent1, fontSize: `${14 * fontScale}px`, fontWeight: 600, borderLeft: `4px solid ${transitInfo.status === 'Warning' ? '#e11d48' : transitInfo.status === 'Favorable' ? '#10b981' : theme.accent1}` }}>
                                                    <span style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Transit Chart ({transitInfo.status})</span>
                                                    {transitInfo.details}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ padding: '16px', background: isLightMode ? '#f8fafc' : '#0f172a', borderRadius: '16px', border: `1px solid ${theme.borderColor}` }}>
                                            <p style={{ margin: 0, fontSize: `${18 * fontScale}px`, color: theme.text, lineHeight: 1.7 }}>
                                                {item.description}
                                            </p>
                                        </div>

                                        {(item.key_points || item.key_yogas)?.map((point, i) => (
                                            <div key={i} style={{ padding: '16px', background: isLightMode ? '#f8fafc' : '#0f172a', borderRadius: '16px', border: `1px solid ${theme.borderColor}` }}>
                                                <h4 style={{ fontSize: `${18 * fontScale}px`, fontWeight: 700, color: theme.accent2, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{point.name}</h4>
                                                <p style={{ margin: 0, fontSize: `${18 * fontScale}px`, color: theme.text, lineHeight: 1.6 }}>{point.details}</p>
                                            </div>
                                        ))}

                                        {showExamples && item.example && (
                                            <div style={{ padding: '18px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
                                                <p style={{ margin: 0, fontSize: `${15 * fontScale}px`, color: '#d97706', lineHeight: 1.6, fontStyle: 'italic' }}>
                                                    <strong>Example: </strong>{item.example}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>

                {worksheetData && transitData && (
                    <div style={{ marginTop: '60px' }}>
                        <h2 style={{ fontSize: `${24 * fontScale}px`, color: theme.heading, marginBottom: '20px', fontWeight: 800 }}>
                            Transit Legal Analysis
                        </h2>
                        <div style={{ overflowX: 'auto', background: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: `2px solid ${theme.borderColor}`, background: isLightMode ? '#f8fafc' : '#0f172a' }}>
                                        <th style={{ padding: '16px 20px', fontSize: '20px', fontWeight: 700, color: theme.accent1 }}>Topic</th>
                                        <th style={{ padding: '16px 20px', fontSize: '20px', fontWeight: 700, color: theme.accent1 }}>Transit Status</th>
                                        <th style={{ padding: '16px 20px', fontSize: '20px', fontWeight: 700, color: theme.accent1 }}>Evaluation / Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyzeTransits().map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: `1px solid ${theme.borderColor}`, transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = isLightMode ? '#f8fafc' : '#0f172a'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '16px 20px', fontWeight: 600, color: theme.heading, width: '25%' }}>{row.topic}</td>
                                            <td style={{ padding: '16px 20px', width: '15%' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    background: row.status === 'Warning' ? 'rgba(225, 29, 72, 0.1)' : row.status === 'Favorable' ? 'rgba(16, 185, 129, 0.1)' : row.status === 'Active' ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                                    color: row.status === 'Warning' ? '#e11d48' : row.status === 'Favorable' ? '#10b981' : row.status === 'Active' ? theme.accent1 : theme.text,
                                                    border: row.status === 'Neutral' ? `1px solid ${theme.borderColor}` : 'none'
                                                }}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 20px', fontSize: '18px', color: theme.text, opacity: 1.5 }}>{row.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
