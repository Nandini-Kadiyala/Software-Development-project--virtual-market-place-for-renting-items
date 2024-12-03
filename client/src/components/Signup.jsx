import { UploadOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Input, message, Upload } from "antd";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupFunc, uploadFunc } from "../api/auth";
import AppContext from "../AppContext";
import Logo from "../assets/logo.png";
import useOutsideClick from "../hooks/useOutsideClick";
import Loader from "./Loader";

const Signup = ({ setModalOpen }) => {
  const { user, setUser, loading, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const ref = useRef(null);
  const [form] = Form.useForm();
  useOutsideClick(ref, () => {
    form.resetFields();
  });

  const onSubmit = (values) => {
    const newUserData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
    };

    const formData = new FormData();
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    (async () => {
      try {
        setLoading(true);
        const response = await signupFunc(newUserData);
        if (response?.token) {
          if (fileList.length > 0) {
            const uploadResponse = await uploadFunc(formData, response);
            if (uploadResponse?.token) {
              setUser(uploadResponse);
              message.success("Signed up successfully");
              localStorage.setItem("currUser", JSON.stringify(uploadResponse));
            } else {
              setUser(response);
              message.error("Unable signup with profile picture");
              message.success(
                "Signed up without profile picture, upload later"
              );
              localStorage.setItem("currUser", JSON.stringify(response));
            }
          } else {
            setUser(response);
            message.success("Signed up without profile picture, upload later");
            localStorage.setItem("currUser", JSON.stringify(response));
          }
          setModalOpen(false);
          navigate("/dashboard");
        } else {
          message.error(response?.message || "Unable to Signup, Try again");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    })();
  };

  const [fileList, setFileList] = useState([]);

  const handleUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
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
          form={form}
          // name="basic"
          // labelCol={{span: 8,}}
          // wrapperCol={{span: 16,}}
          // initialValues={{remember: true,}}
          onFinish={onSubmit}
          autoComplete="off"
          className="rounded-lg p-6 pb-0 flex flex-col items-start justify-center w-full"
        >
          <div className=" self-center mb-5 flex items-center justify-center gap-4">
            <span className="text-xl">Signup on</span>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="" className="size-8" />
              <span className="text-2xl text-black font-bold">RentCity</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" className="w-full">
              <Input className="w-full" />
            </Form.Item>
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
            <Form.Item
              label="Phone"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your Phone Number!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Upload DP"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              // rules={[{ required: true, message: 'Please upload an image!' }]}
              className=""
            >
              <Upload
                name="image"
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false} // Prevent automatic upload
                onChange={handleUpload}
                type="image/*"
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item className="flex justify-center items-center col-span-2">
              <Button
                type="primary"
                htmlType="submit"
                className=" bg-black hover:scale-110 duration-200"
              >
                Signup
              </Button>
            </Form.Item>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Signup;
