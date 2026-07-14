import re
import os

file_path = r"d:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\KundaliReportView.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import statement
import_statement = "import AIInsightBox from './AIInsightBox';\n"
if "import AIInsightBox" not in content:
    content = content.replace("import React, { useEffect, useState, useRef } from 'react';", "import React, { useEffect, useState, useRef } from 'react';\n" + import_statement)


# 2. Inject AIInsightBox after SectionTitle
# We will use regex to find <SectionTitle>Title</SectionTitle> and insert AIInsightBox
# The sections we want to target:
targets = {
    "Chart Analysis & Life Predictions": "chart_analysis",
    "Auspicious Factors": "auspicious_factors",
    "Destiny Timeline (10-Year Forecast)": "destiny_timeline",
    "5D Cosmic Life Map": "cosmic_life_map",
    "Destiny Matrix Visualizer": "destiny_matrix",
    "Wealth & Prosperity Analysis": "wealth_analysis",
    "Life Event Predictions (2025-2035)": "life_events",
    "Dosha Summary": "dosha",
    "Recommended Remedies & Mitigation": "remedies",
    "Soul Archetype & Destiny": "soul_archetype",
    "Akashic Soul Record": "akashic",
    "Omniscient Analysis": "omniscient",
    "Quantum Forecast Analysis": "quantum",
    "Dimensional Destiny Analysis": "dimensional",
    "Astral Matrix Destiny Analysis": "astral",
    "Cosmic Core Destiny Analysis": "cosmic_core",
    "Maharishi Destiny Analysis": "maharishi",
    "Brahma Destiny Analysis": "brahma",
    "Paramarshi Advisor Analysis": "paramarshi",
    "Planetary Wisdom: Deep Placement Analysis": "planetary_wisdom",
    "Sage Insights & Divine Oracle": "oracle",
    "Advanced Karma Projection & Correction": "karma_timeline",
    "Life Events Narrative": "life_events_narrative",
    "Probability Matrix Engine": "probability_matrix",
    "AI Life Vector Analysis": "life_vector",
    "Recommended Gemstones & Astro-Stones": "gemstones",
    "Detailed Life Analysis": "life_analysis",
    "Detailed Remedial Rituals & Cosmic Tuning": "rituals"
}

for title, section_id in targets.items():
    escaped_title = re.escape(title)
    # Match <SectionTitle>Title</SectionTitle>
    pattern = rf"(<SectionTitle>{escaped_title}</SectionTitle>)"
    
    # We want to insert: <AIInsightBox sectionId="{section_id}" sectionTitle="{title}" chartData={{data}} />
    replacement = rf'\1\n            <AIInsightBox sectionId="{section_id}" sectionTitle="{title}" chartData={{data}} />'
    
    # Check if we already injected
    if f'sectionId="{section_id}"' not in content:
        content = re.sub(pattern, replacement, content)

# Write back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected successfully!")
