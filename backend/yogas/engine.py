# yogas/engine.py
from typing import Dict, List, Callable
import importlib
import pkgutil
from pathlib import Path

def _load_rule_modules():
    rules = []
    pkg = __import__("yogas.rules", fromlist=["*"])
    for _, name, _ in pkgutil.iter_modules(pkg.__path__):
        mod = importlib.import_module(f"yogas.rules.{name}")
        if hasattr(mod, "register"):
            rules.extend(mod.register())
    return rules

def detect_all_yogas(chart_model: Dict) -> List[Dict]:
    rules = _load_rule_modules()
    found = []
    for r in rules:
        try:
            res = r(chart_model)
            if res:
                found.extend(res)
        except Exception:
            continue
    return found
