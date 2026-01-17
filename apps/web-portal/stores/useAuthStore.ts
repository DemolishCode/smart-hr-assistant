import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department?: string;
  position?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (token: string) => {
        set({ token, isAuthenticated: true });
        // Fetch user profile immediately after login
        await get().fetchUser();
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optional: Redirect to login or clear other stores
      },

      fetchUser: async () => {
        try {
          const response = await apiClient.get('/users/me');
           set({ user: response.data });
        } catch (error) {
           console.error("Failed to fetch user:", error);
           // If fetch fails (e.g., token expired), logout
           get().logout();
        }
      },
    }),
    {
      name: 'auth-storage', // Key in localStorage
    }
  )
);
