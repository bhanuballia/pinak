def calculate_angular_distance(deg1: float, deg2: float) -> float:
    """Calculates the shortest angular distance between two points on a 360-degree circle."""
    diff = abs(deg1 - deg2) % 360
    return min(diff, 360 - diff)

def get_aspect(distance: float) -> dict:
    """Determines the modern astrological aspect given an angular distance."""
    # Using standard modern psychological orbs
    aspects = [
        {"name": "Conjunction", "angle": 0, "orb": 8, "type": "intense", "symbol": "☌"},
        {"name": "Opposition", "angle": 180, "orb": 8, "type": "challenge", "symbol": "☍"},
        {"name": "Trine", "angle": 120, "orb": 8, "type": "flow", "symbol": "△"},
        {"name": "Square", "angle": 90, "orb": 8, "type": "friction", "symbol": "□"},
        {"name": "Sextile", "angle": 60, "orb": 6, "type": "opportunity", "symbol": "⚹"}
    ]
    
    for aspect in aspects:
        if abs(distance - aspect["angle"]) <= aspect["orb"]:
            exactness = abs(distance - aspect["angle"])
            return {
                "aspect_name": aspect["name"],
                "orb_distance": round(exactness, 2),
                "is_exact": exactness < 2.0,
                "type": aspect["type"],
                "symbol": aspect["symbol"]
            }
            
    return None

def compute_synastry_matrix(p1_positions: dict, p2_positions: dict) -> dict:
    """
    Computes a 10x10 geometric relationship matrix between two charts.
    Keys must include 'Ascendant' and the 9 planets.
    Positions map should be: {'Sun': {'lon': 120.5}, 'Moon': {'lon': 45.2}, ...}
    """
    bodies = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    # Extract longitudes safely
    def get_lon(pos_data, body_name):
        if isinstance(pos_data, list):
            # Find the planet in the list
            for p in pos_data:
                if p.get("planet") == body_name:
                    val = p.get("lon", p.get("longitude", p.get("degree")))
                    return float(val) if val is not None else 0.0
            return None
            
        # Fallback if it's a dict
        data = pos_data.get(body_name)
        if isinstance(data, dict):
            val = data.get("lon", data.get("longitude", data.get("degree")))
            return float(val) if val is not None else None
        elif hasattr(data, "lon"):
            return data.lon
        elif isinstance(data, (int, float)):
            return float(data)
        return None

    matrix = {}
    significant_hits = []

    for b1 in bodies:
        matrix[b1] = {}
        lon1 = get_lon(p1_positions, b1)
        if lon1 is None:
            continue
            
        for b2 in bodies:
            lon2 = get_lon(p2_positions, b2)
            if lon2 is None:
                continue
                
            distance = calculate_angular_distance(lon1, lon2)
            aspect = get_aspect(distance)
            
            if aspect:
                cell_data = {
                    "p1_body": b1,
                    "p2_body": b2,
                    **aspect
                }
                matrix[b1][b2] = cell_data
                
                # We only log significant inter-planetary hits (ignore Rahu-Rahu or Asc-Asc for text reading)
                if b1 != b2 or b1 in ["Sun", "Moon", "Venus", "Mars"]:
                    significant_hits.append(cell_data)
            else:
                matrix[b1][b2] = None
                
    # Sort hits by exactness for the AI reading
    significant_hits.sort(key=lambda x: x["orb_distance"])

    return {
        "matrix": matrix,
        "hits": significant_hits[:15] # Top 15 tightest aspects
    }
