import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const PLANET_COLORS = {
  Sun: "#dc2626",
  Moon: "#111827",
  Mars: "#ef4444",
  Mercury: "#16a34a",
  Jupiter: "#d97706",
  Venus: "#db2777",
  Saturn: "#2563eb",
  Rahu: "#4b5563",
  Ketu: "#92400e",
  Uranus: "#0891b2",
  Neptune: "#4f46e5",
  Pluto: "#7c3aed",
  Ascendant: "#000000",
  Lagna: "#000000"
};

const formatDeg = (deg) => {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor((((deg - d) * 60) - m) * 60);
  return `${String(d % 30).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function KrishanaMurthyChart({ formData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData) {
      fetchData();
    }
  }, [formData]);

  const fetchData = async () => {
    try {
      let pDate = '2000-01-01';
      let pTime = '12:00:00';
      let pLat = 28.6139;
      let pLon = 77.2090;
      let pTz = 5.5;
      let pName = 'Native';
      let pLoc = 'Location';

      if (formData.basic_details && formData.basic_details.birth_date) {
        pDate = formData.basic_details.birth_date;
        pTime = formData.basic_details.birth_time;
        pLat = formData.basic_details.lat;
        pLon = formData.basic_details.lon;
        pName = formData.basic_details.name || 'Native';
        pLoc = formData.basic_details.birth_place || pLoc;
      } else if (formData.meta) {
        pDate = formData.meta.date || formData.meta.birth_date || pDate;
        pTime = formData.meta.time || formData.meta.birth_time || pTime;
        pLat = formData.meta.lat || pLat;
        pLon = formData.meta.lon || pLon;
        pTz = formData.meta.tz || pTz;
        pName = formData.meta.name || pName;
        pLoc = formData.meta.location_name || pLoc;
      }

      const payload = {
        birth_date: pDate,
        birth_time: pTime.includes(":") && pTime.split(":").length === 2 ? pTime + ":00" : pTime,
        lat: parseFloat(pLat),
        lon: parseFloat(pLon),
        tz_offset: parseFloat(pTz),
      };

      const response = await fetch('http://localhost:8000/api/kp/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        result.name = pName;
        result.dob = pDate;
        result.tob = pTime;
        result.loc = pLoc;
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Loading KP Chart...</div>;
  }

  if (!data) return null;

  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  // Prepare Cuspal Houses for ZodiacChart
  const cuspalHouses = {};
  data.cusps.forEach(c => {
    const sIndex = signs.indexOf(c.sign_name);
    const occ = data.occupants[c.house] || [];
    // Convert short names back to full names or just pass them
    // ZodiacChart can handle full names like "Sun" via PLANET_ABBREV
    const planetsInHouse = occ.map(shortName => {
        const pObj = data.planets.find(p => p.short_name === shortName);
        return pObj ? pObj.planet : shortName;
    });

    cuspalHouses[c.house] = {
        sign_index: sIndex,
        planets: planetsInHouse
    };
  });

  // Prepare Birth Chart Houses
  // Use standard D1 houses from formData.chart.houses if available
  const birthHouses = formData?.chart?.houses || {};

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 md:p-8 rounded-3xl border shadow-xl font-serif">
      <h2 className="text-2xl md:text-3xl text-red-800 text-center mb-2 pb-2 border-b-2 border-red-800 font-bold">
        Krishnamurti Paddhati
      </h2>
      <div className="text-center text-red-800 font-bold mb-6 text-sm md:text-base border-b-2 border-red-800 pb-2">
        {data.dob} • {data.tob} hrs. • {data.loc}
      </div>

      {/* Planet Table */}
      <div className="mb-8">
        <table className="w-full text-left text-[11px] md:text-sm border-b-2 border-red-800">
          <thead>
            <tr className="border-b-2 border-red-800 text-red-800">
              <th className="py-1 font-bold">Planet</th>
              <th className="py-1 font-bold text-center">R/C</th>
              <th className="py-1 font-bold">Sign</th>
              <th className="py-1 font-bold">Degree</th>
              <th className="py-1 font-bold">Nakshatra</th>
              <th className="py-1 font-bold text-center">Pada</th>
              <th className="py-1 font-bold text-center">RL</th>
              <th className="py-1 font-bold text-center">NL</th>
              <th className="py-1 font-bold text-center">SL</th>
              <th className="py-1 font-bold text-center">SS</th>
            </tr>
          </thead>
          <tbody>
            {data.planets.map((p, i) => {
              const nameDisplay = p.planet === "Ascendant" ? "Lagna" : p.planet;
              const isRetro = formData?.chart?.planet_positions?.[p.planet]?.is_retrograde ? "R" : "";
              const isComb = formData?.chart?.planet_positions?.[p.planet]?.is_combust ? "C" : "";
              const rc = [isRetro, isComb].filter(Boolean).join("/");
              
              // Find Pada from formData
              const pada = formData?.chart?.planet_positions?.[p.planet]?.nakshatra?.pada || "-";

              return (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-1 font-bold" style={{ color: PLANET_COLORS[p.planet] || "#000" }}>{nameDisplay}</td>
                  <td className="py-1 text-center font-bold text-black">{rc}</td>
                  <td className="py-1">{p.sign_name.substring(0,3)}</td>
                  <td className="py-1">{formatDeg(p.longitude)}</td>
                  <td className="py-1">{p.nak_name}</td>
                  <td className="py-1 text-center">{pada}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[p.sign_lord] }}>{p.sign_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[p.star_lord] }}>{p.star_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[p.sub_lord] }}>{p.sub_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[p.sub_sub_lord] }}>{p.sub_sub_lord.substring(0,2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Two Charts Side by Side */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center items-center">
        <div className="w-full md:w-1/2 ">
          <div className="border-2 border-red-800 p-1">
             <div className="h-[350px]">
                 <ZodiacChart houses={birthHouses} title="Birth Chart" />
             </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 ">
          <div className="border-2 border-red-800 p-1">
             <div className="h-[350px]">
                 <ZodiacChart houses={cuspalHouses} title="Cuspal Chart" />
             </div>
          </div>
        </div>
      </div>

      {/* House Table */}
      <div>
        <h3 className="text-center text-red-800 font-bold mb-2">Bhava Details (Placidus System)</h3>
        <table className="w-full text-left text-[11px] md:text-sm border-b-2 border-red-800 border-t-2">
          <thead>
            <tr className="border-b-2 border-red-800 text-red-800">
              <th className="py-1 font-bold">House cusp</th>
              <th className="py-1 font-bold">Sign</th>
              <th className="py-1 font-bold">Degree</th>
              <th className="py-1 font-bold">Nakshatra</th>
              <th className="py-1 font-bold text-center">Pada</th>
              <th className="py-1 font-bold text-center">RL</th>
              <th className="py-1 font-bold text-center">NL</th>
              <th className="py-1 font-bold text-center">SL</th>
              <th className="py-1 font-bold text-center">SS</th>
            </tr>
          </thead>
          <tbody>
            {data.cusps.map((c, i) => {
              const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];
              
              // Calculate Pada for Cusp
              const nak_deg = 360.0 / 27;
              const frac = (c.longitude % nak_deg) / nak_deg;
              const pada = Math.floor(frac * 4) + 1;

              return (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-1">{c.house}.{ordinals[c.house-1]}</td>
                  <td className="py-1">{c.sign_name.substring(0,3)}</td>
                  <td className="py-1">{formatDeg(c.longitude)}</td>
                  <td className="py-1">{c.nak_name}</td>
                  <td className="py-1 text-center">{pada}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[c.sign_lord] }}>{c.sign_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[c.star_lord] }}>{c.star_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[c.sub_lord] }}>{c.sub_lord.substring(0,2)}</td>
                  <td className="py-1 font-bold text-center" style={{ color: PLANET_COLORS[c.sub_sub_lord] }}>{c.sub_sub_lord.substring(0,2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Significance of Each House Cusp */}
      <div className="mt-8">
        <h3 className="text-center text-red-800 font-bold mb-4">Significance of Each House Cusp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-gray-800">
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">1st House Cusp (Ascendant):</span> Represents the self, physical body, personality, and overall outlook on life. It’s the lens through which the world is perceived and indicates the beginning of life, the birth itself, and the early environment.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">2nd House Cusp:</span> Governs finances, material possessions, values, and self-worth. It also relates to immediate family, speech, and the capacity to fulfill needs and desires.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">3rd House Cusp:</span> Associated with communication, siblings, short trips, and early education. It reflects one’s interactions with the community, courage, hobbies, and the capacity for initiative.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">4th House Cusp:</span> Represents home, family, roots, and emotional security. It encompasses the end of matters, real estate, and the parent, typically the mother, who provides the most nurturing.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">5th House Cusp:</span> Linked to creativity, romance, children, and leisure activities. It signifies love affairs, artistic pursuits, and the native’s capacity for joy and pleasure.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">6th House Cusp:</span> Relates to health, service, and daily routines. It covers employment, care for others, and challenges such as enemies, debts, and obstacles.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">7th House Cusp:</span> Denotes partnerships, both personal and business, and marriage. It reflects the qualities sought in partners and the nature of one’s relationships with others.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">8th House Cusp:</span> Associated with transformation, regeneration, and the mysteries of life. It governs inheritance, shared resources, and experiences that challenge one’s sense of control.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">9th House Cusp:</span> Represents higher learning, philosophy, and long-distance travel. It’s linked to one’s belief systems, spirituality, and the quest for meaning and truth.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">10th House Cusp (Midheaven):</span> Pertains to career, reputation, and public status. It symbolizes one’s aspirations, achievements, and the role one plays in the wider community.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">11th House Cusp:</span> Connected to hopes, dreams, and social circles. It reflects friendships, group activities, and the native’s capacity to realize long-term goals.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">12th House Cusp:</span> Governs the subconscious, hidden aspects, and endings. It deals with solitude, spiritual insights, and challenges that test one’s strength and resilience.
          </div>
        </div>
      </div>

      {/* Significance of Each Planet as a Significator */}
      <div className="mt-8 mb-8">
        <h3 className="text-center text-red-800 font-bold mb-4">Significance of Each Planet as a Significator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-gray-800">
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Sun:</span> Represents the soul, ego, vitality, and the father figure. As a significator, the Sun highlights areas related to authority, career, health, and one’s core identity. It sheds light on leadership qualities, ambitions, and the relationship with male figures in one’s life.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Moon:</span> Symbolizes the mind, emotions, and the mother figure. The Moon as a significator points to emotional well-being, mental states, domestic life, and one’s intuitive faculties. It also indicates fluctuations in mood and relationships with female figures.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Mars:</span> Governs energy, courage, and siblings, particularly brothers. Mars signifies one’s assertiveness, physical strength, and capacity to confront challenges. It also relates to property matters, engineering, and surgical fields.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Mercury:</span> Represents communication, intellect, and commerce. As a significator, Mercury influences areas related to education, writing, business, and analytical skills. It governs logical reasoning and the way one interacts with the world through language.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Jupiter:</span> The planet of wisdom, expansion, and prosperity. Jupiter’s role as a significator encompasses growth, spirituality, higher learning, and fortune. It also influences marriage, children, and legal matters, offering insights into ethical and philosophical inclinations.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Venus:</span> Symbolizes love, beauty, and relationships. As a significator, Venus sheds light on romantic endeavors, artistic pursuits, and material comforts. It also governs marriage, luxury, and one’s appreciation for the finer things in life.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Saturn:</span> Represents discipline, structure, and karmic lessons. Saturn as a significator points to areas requiring perseverance, responsibility, and maturity. It highlights challenges, longevity, and the lessons learned through hardship.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Rahu:</span> The North Node of the Moon, associated with desire, ambition, and unconventional paths. Rahu signifies areas of obsession, foreign connections, and sudden changes. It also indicates areas where one may experience illusions or significant growth through unconventional means.
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <span className="font-bold text-red-900">Ketu:</span> The South Node of the Moon, representing spirituality, detachment, and past life karma. Ketu’s role as a significator involves spiritual growth, areas of life where one may feel incomplete, and the potential for liberation from material ties.
          </div>
        </div>
      </div>

    </div>
  );
}
