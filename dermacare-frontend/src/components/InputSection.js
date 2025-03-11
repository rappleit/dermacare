'use client';
import React, { useState } from 'react';
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
  Divider,
  message 
} from 'antd';
import { InboxOutlined, SaveOutlined, UserOutlined, CameraOutlined, ProfileOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const InputSection = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleUploadChange = ({ fileList }) => {
    // Limit to 3 images
    const limitedFileList = fileList.slice(0, 3);
    setFileList(limitedFileList);
  };

  const onFinish = (values) => {
    console.log('Form values:', { ...values, skinImages: fileList });
    message.success('Skin condition assessment submitted successfully!');
  };

  // Validate file type and size
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    
    return false; // Prevent auto upload
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      {/* Skin Condition Image Upload Card */}
      <Card 

        title={<Title level={4}><CameraOutlined /> Skin Condition Images</Title>}
        extra={<Text type="secondary">Upload clear images of the affected area</Text>}
      >
        <Paragraph>
          Please upload clear, well-lit photographs of the affected skin area. Take photos from multiple angles 
          if possible, and include a reference object for scale if appropriate.
        </Paragraph>
        
        <Form.Item 
          name="skinImages" 
          valuePropName="fileList" 
          getValueFromEvent={normFile}
          extra="Upload up to 3 images. Each image should be less than 5MB."
        >
          <Upload.Dragger
            name="skinConditionImages"
            multiple
            fileList={fileList}
            onChange={handleUploadChange}
            listType="picture-card"
            beforeUpload={beforeUpload}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <CameraOutlined className="text-6xl text-blue-500" />
            </p>
            <p className="ant-upload-text">Click or drag skin condition photos to upload</p>
            <p className="ant-upload-hint">
              High-quality images help with better assessment. Ensure good lighting and focus.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Card>

      {/* Skin Condition History Form Card */}
      <Card 
        title={<Title level={4}><ProfileOutlined/> Patient History</Title>}
        extra={<Text type="secondary">Complete all required fields</Text>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          {/* Personal Information */}
          <Title level={5}>Personal Information</Title>
          <Space direction="horizontal" size={16} className="flex mb-4">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
              className="flex-1"
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>
            
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
              className="flex-1"
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>
          </Space>
          
          <Space direction="horizontal" size={16} className="flex mb-4">
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: 'Please select date of birth' }]}
              className="flex-1"
            >
              <DatePicker className="w-full" />
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
              className="flex-1"
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
                <Option value="prefer-not-to-say">Prefer not to say</Option>
              </Select>
            </Form.Item>
          </Space>

          <Divider />

          {/* Skin Condition Details */}
          <Title level={5}>Skin Condition Details</Title>
          
          <Form.Item
            name="conditionLocation"
            label="Location on Body"
            rules={[{ required: true, message: 'Please specify location on body' }]}
          >
            <Select placeholder="Select area(s) affected" mode="multiple">
              <Option value="face">Face</Option>
              <Option value="scalp">Scalp</Option>
              <Option value="neck">Neck</Option>
              <Option value="chest">Chest</Option>
              <Option value="back">Back</Option>
              <Option value="arms">Arms</Option>
              <Option value="hands">Hands</Option>
              <Option value="legs">Legs</Option>
              <Option value="feet">Feet</Option>
              <Option value="groin">Groin</Option>
              <Option value="other">Other (specify in description)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="symptomsOnset"
            label="When did you first notice the condition?"
            rules={[{ required: true, message: 'Please indicate when symptoms began' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="symptoms"
            label="Symptoms"
            rules={[{ required: true, message: 'Please select associated symptoms' }]}
          >
            <Select mode="multiple" placeholder="Select all that apply">
              <Option value="itching">Itching</Option>
              <Option value="pain">Pain</Option>
              <Option value="burning">Burning</Option>
              <Option value="redness">Redness</Option>
              <Option value="swelling">Swelling</Option>
              <Option value="rash">Rash</Option>
              <Option value="blisters">Blisters</Option>
              <Option value="dry-skin">Dry/Flaky Skin</Option>
              <Option value="discoloration">Discoloration</Option>
              <Option value="bleeding">Bleeding</Option>
              <Option value="other">Other (specify in description)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="conditionDescription"
            label="Detailed Description"
            rules={[{ required: true, message: 'Please describe the condition' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the appearance, texture, color, and any changes you've noticed over time" 
            />
          </Form.Item>

          <Divider />

          {/* Medical History */}
          <Title level={5}>Relevant Medical History</Title>
          
          <Form.Item
            name="skinHistory"
            label="Previous Skin Conditions"
          >
            <Select mode="multiple" placeholder="Select any previous skin conditions">
              <Option value="eczema">Eczema</Option>
              <Option value="psoriasis">Psoriasis</Option>
              <Option value="rosacea">Rosacea</Option>
              <Option value="acne">Acne</Option>
              <Option value="dermatitis">Dermatitis</Option>
              <Option value="hives">Hives</Option>
              <Option value="skin-cancer">Skin Cancer</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="allergies"
            label="Known Allergies"
          >
            <TextArea rows={2} placeholder="List any known allergies (medications, food, environmental)" />
          </Form.Item>
          
          <Form.Item
            name="currentTreatments"
            label="Current Treatments"
          >
            <TextArea 
              rows={3} 
              placeholder="List any treatments you have tried for this condition (prescription medications, over-the-counter products, home remedies)" 
            />
          </Form.Item>
          
          <Divider />

          {/* Additional Information */}
          <Form.Item
            name="additionalNotes"
            label="Additional Information"
          >
            <TextArea 
              rows={4} 
              placeholder="Any other information that might be relevant (recent travel, new products, dietary changes, stress levels, etc.)" 
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
              Submit Skin Condition Assessment
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InputSection;