import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './loader';
import UserProfile from '../pages/user-profile';
const Timeline = React.lazy(() => import('../pages/timeline'));
const Users = React.lazy(() => import('../pages/users'));

function BaseRoute() {
  return (
    <Suspense fallback={<Loader />}>
        <Routes>
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/users" element={<Users />} />
        </Routes>
    </Suspense>
  )
}

export default BaseRoute;