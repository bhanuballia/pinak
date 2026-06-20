import sys

with open('frontend/src/components/KundaliReportView.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

sections = [
    ("auspicious_factors", "{/* Favourable & Numerology */}\n          <SectionTitle>Auspicious Factors</SectionTitle>\n          {renderFavourable()}"),
    ("yogas", "{/* Yogas */}\n          <SectionTitle>Classical Yogas</SectionTitle>\n          {renderYogas()}"),
    ("dasha", "{/* Dasha Periods */}\n          <SectionTitle>Current Dasha (Planetary Periods)</SectionTitle>\n          {renderDasha()}"),
    ("d2", "{/* D2 Chart */}\n          <SectionTitle>Hora Chart (D2 - Wealth & Finances)</SectionTitle>\n          {renderD2Chart()}\n          <VargaAnalysisPanel vargaKey=\"D2\" vargaNum={2} />"),
    ("d3", "{/* D3 Chart */}\n          <SectionTitle>Drekkana Chart (D3 - Siblings & Courage)</SectionTitle>\n          {renderD3Chart()}\n          <VargaAnalysisPanel vargaKey=\"D3\" vargaNum={3} />"),
    ("d4", "{/* D4 Chart */}\n          <SectionTitle>Chaturthamsha Chart (D4 - Fortune & Properties)</SectionTitle>\n          {renderD4Chart()}\n          <VargaAnalysisPanel vargaKey=\"D4\" vargaNum={4} />"),
    ("d5", "{/* D5 Chart */}\n          <SectionTitle>Panchamsha Chart (D5 - Power & Authority)</SectionTitle>\n          {renderD5Chart()}\n          <VargaAnalysisPanel vargaKey=\"D5\" vargaNum={5} />"),
    ("d6", "{/* D6 Chart */}\n          <SectionTitle>Shashthamsha Chart (D6 - Health & Enemies)</SectionTitle>\n          {renderD6Chart()}\n          <VargaAnalysisPanel vargaKey=\"D6\" vargaNum={6} />"),
    ("d7", "{/* D7 Chart */}\n          <SectionTitle>Saptamsha Chart (D7 - Children & Progeny)</SectionTitle>\n          {renderD7Chart()}\n          <VargaAnalysisPanel vargaKey=\"D7\" vargaNum={7} />"),
    ("d8", "{/* D8 Chart */}\n          <SectionTitle>Ashtamsha Chart (D8 - Longevity & Unexpected Events)</SectionTitle>\n          {renderD8Chart()}\n          <VargaAnalysisPanel vargaKey=\"D8\" vargaNum={8} />"),
    ("d9", "{/* D9 Chart */}\n          <SectionTitle>Navamsha Chart (D9 - Marriage & Inner Self)</SectionTitle>\n          {renderD9Chart()}\n          <VargaAnalysisPanel vargaKey=\"D9\" vargaNum={9} />"),
    ("d10", "{/* D10 Chart */}\n          <SectionTitle>Dashamsha Chart (D10 - Career & Profession)</SectionTitle>\n          {renderD10Chart()}\n          <VargaAnalysisPanel vargaKey=\"D10\" vargaNum={10} />"),
    ("d12", "{/* D12 Chart */}\n          <SectionTitle>Dwadashamsha Chart (D12 - Parents & Ancestry)</SectionTitle>\n          {renderD12Chart()}\n          <VargaAnalysisPanel vargaKey=\"D12\" vargaNum={12} />"),
    ("d16", "{/* D16 Chart */}\n          <SectionTitle>Shodashamsha Chart (D16 - Vehicles & Happiness)</SectionTitle>\n          {renderD16Chart()}\n          <VargaAnalysisPanel vargaKey=\"D16\" vargaNum={16} />"),
    ("d20", "{/* D20 Chart */}\n          <SectionTitle>Vimshamsha Chart (D20 - Spiritual Progress)</SectionTitle>\n          {renderD20Chart()}\n          <VargaAnalysisPanel vargaKey=\"D20\" vargaNum={20} />"),
    ("d24", "{/* D24 Chart */}\n          <SectionTitle>Chaturvimshamsha Chart (D24 - Education & Knowledge)</SectionTitle>\n          {renderD24Chart()}\n          <VargaAnalysisPanel vargaKey=\"D24\" vargaNum={24} />"),
    ("d27", "{/* D27 Chart */}\n          <SectionTitle>Saptavimshamsha Chart (D27 - Strengths & Weaknesses)</SectionTitle>\n          {renderD27Chart()}\n          <VargaAnalysisPanel vargaKey=\"D27\" vargaNum={27} />"),
    ("d30", "{/* D30 Chart */}\n          <SectionTitle>Trimshamsha Chart (D30 - Misfortunes & Evils)</SectionTitle>\n          {renderD30Chart()}\n          <VargaAnalysisPanel vargaKey=\"D30\" vargaNum={30} />"),
    ("d40", "{/* D40 Chart */}\n          <SectionTitle>Khavedamsha Chart (D40 - Auspicious & Inauspicious Effects)</SectionTitle>\n          {renderD40Chart()}\n          <VargaAnalysisPanel vargaKey=\"D40\" vargaNum={40} />"),
    ("d45", "{/* D45 Chart */}\n          <SectionTitle>Akshavedamsha Chart (D45 - General Indications)</SectionTitle>\n          {renderD45Chart()}\n          <VargaAnalysisPanel vargaKey=\"D45\" vargaNum={45} />"),
    ("d60", "{/* D60 Chart */}\n          <SectionTitle>Shashtiamsha Chart (D60 - Past Life Karma & Micro-Level Destiny)</SectionTitle>\n          {renderD60Chart()}\n          <VargaAnalysisPanel vargaKey=\"D60\" vargaNum={60} />"),
    ("ashtakavarga", "{/* Ashtakavarga */}\n          <SectionTitle>Sarvashtakavarga (Overall Strength Wheel)</SectionTitle>\n          {renderAshtakavarga()}"),
    ("destiny_timeline", "{/* Destiny Timeline */}\n          <SectionTitle>Destiny Timeline (10-Year Forecast)</SectionTitle>\n          {renderDestinyTimeline()}\n          {renderDestinyGraph()}"),
    ("cosmic_life_map", "{/* Cosmic Life Map */}\n          <SectionTitle>5D Cosmic Life Map</SectionTitle>\n          {renderCosmicLifeMap()}"),
    ("destiny_matrix", "{/* Destiny Matrix */}\n          <SectionTitle>Destiny Matrix Visualizer</SectionTitle>\n          {renderDestinyMatrixVisualizer()}"),
    ("wealth_analysis", "{/* Wealth Analysis */}\n          <SectionTitle>Wealth & Prosperity Analysis</SectionTitle>\n          {renderWealthPrediction()}"),
    ("life_events", "{/* Life Events */}\n          <SectionTitle>Life Event Predictions (2025-2035)</SectionTitle>\n          {renderLifeEvents()}"),
    ("dosha", "{/* Dosha Analysis */}\n          <SectionTitle>Dosha Summary</SectionTitle>\n          {renderDoshas()}\n          {renderSadeSatiAnalysis()}"),
    ("remedies", "{/* Remedies */}\n          <SectionTitle>Recommended Remedies & Mitigation</SectionTitle>\n          {renderRemedies()}"),
    ("soul_archetype", "{/* Soul Archetype */}\n          <SectionTitle>Soul Archetype & Destiny</SectionTitle>\n          {renderSentient()}"),
    ("akashic", "{/* Akashic Soul Record */}\n          <SectionTitle>Akashic Soul Record</SectionTitle>\n          {renderAkashic()}"),
    ("omniscient", "{/* Omniscient Analysis */}\n          <SectionTitle>Omniscient Analysis</SectionTitle>\n          {renderOmniscient()}"),
    ("quantum", "{/* Quantum Forecast Analysis */}\n          <SectionTitle>Quantum Forecast Analysis</SectionTitle>\n          {renderQuantum()}"),
    ("dimensional", "{/* Dimensional Destiny Analysis */}\n          <SectionTitle>Dimensional Destiny Analysis</SectionTitle>\n          {renderDimensional()}"),
    ("astral", "{/* Astral Matrix */}\n          <SectionTitle>Astral Matrix Destiny Analysis</SectionTitle>\n          {renderAstral()}"),
    ("cosmic_core", "{/* Cosmic Core */}\n          <SectionTitle>Cosmic Core Destiny Analysis</SectionTitle>\n          {renderCosmicCore()}"),
    ("maharishi", "{/* Maharishi Destiny Analysis */}\n          <SectionTitle>Maharishi Destiny Analysis</SectionTitle>\n          {renderMaharishi()}"),
    ("brahma", "{/* Brahma Destiny Analysis */}\n          <SectionTitle>Brahma Destiny Analysis</SectionTitle>\n          {renderBrahma()}"),
    ("paramarshi", "{/* Paramarshi Advisor Analysis */}\n          <SectionTitle>Paramarshi Advisor Analysis</SectionTitle>\n          {renderParamarshi()}"),
    ("planetary_wisdom", "{/* Planetary Wisdom */}\n          <SectionTitle>Planetary Wisdom: Deep Placement Analysis</SectionTitle>\n          {renderPlanetaryWisdom()}"),
    ("oracle", "{/* Oracle Insights */}\n          <SectionTitle>Sage Insights & Divine Oracle</SectionTitle>\n          {renderOracle()}"),
    ("karma_timeline", "{/* Karma Timeline */}\n          <SectionTitle>Advanced Karma Projection (2025-2045)</SectionTitle>\n          {renderKarmaTimeline()}"),
    ("life_events_narrative", "{/* Life Events Narrative */}\n          <SectionTitle>Life Events Narrative: The Journey Ahead</SectionTitle>\n          {renderLifeEventsNarrative()}"),
    ("probability_matrix", "{/* Probability Matrix Engine */}\n          <SectionTitle>Probability Matrix Engine</SectionTitle>\n          {renderProbabilityMatrix()}"),
    ("neural_summary", "{/* Cosmic Neural Summary */}\n          <SectionTitle>Cosmic Neural Summary</SectionTitle>\n          {renderNeuralSummary()}"),
    ("destiny_signature", "{/* Destiny Signature */}\n          <SectionTitle>Destiny Signature</SectionTitle>\n          {renderDestinySignature()}"),
    ("life_vector", "{/* AI Life Vector Analysis */}\n          <SectionTitle>AI Life Vector Analysis</SectionTitle>\n          {renderLifeVectorPredictions()}"),
]

for sec_id, block in sections:
    if block in content:
        new_block = "{activeSections." + sec_id + " && (<>\n          " + block.replace("\n", "\n          ") + "\n          </>)}"
        # Just to fix potential indentation issues in replace:
        new_block = f"{{activeSections.{sec_id} && (<>\n{block}\n          </>)}}"
        content = content.replace(block, new_block)
        print(f"Replaced {sec_id}")
    else:
        print(f"WARNING: Could not find block for {sec_id}")

# For blocks with complex structures (like Sarva Chancha Chakra, etc.) we handle them via string replacements.
complex_replacements = [
    (
        "          {/* Vimshottari Dasha Life Timeline */}\n          {data.dasha && data.dasha.list && (\n            <>\n              <SectionTitle>Vimshottari Dasha Life Timeline</SectionTitle>\n              <div className=\"mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300\">\n                <VimshottariGridTimeline data={data} />\n              </div>\n            </>\n          )}",
        "          {/* Vimshottari Dasha Life Timeline */}\n          {/* Note: User wanted this shown by default, but if it is conditionally rendered, we wrap it in a function of activeSections? Wait, the plan says it should be visible by default. So it should not be hidden behind an activeSections toggle unless its id is in activeSections. Let's make it toggleable, but initialized to true. Wait, we didn't add it to OPTIONAL_SECTIONS! So leave it alone! */}\n          {data.dasha && data.dasha.list && (\n            <>\n              <SectionTitle>Vimshottari Dasha Life Timeline</SectionTitle>\n              <div className=\"mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300\">\n                <VimshottariGridTimeline data={data} />\n              </div>\n            </>\n          )}"
    ),
    (
        "          {/* Sarva Chancha Chakra & Detailed Tables */}\n          {(data.ashtakavarga || (data.master_engine && data.master_engine.ashtakavarga)) && (\n            <>\n              <SectionTitle>Sarva Chancha Chakra</SectionTitle>",
        "          {/* Sarva Chancha Chakra & Detailed Tables */}\n          {activeSections.sarva_chancha && (data.ashtakavarga || (data.master_engine && data.master_engine.ashtakavarga)) && (\n            <>\n              <SectionTitle>Sarva Chancha Chakra</SectionTitle>"
    ),
    (
        "              {data.av_reductions && Object.keys(data.av_reductions).length > 0 && (\n                <>\n                  <SectionTitle>Ashtakavarga Reduction</SectionTitle>",
        "              {activeSections.ashtakavarga_reduction && data.av_reductions && Object.keys(data.av_reductions).length > 0 && (\n                <>\n                  <SectionTitle>Ashtakavarga Reduction</SectionTitle>"
    ),
    (
        "              {data.vimsopaka_assessment && (\n                <>\n                  <SectionTitle>Varga Strength Matrix (Vimsopaka Bala)</SectionTitle>",
        "              {activeSections.vimsopaka && data.vimsopaka_assessment && (\n                <>\n                  <SectionTitle>Varga Strength Matrix (Vimsopaka Bala)</SectionTitle>"
    ),
    (
        "              <SectionTitle>Recommended Gemstones (Ratna)</SectionTitle>\n              <div className=\"mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300 bg-white min-h-[300px] print:break-inside-avoid\">\n                <GemstonePanel data={data} />\n              </div>",
        "              {activeSections.gemstones && (<>\n              <SectionTitle>Recommended Gemstones (Ratna)</SectionTitle>\n              <div className=\"mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300 bg-white min-h-[300px] print:break-inside-avoid\">\n                <GemstonePanel data={data} />\n              </div>\n              </>)}"
    ),
    (
        "              {data.ai_life_analysis && Object.keys(data.ai_life_analysis).length > 0 && (\n                <>\n                  <SectionTitle>Detailed Life Analysis</SectionTitle>",
        "              {activeSections.life_analysis && data.ai_life_analysis && Object.keys(data.ai_life_analysis).length > 0 && (\n                <>\n                  <SectionTitle>Detailed Life Analysis</SectionTitle>"
    ),
    (
        "              {renderDetailedRemedialRituals()}",
        "              {activeSections.rituals && renderDetailedRemedialRituals()}"
    ),
    (
        "              {renderAdvancedPredictiveLogic()}",
        "              {activeSections.predictive_logic && renderAdvancedPredictiveLogic()}"
    ),
    (
        "              {renderUniversalWisdom()}",
        "              {activeSections.universal_wisdom && renderUniversalWisdom()}"
    ),
    (
        "          {/* Master Engine / Premium Insights */}\n          {data.master_engine && (\n            <>\n              <SectionTitle>Premium Cosmic Insights</SectionTitle>",
        "          {/* Master Engine / Premium Insights */}\n          {activeSections.master_engine && data.master_engine && (\n            <>\n              <SectionTitle>Premium Cosmic Insights</SectionTitle>"
    )
]

for old, new in complex_replacements:
    if old in content:
        content = content.replace(old, new)
        print("Replaced a complex block.")
    else:
        print(f"WARNING: Could not find complex block: {old[:50]}...")

with open('frontend/src/components/KundaliReportView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done patching KundaliReportView.jsx")
