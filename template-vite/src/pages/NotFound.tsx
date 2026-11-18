import React from 'react';
/** Storybook: Button — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs */
import { Button } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';

/**
 * Unknown routes render this instead of redirecting to Home (Nexus-style).
 * Used both inside AppShell and as a top-level catch-all.
 */
const NotFound = () => (
  <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-white p-6">
    {/* @clean-demo anthers-storybook */}
    <AnthersStorybookLinks className="mb-6" components={['Button']} />
    {/* @clean-demo-end */}
    <div className="flex w-full max-w-lg flex-col items-center text-center" role="status">
      <h1 className="text-headline mb-3 font-semibold text-zinc-900 sm:mb-4">Page not found</h1>
      <p className="text-body mb-4 max-w-md text-zinc-600 md:mb-8">
        Looks like the page you&apos;re looking for no longer exists. Use the button below to return to the home page.
      </p>
      <Button variant="primary" href="/" className="sm:w-auto">
        Back to home
      </Button>
    </div>
  </div>
);

export default NotFound;
