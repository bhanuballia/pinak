import os
import re

# File paths
PLANET_IN_SIGN_FILE = r'd:\vedic-astrology-app - 2\frontend\src\data\planetInSign.js'
OUTPUT_DIR = r'd:\vedic-astrology-app - 2\frontend\src\data\planets'

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

with open(PLANET_IN_SIGN_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to extract each planet's object from PLANET_IN_SIGN_EFFECTS
# It's structured as:
# export const PLANET_IN_SIGN_EFFECTS = {
#   Moon: { ... },
#   Sun: { ... },
#   Mars: { ... },
#   ...
# };

# Using a simple regex to find top-level keys in the object
# This assumes the keys are at the start of the line with 2 spaces indentation
# or similar structure as seen in view_file.

# Let's try to find the start and end of each planet's data
planets = [
    "Moon", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
]

planet_data = {}

for i, planet in enumerate(planets):
    start_pattern = rf'^\s+{planet}:\s+{{'
    match = re.search(start_pattern, content, re.MULTILINE)
    if not match:
        print(f"Could not find start of {planet}")
        continue
    
    start_idx = match.start()
    
    # Find the matching closing brace for this planet
    # Since they are indented, we can look for the next planet or the end of the object
    if i < len(planets) - 1:
        next_planet = planets[i+1]
        next_pattern = rf'^\s+{next_planet}:\s+{{'
        next_match = re.search(next_pattern, content, re.MULTILINE)
        if next_match:
            end_idx = next_match.start()
            # Trim trailing comma and whitespace
            data = content[start_idx:end_idx].strip()
            if data.endswith(','):
                data = data[:-1].strip()
        else:
            # Fallback for last planet or missing next
            data = content[start_idx:].strip()
    else:
        # Last planet
        data = content[start_idx:].strip()
        # Remove the closing brace of the main object if it's there
        if data.endswith('};'):
            data = data[:-2].strip()
        if data.endswith('}'):
            data = data[:-1].strip()

    planet_data[planet] = data

# Write out each planet file
for planet, data in planet_data.items():
    filename = os.path.join(OUTPUT_DIR, f"{planet.lower()}.js")
    with open(filename, 'w', encoding='utf-8') as f:
        # Extract the content inside the first { and the last }
        # The data is "Planet: { ... }"
        first_brace = data.find('{')
        last_brace = data.rfind('}')
        inner_content = data[first_brace+1:last_brace].strip()
        
        f.write(f"export const {planet.upper()}_EFFECTS = {{\n")
        f.write(f"  {inner_content}\n")
        f.write("};\n")


print("Finished splitting planetInSign.js")
