import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './app/app';
import LoginPage from './app/auth-pages/login-page';
import RegisterPage from './app/auth-pages/register-page';
import { queryClient } from './api/query-client';
import { AppRoutes } from './routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path={AppRoutes.HOME} element={<App />} />
            <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>,
);
