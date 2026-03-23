import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6", "#a855f7"];

export default function VendorChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchVendors = async () => {

      try {

        const res = await axios.get(
          "http://127.0.0.1:8000/invoice/vendors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setData(res.data);

      } catch (err) {
        console.error("Failed to load vendor data", err);
      }

    };

    fetchVendors();

  }, []);

  return (
    <div className="bg-white p-6 rounded shadow flex flex-col items-center">

      {data.length === 0 ? (

        <div className="text-center text-gray-500">
          No vendor data available
        </div>

      ) : (

        <>
          {/* Chart */}
          <PieChart width={400} height={320}>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, value }) => `${name}: $${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            {/* 🔥 Added Legend */}
            <Legend />

          </PieChart>

          {/* 🔥 Total Display */}
          <div className="mt-4 text-gray-700 font-medium">
            Total Vendors: {data.length}
          </div>
        </>

      )}

    </div>
  );
}