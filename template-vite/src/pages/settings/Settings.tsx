import React, { useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  InputField,
  PageLayout,
  SelectBox,
  SettingLayout,
  SettingListLayout,
  show,
} from '@marmeto_engineering/anthers-components';
import { Bell, Building2, Users } from 'lucide-react';
import GeneralSettings, { type GeneralSettingsValues } from './GeneralSettings';

type SettingsSection = 'general' | 'user-management' | 'notifications';
type MemberRole = 'Admin' | 'Member';

interface SettingsValues {
  general: GeneralSettingsValues;
  userManagement: {
    inviteEmail: string;
    defaultRole: MemberRole;
  };
  notifications: {
    securityAlerts: boolean;
    productUpdates: boolean;
    weeklySummary: boolean;
  };
}

const createInitialSettings = (): SettingsValues => ({
  general: {
    workspaceName: 'Your organization',
    appListingUrl: '',
    supportEmail: 'support@example.com',
    timezone: 'Etc/GMT+12',
    brandLogo: '',
    brandFavicon: '',
    brandDocuments: [],
  },
  userManagement: {
    inviteEmail: '',
    defaultRole: 'Member',
  },
  notifications: {
    securityAlerts: true,
    productUpdates: false,
    weeklySummary: true,
  },
});

const SETTINGS_STORAGE_KEY = 'product-boilerplate-settings';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isSettingsValues = (value: unknown): value is SettingsValues => {
  if (
    !isRecord(value) ||
    !isRecord(value.general) ||
    !isRecord(value.userManagement) ||
    !isRecord(value.notifications)
  ) {
    return false;
  }

  const { general, userManagement, notifications } = value;
  return (
    typeof general.workspaceName === 'string' &&
    typeof general.appListingUrl === 'string' &&
    typeof general.supportEmail === 'string' &&
    typeof general.timezone === 'string' &&
    typeof general.brandLogo === 'string' &&
    typeof general.brandFavicon === 'string' &&
    Array.isArray(general.brandDocuments) &&
    general.brandDocuments.every((document) => typeof document === 'string') &&
    typeof userManagement.inviteEmail === 'string' &&
    (userManagement.defaultRole === 'Admin' || userManagement.defaultRole === 'Member') &&
    typeof notifications.securityAlerts === 'boolean' &&
    typeof notifications.productUpdates === 'boolean' &&
    typeof notifications.weeklySummary === 'boolean'
  );
};

const loadSettings = (): SettingsValues => {
  try {
    if (typeof window === 'undefined') return createInitialSettings();
    const storedSettings = window.sessionStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!storedSettings) return createInitialSettings();

    const parsedSettings: unknown = JSON.parse(storedSettings);
    return isSettingsValues(parsedSettings) ? parsedSettings : createInitialSettings();
  } catch {
    return createInitialSettings();
  }
};

const getSettingsValidationErrors = (settings: SettingsValues) => {
  const errors: Partial<Record<'appListingUrl' | 'supportEmail', string>> = {};
  const { supportEmail, appListingUrl } = settings.general;

  if (supportEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail.trim())) {
    errors.supportEmail = 'Enter a valid email address.';
  }

  if (appListingUrl.trim()) {
    try {
      const url = new URL(appListingUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
        errors.appListingUrl = 'Enter a valid http or https URL.';
      }
    } catch {
      errors.appListingUrl = 'Enter a valid http or https URL.';
    }
  }

  return errors;
};

const sectionContent: Record<SettingsSection, { title: string; description: string }> = {
  general: {
    title: 'General Settings',
    description:
      'Manage your account preferences and basic settings here. You can update your profile information and configure default behaviors.',
  },
  'user-management': {
    title: 'User management',
    description: 'Invite teammates and choose the default role for new members.',
  },
  notifications: {
    title: 'Notifications',
    description: 'Choose which updates and reminders are sent to your inbox.',
  },
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);
  const [savedSettings, setSavedSettings] = useState(loadSettings);
  const [draftSettings, setDraftSettings] = useState(savedSettings);
  const [generalErrors, setGeneralErrors] = useState<Partial<Record<'appListingUrl' | 'supportEmail', string>>>({});
  const hasChanges = JSON.stringify(savedSettings) !== JSON.stringify(draftSettings);

  const onGeneralChange = <Field extends keyof SettingsValues['general']>(
    field: Field,
    value: SettingsValues['general'][Field],
  ) => {
    setDraftSettings((current) => ({
      ...current,
      general: { ...current.general, [field]: value },
    }));
    if (field === 'appListingUrl' || field === 'supportEmail') {
      setGeneralErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const updateUserManagement = <Field extends keyof SettingsValues['userManagement']>(
    field: Field,
    value: SettingsValues['userManagement'][Field],
  ) => {
    setDraftSettings((current) => ({
      ...current,
      userManagement: { ...current.userManagement, [field]: value },
    }));
  };

  const updateNotification = (field: keyof SettingsValues['notifications'], checked: boolean) => {
    setDraftSettings((current) => ({
      ...current,
      notifications: { ...current.notifications, [field]: checked },
    }));
  };

  const onSaveChanges = () => {
    const errors = getSettingsValidationErrors(draftSettings);
    setGeneralErrors(errors);
    if (Object.keys(errors).length > 0) {
      show('Please correct the highlighted fields before saving.', { type: 'error' });
      return;
    }

    try {
      window.sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(draftSettings));
    } catch {
      show('Settings could not be saved in this browser session.', { type: 'error' });
      return;
    }

    setSavedSettings(draftSettings);
    show('Settings saved for this session.', { type: 'success' });
  };

  const onDiscardChanges = () => {
    setDraftSettings(savedSettings);
    setGeneralErrors({});
  };

  const onSendInvitation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    show(`Invitation prepared for ${draftSettings.userManagement.inviteEmail} (demo).`, { type: 'success' });
    updateUserManagement('inviteEmail', '');
  };

  if (!activeSection) {
    return (
      <SettingListLayout
        title="Settings"
        description="View and manage your workspace settings."
        cards={[
          {
            icon: <Building2 strokeWidth={1.75} />,
            title: 'General',
            description: 'Manage workspace details and regional preferences.',
            onClick: () => setActiveSection('general'),
          },
          {
            icon: <Users strokeWidth={1.75} />,
            title: 'User management',
            description: 'Invite users and manage their access.',
            onClick: () => setActiveSection('user-management'),
          },
          {
            icon: <Bell strokeWidth={1.75} />,
            title: 'Notifications',
            description: 'Choose which updates are sent to your inbox.',
            onClick: () => setActiveSection('notifications'),
          },
        ]}
      />
    );
  }

  const currentSection = sectionContent[activeSection];

  return (
    <PageLayout
      title={currentSection.title}
      description={currentSection.description}
      onBack={() => setActiveSection(null)}
    >
      <div className="space-y-6">
        <Card className="shadow-sm">
          <Card.Content className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-small font-medium text-zinc-900" role="status" aria-live="polite">
                {hasChanges ? 'Unsaved changes' : 'All changes saved'}
              </p>
              <p className="text-small mt-1 text-zinc-500">Settings are saved for this browser session.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={!hasChanges} onClick={onDiscardChanges}>
                Discard
              </Button>
              <Button type="button" variant="primary" disabled={!hasChanges} onClick={onSaveChanges}>
                Save
              </Button>
            </div>
          </Card.Content>
        </Card>

        {activeSection === 'general' && (
          <GeneralSettings
            settings={draftSettings.general}
            description={sectionContent.general.description}
            errors={generalErrors}
            onChange={onGeneralChange}
          />
        )}

        {activeSection === 'user-management' && (
          <div className="space-y-5">
            <SettingLayout
              title="Invite a teammate"
              description="Send an invitation and choose the access level they should start with."
            >
              <form
                className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
                onSubmit={onSendInvitation}
              >
                <InputField
                  id="invite-email"
                  label="Email address"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={draftSettings.userManagement.inviteEmail}
                  onChange={(event) => updateUserManagement('inviteEmail', event.target.value)}
                />
                <SelectBox
                  options={[
                    { value: 'Member', label: 'Member' },
                    { value: 'Admin', label: 'Admin' },
                  ]}
                  label="Role"
                  value={draftSettings.userManagement.defaultRole}
                  onChange={(option) => {
                    if (!Array.isArray(option)) updateUserManagement('defaultRole', option.value as MemberRole);
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
                  <dt className="text-small w-24 shrink-0 font-semibold text-zinc-900">Admin</dt>
                  <dd className="text-small text-zinc-600">Can manage workspace settings and invite members.</dd>
                </div>
                <div className="py-3 sm:flex sm:gap-4">
                  <dt className="text-small w-24 shrink-0 font-semibold text-zinc-900">Member</dt>
                  <dd className="text-small text-zinc-600">Can access reports and day-to-day workspace tools.</dd>
                </div>
              </dl>
            </SettingLayout>
          </div>
        )}

        {activeSection === 'notifications' && (
          <SettingLayout
            title="Notification preferences"
            description="Choose which updates and reminders are sent to your inbox."
          >
            <div className="divide-y divide-zinc-100">
              <NotificationPreference
                id="security-alerts"
                title="Security alerts"
                description="Get notified about sign-ins and important account changes."
                checked={draftSettings.notifications.securityAlerts}
                onChange={(checked) => updateNotification('securityAlerts', checked)}
              />
              <NotificationPreference
                id="product-updates"
                title="Product updates"
                description="Hear about new features, improvements, and service announcements."
                checked={draftSettings.notifications.productUpdates}
                onChange={(checked) => updateNotification('productUpdates', checked)}
              />
              <NotificationPreference
                id="weekly-summary"
                title="Weekly summary"
                description="Receive a weekly email with activity from your workspace."
                checked={draftSettings.notifications.weeklySummary}
                onChange={(checked) => updateNotification('weeklySummary', checked)}
              />
            </div>
          </SettingLayout>
        )}
      </div>
    </PageLayout>
  );
};

interface NotificationPreferenceProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const NotificationPreference = ({ id, title, description, checked, onChange }: NotificationPreferenceProps) => (
  <div className="py-4">
    <Checkbox
      id={id}
      name={id}
      checked={checked}
      label={
        <div>
          <span className="text-small font-medium text-zinc-900">{title}</span>
          <p className="text-small mt-1 text-zinc-600">{description}</p>
        </div>
      }
      onChange={onChange}
    />
  </div>
);

export default Settings;
