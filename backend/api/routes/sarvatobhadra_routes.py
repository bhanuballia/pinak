import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from sarvatobhadra.sbc_engine import SarvatobhadraEngine

router = APIRouter()


from api.routes.nakshatra_advanced_live import get_live_nakshatra

from fastapi import Body
from typing import Optional

@router.post("/sbc")
def get_sbc(payload: Optional[dict] = Body(default=None)):
    # Fetch real live planetary positions from the Advanced Nakshatra engine
    live_data = get_live_nakshatra()
    transit_data = {}
    
    if "data" in live_data:
        for item in live_data["data"]:
            p = item["planet"]
            nak = item["nakshatra"]
            
            # Normalize Rahu/Ketu names
            if p == "Spashth Rahu (True Node)": p = "Rahu"
            elif p == "Spashth Ketu (True Node)": p = "Ketu"
            
            # Only track the main 9 Grahas in Sarvatobhadra
            if p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
                transit_data[p] = nak

    # Fallback to defaults if something fails
    if not transit_data:
        transit_data = {
            "Sun": "Krittika", "Moon": "Ardra", "Mars": "Chitra", "Mercury": "Rohini",
            "Jupiter": "Punarvasu", "Venus": "Magha", "Saturn": "Pushya", "Rahu": "Shatabhisha", "Ketu": "Purva Phalguni"
        }

    result = SarvatobhadraEngine().generate(transit_data, birth_data=payload)
    return result


@router.websocket("/sbc-ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            import json
            payload = json.dumps({"message": "Transit Vedha Activated", "type": "alert"})
            await websocket.send_text(payload)
            await asyncio.sleep(1) # added sleep to prevent tight loop
    except WebSocketDisconnect:
        print("SBC Websocket disconnected")
