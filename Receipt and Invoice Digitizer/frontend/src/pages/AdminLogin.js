import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";





export default function AdminLogin() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

 

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await fetch("http://localhost:8000/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body:params
    });

    const data = await response.json();

    if(!response.ok){
      alert("Invalid credentials");
      return;
    }

    if(data.role !== "admin"){
      alert("You are not an admin");
      return;
    }

    localStorage.setItem("token",data.access_token);
    localStorage.setItem("role",data.role);

    navigate("/admin");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Admin Login
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Restricted access. Only administrators can continue.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to User Login
          </button>
        </div>

      </div>

    </div>
  );
}