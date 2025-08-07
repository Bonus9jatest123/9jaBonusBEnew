

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';

interface ToggleSwitchProps {
  id: string;
  type?: string;
  odds?: any; // can be an object or array, depending on context
  name: string;
  checked: any; // can be boolean or string ('active' | 'inactive')
  onChange: (e: React.ChangeEvent<any>) => any;
}

const token = getCookie('token');
const headers = {
  // 'x-auth-token': token
};

const ToggleSwitch = ({ name, id, onChange, type, checked }: ToggleSwitchProps) => {

  console.log('ToggleSwitch props', { name, id, onChange, type, checked });
  const [status, setStatus] = useState(false);

  // Set initial status
  useEffect(() => {
    if (type === 'odds') {
      setStatus(Boolean(checked));
    } else {
      setStatus(checked !== 'inactive');
    }
  }, [checked, type]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setStatus(isChecked); // Update local UI immediately
    console.log('ToggleSwitch handleChange', { isChecked, type, id });

    try {

      if (type === 'odds') {
        let suspendItem = '';

        if (e.target.name === 'suspendAll') {
          suspendItem = 'suspendAll';
        } else {
          const nameParts = e.target.name.split('.');
          suspendItem = nameParts[1];
        }
        if (id) {
          const response = await axios.put(
            `${API_ENDPOINT}/odds/status/${id}`,
            {
              status: isChecked ? 'active' : 'inactive',
              suspendItem,
            },
            { headers }
          );
          if (response?.data?.status) {

            toast.success(response?.data?.message || 'Status updated successfully');
            setTimeout(() => {
              window.location.reload();
            }, 500)
          }
        }
      }
      else {

        const response = await axios.put(
          `${API_ENDPOINT}/footer/${id}/status`,
          {
            status: isChecked ? 'active' : 'inactive',
          },
          { headers }
        );
        toast.success(response?.data?.message || 'Status updated successfully');
      }

      onChange(e);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      setStatus(!isChecked); // Revert toggle on error
    }
  };

  return (
    <label className={`toggle-button ${status ? 'active' : ''}`}>
      <input
        type="checkbox"
        name={name}
        id={id}
        checked={status}
        onChange={handleChange}
      />
      <div className="toggle-button-slider"></div>
    </label>
  );
};

export default ToggleSwitch;

