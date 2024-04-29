import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import routes from '@/router/routes.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import Layout from '@/components/layout/Layout.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Layout>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))}
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
