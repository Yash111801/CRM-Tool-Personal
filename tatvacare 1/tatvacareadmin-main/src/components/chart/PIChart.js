import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

function PIChart() {
  const { Title } = Typography;
  const series = [44, 55, 13];
  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Completed", "Ready to Create", "Discrepancy"],
    legend: {
      formatter: function (seriesName, opts) {
        const count = series[opts.seriesIndex];
        return `<span>${seriesName} (<b>${count}</b>)</span>`;
      }
    },
    dataLabels: {
    formatter: function (val, opts) {
        return series[opts.seriesIndex]; // Show count
      },
    },
    colors: ["#00E396", "#008FFB", "#FF0000"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <>
      <div className="linechart">
        <div className="mb-4">
          <Title level={5}>Study: ST-001 / 1234567890</Title>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default PIChart;
