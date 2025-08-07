'use client';
import React, { useState,useEffect } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCookie } from '@/lib/cookies';
import { API_ENDPOINT } from '@/lib/constants';
import HandleError from '@/handleError';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface Value {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [loader, setLoader] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Wait until check completes
  const router = useRouter();
    useEffect(() => {
      const token = getCookie('token');
      const user = getCookie('user');
  
      if (token && user) {
        const parsedUser = JSON.parse(user);
        // Replace with actual permission logic
        if (parsedUser.role === 1 || parsedUser.permission?.includes('Bookies')) {
          router.replace('/admin/offers');
        } else if (parsedUser.permission?.includes('Users')) {
          router.replace('/admin/users');
        } else if (parsedUser.permission?.includes('Odds')) {
          router.replace('/admin/odds');
        } else if (parsedUser.permission?.includes('Footers')) {
          router.replace('/admin/footer');
        }
      } else {
        setCheckingAuth(false); // Only show login if not authenticated
      }
    }, []);
  
    if (checkingAuth) return null;
  const params = useParams();
  const resettoken = params?.token;
   const headers = {
    'x-auth-token': resettoken,
  };

  const validationSchema = Yup.object({
    password: Yup.string().min(8).required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Confirm Password must match Password')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values: Value, { resetForm }: FormikHelpers<Value>) => {
    try {
      setLoader(true);
      const response = await axios.post(`${API_ENDPOINT}/auth/change-password`, values, {
        headers,
      });

      if (response.status === 200) {
        toast.success('Password changed successfully');

        resetForm();
      } else {
        toast.error('Password change failed');
      }
    } catch (error: any) {
    //   HandleError(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  //   const handleSubmit = async (values: Value, { resetForm }: FormikHelpers<Value>) => {
  //   try {
  //     setLoader(true);
  //     const response = await axios.post(`${API_ENDPOINT}/auth/reset-password`, {...values, token:token});

  //     if (response.status === 200) {
  //       toast.success('Password changed successfully');

  //       resetForm();
  //     } else {
  //       toast.error('Password change failed');
  //     }
  //   } catch (error: any) {
  //   //   HandleError(error);
  //     toast.error(error?.response?.data?.message || 'Something went wrong');
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  return (
    <div className="login-form-container">
      <h2>Reset Password</h2>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="form">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <ErrorMessage name="password" component="div" className="error-message" />

            <input
              type="password"
              placeholder="Confirm Password"
              className="login-input"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            <ErrorMessage name="confirmPassword" component="div" className="error-message" />

            <button type="submit" className="login-button" disabled={loader}>
              {loader ? (
                <img src={'/images/loading.gif'} alt="Loading..." width="60" height="11" />
              ) : (
                'Change'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
