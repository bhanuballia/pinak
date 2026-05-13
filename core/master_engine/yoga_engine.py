from core.master_engine.yoga_rules.gaja_kesari import gaja_kesari
from core.master_engine.yoga_rules.raj_yoga import raj_yoga
from core.master_engine.yoga_rules.dhan_yoga import dhan_yoga

def detect_yogas(chart):

    yogas = []

    if gaja_kesari(chart):
        yogas.append({
            "name": "Gaja Kesari Yoga",
            "type": "wealth + fame",
            "strength": 80
        })

    if raj_yoga(chart):
        yogas.append({
            "name": "Raj Yoga",
            "type": "power",
            "strength": 75
        })

    if dhan_yoga(chart):
        yogas.append({
            "name": "Dhan Yoga",
            "type": "wealth",
            "strength": 85
        })

    return yogas