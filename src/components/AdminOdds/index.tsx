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
import { getCookie, removeCookie, removeUserCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';
import HandleError from '@/handleError';
import { usePathname, useRouter } from 'next/navigation';
import { hasPermission } from '@/redux/hasPermissions';

interface AdminOddsProps {
  offers: Offer[];
}

const AdminOdds = ({ offers }: AdminOddsProps) => {
  const dispatch = useDispatch();
  const editId = useSelector((state: RootState) => state.fixturesFormState.editId);
  const oddsFromState = useSelector((state: RootState) => state.fixturesFormState.odds);
  const [showForm, setShowForm] = useState(false);
  const token = getCookie('token');
  const headers = {
    'x-auth-token': token,
  };
  const currentState = useSelector((state: RootState) => state);
  useEffect(() => {
     
     if (!token) {
        toast.error('You are not authorized to access this page.');
         window.location.href = '/admin/login';
      }
    const footerPermission = hasPermission('Odds', currentState);
    if (currentState?.userPermissionState.currentUser) {
      if (!footerPermission) {
        toast.error('You do not have permission to access this page.');
        removeCookie('token');
        removeUserCookie('user');
        window.location.href = '/admin/login';
      }
    }
  }, [currentState?.userPermissionState.currentUser, token]);
  
     useEffect(() => {

    axios.get(`${API_ENDPOINT}/offers/alloffers`, {
      params: {
        disabled: true,
      },
      headers, // pass headers here
    })
      .then((response: { data: any }) => {

        if (response?.data?.status == true) {
          const newOffers = response?.data?.offers;
          const bookies = getBookies(newOffers);
          dispatch(setBookies(bookies));
        }
        else {
          toast.error(response?.data?.message)
        }
      })
      .catch((error: any) => {
        
        HandleError(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');

      });


  }, []);

  useEffect(() => {
    if (oddsFromState?.length === 0)
      axios
        .get(`${API_ENDPOINT}/odds`, {
          params: {
            pageNumber: 1,
            pageSize: 100,
            disabled: true
          },
          headers
        })
        .then((response: { data: { odds: Fixture[] } }) => {
        
          const odds = response?.data?.odds;
          dispatch(setOdds(odds));
        })
        .catch((error: any) => {
          console.log('Odds error: ', error);
       
          HandleError(error);
          toast.error(error?.response?.data?.message || 'Something went wrong');
        });
  }, []);

 
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
