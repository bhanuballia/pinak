from .dataset import add_sample

def learn_from_report(report_data):

    features = report_data.get("cosmic_features")

    if not features:
        return

    # label can be future user feedback (optional)
    add_sample(features, label=None)
