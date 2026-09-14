import { HOUSE_DESCRIPTIONS, SIGN_DESCRIPTIONS, ASPECT_RULES } from './astrologyDictionaries';

export function synthesizeHouseAnalysis(houseNum, data, interpMap, parseInterpretationString, planetInSignMap, planetEffects, conjunctionDataObj) {
  const report = [];
  
  // 1. House Definition
  report.push({
    type: "House Foundation",
    content: HOUSE_DESCRIPTIONS[houseNum] || `This is the ${houseNum}th House.`
  });

  const houseData = data?.charts?.houses?.[houseNum] || data?.charts?.houses?.[String(houseNum)];
  if (!houseData) {
    return report;
  }

  const signNameIndexMap = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  let sign = houseData.sign;
  if (!sign) {
    const signIndex = houseData.sign_index !== undefined ? houseData.sign_index : Math.floor((houseData.cusp_deg || 0) / 30);
    sign = signNameIndexMap[signIndex];
  }
  
  // 2. Sign Impact
  if (sign) {
    report.push({
      type: "Zodiac Sign Influence",
      content: `This house is ruled by ${sign}. ${SIGN_DESCRIPTIONS[sign] || ""}`
    });
  }

  // 3. Residing Planets
  const planets = houseData.planets || [];
  const cleanPlanets = planets.filter(p => {
    const name = typeof p === "object" ? p.name || p.planet : p;
    return name && name !== "Ascendant" && name !== "L";
  });

  if (cleanPlanets.length === 0) {
    report.push({
      type: "Occupying Planets",
      content: `There are no planets occupying this house. Its results will primarily depend on its ruling planet (the lord of ${sign}).`
    });
  }

  if (cleanPlanets.length > 0) {
    // Conjunction Analysis
    if (conjunctionDataObj && conjunctionDataObj.detail) {
      const detail = conjunctionDataObj.detail;
      const textToParse = detail.description || detail.interpretation || detail.results || "";
      let posText = detail.positiveConjunction || detail.positive_conjunction || (detail.effects && detail.effects.positiveConjunction);
      let negText = detail.negativeConjunction || detail.negative_conjunction || (detail.effects && detail.effects.negativeConjunction);
      
      let conjunctionContent = "";
      if (textToParse) {
        conjunctionContent += textToParse + "\n\n";
      }
      if (posText) {
        conjunctionContent += "Positive Effects: " + posText + "\n\n";
      }
      if (negText) {
        conjunctionContent += "Negative Effects: " + negText;
      }
      
      if (conjunctionContent.trim()) {
        report.push({
          type: `${conjunctionDataObj.planets.join("-")} Conjunction`,
          content: conjunctionContent.trim()
        });
      }
    }

    // Individual Planet Analysis
    cleanPlanets.forEach(p => {
      const pName = typeof p === "object" ? p.name || p.planet : p;
      const isRetrograde = typeof p === "object" && p.is_retrograde ? " (Retrograde)" : "";
      
      let interpText = `Planet ${pName}${isRetrograde} is placed in this house.`;
      let pushedInterp = false;
      if (interpMap && interpMap[pName]) {
        const rawInterp = interpMap[pName][houseNum];
        if (rawInterp) {
          const parsed = parseInterpretationString ? parseInterpretationString(rawInterp) : (typeof rawInterp === 'object' ? rawInterp : { general: rawInterp });
          
          // General Interpretation
          report.push({
            type: `Planet: ${pName} (General)`,
            content: parsed.general || rawInterp
          });
          pushedInterp = true;
          
          // Specific Status Interpretation
          let effectCategory = 'general';
          if (planetEffects && planetEffects[pName]) {
            effectCategory = planetEffects[pName];
          }
          
          let specificInterp = "";
          if (effectCategory === 'positive' && parsed.positive) specificInterp = parsed.positive;
          else if (effectCategory === 'negative' && parsed.negative) specificInterp = parsed.negative;
          else if (effectCategory === 'neutral' && parsed.neutral) specificInterp = parsed.neutral;
          
          if (specificInterp && effectCategory !== 'general') {
            report.push({
              type: `Planet: ${pName} (${effectCategory.charAt(0).toUpperCase() + effectCategory.slice(1)})`,
              content: specificInterp
            });
          }
        }
      }
      
      if (!pushedInterp) {
        report.push({
          type: `Planet: ${pName}`,
          content: interpText
        });
      }

      // Planet in Sign Effect
      if (planetInSignMap && planetInSignMap[pName] && planetInSignMap[pName][sign]) {
        const signEffect = planetInSignMap[pName][sign];
        let effectText = String(signEffect);
        if (typeof signEffect === 'object') {
          effectText = signEffect.general || signEffect.positive || signEffect.description || JSON.stringify(signEffect);
        }
        report.push({
          type: `${pName} in ${sign}`,
          content: effectText
        });
      }
    });
  }

  // 4. Drishti (Aspects)
  const aspectingPlanets = [];
  const allHousesObj = data?.charts?.houses;
  
  if (allHousesObj) {
    Object.keys(allHousesObj).forEach(hNumStr => {
      const occupiedHouse = parseInt(hNumStr);
      const houseObj = allHousesObj[hNumStr];
      (houseObj.planets || []).forEach(p => {
        const pName = typeof p === 'string' ? p : (p.planet || p.name);
        if (!pName || pName === "Ascendant" || pName === "Lagna" || pName === "L") return;
        
        let relativeAspects = [7];
        if (pName === "Jupiter" || pName === "Rahu" || pName === "Ketu") relativeAspects = [5, 7, 9];
        else if (pName === "Mars") relativeAspects = [4, 7, 8];
        else if (pName === "Saturn") relativeAspects = [3, 7, 10];
        
        relativeAspects.forEach(offset => {
          const targetHouse = ((occupiedHouse + offset - 2) % 12) + 1;
          if (targetHouse === houseNum) {
            aspectingPlanets.push(pName);
          }
        });
      });
    });
  }

  const uniqueAspectingPlanets = [...new Set(aspectingPlanets)];

  if (uniqueAspectingPlanets.length > 0) {
    uniqueAspectingPlanets.forEach(ap => {
      report.push({
        type: `Aspect from ${ap}`,
        content: ASPECT_RULES[ap] || `This house receives an aspect from ${ap}.`
      });
    });
  } else {
    report.push({
      type: "Planetary Aspects (Drishti)",
      content: "There are no major planetary aspects (Drishti) on this house."
    });
  }

  return report;
}
