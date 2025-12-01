import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (() => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/api';
})();

console.log(`🔗 API Base URL: ${API_BASE_URL}`);

export const verifyClaim = async (claim) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, { claim });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error.response?.data || { error: 'Network error. Make sure backend is running.' };
  }
};
