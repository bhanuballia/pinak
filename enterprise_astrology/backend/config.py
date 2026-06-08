# backend/config.py

import os

class EnterpriseConfig:
    PORT = int(os.environ.get("PORT", 5000))
    REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
    EPHEMERIS_PATH = os.environ.get("EPHEMERIS_PATH", "./ephemeris")
