const fs = require('fs');
const p = 'frontend/src/components/InteractiveWorksheet.jsx';
let content = fs.readFileSync(p, 'utf-8');

// Replace 1: Add selectedVarga state
content = content.replace(
  'const [transitPositions, setTransitPositions] = useState(null);',
  'const [transitPositions, setTransitPositions] = useState(null);\n  const [selectedVarga, setSelectedVarga] = useState(1);'
);

// Replace 2: Update TransitPanel signature and ADD EXPORT!
content = content.replace(
  'const TransitPanel = ({ data, transitPositions }) => {',
  'export const TransitPanel = ({ data, transitPositions, selectedVarga = 1 }) => {'
);
if (content.indexOf('export const TransitPanel = ({ data, transitPositions, selectedVarga = 1 }) => {') === -1) {
  console.log("FAILED TO REPLACE TRANSIT PANEL SIGNATURE");
}

// Replace 3: Update lagnaSignIndex logic in TransitPanel
content = content.replace(
  /const lagnaHouse = data\.charts\?\.houses\?\.\[1\] \|\| data\.charts\?\.houses\?\.\['1'\] \|\| \{\};\n\s*let lagnaSignIndex = lagnaHouse\.sign_index;\n\s*if \(lagnaSignIndex === undefined && lagnaHouse\.cusp_deg !== undefined\) \{\n\s*lagnaSignIndex = Math\.floor\(lagnaHouse\.cusp_deg \/ 30\);\n\s*\}\n\s*if \(lagnaSignIndex === undefined\) \{\n\s*lagnaSignIndex = data\.charts\?\.ascendant_sign_index;\n\s*\}/g,
  `const innerHouses = selectedVarga > 1 ? (data.vargas?.[\`d\${selectedVarga}\`]?.houses || data.charts?.houses) : data.charts?.houses;
  const lagnaHouse = innerHouses?.[1] || innerHouses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = selectedVarga > 1 ? data.vargas?.[\`d\${selectedVarga}\`]?.ascendant_sign_index : data.charts?.ascendant_sign_index;
  }`
);

// Replace 4: Update TransitPanel return for D-chart header
content = content.replace(
  '<ZodiacChart\n            houses={data.charts?.houses}',
  '<ZodiacChart\n            houses={innerHouses}'
);
content = content.replace(
  'Today\'s Transit (Gochar)\n      </div>',
  'Today\'s Transit (Gochar) {selectedVarga > 1 ? `[D${selectedVarga}]` : ""}\n      </div>'
);
content = content.replace(
  'title="Combined Janma & Gochar Chart"',
  'title={`Combined Janma & Gochar Chart ${selectedVarga > 1 ? `(D${selectedVarga})` : ""}`}'
);

// Replace 5: Update TransitTimeControl call in transit_compare
content = content.replace(
  '<TransitTimeControl\n                    lat={data?.basic_details?.lat || 28.6}\n                    lon={data?.basic_details?.lon || 77.2}',
  '<TransitTimeControl\n                    lat={data?.basic_details?.lat || 28.6}\n                    lon={data?.basic_details?.lon || 77.2}\n                    varga={selectedVarga}'
);

// Replace 6: Add selectedVarga prop to TransitPanel call in transit_compare
content = content.replace(
  '<TransitPanel\n                      data={data}\n                      transitPositions={timeControlledPositions || transitPositions}\n                    />',
  '<TransitPanel\n                      data={data}\n                      transitPositions={timeControlledPositions || transitPositions}\n                      selectedVarga={selectedVarga}\n                    />'
);

// Replace 7: Add Transit Diagnostic Matrix title with D-chart
content = content.replace(
  'Transit Diagnostic Matrix\n                      </h3>',
  'Transit Diagnostic Matrix {selectedVarga > 1 ? `(D${selectedVarga})` : ""}\n                      </h3>'
);

// Replace 8: Add dropdown to transit_compare view below TransitPanel
content = content.replace(
  /<TransitPanel\n\s*data=\{data\}\n\s*transitPositions=\{timeControlledPositions \|\| transitPositions\}\n\s*selectedVarga=\{selectedVarga\}\n\s*\/>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/g,
  `<TransitPanel
                      data={data}
                      transitPositions={timeControlledPositions || transitPositions}
                      selectedVarga={selectedVarga}
                    />
                  </div>

                  {/* Varga Selection Dropdown */}
                  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                    <div className="text-indigo-900 font-bold text-sm">
                      Select Divisional Chart for Transit:
                    </div>
                    <select
                      value={selectedVarga}
                      onChange={(e) => setSelectedVarga(parseInt(e.target.value))}
                      className="p-2 rounded-lg border-2 border-indigo-200 bg-white font-bold text-indigo-900 shadow-sm focus:outline-none focus:border-indigo-400"
                    >
                      <option value={1}>D1 - Rasi Chart</option>
                      <option value={2}>D2 - Hora (Wealth)</option>
                      <option value={3}>D3 - Drekkana (Siblings)</option>
                      <option value={4}>D4 - Chaturthamsa (Properties)</option>
                      <option value={5}>D5 - Panchamsa (Children)</option>
                      <option value={6}>D6 - Shastamsa (Health/Enemies)</option>
                      <option value={7}>D7 - Saptamsa (Progeny)</option>
                      <option value={8}>D8 - Ashtamsa (Longevity)</option>
                      <option value={9}>D9 - Navamsa (Marriage/Dharma)</option>
                      <option value={10}>D10 - Dasamsa (Profession)</option>
                      <option value={12}>D12 - Dwadasamsa (Parents)</option>
                      <option value={16}>D16 - Shodasamsa (Vehicles)</option>
                      <option value={20}>D20 - Vimsamsa (Spiritual)</option>
                      <option value={24}>D24 - Chaturvimsamsa (Education)</option>
                      <option value={27}>D27 - Saptavimsamsa (Strengths)</option>
                      <option value={30}>D30 - Trimsamsa (Misfortunes)</option>
                      <option value={40}>D40 - Khavedamsa (Auspiciousness)</option>
                      <option value={45}>D45 - Akshavedamsa (Character)</option>
                      <option value={60}>D60 - Shastiamsa (Karma)</option>
                    </select>
                  </div>
                </div>
              </div>`
);

fs.writeFileSync(p, content);
console.log('Replacements done!');
