import asyncio, sys
sys.path.insert(0, '.')
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

async def test():
    from api.routes.dasha_report import vimshottari_table
    payload = {
        'date': '1995-05-10', 'time': '10:30:00', 'tz': 5.5,
        'lat': 19.076, 'lon': 72.877, 'moon_lon': -1, 'levels': 2
    }
    result = await vimshottari_table(payload)
    rows = result.get('rows', [])
    print(f"Total rows: {len(rows)}")
    print(f"{'Dasha':<12} {'Tara#':>5} {'NakDist':>7} {'RashiDist':>9} {'TaraName':<12}")
    print("-" * 55)
    for r in rows[:15]:
        print(f"{r['dasha_chain']:<12} {r['tara_num']:>5} {r.get('nak_distance','?'):>7} {r['rashi_distance']:>9} {r['tara_name']:<12}")

asyncio.run(test())
