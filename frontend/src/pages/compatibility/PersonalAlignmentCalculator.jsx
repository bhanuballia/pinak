import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, User, Calendar } from 'lucide-react';

const PersonalAlignmentCalculator = ({ onBack }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name || !dob) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/alignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dob }),
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
    setName('');
    setDob('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          Personal Name Alignment
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Discover if your Name (Destiny Number) is in perfect harmony with your Date of Birth (Life Path Number).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Your Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                        placeholder="e.g. Rahul Sharma"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Your Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Analyzing Alignment...' : 'Check Alignment'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-teal-100">
            <h3 className="text-3xl font-bold text-center mb-6 text-teal-800">Alignment Result</h3>
            
            <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-2 mx-auto shadow-inner">
                        <span className="text-3xl font-black text-teal-600">{result.destinyNumber}</span>
                    </div>
                    <span className="font-bold text-teal-900 text-lg flex items-center justify-center gap-1"><User className="w-4 h-4"/> Name</span>
                    <p className="text-sm text-slate-500">Destiny Number</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="text-4xl text-teal-500 mb-1">⚖️</div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Alignment</span>
                </div>
                
                <div className="text-center">
                    <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-2 mx-auto shadow-inner">
                        <span className="text-3xl font-black text-cyan-600">{result.lifePathNumber}</span>
                    </div>
                    <span className="font-bold text-cyan-900 text-lg flex items-center justify-center gap-1"><Calendar className="w-4 h-4"/> Birth</span>
                    <p className="text-sm text-slate-500">Life Path Number</p>
                </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8 text-center">
                <p className="text-lg text-teal-900 font-medium mb-4">
                    {result.message}
                </p>
                <div className="inline-block bg-white text-slate-700 text-sm px-4 py-2 rounded-lg border border-teal-100 shadow-sm italic">
                    💡 <strong>Suggestion:</strong> {result.suggestion}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-3 rounded-full shadow-md">
                    Alignment Score: {result.compatibilityScore}%
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-teal-600 hover:text-teal-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Check another name</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PersonalAlignmentCalculator;
