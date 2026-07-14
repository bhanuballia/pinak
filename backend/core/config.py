# core/config.py
"""
Global configuration for the Vedic Astrology Engine.

This module:
- Loads configuration from environment variables (recommended for deployment).
- Provides safe defaults for development.
- Exposes helper functions for accessing typed configuration values.
- Ensures no module in the system crashes if environment variables are missing.

Import rule:
    from core.config import EPHEMERIS_PATH, AYANAMSA
"""

from __future__ import annotations

import os
from typing import Optional

# ---------------------------------------------------------------------------
# Environment Variable Helper
# ---------------------------------------------------------------------------

def getenv(key: str, default: Optional[str] = None) -> str:
    """
    Safe environment variable getter.

    - Returns default if variable is missing or empty.
    - Strips quotes and whitespace from values like: " '/path' ".
    """
    value = os.environ.get(key, default)
    if value is None:
        return default

    # Clean: remove wrapping quotes and whitespace
    value = value.strip().strip('"').strip("'")
    return value


# ---------------------------------------------------------------------------
# Core Astrology Configuration
# ---------------------------------------------------------------------------

# Ayanamsa mode (default: Lahiri)
# Possible values:
#   "LAHIRI", "KRISHNAMURTI", "RAMAN", "FAGAN_BRADLEY"
# (mapping to Swiss Ephemeris SIDM modes handled elsewhere)
AYANAMSA: str = getenv("AYANAMSA", "LAHIRI").upper()


# Swiss Ephemeris data directory
#
# NOTE: This must be an absolute path or a valid relative path.
#
# Examples:
#   export EPHEMERIS_PATH="/usr/local/share/ephe"
#   export EPHEMERIS_PATH="~/ephe"
#
EPHEMERIS_PATH: str =os.getenv("EPHEMERIS_PATH","./ephe")  # default: local folder "ephe"


# Timezone default (used only when user does not specify)
DEFAULT_TIMEZONE: float = float(getenv("DEFAULT_TIMEZONE", "0"))


# Enable or disable automatic ephemeris initialization
AUTO_INIT_EPHEMERIS: bool = getenv("AUTO_INIT_EPHEMERIS", "true").lower() in ("true", "1", "yes")


# ---------------------------------------------------------------------------
# Validation Helpers
# ---------------------------------------------------------------------------

def get_config_summary() -> dict:
    """
    Returns a dict containing all runtime configuration parameters.
    Useful for debugging, logging, or API endpoints.
    """
    return {
        "AYANAMSA": AYANAMSA,
        "EPHEMERIS_PATH": EPHEMERIS_PATH,
        "DEFAULT_TIMEZONE": DEFAULT_TIMEZONE,
        "AUTO_INIT_EPHEMERIS": AUTO_INIT_EPHEMERIS,
    }
