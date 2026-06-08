import React from 'react';

const PLANETS = ["Sun", "Mon", "Mar", "Mer", "Jup", "Ven", "Sat", "Rah", "Ket"];
const PLANET_KEY_MAP = {
  "Sun": "Sun", "Mon": "Moon", "Mar": "Mars", "Mer": "Mercury", 
  "Jup": "Jupiter", "Ven": "Venus", "Sat": "Saturn", "Rah": "Rahu", "Ket": "Ketu"
};

const PLANET_COLORS = {
  "Sun": "#ff0000", // Red
  "Mon": "#000000", // Black
  "Mar": "#ff0000", // Red
  "Mer": "#00aa00", // Green
  "Jup": "#808000", // Olive/Gold
  "Ven": "#ff00ff", // Magenta
  "Sat": "#0000ff", // Blue
  "Rah": "#000000", // Black
  "Ket": "#000000"  // Black
};

const getRelationColor = (rel) => {
  if (rel === "Friend" || rel === "Grt. Friend") return "#00cc00"; // Bright green
  if (rel === "Enemy" || rel === "Grt. Enemy") return "#ff0000"; // Red
  if (rel === "Neutral") return "#000080"; // Navy blue
  return "#000000"; // Black for '-'
};

const formatRelationText = (rel) => {
  if (rel === "Great Friend") return "Grt. Friend";
  if (rel === "Great Enemy") return "Grt. Enemy";
  return rel;
};

export const RelationshipTable = ({ title, matrixData }) => {
  if (!matrixData) return null;

  return (
    <div className="mb-2">
      {/* Table Header */}
      <div className="border-[3px] border-[#3b82f6] rounded-[10px] bg-white mx-1 mb-1 shadow-sm px-3 py-0.5">
        <h2 className="text-[#000000] font-serif text-[18px] leading-tight m-0">{title}</h2>
      </div>
      
      {/* Table Body */}
      <div className="border-[2px] border-[#ff6b81] bg-[#ffffe6] mx-1">
        <table className="w-full font-serif border-collapse">
          <thead>
            <tr>
              <th className="w-[8%] text-left pl-3 py-1 font-normal border-b border-transparent"></th>
              {PLANETS.map(p => (
                <th key={p} className="w-[10%] text-left py-1 font-normal text-[15px]" style={{ color: PLANET_COLORS[p] }}>
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((pRow, idx) => (
              <tr key={pRow} className="leading-tight">
                <td className="pl-3 py-[2px] font-normal text-[15px]" style={{ color: PLANET_COLORS[pRow] }}>
                  {pRow}
                </td>
                {PLANETS.map(pCol => {
                  const fullRowName = PLANET_KEY_MAP[pRow];
                  const fullColName = PLANET_KEY_MAP[pCol];
                  const rawRel = matrixData[fullRowName]?.[fullColName] || "-";
                  const relText = formatRelationText(rawRel);
                  const color = getRelationColor(relText);
                  
                  return (
                    <td key={pCol} className="py-[2px] text-[15px]" style={{ color }}>
                      {relText}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PlanetaryRelationshipsViewer = ({ data }) => {
  const friendshipData = data?.friendship_matrix || data?.planetary_relationships;

  // Since we updated the backend to return 3 objects, handle both old and new formats.
  const isNewFormat = friendshipData?.compound !== undefined;
  
  const natural = isNewFormat ? friendshipData.natural : null;
  const temporary = isNewFormat ? friendshipData.temporary : null;
  const compound = isNewFormat ? friendshipData.compound : friendshipData;

  if (!compound || Object.keys(compound).length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic bg-[#ffffe6] h-full">
        Planetary relationship data is not available. Please generate a new report.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#cbd5e1] p-1 font-serif overflow-auto">
      <div className="bg-[#cbd5e1] max-w-7xl mx-auto h-full flex flex-col pt-1">
        
        {/* Natural Relationships */}
        {natural && (
          <RelationshipTable 
            title="Natural Relationships (Naisargika)" 
            matrixData={natural} 
          />
        )}

        {/* Temporary Relationships */}
        {temporary && (
          <RelationshipTable 
            title="Temporary Relationships (Tatkalika)" 
            matrixData={temporary} 
          />
        )}

        {/* Compound Relationships */}
        <RelationshipTable 
          title="Compound Relationships (Panchadha)" 
          matrixData={compound} 
        />
        
      </div>
    </div>
  );
};

export default PlanetaryRelationshipsViewer;
