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

// Register a new user using JSON Server's /register route (mapped to /users)
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // Check if email already exists
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

  const response = await apiClient.post('/register', payload);
  const user = response.data;
  const token = btoa(`${user.email}:${Date.now()}`);

  return { user, token };
};

// Simple login implementation that checks email and password against /users
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.get('/users', { params: { email: data.email } });
  const users = response.data;

  if (!Array.isArray(users) || users.length === 0) {
    const err: any = new Error('User not found');
    err.response = { data: { message: 'User not found' }, status: 404 };
    throw err;
  }

  const user = users[0];
  if (user.password !== data.password) {
    const err: any = new Error('Invalid credentials');
    err.response = { data: { message: 'Invalid credentials' }, status: 401 };
    throw err;
  }

  const token = btoa(`${user.email}:${Date.now()}`);
  return { user, token };
};
