import React, { useState, useEffect, useMemo } from 'react';

// Lo Shu Grid constants
const GRID_TEMPLATE = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

const NUMBER_MEANINGS = {
  1: { keyword: "leadership", title: "Independence & Leadership", planet: "Sun", element: "Water", desc: "Symbolizes independence, leadership, and originality. Reflects a pioneering spirit and self-reliance. Often natural leaders who prefer to carve their paths." },
  2: { keyword: "sensitivity", title: "Sensitivity & Diplomacy", planet: "Moon", element: "Earth", desc: "Represents sensitivity, cooperation, and diplomacy. Signifies balance and nurturing. Excels in building harmonious relationships and empathetic." },
  3: { keyword: "creativity", title: "Creativity & Expression", planet: "Jupiter", element: "Wood", desc: "Indicates creativity, expression, and enthusiasm. Embodies artistic talents and a zest for life. Often drawn to creative fields and enjoy the limelight." },
  4: { keyword: "stability", title: "Stability & Practicality", planet: "Rahu", element: "Wood", desc: "Reflects stability, discipline, and practicality. Suggests a methodical approach to life. Highly organized and excel in structured environments." },
  5: { keyword: "adaptability", title: "Freedom & Adaptability", planet: "Mercury", element: "Earth", desc: "Represents freedom, adaptability, and balance. Versatile and thrive in dynamic settings. Capable of handling change with ease." },
  6: { keyword: "responsibility", title: "Harmony & Responsibility", planet: "Venus", element: "Metal", desc: "Signifies harmony, responsibility, and nurturing. Reflects service and caregiving. Often compassionate and drawn to roles helping others." },
  7: { keyword: "introspection", title: "Wisdom & Spirituality", planet: "Ketu", element: "Metal", desc: "Associated with introspection, spirituality, and wisdom. Linked to deep thinking and philosophical pursuits. Naturally curious." },
  8: { keyword: "ambition", title: "Power & Ambition", planet: "Saturn", element: "Earth", desc: "Represents power, ambition, and material success. Signifies a strong drive for achievement and recognition in careers and personal lives." },
  9: { keyword: "compassion", title: "Compassion & Humanitarianism", planet: "Mars", element: "Fire", desc: "Symbolizes compassion, completion, and humanitarianism. Reflects a global perspective and desire to make a positive impact." }
};

const REMEDIES = {
  1: "Missing 1: Enhance communication skills, write journals.",
  2: "Missing 2: Build emotional connections in relationships.",
  3: "Missing 3: Engage in creative hobbies.",
  4: "Missing 4: Follow a routine, practice discipline.",
  5: "Missing 5: Embrace change and seek adventures.",
  6: "Missing 6: Spend time with family, accept responsibilities.",
  7: "Missing 7: Gain knowledge through study or observation.",
  8: "Missing 8: Build confidence in financial matters.",
  9: "Missing 9: Help others to foster compassion."
};

const PLANES_INFO = {
  horizontal: [
    { name: "Mind Plane", nums: [4, 9, 2], desc: "Represents intellectual and analytical abilities." },
    { name: "Emotional Plane", nums: [3, 5, 7], desc: "Indicates emotional expression and spirituality." },
    { name: "Practical Plane", nums: [8, 1, 6], desc: "Signifies success, fortune, and prosperity." }
  ],
  vertical: [
    { name: "Thought Plane", nums: [4, 3, 8], desc: "Reflects the thought process and idea generation." },
    { name: "Will Plane", nums: [9, 5, 1], desc: "Shows determination and goal achievement." },
    { name: "Action Plane", nums: [2, 7, 6], desc: "Indicates action-taking abilities." }
  ],
  diagonal: [
    { name: "Golden Yog (Raj Yog)", nums: [4, 5, 6], desc: "Rare combination bringing name, fame, and wealth (2-3% of people)." },
    { name: "Silver Yog (Rajat Yog)", nums: [2, 5, 8], desc: "Indicates wealth and properties with challenges." }
  ]
};

// Helper: reduce number to single digit
const reduceToSingleDigit = (num) => {
  if (!num) return 0;
  let sum = num;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
};

export default function LoShuGrid({ data }) {
  const [dobInput, setDobInput] = useState("");

  // Initialize DOB from data if possible
  useEffect(() => {
    if (data?.basic_details?.birth_datetime) {
      // Looks like 'DD/MM/YYYY | HH:MM AM/PM'
      const dtStr = data.basic_details.birth_datetime.split('|')[0].trim();
      const parts = dtStr.split('/');
      if (parts.length === 3) {
        // try to convert to YYYY-MM-DD for input type="date"
        let d = parts[0], m = parts[1], y = parts[2];
        // Ensure padded
        d = d.padStart(2, '0');
        m = m.padStart(2, '0');
        setDobInput(`${y}-${m}-${d}`);
      }
    }
  }, [data]);

  const calcParams = useMemo(() => {
    if (!dobInput) return null;
    const parts = dobInput.split('-'); // ["YYYY", "MM", "DD"]
    if (parts.length !== 3) return null;

    const y = parts[0], m = parts[1], d = parts[2];
    const rawDateStr = d + m + y; // e.g., "05011996"

    const baseNumbers = rawDateStr.split('').map(Number).filter(n => n !== 0);
    
    // Driver: Add day digits
    const driver = reduceToSingleDigit(parseInt(d, 10));
    
    // Conductor: Add all digits in DD/MM/YYYY
    const conductor = reduceToSingleDigit(
      rawDateStr.split('').reduce((acc, val) => acc + parseInt(val, 10), 0)
    );

    const allNumbers = [...baseNumbers, driver, conductor].filter(n => n !== 0);

    // Count occurrences
    const counts = {};
    [1,2,3,4,5,6,7,8,9].forEach(n => counts[n] = 0);
    allNumbers.forEach(n => { if (counts[n] !== undefined) counts[n]++; });

    // Present / Missing
    const present = Object.keys(counts).filter(k => counts[k] > 0).map(Number);
    const missing = Object.keys(counts).filter(k => counts[k] === 0).map(Number);

    return { y, m, d, driver, conductor, allNumbers, counts, present, missing };

  }, [dobInput]);

  if (!calcParams) {
    return (
      <div className="p-8 text-center space-y-6">
        <h2 className="text-3xl font-serif italic text-indigo-900">Lo Shu Grid Calculator</h2>
        <p className="text-slate-600">Please provide your Date of Birth to calculate your personalized Lo Shu Grid.</p>
        <input 
          type="date"
          value={dobInput}
          onChange={(e) => setDobInput(e.target.value)}
          className="px-6 py-3 border border-indigo-200 rounded-xl text-lg shadow-sm focus:ring focus:ring-indigo-200"
        />
      </div>
    );
  }

  const { driver, conductor, counts, present, missing } = calcParams;

  const checkPlane = (nums) => nums.every(n => counts[n] > 0);

  return (
    <div className="p-6 md:p-10 space-y-12 bg-[#faf9f6]">
      {/* Header and Input Container */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between border border-indigo-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 font-serif text-8xl transition-transform group-hover:scale-110">🔢</div>
         <div className="relative z-10 w-full mb-6 md:mb-0">
             <h2 className="text-4xl font-serif font-black italic text-indigo-900 tracking-wide">Lo Shu Grid</h2>
             <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-2">Vedic Numerology Analysis</p>
         </div>
         <div className="relative z-10 w-full md:w-auto flex items-center justify-end">
             <input 
               type="date"
               value={dobInput}
               onChange={(e) => setDobInput(e.target.value)}
               className="px-6 py-3 border border-indigo-200 rounded-xl text-lg shadow-sm bg-indigo-50 min-w-[200px]"
             />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE GRID & CORE NUMBERS */}
        <div className="lg:col-span-5 space-y-8">
            <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-2xl relative">
                <div className="flex justify-between items-center mb-8 border-b border-indigo-800 pb-4">
                   <div>
                       <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Personality</div>
                       <div className="text-2xl font-serif">Driver: <span className="font-bold text-amber-400 text-4xl">{driver}</span></div>
                   </div>
                   <div className="text-right">
                       <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Destiny</div>
                       <div className="text-2xl font-serif">Conductor: <span className="font-bold text-amber-400 text-4xl">{conductor}</span></div>
                   </div>
                </div>

                {/* THE 3x3 GRID */}
                <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-inner ring-4 ring-indigo-950/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
                    <div className="grid grid-cols-3 gap-2 relative z-10">
                    {GRID_TEMPLATE.map((row, rIdx) => 
                        row.map((num, cIdx) => {
                            const count = counts[num];
                            const content = count > 0 ? String(num).repeat(count) : "";
                            return (
                                <div key={`cell-${rIdx}-${cIdx}`} className="aspect-square border-2 border-indigo-100 rounded-xl flex items-center justify-center bg-indigo-50/50 relative group hover:bg-indigo-100 transition-colors">
                                    <span className="absolute top-1 left-2 text-[10px] font-black text-indigo-300 pointer-events-none">{num}</span>
                                    {content ? (
                                        <span className="text-3xl font-black text-indigo-900 tracking-[0.2em]">{content}</span>
                                    ) : (
                                        <span className="text-slate-300 italic opacity-50">Empty</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                    </div>
                </div>
                
                {/* Insights on repeating specific powerful numbers */}
                {counts[9] >= 3 && (
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-lg border border-white/20">
                        <h4 className="font-black italic tracking-widest text-sm mb-1 uppercase">999 Present</h4>
                        <p className="text-xs opacity-90">Amplified intellect and recognition. You are a visionary and influential leader.</p>
                    </div>
                )}
                {counts[1] >= 4 && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg border border-white/20">
                        <h4 className="font-black italic tracking-widest text-sm mb-1 uppercase">1111 Present</h4>
                        <p className="text-xs opacity-90">Exceptional leadership and communication skills, emphasizing individuality.</p>
                    </div>
                )}
            </div>
            
            {/* Planes Analysis */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="text-xl font-black uppercase text-slate-800 tracking-tighter mb-6 flex items-center gap-3">
                    <span className="text-indigo-500">⚛️</span> Plane Analysis
                </h3>
                <div className="space-y-6">
                    {['horizontal', 'vertical', 'diagonal'].map(type => (
                        <div key={type} className="space-y-3">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 border-b pb-1">{type} Planes</h4>
                            {PLANES_INFO[type].map(plane => {
                                const isComplete = checkPlane(plane.nums);
                                return (
                                    <div key={plane.name} className={`p-4 rounded-xl border ${isComplete ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'} transition-all hover:shadow-md`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-sm text-slate-700">{plane.name}</div>
                                            {isComplete ? (
                                                <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">Complete ✨</span>
                                            ) : (
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Incomplete</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 flex justify-between items-end">
                                            <span>{plane.desc}</span>
                                            <span className="font-mono font-bold tracking-widest text-indigo-300 ml-2">[{plane.nums.join(',')}]</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: STRENGTHS & REMEDIES */}
        <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="text-xl font-black uppercase text-emerald-800 tracking-tighter mb-6 flex items-center gap-3">
                    <span className="text-emerald-500">🌟</span> Present Strengths
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {present.map(n => {
                        const meaning = NUMBER_MEANINGS[n];
                        return (
                        <div key={`p-${n}`} className="bg-emerald-50 text-emerald-900 border border-emerald-100 p-4 rounded-xl flex gap-4 items-start shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="font-serif italic text-3xl opacity-50 shrink-0 text-emerald-700 font-black pt-1">{n}</div>
                            <div className="text-sm font-medium leading-relaxed flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-emerald-800 uppercase tracking-widest text-[11px]">{meaning.title}</span>
                                    <div className="flex gap-2">
                                        <span className="text-[9px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{meaning.element}</span>
                                        <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{meaning.planet}</span>
                                    </div>
                                </div>
                                <p className="text-emerald-700/80">{meaning.desc}</p>
                                {counts[n] > 1 && <div className="mt-2 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-200/50 inline-block px-2 py-1 rounded">Repeated: Amplified Effect</div>}
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="text-xl font-black uppercase text-rose-800 tracking-tighter mb-6 flex items-center gap-3">
                    <span className="text-rose-500">⚖️</span> Missing Energies & Remedies
                </h3>
                {missing.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50 rounded-xl text-slate-500 italic">No missing numbers. Your grid is fully populated!</div>
                ) : (
                    <div className="space-y-4 inline-block w-full">
                        {missing.map(n => (
                            <div key={`m-${n}`} className="bg-rose-50 text-rose-900 border border-rose-100 p-4 rounded-xl flex gap-4 items-center shadow-sm">
                                <div className="font-serif italic text-3xl opacity-50 text-rose-700 font-black">{n}</div>
                                <div className="text-sm font-medium leading-relaxed">
                                    {REMEDIES[n]}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 rounded-3xl shadow-xl border border-indigo-500/30">
                <h3 className="text-xl font-black uppercase text-indigo-200 tracking-tighter mb-6 flex items-center gap-3">
                    <span className="text-2xl">🔮</span> Grid Interpretation
                </h3>
                <p className="text-base md:text-lg font-serif leading-relaxed text-indigo-50 italic">
                    This grid suggests strengths in <span className="font-bold text-amber-400">{present.map(n => `${NUMBER_MEANINGS[n].keyword} (${n})`).join(', ')}</span>.
                    {missing.length > 0 ? (
                        <span>
                            {" "}Challenges or areas for development may include <span className="font-bold text-rose-300">{missing.map(n => `${NUMBER_MEANINGS[n].keyword} (${n})`).join(', ')}</span>.
                        </span>
                    ) : (
                        <span> Your grid is exceptionally balanced, pointing to a highly integrated energetic signature across all domains.</span>
                    )}
                </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl shadow-inner border border-blue-100 text-blue-900">
                <h4 className="font-black uppercase tracking-widest text-[11px] mb-3 opacity-60">About Lo Shu Grid Calculation</h4>
                <p className="text-xs leading-relaxed font-serif first-letter:text-2xl first-letter:font-black">
                    The Lo Shu Grid is a powerful tool based on ancient Chinese magic square numerology. The sum of each row, column, and diagonal equals 15. The 'Driver' number indicates your core personality, calculated from your day of birth. The 'Conductor' number indicates your destiny, calculated from your full birth date. Together, they create a resonant energetic signature.
                </p>
            </div>
        </div>
      </div>
      <div className="mt-12 text-center pb-20">
          <button 
            onClick={() => window.close()}
            className="px-12 py-4 bg-indigo-900 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-800 transition-all border border-indigo-700 hover:scale-105 active:scale-95"
          >
            Return to Workstation
          </button>
      </div>
    </div>
  );
}
