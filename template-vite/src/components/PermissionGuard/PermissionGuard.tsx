import { type ReactNode } from 'react';
/**
 * Storybook:
 * - AccessDenied — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-access-denied--docs
 * - PermissionGuard (Anthers utils) — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/utils-permissionguard--docs
 */
import { AccessDenied } from '@marmeto_engineering/anthers-components';

import { brand } from '@/config';
import { useHasPermission } from '@/features/auth';

export interface PermissionGuardProps {
  children: ReactNode;
  /** One or more permission names the user must have. */
  requiredPermissions: string | string[];
  /** When true, every listed permission is required. Default: any one is enough. */
  requireAll?: boolean;
  /**
   * What to render when access fails.
   * - `hidden` — render nothing (buttons / optional UI). Default.
   * - `denied` — Anthers `AccessDenied` screen (full pages / sections).
   * - custom ReactNode
   */
  fallback?: 'hidden' | 'denied' | ReactNode;
  accessDeniedHeading?: string;
  accessDeniedMessage?: string;
  accessDeniedButtonText?: string;
  supportEmail?: string;
}

/**
 * Hides or blocks UI based on session permissions (Nexus pattern).
 *
 * @example Button (hidden without permission)
 * ```tsx
 * <PermissionGuard requiredPermissions="settings.userAndPermissions.manage">
 *   <Button onClick={...}>Manage users</Button>
 * </PermissionGuard>
 * ```
 *
 * @example Page section (AccessDenied without permission)
 * ```tsx
 * <PermissionGuard requiredPermissions={['settings.general.manage']} fallback="denied">
 *   <GeneralSettings />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard = ({
  children,
  requiredPermissions,
  requireAll = false,
  fallback = 'hidden',
  accessDeniedHeading,
  accessDeniedMessage,
  accessDeniedButtonText,
  supportEmail = brand.supportEmail,
}: PermissionGuardProps) => {
  const hasPermission = useHasPermission(requiredPermissions, { requireAll });

  if (hasPermission) return children;

  if (fallback === 'hidden') return null;
  if (fallback === 'denied') {
    return (
      <AccessDenied
        heading={accessDeniedHeading}
        message={accessDeniedMessage}
        buttonText={accessDeniedButtonText}
        supportEmail={supportEmail}
      />
    );
  }

  return fallback;
};
