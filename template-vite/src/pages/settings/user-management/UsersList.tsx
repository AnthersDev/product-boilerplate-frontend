import { UserListingLayout, show } from '@marmeto_engineering/anthers-components';

import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Users management.
 * Matches Nexus: Anthers `UserListingLayout` over `GET /user`.
 */
const UsersList = () => {
  const { data: session } = useSession();

  if (!session?.user.id || !session.user.email) {
    return <div className="p-6">Loading…</div>;
  }

  return (
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
        show('Add user is a demo stub in the starter. Wire UserCreationLayout when the invite API is ready.');
      }}
    />
  );
};

export default UsersList;
