import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Cookie from 'js-cookie';
const Login = React.lazy(() => import('./pages/login'));
const Timeline = React.lazy(() => import('./pages/timeline'));
const Registration = React.lazy(() => import('./pages/registration'));

function App() {
  const accessToken = Cookie.get('access_token');

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={accessToken ? <Navigate to="/timeline"/> : <Navigate to="/Login"/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App