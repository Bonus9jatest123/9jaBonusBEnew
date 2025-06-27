'use client';
import React, { useState } from 'react';
import LinksDraggable from '../RowDragable/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Offer } from '@/components/TabCards/index';
import Row from '../Row';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { toast } from 'react-toastify';
import { getCookie } from '@/lib/cookies';

interface Props {
  offers: Offer[];
  hasMore: boolean;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  loadMoreOffers: () => void;
  selectedId: string;
  handleEdit: (id: string) => void;
  isLoading: boolean;
}

const Table = (props: Props) => {
  const { offers, loadMoreOffers, hasMore, isLoading, setOffers, setSelectedId, selectedId, handleEdit } = props;
  const [saving, setSaving] = useState(false);

  const header = ['Rating', 'Bookie', 'Status', 'PromoInfo', 'Logo', 'Review', 'Key info', 'T&Cs', 'Link', 'Actions'];

  const token = getCookie('token') && JSON.parse(getCookie('token')!);

  const updateOrder = (id: string, order: number) => {
    const headers = {
      'x-auth-token': token
    };

    const data = { id, order: order + 1 };
    setSaving(true);
    axios
      .post(`${API_ENDPOINT}/offers/reorder`, data, { headers })
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
  return (
    <>
      <div className="table">
        <div className="row header">
          <div className="link-move-1">
            <img src="/images/svg/LinkMove.svg" alt="" />
          </div>
          {header.map((item, index) => (
            <div className="cell" key={index}>
              {item}
            </div>
          ))}
        </div>
        <InfiniteScroll dataLength={offers.length} next={loadMoreOffers} hasMore={hasMore} loader={<span></span>}>
          <LinksDraggable
            items={offers}
            setItems={setOffers}
            setSelectedId={setSelectedId}
            selectedId={selectedId}
            handleEdit={handleEdit}
            Component={Row}
            onDragComplete={updateOrder}
            saving={saving}
          />
          {offers.length === 0 && !isLoading && <div style={{ textAlign: 'center', marginTop: '50px' }}>No records found</div>}
        </InfiniteScroll>
        {isLoading && (
          <div className="loader-gif">
            <img src="/images/loading.gif" alt="" />
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
