import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@marmeto_engineering/anthers-components';

import Cracked from '@/components/Animation/Cracked';
import { env } from '@/libs/env';
import { healthQueryOptions } from '@/services/health-service';

import './Landing.css';

const Landing = () => {
  const { data, isPending, error, refetch, isFetching } = useQuery(healthQueryOptions());

  return (
    <>
      <Cracked>product-boilerplate-frontend</Cracked>
      {env.useMockApi && (
        <p role="status">
          Mock API mode is active. To use your configured API, set VITE_USE_MOCK_API=false in .env.local (and set
          VITE_API_BASE_URL if your API is not at /api), then restart the dev server.
        </p>
      )}
      <p>{isPending ? 'Checking API…' : error ? error.message : `API ${data.status} at ${data.timestamp}`}</p>
      <Button loading={isFetching} onClick={() => refetch()}>
        Recheck API
      </Button>
    </>
  );
};

export default Landing;
