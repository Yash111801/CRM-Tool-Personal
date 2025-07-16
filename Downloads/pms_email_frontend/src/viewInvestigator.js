import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Tabs,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Completed from "./completed";
import { postReq } from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import Logs from "./logs";
const { Title, Text, Link } = Typography;

const ViewInvestigator = () => {
  const location = useLocation();
  const { record } = location.state || {};
  const [newUserFile, setNewUserFile] = useState(null);
  const [edsUserFile, setEdsUserFile] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const { admin } = useAuth();
  const history = useHistory();

  const handleNewUserUpload = (info) => {
    if (info.file.status !== "removed") {
      setNewUserFile(info.file);
    }
  };

  const handleEdsUserUpload = (info) => {
    if (info.file.status !== "removed") {
      setEdsUserFile(info.file);
    }
  };

  const removeNewUserFile = () => setNewUserFile(null);
  const removeEdsUserFile = () => setEdsUserFile(null);

  const handleClick = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", newUserFile);

    const response = await postReq(
      `admin/study/${record._id}/upload`,
      formData
    );
    setUploadId(response.data.id);
    setLoading(false);
    setNewUserFile(null);
  };

  const handleClickEds = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", edsUserFile);

    const response = await postReq(
      `admin/study/${record._id}/upload`,
      formData
    );
    setUploadId(response.data.id);
    setLoading(false);
    setEdsUserFile(null);
  };

  const fetchProcessData = async () => {
    const response = await postReq(
      `admin/study/${record._id}/process-study-data`,
      { id: record._id }
    );
    if (response.status == 200) {
      setProcessData(response.data);
      if (uploadId) {
        setActiveTabKey("2");
      }
    }
  };

  const beforeUpload = (file) => {
    const isAllowedType =
      file.name.toLowerCase().endsWith(".csv") ||
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");
    if (!isAllowedType) {
      message.error("Only CSV or Excel (.xls, .xlsx) files are allowed!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  useEffect(() => {
    fetchProcessData();
  }, [uploadId, record]);

  const handleBack = () => {
    history.push("/investigator");
  };

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: "10px",
            }}
          >
            <svg
              width="12"
              height="19"
              viewBox="0 0 12 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => handleBack()}
              style={{ cursor: "pointer" }}
            >
              <path
                d="M10.5 2L3 9.5L10.5 17"
                stroke="#13487d"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <span>Investigator View</span>
          </div>
        }
        bordered={false}
        style={{ borderRadius: "18px", maxWidth: "100%", overflow: "hidden" }}
      >
        <div>
          <Row gutter={24}>
            <Col xs={24} sm={24} style={{ marginBottom: "10px" }}>
              <Space size="small">
                <Text strong>Title: </Text>
                <Text type="secondary">{record?.title}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="small">
                <Text strong>Study ID: </Text>
                <Text type="secondary"> {record?.studyId}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="small">
                <Text strong>Drug Name: </Text>
                <Text type="secondary"> {record?.drugName}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="small">
                <Text strong>Company Name: </Text>
                <Text type="secondary"> {record?.company.companyName}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={12} style={{ marginBottom: "10px" }}>
              <Space size="small">
                <Text strong>Division Name: </Text>
                <Text type="secondary"> {record?.division.divisionName}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={24} style={{ marginBottom: "6px" }}>
              <Text strong>Access User: </Text>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="small">
                <Text strong>CRM User: </Text>
                <Space direction="horizontal" size="small">
                  {record?.users?.map((user, index) =>
                    user.role == "CRM" ? (
                      <Text key={index} type="secondary">
                        {user.name}
                      </Text>
                    ) : null
                  )}
                </Space>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="small">
                <Text strong>CMT User: </Text>
                <Space direction="horizontal" size="small">
                  {record?.users?.map((user, index) =>
                    user.role == "CMT" ? (
                      <Text key={index} type="secondary">
                        {user.name}
                      </Text>
                    ) : null
                  )}
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Tabs
            // defaultActiveKey="1"
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            items={[
              {
                label: "Dashboard ",
                key: "1",
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <div className="data-tab">
                        <Space size="small">
                          <Text type="secondary">Completed:</Text>
                          <Text strong>
                            {processData?.completed.length || 0}
                          </Text>
                        </Space>
                      </div>
                      <div className="data-tab">
                        <Space size="small">
                          <Text type="secondary">Ready to Create:</Text>
                          <Text strong>
                            {processData?.readyToCreate.length || 0}
                          </Text>
                        </Space>
                      </div>
                      <div className="data-tab">
                        <Space size="small">
                          <Text type="secondary">Discrepancy:</Text>
                          <Text strong>
                            {processData?.discrimination.length || 0}
                          </Text>
                        </Space>
                      </div>
                    </div>
                    <div>
                      <Row gutter={24} style={{ marginTop: "20px" }}>
                        {/* Left side - Upload New User */}
                        <Col xs={24} sm={12}>
                          <div
                            style={{
                              padding: 16,
                              border: "1px solid #f0f0f0",
                              borderRadius: 8,
                              opacity: admin.role !== "CMT" ? 1 : 0.3,
                              pointerEvents:
                                admin.role !== "CMT" ? null : "none",
                            }}
                          >
                            <Title level={5}>For Upload New User</Title>

                            <Upload
                              beforeUpload={beforeUpload}
                              onChange={handleNewUserUpload}
                              showUploadList={false}
                              accept=".csv, .xlsx, .xls"
                            >
                              <Button icon={<UploadOutlined />}>
                                Upload CSV File
                              </Button>
                            </Upload>

                            {/* Step-2 */}
                            {newUserFile && (
                              <div style={{ marginTop: 24 }}>
                                <Space direction="vertical" size="small">
                                  <Space>
                                    <Text>{newUserFile.name}</Text>
                                    <Text type="secondary">
                                      ({(newUserFile.size / 1024).toFixed(2)}{" "}
                                      KB)
                                    </Text>
                                    <Button
                                      type="link"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={removeNewUserFile}
                                    >
                                      Remove File
                                    </Button>
                                  </Space>

                                  <Button
                                    type="primary"
                                    onClick={handleClick}
                                    loading={loading}
                                  >
                                    Click here to process data
                                  </Button>
                                </Space>
                              </div>
                            )}

                            {/* Instruction */}
                            <div style={{ marginTop: 16 }}>
                              <Text type="secondary">
                                Upload a CSV file to create study. Please
                                download the sample to ensure correct format.
                              </Text>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <a
                                href="/sample.xlsx"
                                download
                                style={{ color: "#1890ff" }}
                              >
                                <DownloadOutlined /> Download Sample CSV File
                              </a>
                            </div>
                          </div>
                        </Col>

                        {/* Right side - Upload EDS User Credentials Data */}
                        <Col xs={24} sm={12}>
                          <div
                            style={{
                              padding: 16,
                              border: "1px solid #f0f0f0",
                              borderRadius: 8,
                              opacity: admin.role == "ADMIN" ? 1 : 0.3,
                              pointerEvents:
                                admin.role == "ADMIN" ? null : "none",
                            }}
                          >
                            <Title level={5}>
                              For Upload EDS User Credentials Data
                            </Title>

                            <Upload
                              beforeUpload={beforeUpload}
                              onChange={handleEdsUserUpload}
                              showUploadList={false}
                              accept=".csv, .xlsx, .xls"
                            >
                              <Button
                                icon={<UploadOutlined />}
                                // disabled={!isAdmin}
                              >
                                Upload CSV File
                              </Button>
                            </Upload>

                            {/* Step-2 */}
                            {edsUserFile && (
                              <div style={{ marginTop: 24 }}>
                                <Space direction="vertical" size="small">
                                  <Space>
                                    <Text>{edsUserFile.name}</Text>
                                    <Text type="secondary">
                                      ({(edsUserFile.size / 1024).toFixed(2)}{" "}
                                      KB)
                                    </Text>
                                    <Button
                                      type="link"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={removeEdsUserFile}
                                    >
                                      Remove File
                                    </Button>
                                  </Space>

                                  <Button
                                    type="primary"
                                    loading={loading}
                                    onClick={handleClickEds}
                                  >
                                    Click here to process data
                                  </Button>
                                </Space>
                              </div>
                            )}

                            {/* Instruction */}
                            <div style={{ marginTop: 16 }}>
                              <Text type="secondary">
                                Upload a CSV file to create study. Please
                                download the sample to ensure correct format.
                              </Text>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <a
                                href="/sample.xlsx"
                                download
                                style={{ color: "#1890ff" }}
                              >
                                <DownloadOutlined /> Download Sample CSV File
                              </a>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ),
              },
              {
                label: "Completed",
                key: "2",
                children: (
                  <div>
                    <Completed
                      id={uploadId}
                      recordId={record._id}
                      status={"completed"}
                      refresh={fetchProcessData}
                      tabActive={activeTabKey === "2"}
                    />
                  </div>
                ),
              },
              {
                label: "Ready to Create",
                key: "3",
                children: (
                  <div>
                    <Completed
                      id={uploadId}
                      recordId={record._id}
                      status={"readyToCreate"}
                      refresh={fetchProcessData}
                      tabActive={activeTabKey === "3"}
                    />
                  </div>
                ),
              },
              {
                label: "Discrepancy ",
                key: "4",
                children: (
                  <div>
                    <Completed
                      id={uploadId}
                      recordId={record._id}
                      status={"discrimination"}
                      refresh={fetchProcessData}
                      tabActive={activeTabKey === "4"}
                    />
                  </div>
                ),
              },
              {
                label: "User Logs",
                key: "5",
                children: (
                  <div>
                    <Logs studyId={record._id} />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </>
  );
};

export default ViewInvestigator;
