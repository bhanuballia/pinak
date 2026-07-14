
def income_type(chart, planet_positions, p_strengths):
    """
    Determines if the user's chart favors a Job, Business, or Mixed income stream.
    """
    business_score = 0
    job_score = 0

    # helper to get strength
    def get_str(p):
        return p_strengths.get(p, {}).get("total", 0) / 6.0 if p_strengths.get(p, {}).get("total", 0) > 100 else p_strengths.get(p, {}).get("total", 0)

    # Business planets: Mercury (Logic/Trade), Venus (Luxury/Creativity)
    if get_str("Mercury") > 60:
        business_score += 2
    if get_str("Venus") > 60:
        business_score += 1

    # Job planets: Saturn (Labor/Discipline), Sun (Government/Authority)
    if get_str("Saturn") > 60:
        job_score += 2
    if get_str("Sun") > 65:
        job_score += 1

    # 10th house connection to 7th (Business/Partnership)
    # Find 10th lord
    from core.wealth.dhan_yoga_engine import SIGN_LORDS
    h10_sign = chart.get("houses", {}).get(10, {}).get("sign_name")
    h10_lord = SIGN_LORDS.get(h10_sign)
    
    h10_lord_house = None
    for p in planet_positions:
        if p.get("planet") == h10_lord:
            h10_lord_house = p.get("house")
            break
            
    if h10_lord_house == 7:
        business_score += 2
        
    # 10th house connection to 6th (Service/Debt)
    if h10_lord_house == 6:
        job_score += 2

    if job_score > business_score + 1:
        return "Job"
    if business_score > job_score + 1:
        return "Business"
    return "Mixed"
