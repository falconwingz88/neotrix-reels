import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Placeholder credentials - replace with proper authentication later
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Changed from sessionStorage to localStorage for persistent login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('neotrix_admin_auth') === 'true';
  });

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('neotrix_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('neotrix_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
