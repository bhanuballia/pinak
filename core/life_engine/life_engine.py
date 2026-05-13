from core.life_engine.marriage_engine import marriage_windows
from core.life_engine.career_engine import career_cycles
from core.life_engine.wealth_engine import wealth_cycles
from core.life_engine.health_engine import health_cycles
from core.life_engine.spiritual_engine import spiritual_cycles


def build_5d_life_map(chart, dasha, dosha, strength):

    life_map = {
        "marriage": marriage_windows(chart, dasha, strength),
        "career": career_cycles(chart, dasha, strength),
        "wealth": wealth_cycles(chart, dasha, strength),
        "health": health_cycles(chart, dosha),
        "spiritual": spiritual_cycles(chart, dasha),
    }

    return life_map
