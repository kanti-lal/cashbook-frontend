import React, { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
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
import { format, parse } from "date-fns";

// Register Chart.js components
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

const EnhancedAnalyticsCharts = ({ transactions = [], analyticsData = [] }) => {
  const [activeView, setActiveView] = useState("overview");

  // Calculations
  const totalIn = transactions.reduce(
    (sum: any, t: any) => (t.type === "IN" ? sum + t.amount : sum),
    0
  );
  const totalOut: any = transactions.reduce(
    (sum: any, t: any) => (t.type === "OUT" ? sum + t.amount : sum),
    0
  );
  const balance = totalIn - totalOut;

  // Prepare chart data
  const labels = analyticsData.map((a: any) =>
    format(parse(a.month, "yyyy-MM", new Date()), "MMM yyyy")
  );
  const inData = analyticsData.map((a: any) => a.totalIn);
  const outData = analyticsData.map((a: any) => a.totalOut);

  // Gradient color generators
  const createGradient = (ctx: any, color1: any, color2: any) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Money In",
        data: inData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
        borderRadius: 10,
      },
      {
        label: "Money Out",
        data: outData,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Money In",
        data: inData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Money Out",
        data: outData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Money In", "Money Out"],
    datasets: [
      {
        data: [totalIn, totalOut],
        backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(239, 68, 68, 0.7)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-xl space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalIn.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-sm text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ₹{totalOut.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500">Net Balance</h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{Math.abs(balance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-center space-x-4 mb-4">
          {["bar", "line", "doughnut"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveView(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
                ${
                  activeView === type
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-100"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} View
            </button>
          ))}
        </div>

        <div className="h-[300px]">
          {activeView === "bar" && (
            <Bar data={barChartData} options={chartOptions} />
          )}
          {activeView === "line" && (
            <Line data={lineChartData} options={chartOptions} />
          )}
          {activeView === "doughnut" && (
            <Doughnut
              data={doughnutChartData}
              options={{ ...chartOptions, cutout: "70%" }}
            />
          )}
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Monthly Breakdown
        </h2>
        {analyticsData.map((month: any) => (
          <div key={month.month} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-600 mb-2">
              {format(parse(month.month, "yyyy-MM", new Date()), "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-500">Income</p>
                <p className="text-green-600 font-bold">
                  ₹{month.totalIn.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expenses</p>
                <p className="text-red-600 font-bold">
                  ₹{month.totalOut.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p
                  className={`font-bold ${
                    month.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(month.balance).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedAnalyticsCharts;
