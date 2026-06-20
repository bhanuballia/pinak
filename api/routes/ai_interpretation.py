import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

router = APIRouter()

VARGA_METADATA = {
    "d1": {"name": "Lagna (D1) Rashi Chart", "focus": "Overall life, personality, core nature, and general path."},
    "d2": {"name": "Hora (D2) Chart", "focus": "Wealth, liquid assets, financial resources, and prosperity."},
    "d3": {"name": "Drekkana (D3) Chart", "focus": "Siblings, initiative, courage, and short travels."},
    "d4": {"name": "Chaturthamsha (D4) Chart", "focus": "Property, fixed assets, home, and general destiny."},
    "d7": {"name": "Saptamsha (D7) Chart", "focus": "Children, progeny, creativity, and lineage."},
    "d9": {"name": "Navamsha (D9) Chart", "focus": "Marriage, spouse, partnerships, and the inner soul's progress."},
    "d10": {"name": "Dashamsha (D10) Chart", "focus": "Career, profession, social status, power, and fame."},
    "d12": {"name": "Dwadashamsha (D12) Chart", "focus": "Parents, ancestry, heritage, and lineage-based influences."},
    "d16": {"name": "Shodashamsha (D16) Chart", "focus": "Vehicles, luxuries, happiness, and mental peace."},
    "d20": {"name": "Vimshamsha (D20) Chart", "focus": "Spiritual progress, religious inclinations, and devotion."},
    "d24": {"name": "Chaturvimshamsha (D24) Chart", "focus": "Education, knowledge, learning, and academic achievements."},
    "d27": {"name": "Saptavimshamsha (D27) Chart", "focus": "Strengths, weaknesses, and physical endurance."},
    "d30": {"name": "Trimshamsha (D30) Chart", "focus": "Obstacles, misfortunes, health issues, and subconscious patterns."},
    "d40": {"name": "Khavedamsha (D40) Chart", "focus": "Auspicious/inauspicious effects of planets and general fortune."},
    "d45": {"name": "Akshavedamsha (D45) Chart", "focus": "Character, integrity, and overall spiritual blueprint."},
    "d60": {"name": "Shashtiamsha (D60) Chart", "focus": "Past life karma, deep-seated destiny, and overall planetary strength."}
}

# Initialize the Gemini Model lazily or when env var is present
def get_gemini_model():
    from dotenv import load_dotenv
    load_dotenv() # Force reload .env
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set in environment variables.")
    
    genai.configure(api_key=api_key)
    generation_config = {
      "temperature": 0.7,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 4096,
    }
    # Using gemini-2.5-flash
    return genai.GenerativeModel(
      model_name="gemini-2.5-flash",
      generation_config=generation_config,
    )

def extract_chart_context(data: Dict[str, Any], selected_chart: str = "d1") -> str:
    """Build a text context string from the chart JSON, supporting divisional varga charts."""
    try:
        basic = data.get("basic_details", {})
        
        context = []
        context.append(f"Date of Birth: {basic.get('day', 'Unknown')}/{basic.get('month', 'Unknown')}/{basic.get('year', 'Unknown')}")
        context.append(f"Time of Birth: {basic.get('hour', '00')}:{basic.get('minute', '00')}")
        
        varga_data = data.get("vargas", {}).get(selected_chart) if selected_chart != "d1" else None
        
        if selected_chart != "d1" and varga_data:
            asc_sign = varga_data.get("ascendant_sign", "Unknown")
            context.append(f"Ascendant Sign (Lagna) in {selected_chart.upper()} Chart: {asc_sign}")
            context.append(f"\nPlanetary Positions ({selected_chart.upper()} Chart):")
            
            planet_house_sign = {}
            houses = varga_data.get("houses", {})
            for h_key, h_info in houses.items():
                house_planets = h_info.get("planets", [])
                h_sign = h_info.get("sign_name", "")
                for p in house_planets:
                    p_name = None
                    if isinstance(p, str):
                        p_name = p
                    elif isinstance(p, dict):
                        p_name = p.get("name") or p.get("planet")
                    
                    if p_name:
                        planet_house_sign[p_name] = (h_key, h_sign)
            
            for p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
                if p_name in planet_house_sign:
                    h_num, h_sign = planet_house_sign[p_name]
                    context.append(f"- {p_name} is in {h_sign} (House {h_num})")
        else:
            planets = data.get("planet_positions", [])
            context.append("\nPlanetary Positions (D1 Chart):")
            for p in planets:
                p_name = p.get("planet", "")
                sign = p.get("sign", "")
                house = p.get("house", "")
                nak = p.get("nakshatra", "")
                if p_name and sign:
                    context.append(f"- {p_name} is in {sign} (House {house}), in {nak} Nakshatra.")
        
        # Add strength/dignity if available
        strength_data = data.get("strength", {}).get("planets", {})
        if strength_data:
            context.append("\nPlanetary Strengths (Shadbala in Rupa and components):")
            for p_name, s in strength_data.items():
                if isinstance(s, dict) and 'total' in s:
                    ratio = s.get('ratio_data', {}).get('ratio', 1.0)
                    context.append(
                        f"- {p_name}: Total {s['total']:.2f} Rupa (BPHS Ratio: {ratio:.2f}). "
                        f"Components: Sthana={s.get('sthana', 0):.1f}, Dig={s.get('dig', 0):.1f}, "
                        f"Kala={s.get('kala', 0):.1f}, Cheshta={s.get('cheshta', 0):.1f}, "
                        f"Naisargika={s.get('naisargika', 0):.1f}, Drik={s.get('drik', 0):.1f}"
                    )
                    
        # Add Vimshopaka Bala if available
        vimsopaka_assessment = data.get("vimsopaka_assessment", {})
        if vimsopaka_assessment:
            context.append("\nVimshopaka Bala Strength Assessment:")
            summary = vimsopaka_assessment.get("summary", {})
            if summary:
                context.append(f"- Strongest Planets: {', '.join(summary.get('strongest_planets', []))}")
                context.append(f"- Weakest Planets: {', '.join(summary.get('weakest_planets', []))}")
                context.append(f"- Wealth Potential (based on Vimsopaka): {summary.get('wealth_potential')}")
                context.append(f"- Career Potential (based on Vimsopaka): {summary.get('career_potential')}")
                context.append(f"- Relationship Pattern Strength: {summary.get('relationship_pattern')}")
                context.append(f"- Mental Stability Strength: {summary.get('mental_stability')}")
            
            interpretations = vimsopaka_assessment.get("interpretations", {})
            if interpretations:
                context.append("- Individual Vimshopaka Scores (out of 20):")
                for p, p_data in interpretations.items():
                    context.append(f"  * {p}: {p_data.get('vimsopaka_score')} ({p_data.get('strength')})")
                    
        return "\n".join(context)
    except Exception as e:
        print(f"Error building context: {e}")
        return str(data) # Fallback to raw string if parsing fails


@router.post("/chart-reading")
def ai_chart_reading(payload: Dict[str, Any] = Body(...)):
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        selected_chart = payload.get("selected_chart", "d1")
        
        chart_context = extract_chart_context(chart_data, selected_chart)
        
        if selected_chart == "d1":
            system_instruction = (
                "You are a master Vedic Astrologer following the principles of Brihat Parashara Hora Shastra (BPHS). "
                "Do not use Western Tropical astrology concepts. Analyze the provided planetary positions, considering houses, "
                "signs, and dignities.\n\n"
                "CRITICAL INSTRUCTION: You MUST provide a complete 8-part reading. To prevent truncation, you MUST keep "
                "each section concise (around 120-150 words per section, 1-2 paragraphs max). The entire response MUST "
                "be fully completed within 600 words total.\n\n"
                "You MUST include all 8 of the following sections exactly:\n"
                "## 1. Personality and Core Nature\n"
                "## 2. Career and Wealth Potential\n"
                "## 3. Relationships and Marriage\n"
                "## 4. Children and Progeny\n"
                "## 5. Health and Wellness Insights\n"
                "## 6. Key Life Challenges\n"
                "## 7. Spiritual Inclination and Philosophy\n"
                "## 8. Overall Life Prediction\n\n"
                "Ensure the response is fully detailed yet concise for each section and uses Markdown formatting."
            )
        else:
            varga_info = VARGA_METADATA.get(selected_chart, {"name": f"{selected_chart.upper()} Chart", "focus": "General divisional analysis."})
            v_name = varga_info["name"]
            v_focus = varga_info["focus"]
            system_instruction = (
                f"You are a master Vedic Astrologer following the principles of Brihat Parashara Hora Shastra (BPHS).\n"
                f"Do not use Western Tropical astrology concepts. Analyze the provided planetary positions in the **{v_name}**, "
                f"which specifically represents: **{v_focus}**.\n\n"
                f"CRITICAL INSTRUCTION: You MUST provide a complete 4-part reading for this divisional chart. To prevent truncation, "
                f"you MUST keep each section concise (around 120-150 words per section, 1-2 paragraphs max). The entire response MUST "
                f"be fully completed within 600 words total.\n\n"
                f"You MUST include all 4 of the following sections exactly:\n"
                f"## 1. Core Focus of the {v_name}\n"
                f"## 2. Strengths and Benefic Influences\n"
                f"## 3. Weaknesses and Malefic Influences\n"
                f"## 4. Astrological Guidance and Remedies\n\n"
                f"Ensure the response is fully detailed yet concise for each section and uses Markdown formatting."
            )
        
        prompt = f"{system_instruction}\n\nHere is the native's chart data:\n\n{chart_context}\n\nPlease generate the comprehensive reading."
        
        response = model.generate_content(prompt)
        
        return {"result": response.text}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[AI ERROR] Chart reading failed: {error_trace}")
        err_msg = str(e)
        if "Quota exceeded" in err_msg or "429" in err_msg or "ResourceExhausted" in err_msg:
            raise HTTPException(
                status_code=429,
                detail="The AI Oracle's daily rate limit has been exceeded. Please retry in a few minutes or verify your Gemini API key limits."
            )
        raise HTTPException(status_code=500, detail=err_msg)


@router.post("/dasha-reading")
def ai_dasha_reading(payload: Dict[str, Any] = Body(...)):
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        chart_context = extract_chart_context(chart_data)
        
        dasha_system = payload.get("dasha_system", "vimshottari")
        if dasha_system != "vimshottari":
            dasha_name = payload.get("dasha_name", "Dasha")
            selected_period = payload.get("selected_period", {})
            dasha_list = payload.get("dasha_list", [])
            
            lord_or_sign = selected_period.get("lord") or selected_period.get("sign") or selected_period.get("item") or "Unknown"
            start_age = selected_period.get("start", 0.0)
            end_age = selected_period.get("end", 0.0)
            duration = selected_period.get("duration", 0.0)
            
            dasha_list_str = []
            for d in dasha_list:
                l_s = d.get("lord") or d.get("sign") or d.get("item")
                s = d.get("start", 0)
                e = d.get("end", 0)
                if l_s:
                    dasha_list_str.append(f"- {l_s}: {s:.1f}y to {e:.1f}y")
            dasha_sequence_text = "\n".join(dasha_list_str)
            
            system_instruction = (
                f"You are a highly experienced Vedic Astrologer following Brihat Parashara Hora Shastra (BPHS) and Jaimini Sutras.\n"
                f"The user is asking for a prediction for their {dasha_name} period.\n\n"
                f"Analyze the selected period ({lord_or_sign}) "
                f"which runs from native's age {start_age:.1f}y to {end_age:.1f}y (duration: {duration:.1f} years) in detail.\n\n"
                f"Depending on whether the dasha is a Graha Dasha (planetary), Rashi Dasha (sign-based), or Aayu Dasha (longevity), "
                f"apply the appropriate astrological rules:\n"
                f"- For Graha Dashas (e.g. Shodashottari, Ashtottari, etc.), analyze the placement, house ownership, and strength "
                f"of the planetary lord in the chart.\n"
                f"- For Rashi Dashas (e.g. Chara, Mandooka, Drig, Sudasha), analyze the sign, the planets placed in it, "
                f"the position of the sign lord, and aspects on the sign (Rashi Drishti).\n"
                f"- For Aayu Dashas (e.g. Shoola, Niryana Shoola, Sthira), analyze the health, vitality, longevity, "
                f"potential challenges, and maraka (death-inflicting/obstacle) influences during this period.\n\n"
                f"To prevent truncation, keep the response concise and under 400 words total. "
                f"Structure the response beautifully using Markdown headings, bullet points, and an empathetic tone."
            )
            
            prompt = (
                f"{system_instruction}\n\n"
                f"Here is the native's chart data:\n{chart_context}\n\n"
                f"Dasha System: {dasha_name}\n"
                f"Selected Period: {lord_or_sign} ({start_age:.1f}y - {end_age:.1f}y, duration {duration:.1f}y)\n\n"
                f"Full Dasha Sequence for reference:\n{dasha_sequence_text}\n\n"
                f"Please generate the astrological reading for this specific period."
            )
        else:
            current_md = payload.get("mahadasha", "Unknown")
            current_ad = payload.get("antardasha", "Unknown")
            system_instruction = (
                "You are a highly experienced Vedic Astrologer. The user is asking for a prediction for their current "
                "Vimshottari Dasha period. Analyze the interaction between the Mahadasha lord and Antardasha lord based "
                "on their house placements and relationship in the provided chart context. Predict the likely themes and events "
                "regarding career, health, finances, and relationships for this specific timeframe. "
                "To prevent truncation, keep the response concise and under 400 words total. "
                "Keep the response highly structured using Markdown formatting, and be empathetic and constructive."
            )
            prompt = f"{system_instruction}\n\nHere is the native's chart data:\n\n{chart_context}\n\nThe native is currently running:\n- Mahadasha: {current_md}\n- Antardasha: {current_ad}\n\nPlease generate a reading for this specific period."
        
        response = model.generate_content(prompt)
        
        return {"result": response.text}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[AI ERROR] Dasha reading failed: {error_trace}")
        err_msg = str(e)
        if "Quota exceeded" in err_msg or "429" in err_msg or "ResourceExhausted" in err_msg:
            raise HTTPException(
                status_code=429,
                detail="The AI Oracle's daily rate limit has been exceeded. Please retry in a few minutes or verify your Gemini API key limits."
            )
        raise HTTPException(status_code=500, detail=err_msg)


@router.post("/vimsopaka-reading")
def ai_vimsopaka_reading(payload: Dict[str, Any] = Body(...)):
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        chart_context = extract_chart_context(chart_data)
        
        system_instruction = (
            "You are a master Vedic Astrologer. You are performing a Vimsopaka Bala (divisional strength) analysis.\n\n"
            "Analyze the native's chart and divisional strengths based on their Vimshopaka scores (excellent, good, average, inauspicious). "
            "Address planetary strengths, wealth/career potential, mental and relationship pattern indicators, and gemstones or remedies. "
            "Keep the response highly structured using Markdown formatting (headings, lists, bold text).\n\n"
            "CRITICAL INSTRUCTION: Keep the response concise and under 500 words total to prevent truncation."
        )
        
        prompt = (
            f"{system_instruction}\n\n"
            f"Here is the native's chart and Vimshopaka context:\n\n{chart_context}\n\n"
            f"Please generate a profound Vimshopaka Bala Strength & Remedy reading."
        )
        
        response = model.generate_content(prompt)
        return {"result": response.text}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[AI ERROR] Vimsopaka reading failed: {error_trace}")
        err_msg = str(e)
        if "Quota exceeded" in err_msg or "429" in err_msg or "ResourceExhausted" in err_msg:
            raise HTTPException(
                status_code=429,
                detail="The AI Oracle's daily rate limit has been exceeded. Please retry in a few minutes or verify your Gemini API key limits."
            )
        raise HTTPException(status_code=500, detail=err_msg)


@router.post("/shadbala-reading")
def ai_shadbala_reading(payload: Dict[str, Any] = Body(...)):
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        chart_context = extract_chart_context(chart_data)
        
        system_instruction = (
            "You are a master Vedic Astrologer. You are performing a Shadbala (six-fold planetary strength) analysis.\n\n"
            "Analyze the native's planetary strengths based on their Shadbala scores (in Rupa) and whether they satisfy "
            "the minimum required strengths (Sufficient vs Weak status), and their Relative Strength Ratio (BPHS).\n"
            "Interpret what these strengths imply for the native's personality, life path, career/wealth, and challenges. "
            "Highlight Sthana Bala, Dig Bala, Cheshta Bala, Kala Bala, Naisargika Bala, and Drik Bala where relevant.\n"
            "Keep the response highly structured using Markdown formatting (headings, lists, bold text).\n\n"
            "CRITICAL INSTRUCTION: Keep the response concise and under 500 words total to prevent truncation."
        )
        
        prompt = (
            f"{system_instruction}\n\n"
            f"Here is the native's chart and Shadbala context:\n\n{chart_context}\n\n"
            f"Please generate a profound Shadbala Strength reading."
        )
        
        response = model.generate_content(prompt)
        return {"result": response.text}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[AI ERROR] Shadbala reading failed: {error_trace}")
        err_msg = str(e)
        if "Quota exceeded" in err_msg or "429" in err_msg or "ResourceExhausted" in err_msg:
            raise HTTPException(
                status_code=429,
                detail="The AI Oracle's daily rate limit has been exceeded. Please retry in a few minutes or verify your Gemini API key limits."
            )
        raise HTTPException(status_code=500, detail=err_msg)


def extract_planet_table_context(data: Dict[str, Any]) -> str:
    try:
        planets = data.get("planet_positions", [])
        if not planets:
            return "No planetary positions available."
        
        # Calculate Jaimini Karakas
        k7, k8 = {}, {}
        valid_planets_7 = [p for p in planets if p.get('planet') not in ["Rahu", "Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"]]
        sorted_7 = sorted(valid_planets_7, key=lambda x: (x.get('degree', 0) % 30), reverse=True)
        k7_names = ["Atma Karaka", "Amatya Karaka", "Bhratru Karaka", "Matru Karaka", "Pitri Karaka", "Gnati Karaka", "Dara Karaka"]
        for idx, p in enumerate(sorted_7):
            if idx < len(k7_names):
                k7[p['planet']] = k7_names[idx]

        valid_planets_8 = [p for p in planets if p.get('planet') not in ["Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"]]
        def get_deg_8(p):
            deg = p.get('degree', 0) % 30
            if p.get('planet') == "Rahu":
                deg = 30.0 - deg
            return deg
        sorted_8 = sorted(valid_planets_8, key=get_deg_8, reverse=True)
        k8_names = ["Atma Karaka", "Amatya Karaka", "Bhratru Karaka", "Matru Karaka", "Pitri Karaka", "Putra Karaka", "Gnati Karaka", "Dara Karaka"]
        for idx, p in enumerate(sorted_8):
            if idx < len(k8_names):
                k8[p['planet']] = k8_names[idx]

        avasthas = data.get("planetary_avasthas", {})
        strength_planets = data.get("strength", {}).get("planets", {})
        ashtakavarga = data.get("ashtakavarga", {}).get("planets", {})

        context = []
        context.append("PLANET TABLE DATA (Planetary Positions, Nakshatras & Dignities):")
        for p in planets:
            p_name = p.get("planet") or p.get("name")
            if not p_name:
                continue
            deg_val = p.get("degree", 0)
            sign = p.get("sign", "")
            house = p.get("house", "")
            nak = p.get("nakshatra", "")
            nak_lord = p.get("nakshatra_lord", "")
            pada = p.get("nakshatra_pada", "")
            dignity = p.get("dignity", "Neutral")
            retro = p.get("retrograde", False)

            p_av = avasthas.get(p_name, {})
            jagradadi = p_av.get("jagradadi", "").replace("\n", " ")
            baladi = p_av.get("baladi", "").replace("\n", " ")
            deeptadi = p_av.get("deeptadi", "").replace("\n", " ")
            shyanadi = p_av.get("shyanadi", "").replace("\n", " ")

            jk7 = k7.get(p_name, "-")
            jk8 = k8.get(p_name, "-")

            sb_data = strength_planets.get(p_name, {})
            sb_total = sb_data.get("total", 0.0)
            sb_ratio = sb_data.get("ratio_data", {}).get("ratio", 1.0)
            av_points = ashtakavarga.get(p_name, 4)

            retro_str = " (Retrograde)" if retro else ""
            
            planet_str = (
                f"- **{p_name}**{retro_str}: Longitude: {deg_val:.2f}° (Sign: {sign}, House {house}), "
                f"Nakshatra: {nak} (Pada {pada}, Lord: {nak_lord}). "
                f"Dignity: {dignity}. "
                f"Avasthas: Jagradadi={jagradadi}, Baladi={baladi}, Deeptadi={deeptadi}, Shyanadi={shyanadi}. "
                f"Jaimini Karaka (7): {jk7}, Jaimini Karaka (8): {jk8}. "
                f"Shadbala: {sb_total:.2f} Rupa (Ratio: {sb_ratio:.2f}). "
                f"Ashtakavarga Score: {av_points} points."
            )
            context.append(planet_str)
        return "\n".join(context)
    except Exception as e:
        import traceback
        print(f"Error building planet table context: {e}, {traceback.format_exc()}")
        return str(data)


@router.post("/planets-reading")
def ai_planets_reading(payload: Dict[str, Any] = Body(...)):
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        planet_context = extract_planet_table_context(chart_data)
        
        system_instruction = (
            "You are a master Vedic Astrologer. You are performing a detailed Planet Tables analysis.\n\n"
            "Analyze the native's planetary positions, longitudes, nakshatras, dignities, avasthas, Jaimini Karakas, "
            "Shadbala ratios, and Ashtakavarga points. Predict what these factors imply for the native's overall life path, "
            "personality, career/wealth, and challenges.\n"
            "Be sure to synthesize their placements: e.g., evaluate dignity (exaltation, own sign, debilitation), "
            "Jaimini Karakas (especially Atma Karaka and Amatya Karaka), avasthas (e.g. state of alertness/sleeping), and "
            "Ashtakavarga strengths.\n"
            "Keep the response highly structured using Markdown formatting (headings, lists, bold text).\n\n"
            "CRITICAL INSTRUCTION: Keep the response concise and under 500 words total to prevent truncation."
        )
        
        prompt = (
            f"{system_instruction}\n\n"
            f"Here is the native's planetary details:\n\n{planet_context}\n\n"
            f"Please generate a profound, comprehensive Planet Tables reading."
        )
        
        response = model.generate_content(prompt)
        return {"result": response.text}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[AI ERROR] Planet reading failed: {error_trace}")
        err_msg = str(e)
        if "Quota exceeded" in err_msg or "429" in err_msg or "ResourceExhausted" in err_msg:
            raise HTTPException(
                status_code=429,
                detail="The AI Oracle's daily rate limit has been exceeded. Please retry in a few minutes or verify your Gemini API key limits."
            )
        raise HTTPException(status_code=500, detail=err_msg)

