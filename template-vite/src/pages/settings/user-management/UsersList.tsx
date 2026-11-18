import { useNavigate } from 'react-router-dom';
/** Storybook: UserListingLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-listing-layout--docs */
import { UserListingLayout } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';
import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Users management.
 * Matches Nexus: Anthers `UserListingLayout` over `GET /user`.
 */
const UsersList = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();

  if (!session?.user.id || !session.user.email) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <>
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks className="mb-3" components={['UserListingLayout']} />
      {/* @clean-demo-end */}
      <UserListingLayout
        apiClient={httpClient}
        title="Users management"
        description="Manage users and permissions"
        currentUser={{
          userId: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName ?? undefined,
          lastName: session.user.lastName ?? undefined,
        }}
        userPermissions={session.permissions}
        onAddUserClick={() => {
          navigate('/settings/users/create');
        }}
      />
    </>
  );
};

export default UsersList;
