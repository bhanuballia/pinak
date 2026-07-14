import React from 'react';

// ─── Planet Meta ──────────────────────────────────────────────────────────────
const PLANET_META = {
  Sun: { years: 6, color: '#d92121' },
  Moon: { years: 10, color: '#111827' },
  Mars: { years: 7, color: '#ef4444' },
  Rahu: { years: 18, color: '#4b5563' },
  Jupiter: { years: 16, color: '#d97706' },
  Saturn: { years: 19, color: '#2563eb' },
  Mercury: { years: 17, color: '#16a34a' },
  Ketu: { years: 7, color: '#92400e' },
  Venus: { years: 20, color: '#db2777' },
};

// ─── Compute age from birth date and dasha date ────────────────────────────
function computeAge(birthDateStr, dashaDateStr) {
  if (!birthDateStr || !dashaDateStr) return null;
  try {
    let birthY, birthM, birthD;
    if (birthDateStr.includes('/')) {
      [birthD, birthM, birthY] = birthDateStr.split('/').map(Number);
    } else {
      [birthY, birthM, birthD] = birthDateStr.split('-').map(Number);
    }

    let y, m, d;
    if (dashaDateStr.includes('/')) {
      [d, m, y] = dashaDateStr.split('/').map(Number);
    } else if (dashaDateStr.length >= 10 && dashaDateStr.includes('-')) {
      [y, m, d] = dashaDateStr.split('T')[0].split('-').map(Number);
    } else {
      return null;
    }

    let ageY = y - birthY;
    let ageM = m - birthM;
    if (ageM < 0 || (ageM === 0 && d < birthD)) {
      ageY--;
      ageM += 12;
    }
    if (d < birthD) {
      ageM--;
      if (ageM < 0) {
        ageM += 12;
      }
    }
    if (ageY < 0) return '0 yrs.';
    return ageM === 0 ? `${ageY} yrs.` : `${ageY}y${ageM}m`;
  } catch { return null; }
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }
  if (dateStr.includes('-') && dateStr.length >= 10) {
    const [y, m, d] = dateStr.split('T')[0].split('-');
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }
  return dateStr;
}

export default function VimshottariGridTimeline({ data }) {
  const list = data?.dasha?.list || [];

  const basic = data?.basic_details || {};
  const meta = data?.meta || {};
  const birthDateStr = basic.birth_date || meta.date || null;

  if (!list.length) return null;

  return (
    <div className="bg-white p-6 print:p-0 print:bg-transparent font-serif">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-x-12 print:gap-x-4 gap-y-10 print:gap-y-6">
        {list.map((md, i) => {
          const metaInfo = PLANET_META[md.lord] || { color: '#000', years: '?' };
          const nextD = list[i + 1];
          const endDate = md.end_date || (nextD ? nextD.start_date : '');

          const startAge = computeAge(birthDateStr, md.start_date) || '0 yrs.';
          const endAge = computeAge(birthDateStr, endDate) || '';

          return (
            <div key={i} className="flex flex-col">
              <div className="mb-2">
                <h3 className="font-bold text-base print:text-sm" style={{ color: metaInfo.color }}>
                  <span className="text-black">{md.lord}</span> ({metaInfo.years}y)
                </h3>
                <p className="text-[13px] print:text-[11px] text-red-700 mt-1">
                  From {startAge} to {endAge}
                </p>
              </div>

              <table className="w-full text-[13px] print:text-[11px] border-collapse">
                <thead>
                  <tr className="border-t border-b border-red-600 bg-amber-100/50 print:bg-transparent">
                    <th className="text-left py-1.5 font-bold px-1 text-black">Antar</th>
                    <th className="text-left py-1.5 font-bold px-1 text-black">Beginning</th>
                    <th className="text-left py-1.5 font-bold px-1 text-black">Ending</th>
                  </tr>
                </thead>
                <tbody>
                  {(md.antardashas || []).map((ad, j) => {
                    const adMetaInfo = PLANET_META[ad.lord] || { color: '#000' };
                    const adStart = ad.start_date ? fmtDate(ad.start_date) : '';
                    const adEnd = ad.end_date ? fmtDate(ad.end_date) : '';

                    return (
                      <tr key={j} className="border-b border-gray-100 last:border-b-2 last:border-red-600 print:border-gray-200">
                        <td className="py-1 px-1" style={{ color: adMetaInfo.color }}>{ad.lord}</td>
                        <td className="py-1 px-1 text-black">{adStart}</td>
                        <td className="py-1 px-1 text-black">{adEnd}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
