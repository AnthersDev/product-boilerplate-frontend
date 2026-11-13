import { getActiveSession, getUnauthorizedSessionResponse } from './auth-handlers';
import type { MockResponse, MockRoute } from './types';

/** Shape returned by `GET /user` and consumed by Anthers `UserListingLayout`. */
export interface MockOrganizationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'owner' | 'user';
  userStatus: 'invited' | 'verified';
  organizations: { id: string; name: string }[];
  permissions: { name: string }[];
}

const ORGANIZATION = { id: 'a5c643d4-572a-4ba4-a9de-48f2b27a293e', name: 'Marmeto' };

const SAMPLE_USERS: MockOrganizationUser[] = [
  {
    id: '9e30f7d6-fc88-4078-82d8-fed485f6d86a',
    firstName: 'Anand',
    lastName: 'Singh',
    email: 'anand.s@marmeto.com',
    userType: 'owner',
    userStatus: 'verified',
    organizations: [ORGANIZATION],
    permissions: [
      { name: 'home.manage' },
      { name: 'projects.view' },
      { name: 'projects.manage' },
      { name: 'settings.general.manage' },
      { name: 'settings.connections.manage' },
      { name: 'settings.notifications.manage' },
      { name: 'settings.userAndPermissions.manage' },
    ],
  },
  {
    id: '9e802e21-b55d-4741-84a3-8f00f6976a18',
    firstName: 'Nishant',
    lastName: 'Kumar',
    email: 'nishant.k@marmeto.com',
    userType: 'user',
    userStatus: 'invited',
    organizations: [ORGANIZATION],
    permissions: [{ name: 'home.manage' }],
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.s@marmeto.com',
    userType: 'user',
    userStatus: 'verified',
    organizations: [ORGANIZATION],
    permissions: [{ name: 'home.manage' }, { name: 'projects.view' }],
  },
];

const ok = (data: unknown, message = 'Users list fetched successfully', messageCode = 'USER_S4'): MockResponse => ({
  data: { status: true, messageCode, message, data },
});

/**
 * Prefer showing the signed-in session user under "Your account".
 * When they are not already in the sample list, map them onto the owner row.
 */
const usersForSession = (session: NonNullable<ReturnType<typeof getActiveSession>>): MockOrganizationUser[] => {
  const existingIndex = SAMPLE_USERS.findIndex(
    (user) => user.email === session.user.email || user.id === session.user.id,
  );
  if (existingIndex >= 0) {
    return SAMPLE_USERS.map((user, index) =>
      index === existingIndex
        ? {
            ...user,
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.firstName ?? user.firstName,
            lastName: session.user.lastName ?? user.lastName,
          }
        : user,
    );
  }

  const [owner, ...rest] = SAMPLE_USERS;
  return [
    {
      ...owner,
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName ?? owner.firstName,
      lastName: session.user.lastName ?? owner.lastName,
      userType: 'owner',
      userStatus: 'verified',
    },
    ...rest,
  ];
};

export const userMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/user',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return { status: 401, data: { status: false, message: 'You are not signed in.' } };

      return ok(usersForSession(session));
    },
  },
];
