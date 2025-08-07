'use client';
import FormContainer from '@/components/FormContainer';
import { Offer } from '@/components/TabCards/index';
import Table from '@/components/Table/index';
import HandleError from '@/handleError';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie, removeCookie, removeUserCookie } from '@/lib/cookies';
import { getBookies } from '@/lib/utils';
import { setBookies } from '@/redux/features/bookiesSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '@/redux/store';
import { hasPermission } from '@/redux/hasPermissions';

const AdminOffers = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState('');
  const [addNew, setAddNew] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filterOffer, setFilterOffer] = useState<Offer>();
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 100;
  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };
  const token = getCookie('token');
    const currentState = useSelector((state: RootState) => state);
    useEffect(() => {
      const footerPermission = hasPermission('Bookies', currentState);
      if (currentState?.userPermissionState.currentUser) {
        if (!footerPermission) {
          toast.error('You do not have permission to access this page.');
          removeCookie('token');
          removeUserCookie('user');
          window.location.href = '/admin/login';
        }
      }
       
      if (!token) {
        toast.error('You are not authorized to access this page.');
        window.location.href = '/admin/login';
      }
    }, [currentState?.userPermissionState.currentUser,token]);
  
  const headers = {
    'x-auth-token': token,
  };
  useEffect(() => {
    const bookies = getBookies(offers);
    dispatch(setBookies(bookies));
  }, [offers]);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_ENDPOINT}/offers`, {
      params: {
        pageNumber,
        pageSize,
        disabled: true,
      },
      headers, // pass headers here
    })
      .then((response: { data: any }) => {
 
        if (response?.data?.status == true) {
          const newOffers = response?.data?.offers;
          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
          setIsLoading(false);
        }
        else {
         toast.error(response?.data?.message)
        }
      })
      .catch((error: any) => {
        console.error('Error fetching offers:', error);
        HandleError(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
        setIsLoading(false);
      });


  }, [pageNumber]);

  const handleEdit = (id: string) => {
    if (id) {
      setAddNew(true);
      const filteredOffers = offers?.find((offer) => offer?._id === id);
      setFilterOffer(filteredOffers);
    }
  };

  return (
    <>
      {addNew ? (
        <>
          <FormContainer setIsOpen={setAddNew} setFilterOffer={setFilterOffer} filterOffer={filterOffer!} selectedId={selectedId} setOffers={setOffers} offers={offers} setSelectedId={setSelectedId} />
        </>
      ) : (
        <>
          <div className="wrapper">
            <div className="button-row">
              <h1>All Bookies</h1>
              <button
                onClick={() => {
                  selectedId == '' && setAddNew(true);
                }}
              >
                Add New
              </button>
            </div>
          </div>
          <div className="table-data">
            <Table

              offers={offers}
              isLoading={isLoading}
              loadMoreOffers={loadMoreOffers}
              hasMore={hasMore}
              setOffers={setOffers}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              handleEdit={handleEdit}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AdminOffers;
