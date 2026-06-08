# panch_pakshi/activity_strength.py

from panch_pakshi.constants import ACTIVITY_STRENGTH

def get_activity_strength(activity: str) -> int:

    return ACTIVITY_STRENGTH.get(activity, 0)
