const API_BASE_URL = 'http://localhost:8000';

// Store token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const setUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const removeUserData = () => {
  localStorage.removeItem('userData');
};

// API calls
export const signup = async (email, name, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    setAuthToken(data.access_token);
    
    // Get user data
    const userData = await getCurrentUser(data.access_token);
    setUserData(userData);
    
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (token) => {
  try {
    const authToken = token || getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export const logout = () => {
  removeAuthToken();
  removeUserData();
};