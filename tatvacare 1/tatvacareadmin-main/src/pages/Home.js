import {
  Card,
  Col,
  Row,
  Typography,
  Select,
  DatePicker,
  Tabs
} from "antd";
import moment from "moment";
import LineChart from "../components/chart/LineChart";
import PIChart from "../components/chart/PIChart";
import BarChart from "../components/chart/BarChart";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

function Home() {
  const { Title } = Typography;
  const data = JSON.parse(localStorage.getItem("Data"));
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
  const cart = [
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
        d="M10 2C7.79086 2 6 3.79086 6 6V7H5C4.49046 7 4.06239 7.38314 4.00612 7.88957L3.00612 16.8896C2.97471 17.1723 3.06518 17.455 3.25488 17.6669C3.44458 17.8789 3.71556 18 4 18H16C16.2844 18 16.5554 17.8789 16.7451 17.6669C16.9348 17.455 17.0253 17.1723 16.9939 16.8896L15.9939 7.88957C15.9376 7.38314 15.5096 7 15 7H14V6C14 3.79086 12.2091 2 10 2ZM12 7V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V7H12ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10ZM13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  let count = [];
  if (data?.role === "ADMIN") {
    count = [
        {
          title: "TOTAL CRM USERS",
          active: 120,
          inactive: 20,
          freeze: 10,
          icon: profile,
          bnb: "bnb2",
        },
        {
          title: "TOTAL CMT USERS",
          active: 120,
          inactive: 30,
          freeze: 10,
          icon: profile,
          bnb: "bnb2",
        },
        {
          title: "TOTAL DIVISIONS",
          count: 100,
          icon: heart,
          bnb: "redtext",
        },
        {
          title: "TOTAL STUDIES",
          count: 100,
          icon: heart,
          bnb: "redtext",
        },
      ];
  } else {
    count = [
      {
      title: "TOTAL DIVISION",
      count: 100,
      icon: heart,
      bnb: "redtext",
    },
    {
      title: "TOTAL STUDIES",
      count: 100,
      icon: heart,
      bnb: "redtext",
    },
    ]
  }

  const onTabChange = (key) => {
    console.log(key);
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
                allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                onChange={(value) => {
                  console.log("value", value);
                }}
              >
                <Option value="Demo">Demo</Option>
                <Option value="test">test</Option>
                <Option value="research">Research Scientists</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Select
                className="custom-select"
                placeholder="Select Division"
                allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                onChange={(value) => {
                  console.log("value", value);
                }}
              >
                <Option value="Demo">Demo</Option>
                <Option value="test">test</Option>
                <Option value="research">Research Scientists</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Select
                className="custom-select"
                placeholder="Select Study"
                allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                onChange={(value) => {
                  console.log("value", value);
                }}
              >
                <Option value="Demo">Demo</Option>
                <Option value="test">test</Option>
                <Option value="research">Research Scientists</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <RangePicker
                className="ant-range-picker"
                defaultValue={[moment().subtract(7, "days"), moment()]}
                format="YYYY-MM-DD"
                ranges={{
                  "Today": [moment(), moment()],
                  "Last 7 Days": [moment().subtract(6, "days"), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "Quarterly": [
                    moment().startOf("quarter"),
                    moment().endOf("quarter"),
                  ],
                  "Yearly": [moment().startOf("year"), moment().endOf("year")],
                  "Financial Year": [financialYearStart, financialYearEnd]
                }}
              />
            </Col>
          </Row>
        </Card>
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
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
                        {c?.active && c?.inactive
                          ? c.active + c.inactive
                          : c.count}{" "}
                      </Title>
                      <div className="d-flex justify-space-between mt-2">
                        {c.active && c.inactive && c?.freeze && (
                          <>
                            <div>
                              ACTIVE: <strong>{c.active}</strong>
                            </div>
                            <div>
                              INACTIVE: <strong>{c.inactive}</strong>
                            </div>
                            <div>
                              FREEZE: <strong>{c.freeze}</strong>
                            </div>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full pi-chart-card">
              <Tabs defaultActiveKey="1" tabPosition="top" onChange={onTabChange}>
                <TabPane tab="Pi Chart" key="1">
                    <PIChart />
                </TabPane>
                <TabPane tab="Bar Chart" key="2">
                  <BarChart />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>
        {/* <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Projects</Title>
                  <Paragraph className="lastweek">
                    done this month<span className="blue">40%</span>
                  </Paragraph>
                </div>
                <div className="ant-filtertabs">
                  <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">ALL</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                      <Radio.Button value="c">STORES</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr>
                      <th>COMPANIES</th>
                      <th>MEMBERS</th>
                      <th>BUDGET</th>
                      <th>COMPLETION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((d, index) => (
                      <tr key={index}>
                        <td>
                          <h6>
                            <img
                              src={d.img}
                              alt=""
                              className="avatar-sm mr-10"
                            />{" "}
                            {d.Title}
                          </h6>
                        </td>
                        <td>{d.member}</td>
                        <td>
                          <span className="text-xs font-weight-bold">
                            {d.bud}{" "}
                          </span>
                        </td>
                        <td>
                          <div className="percent-progress">{d.progress}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="uploadfile shadow-none">
                <Upload {...uploadProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    <span className="click">Click to Upload</span>
                  </Button>
                </Upload>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>Orders History</Title>
                <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                  this month <span className="bnb2">20%</span>
                </Paragraph>

                <Timeline
                  pending="Recording..."
                  className="timelinelist"
                  reverse={reverse}
                >
                  {timelineList.map((t, index) => (
                    <Timeline.Item color={t.color} key={index}>
                      <Title level={5}>{t.title}</Title>
                      <Text>{t.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <Button
                  type="primary"
                  className="width-100"
                  onClick={() => setReverse(!reverse)}
                >
                  {<MenuUnfoldOutlined />} REVERSE
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Row gutter>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={14}
                  className="mobile-24"
                >
                  <div className="h-full col-content p-20">
                    <div className="ant-muse">
                      <Text>Built by developers</Text>
                      <Title level={5}>""</Title>
                      <Paragraph className="lastweek mb-36">
                        From colors, cards, typography to complex elements, you
                        will find the full documentation.
                      </Paragraph>
                    </div>
                    <div className="card-footer">
                      <a className="icon-move-right" href="#pablo">
                        Read More
                        {<RightOutlined />}
                      </a>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={10}
                  className="col-img"
                >
                  <div className="ant-cret text-right">
                    <img src={card} alt="" className="border10" />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox card-info-2 h-full">
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Work with the best</Title>
                  <p>
                    Wealth creation is an evolutionarily recent positive-sum
                    game. It is all about who take the opportunity first.
                  </p>
                </div>
                <div className="card-footer">
                  <a className="icon-move-right" href="#pablo">
                    Read More
                    <RightOutlined />
                  </a>
                </div>
              </div>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Home;
