# api/routes/d108_routes.py

from fastapi import APIRouter

from astottaramsa.d108_engine import (
    D108Engine
)

router = APIRouter()


@router.get("/d108")
def calculate_d108(sign_index: int = 1, longitude_in_sign: float = 12.33):

    result = D108Engine().calculate(
        sign_index=sign_index,
        longitude_in_sign=longitude_in_sign
    )

    return result
