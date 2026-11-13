import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { env } from '@/libs/env';

import { GuestOnly, RequireSession } from './RequireSession';

const AppShell = lazy(() => import('@/layouts/AppShell'));
const Home = lazy(() => import('@/pages/Home'));
const Reports = lazy(() => import('@/pages/analytics/Reports'));
const Settings = lazy(() => import('@/pages/settings/Settings'));
const UsersList = lazy(() => import('@/pages/settings/user-management/UsersList'));
const UserDetails = lazy(() => import('@/pages/settings/user-management/UserDetails'));
const Notifications = lazy(() => import('@/pages/settings/notifications/Notifications'));
const NotificationDetail = lazy(() => import('@/pages/settings/notifications/NotificationDetail'));
const WhatsNew = lazy(() => import('@/pages/WhatsNew'));
const Login = lazy(() => import('@/pages/auth/Login'));
const MockSignIn = lazy(() => import('@/pages/auth/MockSignIn'));
const SelectOrganization = lazy(() => import('@/pages/auth/SelectOrganization'));

const AppRoutes = () => (
  <Routes>
    <Route element={<GuestOnly />}>
      <Route path="/login" element={<Login />} />
    </Route>

    {env.useMockApi && <Route path="/auth/mock-callback" element={<MockSignIn />} />}

    <Route element={<RequireSession />}>
      <Route path="/select-org" element={<SelectOrganization />} />
    </Route>

    <Route element={<RequireSession requireOrganization />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/analytics/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/users" element={<UsersList />} />
        <Route path="/settings/users/:id" element={<UserDetails />} />
        <Route path="/settings/notifications" element={<Notifications />} />
        <Route path="/settings/notifications/:id" element={<NotificationDetail />} />
        <Route path="/whats-new" element={<WhatsNew />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
