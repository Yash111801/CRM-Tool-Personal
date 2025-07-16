import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
} from "antd";

import React, { useEffect, useState } from "react";
import { getReq, postReq } from "../../api";
import { toast } from "react-toastify";
import moment from "moment";
import { FaEdit, FaUserCheck } from "react-icons/fa";
const { Search } = Input;
const { Option } = Select;

const Study = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedField, setSelectedField] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    sortField: null,
    sortOrder: null,
    search: "",
  });
  const [comapnyList, setCompanyList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [studyUser, setStudyUser] = useState([]);
  const [originalUser, setOriginalUser] = useState({});
  const [data, setData] = useState([]);
  const [changesUser, setChangesUser] = useState([]);

  const fetchUser = async () => {
    const response = await getReq("common/user-list");
    if (response.status == 200) {
      setUserList(response.data);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchStudyUser = async () => {
    const response = await postReq("admin/usersby-study", {
      studyId: selectedField?._id,
    });
    setStudyUser(response.data);
    setOriginalUser(response.data);
  };
  useEffect(() => {
    fetchStudyUser();
  }, [selectedField]);
  const fetchCompanies = async () => {
    const response = await getReq("common/companies-list");
    if (response.status == 200) {
      setCompanyList(response.data);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchDivisions = async (value) => {
    const response = await postReq("common/division-list", {
      companyId: value,
    });
    if (response.status == 200) {
      setDivisionList(response.data);
    }
  };
  const columns = [
    {
      title: "Sr.",
      key: "Sr.",
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Study ID",
      dataIndex: "studyId",
      key: "id",
      sorter: true,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Study Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <p style={{ cursor: "pointer" }}>
          {text.length > 30 ? (
            <Tooltip title={text}> {text.slice(0, 25) + "..."} </Tooltip>
          ) : (
            text
          )}
        </p>
      ),
    },

    {
      title: "Drug Name",
      dataIndex: "drugName",
      key: "drug",
      sorter: true,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Company Name",
      dataIndex: ["company", "companyName"],
      key: "company",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Division Name",
      dataIndex: ["division", "divisionName"],
      key: "division",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Protocol No.",
      dataIndex: "protocolNo",
      key: "protocol",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Type",
      dataIndex: "studyType",
      key: "studyType",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Users",
      dataIndex: "userCount",
      key: "count",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <p>{moment(text).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      className: "z-index-high",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: "20px",
            }}
          >
            <Tooltip title="Edit">
              <FaEdit
                size={20}
                style={{ cursor: "pointer", color: "#8c8c8c" }}
                onClick={() => handleUpdateModal(record)}
              />
            </Tooltip>
            <Tooltip title="Unfreeze user">
              <FaUserCheck
                size={20}
                style={{ cursor: "pointer", color: "#8c8c8c" }}
                onClick={() => handleUserModal(record)}
              />
            </Tooltip>
            <Tooltip title="Active/Inactive">
              <Popconfirm
                title={`Are you sure you want to mark as ${
                  record.isActive ? "Inactive" : "Active"
                }?`}
                onConfirm={() => handleStatusChange(record)}
                okText="Yes"
                cancelText="No"
              >
                <Switch checked={record.isActive} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleSubmit = async (values) => {
    const selectedIds = values.users;

    const selectedUser = selectedIds.map((id) => {
      const user = userList.find((item) => item._id === id);
      return {
        _id: user._id,
        role: user.role,
      };
    });
    const response = await postReq("admin/create-study", {
      ...values,
      users: selectedUser,
    });
    if (response.status == 200) {
      form.resetFields();
      setAddModal(false);
      fetchStudy();
      toast.success("study added successfully");
    } else {
      toast.error("error adding study, try again!!");
    }
  };
  const handleUpdate = async (values) => {
    const selectedIds = values.users;

    const selectedUser = selectedIds.map((id) => {
      const user = userList.find((item) => item._id === id);
      return {
        _id: user._id,
        role: user.role,
      };
    });
    const response = await postReq(`admin/update-study/${selectedField._id}`, {
      ...values,
      users: selectedUser,
    });
    if (response.status == 200) {
      setSelectedField({});
      form.resetFields();
      setUpdateModal(false);
      fetchStudy();
      toast.success("study update successfully");
    } else {
      toast.error("error updating study, try again!!");
    }
  };
  const handleClear = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    handleClear();
    setSelectedField({});
    setAddModal(false);
    setUpdateModal(false);
    setUserModal(false);
  };

  useEffect(() => {
    if (Object.keys(selectedField).length > 0) {
      fetchDivisions(selectedField.company._id);
      form.setFieldsValue({
        title: selectedField.title,
        studyId: selectedField.studyId,
        userCount: selectedField.userCount,
        drugName: selectedField.drugName,
        company: selectedField.company._id,
        division: selectedField.division._id,
        users: selectedField.users.map((user) => user._id),
        protocolNo: selectedField?.protocolNo,
        studyType: selectedField?.studyType,
      });
    }
  }, [selectedField, userList]);

  const handleUpdateModal = (data) => {
    setSelectedField(data);
    setUpdateModal(true);
  };
  const handleUserModal = (data) => {
    setSelectedField(data);
    setUserModal(true);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const onSearch = (e) => {
    setTableParams((prev) => ({
      ...prev,
      search: e,
      pagination: { ...prev.pagination, current: 1 },
    }));
  };

  const handleStatusChange = async (record) => {
    const response = await postReq(`admin/update-user-status/${record._id}`, {
      isActive: !record.isActive,
    });
    if (response.status == 200) {
      toast.success(
        `status changed to ${!record.isActive ? "inactive" : "active"}`
      );
      fetchStudy();
    }
  };

  useEffect(() => {
    fetchStudy();
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    tableParams.search,
  ]);
  const fetchStudy = async () => {
    setLoading(true);

    const { current, pageSize } = tableParams.pagination;
    const { sortField, sortOrder, search } = tableParams;

    const response = await postReq("admin/studies", {
      page: current,
      limit: pageSize,
      sortField,
      sortOrder: sortOrder === "ascend" ? 1 : -1,
      search: search,
    });
    setData(response.data.docs);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total: response.data.total,
      },
    }));
    setLoading(false);
  };

  const handleCheck = (user) => {
    const updatedUsers = studyUser.map((u) => {
      if (u._id === user._id) {
        return { ...u, isFrozen: !u.isFrozen };
      }
      return u;
    });
    setStudyUser(updatedUsers);
    const changedUsers = updatedUsers.filter(
      (u, i) => u.isFrozen !== originalUser[i].isFrozen
    );
    setChangesUser(changedUsers);
  };

  const handleUser = async () => {
    setLoading(true);
    const response = await postReq(
      `admin/study/${selectedField._id}/users/freeze`,
      { users: changesUser }
    );
    if (response.status == 200) {
      toast.success(response?.message || "error");
      setUserModal(false);
      fetchStudy();
      setSelectedField({});
      setChangesUser([]);
    } else {
      toast.error(response.message || "error");
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Add Study"
        open={addModal}
        onCancel={handleCancel}
        footer={
          <div style={{ paddingTop: "10px" }}>
            <Button
              type="default"
              onClick={handleClear}
              style={{ marginRight: 8 }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </div>
        }
        width="70%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 10 }}
        responsive={true}
        className="responsive-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ padding: "10px" }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Study Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter study title" },
                ]}
                autoComplete="off"
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Study Id"
                name="studyId"
                rules={[{ required: true, message: "Please enter study id" }]}
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Drug Name"
                name="drugName"
                rules={[{ required: true, message: "Please enter drug name" }]}
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Company"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Please select company name",
                  },
                ]}
              >
                <Select
                  placeholder="Select Company"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  onChange={(value) => {
                    form.setFieldsValue({
                      company: value,
                      division: undefined,
                    });
                    if (value) {
                      fetchDivisions(value);
                    }
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  // clear division also if company changes
                >
                  {comapnyList.length > 0 &&
                    comapnyList.map((data, i) => (
                      <Option key={i} value={data._id}>
                        {data.companyName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Division"
                name="division"
                rules={[
                  {
                    required: true,
                    message: "Please select division name",
                  },
                ]}
              >
                <Select
                  placeholder="Select Division"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {divisionList.length > 0 &&
                    divisionList.map((data, i) => (
                      <Option key={i} value={data._id}>
                        {data.divisionName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Users"
                name="users"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value.length < 1) {
                        return Promise.reject(
                          new Error("At least one user is required")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Users"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {userList.length > 0 &&
                    userList.map((data, i) => (
                      <Option key={i} value={data._id}>
                        {data.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Protocol No."
                name="protocolNo"
                rules={[
                  { required: true, message: "Please enter protocol no." },
                ]}
                autoComplete="off"
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select study type"
                name="studyType"
                rules={[
                  { required: true, message: "Please select study type." },
                ]}
                autoComplete="off"
              >
                <Select placeholder="Study type" style={{ width: "100%" }}>
                  [
                  <Option key={1} value={"Normal"}>
                    Normal
                  </Option>
                  ,
                  <Option key={2} value={"Milestone"}>
                    Milestone
                  </Option>
                  ]
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Update Study"
        open={updateModal}
        onCancel={handleCancel}
        footer={
          <div style={{ paddingTop: "10px" }}>
            <Button
              type="default"
              onClick={handleClear}
              style={{ marginRight: 8 }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Update
            </Button>
          </div>
        }
        width="70%" // Full width on moblepx
        style={{ top: 20 }}
        bodyStyle={{ padding: 10 }}
        responsive={true}
        className="responsive-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          style={{ padding: "10px" }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Study Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter study title" },
                ]}
                autoComplete="off"
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Study Id"
                name="studyId"
                rules={[{ required: true, message: "Please enter study id" }]}
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Drug Name"
                name="drugName"
                rules={[{ required: true, message: "Please enter drug name" }]}
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Company"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Please select company name",
                  },
                ]}
              >
                <Select
                  placeholder="Select Company"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  onChange={(value) => {
                    form.setFieldsValue({
                      company: value,
                      division: undefined,
                    });
                    if (value) {
                      fetchDivisions(value);
                    }
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {comapnyList.length > 0 &&
                    comapnyList.map((data, i) => (
                      <Option key={i} value={data._id}>
                        {data.companyName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Division"
                name="division"
                rules={[
                  {
                    required: true,
                    message: "Please select division name",
                  },
                ]}
              >
                <Select
                  placeholder="Select Division"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {divisionList.length > 0 &&
                    divisionList.map((data, i) => (
                      <Option key={i} value={data._id}>
                        {data.divisionName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Selected Users"
                name="users"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value.length < 1) {
                        return Promise.reject(
                          new Error("At least one user is required")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Users"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
                  optionLabelProp="label"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {userList.length > 0 &&
                    userList.map((data, i) => {
                      return (
                        <Option key={i} value={data._id} label={data.name}>
                          {data.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Protocol No."
                name="protocolNo"
                rules={[
                  { required: true, message: "Please enter protocol no." },
                ]}
                autoComplete="off"
              >
                <Input placeholder="Enter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select study type"
                name="studyType"
                rules={[
                  { required: true, message: "Please select study type." },
                ]}
                autoComplete="off"
              >
                <Select placeholder="Study type" style={{ width: "100%" }}>
                  [
                  <Option key={1} value={"Normal"}>
                    Normal
                  </Option>
                  ,
                  <Option key={2} value={"Milestone"}>
                    Milestone
                  </Option>
                  ]
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Freeze/Unfreeze User"
        open={userModal}
        onCancel={handleCancel}
        footer={
          <div style={{ paddingTop: "10px" }}>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </div>
        }
        width="70%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 10 }}
        responsive={true}
        className="responsive-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUser}
          style={{ padding: "10px" }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    CMT users:
                  </div>
                }
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {studyUser.map((permission, i) => {
                    if (permission.role == "CMT") {
                      return (
                        <Checkbox
                          key={i}
                          checked={permission?.isFrozen}
                          onChange={() => handleCheck(permission)}
                          style={{ fontWeight: 500, marginLeft: "8px" }}
                        >
                          {permission.name}
                        </Checkbox>
                      );
                    }
                  })}
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    CRM users:
                  </div>
                }
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {studyUser.map((permission, i) => {
                    if (permission.role == "CRM") {
                      return (
                        <Checkbox
                          key={i}
                          checked={permission?.isFrozen}
                          onChange={() => handleCheck(permission)}
                          style={{ fontWeight: 500, marginLeft: "8px" }}
                        >
                          {permission.name}
                        </Checkbox>
                      );
                    }
                  })}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Study</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div>
                <Search
                  placeholder="input search text"
                  // allowClear
                  onSearch={onSearch}
                  enterButton
                />
              </div>
              <div className="addDiv" onClick={() => setAddModal(true)}>
                <PlusCircleOutlined /> Add
              </div>
            </div>
          </div>
        }
        bordered={false}
        style={{ borderRadius: "18px", maxWidth: "100%", overflow: "hidden" }}
      >
        <div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: "max-content" }}
            pagination={{
              current: tableParams.pagination.current,
              pageSize: tableParams.pagination.pageSize,
              total: tableParams.pagination.total,
            }}
            onChange={handleTableChange}
            rowClassName={(record) => (record.isActive ? "" : "inactive-row")}
          />
        </div>
      </Card>
    </>
  );
};

export default Study;
