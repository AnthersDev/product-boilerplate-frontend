import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@marmeto_engineering/anthers-components';

import Cracked from '@/components/Animation/Cracked';
import { healthQueryOptions } from '@/services/health-service';

import './Landing.css';

const Landing = () => {
  const { data, isPending, error, refetch, isFetching } = useQuery(healthQueryOptions());

  return (
    <>
      <Cracked>product-boilerplate-frontend</Cracked>
      <p>{isPending ? 'Checking API…' : error ? error.message : `API ${data.status} at ${data.timestamp}`}</p>
      <Button loading={isFetching} onClick={() => refetch()}>
        Recheck API
      </Button>
    </>
  );
};

export default Landing;
