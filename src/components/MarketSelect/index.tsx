'use client';
import React, { useState } from 'react';

const MarketSelect = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <div className="market-select">
        <div className={showOptions ? 'custom-select-control select__control --active' : 'custom-select-control select__control'} onClick={() => setShowOptions(!showOptions)}>
          <img className="control__info" src="/images/svg/infoIcon.svg" alt="" />
          <input placeholder="Search" className="control__input" type="text" onChange={() => setShowOptions(true)} />
          <span className="control__label">Select Market</span>
          <img className="control__icon" src="/images/svg/arrow.svg" alt="" />
        </div>
      </div>
      {showOptions && (
        <div className="select__options">
          <div className="options__header bet-header">
            <span className="header__item --active">POPULAR</span>
            <span className="header__item">GOALS</span>
            <span className="header__item">COMBO</span>
            <span className="header__item">FIRST HALF</span>
            <span className="header__item">SECOND HALF</span>
            <span className="header__item">COMBO</span>
            <span className="header__item">POPULAR</span>
            <span className="header__item">SECOND HALF</span>
          </div>
          <div className="options__body">
            <div className="body__item">Double Chance</div>
            <div className="body__item">Double Chance</div>
            <div className="body__item">Double Chance</div>
            <div className="body__item">Double Chance</div>
            <div className="body__item">Double Chance</div>
            <div className="body__item">Double Chance</div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketSelect;
