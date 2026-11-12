import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageLayout, SettingListLayout, show, useGlobalSaveContext } from '@marmeto_engineering/anthers-components';
import { Bell, Settings as SettingsIcon, Users } from 'lucide-react';
import GeneralSettings, { type GeneralSettingsValues } from './GeneralSettings';
import NotificationsSettings, { type NotificationsSettingsValues } from './NotificationsSettings';
import UserManagementSettings, { type UserManagementSettingsValues } from './UserManagementSettings';

type SettingsSection = 'general' | 'user-management' | 'notifications';

interface SettingsValues {
  general: GeneralSettingsValues;
  userManagement: UserManagementSettingsValues;
  notifications: NotificationsSettingsValues;
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

  const { registerForm, unregisterForm, setFormDirty, triggerVibrate } = useGlobalSaveContext();

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

  const onUpdateUserManagement = <Field extends keyof SettingsValues['userManagement']>(
    field: Field,
    value: SettingsValues['userManagement'][Field],
  ) => {
    setDraftSettings((current) => ({
      ...current,
      userManagement: { ...current.userManagement, [field]: value },
    }));
  };

  const onUpdateNotification = (field: keyof SettingsValues['notifications'], checked: boolean) => {
    setDraftSettings((current) => ({
      ...current,
      notifications: { ...current.notifications, [field]: checked },
    }));
  };

  const onSaveChanges = useCallback(async () => {
    const errors = getSettingsValidationErrors(draftSettings);
    setGeneralErrors(errors);
    if (Object.keys(errors).length > 0) {
      setActiveSection('general');
      triggerVibrate();
      show('Please correct the highlighted fields before saving.', { type: 'error' });
      throw new Error('Validation failed');
    }

    try {
      window.sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(draftSettings));
    } catch {
      show('Settings could not be saved in this browser session.', { type: 'error' });
      throw new Error('Persist failed');
    }

    setSavedSettings(draftSettings);
    show('Settings saved for this session.', { type: 'success' });
  }, [draftSettings, triggerVibrate]);

  const onDiscardChanges = useCallback(() => {
    setDraftSettings(savedSettings);
    setGeneralErrors({});
  }, [savedSettings]);

  const onSaveChangesRef = useRef(onSaveChanges);
  onSaveChangesRef.current = onSaveChanges;
  const onDiscardChangesRef = useRef(onDiscardChanges);
  onDiscardChangesRef.current = onDiscardChanges;

  useEffect(() => {
    if (!activeSection) {
      unregisterForm();
      return;
    }

    registerForm(
      () => onSaveChangesRef.current(),
      () => onDiscardChangesRef.current(),
      sectionContent[activeSection].title,
    );
    return () => unregisterForm();
  }, [activeSection, registerForm, unregisterForm]);

  useEffect(() => {
    setFormDirty(Boolean(activeSection) && hasChanges);
  }, [activeSection, hasChanges, setFormDirty]);

  const onSendInvitation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    show(`Invitation prepared for ${draftSettings.userManagement.inviteEmail} (demo).`, { type: 'success' });
    onUpdateUserManagement('inviteEmail', '');
  };

  if (!activeSection) {
    return (
      <SettingListLayout
        title="Settings"
        cards={[
          {
            icon: <SettingsIcon className="text-gray-600" size={24} strokeWidth={1.75} />,
            title: 'General',
            description: 'Manage workspace details and regional preferences.',
            onClick: () => setActiveSection('general'),
          },
          {
            icon: <Users className="text-gray-600" size={24} strokeWidth={1.75} />,
            title: 'User management',
            description: 'Invite users and manage their access.',
            onClick: () => setActiveSection('user-management'),
          },
          {
            icon: <Bell className="text-gray-600" size={24} strokeWidth={1.75} />,
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
        {activeSection === 'general' && (
          <GeneralSettings
            settings={draftSettings.general}
            description={sectionContent.general.description}
            errors={generalErrors}
            onChange={onGeneralChange}
          />
        )}

        {activeSection === 'user-management' && (
          <UserManagementSettings
            settings={draftSettings.userManagement}
            onInviteEmailChange={(email) => onUpdateUserManagement('inviteEmail', email)}
            onDefaultRoleChange={(role) => onUpdateUserManagement('defaultRole', role)}
            onSendInvitation={onSendInvitation}
          />
        )}

        {activeSection === 'notifications' && (
          <NotificationsSettings settings={draftSettings.notifications} onChange={onUpdateNotification} />
        )}
      </div>
    </PageLayout>
  );
};

export default Settings;
