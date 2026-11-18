/**
 * Chromatic Storybook URLs for Anthers components used in this template.
 * Demo-only: removed by `npm run clean:demo` with the UI link buttons.
 *
 * Index: docs/anthers-storybook.md
 */
export const ANTHERS_STORYBOOK_BASE = 'https://main--685923032e27da931cdadb63.chromatic.com';

const story = (id: string) => `${ANTHERS_STORYBOOK_BASE}/?path=/story/${id}`;

export const ANTHERS_STORYBOOK_LINKS = {
  AppLayout: story('layouts-dashboard-layouts-app-layout--docs'),
  Sidebar: story('components-navigation-sidebar-composed-example--with-permission'),
  HomePageLayout: story('layouts-dashboard-layouts-homepagelayout-dynamic-draft--docs'),
  PageLayout: story('layouts-page-layout--docs'),
  ListPageLayout: story('layouts-dashboard-layouts-list-page-layout--docs'),
  AdvancedDataTable: story('components-data-display-advanced-data-table--docs'),
  SettingLayout: story('layouts-dashboard-layouts-settings-layout--docs'),
  SettingListLayout: story('layouts-setting-layouts-setting-list-layout--docs'),
  UserListingLayout: story('layouts-setting-layouts-permission-module-user-listing-layout--docs'),
  UserCreationLayout: story('layouts-setting-layouts-permission-module-user-creation-layout--docs'),
  UserDetailsLayout: story('layouts-setting-layouts-permission-module-user-details-layout--docs'),
  NotificationPageLayout: story('layouts-setting-layouts-notification-page-notification-page-layout--docs'),
  NotificationDetails: story('layouts-setting-layouts-notification-page-notification-details-layout--docs'),
  FormPreviewPage: story(
    'layouts-setting-layouts-registration-form-long-form-with-sections-form-preview-in-app-layout--vendor-registration',
  ),
  LoginPage: story('layouts-user-login-and-signup-authentication-loginpage--docs'),
  SelectOrganizationPage: story('layouts-user-login-and-signup-authentication-select-organization-page--docs'),
  Button: story('components-actions-button--docs'),
  Badge: story('components-data-display-badge--docs'),
  Dropdown: story('components-data-display-dropdown--docs'),
  Card: story('components-data-display-card-main--docs'),
  FeatureCard: story('components-data-display-feature-card--docs'),
  InsightCards: story('components-data-display-card-insight-cards--docs'),
  PartnerCard: story('components-data-display-card-partnercard--docs'),
  ImageDescription: story('components-data-display-image-description--docs'),
  Onboarding: story('components-data-display-onboarding--docs'),
  LoadingState: story('components-feedback-and-status-loading-state--docs'),
  HeadingWithDescription: story('components-data-display-heading-with-description--docs'),
  AccessDenied: story('components-feedback-and-status-access-denied--docs'),
  InputField: story('components-data-entry-inputfield--docs'),
  SelectBox: story('components-data-entry-selectbox--docs'),
  FileUploader: story('components-data-entry-upload-files-file-uploader--docs'),
  Toast: story('components-feedback-and-status-toast--docs'),
  GlobalSave: story('utils-global-save-example--docs'),
  PermissionGuard: story('utils-permissionguard--docs'),
} as const;

export type AnthersStorybookComponent = keyof typeof ANTHERS_STORYBOOK_LINKS;
