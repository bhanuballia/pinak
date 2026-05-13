import os

dirs_to_scan = ["core", "reports"]
for root_dir in dirs_to_scan:
    for root, _, files in os.walk(root_dir):
        for file in files:
            if not file.endswith(".py"):
                continue
            path = os.path.join(root, file)
            
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "from __future__ import annotations" in content:
                # check if _get_strength is before from __future__
                idx_future = content.find("from __future__ import annotations")
                idx_strength = content.find("def _get_strength")
                
                if idx_strength != -1 and idx_strength < idx_future:
                    # We need to swap them
                    # Or just remove the inserted string and put it below
                    # Actually, the easiest is to just remove def _get_strength block and append it after imports
                    
                    # Instead of parsing, let's just do text manipulation:
                    parts = content.split("def _get_strength(strength, key, default=1.0):")
                    # There should be exactly two parts if it was modified
                    if len(parts) == 2:
                        top_part = parts[0]
                        bottom = "def _get_strength(strength, key, default=1.0):" + parts[1]
                        
                        # Find where the helper ends. It ends with: "return default\n"
                        helper_end = bottom.find("return default\n") + len("return default\n")
                        helper = bottom[:helper_end]
                        rest = bottom[helper_end:]
                        
                        new_content = top_part + rest
                        # Now find the first safe place to put the helper.
                        # After any __future__ or module docstrings.
                        # Safe place: just replace "from __future__ import annotations" with itself + \n + helper
                        new_content = new_content.replace("from __future__ import annotations", "from __future__ import annotations\n" + helper)
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        print(f"Fixed __future__ bug in {path}")
