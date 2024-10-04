import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formateDate } from "./dateFromatter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HumidityChart = ({ labels, humidityData, type }) => {
  const formattedLabels = labels.map((label) => {
    return formateDate(label);
  });

  const chartData = {
    labels: type === "simple" ? labels : formattedLabels,
    datasets: [
      {
        label: "Humidity",
        data: humidityData,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Time",
        },
      },
      y: {
        title: {
          display: false,
          text: "Humidity (%)",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HumidityChart;
