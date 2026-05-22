// src/store/authStore.js 
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api';

const isClient = typeof window !== 'undefined';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      getRedirectPath: () => {
        const { user } = get();
        if (!user) return '/login';

        const routes: Record<string, string> = {
          account: '/account',
          admin: '/admin',
          agent: '/agent',
          doctor: '/doctor',
          staff: '/staff',
          frontdesk: '/frontdesk',
          manger: '/manager',
          pro: '/pro'
        };

        return routes[user?.usergroup?.toLowerCase()] || '/agent';
      },

      login: async ({ username, password }) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.post('/auth/login/', { username, password });

          const { access, refresh, user } = data;

          localStorage.setItem('accessToken', access);
          localStorage.setItem('refreshToken', refresh);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user: user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });

          const roleRoutes: Record<string, string> = {
            'account': '/account',
            'admin': '/admin',
            'agent': '/agent',
            'doctor': '/doctor',
            'frontdesk': '/frontdesk',
            'manager': '/manager',
            'pro': '/pro'
          };

          console.log(user?.usergroup, roleRoutes[String(user?.usergroup)])

          window.location.href = roleRoutes[String(user?.usergroup || '').toLowerCase()] || '/agent';
          return true;

        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
          return false;
        }
      },

      initializeAuth: async () => {

        if (!isClient) return;

        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          try {
            // await api.get('/api/auth/me/');
            set({
              accessToken,
              refreshToken,
              user: localStorage.getItem('user') || null,
              isAuthenticated: true,
            });
          } catch (error) {
            localStorage.clear();
            set({ isAuthenticated: false });
          }
        }
      },

      logout: () => {
        localStorage.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        window.location.href = '/login';
      },
    }),

    {
      name: 'auth-storage',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: any) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
