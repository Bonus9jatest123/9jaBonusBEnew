import React from 'react';
import AdminOdds from '@/components/AdminOdds';
import { API_ENDPOINT } from '@/lib/constants';

const AdminOddsPage = async () => {
  const response = await fetch(`${API_ENDPOINT}/offers?pageNumber=1&pageSize=10000&disabled=true`, { cache: 'no-store' });
  const offersData = await response?.json();
  const offers = offersData?.offers || [];

  return <AdminOdds offers={offers} />;
};

export default AdminOddsPage;
