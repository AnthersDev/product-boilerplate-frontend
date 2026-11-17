import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
/** Storybook: Button — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs */
import { Button } from '@marmeto_engineering/anthers-components';

import Loading from '@/components/Loading';
import { StatusScreen } from '@/components/StatusScreen';
import { useSession } from '@/features/auth';
import { env } from '@/libs/env';

import { GuestOnly, RequireSession } from './RequireSession';

const AppShell = lazy(() => import('@/layouts/AppShell'));
const Home = lazy(() => import('@/pages/Home'));
const Reports = lazy(() => import('@/pages/analytics/Reports'));
const Registration = lazy(() => import('@/pages/registration/Registration'));
const Settings = lazy(() => import('@/pages/settings/Settings'));
const UsersList = lazy(() => import('@/pages/settings/user-management/UsersList'));
const AddUser = lazy(() => import('@/pages/settings/user-management/AddUser'));
const UserDetails = lazy(() => import('@/pages/settings/user-management/UserDetails'));
const Notifications = lazy(() => import('@/pages/settings/notifications/Notifications'));
const NotificationDetail = lazy(() => import('@/pages/settings/notifications/NotificationDetail'));
const WhatsNew = lazy(() => import('@/pages/WhatsNew'));
const PermissionsOverview = lazy(() => import('@/pages/permissions/PermissionsOverview'));
const PermissionsAllowed = lazy(() => import('@/pages/permissions/PermissionsAllowed'));
const PermissionsAccessDenied = lazy(() => import('@/pages/permissions/PermissionsAccessDenied'));
const PermissionsHidden = lazy(() => import('@/pages/permissions/PermissionsHidden'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/auth/Login'));
const MockSignIn = lazy(() => import('@/pages/auth/MockSignIn'));
const SelectOrganization = lazy(() => import('@/pages/auth/SelectOrganization'));

const SessionAwareNotFound = () => {
  const { data: session, isPending, isError, error, refetch, isRefetching } = useSession();

  if (isPending) return <Loading />;

  if (isError) {
    return (
      <StatusScreen
        role="alert"
        title="We couldn't check your session"
        description={error.message}
        actions={
          <Button loading={isRefetching} onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!session) return <NotFound />;
  if (session.type !== 'organization') return <Navigate to="/select-org" replace />;

  return (
    <AppShell>
      <NotFound />
    </AppShell>
  );
};

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
        <Route path="/registration" element={<Registration />} />
        <Route path="/permissions" element={<PermissionsOverview />} />
        <Route path="/permissions/allowed" element={<PermissionsAllowed />} />
        <Route path="/permissions/access-denied" element={<PermissionsAccessDenied />} />
        <Route path="/permissions/hidden" element={<PermissionsHidden />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/users" element={<UsersList />} />
        {/* `create` must be registered before `:id` so it is not treated as a user id */}
        <Route path="/settings/users/create" element={<AddUser />} />
        <Route path="/settings/users/:id" element={<UserDetails />} />
        <Route path="/settings/notifications" element={<Notifications />} />
        <Route path="/settings/notifications/:id" element={<NotificationDetail />} />
        <Route path="/whats-new" element={<WhatsNew />} />
      </Route>
    </Route>

    <Route path="*" element={<SessionAwareNotFound />} />
  </Routes>
);

export default AppRoutes;
