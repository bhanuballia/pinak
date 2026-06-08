from matchmaking.websocket.websocket_server import manager

async def broadcast_marriage_alert(event_type: str, data: dict):
    """
    Broadcasts real-time analysis updates (e.g. Dasha shifts, Transit triggers)
    to connected frontend clients.
    """
    payload = {
        "event": event_type,
        "data": data,
        "source": "ULTRA_PRO_ENGINE"
    }
    await manager.broadcast(payload)
