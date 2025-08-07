'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCookie, removeCookie, removeUserCookie, setCookie, setUserCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { API_ENDPOINT } from '@/lib/constants';
import { get } from 'http';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLoginUser } from '@/redux/features/userPermissionSlice';
import { hasPermission } from '@/redux/hasPermissions';
import { RootState } from '@/redux/store';

// import HandleError from '@/lib/handleError';

interface Value {
  email: '';
  password: '';
}
const Login = () => {
  const { push } = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false)
  const currentState = useSelector((state: RootState) => state);
  //   const currentUser = useSelector((state: any) => state.userState.currentUser);
  // const permissions = currentUser?.permission || [];

  const [checkingAuth, setCheckingAuth] = useState(true); // Wait until check completes

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
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8).required('Password is required')
  });



  const handleSubmit = async (values: Value, { resetForm }: FormikHelpers<Value>) => {
    try {
      setLoader(true)
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, values);
      if (response.status === 200) {
        setCookie('token', response?.data?.token);
        const user = response.data.user;
        setUserCookie('user', JSON.stringify(response.data.user));
        dispatch(setLoginUser(user));
        setLoader(false)
        toast.success(response.data.message);
        setTimeout(() => {
          const permissions = response.data.user?.permission || [];
          if (response.data.user?.role === 1) {
            router.replace('/admin/offers');


          }
          else {
            if (permissions.includes('Bookies')) {
              router.replace('/admin/offers');
            } else if (permissions.includes('Users')) {
              router.replace('/admin/users');

            } else if (permissions.includes('Odds')) {
              router.replace('/admin/odds');

            } else if (permissions.includes('Footers')) {
              router.replace('/admin/footer');
            }
          }
        }, 1000)



        resetForm();
      } else {
        setLoader(false)
        toast.error('Login Failed');
        // HandleError(response?.data);
      }
    } catch (error: any) {
      setLoader(false)
      console.error('Error:', error);
      toast.error(error?.response?.data?.message)

    }
  };
  return (
    <>
      <div className="login-form-container">
        <h2>Login</h2>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, resetForm }) => (
            <>
              <Form className="form">
                <input type="email" placeholder="Email" className="login-input" name="email" value={values.email} onChange={handleChange} />
                <ErrorMessage name="email" component="div" className="error-message" />
                <input type="password" placeholder="Password" className="login-input" name="password" value={values.password} onChange={handleChange} />
                <ErrorMessage name="password" component="div" className="error-message" />

                <button type="submit" className="login-button" disabled={loader}> {loader ? (
                  <img src={'/images/loading.gif'} alt="Loading..." width="60" height="11" />
                ) : (
                  "Login"
                )}</button>

              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
