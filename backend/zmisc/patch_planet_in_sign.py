import json
import re

def main():
    # Read planetInSign.js
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Read prompt2.txt
    with open('prompt2.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    # Extract houses for Moon in Aries
    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Aries in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Aries in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()

    print(f"Extracted {len(houses)} houses for Aries.")

    # We need to inject houses into Aries
    # Let's find Aries: { ... remedies: [] } in js_content
    # And replace it with the new houses property.

    # Build the houses JSON string
    houses_str = json.dumps(houses, indent=8)
    # Remove outer braces and format nicely
    houses_str = "houses: " + houses_str

    # Inject it before remedies: []
    # We find "Aries: {" and the next "remedies: []"
    aries_block_regex = re.compile(r"(Aries:\s*\{.*?)(remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        return match.group(1) + houses_str.replace('\n', '\n        ') + ",\n        " + match.group(2)
        
    new_js = aries_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
