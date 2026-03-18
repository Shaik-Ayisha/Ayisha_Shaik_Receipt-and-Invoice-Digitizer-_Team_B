import React, { useState } from "react";
import invoiceImage from "./invoice-illustration.png";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    language: "English",
    role: "user",
    admin_key: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // ---------------- SIGNUP ----------------
      if (page === "signup") {

        const response = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            admin_key: form.admin_key
          }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          alert(data.detail || "Registration failed");
          return;
        }

        alert(t("registeredSuccessfully"));
        setPage("login");

      }

      // ---------------- LOGIN ----------------
      else {

        const params = new URLSearchParams();
        params.append("username", form.email);
        params.append("password", form.password);

        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          if (Array.isArray(data.detail)) {
            alert(data.detail.map((err) => err.msg).join(", "));
          } else {
            alert(data.detail || "Login failed");
          }
          return;
        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 p-6">

      {/* Language Switcher */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 gap-10 p-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center text-center">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
              {t("receiptInvoice")}
            </span>
            <br />
            <span className="text-gray-900 tracking-widest uppercase">
              {t("digitizer")}
            </span>
          </h1>

          <img
            src={invoiceImage}
            alt="Invoice Illustration"
            className="w-full max-w-sm md:max-w-md"
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center bg-blue-50 rounded-2xl p-8 shadow-xl">

          <h2 className="text-3xl font-bold text-center mb-2 text-blue-700 capitalize">
            {t(page)}
          </h2>

          {page === "login" && (
            <p className="text-center text-sm text-gray-600 mb-6">
              {t("firstTimeMessage")}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {page === "signup" && (
              <select
                name="role"
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="user">{t("user")}</option>
                <option value="admin">{t("admin")}</option>
              </select>
            )}

            {page === "signup" && (
              <input
                type="text"
                name="name"
                placeholder={t("fullName")}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder={t("email")}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder={t("password")}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            {page === "signup" && (
              <select
                name="language"
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Kannada</option>
              </select>
            )}

            {page === "signup" && form.role === "admin" && (
              <input
                type="password"
                name="admin_key"
                placeholder="Admin Secret Key"
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {page === "signup" ? t("createAccount") : t("continue")}
            </button>

          </form>

          {/* GOOGLE LOGIN */}
          <div className="mt-6 flex flex-col items-center gap-4">

            <GoogleLogin />

            <div className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={() => navigate("/admin-login")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              {t("adminLogin")}
            </button>

          </div>

          {/* SWITCH LINKS */}
          <div className="text-sm text-center text-gray-700 mt-6 space-y-2">

            {page !== "login" && (
              <p>
                {t("backTo")}{" "}
                <button
                  onClick={() => setPage("login")}
                  className="text-blue-600 font-semibold"
                >
                  {t("login")}
                </button>
              </p>
            )}

            {page === "login" && (
              <>
                <p>
                  {t("newUser")}{" "}
                  <button
                    onClick={() => setPage("signup")}
                    className="text-blue-600 font-semibold"
                  >
                    {t("signup")}
                  </button>
                </p>

                <p>
                  {t("alreadyRegistered")}{" "}
                  <button
                    onClick={() => setPage("login")}
                    className="text-blue-600 font-semibold"
                  >
                    {t("signIn")}
                  </button>
                </p>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}