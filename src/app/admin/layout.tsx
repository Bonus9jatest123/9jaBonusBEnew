import Header from '@/components/Header';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="admin-layout">
      <Header />
      {children}
    </div>
  );
};

export default AdminLayout;
