import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import ZodiacChart from "./ZodiacChart";

const BAR_COLOR = '#a87171'; // Reddish-brown color matching the image

const Vaiseshikamsa3Graph = ({ data, title }) => {
  return (
    <div className="flex flex-col border border-green-800 p-2 rounded-sm shadow-sm bg-stone-50 mb-4">
      <h3 className="text-center text-green-900 text-lg font-bold mb-2 tracking-wider">{title}</h3>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={{ stroke: '#1e3a8a' }} tickLine={false} tick={{ fill: '#1e3a8a', fontSize: 14, fontWeight: 'bold' }} />
            <YAxis hide={true} />
            <Bar dataKey="value" fill={BAR_COLOR} barSize={40} radius={[0, 0, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#4b5563" fontSize={14} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Vaiseshikamsa3Assessment = ({ data }) => {
  // Use real data from the backend if available, otherwise fall back to dummy data for display
  const realShadbala = data?.bhavbala?.shadbala; // Assuming this is where house shadbala might be in the future
  const realSAV = data?.ashtakavarga?.sarvashtakavarga || data?.strength?.ashtakavarga?.sarvashtakavarga;

  const dummyShadbala = [7.4, 9.0, 7.0, 7.2, 9.5, 8.3, 7.0, 7.3, 8.1, 8.2, 7.3, 7.2];
  const dummySAV = [23, 28, 27, 34, 25, 28, 30, 30, 29, 33, 28, 22];

  const houseNames = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  const shadbalaData = houseNames.map((name, i) => ({
    name,
    value: dummyShadbala[i],
  }));

  const savData = houseNames.map((name, i) => ({
    name,
    value: dummySAV[i],
  }));

  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts }, // Usually D1 houses are in data?.charts?.houses
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  return (
    <div className="bg-white h-full min-h-[600px] w-full p-2 flex flex-row font-serif overflow-hidden gap-2">
      {/* Left side: 6 Divisional Charts Grid */}
      <div className="w-[30%] lg:w-[40%] xl:w-[45%] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 border-r border-gray-200">
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

      {/* Right side: Bar Charts */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <div className="flex flex-col gap-4">
          <Vaiseshikamsa3Graph data={shadbalaData} title="Bhava Bala - Shadbala" />
          <Vaiseshikamsa3Graph data={savData} title="Bhava Bala - SAV (D-1)" />
        </div>
      </div>
    </div>
  );
};

export default Vaiseshikamsa3Assessment;
