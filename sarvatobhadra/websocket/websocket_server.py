from fastapi import WebSocket


class SBCWebSocket:

    async def connect(
        self,
        websocket: WebSocket
    ):

        await websocket.accept()

        while True:

            await websocket.send_json({
                "event":
                    "Strong Vedha Activated"
            })
