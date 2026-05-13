
import os

filepath = r"d:\vedic-astrology-app - 2\frontend\src\components\InteractiveWorksheet.jsx"

# Try different encodings
encodings = ['utf-8', 'latin-1', 'utf-16', 'utf-8-sig']
content = None
for enc in encodings:
    try:
        with open(filepath, 'r', encoding=enc) as f:
            content = f.read()
        print(f"Success with {enc}")
        break
    except Exception as e:
        print(f"Failed with {enc}: {e}")

if not content:
    print("Could not read file")
    exit(1)

# Replacement 1: Transit list
target1 = '<p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{planet}</p>'
replacement1 = '<p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{planet}{pos.is_retrograde ? "*" : ""}{pos.is_combust ? "#" : ""}</p>'

# Replacement 2: Dignity table
target2 = '<td className="p-1 font-bold" style={{ color: color }}>{p.planet.substring(0, 2)}</td>'
replacement2 = '<td className="p-1 font-bold" style={{ color: color }}>{p.planet.substring(0, 2)}{p.is_retrograde ? "*" : ""}{p.is_combust ? "#" : ""}</td>'

if target1 in content:
    print("Found target1")
    content = content.replace(target1, replacement1)
else:
    print("Target1 not found exactly")

if target2 in content:
    print("Found target2")
    content = content.replace(target2, replacement2)
else:
    print("Target2 not found exactly")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
