import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | '/'
  | '/collection'
  | '/about'
  | '/contact'
  | '/sign-in'
  | '/sign-up'
  | '/dashboard'
  | '/dashboard/products'
  | '/dashboard/orders'
  | '/dashboard/tracking'
  | '/dashboard/wishlist'
  | '/dashboard/profile'
  | '/dashboard/settings';

export function normalizeRoute(path: string): AppRoute {
  // Strip trailing slashes unless root
  let clean = path.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Handle known routes
  if (clean === '' || clean === '/') return '/';
  if (clean === '/collection') return '/collection';
  if (clean === '/about') return '/about';
  if (clean === '/contact') return '/contact';
  if (clean === '/sign-in' || clean === '/login') return '/sign-in';
  if (clean === '/sign-up' || clean === '/register') return '/sign-up';
  if (clean === '/dashboard') return '/dashboard';
  if (clean === '/dashboard/products') return '/dashboard/products';
  if (clean === '/dashboard/orders') return '/dashboard/orders';
  if (clean === '/dashboard/tracking') return '/dashboard/tracking';
  if (clean === '/dashboard/wishlist') return '/dashboard/wishlist';
  if (clean === '/dashboard/profile' || clean === '/dashboard/settings') return '/dashboard/profile';

  // Fallback
  return '/';
}

export function useAppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    return normalizeRoute(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: AppRoute, replace = false) => {
    const target = normalizeRoute(to);
    if (window.location.pathname !== target) {
      if (replace) {
        window.history.replaceState({}, '', target);
      } else {
        window.history.pushState({}, '', target);
      }
    }
    setCurrentRoute(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { currentRoute, navigate };
}
