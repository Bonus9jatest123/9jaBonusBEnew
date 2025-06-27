'use client';
import React from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCookie, setCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { API_ENDPOINT } from '@/lib/constants';

interface Value {
  email: '';
  password: '';
}
const Login = () => {
  const { push } = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8).required('Password is required')
  });

  const handleSubmit = async (values: Value, { resetForm }: FormikHelpers<Value>) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, values);
     
      if (response.status === 200) {
        console.log('User logged in successfully');
        setCookie('token', JSON.stringify(response?.data));
        toast.success('Login successfully');
        push('/admin/offers');
        resetForm();
      } else {
        console.error('Login failed');
        toast.error('Login Failed');
      }
    } catch (error) {
      console.error('Error:', error);
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
                <button type="submit" className="login-button">
                  Login
                </button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
