from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os
import json

from database import SessionLocal
from models import Invoice
from auth import get_current_user
from ocr_model import process_invoice

router = APIRouter(prefix="/invoice")

UPLOAD_FOLDER = "uploads"


# =========================
# DB dependency
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 📤 Upload Invoice (OCR + DB SAVE)
# =========================
@router.post("/upload")
def upload_invoice(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ensure uploads folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    # save file
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ RUN OCR
    ocr_result = process_invoice(file_location)

    # ✅ SAVE OCR INTO DB (IMPORTANT)
    invoice = Invoice(
        filename=file.filename,
        file_path=file_location,
        user_id=user["id"],
        ocr_text=ocr_result.get("ocr_text"),
        extracted_fields=json.dumps(ocr_result.get("extracted_fields")),
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # ✅ return OCR data to frontend
    return {
        "message": "Invoice uploaded successfully",
        **ocr_result,
    }


# =========================
# 📜 Invoice History (WITH OCR)
# =========================
@router.get("/history")
def invoice_history(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoices = (
        db.query(Invoice)
        .filter(Invoice.user_id == user["id"])
        .order_by(Invoice.uploaded_at.desc())
        .all()
    )

    # ✅ FORMAT RESPONSE FOR FRONTEND
    result = []
    for inv in invoices:
        result.append({
        "id": inv.id,
        "filename": inv.filename,
        "preview_url": f"http://localhost:8000/uploads/{inv.filename}",
        "uploaded_at": inv.uploaded_at,
        "ocr_text": inv.ocr_text,
        "extracted_fields": (
        json.loads(inv.extracted_fields)
        if inv.extracted_fields
        else {}
    ),
})

    return result
@router.get("/invoices")
def get_invoices(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):

    invoices = (
        db.query(Invoice)
        .filter(Invoice.user_id == user["id"])
        .all()
    )

    return invoices
# =========================
# 📄 Recent Documents (for dashboard)
# =========================
@router.get("/recent")
def get_recent_documents(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoices = (
        db.query(Invoice)
        .filter(Invoice.user_id == user["id"])
        .order_by(Invoice.uploaded_at.desc())
        .limit(10)
        .all()
    )

    documents = []

    for inv in invoices:
        documents.append({
            "name": inv.filename,
            "type": "Invoice",
            "date": str(inv.uploaded_at).split(" ")[0],
            "status": "Processed" if inv.ocr_text else "Pending"
        })

    return documents
from collections import defaultdict
from datetime import datetime

# =========================
# 📈 Revenue Trend (Monthly)
# =========================
from collections import defaultdict
from datetime import datetime
import json

@router.get("/revenue")
def get_revenue_chart(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    invoices = (
        db.query(Invoice)
        .filter(Invoice.user_id == user["id"])
        .all()
    )

    revenue_by_month = defaultdict(float)

    for inv in invoices:

        if not inv.extracted_fields:
            continue

        try:
            fields = json.loads(inv.extracted_fields)
            total = float(fields.get("total", 0))
        except:
            total = 0

        month = inv.uploaded_at.strftime("%b")  # Jan, Feb etc
        revenue_by_month[month] += total

    result = []

    for month, revenue in revenue_by_month.items():
        result.append({
            "label": month,
            "revenue": revenue
        })

    # 🔹 SORT MONTHS CORRECTLY
    result = sorted(
        result,
        key=lambda x: datetime.strptime(x["label"], "%b")
    )

    return result