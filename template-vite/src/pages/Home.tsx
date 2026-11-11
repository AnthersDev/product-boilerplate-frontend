import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, HeadingWithDescription } from '@marmeto_engineering/anthers-components';

import { useOrganizations, useSession, useSignOut } from '@/features/auth';
import { env } from '@/libs/env';
import { ApiError } from '@/services/api';
import { healthQueryOptions } from '@/services/health-service';

/** Placeholder until the dashboard shell replaces it. */
const Home = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: organizations } = useOrganizations();
  const health = useQuery(healthQueryOptions());
  const signOut = useSignOut();
  const signOutError =
    signOut.isError && !(signOut.error instanceof ApiError && signOut.error.status === 401)
      ? signOut.error.message
      : null;

  const organization = organizations?.find(({ id }) => id === session?.organizationId);

  const healthText = health.isPending
    ? 'Checking API…'
    : health.isError
      ? health.error.message
      : `API ${health.data.status} at ${health.data.timestamp}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-6">
      {env.useMockApi && (
        <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Mock API mode is active. To use your configured API, set VITE_USE_MOCK_API=false in .env.local (and set
          VITE_API_BASE_URL if your API is not at /api), then restart the dev server.
        </p>
      )}

      <HeadingWithDescription
        type="pageHeading"
        title={`Welcome${session?.user.firstName ? `, ${session.user.firstName}` : ''}`}
        description={`Signed in as ${session?.user.email ?? ''}${organization ? ` in ${organization.name}` : ''}.`}
      />

      <p className="text-sm text-gray-700">{healthText}</p>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" loading={health.isFetching} onClick={() => health.refetch()}>
          Recheck API
        </Button>
        <Button variant="outline" onClick={() => navigate('/select-org')}>
          Switch organization
        </Button>
        <Button variant="ghost" loading={signOut.isPending} onClick={() => signOut.mutate()}>
          Sign out
        </Button>
      </div>
      {signOutError && (
        <p role="alert" className="text-sm text-red-600">
          {signOutError}
        </p>
      )}
    </main>
  );
};

export default Home;
