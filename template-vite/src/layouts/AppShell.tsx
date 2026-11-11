import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout, type AppLayoutProps } from '@marmeto_engineering/anthers-components';
import { ChartNoAxesColumn, FileText, Gift, Home as HomeIcon, LifeBuoy, LogOut, Settings } from 'lucide-react';

import { brand } from '@/config';
import { useSession, useSignOut } from '@/features/auth';

type ShellAppLayoutProps = Extract<AppLayoutProps, { showAppList?: false }>;

const AppShell = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: session } = useSession();
  const signOut = useSignOut();

  const userName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || 'User';

  const mainSidebarMenuItems: NonNullable<ShellAppLayoutProps['mainSidebarMenuItems']> = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon size={16} strokeWidth={1.75} />,
      href: '/',
      isActive: pathname === '/',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <ChartNoAxesColumn size={16} strokeWidth={1.75} />,
      isExpanded: pathname.startsWith('/analytics'),
      subItems: [
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileText size={16} strokeWidth={1.75} />,
          href: '#',
        },
      ],
    },
  ];

  const secondarySidebarMenuItems: NonNullable<ShellAppLayoutProps['secondarySidebarMenuItems']> = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} strokeWidth={1.75} />,
      href: '#',
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: <LifeBuoy size={16} strokeWidth={1.75} />,
      href: '#',
    },
    {
      id: 'whats-new',
      label: "What's New",
      icon: <Gift size={16} strokeWidth={1.75} />,
      href: '#',
    },
  ];

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
