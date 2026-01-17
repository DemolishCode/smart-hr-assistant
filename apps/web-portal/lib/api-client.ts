import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    // We will access the store state directly or use localStorage for simplicity in the interceptor
    // Using a circular import for the store might cause issues, so let's stick to localStorage for the token source of truth for the API client
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('auth-storage'); // Zustand persist default key
      if (storage) {
        try {
          const { state } = JSON.parse(storage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch (e) {
          console.error("Failed to parse auth storage", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to redirect to login or clear store could go here
      console.warn("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);
