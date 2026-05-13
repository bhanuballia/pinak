from .dataset import load_dataset
from .feature_encoder import encode_chart
from .scoring_model import cosmic_score
from .pattern_engine import discover_patterns

def run_cosmic_trainer(report_data):

    chart = report_data.get("chart",{})
    dosha = report_data.get("dosha",{})
    strength = report_data.get("strength",{})

    features = encode_chart(chart,dosha,strength)

    dataset = load_dataset()

    score = cosmic_score(features,dataset)

    report_data["cosmic_features"] = features
    report_data["cosmic_score"] = score

    # Optional: discover global patterns
    report_data["cosmic_patterns"] = discover_patterns(dataset)[:5]

    return report_data
