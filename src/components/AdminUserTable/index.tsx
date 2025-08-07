'use client';
import React, { useEffect, useState } from 'react';
import UsersRow from '../UsersRow';
import LinksDraggable from '../RowDragable';
import { toast } from 'react-toastify';
import { User } from '@/types/commonTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setUsers } from '@/redux/features/userSlice';
import { getCookie, removeCookie, removeUserCookie } from '@/lib/cookies';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import InfiniteScroll from 'react-infinite-scroll-component';
import HandleError from '@/handleError';
import { hasPermission } from '@/redux/hasPermissions';

const AdminUserTable = () => {

  const columns = ['Name', 'Email', 'Status', 'Role', 'Created At', 'Actions'];
  const dispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.userState.users);
  const token = getCookie('token');

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [saving, setSaving] = useState(false);

  const updateUsersState = (users: User[]) => dispatch(setUsers(users));

  const updateUser = (id: string, order: number) => {
    const headers = {
      'x-auth-token': token
    };
    const data = { id, order: order + 1 };
    setSaving(true);
    axios
      .post(`${API_ENDPOINT}/users/reorder`, data, { headers })
      .then(() => {
        toast.success('Updated');
        setSaving(false);
      })
      .catch((error: any) => {
        console.error('Error submitting form:', error);
        // toast.error(error?.response?.data?.message || 'Something went wrong');
        HandleError(error);
        setSaving(false);
      });
  };


  const loadMoreUsers = () => {
    if (hasMore && !saving) {
      setPageNumber((prev) => prev + 1);
    }
  };
  const currentState = useSelector((state: RootState) => state);
  useEffect(() => {
    if (!token) {
      toast.error('You are not authorized to access this page.');
      window.location.href = '/admin/login';
    }
    const footerPermission = hasPermission('Users', currentState);
    if (currentState?.userPermissionState.currentUser) {
      if (!footerPermission) {
        toast.error('You do not have permission to access this page.');
        removeCookie('token');
        removeUserCookie('user');
        window.location.href = '/admin/login';
      }
    }
  }, [token,currentState?.userPermissionState.currentUser]);
 useEffect(() => {
  const fetchUsers = async () => {
    try {
      setSaving(true);

      const response = await axios.get(`${API_ENDPOINT}/users`, {
        params: {
          pageNumber,
          pageSize: 100,
          disabled: true
        },
        headers: {
          'x-auth-token': token
        }
      });

      const newUsers = response?.data?.users;

      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
       const updatedUsers = [
            ...usersState,
            ...newUsers.filter(
              (newUser:any) => !usersState.some((existing) => existing._id === newUser._id)
            )
          ];
        dispatch(setUsers(updatedUsers));
      }
    } catch (error: any) {
      
      toast.error(error?.response?.data?.message || 'Something went wrong');
      HandleError(error);
    } finally {
      setSaving(false);
    }
  };

  fetchUsers();
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

      {/* Scrollable container */}
      <div
        id="scrollableDiv"
        style={{
          height: '60vh', // or whatever fits your layout
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={usersState?.length || 0}
          next={loadMoreUsers}
          hasMore={hasMore}
          loader={<span>Loading...</span>}
          scrollableTarget="scrollableDiv"
          scrollThreshold={0.8}
        >
          <LinksDraggable
            items={usersState}
            setItems={updateUsersState}
            Component={UsersRow}
            onDragComplete={updateUser}
            saving={saving}
          />
          {usersState?.length === 0 && !saving && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              No records found
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>

  );
};

export default AdminUserTable;
