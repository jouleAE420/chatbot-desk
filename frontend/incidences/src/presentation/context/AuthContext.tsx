import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService } from '../../application/services/auth.service';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("AuthContext: Failed to parse user data from localStorage.", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const { token, user: userData } = await loginService(credentials);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      switch (userData.role) {
        case 'supervisor':
        case 'admin':
          navigate('/dashboard/general');
          break;
        case 'operador':
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      // Re-throw the error so the login page can display it
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
