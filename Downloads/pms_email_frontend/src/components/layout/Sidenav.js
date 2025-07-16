import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.jpeg";
import { BsBuildings } from "react-icons/bs";
import { ImPieChart } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const role = JSON.parse(localStorage.getItem("Role"));

  const dashboard = (
    <svg
      width="20"
      height="21"
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0032 5.84582L11.3744 11.3658L11.5587 14.1402C11.5607 14.4255 11.6053 14.709 11.6916 14.9814C11.9141 15.5102 12.4496 15.8462 13.0321 15.8227L21.9084 15.242C22.2928 15.2358 22.664 15.3795 22.9403 15.6418C23.1705 15.8603 23.3192 16.1462 23.3661 16.4536L23.3819 16.6403C23.0145 21.7266 19.2789 25.969 14.2032 27.064C9.1274 28.1591 3.92248 25.8458 1.41428 21.3799C0.691184 20.0824 0.239531 18.6564 0.0858377 17.1854C0.0216377 16.7499 -0.00662902 16.31 0.00130431 15.87C-0.00662902 10.417 3.87662 5.70265 9.31244 4.56613C9.96668 4.46425 10.608 4.8106 10.8704 5.40741C10.9383 5.54562 10.9831 5.69365 11.0032 5.84582Z"
        fill="#13487D"
      />
      <path
        d="M26.6663 11.083L26.657 11.1265L26.6301 11.1897L26.6338 11.3632C26.6199 11.5929 26.5311 11.814 26.3783 11.9926C26.219 12.1786 26.0014 12.3053 25.7618 12.3545L25.6157 12.3745L15.3746 13.0381C15.0339 13.0717 14.6947 12.9618 14.4415 12.736C14.2303 12.5476 14.0954 12.2934 14.0573 12.0196L13.3699 1.79337C13.3579 1.7588 13.3579 1.72132 13.3699 1.68673C13.3793 1.40485 13.5034 1.13841 13.7145 0.946932C13.9254 0.755452 14.2059 0.654892 14.493 0.667718C20.5729 0.822398 25.6827 5.19435 26.6663 11.083Z"
        fill="#13487D"
      />
    </svg>
  );
  const studyIcon = (
    <svg
      width="19"
      height="23"
      viewBox="0 0 24 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.382 0.68335H4.61804C2.07577 0.68335 0 2.58423 0 4.9166V24.4385C0 26.7709 2.07577 28.6717 4.61804 28.6717H19.382C21.9242 28.6717 24 26.7709 24 24.4385V4.9166C24 2.58423 21.9242 0.68335 19.382 0.68335ZM8.53391 5.84918H14.3899C15.0339 5.84918 15.5561 6.37077 15.5561 7.01536C15.5561 7.65995 15.0339 8.18154 14.3899 8.18154H8.53391C7.88989 8.18154 7.36772 7.65995 7.36772 7.01536C7.36772 6.37077 7.88989 5.84918 8.53391 5.84918ZM4.93514 12.2529C4.93514 11.6083 5.4573 11.0868 6.10132 11.0868H16.8225C17.4665 11.0868 17.9886 11.6083 17.9886 12.2529C17.9886 12.8975 17.4665 13.4191 16.8225 13.4191H6.10132C5.4573 13.4191 4.93514 12.8975 4.93514 12.2529ZM15.6035 23.5056C13.7027 23.5056 12.1399 21.9545 12.1399 20.042C12.1399 18.1411 13.7027 16.5901 15.6035 16.5901C17.516 16.5901 19.0671 18.1411 19.0671 20.042C19.0671 21.9545 17.516 23.5056 15.6035 23.5056Z"
        fill="#13487D"
      />
    </svg>
  );

  const userIcon = (
    <svg
      width="20"
      height="21"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.75 13.6833C13.3398 13.6833 16.25 10.7732 16.25 7.18335C16.25 3.5935 13.3398 0.68335 9.75 0.68335C6.16015 0.68335 3.25 3.5935 3.25 7.18335C3.25 10.7732 6.16015 13.6833 9.75 13.6833Z"
        fill="#13487D"
      />
      <path
        d="M6.96428 14.7667C3.11802 14.7667 0 17.8847 0 21.731C0 23.2695 1.24721 24.5167 2.78572 24.5167H16.7143C18.2528 24.5167 19.5 23.2695 19.5 21.731C19.5 17.8847 16.382 14.7667 12.5357 14.7667H6.96428Z"
        fill="#13487D"
      />
      <path
        d="M17.1572 11.6852C16.9623 12.0052 17.1074 12.4353 17.4758 12.5034C17.7928 12.5621 18.1205 12.6 18.4167 12.6C21.4082 12.6 23.8333 10.1749 23.8333 7.18336C23.8333 4.19182 21.4082 1.76669 18.4167 1.76669C18.1205 1.76669 17.7928 1.80466 17.4758 1.86333C17.1074 1.9315 16.9623 2.36157 17.1572 2.68154C17.9564 3.99361 18.4167 5.53473 18.4167 7.18336C18.4167 8.83199 17.9564 10.3731 17.1572 11.6852Z"
        fill="#13487D"
      />
      <path
        d="M21.2951 23.6164C21.1293 24.0188 21.3991 24.5167 21.8341 24.5167H23.2143C24.7529 24.5167 26 23.2695 26 21.731C26 17.8847 22.8821 14.7667 19.0358 14.7667C18.833 14.7718 18.74 15.0285 18.8857 15.1696C20.6006 16.8296 21.6667 19.1558 21.6667 21.731C21.6667 22.3986 21.5346 23.0353 21.2951 23.6164Z"
        fill="#13487D"
      />
    </svg>
  );

  const menuItems = [
    {
      key: "1",
      label: "Dashboard",
      path: "/dashboard",
      icon: dashboard,
    },
    {
      key: "3",
      label: "User",
      path: "/user",
      icon: userIcon,
      pageKey: "user",
    },
    {
      key: "4",
      label: "Company",
      path: "/company",
      icon: <BsBuildings color="white" size={20} />,
      pageKey: "company",
    },
    {
      key: "5",
      label: "Division",
      path: "/division",
      icon: <ImPieChart size={20} />,
      pageKey: "division",
    },
    {
      key: "6",
      label: "Study",
      path: "/study",
      icon: studyIcon,
      pageKey: "study",
    },
    {
      key: "7",
      label: "Investigator",
      path: "/investigator",
      icon: <FaFileAlt size={24} />,
      pageKey: "investigator",
    },
    {
      key: "8",
      label: "Reports",
      path: "/reports",
      icon: <RiFileList3Fill size={24} />,
      pageKey: "reports",
    },
  ];

  return (
    <>
      <div className="brand text-center">
        <img src={logo} alt="" />
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "84vh",
          maxHeight: "84vh",
        }}
      >
        <Menu theme="light" mode="inline">
          {role == "ADMIN" ? (
            menuItems.map((item) => (
              <Menu.Item key={`manu-${item.key}`}>
                <NavLink to={item.path}>
                  <span
                    className="icon"
                    style={{
                      background:
                        item.pageKey && page === item.pageKey
                          ? color
                          : "transparent",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="label">{item.label}</span>
                </NavLink>
              </Menu.Item>
            ))
          ) : (
            <>
              <Menu.Item key="1">
                <NavLink to="/dashboard">
                  <span
                    className="icon"
                    style={{
                      background: page === "dashboard" ? color : "",
                    }}
                  >
                    {dashboard}
                  </span>
                  <span className="label">Dashboard</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="8">
                <NavLink to="/investigator">
                  <span
                    className="icon"
                    style={{
                      background:
                        page === "investigator-milestone-view" ? color : "",
                    }}
                  >
                    <FaFileAlt size={24} />
                  </span>
                  <span className="label">Investigator</span>
                </NavLink>
              </Menu.Item>
            </>
          )}
          {/* <Menu.Item className="menu-item-header" key="5">
            Account Pages
          </Menu.Item>
          <Menu.Item key="6">
            <NavLink to="/profile">
              <span
                className="icon"
                style={{
                  background: page === "profile" ? color : "",
                }}
              >
                {profile}
              </span>
              <span className="label">Profile</span>
            </NavLink>
          </Menu.Item> */}
        </Menu>
      </div>
    </>
  );
}

export default Sidenav;
