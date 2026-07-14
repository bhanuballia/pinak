# astronomy/ephemeris.py
"""
Swiss Ephemeris initialization and helpers.

Responsibilities:
- Set the ephemeris data path (swe.set_ephe_path)
- Validate presence of ephemeris files (best-effort: list directory contents)
- Provide simple getters for the configured path and a readiness check.

This module intentionally keeps surface API small and deterministic so the
rest of the calculation engine can rely on initialization having been done
before making computational calls to swisseph.
"""

from __future__ import annotations

import os
import logging
from typing import Optional, Dict, List

try:
    import swisseph as swe
except Exception:  # pragma: no cover - allow import to succeed without swisseph installed
    swe = None

from core.config import EPHEMERIS_PATH

logger = logging.getLogger(__name__)
logger.addHandler(logging.NullHandler())

# Module-level store for the currently configured ephemeris path
_EPHE_PATH: Optional[str] = None


def initialize_ephemeris(path: Optional[str] = None) -> str:
    """
    Initialize Swiss Ephemeris by setting the ephemeris data path.

    - If `path` is provided, it will be used.
    - Otherwise the project config `EPHEMERIS_PATH` is used.
    - Raises FileNotFoundError if the resolved path does not exist.
    - Returns the resolved path (absolute).

    Example:
        initialize_ephemeris()  # uses core.config.EPHEMERIS_PATH
        initialize_ephemeris("/usr/local/lib/ephe")
    """
    global _EPHE_PATH

    resolved = path or EPHEMERIS_PATH
    if not resolved:
        raise ValueError(
            "No ephemeris path supplied. Set EPHEMERIS_PATH in core.config or pass `path`."
        )

    resolved = os.path.abspath(os.path.expanduser(resolved))

    if not os.path.isdir(resolved):
        # Helpful error to guide the developer/user
        msg = (
            f"Ephemeris path does not exist: {resolved}. "
            "Install Swiss Ephemeris data files and set core.config.EPHEMERIS_PATH "
            "to the directory containing the ephemeris files (e.g. 'sepl' files)."
        )
        logger.error(msg)
        raise FileNotFoundError(msg)

    # Ensure the swisseph binding is available before calling into it
    if not swe:
        raise ModuleNotFoundError(
            "The 'swisseph' library is required for ephemeris operations. "
            "Install it with 'pip install pyswisseph' and ensure any build dependencies are present."
        )

    # Instruct swisseph where to find the ephemeris data
    swe.set_ephe_path(resolved)
    _EPHE_PATH = resolved

    logger.info("Swiss Ephemeris initialized with path: %s", resolved)
    # Return the resolved path for convenience
    return resolved


def ephemeris_path() -> Optional[str]:
    """
    Return the currently configured ephemeris path (if initialized), otherwise None.
    """
    return _EPHE_PATH


def list_ephemeris_files(patterns: Optional[List[str]] = None) -> List[str]:
    """
    Return a best-effort list of files inside the configured ephemeris directory.

    `patterns` (optional) is a list of filename substrings to filter the results.
    Example: patterns=['sepl', '.se1']

    Raises RuntimeError if ephemeris not initialized.
    """
    path = _EPHE_PATH
    if not path:
        raise RuntimeError(
            "Ephemeris not initialized. Call initialize_ephemeris() first."
        )

    try:
        files = os.listdir(path)
    except Exception as exc:
        logger.exception("Failed to list ephemeris directory '%s': %s", path, exc)
        return []

    if not patterns:
        return sorted(files)

    def matches(fname: str) -> bool:
        return any(patt in fname for patt in patterns)

    return sorted([f for f in files if matches(f)])


def is_initialized() -> bool:
    """
    Quick readiness check: return True if initialize_ephemeris succeeded and
    a non-empty directory exists at the configured path.
    """
    path = _EPHE_PATH
    return bool(path and os.path.isdir(path) and len(os.listdir(path)) > 0)


def get_library_info() -> Dict[str, Optional[str]]:
    """
    Return basic info about the swisseph library and the configured ephemeris path.

    Note: pyswisseph doesn't expose a lot of metadata in a stable manner across
    versions. This function returns safe-to-access information.
    """
    info = {
        "ephe_path": _EPHE_PATH,
        # attempt to get version info if present; may be None on some bindings
        "swe_version": None if not swe else (getattr(swe, "__version__", None) or getattr(swe, "SWE_VERSION", None)),
    }
    return info


# Optional convenience behavior: Initialize automatically if EPHEMERIS_PATH is set
# at import time. This helps quick scripts, but in production you may prefer explicit init.
try:
    if EPHEMERIS_PATH:
        # Do not raise here — catch and log only to avoid import-time crashes
        try:
            initialize_ephemeris(EPHEMERIS_PATH)
        except Exception as _err:
            logger.warning("Ephemeris auto-init failed: %s", _err)
except Exception:
    # Defensive: ensure import never fails if config module is missing or broken.
    logger.debug("Skipping automatic ephemeris initialization at import time.")
