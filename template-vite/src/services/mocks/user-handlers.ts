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

interface PermissionCategory {
  id: string;
  label: string;
  subPermissions: { id: string; label: string }[];
}

const STORAGE_KEY = Symbol('mock-api:users');

const ORGANIZATION = { id: 'a5c643d4-572a-4ba4-a9de-48f2b27a293e', name: 'Marmeto' };

/** Catalog returned by create + details permission endpoints (Anthers shape). */
export const PERMISSION_CATALOG: PermissionCategory[] = [
  {
    id: 'home',
    label: 'Home',
    subPermissions: [{ id: 'home.manage', label: 'Manage home' }],
  },
  {
    id: 'projects',
    label: 'Projects',
    subPermissions: [
      { id: 'projects.view', label: 'View projects' },
      { id: 'projects.manage', label: 'Manage projects' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    subPermissions: [
      { id: 'settings.general.manage', label: 'General settings' },
      { id: 'settings.connections.manage', label: 'Connections' },
      { id: 'settings.notifications.manage', label: 'Notifications' },
      { id: 'settings.userAndPermissions.manage', label: 'Users and permissions' },
      { id: 'settings.userAndPermissions.view', label: 'View users and permissions' },
    ],
  },
];

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
      { name: 'settings.userAndPermissions.view' },
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

interface UserStorage {
  users: MockOrganizationUser[];
  /** Emails already mapped onto the session user for "Your account". */
  sessionMapped: boolean;
}

const ok = (data: unknown, message: string, messageCode: string): MockResponse => ({
  data: { status: true, messageCode, message, data },
});

const fail = (status: number, message: string): MockResponse => ({
  status,
  data: { status: false, message },
});

const cloneUsers = () => SAMPLE_USERS.map((user) => ({ ...user, permissions: [...user.permissions] }));

const getStorage = (adapterStorage: Map<symbol, unknown>): UserStorage => {
  const existing = adapterStorage.get(STORAGE_KEY);
  if (existing) return existing as UserStorage;

  const storage: UserStorage = { users: cloneUsers(), sessionMapped: false };
  adapterStorage.set(STORAGE_KEY, storage);
  return storage;
};

/**
 * Prefer showing the signed-in session user under "Your account".
 * When they are not already in the sample list, map them onto the owner row once.
 */
const ensureSessionUser = (
  storage: UserStorage,
  session: NonNullable<ReturnType<typeof getActiveSession>>,
): MockOrganizationUser[] => {
  if (storage.sessionMapped) {
    return storage.users;
  }

  const existingIndex = storage.users.findIndex(
    (user) => user.email === session.user.email || user.id === session.user.id,
  );

  if (existingIndex >= 0) {
    storage.users[existingIndex] = {
      ...storage.users[existingIndex],
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName ?? storage.users[existingIndex].firstName,
      lastName: session.user.lastName ?? storage.users[existingIndex].lastName,
    };
  } else {
    const [owner, ...rest] = storage.users;
    storage.users = [
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
  }

  storage.sessionMapped = true;
  return storage.users;
};

const readPermissionIds = (body: unknown): string[] => {
  if (!body || typeof body !== 'object') return [];
  const permissions = (body as { permissions?: unknown }).permissions;
  if (!Array.isArray(permissions)) return [];
  return permissions.filter((item): item is string => typeof item === 'string');
};

const readEmail = (body: unknown): string | undefined => {
  if (!body || typeof body !== 'object') return undefined;
  const email = (body as { email?: unknown }).email;
  return typeof email === 'string' ? email.trim().toLowerCase() : undefined;
};

const fullNameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? 'user';
  const parts = local.split(/[._-]+/).filter(Boolean);
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Invited';
  const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'User';
  return { firstName, lastName };
};

export const userMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/user',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return fail(401, 'You are not signed in.');

      const storage = getStorage(adapterStorage);
      return ok(ensureSessionUser(storage, session), 'Users list fetched successfully', 'USER_S4');
    },
  },
  {
    method: 'GET',
    path: '/user/permission',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      return ok({ permissions: PERMISSION_CATALOG }, 'Permissions fetched successfully', 'USER_S5');
    },
  },
  {
    method: 'POST',
    path: '/user',
    handler: ({ body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return fail(401, 'You are not signed in.');

      const email = readEmail(body);
      if (!email) return fail(400, 'Email is required.');

      const storage = getStorage(adapterStorage);
      ensureSessionUser(storage, session);

      if (storage.users.some((user) => user.email.toLowerCase() === email)) {
        return fail(409, 'A user with this email already exists.');
      }

      const permissionIds = readPermissionIds(body);
      const { firstName, lastName } = fullNameFromEmail(email);
      const created: MockOrganizationUser = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        userType: 'user',
        userStatus: 'invited',
        organizations: [ORGANIZATION],
        permissions: permissionIds.map((name) => ({ name })),
      };
      storage.users.push(created);

      return ok(null, 'User invited successfully', 'USER_S6');
    },
  },
  {
    method: 'GET',
    path: '/user/:id/permission',
    handler: ({ params, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return fail(401, 'You are not signed in.');

      const storage = getStorage(adapterStorage);
      ensureSessionUser(storage, session);
      const user = storage.users.find((item) => item.id === params.id);
      if (!user) return fail(404, 'User not found.');

      return ok(
        {
          user: {
            fullName: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            userType: user.userType,
            currentPermissions: user.permissions.map((permission) => permission.name),
          },
          permissions: PERMISSION_CATALOG,
        },
        'User permissions fetched successfully',
        'USER_S7',
      );
    },
  },
  {
    method: 'PUT',
    path: '/user/:id/permission',
    handler: ({ params, body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return fail(401, 'You are not signed in.');

      const storage = getStorage(adapterStorage);
      ensureSessionUser(storage, session);
      const user = storage.users.find((item) => item.id === params.id);
      if (!user) return fail(404, 'User not found.');

      if (user.userType === 'owner' && user.id === session.user.id) {
        // Allow self-view but keep owner permissions editable by other owners in mock.
      }

      const permissionIds = readPermissionIds(body);
      user.permissions = permissionIds.map((name) => ({ name }));

      return ok(null, 'User permissions updated successfully', 'USER_S8');
    },
  },
  {
    method: 'DELETE',
    path: '/user/:id',
    handler: ({ params, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;

      const session = getActiveSession(adapterStorage);
      if (!session) return fail(401, 'You are not signed in.');

      const storage = getStorage(adapterStorage);
      ensureSessionUser(storage, session);
      const index = storage.users.findIndex((item) => item.id === params.id);
      if (index < 0) return fail(404, 'User not found.');

      const target = storage.users[index];
      if (target.id === session.user.id) return fail(400, 'You cannot remove your own account.');
      if (target.userType === 'owner') return fail(400, 'Owner accounts cannot be removed.');

      storage.users.splice(index, 1);
      return ok(null, 'User deleted successfully', 'USER_S9');
    },
  },
];
