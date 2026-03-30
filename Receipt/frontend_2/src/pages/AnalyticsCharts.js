import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useSettings } from "../context/SettingsContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Helper to safely parse extracted fields
const parseFields = (item) => {
  try {
    return typeof item.extracted_fields === "string"
      ? JSON.parse(item.extracted_fields)
      : item.extracted_fields || {};
  } catch {
    return {};
  }
};

// --- Category Spending Analysis ---
export function CategoryChart({ invoices }) {
  const { data, insight } = useMemo(() => {
    if (!invoices || invoices.length === 0) return { data: null, insight: "Not enough data." };

    const getCategory = (vendor) => {
      const v = (vendor || "").toLowerCase();
      if (v.match(/uber|lyft|taxi|transit|airline|flight|rail/)) return "Transport";
      if (v.match(/amazon|flipkart|walmart|target|store|mall|mart/)) return "Shopping";
      if (v.match(/food|restaurant|cafe|coffee|baker|pizza|burger|swiggy|zomato/)) return "Food & Dining";
      if (v.match(/hotel|motel|resort|airbnb/)) return "Accommodation";
      if (v.match(/hospital|pharmacy|health|clinic|doctor|medical/)) return "Healthcare";
      if (v.match(/gas|shell|chevron|fuel|petrol/)) return "Fuel";
      return "Other";
    };

    const categoryTotals = {};
    let grandTotal = 0;

    invoices.forEach(item => {
      const fields = parseFields(item);
      const amount = Number(fields.total) || 0;
      const category = getCategory(fields.vendor);
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      grandTotal += amount;
    });

    const labels = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (amounts.length === 0 || grandTotal === 0) return { data: null, insight: "No spending data available." };

    let maxCategory = labels[0];
    let maxAmount = amounts[0];
    labels.forEach((cat, idx) => {
      if (amounts[idx] > maxAmount) {
        maxAmount = amounts[idx];
        maxCategory = cat;
      }
    });

    const percentage = ((maxAmount / grandTotal) * 100).toFixed(1);
    const generatedInsight = `Most spending occurs in the ${maxCategory} category which accounts for ${percentage}% of total expenses.`;

    const chartData = {
      labels,
      datasets: [
        {
          label: "Spending by Category",
          data: amounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)"
          ],
          borderWidth: 1,
        }
      ]
    };

    return { data: chartData, insight: generatedInsight };
  }, [invoices]);

  const options = {
    responsive: true,
    plugins: { legend: { position: "right" }, title: { display: true, text: "Category Spending Data" } }
  };

  return (
    <div className="chart-card">
      <h3>Category Spending Analysis</h3>
      {data ? <Pie data={data} options={options} /> : <p>No data available</p>}
      <div className="insight-box">
        <strong>Insight:</strong> {insight}
      </div>
    </div>
  );
}

// --- Merchant Spending Distribution ---
export function MerchantChart({ invoices }) {
  const { data, insight } = useMemo(() => {
    if (!invoices || invoices.length === 0) return { data: null, insight: "Not enough data." };

    const merchantTotals = {};
    invoices.forEach(item => {
      const fields = parseFields(item);
      const amount = Number(fields.total) || 0;
      let vendor = fields.vendor || "Unknown Merchant";
      if (vendor.length > 20) vendor = vendor.substring(0, 20) + "..."; // truncate long names
      merchantTotals[vendor] = (merchantTotals[vendor] || 0) + amount;
    });

    const sortedMerchants = Object.entries(merchantTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5

    if (sortedMerchants.length === 0 || sortedMerchants[0][1] === 0) return { data: null, insight: "No valid merchant data." };

    const labels = sortedMerchants.map(m => m[0]);
    const amounts = sortedMerchants.map(m => m[1]);

    const generatedInsight = `The highest purchases are from ${labels[0]} indicating frequent transactions or high-value spending.`;

    const chartData = {
      labels,
      datasets: [
        {
          label: "Total Spent",
          data: amounts,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        }
      ]
    };

    return { data: chartData, insight: generatedInsight };
  }, [invoices]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } }
  };

  return (
    <div className="chart-card">
      <h3>Top 5 Merchants</h3>
      {data ? <Bar data={data} options={options} /> : <p>No data available</p>}
      <div className="insight-box">
        <strong>Insight:</strong> {insight}
      </div>
    </div>
  );
}

// --- Weekly Expense Pattern ---
export function WeeklyChart({ invoices }) {
  const { data, insight } = useMemo(() => {
    if (!invoices || invoices.length === 0) return { data: null, insight: "Not enough data." };

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayTotals = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    const dayCounts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };

    invoices.forEach(item => {
      if (item.uploaded_at) {
        const date = new Date(item.uploaded_at);
        const dayName = days[date.getDay()];
        const fields = parseFields(item);
        const amount = Number(fields.total) || 0;

        dayTotals[dayName] += amount;
        dayCounts[dayName] += 1;
      }
    });

    // Calculate averages instead of just totals, or we can just show totals. The prompt says "average spending by day of the week".
    const amounts = days.map(d => dayCounts[d] > 0 ? (dayTotals[d] / dayCounts[d]) : 0);

    let maxDay = "Unknown";
    let maxAmount = -1;
    days.forEach((d, i) => {
      if (amounts[i] > maxAmount) {
        maxAmount = amounts[i];
        maxDay = d;
      }
    });

    if (maxAmount === 0 || maxAmount === -1) return { data: null, insight: "No weekly data available." };

    const generatedInsight = `You tend to spend the most on average on ${maxDay}s.`;

    const chartData = {
      labels: days,
      datasets: [
        {
          label: "Avg Spending",
          data: amounts,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
          tension: 0.4
        }
      ]
    };

    return { data: chartData, insight: generatedInsight };
  }, [invoices]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div className="chart-card">
      <h3>Weekly Expense Pattern</h3>
      {data ? <Line data={data} options={options} /> : <p>No data available</p>}
      <div className="insight-box">
        <strong>Average Day:</strong> {insight}
      </div>
    </div>
  );
}

// --- Spending Anomaly Detection ---
export function AnomalyChart({ invoices }) {
  const { formatCurrency } = useSettings();
  const { data, insight } = useMemo(() => {
    if (!invoices || invoices.length < 3) return { data: null, insight: "Need at least 3 transactions to detect anomalies." };

    const transactions = invoices.map(item => {
      const fields = parseFields(item);
      return {
        date: item.uploaded_at ? item.uploaded_at.split("T")[0] : "Unknown",
        amount: Number(fields.total) || 0
      };
    }).filter(t => t.amount > 0);

    if (transactions.length === 0) return { data: null, insight: "No spending data available." };

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const mean = totalSpent / transactions.length;
    const threshold = mean * 1.5; // 1.5x the average is considered an anomaly

    const labels = transactions.map(t => t.date);
    const amounts = transactions.map(t => t.amount);

    let anomalyDetected = false;
    let anomalyDate = "";

    const colors = amounts.map((amt, idx) => {
      if (amt > threshold) {
        if (!anomalyDetected) {
          anomalyDetected = true;
          anomalyDate = labels[idx];
        }
        return "rgba(255, 99, 132, 0.8)"; // Red for anomaly
      }
      return "rgba(75, 192, 192, 0.6)"; // Normal color
    });

    const generatedInsight = anomalyDetected
      ? `A spike in spending was detected on ${anomalyDate} compared to the normal average of ${formatCurrency(mean)}.`
      : `No significant spending anomalies detected. Your spending is relatively stable. (Average: ${formatCurrency(mean)})`;

    const chartData = {
      labels,
      datasets: [
        {
          label: "Transaction Amount",
          data: amounts,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace("0.6", "1").replace("0.8", "1")),
          borderWidth: 1,
        }
      ]
    };

    return { data: chartData, insight: generatedInsight };
  }, [invoices]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div className="chart-card">
      <h3>Spending Anomaly Detection</h3>
      {data ? <Bar data={data} options={options} /> : <p>No data available</p>}
      <div className="insight-box">
        <strong>Analysis:</strong> {insight}
      </div>
    </div>
  );
}

// --- Monthly Spending Comparison ---
export function MonthlyChart({ invoices }) {
  const { data, insight } = useMemo(() => {
    if (!invoices || invoices.length === 0) return { data: null, insight: "Not enough data." };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = {};

    invoices.forEach(item => {
      if (item.uploaded_at) {
        const date = new Date(item.uploaded_at);
        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
        const fields = parseFields(item);
        const amount = Number(fields.total) || 0;
        monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + amount;
      }
    });

    const sortedKeys = Object.keys(monthlyTotals).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    if (sortedKeys.length === 0) return { data: null, insight: "No monthly data available." };

    const labels = sortedKeys;
    const amounts = labels.map(k => monthlyTotals[k]);

    let generatedInsight = "Upload expenses from multiple months to see a comparison.";

    if (amounts.length >= 2) {
      const last = amounts[amounts.length - 1];
      const prev = amounts[amounts.length - 2];
      const lastMonth = labels[labels.length - 1];

      if (last > prev) {
        generatedInsight = `Spending increased in ${lastMonth} compared to the previous month.`;
      } else if (last < prev) {
        generatedInsight = `Spending decreased in ${lastMonth} compared to the previous month. Great job!`;
      } else {
        generatedInsight = `Spending in ${lastMonth} was about the same as the previous month.`;
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: "Monthly Spending",
          data: amounts,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        }
      ]
    };

    return { data: chartData, insight: generatedInsight };
  }, [invoices]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div className="chart-card">
      <h3>Monthly Spending Comparison</h3>
      {data ? <Bar data={data} options={options} /> : <p>No data available</p>}
      <div className="insight-box">
        <strong>Insight:</strong> {insight}
      </div>
    </div>
  );
}
