'use client';
import { getCurrentWeekDays } from '@/lib/utils';
import { setFilters } from '@/redux/features/fixturesSlice';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const days = getCurrentWeekDays();

const DayFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.fixturesState.filters);
  const [selected, setSelected] = useState(filters.day.name);

  const handleChange = (day: { name: string; fullName: string; date: string }) => {
    setSelected(day.name);
    dispatch(setFilters({ ...filters, day }));
  };

  return (
    <div className="day-filter">
      {/* <div className="filter__live" onClick={() => toast.info('Coming soon')}>
        <img src="/images/svg/playButton.svg" alt="" />
        LIVE
      </div> */}
      <div className="filter__days">
        {days.map((day) => (
          <div className={selected === day.name ? 'days__day --selected' : 'days__day'} onClick={() => handleChange(day)} key={day.name}>
            <div className="day__name">{day.name}</div>
            <div className="day__date">{day.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayFilter;
