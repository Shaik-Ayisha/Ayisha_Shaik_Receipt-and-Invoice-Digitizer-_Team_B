import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function Invoices() {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/invoice/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const formatted = response.data.map((inv) => ({
        name: inv.filename,
        type: "Invoice",
        date: new Date(inv.uploaded_at).toLocaleDateString(),
        status: "Uploaded",
        ocrText: inv.ocr_text,
        fields: typeof inv.extracted_fields === "string"
  ? JSON.parse(inv.extracted_fields)
  : inv.extracted_fields || {}
      }));

      setDocuments(formatted);

    } catch (err) {
      console.error("History fetch failed", err);
    }

  };


  // =========================
  // VIEW OCR TEXT
  // =========================
  const openOcrWindow = (text, name) => {

    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <html>
        <head>
          <title>OCR Result - ${name}</title>
          <style>
            body { font-family: Arial; padding:20px }
            pre { white-space: pre-wrap }
          </style>
        </head>
        <body>
          <h2>Extracted Text</h2>
          <pre>${text || "No text found"}</pre>
        </body>
      </html>
    `);

    newWindow.document.close();
  };


  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadExtractedData = (doc) => {

    const pdf = new jsPDF();

    let y = 15;

    pdf.setFontSize(16);
    pdf.text("Receipt & Invoice Digitizer", 14, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(`File Name: ${doc.name}`, 14, y);
    y += 7;

    pdf.text(`Type: ${doc.type}`, 14, y);
    y += 7;

    pdf.text(`Date: ${doc.date}`, 14, y);
    y += 10;

    pdf.setFontSize(13);
    pdf.text("Extracted Fields:", 14, y);
    y += 8;

    pdf.setFontSize(10);

    const fieldsText = JSON.stringify(doc.fields, null, 2);

    const splitFields = pdf.splitTextToSize(fieldsText, 180);

    pdf.text(splitFields, 14, y);

    y += splitFields.length * 5 + 5;

    pdf.setFontSize(13);
    pdf.text("Full OCR Text:", 14, y);
    y += 8;

    pdf.setFontSize(10);

    const splitOcr = pdf.splitTextToSize(doc.ocrText || "No text found", 180);

    pdf.text(splitOcr, 14, y);

    pdf.save(`${doc.name}_extracted.pdf`);
  };


  return (

  <div className="p-10 bg-slate-100 min-h-screen">

    {/* Title */}
    <h2 className="text-3xl font-bold text-gray-800 mb-8">
      Recent Documents
    </h2>

    {/* Card */}
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="overflow-x-auto">

        <table className="w-full text-left border border-gray-200">

          {/* Table Header */}
          <thead className="bg-slate-900 text-white text-sm uppercase">
            <tr>
              <th className="p-4">File Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Extracted Text</th>
              <th className="p-4">Download</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-700">

            {documents.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No documents yet
                </td>
              </tr>

            ) : (

              documents.map((doc, index) => (

                <tr key={index} className="border-t hover:bg-gray-50">

                  <td className="p-4">{doc.name}</td>

                  <td className="p-4">{doc.type}</td>

                  <td className="p-4">{doc.date}</td>

                  <td className="p-4 text-green-600 font-medium">
                    {doc.status}
                  </td>

                  <td className="p-4">

                    {doc.ocrText ? (

                      <button
                        onClick={() =>
                          openOcrWindow(doc.ocrText, doc.name)
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        View Text
                      </button>

                    ) : "—"}

                  </td>

                  <td className="p-4">

                    {doc.ocrText ? (

                      <button
                        onClick={() =>
                          downloadExtractedData(doc)
                        }
                        className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                      >
                        Download PDF
                      </button>

                    ) : "—"}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

);
}
export default  Invoices;