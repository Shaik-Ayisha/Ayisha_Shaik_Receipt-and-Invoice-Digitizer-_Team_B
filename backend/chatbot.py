from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai
import os
from dotenv import load_dotenv

from auth import get_current_user
from database import SessionLocal
from models import Invoice

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(
    request: ChatRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        user_message = request.message.strip()

        invoice = (
            db.query(Invoice)
            .filter(Invoice.user_id == user["id"])
            .order_by(Invoice.id.desc())
            .first()
        )

        invoice_context = "No invoices found for this user."

        if invoice:
            invoice_context = f"""
Latest Invoice:
File: {invoice.filename}
OCR Text: {invoice.ocr_text}
Extracted Fields: {invoice.extracted_fields}
"""

        prompt = f"""
You are an intelligent assistant for a Receipt & Invoice Digitizer system.

{invoice_context}

User Question:
{user_message}

Answer clearly and professionally.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        reply = response.candidates[0].content.parts[0].text

        return {"reply": reply}

    except Exception as e:
      print("CHATBOT ERROR:", e)
      raise HTTPException(status_code=500, detail=str(e))