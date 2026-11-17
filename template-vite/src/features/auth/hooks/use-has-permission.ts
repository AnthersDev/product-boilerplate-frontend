import { useSession } from './use-session';

/**
 * Returns whether the signed-in session has the required permission(s).
 * Mirrors Nexus `PermissionGuard` checks against session (cookie) permissions.
 */
export const useHasPermission = (
  requiredPermissions: string | string[],
  options?: { requireAll?: boolean },
): boolean => {
  const { data: session } = useSession();
  const userPermissions = session?.permissions ?? [];
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  if (required.length === 0) return true;
  if (userPermissions.includes('all_permissions')) return true;

  return options?.requireAll
    ? required.every((permission) => userPermissions.includes(permission))
    : required.some((permission) => userPermissions.includes(permission));
};
