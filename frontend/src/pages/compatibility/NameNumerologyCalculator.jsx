import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const NameNumerologyCalculator = ({ onBack }) => {
  const [name1, setName1] = useState('Rahul');
  const [name2, setName2] = useState('Anjali');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name1 || !name2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/compatibility/name', {
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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
          Name Numerology Compatibility
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Enter both names to check compatibility using the Chaldean method.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Name</label>
                    <input 
                        type="text" 
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        placeholder="e.g. Anjali"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating...' : 'Calculate Compatibility'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-amber-100">
            <h3 className="text-3xl font-bold text-center mb-6">Name Numerology Compatibility Result</h3>
            
            <p className="text-center text-lg mb-8">
                As per Chiero/ Chaldean method of numerology, <strong className="text-amber-700">{result.name1}'s</strong> Namank (Destiny Number) is <strong className="text-rose-600 text-xl">{result.namank1}</strong> and <strong className="text-amber-700">{result.name2}'s</strong> Namank (Destiny Number) is <strong className="text-rose-600 text-xl">{result.namank2}</strong>. This shows <strong>{result.message}</strong>
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="flex items-center space-x-2 text-2xl font-bold">
                    <span className="text-rose-500">❤️</span>
                    <span>{result.name1} and {result.name2} are {result.compatibilityScore}% Compatible.</span>
                </div>
                
                <div className="text-lg text-amber-800 flex items-center space-x-2">
                    <span className="font-black text-2xl text-rose-600">{result.namank1}</span>
                    <span>More about {result.name1}'s namank (Destiny Number)</span>
                </div>
                <div className="text-lg text-amber-800 flex items-center space-x-2">
                    <span className="font-black text-2xl text-rose-600">{result.namank2}</span>
                    <span>More about {result.name2}'s namank (Destiny Number)</span>
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-rose-700 hover:text-rose-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Try another match</span>
                </button>
            </div>

            {/* Numbers Row */}
            <div className="flex justify-between items-center border-t border-b border-amber-200 py-4 mt-8 overflow-x-auto">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                    <div key={num} className="flex flex-col items-center px-4 border-r border-amber-100 last:border-0 min-w-[80px]">
                        <span className="text-sm text-amber-700 mb-1">Number [{num}]</span>
                        <span className="text-5xl font-black text-gradient bg-clip-text text-transparent bg-gradient-to-br from-red-600 to-yellow-500 filter drop-shadow-md">
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

export default NameNumerologyCalculator;
