import React from 'react';

import { PermissionGuard } from '@/components/PermissionGuard';

/** Permission no mock role receives — forces the AccessDenied UI for every signed-in user. */
const DEMO_DENIED_PERMISSION = 'demo.accessDenied.view';

/**
 * Always shows Anthers AccessDenied via PermissionGuard.
 * Keep this route in the sidebar without requiredPermissions so everyone can open it as a visual reference.
 */
const PermissionsAccessDenied = () => (
  <PermissionGuard
    requiredPermissions={DEMO_DENIED_PERMISSION}
    fallback="denied"
    accessDeniedHeading="Access denied (demo)"
    accessDeniedMessage={`This page always requires ${DEMO_DENIED_PERMISSION}, which is not granted in mock sessions. Use it to preview the AccessDenied screen.`}
  >
    {/* Unreachable in mock mode — kept so the allow path stays obvious if a product grants the demo permission later. */}
    <p className="text-body p-6 text-zinc-700">You somehow have the demo permission.</p>
  </PermissionGuard>
);

export default PermissionsAccessDenied;
