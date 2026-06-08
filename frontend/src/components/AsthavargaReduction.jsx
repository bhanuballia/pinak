import React from 'react';
import AshtakavargaChart from './AshtakavargaChart';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Ascendant"];

const PLANET_COLORS = {
  Sun: "#dc2626",
  Moon: "#111827",
  Mars: "#ef4444",
  Mercury: "#16a34a",
  Jupiter: "#d97706",
  Venus: "#db2777",
  Saturn: "#2563eb",
  Ascendant: "#000000"
};

export default function AsthavargaReduction({ data }) {
  const reductions = data?.av_reductions;
  
  if (!reductions || Object.keys(reductions).length === 0) {
    return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Loading or Reductions not available...</div>;
  }

  const getPlanetNameDisplay = (p) => {
    if (p === "Ascendant") return "Lagna";
    return p;
  };

  const getHousesData = (chartDataObj) => {
    // chartDataObj is { 0: value, 1: value, ... 11: value }
    // house_analytics is used to map sign_index to house
    if (!data?.av_reductions) return [];
    
    // We map sign index to house based on Ascendant
    const ascSign = data?.chart?.ascendant_sign_index || 0;
    const housesData = [];
    for (let i = 0; i < 12; i++) {
      const signIndex = (ascSign + i) % 12;
      housesData.push({
        house: i + 1,
        signIndex: signIndex,
        points: chartDataObj[signIndex] || 0
      });
    }
    return housesData;
  };

  // Group planets into chunks of 3 for printing
  const chunkedPlanets = [];
  for (let i = 0; i < PLANETS.length; i += 3) {
    chunkedPlanets.push(PLANETS.slice(i, i + 3));
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-4 md:p-8 rounded-3xl border shadow-xl font-serif">
      {chunkedPlanets.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className={`flex flex-col gap-6 ${chunkIndex > 0 ? 'print:break-before-page print:pt-8' : ''}`}>
          
          <div className={`grid grid-cols-[1fr_2fr_2fr_2fr] gap-4 text-center font-bold text-red-800 text-sm md:text-base border-b-2 border-red-800 pb-2 mb-4 ${chunkIndex > 0 ? 'hidden print:grid' : ''}`}>
            <div></div>
            <div>Before Reduction</div>
            <div>Trikona Reduction</div>
            <div>Ekadhipatya Reduction</div>
          </div>

          {chunk.map((planet) => {
            const res = reductions[planet];
            if (!res) return null;

            return (
              <div key={planet} className="grid grid-cols-[1fr_2fr_2fr_2fr] gap-4 items-center print:break-inside-avoid">
                {/* Info Column */}
                <div className="border border-red-800 p-2 md:p-4 rounded h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg md:text-xl underline mb-4 text-left" style={{ color: PLANET_COLORS[planet] }}>
                      {getPlanetNameDisplay(planet)}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span>Rashi Pinda</span>
                      <span>{res.rashi_pinda}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Graha Pinda</span>
                      <span>{res.graha_pinda}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sodhya Pinda</span>
                      <span>{res.sodhya_pinda}</span>
                    </div>
                  </div>
                </div>

                {/* Before Reduction */}
                <div className="border-2 border-blue-900 h-full p-2 flex flex-col justify-center">
                  <AshtakavargaChart 
                    title="" 
                    housesData={getHousesData(res.before)} 
                  />
                </div>

                {/* Trikona Reduction */}
                <div className="border-2 border-blue-900 h-full p-2 flex flex-col justify-center">
                  <AshtakavargaChart 
                    title="" 
                    housesData={getHousesData(res.trikona)} 
                  />
                </div>

                {/* Ekadhipatya Reduction */}
                <div className="border-2 border-blue-900 h-full p-2 flex flex-col justify-center">
                  <AshtakavargaChart 
                    title="" 
                    housesData={getHousesData(res.ekadhipatya)} 
                  />
                </div>

              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
