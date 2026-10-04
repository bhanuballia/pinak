import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

import ZodiacChart from "./ZodiacChart";

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_SHORT = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

const BAR_COLOR = 'rgba(235, 146, 74, 1)'; // reddish-brown from the image

const VaiseshikamsaGraph = ({ data, title, maxVal }) => {
  const chartData = PLANETS.map(p => ({
    name: PLANET_SHORT[p],
    value: data?.[p] || 0
  }));

  return (
    <div className="flex flex-col h-full border border-green-800 p-2 rounded-sm shadow-sm bg-stone-50">
      <h3 className="text-center text-green-900 text-sm font-bold font-serif mb-2 uppercase tracking-wider">{title} ({maxVal})</h3>
      <div className="flex-1 w-full h-[150px] min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={{ stroke: '#1e3a8a' }} tickLine={false} tick={{ fill: 'rgba(2, 1, 1, 1)', fontSize: 12, fontWeight: 'bold', fontFamily: 'Times New Roman ' }} />
            <YAxis hide={true} domain={[0, maxVal]} />
            <Bar dataKey="value" fill={BAR_COLOR} barSize={25} radius={[2, 2, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#1e3a8a" fontSize={12} fontWeight="bold" fontFamily="serif" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const VaiseshikamsaAssessment = ({ data }) => {
  const assessment = data?.vimsopaka_assessment || {};
  const vaiseshikamsa = assessment.vaiseshikamsa || {};

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
      <div className="w-[30%] lg:w-[40%] xl:w-[40%] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 border-r border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {vargasList.map(v => (
            <div key={v.id} className="border border-slate-300 shadow-sm bg-white overflow-hidden flex flex-col h-[180px]">
              <div className="text-[10px] font-bold text-center bg-slate-100 py-1 border-b border-slate-200 uppercase">{v.label} ({v.id.toUpperCase()})</div>
              <div className="flex-1 overflow-hidden p-1 relative">
                <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166%] h-[166%]">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={v.data?.houses} variant="legacy" defaultRect={true} scaleText={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <VaiseshikamsaGraph data={vaiseshikamsa.dasavarga} title="Vaiseshikamsa" maxVal={10} />
        <VaiseshikamsaGraph data={vaiseshikamsa.shodashvarga} title="Vaiseshikamsa" maxVal={16} />
        <VaiseshikamsaGraph data={vaiseshikamsa.shadvarga} title="Vaiseshikamsa" maxVal={6} />
        <VaiseshikamsaGraph data={vaiseshikamsa.saptavarga} title="Vaiseshikamsa" maxVal={7} />
      </div>
    </div>
  );
};

export default VaiseshikamsaAssessment;
