import React from 'react';

const DOMAIN_MAP = {
    finance: {
        title: "Finance & Wealth Diagnostic",
        houses: [2, 11],
        houseLabels: { 2: "Accumulated Wealth (2nd House)", 11: "Gains & Income (11th House)" }
    },
    marriage: {
        title: "Marriage Diagnostic",
        houses: [7],
        houseLabels: { 7: "Partnership & Marriage (7th House)" }
    },
    business: {
        title: "Business Diagnostic",
        houses: [7, 10],
        houseLabels: { 7: "Business Partnerships (7th House)", 10: "Career & Public Standing (10th House)" }
    },
    health: {
        title: "Personal Health Diagnostic",
        houses: [1, 6],
        houseLabels: { 1: "Physical Body & Vitality (1st House)", 6: "Diseases & Healing (6th House)" }
    },
    parents_health: {
        title: "Parents Health Diagnostic",
        houses: [4, 9],
        houseLabels: { 4: "Mother's Health (4th House)", 9: "Father's Health (9th House)" }
    },
    spouse_health: {
        title: "Spouse Health Diagnostic",
        houses: [7],
        houseLabels: { 7: "Spouse & Partner (7th House)" }
    },
    children_health: {
        title: "Children Health Diagnostic",
        houses: [5],
        houseLabels: { 5: "Children & Progeny (5th House)" }
    },
    mental_peace: {
        title: "Mental Peace Diagnostic",
        houses: [4, 5, 12],
        houseLabels: { 4: "Emotional Peace (4th House)", 5: "Mindset & Thoughts (5th House)", 12: "Subconscious & Sleep (12th House)" }
    },
    home_peace: {
        title: "Domestic Peace & Harmony Diagnostic",
        houses: [4],
        houseLabels: { 4: "Domestic Environment & Griha Sukha (4th House)" }
    }
};

const PLANET_EFFECTS = {
    Sun: "Brings vitality, ego, and authority. Can cause heat or friction if afflicted.",
    Moon: "Brings emotional connection, fluctuations, and care. Indicates a nurturing influence.",
    Mars: "Brings energy, drive, and aggression. Can indicate sudden events or conflict.",
    Mercury: "Brings communication, intellect, and youthful energy. Excellent for trade and analytical matters.",
    Jupiter: "Brings expansion, wisdom, and blessings. Generally highly beneficial and protective.",
    Venus: "Brings harmony, luxury, and affection. Highly beneficial for relationships and wealth.",
    Saturn: "Brings delay, discipline, and longevity. Requires hard work and patience, often causing initial struggles.",
    Rahu: "Brings sudden expansion, foreign influences, and illusions. Can cause unconventional outcomes.",
    Ketu: "Brings detachment, spirituality, and sudden losses. Separative in nature."
};

export default function DiagnosticDetails({ domain, worksheetData }) {
    if (!worksheetData || !worksheetData.chart || !worksheetData.chart.houses) return null;

    const domainInfo = DOMAIN_MAP[domain];
    if (!domainInfo) return null;

    const housesData = worksheetData.chart.houses;

    // Check for Yogas (Simple logic for UI)
    const yogas = [];
    if (domain === 'finance') {
        yogas.push("Dhana Yoga Status: Evaluated based on 2nd and 11th Lord connection in your birth chart.");
    }
    if (domain === 'business') {
        yogas.push("Raja Yoga Status: Evaluated based on Kendra and Trikona Lord connections for business success.");
    }
    if (domain === 'marriage' || domain === 'spouse_health') {
        const h7Planets = housesData["7"]?.planets || [];
        const hasMars = h7Planets.some(p => (typeof p === 'object' ? p.name : p) === 'Mars');
        if (hasMars) {
            yogas.push("Manglik Dosha Effect: Mars is present in the 7th house, requiring careful partner matching.");
        }
    }

    return (
        <div style={{
            marginTop: '40px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '30px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1'
        }}>
            <h3 style={{ fontSize: '28px', fontWeight: 900, color: 'white', fontStyle: 'italic', marginBottom: '20px', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px' }}>
                {domainInfo.title}
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>
                {domainInfo.houses.map(hNum => {
                    const houseObj = housesData[hNum] || housesData[hNum.toString()];
                    if (!houseObj) return null;

                    const planets = houseObj.planets || [];
                    const planetNames = planets.map(p => typeof p === 'object' ? p.name : p);

                    return (
                        <div key={hNum} style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '1px solid rgba(212,175,55,0.1)'
                        }}>
                            <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '10px' }}>
                                {domainInfo.houseLabels[hNum]}
                            </h4>
                            <p style={{ fontSize: '18px', marginBottom: '15px' }}>
                                <strong style={{ color: 'white' }}>Responsible Sign:</strong> {houseObj.sign_name || "Unknown"}
                            </p>

                            <div>
                                <strong style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Planets Present in this House:</strong>
                                {planetNames.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {planetNames.map(p => (
                                            <div key={p} style={{
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                padding: '15px',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <span style={{ fontWeight: 'bold', color: '#818cf8', display: 'block', fontSize: '18px' }}>{p}</span>
                                                <p style={{ fontSize: '22px', marginTop: '5px', fontStyle: 'italic' }}>
                                                    {PLANET_EFFECTS[p] || "Influence depends on aspects and strength."}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                                        No planets are present in this house in your birth chart. The house is governed by its Lord ({houseObj.sign_name}'s ruler).
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {yogas.length > 0 && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(15,23,42,0.1) 100%)',
                        padding: '20px',
                        borderRadius: '20px',
                        border: '1px solid rgba(212,175,55,0.2)',
                        marginTop: '10px'
                    }}>
                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '10px' }}>Yoga & Special Alignments</h4>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '16px', lineHeight: '1.6' }}>
                            {yogas.map((y, i) => <li key={i}>{y}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
