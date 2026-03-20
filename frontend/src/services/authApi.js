const API_BASE = 'http://localhost:3000';

// Login
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// Register
export const registerUser = async (username, email, phone, password) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, phone, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// Check auth status (for protected routes)
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Logout
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

