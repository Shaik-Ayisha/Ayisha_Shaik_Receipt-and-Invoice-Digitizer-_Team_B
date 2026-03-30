import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Bot from "./Bot";
import Sidebar from "../components/UserDash_Sidebar";
import "./Dashboard.css"; // Reuse dashboard styling

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container settings-page privacy-page">
            {/* Sidebar */}
            <Sidebar onDocumentsClick={() => navigate("/dashboard#documents")} />

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="welcome-text">
                        <h1 style={{ color: "#c6c6ed", marginBottom: "8px" }}>Privacy Policy</h1>
                        <p style={{ color: "var(--text-color)" }}>Learn how we handle and protect your data.</p>
                    </div>
                    <div className="home-menu">
                        <div className="Home" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                </div>

                <div className="settings-content">
                    <div className="settings-section card">
                        <h2 className="section-title privacy-title">Privacy Policy</h2>
                        <p className="privacy-body">
                            Your privacy is important to us. This Privacy Policy outlines how your data is collected,
                            used, and safeguarded when you use the Receipt & Invoice Digitizer.
                        </p>
                    </div>

                    <div className="settings-section card">
                        <h2 className="section-title privacy-title">Information Collection</h2>
                        <p className="privacy-body">
                            We collect documents (receipts and invoices) that you explicitly upload to the platform.
                            During the digitization process, our OCR engine extracts structured data such as vendor details, amounts,
                            and dates.
                        </p>
                    </div>

                    <div className="settings-section card">
                        <h2 className="section-title privacy-title">Data Usage</h2>
                        <p className="privacy-body">
                            The primary purpose of collecting this extracted data is to provide you with analytical
                            insights, categorized expenses, and digitized exports (CSV/PDF). Your data is never sold
                            to third parties.
                        </p>
                    </div>

                    <div className="settings-section card">
                        <h2 className="section-title privacy-title">Data Security</h2>
                        <p className="privacy-body">
                            We implement industry-standard encryption protocols to protect your sensitive financial documents
                            and extracted data from unauthorized access or disclosure.
                        </p>
                    </div>

                    <div className="settings-section card">
                        <h2 className="section-title privacy-title">User Control</h2>
                        <p className="privacy-body" style={{ marginBottom: 0 }}>
                            You maintain full control over your information. At any time, you may delete your uploaded
                            documents and corresponding extracted data permanently from our servers.
                        </p>
                    </div>
                </div>
            </div>
            <Bot />
        </div>
    );
}
