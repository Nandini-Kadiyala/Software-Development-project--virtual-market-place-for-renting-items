import { Button, ConfigProvider, Form, Input, message } from "antd";
import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginFunc } from "../api/auth";
import AppContext from "../AppContext";
import Logo from "../assets/logo.png";
import useOutsideClick from "../hooks/useOutsideClick";
import Loader from "./Loader";

const Login = ({ setModalOpen }) => {
  const { user, setUser, loading, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const ref = useRef(null);
  const [form] = Form.useForm();
  useOutsideClick(ref, () => {
    form.resetFields();
  });

  const onSubmit = (values) => {
    (async () => {
      try {
        setLoading(true);
        const response = await loginFunc(values);
        if (response?.token) {
          setUser(response);
          localStorage.setItem("currUser", JSON.stringify(response));
          message.success("Logged in successfully");
          setModalOpen(false);
          navigate("/dashboard");
        } else {
          message.error(response?.message || "Invalid email or password");
        }
        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="h-full w-full p-20 flex items-center justify-center relative overflow-hidden">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="h-full w-full flex items-center justify-center relative overflow-hidden"
      ref={ref}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00a200",
          },
        }}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          autoComplete="off"
          className="rounded-lg p-6 pb-0 flex flex-col items-center justify-center w-full"
        >
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="text-xl">Login to</span>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="" className="size-8" />
              <span className="text-2xl text-black font-bold">RentCity</span>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="w-full"
            >
              <Input.Password className="w-full" />
            </Form.Item>
            <Form.Item className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-black hover:scale-110 duration-200"
              >
                Login
              </Button>
            </Form.Item>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Login;
