# api/routes/sanghatta_routes.py

from fastapi import APIRouter

from sanghatta_chakra.sanghatta_engine import (
    SanghattaEngine
)

router = APIRouter()


@router.get("/sanghatta")

def get_sanghatta():

    result = (
        SanghattaEngine()
        .analyze(
            natal_nakshatra=5,
            transit_nakshatra=12,
            saturn=82,
            mars=71,
            rahu=63
        )
    )

    return result
