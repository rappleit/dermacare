'use client';
import React from 'react';
import { 
  Card, 
  Typography, 
  Empty, 
  Alert 
} from 'antd';
import { 
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DiagnosisSection = () => {
  return (
    <Card 
    className='w-3xl'
      title={
        <Title level={4}>
          <MedicineBoxOutlined /> Differential Diagnosis
        </Title>
      }
    >
      <div className="flex flex-col justify-center items-center h-128">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              Awaiting image upload and patient history submission
            </span>
          }
        >
        </Empty>
      </div>
    </Card>
  );
};

export default DiagnosisSection;