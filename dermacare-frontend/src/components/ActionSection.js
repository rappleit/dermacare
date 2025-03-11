'use client';
import React from 'react';
import { ReloadOutlined, UserSwitchOutlined } from '@ant-design/icons';

const ActionSection = () => {
  return (
    <div className="w-lg mb-8">
      <div className="bg-white rounded-lg  border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <span>Next Steps</span>
          </h2>
        </div>
        
        <div className="p-6 flex flex-col  justify-center gap-4">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer">
            <ReloadOutlined className="mr-2" />
            Reset
          </button>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer">
            <UserSwitchOutlined className="mr-2" />
            Generate Referral
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSection;