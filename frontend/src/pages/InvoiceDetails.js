import { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InvoiceDetails.css";
import axios from "axios";

function InvoiceDetails() {
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
          value: extracted.date || "",
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
        <button onClick={() => navigate("/")} className="back-btn">
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

            {Object.keys(fields).map((key) => (
              <div
                key={key}
                className={`field-row ${
                  fields[key].verified ? "verified" : ""
                }`}
              >
                <div>
                  <p className="field-label">{key}</p>

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
            ))}
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
                      <td>${item.rate}</td>
                      <td>
                        ${(item.quantity || 0) *
                          (item.rate || 0)}
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
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax (10%): ${tax.toFixed(2)}</p>
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;