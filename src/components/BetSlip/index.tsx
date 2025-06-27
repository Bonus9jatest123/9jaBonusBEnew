import { BetslipItem, removeItem } from '@/redux/features/betslipSlice';
import { RootState } from '@/redux/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const BetSlip = () => {
  const dispatch = useDispatch();
  const betslipItems = useSelector((state: RootState) => state.betSlipState.items);

  const handleRemove = (item: BetslipItem) => {
    dispatch(removeItem(item));
  };

  return (
    <div className="betslip">
      {betslipItems?.map((item) => {
        let selection;
        if (item?.selectedOdds?.type === 'homeWin') selection = item.homeTeam;
        else if (item?.selectedOdds?.type === 'awayWin') selection = item.awayTeam;
        else selection = 'Draw';

        return (
          <div className="slip__item" key={item._id}>
            <img className="item__bin" src="/images/svg/bin.svg" alt="" onClick={() => handleRemove(item)} />
            <div className="item__details">
              <div className="details__heading">{`${selection}`}</div>
              <div className="details__info">{'Fulltime Result (1X2)'}</div>
              <div className="details__info">{`${item?.homeTeam} v ${item?.awayTeam}`}</div>
            </div>
            <div className="item__value">{item?.selectedOdds?.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BetSlip;
