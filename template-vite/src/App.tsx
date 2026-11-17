import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import '@/theme';

import Loading from '@/components/Loading';
import { AnalyticsProvider, QueryProvider } from '@/providers';
import AppRoutes from '@/routes/AppRoutes';

const App = () => (
  <QueryProvider>
    <Suspense fallback={<Loading />}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AnalyticsProvider>
          <AppRoutes />
        </AnalyticsProvider>
      </BrowserRouter>
    </Suspense>
  </QueryProvider>
);

export default App;
