import { createElement, type ReactElement } from 'react';
import { ChartNoAxesColumn, FileText, Gift, Home as HomeIcon, LifeBuoy, Settings } from 'lucide-react';

export interface NavCrumbProps {
  label: string;
  href: string;
}

export interface NavItemProps {
  id: string;
  label: string;
  href?: string;
  icon?: ReactElement;
  /** Match this path (and children) for the active state. Defaults to `href`. */
  matchPath?: string;
  subItems?: NavItemProps[];
}

const icon = (Icon: typeof HomeIcon) => createElement(Icon, { size: 16, strokeWidth: 1.75 });

/** Primary sidebar. Products replace or extend this list. */
export const mainNavItems: NavItemProps[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: icon(HomeIcon),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: icon(ChartNoAxesColumn),
    matchPath: '/analytics',
    subItems: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/analytics/reports',
        icon: icon(FileText),
      },
    ],
  },
];

/** Secondary sidebar (below the divider). */
export const secondaryNavItems: NavItemProps[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: icon(Settings),
  },
  {
    id: 'help',
    label: 'Help Center',
    href: 'https://docs.example.com',
    icon: icon(LifeBuoy),
  },
  {
    id: 'whats-new',
    label: "What's New",
    href: '/whats-new',
    icon: icon(Gift),
  },
];

const isPathActive = (pathname: string, item: NavItemProps) => {
  const target = item.matchPath ?? item.href;
  if (!target || target.startsWith('http')) return false;
  if (target === '/') return pathname === '/';
  return pathname === target || pathname.startsWith(`${target}/`);
};

/** Marks `isActive` / `isExpanded` from the current location for Anthers sidebar items. */
export const withActiveNavState = (items: NavItemProps[], pathname: string) =>
  items.map((item) => {
    const subItems = item.subItems?.map((sub) => ({
      ...sub,
      isActive: isPathActive(pathname, sub),
    }));
    const isChildActive = subItems?.some((sub) => sub.isActive) ?? false;
    return {
      ...item,
      isActive: isPathActive(pathname, item) || isChildActive,
      isExpanded: Boolean(item.subItems) && (isChildActive || isPathActive(pathname, item)),
      subItems,
    };
  });

const flatNav = (items: NavItemProps[]): NavItemProps[] =>
  items.flatMap((item) => [item, ...(item.subItems ? flatNav(item.subItems) : [])]);

/**
 * Breadcrumbs for the current path. Home alone is omitted (the page title is enough).
 * Unknown paths fall back to a single crumb for the last segment.
 */
export const breadcrumbsForPath = (pathname: string): NavCrumbProps[] => {
  if (pathname === '/') return [];

  const known = flatNav([...mainNavItems, ...secondaryNavItems]).filter(
    (item) => item.href && !item.href.startsWith('http') && isPathActive(pathname, item),
  );

  const crumbs: NavCrumbProps[] = [{ label: 'Home', href: '/' }];

  if (known.length > 0) {
    const best = known.sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];
    if (best.href?.startsWith('/analytics')) {
      crumbs.push({ label: 'Analytics', href: '/analytics/reports' });
    }
    if (best.label !== 'Analytics') {
      crumbs.push({ label: best.label, href: best.href ?? pathname });
    }
    return crumbs;
  }

  const segment = pathname.split('/').filter(Boolean).pop() ?? 'Page';
  crumbs.push({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: pathname,
  });
  return crumbs;
};
