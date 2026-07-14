# astrology/retrograde.py

def handle_retrograde_logic(is_retrograde):
    """
    If Saturn is retrograde during a phase, it may cause a 're-entry' 
    or extended duration of the current/previous phase.
    """
    if is_retrograde:
        return {
            "impact": "Repeated Phase / Extended Duration",
            "reopen_previous_phase": True
        }
    return {
        "impact": "Normal",
        "reopen_previous_phase": False
    }
