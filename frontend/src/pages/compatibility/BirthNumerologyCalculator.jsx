import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const BirthNumerologyCalculator = ({ onBack }) => {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!dob1 || !dob2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/compatibility/birth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dob1, dob2 }),
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
    setDob1('');
    setDob2('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
          Birth Date Numerology Compatibility
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Enter birth dates to check compatibility based on Life Path Numbers.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob1}
                        onChange={(e) => setDob1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 2 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob2}
                        onChange={(e) => setDob2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating...' : 'Calculate Compatibility'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-green-100">
            <h3 className="text-3xl font-bold text-center mb-6">Life Path Compatibility Result</h3>
            
            <p className="text-center text-lg mb-8">
                Person 1's Life Path Number is <strong className="text-green-600 text-xl">{result.lifePath1}</strong> and Person 2's Life Path Number is <strong className="text-green-600 text-xl">{result.lifePath2}</strong>. <br/><br/>
                <strong>{result.message}</strong>
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="flex items-center space-x-2 text-2xl font-bold">
                    <span className="text-rose-500">❤️</span>
                    <span>You are {result.compatibilityScore}% Compatible.</span>
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Try another match</span>
                </button>
            </div>
            
            {/* Numbers Row */}
            <div className="flex justify-between items-center border-t border-b border-green-200 py-4 mt-8 overflow-x-auto">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                    <div key={num} className="flex flex-col items-center px-4 border-r border-green-100 last:border-0 min-w-[80px]">
                        <span className="text-sm text-green-700 mb-1">Number [{num}]</span>
                        <span className="text-5xl font-black text-gradient bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-emerald-500 filter drop-shadow-md">
                            {num}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default BirthNumerologyCalculator;
