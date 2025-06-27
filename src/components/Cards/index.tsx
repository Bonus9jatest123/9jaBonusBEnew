import React from 'react';
import { KeyInfo } from '../TabCardOpen';

const Card = (props: KeyInfo) => {
  const { infoImage, upTo, wageringRollover, minOdds } = props;
  return (
    <>
      <div className="card-container">
        <img src={infoImage} />
        <div className="container__info">
          <div className="row-1">
            <div className="black-font">Bonus:</div>
            <div className="green-font">{upTo}</div>
          </div>
          <div className="row-1">
            <div className="black-font">Turnover:</div>
            <div className="green-font">{wageringRollover}</div>
          </div>
          <div className="row-1">
            <div className="black-font">Min Odds:</div>
            <div className="green-font">{minOdds}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
