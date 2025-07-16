import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

function BarChart({ data, selectedStudy }) {
  const { Title } = Typography;
  const chartData = data?.chartData || [];
  const completed = chartData[0]?.completed || 0;
  const readyToCreate = chartData[0]?.readyToCreate || 0;
  const discrepancy = chartData[0]?.discrimination || 0;
  const tempSeries = [completed, readyToCreate, discrepancy];
  const hasData = tempSeries.some((value) => value > 0);
  const series = [
    {
      name: "Count",
      data: [0, 425,20],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true,
        dataLabels: {
          position: "top",
        },
        columnWidth: "40%",
      },
    },
    colors: ["#00E396", "#008FFB", "#FF0000"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: ["Completed", "Ready to Create", "Discrepancy"],
      labels: {
        style: {
          fontWeight: 600,
        },
      },
      title: {
        text: "Investigators",
        style: {
          fontWeight: 600,
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: 600,
        },
      },
      title: {
        text: "Counts",
        style: {
          fontWeight: 600,
          fontSize: "14px",
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };
  
  return (
    <>
      <div className="linechart">
        <div className="mb-4">
          {selectedStudy?.studyId && <Title level={5}>Study: {selectedStudy?.studyId} / {selectedStudy?.title}</Title>}
        </div>
      </div>
      {hasData ? (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
          width="100%"
        />
      ) : (
        <div>
          <p>No Data Available</p>
        </div>
    )}
    </>
  );
}

export default BarChart;
