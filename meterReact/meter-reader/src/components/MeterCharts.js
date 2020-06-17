import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const MeterChars = (props) => {
  const [chartData, setChartData] = useState({});

  const chart = () => {
    let metric = props.metric;
    let timeData = [];
    let mData = [];
    let varhData = [];
    let whData = [];

    for (const objData of props.data) {
      timeData.push(objData.ReadinDataTimeUTC);
      varhData.push(objData.VARH);
      whData.push(objData.WH);
    }

    if (props.metric === "VARH") {
      mData = varhData;
    } else {
      mData = whData;
    }

    setChartData({
      labels: mData,
      datasets: [
        {
          label: metric,
          data: timeData,
          backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          borderWidth: 4,
        },
      ],
    });
  };

  useEffect(() => {
    chart();
  }, []);

  return (
    <div className="App">
      <div>
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: props.metric, display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default MeterChars;
