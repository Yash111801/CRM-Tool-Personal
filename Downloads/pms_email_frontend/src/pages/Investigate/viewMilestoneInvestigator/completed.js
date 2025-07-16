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
import { FileExcelOutlined, PlusCircleOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { postReq } from "../../../api";

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
  const [milestoneColumns, setMilestoneColumns] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
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
      // status != "discrimination" &&
      {
        required: true,
        message: `Please Input ${title}!`,
      },
    ];

    if (dataIndex == "PAN_No") {
      rules.push({
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Enter a valid PAN number (e.g., ABCDE1234F)",
      });
    }

    if (dataIndex == "Email_ID") {
      rules.push({
        type: "email",
        message: "Please enter a valid email!",
      });
    }

    if (dataIndex == "Mobile_No") {
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
    tableParams.pagination.pageSize,
  ]);

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

        const milestoneData = row?.milestoneData || [];

        const totalPatients = milestoneData.reduce((sum, entry) => {
          return sum + (parseInt(entry.numberOfPatients) || 0);
        }, 0);

        const totalHonorarium = milestoneData.reduce((sum, entry) => {
          return sum + (parseInt(entry.honorariumAmount) || 0);
        }, 0);

        if (totalPatients !== row.Patient_No) {
          changedFields.Patient_No = totalPatients;
        }
        if (totalHonorarium !== row.Amount) {
          changedFields.Amount = totalHonorarium;
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
      setTimeout(() => {
        setSaveLoading(false);
        setEditingKey("");
      }, 2000);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      errInfo.errorFields.map((error) => toast.error(error.errors[0]));
    }
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
  useEffect(() => {
    if (data[0]?.milestoneData && Array.isArray(data[0]?.milestoneData)) {
      const dynamicColumns = data[0].milestoneData.map((_, index) => ({
        title: `Milestone ${index + 1}`,
        children: [
          {
            title: "No. of patients",
            dataIndex: ["milestoneData", index, "numberOfPatients"],
            key: `milestone_${index}_patients`,
            editable: true,
          },
          {
            title: "Honorarium (₹)",
            dataIndex: ["milestoneData", index, "honorariumAmount"],
            key: `milestone_${index}_honorarium`,
            editable: true,
          },
        ],
      }));
      setMilestoneColumns(dynamicColumns);
    } else {
      setMilestoneColumns([
        {
          title: `Milestone`,
          children: [
            {
              title: "No. of patients",
              dataIndex: ["milestoneData", 0, "numberOfPatients"],
              key: `milestonepatients`,
              editable: true,
            },
            {
              title: "Honorarium (₹)",
              dataIndex: ["milestoneData", 0, "honorariumAmount"],
              key: `milestonehonorarium`,
              editable: true,
            },
          ],
        },
      ]);
    }
  }, [data]);

  const baseColumns = [
    {
      title: "Info",
      dataIndex: "validation",
      width: 200,
      onCell: (record) => ({
        style: {
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
            <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
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
      width: "200px",
      editable: true,
    },
    {
      title: "PAN_No",
      dataIndex: "PAN_No",
      width: "200px",
      editable: true,
    },
    {
      title: "doctor_code",
      dataIndex: "Doctor_Code",
      editable: true,
    },
    {
      title: "SAP_Vendor_Code",
      dataIndex: "SAP_Vendor_Code",
      editable: true,
    },
    {
      title: "Patient_No",
      dataIndex: "Patient_No",
      editable: false,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      editable: false,
    },
    ...milestoneColumns,
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
      if (col.children) {
        return {
          ...col,
          children: col.children.map((child) => {
            if (!child.editable) return child;
            return {
              ...child,
              onCell: (record) => ({
                record,
                // inputType: "number", // or "text", you can refine this per column
                dataIndex: child.dataIndex,
                title: child.title,
                editing: isEditing(record),
              }),
            };
          }),
        };
      }

      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text", // customize if needed
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }),

    ...(showEditColumn && status === "completed"
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
      milestoneData: data[0].milestoneData.map((_) => ({
        numberOfPatients: "",
        honorariumAmount: "",
      })),
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
        {data.length > 0 ? (
          Role == "CRM" && status == "readyToCreate" ? (
            <Button type="button" onClick={handleAdd}>
              <PlusCircleOutlined />
              Add
            </Button>
          ) : Role == "ADMIN" && status !== "discrimination" ? (
            <Button type="button" onClick={handleAdd}>
              <PlusCircleOutlined />
              Add
            </Button>
          ) : null
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
        scroll={{ x: "max-content" }}
        pagination={{
          current: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          total: tableParams.pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "30"],
        }}
        onChange={handleTableChange}
        pageSize={[10, 20, 30]}
      />
    </Form>
  );
};
export default Completed;
