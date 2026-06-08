# panch_pakshi/constants.py

BIRDS = [
    "Owl",
    "Crow",
    "Cock",
    "Peacock",
    "Vulture"
]

ACTIVITIES = [
    "Ruling",
    "Walking",
    "Eating",
    "Sleeping",
    "Dying"
]

ACTIVITY_STRENGTH = {
    "Ruling": 100,
    "Eating": 80,
    "Walking": 60,
    "Sleeping": 30,
    "Dying": 10
}

RELATIONSHIP_SCORES = {
    "Self": 100,
    "Friend": 75,
    "Enemy": 25
}

WEEKDAY_LORDS = {
    0: "Moon",
    1: "Mars",
    2: "Mercury",
    3: "Jupiter",
    4: "Venus",
    5: "Saturn",
    6: "Sun"
}

# Classical sequences for Shukla/Krishna, Day/Night
SHUKLA_DAY_BIRDS = ["Vulture", "Owl", "Crow", "Cock", "Peacock"]
SHUKLA_NIGHT_BIRDS = ["Owl", "Vulture", "Peacock", "Cock", "Crow"]
KRISHNA_DAY_BIRDS = ["Peacock", "Cock", "Crow", "Owl", "Vulture"]
KRISHNA_NIGHT_BIRDS = ["Cock", "Crow", "Owl", "Vulture", "Peacock"]

SHUKLA_DAY_ACTIVITIES = ["Eating", "Walking", "Ruling", "Sleeping", "Dying"]
SHUKLA_NIGHT_ACTIVITIES = ["Ruling", "Dying", "Walking", "Sleeping", "Eating"]
KRISHNA_DAY_ACTIVITIES = ["Ruling", "Eating", "Walking", "Sleeping", "Dying"]
KRISHNA_NIGHT_ACTIVITIES = ["Ruling", "Dying", "Walking", "Sleeping", "Eating"]

# Proportional weights for apaharas
APAHARA_WEIGHTS = {
    "Ruling": 4.0,
    "Walking": 3.0,
    "Eating": 2.5,
    "Sleeping": 1.5,
    "Dying": 1.0
}

