import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

function BarChart() {
  const { Title } = Typography;

  const series = [
    {
      name: "Count",
      data: [44, 55, 13],
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
        position: 'top',
      },
       columnWidth: '40%',
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
      text: 'Investigators',
      style: {
        fontWeight: 600,
        fontSize: '14px',
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
      text: 'Counts',
      style: {
        fontWeight: 600,
        fontSize: '14px',
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
          <Title level={5}>Study: ST-001 / 1234567890</Title>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default BarChart;
