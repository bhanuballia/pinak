import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Eye, Sparkles } from 'lucide-react';

const MasterNumberCalculator = ({ onBack }) => {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!dob1 || !dob2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/master-number', {
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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
          Spiritual Bond Checker
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Discover if you share a rare "Soul Contract" by checking for Numerology Master Numbers (11, 22, 33).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 1 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob1}
                        onChange={(e) => setDob1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Person 2 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob2}
                        onChange={(e) => setDob2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                <Eye className="w-5 h-5" />
                {loading ? 'Searching for Master Numbers...' : 'Reveal Spiritual Bonds'}
            </button>
        </form>
      ) : (
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-amber-500/30">
            {result.hasMasterNumber ? (
                <div className="text-center space-y-8 animate-fade-in-up">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-yellow-400 blur-[40px] opacity-30 rounded-full animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-yellow-300 to-amber-600 p-6 rounded-full shadow-2xl border-4 border-yellow-200">
                            <Sparkles className="w-16 h-16 text-slate-900" />
                        </div>
                    </div>
                    
                    <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
                        {result.message}
                    </h3>
                    
                    <div className="bg-amber-950/40 p-6 rounded-xl border border-amber-900/50 inline-block text-left max-w-xl mx-auto shadow-inner">
                        <p className="text-lg text-amber-100 leading-relaxed italic">
                            {result.details}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-8 animate-fade-in-up">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-600">
                        <Eye className="w-12 h-12 text-slate-500" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-slate-300">
                        {result.message}
                    </h3>
                    
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 inline-block text-left max-w-xl mx-auto">
                        <p className="text-lg text-slate-400 leading-relaxed">
                            {result.details}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-10">
                <button onClick={reset} className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 font-bold transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Check another connection</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MasterNumberCalculator;
