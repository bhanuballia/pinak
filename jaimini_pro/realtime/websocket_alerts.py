# jaimini_pro/realtime/websocket_alerts.py
import asyncio
class WebSocketAlerts:
    async def handler(self, websocket):
        while True:
            await websocket.send("Transit activation detected")
            await asyncio.sleep(5)
