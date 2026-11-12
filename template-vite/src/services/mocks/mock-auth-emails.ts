/** Test emails that trigger specific mock authentication states. */
export const MOCK_AUTH_EMAILS = {
  signInError: 'fail@example.com',
  noOrganizations: 'no-orgs@example.com',
  singleOrganization: 'one-org@example.com',
  organizationsError: 'org-error@example.com',
} as const;
