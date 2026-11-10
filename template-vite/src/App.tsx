import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import '@/theme';

import Loading from '@/components/Loading';
import { QueryProvider } from '@/providers';
import AppRoutes from '@/routes/AppRoutes';

const App = () => (
  <QueryProvider>
    <Suspense fallback={<Loading />}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  </QueryProvider>
);

export default App;
