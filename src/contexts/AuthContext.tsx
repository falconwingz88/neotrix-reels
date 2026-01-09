import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ error: string | null }>;
  signup: (username: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get registered users from localStorage
const getRegisteredUsers = (): { username: string; password: string }[] => {
  try {
    const stored = localStorage.getItem('neo-timeline-users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save registered users to localStorage
const saveRegisteredUsers = (users: { username: string; password: string }[]) => {
  localStorage.setItem('neo-timeline-users', JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('neo-timeline-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAdmin(parsed.username === ADMIN_USERNAME);
      } catch {
        localStorage.removeItem('neo-timeline-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ error: string | null }> => {
    // Check admin credentials first
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-user-id',
        username: ADMIN_USERNAME,
      };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('neo-timeline-user', JSON.stringify(adminUser));
      return { error: null };
    }
    
    // Check registered users
    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const loggedInUser: User = {
        id: `user-${username}`,
        username: username,
      };
      setUser(loggedInUser);
      setIsAdmin(false); // Only admin/admin123 is admin
      localStorage.setItem('neo-timeline-user', JSON.stringify(loggedInUser));
      return { error: null };
    }
    
    return { error: 'Invalid username or password' };
  };

  const signup = async (username: string, password: string): Promise<{ error: string | null }> => {
    // Validate inputs
    if (!username.trim() || !password.trim()) {
      return { error: 'Username and password are required' };
    }
    
    if (username.length < 3) {
      return { error: 'Username must be at least 3 characters' };
    }
    
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }
    
    // Check if username is reserved
    if (username.toLowerCase() === ADMIN_USERNAME) {
      return { error: 'This username is not available' };
    }
    
    // Check if username already exists
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { error: 'Username already exists' };
    }
    
    // Register the user
    registeredUsers.push({ username, password });
    saveRegisteredUsers(registeredUsers);
    
    // Log them in
    const newUser: User = {
      id: `user-${username}`,
      username: username,
    };
    setUser(newUser);
    setIsAdmin(false);
    localStorage.setItem('neo-timeline-user', JSON.stringify(newUser));
    
    return { error: null };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('neo-timeline-user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      isAdmin,
      user,
      login,
      signup,
      logout, 
      loading 
    }}>
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
