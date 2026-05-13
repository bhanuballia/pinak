from fastapi import APIRouter
from core.paramarshi.paramarshi_engine import ask_paramarshi

router = APIRouter()

@router.post("/ask")
def ask_ai(payload: dict):
    """
    Paramarshi Engine - Supreme Advisor Q&A
    """
    question = payload["question"]
    report_data = payload["report_data"]

    return ask_paramarshi(question, report_data)
