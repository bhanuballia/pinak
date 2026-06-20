import React, { useState, useEffect } from 'react';
import MuhurtHeatmap from './MuhurtHeatmap';

export default function MuhurtCalculator() {
    const [ceremony, setCeremony] = useState("Marriage");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            try {
                setWorksheetData(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse worksheetData inside MuhurtCalculator", e);
            }
        }
    }, []);


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

                    {/* Auspiciousness Heatmap Panel */}
                    <div style={{ marginTop: '50px', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '4px', color: '#10b981', fontWeight: 900, marginBottom: '20px', textAlign: 'center' }}>
                            Interactive Auspiciousness Heatmap Calendar
                        </h2>
                        <MuhurtHeatmap data={worksheetData} />
                    </div>

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
                            <h2 style={{ color: '#db2777', fontSize: '28px', marginBottom: '20px' }}>How is Marriage Muhurat Calculated in Sanatan Jyoti?</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Our Marriage Muhurat Expert team considers not only the Panchang but also Kundali matching and the purification of the tenth house while determining the wedding date. While providing Personalized Marriage Muhurat Consultation, we analyze the following factors:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Nakshatra:</b> Calculation of Nakshatras like Rohini, Mrigashira, Hasta, Swati, etc.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Tithi and Day:</b> Selection of auspicious dates.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Moon of Groom-Bride:</b> Strength of the Moon according to the zodiac signs of both.</li>
                                        <li><b>Tribal Shuddhi:</b> Checking the compatibility of the Sun, Jupiter, and the Moon.</li>
                                    </ul>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        Due to these subtle calculations, our Online Marriage Muhurat Consultation service is considered the most reliable. The selection of the engagement muhurat before marriage should also be done with equal care.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Spiritual and Astrological Significance</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The significance of muhurat for marriage is unique from both astrological and spiritual perspectives. The very foundation of a marriage rests upon an Auspicious Marriage Muhurat.
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Alignment of Planets:</b> Favorable planetary positions are ensured for the groom and bride, preventing negative energies from entering their lives.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Removal of Obstacles:</b> All hindrances, obstacles, and unpleasant incidents associated with the wedding ceremony are averted.</li>
                                        <li><b>Long-term Happiness:</b> A marriage performed in an astrologically favorable muhurat increases love, respect, and mutual understanding between both parties, making married life successful and long-lasting.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Benefits of Marriage Muhurat</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        When you Book an Astrologer for Marriage Muhurat and complete the marriage under their guidance, it has several spiritual benefits:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '15px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Protection from Obstacles:</b> There is protection from untoward incidents or interruptions coming during the wedding ceremony.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Longevity and Health:</b> The desire for better health and long life of the couple is fulfilled.</li>
                                        <li><b>Mental Peace:</b> The host remains satisfied that they have followed all the scriptures.</li>
                                    </ul>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6' }}>
                                        If you also want to know the best time for your or your loved ones' marriage, then Book Marriage Muhurat Consultation now. Along with this, do not forget to consider the Griha Pravesh Muhurat for a new beginning of domestic life.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Main Factors of Muhurat Selection</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        To determine the Auspicious Marriage Muhurat of the wedding, a deep study of the five limbs of the 'Panchang' (Tithi, Vaar, Nakshatra, Yoga, and Karana) is conducted. Additionally, some other primary factors are considered:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Bala Shuddhi & Lagna Shuddhi:</b> It is most necessary for Tara Bala and Chandra Bala to be favorable. 'Lagna Shuddhi' is most necessary in an Auspicious Wedding Muhurat.</li>
                                        <li><b>Guna Milan:</b> Before extracting the marriage muhurat, Guna Milan or Kundali Milan of the groom and bride is mandatory. A minimum of 18 out of 36 qualities matching is considered auspicious.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Special Muhurats and Auspicious Days</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Vaar:</b> Monday, Wednesday, Thursday, and Friday (Tuesday and Saturday are usually avoided).</li>
                                        <li style={{ marginBottom: '8px' }}><b>Auspicious Tithis:</b> Dwitiya, Tritiya, Panchami, Saptami, Ekadashi, Trayodashi.</li>
                                        <li><b>Auspicious Nakshatras:</b> Rohini, Mrigashira, Magha, Hasta, Swati, Anuradha, Moola, Uttara Phalguni, Uttara Bhadrapada, Uttarashada, Revati.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Monthly Marriage Muhurat Overview</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Winter and Spring:</b> Medium auspicious muhurats start appearing in February (Magha/Phalguna) and March (Phalguna/Chaitra).</li>
                                        <li style={{ marginBottom: '8px' }}><b>Summer Season (Best Period):</b> In April and May (Chaitra/Vaishakha/Jyeshtha), the number of Marriage Muhurats increases and it has been considered very excellent.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Chaturmas and Rainy Season:</b> Completely prohibited for marriage (from Devshayani Ekadashi to Devuthani Ekadashi).</li>
                                        <li><b>Autumn Season:</b> Return of best Marriage Muhurats from Devothani Ekadashi in November/December.</li>
                                    </ul>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Prohibited Period for Marriage</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Guru Asta and Shukra Asta:</b> When Jupiter (Guru) and Venus planets are set, their auspicious effect ends.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Chaturmas:</b> When Lord Vishnu is in Yoganidra.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Pitru Paksha (Shraddha):</b> The period of expressing respect towards ancestors.</li>
                                        <li><b>Malmas or Kharmas:</b> When the Sun enters Sagittarius or Pisces.</li>
                                    </ul>
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
                    {ceremony === "Grih Pravesh" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '30px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                            <h2 style={{ color: '#0ea5e9', fontSize: '28px', marginBottom: '20px' }}>Necessity and Vastu Significance of Griha Pravesh Muhurat</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        According to Vastu Shastra, every land and building has its own energy. The main objective of Grih Pravesh Muhurat Consultation is to balance that energy and please the Vastu Purusha (the presiding deity of the building). Entering at an auspicious time creates a divine protective shield in the building. A skilled Grih Pravesh Muhurat Expert ensures that directional flaws (Dishashool) or other celestial obstacles do not hinder the housewarming.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Benefits of Shubh Grih Pravesh Muhurat Consultation:</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Stability in the Building:</b> Entering at an auspicious time protects the building from natural and man-made disasters and brings stability to the property.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Continuity of Wealth:</b> If the entry is made during a stable Griha Pravesh, Goddess Lakshmi resides permanently, leading to economic progress and an increase in wealth accumulation.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Completeness of Vastu Purification:</b> Special worship and Havan eliminate any negative energy accumulated during building construction.</li>
                                        <li><b>Family Harmony:</b> Personalized Grih Pravesh Muhurat Consultation ensures that love, cooperation, and mental peace remain among members in the new home.</li>
                                    </ul>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Our Classical Methodology of Muhurat Selection</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        While selecting the Grih Pravesh Muhurat by Astrologer, our experts do not just look at the dates of the Panchang, but conduct a microscopic analysis of the alignment of planets with the house owner's horoscope. While determining the Kundli Based Grih Pravesh Muhurat, the following main pillars are kept in mind:
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Auspicious Day and Panchang Purity</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        <b>Monday</b> (for mental peace), <b>Wednesday</b> (for business and intellect), <b>Thursday</b> (for good fortune), and <b>Friday</b> (for luxury) are considered best for housewarming. We usually advise avoiding Tuesday, Saturday, and Sunday. During calculation, we select auspicious dates (2nd, 3rd, 5th, etc.) through the Panchang.
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Selection of Stable Nakshatras</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        Priority is given only to 'stable constellations' (Sthira Nakshatras) for housewarming so that the residence in the building remains pleasant and permanent. Major ones include <i>Uttara Phalguni, Uttarashada, Uttara Bhadrapada, Rohini,</i> and <i>Dhanishta.</i> During calculation, we pay special attention to Bhadra and other inauspicious yogas so that your entry is unobstructed.
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>3. Avoidance of Prohibited Periods and Defects</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        In Griha Pravesh Muhurat selection, Rahu Kaal, Kharmas (Malmas), and eclipse periods are completely avoided. Additionally, we also take care of the combustion (Asta) period of Jupiter and Venus, because no auspicious work can be successful without them. Furthermore, we also subtly consider Choghadiya Muhurat and Hora Muhurat.
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Housewarming Method and Ritual Guidance</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The full benefit of a successful Grih Pravesh Ceremony Muhurat Consultation is attained only when the Anushthan is performed according to the classical method. Its main process is as follows:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Door Worship and Toran:</b> The main entrance is decorated with marigold flowers and mango leaves (Toran), which is a symbol of positive energy.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Kalash Entry:</b> At the auspicious time, the house owner enters the building by carrying the Mangal Kalash (filled with water, coins, and coconut) while placing the right foot inside first.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Vastu Shanti Puja:</b> Vastu Purusha is invoked in the Northeast corner (Ishan Kon) of the house so that welfare remains in every corner of the building.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Agni Sthapan (Havan):</b> Havan is performed for a pure atmosphere and to remove negativity.</li>
                                        <li><b>Kitchen Ritual:</b> For the first time, the ritual of boiling milk is performed in the kitchen. For a detailed Griha Pravesh guide, you can take guidance from our experts.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {ceremony === "Vehicle Purchase" && (
                        <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '30px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                            <h2 style={{ color: '#a855f7', fontSize: '28px', marginBottom: '20px' }}>Why is Vehicle Purchase Muhurat Astrology Mandatory?</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        The fourth house in a horoscope represents happiness and property, and the planet Venus is the significator of material comforts. A vehicle purchase muhurat expert assesses the position of your 'Chaturthesh' (Lord of the fourth house) to ensure that the asset you are buying remains a source of joy for you. Choosing a time according to vehicle purchase muhurat astrology minimizes the risk of accidents and mechanical failures. It acts as a spiritual protective shield that guards you on the road and increases the life of the machine. Determining the timing through a vehicle buying muhurat by astrologer also brings economic stability to your life.
                                    </p>

                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Specific Benefits of Accurate Vehicle Purchase Muhurat Consultation:</h3>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Safety and Protection:</b> A start ensured through personalized vehicle purchase muhurat consultation reduces the probability of accidents.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Durability and Low Maintenance:</b> When the influence of Saturn is favorable, the vehicle requires less repair and runs smoothly for years.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Economic Stability:</b> kundli based vehicle purchase muhurat prevents the unnecessary expenditure of money caused by a 'defective' machine.</li>
                                        <li><b>Success in Business:</b> For commercial vehicles, kundli based vehicle purchase muhurat booking ensures that the vehicle brings continuous profit and reliability to your business.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Our Classical Methodology of Muhurat Selection</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        While determining the vehicle purchase muhurat consultation, our experts do not just look at general dates. We analyze subtle details and link them with the birth details of the vehicle owner.
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>1. Selection of Auspicious Days and Tithis</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        Monday, Wednesday, Thursday, and Friday are considered excellent for buying a vehicle. During vehicle purchase muhurat booking, we prioritize auspicious dates such as 2, 3, 5, 7, 8, 10, 11, 12, and 13. We specifically avoid 'Rikta' Tithis (4, 9, 14) and Amavasya. For a detailed Muhurat Consultation, you can connect with our acharyas.
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>2. Analysis of Nakshatra and Chandra Bala</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        Favorable constellations like Pushya, Punarvasu, Swati, Shravan, Ashwini, and Revati are focused upon for the vehicle. We ensure that the Moon is not in the 4, 8, or 12 house from your Rashi, as it can cause mental instability while driving. We also microscopically check Bhadra and Panchak Details to avoid any inauspicious influence.
                                    </p>
                                    
                                    <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '10px' }}>Vehicle Puja Vidhi and Ritual Guidance</h3>
                                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                                        The spiritual journey of your vehicle begins with a proper Anushthan. Here are the main steps of the puja:
                                    </p>
                                    <ul style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                        <li style={{ marginBottom: '8px' }}><b>Ganesh Pujan:</b> First, worship Lord Ganesha, the remover of obstacles.</li>
                                        <li style={{ marginBottom: '8px' }}><b>Creating the Swastik:</b> Draw a Swastik with turmeric or vermillion on the bonnet or dashboard of the vehicle.</li>
                                        <li><b>Coconut and Lemon:</b> Breaking a coconut in front of the vehicle and crushing lemons under the tires is a traditional way to remove negative energy. Our experts provide you with detailed Puja Vidhi information.</li>
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
