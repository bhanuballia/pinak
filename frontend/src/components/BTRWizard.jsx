import React, { useState } from 'react';
import ZodiacRectSign from './ZodiacRectSign';
import PlaceAutocomplete from './PlaceAutocomplete';

const BTRWizard = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        dateOfBirth: '',
        startTime: '',
        endTime: '',
        latitude: '',
        longitude: '',
        gender: 'Male',
        lifeEvents: []
    });

    const [newEvent, setNewEvent] = useState({ type: 'Marriage', date: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddEvent = () => {
        if (newEvent.date) {
            setFormData({
                ...formData,
                lifeEvents: [...formData.lifeEvents, newEvent]
            });
            setNewEvent({ type: 'Marriage', date: '' });
        }
    };

    const handleRemoveEvent = (index) => {
        const updatedEvents = [...formData.lifeEvents];
        updatedEvents.splice(index, 1);
        setFormData({ ...formData, lifeEvents: updatedEvents });
    };

    const runBTR = async () => {
        setLoading(true);
        setError(null);
        setStep(4); // Loading crucible

        try {
            const response = await fetch("/api/btr/rectify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date_of_birth: formData.dateOfBirth,
                    start_time: formData.startTime,
                    end_time: formData.endTime,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    gender: formData.gender,
                    life_events: formData.lifeEvents
                })
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data);
                setStep(5); // Results
            } else {
                setError(data.detail || "Failed to run BTR Engine");
                setStep(3); // Back to previous
            }
        } catch (err) {
            setError("Server connection failed.");
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4 tracking-tight">
                        Birth Time Rectification
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        A premium astrological engine that backwards-engineers your life events using Dasha timelines and Tattva Siddhanta to discover the exact minute of your birth.
                    </p>
                </div>

                <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="flex bg-slate-800/50 border-b border-slate-700">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${step === num ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800' : 'text-slate-500'}`}>
                                Step {num}
                            </div>
                        ))}
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold text-white mb-6">The Basics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Start Window (UTC)</label>
                                            <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">End Window (UTC)</label>
                                            <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">City / Location</label>
                                        <div className="text-slate-900">
                                            <PlaceAutocomplete onSelect={(place) => {
                                                setFormData({ ...formData, latitude: place.lat, longitude: place.lon });
                                            }} />
                                        </div>
                                        {formData.latitude && formData.longitude && (
                                            <div className="mt-2 text-xs text-amber-500">
                                                Selected coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={() => setStep(2)} disabled={!formData.dateOfBirth || !formData.startTime || !formData.endTime || !formData.latitude || !formData.longitude} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg shadow-lg transition-all disabled:opacity-50">
                                        Next Step →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold text-white mb-2">Tattva Verification</h2>
                                <p className="text-slate-400 text-sm mb-6">Biological gender is used to filter out mathematically impossible birth times based on the ruling elements (Tattvas) at the time of birth.</p>
                                <div className="grid grid-cols-2 gap-6">
                                    <button onClick={() => setFormData({...formData, gender: 'Male'})} className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === 'Male' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'}`}>
                                        <span className="text-4xl">👨</span>
                                        <span className="font-semibold text-lg">Male</span>
                                    </button>
                                    <button onClick={() => setFormData({...formData, gender: 'Female'})} className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === 'Female' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'}`}>
                                        <span className="text-4xl">👩</span>
                                        <span className="font-semibold text-lg">Female</span>
                                    </button>
                                </div>
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">← Back</button>
                                    <button onClick={() => setStep(3)} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg shadow-lg transition-all">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold text-white mb-2">Major Life Events</h2>
                                <p className="text-slate-400 text-sm mb-6">Provide 3-5 major life events. The engine will calculate the Vimshottari Dasha for every minute in your time window to find the perfect astrological match.</p>
                                
                                <div className="space-y-3 mb-6">
                                    {formData.lifeEvents.map((ev, i) => (
                                        <div key={i} className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-amber-400 font-semibold">{ev.type}</span>
                                                <span className="text-slate-300">{ev.date}</span>
                                            </div>
                                            <button onClick={() => handleRemoveEvent(i)} className="text-red-400 hover:text-red-300">✕</button>
                                        </div>
                                    ))}
                                    {formData.lifeEvents.length === 0 && (
                                        <div className="text-center py-6 text-slate-500 italic border border-dashed border-slate-700 rounded-lg">No events added yet.</div>
                                    )}
                                </div>

                                <div className="flex gap-4 p-4 bg-slate-800 border border-slate-600 rounded-lg">
                                    <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-white outline-none">
                                        <option value="Marriage">Marriage</option>
                                        <option value="Career">Career Milestone / New Job</option>
                                        <option value="Child">Birth of Child</option>
                                        <option value="Property">Buying Home/Property</option>
                                        <option value="Relocation">Relocation / Foreign Travel</option>
                                        <option value="Illness">Major Illness / Surgery</option>
                                        <option value="Injury">Accident / Injury</option>
                                    </select>
                                    <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-white outline-none" />
                                    <button onClick={handleAddEvent} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Add</button>
                                </div>

                                <div className="mt-8 flex justify-between items-center">
                                    <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">← Back</button>
                                    <button onClick={runBTR} disabled={formData.lifeEvents.length < 1} className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50">
                                        Run Rectification Engine 🚀
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="py-20 text-center animate-in fade-in duration-1000">
                                <div className="inline-block w-20 h-20 mb-8 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin-reverse"></div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Casting Hundreds of Charts...</h2>
                                <p className="text-slate-400 max-w-md mx-auto">The BTR Engine is currently evaluating Dashas and Tattvas for every minute in your time window. This may take up to 30 seconds.</p>
                            </div>
                        )}

                        {step === 5 && result && (
                            <div className="animate-in zoom-in-95 duration-700">
                                <div className="text-center mb-10">
                                    <div className="text-amber-400 text-6xl mb-4">⭐</div>
                                    <h2 className="text-4xl font-extrabold text-white mb-2">Rectification Complete</h2>
                                    <p className="text-xl text-slate-300">
                                        Your exact birth time is <span className="text-amber-400 font-bold text-3xl mx-2">{result.rectified_time}</span> UTC
                                    </p>
                                    <div className="mt-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">Confidence Score: {result.score}</div>
                                </div>

                                {result.chart && (
                                    <div className="mt-10 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-inner">
                                        <h3 className="text-xl font-bold text-slate-200 mb-6 text-center">Your Rectified D1 Chart</h3>
                                        <div className="flex justify-center">
                                            <div className="w-full max-w-xl bg-white p-4 rounded-xl shadow-lg">
                                                <ZodiacRectSign houses={result.chart.houses} title="Rectified Kundali" hideOuterRect={true} scaleText={1.2} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-10 text-center">
                                    <button onClick={() => setStep(1)} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">Start Over</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                .animate-spin-reverse {
                    animation: spin-reverse 1s linear infinite;
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
            `}</style>
        </div>
    );
};

export default BTRWizard;
