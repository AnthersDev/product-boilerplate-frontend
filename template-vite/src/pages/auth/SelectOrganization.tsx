import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SelectOrganizationPage } from '@marmeto_engineering/anthers-components';

import { StatusScreen } from '@/components/StatusScreen';
import { brand } from '@/config';
import { useOrganizations, useSelectOrganization, useSignOut } from '@/features/auth';

const SelectOrganization = () => {
  const navigate = useNavigate();
  const { data: organizations, isPending, isError, error, refetch, isRefetching } = useOrganizations();
  const selection = useSelectOrganization();
  const signOut = useSignOut();
  const hasAutoSelectedRef = useRef(false);

  const { mutate: selectOrganization, isPending: isSelecting, isSuccess: hasSelected } = selection;

  const onOrganizationSelect = useCallback(
    (organizationId: string) => {
      if (isSelecting) return;
      selectOrganization(organizationId, { onSuccess: () => navigate('/', { replace: true }) });
    },
    [isSelecting, navigate, selectOrganization],
  );

  // With a single organization there is nothing to choose. The ref keeps StrictMode from selecting twice.
  useEffect(() => {
    if (organizations?.length !== 1 || hasAutoSelectedRef.current) return;
    hasAutoSelectedRef.current = true;
    onOrganizationSelect(organizations[0].id);
  }, [onOrganizationSelect, organizations]);

  const signOutButton = (
    <Button variant="outline" loading={signOut.isPending} onClick={() => signOut.mutate()}>
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
            <Button loading={isRefetching} onClick={() => refetch()}>
              Try again
            </Button>
            {signOutButton}
          </>
        }
      />
    );
  }

  const isAutoSelecting = organizations?.length === 1 && !selection.isError;
  if (isPending || isSelecting || hasSelected || isAutoSelecting) {
    return <SelectOrganizationPage.Skeleton />;
  }

  if (organizations.length === 0) {
    return (
      <StatusScreen
        title="You're not part of any organization yet"
        description="Ask an admin to invite you, or sign in with a different email."
        actions={signOutButton}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      {selection.isError && (
        <p role="alert" className="absolute inset-x-0 top-6 z-10 px-6 text-center text-sm text-red-600">
          {selection.error.message}
        </p>
      )}
      <SelectOrganizationPage
        logo={brand.logo}
        organizations={organizations}
        onOrganizationSelect={onOrganizationSelect}
      />
      <div className="absolute inset-x-0 bottom-8 flex justify-center">{signOutButton}</div>
    </div>
  );
};

export default SelectOrganization;
