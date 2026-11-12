import React, { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginPage } from '@marmeto_engineering/anthers-components';

import { brand } from '@/config';
import { clearAnthersAuthToken, signInEndpoint } from '@/features/auth';
import { env } from '@/libs/env';
import { MOCK_AUTH_EMAILS } from '@/services/mocks/mock-auth-emails';

/** Where the backend sends the user after they open the magic link and it sets the session cookies. */
const MAGIC_LINK_REDIRECT_URL = new URL(`${import.meta.env.BASE_URL}select-org`, window.location.origin).toString();

const MOCK_CALLBACK_PATH = '/auth/mock-callback';

// LoginPage only renders the Google button when it has an app ID, so mock mode supplies a placeholder.
const googleAppId = env.useMockApi ? (env.ssoAppId ?? 'mock-app') : env.ssoAppId;

const MockSignInHint = () => (
  <div
    role="note"
    className="text-small fixed inset-x-0 top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-amber-900"
  >
    Mock API: Google signs you in directly. For email, press continue, then{' '}
    <Link to={MOCK_CALLBACK_PATH} className="font-semibold underline">
      finish sign-in
    </Link>{' '}
    (stands in for the email link). Test states: <code>{MOCK_AUTH_EMAILS.signInError}</code>,{' '}
    <code>{MOCK_AUTH_EMAILS.noOrganizations}</code>, <code>{MOCK_AUTH_EMAILS.singleOrganization}</code>,{' '}
    <code>{MOCK_AUTH_EMAILS.organizationsError}</code>.
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  // Runs during the first render, before LoginPage's mount effect reads the token.
  useState(clearAnthersAuthToken);

  // LoginPage sends Google sign-in to the real identity service, which has no session for the mock API.
  const onMockGoogleSignInCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!env.useMockApi) return;
    const button = (event.target as Element).closest('button');
    if (!button?.textContent?.includes('Google')) return;
    event.preventDefault();
    event.stopPropagation();
    navigate(MOCK_CALLBACK_PATH);
  };

  return (
    <div onClickCapture={onMockGoogleSignInCapture}>
      {env.useMockApi && <MockSignInHint />}
      <LoginPage
        backendAuthEndpoint={signInEndpoint}
        redirectUrl={MAGIC_LINK_REDIRECT_URL}
        appId={googleAppId}
        logoImage={brand.logo}
        logoLink={brand.logoLink}
        backgroundImage={brand.loginBackgroundImage}
        supportEmail={brand.supportEmail}
        supportUrl={brand.supportUrl}
      />
    </div>
  );
};

export default Login;
