import React from 'react';
import FixturesDashboard from '@/components/FixturesDashboard';
import { API_ENDPOINT } from '@/lib/constants';

const Bet = async () => {
  const res = await fetch(`${API_ENDPOINT}/odds?pageNumber=1&pageSize=10000`, { cache: 'no-store' });
  const data = await res?.json();
  const fixtures = data?.odds || [];

  

  return (
    <div className="bet-page">
      <FixturesDashboard fixtures={fixtures} />
    </div>
  );
};

export default Bet;
