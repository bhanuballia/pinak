import json
import threading
from pathlib import Path

MEMORY_FILE = Path("data/rishi_memory.json")
MAX_MEMORY_ENTRIES = 200


def _load():
    if MEMORY_FILE.exists():
        try:
            return json.loads(MEMORY_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []


def _save(data):
    MEMORY_FILE.parent.mkdir(exist_ok=True)
    MEMORY_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _write_async(report_data):
    """Write in background to never block the API."""
    try:
        memory = _load()
        entry = {
            "lagna": report_data.get("lagna"),
            "dosha": report_data.get("dosha"),
            "profession": report_data.get("brahma", {}).get("profession_prediction"),
        }
        memory.append(entry)
        if len(memory) > MAX_MEMORY_ENTRIES:
            memory = memory[-MAX_MEMORY_ENTRIES:]
        _save(memory)
    except Exception:
        pass


def learn_from_chart(report_data):
    t = threading.Thread(target=_write_async, args=(report_data,), daemon=True)
    t.start()
