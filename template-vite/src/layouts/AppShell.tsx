import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppLayout, type AppLayoutProps } from '@marmeto_engineering/anthers-components';
import { LogOut } from 'lucide-react';

import { brand } from '@/config';
import { useSession, useSignOut } from '@/features/auth';

import AppSidebar from './AppSidebar';

type ShellAppLayoutProps = Extract<AppLayoutProps, { showAppList?: false }>;

const AppShell = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const signOut = useSignOut();

  const userName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || 'User';

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
      // Match Nexus: logo + user menu only — no global search or notification bell.
      showSearch={false}
      showNotifications={false}
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
      sidebarMenus={<AppSidebar />}
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
