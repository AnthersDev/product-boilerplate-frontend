import React from 'react';
import { PageLayout } from '@marmeto_engineering/anthers-components';

/** Placeholder analytics page so the sidebar Reports link is a real route. */
const Reports = () => (
  <PageLayout
    title="Reports"
    description="Replace this page with your product’s analytics reports. It exists so the sidebar link has somewhere to go."
  >
    <p className="text-body text-zinc-600">
      No reports yet. Wire this route to your reporting API or Anthers list/table layouts.
    </p>
  </PageLayout>
);

export default Reports;
