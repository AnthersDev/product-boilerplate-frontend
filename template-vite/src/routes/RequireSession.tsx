import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@marmeto_engineering/anthers-components';

import Loading from '@/components/Loading';
import { StatusScreen } from '@/components/StatusScreen';
import { useSession } from '@/features/auth';

export interface RequireSessionProps {
  /** Also require a selected organization; signed-in users without one go to /select-org. */
  requireOrganization?: boolean;
}

/** Layout route that renders its children only for signed-in users. */
export const RequireSession = ({ requireOrganization = false }: RequireSessionProps) => {
  const location = useLocation();
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

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  if (requireOrganization && session.type !== 'organization') {
    return <Navigate to="/select-org" replace />;
  }

  return <Outlet />;
};

/** Layout route for pages only signed-out users should see, such as /login. */
export const GuestOnly = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return <Loading />;
  if (session) return <Navigate to="/" replace />;

  return <Outlet />;
};
