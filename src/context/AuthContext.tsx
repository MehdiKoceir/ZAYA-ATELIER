import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, Order, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  userOrders: Order[];
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  isProfileModalOpen: boolean;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserAccount>) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('zaya_token');
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('zaya_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
  }, []);

  // Fetch current user details & live orders from server
  const refreshUserData = useCallback(async () => {
    const activeToken = localStorage.getItem('zaya_token');
    if (!activeToken) {
      setUser(null);
      setUserOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setUserOrders(data.orders || []);
        localStorage.setItem('zaya_user', JSON.stringify(data.user));
      } else {
        // Token expired or invalid
        localStorage.removeItem('zaya_token');
        localStorage.removeItem('zaya_user');
        setToken(null);
        setUser(null);
        setUserOrders([]);
      }
    } catch (err) {
      console.error('Failed to verify session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Login handler
  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data: AuthResponse = await res.json();

      if (data.success && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        setUserOrders(data.orders || []);
        localStorage.setItem('zaya_token', data.token);
        localStorage.setItem('zaya_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Identifiants invalides' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur de connexion au serveur' };
    }
  };

  // Register handler
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData: AuthResponse = await res.json();

      if (resData.success && resData.token && resData.user) {
        setToken(resData.token);
        setUser(resData.user);
        setUserOrders([]);
        localStorage.setItem('zaya_token', resData.token);
        localStorage.setItem('zaya_user', JSON.stringify(resData.user));
        return { success: true };
      } else {
        return { success: false, error: resData.error || 'Impossible de créer le compte' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de l’inscription' };
    }
  };

  // Logout handler
  const logout = async () => {
    const currentToken = token || localStorage.getItem('zaya_token');
    if (currentToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: currentToken })
        });
      } catch {
        // Continue client logout
      }
    }

    localStorage.removeItem('zaya_token');
    localStorage.removeItem('zaya_user');
    setToken(null);
    setUser(null);
    setUserOrders([]);
    setIsProfileModalOpen(false);
  };

  // Profile update handler
  const updateProfile = async (data: Partial<UserAccount>): Promise<{ success: boolean; error?: string }> => {
    const currentToken = token || localStorage.getItem('zaya_token');
    if (!currentToken) return { success: false, error: 'Non authentifié' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        localStorage.setItem('zaya_user', JSON.stringify(resData.user));
        return { success: true };
      }
      return { success: false, error: resData.error || 'Échec de la mise à jour' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userOrders,
        loading,
        isAuthModalOpen,
        authModalTab,
        isProfileModalOpen,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        setAuthModalTab,
        login,
        register,
        logout,
        updateProfile,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
