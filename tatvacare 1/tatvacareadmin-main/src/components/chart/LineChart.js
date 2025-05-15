import ReactApexChart from "react-apexcharts";
import { Typography, DatePicker } from "antd";
import lineChart from "./configs/lineChart";

function LineChart() {
  const { Title } = Typography;
  const onChange = () => {  
    console.log("hiiii");
  }

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Study: ST-001 / 1234567890</Title>
        </div>
        <DatePicker onChange={onChange} picker="year" />
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
