// API client with authentication

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  getMe: () => apiRequest('/auth/me'),

  // Properties
  getProperties: (params?: { type?: string; location?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/properties${query ? `?${query}` : ''}`);
  },
  
  getProperty: (id: number) => apiRequest(`/properties/${id}`),
  
  unlockProperty: (id: number) => apiRequest(`/properties/${id}/unlock`, { method: 'POST' }),
  
  downloadProperty: (id: number, format: 'pdf' | 'excel') => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE}/properties/${id}/download?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin - Properties
  getAdminProperties: () => apiRequest('/admin/properties'),
  
  createProperty: (data: any) =>
    apiRequest('/admin/properties', { method: 'POST', body: JSON.stringify(data) }),
  
  updateProperty: (id: number, data: any) =>
    apiRequest(`/admin/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  deleteProperty: (id: number) =>
    apiRequest(`/admin/properties/${id}`, { method: 'DELETE' }),

  // Admin - Users
  getUsers: () => apiRequest('/admin/users'),
  
  // Admin - Payments
  getPayments: () => apiRequest('/admin/payments'),
  
  // Admin - Token Logs
  getTokenLogs: () => apiRequest('/admin/token-logs'),

  // User Dashboard
  getUnlockedProperties: () => apiRequest('/user/unlocked-properties'),
  
  getTokenTransactions: () => apiRequest('/user/token-transactions'),
  
  updateProfile: (data: { name: string; phone?: string; address?: string }) =>
    apiRequest('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Admin - User Management
  updateUser: (userId: number, data: { name?: string; email?: string; phone?: string; address?: string; tokenBalance?: number; role?: string }) =>
    apiRequest(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Payments
  createPaymentOrder: (data: { amount: number; tokens: number }) =>
    apiRequest('/payments/create-order', { method: 'POST', body: JSON.stringify(data) }),
  
  verifyPayment: (data: any) =>
    apiRequest('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
};
