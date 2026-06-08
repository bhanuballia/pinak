# cache/chart_cache.py

from enterprise_astrology.backend.cache.redis_engine import RedisCache

class ChartCache:
    def __init__(self):
        self.cache = RedisCache()

    def get_chart(self, user_id):
        return self.cache.get_cache(f"chart:{user_id}")

    def set_chart(self, user_id, chart_data):
        self.cache.set_cache(f"chart:{user_id}", chart_data, 1800)
