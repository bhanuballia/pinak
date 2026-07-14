from .marriage_predictor import predict_marriage_window
from .career_predictor import predict_career_growth
from .wealth_predictor import predict_wealth_curve
from .dimensional_graphs import build_dimension_graphs
from .hindi_narrative_ai import generate_dimensional_narrative


def run_dimensional_engine(chart, dasha, strength, dosha, timeline, quantum):

    marriage = predict_marriage_window(chart, dasha, strength, dosha)

    career = predict_career_growth(chart, strength, timeline)

    wealth = predict_wealth_curve(chart, strength, timeline)

    graphs = build_dimension_graphs(marriage, career, wealth)

    narrative = generate_dimensional_narrative(
        marriage,
        career,
        wealth,
        quantum
    )

    return {
        "marriage": marriage,
        "career": career,
        "wealth": wealth,
        "graphs": graphs,
        "narrative": narrative
    }
