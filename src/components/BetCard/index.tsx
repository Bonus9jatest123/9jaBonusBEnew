import React, { useEffect, useState } from 'react';
import Tag from '../Tag';
import BetCheckbox from '../BetCheckbox';
import { Fixture } from '@/types/commonTypes';
import { getDateAndTime } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BetslipItem, SelectedOdds, addItem, removeItem } from '@/redux/features/betslipSlice';

interface BetCardProps {
  fixture: Fixture;
}

const BetCard = ({ fixture }: BetCardProps) => {
  const dispatch = useDispatch();
  const { date, time } = getDateAndTime(fixture?.eventDateTime);
  const homeWin = fixture?.bestCalculatedOdds?.homeWin?.value?.toFixed(2);
  const draw = fixture?.bestCalculatedOdds?.draw?.value?.toFixed(2);
  const awayWin = fixture?.bestCalculatedOdds?.awayWin?.value?.toFixed(2);
  const betslipItems = useSelector((state: RootState) => state.betSlipState.items);
  const itemInBetlsip = betslipItems.find((item) => item._id === fixture._id);

  const [selectedOdds, setSelectedOdds] = useState<SelectedOdds | null>(itemInBetlsip ? itemInBetlsip?.selectedOdds : null);

  useEffect(() => {
    const item: BetslipItem = {
      _id: fixture._id,
      league: fixture.league,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      selectedOdds,
      odds: fixture.odds
    };
    if (selectedOdds === null) dispatch(removeItem(item));
    else dispatch(addItem(item));
  }, [selectedOdds]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, type: string, bookie: string) => {
    if (selectedOdds?.value == e.target.value && selectedOdds.type === type) setSelectedOdds(null);
    else {
      const odd: SelectedOdds = {
        value: e.target.value,
        type,
        bookie
      };
      setSelectedOdds(odd);
    }
  };

  return (
    <div className="bet-card">
      <div className="card__info">
        <div className="info__league">{fixture?.league}</div>
        <div className="info__match">
          <div className="match__time">
            <span>{date}</span>
            <span>{time}</span>
          </div>
          <div className="match__teams">
            <div className="teams__1">{fixture?.homeTeam}</div>
            <div>{fixture?.awayTeam}</div>
          </div>
        </div>
      </div>
      <div className="card__options">
        <div className="options__tags">
          <Tag variant="hot" />
          <Tag variant="best" />
        </div>
        <div className="options__inputs">
          <BetCheckbox
            id={fixture._id}
            label={homeWin}
            value={homeWin}
            checked={selectedOdds?.type === 'homeWin' && selectedOdds?.value == homeWin?.toString()}
            onChange={(e) => handleRadioChange(e, 'homeWin', fixture.bestCalculatedOdds.homeWin.bookie)}
          />
          <BetCheckbox
            id={fixture._id}
            label={draw}
            value={draw}
            checked={selectedOdds?.type === 'draw' && selectedOdds?.value == draw?.toString()}
            onChange={(e) => handleRadioChange(e, 'draw', fixture.bestCalculatedOdds.draw.bookie)}
          />
          <BetCheckbox
            id={fixture._id}
            label={awayWin}
            value={awayWin}
            checked={selectedOdds?.type === 'awayWin' && selectedOdds?.value == awayWin?.toString()}
            onChange={(e) => handleRadioChange(e, 'awayWin', fixture.bestCalculatedOdds.awayWin.bookie)}
          />
        </div>
      </div>
    </div>
  );
};

export default BetCard;
