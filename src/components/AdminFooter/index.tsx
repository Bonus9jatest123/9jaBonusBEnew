'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FooterForm from '../FooterForm/index';
import AdminFooterTable from '../AdminFooterTable/index';
import { hasPermission } from '@/redux/hasPermissions';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getCookie, removeCookie, removeUserCookie } from '@/lib/cookies';

const AdminFooter = () => {
  const [showFormId, setShowFormId] = useState(null);
  const currentState = useSelector((state: RootState) => state);
   const token = getCookie('token');
  useEffect(() => {
     if (!token) {
      toast.error('You are not authorized to access this page.');
      window.location.href = '/admin/login';
       
    }
    const footerPermission = hasPermission('Footers', currentState);
    if (currentState?.userPermissionState.currentUser) {
      if (!footerPermission) {
        toast.error('You do not have permission to access this page.');
        removeCookie('token');
        removeUserCookie('user');
        window.location.href = '/admin/login';
      }
    }
     
  }, [token,currentState?.userPermissionState.currentUser]);
 
  return <>{showFormId ? <FooterForm formId={showFormId} setShowFormId={setShowFormId} /> : <AdminFooterTable setShowFormId={setShowFormId} />}</>;
};

export default AdminFooter;
