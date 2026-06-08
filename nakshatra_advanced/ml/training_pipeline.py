# nakshatra_advanced/ml/training_pipeline.py

from nakshatra_advanced.ml.prediction_model import NakshatraMLModel

def run_training_pipeline(dataset: list):
    """
    Stub to feed structured dataset into prediction model training cycles.
    """
    model = NakshatraMLModel()
    X = [[d[0], d[1]] for d in dataset]
    y = [d[2] for d in dataset]
    model.train(X, y)
    return model
