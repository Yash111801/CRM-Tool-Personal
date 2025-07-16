import { Card, Col, Row, Typography, Select, DatePicker, Tabs } from "antd";
import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import LineChart from "../components/chart/LineChart";
import PIChart from "../components/chart/PIChart";
import BarChart from "../components/chart/BarChart";
import { postReq, getReq } from "../api";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const profile = [
  <svg
    width="22"
    height="22"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
      fill="#fff"
    ></path>
    <path
      d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
      fill="#fff"
    ></path>
    <path
      d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
      fill="#fff"
    ></path>
    <path
      d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
      fill="#fff"
    ></path>
  </svg>,
];

const heart = [
  <svg
    width="22"
    height="22"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
      fill="#fff"
    ></path>
  </svg>,
];

function Home() {
  const { Title } = Typography;
  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [studies, setStudies] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [selectedDivisionName, setSelectedDivisionName] = useState(null);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [dashboardData, setDashboardData] = useState("");
  const [columnData, setColumnData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("Data"));

  // get companies list
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchDivisions(selectedCompanyId);
      setDivisions([]);
      setStudies([]);
      setSelectedDivisionId(null);
      setSelectedDivisionName(null);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedDivisionId) {
      fetchStudies(selectedDivisionId);
      setStudies([]); // clear studies while loading new ones
    }
  }, [selectedDivisionId]);

  const fetchCompanies = async () => {
    const response = await getReq("common/companies-list");
    if (response.status == 200 && response.data.length > 0) {
      setCompanies(response.data);
      setSelectedCompanyId(response.data[0]._id);
      setSelectedCompanyName(response.data[0].companyName);
    }
  };

  const fetchDivisions = async (companyId) => {
    const response = await postReq("common/division-list", {
      companyId: companyId,
    });
    if (response.status == 200 && response.data.length > 0) {
      setDivisions(response.data);
      setSelectedDivisionId(response.data[0]._id);
      setSelectedDivisionName(response.data[0].divisionName);
    }
  };

  const fetchStudies = async (divisionId) => {
    const response = await postReq("admin/study-by-division", {
      divisionId: divisionId,
    });
    if (response.status == 200 && response.data.length > 0) {
      setStudies(response.data);
      setSelectedStudyId(response.data[0]._id);
    }
  };

  useEffect(() => {
    if (selectedCompanyId && selectedDivisionId && selectedStudyId) {
      if (startDate && endDate) {
        fetchDashboardData(
          selectedCompanyId,
          selectedDivisionId,
          selectedStudyId,
          startDate,
          endDate
        );
      } else {
        fetchDashboardData(
          selectedCompanyId,
          selectedDivisionId,
          selectedStudyId
        );
      }
    }
  }, [
    selectedCompanyId,
    selectedDivisionId,
    selectedStudyId,
    startDate,
    endDate,
  ]);

  const fetchDashboardData = async (
    companyId,
    divisionId,
    studyId,
    startDate = null,
    endDate = null
  ) => {
    try {
      const selectedYear = moment().year();
      const payload = {
        companyId,
        divisionId,
        studyId,
        selectedYear,
      };
      if (startDate && endDate) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }
      const response = await postReq("admin/dashboard-analytics", payload);
      if (response.status === 200) {
        const data = response.data;
        let dynamicCounts = [];
        if (userData?.role === "ADMIN") {
          const userModules = ["CRM", "CMT"];
          userModules.forEach((module) => {
            if (data[module]) {
              dynamicCounts.push({
                title: `TOTAL ${module} USERS`,
                active: data[module].active || 0,
                inactive: data[module].inactive || 0,
                freeze: data[module].frozen || 0,
              });
            }
          });
          dynamicCounts.push(
            {
              title: `TOTAL DIVISIONS (in ${selectedCompanyName})`,
              count: data.divisions || 0,
              icon: heart,
            },
            {
              title: `TOTAL STUDIES (in ${selectedDivisionName})`,
              count: data.studies || 0,
              icon: heart,
            }
          );
        } else {
          dynamicCounts = [
            {
              title: `TOTAL DIVISIONS (in ${selectedCompanyName})`,
              count: data.divisions || 0,
              icon: heart,
            },
            {
              title: `TOTAL STUDIES (in ${selectedDivisionName})`,
              count: data.studies || 0,
              icon: heart,
            },
          ];
        }
        setColumnData(dynamicCounts);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch dashboard data:", error);
    }
  };

  const onTabChange = (key) => {
    console.log(key);
  };

  const handleDateChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const today = moment();
  const currentMonth = today.month();
  const financialYearStart =
    currentMonth >= 3
      ? moment().startOf("year").month(3).date(1)
      : moment().subtract(1, "year").startOf("year").month(3).date(1);
  const financialYearEnd =
    currentMonth >= 3
      ? moment().add(1, "year").startOf("year").month(2).endOf("month")
      : moment().startOf("year").month(2).endOf("month");

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

  return (
    <>
      <div className="layout-content mb-24">
        <Card
          bordered={false}
          className="criclebox h-full mb-24"
          title="Dashboard"
        >
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Select
                className="custom-select"
                placeholder="Select Company"
                // allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                value={selectedCompanyId}
                // onChange={(value) => setSelectedCompanyId(value)}
                onChange={(option) => {
                  setSelectedCompanyId(option.value);
                  setSelectedCompanyName(option.label); // Set label in state
                }}
                labelInValue
              >
                {companies.length > 0 &&
                  companies.map((data, i) => (
                    <Option key={i} value={data._id}>
                      {data.companyName}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Select
                className="custom-select"
                placeholder="Select Division"
                // allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                value={selectedDivisionId}
                onChange={(option) => {
                  setSelectedDivisionId(option.value);
                  setSelectedDivisionName(option.label); // Set label in state
                }}
                labelInValue
              >
                {divisions.length > 0 &&
                  divisions.map((data, i) => (
                    <Option key={i} value={data._id}>
                      {data.divisionName}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Select
                className="custom-select"
                placeholder="Select Study"
                // allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                value={selectedStudyId}
                onChange={(value) => setSelectedStudyId(value)}
              >
                {studies.length > 0 &&
                  studies.map((data, i) => (
                    <Option key={i} value={data._id}>
                      {data.title}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <RangePicker
                className="ant-range-picker"
                defaultValue={[
                  moment().startOf("month"),
                  moment().endOf("month"),
                ]}
                format="YYYY-MM-DD"
                // allowClear={false}
                onChange={handleDateChange}
                ranges={{
                  Today: [moment(), moment()],
                  "Last 7 Days": [moment().subtract(6, "days"), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  Quarterly: [
                    moment().startOf("quarter"),
                    moment().endOf("quarter"),
                  ],
                  Yearly: [moment().startOf("year"), moment().endOf("year")],
                  "Financial Year": [financialYearStart, financialYearEnd],
                }}
              />
            </Col>
          </Row>
        </Card>
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {columnData.map((c, index) => {
            return (
              <Col
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox h-full">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={24}>
                        <span>{c.title}</span>
                        <Title level={3}>
                          {c?.active != null && c?.inactive != null
                            ? c.active + c.inactive
                            : c.count}
                        </Title>
                        <div className="d-flex justify-space-between mt-2">
                          {c?.active != null &&
                            c?.inactive != null &&
                            c?.freeze != null && (
                              <>
                                <div>
                                  ACTIVE: <strong>{c?.active}</strong>
                                </div>
                                <div>
                                  INACTIVE: <strong>{c?.inactive}</strong>
                                </div>
                                <div>
                                  FREEZE: <strong>{c?.freeze}</strong>
                                </div>
                              </>
                            )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full pi-chart-card">
              <Tabs
                defaultActiveKey="1"
                tabPosition="top"
                onChange={onTabChange}
              >
                <TabPane tab="Pi Chart" key="1">
                  <PIChart data={dashboardData} selectedStudy={selectedStudy} />
                </TabPane>
                <TabPane tab="Bar Chart" key="2">
                  <BarChart
                    data={dashboardData}
                    selectedStudy={selectedStudy}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart data={dashboardData} selectedStudy={selectedStudy} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
