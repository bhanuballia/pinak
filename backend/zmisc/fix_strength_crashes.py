import os

files = [
    "core/rishi/neural_mode.py",
    "core/rishi/feature_builder.py",
    "core/rishi/adaptive_strength.py",
    "core/omniscient/confidence_ai.py",
    "core/paramarshi/prashna_interpreter.py",
    "core/maharishi/fortune_index.py",
    "core/cosmic/feature_encoder.py",
    "core/brahma/karma_score.py"
]

def get_replacer():
    # sum(strength.values()) => sum(get_vals(strength))
    return "sum(([p.get('total_score', 60) for p in strength.get('planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else [])"

iter_rep = "([p.get('total_score', 60) for p in strength.get('planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))])"

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
            
        content = content.replace("sum(strength.values())", get_replacer())
        content = content.replace("for v in strength.values():", f"for v in {iter_rep}:")
        
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {fpath}")

