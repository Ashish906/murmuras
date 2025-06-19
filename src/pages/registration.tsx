import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import API_REQUEST from '../utills/axios-instance';
import { SwalError, SwalSuccess } from '../utills/sweet-alert';

const { Title, Link } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().nullable().required('Name is required').min(2, 'Name is too short'),
  email: Yup.string().nullable().email('Invalid email').required('Email is required'),
  password: Yup.string().nullable().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: RegisterFormValues) => {
    try {
        await API_REQUEST.post('/auth/register', { 
          name: values.name, 
          email: values.email, 
          password: values.password 
        });
        SwalSuccess('Success!', 'Account created successfully');
        navigate('/login');
    } catch (error) {
      SwalError(undefined, error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Create Account</Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isSubmitting
          }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Form.Item
                label="Name"
                validateStatus={touched.name && errors.name ? 'error' : ''}
                help={touched.name && errors.name}
              >
                <Input
                  name="name"
                  placeholder="Your name"
                  prefix={<UserOutlined />}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? 'error' : ''}
                help={touched.email && errors.email}
              >
                <Input
                  name="email"
                  placeholder="Your email"
                  prefix={<MailOutlined />}
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
                  placeholder="Create password"
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
                  Register
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <span>Already have an account? </span>
                <Link href="/login">Login</Link>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Registration;
