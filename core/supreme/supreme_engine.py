from .shadbala_engine import compute_shadbala
from .navamsa_analyzer import analyze_navamsa
from .profession_ai import classify_profession
from .marriage_ai import marriage_analysis
from .destiny_probability import destiny_scores
from .karma_index import compute_karma_index
from .narrative_writer import build_supreme_narrative


def build_supreme_engine(chart, d9, strength, dosha, dasha):

    shadbala = compute_shadbala(chart)
    navamsa = analyze_navamsa(d9)

    profession = classify_profession(chart, strength, shadbala)
    marriage = marriage_analysis(chart, d9)

    destiny = destiny_scores(chart, strength, dasha)
    karma = compute_karma_index(chart, navamsa)

    narrative = build_supreme_narrative(
        profession,
        marriage,
        destiny,
        karma
    )

    return {
        "shadbala": shadbala,
        "navamsa_analysis": navamsa,
        "profession_ai": profession,
        "marriage_ai": marriage,
        "destiny_probability": destiny,
        "karma_index": karma,
        "supreme_narrative": narrative
    }
