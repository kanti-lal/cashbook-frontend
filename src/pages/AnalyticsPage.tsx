import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { getAnalytics, getTransactions } from "../utils/storage";
import { format, parse } from "date-fns";
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = "bar" | "line";

export default function AnalyticsPage() {
  const [cashFlowChartType, setCashFlowChartType] = useState<ChartType>("bar");
  const { activeBusiness } = useBusiness();

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  const analytics = getAnalytics(activeBusiness.id);
  const transactions = getTransactions(activeBusiness.id);

  // Calculate totals
  const totalIn = transactions.reduce(
    (sum, t) => (t.type === "IN" ? sum + t.amount : sum),
    0
  );
  const totalOut = transactions.reduce(
    (sum, t) => (t.type === "OUT" ? sum + t.amount : sum),
    0
  );
  const balance = totalIn - totalOut;

  // Common data for both chart types
  const labels = analytics.map((a) =>
    format(parse(a.month, "yyyy-MM", new Date()), "MMM yyyy")
  );
  const inData = analytics.map((a) => a.totalIn);
  const outData = analytics.map((a) => a.totalOut);

  // Bar chart data
  const barChartData = {
    labels,
    datasets: [
      {
        label: "Money In",
        data: inData,
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Money Out",
        data: outData,
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  // Line chart data
  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Money In",
        data: inData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Money Out",
        data: outData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Cash Flow",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart data
  const doughnutChartData = {
    labels: ["Total Money In", "Total Money Out"],
    datasets: [
      {
        data: [totalIn, totalOut],
        backgroundColor: ["rgba(34, 197, 94, 0.5)", "rgba(239, 68, 68, 0.5)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Overall Distribution",
      },
    },
    cutout: "60%",
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-sm text-green-800 font-medium">Total In</h3>
          <p className="text-xl text-green-600 font-bold">₹{totalIn}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-sm text-red-800 font-medium">Total Out</h3>
          <p className="text-xl text-red-600 font-bold">₹{totalOut}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-sm text-purple-800 font-medium">Balance</h3>
          <p className="text-xl text-purple-600 font-bold">₹{balance}</p>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setCashFlowChartType("bar")}
            className={`px-4 py-2 rounded-md ${
              cashFlowChartType === "bar"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setCashFlowChartType("line")}
            className={`px-4 py-2 rounded-md ${
              cashFlowChartType === "line"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Line Chart
          </button>
        </div>

        {cashFlowChartType === "bar" ? (
          <Bar options={chartOptions} data={barChartData} />
        ) : (
          <Line options={chartOptions} data={lineChartData} />
        )}
      </div>

      {/* Doughnut Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
        {analytics.map((month) => (
          <div key={month.month} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">
              {format(parse(month.month, "yyyy-MM", new Date()), "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">In</p>
                <p className="text-green-600 font-medium">₹{month.totalIn}</p>
              </div>
              <div>
                <p className="text-gray-600">Out</p>
                <p className="text-red-600 font-medium">₹{month.totalOut}</p>
              </div>
              <div>
                <p className="text-gray-600">Balance</p>
                <p
                  className={`font-medium ${
                    month.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(month.balance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
