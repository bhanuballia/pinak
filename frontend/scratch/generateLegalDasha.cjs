const fs = require('fs');

const planets = {
  Sun: { role: "government authority, ego, high-profile cases, and defamation", style: "authoritative and highly visible", type: "malefic" },
  Moon: { role: "emotional disputes, family/custody battles, and mental distress", style: "fluctuating and emotionally charged", type: "benefic" },
  Mars: { role: "aggressive disputes, police involvement, criminal cases, and property conflicts", style: "combative and fast-paced", type: "malefic" },
  Mercury: { role: "documentation, lawyer interactions, intellectual disputes, and contracts", style: "logical and paperwork-heavy", type: "benefic" },
  Jupiter: { role: "law, wisdom, truth, fair judgments, and out-of-court settlements", style: "righteous and peaceful", type: "benefic" },
  Venus: { role: "mediation, compromises, financial settlements, and relationship disputes", style: "diplomatic and financially focused", type: "benefic" },
  Saturn: { role: "the legal profession, justice, judges, delays, and long-term litigation", style: "slow, structural, and karmic", type: "malefic" },
  Rahu: { role: "false allegations, deceit, sudden unexpected lawsuits, and hidden enemies", style: "chaotic, manipulative, and stressful", type: "malefic" },
  Ketu: { role: "isolation, loss of interest in fighting, spiritual surrender, and sudden exits", style: "detached and unpredictable", type: "malefic" }
};

const planetKeys = Object.keys(planets);
const db = {};

for (const md of planetKeys) {
  db[md] = {};
  for (const ad of planetKeys) {
    const mdInfo = planets[md];
    const adInfo = planets[ad];
    
    let resolutionText = "";
    let settlementText = "";
    
    // Determine dynamic resolution based on nature combination
    if (mdInfo.type === "malefic" && adInfo.type === "malefic") {
        resolutionText = `With both periods ruled by challenging energies, court cases during this time can be intensely drawn out or fraught with sudden complications. Expect ${adInfo.style} developments that require immense patience and strategic legal defense.`;
        settlementText = `Mediation is extremely difficult during this phase. Enemies or opposing parties may act aggressively or deceitfully. It is best to avoid initiating new lawsuits unless absolutely necessary.`;
    } else if (mdInfo.type === "benefic" && adInfo.type === "benefic") {
        resolutionText = `This is highly favorable for finding a breakthrough. If cases have been dragging, the combined influence of these positive periods acts as a "blessing phase" bringing fair and favorable verdicts.`;
        settlementText = `Excellent period for out-of-court settlements. Mutual consent, arbitration, and peace treaties are highly favored, saving you from prolonged court stress.`;
    } else if (mdInfo.type === "malefic" && adInfo.type === "benefic") {
        resolutionText = `If your court case has been dragging on slowly or causing distress during the earlier parts of ${md}'s Mahadasha, the arrival of ${ad} Antardasha often acts as a relieving phase where favorable resolutions begin to surface.`;
        settlementText = `Because ${ad} promotes ${ad === 'Jupiter' || ad === 'Venus' ? 'peace, compromise, and fairness' : 'logical negotiation'}, this sub-period is excellent for finding mediation opportunities to end active disputes caused by ${md}'s influence.`;
    } else { // benefic + malefic
        resolutionText = `While the overarching Mahadasha is protective, the ${ad} Antardasha introduces sudden friction. You may experience ${adInfo.style} legal hurdles that momentarily disrupt your peace.`;
        settlementText = `Previous settlements might be challenged, or new hidden disputes may arise. Stay vigilant with paperwork and avoid taking legal matters lightly during this sub-period.`;
    }

    // Custom overrides for specific requested ones (e.g., Saturn-Jupiter)
    if (md === 'Saturn' && ad === 'Jupiter') {
        db[md][ad] = [
            {
                title: "The Roles of the Planets",
                content: "Saturn represents the legal profession, justice, judges, and long-term litigation. Jupiter represents the law, wisdom, truth, and fair judgments. When they combine, legal structures meet ethical clarity.",
                links: []
            },
            {
                title: "Resolution and Breakthroughs",
                content: "If your court case has been dragging on slowly during the earlier parts of Saturn’s Mahadasha, the arrival of Jupiter Antardasha often acts as the \"blessing phase\" where a favorable resolution, settlement, or final verdict finally takes place.",
                links: []
            },
            {
                title: "Out-of-Court Settlements",
                content: "Because Jupiter promotes peace, righteousness, and compromise, this sub-period is excellent for finding mutual consent or mediation opportunities to end active disputes.",
                links: []
            }
        ];
    } else {
        db[md][ad] = [
            {
                title: "The Roles of the Planets",
                content: `${md} represents ${mdInfo.role}, while ${ad} introduces themes of ${adInfo.role}. When they combine, legal matters take on a ${adInfo.style} undertone within the broader context of ${md}'s influence.`,
                links: []
            },
            {
                title: "Resolution and Breakthroughs",
                content: resolutionText,
                links: []
            },
            {
                title: "Strategic Advice & Settlements",
                content: settlementText,
                links: []
            }
        ];
    }
  }
}

fs.writeFileSync('d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/legalDashaCombinations.json', JSON.stringify(db, null, 2));
console.log('Successfully generated 81 Dasha Combinations for Legal Matters.');
