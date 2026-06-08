import asyncio
import sys
sys.path.insert(0, '.')
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

async def test():
    from api.routes.dasha_report import vimshottari_table

    # Test 1: with a past transit_date (simulate being in 2010)
    payload_past = {
        'date': '1995-05-10',
        'time': '10:30:00',
        'tz': 5.5,
        'lat': 19.076,
        'lon': 72.877,
        'moon_lon': -1,
        'levels': 2,
        'transit_date': '2010-01-15T00:00:00'
    }
    result_past = await vimshottari_table(payload_past)
    rows_past = result_past.get('rows', [])
    current_past = [r for r in rows_past if r.get('is_current')]
    if current_past:
        r = current_past[0]
        print(f"[2010 sim] Active Dasha: {r['dasha_chain']} | Start: {r['start_date']} | Gochar: {r.get('gochar')}")
    else:
        print("[2010 sim] No current row found")

    # Test 2: without transit_date (uses real now)
    payload_now = dict(payload_past)
    del payload_now['transit_date']
    result_now = await vimshottari_table(payload_now)
    rows_now = result_now.get('rows', [])
    current_now = [r for r in rows_now if r.get('is_current')]
    if current_now:
        r = current_now[0]
        print(f"[NOW      ] Active Dasha: {r['dasha_chain']} | Start: {r['start_date']} | Gochar: {r.get('gochar')}")
    else:
        print("[NOW      ] No current row found")

    # Test 3: with a future transit_date (simulate being in 2035)
    payload_future = dict(payload_past)
    payload_future['transit_date'] = '2035-06-01T12:00:00'
    result_future = await vimshottari_table(payload_future)
    rows_future = result_future.get('rows', [])
    current_future = [r for r in rows_future if r.get('is_current')]
    if current_future:
        r = current_future[0]
        print(f"[2035 sim] Active Dasha: {r['dasha_chain']} | Start: {r['start_date']} | Gochar: {r.get('gochar')}")
    else:
        print("[2035 sim] No current row found")

asyncio.run(test())
