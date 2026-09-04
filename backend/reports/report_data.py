"""
helpers to assemble the detailed kundali report data structure used by both the
pdf renderer and the frontend preview ui.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from astronomy.julian import datetime_to_julian, julian_to_datetime
from charts.rashi_chart import build_rashi_chart
from charts.divisional import build_varga_chart
from core.utils import get_sign_name, get_sign_index, ZODIAC_SIGNS
from dasha.vimshottari import compute_vimshottari_full
from dasha.yogini import compute_yogini_full
from panchang.tithi_yoga_karana import compute_tithi, compute_nakshatra, compute_yoga, compute_karana
from panchang.nakshatra import compute_nakshatra_from_lon
from charts.dosha import check_kalsarpa_dosha, check_manglik_dosha, check_pitra_dosha, check_sadesati
from charts.remedies.registry import generate_all_remedies
from reports.ai_text.registry import generate_ai_text
from reports.interpretation.core import generate_ai_life_analysis
from strength.shadbala import compute_shadbala as compute_shadbala_old
from strength.sphuta_drishti import calculate_sphuta_drishti_matrix
from dasha.shodashottari import compute_shodashottari
from dasha.chaturshitisama import compute_chaturshitisama
from dasha.ashtottari import compute_ashtottari
from dasha.dwisaptatisama import compute_dwisaptatisama
from dasha.dwadashottari import compute_dwadashottari
from dasha.panchottari import compute_panchottari
from dasha.shatabdika import compute_shatabdika
from dasha.shastihayani import compute_shastihayani
from dasha.chara import compute_chara
from dasha.sthira import compute_sthira
from dasha.shoola import compute_shoola
from dasha.niryaana_shoola import compute_niryaana_shoola
from dasha.drig import compute_drig
from dasha.mandooka import compute_mandooka
from dasha.sudasha import compute_sudasha

# New professional analysis engines
from core.analysis.dosha_engine import calculate_all_doshas
from core.analysis.shadbala_engine import compute_shadbala as compute_shadbala_new
from core.analysis.vimsopaka_engine import compute_vimsopaka_bala
from core.analysis.vimsopaka_pro_engine import run_vimsopaka_assessment
from core.analysis.yoga_engine import detect_yogas
from core.analysis.ishta_devata import calculate_ishta_devata
from core.analysis.life_oracle import analyze_life_oracle
from core.remedies.gemstone_engine import recommend_gemstones

# Lal Kitab features
from charts.lalkitab_chart import build_lalkitab_chart
from core.lalkitab_debts import calculate_lalkitab_debts

# New predictions engines
from core.predictions.pro_engine import build_pro_predictions
from core.predictions.life_areas_engine import build_life_area_predictions
from core.predictions.ai_text_engine import build_ai_summary

# Ultra engine - Advanced analysis
from core.ultra.ultra_engine import build_ultra_predictions

# Supreme engine - Ultimate AI-powered analysis
from core.supreme.supreme_engine import build_supreme_engine

# Cosmic engine - Final layer with Yogini Dasha and advanced predictions
from core.cosmic.cosmic_engine import build_cosmic_engine

# Sentient engine - Soul archetype and destiny analysis
from core.sentient.sentient_engine import run_sentient_engine

# Akashic engine - Soul record and karma cycles
from core.akashic.akashic_engine import run_akashic_engine

# Omniscient engine - Personality, emotion model and prediction fusion
from core.omniscient.omniscient_engine import run_omniscient_engine

# Quantum engine - Probability models and timeline simulation
from core.quantum.quantum_engine import run_quantum_engine, build_quantum_timeline

# Dimensional engine - Multi-dimensional destiny analysis
from core.dimensional.dimensional_engine import run_dimensional_engine

# Astral Matrix engine - Subtle destiny and karma patterns
from core.astral_matrix.astral_engine import run_astral_matrix_engine

# Cosmic Core engine - Soul alignment and universal purpose
from core.cosmic_core.cosmic_engine import run_cosmic_core

# Maharishi engine - Classical yogas and fortune analysis
from core.maharishi.maharishi_engine import run_maharishi_engine

# Brahma engine - Infinite destiny creation and karmic evolution
from core.brahma.brahma_engine import run_brahma_engine

# Paramarshi engine - Supreme Advisor and focused Q&A
from core.paramarshi.paramarshi_engine import ask_paramarshi
from core.paramarshi.remedy_advisor import suggest_remedies

# Oracle engine - Sage insights and Q&A
from core.oracle.oracle_engine import oracle_answer

# Rishi engine - Adaptive learning and personalization
from core.rishi.rishi_core import run_rishi_core
from core.destiny.destiny_engine import run_destiny_engine
from core.predictions.event_detector import detect_events
from core.karma.simulator import run_karma_simulation as run_karma_engine_base
from core.simulation.karma_simulator import run_karma_simulation as run_karma_engine_ultra
from core.analysis.life_event_detector import detect_life_events
from core.decision.cosmic_decision_engine import evaluate_decision
from core.oracle.oracle_core import oracle_query
from core.analysis.probability_matrix import build_probability_matrix
from core.analysis.destiny_graph_engine import build_destiny_graph
from core.transits.transit_engine import detect_transit_events
from reports.interpretation.wisdom import planetary_wisdom_analysis

# Destiny timeline - Probabilistic forecasting
from core.destiny.destiny_timeline_engine import build_destiny_timeline
from core.life_engine.life_engine import build_5d_life_map
from core.prophecy.prophecy_engine import build_7d_prophecy
from charts.renderers.destiny_timeline_renderer import render_destiny_timeline
from core.analysis.life_map_engine import compute_life_map
from charts.renderers.cosmic_life_map import render_cosmic_life_map
from core.analysis.destiny_matrix_engine import compute_destiny_matrix
from charts.renderers.destiny_matrix_renderer import render_destiny_matrix
from core.analysis.event_forecast_grid import build_event_forecast_grid
from charts.renderers.event_forecast_renderer import render_event_forecast_grid
from core.master_engine.master_controller import run_master_engine
from core.predictions.event_detector import detect_events
from core.cache.chart_cache import cache_chart, get_cached_chart
from relationships.friendship_matrix import FriendshipMatrix

def _planet_names(planets_list) -> list:
    """Safely extract planet name strings from a list that may contain dicts or strings."""
    result = []
    for p in (planets_list or []):
        result.append(p["name"] if isinstance(p, dict) else p)
    return result


SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

MALEFICS = {"Mars", "Saturn", "Rahu", "Ketu", "Sun"}

LETTER_VALUES = {
    "A": 1, "J": 1, "S": 1,
    "B": 2, "K": 2, "T": 2,
    "C": 3, "L": 3, "U": 3,
    "D": 4, "M": 4, "V": 4,
    "E": 5, "N": 5, "W": 5,
    "F": 6, "O": 6, "X": 6,
    "G": 7, "P": 7, "Y": 7,
    "H": 8, "Q": 8, "Z": 8,
    "I": 9, "R": 9,
}

MASTER_NUMBERS = {11, 22, 33}

FRIENDLY_NUMBERS = {
    1: [3, 5, 7],
    2: [4, 6, 8],
    3: [1, 5, 9],
    4: [2, 6, 8],
    5: [1, 3, 7],
    6: [2, 4, 8],
    7: [1, 3, 9],
    8: [2, 4, 6],
    9: [3, 5, 7],
}

LUCKY_MANTRAS = {
    1: "Om Suryaya Namaha",
    2: "Om Chandraya Namaha",
    3: "Om Guruve Namaha",
    4: "Om Raam Rahave Namaha",
    5: "Om Budhaya Namaha",
    6: "Om Shukraya Namaha",
    7: "Om Ketave Namaha",
    8: "Om Shanaishcharaya Namaha",
    9: "Om Bhaumaya Namaha",
}

LUCKY_DAYS = {
    1: ["Sunday", "Monday"],
    2: ["Monday", "Friday", "Sunday"],
    3: ["Thursday", "Sunday"],
    4: ["Sunday", "Monday", "Friday"],
    5: ["Wednesday", "Friday"],
    6: ["Friday", "Tuesday"],
    7: ["Monday", "Thursday"],
    8: ["Saturday", "Friday"],
    9: ["Tuesday", "Sunday"],
}

LUCKY_STONES = {
    1: ("Ruby", "Garnet"),
    2: ("Pearl", "Moon Stone"),
    3: ("Yellow Sapphire", "Citrine"),
    4: ("Hessonite", "Gomed"),
    5: ("Emerald", "Peridot"),
    6: ("Diamond", "White Sapphire"),
    7: ("Cat's Eye", "Turquoise"),
    8: ("Blue Sapphire", "Amethyst"),
    9: ("Red Coral", "Carnelian"),
}

RADICAL_RULER = {
    1: "Sun",
    2: "Moon",
    3: "Jupiter",
    4: "Rahu",
    5: "Mercury",
    6: "Venus",
    7: "Ketu",
    8: "Saturn",
    9: "Mars",
}

SIGN_ELEMENTS = {
    "Aries": "Fire",
    "Taurus": "Earth",
    "Gemini": "Air",
    "Cancer": "Water",
    "Leo": "Fire",
    "Virgo": "Earth",
    "Libra": "Air",
    "Scorpio": "Water",
    "Sagittarius": "Fire",
    "Capricorn": "Earth",
    "Aquarius": "Air",
    "Pisces": "Water",
}

LUCKY_COLORS = {
    "Aries": ["Red", "Gold"],
    "Taurus": ["Green"],
    "Gemini": ["Yellow"],
    "Cancer": ["White", "Silver"],
    "Leo": ["Orange", "Gold"],
    "Virgo": ["Brown", "Green", "Beige"],
    "Libra": ["Pink", "Light Blue"],
    "Scorpio": ["Black"],
    "Sagittarius": ["Purple"],
    "Capricorn": ["Dark Blue", "Gray"],
    "Aquarius": ["Blue", "Electric Blue"],
    "Pisces": ["Sea Green", "Lavender", "Yellow"],
}

LUCKY_GODS = {
    "Aries": "Shiva",
    "Taurus": "Lakshmi",
    "Gemini": "Durga",
    "Cancer": "Parvati",
    "Leo": "Surya",
    "Virgo": "Ganesha",
    "Libra": "Saraswati",
    "Scorpio": "Hanuman",
    "Sagittarius": "Vishnu",
    "Capricorn": "Shani",
    "Aquarius": "Lord Rama",
    "Pisces": "Lord Krishna",
}

LUCKY_METAL_BY_ELEMENT = {
    "Fire": "Gold",
    "Earth": "Copper",
    "Air": "Silver",
    "Water": "Silver",
}


def _reduce_number(value: int) -> int:
    value = abs(value)
    while value > 9 and value not in MASTER_NUMBERS:
        value = sum(int(ch) for ch in str(value))
    return value


def _letter_sum(name: str) -> int:
    return sum(LETTER_VALUES.get(ch.upper(), 0) for ch in name if ch.isalpha())


def _destiny_number(full_name: str) -> Optional[int]:
    total = _letter_sum(full_name)
    return _reduce_number(total) if total else None


def _name_number(full_name: str) -> Optional[int]:
    first = full_name.split()[0] if full_name else ""
    total = _letter_sum(first)
    return _reduce_number(total) if total else None


def _life_path_number(date_str: str) -> int:
    digits = [int(ch) for ch in date_str if ch.isdigit()]
    return _reduce_number(sum(digits))


def _friendly_numbers(primary: Optional[int]) -> List[int]:
    if not primary:
        return []
    return FRIENDLY_NUMBERS.get(primary, [])


def _evil_number(primary: Optional[int]) -> Optional[int]:
    if not primary:
        return None
    non_friendly = [n for n in range(1, 10) if n not in FRIENDLY_NUMBERS.get(primary, []) and n != primary]
    return non_friendly[0] if non_friendly else None


def _neutral_numbers(primary: Optional[int]) -> List[int]:
    if not primary:
        return []
    friendly = set(FRIENDLY_NUMBERS.get(primary, []))
    return [n for n in range(1, 10) if n not in friendly and n != primary][:4]


def _format_offset(tz_offset: float) -> str:
    sign = "+" if tz_offset >= 0 else "-"
    hours = int(abs(tz_offset))
    minutes = round((abs(tz_offset) - hours) * 60)
    return f"UTC{sign}{hours:02d}:{minutes:02d}"


def _kendra_houses() -> List[int]:
    return [1, 4, 7, 10]


def _is_planet_between(planet_lon: float, start: float, end: float) -> bool:
    start = start % 360
    end = end % 360
    planet_lon = planet_lon % 360
    if start <= end:
        return start <= planet_lon <= end
    return planet_lon >= start or planet_lon <= end


def _lagna_grid(chart: Dict[str, Any]) -> List[List[str]]:
    values: List[List[str]] = []
    for row in range(3):
        row_vals = []
        for col in range(4):
            house_num = row * 4 + col + 1
            house = chart["houses"].get(house_num, {})
            planets = ", ".join(_planet_names(house.get("planets", [])))
            label = planets if planets else "-"
            row_vals.append(f"H{house_num}: {label}")
        values.append(row_vals)
    return values


def compute_planet_table(chart: Dict[str, Any], jd_ut: float) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    planet_positions: Dict[str, Any] = chart["planet_positions"]
    for planet, data in planet_positions.items():
        sidereal = data["sidereal"]
        lon = sidereal["lon"]
        sign_index = get_sign_index(lon)
        sign_name = ZODIAC_SIGNS[sign_index]
        sign_lord = _sign_lord(sign_name)
        nak = compute_nakshatra_from_lon(lon)
        entries.append(
            {
                "planet": planet,
                "retrograde": data["sidereal"].get("speed_lon", 0) < 0,
                "sign": sign_name,
                "sign_lord": sign_lord,
                "degree": round(lon, 2),
                "nakshatra": nak["nakshatra_name"],
                "nakshatra_pada": nak["pada"],
                "nakshatra_lord": _sign_lord(nak["nakshatra_name"]),
                "house": next((h for h, info in chart["houses"].items() if planet in _planet_names(info.get("planets", []))), None),
            }
        )
    return entries


def _sign_lord(sign_name: str) -> str:
    mapping = {
        "Aries": "Mars",
        "Taurus": "Venus",
        "Gemini": "Mercury",
        "Cancer": "Moon",
        "Leo": "Sun",
        "Virgo": "Mercury",
        "Libra": "Venus",
        "Scorpio": "Mars",
        "Sagittarius": "Jupiter",
        "Capricorn": "Saturn",
        "Aquarius": "Saturn",
        "Pisces": "Jupiter",
        # Nakshatra fallbacks (only a subset used)
        "Ashwini": "Ketu",
        "Bharani": "Venus",
        "Krittika": "Sun",
        "Rohini": "Moon",
        "Mrigashira": "Mars",
        "Ardra": "Rahu",
        "Punarvasu": "Jupiter",
        "Pushya": "Saturn",
        "Ashlesha": "Mercury",
        "Magha": "Ketu",
        "Purva Phalguni": "Venus",
        "Uttara Phalguni": "Sun",
        "Hasta": "Moon",
        "Chitra": "Mars",
        "Swati": "Rahu",
        "Vishakha": "Jupiter",
        "Anuradha": "Saturn",
        "Jyeshtha": "Mercury",
        "Mula": "Ketu",
        "Purva Ashadha": "Venus",
        "Uttara Ashadha": "Sun",
        "Shravana": "Moon",
        "Dhanishta": "Mars",
        "Shatabhisha": "Rahu",
        "Purva Bhadrapada": "Jupiter",
        "Uttara Bhadrapada": "Saturn",
        "Revati": "Mercury",
    }
    return mapping.get(sign_name, "")


def compute_numerology(name: str, date_str: str, moon_sign: str) -> Dict[str, Any]:
    destiny = _destiny_number(name)
    life_path = _life_path_number(date_str)
    moolank = _reduce_number(int(date_str.split("-")[2]))
    friendly = _friendly_numbers(destiny)
    evil = _evil_number(destiny)
    neutral = _neutral_numbers(destiny)
    mantra = LUCKY_MANTRAS.get(moolank, "")
    lucky_day = LUCKY_DAYS.get(moolank, [])
    stone, substone = LUCKY_STONES.get(moolank, ("", ""))
    colors = LUCKY_COLORS.get(moon_sign, [])
    element = SIGN_ELEMENTS.get(moon_sign, "Air")
    lucky_metal = LUCKY_METAL_BY_ELEMENT.get(element, "Silver")
    return {
        "destiny_number": destiny,
        "name_number": _name_number(name),
        "life_path_number": life_path,
        "radical_number": moolank,
        "friendly_numbers": friendly,
        "evil_number": evil,
        "neutral_numbers": neutral,
        "lucky_day": lucky_day,
        "lucky_mantra": mantra,
        "lucky_stone": stone,
        "lucky_substone": substone,
        "lucky_color": colors,
        "lucky_metal": lucky_metal,
        "lucky_god": LUCKY_GODS.get(moon_sign, "Shiva"),
        "radical_ruler": RADICAL_RULER.get(moolank),
    }


def analyze_doshas(chart: Dict[str, Any]) -> Dict[str, Any]:
    # Extract simplified planets dict for the new checkers
    planets_simple = {}
    for p, data in chart["planet_positions"].items():
        # Get house number for this planet
        # In build_rashi_chart, houses are 1-indexed
        for h_num, h_data in chart["houses"].items():
            if p in _planet_names(h_data.get("planets", [])):
                planets_simple[p] = {
                    "sign": h_data["sign_name"],
                    "house": h_num,
                    "lon": data["sidereal"]["lon"]
                }
                break

    # Get Moon and Saturn house/sign for Sade Sati and Manglik
    moon_house = planets_simple.get("Moon", {}).get("house", 1)
    moon_sign = planets_simple.get("Moon", {}).get("sign", "Aries")
    saturn_sign = planets_simple.get("Saturn", {}).get("sign", "Aries")
    
    # 1. Kalsarpa
    kalsarpa_res = check_kalsarpa_dosha(planets_simple)
    
    # 2. Manglik
    # lagna_house is always 1 in North Indian chart definition relative to itself
    manglik_res = check_manglik_dosha(planets_simple, lagna_house=1, moon_house=moon_house)
    
    # 3. Pitra
    pitra_res = check_pitra_dosha(planets_simple)
    
    # 4. SadeSati
    sadesati_res = check_sadesati(moon_sign, saturn_sign)
    
    # Calculate detailed cycles for PDF/Interactive
    from astronomy.julian import julian_to_datetime
    birth_dt = julian_to_datetime(chart.get("jd_ut", 0))
    from astrology.sade_sati import calculate_all_life_cycles
    from core.utils import ZODIAC_SIGNS
    try:
        moon_sign_idx = ZODIAC_SIGNS.index(moon_sign)
    except:
        moon_sign_idx = 0
    sadesati_cycles = calculate_all_life_cycles(moon_sign_idx, birth_dt.year)

    return {
        "manglik": {
            "dosha": "Manglik",
            "present": manglik_res["present"],
            "summary": "Manglik Dosha detected" if manglik_res["present"] else "Manglik Dosha not detected",
            "details": [
                f"Mars in house {manglik_res.get('house', 'N/A')} creates Manglik influence." if manglik_res["present"] else "No harmful Mars placements found.",
                "Remedies like Hanuman Chalisa are recommended." if manglik_res["present"] else "No action needed."
            ],
            "score": 50 if manglik_res["present"] else 0 # Simple score for severity_bucket
        },
        "kalsarpa": {
            "dosha": "Kalsarpa",
            "present": kalsarpa_res["present"],
            "summary": "Kalsarpa Dosha detected" if kalsarpa_res["present"] else "Kalsarpa Dosha not present",
            "details": [
                f"Span: {kalsarpa_res.get('span', 'N/A')}" if kalsarpa_res["present"] else "Planets are well distributed.",
            ],
            "score": 60 if kalsarpa_res["present"] else 0
        },
        "sadesati": {
            "dosha": "SadeSati",
            "present": sadesati_res["present"],
            "summary": f"Sade Sati ({sadesati_res.get('phase', '')} phase) active" if sadesati_res["present"] else "Sade Sati not active",
            "details": [
                f"Currently in {sadesati_res.get('phase', 'unknown')} phase." if sadesati_res["present"] else "Saturn is in a favorable position relative to Moon.",
            ],
            "phase": sadesati_res.get("phase", "none"),
            "all_cycles": sadesati_cycles
        },
        "pitra": {
            "dosha": "Pitra",
            "present": pitra_res["present"],
            "summary": "Pitra Dosha detected" if pitra_res["present"] else "Pitra Dosha not observed",
            "details": [
                pitra_res.get("reason", "N/A") if pitra_res["present"] else "Ancestral blessings are strong.",
            ],
            "score": 40 if pitra_res["present"] else 0
        },
    }


def enrich_chart_for_analysis(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adds compatibility fields (lord, afflicted) to the chart/houses object
    to satisfy the rules in reports/interpretation/rules.py and domain_rules.
    """
    enriched = chart.copy()
    
    # 1. Add top-level "ascendant" key
    asc_sign = chart.get("ascendant_sign", "Aries")
    enriched["ascendant"] = {
        "sign": asc_sign,
        "lord": SIGN_LORDS.get(asc_sign, "Mars")
    }
    
    # 2. Add top-level "moon" key
    # Finding if Moon is co-present with malefics in its house
    moon_house_num = 1
    for h_num, h_data in chart["houses"].items():
        if "Moon" in _planet_names(h_data.get("planets", [])):
            moon_house_num = h_num
            break
    
    moon_house_planets = set(_planet_names(chart["houses"][moon_house_num].get("planets", [])))
    # Afflicted if Moon is with another malefic
    moon_afflicted = bool(moon_house_planets.intersection(MALEFICS - {"Moon"}))
    
    enriched["moon"] = {
        "afflicted": moon_afflicted
    }

    # 3. Enrich houses with "lord" and "afflicted"
    for h_num, h_data in enriched["houses"].items():
        h_data["lord"] = SIGN_LORDS.get(h_data["sign_name"], "Mars")
        # House is afflicted if it contains any malefics
        h_planets = set(_planet_names(h_data.get("planets", [])))
        h_data["afflicted"] = bool(h_planets.intersection(MALEFICS))
        
    return enriched

def build_predictions(sign: str) -> Dict[str, Dict[str, str]]:
    base = {
        "health": "Maintain a balanced routine—your sign benefits from rhythmic exercise and mindful diet.",
        "emotion": "Emotional tides may fluctuate; stay grounded through journaling or meditation.",
        "luck": "Unexpected opportunities appear when you stay consistent with daily goals.",
        "profession": "Strategize carefully—hidden advantages emerge through collaboration.",
        "personal_life": "Communicate openly with loved ones; patience dissolves minor friction.",
        "travel": "Short pilgrimages or knowledge-seeking journeys are favored under current transits.",
    }
    return {key: {"title": key.replace("_", " ").title(), "text": value + f" ({sign})"} for key, value in base.items()}


def summarize_dasha(jd_ut: float, chart: Dict[str, Any]) -> Dict[str, Any]:
    moon_lon = chart["planet_positions"]["Moon"]["sidereal"]["lon"]
    dashas = compute_vimshottari_full(jd_ut, moon_lon, years_ahead=120)
    def enrich(entry):
        start_dt = julian_to_datetime(entry["start_jd"])
        end_dt = julian_to_datetime(entry["end_jd"])
        entry["start_date"] = start_dt.strftime("%d/%m/%Y")
        entry["end_date"] = end_dt.strftime("%d/%m/%Y")
        
        # Enrich antardashas if present
        if "antardashas" in entry:
            for ad in entry["antardashas"]:
                ad_start_dt = julian_to_datetime(ad["start_jd"])
                ad_end_dt = julian_to_datetime(ad["end_jd"])
                ad["start_date"] = ad_start_dt.strftime("%d/%m/%Y")
                ad["end_date"] = ad_end_dt.strftime("%d/%m/%Y")
                
        return entry
    dashas = [enrich(dict(d)) for d in dashas]
    
    # Calculate current Julian Day (now)
    now_dt = datetime.now()
    now_jd = datetime_to_julian(now_dt)

    current_maha = None
    current_antar = None

    # Search for active Mahadasha and Antardasha corresponding to now_jd
    for d in dashas:
        if d.get("start_jd", 0) <= now_jd <= d.get("end_jd", 0):
            current_maha = d
            for ad in d.get("antardashas", []):
                if ad.get("start_jd", 0) <= now_jd <= ad.get("end_jd", 0):
                    current_antar = ad
                    break
            break

    # Fallback to first dasha if current date is outside calculation bounds
    if not current_maha and dashas:
        current_maha = dashas[0]
        if current_maha.get("antardashas"):
            current_antar = current_maha["antardashas"][0]

    current = {
        "mahadasha": {
            "planet": current_maha.get("lord") if current_maha else "",
            "start_date": current_maha.get("start_date") if current_maha else "",
            "end_date": current_maha.get("end_date") if current_maha else "",
        },
        "antardasha": {
            "planet": current_antar.get("lord") if current_antar else "",
            "start_date": current_antar.get("start_date") if current_antar else "",
            "end_date": current_antar.get("end_date") if current_antar else "",
        }
    } if current_maha else None

    return {
        "current": current,
        "list": dashas,
    }


def build_kundli_details(panchang_data: Dict[str, Any], name: str) -> List[Dict[str, str]]:
    return [
        {"label": "Nakshatra Lord", "value": _sign_lord(panchang_data["nakshatra"]["nakshatra_name"])},
        {"label": "Yog", "value": panchang_data["yoga"]["yoga_name"]},
        {"label": "Tithi", "value": panchang_data["tithi"]["tithi_name"]},
        {"label": "Tatva", "value": "Fire"},
        {"label": "Paya", "value": "Iron"},
        {"label": "Varna", "value": "Kshatriya"},
        {"label": "Sign Lord", "value": _sign_lord(panchang_data["nakshatra"]["nakshatra_name"])},
        {"label": "Yoni", "value": "Mesha"},
        {"label": "Charan", "value": str(panchang_data["nakshatra"]["pada"])},
        {"label": "Karan", "value": panchang_data["karana"]["karana_name"]},
        {"label": "Yunja", "value": "Poorva"},
        {"label": "Name Alphabet", "value": (name[:1] or "").title()},
        {"label": "Gan", "value": "Rakshasa"},
        {"label": "Nadi", "value": "Antya"},
        {"label": "Vashya", "value": "Chatuspad"},
        {"label": "Nakshatra", "value": panchang_data["nakshatra"]["nakshatra_name"]},
    ]


def assemble_report_data(
    name: str,
    date: str,
    time: str,
    tz_offset: float,
    lat: float,
    lon: float,
    *,
    gender: str = "",
    location_name: str = "",
    language: str = "en",
) -> Dict[str, Any]:
    # Check cache first - DISABLED TO ENSURE FRESH ENGLISH-ONLY DATA
    # cached_data = get_cached_chart(name, date, time, lat, lon)
    # if cached_data:
    #     return cached_data

    if len(time) <= 5:
        time += ":00"
    y, m, d = [int(x) for x in date.split("-")]
    hh, mm, ss = [int(x) for x in time.split(":")]
    dt_local = datetime(y, m, d, hh, mm, ss)
    dt_utc = dt_local - timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)

    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    chart["jd_ut"] = jd_ut
    panchang_data = {
        "tithi": compute_tithi(jd_ut),
        "nakshatra": compute_nakshatra(jd_ut),
        "yoga": compute_yoga(jd_ut),
        "karana": compute_karana(jd_ut),
    }
    moon_lon = chart["planet_positions"]["Moon"]["sidereal"]["lon"]
    moon_sign = get_sign_name(moon_lon)
    asc_sign = chart["ascendant_sign"]
    
    rahu_lon = chart["planet_positions"]["Rahu"]["sidereal"]["lon"]
    bb_diff = (moon_lon - rahu_lon) % 360
    bb_lon = (rahu_lon + (bb_diff / 2)) % 360
    bb_nak = compute_nakshatra_from_lon(bb_lon)
    bhrigu_bindu = {
        "lon": round(bb_lon, 4),
        "sign": get_sign_name(bb_lon),
        "nakshatra_name": bb_nak["nakshatra_name"]
    }
    
    # Calculate Dasha Start Planets based on Nakshatra
    nak_idx = panchang_data["nakshatra"]["nakshatra_index"] # 0-26
    
    # Shodashottari Start Planet logic
    if 7 <= nak_idx <= 10: shodasha_start = "Sun"
    elif 11 <= nak_idx <= 14: shodasha_start = "Mars"
    elif 15 <= nak_idx <= 18: shodasha_start = "Jupiter"
    elif 19 <= nak_idx <= 22: shodasha_start = "Saturn"
    elif 23 <= nak_idx <= 26: shodasha_start = "Ketu"
    elif 0 <= nak_idx <= 2: shodasha_start = "Moon"
    elif 3 <= nak_idx <= 5: shodasha_start = "Mercury"
    else: shodasha_start = "Venus" # Punarvasu (6)
    
    # Chaturshitisama Start Planet logic (Simple cyclical mapping)
    chatur_idx = (nak_idx % 7)
    chatur_start = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][chatur_idx]

    numerology = compute_numerology(name, date, moon_sign)
    
    # Use new analysis engines
    dosha = calculate_all_doshas(chart)
    strength = compute_shadbala_new(chart)
    yogas = detect_yogas(chart)
    
    # Calculate SAV scores and Bhava Bala (Shastiamsa-mapped) for houses
    av_result = {}
    try:
        from ashtakavarga.classical import compute_ashtakavarga_classical
        av_result = compute_ashtakavarga_classical(jd_ut, lat, lon)
        sarva_scores = av_result.get("sarvashtakavarga", [])
        
        for h_num in range(1, 13):
            h_key = str(h_num) if str(h_num) in chart["houses"] else h_num
            if h_key in chart["houses"]:
                if sarva_scores and len(sarva_scores) >= 12:
                    chart["houses"][h_key]["sav_score"] = sarva_scores[h_num - 1]
                
                # Shastiamsa mapping from house strength (0-100 to ~300-600 range)
                base_score = strength.get("houses", {}).get(h_num) or strength.get("houses", {}).get(str(h_num), 50)
                chart["houses"][h_key]["bhava_bala"] = round(base_score * 7.0, 2)
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        av_result = {"error": err}
        print(f"[API WARN] Failed to calculate SAV and Bhava Bala:\n{err}")

    predictions = build_predictions(asc_sign)
    predictions = build_predictions(asc_sign)
    dasha = summarize_dasha(jd_ut, chart)
    planet_table = compute_planet_table(chart, jd_ut)
    
    # 5D Life Map Generation
    life_map = build_5d_life_map(chart, dasha, dosha, strength)
    report_data_obj = {  # Internal tracker before dict merge
        "life_map": life_map
    }

    formatted_dt = dt_local.strftime("%d/%m/%Y | %I:%M %p")

    # Define all requested vargas
    varga_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16, 20, 24, 27, 30, 40, 45, 60]
    vargas = {}
    
    # 1. Specialized D10 Build (Iyer Method)
    from charts.divisional.d10 import build_d10_chart
    vargas["d10"] = build_d10_chart(
        jd_ut, lat, lon, 
        house_system="W", 
        style="north"
    )

    # 2. Other Vargas
    for d in varga_list:
        vargas[f"d{d}"] = build_varga_chart(
            d, jd_ut, lat, lon, 
            house_system="W", 
            style="north",
            planet_positions=chart["planet_positions"]
        )

    # Master Engine Analysis
    master_results = run_master_engine(chart, dasha)

    report_data: Dict[str, Any] = {
        "master_engine": master_results,
        "strength_analysis": strength,
        "life_map": life_map,
        # Core metadata used by PDF renderer and frontend
        "meta": {
            "name": name,
            "gender": gender or "Not specified",
            "location": location_name or "Unknown",
            "language": language,
            "birth_datetime": formatted_dt,
            "timezone": _format_offset(tz_offset),
            "ascendant": asc_sign,
            "moon_sign": moon_sign,
            "nakshatra": panchang_data["nakshatra"]["nakshatra_name"],
            "sunrise": "06:12 AM", # Placeholder or compute if available
            "sunset": "06:45 PM",  # Placeholder or compute if available
        },
        # Basic details + technical fields needed later for chart rendering
        "basic_details": {
            "name": name,
            "birth_date": date,
            "birth_time": time,
            "birth_datetime": formatted_dt,
            "birth_place": location_name or f"{lat:.2f}, {lon:.2f}",
            "gender": gender or "Not specified",
            "nakshatra": panchang_data["nakshatra"]["nakshatra_name"],
            "ascendant": asc_sign,
            "sign": moon_sign,
            # fields required by _render_charts_from_report_data for
            # building divisional charts and Ashtakavarga
            "lat": lat,
            "lon": lon,
            "jd_ut": jd_ut,
        },
        "kundli_details": build_kundli_details(panchang_data, name),
        "favourable": {
            "numerology": numerology,
            "date": formatted_dt.split("|")[0].strip(),
        },
        "predictions": predictions,
        "planet_positions": planet_table,
        "dosha": dosha,
        "strength": strength,
        "yogas": yogas,
        "dasha": dasha,
        "shodashottari": compute_shodashottari(start_planet=shodasha_start), 
        "chaturshitisama": compute_chaturshitisama(start_planet=chatur_start),
        "ashtottari": compute_ashtottari(),
        "dwisaptatisama": compute_dwisaptatisama(moon_lon),
        "dwadashottari": compute_dwadashottari(moon_lon),
        "panchottari": compute_panchottari(),
        "shatabdika": compute_shatabdika(moon_lon),
        "shashtihayani": compute_shastihayani(),
        "chara": compute_chara(),
        "sthira": compute_sthira(),
        "shoola": compute_shoola(),
        "niryaana_shoola": compute_niryaana_shoola(),
        "drig": compute_drig(),
        "mandooka": compute_mandooka(),
        "sudasha": compute_sudasha(),
        "yogini": compute_yogini_full(jd_ut, moon_lon, years_ahead=108.0),
        "panchang": panchang_data,
        "charts": {
            "lagna_grid": _lagna_grid(chart),
            "houses": chart["houses"],
        },
        # Expose full D1 chart and jd_ut at top level for convenience
        "chart": chart,
        "vargas": vargas, # All 16 vargas included here
        "jd_ut": jd_ut,
        "bhrigu_bindu": bhrigu_bindu,
        "ashtakavarga": av_result,
        "sphuta_drishti": calculate_sphuta_drishti_matrix(chart),
    }
    # --- Calculate Maraka (Death-Inflicting) Periods ---
    lagna_sign = chart.get("houses", {}).get("1", {}).get("sign_name", "Aries")
    try:
        lagna_idx = ZODIAC_SIGNS.index(lagna_sign)
    except ValueError:
        lagna_idx = 0
    
    # 2nd, 7th, 8th signs from Lagna
    maraka_sign_2 = ZODIAC_SIGNS[(lagna_idx + 1) % 12]
    maraka_sign_7 = ZODIAC_SIGNS[(lagna_idx + 6) % 12]
    maraka_sign_8 = ZODIAC_SIGNS[(lagna_idx + 7) % 12]
    
    maraka_planet_2 = SIGN_LORDS.get(maraka_sign_2)
    maraka_planet_7 = SIGN_LORDS.get(maraka_sign_7)
    
    report_data["maraka"] = {
        "signs": [maraka_sign_2, maraka_sign_7, maraka_sign_8],
        "planets": [maraka_planet_2, maraka_planet_7]
    }

    # --- New Analytic Fields ---
    # 1. Strength (Shadbala) - Keep old detailed version for planet_strength
    shadbala_res = compute_shadbala_old(jd_ut, lat, lon, house_system="W")
    # Simple strength map for rules.py: { "Sun": 45.2, ... }
    simple_strength = {p: data["total"] for p, data in shadbala_res["planets"].items()}
    report_data["planet_strength"] = shadbala_res["planets"]
    
    # Calculate Professional Vimsopaka Assessment (Steps 1-12)
    vimsopaka_assessment = run_vimsopaka_assessment(vargas, chart, dasha)
    report_data["vimsopaka_bala"] = vimsopaka_assessment["vimsopaka_bala"]
    report_data["vimsopaka_assessment"] = vimsopaka_assessment
    
    gemstones = recommend_gemstones(chart, strength, dasha)
    report_data["gemstones"] = gemstones
    
    # 2. Predictions - Pro Engine with Scoring and Specialized Detections
    pro_data = build_pro_predictions(chart, dasha, dosha, strength)
    life_areas = build_life_area_predictions(chart, strength, dosha)
    ai_summary = build_ai_summary(life_areas, pro_data["timeline"])
    
    report_data["timeline"] = pro_data["timeline"]
    report_data["fortune_peaks"] = pro_data["fortune_peaks"]
    report_data["marriage_windows"] = pro_data["marriage_windows"]
    report_data["wealth_periods"] = pro_data["wealth_periods"]
    report_data["life_areas"] = life_areas
    report_data["ai_summary"] = ai_summary
    
    # Planetary Relationships Integration
    try:
        planet_positions_map = {
            p: {"house": data["house"], "sign": get_sign_name(data["sidereal"]["lon"])}
            for p, data in chart["planet_positions"].items()
            if p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        }
        fm = FriendshipMatrix()
        relationships = fm.calculate_all_relationships(planet_positions_map)
        report_data["planetary_relationships"] = relationships
    except Exception as e:
        print(f"[API WARN] Failed to compute planetary relationships: {e}")
        report_data["planetary_relationships"] = {}

    # Shodashvarga Summary for Frontend Tables
    try:
        shodashvarga_keys = ['d1', 'd2', 'd3', 'd4', 'd7', 'd9', 'd10', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60']
        PLANETS_LIST = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        shodashvarga_summary = {}
        from core.analysis.shadbala_engine import get_compound_dignity
        abbr_map = {
            "EXALTED": "Exalt.", "MOOLATRIKONA": "Moolt.", "OWN_SIGN": "Own",
            "GREAT_FRIEND": "Grt.Fr.", "FRIEND": "Frnd.", "NEUTRAL": "Neutr.",
            "ENEMY": "Enemy", "GREAT_ENEMY": "Grt.En.", "DEBILITATED": "Debil."
        }
        for v_id in shodashvarga_keys:
            v_data = vargas.get(v_id)
            if not v_data: continue
            
            signs = {"Lagna": v_data.get("ascendant_sign", "")}
            dignities = {}
            for p in PLANETS_LIST:
                v_pos = v_data.get("varga_positions", {}).get(p, {})
                sign_name = v_pos.get("sign_name", "")
                signs[p] = sign_name
                
                if sign_name:
                    dig = get_compound_dignity(chart, p, sign_name)
                    dignities[p] = abbr_map.get(dig, "Neutr.")
                else:
                    dignities[p] = ""
                    
            shodashvarga_summary[v_id] = {"signs": signs, "dignities": dignities}
        report_data["shodashvarga_summary"] = shodashvarga_summary
        
        # Planetary Avasthas
        def calc_avasthas(chart, d1_dignities, time_str):
            try:
                h, m = [int(x) for x in time_str.split(":")[:2]]
                time_in_hours = h + m/60.0
            except:
                time_in_hours = 12.0
            
            ishta_ghati = int(max(0, (time_in_hours - 6.0) * 2.5))
            if time_in_hours < 6:
                ishta_ghati = int(((24 + time_in_hours) - 6.0) * 2.5)

            moon_lon = chart["planet_positions"]["Moon"]["sidereal"]["lon"]
            birth_nak = int(moon_lon / (360/27)) + 1
            lagna_num = chart["ascendant_sign_index"] + 1
            
            planets_list = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
            p_nums = {"Sun": 1, "Moon": 2, "Mars": 3, "Mercury": 4, "Jupiter": 5, "Venus": 6, "Saturn": 7, "Rahu": 8, "Ketu": 9}
            
            signs = {}
            for p in planets_list:
                lon = chart["planet_positions"][p]["sidereal"]["lon"]
                signs[p] = int(lon / 30)
                
            avasthas = {}
            for p in planets_list:
                lon = chart["planet_positions"][p]["sidereal"]["lon"]
                sign_idx = signs[p]
                dig = d1_dignities.get(p, "Neutr.")
                
                # 1. Jagradadi
                if dig in ["Exalt.", "Own"]: jagrad = "Jagrad\n(Wakefulness)"
                elif dig in ["Grt.Fr.", "Frnd.", "Neutr."]: jagrad = "Swapna\n(Dreamful)"
                else: jagrad = "Sushupti\n(State of sleep)"
                
                # 2. Baladi
                deg = lon % 30
                is_even = sign_idx % 2 != 0 
                idx = int(deg / 6)
                if is_even: idx = 4 - idx
                baladi_names = ["Balavastha\n(Childhood)", "Kumaravastha\n(Adolescence)", "Yuvavastha\n(Adulthood)", "Vriddhavastha\n(Old age)", "Mrita\n(State of death)"]
                baladi = baladi_names[idx] if idx < 5 else baladi_names[4]
                
                # 3. Lajjitadi
                conjuncts = [other for other in planets_list if other != p and signs[other] == sign_idx]
                lajjitadi_list = []
                house = (sign_idx - chart["ascendant_sign_index"]) % 12 + 1
                if house == 5 and any(m in conjuncts for m in ["Sun", "Saturn", "Mars", "Rahu", "Ketu"]):
                    lajjitadi_list.append("Lajjit")
                if dig in ["Exalt.", "Moolt."]: lajjitadi_list.append("Garvit")
                if dig in ["Enemy", "Grt.En."] or "Saturn" in conjuncts: lajjitadi_list.append("Kshudit")
                if sign_idx in [3, 7, 11]: lajjitadi_list.append("Trushit")
                if dig in ["Frnd.", "Grt.Fr."] or "Jupiter" in conjuncts: lajjitadi_list.append("Mudit")
                if "Sun" in conjuncts: lajjitadi_list.append("Kshobhit")
                    
                if not lajjitadi_list: lajjitadi = ""
                else: lajjitadi = " ".join(list(set(lajjitadi_list)))
                    
                # 4. Deeptadi
                deeptadi_map = {
                    "Exalt.": "Deepta\n(Luminous)", "Moolt.": "Swastha\n(Stable)", "Own": "Swastha\n(Stable)",
                    "Grt.Fr.": "Pramudita\n(Joyful)", "Frnd.": "Shanta\n(Quiescent)", "Neutr.": "Deena\n(Deficient)",
                    "Enemy": "Dukhi\n(Tormented)", "Grt.En.": "Vikala\n(Crippled)", "Debil.": "Khala\n(Base)"
                }
                deeptadi = deeptadi_map.get(dig, "Deena\n(Deficient)")
                
                # 5. Shyanadi
                p_num = p_nums[p]
                nak_num = int(lon / (360/27)) + 1
                nav_num = int(lon / (360/108)) % 9 + 1
                s = (nak_num * p_num * nav_num) + ishta_ghati + birth_nak + lagna_num
                s = s % 12
                if s == 0: s = 12
                
                shyanadi_names = {
                    1: "Shayana\n(Recumbent)", 2: "Upaveshana\n(Sitting)", 3: "Netrapani\n(Hands on eyes)",
                    4: "Prakashana\n(Luminous)", 5: "Gamana\n(Going)", 6: "Agamana\n(Arriving)",
                    7: "Sabhayam Vasti\n(In an assembly)", 8: "Agama\n(Returning)", 9: "Bhojana\n(Eating)",
                    10: "Nritya Lipsa\n(Desirous of dancing)", 11: "Kautaka\n(Delight)", 12: "Nidra\n(Sleeping)"
                }
                
                avasthas[p] = {
                    "jagradadi": jagrad, "baladi": baladi, "lajjitadi": lajjitadi,
                    "deeptadi": deeptadi, "shyanadi": shyanadi_names[s]
                }
            return avasthas
            
        report_data["planetary_avasthas"] = calc_avasthas(chart, shodashvarga_summary.get("d1", {}).get("dignities", {}), time)
    except Exception as e:
        print(f"[API WARN] Failed to compute shodashvarga_summary: {e}")
        report_data["shodashvarga_summary"] = {}

    # Aspects Data
    try:
        def calc_aspects_data(chart_obj):
            planets_list = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
            def get_lon(p):
                return chart_obj["planet_positions"][p]["sidereal"]["lon"]
            def calc_virupa(diff, p):
                if 0 <= diff < 30: v = 0
                elif 30 <= diff < 60: v = (diff - 30) / 2
                elif 60 <= diff < 90: v = (diff - 60) + 15
                elif 90 <= diff < 120: v = (120 - diff) / 2 + 30
                elif 120 <= diff < 150: v = 150 - diff
                elif 150 <= diff < 180: v = (diff - 150) * 2
                elif 180 <= diff < 300: v = (300 - diff) / 2
                else: v = 0
                if p == "Mars":
                    if 90 <= diff < 120: v = 150 - diff
                    elif 210 <= diff < 240: v = 270 - diff
                elif p in ["Jupiter", "Rahu", "Ketu"]:
                    if 120 <= diff < 150: v = 180 - diff
                    elif 240 <= diff < 270: v = 300 - diff
                elif p == "Saturn":
                    if 30 <= diff < 60: v = (diff - 30) * 2
                    elif 60 <= diff < 90: v = 90 - diff / 2
                    elif 270 <= diff < 300: v = (300 - diff) * 2
                return max(0, int(round(v)))

            def calc_fraction(diff, p):
                house = int(diff // 30) + 1
                frac = ""
                if house in [3, 10]: frac = "1/4"
                elif house in [5, 9]: frac = "1/2"
                elif house in [4, 8]: frac = "3/4"
                elif house == 7: frac = "4/4"
                if p == "Mars" and house in [4, 8]: frac = "4/4"
                elif p in ["Jupiter", "Rahu", "Ketu"] and house in [5, 9]: frac = "4/4"
                elif p == "Saturn" and house in [3, 10]: frac = "4/4"
                return frac

            aspects_planets = []
            for aspected in planets_list:
                row = {"aspected": aspected, "lon": get_lon(aspected), "aspects": {}}
                for aspecting in planets_list:
                    if aspecting == aspected:
                        row["aspects"][aspecting] = {"virupa": 0, "fraction": ""}
                        continue
                    diff = (get_lon(aspected) - get_lon(aspecting)) % 360
                    row["aspects"][aspecting] = {"virupa": calc_virupa(diff, aspecting), "fraction": calc_fraction(diff, aspecting)}
                aspects_planets.append(row)

            aspects_bhavas = []
            bhava_names = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"]
            for h in range(1, 13):
                h_lon = chart_obj["houses"][h].get("cusp_deg", 0)
                if h_lon is None: h_lon = 0
                row = {"aspected": bhava_names[h-1], "lon": h_lon, "aspects": {}}
                for aspecting in planets_list:
                    diff = (h_lon - get_lon(aspecting)) % 360
                    row["aspects"][aspecting] = {"virupa": calc_virupa(diff, aspecting), "fraction": calc_fraction(diff, aspecting)}
                aspects_bhavas.append(row)
            return {"planets": aspects_planets, "bhavas": aspects_bhavas}
            
        report_data["aspects_data"] = calc_aspects_data(chart)
    except Exception as e:
        print(f"[API WARN] Failed to compute aspects_data: {e}")
        report_data["aspects_data"] = {"planets": [], "bhavas": []}

    # Ashtakavarga Reductions
    try:
        def calc_av_reductions(rashi_chart, av_chart_input, bhinna_breakdown):
            planets_for_av = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Ascendant"]
            reductions = {}
            
            # Identify which signs have planets (for Ekadhipatya and Graha Pinda)
            # Only count Sun to Saturn for Ekadhipatya rules in standard BPHS
            occupied_signs = set()
            planet_signs = {}
            for p, data in rashi_chart["planet_positions"].items():
                s = get_sign_index(data["sidereal"]["lon"])
                planet_signs.setdefault(s, []).append(p)
                occupied_signs.add(s)
            
            rasi_mult = {0: 7, 1: 10, 2: 8, 3: 4, 4: 10, 5: 5, 6: 7, 7: 8, 8: 9, 9: 5, 10: 11, 11: 12}
            graha_mult = {"Sun": 5, "Moon": 5, "Mars": 8, "Mercury": 5, "Jupiter": 10, "Venus": 7, "Saturn": 5}
            
            for p in planets_for_av:
                if p not in bhinna_breakdown:
                    continue
                # Raw bindus per sign (0-11)
                before = {}
                for s in range(12):
                    before[s] = sum(bhinna_breakdown[p][s].values()) if s in bhinna_breakdown[p] else 0
                
                # Trikona Reduction
                trikona = {}
                for trine in [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]]:
                    v = [before[s] for s in trine]
                    if 0 in v:
                        for s in trine: trikona[s] = before[s]
                    elif v[0] == v[1] == v[2]:
                        for s in trine: trikona[s] = 0
                    else:
                        m = min(v)
                        for s in trine: trikona[s] = before[s] - m
                
                # Ekadhipatya Reduction
                ekadhipatya = dict(trikona)
                pairs = [(0, 7), (1, 6), (2, 5), (8, 11), (9, 10)] # Mars, Venus, Mercury, Jupiter, Saturn
                for s1, s2 in pairs:
                    v1, v2 = ekadhipatya[s1], ekadhipatya[s2]
                    p1, p2 = s1 in occupied_signs, s2 in occupied_signs
                    
                    if p1 and p2:
                        pass # No reduction
                    elif not p1 and not p2:
                        if v1 == v2:
                            ekadhipatya[s1] = ekadhipatya[s2] = 0
                        else:
                            m = min(v1, v2)
                            ekadhipatya[s1] = ekadhipatya[s2] = m
                    elif p1 and not p2:
                        if v2 > v1: ekadhipatya[s2] = v1
                        else: ekadhipatya[s2] = 0
                    elif p2 and not p1:
                        if v1 > v2: ekadhipatya[s1] = v2
                        else: ekadhipatya[s1] = 0
                
                # Pindas
                rashi_pinda = sum(ekadhipatya[s] * rasi_mult[s] for s in range(12))
                graha_pinda = 0
                for s in range(12):
                    if s in planet_signs:
                        for graha in planet_signs[s]:
                            if graha in graha_mult:
                                graha_pinda += ekadhipatya[s] * graha_mult[graha]
                
                reductions[p] = {
                    "before": before,
                    "trikona": trikona,
                    "ekadhipatya": ekadhipatya,
                    "rashi_pinda": rashi_pinda,
                    "graha_pinda": graha_pinda,
                    "sodhya_pinda": rashi_pinda + graha_pinda
                }
            return reductions

        av_chart_input = {}
        for p_name, p_data in chart["planet_positions"].items():
            if p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
                av_chart_input[p_name] = get_sign_index(p_data["sidereal"]["lon"])
        av_chart_input["Ascendant"] = chart["ascendant_sign_index"]
        
        # Calculate reductions on the fly
        from ashtakavarga import Bhinnashtakavarga
        bhinna_calc = Bhinnashtakavarga().calculate(av_chart_input)
        
        existing_av = report_data.get("ashtakavarga", {})
        existing_av.update({
            "bhinna_breakdown": bhinna_calc["breakdown"],
            "bhinna": bhinna_calc["sums"]
        })
        report_data["ashtakavarga"] = existing_av
        
        report_data["av_reductions"] = calc_av_reductions(chart, av_chart_input, bhinna_calc["breakdown"])
        
    except Exception as e:
        print(f"[API WARN] Failed to compute AV reductions: {e}")
        report_data["av_reductions"] = {}

    # 3. Ultra Engine - Advanced Analysis
    ultra = build_ultra_predictions(chart, dasha, dosha, strength)
    report_data["ultra"] = ultra
    
    # 4. Supreme Engine - Ultimate AI-Powered Analysis
    d9 = vargas.get("d9")
    supreme = build_supreme_engine(chart, d9, strength, dosha, dasha)
    report_data["supreme"] = supreme
    report_data["ishta_devata"] = calculate_ishta_devata(chart, d9) if d9 else None
    
    # 5. Cosmic Engine - Final Layer with Yogini Dasha and Advanced Predictions
    cosmic = build_cosmic_engine(chart, strength, dosha, dasha, supreme)
    report_data["cosmic"] = cosmic
    
    # 6. Sentient Engine - Soul Archetype and Destiny Analysis
    sentient = run_sentient_engine(chart, strength, dosha, cosmic)
    report_data["sentient"] = sentient

    # 7. Akashic Engine - Soul Record and Karma Cycles
    akashic = run_akashic_engine(chart, strength, dosha, cosmic, sentient)
    report_data["akashic"] = akashic

    # 8. Omniscient Engine - Ultimate Prediction Fusion & Intelligence
    omniscient = run_omniscient_engine(
        chart,
        strength,
        dosha,
        akashic,
        report_data.get("timeline_predictions", {}),
        report_data.get("predictions", {}),
        report_data.get("yogas", [])
    )
    report_data["omniscient"] = omniscient

    # 8.5 Maharishi Engine - Classical Wisdom & Fortune
    maharishi = run_maharishi_engine(
        chart,
        strength,
        dosha,
        dasha,
        omniscient
    )
    report_data["maharishi"] = maharishi

    # 8.6 Brahma Engine - Destiny Creation & Karmic Evolution
    brahma = run_brahma_engine(
        chart,
        strength,
        dosha,
        dasha,
        maharishi,
        omniscient
    )
    report_data["brahma"] = brahma
    
    # 9. Quantum Engine - Age Windows & Destiny Graph
    quantum = {}
    try:
        quantum = build_quantum_timeline(chart, dasha, dosha, strength)
        report_data["quantum"] = quantum
        
        # Generate Destiny Timeline SVG
        destiny_svg = "reports/images/destiny_timeline.svg"
        render_destiny_timeline(
            quantum.get("destiny_graph", []),
            destiny_svg,
            theme="gold"
        )
        report_data["destiny_svg"] = destiny_svg
    except Exception as e:
        print(f"Error generating quantum timeline or SVG: {e}")

    # 9.2 Cosmic Life Wheel - Radial Domain Analysis
    try:
        # Calculate domain scores    
        life_scores = compute_life_map(
            report_data.get("chart"),
            report_data.get("strength", {}),
            report_data.get("dosha", {}),
            report_data.get("predictions", {}),
        )
        report_data["life_wheel_scores"] = life_scores
        
        # Generate Wheel SVG
        life_svg = "reports/images/cosmic_life_map.svg"
        render_cosmic_life_map(
            life_scores,
            life_svg,
            theme="gold"
        )
        report_data["life_map_svg"] = life_svg
        # For backward compatibility if needed by PDF generator until updated
        report_data["life_wheel_svg"] = life_svg 
    except Exception as e:
        print(f"Error generating Cosmic Life Wheel: {e}")

    # 9.3 Destiny Matrix - Comparative Life Curves
    try:
        matrix = compute_destiny_matrix(
            report_data.get("chart"),
            report_data.get("dasha", {}),
            report_data.get("dosha", {}),
            report_data.get("strength", {}),
        )

        matrix_svg = "reports/images/destiny_matrix.svg"
        render_destiny_matrix(matrix, matrix_svg)
        report_data["destiny_matrix_svg"] = matrix_svg
    except Exception as e:
        print(f"Error generating Destiny Matrix: {e}")

    # 9.4 Event Forecast Grid - Probabilistic Life Path
    try:
        forecast = build_event_forecast_grid(
            report_data.get("chart"),
            report_data.get("dasha", {}),
            report_data.get("dosha", {}),
            report_data.get("strength", {}),
        )

        forecast_svg = "reports/images/event_forecast.svg"
        render_event_forecast_grid(forecast, forecast_svg)
        report_data["event_forecast_svg"] = forecast_svg
        report_data["event_forecast_grid"] = forecast
    except Exception as e:
        print(f"Error generating Event Forecast Grid: {e}")

    # 10. Dimensional Engine - Multi-Dimensional Destiny Analysis
    dimensional = run_dimensional_engine(
        chart,
        dasha,
        strength,
        dosha,
        report_data.get("timeline_predictions", {}),
        quantum
    )
    report_data["dimensional"] = dimensional

    # 11. Astral Matrix Engine - Subtle Destiny & Karma Patterns
    astral = run_astral_matrix_engine(
        chart,
        dasha,
        dosha,
        strength,
        dimensional
    )
    report_data["astral_matrix"] = astral

    # 12. Cosmic Core Engine - Soul Alignment & Universal Purpose
    cosmic_core = run_cosmic_core(
        chart,
        strength,
        dosha,
        astral,
        quantum
    )
    report_data["cosmic_core"] = cosmic_core

    # --- New Engines Integration (Expanding report to 120 pages) ---

    # 13. Karma Simulator - Destiny Curve & Phase Classification
    report_data = run_karma_engine_base(report_data, 2025, 2045) # Expanded range

    # 14. Destiny Engine - Domain Graphs & SVG Rendering
    report_data = run_destiny_engine(report_data)

    # 16. Transit Engine - Real-Time Events
    report_data = detect_transit_events(report_data)

    # 17. Destiny Timeline - 20-Year Probability Curve
    report_data = build_destiny_timeline(report_data)

    # 18. Probability Matrix Engine (Base)
    try:
        report_data["probability_matrix"] = build_probability_matrix(
            report_data.get("chart"),
            report_data.get("dasha", {}),
            report_data.get("dosha", {}),
            report_data.get("strength", {}),
            [] # Events not yet detected
        )
    except Exception as e:
        print(f"Error building probability matrix: {e}")

    # 19. Life Event Detector (Ultra + New Engine)
    try:
        # Use new simplified engine as base for Life Event Predictions (2025-2035)
        new_events = detect_events(chart, dasha)
        
        # Use previous engine and normalize its output to match PDF generator's expected table format
        raw_old_events = detect_life_events(
            report_data.get("karma_timeline", []),
            report_data.get("probability_matrix", {}),
            report_data.get("dosha", {}),
            report_data.get("strength", {}),
        )
        
        old_normalized = []
        for e in raw_old_events:
            old_normalized.append({
                "year": e.get("year"),
                "category": e.get("type", "General").replace("_", " ").title(),
                "title": e.get("label", "Significant Event"),
                "intensity": e.get("intensity", 7.0)
            })

        # Combine and sort
        all_events = new_events + [e for e in old_normalized if e["year"] not in [ne["year"] for ne in new_events]]
        report_data["life_events"] = sorted(all_events, key=lambda x: x["year"])
    except Exception as e:
        print(f"Error detecting life events: {e}")

    # 19.5 Karma Simulation Engine
    try:
        report_data["karma_simulation"] = run_karma_engine_ultra(
            report_data.get("karma_timeline", []),
            report_data.get("probability_matrix", {}),
            report_data.get("dosha", {}),
            report_data.get("strength", {}),
            report_data.get("remedies", {}),
        )
    except Exception as e:
        print(f"Error running karma simulation: {e}")

    # 19.6 Cosmic Decision Engine (Example Call)
    try:
        report_data["decision_ai"] = evaluate_decision(
            question="Should I change job in 2027?", # Default or Placeholder
            year=2027,
            chart=report_data.get("chart"),
            timeline=report_data.get("timeline", []), # Should be populated by now
            probability_matrix=report_data.get("probability_matrix", {}),
            karma_simulation=report_data.get("karma_simulation", {}),
            dosha=report_data.get("dosha", {}),
            strength=report_data.get("strength", {}),
        )
    except Exception as e:
        print(f"Error in cosmic decision engine: {e}")

    # 19.7 Oracle Intelligence Core (Default Query)
    try:
        report_data["oracle_ai"] = oracle_query(
            "What is my key focus for 2027?",
            report_data
        )
    except Exception as e:
        print(f"Error in oracle engine: {e}")

    # 20. Destiny Graph Engine
    try:
        report_data["destiny_graph"] = build_destiny_graph(
            report_data.get("timeline", []),
            report_data.get("probability_matrix", {}),
            report_data.get("strength", {}),
            report_data.get("life_events"),
            report_data.get("karma_simulation"),
        )
    except Exception as e:
        print(f"Error generating destiny graph: {e}")

    # 21. Cosmic Neural Core
    try:
        from core.neural.neural_core import build_neural_context
        # We don't have adaptive history here for the static report, so passing None
        report_data["neural"] = build_neural_context(report_data, adaptive=None)
    except Exception as e:
        print(f"Error in Cosmic Neural Core: {e}")
        report_data["neural"] = {"summary": "Neural analysis pending."}

    # 22. Adaptive Intelligence Engine
    try:
        from core.adaptive.adaptive_engine import run_adaptive_intelligence
        adaptive_intel = run_adaptive_intelligence(report_data)
        report_data["adaptive_intelligence"] = adaptive_intel
    except Exception as e:
        print(f"Error in Adaptive Intelligence Engine: {e}")
        report_data["adaptive_intelligence"] = {}

    # 23. Destiny Matrix Engine (Yearly Forecasts)
    try:
        from core.destiny_matrix.destiny_engine import run_destiny_matrix
        destiny_matrix = run_destiny_matrix(report_data)
        report_data["destiny_matrix"] = destiny_matrix
    except Exception as e:
        print(f"Error in Destiny Matrix Engine: {e}")
        report_data["destiny_matrix"] = {}

    # 24. Omniscient Timeline Engine
    try:
        from core.omniscient_timeline.omniscient_engine import run_omniscient_timeline
        omni = run_omniscient_timeline(report_data)
        report_data["omniscient_timeline"] = omni
    except Exception as e:
        print(f"Error in Omniscient Timeline Engine: {e}")
        report_data["omniscient_timeline"] = {}

    # 25. Life Path Engine (Themes & Narrative)
    try:
        from core.life_path.life_path_engine import run_life_path_engine
        life_path = run_life_path_engine(report_data)
        report_data["life_path"] = life_path
    except Exception as e:
        print(f"Error in Life Path Engine: {e}")
        report_data["life_path"] = {}

    # 26. Cosmic Graph Engine (Visualization)
    try:
        from core.visualization.cosmic_graph_engine import run_cosmic_graph_engine
        graph_images = run_cosmic_graph_engine(report_data)
        report_data["graph_images"] = graph_images
    except Exception as e:
        print(f"Error in Cosmic Graph Engine: {e}")
        report_data["graph_images"] = {}

    # 27. Cosmic AI Engine (Interpretations)
    try:
        from core.ai_engine.cosmic_ai_engine import run_cosmic_ai_engine
        ai_text = run_cosmic_ai_engine(report_data)
        report_data["ai_interpretation"] = ai_text
    except Exception as e:
        print(f"Error in Cosmic AI Engine: {e}")
        report_data["ai_interpretation"] = {}

    # 28. Ultra NLP Engine (Narratives)
    try:
        from core.ai_engine.nlp.ultra_nlp_engine import run_ultra_nlp_engine
        nlp_text = run_ultra_nlp_engine(report_data)
        report_data["ultra_nlp_text"] = nlp_text
    except Exception as e:
        print(f"Error in Ultra NLP Engine: {e}")
        report_data["ultra_nlp_text"] = {}

    # 17.1 Cosmic Life Map Enrichment
    try:
        # Stamp flags onto destiny_timeline for the visualizer
        timeline = report_data.get("destiny_timeline", [])
        
        def safe_get_year(date_str):
            if not date_str: return 0
            # Handle DD/MM/YYYY or YYYY-MM-DD or similar
            if "/" in date_str:
                return int(date_str.split("/")[-1].split()[0])
            if "-" in date_str:
                return int(date_str.split("-")[0])
            return 0

        for row in timeline:
            year = row["year"]
            
            # Marriage check
            for m in life_map.get("marriage", []):
                start_year = safe_get_year(m.get("start"))
                end_year = safe_get_year(m.get("end"))
                if start_year <= year <= end_year:
                    row["marriage_window"] = True
                    break
            
            # Career check
            for c in life_map.get("career", []):
                start_year = safe_get_year(c.get("start"))
                end_year = safe_get_year(c.get("end"))
                if start_year <= year <= end_year and c.get("career_score", 0) > 70:
                    row["career_peak"] = True
                    break
            
            # Health check (simplified: if there are alerts, flag as risk for specific periods if we had them)
            # For now, if sadesati is active, mark it? The health engine just returns a list of alerts.
            if life_map.get("health"):
                # If any health alerts exist, we might want to flag them. 
                # But health_engine.py is currently static based on doshas.
                # Let's just check if Sadesati is active for this year.
                if dosha.get("sadesati", {}).get("present"):
                    row["health_risk"] = True

    except Exception as e:
        print(f"Error enriching life map: {e}")

    # 18. Oracle Engine - Sage Insights (Asking standard life questions)

    # TRUNCATED TO 15 QUESTIONS TO PREVENT TIMEOUTS
    oracle_questions = [
        "What is my primary life purpose according to these planets?",
        "When will I see significant career growth?",
        "How can I improve my financial stability in the next 5 years?",
        "What are the karmic lessons I need to learn in this lifetime?",
        "How will my relationships evolve in the coming decade?",
        "What health precautions should I take based on my chart?",
        "Which spiritual practices are most suited for my soul archetype?",
        "What is the hidden potential in my 10th house?",
        "How does my Moon sign influence my emotional well-being?",
        "What are the major obstacles I might face and how to overcome them?",
        "What is the significance of Rahu and Ketu in my life's journey?",
        "In which direction should I seek professional opportunities?",
        "How can I better align my daily habits with my cosmic blueprint?",
        "What are the auspicious colors and numbers I should use for important tasks?",
        "How will my spiritual growth impact my worldly success?"
    ]

    oracle_insights = []
    for q in oracle_questions:
        try:
            ans = oracle_answer(q, chart, strength, dosha, dasha, cosmic)
            oracle_insights.append(ans)
        except Exception as e:
            print(f"Error in oracle_answer for '{q}': {e}")
    report_data["oracle_insights"] = oracle_insights


    # 18.1 7D Prophecy Integration
    try:
        prophecy = build_7d_prophecy(chart, dasha, dosha, strength)
        report_data["prophecy"] = prophecy
    except Exception as e:
        print(f"Error generating prophecy: {e}")

    # 19. Planetary Wisdom - Deep-dive placement analysis
    report_data["planetary_wisdom"] = planetary_wisdom_analysis(chart, simple_strength)


    # 2. Remedies - Normalize and merge
    raw_base = generate_all_remedies(dosha)
    paramarshi_remedies = suggest_remedies(report_data)
    
    normalized = []
    seen_descriptions = set()
    
    # 1. Process base remedies (nested objects)
    for dosha_obj in raw_base:
        if isinstance(dosha_obj, dict) and "remedies" in dosha_obj:
            for cat in ["primary", "optional", "advanced"]:
                cat_list = dosha_obj["remedies"].get(cat, [])
                for r in cat_list:
                    # Extracts English description (remedy objects have 'en' and 'hi' keys)
                    desc = r.get("en", "")
                    if desc and desc not in seen_descriptions:
                        normalized.append({
                            "type": r.get("type", "Remedy"),
                            "description": desc
                        })
                        seen_descriptions.add(desc)
                        
    # 2. Process paramarshi remedies (strings)
    for r_str in paramarshi_remedies:
        if r_str not in seen_descriptions:
            normalized.append({
                "type": "Advice",
                "description": r_str
            })
            seen_descriptions.add(r_str)
            
    report_data["remedies"] = normalized

    # 3. Paramarshi Advisor - Supreme Life Guidance
    # We ask a default comprehensive question for the report
    guidance = ask_paramarshi(
        "Provide a supreme summary of my life purpose, career destiny, and karmic lessons.",
        report_data
    )
    report_data["paramarshi"] = guidance

    # 3. AI Text (Dosha Explanations)
    report_data["ai_text"] = generate_ai_text(
        report_data,
        style="premium" if "premium" in locals() else "minimal" # fallback
    )

    # 4. Life Analysis
    enriched_chart = enrich_chart_for_analysis(chart)
    report_data["ai_life_analysis"] = generate_ai_life_analysis(
        chart=enriched_chart,
        dosha=dosha,
        dasha=dasha,
        strength=simple_strength,
        language=language
    )

    # Inject rich planet effects
    from core.knowledge.planet_house_text import planet_rich_interpretation
    from utils.translator import translate_dict
    
    language = report_data.get("meta", {}).get("language", "en")
    lang_code = "hi" if language.lower() == "hindi" else "en"
    rich_effects = {}
    for p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        planet_effects = {}
        for h_num in range(1, 13):
            # Fetch both English and Hindi versions so the frontend can toggle between them instantly
            en_eff = planet_rich_interpretation(p_name, h_num, lang="en")
            hi_eff = planet_rich_interpretation(p_name, h_num, lang="hi")
            planet_effects[str(h_num)] = {
                "en": en_eff,
                "hi": hi_eff
            }
            
        rich_effects[p_name] = planet_effects
    report_data["rich_planet_effects"] = rich_effects

    # 21. Life Oracle - Career, Marriage, Study, Business & Health Details
    try:
        report_data["life_oracle"] = analyze_life_oracle(report_data)
    except Exception as e:
        print(f"Error generating life oracle: {e}")

    # 22. Main Analysis Pipeline (Wealth, etc.)
    from core.analysis.main_analysis_pipeline import run_main_analysis_pipeline
    report_data = run_main_analysis_pipeline(report_data)

    # 23. Lal Kitab Integration
    try:
        lk_chart = build_lalkitab_chart(chart)
        lk_debts = calculate_lalkitab_debts(lk_chart)
        report_data["lalkitab"] = {
            "chart": lk_chart,
            "debts": lk_debts
        }
    except Exception as e:
        print(f"Error generating Lal Kitab data: {e}")
        report_data["lalkitab"] = {"chart": {}, "debts": []}

    # 24. Current Transits
    try:
        import datetime as dt_module
        
        now_utc = dt_module.datetime.now(dt_module.timezone.utc).replace(tzinfo=None)
        current_jd = datetime_to_julian(now_utc)
        current_chart = build_rashi_chart(current_jd, lat, lon)
        
        transit_positions = {}
        if "signs" in current_chart:
            for i in range(12):
                sign_data = current_chart["signs"].get(i, current_chart["signs"].get(str(i), {}))
                sign_name = sign_data.get("sign_name", "")
                if sign_name:
                    planets = sign_data.get("planets", [])
                    transit_positions[sign_name] = [p["name"] for p in planets if "name" in p]
        
        report_data["current_transit"] = transit_positions
    except Exception as e:
        print(f"Error generating current transits: {e}")

    # Save to cache before returning
    cache_chart(report_data)

    return report_data
