import { createElement, type ReactElement } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  EyeOff,
  FileText,
  Gift,
  Home as HomeIcon,
  LifeBuoy,
  Lock,
  Settings,
  Shield,
} from 'lucide-react';

export interface NavItemProps {
  id: string;
  label: string;
  href?: string;
  icon?: ReactElement;
  target?: '_blank' | '_self';
  /** Match this path (and children) for the active state. Defaults to `href`. */
  matchPath?: string;
  /** Nested Anthers sidebar rows (`SidebarMenu` `subItems`). */
  subItems?: NavItemProps[];
  /** When set, Anthers shows a lock if the session lacks these permissions. */
  requiredPermissions?: string[];
  permissionMode?: 'any' | 'all';
  isExpanded?: boolean;
  isActive?: boolean;
}

const icon = (Icon: typeof HomeIcon) => createElement(Icon, { size: 16, strokeWidth: 1.75 });

/**
 * Primary sidebar items. Includes a nested Permissions demo for PermissionGuard + menu locks.
 * Products can keep a flat list or add their own `subItems`.
 */
export const mainNavItems: NavItemProps[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: icon(HomeIcon),
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/analytics/reports',
    matchPath: '/analytics',
    icon: icon(FileText),
  },
  {
    id: 'registration',
    label: 'Registration',
    href: '/registration',
    icon: icon(ClipboardList),
  },
  {
    id: 'permissions',
    label: 'Permissions',
    href: '/permissions',
    matchPath: '/permissions',
    icon: icon(Shield),
    subItems: [
      {
        id: 'permissions-overview',
        label: 'Overview',
        href: '/permissions',
        icon: icon(Shield),
      },
      {
        id: 'permissions-allowed',
        label: 'Allowed content',
        href: '/permissions/allowed',
        icon: icon(CheckCircle2),
        requiredPermissions: ['settings.userAndPermissions.manage'],
      },
      {
        id: 'permissions-access-denied',
        label: 'Access denied',
        href: '/permissions/access-denied',
        icon: icon(Lock),
      },
      {
        id: 'permissions-hidden',
        label: 'Hidden actions',
        href: '/permissions/hidden',
        icon: icon(EyeOff),
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    matchPath: '/settings',
    icon: icon(Settings),
  },
  {
    id: 'whats-new',
    label: "What's New",
    href: '/whats-new',
    icon: icon(Gift),
  },
];

/** Second group (divider above), typically docs / external links. */
export const secondaryNavItems: NavItemProps[] = [
  {
    id: 'docs',
    label: 'Docs',
    href: 'https://docs.example.com',
    target: '_blank',
    icon: icon(LifeBuoy),
  },
];

const isPathActive = (pathname: string, item: NavItemProps) => {
  const target = item.matchPath ?? item.href;
  if (!target || target.startsWith('http')) return false;
  if (target === '/') return pathname === '/';
  // Exact match for leaf routes that share a parent prefix (e.g. /permissions vs /permissions/allowed).
  if (!item.subItems?.length && !item.matchPath) {
    return pathname === target;
  }
  return pathname === target || pathname.startsWith(`${target}/`);
};

const withActiveNavStateRecursive = (items: NavItemProps[], pathname: string): NavItemProps[] =>
  items.map((item) => {
    const subItems = item.subItems ? withActiveNavStateRecursive(item.subItems, pathname) : undefined;
    const isChildActive = Boolean(subItems?.some((sub) => sub.isActive || sub.isExpanded));
    const isActive = isPathActive(pathname, item) || isChildActive;

    return {
      ...item,
      isActive,
      isExpanded: isChildActive || item.isExpanded,
      ...(subItems ? { subItems } : {}),
    };
  });

/** Marks `isActive` / `isExpanded` from the current location for Anthers sidebar items (including nested). */
export const withActiveNavState = (items: NavItemProps[], pathname: string) =>
  withActiveNavStateRecursive(items, pathname);
