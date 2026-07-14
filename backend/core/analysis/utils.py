# core/analysis/utils.py

def get_planet_house(chart, planet):
    for house_num, data in chart.get("houses", {}).items():
        for p in data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == planet:
                return int(house_num)
    return None


def get_sign_of_planet(chart, planet):
    for data in chart.get("houses", {}).values():
        for p in data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == planet:
                return data.get("sign_name")
    return None
