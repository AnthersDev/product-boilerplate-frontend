import { FileInput, InputField, SelectBox, SettingLayout, show } from '@marmeto_engineering/anthers-components';
import { Upload } from 'lucide-react';

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
          id="brand-logo"
          title="Upload Brand Logo"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          description="Accepts PNG, JPEG, JPG files, up to 5MB."
          selectedFiles={settings.brandLogo}
          onFilesSelected={(files) => {
            if (files?.[0]) onChange('brandLogo', files[0].name);
          }}
        />
        <FileUploadField
          id="brand-favicon"
          title="Upload Brand Favicon"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          description="Accepts PNG, JPEG, JPG files, up to 5MB."
          selectedFiles={settings.brandFavicon}
          onFilesSelected={(files) => {
            if (files?.[0]) onChange('brandFavicon', files[0].name);
          }}
        />
      </div>
    </SettingLayout>

    <SettingLayout
      title="Brand Documents"
      description="Upload and manage your brand documents here. Accepted formats include PDF, DOCX, and more."
    >
      <FileUploadField
        id="brand-documents"
        title="Upload Brand Documents"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        description="Accepts PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX files, up to 5MB."
        multiple
        selectedFiles={settings.brandDocuments.join(', ')}
        onFilesSelected={(files) => {
          if (files)
            onChange(
              'brandDocuments',
              Array.from(files, (file) => file.name),
            );
        }}
      />
    </SettingLayout>
  </div>
);

interface FileUploadFieldProps {
  id: string;
  title: string;
  accept: string;
  description: string;
  selectedFiles: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const FileUploadField = ({
  id,
  title,
  accept,
  description,
  selectedFiles,
  multiple = false,
  onFilesSelected,
}: FileUploadFieldProps) => {
  const onUploadFilesSelected = (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.some((file) => file.size > MAX_UPLOAD_SIZE_BYTES)) {
      show('Each file must be 5 MB or smaller.', { type: 'error' });
      return;
    }

    const acceptedTypes = accept
      .split(',')
      .map((type) => type.trim().toLowerCase())
      .filter(Boolean);
    const supportedFiles = selectedFiles.filter((file) => {
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();
      return acceptedTypes.some((type) => {
        if (type.startsWith('.')) return fileName.endsWith(type);
        if (type.endsWith('/*')) return fileType.startsWith(type.slice(0, -1));
        return fileType === type;
      });
    });

    if (supportedFiles.length !== selectedFiles.length) {
      show(`Some files are not supported. ${description}`, { type: 'error' });
    }
    if (supportedFiles.length) onFilesSelected(supportedFiles);
  };

  return (
    <label
      htmlFor={id}
      className="relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-4 text-center transition focus-within:ring-2 focus-within:ring-blue-500 hover:bg-zinc-50"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onUploadFilesSelected(event.dataTransfer.files);
      }}
    >
      <FileInput
        id={id}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        aria-describedby={`${id}-description`}
        onChange={(event) => onUploadFilesSelected(event.currentTarget.files)}
      />
      <Upload strokeWidth={1.75} size={20} aria-hidden="true" className="text-zinc-500" />
      <span className="text-small mt-3 font-medium text-zinc-900">{title}</span>
      <span className="text-small mt-1 text-zinc-500">
        {selectedFiles || 'Drag & drop files here or click to browse'}
      </span>
      <span id={`${id}-description`} className="text-label mt-2 text-zinc-500">
        {description}
      </span>
    </label>
  );
};

export default GeneralSettings;
