import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";



export default function RevenueChart() {


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");

  const [data, setData] = useState([]);

useEffect(() => {

  const fetchRevenue = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/invoice/revenue",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setData(res.data);

    } catch (err) {
      console.error("Failed to load revenue data", err);
    }

  };

  fetchRevenue();

}, []);

  const handleFromDate = (value) => {
    setFromDate(value);

    if (toDate && new Date(value) > new Date(toDate)) {
      setError("From date cannot be greater than To date.");
    } else {
      setError("");
    }
  };

  const handleToDate = (value) => {
    setToDate(value);

    if (fromDate && new Date(fromDate) > new Date(value)) {
      setError("From date cannot be greater than To date.");
    } else {
      setError("");
    }
  };

  let filteredData = data;

  if (fromDate || toDate) {

    let start = fromDate;
    let end = toDate;

    if (start && end && new Date(start) > new Date(end)) {
      [start, end] = [end, start];
    }

    filteredData = data.filter((item) => {
    const itemDate = new Date();

      if (start && itemDate < new Date(start)) return false;
      if (end && itemDate > new Date(end)) return false;

      return true;
    });
  }

  return (
    <div className="bg-white p-6 rounded shadow">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold">
          Revenue Trend
        </h2>

        <div className="flex gap-2 items-center">

          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleFromDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />

          <span className="text-gray-500 text-sm">to</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => handleToDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />

        </div>

      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      {!error && (
        <LineChart width={700} height={300} data={filteredData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
          />

        </LineChart>
      )}

    </div>
  );
}