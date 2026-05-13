# core/cache/chart_cache.py
"""
Chart Caching System for Vedic Astrology App.
Speeds up report generation by storing and retrieving pre-computed results.
"""

import os
import json
import hashlib

CACHE_DIR = "cache"

def _ensure_cache_dir():
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)

def _get_cache_key(name, date, time, lat, lon):
    """Generate a unique MD5 hash based on birth details."""
    raw = f"{name}-{date}-{time}-{lat}-{lon}"
    return hashlib.md5(raw.encode()).hexdigest()

def cache_chart(chart):
    """
    Saves the computed chart/report_data to a JSON file.
    Expects chart to have metadata or unique identifiers in its structure.
    """
    _ensure_cache_dir()
    
    # Try to extract key details for the filename
    meta = chart.get("meta", {})
    name = meta.get("name", "unknown")
    dt = meta.get("birth_datetime", "unknown").replace("/", "-").replace("|", " ").replace(":", "-")
    
    # Using a hash for the filename to avoid OS-unfriendly characters and ensure uniqueness
    key = _get_cache_key(
        name, 
        chart.get("date", ""), 
        chart.get("time", ""), 
        chart.get("lat", 0), 
        chart.get("lon", 0)
    )
    
    filename = os.path.join(CACHE_DIR, f"chart_{key}.json")
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(chart, f, indent=4, ensure_ascii=False)
        
    print(f"[CACHE] Saved chart for {name} to {filename}")

def get_cached_chart(name, date, time, lat, lon):
    """
    Retrieves a cached chart if it exists based on birth parameters.
    """
    _ensure_cache_dir()
    key = _get_cache_key(name, date, time, lat, lon)
    filename = os.path.join(CACHE_DIR, f"chart_{key}.json")
    
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
                print(f"[CACHE] Hit! Loaded data from {filename}")
                return data
        except Exception as e:
            print(f"[CACHE] Error reading cache file {filename}: {e}")
            
    return None
