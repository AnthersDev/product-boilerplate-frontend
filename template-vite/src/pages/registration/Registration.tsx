import { useNavigate } from 'react-router-dom';
import { FormPreviewPage, PageLayout, show } from '@marmeto_engineering/anthers-components';

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
