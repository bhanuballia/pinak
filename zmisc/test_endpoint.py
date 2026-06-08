import sys
import io

# Force stdout to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import asyncio
from api.routes.dasha_report import vimshottari_table

async def main():
    payload = {
        "date": "1988-02-07",
        "time": "14:09:00",
        "tz": 5.5,
        "lat": 26.8467,
        "lon": 80.9462,
        "moon_lon": 162.8339
    }
    
    res = await vimshottari_table(payload)
    rows = res["rows"]
    
    print(f"Total rows returned: {len(rows)}")
    # Find Jup-Mer-Venus rows or print first few rows
    jup_mer_rows = [r for r in rows if r["dasha_chain"].startswith("गु-बु")]
    for r in jup_mer_rows[:15]:
        print(f"Dasha: {r['dasha_chain']:15} | Start: {r['start_date']} | Time: {r['start_time']} | Age: {r['age']}")

asyncio.run(main())
