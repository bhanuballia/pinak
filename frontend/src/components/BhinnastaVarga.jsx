import React, { useState, useEffect } from 'react';
import AshtakavargaChart from './AshtakavargaChart';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Ascendant"];
const SOURCES = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Ascendant"];

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

export default function BhinnastaVarga({ data }) {
  const [avData, setAvData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let birthDetails = null;
    if (data && data.basic_details) {
      const bd = data.basic_details;
      birthDetails = {
        date: bd.birth_date,
        time: bd.birth_time,
        lat: bd.lat,
        lon: bd.lon,
        tz_offset: bd.tz_offset || 0,
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
              tz_offset: bd.tz_offset || 0,
            };
          }
        }
      } catch (e) {}
    }

    if (!birthDetails) return;

    const fetchAshtakavarga = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ashtakavarga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(birthDetails),
        });
        if (res.ok) {
          const result = await res.json();
          setAvData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAshtakavarga();
  }, [data]);

  if (loading || !avData) return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Calculating Bhinnashtakavarga...</div>;

  const getSignIndex = (planet) => {
    if (planet === "Ascendant") {
      return data?.chart?.ascendant_sign_index || 0;
    }
    const lon = data?.chart?.planet_positions?.[planet]?.sidereal?.lon;
    if (typeof lon === 'number') {
      return Math.floor(lon / 30);
    }
    return 0;
  };

  const getPlanetNameDisplay = (p) => {
    if (p === "Ascendant") return "Lagna";
    return p;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-3xl border shadow-xl font-serif">
      <h2 className="text-2xl md:text-3xl text-red-800 text-center mb-8 border-b-2 border-red-800 pb-2">
        Ashtakavarga System - Bhinnashtakavarga
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
        {PLANETS.map((planet) => {
          const breakdown = avData.bhinna_breakdown?.[planet];
          if (!breakdown) return null;

          const planetSignIndex = getSignIndex(planet);
          
          // Columns array of sign indices starting from planet's sign
          const signIndices = [];
          for (let i = 0; i < 12; i++) {
            signIndices.push((planetSignIndex + i) % 12);
          }

          // Compute column totals
          const colTotals = signIndices.map(si => {
            let sum = 0;
            SOURCES.forEach(src => {
              sum += breakdown[si]?.[src] || 0;
            });
            return sum;
          });

          // Compute row totals
          const rowTotals = {};
          SOURCES.forEach(src => {
            let sum = 0;
            for (let i = 0; i < 12; i++) {
              sum += breakdown[i]?.[src] || 0;
            }
            rowTotals[src] = sum;
          });

          const grandTotal = Object.values(rowTotals).reduce((a, b) => a + b, 0);

          // Data for chart
          const housesData = avData.house_analytics.map(ha => ({
            house: ha.house,
            signIndex: ha.sign_index,
            points: avData.bhinna[planet]?.[ha.sign_index] || 0
          }));

          return (
            <div key={planet} className="flex flex-col xl:flex-row gap-6 items-start">
              
              {/* Table */}
              <div className="w-full xl:w-1/2">
                <h3 className="text-center font-bold text-lg mb-2" style={{ color: PLANET_COLORS[planet] }}>
                  {getPlanetNameDisplay(planet)}
                </h3>
                <div className="border-2 border-black overflow-x-auto">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <td className="font-bold border-r-2 border-black text-left p-1 leading-tight">
                          {getPlanetNameDisplay(planet)}<br/>Sign
                        </td>
                        {signIndices.map(si => (
                          <td key={si} className="p-1">{si + 1}</td>
                        ))}
                        <td className="border-l-2 border-black"></td>
                      </tr>
                    </thead>
                    <tbody>
                      {SOURCES.map(src => (
                        <tr key={src}>
                          <td className="border-r-2 border-black text-left p-1" style={{ color: PLANET_COLORS[src] }}>
                            {getPlanetNameDisplay(src)}
                          </td>
                          {signIndices.map(si => (
                            <td key={si} className="p-1">{breakdown[si]?.[src] || 0}</td>
                          ))}
                          <td className="border-l-2 border-black p-1">{rowTotals[src]}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black font-bold">
                        <td className="border-r-2 border-black text-left p-1">Totals</td>
                        {colTotals.map((tot, idx) => (
                          <td key={idx} className="p-1">{tot}</td>
                        ))}
                        <td className="border-l-2 border-black p-1">{grandTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center">
                <h3 className="text-center font-bold text-lg mb-2" style={{ color: PLANET_COLORS[planet] }}>
                  {getPlanetNameDisplay(planet)}
                </h3>
                <div className="border-2 border-blue-800 p-2 mx-auto">
                  <AshtakavargaChart 
                    title="" 
                    housesData={housesData} 
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
