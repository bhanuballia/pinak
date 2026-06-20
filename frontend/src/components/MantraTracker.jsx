import React, { useState, useEffect, useRef } from 'react';

const CATEGORY_TRANSLATIONS = {
    "Navagraha (Planets)": "नवग्रह",
    "Hindu Deities": "हिन्दू देवी-देवता"
};

const MANTRAS = {
    "Navagraha (Planets)": [
        { name: "Sun (Surya)", hindiName: "सूर्य", mantra: "Om Ghrini Suryaya Namah", hindiMantra: "ॐ घृणि सूर्याय नमः" },
        { name: "Moon (Chandra)", hindiName: "चन्द्र", mantra: "Om Som Somaya Namah", hindiMantra: "ॐ सों सोमाय नमः" },
        { name: "Mars (Mangal)", hindiName: "मंगल", mantra: "Om Ang Angarakaya Namah", hindiMantra: "ॐ अं अंगारकाय नमः" },
        { name: "Mercury (Budh)", hindiName: "बुध", mantra: "Om Bum Budhaya Namah", hindiMantra: "ॐ बुं बुधाय नमः" },
        { name: "Jupiter (Guru)", hindiName: "बृहस्पति (गुरु)", mantra: "Om Brim Brihaspataye Namah", hindiMantra: "ॐ बृं बृहस्पतये नमः" },
        { name: "Venus (Shukra)", hindiName: "शुक्र", mantra: "Om Shum Shukraya Namah", hindiMantra: "ॐ शुं शुक्राय नमः" },
        { name: "Saturn (Shani)", hindiName: "शनि", mantra: "Om Sham Shanaischaraya Namah", hindiMantra: "ॐ शं शनैश्चराय नमः" },
        { name: "Rahu", hindiName: "राहु", mantra: "Om Ram Rahave Namah", hindiMantra: "ॐ रां राहवे नमः" },
        { name: "Ketu", hindiName: "केतु", mantra: "Om Kem Ketave Namah", hindiMantra: "ॐ कें केतवे नमः" }
    ],
    "Hindu Deities": [
        { name: "Lord Ganesha", hindiName: "भगवान गणेश", mantra: "Om Gam Ganapataye Namah", hindiMantra: "ॐ गं गणपतये नमः" },
        { name: "Lord Shiva", hindiName: "भगवान शिव", mantra: "Om Namah Shivaya", hindiMantra: "ॐ नमः शिवाय" },
        { name: "Lord Vishnu", hindiName: "भगवान विष्णु", mantra: "Om Namo Narayanaya", hindiMantra: "ॐ नमो नारायणाय" },
        { name: "Lord Krishna", hindiName: "भगवान कृष्ण", mantra: "Om Namo Bhagavate Vasudevaya", hindiMantra: "ॐ नमो भगवते वासुदेवाय" },
        { name: "Lord Rama", hindiName: "भगवान राम", mantra: "Om Shri Ramaya Namah", hindiMantra: "ॐ श्री रामाय नमः" },
        { name: "Lord Hanuman", hindiName: "भगवान हनुमान", mantra: "Om Hum Hanumate Namah", hindiMantra: "ॐ हुं हनुमते नमः" },
        { name: "Maa Durga", hindiName: "माँ दुर्गा", mantra: "Om Dum Durgayei Namah", hindiMantra: "ॐ दुं दुर्गायै नमः" },
        { name: "Maa Kali", hindiName: "माँ काली", mantra: "Om Krim Kalyai Namah", hindiMantra: "ॐ क्रीं काल्यै नमः" },
        { name: "Maa Saraswati", hindiName: "माँ सरस्वती", mantra: "Om Aim Saraswatyai Namah", hindiMantra: "ॐ ऐं सरस्वत्यै नमः" },
        { name: "Maa Lakshmi", hindiName: "माँ लक्ष्मी", mantra: "Om Shreem Mahalakshmiyei Namah", hindiMantra: "ॐ श्रीं महालक्ष्म्यै नमः" }
    ]
};

export default function MantraTracker() {
    const [selectedCategory, setSelectedCategory] = useState("Hindu Deities");
    const [selectedMantra, setSelectedMantra] = useState(MANTRAS["Hindu Deities"][1]);
    const [showHindi, setShowHindi] = useState(false);

    const [count, setCount] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [stats, setStats] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Audio / Voice Activity Detection (VAD) State
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [micError, setMicError] = useState("");
    const [sensitivity, setSensitivity] = useState("Medium");
    const [audioVolume, setAudioVolume] = useState(0); // 0 to 100 for visualizer
    const [isSpeakingUI, setIsSpeakingUI] = useState(false); // For visual feedback

    const timerRef = useRef(null);
    const chimeRef = useRef(new Audio("/sounds/_Temple_Aarti_Sound_Ringtone.mp3"));
    const singleBellRef = useRef(new Audio("/sounds/templebell.mp3")); // A custom temple bell sound for every count

    // VAD Refs
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const animationFrameRef = useRef(null);
    const isSpeakingRef = useRef(false);
    const silenceTimerRef = useRef(null);
    const sensitivityRef = useRef("Medium"); // Need ref for animation loop

    useEffect(() => {
        fetchStats();
        return () => stopMicrophone(); // Cleanup on unmount
    }, []);

    // Sync sensitivity state to ref for the animation loop
    useEffect(() => {
        sensitivityRef.current = sensitivity;
    }, [sensitivity]);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/mantra/stats/my_profile");
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (e) {
            console.error("Failed to fetch stats");
        }
    };

    const playViaAudioContext = async (url) => {
        if (!audioContextRef.current) return;
        try {
            // Fetch and decode if we haven't already
            if (!window.audioBuffers) window.audioBuffers = {};
            if (!window.audioBuffers[url]) {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                window.audioBuffers[url] = await audioContextRef.current.decodeAudioData(arrayBuffer);
            }
            // Play the buffer
            const source = audioContextRef.current.createBufferSource();
            source.buffer = window.audioBuffers[url];
            source.connect(audioContextRef.current.destination);
            source.start(0);
        } catch (e) {
            console.error("AudioContext play failed", e);
        }
    };

    const handleTap = (isFromMic = false) => {
        // Prevent interval leak by checking timerRef instead of just state
        if (!timerRef.current) {
            setIsSessionActive(true);
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }

        // Use AudioContext for hands-free (bypasses mobile mic-ducking and strict autoplay).
        // For manual tapping, new Audio allows rapid overlapping clicks.
        if (isFromMic === true) {
            playViaAudioContext("/sounds/templebell.mp3");
        } else {
            new Audio("/sounds/templebell.mp3").play().catch(e => console.log("Audio play prevented", e));
        }

        setCount(prev => {
            const next = prev + 1;
            if (next % 108 === 0) {
                if (isFromMic === true) {
                    playViaAudioContext("/sounds/_Temple_Aarti_Sound_Ringtone.mp3");
                } else {
                    chimeRef.current.currentTime = 0;
                    chimeRef.current.play().catch(e => console.log("Audio play prevented", e));
                }
            }
            return next;
        });
    };

    // --- Web Audio VAD Logic ---
    const toggleMicrophone = async () => {
        if (isMicEnabled) {
            stopMicrophone();
            return;
        }

        // Unlock audio contexts so they can play hands-free without browser blocking
        singleBellRef.current.play().then(() => {
            singleBellRef.current.pause();
            singleBellRef.current.currentTime = 0;
        }).catch(e => { });

        chimeRef.current.play().then(() => {
            chimeRef.current.pause();
            chimeRef.current.currentTime = 0;
        }).catch(e => { });

        try {
            setMicError("");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            // Modern browsers require AudioContext to be created after a user gesture
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 512;
            analyserRef.current.smoothingTimeConstant = 0.8;

            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            microphoneRef.current.connect(analyserRef.current);

            setIsMicEnabled(true);

            // Start the volume detection loop
            detectVoiceEnergy();

        } catch (err) {
            console.error("Mic access denied or unavailable", err);
            setMicError("Microphone access denied. Check browser permissions.");
        }
    };

    const stopMicrophone = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        if (microphoneRef.current) {
            microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
            microphoneRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        setIsMicEnabled(false);
        setAudioVolume(0);
        setIsSpeakingUI(false);
        isSpeakingRef.current = false;
    };

    const detectVoiceEnergy = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setAudioVolume(average); // Max average is around 128 for normal speech

        // Define Thresholds
        let threshold = 20; // Medium default
        if (sensitivityRef.current === "Low") threshold = 35; // Requires louder voice
        if (sensitivityRef.current === "High") threshold = 10; // Picks up whispers

        if (average > threshold) {
            // User is speaking
            if (!isSpeakingRef.current) {
                isSpeakingRef.current = true;
                setIsSpeakingUI(true);
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
        } else {
            // User is silent
            if (isSpeakingRef.current && !silenceTimerRef.current) {
                // They just stopped speaking. Wait 800ms to ensure they didn't just pause for a syllable
                silenceTimerRef.current = setTimeout(() => {
                    isSpeakingRef.current = false;
                    setIsSpeakingUI(false);
                    handleTap(true); // Increment the chant! (true = from mic)
                    silenceTimerRef.current = null;
                }, 800);
            }
        }

        animationFrameRef.current = requestAnimationFrame(detectVoiceEnergy);
    };

    // --- End Web Audio VAD Logic ---

    const handleEndSession = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSessionActive(false);
        setIsSaving(true);

        if (isMicEnabled) stopMicrophone();

        try {
            await fetch("/api/mantra/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "my_profile",
                    mantra_name: selectedMantra.name,
                    count: count,
                    duration_seconds: elapsedSeconds
                })
            });
            await fetchStats();
        } catch (e) {
            console.error("Failed to save session");
        }

        setCount(0);
        setElapsedSeconds(0);
        setIsSaving(false);
    };

    const currentMalaCount = count % 108;
    const completedMalas = Math.floor(count / 108);
    const progressPercentage = (currentMalaCount / 108) * 100;

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Calculate dynamic scale for the visualizer pulse based on mic volume
    const pulseScale = isMicEnabled ? 1 + (audioVolume / 150) : 1;
    const isActuallySpeaking = isMicEnabled && isSpeakingUI;

    return (
        <div
            className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col font-sans relative bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/deities/japamala.png')" }}
        >
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-0"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="max-w-3xl bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
                    <h1 className="text-4xl font-bold text-amber-500 flex items-center gap-3 mb-2">
                        <span className="text-4xl">📿</span> Digital Japa Mala
                    </h1>
                    <p className="text-orange-100 mt-1 text-lg font-medium">
                        A digital companion for your daily spiritual practice. Focus your mind and effortlessly track your chants.
                    </p>
                    <div className="mt-4 space-y-2 text-slate-200 text-sm">
                        <p className="flex items-start gap-2">
                            <span className="text-amber-500">👆</span>
                            <span><strong>Manual Chanting:</strong> Tap the large circle or press the Spacebar on your keyboard after each mantra.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-amber-500">🎤</span>
                            <span><strong>Hands-Free Chanting:</strong> Enable your microphone, close your eyes, and just chant. The app intelligently listens and counts for you!</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-amber-500">🔔</span>
                            <span><strong>Milestones:</strong> A divine temple bell will automatically chime every 108 chants (1 complete Mala).</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => window.close()}
                    className="text-slate-400 hover:text-white"
                >
                    ✕ Close
                </button>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Left Sidebar */}
                <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                            <h2 className="text-xl font-bold text-slate-300">
                                {showHindi ? "मंत्र चुनें" : "Select Mantra"}
                            </h2>
                            <button
                                onClick={() => setShowHindi(!showHindi)}
                                className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-500 px-3 py-1 rounded-full border border-slate-700 transition-colors shadow-sm"
                            >
                                {showHindi ? "English" : "हिंदी"}
                            </button>
                        </div>

                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            {showHindi ? "श्रेणी" : "Category"}
                        </label>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 mb-4 focus:outline-none focus:border-amber-500"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedMantra(MANTRAS[e.target.value][0]);
                            }}
                            disabled={isSessionActive}
                        >
                            {Object.keys(MANTRAS).map(cat => (
                                <option key={cat} value={cat}>
                                    {showHindi ? CATEGORY_TRANSLATIONS[cat] : cat}
                                </option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            {showHindi ? "देवता / ग्रह" : "Deity / Planet"}
                        </label>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                            value={selectedMantra.name}
                            onChange={(e) => {
                                const m = MANTRAS[selectedCategory].find(x => x.name === e.target.value);
                                setSelectedMantra(m);
                            }}
                            disabled={isSessionActive}
                        >
                            {MANTRAS[selectedCategory].map(m => (
                                <option key={m.name} value={m.name}>
                                    {showHindi ? m.hindiName : m.name}
                                </option>
                            ))}
                        </select>

                        <div className="mt-8 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                                <div className="text-sm font-bold text-slate-400">
                                    {showHindi ? "वर्तमान मंत्र:" : "Current Mantra:"}
                                </div>
                            </div>
                            <div className={`text-xl text-amber-400 font-bold text-center ${showHindi ? 'font-sans' : 'italic'}`}>
                                "{showHindi ? selectedMantra.hindiMantra : selectedMantra.mantra}"
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Your Progress</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-4 rounded-xl text-center">
                                <div className="text-3xl font-black text-amber-500">{stats?.grand_total_chants || 0}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Chants</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl text-center">
                                <div className="text-3xl font-black text-indigo-400">
                                    {stats?.mantra_stats?.[selectedMantra.name]?.total_sessions || 0}
                                </div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Sessions</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center - The Digital Mala */}
                <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">

                    {/* Timer and Status */}
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            <span className="font-mono text-xl text-slate-300">{formatTime(elapsedSeconds)}</span>
                        </div>
                        <div className="text-slate-400 font-medium">
                            Completed Malas: <span className="text-amber-500 font-bold text-lg">{completedMalas}</span>
                        </div>
                    </div>

                    {/* Hands-Free Controls */}
                    <div className="absolute top-8 right-8 z-10 flex gap-4 items-center">
                        {isMicEnabled && (
                            <select
                                className="bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                                value={sensitivity}
                                onChange={(e) => setSensitivity(e.target.value)}
                            >
                                <option value="Low">Low Sens.</option>
                                <option value="Medium">Med Sens.</option>
                                <option value="High">High Sens.</option>
                            </select>
                        )}
                        <button
                            onClick={toggleMicrophone}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow flex items-center gap-2 ${isMicEnabled ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
                        >
                            {isMicEnabled ? "🛑 Stop Mic" : "🎤 Hands-Free Mode"}
                        </button>
                    </div>
                    {micError && <div className="absolute top-20 right-8 text-xs text-red-400 bg-red-950 p-2 rounded">{micError}</div>}

                    {/* The Big Button & Progress Ring */}
                    <div className="relative w-80 h-80 flex items-center justify-center mt-12 mb-8">

                        {/* Audio Visualizer Glow (Behind the ring) */}
                        <div
                            className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl transition-transform duration-75 pointer-events-none"
                            style={{ transform: `scale(${pulseScale})`, opacity: isMicEnabled ? 1 : 0 }}
                        />

                        {/* SVG Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="4" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="4"
                                strokeDasharray="283" strokeDashoffset={283 - (283 * progressPercentage) / 100}
                                strokeLinecap="round" className="transition-all duration-300 ease-out"
                            />
                        </svg>

                        {/* Interactive Tap Area */}
                        <button
                            onClick={() => handleTap(false)}
                            className={`w-64 h-64 rounded-full bg-gradient-to-br border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center active:scale-95 transition-all group z-20
                                ${isActuallySpeaking ? 'from-amber-900 to-amber-950 border-amber-600 scale-105 shadow-[0_0_80px_rgba(245,158,11,0.4)]' : 'from-slate-800 to-slate-900 border-slate-700'}
                            `}
                        >
                            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 mb-2 group-active:scale-90 transition-transform">
                                {currentMalaCount}
                            </span>
                            <span className="text-slate-500 text-sm font-medium tracking-widest uppercase">/ 108</span>
                            {isMicEnabled && (
                                <span className="absolute bottom-10 text-xs font-bold text-amber-500/50 uppercase tracking-widest animate-pulse">
                                    {isActuallySpeaking ? "Hearing Voice..." : "Listening..."}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* End Session Button */}
                    {count > 0 && (
                        <button
                            onClick={handleEndSession}
                            disabled={isSaving}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-full transition-colors border border-slate-600 shadow-lg mt-4 flex items-center gap-2 z-10"
                        >
                            {isSaving ? "Saving..." : "End Session & Save"}
                        </button>
                    )}

                    {count === 0 && !isMicEnabled && (
                        <div className="text-orange-100  mt-4 text-[20px] text-center z-10">
                            Tap the circle or press Spacebar to begin chanting. <br />
                            A bell will chime after 108 chants.
                        </div>
                    )}
                </div>
            </div>

            {/* Keyboard support */}
            <button
                className="opacity-0 absolute"
                onKeyDown={(e) => { if (e.code === 'Space') handleTap(false); }}
                autoFocus
            />
        </div>
    );
}
