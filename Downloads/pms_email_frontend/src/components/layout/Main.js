import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import {
  useHistory
} from "react-router-dom/cjs/react-router-dom.min";
import { getReq } from "../../api";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("white");
  const [fixed, setFixed] = useState(false);
  const [studyList, setStudyList] = useState([]);
  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    const fetchStudies = async () => {
     const studyData = await getReq('admin/study-list');
     if (studyData.status === 200) {
      setStudyList(studyData.data);
     } else {
      setStudyList([]);
     }
    }
    fetchStudies();
  }, [])

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  const handleStudyCallback = async (id) => {
    if (id) {
      const response = await getReq(`admin/study/${id}`);
      if (response.status == 200) {
        const record = response.data;
        if (record?.studyType == "Milestone") {
          history.push("/investigator-milestone-view", { record });
        } else {
          history.push("/investigator-view", { record });
        }
      }
    } else {
       history.push("/dashboard");
    }
  };

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={placement === "right" ? "left" : "right"}
        width={250}
        className={`drawer-sidebar ${
          pathname === "rtl" ? "drawer-sidebar-rtl" : ""
        } `}
      >
        <Layout
          className={`layout-dashboard ${
            pathname === "rtl" ? "layout-dashboard-rtl" : ""
          }`}
        >
          <Sider
            trigger={null}
            width={300}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${
              sidenavType === "#fff" ? "active-route" : ""
            }`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {}}
        trigger={null}
        width={300}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === "#fff" ? "active-route" : ""
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
                handleStudyCallback={handleStudyCallback}
                studyData={studyList}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
              handleStudyCallback={handleStudyCallback}
              studyData={studyList}
            />
          </AntHeader>
        )}
        <Content className="content-ant">{children}</Content>
        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
}

export default Main;
