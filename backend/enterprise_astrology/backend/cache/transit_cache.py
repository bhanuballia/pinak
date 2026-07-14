# cache/transit_cache.py

from enterprise_astrology.backend.cache.redis_engine import RedisCache

class TransitCache:
    def __init__(self):
        self.cache = RedisCache()

    def get_transits(self, date_str):
        return self.cache.get_cache(f"transit:{date_str}")

    def set_transits(self, date_str, transit_data):
        self.cache.set_cache(f"transit:{date_str}", transit_data, 600)
