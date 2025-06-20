import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Loader from './components/loader';
import Cookie from 'js-cookie';
import BaseRoute from './components/base-route';
const Login = React.lazy(() => import('./pages/login'));
const Registration = React.lazy(() => import('./pages/registration'));
const AuthWrapper = React.lazy(() => import('./components/auth-wrapper'));

function App() {
  const accessToken = Cookie.get('access_token');

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={accessToken ? <Navigate to="/timeline"/> : <Navigate to="/Login"/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
      </Suspense>
      
      <AuthWrapper>
        <BaseRoute />
      </AuthWrapper>
    </BrowserRouter>
  )
}

export default App