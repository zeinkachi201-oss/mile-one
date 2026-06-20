'use client';
import { create } from 'zustand';
import { api, User } from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    const { user, token } = await api.auth.login(email, password);
    localStorage.setItem('token', token);
    set({ user });
    connectSocket();
  },

  signup: async (name, email, password) => {
    const { user, token } = await api.auth.signup(name, email, password);
    localStorage.setItem('token', token);
    set({ user });
    connectSocket();
  },

  logout: () => {
    localStorage.removeItem('token');
    disconnectSocket();
    set({ user: null });
    window.location.href = '/login';
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await api.users.me();
        set({ user, isLoading: false });
        connectSocket();
      } else {
        set({ isLoading: false });
      }
    } catch {
      localStorage.removeItem('token');
      set({ isLoading: false });
    }
  },
}));
