import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6", "#a855f7"];

export default function VendorChart({ data: propData }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchVendors = async () => {

      try {

        if (propData && propData.length > 0) {
          setData(propData);
          return;
        }

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

  }, [propData]);

  // ✅ NEW: filter tiny values (prevents clutter)
  const filteredData = data.filter(item => item.value > 1);

  return (
    <div className="bg-white p-6 rounded shadow flex flex-col items-center">

      {filteredData.length === 0 ? (

        <div className="text-center text-gray-500">
          No vendor data available
        </div>

      ) : (

        <>
          <PieChart width={400} height={320}>

            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              labelLine={false}   // ✅ removes messy connector lines
              label={({ percent }) =>
                percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ""
              }   // ✅ only show % for bigger slices
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />  {/* ✅ legend shows full names cleanly */}

          </PieChart>

          <div className="mt-4 text-gray-700 font-medium">
            Total Vendors: {filteredData.length}
          </div>
        </>

      )}

    </div>
  );
}