# cache/prediction_cache.py

from enterprise_astrology.backend.cache.redis_engine import RedisCache

class PredictionCache:
    def __init__(self):
        self.cache = RedisCache()

    def get_predictions(self, dasha_id):
        return self.cache.get_cache(f"pred:{dasha_id}")

    def set_predictions(self, dasha_id, predictions_data):
        self.cache.set_cache(f"pred:{dasha_id}", predictions_data, 7200)
