import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import routes from '@/router/routes.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useUserStore } from './store/userStore.ts';
import Layout from "./components/Layout.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      onError: (error) => {
        const { logoutUser } = useUserStore.getState();
        if (error?.message === '401') {
          logoutUser();
        }
      },
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
        <BrowserRouter>
          <Layout>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))}
            </Routes>
          </Layout>
        </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
