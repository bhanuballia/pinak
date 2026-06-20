import re

file_path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\InteractiveWorksheet.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Remove the incorrectly inserted block (lines 2774 to 2818)
# Since array is 0-indexed, line 2775 is index 2774
# Let's find exactly the range to remove to be safe.
start_idx = None
end_idx = None
for i in range(2765, 2785):
    if 'div className="relative group/other"' in lines[i]:
        start_idx = i
        break

if start_idx is not None:
    for i in range(start_idx, start_idx + 100):
        if 'div className="grid grid-cols-1 gap-8"' in lines[i]:
            end_idx = i
            break

if start_idx is not None and end_idx is not None:
    # Delete from start_idx to end_idx - 1
    del lines[start_idx:end_idx]
    print(f"Deleted incorrect block from {start_idx} to {end_idx - 1}")

# 2. Swap group/other and group/oracle at the bottom
# First, let's locate group/oracle and group/other
oracle_start = None
other_start = None
for i in range(3500, len(lines)):
    if 'div className="relative group/oracle"' in lines[i]:
        oracle_start = i
    elif 'div className="relative group/other"' in lines[i]:
        other_start = i
        break

if oracle_start is not None and other_start is not None:
    # Find end of oracle block (it ends before group/other)
    oracle_end = other_start - 1
    
    # Find end of other block
    other_end = None
    for i in range(other_start, other_start + 100):
        if 'div className="flex-1 overflow-hidden' in lines[i] or '{/* Right Column: Dynamic Content Area */}' in lines[i]:
            other_end = i - 1
            break
            
    if other_end is None:
        other_end = other_start + 45 # rough fallback
        
    print(f"Oracle: {oracle_start} to {oracle_end}")
    print(f"Other: {other_start} to {other_end}")
    
    # We want to swap them
    oracle_block = lines[oracle_start:oracle_end+1]
    other_block = lines[other_start:other_end+1]
    
    # Reassemble: ... before_oracle, other_block, oracle_block, after_other ...
    new_lines = lines[:oracle_start] + other_block + oracle_block + lines[other_end+1:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Successfully swapped and saved!")
else:
    print("Could not find oracle or other blocks.")
