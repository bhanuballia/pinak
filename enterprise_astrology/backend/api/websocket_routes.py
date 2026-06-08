# backend/api/websocket_routes.py

from fastapi import APIRouter, HTTPException, Body
from enterprise_astrology.backend.websocket.websocket_server import LiveTransitServer
from enterprise_astrology.backend.websocket.realtime_activation import RealtimeActivationEngine

router = APIRouter()
live_server = LiveTransitServer()
activation_engine = RealtimeActivationEngine()

@router.post("/trigger-alert")
def trigger_alert(payload: dict = Body(...)):
    try:
        # Expected keys: planet, house, transit_sign, severity, message, date
        live_server.broadcast_transit_alert(payload)
        return {"status": "broadcasted", "payload": payload}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/activate-realtime")
def activate_realtime(payload: dict = Body(...)):
    try:
        user_id = payload.get("user_id", "default_user")
        coords = payload.get("coordinates", {})
        result = activation_engine.activate_chart(user_id, coords)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
