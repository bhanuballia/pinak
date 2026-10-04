import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import ZodiacChart from "./ZodiacChart";

const BAR_COLOR = '#a87171'; // Reddish-brown color matching the image

const Vaiseshikamsa5Graph = ({ data, title }) => {
  return (
    <div className="flex flex-col border border-green-800 p-2 rounded-sm shadow-sm bg-stone-50">
      <h3 className="text-center text-green-900 text-lg font-bold mb-2 tracking-wider">{title}</h3>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={{ stroke: '#1e3a8a' }} tickLine={false} tick={{ fill: '#1e3a8a', fontSize: 14, fontWeight: 'bold' }} />
            <YAxis hide={true} domain={[0, 'dataMax + 2']} />
            <ReferenceLine y={0} stroke="#1e3a8a" />
            <Bar dataKey="value" fill={BAR_COLOR} barSize={35} radius={[0, 0, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#4b5563" fontSize={13} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Vaiseshikamsa5Assessment = ({ data }) => {
  const planets = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];
  const fullPlanetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  
  // Real data extraction if available
  const getVimsopakaData = (vargaKey, dummyData) => {
    return planets.map((p, i) => {
      let value = dummyData[i];
      const pName = fullPlanetNames[i];
      
      const vimsopakaBala = data?.vimsopaka_bala || data?.vimsopaka_assessment?.vimsopaka_bala;
      
      if (vimsopakaBala && vimsopakaBala[vargaKey]) {
        const realVal = vimsopakaBala[vargaKey][pName] || vimsopakaBala[vargaKey][pName.toLowerCase()];
        if (realVal !== undefined && realVal !== null) {
            value = realVal;
        }
      }
      
      return { name: p, value: Number(Number(value).toFixed(1)) };
    });
  };

  // Fallback Dummy Data from the image
  const vimsopaka10Data = getVimsopakaData('dasavarga', [12.4, 14.0, 14.9, 13.9, 11.8, 13.0, 14.9, 13.6, 10.6]);
  const vimsopaka16Data = getVimsopakaData('shodashvarga', [11.8, 13.1, 14.1, 14.9, 12.5, 13.4, 14.0, 13.6, 11.2]);
  const vimsopaka6Data = getVimsopakaData('shadvarga', [9.8, 12.3, 14.8, 11.3, 15.6, 15.4, 12.0, 13.2, 11.8]);
  const vimsopaka7Data = getVimsopakaData('saptavarga', [8.8, 13.8, 13.9, 11.6, 14.2, 14.8, 12.9, 13.5, 11.4]);

  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts },
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  return (
    <div className="bg-white h-full min-h-[600px] w-full p-2 flex flex-row font-serif overflow-hidden gap-2">
      {/* Left side: 6 Divisional Charts Grid */}
      <div className="w-[30%] lg:w-[40%] xl:w-[40%] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 border-r border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {vargasList.map(v => (
            <div key={v.id} className="border border-slate-300 shadow-sm bg-white overflow-hidden flex flex-col h-[180px]">
              <div className="text-[10px] font-bold text-center bg-slate-100 py-1 border-b border-slate-200 uppercase">{v.label} ({v.id.toUpperCase()})</div>
              <div className="flex-1 overflow-hidden p-1 relative">
                <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166%] h-[166%]">
                  <ZodiacChart 
                    planetPositions={data?.planet_positions} 
                    houses={v.data?.houses} 
                    variant="legacy" 
                    defaultRect={true} 
                    scaleText={2.5} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right side: 2x2 Grid of Bar Charts */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Vaiseshikamsa5Graph data={vimsopaka10Data} title="Vimsopaka Bala (10)" />
            <Vaiseshikamsa5Graph data={vimsopaka16Data} title="Vimsopaka Bala (16)" />
            <Vaiseshikamsa5Graph data={vimsopaka6Data} title="Vimsopaka Bala (6)" />
            <Vaiseshikamsa5Graph data={vimsopaka7Data} title="Vimsopaka Bala (7)" />
        </div>
      </div>
    </div>
  );
};

export default Vaiseshikamsa5Assessment;
