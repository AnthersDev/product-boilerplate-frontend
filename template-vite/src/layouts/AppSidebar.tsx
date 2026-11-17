import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
/**
 * Storybook:
 * - Sidebar / SidebarMenu — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-navigation-sidebar-composed-example--docs
 * - Sidebar With Permission — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-navigation-sidebar-composed-example--with-permission
 */
import { Sidebar, SidebarMenu } from '@marmeto_engineering/anthers-components';

import { mainNavItems, secondaryNavItems, withActiveNavState } from '@/config/navigation';
import { useSession } from '@/features/auth';

/**
 * Nexus-style sidebar: primary list (with nested Permissions demo), then a bordered Docs group.
 * `userPermissions` drives Anthers lock icons on items with `requiredPermissions`.
 */
const AppSidebar = () => {
  const { pathname } = useLocation();
  const { data: session } = useSession();
  const userPermissions = session?.permissions ?? [];

  const mainItems = useMemo(() => withActiveNavState(mainNavItems, pathname), [pathname]);
  const secondaryItems = useMemo(() => withActiveNavState(secondaryNavItems, pathname), [pathname]);

  return (
    <Sidebar userPermissions={userPermissions}>
      <SidebarMenu menuItems={mainItems} />
      <SidebarMenu withBorder menuItems={secondaryItems} />
    </Sidebar>
  );
};

export default AppSidebar;
