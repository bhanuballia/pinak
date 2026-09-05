import os
import json
import traceback
import asyncio
from fastapi import APIRouter, UploadFile, File, HTTPException
import google.generativeai as genai
from PIL import Image
import io

router = APIRouter()

async def analyze_single_hand(image: Image.Image, hand_type: str, api_key: str):
    # Step 1: Validate image using CV Extractor BEFORE calling expensive Gemini API
    from api.services.cv_palm_extractor import extract_palm_features
    try:
        cv_features = extract_palm_features(image)
    except ValueError as e:
        # If the image is invalid (no hand, too small, upside down), raise a 400 error immediately
        raise HTTPException(status_code=400, detail=str(e))
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-3.6-flash')
    
    if hand_type == "Left Hand":
        key_topics_schema = """
      "key_topics": [
        {"topic": "Past-Life Karma and Prarabdha (Destiny)", "icon": "🔮", "interpretation": "Details here..."},
        {"topic": "Inherited Traits and Family Lineage", "icon": "🧬", "interpretation": "Details here..."},
        {"topic": "Innate Talents and Latent Potential", "icon": "🌟", "interpretation": "Details here..."},
        {"topic": "Inner Psychology and Emotional Nature", "icon": "🧠", "interpretation": "Details here..."},
        {"topic": "Childhood and Early Environment", "icon": "🏡", "interpretation": "Details here..."}
      ],"""
    else:
        key_topics_schema = """
      "key_topics": [
        {"topic": "Health and Longevity (Ayur)", "icon": "🔎", "interpretation": "Details here based on the Life Line (Ayu Rekha) etc."},
        {"topic": "Wealth and Financial Stability (Vitta)", "icon": "📊", "interpretation": "Details here based on Fate Line (Bhagya Rekha) etc."},
        {"topic": "Career and Profession (Karma)", "icon": "📈", "interpretation": "Details here based on Sun Line (Surya Rekha) etc."},
        {"topic": "Job or Business Preference", "icon": "🏢", "interpretation": "Details here based on Fate Line, Mercury mount, etc."},
        {"topic": "Mindset and Intelligence (Buddhi)", "icon": "💡", "interpretation": "Details here based on Head Line (Buddhi Rekha) etc."},
        {"topic": "Relationships and Marriage (Vivaha)", "icon": "✨", "interpretation": "Details here based on Heart Line (Hridaya Rekha) etc."},
        {"topic": "Nature of Spouse", "icon": "💖", "interpretation": "Details here based on Heart Line and influence lines etc."},
        {"topic": "Marriage Type (Love vs Arranged)", "icon": "💍", "interpretation": "Details here based on crosses, influence lines, etc."},
        {"topic": "Progeny / Number of Children", "icon": "👶", "interpretation": "Details here based on lines of children under Mercury mount etc."},
        {"topic": "Government Job / Authority", "icon": "🏛️", "interpretation": "Details here based on Sun Line, Jupiter mount etc."},
        {"topic": "Dhan Yog (Wealth Combinations)", "icon": "💰", "interpretation": "Details here based on money triangle, clear fate line etc."},
        {"topic": "Travel and Foreign Connections (Yatra)", "icon": "📌", "interpretation": "Details here based on Mount of Moon etc."},
        {"topic": "Spiritual Growth and Karma", "icon": "📖", "interpretation": "Details here based on special signs like Lotus, Fish, Temple etc."},
        {"topic": "Challenges in Life if Any", "icon": "⚠️", "interpretation": "Details here based on islands, crosses, or breaks on major lines etc."}
      ],"""

    prompt_prefix = f"""
    You are an expert in Vedic Palmistry (Hast Rekha Shastra).
    First, critically evaluate the provided image. If it is NOT a clear, readable image of a human palm, set "is_valid_palm" to false, explain the issue in "overall_summary", and leave the rest of the arrays empty.
    If it IS a valid human palm, set "is_valid_palm" to true and provide the full reading.
    Analyze the provided image of a {hand_type} palm and provide a reading.
    Note that the Left Hand represents past karma and blueprint, while the Right Hand represents current karma and free will.
    Return the result strictly as a JSON object with the following schema:
    {{
      "is_valid_palm": true,
      "overall_summary": "A 2-3 sentence overall summary of the {hand_type} palm, or an error message if not a valid palm.",
    """
    
    prompt_suffix = """
      "lines": [
        {
          "name": "Life Line", 
          "interpretation": "Details here"
        },
        {
          "name": "Heart Line", 
          "interpretation": "Details here"
        },
        {
          "name": "Head Line", 
          "interpretation": "Details here"
        },
        {
          "name": "Fate Line (Bhagya Rekha)", 
          "interpretation": "Details here"
        },
        {
          "name": "Marriage Line", 
          "interpretation": "Details here"
        },
        {
          "name": "Children Line", 
          "interpretation": "Details here"
        }
      ],
      "mounts": [
        {
          "name": "Mount of Jupiter", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Saturn", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Sun", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Mercury", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Venus", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Moon", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Mars", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Rahu", 
          "interpretation": "Details here"
        },
        {
          "name": "Mount of Ketu", 
          "interpretation": "Details here"
        }
      ]
    }
    Only return the raw JSON object, without any markdown formatting or code blocks.
    """
    
    prompt = prompt_prefix + key_topics_schema + prompt_suffix
    
    # We must run generation in a threadpool to not block the event loop
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: model.generate_content(
            [prompt, image],
            generation_config={"response_mime_type": "application/json"}
        )
    )
    
    text_response = response.text.strip()
    if text_response.startswith("```json"):
        text_response = text_response[7:-3].strip()
    elif text_response.startswith("```"):
        text_response = text_response[3:-3].strip()
        
    try:
        result = json.loads(text_response)
        
        # Merge CV features (points/bounding_boxes) into the text reading
        if "lines" in result:
            for line in result["lines"]:
                # Find matching line in cv_features
                cv_line = next((l for l in cv_features.get("lines", []) if l["name"] == line["name"]), None)
                if cv_line:
                    line["points"] = cv_line["points"]
                else:
                    line["points"] = []
                    
            # Add any extra lines from CV (like Manibandh Rekha) that Gemini didn't know about
            existing_line_names = {l["name"] for l in result["lines"]}
            for cv_line in cv_features.get("lines", []):
                if cv_line["name"] not in existing_line_names:
                    result["lines"].append({
                        "name": cv_line["name"],
                        "interpretation": "",  # No Gemini reading for minor CV lines
                        "points": cv_line["points"]
                    })
                    
        if "mounts" in result:
            for mount in result["mounts"]:
                # Find matching mount
                cv_mount = next((m for m in cv_features.get("mounts", []) if m["name"] == mount["name"]), None)
                if cv_mount:
                    mount["bounding_box"] = cv_mount["bounding_box"]
                else:
                    mount["bounding_box"] = []
                    
        # Inject the new labels array
        result["labels"] = cv_features.get("labels", [])
                    
        return result
    except json.JSONDecodeError:
        print(f"Failed to parse JSON from Gemini for {hand_type}: {text_response}")
        raise HTTPException(status_code=500, detail=f"Failed to parse the reading for {hand_type}.")

@router.post("/analyze")
async def analyze_palm(left_hand: UploadFile = File(...), right_hand: UploadFile = File(...)):
    if not left_hand.content_type.startswith("image/") or not right_hand.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Files provided must be images.")

    try:
        # Read the image files
        left_contents = await left_hand.read()
        left_image = Image.open(io.BytesIO(left_contents))
        
        right_contents = await right_hand.read()
        right_image = Image.open(io.BytesIO(right_contents))
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set in environment variables.")
        
        # Run both analyses concurrently
        left_result, right_result = await asyncio.gather(
            analyze_single_hand(left_image, "Left Hand", api_key),
            analyze_single_hand(right_image, "Right Hand", api_key)
        )
        
        # Validate that Gemini accepted the images as palms
        if not left_result.get("is_valid_palm", True):
            raise HTTPException(status_code=400, detail=f"Left Hand Error: {left_result.get('overall_summary', 'Image is not a valid palm.')}")
        if not right_result.get("is_valid_palm", True):
            raise HTTPException(status_code=400, detail=f"Right Hand Error: {right_result.get('overall_summary', 'Image is not a valid palm.')}")
        
        return {
            "left_hand_reading": left_result,
            "right_hand_reading": right_result
        }
            
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")
