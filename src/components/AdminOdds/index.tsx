'use client';
import { API_ENDPOINT } from '@/lib/constants';
import { getBookies } from '@/lib/utils';
import { setBookies } from '@/redux/features/bookiesSlice';
import { setEditId, setOdds } from '@/redux/features/fixturesFormSlice';
import { RootState } from '@/redux/store';
import { Fixture } from '@/types/commonTypes';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminOddsTable from '../AdminOddsTable';
import OddsForm from '../OddsForm';
import { Offer } from '../TabCards';

interface AdminOddsProps {
  offers: Offer[];
}

const AdminOdds = ({ offers }: AdminOddsProps) => {
  const dispatch = useDispatch();
  const editId = useSelector((state: RootState) => state.fixturesFormState.editId);
  const oddsFromState = useSelector((state: RootState) => state.fixturesFormState.odds);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (oddsFromState?.length === 0)
      axios
        .get(`${API_ENDPOINT}/odds`, {
          params: {
            pageNumber: 1,
            pageSize: 100,
            disabled: true
          }
        })
        .then((response: { data: { odds: Fixture[] } }) => {
          const odds = response?.data?.odds;
          dispatch(setOdds(odds));
        })
        .catch((error: any) => {
          console.log('Odds error: ', error);
        });
  }, []);

  useEffect(() => {
    const bookies = getBookies(offers);
    dispatch(setBookies(bookies));
  }, [offers]);

  useEffect(() => {
    editId ? setShowForm(true) : setShowForm(false);
  }, [editId]);

  const handleClick = () => {
    setShowForm(!showForm);
    dispatch(setEditId(''));
  };

  return (
    <div>
      <div className="wrapper">
        <div className="button-row">
          <h1>{showForm ? 'Add Odd' : 'All Odds'}</h1>
          <button onClick={handleClick}>{showForm ? 'Cancel' : 'Add New'}</button>
        </div>
      </div>
      {showForm ? (
        <OddsForm setShowForm={setShowForm} />
      ) : (
        <div className="table-data">
          <AdminOddsTable />
        </div>
      )}
    </div>
  );
};

export default AdminOdds;
