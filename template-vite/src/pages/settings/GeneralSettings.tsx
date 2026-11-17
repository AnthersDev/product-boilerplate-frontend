import { FileUploader, InputField, SelectBox, SettingLayout } from '@marmeto_engineering/anthers-components';

export interface GeneralSettingsValues {
  workspaceName: string;
  appListingUrl: string;
  supportEmail: string;
  timezone: string;
  brandLogo: string;
  brandFavicon: string;
  brandDocuments: string[];
}

interface GeneralSettingsProps {
  settings: GeneralSettingsValues;
  description: string;
  errors: Partial<Record<'appListingUrl' | 'supportEmail', string>>;
  onChange: <Field extends keyof GeneralSettingsValues>(field: Field, value: GeneralSettingsValues[Field]) => void;
}

const GeneralSettings = ({ settings, description, errors, onChange }: GeneralSettingsProps) => (
  <div className="space-y-5">
    <SettingLayout title="General Settings" description={description}>
      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          id="workspace-name"
          label="Organisation Name"
          value={settings.workspaceName}
          onChange={(event) => onChange('workspaceName', event.target.value)}
        />
        <InputField
          id="app-listing-url"
          label="App Listing Url"
          type="url"
          placeholder="Enter your app listing url"
          errorText={errors.appListingUrl}
          value={settings.appListingUrl}
          onChange={(event) => onChange('appListingUrl', event.target.value)}
        />
        <InputField
          id="support-email"
          label="Support Email"
          type="email"
          errorText={errors.supportEmail}
          value={settings.supportEmail}
          onChange={(event) => onChange('supportEmail', event.target.value)}
        />
        <SelectBox
          options={[
            { value: 'Etc/GMT+12', label: 'UTC−12:00 — Baker Island Time' },
            { value: 'America/Los_Angeles', label: 'UTC−08:00 — Pacific Time' },
            { value: 'America/New_York', label: 'UTC−05:00 — Eastern Time' },
            { value: 'Asia/Kolkata', label: 'UTC+05:30 — India Standard Time' },
            { value: 'Europe/London', label: 'UTC+00:00 — United Kingdom' },
          ]}
          label="Timezone"
          value={settings.timezone}
          onChange={(option) => {
            if (!Array.isArray(option)) onChange('timezone', option.value);
          }}
        />
      </div>
    </SettingLayout>

    <SettingLayout title="Brand Assets" description="Keep your workspace identity consistent across the app.">
      <div className="grid gap-4 md:grid-cols-2">
        <FileUploadField
          title="Upload Brand Logo"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          description="Accepts PNG, JPEG, JPG files, up to 5MB."
          onFilesSelected={(files) => {
            onChange('brandLogo', files[0]?.name ?? '');
          }}
        />
        <FileUploadField
          title="Upload Brand Favicon"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          description="Accepts PNG, JPEG, JPG files, up to 5MB."
          onFilesSelected={(files) => {
            onChange('brandFavicon', files[0]?.name ?? '');
          }}
        />
      </div>
    </SettingLayout>

    <SettingLayout
      title="Brand Documents"
      description="Upload and manage your brand documents here. Accepted formats include PDF, DOCX, and more."
    >
      <FileUploadField
        title="Upload Brand Documents"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        description="Accepts PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX files, up to 5MB."
        multiple
        onFilesSelected={(files) =>
          onChange(
            'brandDocuments',
            Array.from(files, (file) => file.name),
          )
        }
      />
    </SettingLayout>
  </div>
);

interface FileUploadFieldProps {
  title: string;
  accept: string;
  description: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

const FileUploadField = ({ title, accept, description, multiple = false, onFilesSelected }: FileUploadFieldProps) => (
  <FileUploader
    heading={title}
    description="Drag & drop files here or click to browse"
    additionalText={description}
    accept={accept.split(',').map((type) => type.trim())}
    maxSizeMB={5}
    multiple={multiple}
    required={false}
    onSelect={onFilesSelected}
  />
);

export default GeneralSettings;
