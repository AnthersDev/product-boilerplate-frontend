/** Storybook: UserDetailsLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-details-layout--docs */
import { UserDetailsLayout } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';
import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Users → detail.
 * Matches Nexus: Anthers `UserDetailsLayout` over `/user/:id/permission`.
 */
const UserDetails = () => {
  const { data: session } = useSession();

  if (!session?.user.id) {
    return <div className="p-6">Loading…</div>;
  }

  // Mock sessions with manage permission behave as owner so permission editing matches Nexus UX.
  const currentUserType: 'owner' | 'user' = session.permissions.includes('settings.userAndPermissions.manage')
    ? 'owner'
    : 'user';

  return (
    <>
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks className="mb-3" components={['UserDetailsLayout']} />
      {/* @clean-demo-end */}
      <UserDetailsLayout
        apiClient={httpClient}
        currentUserId={session.user.id}
        currentUserType={currentUserType}
        userPermissions={session.permissions}
        onSaveSuccess={() => {
          // Toast is handled inside UserDetailsLayout.
        }}
        onError={(message) => {
          console.error('Error updating user details', message);
        }}
      />
    </>
  );
};

export default UserDetails;
