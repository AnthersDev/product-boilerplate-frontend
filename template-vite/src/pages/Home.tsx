import React from 'react';
import { Link } from 'react-router-dom';
import { Button, HomePageLayout } from '@marmeto_engineering/anthers-components';

import { StatusScreen } from '@/components/StatusScreen';
import { useSession } from '@/features/auth';
import { HomePageLoading, HomePageSections, useHomeDemoScenario, useHomePage } from '@/features/home';
import { env } from '@/libs/env';

const Home = () => {
  const { data: session } = useSession();
  const scenario = useHomeDemoScenario();
  const home = useHomePage();
  const firstName = session?.user.firstName;

  return (
    <>
      {env.useMockApi && (
        <p
          role="status"
          className="text-small mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900"
        >
          Mock API mode is active. Demo states:{' '}
          <Link className="font-semibold underline" to="/">
            default
          </Link>
          ,{' '}
          <Link className="font-semibold underline" to="/?home=empty">
            empty
          </Link>
          ,{' '}
          <Link className="font-semibold underline" to="/?home=error">
            error
          </Link>
          . Current: <code>{scenario}</code>.
        </p>
      )}

      {home.isPending && (
        <HomePageLayout
          title={`Welcome${firstName ? `, ${firstName}` : ''}`}
          description="Loading your workspace overview…"
        >
          <HomePageLoading />
        </HomePageLayout>
      )}

      {home.isError && (
        <StatusScreen
          role="alert"
          title="We couldn't load your home page"
          description={home.error.message}
          actions={
            <Button loading={home.isFetching} onClick={() => home.refetch()}>
              Try again
            </Button>
          }
        />
      )}

      {home.isSuccess && (
        <HomePageLayout
          title={home.data.title === 'Welcome' && firstName ? `Welcome, ${firstName}` : home.data.title}
          description={home.data.description}
        >
          <HomePageSections data={home.data} />
        </HomePageLayout>
      )}
    </>
  );
};

export default Home;
