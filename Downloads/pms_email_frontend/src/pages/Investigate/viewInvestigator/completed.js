import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Spin,
  Table,
  Typography,
} from "antd";
import { postReq } from "../../../api";
import { FileExcelOutlined, PlusCircleOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };

const Completed = ({ id, recordId, status, refresh, tabActive }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);
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
  const Data = JSON.parse(localStorage.getItem("Data"));
  const Role = Data?.role;

  const EditableCell = (_a) => {
    var { editing, dataIndex, title, children } = _a,
      restProps = __rest(_a, [
        "editing",
        "dataIndex",
        "title",
        "inputType",
        "record",
        "index",
        "children",
      ]);
    const inputNode = dataIndex == "Mobile_No" ? <InputNumber /> : <Input />;

    let rules = [
      status == "discrimination" && {
        required: true,
        message: `Please Input ${title}!`,
      },
    ];

    if (dataIndex === "PAN_No") {
      rules.push({
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Enter a valid PAN number (e.g., ABCDE1234F)",
      });
    }

    if (dataIndex === "Email_ID") {
      rules.push({
        type: "email",
        message: "Please enter a valid email!",
      });
    }

    if (dataIndex === "Mobile_No") {
      rules.push({
        pattern: /^\d{10}$/,
        message: "Mobile number must be 10 digits!",
      });
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const fetchData = async () => {
    const { current, pageSize } = tableParams.pagination;
    const response = await postReq(`admin/study/${recordId}/get-process-data`, {
      id: id,
      status: status,
      page: current,
      limit: pageSize,
    });
    setData(response.data.docs);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total: response.data.totalDocs,
      },
    }));
  };

  useEffect(() => {
    if (tabActive) fetchData();
  }, [
    tabActive,
    tableParams.pagination.current,
    tableParams.pagination.pageSize
  ]);

  // useEffect(() => {
  //   fetchData
  // }, [tableParams])

  const isEditing = (record) => {
    return record._id === editingKey;
  };
  const edit = (record) => {
    form.setFieldsValue(
      Object.assign({ name: "", age: "", address: "" }, record)
    );
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
    setShowEditColumn(false);
    setData((data) => data.filter((d) => d._id !== 1));
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      setSaveLoading(true);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        const changedFields = {};
        for (const field in row) {
          if (row[field] !== item[field]) {
            changedFields[field] = row[field];
          }
        }

        if (key === 1) {
          changedFields.created = true;
          changedFields.study = recordId;
        }

        const response = await postReq(
          `admin/processdata/update/${item._id}`,
          changedFields
        );
        await fetchData();
        setShowEditColumn(false);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
        setShowEditColumn(false);
        setData((data) => data.filter((d) => d._id !== 1));
      }
    } catch (errInfo) {
      errInfo.errorFields.map((error) => toast.error(error.errors[0]));
    }
    setTimeout(() => {
      setSaveLoading(false);
      setEditingKey("");
    }, 2000);
  };

  const deleteCol = async (record) => {
    const response = await postReq(`admin/processdata/delete/${record._id}`);
    if (response.status == 200) {
      const newData = data.filter((d) => d._id !== record._id);
      setData(newData);
      toast.success(response?.message || "Delete Successfuly");
    } else {
      toast.error(response?.message || "Error");
    }
    refresh();
  };

  const baseColumns = [
    {
      title: "Info",
      dataIndex: "validation",
      width: "200px",
      onCell: (record) => ({
        style: {
          width: "200px",
          minWidth: "200px",
          maxWidth: "200px",
          backgroundColor: "#fff0f0", // light red
          color: "#a8071a",
        },
      }),
      editable: false,
      render: (validationArray) => {
        return {
          props: {
            style: {
              background: validationArray?.length > 0 ? "#ffa8a8" : null,
              fontWeight: "500",
            },
          },
          children: (
            <div>
              {Array.isArray(validationArray)
                ? validationArray.map((item, index) => (
                    <div key={index}>
                      {index + 1}. {item},
                    </div>
                  ))
                : null}
            </div>
          ),
        };
      },
    },
    {
      title: "Doctor_Name",
      dataIndex: "Doctor_Name",
      width: "200px",
      onCell: (record) => ({
        style: { width: "200px", minWidth: "200px", maxWidth: "200px" },
      }),
      editable: true,
    },
    {
      title: "Email_ID",
      dataIndex: "Email_ID",
      editable: true,
    },
    {
      title: "User_ID",
      dataIndex: "User_ID",
      editable: true,
    },
    {
      title: "Password",
      dataIndex: "Password",
      editable: true,
    },
    {
      title: "Mobile_No",
      dataIndex: "Mobile_No",
      editable: true,
    },
    {
      title: "PAN_No",
      dataIndex: "PAN_No",
      editable: true,
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "Patient_No",
      dataIndex: "Patient_No",
      editable: true,
      width: "50px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "doctor_code",
      dataIndex: "Doctor_Code",
      editable: true,
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "SAP_Vendor_Code",
      dataIndex: "SAP_Vendor_Code",
      editable: true,
      width: "200px",
      onCell: (record) => ({
        style: { width: "200px", minWidth: "200px", maxWidth: "200px" },
      }),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      editable: true,
      width: "150px",
      onCell: (record) => ({
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      }),
    },
    {
      title: "Address",
      dataIndex: "address",
      editable: true,
      className: "t-fix-col",
    },
    {
      title: "Pincode",
      dataIndex: "Pincode",
      editable: true,
    },
    {
      title: "region",
      dataIndex: "region",
      editable: true,
    },
    {
      title: "Edit",
      dataIndex: "operation",
      fixed: "right",
      width: 100,
      className: "z-index-high",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{ marginInlineEnd: 8 }}
            >
              {saveLoading ? <Spin size="small" /> : "Save"}
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "operation2",
      fixed: "right",
      width: 100,
      className: "z-index-high",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteCol(record)}
          >
            <Typography.Link>Delete</Typography.Link>
          </Popconfirm>
        );
      },
    },
  ];

  const subcolumns =
    status === "discrimination" || status === "readyToCreate"
      ? baseColumns.filter(
          (col) => col?.dataIndex !== "User_ID" && col?.dataIndex !== "Password"
        )
      : status === "completed"
      ? baseColumns.filter(
          (col) =>
            col?.dataIndex !== "validation" && col.dataIndex !== "operation"
        )
      : baseColumns;

  const columns =
    Role == "CMT"
      ? subcolumns.filter(
          (col) =>
            col?.dataIndex !== "operation" && col?.dataIndex !== "operation2"
        )
      : Role == "CRM"
      ? subcolumns.filter((col) => col?.dataIndex !== "operation2")
      : subcolumns;
  const mergedColumns = [
    ...columns.map((col) => {
      if (!col?.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          // style: { width: "200px", minWidth: "200px", maxWidth: "200px" },
        }),
      };
    }),
    ...(showEditColumn && status == "completed"
      ? [
          {
            title: "Edit",
            dataIndex: "operation",
            fixed: "right",
            width: 100,
            className: "z-index-high",
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record._id)}
                    style={{ marginInlineEnd: 8 }}
                  >
                    {saveLoading ? <Spin size="small" /> : "Save"}
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  Edit
                </Typography.Link>
              );
            },
          },
        ]
      : []),
  ];

  const handleAdd = () => {
    const newRecord = {
      _id: 1,
      Doctor_Name: "",
      Email_ID: "",
      User_ID: "",
      Password: "",
      Mobile_No: "",
      PAN_No: "",
      Patient_No: "",
      doctor_code: "",
      SAP_Vendor_Code: "",
      Amount: "",
      Pincode: "",
      region: "",
      Address: "",
    };
    setShowEditColumn(true);
    setData([newRecord, ...data]);
    form.setFieldsValue(newRecord);
    edit(newRecord);
  };

  const handleExcel = async () => {
    const response = await postReq(`admin/study/${recordId}/get-process-data`, {
      status: status,
      all: "true",
    });
    const data = response?.data?.docs || [];

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
    const fileName = `${status}_${new Date().toISOString().split("T")[0]}.xlsx`;
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, fileName);
  };
  
   const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  return (
    <Form form={form} component={false}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        {/* {Role !== "CMT" && status !== "discrimination" && (
          <Button type="button" onClick={handleAdd}>
            <PlusCircleOutlined />
            Add
          </Button>
        )} */}
        {Role == "CRM" && status == "readyToCreate" ? (
          <Button type="button" onClick={handleAdd}>
            <PlusCircleOutlined />
            Add
          </Button>
        ) : Role == "ADMIN" && status !== "discrimination" ? (
          <Button type="button" onClick={handleAdd}>
            <PlusCircleOutlined />
            Add
          </Button>
        ) : null}
        <Button type="button" onClick={handleExcel}>
          <FileExcelOutlined />
          Download
        </Button>
      </div>

      <Table
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        // pagination={{ onChange: cancel }}
        pagination={{
          current: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          total: tableParams.pagination.total,
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />
    </Form>
  );
};
export default Completed;

// {
//   title: "Milestone",
//   children: [
//     {
//       title: "No. of patients",
//       dataIndex: "Amount",
//       key: "age",
//     },
//     {
//       title: "Honorarium (₹)",
//       dataIndex: "Amount",
//       key: "Honorarium",
//     },
//   ],
// },
