import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

type Props = {
  data: number[];
};

const Graph: React.FC<Props> = ({ data }) => {
  const labels = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }).reverse();

  const chartData = {
    labels,
    datasets: [
      {
        data,
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.4)", // Bootstrap primary color
        borderColor: "rgba(13, 110, 253, 1)", // Bootstrap primary color
        borderWidth: 2,
        pointBackgroundColor: "rgba(13, 110, 253, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(13, 110, 253, 1)",
        tension: 0.25,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Graph;
