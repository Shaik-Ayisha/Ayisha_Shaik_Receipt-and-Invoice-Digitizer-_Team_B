# 📄 Receipt and Invoice Digitizer

The **Receipt and Invoice Digitizer** is a web-based application that converts handwritten or printed receipts into structured digital data. It uses **OCR (Optical Character Recognition)** to extract key details from receipt images and store them for easy management and retrieval.

This project was developed as part of the **Infosys Springboard Virtual Internship 6.0**.

## 🎯 Project Objective

The goal of this project is to reduce manual data entry by automatically extracting important information from receipts and invoices such as:

* Vendor Name
* Purchase Date
* Items Purchased
* Total Amount

The system also includes an **admin dashboard** and a **chatbot** for better interaction and management.

## 🚀 Features

* 📤 Upload receipts and invoices
* 🔍 OCR-based text extraction using **Tesseract OCR**
* 📊 Admin dashboard for managing receipts
* 🤖 AI chatbot for user assistance
* 🌐 Multi-language receipt support
* 📈 Expense analytics dashboard
* 🌙 Light/Dark theme support
* 🔐 Secure login with JWT authentication
* 📂 Organized storage of digitized receipts

## 🛠️ Technologies Used

### Frontend

* React.js
* HTML / CSS
* JavaScript

### Backend

* Python
* FastAPI

### Database

* SQLite

### AI & OCR

* Tesseract OCR
* NLTK

### Tools

* Postman
* GitHub
* VS Code

## ⚙️ System Architecture

1. User uploads a receipt image
2. Backend API receives the image
3. Tesseract OCR extracts text
4. Text is processed into structured data
5. Data is stored in SQLite
6. Dashboard displays results
7. Chatbot assists users

## 📂 Project Structure

```
receipt-invoice-digitizer
│
├── backend
├── frontend
├── frontend_2
├── assets
├── README.md
└── requirements.txt
```

## ▶️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shaik-Ayisha/Ayisha_Shaik_Receipt-and-Invoice-Digitizer-_Team_B.git
cd receipt-invoice-digitizer
```

### 2. Backend Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup (Primary UI)

```bash
cd frontend
npm install
npm start
```

### 4. Frontend_2 Setup (Alternative UI)

```bash
cd frontend_2
npm install
npm start
```

## 📸 Application Workflow

1. Open the application
2. Login
3. Upload receipt/invoice
4. OCR extracts data
5. View results in dashboard
6. Manage receipts

## ⚠️ Challenges Faced

* OCR accuracy for handwritten receipts
* Different receipt formats
* Poor image quality
* Structuring raw OCR output
* Full-stack integration

## 📚 Skills Gained

* OCR with Python
* FastAPI backend development
* React frontend development
* Database integration
* Debugging and testing

## 👩‍💻 Author

**Ayisha Shaik**

## Acknowledgements

Thanks to **Infosys Springboard** and mentor **Shakthi GopalKrishnan** for guidance and support.

## 📌 Internship Details

* Program: Infosys Springboard Virtual Internship 6.0
* Project: Receipt and Invoice Digitizer
* Duration: 8 Weeks
