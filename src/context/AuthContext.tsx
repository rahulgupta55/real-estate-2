'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/models/User';

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isSubscribed: boolean;
  subscriptionExpiryDate?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await axios.get('/api/user/profile');
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // User is not logged in, do nothing
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/login', { email, password });

      if (data.success) {
        setUser(data.user);

        // Redirect based on user role
        if (data.user.role === UserRole.ADMIN) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name: string, email: string, password: string, role: UserRole, phone?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/register', { name, email, password, role, phone });

      if (data.success) {
        setUser(data.user);
        router.push('/pricing');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);

      await axios.post('/api/auth/logout');

      // Clear user state
      setUser(null);

      // Redirect based on current path
      if (window.location.pathname.startsWith('/admin')) {
        router.push('/login');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put('/api/user/profile', data);

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
