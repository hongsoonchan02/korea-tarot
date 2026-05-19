import { create } from 'zustand';

const TOKEN_STORAGE_KEY = 'mystic-ai-tarot-auth-token';

function getInitialToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export const useAuthStore = create((set) => ({
  token: getInitialToken(),
  isAuthenticated: Boolean(getInitialToken()),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }

    set({
      token,
      isAuthenticated: Boolean(token),
    });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));
