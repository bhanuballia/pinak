# astronomy/astronomical_cache.py

class AstronomicalCache:
    def __init__(self):
        self._store = {}

    def fetch(self, key):
        return self._store.get(key)

    def cache(self, key, value):
        self._store[key] = value
