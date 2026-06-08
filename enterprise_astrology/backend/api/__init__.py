# backend/api/__init__.py

from enterprise_astrology.backend.api.astrology_routes import router as astrology_router
from enterprise_astrology.backend.api.websocket_routes import router as websocket_router
from enterprise_astrology.backend.api.prediction_routes import router as prediction_router
from enterprise_astrology.backend.api.muhurat_routes import router as muhurat_router

__all__ = [
    "astrology_router",
    "websocket_router",
    "prediction_router",
    "muhurat_router"
]
