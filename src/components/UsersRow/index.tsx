import { formatDateForOddssRow, getLocalDate } from '@/lib/utils';
import { setEditId, setOdds } from '@/redux/features/fixturesFormSlice';
import { RootState } from '@/redux/store';
import { User } from '@/types/commonTypes';
import React, { useState, useEffect } from 'react';
import { DraggableProps } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import RoleAssign from '../Modal/Roleassign';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';
import HandleError from '@/handleError';
import { setUsers } from '@/redux/features/userSlice';
import ConfirmationPopup from '../ConfirmationPopup';

interface UsersRowProps {
  dragHandleProps: DraggableProps;
  data: User;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}

const token = getCookie('token');

const headers = {
  'x-auth-token': token
};

const UsersRow = ({ dragHandleProps, data }: UsersRowProps) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.userState.users);
  const [showModal, setShowModal] = useState(false);
  const [pages, setPages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
 const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSaving(true);
    axios
      .get(`${API_ENDPOINT}/pages`, {
        headers: {
          'x-auth-token': token
        }
      })
      .then((response: { data: any }) => {
        const newPages = response?.data?.pages;
        setPages(newPages);
        setAvailablePermissions(newPages.map((page: any) => page.name));
        setSaving(false);
      })
      .catch((error: any) => {
        HandleError(error);
        setSaving(false);
      });
  }, []);

  const changeStatus = async () => {
    setSaving(true);
    try {
      const response = await axios.get(`${API_ENDPOINT}/users/${data?._id}`, { headers });
      const filteredUsers = response.data;
      dispatch(setUsers([...filteredUsers]));
      toast.success('Status Changed');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      HandleError(error);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  const handleAssign = async (permissions: string[]) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/users/${data?._id}`, {
        permissions: permissions
      }, { headers });
      const filteredUsers = response.data;
      dispatch(setUsers([...filteredUsers]));
      toast.success('Permissions Assigned Successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      HandleError(error);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

const handleDelete = async () => {
    setSaving(true);
    try {
      await axios.delete(`${API_ENDPOINT}/users/${data?._id}`, { headers });
      const filteredUsers = users.filter((item) => item._id !== data._id);
      dispatch(setUsers([...filteredUsers]));
      localStorage.clear();
      toast.success('Deleted');
    } catch (error:any) {
       toast.error(error?.response?.data?.message || 'Something went wrong');
        HandleError(error);
      console.log('Muneeb Odds error: ', error);
    } finally {
      setSaving(false);
      setIsOpen(false);
    }
  };
  

  return (
    <div className="row">
      <div className="link-move" {...dragHandleProps}>
        <img src="/images/svg/LinkMove.svg" alt="" />
      </div>
      <div className="cell">{data.name}</div>
      <div className="cell">{data.email}</div>
      <div className="cell" onClick={changeStatus}>{data.status == 1 ? <span style={{
        backgroundColor: '#d4edda',  // light green background
        color: '#155724',            // dark green text
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block',
        minWidth: '80px',
        textAlign: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>Approved</span>
        // :data?.status==2?<span style={{color:'red'}}>InActive</span>
        : <span style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          display: 'inline-block',
          minWidth: '80px',
          textAlign: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>Pending</span>}</div>
      <div className="cell">{data.role == 1 ? 'Admin' : 'User'}</div>
      <div className="cell">{getLocalDate(data.createdAt)}</div>
      {/* <div className="cell">{data.createdAt}</div> */}
      {/* <div className="cell">{data.suspendAll ? 'Suspended' : 'Active'}</div> */}

      <div className="cell-2">
        <svg className="edit-icon" fill="none" viewBox="0 0 10 10" onClick={() => { setShowModal(true) }}>
          <path
            d="M9.54351 0.456627C8.93113 -0.15574 8.38655 0.0248584 8.38655 0.0248584L3.5859 4.82155L2.77848 7.22156L5.17741 6.41359L9.97529 1.61357C9.97529 1.61357 10.1553 1.06899 9.54351 0.456627ZM5.33745 5.89069L5.07572 6.15187L4.25718 6.42971C4.19939 6.29634 4.12715 6.16465 3.98045 6.0185C3.83374 5.8718 3.7026 5.79956 3.56923 5.74177L3.84708 4.92324L4.10881 4.66207C4.10881 4.66207 4.54003 4.61261 4.96291 5.03605C5.38635 5.45892 5.33745 5.89069 5.33745 5.89069ZM8.33543 8.88862H1.11139V1.66469H3.88987L5.00126 0.553317H1.11139C0.500126 0.553317 0 1.05344 0 1.66469V8.88862C0 9.49988 0.500126 10 1.11139 10H8.33543C8.94669 10 9.44682 9.49988 9.44682 8.88862V4.99881L8.33543 6.11019V8.88862Z"
            fill="black"
          />
        </svg>
       <svg
            className="delete-icon"
            onClick={() => {
              setIsOpen(true);
               
            }}
            viewBox="0 0 24 24"
          >
            <path d="M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
          </svg>

      </div>
      {/* {showModal && <RoleAssign showModal={showModal} setShowModal={setShowModal} />}  */}
      <RoleAssign
        showModal={showModal}
        setShowModal={setShowModal}
        onAssign={handleAssign}
        availablePermissions={availablePermissions}
        defaultSelected={data.permission}
      />
         {isOpen && (
        <ConfirmationPopup
          message="Do you want to permanently Delete this User?"
          onYes={handleDelete}
          onNo={() => {
            setIsOpen(false);
             
          }}
          saving={saving}
        />
      )}
    </div>
  );
};

export default UsersRow;
