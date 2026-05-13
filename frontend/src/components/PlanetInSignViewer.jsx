import React, { useState } from 'react';
import { PLANET_IN_SIGN_EFFECTS } from '../data/planetInSign';

export default function PlanetInSignViewer({ planet = "Moon" }) {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [selectedHouse, setSelectedHouse] = useState('1');
  
  const planetData = PLANET_IN_SIGN_EFFECTS[planet];

  if (!planetData) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center text-gray-500 italic">
        Data not available for {planet}
      </div>
    );
  }

  const availableSigns = Object.keys(planetData.signs || {});
  const signData = planetData.signs?.[selectedSign] || {
    effect: "Interpretation not available for this sign yet.",
    remedies: []
  };

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border-b border-orange-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-orange-800 flex items-center gap-2">
            <span>{planetData.englishName}</span>
            <span className="text-sm font-medium px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full">
              {planetData.hindiName}
            </span>
          </h2>
          {planetData.description && (
            <p className="text-sm text-orange-600 mt-1">{planetData.description}</p>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Sign Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Sign</label>
          <div className="flex flex-wrap gap-2">
            {signs.map((sign) => {
              const isAvailable = availableSigns.includes(sign);
              return (
                <button
                  key={sign}
                  onClick={() => isAvailable && setSelectedSign(sign)}
                  disabled={!isAvailable}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${
                    selectedSign === sign
                      ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                      : isAvailable
                      ? 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                  title={!isAvailable ? 'Data not available yet' : ''}
                >
                  {sign}
                </button>
              );
            })}
          </div>
        </div>

        {/* House Selection (if houses exist) */}
        {signData.houses && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select House Position</label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((house) => (
                <button
                  key={house}
                  onClick={() => setSelectedHouse(house)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full transition-colors border ${
                    selectedHouse === house
                      ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'
                  }`}
                >
                  {house}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="bg-orange-50 rounded-lg p-5 border border-orange-100 mb-6">
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-700 bg-white p-4 rounded border border-orange-100">
            <div><span className="font-semibold text-orange-800">Exaltation Sign:</span> {planetData.exaltationSign || "N/A"}</div>
            <div><span className="font-semibold text-orange-800">Debilitation Sign:</span> {planetData.debilitationSign || "N/A"}</div>
            <div><span className="font-semibold text-orange-800">Own Sign:</span> {planetData.ownSign || "N/A"}</div>
            <div><span className="font-semibold text-orange-800">Friendly Signs:</span> {planetData.friendlySigns?.join(', ') || "N/A"}</div>
            <div className="col-span-2"><span className="font-semibold text-orange-800">Enemy Signs:</span> {planetData.enemySigns?.join(', ') || "N/A"}</div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">When Well Placed</h4>
              <p className="text-sm text-gray-700">{planetData.wellPlacedEffect || "Information not available."}</p>
            </div>
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">When Afflicted</h4>
              <p className="text-sm text-gray-700">{planetData.afflictedEffect || "Information not available."}</p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-orange-900 mb-4 border-b border-orange-200 pb-2">
            {planetData.englishName} in {selectedSign}
          </h3>
          
          <div className="prose prose-sm max-w-none text-gray-700">
            {signData.effect?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {signData.combustEffect && (
            <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">When Combust in {selectedSign}</h4>
              <div className="text-sm text-gray-700 space-y-2">
                {signData.combustEffect.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* House Interpretation Display */}
          {signData.houses && signData.houses[selectedHouse] && (
            <div className="mt-6 bg-white p-5 rounded-lg border border-orange-200 shadow-sm">
              <h4 className="font-semibold text-orange-900 mb-3 text-lg border-b border-orange-100 pb-2">
                {planetData.englishName} in {selectedSign} in {selectedHouse}{selectedHouse === '1' ? 'st' : selectedHouse === '2' ? 'nd' : selectedHouse === '3' ? 'rd' : 'th'} House
              </h4>
              <div className="text-sm text-gray-700 space-y-3">
                {signData.houses[selectedHouse].split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {signData.remedies && signData.remedies.length > 0 && (
            <div className="mt-6 pt-4 border-t border-orange-200">
              <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                Suggested Remedies
              </h4>
              <ul className="space-y-2">
                {signData.remedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded border border-orange-100">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
