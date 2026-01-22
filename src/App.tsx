import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import AiroErrorBoundary from '../dev-tools/src/AiroErrorBoundary';
import RootLayout from './layouts/RootLayout';
import { routes } from './routes';
import Spinner from './components/Spinner';
import { AuthProvider } from './lib/auth-context';
import { ComparisonProvider } from './lib/comparison-context';
import { FavoritesProvider } from './lib/favorites-context';

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}

// Create router with layout wrapper
const router = createBrowserRouter([
  {
    path: '/',
    element: import.meta.env.DEV ? (
      <AiroErrorBoundary>
        <Suspense fallback={<SpinnerFallback />}>
          <ScrollToTop />
          <RootLayout>
            <Outlet />
          </RootLayout>
        </Suspense>
      </AiroErrorBoundary>
    ) : (
      <Suspense fallback={<SpinnerFallback />}>
        <ScrollToTop />
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    children: routes,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ComparisonProvider>
          <RouterProvider router={router} />
        </ComparisonProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
