# reports/templates/premium_report_template.py
"""
Premium Book-Style Vedic Report Template (40+ pages)
Bilingual: English + Hindi
"""

# ----------------------------
# ENGLISH VERSION
# ----------------------------

REPORT_EN = """
# Premium Vedic Astrology Report  
## Birth Details  
Name: {name}  
Date of Birth: {dob}  
Time of Birth: {tob}  
Place: {city}, {state}, {country}  
Timezone: {timezone}

---

# Part 1 — Core Charts  
## Lagna (Rasi) Chart  
{rasi_chart_ascii}

## Navamsa Chart (D9)  
{navamsa_chart_ascii}

## Other Vargas  
D3 (Drekkana)  
{d3_chart}  

D10 (Dashamsa)  
{d10_chart}

D12 (Dvadasamsa)  
{d12_chart}

D60 (Shastiamsa)  
{d60_chart}

---

# Part 2 — Planetary Strengths  
## Shadbala Table  
{shadbala_table}

## Ishta–Kashta / Cheshta Bala  
{ishta_kashta_table}

## Planetary Speeds (Cheshta)  
{planet_speed_table}

---

# Part 3 — Detailed Interpretations  
## Ascendant & Its Lord  
{ascendant_deep}

## Sun — Soul, Vitality, Dharma  
{sun_deep}

## Moon — Mind, Emotions, Stability  
{moon_deep}

## Mars — Energy, Discipline, Initiative  
{mars_deep}

## Mercury — Intelligence, Speech, Logic  
{mercury_deep}

## Jupiter — Wisdom, Dharma, Prosperity  
{jupiter_deep}

## Venus — Love, Art, Comfort  
{venus_deep}

## Saturn — Duty, Karma, Discipline  
{saturn_deep}

## Nodes (Rahu & Ketu)  
{rahu_deep}  
{ketu_deep}

---

# Part 4 — Yogas  
## Classical Yogas  
{yoga_list}

## Raja Yogas  
{raja_yoga_list}

## Dhana Yogas  
{dhana_yoga_list}

## Arishta (Negative) Yogas  
{arishta_yoga_list}

---

# Part 5 — Life Predictions  
## Education  
{education_prediction}

## Career  
{career_prediction}

## Marriage & Relationships  
{marriage_prediction}

## Wealth & Finance  
{finance_prediction}

## Health  
{health_prediction}

## Personality & Psychology  
{personality_analysis}

## Spiritual Tendencies  
{spiritual_prediction}

---

# Part 6 — Dashas  
## Vimshottari  
{vimshottari_detail}

## Current Mahadasha  
{current_mahadasha}  

## Results of Antardasha  
{antardasha_detail}

## Future Predictions (20 years)  
{dasha_long_table}

---

# Part 7 — Ashtakavarga  
## Bhinnashtakavarga  
{bav_table}

## Sarvashtakavarga  
{sav_table}

## Transit Strength (Gochar)  
{transit_strength_table}

---

# Part 8 — Remedies  
## Gemstone Recommendation  
{gemstone}

## Mantra  
{mantra}

## Pooja / Anushthan  
{pooja}

## Lifestyle Recommendations  
{lifestyle}

---

*End of Premium Report (English)*  
"""


# ----------------------------
# HINDI VERSION
# ----------------------------

REPORT_HI = """
# प्रीमियम वैदिक ज्योतिष रिपोर्ट  
## जन्म विवरण  
नाम: {name}  
जन्म तिथि: {dob}  
जन्म समय: {tob}  
जन्म स्थान: {city}, {state}, {country}  
समय क्षेत्र: {timezone}

---

# भाग 1 — मुख्य कुंडलियाँ  
## लग्न (राशि) कुंडली  
{rasi_chart_ascii}

## नवांश (D9)  
{navamsa_chart_ascii}

## अन्य वर्ग कुंडलियाँ  
D3 (द्रेष्काण)  
{d3_chart}  

D10 (दशमांश)  
{d10_chart}

D12 (द्वादशांश)  
{d12_chart}

D60 (षष्टिअंश)  
{d60_chart}

---

# भाग 2 — ग्रहों की शक्ति  
## षड्बल सारणी  
{shadbala_table}

## इष्ट–कष्ट / चेष्टा बल  
{ishta_kashta_table}

## ग्रह गति  
{planet_speed_table}

---

# भाग 3 — विस्तृत ग्रह फल  
## लग्न एवं लग्नेश  
{ascendant_deep_hi}

## सूर्य  
{sun_deep_hi}

## चंद्र  
{moon_deep_hi}

## मंगल  
{mars_deep_hi}

## बुध  
{mercury_deep_hi}

## बृहस्पति  
{jupiter_deep_hi}

## शुक्र  
{venus_deep_hi}

## शनि  
{saturn_deep_hi}

## राहु–केतु  
{rahu_deep_hi}  
{ketu_deep_hi}

---

# भाग 4 — योग  
## पारंपरिक योग  
{yoga_list_hi}

## राजयोग  
{raja_yoga_list_hi}

## धन योग  
{dhana_yoga_list_hi}

## अरिष्ट (नकारात्मक) योग  
{arishta_yoga_list_hi}

---

# भाग 5 — जीवन भविष्य  
## शिक्षा  
{education_prediction_hi}

## करियर  
{career_prediction_hi}

## विवाह  
{marriage_prediction_hi}

## धन  
{finance_prediction_hi}

## स्वास्थ्य  
{health_prediction_hi}

## व्यक्तित्व  
{personality_analysis_hi}

## आध्यात्म  
{spiritual_prediction_hi}

---

# भाग 6 — दशा  
## विंशोत्तरी  
{vimshottari_detail_hi}

## वर्तमान महादशा  
{current_mahadasha_hi}

## अंतरदशा फल  
{antardasha_detail_hi}

## आगामी समय (20 वर्ष)  
{dasha_long_table_hi}

---

# भाग 7 — अष्टकवर्ग  
## भिन्नाष्टक  
{bav_table_hi}

## सर्वाष्टक  
{sav_table_hi}

## गोचर बल  
{transit_strength_table_hi}

---

# भाग 8 — उपाय  
## रत्न  
{gemstone_hi}

## मंत्र  
{mantra_hi}

## पूजन  
{pooja_hi}

## जीवनशैली सुझाव  
{lifestyle_hi}

---

*प्रीमियम रिपोर्ट समाप्त (हिंदी)*  
"""


# ----------------------------
# BILINGUAL VERSION
# ----------------------------

REPORT_BILINGUAL = REPORT_EN + "\n\n" + REPORT_HI
