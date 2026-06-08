# panch_pakshi/muhurat_engine.py

from panch_pakshi.activity_strength import get_activity_strength

GOOD_ACTIVITIES = [
    "Ruling",
    "Eating",
    "Walking"
]

BAD_ACTIVITIES = [
    "Sleeping",
    "Dying"
]

def is_good_muhurat(activity: str):

    return activity in GOOD_ACTIVITIES
