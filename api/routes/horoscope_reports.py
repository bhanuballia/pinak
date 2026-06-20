import os
import json
import asyncio
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from typing import Dict, Any, AsyncGenerator

router = APIRouter()

TOPICS = [
    "General Reading",
    "Finance",
    "Career",
    "Marriage Life",
    "Love Life",
    "For Students",
    "Dealing in Stocks",
    "Travel",
    "Spirituality",
    "Health",
    "Remedies"
]

def get_gemini_model():
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
    
    genai.configure(api_key=api_key)
    # Using 1.5 Flash for speed and token economy for massive reports
    generation_config = {
      "temperature": 0.7,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 8192,
    }
    return genai.GenerativeModel(
      model_name="gemini-2.5-flash",
      generation_config=generation_config,
    )

def _condense_chart_data(data: Dict[str, Any]) -> str:
    """Condense chart data to minimal representation to save input tokens across 11 prompts."""
    try:
        basic = data.get("basic_details", {})
        planets = data.get("planet_positions", [])
        
        context = []
        context.append(f"DOB: {basic.get('day')}/{basic.get('month')}/{basic.get('year')} {basic.get('hour')}:{basic.get('minute')}")
        context.append("Planets:")
        for p in planets:
            p_name = p.get("planet", "")
            sign = p.get("sign", "")
            house = p.get("house", "")
            nak = p.get("nakshatra", "")
            if p_name and sign:
                context.append(f"{p_name}: {sign}(H{house}) in {nak}")
                
        # Include current active dashas if available
        dasha_engine = data.get("dasha_engine", {})
        if dasha_engine:
            md = dasha_engine.get("mahadasha", "Unknown")
            ad = dasha_engine.get("antardasha", "Unknown")
            pd = dasha_engine.get("pratyantar", "Unknown")
            context.append(f"Current Dasha: {md} MD -> {ad} AD -> {pd} PD")
            
        return "\n".join(context)
    except Exception as e:
        return str(data)

async def generate_report_stream(payload: Dict[str, Any]) -> AsyncGenerator[str, None]:
    try:
        model = get_gemini_model()
        chart_data = payload.get("chart_data", {})
        report_type = payload.get("report_type", "daily") # daily, monthly, yearly
        
        from datetime import datetime
        current_date_str = datetime.now().strftime("%B %d, %Y")
        
        # Calculate true astrological transits
        transit_str = ""
        try:
            from astronomy.julian import datetime_to_julian
            from charts.rashi_chart import build_rashi_chart
            
            basic = chart_data.get("basic_details", {})
            lat = float(basic.get("lat", 28.6139))
            lon = float(basic.get("lon", 77.2090))
            
            t_dt_utc = datetime.utcnow()
            t_jd_ut = datetime_to_julian(t_dt_utc)
            
            transit_chart = build_rashi_chart(t_jd_ut, lat, lon)
            transit_planets = []
            
            for h_num, h_info in transit_chart.get("houses", {}).items():
                for p in h_info.get("planets", []):
                    p_name = p.get("name")
                    sign_name = h_info.get("sign_name", "Unknown")
                    transit_planets.append(f"{p_name} in {sign_name} (House {h_num})")
                    
            if transit_planets:
                transit_str = f"\n\n**TODAY'S TRANSIT POSITIONS (GOCHAR):**\n" + ", ".join(transit_planets)
                transit_str += "\nAnalyze these transits against the natal chart."
        except Exception as e:
            print(f"[AI STREAM] Transit calculation error: {e}")
            transit_str = ""

        condensed_context = _condense_chart_data(chart_data) + transit_str
        
        # Determine prompt structure based on report type
        if report_type == "daily":
            # Daily fits in one single prompt
            prompt = (
                f"You are an expert Vedic Astrologer. Today's date is {current_date_str}.\n"
                f"Generate a comprehensive 1-page Daily Horoscope for today.\n"
                f"Critically analyze the current transits (Gochar) against the native's birth chart and current Dashas.\n"
                f"Use the following topics: {', '.join(TOPICS)}.\n"
                f"Keep each topic to 1 paragraph. Use Markdown headings for each topic.\n\n"
                f"Native's condensed chart & Transits:\n{condensed_context}"
            )
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        else:
            # Monthly and Yearly require massive outputs (30 to 50 pages).
            # We iterate through each topic, yielding the generated text for each.
            
            time_context = "for this Month" if report_type == "monthly" else "for this Year (month-by-month breakdown)"
            depth_instruction = (
                "Write an exhaustive, extremely detailed analysis covering 2-3 pages." 
                if report_type == "monthly" 
                else "Write an exhaustive, extremely detailed analysis spanning 4-5 pages, breaking down the predictions over different parts of the year."
            )

            for i, topic in enumerate(TOPICS):
                topic_prompt = (
                    f"You are an expert Vedic Astrologer writing a comprehensive {report_type.capitalize()} Report.\n"
                    f"Today's date is {current_date_str}. Please base your predictions relative to this current date.\n"
                    f"Critically analyze the current transits (Gochar) against the native's birth chart and current Dashas.\n"
                    f"Write the section specifically for: **{topic}** {time_context}.\n"
                    f"{depth_instruction}\n"
                    f"Use Markdown formatting with headings (e.g., `## {topic}`). Include precise astrological reasoning referencing specific transits.\n\n"
                    f"Native's condensed chart & Transits:\n{condensed_context}"
                )
                
                # Yield a separator if not the first topic
                if i > 0:
                    yield "\n\n---\n\n"
                
                response = model.generate_content(topic_prompt, stream=True)
                for chunk in response:
                    if chunk.text:
                        yield chunk.text
                        await asyncio.sleep(0.01) # Small sleep to ensure event loop yields
                        
            yield "\n\n**Report Generation Complete.**"
            
    except Exception as e:
        import traceback
        print(f"[AI STREAM ERROR]: {traceback.format_exc()}")
        yield f"\n\n**Error during generation:** {str(e)}"

@router.post("/stream")
async def stream_horoscope_report(payload: Dict[str, Any] = Body(...)):
    """
    Expects payload: { "chart_data": {...}, "report_type": "daily" | "monthly" | "yearly" }
    """
    return StreamingResponse(generate_report_stream(payload), media_type="text/plain")
