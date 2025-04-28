import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Line Chart Data & Options
const lineChartLabels = [
  "يناير",
  "فراير",
  "مارس",
  "ابريل",
  "مايو",
  "يونيو",
  "يوليو",
];

const lineChartData = {
  labels: lineChartLabels,
  datasets: [
    {
      label: "المبيعات",
      data: [6, 59, 20, 81, 30, 55, 40],
      fill: false,
      borderColor: "rgb(0, 203, 218)",
      tension: 0,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "نظرة عامة للمبيعات",
      align: "start",
      padding: {
        top: 10,
        bottom: 30,
      },
      color: "rgb(0, 0, 0)",
      font: {
        size: 25,
        weight: "700",
      },
    },
  },
};

// Pie Chart Data & Options
const pieChartData = {
  labels: ["موصلات", "اسلاك", "ادوات", "شرائح"],
  datasets: [
    {
      label: "Shared",
      data: [300, 500, 100, 200],
      backgroundColor: [
        "rgb(0, 203, 218)",
        "rgb(255, 99, 132)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
      ],
      borderWidth: 1,
    },
  ],
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "الفئات",
      align: "start",
      padding: {
        top: 10,
        bottom: 20,
      },
      color: "#333",
      font: {
        size: 20,
        weight: "700",
      },
    },
  },
};

export default function GraphsInsights() {
  return (
    <div className="grid grid-cols-8 gap-5">
      <div className="col-span-8 lg:col-span-5 h-[400px] p-10 px-15 border border-gray-200 rounded-xl shadow-xl">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
      <div className="col-span-8 lg:col-span-3 h-[400px] p-5 border border-gray-200 rounded-xl shadow-xl">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
}
