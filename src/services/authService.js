import apiClient from './apiClient';

// Demo users for fallback when backend is unreachable
const DEMO_USERS = {
  'admin@demo.com':       { password: 'admin123',      user: { id: 1, name: 'System Administrator', email: 'admin@demo.com',       role: 'ADMIN',            organization: 'FederateHealth Central', title: 'System Admin' } },
  'researcher@demo.com':  { password: 'researcher123', user: { id: 2, name: 'Dr. Sarah Lin',          email: 'researcher@demo.com',  role: 'RESEARCHER',       organization: 'General Hospital',       title: 'Clinical Researcher' } },
  'auditor@demo.com':     { password: 'auditor123',    user: { id: 3, name: 'David Compliance',       email: 'auditor@demo.com',     role: 'AUDITOR',          organization: 'Compliance Office',      title: 'Chief Auditor' } },
  'instadmin@demo.com':   { password: 'instadmin123',  user: { id: 4, name: 'Dr. James Wilson',       email: 'instadmin@demo.com',   role: 'INSTITUTION_ADMIN',organization: 'Metro Health Network',   title: 'Institution Admin' } },
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('federate_health_token', response.token);
      }
      return response;
    } catch (err) {
      // Fallback to demo credentials if backend is unreachable (network error or 500+)
      const isNetworkError = !err.message?.includes('403') && !err.message?.includes('401') && !err.message?.includes('400');
      const demo = DEMO_USERS[email?.toLowerCase()];
      if (isNetworkError && demo && demo.password === password) {
        const mockToken = `mock_demo_${Date.now()}`;
        localStorage.setItem('federate_health_token', mockToken);
        return { user: demo.user, token: mockToken };
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response && response.token) {
        localStorage.setItem('federate_health_token', response.token);
      }
      return response;
    } catch (err) {
      // Fallback: simulate registration when backend unreachable
      const isNetworkError = !err.message?.includes('403') && !err.message?.includes('401') && !err.message?.includes('400') && !err.message?.includes('already');
      if (isNetworkError) {
        const mockUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'RESEARCHER',
          organization: userData.organization || 'Health Research Institute',
          title: userData.title || 'Clinical Researcher',
        };
        const mockToken = `mock_reg_${Date.now()}`;
        localStorage.setItem('federate_health_token', mockToken);
        return { user: mockUser, token: mockToken };
      }
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      return await apiClient.get('/auth/me');
    } catch (error) {
      console.warn('[authService] getCurrentUser failed:', error.message);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('federate_health_token');
    localStorage.removeItem('federate_health_user');
  }
};
