import React from 'react';
import ZodiacChart from "./ZodiacChart";
import AshtakavargaViewer from "./AshtakavargaViewer";

const TransitKeyInfo = ({ data }) => {
  // Try to safely extract details from the API data
  const dateStr = data?.date || 'September 29, 2026';
  const timeStr = data?.time || '11:08:40';
  const tzStr = data?.tz_offset ? `${data.tz_offset}:00:00 (East of GMT)` : '5:30:00 (East of GMT)';
  const placeStr = data?.place || '77 E 13\' 00", 28 N 37\' 00"\nDelhi Paharganj, India';

  const extractName = (field, defaultVal) => {
    if (!field) return defaultVal;
    if (typeof field === 'string') return field;
    if (field.tithi_name) return `${field.tithi_name} (${(field.tithi_fraction || 0).toFixed(2)}% left)`;
    if (field.nakshatra_name) return `${field.nakshatra_name} (${(field.nakshatra_fraction || 0).toFixed(2)}% left)`;
    if (field.yoga_name) return `${field.yoga_name} (${(field.yoga_fraction || 0).toFixed(2)}% left)`;
    if (field.karana_name) return `${field.karana_name}`;
    if (field.name) return field.name;
    return JSON.stringify(field);
  };

  const lunarYrMo = data?.panchang?.lunar_month ? `Parabhava - ${data.panchang.lunar_month}` : 'Parabhava - Bhadrapada';
  const tithi = extractName(data?.panchang?.tithi, 'Krishna Tritiya (Ma) [Nitya Klinna] (27.64% left)');
  const weekday = extractName(data?.panchang?.weekday, 'Tuesday (Ma)');
  const nakshatra = extractName(data?.panchang?.nakshatra, 'Bharani (Ve) (90.67% left)');
  const yoga = extractName(data?.panchang?.yoga, 'Harshana (Su) (76.46% left)');
  const karana = extractName(data?.panchang?.karana, 'Vishti (Sa) (55.27% left)');

  const horaLord = data?.panchang?.hora_lord || 'Moon (5 min sign: Ge)';
  const mahakalaHora = data?.panchang?.mahakala_hora || 'Moon (5 min sign: Ta)';
  const kaalaLord = data?.panchang?.kaala_lord || 'Venus (Mahakala: Venus)';
  const gouriPanchanga = data?.panchang?.gouri || 'Laabha (Choghadiya)';

  const sunrise = data?.panchang?.sunrise || '6:16:46';
  const sunset = data?.panchang?.sunset || '18:05:54';
  const janmaGhatis = data?.panchang?.janma_ghatis || '12.1627';

  const ayanamsa = data?.ayanamsha || '24-12-52.67';
  const sidTime = data?.sidereal_time || '11:19:33';
  const karakaTithi = data?.panchang?.karaka_tithi || 'Pournimasya (Sa) [Chitra] (71.08% left)';
  const karakaYoga = data?.panchang?.karaka_yoga || 'Sobhana (Su) (60.09% left)';

  const infoRows = [
    { label: 'Date:', value: dateStr },
    { label: 'Time:', value: timeStr },
    { label: 'Time Zone:', value: tzStr },
    { label: 'Place:', value: placeStr },
    { spacer: true },
    { label: 'Lunar Yr-Mo:', value: lunarYrMo },
    { label: 'Tithi:', value: tithi },
    { label: 'Vedic Weekday:', value: weekday },
    { label: 'Nakshatra:', value: nakshatra },
    { label: 'Yoga:', value: yoga },
    { label: 'Karana:', value: karana },
    { label: 'Hora Lord:', value: horaLord },
    { label: 'Mahakala Hora:', value: mahakalaHora },
    { label: 'Kaala Lord:', value: kaalaLord },
    { label: 'Gouri Panchanga:', value: gouriPanchanga },
    { spacer: true },
    { label: 'Sunrise:', value: sunrise },
    { label: 'Sunset:', value: sunset },
    { label: 'Janma Ghatis:', value: janmaGhatis },
    { spacer: true },
    { label: 'Ayanamsa:', value: ayanamsa },
    { label: 'Sid Time:', value: sidTime },
    { label: 'Karaka Tithi:', value: karakaTithi },
    { label: 'Karaka Yoga:', value: karakaYoga },
  ];

  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts },
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  return (
    <div className="w-full h-full bg-rose-50 flex overflow-hidden font-sans">

      {/* LEFT PANEL - 6 Charts */}
      <div className="w-[35%] h-full border-r-2 border-gray-400 p-1 flex flex-col bg-rose-50 overflow-hidden">
        <div className="grid grid-cols-2 gap-1 h-full">
          {vargasList.map((chart) => (
            <div key={chart.id} className="relative w-full h-full bg-[#f8f5ee] border border-gray-400 p-0.5 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center px-1 mb-1 border-b border-gray-300 shrink-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">Transit Chart</span>
                <span className="text-[10px] sm:text-[12px] font-black text-black">{chart.label}</span>
              </div>
              <div className="flex-1 relative w-full h-full min-h-0">
                {chart.data ? (
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <div className="w-full h-full aspect-square relative">
                      <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166%] h-[166%]">
                        <ZodiacChart
                          planetPositions={chart.data.planet_positions}
                          houses={chart.data.houses}
                          variant="legacy"
                          defaultRect={true}
                          scaleText={2.9}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Data
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE PANEL - Key Info */}
      <div className="w-[25%] h-full bg-[#f8f5ee] flex flex-col relative border-r-2 border-gray-400 overflow-hidden">
        <div className="flex-1 p-2 overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {infoRows.map((row, idx) => {
                if (row.spacer) {
                  return <tr key={idx}><td colSpan="2" className="py-1"></td></tr>;
                }
                return (
                  <tr key={idx}>
                    <td className="align-top py-0.5 text-[#008080] font-semibold text-[10px] sm:text-[11px] whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="align-top py-0.5 text-[#b30000] text-[10px] sm:text-[11px] font-medium whitespace-pre-wrap pl-1">
                      {row.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANEL - Ashtakavarga */}
      <div className="w-[45%] h-full bg-[#f8f5ee] flex flex-col p-2 overflow-hidden">
        <div className="mb-1 text-[#b30000] font-serif shrink-0">
          <h2 className="text-sm sm:text-base font-normal mb-0.5">D-1 of the Transit Chart</h2>
          <p className="text-[10px] sm:text-[11px] leading-tight">Bhinna ashtakavarga (BAV) - with reference to Scorpio.<br />Positions in D-1 are highlighted.</p>
        </div>

        <div className="flex-1 border border-gray-300 p-1 bg-[#f8f5ee] overflow-hidden min-h-0 relative">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <AshtakavargaViewer data={data} initialMode="charts" hideTabs={true} scaleText={2.10} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransitKeyInfo;
