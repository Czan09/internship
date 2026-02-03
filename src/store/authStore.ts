import { useSyncExternalStore } from 'react';
import apiClient from '../lib/api/client';

type User = any;

type AuthState = {
  user: User | null;
  token: string | null;
  initializing: boolean;
};

const state: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  initializing: typeof window !== 'undefined' ? Boolean(localStorage.getItem('token')) : false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function setUser(user: User | null) {
  state.user = user;
  notify();
}

export function setToken(token: string | null) {
  state.token = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }
  notify();
}

export function logout() {
  state.user = null;
  state.token = null;
  state.initializing = false;
  if (typeof window !== 'undefined') localStorage.removeItem('token');
  notify();
}

async function initFromToken() {
  state.initializing = true;
  notify();
  if (!state.token) {
    state.initializing = false;
    notify();
    return;
  }
  try {
    const decoded = atob(state.token);
    const email = decoded.split(':')[0];
    const res = await apiClient.get('/users', { params: { email } });
    if (Array.isArray(res.data) && res.data.length) {
      state.user = res.data[0];
      notify();
    }
  } catch (e) {
    // ignore
    console.warn('Failed to initialize auth from token', e);
  } finally {
    state.initializing = false;
    notify();
  }
} 

// Initialize if token exists
initFromToken();

export function useAuthStore() {
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getSnapshot = () => ({ user: state.user, token: state.token, initializing: state.initializing });

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    user: snapshot.user,
    token: snapshot.token,
    initializing: snapshot.initializing,
    setUser,
    setToken,
    logout,
  };
} 
