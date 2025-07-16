import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Select,
  DatePicker,
  Button,
  Table,
  message,
  Spin,
} from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { FileExcelOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getReq, postReq } from "../../api";
const { Option } = Select;
const { RangePicker } = DatePicker;

function Reports() {
  const { Title } = Typography;
  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [studies, setStudies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment().endOf("month"));
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchDivisions(selectedCompanyId);
      setDivisions([]);
      setStudies([]);
      setSelectedDivisionId(null);
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
    }
  };

  const fetchDivisions = async (companyId) => {
    const response = await postReq("common/division-list", {
      companyId: companyId,
    });
    if (response.status == 200 && response.data.length > 0) {
      setDivisions(response.data);
    }
  };

  const fetchStudies = async (divisionId) => {
    const response = await postReq("admin/study-by-division", {
      divisionId: divisionId,
    });
    if (response.status == 200 && response.data.length > 0) {
      setStudies(response.data);
    }
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
  const baseColumns = [
    {
      title: "Doctor_Name",
      dataIndex: "Doctor_Name",
      width: "200px",
      onCell: (record) => ({
        style: { width: "200px", minWidth: "200px", maxWidth: "200px" },
      }),
    },
    {
      title: "Email_ID",
      dataIndex: "Email_ID",
    },
    {
      title: "User_ID",
      dataIndex: "User_ID",
    },
    {
      title: "Password",
      dataIndex: "Password",
    },
    {
      title: "Mobile_No",
      dataIndex: "Mobile_No",
      width: "200px",
    },
    {
      title: "PAN_No",
      dataIndex: "PAN_No",
      width: "200px",
    },
    {
      title: "doctor_code",
      dataIndex: "Doctor_Code",
    },
    {
      title: "SAP_Vendor_Code",
      dataIndex: "SAP_Vendor_Code",
    },
    {
      title: "Patient_No",
      dataIndex: "Patient_No",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
    },
    {
      title: "Address",
      dataIndex: "address",
      className: "t-fix-col",
    },
    {
      title: "Pincode",
      dataIndex: "Pincode",
    },
    {
      title: "region",
      dataIndex: "region",
    },
  ];

  function getDynamicColumns(data) {
    const firstItem = data?.[0];

    if (
      firstItem?.studyType === "Milestone" &&
      Array.isArray(firstItem?.milestoneData)
    ) {
      const milestoneColumns = firstItem.milestoneData.map((_, index) => ({
        title: `Milestone ${index + 1}`,
        children: [
          {
            title: "No. of patients",
            dataIndex: `milestone_${index + 1}_patients`,
            render: (_, record) =>
              record.milestoneData?.[index]?.numberOfPatients ?? "-",
          },
          {
            title: "Honorarium (₹)",
            dataIndex: `milestone_${index + 1}_honorarium`,
            render: (_, record) =>
              record.milestoneData?.[index]?.honorariumAmount ?? "-",
          },
        ],
      }));

      return [...baseColumns, ...milestoneColumns];
    }

    return baseColumns;
  }


  const generateReport = async () => {
    if (selectedStudyId) {
      const payload = {
        studyId: selectedStudyId,
      };
      if (selectedStatus) {
        payload.status = selectedStatus;
      }
      if (startDate && endDate) {
        payload.startDate = moment(startDate).format("DD/MM/YYYY");
        payload.endDate = moment(endDate).format("DD/MM/YYYY");
      }
      setLoading(true);
      const response = await postReq("admin/generate-report", payload);
      if (response.status == 200) {
        setReportData(response.data);
        const dynamicCols = getDynamicColumns(response.data);
        setColumns(dynamicCols);
        setLoading(false);
        setShowReport(true);
      }
    } else {
      toast.error("Please select study");
    }
  };

  const handleExcel = () => {
    if (reportData.length === 0) {
      message.warning("No data to export.");
      return;
    }
    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(reportData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Processed Data");

    // Write workbook to binary array
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const fileName = `${new Date().toISOString().split("T")[0]}.xlsx`;
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, fileName);
  };
  return (
    <>
      <div className="layout-content mb-24">
        <Card
          bordered={false}
          className="criclebox h-full mb-24"
          title="Reports"
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
                onChange={(value) => setSelectedCompanyId(value)}
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
                onChange={(value) => setSelectedDivisionId(value)}
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
              <Select
                className="custom-select"
                placeholder="Select Status"
                allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                onChange={(value) => setSelectedStatus(value)}
              >
                <Option value="completed">Completed</Option>
                <Option value="readyToCreate">Ready to Create</Option>
                <Option value="discrimination">Discrepancy</Option>
              </Select>
            </Col>
          </Row>
          <Row className="rowgap-vbox mt-15" gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <RangePicker
                className="ant-range-picker"
                defaultValue={[
                  moment().startOf("month"),
                  moment().endOf("month"),
                ]}
                format="YYYY-MM-DD"
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
            <Button type="primary" size="small" onClick={generateReport} loading={loading}>
              Generate Report
            </Button>
          </Row>
        </Card>
        {loading ? (
          <Spin />
        ) : showReport ? (
          reportData && reportData.length > 0 ? (
            <Row className="rowgap-vbox" gutter={[24, 0]}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="d-flex margin-b10"
              >
                <Button type="button" onClick={handleExcel}>
                  <FileExcelOutlined />
                  Download CSV
                </Button>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                  bordered
                  columns={columns}
                  dataSource={reportData}
                  scroll={{ x: "max-content" }}
                />
              </Col>
            </Row>
          ) : (
            <div>No records found</div>
          )
        ) : null}
      </div>
    </>
  );
}

export default Reports;
