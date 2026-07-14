import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const FriendshipCalculator = ({ onBack }) => {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!dob1 || !dob2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/numerology/compatibility/friendship', {
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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Friendship Compatibility
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-center mb-6">Enter birth dates to see how strong your friendship bond is numerologically!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Friend 1 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob1}
                        onChange={(e) => setDob1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Friend 2 Date of Birth</label>
                    <input 
                        type="date" 
                        value={dob2}
                        onChange={(e) => setDob2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Calculating...' : 'Calculate Friendship Score'}
            </button>
        </form>
      ) : (
        <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-purple-100">
            <h3 className="text-3xl font-bold text-center mb-6 text-purple-800">Friendship Result</h3>
            
            <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl font-black text-purple-600">{result.lifePath1}</span>
                    </div>
                    <span className="font-bold text-purple-900 text-lg">Friend 1</span>
                    <p className="text-sm text-slate-500">Number</p>
                </div>
                <div className="text-5xl text-yellow-500">🤝</div>
                <div className="text-center">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-3xl font-black text-pink-600">{result.lifePath2}</span>
                    </div>
                    <span className="font-bold text-pink-900 text-lg">Friend 2</span>
                    <p className="text-sm text-slate-500">Number</p>
                </div>
            </div>

            <p className="text-center text-lg mb-8 max-w-xl mx-auto">
                <strong>{result.message}</strong>
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full shadow-lg border border-purple-200">
                    Friendship Score: {result.compatibilityScore}%
                </div>

                <button onClick={reset} className="flex items-center space-x-2 text-purple-700 hover:text-purple-500 font-bold mt-4 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Try another pair</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default FriendshipCalculator;
