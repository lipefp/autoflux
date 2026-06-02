import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '@/services/api';

type UserRole = 'cliente' | 'lojista' | 'admin';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  cnpj?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedToken, storedUser] = await AsyncStorage.multiGet([
        '@autoflux:token',
        '@autoflux:user',
      ]);
      if (storedToken[1] && storedUser[1]) {
        setToken(storedToken[1]);
        setUser(JSON.parse(storedUser[1]));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, user: userData } = response.data;

    await AsyncStorage.multiSet([
      ['@autoflux:token', access_token],
      ['@autoflux:user', JSON.stringify(userData)],
    ]);

    setToken(access_token);
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.multiRemove(['@autoflux:token', '@autoflux:user']);
    setToken(null);
    setUser(null);
    router.replace('/');
  }

  async function signUp(data: SignUpData) {
    await api.post('/auth/register', data);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
