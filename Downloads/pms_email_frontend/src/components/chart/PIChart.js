import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

function PIChart({ data, selectedStudy }) {
  const chartData = data?.chartData || [];
  const { Title } = Typography;
  const completed = chartData[0]?.completed || 0;
  const readyToCreate = chartData[0]?.readyToCreate || 0;
  const discrepancy = chartData[0]?.discrimination || 0;
  const series = [completed, readyToCreate, discrepancy];
  const hasData = series.some((value) => value > 0);
  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Created", "Ready to Create", "Discrepancy"],
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
      <div>
        <div className="mb-4">
          {selectedStudy?.studyId && <Title level={5}>Study: {selectedStudy?.studyId} / {selectedStudy?.title}</Title>}
        </div>

        {hasData ? (
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={350}
            width="100%"
          />
        ) : (
          <div>
            <p>No Data Available</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PIChart;
