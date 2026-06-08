# cache/redis_engine.py

import json
import time

try:
    import redis
    redis_client = redis.Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis_client = None


class RedisCache:

    def __init__(self):
        if not REDIS_AVAILABLE:
            self._local_cache = {}
            self._expiry = {}

    def set_cache(
        self,
        key,
        value,
        expiry=3600
    ):
        if REDIS_AVAILABLE and redis_client is not None:
            try:
                redis_client.setex(
                    key,
                    expiry,
                    json.dumps(value)
                )
            except Exception:
                self._set_local(key, value, expiry)
        else:
            self._set_local(key, value, expiry)

    def _set_local(self, key, value, expiry):
        self._local_cache[key] = json.dumps(value)
        self._expiry[key] = time.time() + expiry

    def get_cache(
        self,
        key
    ):
        if REDIS_AVAILABLE and redis_client is not None:
            try:
                data = redis_client.get(key)
                if not data:
                    return None
                return json.loads(data)
            except Exception:
                return self._get_local(key)
        else:
            return self._get_local(key)

    def _get_local(self, key):
        if key not in self._local_cache:
            return None
        if time.time() > self._expiry.get(key, 0):
            # Clean up expired item
            del self._local_cache[key]
            if key in self._expiry:
                del self._expiry[key]
            return None
        return json.loads(self._local_cache[key])
