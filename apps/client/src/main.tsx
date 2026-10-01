import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './app/app';
import LoginPage from './app/auth-pages/login-page';
import RegisterPage from './app/auth-pages/register-page';
import NotFoundPage from './app/not-found-page';
import { RequireAuth } from './app/require-auth';
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
            <Route element={<RequireAuth />}>
              <Route path={AppRoutes.HOME} element={<App />} />
            </Route>
            <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutes.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>,
);
