'use client';
import React from 'react';
import { Button } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';

const ActionSection = ({ onReset, isLoading }) => {
  return (
    <div className="w-full mb-8">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <span>Actions</span>
          </h2>
        </div>
        
        <div className="p-6 flex flex-col justify-center gap-4">
          <Button onClick={onReset} disabled={isLoading}>
            Reset
          </Button>
          
        </div>
      </div>
    </div>
  );
};

export default ActionSection;