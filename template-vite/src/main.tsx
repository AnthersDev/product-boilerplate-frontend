import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';
import '@/i18n';
import reportWebVitals from '@/report-web-vitals';
import App from '@/App';
import { env } from '@/libs/env';

const root = createRoot(document.getElementById('root') as HTMLElement);

const renderStartupError = () =>
  root.render(
    <main role="alert" className="p-6">
      <h1 className="text-headline font-semibold">Unable to start the application</h1>
      <p className="mt-2">Mock API initialization failed.</p>
      <button className="mt-4" type="button" onClick={() => void start()}>
        Retry
      </button>
    </main>,
  );

const start = async () => {
  try {
    // Dynamic import keeps mock handlers out of production builds when mocks are off.
    if (env.useMockApi) {
      const { installMockApi } = await import('@/services/mocks');
      installMockApi();
    }
  } catch (error) {
    console.error('Failed to initialize mock API', error);
    renderStartupError();
    return;
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  reportWebVitals(console.log);
};

void start();
