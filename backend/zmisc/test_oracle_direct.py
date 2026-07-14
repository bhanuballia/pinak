"""Direct test of analyze_life_oracle to capture exact exception."""
import traceback, sys
sys.path.insert(0, ".")

try:
    from core.analysis.life_oracle import analyze_life_oracle
    print("Import OK")
except Exception as e:
    print(f"IMPORT ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)

# Minimal stub data that report_data would have
stub = {
    "chart": {
        "houses": {str(i): {"sign": "Aries", "sign_index": 0, "degrees": 5.0, "planets": []} for i in range(1, 13)},
        "ascendant_sign": "Aries",
        "ascendant_longitude": 5.0,
    },
    "planet_positions": [
        {"planet": "Sun", "house": 1, "sign": "Aries", "longitude": 10.0, "is_retrograde": False},
        {"planet": "Moon", "house": 2, "sign": "Taurus", "longitude": 40.0, "is_retrograde": False},
        {"planet": "Jupiter", "house": 9, "sign": "Sagittarius", "longitude": 260.0, "is_retrograde": False},
        {"planet": "Venus", "house": 7, "sign": "Libra", "longitude": 190.0, "is_retrograde": False},
        {"planet": "Mars", "house": 3, "sign": "Gemini", "longitude": 70.0, "is_retrograde": False},
        {"planet": "Mercury", "house": 10, "sign": "Capricorn", "longitude": 280.0, "is_retrograde": False},
        {"planet": "Saturn", "house": 11, "sign": "Aquarius", "longitude": 310.0, "is_retrograde": False},
        {"planet": "Rahu", "house": 5, "sign": "Leo", "longitude": 130.0, "is_retrograde": True},
        {"planet": "Ketu", "house": 11, "sign": "Aquarius", "longitude": 310.0, "is_retrograde": True},
    ],
    "dosha": {
        "manglik": {"is_manglik": False},
        "kalsarpa": {"present": False},
        "sadesati": {"present": False},
    },
    "dasha": {"current": {"planet": "Jupiter", "start": "2020-01-01", "end": "2036-01-01"}},
    "strength": {"planets": {"Jupiter": {"total": 1.2}, "Venus": {"total": 0.8}}},
}

try:
    result = analyze_life_oracle(stub)
    print("SUCCESS!")
    print("Keys in result:", list(result.keys()))
    finance = result.get("finance", {})
    print("Finance keys:", list(finance.keys()))
    print("finance.score:", finance.get("score"))
except Exception as e:
    print(f"ORACLE CRASH: {e}")
    traceback.print_exc()
