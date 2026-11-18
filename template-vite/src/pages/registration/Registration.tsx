import { useNavigate } from 'react-router-dom';
/**
 * Storybook:
 * - FormPreviewPage (Vendor Registration) — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-setting-layouts-registration-form-long-form-with-sections-form-preview-in-app-layout--vendor-registration
 * - PageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs
 * - show (Toast) — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-toast--docs
 */
import { FormPreviewPage, PageLayout, show } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';

import { vendorRegistrationSampleForm } from './vendor-registration-form';

/**
 * Vendor registration demo — Anthers `FormPreviewPage` with multi-section sample data
 * matching the Chromatic story “Form Preview In App Layout / Vendor Registration”.
 */
const Registration = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Vendor Registration"
      description="Provide your brand, legal, logistics, payment, and support details."
      onBack={() => navigate('/')}
      responsive={false}
      mobileBlockedTitle="Please switch to a different device for best experience."
      mobileBlockedDescription=""
    >
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks className="mb-4" components={['PageLayout', 'FormPreviewPage', 'Toast']} />
      {/* @clean-demo-end */}
      <FormPreviewPage
        formJson={vendorRegistrationSampleForm}
        formName="Vendor Registration"
        onSubmit={() => {
          show('Registration saved for this demo session.', { type: 'success' });
        }}
      />
    </PageLayout>
  );
};

export default Registration;
