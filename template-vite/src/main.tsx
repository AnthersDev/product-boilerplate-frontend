import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';
import '@/i18n';
import reportWebVitals from '@/report-web-vitals';
import App from '@/App';
import { env } from '@/libs/env';

const root = createRoot(document.getElementById('root') as HTMLElement);

const start = async () => {
  // Dynamic import keeps mock handlers out of production builds when mocks are off.
  if (env.useMockApi) {
    const { installMockApi } = await import('@/services/mocks');
    installMockApi();
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  reportWebVitals(console.log);
};

void start();
