import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const NameHoroscopeCalculator = ({ onBack }) => {
  const [name1, setName1] = useState('Rahul');
  const [name2, setName2] = useState('Anjali');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name1 || !name2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/astrology/compatibility/name-horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name1, name2 }),
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
    setName1('');
    setName2('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
          Name Horoscope Compatibility
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Enter names to check compatibility based on Name Zodiac Signs (Avakahada Chakra principles).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Name</label>
                    <input 
                        type="text" 
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        placeholder="e.g. Rahul"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 2 Name</label>
                    <input 
                        type="text" 
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        placeholder="e.g. Anjali"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating...' : 'Calculate Compatibility'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-yellow-100">
            <h3 className="text-3xl font-bold text-center mb-6 text-amber-800">Name Horoscope Result</h3>
            
            <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl font-bold text-amber-600">{result.name1.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-bold text-amber-900 text-lg">{result.name1}</span>
                    <p className="text-sm text-slate-500">Sign: {result.sign1}</p>
                </div>
                <div className="text-4xl text-rose-500">❤️</div>
                <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl font-bold text-yellow-600">{result.name2.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-bold text-amber-900 text-lg">{result.name2}</span>
                    <p className="text-sm text-slate-500">Sign: {result.sign2}</p>
                </div>
            </div>

            <p className="text-center text-lg mb-8 max-w-xl mx-auto">
                <strong>{result.message}</strong>
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="text-2xl font-bold text-amber-900 bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-200">
                    Compatibility Score: {result.compatibilityScore}%
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-amber-700 hover:text-amber-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Try another match</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default NameHoroscopeCalculator;
