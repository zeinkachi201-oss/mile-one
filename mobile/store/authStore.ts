import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, User } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const { user, token } = await api.auth.login(email, password);
    await AsyncStorage.setItem('token', token);
    set({ user, token });
    connectSocket();
  },

  signup: async (name, email, password) => {
    const { user, token } = await api.auth.signup(name, email, password);
    await AsyncStorage.setItem('token', token);
    set({ user, token });
    connectSocket();
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    disconnectSocket();
    set({ user: null, token: null });
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const user = await api.users.me();
        set({ user, token, isLoading: false });
        connectSocket();
      } else {
        set({ isLoading: false });
      }
    } catch {
      await AsyncStorage.removeItem('token');
      set({ isLoading: false });
    }
  },
}));
