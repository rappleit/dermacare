'use client';
import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Form,
  Input,
  Select,
  Button,
  Empty,
  Modal,
  Spin,
  message
} from 'antd';
import { 
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { generateReferralPDF, downloadPDF } from '@/utils/ReferralService';
import { PDFViewer } from '@react-pdf/renderer';
import ReferralPDF from '@/utils/PDFGenerator';

const { Title } = Typography;
const { Option } = Select;

const ReferralSection = ({ diagnosisResult, isLoading, formData }) => {
  const [form] = Form.useForm();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [pdfKey, setPdfKey] = useState(Date.now()); // Add a key to force regeneration

  const parseResponse = (response) => {
    try {
      const jsonStr = response.response.replace(/```json\n|\n```/g, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse diagnosis response:', error);
      return [];
    }
  };

  const getDiagnoses = () => {
    if (!diagnosisResult) return [];
    return parseResponse(diagnosisResult).map(d => d.Diagnosis);
  };

  const generatePDF = async (values) => {
    setIsGenerating(true);
    try {
      // Store form data for preview modal
      setReferralData(values);
      
      // Generate PDF blob
      const diagnosisData = parseResponse(diagnosisResult);
      const blob = await generateReferralPDF(values, formData, diagnosisData);
      
      // Update PDF key to ensure it's treated as a new document
      setPdfKey(Date.now());
      setPdfBlob(blob);
      
      return blob;
    } catch (error) {
      console.error('Failed to generate referral:', error);
      message.error('Failed to generate referral: ' + error.message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (values) => {
    const blob = await generatePDF(values);
    if (blob) {
      // Show preview modal
      setPreviewVisible(true);
      message.success('Referral generated successfully');
    }
  };

  const handleDownload = async () => {
    // Generate a fresh PDF for download
    const blob = pdfBlob || await generatePDF(referralData);
    
    if (blob) {
      const patientName = referralData.name.replace(/\s+/g, '-').toLowerCase();
      const filename = `${patientName}-dermatology-referral.pdf`;
      downloadPDF(blob, filename);
      message.success('Referral downloaded successfully');
    }
  };

  const regeneratePDF = async () => {
    if (referralData) {
      const blob = await generatePDF(referralData);
      if (blob) {
        message.success('Referral regenerated successfully');
      }
    }
  };

  if (!diagnosisResult) {
    return (
      <Card 
        className="w-full mb-8"
        title={
          <Title level={4} className="flex items-center gap-2">
            <FileTextOutlined /> Generate Referral
          </Title>
        }
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Please generate a diagnosis first"
        />
      </Card>
    );
  }

  return (
    <Card 
      className="w-full mb-8"
      title={
        <Title level={4} className="flex items-center gap-2">
          <FileTextOutlined /> Generate Referral
        </Title>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isLoading}
        className="w-full"
      >
        <Form.Item
          name="name"
          label="Patient Name"
          rules={[{ required: true, message: 'Please enter patient name' }]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Enter patient name" 
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^[0-9+-]+$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined className="text-gray-400" />} 
            placeholder="Enter phone number" 
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter email address' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<MailOutlined className="text-gray-400" />} 
            placeholder="Enter email address" 
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="selectedDiagnosis"
          label="Select Primary Diagnosis"
          rules={[{ required: true, message: 'Please select a diagnosis' }]}
        >
          <Select 
            placeholder="Select a diagnosis"
            className="w-full"
          >
            {getDiagnoses().map(diagnosis => (
              <Option key={diagnosis} value={diagnosis}>
                {diagnosis}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<FilePdfOutlined />}
            loading={isGenerating}
            className="w-full"
          >
            Generate Referral
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FilePdfOutlined className="text-blue-500" />
            <span>Referral Preview</span>
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={900}
        footer={[
          <Button
            key="regenerate"
            icon={<ReloadOutlined />}
            onClick={regeneratePDF}
            disabled={isGenerating}
            className="mr-2"
          >
            Regenerate
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-blue-500"
          >
            Download PDF
          </Button>
        ]}
        bodyStyle={{ height: '80vh' }}
      >
        <div className="h-full w-full flex flex-col">
          {referralData && (
            <div className="bg-gray-100 mb-4 p-3 rounded">
              <p className="text-gray-700 mb-0">
                <strong>Patient:</strong> {referralData.name} | 
                <strong className="ml-2">Diagnosis:</strong> {referralData.selectedDiagnosis}
              </p>
            </div>
          )}
          
          {isGenerating ? (
            <div className="flex-1 flex items-center justify-center">
              <Spin size="large" tip="Generating referral document..." />
            </div>
          ) : pdfBlob ? (
            <div className="flex-1 border border-gray-200 rounded">
              <iframe 
                src={URL.createObjectURL(pdfBlob)} 
                className="w-full h-full"
                title="Referral PDF Preview"
                key={pdfKey} // Add key to force iframe refresh
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Spin tip="Loading PDF preview..." />
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default ReferralSection;