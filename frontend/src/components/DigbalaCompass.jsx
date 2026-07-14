import React, { useState, useEffect } from "react";
import { Compass } from "lucide-react";

export default function DigbalaCompass() {
    const [directions, setDirections] = useState({
        East: { score: 0, planets: ["Jupiter", "Mercury"], msg: "Auspicious for learning, business, and teaching." },
        South: { score: 0, planets: ["Sun", "Mars"], msg: "Auspicious for leadership, overcoming obstacles, and action." },
        West: { score: 0, planets: ["Saturn"], msg: "Auspicious for deep focus, meditation, and structured tasks." },
        North: { score: 0, planets: ["Moon", "Venus"], msg: "Auspicious for comfort, creativity, and mental peace." },
    });
    const [optimalDirection, setOptimalDirection] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const localData = JSON.parse(localStorage.getItem('worksheetData'));
            if (!localData || !localData.strength || !localData.strength.planets) {
                throw new Error("Shadbala data not found. Please calculate Shadbala on the worksheet first.");
            }

            const getPlanetStrength = (pName) => {
                const planetData = localData.strength.planets[pName];
                // Extract total ratio or fallback to basic pct
                if (planetData && planetData.ratio_data && planetData.ratio_data.ratio) {
                    return parseFloat(planetData.ratio_data.ratio);
                }
                const fallbackPos = localData.planet_positions?.find(p => p.planet === pName);
                if (fallbackPos && fallbackPos.shadbala_pct) {
                    return fallbackPos.shadbala_pct;
                }
                return 1.0;
            };

            const jup = getPlanetStrength("Jupiter");
            const mer = getPlanetStrength("Mercury");
            const sun = getPlanetStrength("Sun");
            const mar = getPlanetStrength("Mars");
            const sat = getPlanetStrength("Saturn");
            const moo = getPlanetStrength("Moon");
            const ven = getPlanetStrength("Venus");

            const eastScore = jup + mer;
            const southScore = sun + mar;
            const westScore = sat * 2; // Normalize Saturn since it's only one planet in West vs two in others
            const northScore = moo + ven;

            const scores = {
                East: eastScore,
                South: southScore,
                West: westScore,
                North: northScore
            };

            setDirections(prev => ({
                East: { ...prev.East, score: eastScore },
                South: { ...prev.South, score: southScore },
                West: { ...prev.West, score: westScore / 2 }, // Store real score
                North: { ...prev.North, score: northScore },
            }));

            // Find max
            let maxDir = "East";
            let maxScore = eastScore;
            
            if (southScore > maxScore) { maxDir = "South"; maxScore = southScore; }
            if (westScore > maxScore) { maxDir = "West"; maxScore = westScore; }
            if (northScore > maxScore) { maxDir = "North"; maxScore = northScore; }

            setOptimalDirection(maxDir);

        } catch (err) {
            console.error("Error loading Digbala data:", err);
            setError(err.message || "Failed to load Digbala Compass data.");
        }
    }, []);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="bg-red-900/50 p-8 rounded-xl border border-red-500 max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-red-200 mb-4">Digbala Analysis Error</h2>
                    <p className="text-red-100">{error}</p>
                </div>
            </div>
        );
    }

    if (!optimalDirection) {
        return <div className="flex h-screen items-center justify-center bg-slate-950 text-white"><Compass className="animate-spin w-10 h-10" /></div>;
    }

    const renderDirectionBox = (dirName, data) => {
        const isOptimal = dirName === optimalDirection;
        return (
            <div className={`p-6 rounded-3xl border shadow-2xl transition-all duration-500 ${isOptimal ? 'bg-amber-500/20 border-amber-400 scale-105 z-10' : 'bg-slate-900/50 border-slate-700 opacity-80'}`}>
                <h3 className={`text-2xl font-black uppercase tracking-widest mb-2 ${isOptimal ? 'text-amber-400' : 'text-slate-300'}`}>{dirName}</h3>
                <p className="text-xs font-mono text-slate-400 mb-4 tracking-wider">Governed by: {data.planets.join(" & ")}</p>
                <div className="mb-4">
                    <span className="text-slate-500 uppercase text-[10px] font-bold block mb-1">Digbala Strength</span>
                    <span className={`text-3xl font-black ${isOptimal ? 'text-white' : 'text-slate-500'}`}>{data.score.toFixed(2)}</span>
                </div>
                <p className={`text-sm leading-relaxed ${isOptimal ? 'text-amber-200/90 font-medium' : 'text-slate-500'}`}>{data.msg}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans flex flex-col items-center">
            <header className="mb-12 text-center max-w-2xl mt-8">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] border border-amber-500/50">
                        <Compass className="w-10 h-10 text-amber-400" />
                    </div>
                </div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 mb-4 tracking-tighter">
                    Digbala Compass
                </h1>
                <p className="text-slate-400 text-lg">
                    Discover your optimal directions based on classical Vedic Planetary Directional Strength (Digbala). Face your strongest direction for maximum success, focus, and energy.
                </p>
            </header>

            {/* Compass Visualization */}
            <div className="relative w-[300px] h-[300px] mb-16 mt-8">
                <div className="absolute inset-0 bg-slate-900/50 rounded-full border-4 border-slate-800 shadow-2xl flex items-center justify-center">
                    <div className="absolute top-4 font-black text-2xl text-slate-600">N</div>
                    <div className="absolute bottom-4 font-black text-2xl text-slate-600">S</div>
                    <div className="absolute left-4 font-black text-2xl text-slate-600">W</div>
                    <div className="absolute right-4 font-black text-2xl text-slate-600">E</div>
                    
                    {/* Inner glowing needle pointing to optimal */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <div 
                            className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-amber-500 to-white shadow-[0_0_20px_rgba(245,158,11,1)] origin-bottom transition-transform duration-1000 ease-out rounded-full"
                            style={{ 
                                transform: `rotate(${
                                    optimalDirection === 'North' ? 0 : 
                                    optimalDirection === 'East' ? 90 : 
                                    optimalDirection === 'South' ? 180 : 270
                                }deg) translateY(-50%)`
                            }}
                        />
                        <div className="w-8 h-8 rounded-full bg-amber-500 z-10 shadow-[0_0_20px_rgba(245,158,11,0.8)] border-4 border-slate-900" />
                    </div>
                </div>
            </div>

            <div className="text-center mb-12 max-w-xl">
                <div className="inline-block px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold tracking-widest uppercase mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                    Optimal Direction: {optimalDirection}
                </div>
                <p className="text-amber-100/70 text-lg">
                    Based on your Shadbala scores, your chart's directional power peaks in the <strong className="text-amber-400">{optimalDirection}</strong>. 
                    {directions[optimalDirection].msg}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {renderDirectionBox("North", directions.North)}
                {renderDirectionBox("East", directions.East)}
                {renderDirectionBox("South", directions.South)}
                {renderDirectionBox("West", directions.West)}
            </div>
        </div>
    );
}
