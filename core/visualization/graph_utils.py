import os

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def save_path(name):
    ensure_dir("reports/images")
    return f"reports/images/{name}.png"
