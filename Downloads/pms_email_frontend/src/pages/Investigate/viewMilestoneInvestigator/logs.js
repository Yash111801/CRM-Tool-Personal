import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { postReq } from "../../../api";

const Logs = ({ studyId }) => {
  const tableParams = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    sortField: null,
    sortOrder: null,
    search: "",
  };
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await postReq(`admin/logs/${studyId}`, {
      search: "",
      page: tableParams.pagination.page,
      limit: tableParams.pagination.pageSize,
    });
    setData(response.data.docs);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Type",
      dataIndex: "action",
      key: "action",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Doctor Name",
      dataIndex: ["recordId", "Doctor_Name"],
      key: "changein",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Role",
      dataIndex: ["performedBy", "role"],
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Performed By",
      dataIndex: ["performedBy", "name"],
      key: "performedBy",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => <p>{moment(text).format("DD/MM/YYYY HH:mm")}</p>,
    },
  ];
  return (
    <div>
      <Table bordered dataSource={data} columns={columns} pagination />
    </div>
  );
};

export default Logs;
