// import { useState } from 'react';

'use client';
import ToggleSwitch from '../ToggleSwitch';
import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/lib/constants';
import axios from 'axios';
import { getCookie } from '@/lib/cookies';
import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';

const token = getCookie('token') && JSON.parse(getCookie('token') as any);

const AdminFooterTable = (props: any) => {
  const { setShowFormId } = props;
 
  const headers = {
    'x-auth-token':token
  };

  const [footers, setFooters] = useState([]);

  const handleGetFooters = () => {
    axios
      .get(`${API_ENDPOINT}/footer`, { headers })
      .then((response: any) => {
        const footers = response?.data;
        setFooters(footers);
      })
      .catch((error: any) => {
        console.log('Odds error: ', error);
      });
  };

  useEffect(() => {
    handleGetFooters();
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="button-row">
          <h1>Footers</h1>
        </div>
        <div className="footer-options">
          <div className="options__header footer-row">
            <div className="header__option footer-cell">Off/On</div>
            <div className="header__option footer-cell">Page</div>
            <div className="header__option footer-cell">Actions</div>
          </div>
          {footers.reverse().map(({ name, status, _id }) => (
            <div className="options__body footer-row" key={_id}>
              <div className="body__option footer-cell">
                <ToggleSwitch name={name} checked={status} id={_id} onChange={handleGetFooters} />
              </div>
              <div className="body__option footer-cell">{name}</div>
              <div className="body__option footer-cell" onClick={() => setShowFormId(_id)}>
                <img className="edit-icon" src="/images/edit.svg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminFooterTable;
