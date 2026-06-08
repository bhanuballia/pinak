import asyncio
import websockets

async def f():
    try:
        ws = await websockets.connect('ws://127.0.0.1:8000/ws/matchmaking/alerts')
        print('success')
        await ws.close()
    except Exception as e:
        print("error", e)
asyncio.run(f())
