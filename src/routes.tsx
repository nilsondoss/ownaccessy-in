import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

// Lazy load components for code splitting
const isDevelopment = (import.meta.env as any).DEV;
const NotFoundPage = isDevelopment ? lazy(() => import('../dev-tools/src/PageNotFound')) : lazy(() => import('./pages/_404'));
const LoginPage = lazy(() => import('./pages/login'));
const RegisterPage = lazy(() => import('./pages/register'));
const PropertiesPage = lazy(() => import('./pages/properties'));
const PropertyDetailPage = lazy(() => import('./pages/properties/detail'));
const ComparePropertiesPage = lazy(() => import('./pages/properties/compare'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const PricingPage = lazy(() => import('./pages/pricing'));
const TermsPage = lazy(() => import('./pages/terms'));
const PrivacyPage = lazy(() => import('./pages/privacy'));
const ProfilePage = lazy(() => import('./pages/profile'));
const AddPropertyPage = lazy(() => import('./pages/add-property'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/properties',
    element: <PropertiesPage />,
  },
  {
    path: '/properties/compare',
    element: <ComparePropertiesPage />,
  },
  {
    path: '/properties/:id',
    element: <PropertyDetailPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/add-property',
    element: <AddPropertyPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/login' | '/register' | '/properties' | '/properties/compare' | '/dashboard' | '/pricing' | '/terms' | '/privacy' | '/profile' | '/add-property';

export type Params = Record<string, string | undefined>;
