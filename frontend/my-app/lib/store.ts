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
  isInitialized: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          const user = await authApi.getMe();
          if (user) {
            set({ user, isAuthenticated: true, isInitialized: true });
          } else {
            set({ user: null, isAuthenticated: false, isInitialized: true });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist the user object for caching, not the auth status
      partialize: (state) => ({ user: state.user }),
    }
  )
);
