/** Auth paths shared by the session client, refresh flow, and mock handlers. */
export const AUTH_ENDPOINTS = {
  signIn: '/auth/sso',
  session: '/auth/session',
  refreshToken: '/auth/refresh-token',
  signOut: '/auth/logout',
  organizations: '/auth/organization',
  selectOrganization: (organizationId: string) => `/auth/organization/${encodeURIComponent(organizationId)}`,
  /** Mock API only: stands in for opening the magic link from the email. */
  mockVerify: '/auth/mock/verify',
  /** Mock API only: marks the access cookie expired so the next request triggers refresh. */
  mockExpireAccess: '/auth/mock/expire-access',
} as const;
