import { useEffect } from "react";
import { Row, Col, Breadcrumb, Dropdown, Button, Avatar, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { PiSignOut } from "react-icons/pi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../context/AuthContext";
const { Option } = Select;
// const bell = [
//   <svg
//     width="19"
//     height="23"
//     viewBox="0 0 19 23"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M9.50085 0C10.1852 0 10.74 0.493136 10.74 1.10145V3.85507C10.74 4.46339 10.1852 4.95652 9.50085 4.95652C8.8165 4.95652 8.26172 4.46339 8.26172 3.85507V1.10145C8.26172 0.493136 8.8165 0 9.50085 0Z"
//       fill="#13487D"
//     />
//     <path
//       d="M17.3495 18.1756L1.65273 18.1756L1.65273 10.3272C1.65273 5.99263 5.04107 2.47879 9.22081 2.47879L9.7814 2.47879C13.9611 2.47879 17.3495 5.99263 17.3495 10.3272L17.3495 18.1756Z"
//       fill="#13487D"
//     />
//     <path
//       d="M6.60925 19.8279H12.3919C12.3919 21.1966 11.0974 22.3061 9.50056 22.3061C7.90373 22.3061 6.60925 21.1966 6.60925 19.8279Z"
//       fill="#13487D"
//     />
//     <path
//       d="M0 17.7624C0 17.078 0.500423 16.5232 1.11773 16.5232H17.8836C18.5009 16.5232 19.0013 17.078 19.0013 17.7624C19.0013 18.4468 18.5009 19.0017 17.8836 19.0017H1.11773C0.500423 19.0017 0 18.4468 0 17.7624Z"
//       fill="#13487D"
//     />
//   </svg>,
// ];

const profile = [
  <svg
    width="19"
    height="21"
    viewBox="0 0 19 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.58105 9C11.7902 9 13.5811 7.20914 13.5811 5C13.5811 2.79086 11.7902 1 9.58105 1C7.37192 1 5.58105 2.79086 5.58105 5C5.58105 7.20914 7.37192 9 9.58105 9Z"
      fill="#13487D"
      stroke="#13487D"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M0.516402 20.1727C0.773695 16.2637 4.02588 13.1727 8 13.1727H11C14.9741 13.1727 18.2263 16.2637 18.4836 20.1727H0.516402Z"
      fill="#13487D"
      stroke="#13487D"
    />
  </svg>,
];

const notifications = [
  {
    message: "new user created",
    _id: 1,
  },
  {
    message: "new company created",
    _id: 2,
  },
  {
    message: "new division added to company",
    _id: 3,
  },
  {
    message: "new study assign to company",
    _id: 4,
  },
];

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({ placement, name, subName, onPress, handleStudyCallback, studyData }) {
  useEffect(() => window.scrollTo(0, 0));
  const { logout, profilePhoto } = useAuth();
  const history = useHistory();
  const data = JSON.parse(localStorage.getItem("Data"));
  const handleSignOut = () => {
    logout();
    history.push("/sign-in");
  };

  const items = [
    {
      key: "1",
      label: <NavLink to="/profile1">Profile</NavLink>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <p style={{ marginBottom: "0px" }} onClick={handleSignOut}>
          Sign Out
        </p>
      ),
      icon: <PiSignOut />,
    },
  ];

  return (
    <>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col
          span={32}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
          className="header-control"
        >
          <Breadcrumb>
            {/* <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item> */}
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {name.replace("/", "")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            {toggler}
          </Button>
        </Col>
        <Col span={24} md={18} className="header-control">
          {/* <Dropdown
            overlay={
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "325px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "0",
                }}
              >
                <List
                  dataSource={notifications}
                  renderItem={(item, i) => (
                    <List.Item
                      // onClick={() => markAsRead(item._id)}
                      style={{
                        cursor: "pointer",
                        background: "#f0f9ff",
                        padding: "15px",
                        borderBottom: "1px solid #e8e8e8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {item.message}
                    </List.Item>
                  )}
                />
              </div>
            }
            trigger={["click"]}
          >
            <div
              style={{
                background: "#F8F8F8",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Badge
                size="small"
                count={notifications.filter((n) => !n.isRead).length}
                overflowCount={99}
                style={{
                  backgroundColor: "#3699FF",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                <a
                  href="#pablo"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    fontSize: "20px",
                    color: "#13487D",
                  }}
                >
                  {bell}
                </a>
              </Badge>
            </div>
          </Dropdown> */}
          <div
            style={{
              background: "rgb(248, 248, 248)",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
            }}
          >
            <a
              href="#pablo"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: "20px",
                color: "#13487D",
              }}
            >
              <Dropdown menu={{ items }} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar
                    size="large"
                    src={`${process.env.REACT_APP_URL_PUBLIC}${profilePhoto}`}
                    icon={!profilePhoto && profile}
                  />
                </a>
              </Dropdown>
            </a>
          </div>
          <div className="d-flex flex-column flex-end">
            <span>{data?.name}</span>
            <span className="font-bold">{data?.role}</span>
          </div>
          <div
            style={{
              width: "300px",
              marginRight: "20px",
            }}
          >
            <Select
              className="custom-select"
              placeholder="Select Study"
              allowClear
              style={{ width: "100%" }}
              maxTagCount="responsive"
              onChange={(value) => handleStudyCallback(value)}
            >
              {studyData &&
                studyData.map((study, i) => {
                  return (
                    <Option key={i} value={study._id} label={study.title}>
                      {study.title}
                    </Option>
                  );
                })}
            </Select>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Header;
