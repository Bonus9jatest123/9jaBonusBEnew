'use client';
import React, { useEffect, useState } from 'react';
import OddsSection from '../OddsSection';
import BetsSection from '../BetsSection';
import BetActionBar from '../BetActionBar';
import { Fixture } from '@/types/commonTypes';
import { useDispatch } from 'react-redux';
import { setFixtures } from '@/redux/features/fixturesSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearOldBetslip, getBestBookie, getBestOddsTotal, getBonusInfo, getBookies } from '@/lib/utils';
import { Offer } from '../TabCards';
import { setBookies } from '@/redux/features/bookiesSlice';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { setSelectedBookie, setTotalOdds } from '@/redux/features/betslipSlice';
import { setBonus } from '@/redux/features/bonusSlice';

interface FixturesDashboardProps {
  fixtures: Fixture[];
}

const FixturesDashboard = ({ fixtures }: FixturesDashboardProps) => {
  const dispatch = useDispatch();
  const bookiesFromState = useSelector((state: RootState) => state.bookiesState.bookies);
  const betslipState = useSelector((state: RootState) => state.betSlipState);
  const bonusInfo = useSelector((state: RootState) => state.bonusState.bonusInfo);
  const betslipItems = betslipState?.items;

  const [showOdds, setShowOdds] = useState(false);
  const [showBetslip, setShowBetslip] = useState(false);

  useEffect(() => {
    clearOldBetslip();
  }, []);

  const showActionBar = betslipItems?.length > 0;

  useEffect(() => {
    dispatch(setFixtures(fixtures));
  }, [fixtures]);

  // get bookies info
  useEffect(() => {
    if (!bookiesFromState || Object.entries(bookiesFromState).length === 0) {
      axios
        .get(`${API_ENDPOINT}/offers?pageNumber=1&pageSize=10000&disabled=true`)
        .then((res: { data: { offers: Offer[] } }) => {
          const offers = res?.data?.offers;
          const bookies = getBookies(offers);
          dispatch(setBookies(bookies));
          const bonus = getBonusInfo(betslipItems, bookiesFromState);
          dispatch(setBonus(bonus));
        })
        .catch((error: any) => {
          console.log('Offers error: ', error);
        });
    }
  }, []);

  // update best odds
  useEffect(() => {
    if (betslipItems?.length === 0) dispatch(setTotalOdds(0));
    else {
      const bestOddsTotal = getBestOddsTotal(betslipState.totalOddsPerBookie, bonusInfo);
      dispatch(setTotalOdds(bestOddsTotal));
    }
  }, [betslipState, bookiesFromState, bonusInfo]);

  // update bonus info
  useEffect(() => {
    const bonus = getBonusInfo(betslipItems, bookiesFromState);
    dispatch(setBonus(bonus));
  }, [betslipState, bookiesFromState]);

  // update selected bookie
  useEffect(() => {
    const bestBookie = getBestBookie(betslipState?.totalOddsPerBookie, bonusInfo);
    dispatch(setSelectedBookie(bestBookie));
  }, [betslipState?.totalOddsPerBookie, bonusInfo]);

  return (
    <div className="bets-dashboard" style={{ paddingBottom: showActionBar ? '120px' : 0 }}>
      {showOdds ? <OddsSection showBetslip={showBetslip} setShowBetslip={setShowBetslip} setShowOdds={setShowOdds} /> : <BetsSection />}
      {showActionBar && <BetActionBar showOdds={showOdds} setShowOdds={setShowOdds} showBetslip={showBetslip} setShowBetslip={setShowBetslip} />}
    </div>
  );
};

export default FixturesDashboard;
