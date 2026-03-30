import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import "./Settings.css";
import Bot from "./Bot";
import Sidebar from "../components/UserDash_Sidebar";

export default function User_Settings() {
    const { theme, setTheme, dateFormat, setDateFormat, currency, setCurrency } = useSettings();
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, []);

    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container settings-page">
            {/* Sidebar */}
            <Sidebar onDocumentsClick={() => navigate("/dashboard#documents")} />

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="welcome-text">
                        <h1 style={{ color: "#c6c6ed" }}>Settings</h1>
                        <p style={{ color: "#c6c6ed" }}>Manage your application preferences and appearance.</p>
                    </div>
                    <div className="home-menu">
                        <div className="Home" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                </div>

                <div className="settings-content">
                    {/* Section 1 - Appearance */}
                    <div className="settings-section card">
                        <h2 className="section-title">🎨 Appearance</h2>
                        <div className="settings-group">
                            <label>Theme</label>
                            <select
                                value={theme}
                                onChange={handleThemeChange}
                                className="settings-select"
                            >
                                <option value="light">Light Mode</option>
                                <option value="dark">Dark Mode</option>
                            </select>
                            <p className="settings-hint">Switching themes applies instantly to the entire application.</p>
                        </div>
                    </div>

                    {/* Section 2 - Preferences */}
                    <div className="settings-section card">
                        <h2 className="section-title">⚙️ Preferences</h2>

                        <div className="settings-group">
                            <label>Date Format</label>
                            <select
                                value={dateFormat}
                                onChange={(e) => setDateFormat(e.target.value)}
                                className="settings-select"
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div className="settings-group">
                            <label>Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="settings-select"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                            <p className="settings-hint">Selected preferences apply across the dashboard, analytics, and invoice values.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Bot />
        </div>
    );
}
