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

export const transcribeAndAnalyze = async (videoBlob, question) => {
  try {
    const token = getAuthToken();
    console.log('Token from storage:', token ? 'Token exists' : 'NO TOKEN FOUND');
    
    if (!token) {
      throw new Error('Not authenticated. Please login again.');
    }

    const formData = new FormData();
    formData.append('file', videoBlob, 'interview-recording.webm');
    formData.append('question', question);

    console.log('Sending request to /transcribe-and-analyze...');

    const response = await fetch(`${API_BASE_URL}/transcribe-and-analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }

    const data = await response.json();
    return data; // Returns { success, transcript, analysis, user_id }
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};