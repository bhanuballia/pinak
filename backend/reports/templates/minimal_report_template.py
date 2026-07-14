# reports/templates/minimal_report_template.py
"""
Minimal Classical Report Template (10–12 pages)
Bilingual: English + Hindi
"""

# ----------------------------
# ENGLISH TEMPLATE
# ----------------------------

REPORT_EN = """
# Minimal Vedic Astrology Report  
## Birth Details  
Name: {name}  
Date of Birth: {dob}  
Time of Birth: {tob}  
Place: {city}, {state}, {country}  
Timezone: {timezone}

---

## Lagna Chart (Rasi Chart)  
{rasi_chart_ascii}

---

## Navamsa Chart (D9)  
{navamsa_chart_ascii}

---

## Planetary Positions (Sidereal – Lahiri)  
{planet_table}

---

## House Cusps (Placidus / Whole Sign as configured)  
{house_table}

---

## Nakshatra & Pada  
{nakshatra_table}

---

## Dasha (Vimshottari) – Current MAHADASHA / ANTARDASHA  
Current Dasha: {current_dasha}  
Upcoming Periods:  
{dasha_table}

---

## Ashtakavarga (Sarvashtakavarga)  
Sign | Points  
-----|--------  
{ashtakavarga_table}

Strongest Sign: {ashtakavarga_max_sign}  
Weakest Sign: {ashtakavarga_min_sign}

---

## General Interpretation  
### Ascendant Summary  
{lagna_interpretation}

### Sun  
{sun_interpretation}

### Moon  
{moon_interpretation}

### Mars  
{mars_interpretation}

### Mercury  
{mercury_interpretation}

### Jupiter  
{jupiter_interpretation}

### Venus  
{venus_interpretation}

### Saturn  
{saturn_interpretation}

---

*End of Minimal Report*
"""


# ----------------------------
# HINDI TEMPLATE
# ----------------------------

REPORT_HI = """
# न्यूनतम वैदिक ज्योतिष रिपोर्ट  
## जन्म विवरण  
नाम: {name}  
जन्म तिथि: {dob}  
जन्म समय: {tob}  
जन्म स्थान: {city}, {state}, {country}  
समय क्षेत्र: {timezone}

---

## लग्न कुंडली (राशि चार्ट)  
{rasi_chart_ascii}

---

## नवांश कुंडली (D9)  
{navamsa_chart_ascii}

---

## ग्रह स्थिति (साइडेरियल – लाहिरी)  
{planet_table}

---

## भाव नक्षत्र / भाव आरंभ  
{house_table}

---

## नक्षत्र एवं पाद  
{nakshatra_table}

---

## दशा (विंशोत्तरी) – वर्तमान महादशा / अंतरदशा  
वर्तमान दशा: {current_dasha}  
आगामी अवधि:  
{dasha_table}

---

## अष्टकवर्ग (सर्वाष्टकवर्ग)  
राशि | बिंदु  
-----|--------  
{ashtakavarga_table}

सबसे मजबूत राशि: {ashtakavarga_max_sign}  
सबसे कमजोर राशि: {ashtakavarga_min_sign}

---

## सामान्य व्याख्या  
### लग्न  
{lagna_interpretation}

### सूर्य  
{sun_interpretation}

### चंद्रमा  
{moon_interpretation}

### मंगल  
{mars_interpretation}

### बुध  
{mercury_interpretation}

### बृहस्पति  
{jupiter_interpretation}

### शुक्र  
{venus_interpretation}

### शनि  
{saturn_interpretation}

---

*न्यूनतम रिपोर्ट समाप्त*
"""


# ----------------------------
# BILINGUAL TEMPLATE
# ----------------------------

REPORT_BILINGUAL = REPORT_EN + "\n\n" + REPORT_HI
