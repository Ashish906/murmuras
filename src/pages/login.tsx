import React from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import cookie from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import API_REQUEST from '../utills/axios-instance';
import { SwalError } from '../utills/sweet-alert';

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().nullable().email('Invalid email').required('Email is required'),
  password: Yup.string().nullable().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: LoginFormValues) => {
    try {
        const response = await API_REQUEST.post('/auth/login', { email: values.email, password: values.password });
        cookie.set('access_token', response.data.access_token, { expires: 1 });
        cookie.set('refresh_token', response.data.refresh_token, { expires: 2 });
        navigate('/timeline');
    } catch (error) {
      SwalError(undefined, error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <FormikForm onSubmit={handleSubmit}>

              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? 'error' : ''}
                help={touched.email && errors.email}
              >
                <Input
                  name="email"
                  placeholder="Email"
                  prefix={<UserOutlined />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={touched.password && errors.password ? 'error' : ''}
                help={touched.password && errors.password}
              >
                <Input.Password
                  name="password"
                  placeholder="Password"
                  prefix={<LockOutlined />}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                >
                  Login
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <span>Don't have an account? </span>
                <Link to="/registration">Create New Account</Link>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
