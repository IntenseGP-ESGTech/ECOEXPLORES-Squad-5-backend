const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:4000';

export async function apiRegister({ name, email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao registrar');
  persistAuth(data);
  return data;
}

export async function apiLogin({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Credenciais inválidas');
  persistAuth(data);
  return data;
}

export function persistAuth({ token, user }) {
  if (token) localStorage.setItem('auth_token', token);
  if (user) localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}


