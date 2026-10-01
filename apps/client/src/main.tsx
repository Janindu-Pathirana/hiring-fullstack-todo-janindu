import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './app/app';
import { queryClient } from './api/query-client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>,
);
