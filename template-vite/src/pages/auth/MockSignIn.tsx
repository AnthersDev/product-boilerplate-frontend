import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@marmeto_engineering/anthers-components';

import { StatusScreen } from '@/components/StatusScreen';
import { useCompleteMockSignIn } from '@/features/auth';

/**
 * Mock API only. Stands in for opening the magic link: the real backend sets the
 * session cookies and redirects to /select-org itself.
 */
const MockSignIn = () => {
  const navigate = useNavigate();
  const { mutate, isError, error } = useCompleteMockSignIn();
  // StrictMode runs effects twice in development; sign in only once.
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    mutate(undefined, { onSuccess: () => navigate('/select-org', { replace: true }) });
  }, [mutate, navigate]);

  if (isError) {
    return (
      <StatusScreen
        role="alert"
        title="Sign-in failed"
        description={error.message}
        actions={<Button onClick={() => navigate('/login', { replace: true })}>Back to sign in</Button>}
      />
    );
  }

  return <StatusScreen title="Signing you in…" />;
};

export default MockSignIn;
