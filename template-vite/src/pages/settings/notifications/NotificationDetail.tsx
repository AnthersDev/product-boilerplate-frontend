import { useParams } from 'react-router-dom';
/** Storybook: NotificationDetails — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-notification-page-notification-details-layout--docs */
import { NotificationDetails } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';
import { httpClient } from '@/services/api';

/**
 * Settings → Notifications → detail.
 * Matches Nexus: Anthers `NotificationDetails` for a single template id.
 */
const NotificationDetail = () => {
  const { id = '' } = useParams<{ id: string }>();

  return (
    <>
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks className="mb-3" components={['NotificationDetails']} />
      {/* @clean-demo-end */}
      <NotificationDetails notificationId={id} apiClient={httpClient} />
    </>
  );
};

export default NotificationDetail;
