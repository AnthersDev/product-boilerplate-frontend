import React from 'react';
import { Link } from 'react-router-dom';
/** Storybook: PageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs */
import { PageLayout } from '@marmeto_engineering/anthers-components';

import { useSession } from '@/features/auth';
import { env } from '@/libs/env';

/**
 * Demo hub for PermissionGuard + nested sidebar permissions.
 * Open the Permissions group in the sidebar to compare allowed, denied, hidden, and locked-nav states.
 */
const PermissionsOverview = () => {
  const { data: session } = useSession();
  const permissions = session?.permissions ?? [];

  return (
    <PageLayout
      title="Permissions demo"
      description="Nested sidebar examples of Anthers menu permissions and the local PermissionGuard."
    >
      <div className="text-body flex max-w-2xl flex-col gap-6 text-zinc-700">
        <p>
          The <strong>Permissions</strong> sidebar group uses nested <code>subItems</code>. Items can declare{' '}
          <code>requiredPermissions</code>; when the session is missing them, Anthers shows a lock icon on that row.
          Page content uses <code>PermissionGuard</code> for allowed, access-denied, and hidden-button patterns.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Link className="font-medium text-zinc-900 underline" to="/permissions/allowed">
              Allowed content
            </Link>{' '}
            — page + nav require <code>settings.userAndPermissions.manage</code> (owner/admin in mock).
          </li>
          <li>
            <Link className="font-medium text-zinc-900 underline" to="/permissions/access-denied">
              Access denied
            </Link>{' '}
            — always blocked with <code>fallback=&quot;denied&quot;</code> so you can see the AccessDenied screen.
          </li>
          <li>
            <Link className="font-medium text-zinc-900 underline" to="/permissions/hidden">
              Hidden actions
            </Link>{' '}
            — page stays open; manage actions disappear without the permission.
          </li>
        </ul>

        {env.useMockApi && (
          <p className="text-small rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
            Mock tip: sign in as <code>demo@example.com</code>, pick <strong>Acme Retail</strong> (owner) to unlock
            Allowed content, then switch to <strong>Initech Outlet</strong> (member) to see the locked nav row and
            hidden buttons.
          </p>
        )}

        <div>
          <p className="mb-2 font-medium text-zinc-900">Your session permissions</p>
          {permissions.length === 0 ? (
            <p className="text-zinc-500">None on this session.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <li
                  key={permission}
                  className="text-small rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-zinc-700"
                >
                  {permission}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default PermissionsOverview;
