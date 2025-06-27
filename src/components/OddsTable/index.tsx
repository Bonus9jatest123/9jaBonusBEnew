import { getValueWithBonus } from '@/lib/utils';
import { BonusInfo } from '@/redux/features/bonusSlice';
import { RootState } from '@/redux/store';
import { OddsProduct, bookie } from '@/types/commonTypes';
import React from 'react';
import { useSelector } from 'react-redux';

function getTableData(oddsPerBookie: OddsProduct, bookies: bookie, bonusInfo: BonusInfo) {
  return Object.keys(oddsPerBookie).map((bookie) => {
    const bonus = bonusInfo[bookie]?.bonus;
    const icon = bookies[bookie]?.icon;
    const odds = oddsPerBookie[bookie];
    const totalOdds = getValueWithBonus(odds, bonus);

    return {
      bookie,
      odds,
      bonus,
      totalOdds,
      icon
    };
  });
}

const OddsTable = () => {
  const betslip = useSelector((state: RootState) => state.betSlipState);
  const bookies = useSelector((state: RootState) => state.bookiesState.bookies);
  const bonusInfo = useSelector((state: RootState) => state.bonusState.bonusInfo);
  const tableData = getTableData(betslip.totalOddsPerBookie, bookies, bonusInfo).sort((a, b) => b.totalOdds - a.totalOdds);

  const handleRowClick = (bookie: string) => {
    window.open(bookies[bookie].url);
  };

  return (
    <div className="odds-table">
      <div className="table__header">
        <div className="table__column">BOOKIE</div>
        <div className="table__column">ODDS</div>
        <div className="table__column">BONUS</div>
        <div className="table__column">TOTAL ODDS</div>
      </div>
      <div className="table__body">
        {tableData?.map(
          (item, index) =>
            item.totalOdds > 1 && (
              <div className={index === 0 ? 'body__row --active' : 'body__row'} key={item?.bookie} onClick={() => handleRowClick(item?.bookie)}>
                <div className="table__column">
                  <img className="column__bookie-icon" src={item?.icon} />
                </div>
                <div className="table__column">{item?.odds?.toFixed(2)}</div>
                <div className="table__column">+{item?.bonus}%</div>
                <div className="table__column">
                  <span className="row__odds">{item?.totalOdds?.toFixed(2) || 0}</span>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default OddsTable;
