import { UserCreationLayout } from '@marmeto_engineering/anthers-components';

import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Users → Add user.
 * Matches Nexus: Anthers `UserCreationLayout` (`GET /user/permission`, `POST /user`).
 */
const AddUser = () => {
  const { data: session } = useSession();

  return (
    <UserCreationLayout
      apiClient={httpClient}
      userPermissions={session?.permissions ?? []}
      onSuccess={() => {
        // Toast is handled inside UserCreationLayout; list invalidation happens there too.
      }}
      onError={(message) => {
        console.error(message);
      }}
    />
  );
};

export default AddUser;
