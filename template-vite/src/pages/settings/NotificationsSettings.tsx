import { Checkbox, SettingLayout } from '@marmeto_engineering/anthers-components';

export interface NotificationsSettingsValues {
  securityAlerts: boolean;
  productUpdates: boolean;
  weeklySummary: boolean;
}

interface NotificationsSettingsProps {
  settings: NotificationsSettingsValues;
  onChange: (field: keyof NotificationsSettingsValues, checked: boolean) => void;
}

const NotificationsSettings = ({ settings, onChange }: NotificationsSettingsProps) => (
  <SettingLayout
    title="Notification preferences"
    description="Choose which updates and reminders are sent to your inbox."
  >
    <div className="divide-y divide-zinc-100">
      <NotificationPreference
        id="security-alerts"
        title="Security alerts"
        description="Get notified about sign-ins and important account changes."
        checked={settings.securityAlerts}
        onChange={(checked) => onChange('securityAlerts', checked)}
      />
      <NotificationPreference
        id="product-updates"
        title="Product updates"
        description="Hear about new features, improvements, and service announcements."
        checked={settings.productUpdates}
        onChange={(checked) => onChange('productUpdates', checked)}
      />
      <NotificationPreference
        id="weekly-summary"
        title="Weekly summary"
        description="Receive a weekly email with activity from your workspace."
        checked={settings.weeklySummary}
        onChange={(checked) => onChange('weeklySummary', checked)}
      />
    </div>
  </SettingLayout>
);

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
          <span className="text-title max-md:text-label leading-snug font-semibold text-zinc-800">{title}</span>
          <p className="text-label md:text-body mt-1 leading-normal font-light text-zinc-500">{description}</p>
        </div>
      }
      onChange={onChange}
    />
  </div>
);

export default NotificationsSettings;
