'use client';
import { useState } from 'react';

import FooterForm from '../FooterForm/index';

import AdminFooterTable from '../AdminFooterTable/index';

const AdminFooter = () => {
  const [showFormId, setShowFormId] = useState(null);
  return <>{showFormId ? <FooterForm formId={showFormId} setShowFormId={setShowFormId} /> : <AdminFooterTable setShowFormId={setShowFormId} />}</>;
};

export default AdminFooter;
