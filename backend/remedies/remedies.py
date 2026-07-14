# remedies/remedies.py
"""
Basic Remedies engine.

Given detected yogas/doshas, returns suggested general remedies (textual).
This is advisory content and must not replace professional guidance.
"""
from __future__ import annotations
from typing import List, Dict, Any

def suggest_remedies_for_yogas(yogas: Dict[str, Any]) -> List[Dict[str, str]]:
    suggestions: List[Dict[str,str]] = []
    for y in yogas.get("yogas", []):
        name = y.get("name","").lower()
        if "manglik" in name:
            suggestions.append({"yoga": "ManglikSuspect", "remedy": "Perform remedies like chanting Hanuman Chalisa, consult priest for specific muhurta."})
        if "gajakesari" in name.lower():
            suggestions.append({"yoga":"Gajakesari","remedy":"Strengthen Jupiter - charitable acts, chant 'Om Brim Brihaspataye Namah'."})
    if not suggestions:
        suggestions.append({"yoga":"none","remedy":"No primary remedies identified; maintain general spiritual hygiene."})
    return suggestions
