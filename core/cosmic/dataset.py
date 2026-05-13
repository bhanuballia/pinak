import json
from pathlib import Path

DATASET_FILE = Path("data/cosmic_dataset.json")

def load_dataset():
    if DATASET_FILE.exists():
        return json.loads(DATASET_FILE.read_text())
    return []

def save_dataset(data):
    DATASET_FILE.parent.mkdir(exist_ok=True)
    DATASET_FILE.write_text(json.dumps(data, indent=2))

def add_sample(features, label=None):

    data = load_dataset()

    data.append({
        "features": features,
        "label": label
    })

    save_dataset(data)
