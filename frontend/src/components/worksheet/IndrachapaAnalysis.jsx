import React from "react";
import { INDRACHAPA_HOUSE_EFFECTS } from "../../data/indrachapaData";

const IndrachapaAnalysis = ({ indrachapa }) => {
  if (!indrachapa || !indrachapa.house) {
    return (
      <div className="mt-6 md:mt-12 max-w-[1300px] mx-auto w-full px-4 sm:px-6">
        <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-center">
          <p className="text-slate-500 font-medium">No Indrachapa is present for the house.</p>
        </div>
      </div>
    );
  }

  const houseData = INDRACHAPA_HOUSE_EFFECTS[indrachapa.house];
  if (!houseData) return null;

  const isUpachaya = [3, 6, 10, 11].includes(indrachapa.house);

  return (
    <div className="mt-6 md:mt-12 max-w-[1300px] mx-auto w-full px-4 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg ${isUpachaya ? 'bg-gradient-to-br from-indigo-500 to-violet-700 shadow-indigo-500/30' : 'bg-gradient-to-br from-violet-600 to-purple-900 shadow-purple-700/30'}`}>
          <span className="text-2xl sm:text-3xl text-white">🌩️</span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Indrachapa (Kodanda) Analysis</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">The mysterious Aprakasha Graha of illusions and sudden strikes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden h-full ${isUpachaya ? 'bg-gradient-to-br from-indigo-50 to-violet-50 border-violet-100' : 'bg-gradient-to-br from-violet-50 to-purple-100 border-purple-200'}`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-40 ${isUpachaya ? 'bg-indigo-200' : 'bg-purple-300'}`}></div>
            <div className="relative z-10">
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isUpachaya ? 'text-indigo-700' : 'text-purple-800'}`}>Placement</h3>
              <div className="text-3xl font-black text-slate-800 mb-2">{houseData.title}</div>
              
              <div className="flex flex-col gap-2 mt-4 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUpachaya ? 'bg-indigo-500' : 'bg-purple-700'}`}></span>
                  Sign: {indrachapa.sign_name}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUpachaya ? 'bg-violet-400' : 'bg-purple-500'}`}></span>
                  Longitude: {indrachapa.lon}°
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${isUpachaya ? 'from-indigo-400 to-violet-600' : 'from-violet-500 to-purple-800'}`}></div>
            <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className={isUpachaya ? "text-indigo-500" : "text-purple-700"}>{isUpachaya ? '⚡' : '🌪️'}</span> 
              {isUpachaya ? "Sudden Rise & Strategic Illusions" : "Mysterious Events & Mirages"}
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

export default IndrachapaAnalysis;
