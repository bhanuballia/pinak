import React, { useState, useEffect, useRef } from 'react';

const MANTRAS = {
    "Navagraha (Planets)": [
        { name: "Sun (Surya)", mantra: "Om Ghrini Suryaya Namah" },
        { name: "Moon (Chandra)", mantra: "Om Som Somaya Namah" },
        { name: "Mars (Mangal)", mantra: "Om Ang Angarakaya Namah" },
        { name: "Mercury (Budh)", mantra: "Om Bum Budhaya Namah" },
        { name: "Jupiter (Guru)", mantra: "Om Brim Brihaspataye Namah" },
        { name: "Venus (Shukra)", mantra: "Om Shum Shukraya Namah" },
        { name: "Saturn (Shani)", mantra: "Om Sham Shanaischaraya Namah" },
        { name: "Rahu", mantra: "Om Ram Rahave Namah" },
        { name: "Ketu", mantra: "Om Kem Ketave Namah" }
    ],
    "Hindu Deities": [
        { name: "Lord Ganesha", mantra: "Om Gam Ganapataye Namah" },
        { name: "Lord Shiva", mantra: "Om Namah Shivaya" },
        { name: "Lord Vishnu", mantra: "Om Namo Narayanaya" },
        { name: "Lord Krishna", mantra: "Om Namo Bhagavate Vasudevaya" },
        { name: "Lord Rama", mantra: "Om Shri Ramaya Namah" },
        { name: "Lord Hanuman", mantra: "Om Hum Hanumate Namah" },
        { name: "Maa Durga", mantra: "Om Dum Durgayei Namah" },
        { name: "Maa Kali", mantra: "Om Krim Kalyai Namah" },
        { name: "Maa Saraswati", mantra: "Om Aim Saraswatyai Namah" },
        { name: "Maa Lakshmi", mantra: "Om Shreem Mahalakshmiyei Namah" }
    ]
};

export default function MantraTracker() {
    const [selectedCategory, setSelectedCategory] = useState("Hindu Deities");
    const [selectedMantra, setSelectedMantra] = useState(MANTRAS["Hindu Deities"][1]);

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
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
                        <span className="text-4xl">📿</span> Digital Japa Mala
                    </h1>
                    <p className="text-slate-400 mt-1">Focus your mind. Track your spiritual progress.</p>
                </div>
                <button
                    onClick={() => window.close()}
                    className="text-slate-400 hover:text-white"
                >
                    ✕ Close
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Left Sidebar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Select Mantra</h2>

                        <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
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
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-slate-400 mb-1">Deity / Planet</label>
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
                                <option key={m.name} value={m.name}>{m.name}</option>
                            ))}
                        </select>

                        <div className="mt-8 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-sm text-slate-400 mb-1">Current Mantra:</div>
                            <div className="text-lg text-amber-400 font-bold italic text-center">"{selectedMantra.mantra}"</div>
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
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">

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
                        <div className="text-slate-500 mt-4 text-center z-10">
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
