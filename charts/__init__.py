# charts/__init__.py
"""
Charts package initializer.
"""
from __future__ import annotations

from .rashi_chart import build_rashi_chart  # noqa: F401

# Navamsa (D9) chart lives in the divisional subpackage.
try:
    from .divisional.d9 import build_navamsa_chart  # noqa: F401
except Exception:
    build_navamsa_chart = None

__all__ = ["build_rashi_chart", "build_navamsa_chart"]
