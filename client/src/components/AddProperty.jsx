import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Form,
  InputNumber,
  message,
  Select,
  Upload,
} from "antd";
import React, { useContext, useState } from "react";
import {
  getAllProperties,
  postProperty,
  uploadPropertyImage,
} from "../api/property";
import AppContext from "../AppContext";

const { Option } = Select;

const AddProperty = ({ setModalOpen }) => {
  const { user, properties, setProperties, loading, setLoading } =
    useContext(AppContext);
  const [fileList, setFileList] = useState([]);

  const cities = ["boston", "Amsterdam", "London", "Tokyo", "Beijing"];
  const facilities = [
    "School",
    "Hospital",
    "Supermarket",
    "Park",
    "Mall",
    "Metro",
    "Bus Stop",
    "Railway Station",
    "Airport",
    "Highway",
    "Petrol Pump",
    "ATM",
    "Bank",
    "Market",
    "College",
  ];

  const handleUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    const newProperty = {
      price: values.price,
      bhk: values.bhk,
      area: values.area,
      location: values.location,
      city: values.city,
      nearbyFacilities: values.nearbyFacilities,
    };

    const formData = new FormData();
    fileList.length > 0
      ? formData.append("image", fileList[0].originFileObj)
      : null;

    try {
      setLoading(true);
      const response = await postProperty(newProperty, user);
      if (response?._id) {
        if (fileList.length > 0) {
          const uploadResponse = await uploadPropertyImage(
            response._id,
            formData,
            user
          );
          if (uploadResponse?._id) {
            message.success("Property added successfully");
          } else {
            message.success("Property added without image");
          }
        } else {
          message.success("Property added without image");
        }
      } else {
        message.error("Error while adding property");
      }
    } catch (error) {
      message.error("Unable to add property");
    } finally {
      try {
        const response = await getAllProperties(user);
        if (Array.isArray(response)) {
          setProperties(response);
        } else {
          console.log("Error while fetching properties");
        }
      } catch (error) {
        console.log("Error while fetching properties");
      }
      setLoading(false);
      setModalOpen(false);
    }
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00a200",
        },
      }}
    >
      <Form
        onFinish={handleSubmit}
        autoComplete="off"
        // labelCol={{span: 8,}}
        // wrapperCol={{span: 16,}}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            name="image"
            label="Upload Image"
            // rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload
              name="image"
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleUpload}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="bhk"
            label="Quantity"
            rules={[
              { required: true, message: "Please input the number of BHK!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="area"
            label="Days"
            rules={[{ required: true, message: "Please input the area!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Item"
            rules={[{ required: true, message: "Please select a category!" }]} // Validation rule
          >
            <Select placeholder="Select a category">
              <Option value="car">Car</Option>
              <Option value="camera">Camera</Option>
              <Option value="electric-item">Electric Item</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please select a city!" }]}
          >
            <Select placeholder="Select a city">
              {cities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nearbyFacilities"
            label="Nearby Facilities"
            // rules={[{ required: true, message: 'Please select nearby facilities!' }]}
            className=" col-span-2"
          >
            <Select mode="multiple" placeholder="Select nearby facilities">
              {facilities.map((facility) => (
                <Option key={facility} value={facility}>
                  {facility}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className=" col-span-2 flex items-center justify-center -mb-8">
            <Form.Item>
              <Button type="primary" htmlType="submit" className="bg-black">
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </ConfigProvider>
  );
};

export default AddProperty;
