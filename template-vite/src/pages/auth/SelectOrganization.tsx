import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SelectOrganizationPage } from '@marmeto_engineering/anthers-components';

import { StatusScreen } from '@/components/StatusScreen';
import { brand } from '@/config';
import { useOrganizations, useSelectOrganization, useSignOut } from '@/features/auth';
import { ApiError } from '@/services/api';

const SelectOrganization = () => {
  const navigate = useNavigate();
  const { data: organizations, isPending, isError, error, refetch, isRefetching } = useOrganizations();
  const selection = useSelectOrganization();
  const signOut = useSignOut();
  const hasAutoSelectedRef = useRef(false);
  const signOutError =
    signOut.isError && !(signOut.error instanceof ApiError && signOut.error.status === 401)
      ? signOut.error.message
      : null;

  const { mutate: selectOrganization, isPending: isSelecting, isSuccess: hasSelected } = selection;

  const onOrganizationSelect = useCallback(
    (organizationId: string) => {
      if (isSelecting || signOut.isPending) return;
      selectOrganization(organizationId, { onSuccess: () => navigate('/', { replace: true }) });
    },
    [isSelecting, navigate, selectOrganization, signOut.isPending],
  );

  // With a single organization there is nothing to choose. The ref keeps StrictMode from selecting twice.
  useEffect(() => {
    if (signOut.isPending || signOutError || organizations?.length !== 1 || hasAutoSelectedRef.current) return;
    hasAutoSelectedRef.current = true;
    onOrganizationSelect(organizations[0].id);
  }, [onOrganizationSelect, organizations, signOut.isPending, signOutError]);

  const signOutButton = (
    <Button
      variant="outline"
      loading={signOut.isPending}
      disabled={isSelecting}
      onClick={() => {
        if (isSelecting) return;
        signOut.mutate(undefined, { onError: () => (hasAutoSelectedRef.current = false) });
      }}
    >
      Use a different account
    </Button>
  );

  if (isError) {
    return (
      <StatusScreen
        role="alert"
        title="We couldn't load your organizations"
        description={error.message}
        actions={
          <>
            {signOutError && <p className="text-small w-full text-red-600">{signOutError}</p>}
            <Button loading={isRefetching} onClick={() => refetch()}>
              Try again
            </Button>
            {signOutButton}
          </>
        }
      />
    );
  }

  const isAutoSelecting = organizations?.length === 1 && !selection.isError && !signOutError;
  if (isPending || isSelecting || hasSelected || isAutoSelecting) {
    return <SelectOrganizationPage.Skeleton />;
  }

  if (organizations.length === 0) {
    return (
      <StatusScreen
        title="You're not part of any organization yet"
        description="Ask an admin to invite you, or sign in with a different email."
        actions={
          <>
            {signOutError && (
              <p role="alert" className="text-small w-full text-red-600">
                {signOutError}
              </p>
            )}
            {signOutButton}
          </>
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      {selection.isError && (
        <p role="alert" className="text-small absolute inset-x-0 top-6 z-10 px-6 text-center text-red-600">
          {selection.error.message}
        </p>
      )}
      <SelectOrganizationPage
        logo={brand.logo}
        organizations={organizations}
        onOrganizationSelect={onOrganizationSelect}
      />
    </div>
  );
};

export default SelectOrganization;
