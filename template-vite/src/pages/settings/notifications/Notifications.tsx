/** Storybook: NotificationPageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-notification-page-notification-page-layout--docs */
import { NotificationPageLayout } from '@marmeto_engineering/anthers-components';

import { useSession } from '@/features/auth';
import { httpClient } from '@/services/api';

/**
 * Settings → Notifications.
 * Matches Nexus: Anthers `NotificationPageLayout` over `/notification/` + `/notification-setting`.
 */
const Notifications = () => {
  const { data: session } = useSession();

  return (
    <NotificationPageLayout
      apiClient={httpClient}
      pagePermission={['settings.notifications.manage']}
      userPermissions={session?.permissions ?? []}
    />
  );
};

export default Notifications;
