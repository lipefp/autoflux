import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '@/constants/api';

export type UserRole = 'client' | 'store';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  store_id?: string | null;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  cnpj?: string;
  storeName?: string;
  address?: string;
  district?: string;
  city?: string;
  hours?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<User>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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
        // ignore storage errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Email ou senha incorretos');
    }
    const data = await res.json();
    // Django DRF returns { token, role, user, store_id }
    const userData: User = {
      ...data.user,
      role: data.role,
      store_id: data.store_id ?? null,
    };
    await AsyncStorage.multiSet([
      ['@autoflux:token', data.token],
      ['@autoflux:user', JSON.stringify(userData)],
    ]);
    setToken(data.token);
    setUser(userData);
    return userData;
  }

  async function signOut(): Promise<void> {
    await AsyncStorage.multiRemove(['@autoflux:token', '@autoflux:user']);
    setToken(null);
    setUser(null);
  }

  async function signUp(data: SignUpData): Promise<User> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Erro ao criar conta');
    }
    const resp = await res.json();
    const userData: User = {
      ...resp.user,
      role: resp.role,
      store_id: resp.store_id ?? null,
    };
    await AsyncStorage.multiSet([
      ['@autoflux:token', resp.token],
      ['@autoflux:user', JSON.stringify(userData)],
    ]);
    setToken(resp.token);
    setUser(userData);
    return userData;
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role: user?.role ?? null,
      loading,
      signIn,
      signOut,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
