import React from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Storybook:
 * - PageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs
 * - Button — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs
 */
import { Button, PageLayout } from '@marmeto_engineering/anthers-components';
import { ArrowRight } from 'lucide-react';

import { PermissionGuard } from '@/components/PermissionGuard';
import { AnthersStorybookLinks } from '@/demo/anthers-storybook';

/**
 * Full-page allow path: PermissionGuard with fallback="denied".
 * Owner/admin mock orgs have `settings.userAndPermissions.manage` and see this content.
 * Members hitting the URL directly get AccessDenied; the sidebar row shows a lock for them.
 */
const PermissionsAllowed = () => {
  const navigate = useNavigate();

  return (
    <PermissionGuard
      requiredPermissions="settings.userAndPermissions.manage"
      fallback="denied"
      accessDeniedHeading="You need manage permission"
      accessDeniedMessage="This demo page requires settings.userAndPermissions.manage. Switch to an owner or admin organization in mock mode."
    >
      <PageLayout
        title="Allowed content"
        description="You have settings.userAndPermissions.manage, so PermissionGuard rendered this page."
      >
        {/* @clean-demo anthers-storybook */}
        <AnthersStorybookLinks
          className="mb-4"
          components={['PermissionGuard', 'PageLayout', 'Button', 'AccessDenied']}
        />
        {/* @clean-demo-end */}
        <div className="text-body flex max-w-xl flex-col gap-4 text-zinc-700">
          <p>
            Use this pattern for whole screens or sections that must not be usable without a permission. Prefer{' '}
            <code>fallback=&quot;denied&quot;</code> over a blank page so users know why they are blocked.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/settings/users')}
            endIcon={<ArrowRight size={16} strokeWidth={1.75} />}
            className="w-fit"
          >
            Open user management
          </Button>
        </div>
      </PageLayout>
    </PermissionGuard>
  );
};

export default PermissionsAllowed;
