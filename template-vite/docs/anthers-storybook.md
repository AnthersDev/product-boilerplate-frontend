# Anthers Storybook (Chromatic)

Published Storybook for `@marmeto_engineering/anthers-components`:

**Base:** [https://main--685923032e27da931cdadb63.chromatic.com/](https://main--685923032e27da931cdadb63.chromatic.com/)

Use these links when wiring or changing Anthers usage in this template. The same URLs are also noted as comments above Anthers imports in the source files listed below.

## Layouts used in this boilerplate

| Component | Used in | Storybook |
| --- | --- | --- |
| `AppLayout` | `src/layouts/AppShell.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-dashboard-layouts-app-layout--docs) |
| `Sidebar` / `SidebarMenu` | `src/layouts/AppSidebar.tsx` (nested Permissions demo + `userPermissions`) | [Composed Example](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-navigation-sidebar-composed-example--docs) · [With Permission](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-navigation-sidebar-composed-example--with-permission) |
| `HomePageLayout` | `src/pages/Home.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-dashboard-layouts-homepagelayout-dynamic-draft--docs) |
| `PageLayout` | `Registration`, `Settings`, `WhatsNew` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs) |
| `ListPageLayout` | `src/pages/analytics/Reports.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-dashboard-layouts-list-page-layout--docs) |
| `AdvancedDataTable` (via list layout) | `src/pages/analytics/Reports.tsx`, `report-columns.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-advanced-data-table--docs) |
| `SettingLayout` | `src/pages/settings/GeneralSettings.tsx` | [Settings Layout](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-dashboard-layouts-settings-layout--docs) |
| `SettingListLayout` | `src/pages/settings/Settings.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-setting-list-layout--docs) |
| `UserListingLayout` | `src/pages/settings/user-management/UsersList.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-listing-layout--docs) |
| `UserCreationLayout` | `src/pages/settings/user-management/AddUser.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-creation-layout--docs) |
| `UserDetailsLayout` | `src/pages/settings/user-management/UserDetails.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-permission-module-user-details-layout--docs) |
| `NotificationPageLayout` | `src/pages/settings/notifications/Notifications.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-notification-page-notification-page-layout--docs) |
| `NotificationDetails` | `src/pages/settings/notifications/NotificationDetail.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-notification-page-notification-details-layout--docs) |
| `FormPreviewPage` | `src/pages/registration/Registration.tsx` | [Vendor Registration](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-registration-form-long-form-with-sections-form-preview-in-app-layout--vendor-registration) |
| `LoginPage` | `src/pages/auth/Login.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-user-login-and-signup-authentication-loginpage--docs) |
| `SelectOrganizationPage` | `src/pages/auth/SelectOrganization.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-user-login-and-signup-authentication-select-organization-page--docs) |

## Components & utilities used in this boilerplate

| Component / API | Used in | Storybook |
| --- | --- | --- |
| `Button` | Home, NotFound, RequireSession, AppRoutes, MockSignIn, SelectOrganization, home content | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs) |
| `Badge` | `home-page-content`, `report-columns` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-badge--docs) |
| `Dropdown` | `src/features/reports/report-columns.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-dropdown--docs) |
| `Card` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-card-main--docs) |
| `FeatureCard` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-feature-card--docs) |
| `InsightCards` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-card-insight-cards--docs) |
| `PartnerCard` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-card-partnercard--docs) |
| `ImageDescription` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-image-description--docs) |
| `Onboarding` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-onboarding--docs) |
| `LoadingState` | `src/features/home/home-page-content.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-loading-state--docs) |
| `HeadingWithDescription` | `src/components/StatusScreen/StatusScreen.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-heading-with-description--docs) |
| `AccessDenied` | `src/components/PermissionGuard/PermissionGuard.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-access-denied--docs) |
| `InputField` | `src/pages/settings/GeneralSettings.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-entry-inputfield--docs) |
| `SelectBox` | `src/pages/settings/GeneralSettings.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-entry-selectbox--docs) |
| `FileUploader` | `src/pages/settings/GeneralSettings.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-entry-upload-files-file-uploader--docs) |
| `show` (Toast) | Settings, Registration, Reports | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-toast--docs) |
| `useGlobalSaveContext` / Global Save | `src/pages/settings/Settings.tsx` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/utils-global-save-example--docs) |
| `PermissionGuard` (Anthers utils story; local wrapper in boilerplate) | `src/components/PermissionGuard` | [Docs](https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/utils-permissionguard--docs) |

## Tip

Search Storybook by component name in the Chromatic sidebar. Prefer **Docs** stories for props tables; prefer named demos (e.g. Vendor Registration) when matching a full page pattern.
