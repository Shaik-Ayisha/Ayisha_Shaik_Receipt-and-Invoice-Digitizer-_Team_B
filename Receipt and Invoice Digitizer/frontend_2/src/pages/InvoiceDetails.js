import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InvoiceDetails.css";
import axios from "axios";
import { useSettings } from "../context/SettingsContext";

function InvoiceDetails() {
  const { formatCurrency, formatDate } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const invoiceData = location.state?.invoiceData || {};

  /* ---------------- INITIALIZE FIELDS ---------------- */

  const initializeFields = () => {
    const baseFields = {
      vendorName: "",
      vendorEmail: "",
      vendorPhone: "",
      vendorAddress: "",
      clientName: "",
      invoiceDate: ""
    };

    const result = {};

    Object.keys(baseFields).forEach((key) => {
      result[key] = {
        value: invoiceData[key] || "",
        confidence: invoiceData.confidence?.[key] || 0,
        verified: false
      };
    });

    return result;
  };

  const initializeLineItems = () => {
    return (invoiceData.lineItems || []).map((item) => ({
      ...item,
      verified: false
    }));
  };

  const [fields, setFields] = useState(initializeFields);
  const [lineItems, setLineItems] = useState(initializeLineItems);
  const [editingField, setEditingField] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // Load draft automatically if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem("invoiceDraft");

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);

      if (parsed.fields) setFields(parsed.fields);
      if (parsed.lineItems) setLineItems(parsed.lineItems);
    }
  }, []);
  // Backend fetch logic-----------------------------
  useEffect(() => {

    const fetchInvoice = async () => {
      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8000/invoice/history",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.length > 0) {

          const latestInvoice = response.data[0];
          const extracted = latestInvoice.extracted_fields || {};
          setPreviewUrl(latestInvoice.preview_url);

          setFields({
            vendorName: {
              value: extracted.vendor || "",
              confidence: 90,
              verified: false
            },
            vendorEmail: {
              value: "",
              confidence: 0,
              verified: false
            },
            vendorPhone: {
              value: "",
              confidence: 0,
              verified: false
            },
            vendorAddress: {
              value: "",
              confidence: 0,
              verified: false
            },
            clientName: {
              value: "",
              confidence: 0,
              verified: false
            },
            invoiceDate: {
              value: formatDate(extracted.date) || "",
              confidence: 90,
              verified: false
            }
          });

          // 🔥 Show total as line item so summary works
          if (extracted.total) {
            setLineItems([
              {
                description: "Invoice Total",
                quantity: 1,
                rate: parseFloat(extracted.total),
                confidence: 90,
                verified: false
              }
            ]);
          }

        }


      } catch (error) {
        console.error("Error fetching invoice", error);
      }
    };

    fetchInvoice();

  }, []);
  /* ---------------- CALCULATIONS ---------------- */

  const subtotal = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const verifiedCount =
    Object.values(fields).filter((f) => f.verified).length +
    lineItems.filter((i) => i.verified).length;

  const totalFields =
    Object.keys(fields).length + lineItems.length;

  const progressPercent =
    totalFields === 0 ? 0 : (verifiedCount / totalFields) * 100;

  const allVerified = totalFields > 0 && verifiedCount === totalFields;

  /* ---------------- FUNCTIONS ---------------- */

  const updateField = (key, value) => {
    setFields({
      ...fields,
      [key]: { ...fields[key], value }
    });
  };

  const toggleVerifyField = (key) => {
    setFields({
      ...fields,
      [key]: {
        ...fields[key],
        verified: !fields[key].verified
      }
    });
  };

  const toggleVerifyLine = (index) => {
    const updated = [...lineItems];
    updated[index].verified = !updated[index].verified;
    setLineItems(updated);
  };

  const getColor = (score) => {
    if (score >= 95) return "green";
    if (score >= 85) return "yellow";
    return "red";
  };
  const saveDraft = () => {
    const draftData = {
      fields,
      lineItems
    };

    localStorage.setItem("invoiceDraft", JSON.stringify(draftData));

    setDraftSaved(true);   // enable approve button

    alert("Draft saved successfully!");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="verify-container">

      {/* HEADER */}
      <div className="verify-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back
        </button>

        <h2>Invoice Data Extraction</h2>

        <div className="header-actions">
          <div className="progress-text">
            {verifiedCount}/{totalFields} Verified
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent === 100 ? "#22c55e" : "#2563eb"
              }}
            />
          </div>

          <button onClick={saveDraft} className="draft-btn">
            Save as Draft
          </button>

          <button
            className="approve-btn"
            disabled={!draftSaved}
            onClick={() => navigate("/dashboard")}
          >
            Approve & Save
          </button>

        </div>
      </div>

      <div className="verify-body">

        {/* LEFT PANEL */}
        <div className="document-panel">
          <h3>Original Document</h3>

          <div className="doc-preview">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Invoice Preview"
                className="invoice-image"
              />
            ) : (
              <div className="empty-preview">
                Invoice Preview
              </div>
            )}
          </div>

          <div className="ocr-score">
            OCR Confidence: {invoiceData.ocrConfidence || 0}%
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="data-panel">

          <div className="card">
            <h3>Basic Information</h3>

            {Object.keys(fields).map((key) => {
              // Map keys to SVG icons
              const getIcon = (fieldKey) => {
                switch (fieldKey) {
                  case "vendorName":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>
                      </svg>
                    );
                  case "vendorEmail":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    );
                  case "vendorPhone":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    );
                  case "vendorAddress":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    );
                  case "clientName":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    );
                  case "invoiceDate":
                    return (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div
                  key={key}
                  className={`field-row ${fields[key].verified ? "verified" : ""
                    }`}
                >
                  <div>
                    <div className="field-label">
                      {getIcon(key)} {key}
                    </div>

                    {editingField === key ? (
                      <input
                        value={fields[key].value}
                        onChange={(e) =>
                          updateField(key, e.target.value)
                        }
                        onBlur={() => setEditingField(null)}
                      />
                    ) : (
                      <p>{fields[key].value}</p>
                    )}
                  </div>

                  <div className="field-actions">
                    <span
                      className={`confidence ${getColor(
                        fields[key].confidence
                      )}`}
                    >
                      {fields[key].confidence}%
                    </span>

                    <button
                      onClick={() => setEditingField(key)}
                      className="edit-btn"
                    >
                      ✏
                    </button>

                    <button
                      onClick={() => toggleVerifyField(key)}
                      className="verify-btn"
                    >
                      ✔
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* LINE ITEMS */}
          <div className="card">
            <h3>Line Items</h3>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Conf</th>
                  <th>Verify</th>
                </tr>
              </thead>

              <tbody>
                {lineItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No Line Items
                    </td>
                  </tr>
                ) : (
                  lineItems.map((item, index) => (
                    <tr
                      key={index}
                      className={item.verified ? "verified" : ""}
                    >
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.rate || 0)}</td>
                      <td>
                        {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                      </td>
                      <td>
                        <span
                          className={`confidence ${getColor(
                            item.confidence
                          )}`}
                        >
                          {item.confidence}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            toggleVerifyLine(index)
                          }
                          className="verify-btn"
                        >
                          ✔
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* SUMMARY */}
          <div className="card">
            <h3>Financial Summary</h3>
            <p className="financial-summary-row">Subtotal: {formatCurrency(subtotal)}</p>
            <p className="financial-summary-row">Tax (10%): {formatCurrency(tax)}</p>
            <p className="financial-summary-total">Total: {formatCurrency(total)}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;