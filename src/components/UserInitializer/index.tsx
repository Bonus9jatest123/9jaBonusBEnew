'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { setLoginUser } from '@/redux/features/userPermissionSlice';
import { getCookie, getUserCookie } from '@/lib/cookies';

const UserInitializer = () => {
const dispatch = useDispatch();

  useEffect(() => {
    const cookieData = getUserCookie('user');
    if (cookieData) {
      try {
        const user = JSON.parse(cookieData);
        dispatch(setLoginUser(user));
      } catch (err) {
        console.error('Failed to parse user cookie', err);
      }
    }
  }, []);


  return null;
};

export default UserInitializer;




 
