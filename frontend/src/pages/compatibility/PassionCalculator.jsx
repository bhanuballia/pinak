import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Flame, Heart } from 'lucide-react';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PassionCalculator = ({ onBack }) => {
  const [venus1, setVenus1] = useState('Aries');
  const [mars1, setMars1] = useState('Aries');
  const [venus2, setVenus2] = useState('Aries');
  const [mars2, setMars2] = useState('Aries');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await fetch('/api/astrology/compatibility/passion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venus1, mars1, venus2, mars2 }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500">
          Passion & Romance Calculator
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-8">
            <p className="text-slate-400 text-center mb-2">
                Evaluate your physical and romantic chemistry by comparing your Venus (Romance) and Mars (Passion) placements!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Person 1 */}
                <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-center text-rose-300 border-b border-slate-700 pb-2">Person 1</h3>
                    
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-pink-300">
                            <Heart className="w-4 h-4" /> <span>Venus Sign (Romance)</span>
                        </label>
                        <select 
                            value={venus1}
                            onChange={(e) => setVenus1(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-all"
                        >
                            {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-red-400">
                            <Flame className="w-4 h-4" /> <span>Mars Sign (Passion)</span>
                        </label>
                        <select 
                            value={mars1}
                            onChange={(e) => setMars1(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
                        >
                            {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                        </select>
                    </div>
                </div>

                {/* Person 2 */}
                <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-center text-rose-300 border-b border-slate-700 pb-2">Person 2</h3>
                    
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-pink-300">
                            <Heart className="w-4 h-4" /> <span>Venus Sign (Romance)</span>
                        </label>
                        <select 
                            value={venus2}
                            onChange={(e) => setVenus2(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-all"
                        >
                            {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-red-400">
                            <Flame className="w-4 h-4" /> <span>Mars Sign (Passion)</span>
                        </label>
                        <select 
                            value={mars2}
                            onChange={(e) => setMars2(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
                        >
                            {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2"
            >
                <Flame className="w-5 h-5" />
                {loading ? 'Analyzing Chemistry...' : 'Calculate Chemistry'}
                <Heart className="w-5 h-5" />
            </button>
        </form>
      ) : (
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-[0_0_40px_rgba(244,63,94,0.15)] max-w-4xl mx-auto border border-rose-900/50">
            <h3 className="text-3xl font-bold text-center mb-8 text-rose-400 flex justify-center items-center gap-3">
                <Flame className="w-8 h-8 text-red-500" /> Chemistry Results <Flame className="w-8 h-8 text-red-500" />
            </h3>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-10">
                <div className="text-center bg-slate-800 p-6 rounded-2xl w-full max-w-xs border border-slate-700">
                    <span className="font-bold text-rose-300 text-xl block mb-4 border-b border-slate-700 pb-2">Person 1</span>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400"><Heart className="w-4 h-4 inline mr-1 text-pink-400"/> Venus</span>
                        <span className="font-bold text-pink-200">{result.venus1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400"><Flame className="w-4 h-4 inline mr-1 text-red-500"/> Mars</span>
                        <span className="font-bold text-red-300">{result.mars1}</span>
                    </div>
                </div>
                
                <div className="text-5xl animate-pulse">⚡</div>
                
                <div className="text-center bg-slate-800 p-6 rounded-2xl w-full max-w-xs border border-slate-700">
                    <span className="font-bold text-rose-300 text-xl block mb-4 border-b border-slate-700 pb-2">Person 2</span>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400"><Heart className="w-4 h-4 inline mr-1 text-pink-400"/> Venus</span>
                        <span className="font-bold text-pink-200">{result.venus2}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400"><Flame className="w-4 h-4 inline mr-1 text-red-500"/> Mars</span>
                        <span className="font-bold text-red-300">{result.mars2}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-rose-900/30 mb-8 text-center max-w-2xl mx-auto">
                <p className="text-xl text-slate-200 leading-relaxed italic">
                    "{result.message}"
                </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-rose-500 blur-[20px] opacity-40 rounded-full"></div>
                    <div className="relative text-3xl font-black text-white bg-gradient-to-r from-rose-600 to-red-600 px-10 py-5 rounded-full border border-rose-400/50 shadow-xl flex items-center gap-3">
                        Chemistry Score: {result.compatibilityScore}%
                    </div>
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-rose-400 hover:text-rose-300 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Test another match</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PassionCalculator;
