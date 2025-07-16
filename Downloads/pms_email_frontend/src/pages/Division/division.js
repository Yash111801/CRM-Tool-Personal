import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
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
import { FaEdit } from "react-icons/fa";
import moment from "moment";
const { Search } = Input;
const { Option } = Select;

const Division = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedField, setSelectedField] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const [comapnyList, setCompanyList] = useState([]);
  const [data, setData] = useState([]);
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
  const [searchTimeout, setSearchTimeout] = useState(null);
  const fetchCompanies = async () => {
    const response = await getReq("common/companies-list");
    if (response.status == 200) {
      setCompanyList(response.data);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  const columns = [
    {
      title: "Sr.",
      key: "Sr.",
      render: (_text, _record, index) => (
        <span>
          {tableParams.pagination.current * tableParams.pagination.pageSize -
            tableParams.pagination.pageSize +
            index +
            1}
        </span>
      ),
    },
    {
      title: "Division Name",
      dataIndex: "divisionName",
      key: "name",
      sorter: true,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Company Name",
      dataIndex: "company.companyName", // for sorter to send correct sortField
      key: "companyName",
      sorter: true,
      render: (_, record) => <p>{record.company?.companyName}</p>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (text) => <p>{moment(text).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "Action",
      key: "action",
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
    const response = await postReq("admin/create-division", {
      ...values,
    });
    if (response.status == 200) {
      form.resetFields();
      setAddModal(false);
      fetchData();
      toast.success("division added successfully");
    } else {
      toast.error("error adding division, try again!!");
    }
  };
  const handleUpdate = async (values) => {
    if (values.password == "") {
      delete values.password;
    }
    const response = await postReq(
      `admin/update-division/${selectedField._id}`,
      {
        ...values,
      }
    );
    if (response.status == 200) {
      setSelectedField({});
      setUpdateModal(false);
      fetchData();
      toast.success("division update successfully");
    } else {
      toast.error("error updating division, try again!!");
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
  };

  useEffect(() => {
    if (Object.keys(selectedField).length > 0) {
      form.setFieldsValue({
        divisionName: selectedField.divisionName,
        company: selectedField.company._id,
      });
    }
  }, [selectedField]);

  const handleUpdateModal = (data) => {
    setSelectedField(data);
    setUpdateModal(true);
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
    const response = await postReq(
      `admin/update-division-status/${record._id}`,
      {
        isActive: !record.isActive,
      }
    );
    if (response.status == 200) {
      toast.success(
        `status changed to ${record.isActive ? "inactive" : "active"}`
      );
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    tableParams.search,
  ]);

  const fetchData = async () => {
    setLoading(true);

    const { current, pageSize } = tableParams.pagination;
    const { sortField, sortOrder, search } = tableParams;

    const response = await postReq("admin/divisions", {
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
        total: response.data.totalDocs,
      },
    }));
    setLoading(false);
  };
  return (
    <>
      <Modal
        title="Add Division"
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
            <Button type="primary" onClick={() => form.submit()}>
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
                label="Division Name"
                name="divisionName"
                rules={[
                  { required: true, message: "Please enter comany name" },
                ]}
                autoComplete="off"
              >
                <Input maxLength={40} placeholder="Enter" />
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
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
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
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Update Division"
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
            <Button type="primary" onClick={() => form.submit()}>
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
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Division Name"
                name="divisionName"
                rules={[
                  { required: true, message: "Please enter Division name" },
                ]}
              >
                <Input maxLength={40} placeholder="Enter" />
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
                  style={{ width: "100%" }}
                  maxTagCount="responsive"
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
            <span>Division</span>
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
                  placeholder="search by name"
                  // allowClear
                  onChange={(e) => {
                    const value = e.target.value;

                    if (searchTimeout) clearTimeout(searchTimeout); // clear old timeout

                    const timeout = setTimeout(() => {
                      onSearch(value); // your search function
                    }, 500); // delay in ms

                    setSearchTimeout(timeout); // save timeout ID
                  }}
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
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30", "50"],
            }}
            onChange={handleTableChange}
            rowClassName={(record) => (record.isActive ? "" : "inactive-row")}
          />
        </div>
      </Card>
    </>
  );
};

export default Division;
