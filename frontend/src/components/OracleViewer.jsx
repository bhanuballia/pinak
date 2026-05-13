import React, { useState, useEffect, Component } from 'react';
import LoShuGrid from './LoShuGrid';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("OracleViewer Crash:", error, errorInfo);
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 bg-red-50 text-red-900 h-screen font-mono text-sm overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">React UI Crash</h1>
                    <p className="mb-4">Something went wrong while rendering this panel.</p>
                    <div className="bg-red-100 p-4 rounded mb-4 font-bold">{this.state.error?.toString()}</div>
                    <pre className="text-xs">{this.state.errorInfo?.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const ORACLE_ITEMS = [
    { id: "study", label: "Study", icon: "📚", color: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)" },
    { id: "career", label: "Career", icon: "💼", color: "linear-gradient(135deg, #334155 0%, #0f172a 100%)" },
    { id: "finance", label: "Finance", icon: "💰", color: "linear-gradient(135deg, #10b981 0%, #0f766e 100%)" },
    { id: "marriage", label: "Marriage", icon: "💍", color: "linear-gradient(135deg, #fb7185 0%, #db2777 100%)" },
    { id: "business", label: "Business", icon: "💹", color: "linear-gradient(135deg, #f59e0b 0%, #c2410c 100%)" },
    { id: "health", label: "Health", icon: "🏥", color: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" },
    { id: "parents_health", label: "Parents Health", icon: "👨‍👩‍👧", color: "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)" },
    { id: "spouse_health", label: "Spouse Health", icon: "💑", color: "linear-gradient(135deg, #d946ef 0%, #7e22ce 100%)" },
    { id: "children_health", label: "Childrens Health", icon: "👶", color: "linear-gradient(135deg, #84cc16 0%, #15803d 100%)" },
    { id: "mental_peace", label: "Mental Peace", icon: "🧘", color: "linear-gradient(135deg, #8b5cf6 0%, #581c87 100%)" },
    { id: "home_peace", label: "Ghar me Sukh Shanti", icon: "🏡", color: "linear-gradient(135deg, #fb923c 0%, #dc2626 100%)" },
    { id: "manglik", label: "Manglik Dosha", icon: "🔴", color: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)" },
    { id: "kalsarp", label: "Kalsarp Dosha", icon: "🐍", color: "linear-gradient(135deg, #1e293b 0%, #000000 100%)" },
    { id: "pitra", label: "Pitra Dosha", icon: "🕯️", color: "linear-gradient(135deg, #b45309 0%, #451a03 100%)" },
    { id: "sadesati", label: "Sade Sati", icon: "⚖️", color: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)" },
    { id: "rahu", label: "Rahu Dosha", icon: "🌑", color: "linear-gradient(135deg, #115e59 0%, #064e3b 100%)" },
    { id: "ketu", label: "Ketu Dosha", icon: "💥", color: "linear-gradient(135deg, #9a3412 0%, #7f1d1d 100%)" },
    { id: "loshu", label: "Lo Shu Grid", icon: "🔢", color: "linear-gradient(135deg, #6366f1 0%, #1d4ed8 100%)" },
];

const KALSARP_INTRO = "Rahu and Ketu are always positioned 7th houses away from each other. When all the planets fall within these 7 houses and rest of the 5 houses are vacant, it is called a Kaal Sarpa Dosha. This is considered a very inauspicious dosha in Vedic astrology. When assessing a horoscope, it is important to consider the degree of planets to see if a planet actually falls within the 7 houses range between Rahu and Ketu. This Dosha causes a lot of struggle in life in all aspects including marriage, career, finance, health, children etc.";

const KALSARP_TYPES_DATA = {
    1: { name: "Anant Kalsarpa", desc: "This Dosha forms when Rahu is in 1st house and Ketu is in 7th house and other planets fall within 1st to 7th house. This combination gives mental unrest, problems in married life and some government related issues. Positively, it also gives courage and confidence to the native." },
    2: { name: "Kulik Kalsarpa", desc: "This Dosha forms when Rahu is in 2nd house and Ketu is in 8th house and other planets fall within 2nd to 8th house. This combination gives financial hiccups. Native also experiences misunderstandings with family and society at large." },
    3: { name: "Vasuki Kalsarpa", desc: "This Dosha forms when Rahu is in 3rd house and Ketu is in 9th house and other planets fall within 3rd to 9th house. This dosha gives spiritual inclination but at the same time, native encounters hurdles in career and business. This can also lead to blood pressure and problems with siblings." },
    4: { name: "Sankhapal Kalasarpa", desc: "This Dosha forms when Rahu is in 4th house and Ketu is in 10th house and other planets fall within 4th to 10th house. Such people struggle to build friendships and enjoy life. This dosha is also negative for your mother. Your relationship with father also comes under scrutiny. In worst case scenario, this dosha can lead to death in a foreign land." },
    5: { name: "Padma Kalasarpa", desc: "This Dosha forms when Rahu is in 5th house and Ketu is in 11th house and other planets fall within 5th to 11th house. This dosha leads to problems in education, love matters, and health issues for spouse and children. You may also experience delay in cure of an illness." },
    6: { name: "Maha Padma Kalasarpa", desc: "This Dosha forms when Rahu is in 6th house and Ketu is in 12th house and other planets fall within 6th to 12th house. Native faces issues with maternal relatives and some financial crisis also persists. Positively, this dosha increases spiritual inclination and gives power to lead." },
    7: { name: "Takshak Kalsarpa", desc: "This Dosha forms when Rahu is in 7th house and Ketu is in 1st house and other planets fall within 7th to 1st house. This dosha hits married life and health of the native. You should avoid doing business in partnership if this dosha exists in the horoscope." },
    8: { name: "Karkotak Kalsarpa", desc: "This Dosha forms when Rahu is in 8th house and Ketu is in 2nd house and other planets fall within 8th to 2nd house. This dosha is positive in terms of education. Your speech is very persuasive and loved by all. Negatively, this dosha makes you short-tempered and interested in bad company. Financial issues also persist for the native." },
    9: { name: "Shankachood Kalsarpa", desc: "This Dosha forms when Rahu is in 9th house and Ketu is in 3rd house and other planets fall within 9th to 3rd house. You may also struggle to enjoy parental love. On a positive note, you do complete the task assigned to you and are very courageous." },
    10: { name: "Ghatak Kalsarpa", desc: "This Dosha forms when Rahu is in 10th house and Ketu is in 4th house and other planets fall within 10th to 4th house. This dosha increases family issues. Native becomes wicked and doesn’t feel satisfied in his job. Positively, this dosha can also give political power." },
    11: { name: "Vishdhar Kalsarpa", desc: "This Dosha forms when Rahu is in 11th house and Ketu is in 5th house and other planets fall within 11th to 5th house. Native’s social reputation declines due to this dosha. Problems with children also persist. Positively, native gets profit from different sources and lives luxuriously if other planets are placed well." },
    12: { name: "Sheshnag Kalsarpa", desc: "This Dosha forms when Rahu is in 12th house and Ketu is in 6th house and other planets fall within 12th to 6th house. This dosha causes health issues and sleeplessness. Native should beware of secret conspirators. These natives life a misfortunate life but earn name in society after their death." }
};

const KALSARP_REMEDIES = [
    "You should donate milk every Monday at a religious place.",
    "You should practice meditation everyday for 15 to 30 minutes.",
    "You should avoid using harsh and abusive words with others."
];

const PITRA_INTRO = "Pitru Dosa is a planetary influence that causes stress, anxiety, sudden loss, familial challenges, property-related loss, or chronic health issues. It is not a curse from our ancestors, as often misunderstood. Instead, it represents a karmic debt that we inherit from our forefathers. When our ancestors committed mistakes, crimes, or vices during their lifetimes, these actions leave an imprint on the succeeding lineage. As their descendants, we are bound to experience the consequences of their deeds.";

const PITRA_CAUSES = [
    "Affliction to Sun and Moon in horoscope through the shadow planet.",
    "Placement of the Moon and Sun in Bhadaksthana (Challenging position) based on rising Ascendant.",
    "Mars placement in Bhadaksthana of Leo or Cancer.",
    "Curse of Sun and Moon in horoscope.",
    "Affliction due to the sixth lord or the Sun/Moon in conjunction with the sixth lord or placed in the sixth house.",
    "The conjunction of two or more malefic with the Sun or Moon in the D9 Chart.",
    "Malefic in Leo or Cancer from Ascendant causes Pitru Dosa.",
    "The placement of the Sun or Moon in Navamsa of Mars causes Pitru Dosa."
];

const PITRA_SIGNS = [
    "Challenging to manage daily routine at home and domestic life might be quarrelsome.",
    "Mental peace and stability might be absent; emotional support and clarity might cause stress.",
    "Difficult to execute tasks on a professional front in a single attempt.",
    "Complicated to express opinions and desires in personal relationships.",
    "Unable to present yourself in professional meetings; hurdles to attain promotion.",
    "Debt, loans, and heavy financial responsibility manifestation.",
    "No support from maternal or paternal family even in wealthy households.",
    "Rise in conflict causing a pessimistic approach towards life.",
    "Lack of a good friend circle and clarity in decision-making due to lack of guidance.",
    "Heavy loss in business or stagnant business growth.",
    "Sudden loss of reputation and financial status after achieving success.",
    "Loss of relationships, finances, and property due to wrong addictions or influences.",
    "Sudden health issues, chronic diseases, or conditions undiagnosed by doctors."
];

const PITRA_REMEDIES = [
    { title: "Daily Purity", content: "Lighting Lamp with Til oil daily daily will help you strengthen the energy of the Ascendant and Sun-Moon to overcome the Pitru Dosha." },
    { title: "Sankranti Donation", content: "On the transition phase of the Sun (Sankranti day), donate food to pacify the negative result of Sun’s affliction." },
    { title: "Full Moon Fasting", content: "Fast on the day of the Full Moon to strengthen your Aura and Moon’s energy in your horoscope." },
    { title: "New Moon Offering", content: "Offer coconut in the temple on the day of the New Moon to get rid of Rahu-Ketu influence over the Moon and Sun." },
    { title: "Kul Devta Alignment", content: "Seek divine help from your Kul Devta. If unknown, analyze the 2nd house from Lagna in the D20 chart to find your lineage deity." },
    { title: "Pind Dan", content: "Pind Dan in Gaya is the best remedy guided by the scriptures to get rid of Pitru dosa." },
    { title: "Nakshatra Puja", content: "Perform Nakshatra Puja once a month to remove curses over your Moon Sign and Birth Constellation." },
    { title: "Mantra 1", content: "Om Shreem Sarva Pitra Dosha Nivaranay Klesham Han Han Sukh Shantim Dehi Phat Swaha (108 times on New/Full Moon)" },
    { title: "Mantra 2", content: "Om Pitrabhya devatabhya mahayogibhyech cha, Namah swaha swadhyaya cha Nityamev namah (108 times on New/Full Moon)" }
];

export default function OracleViewer({ categoryProp }) {
    const [category, setCategory] = useState(categoryProp);
    const [data, setData] = useState(null);
    const [financeDbData, setFinanceDbData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!category) {
            const params = new URLSearchParams(window.location.search);
            setCategory(params.get('oracle'));
        }
        
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(parsed);
                
                // Fetch specialized Finance data if category is finance
                if (category === 'finance' && parsed) {
                    fetchFinanceData(parsed);
                }
            } catch (e) {
                console.error("Failed to parse worksheet data", e);
            }
        }
    }, [category]);

    const fetchFinanceData = async (horoscopeData) => {
        try {
            setLoading(true);
            const basic = horoscopeData.basic_details || {};
            const payload = {
                name: basic.name || "Native",
                date: basic.birth_date,
                time: basic.birth_time,
                lat: basic.lat,
                lon: basic.lon,
                tz_offset: basic.tz_offset || 5.5
            };

            const response = await fetch('/api/finance/personal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                setFinanceDbData(result);
            }
        } catch (error) {
            console.error("Failed to fetch finance insights:", error);
        } finally {
            setLoading(false);
        }
    };

    const item = ORACLE_ITEMS.find(i => i.id === category);
    const info = data?.life_oracle?.[category];

    if (!category || !item) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white italic">
                Invalid Oracle Category
            </div>
        );
    }

    if (category === "loshu") {
        return (
            <ErrorBoundary>
                <LoShuGrid data={data} />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#cbd5e1', fontFamily: 'serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '900px', 
                backgroundColor: '#0f172a', 
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)', 
                borderRadius: '50px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.05)',
                margin: '40px 0'
            }}>
                <div style={{ 
                    padding: '60px 40px', 
                    background: item.color, 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    position: 'relative', 
                    overflow: 'hidden' 
                }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, pointerEvents: 'none', fontSize: '200px' }}>
                        {item.icon}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 10 }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '20px', 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            backdropFilter: 'blur(10px)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '40px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '36px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '4px', margin: 0, lineHeight: 1 }}>{item.label}</h1>
                            <p style={{ fontSize: '10px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '10px', fontWeight: 900 }}>Vedic Wisdom • Personalized Guidance</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => window.close()} 
                        style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            color: 'white', 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '24px', 
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ padding: '60px', fontFamily: 'serif', lineHeight: '1.8', color: '#cbd5e1', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", opacity: 0.05, pointerEvents: 'none' }}></div>
                    {!info ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                            <div className="relative">
                                <span className="text-6xl animate-pulse inline-block">⌛</span>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-xl font-black text-slate-800 mb-2 font-serif italic">Divine insights are being calculated...</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">This specific analysis isn't in your current worksheet. Please regenerate your report to unlock these deep cosmic insights.</p>
                                <button 
                                    onClick={() => {
                                        if (window.opener) {
                                            window.opener.focus();
                                            window.close();
                                        } else {
                                            window.location.href = '/';
                                        }
                                    }}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                >
                                    Regenerate Report
                                </button>
                            </div>
                        </div>
                    ) : (category === 'study' || category === 'education') && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK STUDY PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#94a3b8', marginBottom: '15px' }}>Academic Success Score</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white', fontStyle: 'italic' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#475569' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                            {info.notes?.length > 0 && (
                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid #3b82f6', padding: '30px', borderRadius: '0 25px 25px 0' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#3b82f6', marginBottom: '15px' }}>Cognitive Indicators</p>
                                    {info.notes?.map((n, i) => <p key={i} style={{ fontSize: '17px', color: '#cbd5e1', marginBottom: '10px', lineHeight: '1.6', fontStyle: 'italic' }}>" {n} "</p>)}
                                </div>
                            )}
                        </div>
                    ) : category === 'career' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK CAREER PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(59, 130, 246, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#60a5fa', marginBottom: '15px' }}>Professional Authority Score</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#334155' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#10b981' }}>{info.label}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#94a3b8', marginBottom: '20px' }}>💼 Recommended Paths</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {info.recommendations?.map((r, i) => (
                                        <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '8px 20px', borderRadius: '15px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.2)' }}>{r}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : category === 'marriage' && typeof info === 'object' ? (
                        /* ── ROYAL DARK MARRIAGE PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(244, 63, 94, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #4c0519 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#fb7185', marginBottom: '15px' }}>Predicted Marriage Age Window</p>
                                <p style={{ fontSize: '84px', fontWeight: 900, color: 'white', margin: '10px 0' }}>{info.age}</p>
                                <p style={{ fontSize: '20px', fontWeight: 700, color: '#fb7185', fontStyle: 'italic', margin: 0 }}>{info.age_en}</p>
                                <p style={{ marginTop: '25px', fontSize: '14px', color: '#94a3b8', lineHeight: '1.8' }}>{info.classification_note}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px' }}>Cosmic Calculation Steps</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    <div style={{ borderLeft: '2px solid #f43f5e', paddingLeft: '25px' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 900, color: '#f43f5e', textTransform: 'uppercase', marginBottom: '10px' }}>🏠 Step 1 — 7th House Analysis</p>
                                        {(info.seventh_house_notes || [])?.map((n, i) => <p key={i} style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '5px' }}>• {n}</p>)}
                                    </div>
                                    {info.lord_placement && (
                                        <div style={{ borderLeft: '2px solid #6366f1', paddingLeft: '25px' }}>
                                            <p style={{ fontSize: '11px', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', marginBottom: '10px' }}>🪐 Step 2 — 7th Lord Placement</p>
                                            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>• {info.lord_placement}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : category === 'business' && typeof info === 'object' && info.path ? (
                        /* ── ROYAL DARK BUSINESS PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '1px solid rgba(251, 191, 36, 0.2)', textAlign: 'center', background: 'linear-gradient(135deg, #451a03 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#fbbf24', marginBottom: '15px' }}>Cosmic Path Selection</p>
                                <p style={{ fontSize: '32px', fontWeight: 900, color: 'white', margin: '10px 0' }}>{info.path === 'business' ? '💼' : info.path === 'job' ? '🏢' : '🔁'} {info.path_label}</p>
                                <p style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 700, fontStyle: 'italic' }}>{info.path_note}</p>
                            </div>
                        </div>
                    ) : category === 'finance' && (financeDbData || (typeof info === 'object' && info.score !== undefined)) ? (
                        /* ── ROYAL DARK FINANCE PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                    <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Wealth Database...</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(16, 185, 129, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #064e3b 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                        <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#6ee7b7', marginBottom: '15px' }}>Wealth & Prosperity Index</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info?.score || 85}</span>
                                            <span style={{ fontSize: '24px', fontWeight: 700, color: '#065f46' }}>/100</span>
                                        </div>
                                        <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info?.label || 'Prosperous Alignment'}</p>
                                    </div>

                                    {/* DB INSIGHTS SECTION */}
                                    {financeDbData && financeDbData.length > 0 && (
                                        <div className="space-y-6">
                                            <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#94a3b8' }}>💎 Deep Financial Diagnostics</p>
                                            <div className="grid grid-cols-1 gap-4">
                                                {financeDbData.map((insight, idx) => (
                                                    <div key={idx} style={{ 
                                                        background: 'rgba(255,255,255,0.02)', 
                                                        borderRadius: '24px', 
                                                        padding: '24px', 
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        display: 'flex',
                                                        gap: '20px',
                                                        alignItems: 'flex-start'
                                                    }}>
                                                        <div style={{ fontSize: '24px' }}>{insight.icon}</div>
                                                        <div>
                                                            <h5 style={{ color: '#6ee7b7', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{insight.category} — {insight.title}</h5>
                                                            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>{insight.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : category === 'parents_health' && typeof info === 'object' && info.mother ? (
                        /* ── ROYAL DARK PARENTS HEALTH PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px' }}>Lineage Health Analysis</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ padding: '25px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 900, color: '#f43f5e', textTransform: 'uppercase', marginBottom: '10px' }}>👩 Mother (4th House)</p>
                                        <p style={{ fontSize: '14px', color: 'white', fontWeight: 700 }}>{info.mother}</p>
                                    </div>
                                    <div style={{ padding: '25px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '10px' }}>👨 Father (9th House)</p>
                                        <p style={{ fontSize: '14px', color: 'white', fontWeight: 700 }}>{info.father}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : category === 'spouse_health' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK SPOUSE HEALTH PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(16, 185, 129, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #064e3b 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#6ee7b7', marginBottom: '15px' }}>Spouse Vitality Score</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#065f46' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px' }}>Diagnostic Indicators</p>
                                {info.notes?.map((n, i) => <p key={i} style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px' }}>• {n}</p>)}
                            </div>
                        </div>
                    ) : category === 'children_health' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK CHILDREN HEALTH PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(16, 185, 129, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #3f6212 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#bef264', marginBottom: '15px' }}>Children's Vitality Score</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#365314' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                        </div>
                    ) : category === 'mental_peace' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK MENTAL PEACE PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(99, 102, 241, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#a5b4fc', marginBottom: '15px' }}>Tranquility Index</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#312e81' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                        </div>
                    ) : category === 'home_peace' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK HOME PEACE PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(249, 115, 22, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #7c2d12 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#fdba74', marginBottom: '15px' }}>Domestic Harmony Score</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#7c2d12' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                        </div>
                    ) : category === 'health' && typeof info === 'object' && info.score !== undefined ? (
                        /* ── ROYAL DARK OVERALL HEALTH PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(16, 185, 129, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #064e3b 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#6ee7b7', marginBottom: '15px' }}>Physical Vitality Index</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 900, color: 'white' }}>{info.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#065f46' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{info.label}</p>
                            </div>
                        </div>
                    ) : category === 'kalsarp' ? (
                        /* ── ROYAL DARK KALSARP SPECIALIZED PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {/* Intro Section */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#94a3b8', marginBottom: '20px' }}>Foundational Knowledge</p>
                                <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.8', fontStyle: 'italic' }}>{KALSARP_INTRO}</p>
                            </div>

                            {/* Specific Dosha Status */}
                            <div style={{ borderRadius: '40px', padding: '50px', border: `2px solid ${info.present ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, textAlign: 'center', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#94a3b8', marginBottom: '20px' }}>Your Diagnostic Result</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                    <span style={{ fontSize: '48px' }}>{info.present ? '🐍' : '✨'}</span>
                                    <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', margin: 0 }}>{info.present ? 'Dosha Detected' : 'No Dosha Present'}</h2>
                                </div>
                                
                                {info.present && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                        {(() => {
                                            const rahuPos = (data?.planet_positions || []).find(p => p.planet === 'Rahu');
                                            const type = rahuPos ? KALSARP_TYPES_DATA[rahuPos.house] : null;
                                            if (type) {
                                                return (
                                                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{type.name} Detected</h3>
                                                        <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.7', fontStyle: 'italic' }}>{type.desc}</p>
                                                    </div>
                                                );
                                            }
                                            return <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{info.summary}</p>;
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Encyclopedia of 12 Types */}
                            <div className="space-y-8">
                                <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#94a3b8', textAlign: 'center' }}>Encyclopedia of 12 Kaal Sarpa Variations</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    {Object.entries(KALSARP_TYPES_DATA).map(([house, t]) => (
                                        <div key={house} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.03, fontWeight: 900 }}>{house}</div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '10px' }}>{t.name}</h4>
                                            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>{t.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Remedies Section */}
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '35px', padding: '45px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                    <span style={{ fontSize: '32px' }}>🕉️</span>
                                    <div>
                                        <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#10b981', margin: 0 }}>Remedial Measures</h3>
                                        <p style={{ fontSize: '10px', color: '#059669', textTransform: 'uppercase', fontWeight: 700, marginTop: '5px' }}>To nullify and lessen the negative impact</p>
                                    </div>
                                </div>
                                <ul style={{ display: 'grid', gap: '20px', padding: 0, margin: 0 }}>
                                    {KALSARP_REMEDIES.map((rem, idx) => (
                                        <li key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center', color: '#cbd5e1', fontSize: '17px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />
                                            <span style={{ fontStyle: 'italic', fontWeight: 500 }}>{rem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : category === 'pitra' ? (
                        /* ── ROYAL DARK PITRA DOSHA SPECIALIZED PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {/* Intro Section */}
                            <div style={{ background: 'rgba(180, 83, 9, 0.05)', borderRadius: '30px', padding: '40px', border: '1px solid rgba(180, 83, 9, 0.1)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#b45309', marginBottom: '20px' }}>Ancestral Lineage Wisdom</p>
                                <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.8', fontStyle: 'italic' }}>{PITRA_INTRO}</p>
                            </div>

                            {/* Main Diagnostic Status */}
                            <div style={{ borderRadius: '40px', padding: '50px', border: `2px solid ${info.present ? 'rgba(180, 83, 9, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, textAlign: 'center', background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 100%)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '48px' }}>🕯️</span>
                                    <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', margin: 0 }}>{info.present ? 'Pitra Dosha Detected' : 'No Pitra Dosha Present'}</h2>
                                </div>
                                <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>Lineage Karmic Debt Analysis</p>
                            </div>

                            {/* Causes and Signs Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#f59e0b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>🔭</span> Technical Combinations
                                    </h3>
                                    <ul className="space-y-4">
                                        {PITRA_CAUSES.map((c, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                                <span style={{ color: '#b45309' }}>•</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#f59e0b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>📉</span> Common Life Symptoms
                                    </h3>
                                    <ul className="space-y-4">
                                        {PITRA_SIGNS.map((s, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                                <span style={{ color: '#b45309' }}>•</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Detailed Remedies Grid */}
                            <div className="space-y-8">
                                <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#94a3b8', textAlign: 'center' }}>Divine Remedial Protocol</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                    {PITRA_REMEDIES.map((rem, idx) => (
                                        <div key={idx} style={{ 
                                            background: 'rgba(180, 83, 9, 0.03)', 
                                            borderRadius: '24px', 
                                            padding: '25px', 
                                            border: '1px solid rgba(180, 83, 9, 0.1)',
                                            transition: 'transform 0.3s ease'
                                        }} className="hover:scale-105 transition-transform cursor-default">
                                            <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{rem.title}</h4>
                                            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic' }}>{rem.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : info.severity !== undefined ? (
                        /* ── ROYAL DARK UNIFIED DOSHA PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ borderRadius: '30px', padding: '40px', border: '2px solid rgba(251, 191, 36, 0.1)', textAlign: 'center', background: 'linear-gradient(135deg, #451a03 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#fbbf24', marginBottom: '15px' }}>Planetary Alignment Status</p>
                                <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '10px' }}>{info.label_hi}</h2>
                                <p style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: info.present ? '#f43f5e' : '#10b981' }}>
                                    {info.present ? 'Dosha Detected (मौजूद है)' : 'No Dosha (मुक्त है)'}
                                </p>
                            </div>
                            {info.present && (
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px' }}>Severity Intensity Metric</p>
                                    <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '12px', overflow: 'hidden' }}>
                                        <div style={{ width: `${info.severity}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)', transition: 'width 1s ease' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569' }}>SAFE</span>
                                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#f43f5e' }}>CRITICAL</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : ['manglik', 'rahu', 'ketu', 'kalsarp', 'pitra', 'sadesati'].includes(category) ? (
                        /* ── ROYAL DARK UNIFIED DOSHA PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Main Dosha Status */}
                            <div style={{ borderRadius: '30px', padding: '40px', border: `2px solid ${info.present ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, textAlign: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#94a3b8', marginBottom: '15px' }}>Planetary Alignment Status</p>
                                <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'white', marginBottom: '10px' }}>{item.label}</h2>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                                    <span style={{ fontSize: '24px' }}>{info.present ? '⚠️' : '✅'}</span>
                                    <p style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', color: info.present ? '#f43f5e' : '#10b981', margin: 0 }}>
                                        {info.present ? 'Dosha Detected' : 'No Dosha Present'}
                                    </p>
                                </div>
                            </div>

                            {/* Details & Responsible Planet */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Responsible Energy</p>
                                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>
                                        {category === 'manglik' ? 'Mars (Mangal)' : category === 'rahu' ? 'Rahu (North Node)' : category === 'ketu' ? 'Ketu (South Node)' : category === 'sadesati' ? 'Saturn & Moon' : category === 'kalsarp' ? 'Rahu & Ketu Axis' : 'Sun & 9th House'}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Diagnostic Summary</p>
                                    <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                                        {info.summary || (info.present ? "This alignment requires conscious balancing." : "Your chart is free from this affliction.")}
                                    </p>
                                    {info.present && (info.severity || info.type) && (
                                        <p style={{ fontSize: '14px', color: '#f43f5e', marginTop: '15px', fontWeight: 'bold' }}>
                                            Intensity / Type: {info.severity} {info.type || ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Remedies if present */}
                            {info.present && info.remedies && info.remedies.length > 0 && (
                                <div style={{ background: 'rgba(244, 63, 94, 0.05)', borderRadius: '30px', padding: '40px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                        <span style={{ fontSize: '24px' }}>🌿</span>
                                        <p style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#f43f5e', margin: 0 }}>Prescribed Remedies</p>
                                    </div>
                                    <ul style={{ display: 'grid', gap: '15px', padding: 0, margin: 0 }}>
                                        {info.remedies.map((rem, idx) => (
                                            <li key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', color: '#cbd5e1', fontSize: '16px', lineHeight: '1.6' }}>
                                                <span style={{ color: '#fb7185' }}>✦</span>
                                                <span style={{ fontStyle: 'italic' }}>{rem}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── ROYAL DARK FALLBACK PANEL ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {typeof info === 'object' ? (
                                <>
                                    <p style={{ fontSize: '24px', fontWeight: 500, lineHeight: '1.8', color: '#cbd5e1' }}>
                                        {info.text || JSON.stringify(info)}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                        {info.age && (
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#fb7185', letterSpacing: '2px', marginBottom: '15px' }}>Auspicious Age Window</p>
                                                <p style={{ fontSize: '36px', fontWeight: 900, color: 'white' }}>{info.age}</p>
                                            </div>
                                        )}
                                        {info.matching_signs && (
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '2px', marginBottom: '15px' }}>Divine Alignment</p>
                                                <p style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{info.matching_signs}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p style={{ fontSize: '24px', fontWeight: 500, lineHeight: '1.8', color: '#cbd5e1' }}>
                                    {info}
                                </p>
                            )}
                            
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#475569', display: 'flex', gap: '20px' }}>
                                    <span>☸️ Vedic Calculation</span>
                                    <span>•</span>
                                    <span>Personal Blueprint v2.0</span>
                                </div>
                                <button onClick={() => window.print()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '10px 25px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                                    🖨️ Save Insight
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '50px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={() => window.close()} 
                        style={{ 
                            padding: '20px 60px', 
                            borderRadius: '100px', 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            color: 'white', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            fontSize: '11px', 
                            fontWeight: 900, 
                            textTransform: 'uppercase', 
                            letterSpacing: '4px', 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Return to Workstation
                    </button>
                </div>
            </div>
        </div>
        </ErrorBoundary>
    );
}
