import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import ExpenseChart from "./ExpenseChart";
import { CategoryChart, MerchantChart, WeeklyChart, AnomalyChart, MonthlyChart } from "./AnalyticsCharts";
import Bot from "./Bot";
import Sidebar from "../components/UserDash_Sidebar";
import { useSettings } from "../context/SettingsContext";

function Dashboard() {
  const { formatCurrency, formatDate } = useSettings();
  const [showMenu, setShowMenu] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  // Digitization states
  const [digitizationPreview, setDigitizationPreview] = useState(null);
  const [digitizationData, setDigitizationData] = useState(null);
  const [isDigitizing, setIsDigitizing] = useState(false);
  const [showDigitizeModal, setShowDigitizeModal] = useState(false);

  const recentDocsRef = useRef(null);
  const messagesEndRef = useRef(null);

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

      console.log("Recent docs:", data);

      if (Array.isArray(data)) {
        setDocuments(data);
      }

    } catch (error) {
      console.error("Error fetching documents:", error);
    }

  };
  const handleLogout = () => {
    localStorage.removeItem("token");   // remove JWT
    navigate("/login");                 // redirect to login page
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

      console.log("Invoices from backend:", data);

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

      const data = await response.json();

      console.log("Invoice uploaded:", data);

      fetchInvoices();

    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const downloadPDF = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8000/invoice/generate-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(digitizationData)
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "digitized_invoice.pdf";
    a.click();
  };
  const saveDigitized = async () => {

    const token = localStorage.getItem("token");

    await fetch(
      "http://localhost:8000/invoice/save-digitized",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(digitizationData)
      }
    );

    alert("Digitized invoice saved!");

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

      const data = await response.json();

      console.log("Receipt uploaded:", data);

      // refresh invoice list so chart updates
      fetchInvoices();

    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDigitizeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set local preview
    setDigitizationPreview(URL.createObjectURL(file));
    setDigitizationData(null);
    setIsDigitizing(true);

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

      const data = await response.json();
      console.log("Digitization complete:", data);

      // Provide default string if string, else actual object
      let fields = {};
      if (data && data.extracted_fields) {
        fields = typeof data.extracted_fields === "string"
          ? JSON.parse(data.extracted_fields)
          : data.extracted_fields;
      }

      setDigitizationData(fields);

      // Refresh documents to include this newly uploaded file
      fetchDocuments();
      fetchInvoices();

    } catch (error) {
      console.error("Digitization upload error:", error);
      alert("Error processing the invoice. Please try again.");
    } finally {
      setIsDigitizing(false);
    }
  };

  return (<div className="dashboard-container">


    {/* Sidebar */}
    <Sidebar onDocumentsClick={scrollToRecentDocs} />

    {/* Main Content */}
    <div className="main-content">

      {/* Header */}
      <div className="header">

        <div className="welcome-text">
          <h1>Hey! Welcome back👋</h1>
          <p>Centralized management for digitizing receipts and invoices.</p>
        </div>

        <div className="home-menu">

          <div
            className="Home"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setShowMenu(!showMenu);
            }}
          >
            Home ▼
          </div>

          {showMenu && (
            <div className="dropdown-menu">

              

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                Logout
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Cards */}
      <div className="cards">

        <div className="card">
          <h3>📊 Total Documents</h3>
          <p>{documents.length}</p>
        </div>

        <div className="card">
          <h3>📑 Receipts Uploaded</h3>
          <p>{documents.filter(d => d.type === "Receipt").length}</p>
        </div>

        <div className="card">
          <h3>📄 Invoices Uploaded</h3>
          <p>{documents.filter(d => d.type === "Invoice").length}</p>
        </div>

        <div className="card">
          <h3>⏳ Pending OCR</h3>
          <p>0</p>
        </div>

      </div>

      {/* Upload Section */}
      <h2 className="section-title">☁️ Upload Section</h2>
      <div className="upload-section">

        <div className="upload-box" onClick={() => document.getElementById("receiptInput").click()}>
          <h3>Upload Receipt</h3>
          <p>Drag & drop or click to upload receipt</p>

          <button>
            Upload Receipt
          </button>

          <input
            type="file"
            style={{ display: "none" }}
            id="receiptInput"
            onChange={handleReceiptUpload}
          />
        </div>

        <div className="upload-box" onClick={() => document.getElementById("invoiceInput").click()}>
          <h3>Upload Invoice</h3>
          <p>Drag & drop or click to upload invoice</p>

          <button>
            Upload Invoice
          </button>

          <input
            type="file"
            style={{ display: "none" }}
            id="invoiceInput"
            onChange={handleInvoiceUpload}
          />
        </div>

      </div>

      {/* Invoice Digitization Section */}
      <div className="digitization-section card">
        <h2 className="section-title">📄 Invoice Digitization</h2>
        <p>Convert damaged or handwritten invoices into a clean digital invoice.</p>

        <div className="digitization-controls">
          <div className="digitization-upload">
            <button
              className="primary-btn"
              onClick={() => document.getElementById("digitizeInput").click()}
            >
              Upload Invoice
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              id="digitizeInput"
              onChange={handleDigitizeUpload}
              accept="image/*,.pdf"
            />
          </div>

          {digitizationPreview && (
            <div className="digitization-preview">
              <img src={digitizationPreview} alt="Invoice Preview" className="preview-thumbnail" />
              <div className="digitization-actions">
                {isDigitizing ? (
                  <button className="secondary-btn" disabled>Processing OCR...</button>
                ) : (
                  <button
                    className="generate-btn"
                    disabled={!digitizationData}
                    onClick={() => setShowDigitizeModal(true)}
                  >
                    Generate Digital Invoice
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`recent-docs ${highlight ? "highlight-section" : ""}`}
        ref={recentDocsRef}
        id="recent-documents"
      >
        <h2 className="section-title">📂 Recent Documents</h2>

        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="4">No documents yet</td>
              </tr>
            ) : (
              documents.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                  <td>{formatDate(doc.date)}</td>
                  <td>{doc.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Analysis */}
      <div className="analysis-section">
        <h2 className="section-title">📈 Expense Analysis</h2>
        <div className="analysis-card">
          <ExpenseChart invoices={invoices} />
        </div>

        <div className="analytics-grid">
          <CategoryChart invoices={invoices} />
          <MerchantChart invoices={invoices} />
          <WeeklyChart invoices={invoices} />
          <MonthlyChart invoices={invoices} />
          <AnomalyChart invoices={invoices} />
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">

        <h2 className="section-title">⚙️ How It Works</h2>

        <div className="steps-container">

          <div className="step-card">
            <div className="step-circle">1</div>
            <h4>Upload Documents</h4>
            <p>Drag and drop your receipts or invoices.</p>
          </div>

          <div className="step-card">
            <div className="step-circle">2</div>
            <h4>Automatic Processing</h4>
            <p>Our AI scans and digitizes your documents.</p>
          </div>

          <div className="step-card">
            <div className="step-circle">3</div>
            <h4>Extract Data</h4>
            <p>Get vendor info, amounts and dates.</p>
          </div>

          <div className="step-card">
            <div className="step-circle">4</div>
            <h4>Export & Analyze</h4>
            <p>Export to CSV/JSON and analyze expenses.</p>
          </div>

        </div>

      </div>

    </div>

    {/* Chatbot */}
    <Bot />

    {/* Invoice Digitization Modal */}
    {showDigitizeModal && digitizationData && (
      <div className="modal-overlay">
        <div className="invoice-modal-content">
          <div className="modal-header">
            <h2>Standard Digital Invoice</h2>
            <button className="close-btn" onClick={() => setShowDigitizeModal(false)}>✕</button>
          </div>

          <div className="invoice-template">
            <div className="invoice-header">
              <div>
                <h3>{digitizationData.vendor || "Unknown Merchant"}</h3>
                <p>Invoice #: {digitizationData.invoice_no || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="invoice-date">Date: {formatDate(digitizationData.date)}</p>
                <p>Payment Method: {digitizationData.payment_method || "Credit Card"}</p>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Mocking an item table since direct line-items are not explicitly output by current OCR script */}
                <tr>
                  <td>General Services/Products</td>
                  <td className="text-right">1</td>
                  <td className="text-right">{formatCurrency(digitizationData.total || 0)}</td>
                  <td className="text-right">{formatCurrency(digitizationData.total || 0)}</td>
                </tr>
              </tbody>
            </table>

            <div className="invoice-totals">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>{formatCurrency((Number(digitizationData.total || 0) * 0.9))}</span>
              </div>
              <div className="totals-row">
                <span>Tax (Estimated 10%):</span>
                <span>{formatCurrency((Number(digitizationData.total || 0) * 0.1))}</span>
              </div>
              <div className="totals-row grand-total">
                <span>Total:</span>
                <span>{formatCurrency(digitizationData.total || 0)}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="action-btn download-btn"
              onClick={downloadPDF}
            >
              Download as PDF
            </button>

            <button
              className="action-btn save-btn"
              onClick={saveDigitized}
            >
              Save Digitized Invoice
            </button>
            <button
              className="action-btn cancel-btn"
              onClick={() => setShowDigitizeModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}

  </div>


  );
}

export default Dashboard;
