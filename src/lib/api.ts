const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const fetchWithAuth = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  let token = localStorage.getItem('token');

  // Auto-login/register an anonymous user if no token exists for seamless demo
  if (!token && !endpoint.includes('/auth/')) {
    try {
      const authRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Citizen',
          email: `user${Date.now()}@example.com`,
          password: 'password123',
          state: 'Maharashtra'
        })
      });
      
      if (authRes.ok) {
        const data = await authRes.json();
        localStorage.setItem('token', data.token);
        token = data.token;
      }
    } catch (e) {
      console.error('Failed to auto-register anonymous user', e);
    }
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.error || `API Request Failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

