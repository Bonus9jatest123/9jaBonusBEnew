import { formatDateForOddssRow } from '@/lib/utils';
import { setEditId, setOdds } from '@/redux/features/fixturesFormSlice';
import { RootState } from '@/redux/store';
import { Fixture } from '@/types/commonTypes';
import React, { useState } from 'react';
import { DraggableProps } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ConfirmationPopup from '../ConfirmationPopup';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';

interface OddsRowProps {
  dragHandleProps: DraggableProps;
  data: Fixture;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}

const token = getCookie('token') && JSON.parse(getCookie('token') as any);

const headers = {
  'x-auth-token': token
};

const OddsRow = ({ dragHandleProps, data }: OddsRowProps) => {
  const dispatch = useDispatch();
  const odds = useSelector((state: RootState) => state.fixturesFormState.odds);
  const bookies = useSelector((state: RootState) => state.bookiesState.bookies);

  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    dispatch(setEditId(data?._id));
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await axios.delete(`${API_ENDPOINT}/odds/${data?._id}`, { headers });
      const filteredOdds = odds.filter((item) => item._id !== data._id);
      dispatch(setOdds([...filteredOdds]));
      localStorage.clear();
      toast.success('Deleted');
    } catch (error) {
      toast.error('Something went wrong');
      console.log('Muneeb Odds error: ', error);
    } finally {
      setSaving(false);
      setShowPopup(false);
    }
  };

  return (
    <div className="row">
      <div className="link-move" {...dragHandleProps}>
        <img src="/images/svg/LinkMove.svg" alt="" />
      </div>
      <div className="cell">{formatDateForOddssRow(data.eventDateTime)}</div>
      <div className="cell">{data.league}</div>
      <div className="cell">{data.homeTeam}</div>
      <div className="cell">{data.awayTeam}</div>
      <div className="cell">{Object.entries(bookies).length}</div>
      <div className="cell">{data.suspendAll ? 'Suspended' : 'Active'}</div>

      <div className="cell-2">
        <svg className="edit-icon" fill="none" viewBox="0 0 10 10" onClick={handleEdit}>
          <path
            d="M9.54351 0.456627C8.93113 -0.15574 8.38655 0.0248584 8.38655 0.0248584L3.5859 4.82155L2.77848 7.22156L5.17741 6.41359L9.97529 1.61357C9.97529 1.61357 10.1553 1.06899 9.54351 0.456627ZM5.33745 5.89069L5.07572 6.15187L4.25718 6.42971C4.19939 6.29634 4.12715 6.16465 3.98045 6.0185C3.83374 5.8718 3.7026 5.79956 3.56923 5.74177L3.84708 4.92324L4.10881 4.66207C4.10881 4.66207 4.54003 4.61261 4.96291 5.03605C5.38635 5.45892 5.33745 5.89069 5.33745 5.89069ZM8.33543 8.88862H1.11139V1.66469H3.88987L5.00126 0.553317H1.11139C0.500126 0.553317 0 1.05344 0 1.66469V8.88862C0 9.49988 0.500126 10 1.11139 10H8.33543C8.94669 10 9.44682 9.49988 9.44682 8.88862V4.99881L8.33543 6.11019V8.88862Z"
            fill="black"
          />
        </svg>
        <svg className="delete-icon" viewBox="0 0 24 24" onClick={() => setShowPopup(true)}>
          <path d="M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
        </svg>
      </div>
      {showPopup && <ConfirmationPopup message="Do you want to permanently Delete this event?" onYes={() => handleDelete()} onNo={() => setShowPopup(false)} saving={saving} />}
    </div>
  );
};

export default OddsRow;
