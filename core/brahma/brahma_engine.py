from .destiny_profiler import predict_profession
from .marriage_timing import predict_marriage_window
from .wealth_curve import build_wealth_curve
from .karma_score import compute_karma_score
from .brahma_writer import build_brahma_text


def run_brahma_engine(chart, strength, dosha, dasha, maharishi, omniscient):

    profession = predict_profession(chart, strength)

    marriage_window = predict_marriage_window(chart, dasha, dosha)

    wealth = build_wealth_curve(dasha, strength)

    karma = compute_karma_score(strength, dosha, maharishi)

    text = build_brahma_text(
        profession,
        marriage_window,
        wealth,
        karma,
        maharishi,
        omniscient
    )

    return {
        "profession_prediction": profession,
        "marriage_window": marriage_window,
        "wealth_curve": wealth,
        "karma_score": karma,
        "brahma_text": text
    }
