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
import { format, parse } from "date-fns";
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";
import { useTheme } from "../context/ThemeContext";

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
  const { activeBusiness, transactions, getBusinessAnalytics } = useBusiness();
  const { theme } = useTheme();

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  const { data: analyticsData = [] } = getBusinessAnalytics();

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
  const labels = analyticsData.map((a) =>
    format(parse(a.month, "yyyy-MM", new Date()), "MMM yyyy")
  );
  const inData = analyticsData.map((a) => a.totalIn);
  const outData = analyticsData.map((a) => a.totalOut);

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
        labels: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: "Monthly Cash Flow",
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
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
        labels: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: "Overall Distribution",
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
    },
    cutout: "60%",
  };

  return (
    <div className="mx-auto p-4 pb-20 dark:bg-gray-900">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <h1 className="text-2xl font-bold dark:text-white mb-6">Analytics</h1>

        {/* Mobile Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-2 rounded-xl">
            <h3 className="text-[10px] text-green-800 dark:text-green-200">
              Total Income
            </h3>
            <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">
              ₹{totalIn.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-2 rounded-xl">
            <h3 className="text-[10px] text-red-800 dark:text-red-200">
              Total Expenses
            </h3>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5">
              ₹{totalOut.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-2 rounded-xl">
            <h3 className="text-[10px] text-purple-800 dark:text-purple-200">
              Net Balance
            </h3>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Mobile Chart Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCashFlowChartType("bar")}
            className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all ${
              cashFlowChartType === "bar"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setCashFlowChartType("line")}
            className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all ${
              cashFlowChartType === "line"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            Line Chart
          </button>
        </div>

        {/* Mobile Charts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            {cashFlowChartType === "bar" ? (
              <Bar options={chartOptions} data={barChartData} />
            ) : (
              <Line options={chartOptions} data={lineChartData} />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
          </div>
        </div>

        {/* Mobile Monthly Breakdown */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <h2 className="text-[14px] font-semibold p-3 dark:text-white border-b dark:border-gray-700">
            Monthly Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2 dark:text-gray-300">Month</th>
                  <th className="text-right p-2 dark:text-gray-300">In</th>
                  <th className="text-right p-2 dark:text-gray-300">Out</th>
                  <th className="text-right p-2 dark:text-gray-300">Balance</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((month) => (
                  <tr
                    key={month.month}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="p-2 dark:text-gray-300">
                      {format(
                        parse(month.month, "yyyy-MM", new Date()),
                        "MMM yy"
                      )}
                    </td>
                    <td className="p-2 text-right text-green-600 dark:text-green-400">
                      ₹{month.totalIn.toLocaleString()}
                    </td>
                    <td className="p-2 text-right text-red-600 dark:text-red-400">
                      ₹{month.totalOut.toLocaleString()}
                    </td>
                    <td
                      className={`p-2 text-right ${
                        month.balance >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ₹{Math.abs(month.balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Desktop Layout (unchanged) */}
      <div className="hidden md:block max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">
            Business Analytics Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCashFlowChartType("bar")}
              className={`px-6 py-2 rounded-full transition-all ${
                cashFlowChartType === "bar"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setCashFlowChartType("line")}
              className={`px-6 py-2 rounded-full transition-all ${
                cashFlowChartType === "line"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Line Chart
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-green-800 dark:text-green-200 font-medium">
                Total Income
              </h3>
              <span className="p-2 bg-green-200 dark:bg-green-700 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">
              ₹{totalIn.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-red-800 dark:text-red-200 font-medium">
                Total Expenses
              </h3>
              <span className="p-2 bg-red-200 dark:bg-red-700 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-700 dark:text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-4">
              ₹{totalOut.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-purple-800 dark:text-purple-200 font-medium">
                Net Balance
              </h3>
              <span className="p-2 bg-purple-200 dark:bg-purple-700 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-700 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-4">
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            {cashFlowChartType === "bar" ? (
              <Bar options={chartOptions} data={barChartData} />
            ) : (
              <Line options={chartOptions} data={lineChartData} />
            )}
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold dark:text-white mb-4">
            Monthly Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 dark:text-gray-300">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">
                    Income
                  </th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">
                    Expenses
                  </th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((month) => (
                  <tr
                    key={month.month}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="py-3 px-4 dark:text-gray-300">
                      {format(
                        parse(month.month, "yyyy-MM", new Date()),
                        "MMMM yyyy"
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                      ₹{month.totalIn.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                      ₹{month.totalOut.toLocaleString()}
                    </td>
                    <td
                      className={`text-right py-3 px-4 ${
                        month.balance >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ₹{Math.abs(month.balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
