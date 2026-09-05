import React from "react";
import { YAMAKANTAKA_HOUSE_EFFECTS } from "../../data/yamakantakaData";

const YamakantakaAnalysis = ({ yamakantaka }) => {
  if (!yamakantaka || !yamakantaka.house) return null;

  const houseData = YAMAKANTAKA_HOUSE_EFFECTS[yamakantaka.house];
  if (!houseData) return null;

  return (
    <div className="mt-6 md:mt-12 max-w-[1300px] mx-auto w-full px-4 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <span className="text-2xl sm:text-3xl text-white">🌟</span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Yamakantaka Analysis</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">The protective grace of Jupiter's Upagraha</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm relative overflow-hidden h-full">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-40"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-1">Placement</h3>
              <div className="text-3xl font-black text-slate-800 mb-2">{houseData.title}</div>
              
              <div className="flex items-center gap-2 mt-4 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                Sign: {yamakantaka.sign_name}
              </div>
              <div className="flex items-center gap-2 mt-2 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Time: {yamakantaka.time}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
            <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-amber-500">✨</span> Protective Effects & Blessings
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

export default YamakantakaAnalysis;
