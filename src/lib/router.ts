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
  // Strip query and hash
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

function parseQuery(searchStr: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!searchStr) return params;
  const searchParams = new URLSearchParams(searchStr);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function useAppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    return normalizeRoute(typeof window !== 'undefined' ? window.location.pathname : '/');
  });

  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
    return parseQuery(typeof window !== 'undefined' ? window.location.search : '');
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname));
      setQueryParams(parseQuery(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    const targetRoute = normalizeRoute(to);
    const hasQuery = to.includes('?');
    const fullTarget = hasQuery ? `${targetRoute}?${to.split('?')[1]}` : targetRoute;

    if (typeof window !== 'undefined') {
      const currentFull = window.location.pathname + window.location.search;
      if (currentFull !== fullTarget) {
        if (replace) {
          window.history.replaceState({}, '', fullTarget);
        } else {
          window.history.pushState({}, '', fullTarget);
        }
      }
      setQueryParams(parseQuery(window.location.search));
    }

    setCurrentRoute(targetRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setQueryParam = useCallback((key: string, value: string | null, replace = true) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    const newRelativePathQuery = url.pathname + (url.search ? url.search : '');
    if (replace) {
      window.history.replaceState({}, '', newRelativePathQuery);
    } else {
      window.history.pushState({}, '', newRelativePathQuery);
    }
    setQueryParams(parseQuery(url.search));
  }, []);

  return { currentRoute, queryParams, navigate, setQueryParam };
}
