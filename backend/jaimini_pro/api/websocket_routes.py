# jaimini_pro/api/websocket_routes.py
from fastapi import APIRouter, WebSocket
import asyncio

router = APIRouter()

@router.websocket("/ws/transits")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            await ws.send_text("Live transit activation")
            await asyncio.sleep(5)
    except:
        pass
