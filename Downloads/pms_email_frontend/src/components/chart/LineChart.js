import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { Typography, DatePicker } from "antd";
import { postReq } from "../../api";
import { useEffect, useState } from "react";

const monthsOrder = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function LineChart({ data, selectedStudy }) {
  const { Title } = Typography;
  const currentYear = moment().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(data?.columnChartData);
  const [series, setSeries] = useState([]);
  const [hasData, setHasData] = useState(false);

  const fetchChartData = async (studyId, selectedYear) => {
    const response = await postReq("admin/dashboard-column-chart-year", {
      studyId,
      selectedYear,
    });
    if (response.status == 200) {
      setChartData(response.data);
    }
  };

  useEffect(() => {
  if (data?.columnChartData) {
    setChartData({ ...data.columnChartData });
  }
}, [data]);

  useEffect(() => {
    const completedData = [];
    const readyToCreateData = [];
    const discrepancyData = [];
    monthsOrder.forEach((month) => {
      const monthData = chartData?.[month] || {};
      completedData.push(monthData.completed || 0);
      readyToCreateData.push(monthData.readyToCreate || 0);
      discrepancyData.push(monthData.discrimination || 0);
    });
    const isAllZero = [
      ...completedData,
      ...readyToCreateData,
      ...discrepancyData,
    ].every((val) => val === 0);
    setHasData(!isAllZero); // Now true means "has data"

    setSeries([
      { name: "Completed", data: completedData },
      { name: "Ready to Create", data: readyToCreateData },
      { name: "Discrepancy", data: discrepancyData },
    ]);
  }, [chartData]);

  useEffect(() => {
    fetchChartData(selectedStudy?._id, selectedYear);
  }, [selectedYear]);

  const onChange = (date, dateString) => {
    if (date) {
      const year = date.year(); // using dayjs API
      setSelectedYear(year);
    } else {
      console.log("Date cleared");
    }
  };

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#00E396", "#008FFB", "#FF0000"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: monthLabels,
      title: {
        text: selectedYear,
        style: {
          fontWeight: 600,
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          fontWeight: 600,
          fontSize: "14px",
          colors: Array(12).fill("#8c8c8c"),
        },
      },
    },
    yaxis: {
      title: {
        text: "No. Of Investigator",
        style: {
          fontWeight: 600,
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          fontWeight: 600,
          fontSize: "14px",
          colors: ["#8c8c8c"],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    legend: { show: false },
  };

  console.log("series", series);
  return (
    <>
      <div className="linechart">
        <div>
          {selectedStudy?.studyId && <Title level={5}>
            Study: {selectedStudy?.studyId} / {selectedStudy?.title}
          </Title>}
        </div>
        <DatePicker
          onChange={onChange}
          defaultValue={moment(`${currentYear}`, "YYYY")}
          picker="year"
          allowClear={false}
        />
      </div>
      <div>
        {hasData ? (
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No Data Available
          </p>
        )}
      </div>
    </>
  );
}

export default LineChart;
