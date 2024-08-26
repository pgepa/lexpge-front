import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider, RouteObject } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { queryClient } from './lib/react-query';
import { AdminRouter } from '@/admin.routes';
import { ToastContainer } from 'react-toastify';
import { SearchProvider } from '@/Context/SearchContext';
import SearchPage from '@/pages/SearchPage';
import ResultsPage from '@/pages/ResultsPage';
import "react-toastify/dist/ReactToastify.css";
import { createHashRouter } from "react-router-dom";

// Definindo as novas rotas
const newRoutes: RouteObject[] = [
  { path: "/", element: <SearchPage /> },
  { path: "/results", element: <ResultsPage /> },
  { path: "/admin/results", element: <ResultsPage /> },
];

// Combinando as rotas do AdminRouter com as novas rotas
const combinedRouter = createHashRouter([
  ...AdminRouter.routes,  // Supondo que AdminRouter já possui um array de rotas
  ...newRoutes,  // Adiciona as novas rotas definidas acima
]);

export const App = () => (
  <HelmetProvider>
    <ThemeProvider storageKey="lexpge-theme" defaultTheme="dark">
      <Helmet titleTemplate="LEXPGE | %s" />
      <Toaster richColors />
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        {/* Adiciona o SearchProvider ao redor de RouterProvider */}
        <SearchProvider>
          <RouterProvider router={combinedRouter} />
        </SearchProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);
