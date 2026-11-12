import { createElement, type ReactElement } from 'react';
import { FileText, Gift, Home as HomeIcon, LifeBuoy, Settings } from 'lucide-react';

export interface NavCrumbProps {
  label: string;
  href: string;
}

export interface NavItemProps {
  id: string;
  label: string;
  href: string;
  icon?: ReactElement;
  target?: '_blank' | '_self';
  /** Match this path (and children) for the active state. Defaults to `href`. */
  matchPath?: string;
}

const icon = (Icon: typeof HomeIcon) => createElement(Icon, { size: 16, strokeWidth: 1.75 });

/**
 * Primary sidebar items. Flat list like Nexus — products replace or extend this.
 * Nested “Analytics > Reports” menus are avoided so the active state stays a single row.
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
    id: 'settings',
    label: 'Settings',
    href: '/settings',
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
  return pathname === target || pathname.startsWith(`${target}/`);
};

/** Marks `isActive` from the current location for Anthers sidebar items. */
export const withActiveNavState = (items: NavItemProps[], pathname: string) =>
  items.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item),
  }));

/**
 * Breadcrumbs for the current path. Home alone is omitted (the page title is enough).
 */
export const breadcrumbsForPath = (pathname: string): NavCrumbProps[] => {
  if (pathname === '/') return [];

  const match = [...mainNavItems, ...secondaryNavItems]
    .filter((item) => !item.href.startsWith('http') && isPathActive(pathname, item))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const crumbs: NavCrumbProps[] = [{ label: 'Home', href: '/' }];

  if (match) {
    crumbs.push({ label: match.label, href: match.href });
    return crumbs;
  }

  const segment = pathname.split('/').filter(Boolean).pop() ?? 'Page';
  crumbs.push({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: pathname,
  });
  return crumbs;
};
