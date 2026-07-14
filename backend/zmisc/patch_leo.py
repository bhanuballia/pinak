import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_leo.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Leo in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Leo in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Leo.")
    
    # We will use the existing Leo block but add houses
    # Leo: {
    #   effect: "...",
    #   remedies: []
    # }
    
    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    leo_block_regex = re.compile(r"(Leo:\s*\{\s*effect:\s*\")(.*?)(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Leo: {\n        effect: \""
        effect = match.group(2)
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + suffix
        
    new_js = leo_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
