import api from './api.js';

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('api/accounts/login/', {
        email,
        password,
      });

      const { access, refresh, user } = response.data;

      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user, tokens: { access, refresh } };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('api/accounts/logout/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  },

  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.role);
  }
};

export default authService;