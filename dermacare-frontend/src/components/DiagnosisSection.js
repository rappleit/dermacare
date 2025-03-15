'use client';
import React from 'react';
import { 
  Card, 
  Typography, 
  Empty, 
  Spin,
  Collapse,
  List,
  Tag
} from 'antd';
import { 
  MedicineBoxOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const DiagnosisSection = ({ diagnosisResult, isLoading }) => {
  const parseResponse = (response) => {
    try {
      // Log the raw response for debugging
      console.log("Raw response:", response);

      // Remove markdown code block syntax and parse JSON
      const jsonStr = response.response.replace(/```json\n|\n```/g, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse diagnosis response:', error);
      console.error('Response content:', response); // Log the response content
      return [];
    }
  };

  const renderDiagnosis = (diagnosis) => (
    <Panel 
      header={
        <div className="flex items-center justify-between w-3xl">
          <Text strong>{diagnosis.Diagnosis}</Text>
          <Tag color="blue">{diagnosis.Diagnosis}</Tag>
        </div>
      }
      key={diagnosis.Diagnosis}
    >
      <div className="space-y-4">
        <div>
          <Title level={5} className="flex items-center gap-2">
            <WarningOutlined className="text-yellow-500" />
            Risk Factors
          </Title>
          <List
            size="small"
            dataSource={diagnosis["Risk factors"]}
            renderItem={(item) => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </div>

        <div>
          <Title level={5} className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" />
            Clinical Features
          </Title>
          <List
            size="small"
            dataSource={diagnosis["Clinical features"]}
            renderItem={(item) => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Panel>
  );

  return (
    <Card 
      className="max-w-xl w-xl"
      title={
        <Title level={4}>
          <MedicineBoxOutlined /> Differential Diagnosis
        </Title>
      }
    >
      <div className="min-h-[600px]">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[500px]">
            <Spin size="large" tip="Analyzing image and patient history..." />
          </div>
        ) : !diagnosisResult ? (
          <div className="flex flex-col justify-center items-center h-[500px]">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Awaiting image upload and patient history submission
                </span>
              }
            />
          </div>
        ) : (
          <div className="w-full">
            <Collapse defaultActiveKey={[parseResponse(diagnosisResult)[0]?.Diagnosis]}>
              {parseResponse(diagnosisResult).map(diagnosis => 
                renderDiagnosis(diagnosis)
              )}
            </Collapse>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DiagnosisSection;