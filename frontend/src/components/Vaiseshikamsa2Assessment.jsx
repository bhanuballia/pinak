import React, { useState, useEffect } from 'react';
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

const Vaiseshikamsa2Assessment = ({ data }) => {
  const [avBala, setAvBala] = useState({});

  useEffect(() => {
    let birthDetails = null;
    if (data && data.basic_details) {
      const bd = data.basic_details;
      birthDetails = {
        date: bd.birth_date,
        time: bd.birth_time,
        lat: bd.lat,
        lon: bd.lon,
        tz_offset: (bd.tz_offset !== undefined && bd.tz_offset !== null && bd.tz_offset !== "") ? parseFloat(bd.tz_offset) : 5.5,
      };
    } else {
      try {
        const stored = localStorage.getItem('worksheetData');
        if (stored) {
          const parsed = JSON.parse(stored);
          const bd = parsed.basic_details;
          if (bd) {
            birthDetails = {
              date: bd.birth_date,
              time: bd.birth_time,
              lat: bd.lat,
              lon: bd.lon,
              tz_offset: (bd.tz_offset !== undefined && bd.tz_offset !== null && bd.tz_offset !== "") ? parseFloat(bd.tz_offset) : 5.5,
            };
          }
        }
      } catch (e) {}
    }

    if (birthDetails) {
      fetch('/api/ashtakavarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthDetails),
      })
      .then(res => res.json())
      .then(result => {
        const newAvBala = {};
        if (result && result.bhinna && data?.planet_positions) {
          ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].forEach(p => {
            const pos = data.planet_positions[p];
            if (pos && pos.sign) {
              const signIndex = (pos.sign - 1) % 12;
              newAvBala[p] = result.bhinna[p]?.[signIndex] || 0;
            }
          });
        }
        setAvBala(newAvBala);
      })
      .catch(err => console.error("Error fetching ashtakavarga:", err));
    }
  }, [data]);

  const assessment = data?.vimsopaka_assessment || {};
  const vaiseshikamsa = assessment.vaiseshikamsa || {};
  
  // Try to grab data from existing structures, fallback to {}
  const vimsopakaDasa = assessment.vimsopaka_bala?.dasavarga || {};
  
  const shadbalaPercent = {};
  const ishtaPhala = {};
  const panchaVargeeya = {}; 
  const dwadasaVargeeya = {}; 
  const harshaBala = {};
  const ashtakavargaD1 = avBala; 

  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  
  planets.forEach(p => {
    shadbalaPercent[p] = data?.strength?.planets?.[p]?.ratio_data?.percent || 0;
    ishtaPhala[p] = data?.strength?.planets?.[p]?.ishta_phala || 0;
    harshaBala[p] = data?.strength?.planets?.[p]?.harsha_bala || 0;
    panchaVargeeya[p] = assessment.panchavargeeya_bala?.[p] || 0;
    dwadasaVargeeya[p] = assessment.dwadasavargeeya_bala?.[p] || 0;
  });

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
      <div className="w-[30%] lg:w-[40%] xl:w-[35%] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 border-r border-gray-200">
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
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar p-1">
        <VaiseshikamsaGraph data={vimsopakaDasa} title="Vimsopaka Bala (Dasa)" maxVal={20} />
        <VaiseshikamsaGraph data={shadbalaPercent} title="Shadbala (% strength)" maxVal={200} />
        <VaiseshikamsaGraph data={ishtaPhala} title="Ishta Phala" maxVal={200} />
        <VaiseshikamsaGraph data={panchaVargeeya} title="Pancha Vargeeya Bala" maxVal={20} />
        <VaiseshikamsaGraph data={dwadasaVargeeya} title="Dwadasa Vargeeya Bala" maxVal={20} />
        <VaiseshikamsaGraph data={harshaBala} title="Harsha Bala" maxVal={20} />
        <VaiseshikamsaGraph data={vaiseshikamsa.dasavarga} title="Vaiseshikamsa (Dasa)" maxVal={10} />
        <VaiseshikamsaGraph data={ashtakavargaD1} title="Ashtakavarga Bala (D-1)" maxVal={8} />
      </div>
    </div>
  );
};

export default Vaiseshikamsa2Assessment;
