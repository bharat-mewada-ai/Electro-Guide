const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  let token = localStorage.getItem('token');

  // Auto-login/register an anonymous user if no token exists for seamless demo
  if (!token && !endpoint.includes('/auth/')) {
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
    throw new Error('API Request Failed');
  }

  return response.json();
};
