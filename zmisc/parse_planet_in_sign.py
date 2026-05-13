import json
import re

def parse_prompt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Let's fix some common typos
    text = text.replace(" hat happens", "What happens")
    lines = text.split('\n')
    
    data = {
        "Moon": {
            "englishName": "Moon",
            "hindiName": "चंद्र",
            "exaltationSign": "",
            "debilitationSign": "",
            "ownSign": "",
            "friendlySigns": [],
            "enemySigns": [],
            "wellPlacedEffect": "",
            "afflictedEffect": "",
            "signs": {}
        }
    }
    
    # Extract metadata at the top
    for line in lines[:30]:
        line = line.strip()
        if line.startswith("Exaltation Sign-"):
            data["Moon"]["exaltationSign"] = line.split("-")[1].strip()
        elif line.startswith("Debilitation Sign-"):
            data["Moon"]["debilitationSign"] = line.split("-")[1].strip()
        elif line.startswith("Own Sign-"):
            data["Moon"]["ownSign"] = line.split("-")[1].strip()
        elif line.startswith("Friendly Signs-"):
            data["Moon"]["friendlySigns"] = [s.strip() for s in line.split("-")[1].strip().split(",")]
        elif line.startswith("Enemy Signs-"):
            data["Moon"]["enemySigns"] = [s.strip() for s in line.split("-")[1].strip().split(",")]
        elif line.startswith("Moon in Exaltation/ Friendly/ Own Signs-"):
            data["Moon"]["wellPlacedEffect"] = line.split("-")[1].strip()
        elif line.startswith("Moon in Debilitation/ Enemy Signs-"):
            # sometimes the next lines have the combust info, let's grab it
            data["Moon"]["afflictedEffect"] = line.split("-")[1].split("What happens")[0].strip()
            
    # Extract combust data
    combust_pattern = re.compile(r"What happens when Moon combusts in (\w+)\?(.*?)(?=Moon in \1: Effects|Moon in \1 effects|What happens when Moon combusts in|\Z)", re.DOTALL | re.IGNORECASE)
    
    matches = combust_pattern.findall(text)
    
    for match in matches:
        sign = match[0].strip().capitalize()
        effect = match[1].strip()
        if sign not in data["Moon"]["signs"]:
            data["Moon"]["signs"][sign] = {}
        data["Moon"]["signs"][sign]["combustEffect"] = effect
        
    print("Signs matched for combust:", data["Moon"]["signs"].keys())

    # Extract general sign effects
    # Moon in Leo
    leo_pattern = re.compile(r"Leo is a fixed sign.*?Effects of all houses with Moon in Leo", re.DOTALL)
    leo_match = leo_pattern.search(text)
    if leo_match:
        if "Leo" not in data["Moon"]["signs"]:
            data["Moon"]["signs"]["Leo"] = {}
        data["Moon"]["signs"]["Leo"]["effect"] = leo_match.group(0).replace("Effects of all houses with Moon in Leo", "").strip()

    # Moon in Libra
    libra_pattern = re.compile(r"This placement shows a perfect balance.*?Effects of All Houses with Moon in Libra", re.DOTALL)
    libra_match = libra_pattern.search(text)
    if libra_match:
        if "Libra" not in data["Moon"]["signs"]:
            data["Moon"]["signs"]["Libra"] = {}
        data["Moon"]["signs"]["Libra"]["effect"] = libra_match.group(0).replace("Effects of All Houses with Moon in Libra", "").strip()

    # Moon in Scorpio
    scorpio_pattern = re.compile(r"Moon is debilitated in Scorpio Sign.*?Moon in Scorpio: Effects on all 12 Houses", re.DOTALL)
    scorpio_match = scorpio_pattern.search(text)
    if scorpio_match:
        if "Scorpio" not in data["Moon"]["signs"]:
            data["Moon"]["signs"]["Scorpio"] = {}
        data["Moon"]["signs"]["Scorpio"]["effect"] = scorpio_match.group(0).replace("Moon in Scorpio: Effects on all 12 Houses", "").strip()

    # Moon in Capricorn
    capricorn_pattern = re.compile(r"Moon in Capricorn\n(.*?)(?=What happens|\Z)", re.DOTALL)
    capricorn_match = capricorn_pattern.search(text)
    if capricorn_match:
        if "Capricorn" not in data["Moon"]["signs"]:
            data["Moon"]["signs"]["Capricorn"] = {}
        data["Moon"]["signs"]["Capricorn"]["effect"] = capricorn_match.group(1).strip()
        
    with open('parsed_planetInSign.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    parse_prompt("prompt.txt")
