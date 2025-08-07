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
import { getCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';
import HandleError from '@/handleError';

interface FixturesDashboardProps {
  fixtures: Fixture[];
}

// const FixturesDashboard = ({ fixtures }: FixturesDashboardProps) => {
//   const dispatch = useDispatch();
//   const bookiesFromState = useSelector((state: RootState) => state.bookiesState.bookies);
//   const betslipState = useSelector((state: RootState) => state.betSlipState);
//   const bonusInfo = useSelector((state: RootState) => state.bonusState.bonusInfo);
//   const betslipItems = betslipState?.items;

//   const [showOdds, setShowOdds] = useState(false);
//   const [showBetslip, setShowBetslip] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null; 


//   const token = getCookie('token');

//   const showActionBar = betslipItems?.length > 0;


//   // get bookies info
//   useEffect(() => {
//     if (!bookiesFromState || Object.entries(bookiesFromState).length === 0) {
//       axios
//         .get(`${API_ENDPOINT}/offers/frontend/?pageNumber=1&pageSize=10000&disabled=true`
//       //     , {
         
//       //   headers: {
//       //     'x-auth-token': token
//       //   }
//       // }
//     )
//         .then((res: { data: { offers: Offer[] } }) => {
//           const offers = res?.data?.offers;
//           const bookies = getBookies(offers);
//           dispatch(setBookies(bookies));
//           const bonus = getBonusInfo(betslipItems, bookiesFromState);
//           dispatch(setBonus(bonus));
//         })
//         .catch((error: any) => {
//           console.log('Offers error: ', error);
//             toast.error(error?.response?.data?.message || 'Something went wrong');
//         // HandleError(error);
//         });
//     }
//   }, []);
//     useEffect(() => {
//     clearOldBetslip();
//   }, []);
  
//   useEffect(() => {
//     dispatch(setFixtures(fixtures));
//   }, [fixtures]);

//   // update best odds
//   useEffect(() => {
//     if (betslipItems?.length === 0) dispatch(setTotalOdds(0));
//     else {
//       const bestOddsTotal = getBestOddsTotal(betslipState.totalOddsPerBookie, bonusInfo);
//       dispatch(setTotalOdds(bestOddsTotal));
//     }
//   }, [betslipState, bookiesFromState, bonusInfo]);

//   // update bonus info
//   useEffect(() => {
//     const bonus = getBonusInfo(betslipItems, bookiesFromState);
//     dispatch(setBonus(bonus));
//   }, [betslipState, bookiesFromState]);

//   // update selected bookie
//   useEffect(() => {
//     const bestBookie = getBestBookie(betslipState?.totalOddsPerBookie, bonusInfo);
//     dispatch(setSelectedBookie(bestBookie));
//   }, [betslipState?.totalOddsPerBookie, bonusInfo]);

//   return (
//     <div className="bets-dashboard" style={{ paddingBottom: showActionBar ? '120px' : 0 }}>
//       {showOdds ? <OddsSection showBetslip={showBetslip} setShowBetslip={setShowBetslip} setShowOdds={setShowOdds} /> : <BetsSection />}
//       {showActionBar && <BetActionBar showOdds={showOdds} setShowOdds={setShowOdds} showBetslip={showBetslip} setShowBetslip={setShowBetslip} />}
//     </div>
//   );
// };

// export default FixturesDashboard;

const FixturesDashboard = ({ fixtures }: FixturesDashboardProps) => {
  const dispatch = useDispatch();
  const bookiesFromState = useSelector((state: RootState) => state.bookiesState.bookies);
  const betslipState = useSelector((state: RootState) => state.betSlipState);
  const bonusInfo = useSelector((state: RootState) => state.bonusState.bonusInfo);
  const betslipItems = betslipState?.items;

  const [showOdds, setShowOdds] = useState(false);
  const [showBetslip, setShowBetslip] = useState(false);
  const [mounted, setMounted] = useState(false);

  const token = getCookie('token');
  const showActionBar = betslipItems?.length > 0;

  // ✅ All hooks are declared unconditionally
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    clearOldBetslip();
  }, []);

  useEffect(() => {
    dispatch(setFixtures(fixtures));
  }, [fixtures]);

  useEffect(() => {
    if (!bookiesFromState || Object.entries(bookiesFromState).length === 0) {
      axios
        .get(`${API_ENDPOINT}/offers/frontend/?pageNumber=1&pageSize=10000&disabled=true`)
        .then((res: { data: { offers: Offer[] } }) => {
          const offers = res?.data?.offers;
          const bookies = getBookies(offers);
          dispatch(setBookies(bookies));
          const bonus = getBonusInfo(betslipItems, bookiesFromState);
          dispatch(setBonus(bonus));
        })
        .catch((error: any) => {
          console.log('Offers error: ', error);
          toast.error(error?.response?.data?.message || 'Something went wrong');
        });
    }
  }, []);

  useEffect(() => {
    if (betslipItems?.length === 0) dispatch(setTotalOdds(0));
    else {
      const bestOddsTotal = getBestOddsTotal(betslipState.totalOddsPerBookie, bonusInfo);
      dispatch(setTotalOdds(bestOddsTotal));
    }
  }, [betslipState, bookiesFromState, bonusInfo]);

  useEffect(() => {
    const bonus = getBonusInfo(betslipItems, bookiesFromState);
    dispatch(setBonus(bonus));
  }, [betslipState, bookiesFromState]);

  useEffect(() => {
    const bestBookie = getBestBookie(betslipState?.totalOddsPerBookie, bonusInfo);
    dispatch(setSelectedBookie(bestBookie));
  }, [betslipState?.totalOddsPerBookie, bonusInfo]);

  // ✅ Conditional rendering should happen here, after all hooks
  if (!mounted) return null;

  return (
    <div className="bets-dashboard" style={{ paddingBottom: showActionBar ? '120px' : 0 }}>
      {showOdds ? (
        <OddsSection showBetslip={showBetslip} setShowBetslip={setShowBetslip} setShowOdds={setShowOdds} />
      ) : (
        <BetsSection />
      )}
      {showActionBar && (
        <BetActionBar
          showOdds={showOdds}
          setShowOdds={setShowOdds}
          showBetslip={showBetslip}
          setShowBetslip={setShowBetslip}
        />
      )}
    </div>
  );
};

export default FixturesDashboard;

