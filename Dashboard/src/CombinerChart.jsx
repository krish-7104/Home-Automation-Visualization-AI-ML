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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CombinedChart = ({ labels, temperatureData, humidityData }) => {
  const data = {
    labels: labels, // Dates
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y-axis-temp",
      },
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        yAxisID: "y-axis-humidity",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    scales: {
      "y-axis-temp": {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      "y-axis-humidity": {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Humidity (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default CombinedChart;
