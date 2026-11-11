import React, { type ReactNode } from 'react';
import { HeadingWithDescription } from '@marmeto_engineering/anthers-components';

export interface StatusScreenProps {
  title: string;
  description?: string;
  /** Buttons or links shown under the message. */
  actions?: ReactNode;
  /** `alert` for errors so screen readers announce them; `status` otherwise. */
  role?: 'alert' | 'status';
}

/** Full-page message for loading, empty and error states. */
export const StatusScreen = ({ title, description, actions, role = 'status' }: StatusScreenProps) => (
  <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center" role={role}>
      <HeadingWithDescription type="heading" className="text-center" title={title} description={description} />
      {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  </main>
);
