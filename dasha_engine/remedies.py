class DashaRemedies:

    REMEDIES = {
        "Sun": [
            "Surya Namaskar",
            "Donate wheat on Sundays",
            "Respect father and authority"
        ],

        "Moon": [
            "Meditation",
            "Donate rice",
            "Strengthen emotional balance"
        ],

        "Mars": [
            "Hanuman Chalisa",
            "Donate red lentils",
            "Control anger"
        ],

        "Mercury": [
            "Improve communication",
            "Donate green vegetables",
            "Practice concentration"
        ],

        "Jupiter": [
            "Guru mantra",
            "Donate turmeric",
            "Respect teachers"
        ],

        "Venus": [
            "Improve relationships",
            "Donate white sweets",
            "Avoid luxury excess"
        ],

        "Saturn": [
            "Serve elderly people",
            "Donate black sesame",
            "Discipline and patience"
        ],

        "Rahu": [
            "Meditation",
            "Avoid addictions",
            "Grounding exercises"
        ],

        "Ketu": [
            "Spiritual practices",
            "Detach from ego",
            "Feed stray dogs"
        ]
    }

    def get_remedies(self, planet):
        return self.REMEDIES.get(planet, [])
