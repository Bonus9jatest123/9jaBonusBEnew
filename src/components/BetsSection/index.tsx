import React, { useEffect, useState } from 'react';
import CustomSelect, { Option } from '../CustomSelect';
import BetsList from '../BetsList';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/redux/features/fixturesSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { sortingOptions } from '@/lib/constants';
import DayFilter from '../DayFilter';
import { getDateForFilters, getLeagueOptions } from '@/lib/utils';
import Footer from '../Footer/index';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { findItemByKey } from '@/lib/utils';

const BetsSection = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state: RootState) => state.fixturesState.filters);
  const allFixtures = useSelector((state: RootState) => state.fixturesState.fixtures);
  const filteredFixtures = allFixtures.filter((item) => getDateForFilters(item.eventDateTime) === currentFilters.day.date);
  const leagueOptions = getLeagueOptions(filteredFixtures);

  const handleCompetitionChange = (option: Option) => {
    dispatch(setFilters({ ...currentFilters, league: option.value }));
  };

  const handleSortChange = (option: Option) => {
    dispatch(setFilters({ ...currentFilters, sortBy: option.value }));
  };

  const leagueDefaultValue = { label: currentFilters.league === '*' ? 'All' : currentFilters.league, value: currentFilters.league };

  const [footers, setFooters] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/footer/footers`)
      .then((response: { data: any }) => {
        const footers = response?.data;
        //  dispatch(setOdds(odds));
        setFooters(footers);
      })
      .catch((error: any) => {
        console.log('Odds error: ', error);
      });
    let blogs = [];
    try {
      const blogsRaw = localStorage.getItem('blogs');
      blogs = blogsRaw ? JSON.parse(blogsRaw) : [];
    } catch (err) {
      // console.error('Failed to parse blogs:', err);
      blogs = [];
    }
    

  }, []);

  const item = findItemByKey(footers, 'name', 'Odds footer');
  const itemAllFooters = findItemByKey(footers, 'name', 'Set All Footers');
  return (
    <div className="bets-section">
      <div className="filters">
        <DayFilter />
        <div className="filters__competition">
          <CustomSelect className="competition__game" label="League" options={leagueOptions} defaultValue={leagueDefaultValue} expandedOptions={true} onChange={handleCompetitionChange} />
          {/* comming soon */}
          {/* <CustomSelect className="competition__time" label="Sort by" options={sortingOptions} defaultValue={sortingOptions[0]} onChange={handleSortChange} /> */}
          <div className={`select-element competition__time`}>
            <div className="element__label text-light">Sort by:</div>
            <div className="element__selector">Time</div>
          </div>
        </div>
      </div>
      <BetsList />
      {item?.status == 'active' ? <Footer data={item} /> : itemAllFooters?.status == 'active' ? <Footer data={itemAllFooters} /> : null}
    </div>
  );
};

export default BetsSection;
