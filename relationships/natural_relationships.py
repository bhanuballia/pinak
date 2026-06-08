# relationships/natural_relationships.py

NATURAL_RELATIONSHIPS = {

    "Sun": {
        "friend": [
            "Moon",
            "Mars",
            "Jupiter"
        ],
        "enemy": [
            "Venus",
            "Saturn",
            "Rahu",
            "Ketu"
        ],
        "neutral": [
            "Mercury"
        ]
    },

    "Moon": {
        "friend": [
            "Sun",
            "Mercury"
        ],
        "enemy": [
            "Rahu",
            "Ketu"
        ],
        "neutral": [
            "Mars",
            "Jupiter",
            "Venus",
            "Saturn"
        ]
    },

    "Mars": {
        "friend": [
            "Sun",
            "Moon",
            "Jupiter",
            "Ketu"
        ],
        "enemy": [
            "Mercury",
            "Rahu"
        ],
        "neutral": [
            "Venus",
            "Saturn"
        ]
    },

    "Mercury": {
        "friend": [
            "Sun",
            "Venus"
        ],
        "enemy": [
            "Moon"
        ],
        "neutral": [
            "Mars",
            "Jupiter",
            "Saturn",
            "Rahu",
            "Ketu"
        ]
    },

    "Jupiter": {
        "friend": [
            "Sun",
            "Moon",
            "Mars"
        ],
        "enemy": [
            "Mercury",
            "Venus"
        ],
        "neutral": [
            "Saturn",
            "Rahu",
            "Ketu"
        ]
    },

    "Venus": {
        "friend": [
            "Mercury",
            "Saturn",
            "Rahu",
            "Ketu"
        ],
        "enemy": [
            "Sun",
            "Moon"
        ],
        "neutral": [
            "Mars",
            "Jupiter"
        ]
    },

    "Saturn": {
        "friend": [
            "Mercury",
            "Venus",
            "Rahu"
        ],
        "enemy": [
            "Sun",
            "Moon",
            "Mars",
            "Ketu"
        ],
        "neutral": [
            "Jupiter"
        ]
    },

    "Rahu": {
        "friend": [
            "Jupiter",
            "Venus",
            "Saturn"
        ],
        "enemy": [
            "Sun",
            "Moon",
            "Mars",
            "Ketu"
        ],
        "neutral": [
            "Mercury"
        ]
    },

    "Ketu": {
        "friend": [
            "Mars",
            "Venus"
        ],
        "enemy": [
            "Sun",
            "Moon",
            "Saturn",
            "Rahu"
        ],
        "neutral": [
            "Mercury",
            "Jupiter"
        ]
    }
}


def get_natural_relationship(
    planet_a,
    planet_b
):

    data = NATURAL_RELATIONSHIPS.get(
        planet_a,
        {}
    )

    if planet_b in data.get(
        "friend",
        []
    ):
        return "Friend"

    if planet_b in data.get(
        "enemy",
        []
    ):
        return "Enemy"

    return "Neutral"
