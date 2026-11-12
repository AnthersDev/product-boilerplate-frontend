import type { FormEvent } from 'react';
import { Button, InputField, SelectBox, SettingLayout } from '@marmeto_engineering/anthers-components';

export type MemberRole = 'Admin' | 'Member';

export interface UserManagementSettingsValues {
  inviteEmail: string;
  defaultRole: MemberRole;
}

interface UserManagementSettingsProps {
  settings: UserManagementSettingsValues;
  onInviteEmailChange: (email: string) => void;
  onDefaultRoleChange: (role: MemberRole) => void;
  onSendInvitation: (event: FormEvent<HTMLFormElement>) => void;
}

const UserManagementSettings = ({
  settings,
  onInviteEmailChange,
  onDefaultRoleChange,
  onSendInvitation,
}: UserManagementSettingsProps) => (
  <div className="space-y-5">
    <SettingLayout
      title="Invite a teammate"
      description="Send an invitation and choose the access level they should start with."
    >
      <form className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]" onSubmit={onSendInvitation}>
        <InputField
          id="invite-email"
          label="Email address"
          type="email"
          required
          placeholder="name@company.com"
          value={settings.inviteEmail}
          onChange={(event) => onInviteEmailChange(event.target.value)}
        />
        <SelectBox
          options={[
            { value: 'Member', label: 'Member' },
            { value: 'Admin', label: 'Admin' },
          ]}
          label="Role"
          value={settings.defaultRole}
          onChange={(option) => {
            if (!Array.isArray(option)) onDefaultRoleChange(option.value as MemberRole);
          }}
        />
        <Button type="submit" variant="primary">
          Send invitation
        </Button>
      </form>
    </SettingLayout>
    <SettingLayout title="Workspace roles" description="Use roles to control what teammates can access.">
      <dl className="divide-y divide-zinc-100">
        <div className="py-3 sm:flex sm:gap-4">
          <dt className="text-title w-24 shrink-0 font-semibold leading-snug text-zinc-800 max-md:text-label">
            Admin
          </dt>
          <dd className="text-label leading-normal font-light text-zinc-500 md:text-body">
            Can manage workspace settings and invite members.
          </dd>
        </div>
        <div className="py-3 sm:flex sm:gap-4">
          <dt className="text-title w-24 shrink-0 font-semibold leading-snug text-zinc-800 max-md:text-label">
            Member
          </dt>
          <dd className="text-label leading-normal font-light text-zinc-500 md:text-body">
            Can access reports and day-to-day workspace tools.
          </dd>
        </div>
      </dl>
    </SettingLayout>
  </div>
);

export default UserManagementSettings;
