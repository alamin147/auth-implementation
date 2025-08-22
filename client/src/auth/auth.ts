// Token storage key
const TOKEN_KEY = 'token';

// Get token from localStorage
export const getUserLocalStorage = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

// Set token in localStorage
export const setUserLocalStorage = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

// Remove token from localStorage
export const removeUserLocalStorage = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getUserLocalStorage();
  return !!token;
};

// Decode JWT token (basic check without validation)
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Get user info from token
export const getUserFromToken = (token: string): any => {
  try {
    const decoded = decodeToken(token);
    return decoded;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// Logout user (clear token and redirect)
export const logout = (): void => {
  removeUserLocalStorage();
  window.location.href = '/signin';
};

// Check authentication status and handle expired tokens
export const checkAuthStatus = (): boolean => {
  const token = getUserLocalStorage();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    removeUserLocalStorage();
    return false;
  }

  return true;
};
