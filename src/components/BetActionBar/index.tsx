'use client';
import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

interface BetActionBarProps {
  showOdds: boolean;
  setShowOdds: React.Dispatch<React.SetStateAction<boolean>>;
  showBetslip: boolean;
  setShowBetslip: React.Dispatch<React.SetStateAction<boolean>>;
}

const BetActionBar = ({ showOdds, setShowOdds, showBetslip, setShowBetslip }: BetActionBarProps) => {
  const betslipState = useSelector((state: RootState) => state.betSlipState);
  const bookies = useSelector((state: RootState) => state.bookiesState.bookies);

  const handleBestOddsClick = () => {
    setShowBetslip(false);
    if (!showOdds) setShowOdds(true);
    if (showOdds && !showBetslip) setShowOdds(false);
  };

  const handleBetslipClick = () => {
    setShowBetslip(true);
    if (!showOdds) setShowOdds(true);
    if (showOdds && showBetslip) setShowOdds(false);
  };

  return (
    <div className="bet-action-bar">
      {showOdds && !showBetslip && <div className="bar__note">Multiple bonus is included in the total odds</div>}
      <div className="bar__filter">
        <div className="filter__select">
          <span>BEST ODDS:</span>
          <div className={`custom-select-control select__control ${showOdds ? '--active' : ''}`} onClick={handleBestOddsClick}>
            <img className="control__label" src={bookies[betslipState?.selectedBookie]?.icon} alt="bookie logo" />
            <img className="control__icon" src="/images/svg/arrow.svg" alt="" />
          </div>
        </div>
      </div>

      <div className="bar__bet-slip">
        <div className="best__value">{betslipState?.totalOdds?.toFixed(2)}</div>
        <button className={`select__slip-btn  ${showOdds && showBetslip ? '--active' : ''}`} onClick={handleBetslipClick}>
          Betslip
          <span className="btn-counter">{betslipState?.items?.length}</span>
        </button>
      </div>

      <button className="bar__action-btn" onClick={() => window.open(bookies[betslipState?.selectedBookie]?.url)}>
        PLACE BET
      </button>
    </div>
  );
};

export default BetActionBar;
