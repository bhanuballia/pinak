import json
import re

def main():
    with open(r'frontend\src\data\planetInSign.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    with open('prompt_scorpio.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    houses = {}
    for i in range(1, 13):
        pattern = re.compile(rf"Moon in Scorpio in {i}(st|nd|rd|th) House\n(.*?)(?=Moon in Scorpio in \d+(st|nd|rd|th) House|Natal Moon Report|\Z)", re.DOTALL)
        match = pattern.search(text)
        if match:
            houses[str(i)] = match.group(2).strip()
        else:
            print(f"Warning: Could not find house {i}")

    print(f"Extracted {len(houses)} houses for Scorpio.")
    
    scorpio_effect = "Moon is debilitated in Scorpio Sign. Moon in Scorpio person have a magnetic aura which attracts people towards him. They have a detective soul which delves into the depth of their own feelings and those of others. But they can also threaten due to their strong will and assessment. They possess an intense and enthusiastic nature that can be both captivating and mysterious. They know very well what they want in life, and they will not stop until they get it.\\n\\nMoon in Scorpio placement imbues them with emotional resilience and a keen ability to transform through life’s compulsory upheavals. They may be drawn to explore, uncover hidden truths, and experience profound emotional connections. However, they may also struggle with jealousy, possessiveness, and a tendency towards emotional extremes.\\n\\nMoon in Scorpio grants a powerful emotional depth and an unwavering determination to uncover the mysteries of the heart. They experience emotions with great depth and passion. They hold an innate ability to uncover hidden truths and are unafraid to confront dark truths. They guide to explore inner strength and weaknesses.\\nThey are more sensitive. They induce trust, intimacy, and intuition. They have a consciousness of great depth. If they have a suffering from the past, they can clear it from sense due to their artistic nature. They know very well how to maximize their abilities and achieve them."

    houses_str = json.dumps(houses, indent=8)
    houses_str = "houses: " + houses_str

    scorpio_block_regex = re.compile(r"(Scorpio:\s*\{\s*effect:\s*\")[^\"]*(\",\s*remedies:\s*\[\])", re.DOTALL)
    
    def replacer(match):
        prefix = "Scorpio: {\n        effect: \""
        effect = scorpio_effect
        suffix = "\",\n        " + houses_str.replace('\n', '\n        ') + ",\n        remedies: []"
        return prefix + effect + suffix
        
    new_js = scorpio_block_regex.sub(replacer, js_content, count=1)
    
    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

if __name__ == "__main__":
    main()
