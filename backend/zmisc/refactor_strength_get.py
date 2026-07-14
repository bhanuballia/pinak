import os, re

def fix_repository():
    helper_code = """
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default
"""
    
    # We will search for strength.get(xyz, default) and strength.get(xyz)
    pattern = re.compile(r"strength\.get\(([^,]+)(?:\s*,\s*([^)]+))?\)")

    dirs_to_scan = ["core", "reports"]
    for root_dir in dirs_to_scan:
        for root, _, files in os.walk(root_dir):
            for file in files:
                if not file.endswith(".py"):
                    continue
                path = os.path.join(root, file)
                
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                
                # Replace strength.get(X, Y) with _get_strength(strength, X, Y)
                def replacer(match):
                    key = match.group(1)
                    default = match.group(2)
                    if default:
                        return f"_get_strength(strength, {key}, {default})"
                    else:
                        return f"_get_strength(strength, {key})"
                
                if "strength.get" in new_content:
                    new_content = pattern.sub(replacer, new_content)
                    
                    if "_get_strength(" in new_content and "_get_strength(strength, key" not in new_content:
                        # Append helper to the end of the file or insert at top
                        new_content = helper_code + "\n" + new_content
                        
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Fixed {path}")

if __name__ == "__main__":
    fix_repository()
