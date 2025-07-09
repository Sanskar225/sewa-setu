// src/components/ProviderPanel/ProviderLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProviderLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar (you can create one like UserSidebar) */}
      <div className="w-64 bg-black text-white min-h-screen p-4">
        <h2 className="text-lg font-bold mb-4">Provider Panel</h2>
        {/* Add NavLinks here */}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default ProviderLayout;
