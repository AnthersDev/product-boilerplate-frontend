import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@marmeto_engineering/anthers-components';

/**
 * Placeholder for Nexus `UserDetails`. Row clicks from `UserListingLayout` land here.
 * Replace with Anthers user-details layout when permissions editing is added.
 */
const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout
      title="User details"
      description="User permission editing will live here (same pattern as Nexus)."
      onBack={() => navigate('/settings/users')}
    >
      <p className="text-body text-zinc-600">
        Selected user id: <span className="font-medium text-zinc-900">{id}</span>
      </p>
    </PageLayout>
  );
};

export default UserDetails;
