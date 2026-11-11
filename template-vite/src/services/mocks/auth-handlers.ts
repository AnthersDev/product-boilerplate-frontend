import type { AuthSession, Organization } from '@/features/auth';

import type { MockResponse, MockRoute } from './types';

/**
 * Test emails that trigger specific states. Any other email signs in as a user with three organizations.
 */
export const MOCK_AUTH_EMAILS = {
  signInError: 'fail@example.com',
  noOrganizations: 'no-orgs@example.com',
  singleOrganization: 'one-org@example.com',
  organizationsError: 'org-error@example.com',
} as const;

const DEFAULT_EMAIL = 'demo@example.com';
const STORAGE_KEY = 'mock-api:auth';

const ORGANIZATIONS: Organization[] = [
  { id: 'org_acme', name: 'Acme Retail', role: 'owner' },
  { id: 'org_globex', name: 'Globex Stores', role: 'admin' },
  { id: 'org_initech', name: 'Initech Outlet', role: 'member' },
];

const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  owner: ['dashboard:view', 'settings:manage', 'users:manage'],
  admin: ['dashboard:view', 'settings:manage'],
  member: ['dashboard:view'],
};

interface MockAuthState {
  pendingEmail: string | null;
  session: AuthSession | null;
}

interface MockAuthStorage {
  memoryState: MockAuthState;
  useMemoryState: boolean;
  sessionPersisted: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string';

const isAuthSession = (value: unknown): value is AuthSession => {
  if (
    !isRecord(value) ||
    (value.type !== 'base' && value.type !== 'organization') ||
    !isNullableString(value.organizationId) ||
    !Array.isArray(value.permissions) ||
    !value.permissions.every((permission) => typeof permission === 'string') ||
    !isRecord(value.user)
  ) {
    return false;
  }

  const { user } = value;
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    isNullableString(user.firstName) &&
    isNullableString(user.lastName)
  );
};

const isMockAuthState = (value: unknown): value is MockAuthState => {
  if (!isRecord(value) || !isNullableString(value.pendingEmail)) return false;
  return value.session === null || isAuthSession(value.session);
};

// sessionStorage stands in for the session cookie so a reload keeps you signed in, like the real API.
const AUTH_STORAGE_KEY = Symbol('mock-api:auth-state');

const getAuthStorage = (adapterStorage: Map<symbol, unknown>): MockAuthStorage => {
  const existing = adapterStorage.get(AUTH_STORAGE_KEY);
  if (existing) return existing as MockAuthStorage;

  const storage: MockAuthStorage = {
    memoryState: { pendingEmail: null, session: null },
    useMemoryState: false,
    sessionPersisted: false,
  };
  adapterStorage.set(AUTH_STORAGE_KEY, storage);
  return storage;
};

const readState = (adapterStorage: Map<symbol, unknown>): MockAuthState => {
  const storage = getAuthStorage(adapterStorage);
  if (storage.useMemoryState) return storage.memoryState;

  let raw: string | null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    storage.useMemoryState = true;
    return storage.memoryState;
  }

  if (raw) {
    try {
      const state: unknown = JSON.parse(raw);
      if (isMockAuthState(state)) {
        storage.memoryState = state;
        storage.sessionPersisted = state.session !== null;
        return state;
      }
    } catch {
      // Ignore malformed stored data while keeping sessionStorage available for later writes.
    }
  }

  storage.memoryState = { pendingEmail: null, session: null };
  storage.sessionPersisted = false;
  return storage.memoryState;
};

const writeState = (adapterStorage: Map<symbol, unknown>, state: MockAuthState): boolean => {
  const storage = getAuthStorage(adapterStorage);
  if (storage.useMemoryState) {
    storage.memoryState = state;
    return false;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    storage.useMemoryState = true;
    storage.memoryState = state;
    return false;
  }

  storage.memoryState = state;
  storage.sessionPersisted = state.session !== null;
  return true;
};

const ok = (data: unknown, message?: string): MockResponse => ({ data: { status: true, message, data } });
const fail = (status: number, message: string): MockResponse => ({ status, data: { status: false, message } });
const unauthorized = () => fail(401, 'You are not signed in.');

const organizationsFor = (email: string): Organization[] => {
  if (email === MOCK_AUTH_EMAILS.noOrganizations) return [];
  if (email === MOCK_AUTH_EMAILS.singleOrganization) return ORGANIZATIONS.slice(0, 1);
  return ORGANIZATIONS;
};

const readEmail = (body: unknown): string => {
  if (body && typeof body === 'object' && 'email' in body && typeof body.email === 'string') {
    return body.email.trim().toLowerCase();
  }
  return '';
};

const toUser = (email: string): AuthSession['user'] => {
  const [name] = email.split('@');
  return {
    id: `user_${name}`,
    email,
    firstName: name.charAt(0).toUpperCase() + name.slice(1),
    lastName: null,
  };
};

export const authMockRoutes: MockRoute[] = [
  {
    method: 'POST',
    path: '/auth/sso',
    handler: ({ body, adapterStorage }) => {
      const email = readEmail(body);
      if (email === MOCK_AUTH_EMAILS.signInError) {
        return fail(400, 'We could not find an account for this email.');
      }
      writeState(adapterStorage, { ...readState(adapterStorage), pendingEmail: email || DEFAULT_EMAIL });
      return ok(null, 'Magic link sent.');
    },
  },
  {
    method: 'POST',
    path: '/auth/mock/verify',
    handler: ({ adapterStorage }) => {
      const state = readState(adapterStorage);
      const email = state.pendingEmail ?? DEFAULT_EMAIL;
      const session: AuthSession = { type: 'base', organizationId: null, user: toUser(email), permissions: [] };
      writeState(adapterStorage, { pendingEmail: null, session });
      return ok(session);
    },
  },
  {
    method: 'GET',
    path: '/auth/session',
    handler: ({ adapterStorage }) => {
      const { session } = readState(adapterStorage);
      return session ? ok(session) : unauthorized();
    },
  },
  {
    method: 'GET',
    path: '/auth/organization',
    handler: ({ adapterStorage }) => {
      const { session } = readState(adapterStorage);
      if (!session) return unauthorized();
      if (session.user.email === MOCK_AUTH_EMAILS.organizationsError) {
        return fail(500, 'Could not load organizations.');
      }
      return ok(organizationsFor(session.user.email));
    },
  },
  {
    method: 'POST',
    path: '/auth/organization/:organizationId',
    handler: ({ params, adapterStorage }) => {
      const state = readState(adapterStorage);
      if (!state.session) return unauthorized();
      const organization = organizationsFor(state.session.user.email).find(({ id }) => id === params.organizationId);
      if (!organization) return fail(404, 'Organization not found.');

      const session: AuthSession = {
        ...state.session,
        type: 'organization',
        organizationId: organization.id,
        permissions: PERMISSIONS_BY_ROLE[organization.role] ?? [],
      };
      writeState(adapterStorage, { ...state, session });
      return ok(session);
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: ({ adapterStorage }) => {
      const previousState = readState(adapterStorage);
      const storage = getAuthStorage(adapterStorage);
      const isSessionPersisted = storage.sessionPersisted;
      if (!writeState(adapterStorage, { pendingEmail: null, session: null }) && isSessionPersisted) {
        storage.memoryState = previousState;
        return fail(500, 'Could not persist logout.');
      }
      return ok(null);
    },
  },
];
