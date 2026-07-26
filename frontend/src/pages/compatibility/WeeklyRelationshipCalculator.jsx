import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Heart } from 'lucide-react';
import PlaceAutocomplete from '../../components/PlaceAutocomplete';
import { fetchWeeklyRelationshipHoroscope } from '../../services/api';

const WeeklyRelationshipCalculator = ({ onBack }) => {
  const [calculationMode, setCalculationMode] = useState('astrology'); // 'astrology' | 'numerology'

  // Partner A Form State
  const [nameA, setNameA] = useState('');
  const [dateA, setDateA] = useState('');
  const [timeA, setTimeA] = useState('');
  const [latLonA, setLatLonA] = useState(null);
  const [tzOffsetA, setTzOffsetA] = useState(5.5);

  // Partner B Form State
  const [nameB, setNameB] = useState('');
  const [dateB, setDateB] = useState('');
  const [timeB, setTimeB] = useState('');
  const [latLonB, setLatLonB] = useState(null);
  const [tzOffsetB, setTzOffsetB] = useState(5.5);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onPlaceSelectedA = (place) => {
    setLatLonA(place);
    if (typeof place?.tz_offset_hours === 'number') {
      setTzOffsetA(place.tz_offset_hours);
    }
  };

  const onPlaceSelectedB = (place) => {
    setLatLonB(place);
    if (typeof place?.tz_offset_hours === 'number') {
      setTzOffsetB(place.tz_offset_hours);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    if (calculationMode === 'astrology') {
      if (!dateA || !timeA || !latLonA || !dateB || !timeB || !latLonB) {
        setError('Please fill in all birth details and select locations for both partners.');
        return;
      }
    } else {
      if (!nameA || !dateA || !nameB || !dateB) {
        setError('Please fill in Name and Date of Birth for both partners.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    const payload = {
      mode: calculationMode,
      partner_a: {
        name: nameA || 'Partner A',
        date: dateA,
        time: timeA || '12:00',
        lat: latLonA ? latLonA.lat : 28.6139,
        lon: latLonA ? latLonA.lon : 77.2090,
        tz_offset: tzOffsetA
      },
      partner_b: {
        name: nameB || 'Partner B',
        date: dateB,
        time: timeB || '12:00',
        lat: latLonB ? latLonB.lat : 28.6139,
        lon: latLonB ? latLonB.lon : 77.2090,
        tz_offset: tzOffsetB
      },
      start_date: new Date().toISOString().split('T')[0]
    };

    try {
      const data = await fetchWeeklyRelationshipHoroscope(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to calculate weekly relationship horoscope.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setNameA('');
    setDateA('');
    setTimeA('');
    setLatLonA(null);
    setNameB('');
    setDateB('');
    setTimeB('');
    setLatLonB(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-500">
          Weekly Relationship Horoscope
        </h2>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-xl space-y-6">
          <p className=" text-[18px] text-emerald-300 text-center mb-6">Choose calculation method and enter details to generate a 7-day relationship harmony & passion forecast.</p>

          {/* Mode Selector Toggle */}
          <div className="flex justify-center space-x-4 pb-4 border-b border-slate-700/30">
            <button
              type="button"
              onClick={() => {
                setCalculationMode('astrology');
                setError(null);
              }}
              className={`px-6 py-2 rounded-full font-bold transition-all text-[20px] ${calculationMode === 'astrology'
                ? 'bg-rose-500  text-white hover:text-orange-200'
                : 'bg-slate-900  text-orange-400 hover:text-orange-200'
                }`}
            >
              Vedic Astrology (Full Details)
            </button>
            <button
              type="button"
              onClick={() => {
                setCalculationMode('numerology');
                setError(null);
              }}
              className={`px-6 py-2 rounded-full font-bold transition-all text-[20px] ${calculationMode === 'numerology'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-900  text-orange-400 hover:text-orange-200'
                }`}
            >
              Numerology (Name & DOB Only)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partner A */}
            <div className="space-y-4 border-r border-slate-700/30 pr-0 md:pr-8">
              <h3 className="text-lg font-bold text-rose-400">Partner A</h3>

              <div className="space-y-1">
                <label className="text-[18px] font-semibold text-yellow-400">Full Name</label>
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-all text-sm"
                  placeholder="e.g. Partner A"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[18px] font-semibold text-yellow-400">Date of Birth</label>
                  <input
                    type="date"
                    value={dateA}
                    onChange={(e) => setDateA(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {calculationMode === 'astrology' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[18px] font-semibold text-yellow-400">Time of Birth</label>
                    <input
                      type="time"
                      value={timeA}
                      onChange={(e) => setTimeA(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[18px] font-semibold text-yellow-400">Place of Birth</label>
                    <PlaceAutocomplete
                      value={latLonA?.display_name || ''}
                      onSelect={onPlaceSelectedA}
                      inputClassName="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-all text-sm mt-1"
                      dropdownClassName="absolute z-50 bg-slate-900 border border-slate-700 rounded-xl w-full mt-1 max-h-60 overflow-auto shadow-2xl text-slate-200"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Partner B */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-pink-400">Partner B</h3>

              <div className="space-y-1">
                <label className="text-[18px] font-semibold text-yellow-400">Full Name</label>
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                  placeholder="e.g. Partner B"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[18px] font-semibold text-yellow-400">Date of Birth</label>
                  <input
                    type="date"
                    value={dateB}
                    onChange={(e) => setDateB(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {calculationMode === 'astrology' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[18px] font-semibold text-yellow-400">Time of Birth</label>
                    <input
                      type="time"
                      value={timeB}
                      onChange={(e) => setTimeB(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[18px] font-semibold text-yellow-400">Place of Birth</label>
                    <PlaceAutocomplete
                      value={latLonB?.display_name || ''}
                      onSelect={onPlaceSelectedB}
                      inputClassName="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all text-sm mt-1"
                      dropdownClassName="absolute z-50 bg-slate-900 border border-slate-700 rounded-xl w-full mt-1 max-h-60 overflow-auto shadow-2xl text-slate-200"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Calculating...' : <>Calculate Weekly Horoscope <Heart className="w-5 h-5 fill-current" /></>}
          </button>
        </form>
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto space-y-8">

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Relationship Compatibility & Cycle Forecast</h3>
            <p className="text-slate-400">
              Analysis for <strong className="text-rose-400">{result.partner_a_name}</strong> ({result.partner_a_sign}) &{' '}
              <strong className="text-pink-400">{result.partner_b_name}</strong> ({result.partner_b_sign})
            </p>
          </div>

          <div className="p-6 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-2 text-center">
            <div className="text-lg font-bold text-rose-300">
              Baseline Compatibility: {result.baseline_compatibility_score}%
            </div>
            <p className="text-[20px] text-orange-400">{result.baseline_message}</p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[22px] font-semibold text-white border-b border-slate-700/40 pb-2">Upcoming 7-Day Forecast</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.weekly_data.map((day, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[20px] text-yellow-400">{day.day_name} ({day.date_string})</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-rose-950/30 border border-rose-900/30 p-2 rounded-lg">
                      <span className="block text-[18px] text-orange-400 font-medium">Harmony</span>
                      <span className="text-sm font-bold text-[22px] text-rose-400">{day.harmony_score}%</span>
                    </div>
                    <div className="bg-pink-950/30 border border-pink-900/30 p-2 rounded-lg">
                      <span className="block text-[18px] text-orange-400 font-medium">Passion</span>
                      <span className="text-sm font-bold text-[22px] text-pink-400">{day.passion_score}%</span>
                    </div>
                    <div className="bg-blue-950/30 border border-blue-900/30 p-2 rounded-lg">
                      <span className="block text-[18px] text-orange-400 font-medium">Talks</span>
                      <span className="text-sm font-bold text-[22px] text-blue-400">{day.communication_score}%</span>
                    </div>
                  </div>

                  <p className="text-[20px] text-emerald-300 italic leading-relaxed">{day.advice}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={reset}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-[20px] text-orange-400 font-bold py-2.5 px-6 rounded-xl shadow transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Calculate Another Match</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyRelationshipCalculator;
