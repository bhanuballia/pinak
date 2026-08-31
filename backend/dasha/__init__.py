# dasha/__init__.py
"""
Dasha package init
"""
from __future__ import annotations

# Provide the available Vimshottari implementation. Older code expected
# `compute_vimshottari`, newer filename uses `compute_vimshottari_full`.
from .vimshottari import compute_vimshottari_full  # noqa: F401

try:
	from .vimshottari import compute_vimshottari  # noqa: F401
except Exception:
	compute_vimshottari = compute_vimshottari_full

from .ashtottari import compute_ashtottari  # noqa: F401
from .chara import compute_chara          # noqa: F401
from .tribhagi import compute_tribhagi    # noqa: F401

__all__ = ["compute_vimshottari", "compute_vimshottari_full", "compute_ashtottari", "compute_chara", "compute_tribhagi"]

from .kala import compute_kala  # noqa: F401
from .sthira import compute_sthira  # noqa: F401
from .shoola import compute_shoola  # noqa: F401
from .niryaana_shoola import compute_niryaana_shoola  # noqa: F401
from .drig import compute_drig  # noqa: F401
from .navamsha import compute_navamsha  # noqa: F401
from .narayana import compute_narayana  # noqa: F401
from .lagna_kendradi import compute_lagna_kendradi  # noqa: F401
from .shree_lagna_kendradi import compute_shree_lagna_kendradi  # noqa: F401
from .shodashottari import compute_shodashottari  # noqa: F401
from .dwadashottari import compute_dwadashottari  # noqa: F401
from .shatabdika import compute_shatabdika  # noqa: F401
from .chaturshitisama import compute_chaturshitisama  # noqa: F401
from .dwisaptatisama import compute_dwisaptatisama  # noqa: F401
from .shastihayani import compute_shastihayani  # noqa: F401
from .shattrimshatsama import compute_shattrimshatsama  # noqa: F401
from .tribhagi40 import compute_tribhagi40  # noqa: F401
__all__.extend(["compute_kala", "compute_sthira", "compute_shoola", "compute_niryaana_shoola", "compute_drig", "compute_navamsha", "compute_narayana", "compute_lagna_kendradi", "compute_shree_lagna_kendradi", "compute_shodashottari", "compute_dwadashottari", "compute_shatabdika", "compute_chaturshitisama", "compute_dwisaptatisama", "compute_shastihayani", "compute_shattrimshatsama", "compute_tribhagi40"])

from .yogini import compute_yogini_full, compute_yogini  # noqa: F401
__all__.extend(["compute_yogini_full", "compute_yogini"])
