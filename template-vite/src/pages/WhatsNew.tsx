import React from 'react';
/** Storybook: PageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-page-layout--docs */
import { PageLayout } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';

const WhatsNew = () => (
  <PageLayout title="What's New" description="Share product updates and release notes here.">
    {/* @clean-demo anthers-storybook */}
    <AnthersStorybookLinks className="mb-4" components={['PageLayout']} />
    {/* @clean-demo-end */}
    <p className="text-body text-zinc-600">No announcements yet.</p>
  </PageLayout>
);

export default WhatsNew;
