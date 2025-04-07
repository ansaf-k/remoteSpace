import { defineStore } from 'pinia';
import { directus, passwordRequest, readMe } from '../services/directus';
import { ref } from 'vue';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string;
  status?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const isAuthenticated = ref(false);
  const isInitialized = ref(false);
  const error = ref<string | null>(null);



  // Login 
  async function login(credentials: { email: string; password: string }): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await directus.login(credentials.email, credentials.password);

      if (response?.access_token) {
        isAuthenticated.value = true;
        await fetchCurrentUser();
        return true;
      }

      throw new Error('No access token received');
    } catch (err) {
      console.error('Login failed:', err);
      error.value = err instanceof Error ? err.message : 'Authentication failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Fetch user
  async function fetchCurrentUser() {
    try {
      const token = await directus.getToken();
      isAuthenticated.value = !!token;
      if (!isAuthenticated.value) return null;
      const me = await directus.request(readMe());

      if (me && typeof me === 'object' && 'email' in me) {
        // Set user properties with proper typing
        user.value = me as User;
        console.log(user.value);
        return user.value;
      }

    } catch (err) {
      console.error('Error fetching current user:', err);
      await logout();
    }
  }

  // Forgot password
  async function sendResetRequest(email: string) {
    try {
      await directus.request(passwordRequest(email));
      return true;
    } catch (error) {
      console.error('Reset request failed:', error);
      alert('Failed to send reset request. Please try again.');
      return false;
    }
  }

  // Logout
  async function logout() {
    try {
      await directus.logout();
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    } finally {
      user.value = null;
      isAuthenticated.value = false;
    };
  }

  // Initialize - check if user has a valid token
  async function init(): Promise<void> {
    if (!isInitialized.value) {
      try {
        // Check if we have a valid token
        const token = await directus.getToken();
        isAuthenticated.value = !!token;

        if (isAuthenticated.value) {
          await fetchCurrentUser();
        }
      } catch (err) {
        console.error('Token validation error:', err);
        await logout();
      } finally {
        isInitialized.value = true;
      }
    }
  }


  return {
    user,
    isAuthenticated,
    loading,
    isInitialized,
    error,
    login,
    logout,
    init,
    sendResetRequest,
  };
});
