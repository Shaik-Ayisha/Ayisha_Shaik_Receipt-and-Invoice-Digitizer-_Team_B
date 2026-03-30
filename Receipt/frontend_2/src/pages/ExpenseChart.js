import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseChart({ invoices }) {

  const labels = invoices.map((item) =>
  item.uploaded_at ? item.uploaded_at.split("T")[0] : "Unknown"
);

const amounts = invoices.map((item) => {
  try {
    const fields =
      typeof item.extracted_fields === "string"
        ? JSON.parse(item.extracted_fields)
        : item.extracted_fields;

    return Number(fields?.total || 0);
  } catch {
    return 0;
  }
});

  const data = {
    labels,
    datasets: [
      {
        label: "Expense Trend",
        data: amounts,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Spending Analysis"
      }
    }
  };

  const description = (() => {
    if (amounts.length < 2) return "Upload more invoices to see spending trends.";

    const last = amounts[amounts.length - 1];
    const prev = amounts[amounts.length - 2];

    if (last > prev) return "Your latest expense is higher than the previous one.";
    if (last < prev) return "Your spending has decreased compared to the previous invoice.";
    return "Your spending remained consistent.";
  })();

  return (
    <div className="chart-card">
      <Line data={data} options={options} />

      <p style={{marginTop:"15px"}}>
        {description}
      </p>
    </div>
  );
}

export default ExpenseChart;