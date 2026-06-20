import React, { useState } from 'react';

// ─── Planet Meta ──────────────────────────────────────────────────────────────
const PLANET_META = {
  Sun:     { years: 6,  color: '#f97316', bg: 'bg-orange-50',  border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', symbol: '☀️' },
  Moon:    { years: 10, color: '#6366f1', bg: 'bg-indigo-50',  border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', symbol: '🌙' },
  Mars:    { years: 7,  color: '#ef4444', bg: 'bg-red-50',     border: 'border-red-200',    badge: 'bg-red-100 text-red-700',      symbol: '🔴' },
  Rahu:    { years: 18, color: '#0ea5e9', bg: 'bg-sky-50',     border: 'border-sky-200',    badge: 'bg-sky-100 text-sky-700',      symbol: '🌑' },
  Jupiter: { years: 16, color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  symbol: '🟡' },
  Saturn:  { years: 19, color: '#64748b', bg: 'bg-slate-50',   border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-700',  symbol: '⏳' },
  Mercury: { years: 17, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700', symbol: '🟢' },
  Ketu:    { years: 7,  color: '#8b5cf6', bg: 'bg-purple-50',  border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', symbol: '💥' },
  Venus:   { years: 20, color: '#ec4899', bg: 'bg-pink-50',    border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700',    symbol: '💖' },
};

// ─── Mahadasha Classical Interpretations ─────────────────────────────────────
const MAHADASHA_EFFECTS = {
  Sun: {
    favorable: "If the Sun is strong and favourably placed, one gains authority, power, and recognition from government or superiors. Health and vitality are excellent. Success in career, leadership roles, and status elevation are indicated. The native may receive honours, name, and fame. Spiritual inclination increases. Gains from father and government favour are likely.",
    unfavorable: "If the Sun is weak or afflicted, there may be disputes with authority figures, government, or father. Health issues related to the heart, eyes, and bones may arise. Loss of status, demotion, or humiliation is possible. Excessive ego and arrogance may damage relationships. Separation or problems with the father are indicated.",
  },
  Moon: {
    favorable: "If the Moon is strong and favourably placed, one may have a cheerful heart, a happy and vigorous mind, facial lustre increases, enjoys subtle pleasures and comforts, obtains a good job or rise in status, gains money and favours and pays homage to gods.",
    unfavorable: "If the Moon is weak and afflicted one suffers from ill-health, lethargy and indolence, loss of job or demotion, loss from or quarrel with women and mother may fall ill or die.",
  },
  Mars: {
    favorable: "If Mars is strong and favourably placed, one gains energy, ambition, and courage. Success in competitive fields, sports, surgery, and real estate is indicated. Gains of land and property, rise in career, and authority over others come easily. Health and physical strength are at their peak.",
    unfavorable: "If Mars is weak or afflicted, there may be accidents, injuries, surgeries, and conflicts. Disputes over property, legal battles, and aggression in relationships are likely. Health issues related to blood, muscles, and inflammatory conditions may arise. Recklessness and impulsive decisions should be avoided.",
  },
  Rahu: {
    favorable: "If Rahu is favourably placed, this period brings material prosperity, foreign connections, and unconventional success. Rise in status through non-traditional means, interest in technology, travel, and new horizons. Sudden gains and unexpected opportunities from foreign lands or unusual sources are possible.",
    unfavorable: "If Rahu is afflicted, this period brings confusion, deception, obsession, and unexpected upheavals. Health issues related to nervous system, skin, and strange ailments. Loss through deceit, involvement in controversies, and mental restlessness are possible. Relationships may suffer due to secretive behaviour.",
  },
  Jupiter: {
    favorable: "If Jupiter is strong and favourably placed, this is one of the most auspicious dashas. Wisdom, knowledge, higher education, and spiritual growth flourish. Gains from children, teachers, and religious activities. Success in law, education, counselling, and philosophy. Good health, optimism, and financial expansion are indicated.",
    unfavorable: "If Jupiter is weak or afflicted, there may be financial losses, poor judgment, and overindulgence. Problems with children, teachers, and religious matters. Health issues related to liver, gallbladder, and diabetes. Excessive pride, over-optimism, and legal troubles may arise.",
  },
  Saturn: {
    favorable: "If Saturn is strong and favourably placed, this period rewards consistent hard work with slow but steady success. Gains in career through discipline and perseverance. Success in fields like mining, real estate, agriculture, and services. Spiritual maturity and detachment grow. Long-term investments pay off.",
    unfavorable: "If Saturn is weak or afflicted, this is a period of hardship, delays, obstacles, and chronic illness. Health issues related to bones, joints, teeth, and nervous system may arise. Separation from loved ones, depression, and feelings of isolation are common. Karmic debts from the past are repaid.",
  },
  Mercury: {
    favorable: "If Mercury is strong and favourably placed, intellect, communication, and analytical abilities shine. Success in business, writing, journalism, trading, and technology. Good memory, quick learning, and multiple sources of income. Relationships with siblings improve. Short journeys and networking bring gains.",
    unfavorable: "If Mercury is weak or afflicted, there may be communication problems, misunderstandings, and business losses. Mental stress, nervous disorders, and skin ailments are possible. Disputes with relatives and neighbours, cheating in business, and indecisiveness may arise.",
  },
  Ketu: {
    favorable: "If Ketu is favourably placed, this period brings spiritual awakening, intuition, and liberation from material attachments. Success in occult, metaphysics, meditation, and healing arts. Past karma resolves, and sudden spiritual insights occur. Research, investigation, and isolation lead to inner growth.",
    unfavorable: "If Ketu is afflicted, there may be sudden losses, separations, and inexplicable health issues. Mental confusion, lack of direction, and feelings of purposelessness arise. Accidents, injuries, and surgeries are possible. Relationships may suffer due to withdrawal and detachment.",
  },
  Venus: {
    favorable: "If Venus is strong and favourably placed, this is the most pleasurable and prosperous dasha. Gains in wealth, luxury, arts, and relationships. Marriage or romantic fulfilment is indicated. Success in entertainment, fashion, hospitality, and creative fields. Beauty, social charm, and comfort increase manifold.",
    unfavorable: "If Venus is weak or afflicted, there may be relationship problems, financial mismanagement, and overindulgence in pleasures. Health issues related to reproductive system, kidneys, and skin. Disputes with spouse or partner, excessive spending, and moral dilemmas are likely.",
  },
};

// ─── Compute age from birth date and dasha date ────────────────────────────
function computeAge(birthDateStr, dashaDateStr) {
  if (!birthDateStr || !dashaDateStr) return null;
  try {
    // Parse birth date (formats: YYYY-MM-DD or DD/MM/YYYY)
    let birthY, birthM, birthD;
    if (birthDateStr.includes('/')) {
      [birthD, birthM, birthY] = birthDateStr.split('/').map(Number);
    } else {
      [birthY, birthM, birthD] = birthDateStr.split('-').map(Number);
    }
    // Parse dasha date (formats: DD/MM/YYYY or YYYY-MM-DD)
    let y, m, d;
    if (dashaDateStr.includes('/')) {
      [d, m, y] = dashaDateStr.split('/').map(Number);
    } else if (dashaDateStr.length === 10 && dashaDateStr.includes('-')) {
      [y, m, d] = dashaDateStr.split('-').map(Number);
    } else {
      return null;
    }
    let age = y - birthY;
    if (m < birthM || (m === birthM && d < birthD)) age--;
    return age < 0 ? 0 : age;
  } catch { return null; }
}

// ─── Format JD date to DD-Mon, YYYY ─────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  // Try to handle DD/MM/YYYY or YYYY-MM-DD
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return `${parseInt(d)}-${MONTHS[parseInt(m)-1]}, ${y}`;
  }
  if (dateStr.includes('-') && dateStr.length === 10) {
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(d)}-${MONTHS[parseInt(m)-1]}, ${y}`;
  }
  return dateStr;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VimshottariLifeTable({ data }) {
  const [expanded, setExpanded] = useState(null);

  const list = data?.dasha?.list || [];
  const planetStrengths = data?.strength?.planets || {};

  // Extract birth date from worksheet data
  const basic = data?.basic_details || {};
  const meta  = data?.meta || {};
  const birthDateStr = basic.birth_date || meta.date || null;

  if (!list.length) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 italic font-serif">
        जन्म कुण्डली डेटा उपलब्ध नहीं है। कृपया होरोस्कोप जनरेट करें।
      </div>
    );
  }

  const toggleRow = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div className="bg-white font-serif">
      {/* Section Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-black font-black text-sm">⏳</div>
        <div>
          <h2 className="text-white text-sm font-black uppercase tracking-widest leading-none">Vimshottari Dasha</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-wider mt-0.5">Life Timeline — All 9 Mahadashas</p>
        </div>
        <div className="ml-auto text-[9px] text-slate-400 font-sans">120 Year Cycle</div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[2fr_0.5fr_0.5fr_0.5fr_1.1fr_1.1fr] border-b-2 border-slate-800 bg-slate-100">
        <div className="px-4 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">Mahadasha</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">Yrs</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">From Age</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">To Age</div>
        <div className="px-3 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">Start</div>
        <div className="px-3 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">End</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {list.map((d, i) => {
          const meta = PLANET_META[d.lord] || { color: '#666', years: '?', bg: 'bg-white', border: 'border-slate-100', badge: 'bg-slate-100 text-slate-700', symbol: '⭐' };
          const effects = MAHADASHA_EFFECTS[d.lord];
          const strength = planetStrengths[d.lord];
          const isStrong = strength ? (strength.total_score >= 5.5) : null;
          const isOpen = expanded === i;
          const nextD = list[i + 1];
          const endDate = d.end_date || (nextD ? nextD.start_date : '—');
          const startAge = computeAge(birthDateStr, d.start_date);
          const endAge   = computeAge(birthDateStr, endDate);

          return (
            <div key={i} className={`transition-all ${isOpen ? meta.bg : ''}`}>
              {/* Main Row */}
              <div
                className={`grid grid-cols-[2fr_0.5fr_0.5fr_0.5fr_1.1fr_1.1fr] cursor-pointer hover:bg-slate-50 transition-colors group border-l-4`}
                style={{ borderLeftColor: isOpen ? meta.color : 'transparent' }}
                onClick={() => toggleRow(i)}
              >
                {/* Planet Name */}
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-lg leading-none">{meta.symbol}</span>
                  <div>
                    <span className="font-black text-sm text-slate-800">{d.lord}</span>
                    <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${meta.badge}`}>
                      {meta.years} yrs
                    </span>
                    {isStrong !== null && (
                      <span className={`ml-1 text-[8px] font-bold px-1 py-0.5 rounded ${isStrong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {isStrong ? '▲ Strong' : '▼ Weak'}
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-slate-300 group-hover:text-slate-500 text-[10px] transition-all">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
                {/* Years */}
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-black" style={{ color: meta.color }}>{meta.years}</span>
                </div>
                {/* Start Age */}
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {startAge !== null ? startAge : '—'}
                  </span>
                </div>
                {/* End Age */}
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {endAge !== null ? endAge : '—'}
                  </span>
                </div>
                {/* Start */}
                <div className="px-3 py-3 flex items-center">
                  <span className="text-xs font-semibold text-indigo-600">{fmtDate(d.start_date)}</span>
                </div>
                {/* End */}
                <div className="px-3 py-3 flex items-center">
                  <span className="text-xs font-semibold text-rose-600">{fmtDate(endDate)}</span>
                </div>
              </div>

              {/* Expanded Effect Panel */}
              {isOpen && effects && (
                <div className={`px-5 pb-5 pt-2 border-t ${meta.border} animate-fade-in`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: meta.color }}></div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800">
                        {d.lord} Mahadasha — {meta.years} Years
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {fmtDate(d.start_date)} → {fmtDate(endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Favorable */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-emerald-600 text-sm">✦</span>
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">If Favourable</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-relaxed">{effects.favorable}</p>
                    </div>
                    {/* Unfavorable */}
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-rose-600 text-sm">⚠</span>
                        <span className="text-[10px] font-black text-rose-800 uppercase tracking-widest">If Afflicted</span>
                      </div>
                      <p className="text-[11px] text-rose-900 leading-relaxed">{effects.unfavorable}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[8px] text-slate-400 italic text-center">
        Vimshottari Dasha · 120-Year Life Cycle · Click any row to view Mahadasha effects
      </div>
    </div>
  );
}
