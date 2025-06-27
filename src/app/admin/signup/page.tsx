'use client';
import React from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_ENDPOINT } from '@/lib/constants';
import Link from 'next/link';

interface Value {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const initialValues = {
    name: '',
    email: '',
    password: ''
  };
  const { push } = useRouter();
  const validationSchema = Yup.object({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
  });
  const handleSubmit = async (values: Value, { resetForm }: FormikHelpers<Value>) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/register`, values);

      if (response.status === 200) {
        toast.success('Rregistered successfully');
        push('/admin/login');
        resetForm();
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="signup-form-container">
        <h2>Sign Up</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, resetForm }) => (
            <>
              <Form className="form">
                <input type="text" placeholder="Full Name" className="input" name="name" value={values.name} onChange={handleChange} />
                <ErrorMessage name="name" component="div" className="error-message" />
                <input type="email" placeholder="Email" className="input" name="email" value={values.email} onChange={handleChange} />
                <ErrorMessage name="email" component="div" className="error-message" />
                <input type="password" placeholder="Password" className="input" name="password" value={values.password} onChange={handleChange} />
                <ErrorMessage name="password" component="div" className="error-message" />
                <button type="submit" className="button">
                  Sign Up
                </button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignUp;
