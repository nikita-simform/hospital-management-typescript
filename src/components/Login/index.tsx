import { Button, Card, Form, Input } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { loginAPIResponse } from "../../types/user";
import { setToken, setUser } from "./LoginSlice";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values:{
    username:string,
    password:string
  }) => {
    apiService
      .login({
        email: values.username,
        password: values.password,
      })
      .then((res:loginAPIResponse) => {
        dispatch(setUser(res.data.data?.user));
        dispatch(setToken(res.data.data?.token));
        navigate("/patient-list");
      });
  };
  
  return (
    <Card className="card-container login">
      <h1 className="heading">Login</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 650 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div style={{ display: "block", width: "100%" }}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Username is required" },
              {
                type: 'email',
                message: 'Please enter valid email',
              },
            ]}
          >
            <Input style={{ width: "100%" }} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: 'Username must be minimum 6 characters.' }
            ]}
          >
            <Input.Password
              style={{ width: "100%" }}
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}

export default Login;
