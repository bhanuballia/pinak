import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const MOON_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const MoonSignCalculator = ({ onBack }) => {
  const [sign1, setSign1] = useState('Aries');
  const [sign2, setSign2] = useState('Aries');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!sign1 || !sign2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/astrology/compatibility/moon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sign1, sign2 }),
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Moon Sign Compatibility
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Select Moon Signs to check emotional compatibility and elemental harmony.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Moon Sign</label>
                    <select 
                        value={sign1}
                        onChange={(e) => setSign1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                    >
                        {MOON_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 2 Moon Sign</label>
                    <select 
                        value={sign2}
                        onChange={(e) => setSign2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                    >
                        {MOON_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                    </select>
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating...' : 'Calculate Compatibility'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-blue-100">
            <h3 className="text-3xl font-bold text-center mb-6">Moon Sign Harmony Result</h3>
            
            <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl">🌙</span>
                    </div>
                    <span className="font-bold text-blue-900 text-lg">{result.sign1}</span>
                </div>
                <div className="text-4xl text-rose-500">❤️</div>
                <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl">🌙</span>
                    </div>
                    <span className="font-bold text-indigo-900 text-lg">{result.sign2}</span>
                </div>
            </div>

            <p className="text-center text-lg mb-8 max-w-xl mx-auto">
                <strong>{result.message}</strong>
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="text-2xl font-bold text-blue-900 bg-blue-50 px-6 py-3 rounded-xl border border-blue-200">
                    Compatibility Score: {result.compatibilityScore}%
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-blue-700 hover:text-blue-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Try another match</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MoonSignCalculator;
