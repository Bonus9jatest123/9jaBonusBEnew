'use client';
import React, { useEffect, useState } from 'react';
import OddsRow from '../OddsRow';
import LinksDraggable from '../RowDragable';
import { toast } from 'react-toastify';
import { Fixture } from '@/types/commonTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setOdds } from '@/redux/features/fixturesFormSlice';
import { getCookie } from '@/lib/cookies';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import InfiniteScroll from 'react-infinite-scroll-component';

const AdminOddsTable = () => {
  const columns = ['Date/Time', 'League', 'Home Team', 'Away Team', 'Bookies', 'Status', 'Actions'];
  const dispatch = useDispatch();
  const oddsFromState = useSelector((state: RootState) => state.fixturesFormState.odds);
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [saving, setSaving] = useState(false);

  const updateOddsState = (odds: Fixture[]) => dispatch(setOdds(odds));

  const updateOrder = (id: string, order: number) => {
    const headers = {
      'x-auth-token': token
    };
    const data = { id, order: order + 1 };
    setSaving(true);
    axios
      .post(`${API_ENDPOINT}/odds/reorder`, data, { headers })
      .then(() => {
        toast.success('Updated');
        setSaving(false);
      })
      .catch((error: any) => {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong');
        setSaving(false);
      });
  };

  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    setSaving(true);
    axios
      .get(`${API_ENDPOINT}/odds`, {
        params: {
          pageNumber,
          pageSize: 100,
          disabled: true
        }
      })
      .then((response: { data: { odds: Fixture[] } }) => {
        const newOdds = response?.data?.odds;

        if (newOdds.length === 0) {
          setHasMore(false);
        } else {
          const updatedOdds = [...oddsFromState, ...newOdds];
          dispatch(setOdds(updatedOdds));
        }
        setSaving(false);
      })
      .catch((error: any) => {
        console.error('Error fetching offers:', error);
        setSaving(false);
      });
  }, [pageNumber]);

  return (
    <div className="table">
      <div className="row header">
        <div className="link-move-1">
          <img src="/images/svg/LinkMove.svg" alt="" />
        </div>
        {columns.map((item, index) => (
          <div className="cell" key={index}>
            {item}
          </div>
        ))}
      </div>
      <InfiniteScroll dataLength={oddsFromState?.length || 100} next={loadMoreOffers} hasMore={hasMore} loader={<span></span>}>
        <LinksDraggable items={oddsFromState} setItems={updateOddsState} Component={OddsRow} onDragComplete={updateOrder} saving={saving} />
        {oddsFromState?.length === 0 && !saving && <div style={{ textAlign: 'center', marginTop: '50px' }}>No records found</div>}
      </InfiniteScroll>
    </div>
  );
};

export default AdminOddsTable;
