import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "finovix_token";
const USER_KEY = "finovix_user";

// Helper functions for token management
const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore quota errors
  }
};

const getUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore quota errors
  }
};

// Parse JWT token to get expiration time
const parseTokenExpiration = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};

// Check if token is expired or will expire soon (within 5 minutes)
const isTokenExpired = (token) => {
  const expiration = parseTokenExpiration(token);
  if (!expiration) return true;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return now >= (expiration - fiveMinutes);
};

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken();
      if (currentToken && isTokenExpired(currentToken)) {
        logout();
      }
    };

    // Initial check
    checkToken();
    setLoading(false);

    // Check every minute
    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    setTokenState(tokenData);
    setUserState(userData);
    setError(null);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setTokenState(null);
    setUserState(null);
    setError(null);
  };

  const updateProfile = (userData) => {
    setUser(userData);
    setUserState(userData);
  };

  const isAuthenticated = () => {
    return !!token && !isTokenExpired(token);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    token,
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole,
    setError,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}