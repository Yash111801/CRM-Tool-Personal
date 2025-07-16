import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { GoUpload } from "react-icons/go";
import { postReq } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile1 = () => {
  const [form] = Form.useForm();
  const { updateProfilePhoto } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [initialData, setInitialData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { admin } = useAuth();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("Data"));
    if (data.profileImage) {
      setProfileData({
        ...data,
        profileImage: `${process.env.REACT_APP_URL_PUBLIC}${data.profileImage}`,
      });
    } else {
      setProfileData(data);
    }
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      name: profileData.name,
      email: profileData.email,
    });
    setInitialData(profileData);
  }, [form, profileData]);

  const onValuesChange = (changedValues, allValues) => {
    const hasChanges =
      allValues.name !== initialData.name ||
      (allValues.oldPassword && allValues.newPassword);
    setEditing(hasChanges);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = form.getFieldsValue();
      const response = await postReq(`admin/profile/${admin._id}`, updatedData);
      if (response.status == 200) {
        toast.success("profile updated successfuly");
        const updatedName = updatedData.name;
        setProfileData((prev) => ({
          ...prev,
          name: updatedName,
          email: updatedData.email,
        }));
        setInitialData((prev) => ({
          ...prev,
          name: updatedName,
          email: updatedData.email,
        }));
        form.setFieldsValue({
          name: updatedName,
          oldPassword: "",
          newPassword: "",
        });
        setEditing(false);
      } else {
        toast.error(response.message || "Error");
        // Optional: clear password fields even on error
        form.setFieldsValue({
          oldPassword: "",
          newPassword: "",
        });

        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (info) => {
    const file = info.fileList[0].originFileObj;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        profileImage: previewUrl,
      }));
      setSelectedFile(file);
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await postReq(
      `common/user/${profileData._id}/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 200) {
      updateProfilePhoto(response.data);
    }
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const beforeUpload = (file) => {
    const isAllowedType =
      file.name.toLowerCase().endsWith(".png") ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg");
    if (!isAllowedType) {
      message.error("Only png, jpg or jpeg files are allowed!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
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
            <span>Profile</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                onClick={() =>
                  profileData.profileImage
                    ? setIsModalOpen(true)
                    : setIsModalOpen(true)
                }
                style={{
                  cursor: "pointer",
                  position: "relative",
                  padding: "0px 15px",
                }}
              >
                <Avatar
                  size="large"
                  src={
                    profileData.profileImage
                      ? profileData.profileImage
                      : undefined
                  }
                  icon={!profileData.profileImage && <UserOutlined />}
                />
              </div>
            </div>
          </div>
        }
        bordered={false}
        style={{ borderRadius: "18px", maxWidth: "100%", overflow: "hidden" }}
      >
        <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Name
                  </div>
                }
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Email
                  </div>
                }
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input placeholder="Enter your email" readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Old password
                  </div>
                }
                name="oldPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const newPassword = getFieldValue("newPassword");
                      if (!value && !newPassword) {
                        return Promise.resolve(); // both empty = ok
                      }
                      if (!value || !newPassword) {
                        return Promise.reject(
                          "Enter both old and new password"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="Enter your old password" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="newPassword"
                label="New password"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const oldPassword = getFieldValue("oldPassword");
                      if (!value && !oldPassword) {
                        return Promise.resolve();
                      }
                      if (!value || !oldPassword) {
                        return Promise.reject(
                          "Enter both old and new password"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="Enter new password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              disabled={!editing}
            >
              Submit Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal for showing big image */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt="Profile"
              style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "40vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "150px",
                color: "#999",
              }}
            >
              <UserOutlined style={{ color: "gray" }} />
            </div>
          )}

          {selectedFile ? (
            <Button
              shape="circle"
              style={{
                position: "absolute",
                bottom: "15px",
                right: "15px",
                border: "none",
                background: "gray",
                padding: "0px 15px",
              }}
            >
              <GoUpload
                size={24}
                color="white"
                style={{ marginRight: "0px" }}
                onClick={() => handleUpload()}
              />
            </Button>
          ) : (
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUpload}
              accept=".png,.jpg,.jpeg"
            >
              <Button
                shape="circle"
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "15px",
                  border: "none",
                  background: "gray",
                  padding: "0px 15px",
                }}
              >
                <IoCameraOutline
                  size={24}
                  color="white"
                  style={{ marginRight: "0px" }}
                />
              </Button>
            </Upload>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Profile1;
