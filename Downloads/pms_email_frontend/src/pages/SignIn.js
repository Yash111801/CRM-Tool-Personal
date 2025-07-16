import React, { Component } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { postReq } from "../api";
import { toast } from "react-toastify";
import logo2 from "../assets/images/logo 2.png";

const { Title } = Typography;
const { Content } = Layout;

export default class SignIn extends Component {
  state = {
    loading: false,
  };
  render() {
    const onFinish = async (values) => {
      this.setState({ loading: true });
      const response = await postReq("auth/login", {
        ...values,
      });
      if (response.status == 200) {
        localStorage.setItem("Data", JSON.stringify(response.data));
        localStorage.setItem("Role", JSON.stringify(response.data.role));
        window.location.replace("/dashboard");
      } else {
        toast.error(response.message || "error");
      }
      this.setState({ loading: false });
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return (
      <>
        <Layout
          className="layout-default layout-signin"
          style={{ minHeight: "100vh" }}
        >
          <Content className="signin">
            <Row
              justify="center"
              align="middle"
              style={{ minHeight: "100vh" }} // Center vertically
            >
              {/* Left Column - Gradient */}
              <Col
                xs={24}
                md={12}
                style={{
                  background:
                    "linear-gradient(90deg, #7976db, #2825ae, transparent)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                  color: "white",
                  height: "100vh",
                }}
              >
                <img
                  src={logo2}
                  alt="logo"
                  style={{ maxWidth: "175px", marginBottom: "16px" }}
                />
                <p
                  style={{
                    fontSize: "20px",
                    textAlign: "start"
                  }}
                >
                  Your Clinical Companion for Smarter Studying.
                </p>
              </Col>

              {/* Right Column - Sign In Form */}
              <Col
                xs={24}
                md={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                  background: "white",
                  height: "100vh",
                }}
              >
                <div style={{ width: "100%", maxWidth: "400px" }}>
                  <Title style={{ textAlign: "center", fontSize: "30px" }}>
                    Sign In
                  </Title>

                  <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Enter password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        loading={this.state?.loading}
                      >
                        SIGN IN
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </>

      // <>
      //   <Layout className="layout-default layout-signin">
      //     <Content className="signin">
      //       <Row
      //         gutter={[24, 0]}
      //         justify="space-around"
      //         // style={{ height: "100vh " }}
      //       >
      //         <Col
      //           xs={{ span: 24, offset: 0 }}
      //           lg={{ span: 6, offset: 0 }}
      //           md={{ span: 12, offset: 0 }}
      //           className="layput-gradient"
      //         >
      //           <div>
      //             <img src={logo1} alt="logo" />
      //           </div>
      //           <div>
      //             <p className="tagline">
      //               Your Clinical Companion for Smarter Studying.
      //             </p>
      //           </div>
      //         </Col>
      //         <Col
      //           xs={{ span: 24, offset: 0 }}
      //           lg={{ span: 6, offset: 0 }}
      //           md={{ span: 12 }}
      //           style={{
      //             background: "white",
      //             padding: "12px",
      //             borderRadius: "14px",
      //             // boxShadow: "0 4px 20px rgba(0, 0, 0, 54%)",
      //           }}
      //         >
      //           <Title style={{ textAlign: "center", fontSize: "30px" }}>
      //             Sign In
      //           </Title>
      //           <Form
      //             onFinish={onFinish}
      //             onFinishFailed={onFinishFailed}
      //             layout="vertical"
      //             className="row-col"
      //           >
      //             <Form.Item
      //               className="username"
      //               label="Email"
      //               name="email"
      //               rules={[
      //                 {
      //                   required: true,
      //                   type: "email",
      //                   message: "Please input your email!",
      //                 },
      //               ]}
      //             >
      //               <Input placeholder="Email" />
      //             </Form.Item>

      //             <Form.Item
      //               className="username"
      //               label="Password"
      //               name="password"
      //               rules={[
      //                 {
      //                   required: true,
      //                   message: "Please input your password!",
      //                 },
      //               ]}
      //             >
      //               <Input.Password
      //                 placeholder="input password"
      //                 iconRender={(visible) =>
      //                   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      //                 }
      //               />
      //             </Form.Item>
      //             <Form.Item>
      //               <Button
      //                 type="primary"
      //                 htmlType="submit"
      //                 style={{ width: "100%" }}
      //                 loading={this.state.loading}
      //               >
      //                 SIGN IN
      //               </Button>
      //             </Form.Item>
      //           </Form>
      //         </Col>
      //       </Row>
      //     </Content>
      //   </Layout>
      // </>
    );
  }
}
