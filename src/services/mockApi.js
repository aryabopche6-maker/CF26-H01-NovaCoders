/**
 * Mock API Client with simulated network delay
 * Architecture designed for seamless replacement with real Axios API calls
 */
export const mockDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiClient = {
  get: async (url, config = {}) => {
    await mockDelay(config.delay || 300);
    return { status: 200, data: null };
  },
  post: async (url, payload, config = {}) => {
    await mockDelay(config.delay || 500);
    return { status: 200, data: payload };
  }
};
