const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async get(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async post(endpoint, data, isFormData = false) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async patch(endpoint, data) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
