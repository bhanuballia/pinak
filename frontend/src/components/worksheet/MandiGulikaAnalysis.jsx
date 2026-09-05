import React from "react";
import { MANDI_GULIKA_HOUSE_EFFECTS } from "../../data/mandiGulikaData";

const MandiGulikaAnalysis = ({ mandi, gulika }) => {
  if (!mandi || !mandi.house) return null;

  const houseData = MANDI_GULIKA_HOUSE_EFFECTS[mandi.house];
  if (!houseData) return null;

  const isUpachaya = [3, 6, 10, 11].includes(mandi.house);

  return (
    <div className="mt-6 md:mt-12 max-w-[1300px] mx-auto w-full px-4 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg ${isUpachaya ? 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-teal-500/30' : 'bg-gradient-to-br from-slate-600 to-slate-900 shadow-slate-700/30'}`}>
          <span className="text-2xl sm:text-3xl text-white">🌑</span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Mandi & Gulika Analysis</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Saturn's shadow planets of delay, obstacles, and concentrated karma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden h-full ${isUpachaya ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-teal-100' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'}`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-40 ${isUpachaya ? 'bg-teal-200' : 'bg-slate-300'}`}></div>
            <div className="relative z-10">
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isUpachaya ? 'text-teal-700' : 'text-slate-600'}`}>Placement</h3>
              <div className="text-3xl font-black text-slate-800 mb-2">{houseData.title}</div>
              
              <div className="flex flex-col gap-2 mt-4 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUpachaya ? 'bg-teal-500' : 'bg-slate-600'}`}></span>
                  Mandi: {mandi.sign_name}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUpachaya ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                  Gulika: {gulika ? gulika.sign_name : mandi.sign_name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${isUpachaya ? 'from-emerald-400 to-teal-600' : 'from-slate-400 to-slate-700'}`}></div>
            <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className={isUpachaya ? "text-teal-600" : "text-slate-600"}>{isUpachaya ? '📈' : '⚠️'}</span> 
              {isUpachaya ? "Material Success & Growth" : "Karmic Challenges & Caution"}
            </h4>
            <p className="text-slate-600 leading-relaxed text-[15px] sm:text-base">
              {houseData.effect}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiGulikaAnalysis;
