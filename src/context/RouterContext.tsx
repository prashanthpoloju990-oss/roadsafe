import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppRoute } from '../types';

export const SESSION_STORAGE_KEY = 'roadsafe_session';

export interface StoredSession {
  isAuthenticated: boolean;
  email?: string;
  timestamp: number;
}

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

const VALID_ROUTES: AppRoute[] = [
  '/login',
  '/home',
  '/emergency',
  '/emergency/sent',
  '/safety',
  '/contacts',
  '/profile',
  '/hospital',
  '/hospital/emergencies',
];

const getStoredSession = (): StoredSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed && parsed.isAuthenticated) {
      return parsed;
    }
  } catch {
    // Ignore JSON parsing or access exceptions in restricted environments
  }
  return null;
};

export const isRouteValid = (path: string): boolean => {
  return (
    VALID_ROUTES.includes(path as AppRoute) ||
    (path.startsWith('/safety/') && path !== '/safety') ||
    (path.startsWith('/hospital/emergencies/') && path !== '/hospital/emergencies')
  );
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage session on boot
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getStoredSession()?.isAuthenticated);
  });

  const getInitialRoute = (): AppRoute => {
    const sessionActive = Boolean(getStoredSession()?.isAuthenticated);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname as AppRoute;
      if (isRouteValid(path)) {
        // If visiting /login with an active saved session, send straight to /home
        if (path === '/login' && sessionActive) {
          return '/home';
        }
        // If attempting to visit internal route without valid session, start at /login
        if (path !== '/login' && !sessionActive) {
          return '/login';
        }
        return path;
      }
    }
    return sessionActive ? '/home' : '/login';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);

  const navigate = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    if (route === '/login') {
      setIsAuthenticated(false);
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Safe catch
      }
    } else {
      setIsAuthenticated(true);
      try {
        if (!getStoredSession()?.isAuthenticated) {
          localStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify({
              isAuthenticated: true,
              timestamp: Date.now(),
            })
          );
        }
      } catch {
        // Safe catch
      }
    }

    if (typeof window !== 'undefined' && window.history) {
      try {
        if (window.location.pathname !== route) {
          window.history.pushState({}, '', route);
        }
      } catch {
        // Fallback for isolated preview environments
      }
    }
  }, []);

  const login = useCallback(
    (email?: string) => {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: true,
            email: email || 'prashanth@example.com',
            timestamp: Date.now(),
          })
        );
      } catch {
        // Safe catch
      }
      navigate('/home');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Safe catch
    }
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute;
      if (isRouteValid(path)) {
        setCurrentRoute(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, isAuthenticated, login, logout }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
