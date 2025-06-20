import React from 'react';
import { Card, Input, Button } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SwalError, SwalSuccess } from '../../utills/sweet-alert';
import API_REQUEST from '../../utills/axios-instance';

const validationSchema = Yup.object().shape({
  murmur: Yup.string()
    .nullable()
    .required('Please enter your murmur')
    .max(1000, 'Murmur must be 1000 characters or less'),
});

const MurmurForm: React.FC = () => {
  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      await API_REQUEST.post('/murmurs', {
        text: values.murmur
      });
      SwalSuccess(undefined, 'Murmur posted successfully');
      resetForm();
    } catch (error) {
      console.log(error);
      SwalError(undefined, error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Card title="Create a Murmur" style={{ maxWidth: 600}}>
      <Formik
        initialValues={{ murmur: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
           return handleSubmit(values, resetForm);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '8px' }}>
              <Field name="murmur">
                {({ field }: any) => (
                  <Input.TextArea
                    {...field}
                    rows={4}
                    placeholder="Write something..."
                    maxLength={1000}
                    showCount
                  />
                )}
              </Field>
              <ErrorMessage
                name="murmur"
                component="div"
              />
            </div>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Post
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default MurmurForm;
