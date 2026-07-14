from .kalsarpa import remedies_kalsarpa
from .manglik import remedies_manglik
from .pitra import remedies_pitra
from .sadesati import remedies_sadesati

def generate_all_remedies(dosha_results: dict) -> list:
    remedies = []

    for fn in [
        remedies_kalsarpa,
        remedies_manglik,
        remedies_pitra,
        remedies_sadesati,
    ]:
        try:
            r = fn(dosha_results.get(fn.__name__.replace("remedies_", ""), {}))
            if r.get("present"):
                remedies.append(r)
        except Exception:
            continue

    return remedies
