/** Storybook: UserCreationLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-creation-layout--docs */
import { UserCreationLayout } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';
import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Users → Add user.
 * Matches Nexus: Anthers `UserCreationLayout` (`GET /user/permission`, `POST /user`).
 */
const AddUser = () => {
  const { data: session } = useSession();

  return (
    <>
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks className="mb-3" components={['UserCreationLayout']} />
      {/* @clean-demo-end */}
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
    </>
  );
};

export default AddUser;
