import json

def generate_js():
    with open('parsed_planetInSign.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # We will build a javascript file
    js_content = """export const PLANET_IN_SIGN_EFFECTS = {
  Moon: {
"""
    
    moon = data["Moon"]
    js_content += f"""    englishName: "{moon['englishName']}",
    hindiName: "{moon['hindiName']}",
    exaltationSign: "{moon['exaltationSign']}",
    debilitationSign: "{moon['debilitationSign']}",
    ownSign: "{moon['ownSign']}",
    friendlySigns: {json.dumps(moon['friendlySigns'])},
    enemySigns: {json.dumps(moon['enemySigns'])},
    wellPlacedEffect: {json.dumps(moon['wellPlacedEffect'])},
    afflictedEffect: {json.dumps(moon['afflictedEffect'])},
    signs: {{
"""

    for sign, info in moon["signs"].items():
        js_content += f"""      {sign}: {{\n"""
        if "effect" in info:
            js_content += f"""        effect: {json.dumps(info['effect'])},\n"""
        else:
            js_content += f"""        effect: "Interpretation not available for this sign yet.",\n"""
            
        if "combustEffect" in info:
            js_content += f"""        combustEffect: {json.dumps(info['combustEffect'])},\n"""
            
        js_content += """        remedies: []
      },\n"""

    js_content += """    }
  },
  Sun: { englishName: "Sun", hindiName: "सूर्य", signs: {} },
  Mars: { englishName: "Mars", hindiName: "मंगल", signs: {} },
  Mercury: { englishName: "Mercury", hindiName: "बुध", signs: {} },
  Jupiter: { englishName: "Jupiter", hindiName: "गुरु", signs: {} },
  Venus: { englishName: "Venus", hindiName: "शुक्र", signs: {} },
  Saturn: { englishName: "Saturn", hindiName: "शनि", signs: {} },
  Rahu: { englishName: "Rahu", hindiName: "राहु", signs: {} },
  Ketu: { englishName: "Ketu", hindiName: "केतु", signs: {} },
};
"""

    with open(r'frontend\src\data\planetInSign.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("Successfully wrote frontend/src/data/planetInSign.js")

if __name__ == "__main__":
    generate_js()
