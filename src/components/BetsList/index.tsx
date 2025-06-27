import React, { useEffect, useState } from 'react';
import BetCard from '../BetCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { filterFixtures } from '@/lib/utils';
import { Fixture } from '@/types/commonTypes';

const BetsList = () => {
  const allFixtures = useSelector((state: RootState) => state.fixturesState.fixtures);
  const selectedFilters = useSelector((state: RootState) => state.fixturesState.filters);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    const filteredFixtures = filterFixtures(allFixtures, selectedFilters);
    setFixtures(filteredFixtures);
  }, [allFixtures, selectedFilters]);

  const dateParts = selectedFilters.day.date.split('.');
  const headerDate = `${dateParts[0]}/${dateParts[1]} ${selectedFilters.day.fullName}`;

  return (
    <div className="bets-list">
      <div className="list__header bet-header">
        <div className="header__date">{headerDate}</div>
        <div className="header__x">
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </div>
      </div>
      <div className="list__container">
        {fixtures?.length > 0 ? fixtures?.map((fixture) => <BetCard key={fixture._id} fixture={fixture} />) : <div className="no-data text-light">No fixtures</div>}
      </div>
    </div>
  );
};

export default BetsList;
