import React, { useState } from 'react';
import marriageRules from '../data/marriageRulesData.json';

export default function MarriageExtendedTopics({ activeSection = 'sublord', isLightMode = false }) {
    const [selectedPlanet, setSelectedPlanet] = useState('Sun');
    const [selectedSign, setSelectedSign] = useState('Aries');
    const [selectedLoveSign, setSelectedLoveSign] = useState('Aries');
    const [genderTab, setGenderTab] = useState('male');
    const [activeCaseStudy, setActiveCaseStudy] = useState('case_study_1');

    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const caseStudiesList = [
        { id: 'case_study_1', title: 'Case Study 1: Denial of Marriage (Houses 1, 6, 10)', data: marriageRules.denial_of_marriage_rules?.case_study_1 },
        { id: 'case_study_2', title: 'Case Study 2: Marriage Bells & Timing (2, 7, 11)', data: marriageRules.marriage_bells_case_study?.case_study_2 },
        { id: 'case_study_3', title: 'Case Study 3: Will I Marry (2nd House Addition)', data: marriageRules.will_i_marry_case_study?.case_study_3 },
        { id: 'case_study_4', title: 'Case Study 4: Timing & Saturn Delays', data: marriageRules.timing_and_delay_case_study?.case_study_4 },
        { id: 'case_study_5', title: 'Case Study 5: Extended Marriage Timing & Sublord', data: marriageRules.marriage_bells_case_study_extended?.case_study_5 },
        { id: 'case_study_6', title: 'Case Study 6: Transits Pinpointing Marriage Date', data: marriageRules.transits_case_study_timing?.case_study_6 },
        { id: 'case_study_7', title: 'Case Study 7: Second Marriage & Remarriage (9th Cusp)', data: marriageRules.second_marriage_case_study?.case_study_7 },
        { id: 'case_study_8', title: 'Case Study 8: Husband Traits & Financial Independence', data: marriageRules.timing_and_husband_traits_case_study?.case_study_8 },
        { id: 'case_study_9', title: 'Case Study 9: Separation & Court Divorce (KP Horary)', data: marriageRules.separation_from_partner_case_study?.case_study_9 },
        { id: 'case_study_10', title: 'Case Study 10: Married Life Harmony & Legal Decree (Horary 71)', data: marriageRules.life_with_wife_case_study?.case_study_10 },
        { id: 'love_1', title: 'Love Marriage vs Arranged Principles', data: marriageRules.can_i_marry_one_whom_i_love?.title || "Differentiating signatures of love vs arranged marriage" },
        { id: 'love_2', title: 'Will Love Affairs Materialise Case Study', data: typeof marriageRules.will_my_love_affairs_materialise_case_study === 'string' ? marriageRules.will_my_love_affairs_materialise_case_study : JSON.stringify(marriageRules.will_my_love_affairs_materialise_case_study) },
        { id: 'luck_1', title: 'Prosperity & Luck Brought By Spouse Case Study', data: typeof marriageRules.if_brings_luck_case_study === 'string' ? marriageRules.if_brings_luck_case_study : JSON.stringify(marriageRules.if_brings_luck_case_study) },
        { id: 'sannyas_1', title: 'Family Life vs Sannyas (Asceticism) Case Study', data: typeof marriageRules.family_life_or_sannyas_case_study === 'string' ? marriageRules.family_life_or_sannyas_case_study : JSON.stringify(marriageRules.family_life_or_sannyas_case_study) },
        { id: 'progeny_h1', title: 'Progeny Horary Case Study: No Child (Horary 270)', data: typeof marriageRules.case_study_no_child_horary_270 === 'string' ? marriageRules.case_study_no_child_horary_270 : JSON.stringify(marriageRules.case_study_no_child_horary_270) },
        { id: 'progeny_h2', title: 'Progeny Horary Case Study: Child Birth Fructification (Horary 220)', data: typeof marriageRules.case_study_when_will_have_child_male_horary_220 === 'string' ? marriageRules.case_study_when_will_have_child_male_horary_220 : JSON.stringify(marriageRules.case_study_when_will_have_child_male_horary_220) },
        { id: 'progeny_h3', title: 'Progeny Delivery Timing (Sivapatham System)', data: typeof marriageRules.case_study_when_delivery_sivapatham === 'string' ? marriageRules.case_study_when_delivery_sivapatham : JSON.stringify(marriageRules.case_study_when_delivery_sivapatham) }
    ];

    const cardBg = isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.02)';
    const cardBorder = isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)';
    const textColor = isLightMode ? '#0f172a' : '#cbd5e1';
    const accentPink = '#fb7185';
    const accentIndigo = '#6366f1';
    const accentAmber = '#fbbf24';
    const accentEmerald = '#10b981';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', color: textColor }}>

            {/* ── SECTION: PARTNER EXTENDED (Locality, Profession, Features, Survival) ── */}
            {activeSection === 'partner_extended' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Partner Locality */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentPink, fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            📍 Partner Locality & Distance (KP System)
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(251, 113, 133, 0.05)', borderLeft: '4px solid #fb7185' }}>
                                <strong style={{ color: '#fb7185', display: 'block', marginBottom: '5px' }}>Houses 4 & 10 (Co-tenant / Same Town):</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_locality?.house_4_10}</span>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)', borderLeft: '4px solid #6366f1' }}>
                                <strong style={{ color: '#6366f1', display: 'block', marginBottom: '5px' }}>3rd House (Cousin / Neighbor):</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_locality?.house_3}</span>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10b981' }}>
                                <strong style={{ color: '#10b981', display: 'block', marginBottom: '5px' }}>11th House (Friend's Family):</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_locality?.house_11}</span>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.05)', borderLeft: '4px solid #fbbf24' }}>
                                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '5px' }}>5th & 9th Houses (Stranger / Foreigner):</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_locality?.house_5_9}</span>
                            </div>
                        </div>
                    </div>

                    {/* Partner Profession */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentIndigo, fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            💼 Partner Profession & Career Wife Significations
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)', borderLeft: '4px solid #6366f1' }}>
                                <strong style={{ color: '#6366f1', display: 'block', marginBottom: '5px' }}>General Profession Judgement (Houses 4, 8, 12):</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_profession?.general}</span>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(244, 63, 94, 0.05)', borderLeft: '4px solid #f43f5e' }}>
                                <strong style={{ color: '#f43f5e', display: 'block', marginBottom: '5px' }}>Career Woman / Working Wife Rule:</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{marriageRules.partner_profession?.career_wife}</span>
                            </div>
                        </div>
                    </div>

                    {/* Characteristics Judgement */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentAmber, fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            👤 Partner Physical Features & Characteristics Judgement
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(marriageRules.characteristics_judgement || {}).map(([key, val]) => (
                                <p key={key} style={{ fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                                    <strong style={{ color: accentAmber, textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</strong> {val}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Survival Rules */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🕊️ Spouse Longevity & Survival Principles
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(marriageRules.survival_rules || {}).map(([key, val]) => (
                                <div key={key} style={{ padding: '15px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
                                    <strong style={{ color: '#ef4444', display: 'block', textTransform: 'capitalize', marginBottom: '5px' }}>{key.replace('_', ' ')}:</strong>
                                    <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SECTION: SUBLORD DEEP (7th Cusp Sublord Features & Psychological Profiles) ── */}
            {activeSection === 'sublord_deep' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* 7th Cusp Sublord Planet & Sign Features Selector */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentPink, fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🪐 7th Cusp Sublord Features (All 12 Signs & 7 Planets)
                        </h4>
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '20px' }}>
                            Select the 7th Cusp Sublord planet and sign to view exact physical features, disposition, and fortune:
                        </p>

                        {/* Planet Selector Tabs */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {planets.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedPlanet(p)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(251, 113, 133, 0.3)',
                                        background: selectedPlanet === p ? accentPink : 'transparent',
                                        color: selectedPlanet === p ? 'white' : textColor,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Sign Selector Grid */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '25px' }}>
                            {zodiacSigns.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSign(s)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        background: selectedSign === s ? accentIndigo : 'rgba(255,255,255,0.03)',
                                        color: selectedSign === s ? 'white' : textColor
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Feature Display Box */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', borderLeft: `4px solid ${accentPink}` }}>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: accentPink, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                                {selectedPlanet} in {selectedSign} (7th Cusp Sublord Signature)
                            </span>
                            <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                                "{marriageRules.seventh_cusp_sublord_features?.[selectedPlanet]?.[selectedSign] || 'No specific record available for this placement.'}"
                            </p>
                        </div>
                    </div>

                    {/* Male / Female Love & Psychological Profiles */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                            <h4 style={{ color: accentIndigo, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
                                🧠 Psychological & Love Profiles (Male & Female)
                            </h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setGenderTab('male')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '100px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: genderTab === 'male' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}
                                >
                                    👨 Male Partner
                                </button>
                                <button
                                    onClick={() => setGenderTab('female')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '100px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: genderTab === 'female' ? '#ec4899' : 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}
                                >
                                    👩 Female Partner
                                </button>
                            </div>
                        </div>

                        {/* Sign Selector */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {zodiacSigns.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedLoveSign(s)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(236, 72, 153, 0.2)',
                                        background: selectedLoveSign === s ? '#ec4899' : 'transparent',
                                        color: selectedLoveSign === s ? 'white' : textColor
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Profile Content Box */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', borderLeft: `4px solid ${genderTab === 'male' ? '#3b82f6' : '#ec4899'}` }}>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: genderTab === 'male' ? '#3b82f6' : '#ec4899', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                                {selectedLoveSign} Sign — {genderTab === 'male' ? 'Male Psychological & Love Profile' : 'Female Psychological & Love Profile'}
                            </span>
                            <p style={{ fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                                {marriageRules.love_and_life_seventh_cusp_sublord?.[selectedLoveSign]?.[genderTab] || 'Profile details available in rules data.'}
                            </p>
                        </div>
                    </div>

                    {/* Rahu / Ketu Sublord Special Rule */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentAmber, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🌑 Rahu / Ketu 7th Cusp Sublord Rule
                        </h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                            "{marriageRules.rahu_ketu_sublord_rule}"
                        </p>
                    </div>
                </div>
            )}

            {/* ── SECTION: PROGENY DEEP (Progeny, Pregnancy Months, Santana Tithi & Remedies) ── */}
            {activeSection === 'progeny_deep' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Month-by-Month Fetal Development */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentEmerald, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🤰 Month-by-Month Fetal Development & Planetary Rulers
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                            {Object.entries(marriageRules.pregnancy_months_development || {
                                "1st Month": "Venus — Seminal Fluid & Fertilization (Shukra)",
                                "2nd Month": "Mars — Blood & Embryo Formation (Rakta)",
                                "3rd Month": "Jupiter — Sprout of Limbs & Vital Energy (Ankur)",
                                "4th Month": "Sun — Bone Structure & Frame (Asthi)",
                                "5th Month": "Moon — Skin, Blood Vessels & Flesh (Charma)",
                                "6th Month": "Saturn — Hair, Nails & Sensory Organs (Anga)",
                                "7th Month": "Mercury — Mental Activity & Consciousness (Caitanya)",
                                "8th Month": "Lagna Lord — Fetal Nourishment & Ojas",
                                "9th Month": "Moon — Uterine Preparation & Contractions",
                                "10th Month": "Sun — Labor Fructification & Delivery"
                            }).map(([month, desc]) => (
                                <div key={month} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <strong style={{ color: accentEmerald, fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>{month}</strong>
                                    <span style={{ fontSize: '12px', lineHeight: '1.5' }}>{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Santana Tithi System */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentPink, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🌙 Santana Tithi System & Progeny Timing
                        </h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                            {typeof marriageRules.santana_thithi_system === 'string' ? marriageRules.santana_thithi_system : 'Santana Tithi is calculated by multiplying Moon-Sun longitude difference by 5 to verify birth promise.'}
                        </p>
                    </div>

                    {/* Adoption Rules & Balarishta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: cardBg, borderRadius: '24px', padding: '25px', border: cardBorder }}>
                            <h4 style={{ color: accentIndigo, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                                👶 Child Adoption Rules
                            </h4>
                            <p style={{ fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
                                {typeof marriageRules.adoption_rules === 'string' ? marriageRules.adoption_rules : 'Adopted child signatures occur when 5th house connects with Saturn/Mercury and Moon is in Saturn signs.'}
                            </p>
                        </div>
                        <div style={{ background: cardBg, borderRadius: '24px', padding: '25px', border: cardBorder }}>
                            <h4 style={{ color: '#ef4444', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                                🍼 Balarishta & Childhood Health
                            </h4>
                            <p style={{ fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
                                {typeof marriageRules.balarishta_rules === 'string' ? marriageRules.balarishta_rules : 'Afflictions to Moon in 6, 8, 12 without benefic aspect require Nakshatra Shanthi and protection.'}
                            </p>
                        </div>
                    </div>

                    {/* Sterility & Impotency Principles */}
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            ⚕️ Infertility, Sterility & Impotency Principles
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
                                <strong style={{ color: '#ef4444', display: 'block', marginBottom: '5px' }}>Sterility Signatures:</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{typeof marriageRules.who_is_sterile_principles === 'string' ? marriageRules.who_is_sterile_principles : 'Barren signs (Aries, Gemini, Leo, Virgo) on 5th cusp with Saturn/Ketu aspect indicate sterility.'}</span>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
                                <strong style={{ color: '#ef4444', display: 'block', marginBottom: '5px' }}>Eunuch & Impotency Principles:</strong>
                                <span style={{ fontSize: '13px', lineHeight: '1.6' }}>{typeof marriageRules.impotency_and_eunuch_principles === 'string' ? marriageRules.impotency_and_eunuch_principles : 'Saturn & Mercury influencing Lagna and 7th cusp sublord without Venus strength.'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vedic Remedies & Shanthi */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h4 style={{ color: accentEmerald, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            🕉️ Vedic Remedies, Idols & Shanthi Rituals
                        </h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                            {typeof marriageRules.remedial_idols_and_shanthi === 'string' ? marriageRules.remedial_idols_and_shanthi : 'Santana Gopal Mantra, Harivamsa Purana recitation, and donation of silver idols pacify progeny obstacles.'}
                        </p>
                    </div>
                </div>
            )}

            {/* ── SECTION: CASE STUDIES DEEP (Natal & Horary Case Studies 1-10) ── */}
            {activeSection === 'case_studies_deep' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ background: cardBg, borderRadius: '24px', padding: '30px', border: cardBorder }}>
                        <h4 style={{ color: accentPink, fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                            📜 Natal & KP Horary Case Studies (1 through 10+)
                        </h4>
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '20px' }}>
                            Select any case study to read full astrological reasoning, ruling planets, and fructification events:
                        </p>

                        {/* Case Studies Selector Grid */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' }}>
                            {caseStudiesList.map(cs => (
                                <button
                                    key={cs.id}
                                    onClick={() => setActiveCaseStudy(cs.id)}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(251, 113, 133, 0.2)',
                                        background: activeCaseStudy === cs.id ? accentPink : 'rgba(255,255,255,0.03)',
                                        color: activeCaseStudy === cs.id ? 'white' : textColor
                                    }}
                                >
                                    {cs.title.split(':')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Active Case Study Details Box */}
                        {(() => {
                            const cs = caseStudiesList.find(c => c.id === activeCaseStudy);
                            if (!cs) return null;
                            return (
                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '25px', borderLeft: `4px solid ${accentPink}` }}>
                                    <h5 style={{ color: accentPink, fontSize: '14px', fontWeight: 900, marginBottom: '12px' }}>
                                        {cs.title}
                                    </h5>
                                    <p style={{ fontSize: '13px', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>
                                        "{typeof cs.data === 'string' ? cs.data : JSON.stringify(cs.data, null, 2)}"
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

        </div>
    );
}
