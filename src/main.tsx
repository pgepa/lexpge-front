import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app';
import { TooltipProvider } from "@/components/ui/tooltip";

// Suporte para acesso direto por rota sem '#' (ex.: http://ip/admin -> http://ip/#/admin)
const pathname = window.location.pathname;
if (pathname && pathname !== '/' && !window.location.hash) {
  window.location.replace(`/#${pathname}${window.location.search}`);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);
