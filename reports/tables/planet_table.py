# reports/tables/planet_table.py
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import mm
from typing import Dict, Any, List

def build_planet_table(chart_model: Dict[str, Any]) -> Table:
    header = ["Planet", "Sign", "Longitude", "House"]
    rows = [header]
    signs = chart_model.get("signs", [])
    planets = chart_model.get("planet_positions", {})
    houses = chart_model.get("houses", {})
    for p, info in planets.items():
        sid = info.get("sidereal", {}).get("lon", 0.0)
        sign_idx = int(sid // 30) % 12
        sign_name = signs[sign_idx]["sign_name"] if signs else f"Sign{sign_idx+1}"
        # find house
        house_no = "-"
        for hn, hv in houses.items():
            if p in hv.get("planets", []):
                house_no = str(hn)
                break
        rows.append([p, sign_name, f"{sid:.2f}", house_no])
    t = Table(rows, colWidths=[40*mm, 40*mm, 40*mm, 30*mm])
    t.setStyle(TableStyle([
        ("GRID",(0,0),(-1,-1),0.25,colors.black),
        ("BACKGROUND",(0,0),(-1,0),colors.lightgrey),
    ]))
    return t

