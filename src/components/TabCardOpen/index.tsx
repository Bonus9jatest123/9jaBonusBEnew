'use client';
import React, { useState } from 'react';
import Card from '../Cards/index';
import ReviewCard from '../ReviewCard/index';
import TCS from '../T&CS/index';
import Toogle from '../Toogle/index';

export interface KeyInfo {
  infoImage: string;
  upTo: string;
  wageringRollover: string;
  minOdds: string;
}

export interface Props {
  keyInfo: KeyInfo;
  review: string;
  pros: string;
  cons: string;
  tcs: string;
}

const TabCardOpen = (props: Props) => {
  const { keyInfo, review, tcs, pros, cons } = props;
  const [toggle, setToggle] = useState<number>(0);
  const items = ['Info', 'Review', 'T&Cs'];

  const handleActive = (id: number): void => {
    setToggle(id);
  };
  return (
    <div>
      <Toogle items={items} toggle={toggle} handleActive={handleActive} className={''} />
      <div className="tab-open">
        <div className="tab_open-sub">
          {items.map((item, index) => (
            <div className={toggle == index ? 'setactive' : 'items'} key={index} onClick={() => handleActive(index)}>
              {item}
            </div>
          ))}
        </div>

        <div className="open__info">
          {toggle == 0 && <Card {...keyInfo} />}
          {toggle == 1 && <ReviewCard review={review} pros={pros} cons={cons} />}
          {toggle == 2 && <TCS tcs={tcs} />}
        </div>
      </div>
    </div>
  );
};

export default TabCardOpen;
