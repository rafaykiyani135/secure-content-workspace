import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // token removed from state as it's in cookie
      isAuthenticated: false,

      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const user = await authApi.getMe();
          if (user) {
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
