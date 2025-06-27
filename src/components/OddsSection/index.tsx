'use client';
import React from 'react';
import OddsTable from '../OddsTable';
import BetSlip from '../BetSlip';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface OddsSectionProps {
  showBetslip: boolean;
  setShowBetslip: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOdds: React.Dispatch<React.SetStateAction<boolean>>;
}

const OddsSection = ({ showBetslip, setShowBetslip, setShowOdds }: OddsSectionProps) => {
  const betslipItems = useSelector((state: RootState) => state.betSlipState.items);

  return (
    <div className="odds-section">
      <div className="section__header">
        <div className="odds-switch">
          <div className={`switch__item ${!showBetslip ? '--active' : ''}`} onClick={() => setShowBetslip(false)}>
            COMPARE ODDS
          </div>
          <div className={`switch__item ${showBetslip ? '--active' : ''}`} onClick={() => setShowBetslip(true)}>
            BETSLIP <span className="btn-counter">{betslipItems?.length}</span>
          </div>
        </div>
        <img
          className="header__back-btn"
          src="/images/svg/arrow.svg"
          alt="back button"
          onClick={() => {
            setShowOdds(false);
            setShowBetslip(false);
          }}
        />
      </div>
      {showBetslip ? <BetSlip /> : <OddsTable />}
    </div>
  );
};

export default OddsSection;
