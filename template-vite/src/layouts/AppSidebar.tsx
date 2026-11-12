import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@marmeto_engineering/anthers-components';

import { mainNavItems, secondaryNavItems, withActiveNavState } from '@/config/navigation';

/**
 * Nexus-style sidebar: one flat primary list, then a bordered secondary group for Docs.
 * Passed to `AppLayout` as `sidebarMenus` so Anthers does not inject its default nested menus.
 */
const AppSidebar = () => {
  const { pathname } = useLocation();

  const mainItems = useMemo(() => withActiveNavState(mainNavItems, pathname), [pathname]);
  const secondaryItems = useMemo(() => withActiveNavState(secondaryNavItems, pathname), [pathname]);

  return (
    <Sidebar>
      <SidebarMenu menuItems={mainItems} />
      <SidebarMenu withBorder menuItems={secondaryItems} />
    </Sidebar>
  );
};

export default AppSidebar;
