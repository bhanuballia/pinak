import React, { useState, useEffect } from 'react';

export default function MuhurtCalculator() {
    const [ceremony, setCeremony] = useState("Marriage");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ceremonies = [
        "Marriage", "Namkaran", "Anna Prashan", "Mundan", "Upnayan", "Sagai", "Tilak", "Vadhu Pravesh", "Grih Pravesh", "Bhoomi Pujan", "Vehicle Purchase"
    ].sort();

    const calculate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/muhurt/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate || undefined,
                    days: endDate ? undefined : 60,
                    ceremony: ceremony
                })
            });
            if (!res.ok) throw new Error("Divine timing calculation failed.");
            const data = await res.json();
            setResults(data.dates.filter(d => d.is_auspicious));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white', fontFamily: 'serif', padding: '60px' }}>
            <div style={{ maxW: '1000px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h4 style={{ color: '#10b981', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '13px', fontWeight: 900 }}>Shubha Kaala</h4>
                    <h1 style={{ fontSize: '56px', fontWeight: 900, fontStyle: 'italic', marginTop: '10px', background: 'linear-gradient(to right, #10b981, #d4af37, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Muhurt Calculator
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '18px', marginTop: '20px' }}>
                        Identifying the most auspicious cosmic windows for your life’s milestones.
                    </p>
                </header>

                <div style={{ background: 'rgba(30,41,59,0.3)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#10b981', fontWeight: 900, marginBottom: '10px' }}>Select Ceremony</label>
                            <select
                                value={ceremony}
                                onChange={(e) => setCeremony(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px', borderRadius: '15px', fontSize: '16px' }}
                            >
                                {ceremonies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#10b981', fontWeight: 900, marginBottom: '10px' }}>Search From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px', borderRadius: '15px', fontSize: '16px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#10b981', fontWeight: 900, marginBottom: '10px' }}>Search Until (Optional)</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px', borderRadius: '15px', fontSize: '16px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={calculate}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '15px',
                                    background: '#10b981',
                                    color: '#020617',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                {loading ? 'Scanning Time...' : 'Find Auspicious Dates'}
                            </button>
                        </div>
                    </div>

                    {error && <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>{error}</div>}

                    {results && (
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '20px' }}>Recommended Dates (Next 60 Days):</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {results.length > 0 ? results.map((d, i) => (
                                    <div key={i} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '25px', borderRadius: '25px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#10b981', fontWeight: 900, marginBottom: '5px' }}>{d.weekday}</div>
                                        <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '10px' }}>{new Date(d.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#cbd5e1' }}>
                                            <span>🌙 {d.nakshatra}</span>
                                            <span>📅 {d.tithi}</span>
                                        </div>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '40px', opacity: 0.1 }}>✨</div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px', color: '#94a3b8', fontStyle: 'italic' }}>
                                        No highly auspicious dates found for {ceremony} in the next 60 days. Please adjust your criteria.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {ceremony === "Bhoomi Pujan" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '30px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <h2 style={{ color: '#10b981', fontSize: '28px', marginBottom: '20px' }}>Significance of Bhoomi Pujan</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Spiritual Logic</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Vastu Shastra gives immense importance to the timing of the ceremony. The foundation laying follows a specific sequence of rituals to synchronize with the Vastu Purush.
                                        Legend says Vastu Purush was born from a drop of Lord Shiva's sweat, and seeking his blessing is mandatory for any building to ensure peace and stability.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Major Deities Invoked</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li><b>Lord Ganesha:</b> The remover of obstacles.</li>
                                        <li><b>Bhoomi Devi:</b> Mother Earth, the provider of stability.</li>
                                        <li><b>Vastu Purush:</b> The deity of construction and directions.</li>
                                        <li><b>Panch Mahabhutas:</b> For balancing the five elements.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Benefits of Accurate Timing</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', listStyleType: 'sparkles' }}>
                                        <li><b>Vastu Dosha Removal:</b> Purifies the land of negative energies.</li>
                                        <li><b>Success in Construction:</b> Removes delays, accidents, and hurdles.</li>
                                        <li><b>Divine Blessings:</b> Invokes the grace of Lord Vishnu and Mother Earth.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Monthly Overview</h3>
                                    <p style={{ opacity: 0.7, fontSize: '12px', lineHeight: '1.4' }}>
                                        <b>Highly Auspicious:</b> Feb (Maagh), May (Vaishakha), June (Jyeshtha), Aug (Shravana), Nov (Kartika), Dec (Agahana).<br />
                                        <b>Use Caution:</b> April (Chaitra), July (Ashadha), Oct (Ashvin) are generally avoided.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Namkaran" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '30px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <h2 style={{ color: '#3b82f6', fontSize: '28px', marginBottom: '20px' }}>Classical Methodology of Muhurat Selection</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Our Namkaran Muhurat Expert team does not just look at superficial dates while determining the muhurat; they follow deep and subtle standards of astrological calculation certified by our sages for centuries. While deriving the Kundli Based Namkaran Muhurat, we conduct a microscopic analysis of the following main pillars:
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Panchang Purity and Selection of Days</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The choice of auspicious days is extremely important for Namkaran. <b>Monday</b> (for mental peace), <b>Wednesday</b> (for intellect), <b>Thursday</b> (for knowledge), and <b>Friday</b> (for luxury) are considered most auspicious. During calculation, we completely avoid 'Rikta' dates through the Panchang Calendar.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Nakshatra Purity and Rashi Bal</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The 'Name Letter' is selected based on the constellation the Moon is in at the time of birth. For Namkaran Muhurat by Astrologer, top priority is given to constellations like <i>Mrigashira, Hasta, Chitra, Swati, Anuradha,</i> and <i>Revati.</i> We specifically ensure that the transit of the Moon at the time of the ritual is not in the 4th, 8th, or 12th house from the child's sign.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>3. Abandonment of Inauspicious Yogas and Defects</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        We pay special attention to cosmic obstacles. In muhurat selection, we discard inauspicious times like Rahu Kaal, Yamaghant, and Kharmas. Additionally, we subtly consider the status of Choghadiya Muhurat and Hora Muhurat so that every moment of the main Anushthan is filled with divine energy.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Complete Details of Naming Method and Rituals</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The spiritual benefit of a successful Namkaran is attained only when it is performed with classical Puja Vidhi and full devotion. Here are the main steps of the ritual:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Purification:</b> The mother and child are given a holy bath and the house is purified with mantras.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Divine Invocation:</b> First, Lord Ganesha, the family deity, and the Navagrahas are worshipped.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Naming the Infant:</b> This is the main part of the ritual. The father whispers the name slowly into the child's right ear three times with the help of a gold ring or Kusha grass.</li>
                                        <li><b>Blessings and Donation:</b> Elders shower flowers on the infant and donations are made according to capacity.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Anna Prashan" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '30px', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                            <h2 style={{ color: '#ec4899', fontSize: '28px', marginBottom: '20px' }}>Classical Methodology of Muhurat Selection</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        While selecting the annaprashan muhurat by astrologer, our experts do not just look at the dates of the Panchang, but conduct a microscopic analysis of the alignment of planets with the infant's horoscope. While determining the kundli based annaprashan muhurat, the following main pillars are kept in mind:
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Panchang Purity and Auspicious Days</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        <b>Monday</b>, <b>Wednesday</b>, <b>Thursday</b>, and <b>Friday</b> are considered most auspicious for Annaprashan. During calculation, we select auspicious dates by avoiding 'Rikta' tithis through the Panchang Calendar. For any specific information, you can take Muhurat Consultation from our experts.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Nakshatra and Chandra Bala</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        For annaprashan muhurat booking, priority is given to stable and gentle constellations like <i>Rohini, Mrigashira, Uttara Phalguni, Hasta, Chitra, Swati, Anuradha,</i> and <i>Revati.</i> We specifically look at the position of the Moon, as the Moon is the significator of food and mind. It is considered prohibited for the Moon to be in the 4th, 8th, or 12th house from the birth sign. During the calculation, we also pay special attention to Bhadra.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>3. Consideration of Age and Gender</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        According to the scriptures, the 6th or 8th month for boys and the 5th or 7th month for girls are excellent for Annaprashan. Our acharyas determine the most accurate time by looking at the child's Kundli.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Annaprashan Method and Ritual Guidance</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        A successful Annaprashan benefit is attained only when it is performed with full devotion and the correct Puja Vidhi. Its main process is as follows:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Ganesh Pujan:</b> First, Lord Ganesha is worshipped to remove any obstacles.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Divine Invocation:</b> After this, the family deity and Mother Annapurna are invoked so that their grace remains on the infant.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Sacred Food:</b> Curd mixed with honey or kheer is prepared for the child in a silver vessel.</li>
                                        <li><b>Feeding the Grain:</b> As soon as the auspicious hour starts, the elder members of the house feed the infant for the first time. For a detailed Anushthan process, you can take guidance from our experts.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Mundan" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '30px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                            <h2 style={{ color: '#f59e0b', fontSize: '28px', marginBottom: '20px' }}>How to Find Shubh Mundan Sanskar Muhurat?</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Selecting an accurate mundan muhurat consultation is a complex astrological calculation. To know the auspicious time, attention is paid to the following elements:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '15px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Tithis:</b> Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, and Trayodashi.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Days:</b> Monday, Wednesday, Thursday, and Friday are best.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Nakshatras:</b> Ashwini, Mrigashira, Pushya, Hasta, Punarvasu, etc.</li>
                                    </ul>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Since Shubh Muhurat is not available every day, it is mandatory to take a vedic mundan muhurat consultation from an experienced Acharya.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Monthly Overview of Mundan Muhurat</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        Generally, the period of the Uttarayan Sun is considered best for Mundan. Here is the general information:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '15px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>January–June:</b> Auspicious dates for Mundan are often available in these months.</li>
                                        <li style={{ marginBottom: '8px' }}><b>July–October:</b> Due to Chaturmas and the Shradh period, muhurats are rare or prohibited.</li>
                                        <li style={{ marginBottom: '8px' }}><b>November–December:</b> Manglik works resume after Devuthani Ekadashi.</li>
                                    </ul>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        For any month, you can get mundan muhurat online and save time. For superior results, taking a muhurat consultation from an experienced astrologer is the best decision.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Mundan Sanskar Procedure and Rituals</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        Mundan is an extensive ritual through which the child receives divine blessings. It is necessary to follow all steps of the Puja Vidhi. You should book mundan muhurat expert so that they can conduct it according to the prescribed rites.
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Sankalp and Worship:</b> The priest invokes Lord Ganesha and takes a vow for the Mundan.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Razor Worship:</b> The razor used in the Mundan is worshiped with Roli, Akshat, and flowers.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Bath and Application:</b> After the Mundan, the child is bathed and a paste of turmeric and sandalwood is applied to the head.</li>
                                        <li><b>Hair Immersion:</b> The hair is immersed according to established traditions.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Benefits of Mundan Sanskar</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        The benefits of Mundan are linked to the infant's health and mental development. It allows the scalp to come into direct contact with sunlight and keeps the body temperature normal. The new hair that grows after Mundan is thicker and healthier. Additionally, it strengthens the foundation for future auspicious events like Marriage Muhurat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Upnayan" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '30px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                            <h2 style={{ color: '#8b5cf6', fontSize: '28px', marginBottom: '20px' }}>Classical Methodology of Muhurat Selection</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Our Upanayana Muhurat Expert team conducts a microscopic analysis of the child's age and planetary positions. While determining the muhurat, the following main pillars are kept in mind:
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Child's Age and Panchang Purity</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        According to the scriptures, the Upanayana Sanskar is performed in odd years (5th, 7th, 9th, or 11th year). During the calculation, we select auspicious days (Sunday, Monday, Wednesday, Thursday, Friday) and auspicious dates (2nd, 3rd, 5th, 10th, 11th, 12th) through the Panchang Calendar.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Nakshatra and Tara Bal</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        For Janeu Sanskar Muhurat, priority is given to stable and gentle constellations like Hasta, Chitra, Swati, Anuradha, Shravan, Dhanishta, and Revati. The compatibility of Chandra Bala and Tara Bal is checked from the child's sign so that the full benefit of the sacrament can be obtained.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>3. Sun's Northern Transit (Uttarayana)</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        For Yagyopavit, it is considered mandatory for the Sun to be in 'Uttarayana' (Northern Transit), as the Sun's energy is superior for knowledge-seeking during this time. We ensure that Jupiter (Brihaspati) and Venus are not combust (Asta) at the time of the sacrament, as they are the main significators of education and knowledge.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>4. Avoidance of Prohibited Yogas</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        In muhurat selection, Bhadra, Rahukaal, and decaying dates (Kshaya Tithis) are completely avoided. Additionally, we also consider Choghadiya Muhurat and Hora Muhurat so that the moment of the main ritual is faultless.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Detailed Ritual Procedure (Upanayana Vidhi)</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The full benefit of an Auspicious Upanayana Muhurat Consultation is attained only when the Ritual is performed according to the classical method:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Mundan and Bath:</b> As a symbol of purification, the child's head is shaved (Mundan) and he is bathed with holy water.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Yagyopavit Dharan:</b> Before the sacrificial fire (Havan), the Guru makes the child wear the triple-threaded Yagyopavit, which symbolizes Dev-rin (debt to deities), Rishi-rin (debt to seers), and Pitra-rin (debt to ancestors).</li>
                                        <li style={{ marginBottom: '8px' }}><b>Gayatri Upadesh:</b> The Guru whispers the supreme holy Gayatri Mantra into the child's ear, which gives him the power to walk the path of knowledge.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Mekhla and Danda Dharan:</b> A Mekhla (waistband) is tied around the child's waist and he is given a staff (Danda), which is a symbol of his vow of celibacy (Brahmacharya) and protection.</li>
                                        <li><b>Bhikshatan:</b> The child seeks alms (Bhiksha) from his mother and other elders, which develops qualities of humility and self-reliance in him. For a detailed Puja Vidhi, you can contact us.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Spiritual and Scientific Benefits</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Spiritual Benefits:</b> Wearing the Yagyopavit gives the child the right to study the Vedas and perform Sandhya Vandan. It increases his spiritual strength.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Scientific Benefits:</b> By wrapping the Janeu on the ear and placing pressure on specific points of the body, blood pressure remains controlled and memory becomes sharp.</li>
                                        <li><b>Mental Stability:</b> Constant chanting of the Gayatri Mantra keeps the nerves of the child's brain calm and removes stress.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Sagai" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '30px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                            <h2 style={{ color: '#ef4444', fontSize: '28px', marginBottom: '20px' }}>Classical Methodology of Sagai Muhurat Selection</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Our Sagai Muhurat Expert team analyzes the following elements microscopically while determining the muhurat:
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Tara and Chandra Bala</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The position of the Moon is checked from the birth signs of both the groom and the bride. For this, a deep study of the individual's Kundli is conducted to ensure that the day is fortunate for them.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Nakshatra Purity</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        For an Accurate Sagai Muhurat Consultation, the significance of fixed and movable Nakshatras is paramount. We also deeply consider Nakshatras like <i>Pushya</i> and <i>Shravan</i>. Similarly, we pay special attention to the purity of Nakshatras for Mundan Muhurat and Vadhu Pravesh Muhurat.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>3. Selection of Tithi and Day</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        While determining Sagai Muhurat by Astrologer, auspicious Tithis (Dwitiya, Tritiya, Panchami, etc.) and auspicious days are selected. During the calculation, we also microscopically consider Choghadiya Muhurat and Hora Muhurat so that the cosmic energy is at its peak during the ritual.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Engagement Method, Rituals, and Worship</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The full benefit of an Auspicious Sagai Muhurat Consultation is attained only when the Anushthan is performed according to the prescribed rites:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Sankalp:</b> The Acharya makes the bride, groom, and their fathers take a formal vow.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Tilak Ritual:</b> The bride's side applies tilak to the groom and presents gifts.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Ring Ceremony:</b> The ring is worn exactly at the time provided by us.</li>
                                        <li><b>Mantra Chanting:</b> Special mantras are chanted for auspiciousness. For a detailed Puja Vidhi you can take guidance from our experts.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Tilak" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '30px', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
                            <h2 style={{ color: '#fbbf24', fontSize: '28px', marginBottom: '20px' }}>Significance of Tilak Ritual</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Panchang and Planetary Strength</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Priority is given to <b>Monday, Wednesday, Thursday, and Friday.</b> 'Jaya' and 'Purna' dates (2,3,5,7,10,11,13) are meticulously selected.
                                        We also ensure <b>Jupiter and Venus</b> are not combust and the Sun is not in <i>Kharmas</i> (Sagittarius/Pisces).
                                    </p>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Ceremony procedure</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Groom sits facing East. The bride's father takes a <b>Sankalp</b> (vow) to honor the alliance. Tilak is applied to the Ajna Chakra, and a Coconut (Shriphal) is presented as a symbol of Ganesha and Lakshmi.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Spiritual Significance of Materials</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li><b>Roli/Kumkum:</b> Symbol of energy; increases concentration at the third eye.</li>
                                        <li><b>Akshat:</b> Unbroken rice symbolizing an unbreakable and solid relationship.</li>
                                        <li><b>Coconut:</b> Brings wealth and happiness through divine blessings.</li>
                                        <li><b>Turmeric/Sandalwood:</b> Invokes peace, coolness, and excellent health for the couple.</li>
                                        <li><b>Forbidden Period:</b> We advise avoiding Tilak during <i>Chaturmas</i> (July-Oct) when Lord Vishnu is in Yogic sleep.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Marriage" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(219, 39, 119, 0.05)', borderRadius: '30px', border: '1px solid rgba(219, 39, 119, 0.1)' }}>
                            <h2 style={{ color: '#db2777', fontSize: '28px', marginBottom: '20px' }}>Significance of Marriage Muhurat</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Alignment of Planets</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        The very foundation of a union rests upon the balance of planetary energy. An auspicious time ensures favorable alignment for both groom and bride, preventing negative interference and ensuring long-term happiness, love, and mutual understanding.
                                    </p>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Prohibited Periods</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Marriage is strictly avoided during:
                                        <ul style={{ paddingLeft: '20px' }}>
                                            <li><b>Guru/Shukra Asta:</b> When Jupiter or Venus are combust.</li>
                                            <li><b>Chaturmas:</b> When Lord Vishnu is in Yogic sleep (usually July-Oct).</li>
                                            <li><b>Kharmas:</b> When the Sun transits Sagittarius or Pisces.</li>
                                            <li><b>Pitru Paksha:</b> The sacred period of honoring ancestors.</li>
                                        </ul>
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Monthly Overview</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', listStyleType: 'sparkles' }}>
                                        <li><b>Spring/Summer:</b> Vaishakha and Jyeshtha are considered extremely excellent.</li>
                                        <li><b>Winter:</b> Kartik (after Devotthan) and Margashirsha provide premium dates.</li>
                                        <li><b>July - Sept:</b> Completely prohibited due to Chaturmas and Pitru Paksha.</li>
                                    </ul>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Technical Pillars</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.4' }}>
                                        The engine conducts a deep study of <b>Tribal Shuddhi</b> (compatibility of Sun, Moon, and Jupiter) and ensures the <b>Chandra Bala</b> is auspicious for both zodiac signs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Vadhu Pravesh" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(5, 150, 105, 0.05)', borderRadius: '30px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                            <h2 style={{ color: '#059669', fontSize: '28px', marginBottom: '20px' }}>Significance of Vadhu Pravesh</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Main Principles</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Vadhu Pravesh is the auspicious entry of the new bride into her in-laws' home. For maximum fruitfulness, <b>Godhuli Vela</b> (evening confluence of day/night) is considered extremely superior.
                                    </p>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Ritual Procedure</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        Door is decorated with mango leaves and Swastikas. The bride gently tips a <b>Kalash of Rice</b> with her right foot symbolizing abundance, and steps into <b>Red Mahavar</b> (Kumkum) to leave "Lakshmi footprints" in the household.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Strategic Tithis & Nakshatras</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li><b>Dhruva (Fixed):</b> Rohini and Uttara constellations ensure stability and long-term harmony.</li>
                                        <li><b>Chara (Movable):</b> Swati, Shravan, and Dhanishta for dynamic happiness.</li>
                                        <li><b>Days:</b> Monday (Peace), Wednesday (Knowledge), Thursday (Luck), and Friday (Glory).</li>
                                        <li><b>Avoid:</b> Chaturmas and malefic Lagnas related to the 8th house.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button
                        onClick={() => window.close()}
                        style={{ padding: '15px 40px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: '100px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 900, letterSpacing: '4px', cursor: 'pointer' }}
                    >
                        Return to Console
                    </button>
                </div>
            </div>
        </div>
    );
}
