import sys
import re

file_path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\ZodiacChart.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove HOUSE_POLYGON completely
content = re.sub(r'// Polygons for standard single chart sections \(5 to 95 coordinate bounds\).*?};\s+', '', content, flags=re.DOTALL)

# 2. Fix polyPoints reference (remove HOUSE_POLYGON)
content = content.replace('const polyPoints = isDoubleChart ? INNER_HOUSE_POLYGON[houseNum] : HOUSE_POLYGON[houseNum];', 'const polyPoints = isDoubleChart ? INNER_HOUSE_POLYGON[houseNum] : null;')

# 3. Remove aspect lines mapping block
content = re.sub(r'\{\/\* Drishti \(Aspect\) Lines between inner house centroids \*\/}.*?\{\/\* House labels \+ planets \*\/\}', '{/* House labels + planets */}', content, flags=re.DOTALL)

# 4. Add useState
content = content.replace('import React from "react";', 'import React, { useState } from "react";')

# 5. Add Hindi dictionaries before ZodiacChart definition
hindi_dicts = """const PLANET_HINDI = {
    "Sun": "सू", "Moon": "चं", "Mars": "मं", "Mercury": "बु",
    "Jupiter": "गु", "Venus": "शु", "Saturn": "श", "Rahu": "रा",
    "Ketu": "के", "Ascendant": "ल", "Uranus": "अरु", "Neptune": "वरु", "Pluto": "यम"
};

const NAKSHATRA_HINDI = {
    "Ashwini": "अश्", "Bharani": "भर", "Krittika": "कृत्", "Rohini": "रोहि",
    "Mrigashira": "मृग", "Ardra": "आर्", "Punarvasu": "पुन", "Pushya": "पुष",
    "Ashlesha": "आश्", "Magha": "मघा", "Purva Phalguni": "पू.फा", "Uttara Phalguni": "उ.फा",
    "Hasta": "हस्", "Chitra": "चित", "Swati": "स्वा", "Vishakha": "विश",
    "Anuradha": "अनु", "Jyeshtha": "ज्ये", "Mula": "मूल", "Purva Ashadha": "पू.षा",
    "Uttara Ashadha": "उ.षा", "Shravana": "श्रव", "Dhanishta": "धनि",
    "Shatabhisha": "शत", "Purva Bhadrapada": "पू.भा", "Uttara Bhadrapada": "उ.भा",
    "Revati": "रेव"
};

const ZodiacChart = ({"""

content = content.replace('const ZodiacChart = ({', hindi_dicts)

# 6. Add lang state
content = content.replace('const isLegacy = variant === "legacy";', 'const [lang, setLang] = useState(\'en\');\n    const isLegacy = variant === "legacy";')

# 7. Modify abbrev
orig_abbrev = 'let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);'
new_abbrev = 'let abbrev = lang === \'hi\' ? (PLANET_HINDI[pName] || pName.substring(0, 2)) : (PLANET_ABBREV[pName] || pName.substring(0, 2));'
content = content.replace(orig_abbrev, new_abbrev)

# 8. Modify nakshatra
orig_nak = """const nakshatra = typeof p === 'object' ? p.nakshatra : null;
        const fontSizePlanet = 3.5 * scaleText;"""
new_nak = """const nakshatra = typeof p === 'object' ? p.nakshatra : null;
        let nakText = nakshatra ? nakshatra.substring(0, 3) : "";
        if (lang === 'hi' && nakshatra) {
            nakText = NAKSHATRA_HINDI[nakshatra] || nakText;
        }
        const fontSizePlanet = 3.5 * scaleText;"""
content = content.replace(orig_nak, new_nak)

# 9. Use nakText
orig_tspan = '{nakshatra.substring(0, 3)}{" "}'
new_tspan = '{nakText}{" "}'
content = content.replace(orig_tspan, new_tspan)

# 10. Add toggle button
orig_div = 'overflow-hidden`}>\n                <svg'
new_div = """overflow-hidden`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); setLang(lang === 'en' ? 'hi' : 'en'); }}
                    className="absolute top-2 right-2 z-10 bg-slate-100 hover:bg-slate-200 text-xs px-2 py-1 rounded cursor-pointer font-bold text-slate-700 shadow-sm transition-colors border border-slate-300"
                    title="Toggle Language (English/Hindi)"
                >
                    {lang === 'en' ? 'अ' : 'A'}
                </button>
                <svg"""
content = content.replace(orig_div, new_div)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
