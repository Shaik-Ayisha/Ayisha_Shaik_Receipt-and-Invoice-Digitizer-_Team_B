import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import ExpenseChart from "./ExpenseChart";
import Bot from "./Bot";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function Dashboard() {

const [showMenu, setShowMenu] = useState(false);
const [invoices, setInvoices] = useState([]);
const [documents, setDocuments] = useState([]);

const recentDocsRef = useRef(null);
const messagesEndRef = useRef(null);

const { t } = useTranslation();

const [highlight, setHighlight] = useState(false);

const scrollToRecentDocs = () => {
recentDocsRef.current?.scrollIntoView({ behavior: "smooth" });

setHighlight(true);
setTimeout(() => {
  setHighlight(false);
}, 1500);
};

useEffect(() => {
  fetchInvoices();
  fetchDocuments();
}, []);

const fetchDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8000/invoice/recent",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      setDocuments(data);
    }

  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const fetchInvoices = async () => {
  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8000/invoice/invoices",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      setInvoices(data);
    } else {
      setInvoices([]);
    }

  } catch (error) {
    console.error("Error fetching invoices:", error);
    setInvoices([]);
  }
};

const handleInvoiceUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/invoice/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    await response.json();
    fetchInvoices();

  } catch (error) {
    console.error("Upload error:", error);
  }
};

const handleReceiptUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/upload-receipt", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    await response.json();
    fetchInvoices();

  } catch (error) {
    console.error("Upload error:", error);
  }
};

return (
<div className="dashboard-container">

  {/* Sidebar */}
  <div className="sidebar">

    <h2 className="logo">Receipt & Invoice Digitizer</h2>

    <ul>
      <li className="active">{t("dashboard")}</li>

      <li>
        <Link to="/invoicedetails" className="sidebar-link">
         {t("uploadInvoice")}
        </Link>
      </li>

      <li className="sidebar-link" onClick={scrollToRecentDocs}>
        {t("documents")}
      </li>

      <li className="sidebar-link">{t("history")}</li>
      <li className="sidebar-link">{t("settings")}</li>
    </ul>

  </div>

  {/* Main Content */}
  <div className="main-content">

    {/* Header */}
    <div className="header">

      <div className="welcome-text">
        <h1>{t("welcome")} 👋</h1>
        <p>{t("dashboardDesc")}</p>
      </div>

      <div className="home-menu">

        <div className="language-switcher">
          <LanguageSwitcher />
        </div>

        <div
          className="Home"
          onClick={() => setShowMenu(!showMenu)}
        >
          {t("home")} ▼
        </div>

        {showMenu && (
          <div className="dropdown-menu">

            <div className="dropdown-item">
              {t("admin")}
            </div>

            <div
              className="dropdown-item logout"
              onClick={() => alert("Logged out")}
            >
              {t("logout")}
            </div>

          </div>
        )}

      </div>

    </div>

    {/* Cards */}
    <div className="cards">

      <div className="card">
        <h3>📊 {t("totalDocuments")}</h3>
        <p>{documents.length}</p>
      </div>

      <div className="card">
        <h3>📑 {t("receiptsUploaded")}</h3>
        <p>{documents.filter(d => d.type === "Receipt").length}</p>
      </div>

      <div className="card">
        <h3>📄 {t("invoicesUploaded")}</h3>
        <p>{documents.filter(d => d.type === "Invoice").length}</p>
      </div>

      <div className="card">
        <h3>⏳ {t("pendingOCR")}</h3>
        <p>0</p>
      </div>

    </div>

    {/* Upload Section */}
    <div className="upload-section">

      <div className="upload-box">
        <h3>{t("uploadReceipt")}</h3>
        <p>{t("dragDropReceipt")}</p>

        <button onClick={() => document.getElementById("receiptInput").click()}>
          {t("uploadReceipt")}
        </button>

        <input
          type="file"
          style={{ display: "none" }}
          id="receiptInput"
          onChange={handleReceiptUpload}
        />
      </div>

      <div className="upload-box">
        <h3>{t("uploadInvoice")}</h3>
        <p>{t("dragDropInvoice")}</p>

        <button onClick={() => document.getElementById("invoiceInput").click()}>
          {t("uploadInvoice")}
        </button>

        <input
          type="file"
          style={{ display: "none" }}
          id="invoiceInput"
          onChange={handleInvoiceUpload}
        />
      </div>

    </div>

    {/* Recent Documents */}
    <div
     className={`card ${highlight ? "highlight-section" : ""}`}
     ref={recentDocsRef}
    >

     <h3>{t("recentDocuments")}</h3>

     <table>
     <thead>
     <tr>
     <th>{t("fileName")}</th>
     <th>{t("type")}</th>
     <th>{t("date")}</th>
     <th>{t("status")}</th>
     </tr>
     </thead>

     <tbody>
     {documents.length === 0 ? (
     <tr>
     <td colSpan="4">{t("noDocuments")}</td>
     </tr>
     ) : (
     documents.map((doc, index) => (
     <tr key={index}>
     <td>{doc.name}</td>
     <td>{doc.type}</td>
     <td>{doc.date}</td>
     <td>{doc.status}</td>
     </tr>
     ))
     )}
     </tbody>
     </table>

    </div>

    {/* Analysis */}
    <div className="analysis-section">
      <h2>{t("expenseAnalysis")}</h2>
      <div className="analysis-card">
        <ExpenseChart invoices={invoices} />
      </div>
    </div>

  </div>

  {/* Chatbot */}
  <Bot />

</div>
);
}

export default Dashboard;