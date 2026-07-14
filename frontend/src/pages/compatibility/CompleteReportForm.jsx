import React, { useState } from 'react';
import { ArrowLeft, FileText, Sparkles, User } from 'lucide-react';
import CompleteReportView from './CompleteReportView';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const CompleteReportForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name1: '', dob1: '', sun1: 'Aries', moon1: 'Aries', venus1: 'Aries', mars1: 'Aries',
    name2: '', dob2: '', sun2: 'Aries', moon2: 'Aries', venus2: 'Aries', mars2: 'Aries'
  });
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, person) => {
    setFormData({
      ...formData,
      [`${e.target.name}${person}`]: e.target.value
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/report/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (reportData) {
    return <CompleteReportView data={reportData} onBack={() => setReportData(null)} />;
  }

  const renderPersonForm = (personNum, title, colorClass, borderClass) => (
    <div className={`bg-slate-800/80 p-8 rounded-3xl border ${borderClass} shadow-xl space-y-6 relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-10 rounded-bl-full`}></div>
        <h3 className={`text-2xl font-bold flex items-center gap-2 ${colorClass.replace('bg-', 'text-')}`}>
            <User className="w-6 h-6" /> {title}
        </h3>
        
        <div className="space-y-4 relative z-10">
            <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData[`name${personNum}`]}
                    onChange={(e) => handleChange(e, personNum)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Date of Birth</label>
                <input 
                    type="date" 
                    name="dob"
                    value={formData[`dob${personNum}`]}
                    onChange={(e) => handleChange(e, personNum)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all"
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                    <label className="text-sm font-medium text-orange-300 block mb-1">Sun Sign</label>
                    <select name="sun" value={formData[`sun${personNum}`]} onChange={(e) => handleChange(e, personNum)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-white">
                        {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-blue-300 block mb-1">Moon Sign</label>
                    <select name="moon" value={formData[`moon${personNum}`]} onChange={(e) => handleChange(e, personNum)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-white">
                        {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-pink-300 block mb-1">Venus Sign</label>
                    <select name="venus" value={formData[`venus${personNum}`]} onChange={(e) => handleChange(e, personNum)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-white">
                        {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-red-400 block mb-1">Mars Sign</label>
                    <select name="mars" value={formData[`mars${personNum}`]} onChange={(e) => handleChange(e, personNum)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-white">
                        {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" /> Complete Love Report
            </h2>
            <p className="text-slate-400 mt-1">Enter details for both partners to generate your ultimate compatibility master document.</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderPersonForm(1, "Partner 1", "bg-purple-500", "border-purple-500/30")}
            {renderPersonForm(2, "Partner 2", "bg-pink-500", "border-pink-500/30")}
        </div>

        <button 
            type="submit"
            disabled={loading}
            className="w-full max-w-xl mx-auto block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xl py-5 px-8 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
        >
            <FileText className="w-6 h-6" />
            {loading ? 'Crunching Numbers & Aligning Stars...' : 'Generate Master Report'}
        </button>
      </form>
    </div>
  );
};

export default CompleteReportForm;
