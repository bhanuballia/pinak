# backend/astrology/vastu.py
from typing import Dict, Any, List, Optional
from core.utils import get_sign_index, get_sign_name
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from charts.rashi_chart import build_rashi_chart
import datetime

# Exaltation and debilitation signs (0-indexed: 0=Aries, 1=Taurus, ..., 11=Pisces)
EXALTATION_SIGNS = {
    "Sun": 0,      # Aries
    "Moon": 1,     # Taurus
    "Mars": 9,     # Capricorn
    "Mercury": 5,  # Virgo
    "Jupiter": 3,  # Cancer
    "Venus": 11,   # Pisces
    "Saturn": 6,   # Libra
}

DEBILITATION_SIGNS = {
    "Sun": 6,      # Libra
    "Moon": 7,     # Scorpio
    "Mars": 3,     # Cancer
    "Mercury": 11, # Pisces
    "Jupiter": 9,  # Capricorn
    "Venus": 5,    # Virgo
    "Saturn": 0,   # Aries
}

# 8 directions + Center mappings - RESIDENTIAL
DIRECTION_DETAILS = {
    "North": {
        "planet": "Mercury",
        "element": "Water",
        "deity": "Kubera (Wealth & Opportunities)",
        "ideal_rooms": ["Entrance", "Locker/Vault", "Study Room", "Living Room"],
        "forbidden_rooms": ["Toilet", "Kitchen", "Septic Tank"],
    },
    "Northeast": {
        "planet": "Jupiter",
        "element": "Water/Aether",
        "deity": "Shiva/Eesanya (Wisdom, Spirituality)",
        "ideal_rooms": ["Pooja Room/Temple", "Meditation Room", "Entrance", "Study Room"],
        "forbidden_rooms": ["Toilet", "Kitchen", "Bedroom", "Store Room"],
    },
    "East": {
        "planet": "Sun",
        "element": "Air/Fire",
        "deity": "Indra (Social Connections, Health)",
        "ideal_rooms": ["Entrance", "Living Room", "Pooja Room", "Balcony"],
        "forbidden_rooms": ["Toilet", "Master Bedroom"],
    },
    "Southeast": {
        "planet": "Mars",
        "element": "Fire",
        "deity": "Agni (Cooking, Energy, Cash Flow)",
        "ideal_rooms": ["Kitchen", "Electrical Equipment/Generator", "Guard Room"],
        "forbidden_rooms": ["Toilet", "Pooja Room", "Master Bedroom"],
    },
    "South": {
        "planet": "Mars",
        "element": "Earth/Fire",
        "deity": "Yama (Fame, Relaxation)",
        "ideal_rooms": ["Master Bedroom", "Staircase", "Store Room"],
        "forbidden_rooms": ["Kitchen", "Pooja Room", "Main Entrance"],
    },
    "Southwest": {
        "planet": "Rahu",
        "element": "Earth",
        "deity": "Nairuti (Stability, Strength, Ancestors)",
        "ideal_rooms": ["Master Bedroom", "Heavy Storage", "Wardrobes", "Overhead Water Tank"],
        "forbidden_rooms": ["Toilet", "Kitchen", "Pooja Room", "Underground Water Tank", "Basement"],
    },
    "West": {
        "planet": "Saturn",
        "element": "Air/Space",
        "deity": "Varuna (Gains, Profits, Overhead Storage)",
        "ideal_rooms": ["Dining Room", "Children's Bedroom", "Study Room", "Toilet"],
        "forbidden_rooms": ["Pooja Room", "Kitchen", "Main Entrance"],
    },
    "Northwest": {
        "planet": "Moon",
        "element": "Air",
        "deity": "Vayu (Social Support, Guests, Relatives)",
        "ideal_rooms": ["Guest Bedroom", "Toilet", "Kitchen (secondary option)", "Granary", "Garage"],
        "forbidden_rooms": ["Master Bedroom", "Pooja Room"],
    },
    "Center": {
        "planet": "Venus", # or Brahmadeva
        "element": "Space",
        "deity": "Brahma (Creation, Open Space)",
        "ideal_rooms": ["Open Courtyard", "Living Room (empty center)", "Lobby"],
        "forbidden_rooms": ["Toilet", "Kitchen", "Pooja Room", "Pillar", "Heavy Objects"],
    }
}

# 8 directions + Center mappings - COMMERCIAL
COMMERCIAL_DIRECTION_DETAILS = {
    "North": {
        "planet": "Mercury",
        "element": "Water",
        "deity": "Kubera (Wealth & Cash Flow)",
        "ideal_rooms": ["Main Entrance", "Cash Counter", "Safe/Locker", "Reception"],
        "forbidden_rooms": ["Toilet", "Pantry/Kitchen", "Store Room/Inventory"],
    },
    "Northeast": {
        "planet": "Jupiter",
        "element": "Water/Aether",
        "deity": "Shiva/Eesanya (Wisdom, Spirituality)",
        "ideal_rooms": ["Reception", "Conference Room", "Main Entrance"],
        "forbidden_rooms": ["Toilet", "Pantry/Kitchen", "Store Room/Inventory"],
    },
    "East": {
        "planet": "Sun",
        "element": "Air/Fire",
        "deity": "Indra (Social Connections & Sales)",
        "ideal_rooms": ["Main Entrance", "Reception", "Employee Workstations", "Conference Room"],
        "forbidden_rooms": ["Toilet", "Store Room/Inventory"],
    },
    "Southeast": {
        "planet": "Mars",
        "element": "Fire",
        "deity": "Agni (Pantry, Power, Secondary Cash Desk)",
        "ideal_rooms": ["Pantry/Kitchen", "Server Room/UPS", "Cash Counter"],
        "forbidden_rooms": ["Toilet", "Owner's Cabin/Desk"],
    },
    "South": {
        "planet": "Mars",
        "element": "Earth/Fire",
        "deity": "Yama (Brand Power, Stability)",
        "ideal_rooms": ["Employee Workstations", "Conference Room"],
        "forbidden_rooms": ["Main Entrance", "Cash Counter"],
    },
    "Southwest": {
        "planet": "Rahu",
        "element": "Earth",
        "deity": "Nairuti (Authority & Stability)",
        "ideal_rooms": ["Owner's Cabin/Desk", "Safe/Locker"],
        "forbidden_rooms": ["Toilet", "Main Entrance", "Pantry/Kitchen"],
    },
    "West": {
        "planet": "Saturn",
        "element": "Air/Space",
        "deity": "Varuna (Gains & Meetings)",
        "ideal_rooms": ["Employee Workstations", "Conference Room", "Toilet", "Server Room/UPS"],
        "forbidden_rooms": ["Main Entrance"],
    },
    "Northwest": {
        "planet": "Moon",
        "element": "Air",
        "deity": "Vayu (Fast Inventory Movement)",
        "ideal_rooms": ["Store Room/Inventory", "Reception", "Toilet"],
        "forbidden_rooms": ["Owner's Cabin/Desk"],
    },
    "Center": {
        "planet": "Venus",
        "element": "Space",
        "deity": "Brahma (Lobby)",
        "ideal_rooms": ["Lobby"],
        "forbidden_rooms": ["Toilet", "Pillar", "Heavy Objects", "Pantry/Kitchen"],
    }
}

def evaluate_planet_strength(planet_positions: Dict[str, Any], planet: str, houses: Dict[int, Any]) -> Dict[str, Any]:
    """
    Evaluates a planet's strength based on sign placement, house, combust/retrograde status.
    """
    if planet not in planet_positions:
        return {
            "strength": "Neutral",
            "score": 50,
            "details": f"{planet} position not found. Neutral strength assumed.",
            "is_afflicted": False
        }
        
    pos = planet_positions[planet]
    lon = pos["sidereal"]["lon"]
    sign_idx = get_sign_index(lon)
    is_retrograde = pos.get("is_retrograde", False)
    is_combust = pos.get("is_combust", False)
    
    house_idx = 1
    for h, h_data in houses.items():
        planets_in_house = h_data.get("planets", [])
        if any(p["name"] == planet for p in planets_in_house):
            house_idx = int(h)
            break
            
    is_exalted = EXALTATION_SIGNS.get(planet) == sign_idx
    is_debilitated = DEBILITATION_SIGNS.get(planet) == sign_idx
    
    score = 60
    reasons = []
    
    if is_exalted:
        score += 25
        reasons.append("Exalted")
    elif is_debilitated:
        score -= 25
        reasons.append("Debilitated")
        
    if house_idx in [1, 4, 7, 10]:
        score += 10
        reasons.append(f"Placed in Kendra House {house_idx}")
    elif house_idx in [5, 9]:
        score += 15
        reasons.append(f"Placed in Trikona House {house_idx}")
    elif house_idx in [6, 8, 12]:
        score -= 15
        reasons.append(f"Placed in Dusthana House {house_idx}")
        
    if is_combust:
        score -= 10
        reasons.append("Combust")
    if is_retrograde:
        score -= 5
        reasons.append("Retrograde")
        
    score = max(10, min(100, score))
    
    if score >= 75:
        strength = "Excellent"
        is_afflicted = False
    elif score >= 55:
        strength = "Strong"
        is_afflicted = False
    elif score >= 40:
        strength = "Average"
        is_afflicted = False
    else:
        strength = "Weak/Afflicted"
        is_afflicted = True
        
    details = f"{planet} is in {get_sign_name(lon)} (House {house_idx}). Placements: " + ", ".join(reasons) if reasons else "Neutral placements."
    
    return {
        "strength": strength,
        "score": score,
        "details": details,
        "is_afflicted": is_afflicted,
        "house": house_idx,
        "sign": get_sign_name(lon)
    }

def get_directional_remedies(direction: str, is_afflicted: bool, misplaced_room: Optional[str], property_type: str = "residential") -> List[str]:
    """
    Returns Vastu remedies based on direction, issues, and property type.
    """
    remedies = []
    
    # Base remedies
    dir_remedies = {
        "North": [
            "Place a water fountain or a bowl of fresh water in this zone.",
            "Decorate with light blue or green colors to boost Mercury/Water energy.",
            "Keep a Kubera Yantra or green plants in this direction."
        ],
        "Northeast": [
            "Ensure this zone is completely clean, light-weight, and free of clutter.",
            "Install a small brass water pot (Kalash) or keep a copper vessel filled with water.",
            "Keep the area well-lit and perform daily meditation or prayer here.",
            "Avoid placing heavy cupboards or storage bins in this corner."
        ],
        "East": [
            "Place a copper Surya Dev plaque on the wall.",
            "Keep curtains light and open to allow morning sunlight.",
            "Use light orange, gold, or yellow colors in this zone."
        ],
        "Southeast": [
            "Keep a red bulb lit in this corner, especially if the kitchen/pantry is not located here.",
            "Use red or copper accents to stimulate the Fire element.",
            "Place a Vastu copper pyramid or Agni Yantra."
        ],
        "South": [
            "Use heavy furniture, warm lighting, and terracotta/brown tones.",
            "Ensure the walls are thicker and avoid large openings or mirrors in this zone.",
            "Keep a Mars or Yama Yantra to stabilize energy."
        ],
        "Southwest": [
            "Place a Rahu Yantra or heavy stone statues in this corner.",
            "Use earthy yellow, brown, or gold tones to represent the Earth element.",
            "Avoid any water bodies (fountains, under-ground tanks) in this zone."
        ],
        "West": [
            "Place a Shani Yantra or a metal wind chime with 6 or 7 rods.",
            "Decorate with blue, grey, or white colors.",
            "Place dining setups or study tables in this direction."
        ],
        "Northwest": [
            "Hang a silver-plated wind chime to balance Vayu (Air) energy.",
            "Use white, silver, or cream color schemes.",
            "Ensure proper ventilation and fresh air circulation in this room."
        ],
        "Center": [
            "Keep the center of the space completely clear of pillars, heavy furniture, or walls.",
            "Maintain cleanliness and bright, warm illumination.",
            "Use light yellow or beige tones."
        ]
    }
    
    if misplaced_room:
        if misplaced_room in ["Toilet"]:
            remedies.append(f"Crucial: Place a bowl of sea salt or Himalayan rock salt in the {direction} toilet to absorb negative energies (replace weekly).")
            remedies.append("Keep the toilet door closed at all times.")
        if misplaced_room in ["Kitchen", "Pantry/Kitchen"]:
            remedies.append(f"Place a small yellow stone/tile under the gas stove/cooktop or use a copper pyramid to balance the elemental clash.")
        if misplaced_room in ["Owner's Cabin/Desk"] and direction in ["Northeast", "Southeast"]:
            remedies.append("Owner remedy: Ensure the desk faces North or East, and place a heavy brass paperweight on the Southwest corner of the desk.")
            
    if is_afflicted:
        remedies.append(f"Planetary Remedy: Donate items related to the directional lord planet or perform soft chanting of its mantra.")
        
    remedies.extend(dir_remedies.get(direction, []))
    return remedies[:4]

def analyze_astro_vastu(jd: float, lat: float, lon: float, layout: Optional[Dict[str, str]] = None, property_type: str = "residential") -> Dict[str, Any]:
    """
    Computes personalized Astro-Vastu recommendations based on birth chart planetary positions,
    room placements, and property type (residential vs. commercial).
    """
    chart = build_rashi_chart(jd, lat, lon)
    planet_positions = chart["planet_positions"]
    houses = chart["houses"]
    
    directions_report = {}
    total_astro_score = 0
    num_directions = 0
    
    # Choose guidelines based on property type
    rules = COMMERCIAL_DIRECTION_DETAILS if property_type == "commercial" else DIRECTION_DETAILS
    
    for direction, info in rules.items():
        planet = info["planet"]
        eval_res = evaluate_planet_strength(planet_positions, planet, houses)
        
        room_in_direction = layout.get(direction) if layout else None
        
        is_compatible = True
        compatibility_msg = "No room assigned."
        room_score = 100
        
        if room_in_direction:
            if room_in_direction in info["ideal_rooms"]:
                compatibility_msg = f"Excellent! {room_in_direction} is highly compatible with the energy of the {direction} direction."
                room_score = 100
            elif room_in_direction in info["forbidden_rooms"]:
                compatibility_msg = f"Alert: {room_in_direction} in the {direction} is a Vastu violation (elemental conflict)."
                is_compatible = False
                room_score = 30
            else:
                compatibility_msg = f"Neutral placement: {room_in_direction} in the {direction} has a stable effect."
                room_score = 70
                
        remedies = get_directional_remedies(direction, eval_res["is_afflicted"], None if is_compatible else room_in_direction, property_type)
        
        directions_report[direction] = {
            "planet": planet,
            "element": info["element"],
            "deity": info["deity"],
            "planet_strength": eval_res["strength"],
            "planet_score": eval_res["score"],
            "planet_details": eval_res["details"],
            "is_afflicted": eval_res["is_afflicted"],
            "room_assigned": room_in_direction,
            "room_compatibility_score": room_score,
            "is_room_compatible": is_compatible,
            "room_message": compatibility_msg,
            "remedies": remedies
        }
        
        total_astro_score += eval_res["score"]
        num_directions += 1
        
    avg_astro_score = round(total_astro_score / num_directions) if num_directions > 0 else 50
    
    layout_score = None
    if layout:
        assigned_rooms = [v for k, v in layout.items() if v]
        if assigned_rooms:
            total_room_score = sum(directions_report[d]["room_compatibility_score"] for d in directions_report)
            layout_score = round(total_room_score / len(directions_report))
            
    overall_vastu_score = avg_astro_score
    if layout_score is not None:
        overall_vastu_score = round((avg_astro_score * 0.4) + (layout_score * 0.6))
        
    return {
        "overall_score": overall_vastu_score,
        "astro_vastu_score": avg_astro_score,
        "layout_compatibility_score": layout_score,
        "directions": directions_report,
        "ascendant": chart["ascendant_sign"],
        "ascendant_deg": chart["ascendant_deg"]
    }
