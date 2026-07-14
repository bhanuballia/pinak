# matchmaking/guna_milan.py
KUTA_POINTS = {
  "Varna": 1,
  "Vashya": 2,
  "Tara": 3,
  "Yoni": 4,
  "Graha Maitri": 5,
  "Gana": 6,
  "Rashi / Bhakut": 7,
  "Nadi": 8
}
# standard point mapping (classical)
KUTA_DISTRIBUTION = {
    "Varna": 1,
    "Vashya": 2,
    "Tara": 3,
    "Yoni": 4,
    "GrahaMaitri": 5,
    "Gana": 6,
    "Rashi": 7,
    "Nadi": 8
}

def compute_guna_milan(chart_male: dict, chart_female: dict) -> dict:
    # Compute each koota using classical algorithms
    # use birth Moon nakshatra/pada, rasi lords etc.
    # Output: {koota: points_obtained, max_points: N}
    res = {}
    # implement each Koota carefully; here minimal template for the 8 Kootas
    res["Varna"] = {"score":1,"max":1,"desc":"sample"}
    res["Vashya"] = {"score":2,"max":2,"desc":"sample"}
    # ... compute all properly
    total = sum([v["score"] for v in res.values()])
    return {"breakdown": res, "total": total, "max_total": 36, "verdict": "Good" if total>=18 else "Poor"}
