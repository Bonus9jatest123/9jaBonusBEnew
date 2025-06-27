'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import TabCard, { Offer } from '../TabCards';
import { removeCookie } from '@/lib/cookies';
import InfiniteScroll from 'react-infinite-scroll-component';
import Footer from '@/components/Footer/index';
import { findItemByKey } from '@/lib/utils';
interface OffersProps {
  initialOffers: Offer[];
}

const Offers = ({ initialOffers }: OffersProps) => {
  const [offers, setOffers] = useState(initialOffers);

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(initialOffers?.length >= 99);
  const pageSize = 100;

  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    if (pageNumber > 1)
      axios
        .get(`${API_ENDPOINT}/offers`, {
          params: {
            pageNumber,
            pageSize
          }
        })
        .then((response: { data: { offers: Offer[] } }) => {
          const newOffers = response?.data?.offers;

          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
        })
        .catch((error: any) => {
          console.error('Error fetching offers:', error);
        });
  }, [pageNumber]);

  const [footers, setFooters] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/footer/footers`)
      .then((response: { data: any }) => {
        const footers = response?.data;
        //  dispatch(setOdds(odds));
        setFooters(footers);
      })
      .catch((error: any) => {
        console.log('Odds error: ', error);
      });
    let blogs = [];
    try {
      const blogsRaw = localStorage.getItem('blogs');
      blogs = blogsRaw ? JSON.parse(blogsRaw) : [];
    } catch (err) {
      // console.error('Failed to parse blogs:', err);
      blogs = [];
    }
  }, []);

  const item = findItemByKey(footers, 'name', 'Bookies Footer');
  const itemAllFooters = findItemByKey(footers, 'name', 'Set All Footers');

  return (
    <InfiniteScroll
      dataLength={offers.length}
      next={loadMoreOffers}
      hasMore={hasMore}
      loader={
        <div className="loader-gif">
          <img src="/images/loading.gif" alt="" />
        </div>
      }
    >
      {offers?.length > 0 && offers?.map((data, index) => <TabCard data={data} key={index} data-index={index} />)}
      {item?.status == 'active' ? <Footer data={item} /> : itemAllFooters?.status == 'active' ? <Footer data={itemAllFooters} /> : null}
    </InfiniteScroll>
  );
};

export default Offers;
