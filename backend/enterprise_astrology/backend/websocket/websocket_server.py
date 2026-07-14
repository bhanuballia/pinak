# backend/websocket/websocket_server.py

import logging

logger = logging.getLogger(__name__)

try:
    from flask_socketio import SocketIO, emit
    HAS_SOCKETIO = True
except ImportError:
    HAS_SOCKETIO = False
    logger.warning("flask_socketio not installed. Utilizing mock fallback implementation.")
    
    class SocketIO:
        def __init__(self, app=None, **kwargs):
            self.app = app
            self.handlers = {}

        def init_app(self, app, **kwargs):
            self.app = app

        def on(self, event):
            def decorator(f):
                self.handlers[event] = f
                return f
            return decorator

        def emit(self, event, data, **kwargs):
            logger.info(f"[MockSocketIO Emit] Event: '{event}' | Data: {data}")
            return True

        def run(self, app, host=None, port=None, **kwargs):
            logger.info(f"[MockSocketIO Run] Serving mock websocket server on {host}:{port}")
            # Stub run method that doesn't block
            return None

    def emit(event, data, **kwargs):
        logger.info(f"[MockEmit] Event: '{event}' | Data: {data}")
        return True

# Initialize a global SocketIO instance
socketio = SocketIO()

class LiveTransitServer:
    def __init__(self, socket_instance=None):
        self.sio = socket_instance or socketio

    def broadcast_transit_alert(self, alert_data: dict):
        """
        Broadcast a transit alert to all connected websocket clients.
        """
        self.sio.emit("transit_alert", alert_data)
        return True

    def broadcast_prediction_update(self, prediction_data: dict):
        """
        Broadcast live predictions.
        """
        self.sio.emit("prediction_update", prediction_data)
        return True
