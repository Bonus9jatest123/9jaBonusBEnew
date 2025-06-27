'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';

interface ToggleSwitchProps {
  id: string;
  name: string;
  checked: any;
  onChange: (e: React.ChangeEvent<any>) => any;
}
const token = getCookie('token') && JSON.parse(getCookie('token') as any);

const ToggleSwitch = ({ name, id, onChange, checked }: ToggleSwitchProps) => {
  const headers = {
    'x-auth-token': token
  };
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (checked == 'inactive') setStatus(false);
    else setStatus(true);
  }, [checked]);

  const handleChange = (e: any) => {
    setStatus(e.target.checked);

    axios
      .put(`${API_ENDPOINT}/footer/${id}/status`, { status: e.target.checked ? 'active' : 'inactive' }, { headers })
      .then((response: any) => {
        onChange(e);

        toast.success('status is updated successfull');
      })
      .catch((error: any) => {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong');
      });
  };
  return (
    <label className={`toggle-button ${status ? 'active' : ''}`}>
      <input type="checkbox" name={name} id={id} onChange={(e: any) => handleChange(e)} checked={status} />
      <div className="toggle-button-slider"></div>
    </label>
  );
};

export default ToggleSwitch;
