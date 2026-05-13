# reports/tables/ashtakavarga_table.py
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
from typing import Dict

def build_ashtakavarga_table(asht: Dict) -> Table:
    header = ["Sign", "Bindus"]
    rows = [header]
    sarva = asht.get("sarvashtakavarga", [])
    # optional sign names
    sign_names = asht.get("signs", None)
    for i, b in enumerate(sarva):
        sname = sign_names[i]["sign_name"] if sign_names else f"Sign{i+1}"
        rows.append([sname, str(b)])
    t = Table(rows, colWidths=[80, 40])
    t.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.25,colors.black), ("BACKGROUND",(0,0),(-1,0),colors.lightgrey)]))
    return t
