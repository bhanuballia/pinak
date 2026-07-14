"""
reports/ai_text/varga_explainer.py

AI-powered explanation generator for divisional (varga) charts.
Generates bilingual explanations using Gemini AI with traditional Vedic astrology context.
"""

import os
from typing import Dict, Any, Optional
from .varga_knowledge import get_varga_info
from core.astrology.divisional.deities import get_varga_deities
from core.analysis.karaka_rules import evaluate_planet_strength_across_vargas
from core.analysis.vimsopaka_engine import get_compound_dignity

# Try to import Gemini AI
try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False
    print("[VARGA EXPLAINER] Warning: google-generativeai not installed. Using fallback explanations.")


def explain_varga_chart(
    d_number: int,
    varga_data: Dict[str, Any],
    report_data: Dict[str, Any],
    style: str = "minimal"
) -> Dict[str, str]:
    """
    Generate AI-powered explanation for a divisional chart.
    
    Args:
        d_number: Divisional chart number (1, 2, 3, etc.)
        varga_data: The varga chart data with planetary positions
        report_data: Full report data for context
        style: "minimal" or "premium"
    
    Returns:
        Dictionary with 'en' (English) and 'hi' (Hindi) explanations
    """
    # Get traditional knowledge about this chart
    varga_info = get_varga_info(d_number)
    
    if not varga_info:
        return {
            "en": f"D{d_number} chart analysis not available.",
            "hi": f"D{d_number} चार्ट विश्लेषण उपलब्ध नहीं है।"
        }
    
    # Analyze planetary placements in this varga
    planet_analysis = _analyze_planetary_placements(varga_data, d_number)
    
    # Generate AI explanation if available, otherwise use template
    if _HAS_GEMINI and os.getenv("GEMINI_API_KEY"):
        try:
            explanation = _generate_ai_explanation(
                d_number, varga_info, planet_analysis, report_data, style
            )
        except Exception as e:
            print(f"[VARGA EXPLAINER] AI generation failed for D{d_number}: {e}")
            explanation = _generate_template_explanation(d_number, varga_info, planet_analysis, report_data, style)
    else:
        explanation = _generate_template_explanation(d_number, varga_info, planet_analysis, report_data, style)
    
    return explanation


def _analyze_planetary_placements(varga_data: Dict[str, Any], d_number: int) -> Dict[str, Any]:
    """
    Analyze key planetary positions in the varga chart.
    
    Returns:
        Dictionary with analysis of important placements
    """
    analysis = {
        "ascendant_sign": varga_data.get("ascendant_sign", "Unknown"),
        "planets_in_signs": {},
        "strong_planets": [],
        "weak_planets": [],
        "key_placements": [],
        "deities": {},
        "vargottama": []
    }
    
    # Get planet positions
    varga_positions = varga_data.get("varga_positions", {})
    
    for planet, pdata in varga_positions.items():
        sign_name = pdata.get("sign_name", "Unknown")
        analysis["planets_in_signs"][planet] = sign_name
    
    # Identify key placements based on chart type
    houses = varga_data.get("houses", {})
    
    # Check for planets in angles (1, 4, 7, 10)
    for house_num in [1, 4, 7, 10]:
        house_data = houses.get(house_num, {})
        planets = house_data.get("planets", [])
        if planets:
            analysis["key_placements"].append({
                "house": house_num,
                "planets": planets,
                "significance": "Angular house (Kendra)"
            })
    
    # Check for exalted/debilitated planets (simplified)
    exaltation_signs = {
        "Sun": "Aries", "Moon": "Taurus", "Mars": "Capricorn",
        "Mercury": "Virgo", "Jupiter": "Cancer", "Venus": "Pisces",
        "Saturn": "Libra"
    }
    
    for planet, sign in analysis["planets_in_signs"].items():
        if planet in exaltation_signs and exaltation_signs[planet] == sign:
            analysis["strong_planets"].append(planet)
    
    return analysis


def _generate_ai_explanation(
    d_number: int,
    varga_info: Dict[str, Any],
    planet_analysis: Dict[str, Any],
    report_data: Dict[str, Any],
    style: str
) -> Dict[str, str]:
    """
    Generate AI-powered explanation using Gemini.
    """
    # Configure Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    
    # Use the model that's available
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Build prompt
    name = report_data.get("meta", {}).get("name", "the native")
    
    prompt = f"""You are an expert Vedic astrologer. Analyze the {varga_info['name']} divisional chart.

**Chart Information:**
- Name: {varga_info['name']} ({varga_info['sanskrit']})
- Purpose: {varga_info['purpose']}
- Domain: {varga_info['domain']}
- Life Areas: {', '.join(varga_info['life_areas'])}

**Planetary Positions in this Chart:**
- Ascendant: {planet_analysis['ascendant_sign']}
- Planets: {', '.join([f"{p} in {s}" for p, s in planet_analysis['planets_in_signs'].items()])}
- Strong Planets: {', '.join(planet_analysis['strong_planets']) if planet_analysis['strong_planets'] else 'None particularly strong'}

**Instructions:**
1. Write a concise 3-4 sentence explanation in English about {name}'s life.
2. Focus on the chart's domain: {varga_info['domain']}.
3. Then, provide a high-quality Hindi translation of the same.
4. Format your response exactly as follows:
ENGLISH: [English text]
HINDI: [Hindi text]

Write ONLY the explanations, no preamble."""

    # Generate Bilingual explanation
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    en_text = ""
    hi_text = ""
    
    if "HINDI:" in text:
        parts = text.split("HINDI:")
        hi_text = parts[1].strip()
        en_text = parts[0].replace("ENGLISH:", "").strip()
    else:
        en_text = text
        hi_text = "अनुवाद उपलब्ध नहीं है।" # Fallback

    return {
        "en": en_text,
        "hi": hi_text
    }



def _generate_template_explanation(
    d_number: int,
    varga_info: Dict[str, Any],
    planet_analysis: Dict[str, Any],
    report_data: Dict[str, Any],
    style: str
) -> Dict[str, str]:
    """
    Generate template-based explanation when AI is not available.
    """
    # Build English explanation
    en_parts = []
    en_parts.append(f"The {varga_info['name']} chart reveals insights about {varga_info['domain'].lower()}.")
    
    # Add ascendant info
    asc = planet_analysis['ascendant_sign']
    en_parts.append(f"With {asc} ascendant in this divisional chart, ")
    
    # Add domain-specific interpretation
    if d_number == 2:
        en_parts.append("financial matters and wealth accumulation are indicated.")
    elif d_number == 7:
        en_parts.append("matters related to children and creative expression are highlighted.")
    elif d_number == 9:
        en_parts.append("marital harmony and spiritual inclinations are emphasized.")
    elif d_number == 10:
        en_parts.append("career achievements and professional status are revealed.")
    else:
        en_parts.append(f"{varga_info['life_areas'][0].lower()} is emphasized.")
    
    # Add planetary strength info
    if planet_analysis['strong_planets']:
        planets_str = ', '.join(planet_analysis['strong_planets'])
        en_parts.append(f" Strong placement of {planets_str} indicates favorable results in this area.")

    # Apply Deity and Vargottama Logic
    if report_data and "planet_positions" in report_data:
        for p in report_data["planet_positions"]:
            p_name = p.get("planet")
            deg = p.get("degree", 0)
            
            # Deities
            if d_number == 9 and p_name == "Venus":
                deity_info = get_varga_deities(deg).get("d9", {})
                if deity_info:
                    en_parts.append(f" Venus (karaka) falls in {deity_info['deity']} Navamsha: {deity_info['interpretation']}")
            elif d_number == 10 and p_name in ["Sun", "Mercury", "Saturn", "Jupiter"]:
                deity_info = get_varga_deities(deg).get("d10", {})
                if deity_info:
                    en_parts.append(f" {p_name} falls in {deity_info['deity']} Dashamsha: {deity_info['interpretation']}")
            
            # Vargottama Check
            d1_sign = p.get("sign")
            if d1_sign and planet_analysis["planets_in_signs"].get(p_name) == d1_sign:
                d1_chart = report_data.get("vargas", {}).get("d1", {})
                r_dig = get_compound_dignity(d1_chart, p_name, d1_sign)
                strength_info = evaluate_planet_strength_across_vargas(p_name, r_dig, r_dig, True)
                en_parts.append(strength_info["text"])
                break # Just mention the first vargottama planet to avoid clutter
    
    en_text = ' '.join(en_parts)
    
    # Build Hindi explanation (simplified)
    hi_text = f"{varga_info['sanskrit']} चार्ट {varga_info['domain']} के बारे में जानकारी देता है। "
    hi_text += f"{asc} लग्न के साथ, यह क्षेत्र जीवन में महत्वपूर्ण है। "
    
    if planet_analysis['strong_planets']:
        hi_text += "मजबूत ग्रह स्थिति अनुकूल परिणाम दर्शाती है।"
    else:
        hi_text += "इस चार्ट का गहन विश्लेषण आवश्यक है।"
    
    return {
        "en": en_text,
        "hi": hi_text
    }


def generate_all_varga_explanations(
    report_data: Dict[str, Any],
    style: str = "minimal"
) -> Dict[str, Dict[str, str]]:
    """
    Generate explanations for all divisional charts in the report.
    
    Args:
        report_data: Full report data containing vargas
        style: "minimal" or "premium"
    
    Returns:
        Dictionary mapping varga keys (e.g., 'd1', 'd9') to explanations
    """
    explanations = {}
    vargas = report_data.get("vargas", {})
    
    # List of all divisional charts
    varga_numbers = [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60]
    
    for d_num in varga_numbers:
        v_key = f"d{d_num}"
        varga_data = vargas.get(v_key)
        
        if varga_data:
            try:
                # Use AI only for key charts to prevent timeouts (D1, D9, D10)
                if d_num in [1, 9, 10]:
                    explanation = explain_varga_chart(d_num, varga_data, report_data, style)
                else:
                    # Use template for other charts
                    planet_analysis = _analyze_planetary_placements(varga_data, d_num)
                    varga_info = get_varga_info(d_num)
                    explanation = _generate_template_explanation(d_num, varga_info, planet_analysis, report_data, style)
                
                explanations[v_key] = explanation
                print(f"[VARGA EXPLAINER] Generated explanation for {v_key}")
            except Exception as e:

                print(f"[VARGA EXPLAINER] Failed to generate explanation for {v_key}: {e}")
                explanations[v_key] = {
                    "en": f"Analysis for D{d_num} chart is being processed.",
                    "hi": f"D{d_num} चार्ट का विश्लेषण प्रक्रिया में है।"
                }
        else:
            print(f"[VARGA EXPLAINER] No data found for {v_key}")
    
    return explanations
