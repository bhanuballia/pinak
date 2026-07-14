import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Hexagon, Calendar } from 'lucide-react';

const RelationshipPathCalculator = ({ onBack }) => {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!dob1 || !dob2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/relationship-path', {
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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          The Relationship Path
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Discover the ultimate destiny and purpose of your relationship by combining your Life Path numbers.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob1}
                        onChange={(e) => setDob1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 2 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob2}
                        onChange={(e) => setDob2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating Destiny...' : 'Reveal Relationship Destiny'}
            </button>
        </form>
      ) : (
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-indigo-500/30">
            <h3 className="text-3xl font-bold text-center mb-8 text-indigo-300">Your Shared Destiny</h3>
            
            <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2 mx-auto border border-slate-600">
                        <span className="text-2xl font-bold text-slate-300">{result.lifePath1}</span>
                    </div>
                    <span className="text-sm text-slate-400">Person 1</span>
                </div>
                
                <div className="text-4xl font-light text-slate-500">+</div>
                
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2 mx-auto border border-slate-600">
                        <span className="text-2xl font-bold text-slate-300">{result.lifePath2}</span>
                    </div>
                    <span className="text-sm text-slate-400">Person 2</span>
                </div>
            </div>

            <div className="relative mb-10">
                <div className="absolute inset-0 bg-indigo-500 blur-[30px] opacity-20 rounded-full"></div>
                <div className="relative flex flex-col items-center justify-center text-center">
                    <Hexagon className="w-32 h-32 text-indigo-400 mb-4" strokeWidth={1} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[1.7rem]">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200">
                            {result.relationshipNumber}
                        </span>
                    </div>
                    <h4 className="text-2xl font-bold text-purple-300 mt-2">"{result.title}"</h4>
                </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 text-center mb-8">
                <p className="text-lg text-slate-300 leading-relaxed">
                    {result.message}
                </p>
            </div>

            <div className="flex justify-center">
                <button onClick={reset} className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Calculate another path</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipPathCalculator;
