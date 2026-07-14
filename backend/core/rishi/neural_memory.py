import json
import threading
from pathlib import Path

MEMORY_FILE = Path("data/neural_memory.json")
MAX_MEMORY_ENTRIES = 200  # Cap to prevent unbounded growth

def load_memory():
    if MEMORY_FILE.exists():
        try:
            return json.loads(MEMORY_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []

def save_memory(data):
    MEMORY_FILE.parent.mkdir(exist_ok=True)
    MEMORY_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

def _write_async(features, outcome):
    """Non-blocking write so API calls never wait for disk I/O."""
    try:
        memory = load_memory()
        memory.append({"features": features, "outcome": outcome})
        # Keep only the most recent entries to prevent file growth
        if len(memory) > MAX_MEMORY_ENTRIES:
            memory = memory[-MAX_MEMORY_ENTRIES:]
        save_memory(memory)
    except Exception:
        pass  # Never block the API call for memory failures

def add_chart_to_memory(features, outcome=None):
    t = threading.Thread(target=_write_async, args=(features, outcome), daemon=True)
    t.start()
