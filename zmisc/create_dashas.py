import os

dasha_names = [
    ("kala", "Kala Dasha"),
    ("sthira", "Sthira Dasha"),
    ("shoola", "Shoola Dasha"),
    ("niryaana_shoola", "Niryaana Shoola Dasha"),
    ("drig", "Drig Dasha"),
    ("navamsha", "Navamsha Dasha"),
    ("narayana", "Narayana Dasha"),
    ("lagna_kendradi", "Lagna Kendradi Dasha"),
    ("shree_lagna_kendradi", "Shree Lagna Kendradi Dasha"),
    ("shodashottari", "Shodashottari Dasha"),
    ("dwadashottari", "Dwadashottari Dasha"),
    ("shatabdika", "Shatabdika Dasha"),
    ("chaturshitisama", "Chaturshitisama Dasha"),
    ("dwisaptatisama", "Dwisaptatisama Dasha"),
    ("shastihayani", "Shastihayani Dasha"),
    ("shattrimshatsama", "Shattrimshatsama Dasha"),
    ("tribhagi40", "Tribhagi40 Dasha")
]

SCAFFOLD = '''# dasha/{filename}.py
"""
{title} basic scaffold.
"""
from __future__ import annotations
from typing import List, Dict, Any

ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

def compute_{func_name}(start_index: int = 0, years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    seq = []
    cur = 0.0
    i = start_index
    while cur < years_ahead:
        item = ORDER[i % len(ORDER)]
        dur = 10.0
        if cur + dur > years_ahead: 
            dur = years_ahead - cur
        seq.append({{"item": item, "start": cur, "end": cur + dur, "duration": dur}})
        cur += dur
        i += 1
    return seq
'''

dasha_dir = os.path.join("d:\\vedic-astrology-app", "dasha")

for filename, title in dasha_names:
    filepath = os.path.join(dasha_dir, f"{filename}.py")
    func_name = filename
    content = SCAFFOLD.format(filename=filename, title=title, func_name=func_name)
    with open(filepath, "w") as f:
        f.write(content)

# Update __init__.py
init_path = os.path.join(dasha_dir, "__init__.py")
with open(init_path, "r") as f:
    init_content = f.read()

imports = []
exports = []
for filename, _ in dasha_names:
    imports.append(f"from .{filename} import compute_{filename}  # noqa: F401")
    exports.append(f'"compute_{filename}"')

init_content += "\\n" + "\\n".join(imports) + "\\n"
init_content += f"__all__.extend([{', '.join(exports)}])\\n"

with open(init_path, "w") as f:
    f.write(init_content)

print("Created 17 dasha scaffolds and updated __init__.py")
