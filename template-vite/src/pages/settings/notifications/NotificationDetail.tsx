import { useParams } from 'react-router-dom';
import { NotificationDetails } from '@marmeto_engineering/anthers-components';

import { httpClient } from '@/services/api';

/**
 * Settings → Notifications → detail.
 * Matches Nexus: Anthers `NotificationDetails` for a single template id.
 */
const NotificationDetail = () => {
  const { id = '' } = useParams<{ id: string }>();

  return <NotificationDetails notificationId={id} apiClient={httpClient} />;
};

export default NotificationDetail;
