import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import ZodiacChart from "./ZodiacChart";

const BAR_COLOR = '#a87171'; // Reddish-brown color matching the image

const Vaiseshikamsa4Graph = ({ data, title }) => {
  return (
    <div className="flex flex-col border border-green-800 p-1 rounded-sm shadow-sm bg-stone-50">
      <h3 className="text-center text-green-900 text-sm font-bold mb-1 tracking-wider">{title}</h3>
      <div className="w-full h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 5, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={{ stroke: '#1e3a8a' }} tickLine={false} tick={{ fill: '#1e3a8a', fontSize: 12, fontWeight: 'bold' }} />
            <YAxis hide={true} domain={['dataMin - (Math.abs(dataMin)*0.2 + 5)', 'dataMax + (Math.abs(dataMax)*0.2 + 5)']} />
            <ReferenceLine y={0} stroke="#1e3a8a" />
            <Bar dataKey="value" fill={BAR_COLOR} barSize={25} radius={[0, 0, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#4b5563" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Vaiseshikamsa4Assessment = ({ data }) => {
  const planets = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'];
  const fullPlanetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  // Real data extraction if available in `data.strength.planets`
  const getPlanetData = (key, dummyData) => {
    return planets.map((p, i) => {
      let value = dummyData[i];
      if (data?.strength?.planets) {
        const pName = fullPlanetNames[i];
        const pData = data.strength.planets[pName];
        if (pData) {
          if (key === 'total') value = pData.total;
          else if (key === 'percent') value = pData.ratio_data?.percent;
          else if (key === 'rupas') value = pData.ratio_data?.ratio;
          else if (pData[key] !== undefined) value = pData[key];
        }
      }
      return { name: p, value: Number(value).toFixed(1) * 1 }; // Ensure it's a number with sensible decimals
    });
  };

  // Fallback Dummy Data from the image
  const sthaanaData = getPlanetData('sth', [141, 166, 168, 166, 170, 133, 157]);
  const kaalaData = getPlanetData('kala', [192, 179, 121, 152, 210, 113, 75]);
  const digData = getPlanetData('dig', [51.0, 40.1, 47.2, 46.4, 23.4, 19.7, 40.9]);
  const cheshtaData = getPlanetData('cheshta', [28.4, 49.1, 30.3, 26.7, 18.2, 50.7, 58.3]);
  const drigData = getPlanetData('drik', [-15.2, 22.6, 7.8, -11.3, 7.8, -1.9, 2.1]);
  const naisargikaData = getPlanetData('naisargika', [60.0, 51.4, 17.1, 25.7, 34.3, 42.9, 8.6]);
  const shadbalaTotalData = getPlanetData('total', [428, 460, 392, 406, 463, 357, 342]);
  const shadbalaRupasData = getPlanetData('rupas', [7.1, 7.7, 6.5, 6.8, 7.7, 6.0, 5.7]);
  const shadbalaPercentData = getPlanetData('percent', [143, 128, 131, 97, 119, 108, 114]);

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

      {/* Right side: 3x3 Grid of Bar Charts */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <Vaiseshikamsa4Graph data={sthaanaData} title="Sthaana Bala" />
          <Vaiseshikamsa4Graph data={kaalaData} title="Kaala Bala" />
          <Vaiseshikamsa4Graph data={digData} title="DigBala" />
          <Vaiseshikamsa4Graph data={cheshtaData} title="Cheshta Bala" />
          <Vaiseshikamsa4Graph data={drigData} title="DrigBala" />
          <Vaiseshikamsa4Graph data={naisargikaData} title="Naisargika Bala" />
          <Vaiseshikamsa4Graph data={shadbalaTotalData} title="Shadbala" />
          <Vaiseshikamsa4Graph data={shadbalaRupasData} title="Shadbala (rupas)" />
          <Vaiseshikamsa4Graph data={shadbalaPercentData} title="Shadbala (% strength)" />
        </div>
      </div>
    </div>
  );
};

export default Vaiseshikamsa4Assessment;
