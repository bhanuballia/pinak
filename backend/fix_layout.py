import re

path = r'frontend\src\components\ZodiacRectSign.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix isGrid and lineH
old_grid = '''                            const displayedPlanets = planets.slice(0, 7);
                            const lineH = 5.0 * scaleText; // Increased distance between planets
                            const totalItems = displayedPlanets.length;

                            const isGrid = !isMainChart && totalItems >= 2;'''

new_grid = '''                            const displayedPlanets = planets.slice(0, 7);
                            const lineH = (showDegree || showNakshatra) ? 6.0 * scaleText : 5.0 * scaleText; 
                            const totalItems = displayedPlanets.length;

                            const isGrid = !isMainChart && totalItems >= 2 && !showDegree && !showNakshatra;'''

content = content.replace(old_grid, new_grid)

# Fix nakshatra object parsing
old_nak = '''                                        let nakshatra = fullPos?.nakshatra || (typeof p === 'object' ? p.nakshatra : null);
                                        let nakText = nakshatra ? String(nakshatra).substring(0, 3) : "";
                                        if (lang === 'hi' && nakshatra) {
                                            nakText = NAKSHATRA_HINDI[nakshatra] || nakText;
                                        }'''

new_nak = '''                                        let nakshatraObj = fullPos?.nakshatra || (typeof p === 'object' ? p.nakshatra : null);
                                        let nakshatraName = (typeof nakshatraObj === 'object' && nakshatraObj !== null) ? nakshatraObj.name : nakshatraObj;
                                        let nakText = nakshatraName ? String(nakshatraName).substring(0, 3) : "";
                                        if (lang === 'hi' && nakshatraName) {
                                            nakText = NAKSHATRA_HINDI[nakshatraName] || nakText;
                                        }'''

content = content.replace(old_nak, new_nak)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed layout and object rendering")
