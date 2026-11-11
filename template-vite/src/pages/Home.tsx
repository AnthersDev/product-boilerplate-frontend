import React from 'react';
import { HomePageLayout } from '@marmeto_engineering/anthers-components';

import { useSession } from '@/features/auth';
import { HomePageSections } from '@/features/home';
import { env } from '@/libs/env';

const Home = () => {
  const { data: session } = useSession();
  const firstName = session?.user.firstName;

  return (
    <>
      {env.useMockApi && (
        <p
          role="status"
          className="text-small mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900"
        >
          Mock API mode is active. Sample home content is shown below. Set VITE_USE_MOCK_API=false in .env.local to call
          your API.
        </p>
      )}
      <HomePageLayout
        title={`Welcome${firstName ? `, ${firstName}` : ''}`}
        description="Your unified workspace overview. Replace these sections with your product’s home content."
      >
        <HomePageSections />
      </HomePageLayout>
    </>
  );
};

export default Home;
