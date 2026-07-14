# reports/tables/dasha_table.py
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

def build_dasha_table(dashas: list) -> Table:
    """
    dashas: list of dicts with keys: lord, start_jd, end_jd, start_year, end_year
    """
    rows = [["Dasha Lord", "Start", "End", "Years"]]
    for d in dashas:
        rows.append([d.get("lord"), d.get("start_str", ""), d.get("end_str", ""), str(d.get("duration_years", ""))])
    t = Table(rows, colWidths=[60, 80, 80, 40])
    t.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.25,colors.black), ("BACKGROUND",(0,0),(-1,0),colors.lightgrey)]))
    return t
