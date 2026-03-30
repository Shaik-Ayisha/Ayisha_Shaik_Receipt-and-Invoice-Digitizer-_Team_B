import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onDocumentsClick }) {
    const location = useLocation();

    // Feedback states relocated here so it's accessible globally
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const isActive = (path) => location.pathname === path ? "active" : "sidebar-link";

    return (
        <div className="sidebar">
            <h2 className="logo">Receipt & Invoice Digitizer</h2>
            <ul>
                <li>
                    <Link to="/dashboard" className={isActive("/dashboard")} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/invoicedetails" className={isActive("/invoicedetails")} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        Upload Invoice
                    </Link>
                </li>
                <li className="sidebar-link" onClick={onDocumentsClick} style={{ cursor: "pointer" }}>
                    Documents
                </li>
                <li>
                                        <Link 
                    to="/user_settings" 
                    className={isActive("/user_settings")} 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                    Settings
                    </Link>
                </li>

                <hr style={{ border: "0", borderTop: "1px solid var(--border-color, #e5e7eb)", margin: "15px 0" }} />

                <li>
                                        <Link 
                    to="/user_privacy" 
                    className={isActive("/user_privacy")} 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                    Privacy Policy
                    </Link>
                </li>
                <li className="sidebar-link" onClick={() => setShowFeedbackModal(true)} style={{ cursor: "pointer" }}>
                    Feedback
                </li>
            </ul>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="modal-overlay">
                    <div className="invoice-modal-content feedback-modal-container">
                        <div className="modal-header">
                            <h2>Rate Your Experience</h2>
                            <button className="close-btn" onClick={() => setShowFeedbackModal(false)}>✕</button>
                        </div>

                        {!feedbackSubmitted ? (
                            <div className="feedback-form">
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`star ${feedbackRating >= star ? "star-active" : "star-inactive"}`}
                                            onClick={() => setFeedbackRating(star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <textarea
                                    className="feedback-textarea"
                                    placeholder="Any feedback or suggestions?"
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                />

                                <div className="modal-actions">
                                    <button
                                        className="action-btn cancel-btn"
                                        onClick={() => setShowFeedbackModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="action-btn save-btn"
                                        disabled={feedbackRating === 0}
                                        onClick={() => setFeedbackSubmitted(true)}
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="feedback-success">
                                <h3>Thank you for your feedback!</h3>
                                <p>We appreciate you taking the time to help us improve.</p>
                                <div className="modal-actions">
                                    <button
                                        className="action-btn save-btn"
                                        onClick={() => {
                                            setShowFeedbackModal(false);
                                            setFeedbackSubmitted(false);
                                            setFeedbackRating(0);
                                            setFeedbackText("");
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
