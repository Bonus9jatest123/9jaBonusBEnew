'use client';
import React, { useState } from 'react';

import TabCardOpen from '../TabCardOpen/index';
import { checkHTTPProtocol } from '@/lib/utils';
import Link from 'next/link';
interface Logo {
  cloudinaryId: string;
  imageUrl: string;
  _id: string;
}

export interface Offer {
  index?: number;
  infoImage: Logo;
  _id: string;
  name: string;
  playLink: string;
  enabled: boolean;
  rating: number;
  promoInfo: string;
  review: string;
  pros: string;
  cons: string;
  upTo: string;
  wageringRollover: string;
  minOdds: string;
  terms: string;
  logo: Logo;
  order: number;
  __v: number;
  minOddsForBonus: number;
  selections: {
    [key: number]: number;
  };
}
interface Props {
  data: Offer;
}
const TabCard = (props: Props) => {
  const { data } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const keyInfo = {
    infoImage: data?.infoImage?.imageUrl,
    upTo: data?.upTo,
    wageringRollover: data?.wageringRollover,
    minOdds: data?.minOdds
  };

  return (
    <div className={isOpen ? 'tab_container opened' : 'tab_container'}>
      <div className="container__content">
        <div className="tab_sub-number">{data?.order}</div>
        <div className="tab_sub_container">
          <Link className="tab_item_container" href={checkHTTPProtocol(`${data?.playLink}`)} target="blank">
            <img src={data?.logo?.imageUrl} className="tab-container_img" />
            <div className="mt-10 ml-10">
              <div className="offer-name">{data?.name}</div>
              <div className="tab_item_rate">
                <img src="/images/svg/star.svg"></img>
                <div className="tab_item_rate_text">
                  {data?.rating}
                  <span>/5.0</span>
                </div>
              </div>
            </div>
          </Link>
          <div className="tab_item_container-2">{data?.promoInfo}</div>
          <Link className="tab_item_container_3" href={checkHTTPProtocol(`${data?.playLink}`)} target="blank">
            PLAY NOW
          </Link>
        </div>
        <div className="tab_item_container-2-mbl">{data?.promoInfo}</div>
        {isOpen && <TabCardOpen keyInfo={keyInfo} review={data?.review} tcs={data?.terms} pros={data?.pros} cons={data?.cons} />}
        <div className="tab_show" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Show less -' : 'Show more +'}
        </div>
      </div>
    </div>
  );
};

export default TabCard;
