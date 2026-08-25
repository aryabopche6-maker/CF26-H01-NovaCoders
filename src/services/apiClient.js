import axios from 'axios';

// API Base URL - configured to target Spring Boot backend at http://localhost:8080/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor to dynamically attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('federate_health_token');
    // Only attach token if present and not a mock fallback token
    if (token && !token.startsWith('mock_') && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for centralized error management
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network or Server Error';

    // Handle 401 unauthorized only (token expired or invalid)
    // NOTE: 403 = permission denied, but token is valid — do NOT clear token on 403
    if (error.response?.status === 401) {
      console.warn(`[apiClient] 401 Unauthorized - clearing token.`);
      localStorage.removeItem('federate_health_token');
      localStorage.removeItem('federate_health_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
export { apiClient, API_BASE_URL };
