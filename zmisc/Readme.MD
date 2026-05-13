# Vedic Astrology App (skeleton)

This repository is a starting skeleton for a Vedic astrology application.
It uses the Swiss Ephemeris for accurate planetary positions and provides
modules for charts, panchang, dashas, and a minimal FastAPI backend.

## Structure

- `core/` — core config & utilities
- `astronomy/` — ephemeris, julian conversions, positions, sidereal helpers
- `charts/` — rashi, navamsa, divisional charts
- `panchang/` — tithi, nakshatra, yoga, karana, integrator
- `dasha/` — vimshottari (scaffold), ashtottari (scaffold)
- `api/` — FastAPI routes for positions and charts
- `data/` — static JSON constants
- `tests/` — basic pytest tests

## Quickstart (development)

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run Backend:
   ```bash
   # From root directory
   uvicorn api.main:app --reload
   ```

3. Run Frontend:
   ```bash
   cd frontend
   npm install # if not already installed
   npm run dev
   ```
