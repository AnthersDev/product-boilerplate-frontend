import React from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Storybook:
 * - PageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs
 * - Button — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs
 */
import { Button, PageLayout } from '@marmeto_engineering/anthers-components';
import { ArrowRight, Users } from 'lucide-react';

import { PermissionGuard } from '@/components/PermissionGuard';
import { useHasPermission } from '@/features/auth';
import { env } from '@/libs/env';

/**
 * Page stays visible for everyone; privileged actions use PermissionGuard fallback="hidden" (default).
 */
const PermissionsHidden = () => {
  const navigate = useNavigate();
  const canManageUsers = useHasPermission('settings.userAndPermissions.manage');

  return (
    <PageLayout
      title="Hidden actions"
      description="The page is public to signed-in users. Manage actions only render when the session has permission."
    >
      <div className="flex max-w-xl flex-col gap-6 text-body text-zinc-700">
        <p>
          Default <code>PermissionGuard</code> fallback is <code>&quot;hidden&quot;</code> — good for toolbar buttons
          and optional cards. The page shell stays put so navigation does not feel broken.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/permissions')} className="w-fit">
            Back to overview
          </Button>

          <PermissionGuard requiredPermissions="settings.userAndPermissions.manage">
            <Button
              variant="primary"
              onClick={() => navigate('/settings/users')}
              startIcon={<Users size={16} strokeWidth={1.75} />}
              endIcon={<ArrowRight size={16} strokeWidth={1.75} />}
              className="w-fit"
            >
              Manage users
            </Button>
          </PermissionGuard>
        </div>

        <p className="text-small text-zinc-500">
          Manage users button:{' '}
          <strong className="text-zinc-800">{canManageUsers ? 'visible' : 'hidden'}</strong>
          {env.useMockApi && !canManageUsers
            ? ' — switch to Acme Retail (owner) or Globex Stores (admin) to reveal it.'
            : null}
        </p>
      </div>
    </PageLayout>
  );
};

export default PermissionsHidden;
