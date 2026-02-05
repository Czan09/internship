import { useSyncExternalStore, useMemo } from 'react';
import apiClient from '../lib/api/client';

type User = any;

type AuthState = {
  user: User | null;
  token: string | null;
  initializing: boolean;
};

// 1. Keep the state object stable
let state: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  // If no token exists, we aren't initializing anything, so set to false immediately
  initializing: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function setUser(user: User | null) {
  state = { ...state, user };
  notify();
}

export function setToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }
  state = { ...state, token };
  notify();
}

export function logout() {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
  state = { user: null, token: null, initializing: false };
  notify();
}

async function initFromToken() {
  if (!state.token) {
    state = { ...state, initializing: false };
    notify();
    return;
  }

  try {
    // Basic JWT check (optional: verify if token is actually a string before atob)
    const decoded = atob(state.token.split('.')[1] || state.token); 
    const email = decoded.includes(':') ? decoded.split(':')[0] : JSON.parse(decoded).email;
    
    const res = await apiClient.get('/users', { params: { email } });
    
    if (Array.isArray(res.data) && res.data.length) {
      state = { ...state, user: res.data[0] };
    }
  } catch (e) {
    console.warn('Failed to initialize auth from token', e);
    // On failure, you might want to clear the invalid token
    // logout(); 
  } finally {
    state = { ...state, initializing: false };
    notify();
  }
}

// Kick off initialization
initFromToken();

export function useAuthStore() {
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // 2. Return the stable state object directly
  const getSnapshot = () => state;

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // 3. Merge actions with the snapshot
  return useMemo(() => ({
    ...snapshot,
    setUser,
    setToken,
    logout,
  }), [snapshot]);
}