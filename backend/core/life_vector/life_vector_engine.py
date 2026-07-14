from core.life_vector.vector_context_builder import build_vector_context
from core.life_vector.ai_prediction_writer import generate_ai_predictions


def build_life_vector_predictions(report_data):

    context = build_vector_context(report_data)

    predictions = generate_ai_predictions(context)

    report_data["life_vector_predictions"] = predictions

    return predictions
