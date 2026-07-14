import json
import os

MEMORY_PATH = "core/adaptive/adaptive_memory.json"


def load_memory():

    if not os.path.exists(MEMORY_PATH):
        return {}

    with open(MEMORY_PATH, "r") as f:
        return json.load(f)


def save_memory(data):
    with open(MEMORY_PATH, "w") as f:
        json.dump(data, f, indent=2)
