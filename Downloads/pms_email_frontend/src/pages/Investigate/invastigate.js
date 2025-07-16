import { Card, Input, Popconfirm, Switch, Table, Tooltip } from "antd";

import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { postReq } from "../../api";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
const { Search } = Input;

const Investigator = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
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
  const [data, setData] = useState([]);
  const { admin } = useAuth();
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
      title: "Study Id",
      dataIndex: "studyId",
      key: "id",
      sorter: true,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Study Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
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
      dataIndex: "company.companyName", // for sorter to send correct sortField
      key: "companyName",
      sorter: true,
      render: (_, record) => <p>{record.company?.companyName}</p>,
    },
    {
      title: "Division Name",
      dataIndex: "division.divisionName", // for sorter to send correct sortField
      key: "companyName",
      sorter: true,
      render: (_, record) => <p>{record.division?.divisionName}</p>,
    },
    {
      title: "Type",
      dataIndex: "studyType",
      key: "studyType",
      render: (text) => <p>{text}</p>,
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
            <Tooltip title="View">
              <FaRegEye
                size={20}
                style={{ cursor: "pointer", color: "#8c8c8c" }}
                onClick={() => handleView(record)}
              />
            </Tooltip>
            <Popconfirm
              title={`Are you sure you want to mark as ${
                record.isActive ? "Inactive" : "Active"
              }?`}
              onConfirm={() => handleStatusChange(record)}
              okText="Yes"
              cancelText="No"
              disabled={admin.role == "ADMIN" ? false : true}
            >
              <Switch
                checked={record.isActive}
                disabled={admin.role == "ADMIN" ? false : true}
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleView = (record) => {
    console.log("record", record);
    if (record?.studyType == "Milestone") {
      history.push("/investigator-milestone-view", { record });
    } else {
      history.push("/investigator-view", { record });
    }
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
        total: response.data.totalDocs,
      },
    }));
    setLoading(false);
  };

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Investigator</span>
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
                  placeholder="search by studyId and Studytitle"
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

export default Investigator;
