import React from 'react';

const NavamshaAgesChart = ({ gridData }) => {
  if (!gridData) return null;

  // The 12 signs of the South Indian chart layout mapped to their absolute sign index (0-11)
  // Grid is 4x4. We use an array of 16 items. Middle 4 are empty.
  // Layout:
  // 11 (Pis) | 0 (Ari) | 1 (Tau) | 2 (Gem)
  // 10 (Aqu) | empty   | empty   | 3 (Can)
  // 9  (Cap) | empty   | empty   | 4 (Leo)
  // 8  (Sag) | 7 (Sco) | 6 (Lib) | 5 (Vir)

  const layout = [
    11, 0, 1, 2,
    10, null, null, 3,
    9, null, null, 4,
    8, 7, 6, 5
  ];

  const getPlanetColor = (planet) => {
    const colors = {
      "Su": "#cc0000",
      "Mo": "#333333",
      "Ma": "#ff0000",
      "Me": "#009900",
      "Ju": "#ff8c00",
      "Ve": "#cc00cc",
      "Sa": "#0000ff",
      "Ra": "#666666",
      "Ke": "#666666",
      "As": "#b8860b"
    };
    return colors[planet] || "#333";
  };

  const renderCell = (signIdx, i) => {
    if (signIdx === null) {
      return (
        <div key={i} className="bg-[#fdfaf6] border border-[#a2b5cd] relative">
          {i === 5 && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="text-[#a2b5cd]/30 text-4xl font-serif text-center" style={{transform: 'scale(1.5)'}}>
                {/* Decorative empty center */}
              </span>
            </div>
          )}
        </div>
      );
    }

    const signData = gridData[signIdx];
    if (!signData) return <div key={i} className="border border-[#0000aa] bg-white"></div>;

    return (
      <div key={i} className="border border-[#0000aa] bg-white flex flex-col p-0.5 text-[10px] md:text-xs">
        {signData.navamshas.map((nav, nIdx) => (
          <div key={nIdx} className="flex justify-between items-center px-1 py-[1px] hover:bg-yellow-50 border-b border-transparent hover:border-gray-200">
            {/* Left side: Nak, R#, Age */}
            <div className="flex gap-1 items-center">
              <span className="w-6 inline-block font-serif">{nav.nak_abbrev}</span>
              <span className="text-gray-600 font-serif w-4">{nav.r_num},</span>
              <span className="font-serif w-5">{nav.age}</span>
            </div>
            
            {/* Right side: Planets */}
            <div className="flex gap-1 items-center font-bold">
              {nav.planets.map((p, pIdx) => (
                <span key={pIdx} style={{ color: getPlanetColor(p.planet) }}>
                  {p.planet}{p.rc}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-[#f0e6d2] p-2 rounded shadow-lg border-2 border-[#8b4513]">
      <div className="bg-[#fffdf8] p-1 border border-[#cd853f]">
        {/* Header Title like the screenshot */}
        <div className="flex justify-between bg-white border-2 border-[#0000aa] rounded-full px-4 py-1 mb-2">
          <h2 className="text-[#0000aa] text-xl md:text-3xl font-serif">Birth Chart</h2>
        </div>
        
        {/* The Grid */}
        <div className="grid grid-cols-4 grid-rows-4 h-[600px] md:h-[800px] w-full border-2 border-[#0000aa]">
          {layout.map((signIdx, i) => renderCell(signIdx, i))}
        </div>
      </div>
    </div>
  );
};

export default NavamshaAgesChart;
