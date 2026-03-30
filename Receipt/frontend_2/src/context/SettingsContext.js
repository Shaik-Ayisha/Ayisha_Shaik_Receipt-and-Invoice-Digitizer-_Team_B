import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [dateFormat, setDateFormat] = useState(localStorage.getItem("dateFormat") || "DD/MM/YYYY");
    const [currency, setCurrency] = useState(localStorage.getItem("currency") || "USD");

    useEffect(() => {
        localStorage.setItem("theme", theme);
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("dateFormat", dateFormat);
    }, [dateFormat]);

    useEffect(() => {
        localStorage.setItem("currency", currency);
    }, [currency]);

    const formatCurrency = (amount) => {
        const value = Number(amount);
        if (isNaN(value)) return amount;

        switch (currency) {
            case "INR": return `₹${value.toFixed(2)}`;
            case "EUR": return `€${value.toFixed(2)}`;
            case "GBP": return `£${value.toFixed(2)}`;
            case "USD":
            default: return `$${value.toFixed(2)}`;
        }
    };

    const formatDate = (dateString, format = "YYYY-MM-DD") => {
        if (!dateString) return "N/A";

        // If it's already a string like "2023-10-05" and we know its format, we can parse it better.
        // For simplicity, let's assume it's valid for new Date().
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // fallback to original

        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();

        switch (dateFormat) {
            case "MM/DD/YYYY": return `${m}/${d}/${y}`;
            case "YYYY-MM-DD": return `${y}-${m}-${d}`;
            case "DD/MM/YYYY":
            default: return `${d}/${m}/${y}`;
        }
    };

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            dateFormat, setDateFormat,
            currency, setCurrency,
            formatCurrency, formatDate
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
