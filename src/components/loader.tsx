import React from 'react';
import { Layout, Spin } from 'antd';

export default function Loader() {
  return (
    <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size='large' />
    </Layout>
  )
}