'use client';
import AdminUserTable from '@/components/AdminUserTable';
import FormContainer from '@/components/FormContainer';
import { Offer } from '@/components/TabCards/index';
import Table from '@/components/Table/index';
import HandleError from '@/handleError';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import { getBookies } from '@/lib/utils';
import { setBookies } from '@/redux/features/bookiesSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  return (
    <>
      
        <div className="wrapper">
          <div className="button-row">
            <h1>All Users</h1>

          </div>
        </div>
        <div className="table-data">
       <AdminUserTable></AdminUserTable>
        </div>
      </>
      
  );
};

export default AdminUsers;
