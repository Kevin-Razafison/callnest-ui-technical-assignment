import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;