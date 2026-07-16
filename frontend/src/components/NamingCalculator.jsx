import React, { useState, useEffect } from 'react';
import { translateSyllable } from '../utils/phoneticMap';

const NamingCalculator = ({ data }) => {
    const [namingData, setNamingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lang, setLang] = useState('en');

    useEffect(() => {
        if (!data) return;

        const fetchNamingRecommendations = async () => {
            setLoading(true);
            try {
                // Ensure date and time are strings, lat and lon are strings or floats
                const payload = {
                    date: data.basic_details?.date || data.basic_details?.birth_date || '1990-01-01',
                    time: data.basic_details?.time || data.basic_details?.birth_time || '12:00:00',
                    tz_offset: data.basic_details?.tz_offset || 5.5,
                    lat: data.basic_details?.lat || 28.6139,
                    lon: data.basic_details?.lon || 77.2090
                };

                // if we have 'day', 'month', 'year' in basic_details
                if (data.basic_details?.year && !payload.date.includes('-')) {
                    payload.date = `${data.basic_details.year}-${String(data.basic_details.month).padStart(2, '0')}-${String(data.basic_details.day).padStart(2, '0')}`;
                }
                if (data.basic_details?.hour !== undefined && !payload.time.includes(':')) {
                    payload.time = `${String(data.basic_details.hour).padStart(2, '0')}:${String(data.basic_details.minute).padStart(2, '0')}:00`;
                }

                const response = await fetch('/api/naming/comprehensive', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setNamingData(result);
            } catch (e) {
                console.error("Error fetching naming recommendations:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNamingRecommendations();
    }, [data]);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                <div className="text-amber-500 animate-pulse font-serif text-xl tracking-widest">Loading Birth Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 font-serif">
            <div className="max-w-6xl mx-auto space-y-8">

                <header className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-black italic tracking-widest mb-4">Vedic Naming Guide</h1>
                        <p className="text-indigo-200 text-lg tracking-wider">Astro Consult: Comprehensive Phonetic and Elemental Analysis for Namakarana</p>

                        <div className="mt-8 flex items-center gap-6 text-sm text-indigo-100 font-sans bg-black/20 p-4 rounded-2xl w-fit">
                            <div><span className="opacity-60 block text-[10px] uppercase">Native</span><span className="font-bold">{data.meta?.name || data.basic_details?.name || 'Astro Native'}</span></div>
                            <div className="w-px h-8 bg-indigo-500/30"></div>
                            <div>
                                <span className="opacity-60 block text-[10px] uppercase">DOB</span>
                                <span className="font-bold">
                                    {data.basic_details?.day ? `${data.basic_details.day}/${data.basic_details.month}/${data.basic_details.year}` : (data.basic_details?.date || data.basic_details?.birth_date || data.meta?.date || 'Unknown')}
                                </span>
                            </div>
                            <div className="w-px h-8 bg-indigo-500/30"></div>
                            <div>
                                <span className="opacity-60 block text-[10px] uppercase">Time</span>
                                <span className="font-bold">
                                    {data.basic_details?.hour !== undefined ? `${data.basic_details.hour}:${data.basic_details.minute}` : (data.basic_details?.time || data.basic_details?.birth_time || data.meta?.time || 'Unknown')}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 shadow-sm text-center">
                        <p className="font-bold">Failed to load naming recommendations.</p>
                        <p className="text-sm mt-2">{error}</p>
                    </div>
                ) : namingData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Section 1: Nakshatra Method */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wider">Avakahada Chakra</h2>
                                        <p className="text-amber-600 text-sm font-bold tracking-widest mt-1">STANDARD NAKSHATRA METHOD</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-inner border border-amber-100">
                                        🌙
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                                    This is the most common and traditional practice in Vedic Astrology. The recommended starting syllable is derived directly from the exact position of the Moon at the time of birth (the Nakshatra and its specific quarter/Pada).
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Birth Nakshatra</span>
                                        <span className="text-slate-800 font-black text-lg">{namingData.avakahada?.nakshatra}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Nakshatra Pada</span>
                                        <span className="text-slate-800 font-black text-lg">Pada {namingData.avakahada?.pada}</span>
                                    </div>

                                    <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 text-center shadow-inner relative">
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
                                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-lg shadow-sm border border-amber-300 transition-colors flex items-center gap-1"
                                                title="Translate to Hindi/Sanskrit"
                                            >
                                                🌐 {lang === 'en' ? 'Translate' : 'English'}
                                            </button>
                                        </div>
                                        <span className="block text-amber-800 text-xs font-black uppercase tracking-[0.3em] mb-4 mt-2">Recommended Starting Syllable</span>
                                        <span className="text-6xl font-black text-amber-600 drop-shadow-sm">
                                            {lang === 'hi' ? translateSyllable(namingData.avakahada?.syllable) : namingData.avakahada?.syllable}
                                        </span>
                                        <p className="text-amber-700/60 text-xs mt-4 italic font-sans">Use this sound to align the native's name with their cosmic mind (Moon).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Swar Siddhanta */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wider">Swar Siddhanta</h2>
                                        <p className="text-indigo-600 text-sm font-bold tracking-widest mt-1">ELEMENTAL HARMONY METHOD</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl shadow-inner border border-indigo-100">
                                        🕉️
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                    Swar Siddhanta matches phonetics to the five elements (Tattvas). Naming a child based on their dominant or most beneficial element ensures that every time their name is spoken, it resonates with their innate life force (Prana), promoting growth and health.
                                </p>

                                <div className="space-y-6">
                                    {/* Dominant Element */}
                                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="block text-indigo-900 font-black tracking-wide">Dominant Element: {namingData.swar_siddhanta?.dominant?.tattva}</span>
                                                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">From {namingData.swar_siddhanta?.dominant?.source}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-indigo-700/80 mb-3 italic">Supports the physical body and overall constitution.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {namingData.swar_siddhanta?.dominant?.syllables?.map(s => (
                                                <span key={s} className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-lg shadow-sm text-sm">
                                                    {lang === 'hi' ? translateSyllable(s) : s}
                                                </span>
                                            ))}
                                            {(!namingData.swar_siddhanta?.dominant?.syllables || namingData.swar_siddhanta?.dominant?.syllables.length === 0) && <span className="text-sm text-slate-400 italic">No specific syllables found.</span>}
                                        </div>
                                    </div>

                                    {/* Beneficial Element */}
                                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="block text-emerald-900 font-black tracking-wide">Beneficial Element: {namingData.swar_siddhanta?.beneficial?.tattva}</span>
                                                <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">From {namingData.swar_siddhanta?.beneficial?.source}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-emerald-700/80 mb-3 italic">Harnesses the energy of the strongest planet (Shadbala) for success.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {namingData.swar_siddhanta?.beneficial?.syllables?.map(s => (
                                                <span key={s} className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-lg shadow-sm text-sm">
                                                    {lang === 'hi' ? translateSyllable(s) : s}
                                                </span>
                                            ))}
                                            {(!namingData.swar_siddhanta?.beneficial?.syllables || namingData.swar_siddhanta?.beneficial?.syllables.length === 0) && <span className="text-sm text-slate-400 italic">No specific syllables found.</span>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                ) : null}

            </div>
        </div>
    );
};

export default NamingCalculator;
