import apiClient from './client';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

// 1. Register Function
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const existing = await apiClient.get('/users', { params: { email: data.email } });
  if (Array.isArray(existing.data) && existing.data.length > 0) {
    const err: any = new Error('Email already registered');
    err.response = { data: { message: 'Email already registered' }, status: 400 };
    throw err;
  }

  const timestamp = new Date().toISOString();
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    avatar: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const response = await apiClient.post('/users', payload);
  const user = response.data;
  const token = btoa(`${user.email}:${Date.now()}`);

  return { user, token };
};

// 2. Login Function (ADD THIS BACK IN)
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.get('/users', { params: { email: data.email } });
  const users = response.data;

  // Check if user exists
  if (!Array.isArray(users) || users.length === 0) {
    const err: any = new Error('User not found');
    err.response = { data: { message: 'User not found' }, status: 404 };
    throw err;
  }

  const user = users[0];

  // Check if password matches
  if (user.password !== data.password) {
    const err: any = new Error('Invalid credentials');
    err.response = { data: { message: 'Invalid credentials' }, status: 401 };
    throw err;
  }

  const token = btoa(`${user.email}:${Date.now()}`);
  return { user, token };
};