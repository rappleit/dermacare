"use client";
import React from "react";
import {
  Card,
  Upload,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  message,
} from "antd";
import {
  CameraOutlined,
  UserOutlined,
  ProfileOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const InputSection = ({ fileList, onUploadChange, onFormSubmit }) => {
  const [form] = Form.useForm();

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
    }

    return false; // Prevent auto upload
  };

  return (
    <div className="w-lg max-w-lg flex flex-col gap-4">
      {/* Skin Condition Image Upload Card */}
      <Card
        title={
          <Title level={4}>
            <CameraOutlined /> Skin Condition Images
          </Title>
        }
        
      >
        <Upload.Dragger
          name="skinConditionImages"
          multiple
          fileList={fileList}
          onChange={onUploadChange}
          listType="picture-card"
          beforeUpload={beforeUpload}
          accept="image/*"
        >
          <p className="ant-upload-drag-icon">
            <CameraOutlined className="text-6xl text-blue-500" />
          </p>
          <p className="ant-upload-text">
            Click or drag skin condition photos to upload
          </p>
          <p className="ant-upload-hint">
            High-quality images help with better assessment. Ensure good
            lighting and focus.
          </p>
        </Upload.Dragger>
      </Card>

      {/* Skin Condition History Form Card */}
      <Card
        className="w-lg"
        title={
          <Title level={4}>
            <ProfileOutlined /> Patient History
          </Title>
        }
        extra={<Text type="secondary">Complete all required fields</Text>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFormSubmit}
          scrollToFirstError
        >
          <Space direction="horizontal" size={8} className="flex mb-2">
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
              className="flex-1"
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
              className="flex-1"
            >
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
                <Option value="Prefer Not To Say">Prefer not to say</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="race"
              label="Race"
              rules={[{  message: "Please enter race" }]}
              className="mb-2"
            >
              <Input placeholder="Race" />
            </Form.Item>
          </Space>

          <Form.Item
            name="itch"
            label="Any itch or pain?"
            rules={[{ message: "Please specify if there is any itch or pain" }]}
            className="mb-2"
          >
            <Input.TextArea rows={2} placeholder="Describe any itch" />
          </Form.Item>

          <Form.Item
            name="onset"
            label="Onset (When did the lesion first start?)"
            rules={[
              { required: true, message: "Please specify the onset date" },
            ]}
            className="mb-2"
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration of lesion (this episode if repeated onset)"
            rules={[
              {
                required: true,
                message: "Please specify the duration of the lesion",
              },
            ]}
            className="mb-2"
          >
            <Input.TextArea
              rows={2}
              placeholder="Describe the duration of the lesion"
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location of lesion"
            rules={[
              {
                required: true,
                message: "Please specify the location of the lesion",
              },
            ]}
            className="mb-2"
          >
            <Input.TextArea
              rows={2}
              placeholder="Describe the location of the lesion"
            />
          </Form.Item>

          <Form.Item
            name="pastMedicalHistory"
            label="Past Medical History"
            rules={[{ message: "Please specify past medical history" }]}
            className="mb-2"
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe past chronic/acute conditions, previous infections (e.g., chickenpox, HIV)"
            />
          </Form.Item>

          <Form.Item
            name="familyHistory"
            label="Family History"
            rules={[{ message: "Please specify family history" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe family history of skin/autoimmune/chronic conditions"
            />
          </Form.Item>

          <Form.Item
            name="otherPertinentHistory"
            label="Other Pertinent History"
            rules={[{ message: "Please specify other pertinent history" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe any other pertinent history"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
            >
              Submit and Generate
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InputSection;
