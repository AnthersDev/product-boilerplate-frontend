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
const readState = (): MockAuthState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state: unknown = JSON.parse(raw);
      if (isMockAuthState(state)) return state;
    }
  } catch {
    // Fall through to a signed-out state.
  }
  return { pendingEmail: null, session: null };
};

const writeState = (state: MockAuthState) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the mock session then lasts until reload.
  }
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
    handler: ({ body }) => {
      const email = readEmail(body);
      if (email === MOCK_AUTH_EMAILS.signInError) {
        return fail(400, 'We could not find an account for this email.');
      }
      writeState({ ...readState(), pendingEmail: email || DEFAULT_EMAIL });
      return ok(null, 'Magic link sent.');
    },
  },
  {
    method: 'POST',
    path: '/auth/mock/verify',
    handler: () => {
      const state = readState();
      const email = state.pendingEmail ?? DEFAULT_EMAIL;
      const session: AuthSession = { type: 'base', organizationId: null, user: toUser(email), permissions: [] };
      writeState({ pendingEmail: null, session });
      return ok(session);
    },
  },
  {
    method: 'GET',
    path: '/auth/session',
    handler: () => {
      const { session } = readState();
      return session ? ok(session) : unauthorized();
    },
  },
  {
    method: 'GET',
    path: '/auth/organization',
    handler: () => {
      const { session } = readState();
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
    handler: ({ params }) => {
      const state = readState();
      if (!state.session) return unauthorized();
      const organization = organizationsFor(state.session.user.email).find(({ id }) => id === params.organizationId);
      if (!organization) return fail(404, 'Organization not found.');

      const session: AuthSession = {
        ...state.session,
        type: 'organization',
        organizationId: organization.id,
        permissions: PERMISSIONS_BY_ROLE[organization.role] ?? [],
      };
      writeState({ ...state, session });
      return ok(session);
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: () => {
      writeState({ pendingEmail: null, session: null });
      return ok(null);
    },
  },
];
