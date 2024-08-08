import './global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from './components/theme/theme-provider';
import { queryClient } from './lib/react-query';
import { AdminRouter } from './admin.routes';

export const App = () => (
   <HelmetProvider> 
    <ThemeProvider storageKey="lexpge-theme" defaultTheme="dark">
      <Helmet titleTemplate="LEXPGE | %s" />
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AdminRouter} />
      </QueryClientProvider>
    </ThemeProvider>
   </HelmetProvider>
);
