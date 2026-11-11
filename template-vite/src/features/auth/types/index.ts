export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

/** `base`: signed in, no organization chosen yet. `organization`: an organization is active. */
export type AuthSessionType = 'base' | 'organization';

/** Returned by `GET /auth/session`. The session itself lives in HttpOnly cookies the app never reads. */
export interface AuthSession {
  type: AuthSessionType;
  organizationId: string | null;
  user: AuthUser;
  permissions: string[];
}

/** Matches the `organizations` prop of Anthers `SelectOrganizationPage`. */
export interface Organization {
  id: string;
  name: string;
  role: string;
}
