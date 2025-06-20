import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './loader';
const Timeline = React.lazy(() => import('../pages/timeline'));
const Users = React.lazy(() => import('../pages/users'));

function BaseRoute() {
  return (
    <Suspense fallback={<Loader />}>
        <Routes>
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/users" element={<Users />} />
        </Routes>
    </Suspense>
  )
}

export default BaseRoute;