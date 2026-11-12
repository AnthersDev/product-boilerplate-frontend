import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout, Breadcrumbs, type AppLayoutProps } from '@marmeto_engineering/anthers-components';
import { LogOut } from 'lucide-react';

import { brand } from '@/config';
import { breadcrumbsForPath, mainNavItems, secondaryNavItems, withActiveNavState } from '@/config/navigation';
import { useSession, useSignOut } from '@/features/auth';

type ShellAppLayoutProps = Extract<AppLayoutProps, { showAppList?: false }>;

const AppShell = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: session } = useSession();
  const signOut = useSignOut();

  const userName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || 'User';

  const mainSidebarMenuItems = useMemo(
    () => withActiveNavState(mainNavItems, pathname) as NonNullable<ShellAppLayoutProps['mainSidebarMenuItems']>,
    [pathname],
  );

  const secondarySidebarMenuItems = useMemo(
    () =>
      withActiveNavState(secondaryNavItems, pathname) as NonNullable<ShellAppLayoutProps['secondarySidebarMenuItems']>,
    [pathname],
  );

  const crumbs = useMemo(() => breadcrumbsForPath(pathname), [pathname]);

  const userMenuItems: NonNullable<ShellAppLayoutProps['userMenuItems']> = [
    {
      items: [
        {
          label: 'Switch organization',
          value: 'switch-organization',
          onClick: () => navigate('/select-org'),
        },
        {
          icon: <LogOut size={16} strokeWidth={1.75} />,
          label: 'Sign out',
          value: 'sign-out',
          variant: 'critical',
          onClick: () => signOut.mutate(),
        },
      ],
    },
  ];

  return (
    <AppLayout
      showSearch
      showNotifications
      showAppList={false}
      headerLogo={{
        url: brand.logo,
        alt: brand.name,
        href: '/',
      }}
      user={{
        name: userName,
        email: session?.user.email ?? '',
      }}
      userMenuItems={userMenuItems}
      mainSidebarMenuItems={mainSidebarMenuItems}
      secondarySidebarMenuItems={secondarySidebarMenuItems}
      sidebarFooter={<></>}
      bottomSlot={crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : undefined}
    >
      {signOut.isError && (
        <p role="alert" className="text-small mx-auto mt-4 max-w-2xl px-6 text-red-600">
          {signOut.error.message}
        </p>
      )}
      <Outlet />
    </AppLayout>
  );
};

export default AppShell;
