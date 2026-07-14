def is_marriage_period(year_data):
    lord = year_data.get("dasha_lord")

    return lord in ["Venus","Moon","Jupiter"]


def is_career_peak(year_data):
    lord = year_data.get("dasha_lord")
    strength = year_data.get("strength",0)

    return lord in ["Saturn","Sun","Mercury"] and strength > 60


def is_finance_rise(year_data):
    lord = year_data.get("dasha_lord")
    return lord in ["Jupiter","Venus"]


def is_health_warning(year_data):
    dosha = year_data.get("dosha",{})
    return dosha.get("sadesati",{}).get("present",False)


def is_spiritual_phase(year_data):
    lord = year_data.get("dasha_lord")
    return lord in ["Ketu","Jupiter"]
