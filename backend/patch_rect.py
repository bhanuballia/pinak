import re

path = r'frontend\src\components\ZodiacRectSign.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update component signature
old_sig = 'const ZodiacRectSign = ({ houses, transitHouses = null, onPlanetClick, title, variant = "modern", planetEffects = {}, planetPositions = [], isRect, setIsRect, scaleText = 1, hideLegend = false, hideOuterRect = false, defaultLang = "en", showFullscreenButton = false, onPopOut }) => {'

new_sig = 'const ZodiacRectSign = ({ houses, transitHouses = null, onPlanetClick, title, variant = "modern", planetEffects = {}, planetPositions = [], isRect, setIsRect, scaleText = 1, hideLegend = false, hideOuterRect = false, defaultLang = "en", showFullscreenButton = false, onPopOut, showNakshatra = false }) => {'
content = content.replace(old_sig, new_sig)

# 2. Add showNakshatra parameter to renderHouse
old_render = 'const renderHouse = (houseNum, x, y, size, polygonPoints, isCenter = false) => {'
new_render = 'const renderHouse = (houseNum, x, y, size, polygonPoints, isCenter = false) => {'
# wait, actually we just need to pass showNakshatra to the component, and inside renderHouse we use it. Since renderHouse is defined inside ZodiacRectSign, showNakshatra is in scope!

# Let's find the transit planet rendering block
old_planet_map = '''            {transitPlanets.map((planetName, i) => {
              const pData = tPlanets.find(p => p.name === planetName || p.planet === planetName);
              const isRetro = pData?.is_retrograde || pData?.sidereal?.is_retrograde;
              return (
                <text
                  key={`t-${planetName}`}
                  x={x}
                  y={y + (i * 12 * scaleText) + (planets.length * 12 * scaleText) + (planets.length > 0 ? 10 * scaleText : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-black"
                  style={{
                    fontSize: `${9 * scaleText}px`,
                    fill: PLANET_COLORS[planetName] || '#000',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={(e) => { e.stopPropagation(); onPlanetClick?.(planetName, houseNum); }}
                >
                  {planetName}{isRetro ? '*' : ''}
                </text>
              );
            })}'''

new_planet_map = '''            {transitPlanets.map((planetName, i) => {
              const pData = tPlanets.find(p => p.name === planetName || p.planet === planetName);
              const isRetro = pData?.is_retrograde || pData?.sidereal?.is_retrograde;
              
              const nakshatraObj = pData?.nakshatra || pData?.sidereal?.nakshatra;
              const nakshatra = (typeof nakshatraObj === 'string') ? nakshatraObj : (nakshatraObj?.name || '');
              const nakshatraAbbr = nakshatra ? nakshatra.substring(0, 2) : '';
              
              return (
                <text
                  key={`t-${planetName}`}
                  x={x}
                  y={y + (i * 12 * scaleText) + (planets.length * 12 * scaleText) + (planets.length > 0 ? 10 * scaleText : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-black"
                  style={{
                    fontSize: `${9 * scaleText}px`,
                    fill: PLANET_COLORS[planetName] || '#000',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={(e) => { e.stopPropagation(); onPlanetClick?.(planetName, houseNum); }}
                >
                  {planetName}{isRetro ? '*' : ''}
                  {showNakshatra && nakshatraAbbr && (
                    <tspan className="font-mono opacity-80" style={{ fontSize: `${7 * scaleText}px` }} dx="4">
                      {nakshatraAbbr}
                    </tspan>
                  )}
                </text>
              );
            })}'''

content = content.replace(old_planet_map, new_planet_map)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("ZodiacRectSign patched successfully.")
