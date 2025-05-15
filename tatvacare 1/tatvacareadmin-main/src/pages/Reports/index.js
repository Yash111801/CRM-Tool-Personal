import {
  Card,
  Col,
  Row,
  Typography,
  Select,
  DatePicker,
  Button,
  Table,
  message
} from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { FileExcelOutlined } from "@ant-design/icons";
const { Option } = Select;
const { RangePicker } = DatePicker;

function Reports() {
  const { Title } = Typography;
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
  const columns = [
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
    },
    {
      title: "PAN_No",
      dataIndex: "PAN_No",
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "Patient_No",
      dataIndex: "Patient_No",
      width: "50px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "doctor_code",
      dataIndex: "Doctor_Code",
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "SAP_Vendor_Code",
      dataIndex: "SAP_Vendor_Code",
      width: "200px",
      onCell: (record) => ({
        style: { width: "200px", minWidth: "200px", maxWidth: "200px" },
      }),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
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
      editable: true,
    },
  ];
  const data = [
    {
      Doctor_Name: "Dr. Ayaan Sharma",
      Email_ID: "ayaan.sharma@example.com",
      User_ID: "USR1001",
      Password: "p@ssW0rd1",
      Mobile_No: "9876543210",
      PAN_No: "ABCDE1234F",
      Patient_No: "PAT1001",
      Doctor_Code: "DOC2001",
      SAP_Vendor_Code: "SAP3001",
      Amount: "45800.50",
      address: "123 Health St, Mumbai",
      Pincode: "400001",
      region: "Maharashtra",
    },
    {
      Doctor_Name: "Dr. Meera Iyer",
      Email_ID: "meera.iyer@example.com",
      User_ID: "USR1002",
      Password: "m33Ra@123",
      Mobile_No: "9812345678",
      PAN_No: "XYZAB6789G",
      Patient_No: "PAT1002",
      Doctor_Code: "DOC2002",
      SAP_Vendor_Code: "SAP3002",
      Amount: "61200.00",
      address: "45 Wellness Rd, Pune",
      Pincode: "411001",
      region: "Maharashtra",
    },
    {
      Doctor_Name: "Dr. Rohit Verma",
      Email_ID: "rohit.verma@example.com",
      User_ID: "USR1003",
      Password: "Rohit#2023",
      Mobile_No: "9898989898",
      PAN_No: "LMNOP3456Z",
      Patient_No: "PAT1003",
      Doctor_Code: "DOC2003",
      SAP_Vendor_Code: "SAP3003",
      Amount: "78950.75",
      address: "78 Care Blvd, Delhi",
      Pincode: "110001",
      region: "Delhi",
    },
    {
      Doctor_Name: "Dr. Sneha Patel",
      Email_ID: "sneha.patel@example.com",
      User_ID: "USR1004",
      Password: "Sn3Ha456",
      Mobile_No: "9845612378",
      PAN_No: "PQRST1234A",
      Patient_No: "PAT1004",
      Doctor_Code: "DOC2004",
      SAP_Vendor_Code: "SAP3004",
      Amount: "90500.00",
      address: "99 Healing Way, Ahmedabad",
      Pincode: "380001",
      region: "Gujarat",
    },
    {
      Doctor_Name: "Dr. Karan Singh",
      Email_ID: "karan.singh@example.com",
      User_ID: "USR1005",
      Password: "Kar@n321",
      Mobile_No: "9823456789",
      PAN_No: "MNOPQ6789T",
      Patient_No: "PAT1005",
      Doctor_Code: "DOC2005",
      SAP_Vendor_Code: "SAP3005",
      Amount: "50300.00",
      address: "17 Doc Plaza, Jaipur",
      Pincode: "302001",
      region: "Rajasthan",
    },
    {
      Doctor_Name: "Dr. Anjali Rao",
      Email_ID: "anjali.rao@example.com",
      User_ID: "USR1006",
      Password: "AnJali!2024",
      Mobile_No: "9876543211",
      PAN_No: "ASDFG2345K",
      Patient_No: "PAT1006",
      Doctor_Code: "DOC2006",
      SAP_Vendor_Code: "SAP3006",
      Amount: "62000.00",
      address: "22 Medic Circle, Chennai",
      Pincode: "600001",
      region: "Tamil Nadu",
    },
    {
      Doctor_Name: "Dr. Nikhil Mehta",
      Email_ID: "nikhil.mehta@example.com",
      User_ID: "USR1007",
      Password: "NiKh!l888",
      Mobile_No: "9811112233",
      PAN_No: "ZXCVB6789M",
      Patient_No: "PAT1007",
      Doctor_Code: "DOC2007",
      SAP_Vendor_Code: "SAP3007",
      Amount: "45600.00",
      address: "55 Doctor's Enclave, Bhopal",
      Pincode: "462001",
      region: "Madhya Pradesh",
    },
    {
      Doctor_Name: "Dr. Riya Kapoor",
      Email_ID: "riya.kapoor@example.com",
      User_ID: "USR1008",
      Password: "Riya@456",
      Mobile_No: "9865432198",
      PAN_No: "GHJKL2345L",
      Patient_No: "PAT1008",
      Doctor_Code: "DOC2008",
      SAP_Vendor_Code: "SAP3008",
      Amount: "78200.00",
      address: "34 Health Lane, Hyderabad",
      Pincode: "500001",
      region: "Telangana",
    },
    {
      Doctor_Name: "Dr. Arjun Desai",
      Email_ID: "arjun.desai@example.com",
      User_ID: "USR1009",
      Password: "Des@iArj9",
      Mobile_No: "9832178901",
      PAN_No: "TYUIO0987K",
      Patient_No: "PAT1009",
      Doctor_Code: "DOC2009",
      SAP_Vendor_Code: "SAP3009",
      Amount: "68700.00",
      address: "66 Doctor Marg, Surat",
      Pincode: "395001",
      region: "Gujarat",
    },
    {
      Doctor_Name: "Dr. Priya Jain",
      Email_ID: "priya.jain@example.com",
      User_ID: "USR1010",
      Password: "Priya@321",
      Mobile_No: "9845678912",
      PAN_No: "QWERT1234V",
      Patient_No: "PAT1010",
      Doctor_Code: "DOC2010",
      SAP_Vendor_Code: "SAP3010",
      Amount: "51900.00",
      address: "44 Life Ave, Bengaluru",
      Pincode: "560001",
      region: "Karnataka",
    },
  ];

  const handleExcel = () => {
     if (data.length === 0) {
      message.warning("No data to export.");
      return;
    }

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

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
  }

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
              <Select
                className="custom-select"
                placeholder="Select Status"
                allowClear
                style={{ width: "100%" }}
                maxTagCount="responsive"
                onChange={(value) => {
                  console.log("value", value);
                }}
              >
                <Option value="completed">Completed</Option>
                <Option value="readytocreate">Ready to Create</Option>
                <Option value="discrepancy">Discrepancy</Option>
              </Select>
            </Col>
          </Row>
          <Row className="rowgap-vbox mt-15" gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <RangePicker
                className="ant-range-picker"
                defaultValue={[moment().subtract(7, "days"), moment()]}
                format="YYYY-MM-DD"
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
            <Button type="primary" size="small">
              Generate Report
            </Button>
          </Row>
        </Card>
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="d-flex margin-b10">
            <Button type="button" onClick={handleExcel}>
              <FileExcelOutlined />
              Download CSV
            </Button>
          </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            bordered
            columns={columns}
            dataSource={data}
            scroll={{ x: "max-content" }}
          />
        </Col>
        </Row>
      </div>
    </>
  );
}

export default Reports;
